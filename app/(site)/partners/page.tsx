import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { partnerOffers } from '@/lib/site'
import { btn } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Partners & Business',
  description:
    'Ashen Wings is open for first partners: scrims, showmatches, creator collaborations, sponsorships and media features.',
}

const academyAreas = [
  { title: 'Competitive Gaming', text: 'Supporting competitive players and team development.' },
  { title: 'Tournament Management', text: 'Organising and coordinating esports tournaments and events.' },
  { title: 'Content & Media', text: 'Building the organisation’s presence through gaming content and media.' },
  { title: 'Community Development', text: 'Creating an accessible and active esports community.' },
]

export default function PartnersPage() {
  return (
    <>
      <PageHero eyebrow="Partners & Business" title={<>Build with <span className="text-ember">Ashen Wings.</span></>} image="/art/landing-angela.jpg" position="50% 30%">
        We are a new organisation with one founding lineup of five players — and we are open for our first partners. No sponsors yet,
        no inherited deals: the first brands in get in on the ground floor.
      </PageHero>

      <div className="bg-[linear-gradient(180deg,#0b0b0e_0%,#171009_8%,#120f09_22%,#0d120c_38%,#0c130d_52%,#0f110a_66%,#120d08_82%,#0b0b0e_100%)]">
        {/* Featured partnership: Vantaura X Ashen Wings Academy */}
        <section className="mx-auto max-w-7xl bg-[radial-gradient(ellipse_100%_60%_at_18%_28%,rgba(46,160,90,0.09),transparent_68%),radial-gradient(ellipse_100%_60%_at_82%_28%,rgba(232,192,122,0.07),transparent_68%)] px-5 py-24 text-center md:px-8 md:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-gold">Featured Partnership</p>
          <h2 className="display mt-4 text-[clamp(2rem,6vw,3.75rem)] text-bone">
            Vantaura <span className="text-gold">X</span> Ashen Wings
          </h2>
          <p className="mt-2 font-display text-lg font-bold uppercase tracking-[0.6em] text-gold indent-[0.6em] md:text-xl">
            Academy
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/80" />
          <p className="mt-6 font-serif text-[15px] italic text-bone/70">
            Define your presence — talent exists everywhere, opportunity should too.
          </p>

          <div className="mx-auto mt-10 grid max-w-[560px] grid-cols-[1fr_26px_1fr] items-stretch">
            <div className="flex flex-col items-center rounded-2xl border border-[#78dc96]/30 bg-[radial-gradient(ellipse_80%_70%_at_50%_38%,rgba(46,160,90,0.28),rgba(46,160,90,0.05)_70%)] px-3 py-6">
              <div className="mb-3 flex h-[150px] items-center justify-center">
                <Image src="/vantaura-logo.png" alt="Vantaura Esports logo" width={560} height={457} className="h-auto w-auto max-h-[150px] max-w-[168px]" />
              </div>
              <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.14em] text-[#b8f0c8]">Vantaura Esports</h3>
              <p className="mt-1.5 min-h-[38px] text-center text-xs leading-relaxed text-bone/70">
                Competitive gaming, tournaments, content &amp; community.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center" aria-hidden="true">
              <span className="min-h-[34px] w-px flex-1 bg-[linear-gradient(rgba(232,192,122,0),rgba(232,192,122,0.85),rgba(232,192,122,0))]" />
              <span className="my-2 size-2 rotate-45 bg-gold shadow-[0_0_12px_rgba(232,192,122,0.9)]" />
              <span className="min-h-[34px] w-px flex-1 bg-[linear-gradient(rgba(232,192,122,0),rgba(232,192,122,0.85),rgba(232,192,122,0))]" />
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-gold/30 bg-[radial-gradient(ellipse_80%_70%_at_50%_38%,rgba(232,192,122,0.22),rgba(232,192,122,0.04)_70%)] px-3 py-6">
              <div className="mb-3 flex h-[150px] items-center justify-center">
                <Image src="/ashen-wings-logo.png" alt="Ashen Wings logo" width={1600} height={1600} className="h-auto w-auto max-h-[150px] max-w-[168px]" />
              </div>
              <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.14em] text-gold">Ashen Wings</h3>
              <p className="mt-1.5 min-h-[38px] text-center text-xs leading-relaxed text-bone/70">Rise from the ashes.</p>
            </div>
          </div>

          <p className="mt-12 text-[11px] font-bold uppercase tracking-[0.35em] text-gold">The Academy</p>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-bone/80">
            A collaborative esports academy initiative between VANTAURA ESPORTS and Ashen Wings, focused on identifying emerging talent
            and developing competitive players through structured tryouts, coaching, training and player development.
          </p>

          <ul className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-2.5 text-left">
            {academyAreas.map((area) => (
              <li key={area.title} className="rounded-[10px] border border-gold/25 bg-white/[0.03] p-3">
                <b className="mb-1 block font-display text-[13px] font-bold uppercase tracking-[0.06em] text-gold">{area.title}</b>
                <span className="text-xs leading-relaxed text-bone/70">{area.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f0abfc" strokeWidth="2" className="size-5 shrink-0" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.4" cy="6.6" r="1.2" fill="#f0abfc" stroke="none" />
              </svg>
              <a
                href="https://instagram.com/vantaura.esp"
                target="_blank"
                rel="noreferrer"
                className="font-display text-[15px] tracking-[0.06em] text-[#f0abfc] hover:underline"
              >
                Vantaura Esports
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="#8ea2f5" className="size-5 shrink-0" aria-hidden="true">
                <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885 1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.319 13.58.698 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.994 3.03.078.078 0 0 0 .084-.026c.463-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.892.077.077 0 0 1-.007-.13c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.13 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 0 0-.031-.029ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
              </svg>
              <a
                href="https://discord.gg/VnvHXNDRuV"
                target="_blank"
                rel="noreferrer"
                className="font-display text-[15px] tracking-[0.06em] text-[#8ea2f5] hover:underline"
              >
                discord.gg/Vantaura
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <SectionHeading index="01" eyebrow="What we offer" title={<>Partnerships, <span className="text-ember">done properly.</span></>}>
            A direct line to the manager, a team that shows up on time, and clean, professional placements — never cluttered logos or
            shout-outs nobody asked for.
          </SectionHeading>

          <ul className="mt-14 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {partnerOffers.map((offer, index) => (
              <li key={offer.title} className="flex flex-col gap-3 bg-white/[0.025] p-7 transition-colors hover:bg-white/[0.05]">
                <span className="display text-2xl text-ember">0{index + 1}</span>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-bone">{offer.title}</h3>
                <p className="text-sm leading-relaxed text-mute">{offer.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-6">
              <SectionHeading index="02" eyebrow="First partners" title={<>Be first. <span className="text-ember">Be remembered.</span></>}>
                We have no sponsors yet — we say so plainly. Our first partners shape how Ashen Wings presents brands, and we will treat
                that as a partnership, not a logo slot.
              </SectionHeading>
            </div>
            <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
              {[
                { title: 'Direct contact', text: 'You talk to the manager, not a form that goes nowhere.' },
                { title: 'Honest numbers', text: 'We will not invent reach or results. What we show is what we have.' },
                { title: 'Clean placements', text: 'Your brand appears where it fits — content, jerseys and community channels.' },
                { title: 'Fast replies', text: 'Partnership enquiries are answered within 48 hours.' },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-5 py-5">
                  <span className="display w-10 shrink-0 text-3xl text-ember">0{index + 1}</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-bone">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-mute">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="clip-cut flex flex-col items-start gap-8 bg-white/[0.025] p-8 md:p-14">
            <h2 className="display max-w-3xl text-[clamp(2.4rem,6vw,5rem)] text-bone">
              Want in? <span className="text-ember">Talk to us.</span>
            </h2>
            <p className="max-w-lg text-base text-mute">Tell us who you are and what you have in mind.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact?topic=partnership" className={btn.primary}>
                Start a collaboration
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
