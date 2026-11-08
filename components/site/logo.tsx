import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

/**
 * Hand-drawn phoenix crest for Ashen Wings: wings raised, a flame body,
 * and three tail feathers. Copper with pale-gold accents.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 52" className={cn('size-9', className)} aria-hidden="true">
      {/* Left wing */}
      <path
        d="M23 15 C16 7 8 3 2 5 C6 8 8 11 9 15 C6 14 3 15 1 18 C5 19 9 21 12 25 C14 28 17 30 20 31 L23 24 Z"
        fill="#c97b2d"
      />
      {/* Right wing */}
      <path
        d="M25 15 C32 7 40 3 46 5 C42 8 40 11 39 15 C42 14 45 15 47 18 C43 19 39 21 36 25 C34 28 31 30 28 31 L25 24 Z"
        fill="#c97b2d"
      />
      {/* Flame body */}
      <path d="M24 13 C27.5 19 28.5 25 24 33 C19.5 25 20.5 19 24 13 Z" fill="#e8c07a" />
      {/* Head */}
      <circle cx="24" cy="11" r="2.6" fill="#e8c07a" />
      <path d="M26.2 9.8 L30.5 11.4 L26.2 12.8 Z" fill="#c97b2d" />
      <circle cx="24.8" cy="10.6" r="0.7" fill="#0b0b0e" />
      {/* Tail feathers */}
      <path d="M24 33 C22 39 20 44 15.5 48 C21 47 23.5 42.5 24 38.5 C24.5 42.5 27 47 32.5 48 C28 44 26 39 24 33 Z" fill="#c97b2d" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-extrabold uppercase italic tracking-tight text-bone">{site.name}</span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-ember">MLBB Esports</span>
      </span>
    </span>
  )
}
