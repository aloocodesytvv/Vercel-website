import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { IconRail } from '@/components/site/icon-rail'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ember focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <IconRail />
      <div className="md:pl-[4.5rem]">
        <main id="main" className="pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
