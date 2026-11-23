import type { Metadata } from 'next'
import Link from 'next/link'
import { BoardForm } from '@/components/board/board-form'
import { addBoardPostAction } from '@/lib/actions'

export const metadata: Metadata = { title: 'Add featured post' }

export default function AdminBoardNewPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Board · Add it yourself</p>
        <h1 className="display text-5xl text-bone md:text-7xl">Add a featured post</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-mute">
          Post a gold featured ad for another organisation yourself — it goes live on the board and the landing page straight
          away, for free. No payment, no review queue. Pick 1 to 7 days of featuring; you can lower it, extend it or remove it
          later from the board list.
        </p>
        <p>
          <Link href="/admin/board" className="text-xs font-bold uppercase tracking-[0.2em] text-ember hover:text-bone">
            ← Back to board posts
          </Link>
        </p>
      </div>
      <BoardForm adminSubmit={addBoardPostAction} />
    </div>
  )
}
