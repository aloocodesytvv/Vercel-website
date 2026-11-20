import Image from 'next/image'
import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

/**
 * The real Ashen Wings logo: the white phoenix head mark on the
 * navy / teal / violet gradient (v13c, the approved main logo).
 * Shown as a rounded tile, since the artwork is a full square image.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-block size-9 overflow-hidden rounded-lg', className)} aria-hidden="true">
      <Image src="/ashen-wings-logo-mark.jpg" alt="" fill sizes="112px" className="object-cover" />
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
