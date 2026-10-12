import { createClient, SupabaseAuthAdapter } from '@neondatabase/neon-js'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL
export const isNeonAuthConfigured = Boolean(
  authUrl && !authUrl.includes('YOUR_NEON_AUTH')
)

export const neon = isNeonAuthConfigured
  ? createClient({
      auth: {
        adapter: SupabaseAuthAdapter(),
        url: authUrl,
      },
    })
  : null
