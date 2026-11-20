'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Gentle reveal-on-scroll: transform + opacity only, no layout shift.
 * SSR / no-JS safe — content renders visible by default and is hidden only
 * after mount when it is below the fold. Respects prefers-reduced-motion
 * (shows immediately, no animation).
 */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'hidden' | 'visible'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('visible')
      return
    }
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setState('visible')
      return
    }
    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setState('visible')
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn('reveal', state === 'hidden' && 'reveal-hidden', state === 'visible' && 'reveal-visible', className)}
    >
      {children}
    </div>
  )
}
