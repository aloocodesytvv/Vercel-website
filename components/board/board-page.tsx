'use client'

import { useEffect, useMemo, useState } from 'react'
import { BoardCard, type BoardPost } from '@/components/board/board-card'
import { BoardForm } from '@/components/board/board-form'
import { boardCategories } from '@/lib/site'
import { cn } from '@/lib/utils'

export function BoardPage() {
  const [posts, setPosts] = useState<BoardPost[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState('')

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

  const visible = useMemo(() => (filter ? posts.filter((post) => post.category === filter) : posts), [posts, filter])

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setFilter('')}
            aria-pressed={filter === ''}
            className={cn(
              'border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors',
              filter === '' ? 'border-ember bg-ember/15 text-bone' : 'border-white/10 text-mute hover:border-white/30 hover:text-bone',
            )}
          >
            All ({posts.length})
          </button>
          {boardCategories.map((item) => {
            const count = posts.filter((post) => post.category === item.id).length
            const active = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={cn(
                  'border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors',
                  active ? 'border-ember bg-ember/15 text-bone' : 'border-white/10 text-mute hover:border-white/30 hover:text-bone',
                )}
              >
                {item.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {!loaded ? (
        <p className="border border-dashed border-white/15 p-8 text-sm text-mute">Loading the board…</p>
      ) : visible.length === 0 ? (
        <p className="border border-dashed border-white/15 p-8 text-sm text-mute">
          {filter ? 'Nothing in this category yet.' : 'No posts on the board yet. Be the first to post below.'}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BoardCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Post on the board</p>
          <h2 className="display text-4xl text-bone md:text-5xl">Put it on the board.</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-mute">
            Organisations, coaches, analysts, casters, streamers and stores can promote themselves or post a requirement here. Every
            post is reviewed by the manager before it goes live.
          </p>
        </div>
        <BoardForm />
      </section>
    </div>
  )
}
