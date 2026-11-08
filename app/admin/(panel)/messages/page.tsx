import type { Metadata } from 'next'
import { Mail, Trash2 } from 'lucide-react'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { DiscordDot, timeAgo } from '@/components/admin/helpers'
import { deleteMessageAction, setMessageStatusAction } from '@/lib/actions'
import { ensureSchema, getSql, type MessageRow } from '@/lib/db'
import { topics } from '@/lib/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  await ensureSchema()
  const rows = (await getSql()`SELECT * FROM contact_messages ORDER BY status = 'new' DESC, created_at DESC LIMIT 200`) as MessageRow[]
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Partnerships & enquiries</p>
        <h1 className="display text-5xl text-bone md:text-7xl">Messages</h1>
      </div>

      {rows.length === 0 ? (
        <p className="border border-dashed border-white/15 p-10 text-center text-sm text-mute">No messages yet. Contact form submissions appear here.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((message) => {
            const handled = message.status === 'handled'
            return (
              <li key={message.id} className={cn('flex flex-col gap-4 border bg-panel p-6', handled ? 'border-white/10 opacity-70' : 'border-ember/40')}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-ember/15 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ember-soft">
                        {topics.find((topic) => topic.value === message.topic)?.label ?? message.topic}
                      </span>
                      <DiscordDot sent={message.discord_sent} />
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-bone">
                      {message.name}
                      {message.organisation && <span className="font-normal text-mute"> / {message.organisation}</span>}
                    </h2>
                    <a href={`mailto:${message.email}`} className="flex w-fit items-center gap-2 text-sm text-ember underline-offset-4 hover:underline">
                      <Mail className="size-4" />
                      {message.email}
                    </a>
                  </div>
                  <span className="text-xs text-mute">{timeAgo(message.created_at)}</span>
                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-bone/85">{message.message}</p>

                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                  <form action={setMessageStatusAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <input type="hidden" name="status" value={handled ? 'new' : 'handled'} />
                    <button type="submit" className="text-xs font-bold uppercase tracking-widest text-bone hover:text-ember">
                      {handled ? 'Mark as new' : 'Mark as handled'}
                    </button>
                  </form>
                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <ConfirmButton message="Delete this message permanently?" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300">
                      <Trash2 className="size-4" />
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
