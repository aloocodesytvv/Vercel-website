import { SectionHeading } from '@/components/site/section-heading'

const steps = [
  { title: 'Apply', text: 'Fill in the form. It takes about five minutes and you get a tracking code instantly.' },
  { title: 'Review', text: 'The manager reads every application personally, usually within 7 to 14 days.' },
  { title: 'Trial', text: 'Players are invited to trial scrims on any day; staff and creators get an interview and a role-specific trial task.' },
  { title: 'Join the roster', text: 'Accepted members get onboarding, a role and a seat on the founding roster.' },
]

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading index="03" eyebrow="How it works" title={<>From form to <span className="text-ember">roster.</span></>}>
        A clear path with no ghosting. You can follow your application any time with your tracking code.
      </SectionHeading>

      <ol className="mt-14 grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="group relative flex flex-col gap-4 bg-ink p-7 transition-colors hover:bg-panel">
            <span className="display text-outline text-7xl text-ember/60 transition-colors group-hover:text-ember">0{index + 1}</span>
            <h3 className="display text-3xl text-bone">{step.title}</h3>
            <p className="text-sm leading-relaxed text-mute">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
