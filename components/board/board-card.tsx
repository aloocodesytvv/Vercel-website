import Image from 'next/image'
import { boardDurationLabel, getBoardCategory } from '@/lib/site'
import { cn } from '@/lib/utils'

export type BoardPost = {
  id: number
  category: string
  orgName: string
  title: string
  detail: string
  roleNeeded: string
  rank: string
  speciality: string
  experience: string
  languages: string
  sells: string
  buyHow: string
  instagram: string
  logo: string
  banner: string
  featuredDays: number
  createdAt: string
}

function Avatar({ post }: { post: BoardPost }) {
  const initial = (post.orgName.trim().charAt(0) || 'A').toUpperCase()
  return (
    <span className="relative -mt-7 ml-4 flex size-14 shrink-0 items-center justify-center overflow-hidden bg-panel text-2xl font-bold text-gold ring-2 ring-ink">
      {post.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.logo} alt={`${post.orgName} logo`} className="size-full object-cover" />
      ) : (
        initial
      )}
    </span>
  )
}

export function BoardCard({ post, tall }: { post: BoardPost; tall?: boolean }) {
  const featured = post.featuredDays > 0
  const category = getBoardCategory(post.category)
  const chips = [
    post.roleNeeded ? `Needs: ${post.roleNeeded}` : '',
    post.rank ? `Rank: ${post.rank}` : '',
    post.speciality ? post.speciality : '',
    post.experience ? `Exp: ${post.experience}` : '',
    post.languages ? post.languages : '',
    post.sells ? `Sells: ${post.sells}` : '',
    post.buyHow ? post.buyHow : '',
  ].filter(Boolean)
  const instagramHref = post.instagram
    ? `https://instagram.com/${post.instagram.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '')}`
    : undefined

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden border bg-panel transition-colors',
        featured ? 'border-gold/60' : 'border-sky-500/25',
      )}
    >
      <div className={cn('relative overflow-hidden', tall ? 'h-40' : 'h-28')}>
        <Image src={post.banner} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        {featured ? (
          <>
            <span className="absolute left-3 top-3 bg-gold px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ink">
              ★ Featured
            </span>
            <span className="absolute right-3 top-3 bg-ink/80 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-gold">
              {boardDurationLabel(post.featuredDays)}
            </span>
          </>
        ) : (
          <span className="absolute left-3 top-3 bg-sky-500/80 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white">
            Standard
          </span>
        )}
      </div>

      <Avatar post={post} />

      <div className="flex flex-1 flex-col gap-2 p-4 pt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-bold text-bone">{post.orgName}</span>
          <span
            className={cn(
              'shrink-0 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em]',
              featured ? 'bg-gold/15 text-gold' : 'bg-sky-500/15 text-sky-300',
            )}
          >
            {category?.tag ?? post.category}
          </span>
        </div>
        <h3 className="display text-2xl leading-none text-bone">{post.title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-mute">{post.detail}</p>
        {chips.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <li key={chip} className="bg-white/5 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-bone/80">
                {chip}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs">
          <span className="truncate text-mute">Contact: {post.instagram}</span>
          {instagramHref && (
            <a href={instagramHref} target="_blank" rel="noopener noreferrer" className="shrink-0 font-bold uppercase tracking-widest text-ember hover:text-bone">
              Instagram
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
