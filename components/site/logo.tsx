import Image from 'next/image'
import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

/**
 * The real Ashen Wings logo: the white phoenix head mark cut out with a
 * transparent background (v13c phoenix, no gradient backdrop). It sits
 * directly on the site's dark background — no tile, no box.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-block size-9', className)} aria-hidden="true">
      <Image src="/ashen-wings-logo.png" alt="" fill sizes="112px" className="object-contain" />
    </span>
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
