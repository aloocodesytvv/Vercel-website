'use client'

import { useEffect, useRef } from 'react'

type Mote = {
  x: number
  y: number
  size: number
  speed: number
  sway: number
  phase: number
  alpha: number
  feather: boolean
  rot: number
  rotSpeed: number
}

/**
 * Ashen drift: wind-blown ash motes and slow feather wisps rising across the
 * hero. Lightweight Canvas 2D — no WebGL, no Three.js. Pauses off-screen and
 * when the tab is hidden, thins out on small screens, and renders nothing
 * when the user prefers reduced motion.
 */
export function AshenDrift({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = false
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const pointer = { x: 0.5, y: 0.5 }
    const motes: Mote[] = []

    const seed = () => {
      const small = width < 720
      const count = small ? 22 : 44
      motes.length = 0
      for (let i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.4 + 0.8,
          speed: Math.random() * 0.28 + 0.08,
          sway: Math.random() * 0.5 + 0.15,
          phase: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.5 + 0.2,
          feather: i % 7 === 0,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.004,
        })
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const drawFeather = (m: Mote) => {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)
      ctx.beginPath()
      ctx.moveTo(0, -7)
      ctx.quadraticCurveTo(5, -2, 0, 7)
      ctx.quadraticCurveTo(-5, -2, 0, -7)
      ctx.fillStyle = `rgba(232, 192, 122, ${m.alpha * 0.5})`
      ctx.fill()
      ctx.restore()
    }

    const tick = (now: number) => {
      if (!running) return
      ctx.clearRect(0, 0, width, height)
      const t = now / 1000
      const px = (pointer.x - 0.5) * 18
      const py = (pointer.y - 0.5) * 10
      for (const m of motes) {
        m.y -= m.speed
        m.x += Math.sin(t * m.sway + m.phase) * 0.25 + px * 0.01
        m.rot += m.rotSpeed
        if (m.y < -12) {
          m.y = height + 10
          m.x = Math.random() * width
        }
        if (m.x < -12) m.x = width + 10
        if (m.x > width + 12) m.x = -10
        const depth = 1 + py * 0.01
        if (m.feather) drawFeather(m)
        else {
          ctx.beginPath()
          ctx.arc(m.x, m.y * depth, m.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(232, 192, 122, ${m.alpha})`
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth
      pointer.y = event.clientY / window.innerHeight
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else stop()
      },
      { threshold: 0 },
    )
    observer.observe(canvas)

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
