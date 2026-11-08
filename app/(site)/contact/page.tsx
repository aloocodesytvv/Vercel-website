import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/contact-form'
import { PageHero } from '@/components/site/page-hero'
import { socialLinks } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Partnerships, scrims, sponsorships and media enquiries for Ashen Wings. Message the manager directly.',
}

const promises = [
  { title: 'Direct line', text: 'Messages go straight to the manager, not an inbox nobody reads.' },
  { title: '48 hour reply', text: 'Partnership and scrim enquiries are flagged and answered first.' },
  { title: 'Professional by default', text: 'Clear terms, on-time delivery and respectful communication.' },
]

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams
  const socials = socialLinks()
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s build <span className="text-ember">together.</span></>} image="/art/role-staff.jpg" position="50% 50%">
        Organisations, creators, sponsors and media: tell us what you have in mind.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-10">
          <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            {promises.map((item, index) => (
              <li key={item.title} className="flex gap-5 py-6">
                <span className="display w-10 shrink-0 text-3xl text-ember">0{index + 1}</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-bone">{item.title}</h2>
                  <p className="text-sm leading-relaxed text-mute">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
          {socials.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Find us</h2>
              <ul className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-bone transition-colors hover:bg-ember hover:text-ink"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <ContactForm initialTopic={topic ?? ''} />
      </section>
    </>
  )
}
