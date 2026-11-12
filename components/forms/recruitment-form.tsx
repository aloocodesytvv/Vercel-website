'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Copy, LoaderCircle } from 'lucide-react'
import { experienceLevels, getRole, ranks, roles, staffExperienceLevels, staffRoles } from '@/lib/site'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'
import {
  emptyApplication,
  playerSteps,
  staffSteps,
  validateApplication,
  type ApplicationErrors,
  type ApplicationInput,
  type Track,
} from '@/lib/validation'
import { SelectField, TextAreaField, TextField } from './controls'

type StringKey = Exclude<keyof ApplicationInput, 'consent' | 'track'>

const rankOptions = ranks.map((rank) => ({ value: rank, label: rank }))
const experienceOptions = experienceLevels.map((level) => ({ value: level.value, label: level.label }))
const staffExperienceOptions = staffExperienceLevels.map((level) => ({ value: level.value, label: level.label }))
const flexOptions = [
  { value: 'gold', label: 'Gold lane' },
  { value: 'exp', label: 'EXP lane' },
  { value: 'mid', label: 'Mid lane' },
  { value: 'jungle', label: 'Jungle' },
  { value: 'roam', label: 'Roam' },
  { value: 'any', label: 'Any — I flex anywhere' },
]
const shotcallingOptions = [
  { value: 'yes', label: 'Yes — I shot-call' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'no', label: 'No — I follow calls' },
]

const playerRoles = roles.filter((role) => role.player)

const tracks: { id: Track; title: string; image: string; blurb: string; pathway: string[] }[] = [
  {
    id: 'player',
    title: 'Players',
    image: '/art/recruit-players.jpg',
    blurb: 'Five lanes. One founding roster. Rank, hero pool and trial scrims decide it.',
    pathway: ['Replay review', 'Trial scrims, any day', 'Join the roster'],
  },
  {
    id: 'staff',
    title: 'Staff & Creators',
    image: '/art/recruit-staff.jpg',
    blurb: 'Coaches, analysts, managers and creators. Portfolio and a trial task decide it.',
    pathway: ['Portfolio review', 'Interview + trial task', '2-week probation'],
  },
]

