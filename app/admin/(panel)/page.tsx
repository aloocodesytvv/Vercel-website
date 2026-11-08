import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Download } from 'lucide-react'
import { Rating, timeAgo } from '@/components/admin/helpers'
import { StatusBadge } from '@/components/site/status-badge'
import { ensureSchema, getSql, type ApplicationRow } from '@/lib/db'
import { getRole, roles, statuses } from '@/lib/site'
import { btn } from '@/lib/ui'

export const metadata: Metadata = { title: 'Overview' }

export default async function AdminOverviewPage() {
  await ensureSchema()
  const sql = getSql()
  const [counts, byRole, byStatus, recentRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'new')::int AS fresh,
      COUNT(*) FILTER (WHERE status IN ('shortlisted','trial'))::int AS shortlisted,
      COUNT(*) FILTER (WHERE status = 'accepted')::int AS accepted,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS week
      FROM applications`,
    sql`SELECT role, COUNT(*)::int AS n FROM applications GROUP BY role`,
    sql`SELECT status, COUNT(*)::int AS n FROM applications GROUP BY status`,
    sql`SELECT * FROM applications ORDER BY created_at DESC LIMIT 6`,
  ])
  const recent = recentRows as ApplicationRow[]
  const c = counts[0]
  const roleCounts = new Map(byRole.map((row) => [row.role as string, row.n as number]))
  const statusCounts = new Map(byStatus.map((row) => [row.status as string, row.n as number]))
  const maxRole = Math.max(1, ...roles.map((role) => roleCounts.get(role.id) ?? 0))

  const stats = [
    { label: 'Total applications', value: c.total },
    { label: 'Awaiting review', value: c.fresh, highlight: c.fresh > 0 },
    { label: 'Shortlist / trial', value: c.shortlisted },
    { label: 'Accepted', value: c.accepted },
    { label: 'Last 7 days', value: c.week },
  ]

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Command centre</p>
          <h1 className="display text-5xl text-bone md:text-7xl">Overview</h1>
        </div>
        <a href="/admin/export" className={btn.ghost}>
          <Download className="size-4" />
          Export CSV
        </a>
      </div>

      <dl className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 bg-ink p-5">
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-mute">{stat.label}</dt>
            <dd className={`display text-5xl ${stat.highlight ? 'text-ember' : 'text-bone'}`}>{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="display text-3xl text-bone">Latest applications</h2>
            <Link href="/admin/applications" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-ember hover:text-bone">
              View all <ArrowUpRight className="size-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="border border-dashed border-white/15 p-8 text-sm text-mute">
              No applications yet. When someone applies, it appears here and in your Discord channel.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-white/10 border border-white/10 bg-panel">
              {recent.map((app) => (
                <li key={app.id}>
                  <Link href={`/admin/applications/${app.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-panel-2">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-semibold text-bone">{app.name}</span>
                      <span className="text-xs text-mute">
                        {getRole(app.role)?.name ?? app.role} / {timeAgo(app.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Rating value={app.rating} className="hidden sm:inline-flex" />
                      <StatusBadge status={app.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-4">
            <h2 className="display text-3xl text-bone">By role</h2>
            <ul className="flex flex-col gap-3">
              {roles.map((role) => {
                const n = roleCounts.get(role.id) ?? 0
                return (
                  <li key={role.id} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-bone">{role.name}</span>
                      <span className="text-mute">{n}</span>
                    </div>
                    <div className="h-1.5 bg-white/10">
                      <div className="h-full bg-ember" style={{ width: `${(n / maxRole) * 100}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="display text-3xl text-bone">Pipeline</h2>
            <ul className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <li key={status.value}>
                  <Link href={`/admin/applications?status=${status.value}`} className="flex items-center gap-2 bg-panel px-3 py-2 transition-colors hover:bg-panel-2">
                    <StatusBadge status={status.value} className="px-0 ring-0 bg-transparent" />
                    <span className="font-mono text-sm text-bone">{statusCounts.get(status.value) ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
