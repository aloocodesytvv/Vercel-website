import { NextResponse } from 'next/server'
import { ensureSchema, getSql, trackingCode, type ApplicationRow } from '@/lib/db'
import { sendApplicationToDiscord } from '@/lib/discord'
import { cleanApplication, validateApplication } from '@/lib/validation'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const input = cleanApplication(body)
  if (input.website) return NextResponse.json({ ok: true, code: 'FW-RECEIVED' })

  const errors = validateApplication(input)
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 })

  try {
    await ensureSchema()
    const sql = getSql()

    const recent = await sql`SELECT id FROM applications
      WHERE email = ${input.email} AND role = ${input.role} AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1`
    if (recent.length) {
      return NextResponse.json(
        { ok: false, error: 'We already received an application from this email for that role in the last 24 hours.' },
        { status: 409 },
      )
    }

    const code = trackingCode()
    const rows = (await sql`INSERT INTO applications
      (code, role, name, email, discord, age, ign, game_id, server_id, rank, main_heroes, experience, availability, timezone, links, message)
      VALUES (${code}, ${input.role}, ${input.name}, ${input.email}, ${input.discord}, ${Number(input.age)}, ${input.ign}, ${input.gameId},
        ${input.serverId}, ${input.rank}, ${input.mainHeroes}, ${input.experience}, ${input.availability}, ${input.timezone}, ${input.links}, ${input.message})
      RETURNING *`) as ApplicationRow[]

    const saved = rows[0]
    const delivered = await sendApplicationToDiscord(saved)
    if (delivered) await sql`UPDATE applications SET discord_sent = TRUE WHERE id = ${saved.id}`

    return NextResponse.json({ ok: true, code })
  } catch (error) {
    console.error('[applications] failed', error)
    return NextResponse.json({ ok: false, error: 'Something went wrong on our side. Please try again in a moment.' }, { status: 500 })
  }
}
