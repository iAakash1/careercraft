'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { useSim } from '@/components/SimProvider'
import { runSimulation } from '@/lib/simulation'
import type { SimInputs, StressLevel } from '@/lib/simulation'
import { RxLightningBolt, RxArrowRight } from 'react-icons/rx'
import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri'

// ── Shared card style ────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
}

// ── Spinner ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        style={{ animation: 'sim-spin 1.2s linear infinite', flexShrink: 0 }}>
        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <style>{`@keyframes sim-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

// ── Slider Card ──────────────────────────────────────────────────────

function SliderCard({
  icon, label, min, max, value, unit, hint, onChange,
}: {
  icon: string; label: string; min: number; max: number
  value: number; unit: string; hint: string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div style={{ ...cardStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: '#111', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>
            {icon}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
              {label}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
              {hint}
            </div>
          </div>
        </div>

        {/* Value badge */}
        <div style={{
          padding: '4px 12px', borderRadius: '10px',
          background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.2)',
          fontSize: '14px', fontWeight: 700, color: '#0070f3',
          fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' as const,
        }}>
          {value}
          <span style={{ fontSize: '11px', fontWeight: 400, marginLeft: '4px', color: 'rgba(0,112,243,0.55)' }}>
            {unit}
          </span>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        style={{
          '--fill': `${pct}%`,
          width: '100%',
          cursor: 'pointer',
        } as React.CSSProperties}
        onChange={e => onChange(Number(e.target.value))}
      />

      {/* Min / max */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '-6px' }}>
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}

// ── Stress Selector ──────────────────────────────────────────────────

function StressSelector({ value, onChange }: { value: StressLevel; onChange: (v: StressLevel) => void }) {
  const opts: { v: StressLevel; label: string; desc: string; color: string; bg: string; border: string }[] = [
    { v: 'low',    label: 'Low',    desc: 'Well managed',  color: '#00c951', bg: 'rgba(0,201,81,0.1)',   border: 'rgba(0,201,81,0.3)'   },
    { v: 'medium', label: 'Medium', desc: 'Noticeable',    color: '#f5a623', bg: 'rgba(245,166,35,0.1)', border: 'rgba(245,166,35,0.3)' },
    { v: 'high',   label: 'High',   desc: 'Overwhelming',  color: '#ff4444', bg: 'rgba(255,68,68,0.1)',  border: 'rgba(255,68,68,0.3)'  },
  ]

  return (
    <div style={{ ...cardStyle, padding: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: '#111', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>
          🧘
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
            Stress Level
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
            Current perceived stress
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {opts.map(({ v, label, desc, color, bg, border }) => {
          const active = value === v
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: '12px', textAlign: 'center',
                background: active ? bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? border : 'rgba(255,255,255,0.07)'}`,
                color: active ? color : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.7 }}>{desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── What-If Chips ────────────────────────────────────────────────────

function WhatIfChips({ inputs, onApply }: { inputs: SimInputs; onApply: (inputs: SimInputs) => void }) {
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

  const chips: { label: string; action: () => SimInputs; positive: boolean }[] = [
    { label: '+2 study hrs',  action: () => ({ ...inputs, study:  clamp(inputs.study + 2, 0, 12) }), positive: true  },
    { label: '+1 sleep hr',   action: () => ({ ...inputs, sleep:  clamp(inputs.sleep + 1, 0, 10) }), positive: true  },
    { label: 'Reduce stress', action: () => ({ ...inputs, stress: 'low' as StressLevel }),            positive: true  },
    { label: '-2 sleep hrs',  action: () => ({ ...inputs, sleep:  clamp(inputs.sleep - 2, 0, 10) }), positive: false },
    { label: '-2 study hrs',  action: () => ({ ...inputs, study:  clamp(inputs.study - 2, 0, 12) }), positive: false },
    { label: 'Max stress',    action: () => ({ ...inputs, stress: 'high' as StressLevel }),           positive: false },
  ]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
      {chips.map(({ label, action, positive }) => (
        <button
          key={label}
          onClick={() => onApply(action())}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '10px',
            fontSize: '12px', fontWeight: 500,
            background: positive ? 'rgba(0,201,81,0.07)' : 'rgba(255,68,68,0.07)',
            border: `1px solid ${positive ? 'rgba(0,201,81,0.2)' : 'rgba(255,68,68,0.2)'}`,
            color: positive ? '#00c951' : '#ff4444',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {positive
            ? <RiArrowUpLine size={11} />
            : <RiArrowDownLine size={11} />
          }
          {label}
        </button>
      ))}
    </div>
  )
}

// ── Result Preview ───────────────────────────────────────────────────

const STATE_META = {
  thriving:   { emoji: '🚀', label: 'Thriving',   color: '#00c951', bg: 'rgba(0,201,81,0.07)',   border: 'rgba(0,201,81,0.18)'   },
  balanced:   { emoji: '🎓', label: 'Balanced',   color: '#0070f3', bg: 'rgba(0,112,243,0.07)',  border: 'rgba(0,112,243,0.18)'  },
  struggling: { emoji: '⚠️', label: 'Struggling', color: '#f5a623', bg: 'rgba(245,166,35,0.07)', border: 'rgba(245,166,35,0.18)' },
  critical:   { emoji: '🔴', label: 'Critical',   color: '#ff4444', bg: 'rgba(255,68,68,0.07)',  border: 'rgba(255,68,68,0.18)'  },
}

