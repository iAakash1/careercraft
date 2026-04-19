'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import { useSim } from '@/components/SimProvider'
import { runSimulation } from '@/lib/simulation'
import { useUser } from '@clerk/nextjs'
import { RxLightningBolt, RxArrowRight, RxBarChart } from 'react-icons/rx'
import { RiFlaskLine, RiLightbulbLine } from 'react-icons/ri'

// ── Config ───────────────────────────────────────────────────────────

const DEFAULTS = { study: 6, sleep: 7, leisure: 2, stress: 'medium' as const }

const STATE_META = {
  thriving:   { emoji: '🚀', label: 'Thriving',   color: '#00c951', bg: 'rgba(0,201,81,0.08)',   border: 'rgba(0,201,81,0.18)'   },
  balanced:   { emoji: '🎓', label: 'Balanced',   color: '#0070f3', bg: 'rgba(0,112,243,0.08)',  border: 'rgba(0,112,243,0.18)'  },
  struggling: { emoji: '⚠️', label: 'Struggling', color: '#f5a623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.18)' },
  critical:   { emoji: '🔴', label: 'Critical',   color: '#ff4444', bg: 'rgba(255,68,68,0.08)',  border: 'rgba(255,68,68,0.18)'  },
}

const QUICK_ACTIONS = [
  { href: '/simulate', title: 'Run simulation', desc: 'Configure habits and predict outcomes',      Icon: RiFlaskLine,    color: '#0070f3', bg: 'rgba(0,112,243,0.08)',  border: 'rgba(0,112,243,0.15)'  },
  { href: '/results',  title: 'View results',   desc: 'Detailed breakdown of your last prediction', Icon: RxBarChart,     color: '#00d8ff', bg: 'rgba(0,216,255,0.08)',  border: 'rgba(0,216,255,0.15)'  },
  { href: '/insights', title: 'AI insights',    desc: 'Groq-powered behavioral analysis',           Icon: RiLightbulbLine,color: '#00c951', bg: 'rgba(0,201,81,0.08)',   border: 'rgba(0,201,81,0.15)'   },
]

