'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Copy, LoaderCircle } from 'lucide-react'
import { experienceLevels, getRole, ranks, roles } from '@/lib/site'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'
import {
  applicationSteps,
  emptyApplication,
  validateApplication,
  type ApplicationErrors,
  type ApplicationInput,
} from '@/lib/validation'
import { SelectField, TextAreaField, TextField } from './controls'

type StringKey = Exclude<keyof ApplicationInput, 'consent'>

const rankOptions = ranks.map((rank) => ({ value: rank, label: rank }))
const experienceOptions = experienceLevels.map((level) => ({ value: level.value, label: level.label }))

export function RecruitmentForm({ initialRole }: { initialRole: string }) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<ApplicationInput>({ ...emptyApplication, role: getRole(initialRole)?.id ?? '' })
  const [errors, setErrors] = useState<ApplicationErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const role = getRole(values.role)
  const isPlayer = role?.player ?? true
  const lastStep = applicationSteps.length - 1

  const bind = (key: StringKey) => ({
    value: values[key],
    error: errors[key],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [key]: value }))
      setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
    },
  })

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const errorsForStep = (index: number) => {
    const all = validateApplication(values)
    const scoped: ApplicationErrors = {}
    for (const field of applicationSteps[index].fields) if (all[field]) scoped[field] = all[field]
    return scoped
  }

  const goTo = (index: number) => {
    setStep(index)
    setServerError('')
    requestAnimationFrame(scrollToTop)
  }

  const next = () => {
    const found = errorsForStep(step)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(first)?.focus()
      return
    }
    goTo(step + 1)
  }

  const submit = async () => {
    const all = validateApplication(values)
    if (Object.keys(all).length) {
      setErrors(all)
      const failing = applicationSteps.findIndex((item) => item.fields.some((field) => all[field]))
      goTo(Math.max(failing, 0))
      return
    }
    setSubmitting(true)
    setServerError('')
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (data.ok) {
        setCode(data.code)
        requestAnimationFrame(scrollToTop)
      } else if (data.errors) {
        setErrors(data.errors)
        const failing = applicationSteps.findIndex((item) => item.fields.some((field) => data.errors[field]))
        goTo(Math.max(failing, 0))
      } else {
        setServerError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setServerError('Network error. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (step < lastStep) next()
    else void submit()
  }

  const copyCode = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (code) {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <div className="clip-cut flex flex-col gap-8 bg-panel p-8 md:p-14">
          <span className="flex size-14 items-center justify-center bg-ember text-ink">
            <Check className="size-7" />
          </span>
          <div className="flex flex-col gap-3">
            <h2 className="display text-5xl text-bone md:text-7xl">Application received.</h2>
            <p className="max-w-lg text-base leading-relaxed text-mute">
              Thanks, {values.name.split(' ')[0]}. Your application for <span className="font-semibold text-bone">{role?.name}</span> is now with
              the team and has been posted to our private review channel.
            </p>
          </div>

          <div className="flex flex-col gap-3 border border-ember/40 bg-ember/10 p-5">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember">Your tracking code</span>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-3xl font-bold tracking-widest text-bone md:text-4xl">{code}</span>
              <button type="button" onClick={copyCode} className={cn(btn.ghost, 'px-4 py-2.5 text-xs')}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-mute">Save this. You need it with your email to check your application status.</p>
          </div>

          <ol className="flex flex-col gap-3 text-sm text-mute">
            <li>1. The manager reviews your application, usually within 7 to 14 days.</li>
            <li>2. If shortlisted, we message you on Discord ({values.discord}). Keep your DMs open.</li>
            <li>3. Track progress any time on the status page.</li>
          </ol>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/recruitment/status" className={btn.primary}>
              Check status
            </Link>
            <Link href="/" className={btn.ghost}>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start xl:grid-cols-[1fr_26rem]">
      <div ref={topRef} className="scroll-mt-28">
        <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Application progress">
          {applicationSteps.map((item, index) => (
            <li key={item.label} aria-current={index === step ? 'step' : undefined} className="flex flex-col gap-2">
              <span className={cn('h-1 transition-colors', index <= step ? 'bg-ember' : 'bg-white/15')} />
              <span
                className={cn(
                  'text-[0.65rem] font-bold uppercase tracking-[0.15em] md:text-xs',
                  index === step ? 'text-bone' : 'text-mute',
                  index !== step && 'hidden sm:block',
                )}
              >
                <span className="text-ember">0{index + 1}</span> {item.label}
              </span>
            </li>
          ))}
        </ol>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(event) => setValues((current) => ({ ...current, website: event.target.value }))}
              />
            </label>
          </div>

          {step === 0 && (
            <div className="flex flex-col gap-8">
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-bone">Role you are applying for</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {roles.map((item) => {
                    const checked = values.role === item.id
                    return (
                      <label
                        key={item.id}
                        className={cn(
                          'group relative block aspect-[4/3] cursor-pointer overflow-hidden bg-panel-2 ring-1 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ember',
                          checked ? 'ring-2 ring-ember' : 'ring-white/10 hover:ring-white/30',
                        )}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={item.id}
                          checked={checked}
                          className="sr-only"
                          onChange={() => {
                            setValues((current) => ({ ...current, role: item.id }))
                            setErrors((current) => ({ ...current, role: undefined }))
                          }}
                        />
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 200px, 45vw"
                          className={cn('object-cover object-[50%_20%] transition', checked ? 'opacity-90' : 'opacity-50 group-hover:opacity-70')}
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                          <span className="display text-xl leading-none text-bone">{item.name}</span>
                          {checked && (
                            <span className="flex size-5 shrink-0 items-center justify-center bg-ember text-ink">
                              <Check className="size-3.5" />
                            </span>
                          )}
                        </span>
                      </label>
                    )
                  })}
                </div>
                {errors.role && (
                  <p role="alert" className="text-xs font-medium text-red-400">
                    {errors.role}
                  </p>
                )}
              </fieldset>

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField id="name" label="Full name" autoComplete="name" placeholder="Your name" {...bind('name')} />
                <TextField id="age" label="Age" type="number" inputMode="numeric" min={13} max={60} placeholder="18" {...bind('age')} />
                <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" {...bind('email')} />
                <TextField id="discord" label="Discord username" placeholder="username" hint="We contact you here. Keep DMs open." {...bind('discord')} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              {!isPlayer && (
                <p className="border-l-2 border-ember bg-ember/10 p-4 text-sm text-bone/80">
                  You are applying for a non-playing role, so game profile details are optional. Tell us about your experience instead.
                </p>
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField id="ign" label="In-game name" optional={!isPlayer} placeholder="Your MLBB nickname" {...bind('ign')} />
                <SelectField id="rank" label="Current or peak rank" optional={!isPlayer} options={rankOptions} {...bind('rank')} />
                <TextField id="gameId" label="Game ID" optional={!isPlayer} inputMode="numeric" placeholder="123456789" {...bind('gameId')} />
                <TextField id="serverId" label="Server ID" optional={!isPlayer} inputMode="numeric" placeholder="1234" {...bind('serverId')} />
              </div>
              <TextField
                id="mainHeroes"
                label={isPlayer ? 'Main heroes' : 'Heroes or specialities'}
                optional={!isPlayer}
                placeholder="e.g. Beatrix, Granger, Claude"
                {...bind('mainHeroes')}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <SelectField id="experience" label="Experience level" options={experienceOptions} {...bind('experience')} />
                <TextField id="timezone" label="Timezone / country" placeholder="e.g. IST, Philippines" {...bind('timezone')} />
              </div>
              <TextField id="availability" label="Availability" placeholder="e.g. Weekdays 7-11pm, weekends all day" {...bind('availability')} />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <TextAreaField
                id="message"
                label="Why Fnatic Wolf?"
                rows={7}
                maxLength={1200}
                placeholder="Tell us who you are, what you bring to the team, your goals and any past teams or achievements."
                hint={`${values.message.trim().length}/1200 (minimum 30)`}
                {...bind('message')}
              />
              <TextAreaField
                id="links"
                label="Links"
                optional
                rows={3}
                placeholder="Gameplay clips, YouTube, TikTok, portfolio or profile links, one per line"
                {...bind('links')}
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <dl className="flex flex-col divide-y divide-white/10 border border-white/10 bg-panel">
                {[
                  { label: 'Role', value: role?.name, goTo: 0 },
                  { label: 'Applicant', value: `${values.name}, ${values.age}`, goTo: 0 },
                  { label: 'Contact', value: `${values.email} / ${values.discord}`, goTo: 0 },
                  { label: 'Game profile', value: [values.ign, values.rank, values.mainHeroes].filter(Boolean).join(' / ') || 'Not provided', goTo: 1 },
                  { label: 'Availability', value: `${values.availability} (${values.timezone})`, goTo: 1 },
                  { label: 'Your story', value: values.message, goTo: 2 },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 p-4">
                    <div className="flex min-w-0 flex-col gap-1">
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ember">{row.label}</dt>
                      <dd className="line-clamp-3 break-words text-sm text-bone/85">{row.value}</dd>
                    </div>
                    <button type="button" onClick={() => goTo(row.goTo)} className="shrink-0 text-xs font-bold uppercase tracking-widest text-mute hover:text-bone">
                      Edit
                    </button>
                  </div>
                ))}
              </dl>

              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-bone/80">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={(event) => {
                      setValues((current) => ({ ...current, consent: event.target.checked }))
                      setErrors((current) => ({ ...current, consent: undefined }))
                    }}
                    className="mt-1 size-5 shrink-0 accent-[#ff5a1f]"
                  />
                  I confirm the information is accurate, and I agree that Fnatic Wolf may store it and share it with the team to review my application.
                </label>
                {errors.consent && (
                  <p role="alert" className="text-xs font-medium text-red-400">
                    {errors.consent}
                  </p>
                )}
              </div>
            </div>
          )}

          {serverError && (
            <p role="alert" className="border-l-2 border-red-500 bg-red-500/10 p-4 text-sm text-red-300">
              {serverError}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-6">
            {step > 0 ? (
              <button type="button" onClick={() => goTo(step - 1)} className={cn(btn.ghost, 'px-5')}>
                <ArrowLeft className="size-4" />
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" disabled={submitting} className={btn.primary}>
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Sending
                </>
              ) : step === lastStep ? (
                'Submit application'
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <aside className="hidden lg:sticky lg:top-28 lg:block">
        <div className="clip-cut relative aspect-[4/5] overflow-hidden bg-panel">
          <Image
            key={role?.image ?? 'pack'}
            src={role?.image ?? '/art/pack.png'}
            alt=""
            fill
            sizes="26rem"
            className="animate-fade-up object-cover object-[50%_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember">{role?.tag ?? 'Choose a role'}</span>
            <h3 className="display text-5xl text-bone">{role?.name ?? 'Join the pack'}</h3>
            <ul className="flex flex-col gap-1.5 text-sm text-bone/75">
              {(role?.traits ?? ['Every application is read by the manager', 'Reply within 7 to 14 days', 'Free to apply. Always.']).map((trait) => (
                <li key={trait} className="flex items-center gap-2">
                  <span className="size-1.5 shrink-0 bg-ember" />
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
