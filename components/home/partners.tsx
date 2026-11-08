import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'
import { partnerOffers } from '@/lib/site'
import { btn } from '@/lib/ui'

export function Partners() {
  return (
    <section id="partners" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-8">
        <SectionHeading index="05" eyebrow="For partners" title={<>Build with <span className="text-ember">Ashen Wings.</span></>}>
          Organisations, creators and brands: we are open to scrims, collaborations and sponsorships. You get a direct line to the
          manager and a team that treats every partnership professionally.
        </SectionHeading>
        <div>
          <Link href="/partners" className={btn.primary}>
            See partnerships
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <ul className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
        {partnerOffers.map((offer, index) => (
          <li key={offer.title} className="flex flex-col gap-3 bg-panel p-7 transition-colors hover:bg-panel-2">
            <span className="display text-2xl text-ember">0{index + 1}</span>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-bone">{offer.title}</h3>
            <p className="text-sm leading-relaxed text-mute">{offer.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
