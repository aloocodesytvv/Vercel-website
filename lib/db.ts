import { neon } from '@neondatabase/serverless'

export type ApplicationRow = {
  id: number
  code: string
  role: string
  name: string
  email: string
  discord: string
  age: number
  ign: string
  game_id: string
  server_id: string
  rank: string
  main_heroes: string
  experience: string
  availability: string
  timezone: string
  links: string
  message: string
  status: string
  rating: number
  admin_notes: string
  public_note: string
  discord_sent: boolean
  created_at: string
  updated_at: string
}

export type MessageRow = {
  id: number
  topic: string
  name: string
  email: string
  organisation: string
  message: string
  status: string
  discord_sent: boolean
  created_at: string
}

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  return neon(url)
}

let ready: Promise<void> | null = null

export function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      const sql = getSql()
      await sql`CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        discord TEXT NOT NULL,
        age INTEGER NOT NULL,
        ign TEXT NOT NULL DEFAULT '',
        game_id TEXT NOT NULL DEFAULT '',
        server_id TEXT NOT NULL DEFAULT '',
        rank TEXT NOT NULL DEFAULT '',
        main_heroes TEXT NOT NULL DEFAULT '',
        experience TEXT NOT NULL,
        availability TEXT NOT NULL,
        timezone TEXT NOT NULL,
        links TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        rating INTEGER NOT NULL DEFAULT 0,
        admin_notes TEXT NOT NULL DEFAULT '',
        public_note TEXT NOT NULL DEFAULT '',
        discord_sent BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
      await sql`CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        topic TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        organisation TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        discord_sent BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
      await sql`CREATE INDEX IF NOT EXISTS applications_created_idx ON applications (created_at DESC)`
    })().catch((error) => {
      ready = null
      throw error
    })
  }
  return ready
}

export function trackingCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return `FW-${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}
