'use client'

import { useActionState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { loginAction } from '@/lib/actions'
import { btn } from '@/lib/ui'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined)
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.18em] text-bone">
          Admin password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" aria-invalid={state?.error ? true : undefined} />
        {state?.error && (
          <p role="alert" className="text-xs font-medium text-red-400">
            {state.error}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className={btn.primary}>
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        {pending ? 'Checking' : 'Sign in'}
      </button>
    </form>
  )
}
