import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { timeAgo } from '@/components/admin/helpers'
import { boardDurationLabel, getBoardCategory, getBoardContactMethod } from '@/lib/site'
import { deleteBoardPostAction, setBoardPostFeaturedAction, setBoardPostStatusAction } from '@/lib/actions'
import { ensureSchema, getSql, type BoardPostRow } from '@/lib/db'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Board posts' }

const statusTone: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 ring-amber-400/40',
  approved: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40',
  declined: 'bg-red-500/15 text-red-300 ring-red-400/40',
}

export default async function AdminBoardPage({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  const { added } = await searchParams
  await ensureSchema()
  const sql = getSql()
  const rows = (await sql`SELECT * FROM board_posts
    ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, created_at DESC
    LIMIT 200`) as BoardPostRow[]
  const pending = rows.filter((row) => row.status === 'pending').length
  const live = rows.filter((row) => row.status === 'approved').length
  const featured = rows.filter((row) => row.status === 'approved' && row.featured_days > 0).length
  const declined = rows.filter((row) => row.status === 'declined').length

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">
            {pending} awaiting review · {featured} featured · {live} live · {declined} declined · {rows.length} total
          </p>
          <h1 className="display text-5xl text-bone md:text-7xl">Board posts</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-mute">
            Nothing goes live on the board or the landing slider until you approve it here. Approved posts show immediately;
            declined posts stay hidden. You can also add a featured post yourself — free, live straight away — or change how
            long a live post stays featured.
          </p>
        </div>
        <Link href="/admin/board/new" className={btn.primary}>
          + Add featured post
        </Link>
      </div>

      {added && (
        <p role="status" className="border-l-2 border-gold bg-gold/10 p-4 text-sm text-gold">
          Featured post added — it is live on the board and the landing page now, in gold.
        </p>
      )}

      {rows.length === 0 ? (
        <p className="border border-dashed border-white/15 p-8 text-sm text-mute">
          No board posts yet. When someone submits the board form, it appears here and in your Discord channel.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((post) => {
            const category = getBoardCategory(post.category)
            const contactMethod = getBoardContactMethod(post.contact_type || 'instagram')
            const contactValue = post.contact_value || post.instagram
            const specifics = [
              post.role_needed ? `Role: ${post.role_needed}` : '',
              post.rank ? `Rank: ${post.rank}` : '',
              post.speciality ? `Focus: ${post.speciality}` : '',
              post.languages ? `Languages: ${post.languages}` : '',
              post.sells ? `Sells: ${post.sells}` : '',
              post.buy_how ? `How to buy: ${post.buy_how}` : '',
              post.experience ? `Experience: ${post.experience}` : '',
            ]
              .filter(Boolean)
              .join('  ·  ')
            return (
              <li key={post.id} className="flex flex-col gap-4 border border-white/10 bg-panel p-5 md:flex-row md:gap-6">
                <div className="relative h-20 w-full shrink-0 overflow-hidden md:w-48">
                  <Image src={post.banner} alt="" fill sizes="12rem" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] ring-1 ring-inset',
                        statusTone[post.status] ?? statusTone.pending,
                      )}
                    >
                      {post.status}
                    </span>
                    <span className="bg-white/5 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-bone/80">
                      {category?.label ?? post.category}
                    </span>
                    <span className="bg-white/5 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-bone/80">
                      {post.post_type === 'promote' ? 'Promote' : 'Requirement'}
                    </span>
                    <span className="bg-gold/15 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-gold">
                      {boardDurationLabel(post.featured_days, post.owner_added)}
                    </span>
                    {post.owner_added && (
                      <span className="bg-ember/15 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ember">
                        Added by you
                      </span>
                    )}
                    <span className="text-xs text-mute">{timeAgo(post.created_at)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-bone">
                      {post.org_name} <span className="font-normal text-mute">— {post.title}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-mute">{post.detail}</p>
                    {specifics && <p className="mt-1 text-xs text-mute">{specifics}</p>}
                    <p className="mt-1 text-xs text-mute">
                      {contactMethod.label}: {contactValue || '—'}
                    </p>
                  </div>
                  <form action={setBoardPostFeaturedAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={post.id} />
                    <label htmlFor={`featured-${post.id}`} className="text-xs font-bold uppercase tracking-[0.15em] text-mute">
                      Featuring
                    </label>
                    <select
                      id={`featured-${post.id}`}
                      name="featuredDays"
                      defaultValue={post.featured_days}
                      className="border border-white/15 bg-panel px-3 py-2 text-xs font-bold text-bone"
                    >
                      <option value={0}>Not featured</option>
                      {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                        <option key={days} value={days}>
                          {days} day{days === 1 ? '' : 's'}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className={cn(btn.ghost, 'px-4 py-2 text-xs')}>
                      Save
                    </button>
                  </form>
                </div>
                <div className="flex shrink-0 flex-row flex-wrap gap-2 md:flex-col">
                  {post.status !== 'approved' && (
                    <form action={setBoardPostStatusAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button type="submit" className={cn(btn.primary, 'px-4 py-2.5 text-xs')}>
                        Approve
                      </button>
                    </form>
                  )}
                  {post.status !== 'declined' && (
                    <form action={setBoardPostStatusAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value="declined" />
                      <button type="submit" className={cn(btn.ghost, 'px-4 py-2.5 text-xs')}>
                        Decline
                      </button>
                    </form>
                  )}
                  {post.status !== 'pending' && (
                    <form action={setBoardPostStatusAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value="pending" />
                      <button type="submit" className={cn(btn.ghost, 'px-4 py-2.5 text-xs')}>
                        Back to review
                      </button>
                    </form>
                  )}
                  <form action={deleteBoardPostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmButton
                      message="Delete this board post permanently? This cannot be undone."
                      className={cn(btn.ghost, 'px-4 py-2.5 text-xs text-red-300 hover:text-red-200')}
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
