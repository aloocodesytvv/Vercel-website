import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, ExternalLink, Trash2 } from 'lucide-react'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { DiscordDot, fullDate } from '@/components/admin/helpers'
import { StatusBadge } from '@/components/site/status-badge'
import { deleteApplicationAction, updateApplicationAction } from '@/lib/actions'
import { ensureSchema, getSql, type ApplicationRow } from '@/lib/db'
import { experienceLevels, getRole, statuses } from '@/lib/site'
import { btn } from '@/lib/ui'

export const metadata: Metadata = { title: 'Application' }

const quickActions = ['reviewing', 'shortlisted', 'trial', 'accepted', 'waitlist', 'declined'] as const

const urlPattern = /(https?:\/\/[^\s]+)/g

function LinkedText({ text }: { text: string }) {
  return (
    <>
      {text.split(urlPattern).map((part, index) =>
        /^https?:\/\//.test(part) ? (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 break-all text-ember underline-offset-4 hover:underline">
            {part}
            <ExternalLink className="size-3 shrink-0" />
          </a>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) notFound()

  await ensureSchema()
  const rows = (await getSql()`SELECT * FROM applications WHERE id = ${numericId} LIMIT 1`) as ApplicationRow[]
  const app = rows[0]
  if (!app) notFound()

  const isStaff = app.track === 'staff'
  const role = getRole(isStaff ? app.staff_role || app.role : app.role)
  const experience = experienceLevels.find((level) => level.value === app.experience)?.label ?? app.experience

  const fields: { label: string; value: string }[] = isStaff
    ? [
        { label: 'Track', value: 'Staff & Creators' },
        { label: 'Email', value: app.email },
        { label: 'Discord', value: app.discord },
        { label: 'Age', value: String(app.age) },
        { label: 'Timezone', value: app.timezone },
        { label: 'Experience', value: experience },
        { label: 'Portfolio', value: app.portfolio || '-' },
        { label: 'Tools & skills', value: app.tools || '-' },
        { label: 'Weekly hours', value: app.hours || '-' },
        { label: 'Past teams', value: app.past_teams || '-' },
        { label: 'Availability', value: app.availability },
      ]
    : [
        { label: 'Track', value: 'Player' },
        { label: 'Email', value: app.email },
        { label: 'Discord', value: app.discord },
        { label: 'Age', value: String(app.age) },
        { label: 'Timezone', value: app.timezone },
        { label: 'In-game name', value: app.ign || '-' },
        { label: 'Rank', value: app.rank || '-' },
        { label: 'Game ID', value: app.game_id ? `${app.game_id} (${app.server_id})` : '-' },
        { label: 'Experience', value: experience },
        { label: 'Main heroes', value: app.main_heroes || '-' },
        { label: 'Flex lane', value: app.flex_lane || '-' },
        { label: 'Shot-calling', value: app.shotcalling || '-' },
        { label: 'Availability', value: app.availability },
      ]

  return (
    <div className="flex flex-col gap-8">
      <Link href="/admin/applications" className="flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute hover:text-bone">
        <ArrowLeft className="size-4" />
        All applications
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={app.status} />
            <DiscordDot sent={app.discord_sent} />
          </div>
          <h1 className="display text-5xl text-bone md:text-7xl">{app.name}</h1>
          <p className="text-sm text-mute">
            {role?.name ?? app.role} / <span className="font-mono text-bone/80">{app.code}</span> / applied {fullDate(app.created_at)}
          </p>
        </div>
      </header>

      {saved && (
        <p role="status" className="flex items-center gap-2 border-l-2 border-emerald-400 bg-emerald-400/10 p-3 text-sm text-emerald-300">
          <Check className="size-4" />
          Changes saved.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <dl className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-1 bg-panel p-4">
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ember">{field.label}</dt>
                <dd className="break-words text-sm text-bone/90">{field.value}</dd>
              </div>
            ))}
          </dl>

          <section className="flex flex-col gap-3 border border-white/10 bg-panel p-6">
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember">Their story</h2>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-bone/90">{app.message}</p>
          </section>

          {isStaff && app.pitch && (
            <section className="flex flex-col gap-3 border border-gold/30 bg-gold/5 p-6">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-gold">First idea</h2>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-bone/90">{app.pitch}</p>
            </section>
          )}

          {app.links && (
            <section className="flex flex-col gap-3 border border-white/10 bg-panel p-6">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember">Links</h2>
              <p className="whitespace-pre-wrap break-words text-sm leading-loose text-bone/90">
                <LinkedText text={app.links} />
              </p>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-32">
          <form action={updateApplicationAction} className="flex flex-col gap-5 border border-white/10 bg-panel p-6">
            <input type="hidden" name="id" value={app.id} />
            <h2 className="display text-3xl text-bone">Review</h2>

            <div className="flex flex-wrap gap-2">
              {quickActions.map((value) => (
                <button
                  key={value}
                  type="submit"
                  name="quick"
                  value={value}
                  className="bg-white/10 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-widest text-bone transition-colors hover:bg-ember hover:text-ink"
                >
                  {statuses.find((item) => item.value === value)?.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.18em] text-bone">
                Status
                <select name="status" defaultValue={app.status} className="field">
                  {statuses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.18em] text-bone">
                Rating
                <select name="rating" defaultValue={app.rating} className="field">
                  <option value={0}>Unrated</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.18em] text-bone">
              Private notes
              <textarea name="adminNotes" defaultValue={app.admin_notes} rows={5} placeholder="Only admins see this" className="field resize-y font-normal normal-case tracking-normal" />
            </label>

            <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.18em] text-bone">
              Note to applicant
              <textarea
                name="publicNote"
                defaultValue={app.public_note}
                rows={3}
                maxLength={600}
                placeholder="Shown on their status page"
                className="field resize-y font-normal normal-case tracking-normal"
              />
            </label>

            <button type="submit" className={btn.primary}>
              Save changes
            </button>
          </form>

          <form action={deleteApplicationAction} className="flex justify-end">
            <input type="hidden" name="id" value={app.id} />
            <ConfirmButton
              message="Delete this application permanently? This cannot be undone."
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300"
            >
              <Trash2 className="size-4" />
              Delete application
            </ConfirmButton>
          </form>
        </aside>
      </div>
    </div>
  )
}
