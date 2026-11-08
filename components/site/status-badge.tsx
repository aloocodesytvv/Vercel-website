import { getStatus } from '@/lib/site'
import { cn } from '@/lib/utils'

const tones: Record<string, string> = {
  ember: 'bg-ember/15 text-ember-soft ring-ember/40',
  sky: 'bg-sky-500/15 text-sky-300 ring-sky-400/40',
  amber: 'bg-amber-500/15 text-amber-300 ring-amber-400/40',
  violet: 'bg-violet-500/15 text-violet-300 ring-violet-400/40',
  green: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40',
  slate: 'bg-slate-500/15 text-slate-300 ring-slate-400/40',
  red: 'bg-red-500/15 text-red-300 ring-red-400/40',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const info = getStatus(status)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.15em] ring-1 ring-inset',
        tones[info.tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {info.label}
    </span>
  )
}
