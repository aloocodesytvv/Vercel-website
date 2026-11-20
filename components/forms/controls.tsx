'use client'

import { useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type FieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
  className?: string
}

function Shell({ id, label, hint, error, optional, className, children }: FieldProps & { children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-xs font-bold uppercase tracking-[0.18em] text-bone">
        {label}
        {optional && <span className="text-[0.65rem] font-medium normal-case tracking-normal text-mute">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-mute">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

export function TextField({ id, label, hint, error, optional, className, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Shell {...{ id, label, hint, error, optional, className }}>
      <input id={id} name={id} className="field" aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...props} />
    </Shell>
  )
}

export function TextAreaField({ id, label, hint, error, optional, className, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Shell {...{ id, label, hint, error, optional, className }}>
      <textarea id={id} name={id} className="field min-h-36 resize-y" aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...props} />
    </Shell>
  )
}

export function SelectField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  placeholder = 'Select...',
  options,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly { value: string; label: string }[]; placeholder?: string }) {
  return (
    <Shell {...{ id, label, hint, error, optional, className }}>
      <select id={id} name={id} className="field" aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Shell>
  )
}

/**
 * Custom dropdown that opens as a small box directly under the field.
 * Unlike a native <select>, tapping it never opens the phone's full-screen
 * picker sheet — the list stays anchored to the field.
 */
export function DropdownField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  placeholder = 'Select...',
  options,
  value,
  onValueChange,
}: FieldProps & { options: readonly { value: string; label: string }[]; placeholder?: string; value: string; onValueChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open ])

  return (
    <Shell {...{ id, label, hint, error, optional, className }}>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          onClick={() => setOpen((current) => !current)}
          className={cn('field flex w-full items-center justify-between gap-3 text-left', !selected && 'text-bone/40')}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown className={cn('size-4 shrink-0 text-ember transition-transform duration-200', open && 'rotate-180')} />
        </button>
        {open && (
          <ul
            role="listbox"
            aria-label={label}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-auto border border-white/15 bg-panel shadow-2xl shadow-black/60"
          >
            {options.map((option) => {
              const active = option.value === value
              return (
                <li key={option.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onValueChange(option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/5',
                      active ? 'font-semibold text-ember' : 'text-bone/85',
                    )}
                  >
                    {option.label}
                    {active && <Check className="size-4 shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Shell>
  )
}
