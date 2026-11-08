import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={cn('size-9', className)} aria-hidden="true">
      <path d="M3 3 L13 9 L20 6 L27 9 L37 3 L36 25 L20 41 L4 25 Z" fill="#ff5a1f" />
      <path d="M10 14 H14.2 L16.6 24 L20 15.5 L23.4 24 L25.8 14 H30 L25.4 31 H21.6 L20 26.6 L18.4 31 H14.6 Z" fill="#07070a" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-extrabold uppercase italic tracking-tight text-bone">Fnatic Wolf</span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-ember">MLBB Esports</span>
      </span>
    </span>
  )
}
