'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function AdminNav({ unreadMessages, newApplications }: { unreadMessages: number; newApplications: number }) {
  const pathname = usePathname()
  const links = [
    { href: '/admin', label: 'Overview', badge: 0, exact: true },
    { href: '/admin/applications', label: 'Applications', badge: newApplications, exact: false },
    { href: '/admin/messages', label: 'Messages', badge: unreadMessages, exact: false },
  ]
  return (
    <nav aria-label="Admin" className="-mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-colors',
              active ? 'border-ember text-bone' : 'border-transparent text-mute hover:text-bone',
            )}
          >
            {link.label}
            {link.badge > 0 && <span className="bg-ember px-1.5 py-0.5 text-[0.65rem] leading-none text-ink">{link.badge}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
