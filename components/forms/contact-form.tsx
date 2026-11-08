'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { topics } from '@/lib/site'
import { btn } from '@/lib/ui'
import { emptyContact, validateContact, type ContactErrors, type ContactInput } from '@/lib/validation'
import { SelectField, TextAreaField, TextField } from './controls'

const topicOptions = topics.map((topic) => ({ value: topic.value, label: topic.label }))

export function ContactForm({ initialTopic }: { initialTopic: string }) {
  const [values, setValues] = useState<ContactInput>({
    ...emptyContact,
    topic: topics.some((topic) => topic.value === initialTopic) ? initialTopic : 'partnership',
  })
  const [errors, setErrors] = useState<ContactErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [sent, setSent] = useState(false)

  const bind = (key: Exclude<keyof ContactInput, 'website'>) => ({
    value: values[key],
    error: errors[key],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [key]: value }))
      setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
    },
  })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateContact(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(first)?.focus()
      return
    }
    setLoading(true)
    setServerError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (data.ok) setSent(true)
      else if (data.errors) setErrors(data.errors)
      else setServerError(data.error ?? 'Something went wrong. Please try again.')
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="clip-cut flex flex-col gap-5 bg-panel p-8 md:p-12">
        <span className="flex size-14 items-center justify-center bg-ember text-ink">
          <Check className="size-7" />
        </span>
        <h2 className="display text-5xl text-bone">Message sent.</h2>
        <p className="max-w-md text-mute">
          Thanks, {values.name.split(' ')[0]}. The manager has your message and will reply to {values.email}, usually within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="clip-cut flex flex-col gap-6 bg-panel p-6 md:p-10">
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
      <SelectField id="topic" label="Topic" options={topicOptions} placeholder="Choose a topic" {...bind('topic')} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="name" label="Your name" autoComplete="name" {...bind('name')} />
        <TextField id="email" label="Email" type="email" autoComplete="email" {...bind('email')} />
      </div>
      <TextField id="organisation" label="Organisation / brand" optional autoComplete="organization" {...bind('organisation')} />
      <TextAreaField id="message" label="Message" rows={6} placeholder="How can we work together?" {...bind('message')} />
      {serverError && (
        <p role="alert" className="border-l-2 border-red-500 bg-red-500/10 p-3 text-sm text-red-300">
          {serverError}
        </p>
      )}
      <button type="submit" disabled={loading} className={btn.primary}>
        {loading && <LoaderCircle className="size-4 animate-spin" />}
        {loading ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}
