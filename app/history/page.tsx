'use client'

import AppLayout from '@/components/AppLayout'
import { useSim } from '@/components/SimProvider'
import Link from 'next/link'
import { RxTrash, RxArrowRight } from 'react-icons/rx'

// ── Config ───────────────────────────────────────────────────────────

const STATE_META = {
  thriving:   { emoji: '🚀', label: 'Thriving',   color: '#00c951', bg: 'rgba(0,201,81,0.08)',   border: 'rgba(0,201,81,0.18)'   },
  balanced:   { emoji: '🎓', label: 'Balanced',   color: '#0070f3', bg: 'rgba(0,112,243,0.08)',  border: 'rgba(0,112,243,0.18)'  },
  struggling: { emoji: '⚠️', label: 'Struggling', color: '#f5a623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.18)' },
  critical:   { emoji: '🔴', label: 'Critical',   color: '#ff4444', bg: 'rgba(255,68,68,0.08)',  border: 'rgba(255,68,68,0.18)'  },
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Page ─────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { history, clearHistory } = useSim()

  const card: React.CSSProperties = {
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Header ─────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px',
            }}>
              Simulation history
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: '4px' }}>
              Past simulations
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              {history.length === 0
                ? 'No simulations yet.'
                : `${history.length} simulation${history.length === 1 ? '' : 's'} stored locally.`}
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '10px',
                background: 'rgba(255,68,68,0.07)',
                border: '1px solid rgba(255,68,68,0.2)',
                color: '#ff4444', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,68,68,0.12)'
                e.currentTarget.style.borderColor = 'rgba(255,68,68,0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,68,68,0.07)'
                e.currentTarget.style.borderColor = 'rgba(255,68,68,0.2)'
              }}
            >
              <RxTrash size={13} />
              Clear all
            </button>
          )}
        </div>

        {/* ── Empty state ──────────────────────────────── */}
        {history.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center',
            padding: '80px 24px', minHeight: '40vh',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px', fontSize: '28px',
              background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>
              📋
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: '8px' }}>
              No history yet
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '260px', marginBottom: '28px' }}>
              Run your first simulation to see your results tracked here.
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
        )}

        {/* ── History list ─────────────────────────────── */}
        {history.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((entry, i) => {
              const meta = STATE_META[entry.result.twinState]
              return (
                <div
                  key={entry.id}
                  style={{
                    ...card,
                    padding: '20px',
                    opacity: 0,
                    animation: `fadeInUp 0.35s ease-out ${i * 0.05}s forwards`,
                  }}
                >
                  {/* ── Top row ── */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                    {/* State icon */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                      background: meta.bg, border: `1px solid ${meta.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                    }}>
                      {meta.emoji}
                    </div>

                    {/* Label + date */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' as const }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                          {meta.label}
                        </span>
                        <span style={{
                          fontSize: '11px', padding: '2px 8px', borderRadius: '99px', fontWeight: 500,
                          background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
                        }}>
                          Grade {entry.result.grade}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
                        {formatDateTime(entry.date)}
                      </div>
                    </div>

                    {/* Grade + GPA */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: '28px', fontWeight: 800,
                        color: entry.result.gradeColor, letterSpacing: '-0.04em', lineHeight: 1,
                      }}>
                        {entry.result.grade}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '3px' }}>
                        GPA {entry.result.gpa}
                      </div>
                    </div>
                  </div>

                  {/* ── Bottom stats row ── */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
                    marginTop: '16px', paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    {[
                      { label: 'Study',   value: `${entry.inputs.study}h`,  color: '#0070f3'                 },
                      { label: 'Sleep',   value: `${entry.inputs.sleep}h`,  color: '#00d8ff'                 },
                      { label: 'Stress',  value: entry.inputs.stress,        color: 'rgba(255,255,255,0.55)'  },
                      { label: 'Burnout', value: entry.result.burnout,       color: entry.result.burnoutColor },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>
                          {label}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color, textTransform: 'capitalize' as const }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Self-contained keyframe — no globals.css dependency */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </AppLayout>
  )
}