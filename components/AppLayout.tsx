'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  RxDashboard,
  RxMix,
  RxLightningBolt,
  RxCounterClockwiseClock,
} from 'react-icons/rx'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard',   Icon: RxDashboard            },
  { href: '/simulate',  label: 'Simulate',    Icon: RxMix                  },
  { href: '/insights',  label: 'AI Insights', Icon: RxLightningBolt        },
  { href: '/history',   label: 'History',     Icon: RxCounterClockwiseClock},
]

const footerLinks = [
  { label: 'Groq AI', href: 'https://groq.com'   },
  { label: 'Next.js', href: 'https://nextjs.org' },
  { label: 'Clerk',   href: 'https://clerk.com'  },
]

// ─── Styles ────────────────────────────────────────────────────────

const S = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'var(--bg-base)',
    color: 'var(--text-primary)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },

  nav: {
    position: 'fixed' as const,
    top: 0, left: 0, right: 0,
    zIndex: 50,
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },

  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 10px',
    borderRadius: '8px',
    marginRight: '6px',
    textDecoration: 'none',
    transition: 'background 0.15s',
  },

  logoDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#0070f3',
    boxShadow: '0 0 8px rgba(0,112,243,0.7), 0 0 16px rgba(0,112,243,0.3)',
    flexShrink: 0,
  },

  logoText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ffffff',
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap' as const,
  },

  divider: {
    width: '1px',
    height: '16px',
    background: 'rgba(255,255,255,0.1)',
    marginRight: '6px',
    flexShrink: 0,
  },

  navLink: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: active ? 500 : 400,
    color: active ? '#ffffff' : 'rgba(255,255,255,0.4)',
    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  }),

  main: {
    flex: 1,
    paddingTop: '48px',
    position: 'relative' as const,
    zIndex: 10,
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    position: 'relative' as const,
    zIndex: 10,
  },

  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  footerDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#0070f3',
    boxShadow: '0 0 6px rgba(0,112,243,0.6)',
    flexShrink: 0,
  },

  footerText: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.25)',
  },

  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  footerLink: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.25)',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
}

// ─── Component ─────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={S.root}>

      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.navLeft}>

          {/* Logo */}
          <Link
            href="/"
            style={S.logo}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <div style={S.logoDot} />
            <span style={S.logoText}>CareerCraft</span>
          </Link>

          {/* Divider */}
          <div style={S.divider} />

          {/* Nav links */}
          {navLinks.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                style={S.navLink(active)}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <Icon
                  size={14}
                  style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }}
                />
                {label}
              </Link>
            )
          })}
        </div>

        {/* User button */}
        <UserButton />
      </nav>

      {/* Page content */}
      <main style={S.main}>
        {children}
      </main>

      {/* Footer */}
      <footer style={S.footer}>
        <div style={S.footerLeft}>
          <div style={S.footerDot} />
          <span style={S.footerText}>© 2025 CareerCraft for Students</span>
        </div>

        <div style={S.footerRight}>
          <span style={S.footerText}>Fuzzy Logic</span>
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={S.footerLink}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}