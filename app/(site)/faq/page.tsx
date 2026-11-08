import type { Metadata } from 'next'
import { CtaBand } from '@/components/home/cta-band'
import { FaqList } from '@/components/home/faq-list'
import { PageHero } from '@/components/site/page-hero'
import { faqs } from '@/lib/site'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers about joining Ashen Wings: requirements, roles, review time, partnerships and more.',
}

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title={<>Straight <span className="text-ember">answers.</span></>} position="80% 40%">
        Everything about recruitment, requirements and partnerships in one place.
      </PageHero>
      <section className="mx-auto flex max-w-5xl flex-col gap-16 px-5 py-14 md:px-8 md:py-20">
        {faqs.map((group) => (
          <div key={group.category} className="grid gap-6 md:grid-cols-[12rem_1fr]">
            <h2 className="display text-4xl text-ember">{group.category}</h2>
            <FaqList items={group.items} />
          </div>
        ))}
      </section>
      <CtaBand title="Still curious? Ask us directly." text="Message the manager and get a reply, usually within 48 hours." />
    </>
  )
}
