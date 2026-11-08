import { NextResponse } from 'next/server'
import { ensureSchema, getSql } from '@/lib/db'
import { getRole, getStatus } from '@/lib/site'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const code = String(body.code ?? '').trim().toUpperCase()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!code || !email) return NextResponse.json({ ok: false, error: 'Enter your tracking code and email.' }, { status: 400 })

  try {
    await ensureSchema()
    const rows = await getSql()`SELECT role, status, public_note, created_at, updated_at FROM applications
      WHERE code = ${code} AND email = ${email} LIMIT 1`
    if (!rows.length) {
      return NextResponse.json({ ok: false, error: 'No application matches that code and email.' }, { status: 404 })
    }
    const row = rows[0]
    const status = getStatus(row.status)
    return NextResponse.json({
      ok: true,
      role: getRole(row.role)?.name ?? row.role,
      status: status.value,
      label: status.label,
      message: status.publicText,
      note: row.public_note || null,
      submitted: row.created_at,
      updated: row.updated_at,
    })
  } catch (error) {
    console.error('[status] failed', error)
    return NextResponse.json({ ok: false, error: 'Could not check status right now.' }, { status: 500 })
  }
}
