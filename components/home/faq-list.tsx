import { Plus } from 'lucide-react'

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span className="text-base font-semibold text-bone transition-colors group-hover:text-ember md:text-lg">{item.q}</span>
            <Plus className="size-5 shrink-0 text-ember transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="max-w-2xl pb-6 text-sm leading-relaxed text-mute md:text-base">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
