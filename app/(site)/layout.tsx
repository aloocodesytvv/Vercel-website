import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { IconRail } from '@/components/site/icon-rail'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ember focus:px-4 focus:py-2 focus:text-ink lg:focus:left-20"
      >
        Skip to content
      </a>
      <IconRail />
      {/* lg:pl-16 clears the desktop icon rail; pb-16 clears the mobile bottom bar. */}
      <div className="pb-16 lg:pb-0 lg:pl-16">
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </div>
    </>
  )
}
