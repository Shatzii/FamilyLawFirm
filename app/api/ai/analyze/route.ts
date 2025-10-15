import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientKey } from '../../../../lib/rateLimit'
import { verifyCsrf } from '../../../../lib/csrf'

export async function POST(req: NextRequest) {
  // Basic abuse protection for large uploads
  const key = `ai:${getClientKey(req.headers)}`
  if (!checkRateLimit(key, 20, 5 * 60 * 1000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '300' } })
  }
  const csrf = req.headers.get('x-csrf-token')
  if (!verifyCsrf(csrf)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    const res = await fetch(`${backendUrl}/api/ai/analyze-document`, {
      method: 'POST',
      // forward the original request stream and content-type (multipart boundary)
      body: req.body as any,
      headers: { 'Content-Type': req.headers.get('content-type') || 'application/octet-stream' },
    })
    if (!res.ok) throw new Error('Backend error')
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    // Stub fallback
    return NextResponse.json({ file: 'stub.pdf', analysis: { summary: 'stub' }, confidence: 0.8 })
  }
}