// ── Helpers ───────────────────────────────────────────────────────────

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMins  = Math.floor((now.getTime() - d.getTime()) / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays  = Math.floor(diffHours / 24)
  if (diffMins < 1)   return 'Just now'
  if (diffMins < 60)  return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7)   return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { result, inputs, history } = useSim()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const preview       = runSimulation(DEFAULTS)
  const displayResult = result || preview
  const displayInputs = result ? inputs : DEFAULTS
  const meta          = STATE_META[displayResult.twinState]
  const isPreview     = !result

  if (!mounted) return null

  const greeting = user
    ? `Good ${getTimeOfDay()}, ${user.firstName || user.username || 'there'}.`
    : 'Dashboard'

  // ── Shared styles ──────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Header ─────────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px',
          }}>
            {isPreview ? 'Preview mode' : 'Last simulation'}
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: '4px' }}>
            {greeting}
          </h1>
          {isPreview && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              Run a simulation to see your personalized results.
            </p>
          )}
        </div>

        {/* ── Twin card ───────────────────────────────── */}
        <div style={{ ...card, padding: '20px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: meta.bg, border: `1px solid ${meta.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>
                {meta.emoji}
              </div>
              {/* Online dot */}
              <div style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                width: '13px', height: '13px', borderRadius: '50%',
                background: meta.color,
                border: '2px solid #0a0a0a',
                boxShadow: `0 0 8px ${meta.color}`,
              }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                  Your Digital Twin
                </span>
                <span style={{
                  fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500,
                  background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
                }}>
                  {meta.label}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                Predicted grade{' '}
                <span style={{ fontWeight: 700, color: displayResult.gradeColor }}>
                  {displayResult.grade}
                </span>
                {' '}· GPA {displayResult.gpa} · Burnout:{' '}
                <span style={{ color: displayResult.burnoutColor }}>
                  {displayResult.burnout}
                </span>
              </p>
            </div>

            {/* Simulate CTA */}
            <Link
              href="/simulate"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0,
                padding: '9px 18px', borderRadius: '12px',
                background: '#fff', color: '#000',
                fontSize: '13px', fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              <RxLightningBolt size={13} />
              Simulate
            </Link>
          </div>

          {/* Performance bar */}
          <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
              <span>Performance score</span>
              <span style={{ color: displayResult.gradeColor, fontWeight: 600 }}>{displayResult.perfPct}/100</span>
            </div>
            <div style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height: '3px', borderRadius: '99px',
                width: `${displayResult.perfPct}%`,
                background: displayResult.gradeColor,
                transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
          </div>
        </div>

        {/* ── Metric grid ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
          {[
            { label: 'Study',       value: `${displayInputs.study}`,    unit: 'hrs/day',                   color: '#0070f3', pct: (displayInputs.study / 12) * 100,   icon: '📚' },
            { label: 'Sleep',       value: `${displayInputs.sleep}`,    unit: 'hrs/night',                 color: '#00d8ff', pct: (displayInputs.sleep / 10) * 100,   icon: '🌙' },
            { label: 'Performance', value: `${displayResult.perfPct}`,  unit: '/ 100',                     color: displayResult.gradeColor,   pct: displayResult.perfPct,  icon: '🏆' },
            { label: 'Burnout',     value: displayResult.burnout,       unit: `${displayResult.burnPct}%`, color: displayResult.burnoutColor, pct: displayResult.burnPct,  icon: '🧠' },
          ].map(({ label, value, unit, color, pct, icon }) => (
            <div key={label} style={{ ...card, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                <span style={{ fontSize: '16px' }}>{icon}</span>
              </div>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ fontSize: '22px', fontWeight: 700, color, letterSpacing: '-0.03em' }}>{value}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginLeft: '4px' }}>{unit}</span>
              </div>
              <div style={{ marginTop: '12px', height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '3px', borderRadius: '99px', width: `${Math.min(pct, 100)}%`, background: color, opacity: 0.75 }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick actions ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '32px' }}>
          {QUICK_ACTIONS.map(({ href, title, desc, Icon, color, bg, border }) => (
            <Link
              key={href}
              href={href}
              style={{
                ...card,
                display: 'block', padding: '20px',
                textDecoration: 'none',
                transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Icon */}
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px', marginBottom: '14px',
                background: bg, border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} style={{ color }} />
              </div>

              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '4px' }}>
                {title}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, marginBottom: '14px' }}>
                {desc}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, color }}>
                Open <RxArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Recent history ──────────────────────────── */}
        {history.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Recent simulations
              </span>
              <Link
                href="/history"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
              >
                View all <RxArrowRight size={11} />
              </Link>
            </div>

            <div style={{ ...card, overflow: 'hidden' }}>
              {history.slice(0, 3).map((entry, i) => {
                const m = STATE_META[entry.result.twinState]
                return (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 18px',
                      borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      transition: 'background 0.15s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* State icon */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: m.bg, border: `1px solid ${m.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                    }}>
                      {m.emoji}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>
                        Grade {entry.result.grade}
                        <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.35)' }}>
                          {' '}· {entry.result.burnout} burnout
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                        {formatDate(entry.date)} · Study {entry.inputs.study}h · Sleep {entry.inputs.sleep}h
                      </div>
                    </div>

                    {/* Grade badge */}
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 700,
                      color: entry.result.gradeColor,
                      background: `${entry.result.gradeColor}14`,
                      border: `1px solid ${entry.result.gradeColor}28`,
                    }}>
                      {entry.result.grade}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Empty state ──────────────────────────────── */}
        {history.length === 0 && isPreview && (
          <div style={{
            padding: '40px 24px', borderRadius: '16px', textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚡</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '6px' }}>
              Run your first simulation
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px', lineHeight: 1.65 }}>
              Configure your habits and see how your daily routine affects your academic performance.
            </p>
            <Link
              href="/simulate"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '9px 20px', borderRadius: '10px',
                background: '#fff', color: '#000',
                fontSize: '13px', fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              <RxLightningBolt size={13} />
              Start simulation
            </Link>
          </div>
        )}

      </div>
    </AppLayout>
  )
}