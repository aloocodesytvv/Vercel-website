'use client'

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, ImagePlus, LoaderCircle, X } from 'lucide-react'
import { DropdownField, TextAreaField, TextField } from '@/components/forms/controls'
import { boardCategories, boardContactMethods, boardDurations, boardFeaturedPrices, boardPostTypeLabel, boardPostTypes, experienceLevels, ranks, roles, type BoardCategory, type BoardPostType } from '@/lib/site'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { emptyBoardPost, validateBoardPost, type BoardPostErrors, type BoardPostInput } from '@/lib/validation'

const roleOptions = [
  ...roles.filter((role) => role.player).map((role) => ({ value: role.id, label: role.name })),
  { value: 'staff', label: 'Staff & Creators' },
]
const rankOptions = ranks.map((rank) => ({ value: rank, label: rank }))
const experienceOptions = experienceLevels.map((level) => ({ value: level.value, label: level.label }))
const sellsOptions = [
  { value: 'MLBB IDs', label: 'MLBB IDs' },
  { value: 'Diamonds', label: 'Diamonds' },
  { value: 'MLBB IDs + Diamonds', label: 'MLBB IDs + Diamonds' },
  { value: 'Accounts', label: 'Accounts' },
  { value: 'Other', label: 'Other' },
]

const MAX_LOGO_BYTES = 500_000

