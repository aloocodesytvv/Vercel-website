import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, Search } from 'lucide-react'
import { DiscordDot, Rating, timeAgo } from '@/components/admin/helpers'
import { StatusBadge } from '@/components/site/status-badge'
import { ensureSchema, getSql, type ApplicationRow } from '@/lib/db'
import { getRole, roles, statuses } from '@/lib/site'
import { btn } from '@/lib/ui'

export const metadata: Metadata = { title: 'Applications' }

type Params = { status?: string; role?: string; q?: string }

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { status = '', role = '', q = '' } = await searchParams
  const term = `%${q.trim()}%`
  await ensureSchema()
  const rows = (await getSql()`SELECT * FROM applications
    WHERE (${status} = '' OR status = ${status})
      AND (${role} = '' OR role = ${role})
      AND (${q.trim()} = '' OR name ILIKE ${term} OR email ILIKE ${term} OR discord ILIKE ${term} OR ign ILIKE ${term} OR code ILIKE ${term})
    ORDER BY created_at DESC LIMIT 200`) as ApplicationRow[]

  const exportQuery = new URLSearchParams(Object.entries({ status, role, q }).filter(([, value]) => value)).toString()
  const filtered = Boolean(status || role || q)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">{rows.length} result{rows.length === 1 ? '' : 's'}</p>
          <h1 className="display text-5xl text-bone md:text-7xl">Applications</h1>
        </div>
        <a href={`/admin/export${exportQuery ? `?${exportQuery}` : ''}`} className={btn.ghost}>
          <Download className="size-4" />
          Export CSV
        </a>
      </div>

      <form className="grid gap-3 border border-white/10 bg-panel p-4 md:grid-cols-[1fr_12rem_12rem_auto]">
        <label className="relative block">
          <span className="sr-only">Search applications</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input name="q" defaultValue={q} placeholder="Search name, email, Discord, IGN or code" className="field pl-10" />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select name="status" defaultValue={status} className="field">
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Role</span>
          <select name="role" defaultValue={role} className="field">
            <option value="">All roles</option>
            {roles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button type="submit" className={btn.primary}>
            Filter
          </button>
          {filtered && (
            <Link href="/admin/applications" className={btn.ghost}>
              Clear
            </Link>
          )}
        </div>
      </form>

      {rows.length === 0 ? (
        <p className="border border-dashed border-white/15 p-10 text-center text-sm text-mute">
          {filtered ? 'No applications match those filters.' : 'No applications yet. They will appear here the moment someone applies.'}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-white/10 border border-white/10 bg-panel">
          {rows.map((app) => (
            <li key={app.id}>
              <Link
                href={`/admin/applications/${app.id}`}
                className="grid gap-3 p-4 transition-colors hover:bg-panel-2 md:grid-cols-[1.4fr_1fr_9rem_8rem_8rem] md:items-center md:gap-6 md:px-6"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-semibold text-bone">{app.name}</span>
                    {app.status === 'new' && <span className="size-2 shrink-0 rounded-full bg-ember" aria-label="New" />}
                  </span>
                  <span className="truncate text-xs text-mute">
                    {app.discord} / {app.code}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 text-sm">
                  <span className="text-bone/85">{getRole(app.role)?.name ?? app.role}</span>
                  <span className="text-xs text-mute">{app.rank || 'No rank'}</span>
                </div>
                <div>
                  <StatusBadge status={app.status} />
                </div>
                <Rating value={app.rating} />
                <div className="flex flex-col gap-1 md:items-end">
                  <span className="text-xs text-mute">{timeAgo(app.created_at)}</span>
                  <DiscordDot sent={app.discord_sent} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
