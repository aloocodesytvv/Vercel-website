'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleHelp, Home, Lightbulb, MessageSquare, Search, UserPlus, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoMark } from './logo'

type RailItem = {
  href: string
  label: string
  short: string
  icon: LucideIcon
}

const items: RailItem[] = [
  { href: '/', label: 'Home', short: 'Home', icon: Home },
  { href: '/recruitment', label: 'Apply', short: 'Apply', icon: UserPlus },
  { href: '/recruitment/status', label: 'Track status', short: 'Track', icon: Search },
  { href: '/faq', label: 'FAQ', short: 'FAQ', icon: CircleHelp },
  { href: '/contact', label: 'Contact', short: 'Contact', icon: MessageSquare },
  { href: '/#process', label: 'How trials work', short: 'Guide', icon: Lightbulb },
]

export function IconRail() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/#process') return false
    if (href === '/recruitment/status') return pathname === '/recruitment/status'
    if (href === '/recruitment') return pathname === '/recruitment'
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop: slim fixed icon rail on the left edge */}
      <nav aria-label="Quick links" className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center border-r border-white/10 bg-ink/90 backdrop-blur-xl lg:flex">
        <Link href="/" aria-label="Ashen Wings home" className="mt-4 flex size-11 items-center justify-center">
          <LogoMark className="size-9" />
        </Link>
        <ul className="flex flex-1 flex-col items-center justify-center gap-2">
          {items.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex size-11 items-center justify-center rounded-sm text-mute transition-colors duration-200 hover:bg-white/5 hover:text-bone',
                    active && 'bg-ember/10 text-ember',
                  )}
                >
                  <item.icon className="size-5" strokeWidth={1.75} />
                  {active && <span aria-hidden="true" className="absolute -left-[9px] h-6 w-0.5 bg-ember" />}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap border border-white/10 bg-panel px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-bone opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <span aria-hidden="true" className="mb-5 size-1.5 rounded-full bg-ember/70" />
      </nav>

      {/* Mobile: same items as a fixed bottom icon bar */}
      <nav aria-label="Quick links" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 backdrop-blur-xl lg:hidden">
        <ul className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
          {items.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-1 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] transition-colors duration-200',
                    active ? 'text-ember' : 'text-mute hover:text-bone',
                  )}
                >
                  <item.icon className="size-5" strokeWidth={1.75} />
                  {item.short}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
