import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { btn } from '@/lib/ui'

export function CtaBand({
  title = 'Your seat on the roster is waiting.',
  text = 'Applications take five minutes. Every one is read by the manager.',
}: {
  title?: string
  text?: string
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10">
      <Image src="/art/recruit-staff.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/80" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/60 to-ember/20" />
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-24 md:px-8 md:py-32">
        <h2 className="display max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] text-bone">{title}</h2>
        <p className="max-w-lg text-base text-bone/75 md:text-lg">{text}</p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/recruitment" className={btn.primary}>
            Apply now
            <ArrowRight className="size-4" />
          </Link>
          <Link href="/recruitment/status" className={btn.ghost}>
            Check my application
          </Link>
        </div>
      </div>
    </section>
  )
}
