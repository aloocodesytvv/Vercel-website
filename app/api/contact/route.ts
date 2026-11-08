import { NextResponse } from 'next/server'
import { ensureSchema, getSql, type MessageRow } from '@/lib/db'
import { sendMessageToDiscord } from '@/lib/discord'
import { cleanContact, validateContact } from '@/lib/validation'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })

  const input = cleanContact(body)
  if (input.website) return NextResponse.json({ ok: true })

  const errors = validateContact(input)
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 })

  try {
    await ensureSchema()
    const sql = getSql()
    const recent = await sql`SELECT COUNT(*)::int AS total FROM contact_messages
      WHERE email = ${input.email} AND created_at > NOW() - INTERVAL '1 hour'`
    if (recent[0].total >= 3) {
      return NextResponse.json({ ok: false, error: 'You have sent several messages recently. Please wait a little before sending another.' }, { status: 429 })
    }

    const rows = (await sql`INSERT INTO contact_messages (topic, name, email, organisation, message)
      VALUES (${input.topic}, ${input.name}, ${input.email}, ${input.organisation}, ${input.message}) RETURNING *`) as MessageRow[]
    const saved = rows[0]
    if (await sendMessageToDiscord(saved)) await sql`UPDATE contact_messages SET discord_sent = TRUE WHERE id = ${saved.id}`

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[contact] failed', error)
    return NextResponse.json({ ok: false, error: 'Something went wrong on our side. Please try again.' }, { status: 500 })
  }
}
