'use client'

import { useState } from 'react'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import { useSim } from '@/components/SimProvider'
import { RxLightningBolt, RxReader, RxCalendar, RxStarFilled } from 'react-icons/rx'
import { RiSparkling2Line } from 'react-icons/ri'
import type { SimResult, SimInputs } from '@/lib/simulation'

type Mode = 'insights' | 'explain' | 'plan'

// ── Prompt builder ───────────────────────────────────────────────────

function buildMessages(mode: Mode, result: SimResult, inputs: SimInputs, brutal: boolean) {
  const ctx = `Student digital twin data:
- Study: ${inputs.study}h/day | Sleep: ${inputs.sleep}h/night | Leisure: ${inputs.leisure}h/day | Stress: ${inputs.stress}
- Predicted grade: ${result.grade} (GPA ${result.gpa}) | Performance: ${result.perfPct}% | Burnout: ${result.burnout} (${result.burnPct}%)`
  const tone = brutal
    ? 'Be brutally honest, direct, and unsparing. No sugarcoating whatsoever.'
    : 'Be balanced, constructive, and encouraging while being truthful.'
  const prompts: Record<Mode, string> = {
    insights: `${ctx}\n\n${tone}\n\nProvide 5 structured academic insights. For each, give: a short title, a key finding, and a specific actionable recommendation. Format clearly with numbers.`,
    explain:  `${ctx}\n\n${tone}\n\nExplain in depth WHY these results occurred. Walk through the cause-and-effect chain from each habit input to the final grade and burnout level. Be specific about which inputs matter most.`,
    plan:     `${ctx}\n\n${tone}\n\nCreate a concrete 7-day action plan to improve these results. For each day, give 2-3 specific, time-blocked actions. Make it realistic and immediately actionable.`,
  }
  return [
    { role: 'system', content: 'You are an expert academic performance coach and behavioral scientist. Provide clear, structured, evidence-based analysis.' },
    { role: 'user', content: prompts[mode] },
  ]
}

// ── Config ───────────────────────────────────────────────────────────

const MODES = [
  { id: 'insights' as Mode, Icon: RiSparkling2Line, label: 'Generate insights',  sub: '5 behavioral patterns',     color: '#0070f3', bg: 'rgba(0,112,243,0.08)',  border: 'rgba(0,112,243,0.22)'  },
  { id: 'explain'  as Mode, Icon: RxReader,         label: 'Why this result?',   sub: 'Cause → effect chain',      color: '#00d8ff', bg: 'rgba(0,216,255,0.08)',  border: 'rgba(0,216,255,0.22)'  },
  { id: 'plan'     as Mode, Icon: RxCalendar,       label: '7-Day action plan',  sub: 'Time-blocked daily actions', color: '#00c951', bg: 'rgba(0,201,81,0.08)',   border: 'rgba(0,201,81,0.22)'   },
]

const MODE_LABELS: Record<Mode, string> = {
  insights: 'Behavioral Insights',
  explain:  'Cause → Effect Analysis',
  plan:     '7-Day Action Plan',
}

const STATE_ICONS: Record<string, string> = {
  thriving: '🚀', balanced: '🎓', struggling: '⚠️', critical: '🔴',
}

// ── Styles ───────────────────────────────────────────────────────────

const page: React.CSSProperties = {
  maxWidth: '860px',
  margin: '0 auto',
  padding: '48px 24px 80px',
}

const card: React.CSSProperties = {
  background: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
}

