import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'
import { news } from '@/lib/site'

export function News() {
  return (
    <section id="news" className="border-y border-white/10 bg-panel">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading index="04" eyebrow="News & updates" title={<>From the <span className="text-ember">org.</span></>}>
          Announcements, standards and open doors from the Ashen Wings team.
        </SectionHeading>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {news.map((item) => (
            <article key={item.title} className="group flex flex-col bg-ink">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: item.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute left-4 top-4 bg-ember px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink">
                  {item.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="display text-3xl text-bone">{item.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-mute">{item.excerpt}</p>
                <Link
                  href={item.href}
                  className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember transition-colors hover:text-bone"
                >
                  {item.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