export function RecruitmentForm({ initialRole, initialTrack }: { initialRole: string; initialTrack?: string }) {
  const startTrack: Track = initialTrack === 'staff' ? 'staff' : 'player'
  const [track, setTrack] = useState<Track>(startTrack)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<ApplicationInput>({
    ...emptyApplication,
    track: startTrack,
    role: getRole(initialRole)?.id && playerRoles.some((r) => r.id === initialRole) ? initialRole : '',
    staffRole: staffRoles.some((r) => r.id === initialRole) ? initialRole : '',
  })
  const [errors, setErrors] = useState<ApplicationErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const steps = track === 'staff' ? staffSteps : playerSteps
  const role = track === 'staff' ? getRole(values.staffRole) : getRole(values.role)
  const lastStep = steps.length - 1

  const switchTrack = (next: Track) => {
    setTrack(next)
    setStep(0)
    setErrors({})
    setServerError('')
    setValues((current) => ({ ...current, track: next }))
  }

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
    for (const field of steps[index].fields) if (all[field]) scoped[field] = all[field]
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
      const failing = steps.findIndex((item) => item.fields.some((field) => all[field]))
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
        const failing = steps.findIndex((item) => item.fields.some((field) => data.errors[field]))
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
    const pathway = tracks.find((t) => t.id === track)
    return (
      <div ref={topRef} className="scroll-mt-28">
        <div className="clip-cut flex flex-col gap-8 bg-panel p-8 md:p-14">
          <span className="flex size-14 items-center justify-center bg-ember text-ink">
            <Check className="size-7" />
          </span>
          <div className="flex flex-col gap-3">
            <h2 className="display text-5xl text-bone md:text-7xl">Application received.</h2>
            <p className="max-w-lg text-base leading-relaxed text-mute">
              Thanks, {values.name.split(' ')[0]}. Your {track === 'staff' ? 'staff' : 'player'} application for{' '}
              <span className="font-semibold text-bone">{role?.name}</span> is now with the team and has been posted to our private
              review channel.
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
            {pathway?.pathway.map((stage, index) => (
              <li key={stage}>
                {index + 1}. {stage}
                {index === 0 ? ' — the manager reviews your application, usually within 7 to 14 days.' : '.'}
              </li>
            ))}
            <li>If shortlisted, we message you on Discord ({values.discord}). Keep your DMs open.</li>
            <li>Track progress any time on the status page.</li>
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
    <div className="flex flex-col gap-10">
      {/* Track switcher */}
      <div className="grid gap-4 sm:grid-cols-2" role="group" aria-label="Choose your track">
        {tracks.map((item) => {
          const active = track === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTrack(item.id)}
              aria-pressed={active}
              className={cn(
                'group relative block overflow-hidden text-left ring-2 transition',
                active ? 'ring-ember' : 'ring-white/10 hover:ring-white/30',
              )}
            >
              <span className="relative block aspect-[16/7] overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className={cn('object-cover object-[50%_20%] transition', active ? 'opacity-90' : 'opacity-50 group-hover:opacity-70')}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="absolute bottom-0 left-0 flex items-center gap-3 p-4">
                  <span className="display text-3xl text-bone md:text-4xl">{item.title}</span>
                  {active && (
                    <span className="flex size-6 items-center justify-center bg-ember text-ink">
                      <Check className="size-4" />
                    </span>
                  )}
                </span>
              </span>
              <span className="block bg-panel p-4">
                <span className="block text-sm leading-relaxed text-mute">{item.blurb}</span>
                <span className="mt-3 flex flex-wrap gap-2">
                  {item.pathway.map((stage, index) => (
                    <span key={stage} className="bg-white/5 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-bone/80">
                      {index + 1}. {stage}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start xl:grid-cols-[1fr_26rem]">
        <div ref={topRef} className="scroll-mt-28">
          <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Application progress">
            {steps.map((item, index) => (
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

            {step === 0 && track === 'player' && (
              <div className="flex flex-col gap-8">
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-bone">Lane you are applying for</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {playerRoles.map((item) => {
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

            {step === 0 && track === 'staff' && (
              <div className="flex flex-col gap-8">
                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-bone">Staff role you are applying for</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {staffRoles.map((item) => {
                      const checked = values.staffRole === item.id
                      return (
                        <label
                          key={item.id}
                          className={cn(
                            'relative block cursor-pointer border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ember',
                            checked ? 'border-ember bg-ember/10' : 'border-white/10 bg-panel hover:border-white/30',
                          )}
                        >
                          <input
                            type="radio"
                            name="staffRole"
                            value={item.id}
                            checked={checked}
                            className="sr-only"
                            onChange={() => {
                              setValues((current) => ({ ...current, staffRole: item.id }))
                              setErrors((current) => ({ ...current, staffRole: undefined }))
                            }}
                          />
                          <span className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-bone">{item.name}</span>
                            <span className="text-xs text-mute">{item.tag}</span>
                            {checked && (
                              <span className="mt-1 flex size-5 items-center justify-center bg-ember text-ink">
                                <Check className="size-3.5" />
                              </span>
                            )}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.staffRole && (
                    <p role="alert" className="text-xs font-medium text-red-400">
                      {errors.staffRole}
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

            {step === 1 && track === 'player' && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField id="ign" label="In-game name" placeholder="Your MLBB nickname" {...bind('ign')} />
                  <SelectField id="rank" label="Current or peak rank" options={rankOptions} {...bind('rank')} />
                  <TextField id="gameId" label="Game ID" inputMode="numeric" placeholder="123456789" {...bind('gameId')} />
                  <TextField id="serverId" label="Server ID" inputMode="numeric" placeholder="1234" {...bind('serverId')} />
                </div>
                <TextField id="mainHeroes" label="Main heroes" placeholder="e.g. Wanwan, Granger, Claude" {...bind('mainHeroes')} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <SelectField id="flexLane" label="Flex lane" options={flexOptions} {...bind('flexLane')} />
                  <SelectField id="shotcalling" label="Shot-calling" options={shotcallingOptions} {...bind('shotcalling')} />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <SelectField id="experience" label="Experience level" options={experienceOptions} {...bind('experience')} />
                  <TextField id="timezone" label="Timezone / country" placeholder="e.g. IST, Philippines" {...bind('timezone')} />
                </div>
                <TextField id="availability" label="Availability" placeholder="e.g. Weekdays 7-11pm, weekends all day" {...bind('availability')} />
              </div>
            )}

            {step === 1 && track === 'staff' && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <SelectField id="experience" label="Experience level" options={staffExperienceOptions} {...bind('experience')} />
                  <TextField id="hours" label="Weekly hours you can commit" placeholder="e.g. 6-8 hours" {...bind('hours')} />
                </div>
                <TextField id="portfolio" label="Portfolio link" placeholder="Drive, YouTube, Behance, portfolio site…" hint="Link to your best work — clips, edits, designs or writing." {...bind('portfolio')} />
                <TextField id="tools" label="Tools & skills" placeholder="e.g. CapCut, Photoshop, OBS, Google Sheets" {...bind('tools')} />
                <TextField id="pastTeams" label="Past teams or projects" optional placeholder="Any orgs, teams or projects you worked with" {...bind('pastTeams')} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField id="availability" label="Availability" placeholder="e.g. Weekdays 7-11pm, weekends all day" {...bind('availability')} />
                  <TextField id="timezone" label="Timezone / country" placeholder="e.g. IST, Philippines" {...bind('timezone')} />
                </div>
              </div>
            )}

            {step === 2 && track === 'player' && (
              <div className="flex flex-col gap-6">
                <TextAreaField
                  id="message"
                  label="Why Ashen Wings?"
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

            {step === 2 && track === 'staff' && (
              <div className="flex flex-col gap-6">
                <TextAreaField
                  id="pitch"
                  label="Your first idea"
                  rows={5}
                  maxLength={800}
                  placeholder="If you joined tomorrow, what is the first thing you would do for Ashen Wings?"
                  hint={`${values.pitch.trim().length}/800 (minimum 30)`}
                  {...bind('pitch')}
                />
                <TextAreaField
                  id="message"
                  label="Tell us about yourself"
                  rows={6}
                  maxLength={1200}
                  placeholder="Who you are, what you have done, and why you want to build with Ashen Wings."
                  hint={`${values.message.trim().length}/1200 (minimum 30)`}
                  {...bind('message')}
                />
                <TextAreaField
                  id="links"
                  label="More links"
                  optional
                  rows={3}
                  placeholder="Extra work, socials or references, one per line"
                  {...bind('links')}
                />
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-6">
                <dl className="flex flex-col divide-y divide-white/10 border border-white/10 bg-panel">
                  {[
                    { label: 'Track', value: track === 'staff' ? 'Staff & Creators' : 'Player', goTo: 0 },
                    { label: 'Role', value: role?.name, goTo: 0 },
                    { label: 'Applicant', value: `${values.name}, ${values.age}`, goTo: 0 },
                    { label: 'Contact', value: `${values.email} / ${values.discord}`, goTo: 0 },
                    track === 'staff'
                      ? { label: 'Experience', value: `${values.experience} · ${values.hours}`, goTo: 1 }
                      : { label: 'Game profile', value: [values.ign, values.rank, values.mainHeroes].filter(Boolean).join(' / ') || 'Not provided', goTo: 1 },
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
                      className="mt-1 size-5 shrink-0 accent-[#c97b2d]"
                    />
                    I confirm the information is accurate, and I agree that Ashen Wings may store it and share it with the team to review my application.
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
              key={role?.image ?? track}
              src={role?.image ?? (track === 'staff' ? '/art/recruit-staff.jpg' : '/art/recruit-players.jpg')}
              alt=""
              fill
              sizes="26rem"
              className="animate-fade-up object-cover object-[50%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ember">{role?.tag ?? (track === 'staff' ? 'Staff & Creators' : 'Players')}</span>
              <h3 className="display text-5xl text-bone">{role?.name ?? 'Join Ashen Wings'}</h3>
              <ul className="flex flex-col gap-1.5 text-sm text-bone/75">
                {(('traits' in (role ?? {}) ? (role as { traits: string[] }).traits : null) ??
                  (track === 'staff'
                    ? ['Portfolio review, not rank', 'Interview + trial task', '2-week probation']
                    : ['Every application is read by the manager', 'Reply within 7 to 14 days', 'Free to apply. Always.'])).map((trait) => (
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
    </div>
  )
}
