'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { BoardCard, type BoardPost } from '@/components/board/board-card'
import { btn } from '@/lib/ui'
import { cn } from '@/lib/utils'

export function FeaturedSlider() {
  const [posts, setPosts] = useState<BoardPost[]>([])
  const [loaded, setLoaded] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/board-posts')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setPosts(Array.isArray(data.posts) ? data.posts : [])
          setLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (posts.length <= 1) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % posts.length), 5000)
    return () => clearInterval(timer)
  }, [posts.length])

  if (!loaded) {
    return <div aria-hidden="true" className="h-[26rem] animate-pulse border border-white/10 bg-panel/60" />
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-[26rem] flex-col items-start justify-center gap-5 border border-gold/50 bg-panel p-8">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-gold">★ Featured orgs</p>
        <h2 className="display text-4xl leading-none text-bone md:text-5xl">
          Your org
          <br />
          here.
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-mute">
          Post your requirement on the board and get featured on this page for 2, 3, 4 or 7 days.
        </p>
        <Link href="/board" className={btn.primary}>
          Post on the board
          <ArrowRight className="size-4" />
        </Link>
      </div>
    )
  }

  const n = posts.length
  const prev = posts[(index - 1 + n) % n]
  const current = posts[index]
  const next = posts[(index + 1) % n]

  return (
    <div className="flex flex-col gap-4" aria-label="Featured organisations">
      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-gold">★ Featured orgs</p>
        <Link href="/board" className="text-xs font-bold uppercase tracking-[0.2em] text-ember transition-colors hover:text-bone">
          See the board →
        </Link>
      </div>

      <div className="grid items-center gap-3 lg:grid-cols-[0.75fr_1.25fr_0.75fr]">
        <div key={`prev-${prev.id}`} className="hidden opacity-60 lg:block">
          <BoardCard post={prev} />
        </div>
        <div key={`current-${current.id}`} className="animate-fade-up">
          <BoardCard post={current} tall />
        </div>
        <div key={`next-${next.id}`} className="hidden opacity-60 lg:block">
          <BoardCard post={next} />
        </div>
      </div>

      {n > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {posts.map((post, i) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show featured post ${i + 1}`}
                className={cn('h-1.5 transition-all', i === index ? 'w-6 bg-gold' : 'w-3 bg-white/20 hover:bg-white/40')}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((index - 1 + n) % n)}
              aria-label="Previous featured org"
              className="flex size-9 items-center justify-center border border-white/15 text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((index + 1) % n)}
              aria-label="Next featured org"
              className="flex size-9 items-center justify-center border border-white/15 text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
