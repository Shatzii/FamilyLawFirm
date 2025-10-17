import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientKey } from '../../../lib/rateLimit'
import { verifyCsrf } from '../../../lib/csrf'

export async function GET() {
  const backend = process.env.BACKEND_URL || 'http://localhost:3001'
  try {
    const r = await fetch(`${backend}/api/cases`)
    if (r.ok) return NextResponse.json(await r.json())
  } catch (_) {}
  // Fallback stub
  return NextResponse.json([{ id: 1, title: 'Sample Case', created_by: null, created_at: new Date().toISOString() }])
}

export async function POST(req: NextRequest) {
  // Rate limit
  const rlKey = `cases:create:${getClientKey(req.headers)}`
  if (!checkRateLimit(rlKey, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '600' } })
  }
  // CSRF check
  const csrf = req.headers.get('x-csrf-token')
  if (!(await verifyCsrf(csrf))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }
  const backend = process.env.BACKEND_URL || 'http://localhost:3001'
  const payload = await req.json().catch(() => ({}))
  try {
    const r = await fetch(`${backend}/api/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${req.cookies.get('token')?.value || ''}` },
      body: JSON.stringify(payload),
    })
    if (r.ok) return NextResponse.json(await r.json())
    return NextResponse.json({ error: await r.text() }, { status: r.status })
  } catch (e) {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
  }
}
