'use client'

import { useState, type FormEvent } from 'react'
import { LoaderCircle } from 'lucide-react'
import { StatusBadge } from '@/components/site/status-badge'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { TextField } from './controls'

type Result = {
  role: string
  status: string
  label: string
  message: string
  note: string | null
  submitted: string
  updated: string
}

const pipeline = [
  { value: 'new', label: 'Received' },
  { value: 'reviewing', label: 'Review' },
  { value: 'shortlisted', label: 'Shortlist' },
  { value: 'trial', label: 'Trial' },
  { value: 'accepted', label: 'Accepted' },
]

const formatDate = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function StatusForm() {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch('/api/applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email }),
      })
      const data = await response.json()
      if (data.ok) setResult(data)
      else setError(data.error ?? 'Could not find that application.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const activeIndex = result ? pipeline.findIndex((item) => item.value === result.status) : -1
  const offPipeline = result && activeIndex === -1

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={submit} className="flex flex-col gap-6 bg-panel p-6 md:p-10">
        <TextField
          id="code"
          label="Tracking code"
          placeholder="FW-XXXXXX"
          autoCapitalize="characters"
          required
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <TextField
          id="email"
          label="Email used to apply"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {error && (
          <p role="alert" className="border-l-2 border-red-500 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className={btn.primary}>
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {loading ? 'Checking' : 'Check status'}
        </button>
      </form>

      <div aria-live="polite" className="flex min-h-64 flex-col justify-center">
        {result ? (
          <div className="flex flex-col gap-6 border border-white/10 p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-mute">{result.role}</span>
              <StatusBadge status={result.status} />
            </div>
            <p className="display text-4xl text-bone md:text-5xl">{result.label}</p>
            <p className="text-sm leading-relaxed text-mute md:text-base">{result.message}</p>

            {result.note && (
              <p className="border-l-2 border-ember bg-ember/10 p-4 text-sm text-bone/85">
                <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ember">Note from the team</span>
                {result.note}
              </p>
            )}

            {!offPipeline && (
              <ol className="grid grid-cols-5 gap-1.5" aria-label="Application pipeline">
                {pipeline.map((item, index) => (
                  <li key={item.value} className="flex flex-col gap-2">
                    <span className={cn('h-1', index <= activeIndex ? 'bg-ember' : 'bg-white/15')} />
                    <span className={cn('text-[0.6rem] font-bold uppercase tracking-wider', index <= activeIndex ? 'text-bone' : 'text-mute')}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            <p className="text-xs text-mute">
              Submitted {formatDate(result.submitted)} / Updated {formatDate(result.updated)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 border border-dashed border-white/15 p-8 text-mute">
            <p className="display text-3xl text-bone">Where do I stand?</p>
            <p className="text-sm leading-relaxed">
              Enter the tracking code you received after applying, plus the email you used. Your result appears here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
