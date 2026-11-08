import type { Metadata } from 'next'
import { StatusForm } from '@/components/forms/status-form'
import { PageHero } from '@/components/site/page-hero'

export const metadata: Metadata = {
  title: 'Application status',
  description: 'Track your Ashen Wings recruitment application with your tracking code.',
}

export default function StatusPage() {
  return (
    <>
      <PageHero eyebrow="Application status" title={<>Track your <span className="text-ember">application.</span></>} position="70% 50%">
        No ghosting. Follow your application from received to roster with your tracking code.
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <StatusForm />
      </section>
    </>
  )
}
