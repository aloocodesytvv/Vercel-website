import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { RecruitmentForm } from '@/components/forms/recruitment-form'
import { PageHero } from '@/components/site/page-hero'

export const metadata: Metadata = {
  title: 'Recruitment',
  description: 'Apply to join the Ashen Wings MLBB roster as a player, or join the team as a coach, analyst, creator or staff member.',
}

export default async function RecruitmentPage({ searchParams }: { searchParams: Promise<{ role?: string; track?: string }> }) {
  const { role, track } = await searchParams
  return (
    <>
      <PageHero eyebrow="Recruitment" title={<>Join <span className="text-ember">Ashen Wings.</span></>} position="75% 30%">
        Two different tracks, one standard. Players trial in scrims. Staff and creators trial on real work.
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 pt-10 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="group relative overflow-hidden">
            <div className="relative aspect-[16/7] overflow-hidden">
              <Image
                src="/art/recruit-players.jpg"
                alt="Dyrroth in Naraka Flame splash art from Mobile Legends: Bang Bang"
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
                <span>
                  <span className="block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ember">Players</span>
                  <span className="display text-3xl text-bone md:text-4xl">Trial in scrims.</span>
                </span>
              </figcaption>
            </div>
          </figure>
          <figure className="group relative overflow-hidden">
            <div className="relative aspect-[16/7] overflow-hidden">
              <Image
                src="/art/recruit-staff.jpg"
                alt="Ling in Serene Plume splash art from Mobile Legends: Bang Bang"
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
                <span>
                  <span className="block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">Staff &amp; Creators</span>
                  <span className="display text-3xl text-bone md:text-4xl">Trial on real work.</span>
                </span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <RecruitmentForm initialRole={role ?? ''} initialTrack={track ?? ''} />
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
