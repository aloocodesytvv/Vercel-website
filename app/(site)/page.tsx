import Link from 'next/link'
import { About } from '@/components/home/about'
import { CtaBand } from '@/components/home/cta-band'
import { FaqList } from '@/components/home/faq-list'
import { Hero, Ticker } from '@/components/home/hero'
import { News } from '@/components/home/news'
import { Partners } from '@/components/home/partners'
import { Process } from '@/components/home/process'
import { RolesGrid } from '@/components/home/roles-grid'
import { SectionHeading } from '@/components/site/section-heading'
import { faqs } from '@/lib/site'

export default function HomePage() {
  const preview = faqs[0].items.slice(0, 4)
  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <RolesGrid />
      <Process />
      <News />
      <Partners />
      <section className="border-t border-white/10 bg-panel">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading index="06" eyebrow="Questions" title={<>Quick <span className="text-ember">answers.</span></>}>
              The essentials before you apply.
            </SectionHeading>
            <Link href="/faq" className="text-xs font-bold uppercase tracking-[0.2em] text-ember transition-colors hover:text-bone">
              See all questions
            </Link>
          </div>
          <FaqList items={preview} />
        </div>
      </section>
      <CtaBand />
    </>
  )
}
