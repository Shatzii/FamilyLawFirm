import { NextRequest, NextResponse } from 'next/server'
import { calculateColoradoChildSupport } from '../../../../lib/calculators'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const backend = process.env.BACKEND_URL || 'http://localhost:3001'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)
    try {
      const r = await fetch(`${backend}/api/calculators/child-support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (r.ok) return NextResponse.json(await r.json())
    } catch (_) { /* fall back */ }
    const result = calculateColoradoChildSupport(body)
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid input' }, { status: 400 })
  }
}
