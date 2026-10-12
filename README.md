# Glossy Home Property Manager

A responsive React + Vite property-management app with the existing Glossy Home UI preserved, Neon Auth for email/password authentication, and Neon PostgreSQL accessed **only through a server-side Express API**.

## What's included

- Neon Auth integration using the current `@neondatabase/neon-js` SDK and its Supabase-compatible auth adapter
- Existing sign-in/sign-up screen and workspace UI retained
- Express API for properties, tenants and bills/expenses
- Server-side JWT signature verification using Neon Auth JWKS
- Owner-scoped reads, inserts and deletes; owner ID always comes from the verified token, never request input
- Neon PostgreSQL schema and GitHub Actions build workflow
- Render deployment template
- No database URL or database password in browser/Vite variables

## Architecture

```text
React + Vite
  ├─ Neon Auth SDK → Neon Auth (sign-in/sign-up/session)
  └─ /api/* + Bearer access token → Express API
                                    ├─ verifies Neon Auth JWT via JWKS
                                    └─ PostgreSQL connection (server-only) → Neon
```

Neon Auth is a managed auth service built on Better Auth and is supported by the current Neon JS SDK. The app uses the Neon SDK's Supabase-compatible auth adapter to keep the existing login screen integration small. Database CRUD does not use the browser SDK or Neon Data API; it goes through Express.

## 1. Create and configure Neon

1. Create a Neon project and select the branch/database you intend to use.
2. In the Neon Console, open **Auth** and enable Neon Auth for that branch. Configure email/password sign-in and email verification as desired.
3. Copy the branch's Neon Auth URL from the console.
4. In **Connect**, copy the pooled PostgreSQL connection string (the host usually includes `-pooler`). Keep it server-only.
5. Open the Neon SQL Editor and run `neon-schema.sql`.

> Existing Supabase users/passwords are not automatically moved by changing providers. New accounts can sign up through Neon Auth. Existing users generally need an explicit migration plan or password reset.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` for local development.

```env
VITE_NEON_AUTH_URL=https://YOUR_NEON_AUTH_ENDPOINT
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-POOLER-HOST/DB?sslmode=require
NEON_AUTH_URL=https://YOUR_NEON_AUTH_ENDPOINT
APP_ORIGIN=http://localhost:5173
PORT=3001
NODE_ENV=development
```

- `VITE_NEON_AUTH_URL` is the public Neon Auth endpoint used by the browser auth SDK. It is not a database credential.
- `DATABASE_URL` must remain server-side. Do **not** prefix it with `VITE_`, commit it, or paste it into frontend code.
- `NEON_AUTH_URL` is used by the API to derive the JWKS URL. If your Auth endpoint's JWKS path differs, set `NEON_AUTH_JWKS_URL` explicitly (for example, the Auth service's `/.well-known/jwks.json` endpoint).
- If your deployment requires explicit issuer/audience validation, set `NEON_AUTH_ISSUER` and/or `NEON_AUTH_AUDIENCE` to the exact values documented for your Neon Auth endpoint.
- Set `APP_ORIGIN` to the exact origin of your deployed web app (no trailing slash).

Never commit `.env.local` or any real connection string, Neon API key, or database password.

## 3. Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Vite starts the UI (normally `http://localhost:5173`) and proxies `/api` to Express on port 3001.

```bash
npm run check
npm run build
npm start
```

In production, Express serves the built `dist/` directory and the API from the same origin.

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Migrate Glossy Home to Neon"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

GitHub Actions builds the app on pushes and pull requests. Add real values only in your hosting provider's environment-variable settings, not in the repository.

## 5. Deploy on Render

1. Create a new Web Service from the GitHub repository.
2. Render detects `render.yaml`. Set `DATABASE_URL`, `NEON_AUTH_URL`, `NEON_AUTH_JWKS_URL` (if needed), and `APP_ORIGIN` in the service's environment settings.
3. Set `VITE_NEON_AUTH_URL` as a build-time environment variable in Render as well, so Vite embeds the public Auth URL in the frontend bundle. It is safe to expose the Auth endpoint, but not the database connection string.
4. Deploy, then add the deployed origin to Neon Auth's allowed/trusted origins in the Neon Console.

## Security notes

- The Express API validates Neon Auth JWT signatures using the Auth JWKS before every data operation.
- SQL queries are parameterized. Table names are allow-listed.
- All list/delete queries include both the authenticated owner's ID and the target resource; create operations derive `owner_id` from the verified token.
- Keep the Neon database role used by `DATABASE_URL` limited to the permissions the app needs.
- Demo mode is in-memory only and is not persistent.
- The source includes no real credentials. Build/test against your actual Neon Auth project before production launch.
