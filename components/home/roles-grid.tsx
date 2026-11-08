import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'
import { roles } from '@/lib/site'

export function RolesGrid() {
  return (
    <section id="roles" className="border-y border-white/10 bg-panel">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading index="02" eyebrow="Open positions" title={<>Choose your <span className="text-ember">role.</span></>}>
          Five lanes and a full back-office. Tell us where you fit and we will take it from there.
        </SectionHeading>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => (
            <li key={role.id}>
              <Link
                href={role.player ? `/recruitment?track=player&role=${role.id}` : '/recruitment?track=staff'}
                className="group clip-cut relative block aspect-[4/5] overflow-hidden bg-ink"
                aria-label={`Apply as ${role.name}`}
              >
                <Image
                  src={role.image}
                  alt={`${role.hero} — ${role.skin} splash art from Mobile Legends: Bang Bang`}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-ember/70" />

                <span className="display absolute right-5 top-4 text-6xl text-white/15">0{index + 1}</span>

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember">{role.tag}</span>
                  <h3 className="display text-4xl text-bone">{role.name}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-bone/70">{role.blurb}</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-bone transition-colors group-hover:text-ember">
                    Apply for this role
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
