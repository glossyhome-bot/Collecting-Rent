-- Glossy Home Property Manager — Neon PostgreSQL schema
-- Run in Neon SQL Editor. Neon Auth must be enabled for the same branch/database.
-- All application table access goes through the Node API; never expose DATABASE_URL to Vite.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL,
  name text NOT NULL,
  location text,
  units integer NOT NULL DEFAULT 0 CHECK (units >= 0),
  occupied integer NOT NULL DEFAULT 0 CHECK (occupied >= 0 AND occupied <= units),
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL,
  name text NOT NULL,
  email text,
  room text,
  property text,
  rent numeric(12,2) NOT NULL DEFAULT 0 CHECK (rent >= 0),
  due text,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Utilities',
  property text,
  amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  date text,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS properties_owner_created_idx ON public.properties(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS tenants_owner_created_idx ON public.tenants(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bills_owner_created_idx ON public.bills(owner_id, created_at DESC);

-- Optional defense-in-depth if you later enable Neon Data API/RLS. The app currently uses
-- the server-only DATABASE_URL and applies owner_id filters in every API query.
