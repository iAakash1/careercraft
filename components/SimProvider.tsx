'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { SimInputs, SimResult } from '@/lib/simulation'

export interface HistoryEntry {
  id: string
  date: string
  inputs: SimInputs
  result: SimResult
}

interface SimStore {
  inputs: SimInputs
  result: SimResult | null
  history: HistoryEntry[]
  setInputs: (inputs: SimInputs) => void
  setResult: (result: SimResult, inputs: SimInputs) => void
  clearHistory: () => void
}

const defaultInputs: SimInputs = { study: 6, sleep: 7, leisure: 2, stress: 'medium' }

const SimContext = createContext<SimStore>({
  inputs: defaultInputs,
  result: null,
  history: [],
  setInputs: () => {},
  setResult: () => {},
  clearHistory: () => {},
})

export function SimProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputsState] = useState<SimInputs>(defaultInputs)
  const [result, setResultState] = useState<SimResult | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('dt_history')
      if (savedHistory) setHistory(JSON.parse(savedHistory))
      const savedResult = sessionStorage.getItem('dt_last_result')
      if (savedResult) {
        const { result: r, inputs: i } = JSON.parse(savedResult)
        setResultState(r)
        setInputsState(i)
      }
    } catch {}
  }, [])

  const setInputs = useCallback((inputs: SimInputs) => {
    setInputsState(inputs)
  }, [])

  const setResult = useCallback((result: SimResult, inputs: SimInputs) => {
    setResultState(result)
    setInputsState(inputs)
    try { sessionStorage.setItem('dt_last_result', JSON.stringify({ result, inputs })) } catch {}
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      inputs,
      result,
    }
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 20)
      try { localStorage.setItem('dt_history', JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try { localStorage.removeItem('dt_history') } catch {}
  }, [])

  return (
    <SimContext.Provider value={{ inputs, result, history, setInputs, setResult, clearHistory }}>
      {children}
    </SimContext.Provider>
  )
}

export const useSim = () => useContext(SimContext)
