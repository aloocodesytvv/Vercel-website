'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { LogoMark } from '@/components/site/logo'
import { SectionHeading } from '@/components/site/section-heading'
import { brandPalette, mediaBoilerplate } from '@/lib/site'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button type="button" onClick={copy} className={cn(btn.ghost, 'px-4 py-2.5 text-xs')}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? 'Copied' : label}
    </button>
  )
}

export default function MediaKitPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pt-44">
        <SectionHeading index="01" eyebrow="Media kit" title={<>The Ashen Wings <span className="text-ember">brand.</span></>}>
          Logo, colours and words — everything a partner, creator or journalist needs to feature us correctly.
        </SectionHeading>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="clip-cut flex flex-col items-center gap-6 bg-panel p-10">
            <LogoMark className="size-28" />
            <p className="text-center text-sm text-mute">
              The phoenix crest. Use it on dark backgrounds, with clear space around it. Do not stretch, recolour or add effects.
            </p>
            <span className="font-serif text-2xl italic text-gold">Rise from the ashes.</span>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-ember">Colours — tap to copy</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {brandPalette.map((colour) => (
                  <li key={colour.hex}>
                    <button
                      type="button"
                      onClick={() => void navigator.clipboard.writeText(colour.hex)}
                      className="flex w-full items-center gap-4 border border-white/10 bg-panel p-3 text-left transition-colors hover:border-ember/60"
                    >
                      <span className="size-12 shrink-0 border border-white/10" style={{ backgroundColor: colour.hex }} />
                      <span className="flex flex-col">
                        <span className="text-sm font-bold text-bone">{colour.name}</span>
                        <span className="font-mono text-xs text-mute">{colour.hex}</span>
                        <span className="text-xs text-mute">{colour.role}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-ember">Typography</h2>
              <dl className="flex flex-col gap-3 border border-white/10 bg-panel p-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-mute">Headings &amp; body</dt>
                  <dd className="font-semibold text-bone">Libre Franklin</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-mute">Tagline &amp; editorial</dt>
                  <dd className="font-serif italic text-bone">Newsreader italic</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-mute">Display labels</dt>
                  <dd className="font-display text-bone">Barlow Condensed</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-panel">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-24 md:px-8">
          <h2 className="display text-4xl text-bone md:text-6xl">
            Press <span className="text-ember">boilerplate.</span>
          </h2>
          <p className="max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-bone/85">{mediaBoilerplate}</p>
          <div>
            <CopyButton text={mediaBoilerplate} label="Copy boilerplate" />
          </div>
          <p className="text-sm text-mute">
            Hero artwork on this site is official Mobile Legends: Bang Bang splash art, © Moonton, used for identification. Ashen Wings
            is not affiliated with Moonton.
          </p>
        </div>
      </section>
    </>
  )
}
