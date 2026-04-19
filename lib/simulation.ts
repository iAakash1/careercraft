// Fuzzy Logic Engine - ported from vanilla JS simulation

export type StressLevel = 'low' | 'medium' | 'high'

export interface SimInputs {
  study: number
  sleep: number
  leisure: number
  stress: StressLevel
}

export interface SimResult {
  grade: string
  gpa: string
  burnout: string
  perfPct: number
  burnPct: number
  gradeColor: string
  burnoutColor: string
  twinState: 'thriving' | 'balanced' | 'struggling' | 'critical'
  suggestions: Array<{ icon: string; label: string; text: string }>
}

// Fuzzy membership functions
function membershipStudy(hours: number) {
  if (hours <= 1)  return { low: 1.0, medium: 0.0, high: 0.0 }
  if (hours <= 3)  return { low: (3 - hours) / 2, medium: (hours - 1) / 2, high: 0.0 }
  if (hours <= 5)  return { low: 0.0, medium: (5 - hours) / 2, high: (hours - 3) / 2 }
  return { low: 0.0, medium: 0.0, high: 1.0 }
}

function membershipSleep(hours: number) {
  if (hours <= 4)  return { deprived: 1.0, low: 0.0, adequate: 0.0 }
  if (hours <= 6)  return { deprived: (6 - hours) / 2, low: (hours - 4) / 2, adequate: 0.0 }
  if (hours <= 8)  return { deprived: 0.0, low: (8 - hours) / 2, adequate: (hours - 6) / 2 }
  return { deprived: 0.0, low: 0.0, adequate: 1.0 }
}

function membershipStress(level: StressLevel) {
  return {
    low: level === 'low' ? 1 : 0,
    medium: level === 'medium' ? 1 : 0,
    high: level === 'high' ? 1 : 0,
  }
}

function computeScore(study: number, sleep: number, stress: StressLevel) {
  const s = membershipStudy(study)
  const sl = membershipSleep(sleep)
  const st = membershipStress(stress)
  const stressPenalty = st.low * 0 + st.medium * 0.1 + st.high * 0.25
  const score =
    (s.high * 0.4 + s.medium * 0.25 + s.low * 0.05) +
    (sl.adequate * 0.35 + sl.low * 0.2 + sl.deprived * 0.05) -
    stressPenalty
  return Math.min(1, Math.max(0, score))
}

function computeBurnoutScore(sleep: number, stress: StressLevel, leisure: number) {
  const sl = membershipSleep(sleep)
  const st = membershipStress(stress)
  const leisureFactor = leisure <= 1 ? 0.2 : leisure <= 3 ? 0.1 : 0
  return Math.min(1,
    sl.deprived * 0.45 + sl.low * 0.25 +
    st.high * 0.35 + st.medium * 0.15 +
    leisureFactor
  )
}

function gradeFromScore(score: number) {
  if (score >= 0.75) return 'A'
  if (score >= 0.55) return 'B'
  if (score >= 0.35) return 'C'
  return 'D'
}

function gradeGPA(grade: string) {
  return { A: '4.0', B: '3.0–3.9', C: '2.0–2.9', D: 'Below 2.0' }[grade] || '—'
}

function burnoutLevel(score: number) {
  if (score >= 0.70) return 'Critical'
  if (score >= 0.50) return 'High'
  if (score >= 0.30) return 'Medium'
  return 'Low'
}

function gradeColor(grade: string) {
  return { A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#ef4444' }[grade] || '#fff'
}

function burnoutColor(level: string) {
  return { Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#10b981' }[level] || '#10b981'
}

const SUGGESTIONS = {
  study: {
    low:    'Increase study time to at least 4–6 hours daily for better retention.',
    medium: 'Your study hours are decent — try active recall techniques to boost efficiency.',
    high:   'Great study commitment! Ensure you balance it with adequate rest.',
  },
  sleep: {
    low:    "Critical: You're severely sleep-deprived. Aim for 7–8 hours — sleep is memory consolidation.",
    medium: "You're under the recommended sleep threshold. Add 1–2 more hours nightly.",
    high:   'Excellent sleep hygiene! Your brain is primed for peak performance.',
  },
  stress: {
    low:    'Stress well-managed. Maintain your current mindfulness or relaxation routine.',
    medium: 'Moderate stress detected. Consider short meditation or breathing exercises.',
    high:   'High stress is impairing your cognitive performance. Prioritize recovery time.',
  },
  leisure: {
    low:    'Very little leisure — burnout risk increases. Schedule deliberate breaks.',
    medium: 'Balanced leisure time. Keep using it for genuine recovery activities.',
    high:   'Consider shifting some leisure hours into focused study for better outcomes.',
  },
}

function buildSuggestions(study: number, sleep: number, stress: StressLevel, leisure: number) {
  const studyKey = study <= 2 ? 'low' : study <= 5 ? 'medium' : 'high'
  const sleepKey = sleep <= 4 ? 'low' : sleep <= 6 ? 'medium' : 'high'
  const leisureKey = leisure <= 1 ? 'low' : leisure <= 4 ? 'medium' : 'high'
  return [
    { icon: '📚', label: 'Study',   text: SUGGESTIONS.study[studyKey] },
    { icon: '🌙', label: 'Sleep',   text: SUGGESTIONS.sleep[sleepKey] },
    { icon: '🧘', label: 'Stress',  text: SUGGESTIONS.stress[stress] },
    { icon: '🎮', label: 'Leisure', text: SUGGESTIONS.leisure[leisureKey] },
  ]
}

function twinState(grade: string, burnout: string): SimResult['twinState'] {
  if (grade === 'A' && (burnout === 'Low' || burnout === 'Medium')) return 'thriving'
  if (burnout === 'Critical') return 'critical'
  if (burnout === 'High' || grade === 'D') return 'struggling'
  return 'balanced'
}

export function runSimulation(inputs: SimInputs): SimResult {
  const { study, sleep, leisure, stress } = inputs
  const perfScore = computeScore(study, sleep, stress)
  const burnScore = computeBurnoutScore(sleep, stress, leisure)
  const grade = gradeFromScore(perfScore)
  const burnout = burnoutLevel(burnScore)

  return {
    grade,
    gpa: gradeGPA(grade),
    burnout,
    perfPct: Math.round(perfScore * 100),
    burnPct: Math.round(burnScore * 100),
    gradeColor: gradeColor(grade),
    burnoutColor: burnoutColor(burnout),
    twinState: twinState(grade, burnout),
    suggestions: buildSuggestions(study, sleep, stress, leisure),
  }
}
