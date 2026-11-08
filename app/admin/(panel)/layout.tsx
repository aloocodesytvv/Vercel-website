import type { Metadata } from 'next'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { AdminNav } from '@/components/admin/admin-nav'
import { Logo } from '@/components/site/logo'
import { logoutAction } from '@/lib/actions'
import { requireAdmin } from '@/lib/auth'
import { ensureSchema, getSql } from '@/lib/db'
import { discordConfigured } from '@/lib/discord'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Fnatic Wolf Admin' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  await ensureSchema()
  const sql = getSql()
  const [apps, messages] = await Promise.all([
    sql`SELECT COUNT(*)::int AS n FROM applications WHERE status = 'new'`,
    sql`SELECT COUNT(*)::int AS n FROM contact_messages WHERE status = 'new'`,
  ])

  return (
    <div className="min-h-svh bg-ink">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pt-3 md:flex-row md:items-center md:justify-between md:px-8 md:pt-0">
          <div className="flex items-center justify-between gap-6">
            <Link href="/admin" aria-label="Admin overview">
              <Logo />
            </Link>
            <form action={logoutAction} className="md:hidden">
              <button type="submit" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute hover:text-bone">
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
          <AdminNav unreadMessages={messages[0].n} newApplications={apps[0].n} />
          <div className="hidden items-center gap-5 md:flex">
            <Link href="/" target="_blank" className="text-xs font-bold uppercase tracking-widest text-mute hover:text-bone">
              View site
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute hover:text-bone">
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {!discordConfigured() && (
        <p className="border-b border-amber-400/30 bg-amber-400/10 px-5 py-2.5 text-center text-xs text-amber-200">
          Discord alerts are off. Add <code className="font-mono">DISCORD_WEBHOOK_URL</code> in project Vars to receive embeds.
        </p>
      )}
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">{children}</main>
    </div>
  )
}
