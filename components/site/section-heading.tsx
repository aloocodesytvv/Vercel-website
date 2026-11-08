import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
  className,
}: {
  index?: string
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex max-w-3xl flex-col gap-5', className)}>
      <p className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-ember">
        {index && <span className="text-mute">{index}</span>}
        <span className="h-px w-10 bg-ember" />
        {eyebrow}
      </p>
      <h2 className="display text-[clamp(2.6rem,7vw,5.5rem)] text-bone">{title}</h2>
      {children && <p className="max-w-xl text-base leading-relaxed text-mute md:text-lg">{children}</p>}
    </div>
  )
}
