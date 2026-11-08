import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
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
