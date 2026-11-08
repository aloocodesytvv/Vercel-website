import type { Metadata } from 'next'
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

export default function PartnersPage() {
  return (
    <>
      <PageHero eyebrow="Partners & Business" title={<>Build with <span className="text-ember">Ashen Wings.</span></>} image="/art/landing-angela.jpg" position="50% 30%">
        We are a new organisation with one founding lineup of five players — and we are open for our first partners. No sponsors yet,
        no inherited deals: the first brands in get in on the ground floor.
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading index="01" eyebrow="What we offer" title={<>Partnerships, <span className="text-ember">done properly.</span></>}>
          A direct line to the manager, a team that shows up on time, and clean, professional placements — never cluttered logos or
          shout-outs nobody asked for.
        </SectionHeading>

        <ul className="mt-14 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {partnerOffers.map((offer, index) => (
            <li key={offer.title} className="flex flex-col gap-3 bg-panel p-7 transition-colors hover:bg-panel-2">
              <span className="display text-2xl text-ember">0{index + 1}</span>
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-bone">{offer.title}</h3>
              <p className="text-sm leading-relaxed text-mute">{offer.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-white/10 bg-panel">
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
        <div className="clip-cut flex flex-col items-start gap-8 bg-panel p-8 md:p-14">
          <h2 className="display max-w-3xl text-[clamp(2.4rem,6vw,5rem)] text-bone">
            Want in? <span className="text-ember">Talk to us.</span>
          </h2>
          <p className="max-w-lg text-base text-mute">
            Tell us who you are and what you have in mind. You will also find our logo, colours and press boilerplate on the media kit
            page.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact?topic=partnership" className={btn.primary}>
              Start a collaboration
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/media-kit" className={btn.ghost}>
              View the media kit
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
