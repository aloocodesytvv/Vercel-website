import Image from 'next/image'
import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  children,
  image = '/art/hero-wolf.png',
  position = '80% 40%',
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  image?: string
  position?: string
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-60" style={{ objectPosition: position }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-16 pt-36 md:px-8 md:pb-24 md:pt-44">
        <p className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-ember">
          <span className="h-px w-10 bg-ember" />
          {eyebrow}
        </p>
        <h1 className="display max-w-4xl text-[clamp(3rem,10vw,7.5rem)] text-bone">{title}</h1>
        {children && <p className="max-w-xl text-base leading-relaxed text-bone/75 md:text-lg">{children}</p>}
      </div>
    </section>
  )
}