export function BoardForm({
  adminSubmit,
}: {
  // When set, the form runs in admin mode: the owner adds a featured post
  // himself (goes live straight away, free) instead of sending it for review.
  adminSubmit?: (input: BoardPostInput) => Promise<{ ok: boolean; errors?: BoardPostErrors }>
}) {
  const adminMode = Boolean(adminSubmit)
  const [values, setValues] = useState<BoardPostInput>({
    ...emptyBoardPost,
    featuredDays: adminMode ? 3 : 0,
  })
  const [errors, setErrors] = useState<BoardPostErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [logoError, setLogoError] = useState('')
  const [sent, setSent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const category = values.category as BoardCategory
  const postType = (values.postType === 'promote' ? 'promote' : 'requirement') as BoardPostType
  const isPromote = postType === 'promote'
  const contactMethod = boardContactMethods.find((method) => method.id === values.contactType) ?? boardContactMethods[0]
  const featuringOptions = adminMode ? boardDurations.filter((days) => days > 0) : boardDurations

  const set = <K extends keyof BoardPostInput>(key: K, value: BoardPostInput[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }

  const onLogoFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('That image is too big. Please use one under 500 KB.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose an image file.')
      return
    }
    setLogoError('')
    const reader = new FileReader()
    reader.onload = () => set('logo', String(reader.result ?? ''))
    reader.readAsDataURL(file)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateBoardPost(values)
    setErrors(found)
    if (Object.keys(found).length) return
    setSubmitting(true)
    setServerError('')
    try {
      if (adminSubmit) {
        // The server action redirects to /admin/board on success.
        const result = await adminSubmit(values)
        if (result.errors) {
          setErrors(result.errors)
        } else if (!result.ok) {
          setServerError('Something went wrong. Please try again.')
        }
        return
      }
      const response = await fetch('/api/board-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (data.ok) {
        setSent(true)
      } else if (data.errors) {
        setErrors(data.errors)
      } else {
        setServerError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setServerError('Network error. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-5 border border-gold/50 bg-panel p-8 md:p-10">
        <span className="flex size-14 items-center justify-center bg-ember text-ink">
          <Check className="size-7" />
        </span>
        <h2 className="display text-4xl text-bone md:text-5xl">Sent for review.</h2>
        <p className="max-w-lg text-base leading-relaxed text-mute">
          Thanks, {values.orgName}. The manager reviews every post before it goes live on the board and the landing page. If it is
          approved, it will appear with the featuring you chose.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({ ...emptyBoardPost })
            setErrors({})
            setSent(false)
          }}
          className={btn.ghost}
        >
          Post another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8 border border-white/10 bg-panel p-6 md:p-10">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => set('website', event.target.value)}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-bone">What are you?</legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="What are you?">
          {boardCategories.map((item) => {
            const active = category === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  set('category', item.id)
                  // Only organisations choose — everyone else promotes.
                  set('postType', item.id === 'organisation' ? 'requirement' : 'promote')
                }}
                aria-pressed={active}
                className={cn(
                  'border px-4 py-2.5 text-sm font-bold transition-colors',
                  active ? 'border-ember bg-ember/15 text-bone' : 'border-white/10 bg-transparent text-mute hover:border-white/30 hover:text-bone',
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        {errors.category && (
          <p role="alert" className="text-xs font-medium text-red-400">
            {errors.category}
          </p>
        )}
      </fieldset>

      {category === 'organisation' && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-bone">What do you want to do?</legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label="What do you want to do?">
            {boardPostTypes.map((item) => {
              const active = postType === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => set('postType', item.id)}
                  aria-pressed={active}
                  className={cn(
                    'flex flex-col items-start gap-0.5 border px-4 py-2.5 text-left transition-colors',
                    active ? 'border-ember bg-ember/15 text-bone' : 'border-white/10 bg-transparent text-mute hover:border-white/30 hover:text-bone',
                  )}
                >
                  <span className="text-sm font-bold">{boardPostTypeLabel(category, item.id)}</span>
                  <span className="text-xs font-normal text-mute">{item.hint}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="orgName"
          label={category === 'store' ? 'Store name' : category === 'organisation' ? 'Organisation name' : 'Your name'}
          placeholder="e.g. Crimson Falcons"
          value={values.orgName}
          error={errors.orgName}
          onChange={(event) => set('orgName', event.target.value)}
        />
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-bone">How can people reach you?</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Contact method">
            {boardContactMethods.map((method) => {
              const active = values.contactType === method.id
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => set('contactType', method.id)}
                  aria-pressed={active}
                  className={cn(
                    'border px-4 py-2.5 text-sm font-bold transition-colors',
                    active ? 'border-ember bg-ember/15 text-bone' : 'border-white/10 bg-transparent text-mute hover:border-white/30 hover:text-bone',
                  )}
                >
                  {method.label}
                </button>
              )
            })}
          </div>
          <TextField
            id="contact"
            label={contactMethod.label}
            placeholder={contactMethod.placeholder}
            hint={contactMethod.hint}
            value={values.contact}
            error={errors.contact}
            onChange={(event) => set('contact', event.target.value)}
          />
        </div>
      </div>

      <TextField
        id="title"
        label={isPromote ? 'Headline' : 'Requirement title'}
        placeholder={
          isPromote
            ? category === 'organisation'
              ? 'e.g. Three lineups, trials open, join the family'
              : category === 'coach'
                ? 'e.g. I coach drafting and macro play'
                : category === 'analyst'
                  ? 'e.g. VOD review and opponent scouting'
                  : category === 'caster'
                    ? 'e.g. English + Hindi caster for tournaments'
                    : category === 'store'
                      ? 'e.g. Cheap diamonds, instant delivery'
                      : 'e.g. Daily Mythic rank push streams'
            : 'e.g. Roamer required for second lineup'
        }
        value={values.title}
        error={errors.title}
        onChange={(event) => set('title', event.target.value)}
      />

      <TextAreaField
        id="detail"
        label="Short line"
        rows={3}
        maxLength={400}
        placeholder={isPromote ? 'One or two lines about what you offer.' : 'One or two lines about what you need or offer.'}
        value={values.detail}
        error={errors.detail}
        onChange={(event) => set('detail', event.target.value)}
      />

      {category === 'organisation' && !isPromote && (
        <div className="grid gap-6 sm:grid-cols-2">
          <DropdownField
            id="roleNeeded"
            label="Role needed"
            options={roleOptions}
            value={values.roleNeeded}
            error={errors.roleNeeded}
            onValueChange={(value) => set('roleNeeded', value)}
          />
          <DropdownField
            id="rank"
            label="Rank"
            options={rankOptions}
            value={values.rank}
            error={errors.rank}
            onValueChange={(value) => set('rank', value)}
          />
        </div>
      )}

      {(category === 'coach' || category === 'analyst') && (
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id="speciality"
            label={category === 'coach' ? 'What do you coach?' : 'What do you analyse?'}
            placeholder={category === 'coach' ? 'e.g. Drafting and macro play' : 'e.g. Opponent scouting and VOD review'}
            value={values.speciality}
            error={errors.speciality}
            onChange={(event) => set('speciality', event.target.value)}
          />
          <DropdownField
            id="experience"
            label="Experience"
            options={experienceOptions}
            value={values.experience}
            error={errors.experience}
            onValueChange={(value) => set('experience', value)}
          />
        </div>
      )}

      {category === 'caster' && (
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id="languages"
            label="Languages you cast in"
            placeholder="e.g. English, Hindi"
            value={values.languages}
            error={errors.languages}
            onChange={(event) => set('languages', event.target.value)}
          />
          <DropdownField
            id="experience"
            label="Experience"
            options={experienceOptions}
            value={values.experience}
            error={errors.experience}
            onValueChange={(value) => set('experience', value)}
          />
        </div>
      )}

      {category === 'store' && (
        <div className="grid gap-6 sm:grid-cols-2">
          <DropdownField
            id="sells"
            label="What do you sell?"
            options={sellsOptions}
            value={values.sells}
            error={errors.sells}
            onValueChange={(value) => set('sells', value)}
          />
          <TextField
            id="buyHow"
            label="How to buy"
            placeholder="e.g. DM on Instagram, pay via UPI"
            value={values.buyHow}
            error={errors.buyHow}
            onChange={(event) => set('buyHow', event.target.value)}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-bone">
          Logo / picture <span className="text-[0.65rem] font-medium normal-case tracking-normal text-mute">Optional — shows as your avatar only</span>
        </span>
        <div className="flex items-center gap-4">
          {values.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={values.logo} alt="Logo preview" className="size-16 shrink-0 object-cover ring-1 ring-white/15" />
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center bg-panel-2 text-2xl font-bold text-gold ring-1 ring-white/15">
              {(values.orgName.trim().charAt(0) || '?').toUpperCase()}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogoFile} />
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className={cn(btn.ghost, 'px-4 py-2.5 text-xs')}>
                <ImagePlus className="size-4" />
                {values.logo ? 'Change logo' : 'Upload logo'}
              </button>
              {values.logo && (
                <button type="button" onClick={() => set('logo', '')} className={cn(btn.ghost, 'px-4 py-2.5 text-xs')} aria-label="Remove logo">
                  <X className="size-4" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-mute">Your picture is only the small avatar tile on the card, never across the banner. Max 500 KB.</p>
          </div>
        </div>
        {logoError && (
          <p role="alert" className="text-xs font-medium text-red-400">
            {logoError}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-bone">Featuring</legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Featuring duration">
          {featuringOptions.map((days) => {
            const active = values.featuredDays === days
            return (
              <button
                key={days}
                type="button"
                onClick={() => set('featuredDays', days)}
                aria-pressed={active}
                className={cn(
                  'border px-4 py-2.5 text-sm font-bold transition-colors',
                  active ? 'border-gold bg-gold/15 text-gold' : 'border-white/10 bg-transparent text-mute hover:border-white/30 hover:text-bone',
                )}
              >
                {days === 0 ? 'Standard listing' : `${days} day${days === 1 ? '' : 's'} — ₹${boardFeaturedPrices[days]}`}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-mute">
          {adminMode
            ? 'Free — you add it yourself, no payment. It shows in gold at the top of the board and the landing page.'
            : 'Featured posts are highlighted in gold and pinned at the top of the board and the landing page.'}
        </p>
      </fieldset>

      {serverError && (
        <p role="alert" className="border-l-2 border-red-500 bg-red-500/10 p-4 text-sm text-red-300">
          {serverError}
        </p>
      )}

      <div className="flex items-center justify-end border-t border-white/10 pt-6">
        <button type="submit" disabled={submitting} className={btn.primary}>
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Sending
            </>
          ) : adminMode ? (
            'Add featured post'
          ) : (
            'Send for review'
          )}
        </button>
      </div>
    </form>
  )
}
