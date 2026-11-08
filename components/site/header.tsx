'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site } from '@/lib/site'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open ? 'border-b border-white/10 bg-ink/85 backdrop-blur-xl' : 'bg-gradient-to-b from-ink/80 to-transparent',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Ashen Wings home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'relative py-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:text-bone',
                isActive(item.href) ? 'text-bone' : 'text-mute',
              )}
            >
              {item.label}
              <span
                className={cn(
                  'absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-ember transition-transform duration-300',
                  isActive(item.href) ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/recruitment" className={cn(btn.primary, 'hidden px-5 py-3 md:inline-flex')}>
            Apply now
          </Link>
          <button
            type="button"
            className="flex size-11 items-center justify-center text-bone md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="flex h-[calc(100svh-4.5rem)] flex-col justify-between bg-ink px-5 pb-10 pt-6 md:hidden">
          <ul className="flex flex-col">
            {site.nav.map((item, index) => (
              <li key={item.href} className="border-b border-white/10">
                <Link
                  href={item.href}
                  className={cn('display flex items-baseline gap-4 py-5 text-5xl', isActive(item.href) ? 'text-ember' : 'text-bone')}
                >
                  <span className="font-sans text-xs font-bold not-italic tracking-widest text-mute">0{index + 1}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/recruitment" className={cn(btn.primary, 'w-full')}>
            Apply now
          </Link>
        </nav>
      )}
    </header>
  )
}
