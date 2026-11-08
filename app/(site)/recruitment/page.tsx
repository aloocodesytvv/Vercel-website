import type { Metadata } from 'next'
import Link from 'next/link'
import { RecruitmentForm } from '@/components/forms/recruitment-form'
import { PageHero } from '@/components/site/page-hero'

export const metadata: Metadata = {
  title: 'Recruitment',
  description: 'Apply to join the Fnatic Wolf MLBB roster as a player, coach, analyst, creator or staff member.',
}

export default async function RecruitmentPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams
  return (
    <>
      <PageHero eyebrow="Recruitment" title={<>Join the <span className="text-ember">pack.</span></>} position="75% 30%">
        Four short steps. Every application is read by the manager and posted to our private review channel.
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <RecruitmentForm initialRole={role ?? ''} />
        <p className="mt-10 text-sm text-mute">
          Already applied?{' '}
          <Link href="/recruitment/status" className="font-semibold text-ember underline-offset-4 hover:underline">
            Check your application status
          </Link>
        </p>
      </section>
    </>
  )
}
