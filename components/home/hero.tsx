import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { site } from '@/lib/site'
import { btn } from '@/lib/ui'
import { AshenDrift } from './ashen-drift'
import { FeaturedSlider } from './featured-slider'

const steps = [
  { n: '01', title: 'Apply', text: 'Five-minute form. Tracking code instantly.' },
  { n: '02', title: 'Trial scrim', text: 'Scheduled on any day that suits you.' },
  { n: '03', title: 'Answer', text: 'Reviewed personally in 7–14 days.' },
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden">
      <Image
        src="/art/hero-pharsa.jpg"
        alt="Pharsa in Empress Phoenix splash art from Mobile Legends: Bang Bang"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[55%_center] md:object-[65%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/10 md:via-ink/40 md:to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/70" />
      <div aria-hidden="true" className="glow-wash pointer-events-none absolute inset-0 -z-10" />

      <AshenDrift className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-36 md:px-8 md:pb-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex max-w-3xl animate-fade-up flex-col items-start gap-7">
            <p className="inline-flex items-center gap-3 border border-ember/40 bg-ember/10 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember-soft">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-ember" />
              </span>
              Recruitment is open
            </p>

            <h1 className="font-serif text-[clamp(3rem,9vw,7.5rem)] font-medium italic leading-[1.02] text-bone">
              Ashen
              <br />
              Wings <span className="text-gold">Rise!</span>
            </h1>

            <p className="font-serif text-xl italic text-bone/80">{site.tagline}</p>

            <p className="max-w-xl text-base leading-relaxed text-bone/75 md:text-lg">
              {site.name} is a young {site.game} organisation built on discipline, community and ambition. Join the founding roster, or
              partner with a team that is only getting started.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/recruitment" className={btn.primary}>
                Apply
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/board" className={btn.ghost}>
                Partner
              </Link>
            </div>
          </div>

          <FeaturedSlider />
        </div>

        <p className="mt-14 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-mute md:mt-20">How trials work</p>
        <ol className="mt-4 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.title} className="flex flex-col gap-1.5 bg-ink/80 px-5 py-5 backdrop-blur-md">
              <span className="display text-xl text-ember">{step.n}</span>
              <span className="display text-2xl text-bone">{step.title}</span>
              <span className="text-sm leading-relaxed text-mute">{step.text}</span>
            </li>
          ))}
        </ol>
        <Link href="#process" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember transition-colors hover:text-bone">
          See the full process
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  )
}
