'use client'

import Link from 'next/link'
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs'
import { RxArrowRight } from 'react-icons/rx'
import { RiBrainLine, RiLightbulbLine, RiShieldLine } from 'react-icons/ri'
import { RxLightningBolt, RxBarChart } from 'react-icons/rx'

export default function HomePage() {
  const { isSignedIn } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>

      {/* ── Nav ──────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#0070f3',
            boxShadow: '0 0 8px rgba(0,112,243,0.8), 0 0 16px rgba(0,112,243,0.3)',
          }} />
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Digital Twin
          </span>
          <span style={{
            fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace',
          }}>
            v2.0
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isSignedIn ? (
            <>
              <Link href="/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '9px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              }}>
                Dashboard
                <RxArrowRight size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button style={{
                  padding: '6px 14px', borderRadius: '9px', border: 'none',
                  background: 'transparent', color: 'rgba(255,255,255,0.5)',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                }}>
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '7px 16px', borderRadius: '10px', border: 'none',
                  background: '#fff', color: '#000',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                  Get started
                  <RxArrowRight size={13} />
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '160px 24px 100px',
        position: 'relative', zIndex: 10,
      }}>
        {/* Ambient glow behind hero */}
        <div style={{
          position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,112,243,0.1) 0%, transparent 70%)',
        }} />

        {/* Eyebrow badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '99px', marginBottom: '36px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.01em',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#00c951',
            boxShadow: '0 0 6px rgba(0,201,81,0.7)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Fuzzy Logic Engine · Groq AI · v2.0
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ color: '#0070f3' }}>Now available</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          fontWeight: 700,
          letterSpacing: '-0.045em',
          lineHeight: 1.05,
          marginBottom: '20px',
          maxWidth: '700px',
          color: '#fff',
        }}>
          Simulate your
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.45) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            academic future.
          </span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: '17px', lineHeight: 1.7,
          color: 'rgba(255,255,255,0.45)',
          maxWidth: '480px', marginBottom: '36px',
        }}>
          Configure your daily habits and predict performance using a fuzzy logic engine
          and AI-powered insights. Built for students who want clarity, not guesswork.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
          {isSignedIn ? (
            <Link href="/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 26px', borderRadius: '14px',
              background: '#fff', color: '#000',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>
              Open Dashboard <RxArrowRight size={15} />
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 26px', borderRadius: '14px', border: 'none',
                  background: '#fff', color: '#000',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                }}>
                  Start for free <RxArrowRight size={15} />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 26px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                }}>
                  Sign in
                </button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Social proof */}
        <p style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
          Free to use · No credit card required
        </p>
      </section>

      {/* ── Feature cards ────────────────────────────── */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 96px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { Icon: RiBrainLine,     title: 'Fuzzy Logic',        desc: 'Models how study, sleep, stress and leisure interact — realistically.', color: '#0070f3', bg: 'rgba(0,112,243,0.08)',  border: 'rgba(0,112,243,0.15)'  },
            { Icon: RxLightningBolt, title: 'Instant Predictions', desc: 'GPA, burnout risk and performance score computed in under a second.',   color: '#00d8ff', bg: 'rgba(0,216,255,0.08)',  border: 'rgba(0,216,255,0.15)'  },
            { Icon: RxBarChart,      title: 'AI Insights',         desc: 'Groq-powered explanations, 7-day plans and behavioral pattern detection.', color: '#00c951', bg: 'rgba(0,201,81,0.08)',   border: 'rgba(0,201,81,0.15)'   },
            { Icon: RiShieldLine,    title: 'Secure by Default',   desc: 'Clerk authentication. Your data never leaves your session.',             color: '#f5a623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.15)' },
          ].map(({ Icon, title, desc, color, bg, border }) => (
            <div key={title} style={{
              padding: '20px', borderRadius: '14px',
              background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: bg, border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '5px' }}>
                  {title}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.65 }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── App preview ──────────────────────────────── */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 120px', position: 'relative', zIndex: 10 }}>
        <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '20px' }}>
          Live preview
        </p>

        {/* Browser window */}
        <div style={{
          borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          background: '#0a0a0a',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>
          {/* Browser chrome */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 16px',
            background: '#111', borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
            <div style={{
              flex: 1, margin: '0 8px', padding: '4px 12px', borderRadius: '7px', textAlign: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace',
            }}>
              app/dashboard
            </div>
          </div>

          {/* Preview content */}
          <div style={{ padding: '28px' }}>

            {/* Status row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00c951', boxShadow: '0 0 6px rgba(0,201,81,0.7)' }} />
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>Simulation complete</span>
              </div>
              <span style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '99px',
                background: 'rgba(0,201,81,0.1)', border: '1px solid rgba(0,201,81,0.2)',
                color: '#00c951', fontFamily: 'monospace',
              }}>
                Grade A
              </span>
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '16px', fontSize: '28px',
                background: 'rgba(0,201,81,0.08)', border: '1px solid rgba(0,201,81,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
              }}>
                🚀
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>
                Thriving
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                GPA 4.0 · Burnout: Low · Score 92/100
              </div>
            </div>

            {/* Metric bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Study',       value: '8 hrs', pct: 67, color: '#0070f3' },
                { label: 'Sleep',       value: '8 hrs', pct: 80, color: '#00d8ff' },
                { label: 'Performance', value: '92%',   pct: 92, color: '#00c951' },
              ].map(({ label, value, pct, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color }}>{value}</span>
                  </div>
                  <div style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ height: '3px', borderRadius: '99px', width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
              {['Study: 8h', 'Sleep: 8h', 'Stress: Low', 'Leisure: 2h'].map(tag => (
                <span key={tag} style={{
                  fontSize: '11px', padding: '4px 10px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0070f3', boxShadow: '0 0 6px rgba(0,112,243,0.6)' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            Digital Twin · Student Simulation
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {['Fuzzy Logic', 'Groq AI', 'Next.js', 'Clerk'].map(t => (
            <span key={t} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>{t}</span>
          ))}
        </div>
      </footer>

      {/* Pulse animation for eyebrow dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(0,201,81,0.7); }
          50% { opacity: 0.6; box-shadow: 0 0 12px rgba(0,201,81,0.4); }
        }
      `}</style>

    </div>
  )
}