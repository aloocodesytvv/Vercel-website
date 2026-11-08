import { isAdmin } from '@/lib/auth'
import { ensureSchema, getSql, type ApplicationRow } from '@/lib/db'

export const dynamic = 'force-dynamic'

const columns: [string, (row: ApplicationRow) => string | number][] = [
  ['Code', (r) => r.code],
  ['Submitted', (r) => r.created_at],
  ['Status', (r) => r.status],
  ['Rating', (r) => r.rating],
  ['Role', (r) => r.role],
  ['Name', (r) => r.name],
  ['Email', (r) => r.email],
  ['Discord', (r) => r.discord],
  ['Age', (r) => r.age],
  ['IGN', (r) => r.ign],
  ['Game ID', (r) => r.game_id],
  ['Server ID', (r) => r.server_id],
  ['Rank', (r) => r.rank],
  ['Main heroes', (r) => r.main_heroes],
  ['Experience', (r) => r.experience],
  ['Availability', (r) => r.availability],
  ['Timezone', (r) => r.timezone],
  ['Links', (r) => r.links],
  ['Message', (r) => r.message],
  ['Admin notes', (r) => r.admin_notes],
]

const escape = (value: string | number) => {
  let text = String(value ?? '')
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response('Unauthorised', { status: 401 })

  const url = new URL(request.url)
  const status = url.searchParams.get('status') ?? ''
  const role = url.searchParams.get('role') ?? ''
  const q = (url.searchParams.get('q') ?? '').trim()
  const term = `%${q}%`

  await ensureSchema()
  const rows = (await getSql()`SELECT * FROM applications
    WHERE (${status} = '' OR status = ${status})
      AND (${role} = '' OR role = ${role})
      AND (${q} = '' OR name ILIKE ${term} OR email ILIKE ${term} OR discord ILIKE ${term} OR ign ILIKE ${term} OR code ILIKE ${term})
    ORDER BY created_at DESC`) as ApplicationRow[]

  const lines = [columns.map(([header]) => escape(header)).join(',')]
  for (const row of rows) lines.push(columns.map(([, pick]) => escape(pick(row))).join(','))

  return new Response(`\uFEFF${lines.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fnatic-wolf-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
