import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Libre_Franklin, Newsreader } from 'next/font/google'
import { siteUrl, site } from '@/lib/site'
import './globals.css'

const libre = Libre_Franklin({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-libre' })
const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '500', '600'], variable: '--font-newsreader' })
const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${site.name} | MLBB Esports Organisation`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | MLBB Esports Organisation`,
    description: site.description,
    images: [{ url: '/art/hero-pharsa.jpg', width: 1920, height: 1080 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#0b0b0e',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${libre.variable} ${newsreader.variable} ${barlow.variable}`}>
      <body className="min-h-svh bg-ink text-bone antialiased">{children}</body>
    </html>
  )
}