function ResultPreview({ result, inputs }: { result: ReturnType<typeof runSimulation>; inputs: SimInputs }) {
  const router = useRouter()
  const { setResult } = useSim()
  const meta = STATE_META[result.twinState]

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${meta.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>

      {/* Tinted header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px',
        background: meta.bg, borderBottom: `1px solid ${meta.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
            background: 'rgba(0,0,0,0.25)', border: `1px solid ${meta.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
          }}>
            {meta.emoji}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '3px' }}>
              Simulation complete
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: meta.color, letterSpacing: '-0.02em' }}>
              {meta.label}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '52px', fontWeight: 800, color: result.gradeColor, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {result.grade}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
            GPA {result.gpa}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px', background: '#0a0a0a' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
          {[
            { label: 'Performance', value: `${result.perfPct}%`, color: result.gradeColor },
            { label: 'Burnout',     value: result.burnout,       color: result.burnoutColor },
            { label: 'Risk index',  value: `${result.burnPct}%`, color: result.burnoutColor },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              padding: '12px', borderRadius: '12px', textAlign: 'center',
              background: '#111', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>{label}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Score bar */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
            <span>Performance score</span>
            <span style={{ color: result.gradeColor, fontWeight: 600 }}>{result.perfPct}/100</span>
          </div>
          <div style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '3px', borderRadius: '99px', width: `${result.perfPct}%`, background: result.gradeColor, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => { setResult(result, inputs); router.push('/results') }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '13px', borderRadius: '14px',
            background: '#fff', color: '#000',
            fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.92)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          View full results
          <RxArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default function SimulatePage() {
  const { inputs, setInputs } = useSim()
  const [localInputs, setLocalInputs] = useState<SimInputs>(inputs)
  const [running, setRunning] = useState(false)
  const [simResult, setSimResult] = useState<ReturnType<typeof runSimulation> | null>(null)

  function applyInputs(next: SimInputs) {
    setLocalInputs(next)
    setInputs(next)
  }

  function handleRun() {
    setRunning(true)
    setSimResult(null)
    setTimeout(() => {
      const r = runSimulation(localInputs)
      setSimResult(r)
      setRunning(false)
    }, 700)
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Header ─────────────────────────────────── */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px' }}>
            Step 1 — Configure
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: '6px' }}>
            Configure daily habits
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
            Set your typical daily routine. The fuzzy logic model predicts outcomes based on these inputs.
          </p>
        </div>

        {/* ── Sliders grid ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <SliderCard icon="📚" label="Study Hours" min={0} max={12}
            value={localInputs.study} unit="hrs" hint="Academic study & coursework"
            onChange={v => applyInputs({ ...localInputs, study: v })} />
          <SliderCard icon="🌙" label="Sleep" min={0} max={10}
            value={localInputs.sleep} unit="hrs" hint="Hours of sleep per night"
            onChange={v => applyInputs({ ...localInputs, sleep: v })} />
          <SliderCard icon="🎮" label="Leisure" min={0} max={8}
            value={localInputs.leisure} unit="hrs" hint="Hobbies, social & downtime"
            onChange={v => applyInputs({ ...localInputs, leisure: v })} />
          <StressSelector
            value={localInputs.stress}
            onChange={v => applyInputs({ ...localInputs, stress: v })} />
        </div>

        {/* ── What-if ──────────────────────────────────── */}
        <div style={{ ...cardStyle, padding: '18px 20px', marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: '2px' }}>
              What-if scenarios
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Instantly apply a change and re-run the simulation
            </div>
          </div>
          <WhatIfChips inputs={localInputs} onApply={next => { applyInputs(next); handleRun() }} />
        </div>

        {/* ── Run button ──────────────────────────────── */}
        <button
          onClick={handleRun}
          disabled={running}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '16px',
            borderRadius: '16px',
            background: running ? 'rgba(255,255,255,0.05)' : '#ffffff',
            color: running ? 'rgba(255,255,255,0.35)' : '#000000',
            border: running ? '1px solid rgba(255,255,255,0.08)' : 'none',
            fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em',
            boxShadow: running ? 'none' : '0 4px 16px rgba(0,0,0,0.5)',
            cursor: running ? 'not-allowed' : 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (!running) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = running ? 'none' : '0 4px 16px rgba(0,0,0,0.5)'
          }}
        >
          {running ? (
            <>
              <Spinner />
              Running simulation…
            </>
          ) : (
            <>
              <RxLightningBolt size={16} />
              Run Simulation
              <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(0,0,0,0.4)', fontFamily: 'monospace' }}>
                fuzzy logic
              </span>
            </>
          )}
        </button>

        {/* ── Result ──────────────────────────────────── */}
        {simResult && (
          <ResultPreview result={simResult} inputs={localInputs} />
        )}

      </div>
    </AppLayout>
  )
}