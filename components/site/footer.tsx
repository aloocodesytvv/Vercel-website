import Link from 'next/link'
import { roles, site, socialLinks } from '@/lib/site'
import { Logo } from './logo'

export function Footer() {
  const socials = socialLinks()
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-panel">
      <p
        aria-hidden="true"
        className="display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(5rem,22vw,20rem)] text-white/[0.03]"
      >
        {site.name}
      </p>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div className="flex max-w-sm flex-col gap-5">
          <Logo />
          <p className="text-sm leading-relaxed text-mute">
            A young, hungry {site.game} esports organisation. We are building the roster one player, one creator and one partner at a time.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Explore</h2>
          <ul className="flex flex-col gap-3 text-sm text-mute">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/recruitment/status" className="transition-colors hover:text-bone">
                Check application
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Open roles</h2>
          <ul className="flex flex-col gap-3 text-sm text-mute">
            {roles.map((role) => (
              <li key={role.id}>
                <Link
                  href={role.player ? `/recruitment?track=player&role=${role.id}` : '/recruitment?track=staff'}
                  className="transition-colors hover:text-bone"
                >
                  {role.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-ember">Connect</h2>
          <ul className="flex flex-col gap-3 text-sm text-mute">
            <li>
              <Link href="/contact?topic=partnership" className="transition-colors hover:text-bone">
                Partnerships
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-bone">
                Contact the manager
              </Link>
            </li>
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bone">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-mute md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved. Not affiliated with Moonton. Hero artwork &copy; Moonton,
            used for identification.
          </p>
          <Link href="/admin" className="transition-colors hover:text-bone">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  )
}
