import Image from 'next/image'
import { SectionHeading } from '@/components/site/section-heading'

const pillars = [
  { title: 'Discipline', text: 'Scheduled practice, honest VOD review and a standard we hold every member to.' },
  { title: 'Community', text: 'A roster that supports each other on and off the Rift, with a manager who is reachable.' },
  { title: 'Ambition', text: 'We are early, and we say so. Everyone who joins now helps write the first chapter.' },
]

export function About() {
  return (
    <section id="about" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1.05fr_1fr] lg:items-center">
      <div className="flex flex-col gap-10">
        <SectionHeading index="01" eyebrow="Who we are" title={<>Built from <span className="text-ember">zero.</span> Built to win.</>}>
          Fnatic Wolf is a new Mobile Legends: Bang Bang organisation with big goals and a small, focused team. We would rather earn
          respect with results and professionalism than borrow it with hype.
        </SectionHeading>

        <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
          {pillars.map((pillar, index) => (
            <li key={pillar.title} className="flex gap-5 py-5">
              <span className="display w-10 shrink-0 text-3xl text-ember">0{index + 1}</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-bone">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-mute">{pillar.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="clip-cut relative aspect-[4/3] overflow-hidden bg-panel lg:aspect-[5/6]">
          <Image
            src="/art/pack.png"
            alt="Five armored wolf warriors facing a glowing sunrise"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[50%_50%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        </div>
        <div className="absolute -bottom-5 left-4 flex flex-col gap-1 bg-ember px-5 py-4 text-ink md:-left-6">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em]">Chapter</span>
          <span className="display text-4xl">One</span>
        </div>
      </div>
    </section>
  )
}
