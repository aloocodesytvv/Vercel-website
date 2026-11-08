import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'
import { Logo } from '@/components/site/logo'
import { adminConfigured, isAdmin } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin login',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect('/admin')
  const configured = adminConfigured()
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center px-5 py-16">
      <Image src="/art/hero-pharsa.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[65%_center] opacity-40" />
      <div className="absolute inset-0 -z-10 bg-ink/80" />
      <div className="clip-cut flex w-full max-w-md flex-col gap-8 bg-panel/95 p-8 backdrop-blur md:p-10">
        <Logo />
        <div className="flex flex-col gap-2">
          <h1 className="display text-5xl text-bone">Admin</h1>
          <p className="text-sm text-mute">Recruitment management for the Ashen Wings manager.</p>
        </div>
        {!configured && (
          <p role="alert" className="border-l-2 border-amber-400 bg-amber-400/10 p-3 text-sm text-amber-200">
            Admin is locked until <code className="font-mono">ADMIN_PASSWORD</code> is added in project Vars.
          </p>
        )}
        <LoginForm />
        <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-mute hover:text-bone">
          Back to site
        </Link>
      </div>
    </main>
  )
}
