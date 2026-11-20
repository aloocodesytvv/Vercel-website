'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookImage,
  Camera,
  CircleHelp,
  ClipboardList,
  Handshake,
  Home,
  LayoutGrid,
  MessageCircle,
  MessageSquareText,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type RailItem = {
  href?: string
  label: string
  icon: LucideIcon
  disabled?: boolean
  disabledNote?: string
}

const items: RailItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/board', label: 'Board', icon: LayoutGrid },
  { href: '/recruitment', label: 'Join', icon: UserPlus },
  { href: '/recruitment', label: 'Recruitment', icon: ClipboardList },
  { href: '/partners', label: 'Partners', icon: Handshake },
  { href: '/faq', label: 'FAQ', icon: CircleHelp },
  { href: '/contact', label: 'Contact', icon: MessageSquareText },
  { href: '/media-kit', label: 'Media Kit', icon: BookImage },
]

const socials: RailItem[] = [
  { href: 'https://instagram.com/ashenwings_esp', label: 'Instagram', icon: Camera },
  { label: 'Discord', icon: MessageCircle, disabled: true, disabledNote: 'Soon' },
]

function RailLink({ item, active, vertical }: { item: RailItem; active: boolean; vertical: boolean }) {
  const body = (
    <>
      <item.icon className="size-5" />
      <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] leading-none">{item.label}</span>
      {item.disabledNote && <span className="text-[0.5rem] font-bold uppercase tracking-widest text-ember">{item.disabledNote}</span>}
    </>
  )
  const classes = cn(
    'flex shrink-0 flex-col items-center justify-center gap-1.5 transition-colors',
    vertical ? 'w-full px-1 py-3' : 'min-w-14 px-3 py-2',
    item.disabled ? 'cursor-not-allowed text-mute/50' : active ? 'text-ember' : 'text-mute hover:text-bone',
  )
  if (item.disabled || !item.href) {
    return (
      <span className={classes} aria-disabled="true" title={item.disabled ? `${item.label} — coming soon` : item.label}>
        {body}
      </span>
    )
  }
  const external = item.href.startsWith('http')
  if (external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className={classes}>
        {body}
      </a>
    )
  }
  return (
    <Link href={item.href} aria-label={item.label} aria-current={active ? 'page' : undefined} className={classes}>
      {body}
    </Link>
  )
}

export function IconRail() {
  const pathname = usePathname()
  const isActive = (href?: string) => !!href && !href.startsWith('http') && (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      {/* Desktop: fixed rail on the far left, below the header */}
      <nav
        aria-label="Site sections"
        className="fixed bottom-0 left-0 top-[4.5rem] z-40 hidden w-[4.5rem] flex-col items-center overflow-y-auto border-r border-white/10 bg-ink py-3 md:flex"
      >
        <div className="flex w-full flex-col items-center">
          {items.map((item) => (
            <RailLink key={`${item.label}-${item.href}`} item={item} active={isActive(item.href)} vertical />
          ))}
        </div>
        <div className="mt-auto flex w-full flex-col items-center border-t border-white/10 pt-3">
          {socials.map((item) => (
            <RailLink key={item.label} item={item} active={false} vertical />
          ))}
        </div>
      </nav>

      {/* Mobile: bottom bar with horizontal scroll */}
      <nav
        aria-label="Site sections"
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-1 overflow-x-auto border-t border-white/10 bg-ink/95 px-2 py-1.5 backdrop-blur-xl md:hidden"
      >
        {[...items, ...socials].map((item) => (
          <RailLink key={`${item.label}-${item.href}`} item={item} active={isActive(item.href)} vertical={false} />
        ))}
      </nav>
    </>
  )
}
