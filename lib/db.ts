import { neon } from '@neondatabase/serverless'

export type ApplicationRow = {
  id: number
  code: string
  track: string
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
  staff_role: string
  portfolio: string
  tools: string
  hours: string
  past_teams: string
  pitch: string
  flex_lane: string
  shotcalling: string
  trial_day: string
  trial_time: string
  gender: string
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

export type BoardPostRow = {
  id: number
  category: string
  post_type: string
  org_name: string
  title: string
  detail: string
  role_needed: string
  rank: string
  speciality: string
  experience: string
  languages: string
  sells: string
  buy_how: string
  instagram: string
  contact_type: string
  contact_value: string
  owner_added: boolean
  logo: string
  banner: string
  featured_days: number
  featured_until: string | null
  status: string
  discord_sent: boolean
  created_at: string
  updated_at: string
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
        track TEXT NOT NULL DEFAULT 'player',
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
        staff_role TEXT NOT NULL DEFAULT '',
        portfolio TEXT NOT NULL DEFAULT '',
        tools TEXT NOT NULL DEFAULT '',
        hours TEXT NOT NULL DEFAULT '',
        past_teams TEXT NOT NULL DEFAULT '',
        pitch TEXT NOT NULL DEFAULT '',
        flex_lane TEXT NOT NULL DEFAULT '',
        shotcalling TEXT NOT NULL DEFAULT '',
        trial_day TEXT NOT NULL DEFAULT '',
        trial_time TEXT NOT NULL DEFAULT '',
        gender TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'new',
        rating INTEGER NOT NULL DEFAULT 0,
        admin_notes TEXT NOT NULL DEFAULT '',
        public_note TEXT NOT NULL DEFAULT '',
        discord_sent BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
      // Backfill for databases created before the Ashen Wings split.
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS track TEXT NOT NULL DEFAULT 'player'`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS staff_role TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS portfolio TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS tools TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS hours TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS past_teams TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS pitch TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS flex_lane TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS shotcalling TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS trial_day TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS trial_time TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT ''`
      await sql`UPDATE applications SET track = 'staff' WHERE track = 'player' AND code LIKE 'AW-S-%'`
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
      await sql`CREATE TABLE IF NOT EXISTS board_posts (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL,
        post_type TEXT NOT NULL DEFAULT 'requirement',
        org_name TEXT NOT NULL,
        title TEXT NOT NULL,
        detail TEXT NOT NULL DEFAULT '',
        role_needed TEXT NOT NULL DEFAULT '',
        rank TEXT NOT NULL DEFAULT '',
        speciality TEXT NOT NULL DEFAULT '',
        experience TEXT NOT NULL DEFAULT '',
        languages TEXT NOT NULL DEFAULT '',
        sells TEXT NOT NULL DEFAULT '',
        buy_how TEXT NOT NULL DEFAULT '',
        instagram TEXT NOT NULL DEFAULT '',
        contact_type TEXT NOT NULL DEFAULT 'instagram',
        contact_value TEXT NOT NULL DEFAULT '',
        owner_added BOOLEAN NOT NULL DEFAULT FALSE,
        logo TEXT NOT NULL DEFAULT '',
        banner TEXT NOT NULL DEFAULT '',
        featured_days INTEGER NOT NULL DEFAULT 0,
        featured_until TIMESTAMPTZ,
        status TEXT NOT NULL DEFAULT 'pending',
        discord_sent BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
      await sql`CREATE INDEX IF NOT EXISTS board_posts_status_idx ON board_posts (status, created_at DESC)`
      // Backfill for boards created before contact methods / owner posts.
      await sql`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS contact_type TEXT NOT NULL DEFAULT 'instagram'`
      await sql`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS contact_value TEXT NOT NULL DEFAULT ''`
      await sql`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS owner_added BOOLEAN NOT NULL DEFAULT FALSE`
      // Backfill for boards created before post types (promote vs requirement).
      await sql`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS post_type TEXT NOT NULL DEFAULT 'requirement'`
      // Backfill for boards created before featured auto-expiry (2026-11-23).
      // Existing rows keep featured_until NULL, which the featured rule treats
      // as still featured while featured_days > 0.
      await sql`ALTER TABLE board_posts ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ`
    })().catch((error) => {
      ready = null
      throw error
    })
  }
  return ready
}

export function trackingCode(track: 'player' | 'staff' = 'player') {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  const prefix = track === 'staff' ? 'AW-S-' : 'AW-P-'
  return `${prefix}${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}
