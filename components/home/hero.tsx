import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { roles, site } from '@/lib/site'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'

const embers = [
  { left: '8%', delay: '0s', size: 4 },
  { left: '22%', delay: '2.2s', size: 3 },
  { left: '41%', delay: '4.1s', size: 5 },
  { left: '57%', delay: '1.3s', size: 3 },
  { left: '68%', delay: '3.4s', size: 4 },
  { left: '79%', delay: '5.2s', size: 3 },
  { left: '90%', delay: '0.8s', size: 5 },
  { left: '33%', delay: '5.8s', size: 3 },
]

const facts = [
  { label: 'Game', value: 'MLBB' },
  { label: 'Open roles', value: String(roles.length) },
  { label: 'Review time', value: '7-14 days' },
  { label: 'Read by', value: 'The manager' },
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden">
      <Image
        src="/art/hero-wolf.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[78%_center] md:object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/10 md:via-ink/40 md:to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/70" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {embers.map((ember, index) => (
          <span
            key={index}
            className="absolute bottom-0 animate-rise rounded-full bg-ember-soft shadow-[0_0_12px_2px_#ff5a1f]"
            style={{ left: ember.left, width: ember.size, height: ember.size, animationDelay: ember.delay }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-36 md:px-8 md:pb-14">
        <div className="flex max-w-3xl animate-fade-up flex-col items-start gap-7">
          <p className="inline-flex items-center gap-3 border border-ember/40 bg-ember/10 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember-soft">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-ember" />
            </span>
            Recruitment is open
          </p>

          <h1 className="display text-[clamp(3.6rem,13vw,10.5rem)] text-bone">
            Rise with
            <br />
            the <span className="text-ember">pack.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-bone/75 md:text-lg">
            {site.name} is a young {site.game} organisation built on discipline, community and ambition. Join the founding roster, or
            partner with a team that is only getting started.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/recruitment" className={btn.primary}>
              Apply to join
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/contact?topic=partnership" className={btn.ghost}>
              Partner with us
            </Link>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:mt-20 md:grid-cols-4">
          {facts.map((fact, index) => (
            <div key={fact.label} className={cn('flex flex-col gap-1 bg-ink/80 px-5 py-4 backdrop-blur-md', index === 0 && 'md:pl-6')}>
              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-mute">{fact.label}</dt>
              <dd className="display text-2xl text-bone md:text-3xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Ticker() {
  const items = ['Now recruiting', 'Gold lane', 'EXP lane', 'Mid lane', 'Jungle', 'Roam', 'Coaches & staff', 'Creators', 'Partnerships open']
  const row = [...items, ...items]
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-ink/20 bg-ember py-3.5">
      <div className="flex w-max animate-marquee">
        {[...row, ...row].map((item, index) => (
          <span key={index} className="display flex items-center gap-6 whitespace-nowrap pr-6 text-xl text-ink md:text-2xl">
            {item}
            <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="currentColor">
              <path d="M8 0 10 6 16 8 10 10 8 16 6 10 0 8 6 6Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
