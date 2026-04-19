import { NextRequest, NextResponse } from 'next/server'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192'
const DEFAULT_TOKENS = 900
const REQUEST_TIMEOUT = 30_000

export async function POST(req: NextRequest) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY

  if (!GROQ_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'GROQ_API_KEY is not set. Add it to .env.local to enable AI features.',
      code: 'NO_API_KEY',
    }, { status: 500 })
  }

  let body: { messages?: unknown[]; maxTokens?: number; temperature?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.', code: 'VALIDATION_ERROR' }, { status: 400 })
  }

  const { messages, maxTokens = DEFAULT_TOKENS, temperature = 0.72 } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ success: false, error: 'messages array is required.', code: 'VALIDATION_ERROR' }, { status: 400 })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    })

    clearTimeout(timer)

    if (!response.ok) {
      let detail = `Groq returned HTTP ${response.status}`
      try {
        const err = await response.json()
        detail = err?.error?.message || detail
      } catch {}
      const code = response.status === 429 ? 'RATE_LIMITED' : response.status === 401 ? 'INVALID_KEY' : 'UPSTREAM_ERROR'
      return NextResponse.json({ success: false, error: detail, code }, { status: response.status })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content

    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Groq returned an empty response.', code: 'EMPTY_RESPONSE' }, { status: 502 })
    }

    return NextResponse.json({ success: true, content: content.trim() })
  } catch (err: unknown) {
    clearTimeout(timer)
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json({ success: false, error: 'Request timed out.', code: 'TIMEOUT' }, { status: 504 })
    }
    return NextResponse.json({ success: false, error: 'Network error.', code: 'NETWORK_ERROR' }, { status: 502 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    model: DEFAULT_MODEL,
    time: new Date().toISOString(),
    hasKey: !!process.env.GROQ_API_KEY,
  })
}
