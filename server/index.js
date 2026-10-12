import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { Pool } = pg
const app = express()
const port = Number(process.env.PORT || 3001)
const isProduction = process.env.NODE_ENV === 'production'
const appOrigin = process.env.APP_ORIGIN || 'http://localhost:5173'

if (!process.env.DATABASE_URL) {
  console.warn('[config] DATABASE_URL is missing. Database routes will return a configuration error.')
}
if (!process.env.NEON_AUTH_URL && !process.env.NEON_AUTH_JWKS_URL) {
  console.warn('[config] Set NEON_AUTH_URL (or NEON_AUTH_JWKS_URL) to validate Neon Auth access tokens.')
}

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: true },
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    })
  : null

const jwksUrl = process.env.NEON_AUTH_JWKS_URL ||
  (process.env.NEON_AUTH_URL ? `${process.env.NEON_AUTH_URL.replace(/\/+$/, '')}/.well-known/jwks.json` : null)
const jwks = jwksUrl ? createRemoteJWKSet(new URL(jwksUrl)) : null

app.disable('x-powered-by')
app.use(cors({
  origin(origin, callback) {
    // No Origin is normal for CLI/health checks. Browser origins must match the configured app origin.
    if (!origin || origin === appOrigin || (!isProduction && /^http:\/\/localhost:\d+$/.test(origin))) {
      return callback(null, true)
    }
    return callback(new Error('Origin is not allowed by CORS.'))
  },
  credentials: false,
}))
app.use(express.json({ limit: '100kb' }))

const tables = {
  properties: {
    select: 'id, name, location, units, occupied, status, created_at',
    insertFields: ['name', 'location', 'units', 'occupied', 'status'],
    required: ['name'],
    numeric: ['units', 'occupied'],
  },
  tenants: {
    select: 'id, name, email, room, property, rent, due, status, created_at',
    insertFields: ['name', 'email', 'room', 'property', 'rent', 'due', 'status'],
    required: ['name'],
    numeric: ['rent'],
  },
  bills: {
    select: 'id, title, category, property, amount, date, status, created_at',
    insertFields: ['title', 'category', 'property', 'amount', 'date', 'status'],
    required: ['title'],
    numeric: ['amount'],
  },
}
const validTable = (name) => Object.hasOwn(tables, name)

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

async function requireUser(req, res, next) {
  try {
    if (!jwks) return res.status(503).json({ error: 'Neon Auth is not configured on the server.' })
    const authorization = req.headers.authorization || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Sign in to continue.' })

    // Verify signature, expiration and standard claims. The subject is the only owner identifier used by SQL.
    const verifyOptions = {}
    if (process.env.NEON_AUTH_ISSUER) verifyOptions.issuer = process.env.NEON_AUTH_ISSUER
    if (process.env.NEON_AUTH_AUDIENCE) verifyOptions.audience = process.env.NEON_AUTH_AUDIENCE
    const { payload } = await jwtVerify(token, jwks, verifyOptions)
    if (typeof payload.sub !== 'string' || !payload.sub) {
      return res.status(401).json({ error: 'Invalid authentication token.' })
    }
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or expired. Please sign in again.' })
  }
}

function requireDatabase(req, res, next) {
  if (!pool) return res.status(503).json({ error: 'Database is not configured. Set DATABASE_URL on the server.' })
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'glossy-home-api' })
})

app.get('/api/:table', requireUser, requireDatabase, asyncRoute(async (req, res) => {
  const table = req.params.table
  if (!validTable(table)) return res.status(404).json({ error: 'Resource not found.' })
  const result = await pool.query(
    `SELECT ${tables[table].select} FROM public.${table} WHERE owner_id = $1 ORDER BY created_at DESC`,
    [req.userId],
  )
  res.json(result.rows)
}))

app.post('/api/:table', requireUser, requireDatabase, asyncRoute(async (req, res) => {
  const table = req.params.table
  if (!validTable(table)) return res.status(404).json({ error: 'Resource not found.' })
  const config = tables[table]
  const body = req.body && typeof req.body === 'object' ? req.body : {}
  for (const key of config.required) {
    if (typeof body[key] !== 'string' || !body[key].trim()) {
      return res.status(400).json({ error: `${key} is required.` })
    }
  }

  const record = {}
  for (const key of config.insertFields) {
    if (body[key] !== undefined) record[key] = body[key]
  }
  for (const key of config.numeric) {
    if (record[key] === '' || record[key] === null || record[key] === undefined) record[key] = 0
    record[key] = Number(record[key])
    if (!Number.isFinite(record[key]) || record[key] < 0) {
      return res.status(400).json({ error: `${key} must be a non-negative number.` })
    }
  }
  if (table === 'properties' && Number(record.occupied || 0) > Number(record.units || 0)) {
    return res.status(400).json({ error: 'Occupied units cannot exceed total units.' })
  }

  const columns = [...Object.keys(record), 'owner_id']
  const values = [...Object.values(record), req.userId]
  const placeholders = values.map((_, index) => `$${index + 1}`)
  const result = await pool.query(
    `INSERT INTO public.${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING ${config.select}`,
    values,
  )
  res.status(201).json(result.rows[0])
}))

app.delete('/api/:table/:id', requireUser, requireDatabase, asyncRoute(async (req, res) => {
  const table = req.params.table
  if (!validTable(table)) return res.status(404).json({ error: 'Resource not found.' })
  const result = await pool.query(
    `DELETE FROM public.${table} WHERE id = $1 AND owner_id = $2 RETURNING id`,
    [req.params.id, req.userId],
  )
  if (!result.rowCount) return res.status(404).json({ error: 'Record not found.' })
  res.json({ ok: true, id: result.rows[0].id })
}))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
if (isProduction) {
  app.use(express.static(distDir, { index: false, maxAge: '1h' }))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.use((err, _req, res, _next) => {
  if (err?.message === 'Origin is not allowed by CORS.') {
    return res.status(403).json({ error: err.message })
  }
  if (err?.code === '23514') return res.status(400).json({ error: 'The record does not satisfy a database constraint.' })
  if (err?.code === '23503') return res.status(400).json({ error: 'The selected related record does not exist.' })
  console.error('[api]', err?.message || err)
  res.status(500).json({ error: 'An unexpected server error occurred.' })
})

const server = app.listen(port, () => {
  console.log(`Glossy Home API listening on port ${port}`)
})
async function shutdown() {
  server.close()
  if (pool) await pool.end().catch(() => {})
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
