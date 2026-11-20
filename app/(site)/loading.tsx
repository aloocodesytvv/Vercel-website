import { LogoMark } from '@/components/site/logo'

/**
 * Instant loading state for (site) navigation. The dynamic pages
 * (/recruitment, /contact) read searchParams, so they render on the server
 * on each visit — without this, a click could feel like nothing happened
 * while the server responds. This shows immediately instead.
 */
export default function SiteLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-ink px-5" aria-busy="true" aria-label="Loading page">
      <span className="animate-pulse">
        <LogoMark className="size-12" />
      </span>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-mute">Ashen Wings</p>
    </div>
  )
}
