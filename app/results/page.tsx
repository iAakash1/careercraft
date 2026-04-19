'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import { useSim } from '@/components/SimProvider'
import { RxReload, RxArrowRight } from 'react-icons/rx'
import { RiSparkling2Line } from 'react-icons/ri'

// ── State config ─────────────────────────────────────────────────────

const STATE_META = {
  thriving:   { emoji: '🚀', label: 'Thriving',   color: '#00c951', bg: 'rgba(0,201,81,0.07)',   border: 'rgba(0,201,81,0.16)'   },
  balanced:   { emoji: '🎓', label: 'Balanced',   color: '#0070f3', bg: 'rgba(0,112,243,0.07)',  border: 'rgba(0,112,243,0.16)'  },
  struggling: { emoji: '⚠️', label: 'Struggling', color: '#f5a623', bg: 'rgba(245,166,35,0.07)', border: 'rgba(245,166,35,0.16)' },
  critical:   { emoji: '🔴', label: 'Critical',   color: '#ff4444', bg: 'rgba(255,68,68,0.07)',  border: 'rgba(255,68,68,0.16)'  },
}

const STATE_DESCS: Record<string, string> = {
  thriving:   'Your habits are well-balanced. Strong study hours, adequate sleep, and low stress set you up for peak performance.',
  balanced:   'Your routine is reasonably balanced. Room to optimize — consider increasing study consistency or sleep quality.',
  struggling: 'Your current pattern shows strain. High stress or insufficient sleep is limiting your academic potential.',
  critical:   'Immediate attention needed. Your habits indicate a high burnout risk that can significantly impair performance.',
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { result, inputs } = useSim()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  // ── Empty state ────────────────────────────────────────────────────
  if (!result) {
    return (
      <AppLayout>
        <div style={{
          maxWidth: '860px', margin: '0 auto', padding: '80px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', marginBottom: '20px',
          }}>
            📊
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: '8px' }}>
            No simulation yet
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '28px' }}>
            Configure your daily habits and run a simulation to see your predicted academic outcomes.
          </p>
          <Link href="/simulate" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '12px',
            background: '#fff', color: '#000',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            Start simulation
            <RxArrowRight size={14} />
          </Link>
        </div>
      </AppLayout>
    )
  }

  const meta = STATE_META[result.twinState]

  return (
    <AppLayout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Page header ─────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px' }}>
              Predicted outcomes
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
              Simulation results
            </h1>
          </div>

          <button
            onClick={() => router.push('/simulate')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            }}
          >
            <RxReload size={13} />
            Re-run
          </button>
        </div>

        {/* ── Hero result card ────────────────────────── */}
        <div style={{
          borderRadius: '16px', padding: '24px', marginBottom: '10px',
          background: meta.bg, border: `1px solid ${meta.border}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>

            {/* Emoji box */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
              background: 'rgba(0,0,0,0.25)', border: `1px solid ${meta.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
            }}>
              {meta.emoji}
            </div>

            {/* Label + description */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: meta.color, letterSpacing: '-0.02em' }}>
                  {meta.label}
                </span>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500,
                  background: 'rgba(0,0,0,0.25)', color: meta.color, border: `1px solid ${meta.border}`,
                }}>
                  {result.twinState}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: '480px' }}>
                {STATE_DESCS[result.twinState]}
              </p>
            </div>

            {/* Grade */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '56px', fontWeight: 800, color: result.gradeColor, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {result.grade}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
                GPA {result.gpa}
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${meta.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
              <span>Performance score</span>
              <span style={{ color: result.gradeColor, fontWeight: 600 }}>{result.perfPct}/100</span>
            </div>
            <div style={{ height: '4px', borderRadius: '99px', background: 'rgba(0,0,0,0.35)' }}>
              <div style={{
                height: '4px', borderRadius: '99px',
                width: `${result.perfPct}%`, background: result.gradeColor,
                transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
          </div>
        </div>

        {/* ── Metric cards ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
          {[
            { label: 'Study',       value: `${inputs.study}`,    unit: 'hrs/day',   sub: 'Daily average', pct: (inputs.study / 12) * 100, color: '#0070f3', icon: '📚' },
            { label: 'Sleep',       value: `${inputs.sleep}`,    unit: 'hrs/night', sub: 'Per night',     pct: (inputs.sleep / 10) * 100, color: '#00d8ff', icon: '🌙' },
            { label: 'Performance', value: `${result.perfPct}`,  unit: '/100',      sub: 'Score',         pct: result.perfPct,             color: result.gradeColor, icon: '🏆' },
            { label: 'Burnout',     value: result.burnout,       unit: '',          sub: `${result.burnPct}% index`, pct: result.burnPct, color: result.burnoutColor, icon: '🧠' },
          ].map(({ label, value, unit, sub, pct, color, icon }) => (
            <div key={label} style={{
              padding: '16px', borderRadius: '14px',
              background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                <span style={{ fontSize: '16px' }}>{icon}</span>
              </div>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ fontSize: '22px', fontWeight: 700, color, letterSpacing: '-0.03em' }}>{value}</span>
                {unit && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginLeft: '4px' }}>{unit}</span>}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginBottom: '12px' }}>{sub}</div>
              <div style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '3px', borderRadius: '99px', width: `${Math.min(pct, 100)}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Suggestions ──────────────────────────────── */}
        <div style={{
          borderRadius: '16px', overflow: 'hidden', marginBottom: '10px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px',
            background: '#111', borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
              Rule-based insights
            </span>
            <span style={{
              fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500,
              background: 'rgba(0,112,243,0.1)', color: '#0070f3', border: '1px solid rgba(0,112,243,0.2)',
            }}>
              {result.suggestions.length} tips
            </span>
          </div>

          {/* Suggestion rows */}
          <div style={{ background: '#0a0a0a' }}>
            {result.suggestions.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '16px 20px',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {/* Icon box */}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                  background: '#111', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', marginTop: '1px',
                }}>
                  {s.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '3px' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                    {s.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Insights CTA ──────────────────────────── */}
        <Link
          href="/insights"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderRadius: '16px',
            background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RiSparkling2Line size={18} style={{ color: '#0070f3' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                Get AI-powered insights
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                Groq · Behavioral analysis · 7-day plan
              </div>
            </div>
          </div>

          <RxArrowRight size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
        </Link>

      </div>
    </AppLayout>
  )
}