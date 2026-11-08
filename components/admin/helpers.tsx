import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function timeAgo(value: string | Date) {
  const seconds = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 1000))
  const units: [number, string][] = [
    [60, 's'],
    [60, 'm'],
    [24, 'h'],
    [7, 'd'],
    [4.35, 'w'],
    [12, 'mo'],
  ]
  let amount = seconds
  for (const [step, label] of units) {
    if (amount < step) return `${Math.floor(amount)}${label} ago`
    amount /= step
  }
  return `${Math.floor(amount)}y ago`
}

export const fullDate = (value: string | Date) =>
  new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export function Rating({ value, className }: { value: number; className?: string }) {
  if (!value) return <span className="text-xs text-mute">Unrated</span>
  return (
    <span className={cn('inline-flex gap-0.5', className)} role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn('size-3.5', n <= value ? 'fill-ember text-ember' : 'text-white/20')} />
      ))}
    </span>
  )
}

export function DiscordDot({ sent }: { sent: boolean }) {
  return (
    <span
      title={sent ? 'Delivered to Discord' : 'Not delivered to Discord'}
      className={cn('inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest', sent ? 'text-emerald-400' : 'text-amber-400')}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {sent ? 'In Discord' : 'Not in Discord'}
    </span>
  )
}