// ── Spinner ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
      <svg
        width="40" height="40" viewBox="0 0 40 40" fill="none"
        style={{ animation: 'spin 1.4s linear infinite', display: 'block' }}
      >
        <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <path d="M20 4a16 16 0 0 1 16 16" stroke="#0070f3" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0070f3',
      }}>
        <RiSparkling2Line size={14} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const { result, inputs } = useSim()
  const [brutal, setBrutal]   = useState(false)
  const [mode, setMode]       = useState<Mode | null>(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  async function generate(m: Mode) {
    if (!result) return
    setMode(m)
    setLoading(true)
    setContent(null)
    setError(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: buildMessages(m, result, inputs, brutal), maxTokens: 900 }),
      })
      const data = await res.json()
      if (data.success) setContent(data.content)
      else setError(data.error || 'Something went wrong.')
    } catch {
      setError('Network error. Make sure your GROQ_API_KEY is set in .env.local.')
    } finally {
      setLoading(false)
    }
  }

  // ── Empty state ──────────────────────────────────────────────────
  if (!result) {
    return (
      <AppLayout>
        <div style={{ ...page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <RiSparkling2Line size={26} style={{ color: '#0070f3' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', color: '#fff' }}>
            Run a simulation first
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '28px' }}>
            AI insights require a simulation result to analyze. Configure your habits and run the model first.
          </p>
          <Link href="/simulate" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px', borderRadius: '12px',
            background: '#fff', color: '#000',
            fontSize: '13px', fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            Start simulation
            <RxLightningBolt size={13} />
          </Link>
        </div>
      </AppLayout>
    )
  }

  const activeMode = mode ? MODES.find(m => m.id === mode) : null

  return (
    <AppLayout>
      <div style={page}>

        {/* ── Header ─────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px' }}>
              Step 4 — AI Insights
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: '4px' }}>
              AI analysis
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              Deep behavioral analysis powered by Groq.
            </p>
          </div>

          {/* Brutal mode toggle */}
          <button
            onClick={() => setBrutal(b => !b)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px', borderRadius: '12px',
              background: brutal ? 'rgba(255,68,68,0.08)' : '#0a0a0a',
              border: `1px solid ${brutal ? 'rgba(255,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: brutal ? '#ff4444' : 'rgba(255,255,255,0.4)',
              fontSize: '13px', fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {/* Toggle pill */}
            <div style={{
              width: '32px', height: '18px', borderRadius: '9px',
              background: brutal ? 'rgba(255,68,68,0.25)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${brutal ? 'rgba(255,68,68,0.4)' : 'rgba(255,255,255,0.12)'}`,
              position: 'relative', flexShrink: 0,
              transition: 'all 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: '2px',
                left: brutal ? '13px' : '2px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: brutal ? '#ff4444' : 'rgba(255,255,255,0.3)',
                transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
            Brutal mode
          </button>
        </div>

        {/* ── Context bar ──────────────────────────────── */}
        <div style={{
          ...card,
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '14px 16px', marginBottom: '12px',
        }}>
          {/* State icon */}
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: '#111', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>
            {STATE_ICONS[result.twinState]}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '2px' }}>
              Grade {result.grade}
              <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>
                {' '}· {result.burnout} burnout · {result.perfPct}% performance
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
              Study {inputs.study}h · Sleep {inputs.sleep}h · Leisure {inputs.leisure}h · Stress {inputs.stress}
            </div>
          </div>

          {/* Model badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
            padding: '5px 12px', borderRadius: '8px',
            background: 'rgba(0,112,243,0.08)', border: '1px solid rgba(0,112,243,0.2)',
            color: '#0070f3', fontSize: '11px', fontWeight: 500, fontFamily: 'monospace',
          }}>
            <RxLightningBolt size={10} />
            Groq · llama3-8b
          </div>
        </div>

        {/* ── Mode cards ───────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {MODES.map(({ id, Icon, label, sub, color, bg, border }) => {
            const active = mode === id
            return (
              <button
                key={id}
                onClick={() => generate(id)}
                disabled={loading}
                style={{
                  padding: '18px', borderRadius: '14px', textAlign: 'left',
                  background: active ? bg : '#0a0a0a',
                  border: `1px solid ${active ? border : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: active ? `0 0 0 1px ${border}, 0 4px 16px rgba(0,0,0,0.4)` : '0 2px 8px rgba(0,0,0,0.3)',
                  opacity: loading && !active ? 0.45 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)'
                    e.currentTarget.style.borderColor = active ? border : 'rgba(255,255,255,0.14)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = active ? `0 0 0 1px ${border}, 0 4px 16px rgba(0,0,0,0.4)` : '0 2px 8px rgba(0,0,0,0.3)'
                  e.currentTarget.style.borderColor = active ? border : 'rgba(255,255,255,0.08)'
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: active ? bg : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? border : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '14px',
                }}>
                  <Icon size={15} style={{ color: active ? color : 'rgba(255,255,255,0.35)' }} />
                </div>

                <div style={{
                  fontSize: '13px', fontWeight: 600, marginBottom: '4px',
                  color: active ? color : '#fff',
                  letterSpacing: '-0.01em',
                }}>
                  {label}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                  {sub}
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Loading ───────────────────────────────────── */}
        {loading && (
          <div style={{
            ...card,
            padding: '48px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            <Spinner />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '4px' }}>
                Analyzing with Groq AI
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                {mode === 'insights' && 'Detecting behavioral patterns…'}
                {mode === 'explain'  && 'Tracing cause-effect chains…'}
                {mode === 'plan'     && 'Building your 7-day schedule…'}
              </div>
            </div>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────── */}
        {error && !loading && (
          <div style={{
            padding: '18px 20px', borderRadius: '14px',
            background: 'rgba(255,68,68,0.06)',
            border: '1px solid rgba(255,68,68,0.2)',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ff4444', marginBottom: '4px' }}>
              Something went wrong
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,100,100,0.7)' }}>{error}</div>
          </div>
        )}

        {/* ── AI output ─────────────────────────────────── */}
        {content && !loading && (
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
            {/* Output header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 18px',
              background: '#111', borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {activeMode && (
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '8px',
                    background: activeMode.bg, border: `1px solid ${activeMode.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <activeMode.Icon size={12} style={{ color: activeMode.color }} />
                  </div>
                )}
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                  {mode ? MODE_LABELS[mode] : 'Analysis'}
                </span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '8px',
                background: 'rgba(0,201,81,0.08)', border: '1px solid rgba(0,201,81,0.2)',
                fontSize: '11px', fontWeight: 500, color: '#00c951', fontFamily: 'monospace',
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00c951' }} />
                Complete
              </div>
            </div>

            {/* Content body */}
            <div style={{ padding: '24px', background: '#0a0a0a' }}>
              <div style={{
                fontSize: '13px', lineHeight: '1.8',
                color: 'rgba(255,255,255,0.55)',
                whiteSpace: 'pre-wrap',
              }}>
                {content}
              </div>
            </div>
          </div>
        )}

        {/* ── Idle placeholder ──────────────────────────── */}
        {!content && !loading && !error && (
          <div style={{
            padding: '48px 24px',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RiSparkling2Line size={20} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '6px' }}>
                Choose an analysis type
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.65 }}>
                Select one of the three modes above to generate<br />AI-powered insights from your simulation data.
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  )
}