import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientKey } from '../../../../lib/rateLimit'
import { verifyCsrf } from '../../../../lib/csrf'
import { env } from '../../../../lib/env'
import { logger } from '../../../../lib/logger'

export async function POST(req: NextRequest) {
  const key = `signup:${getClientKey(req.headers)}`
  if (!checkRateLimit(key, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': '600' } })
  }
  const csrf = req.headers.get('x-csrf-token')
  if (!verifyCsrf(csrf)) {
    logger.warn('signup csrf_failed')
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }
  const { email, password, role } = await req.json().catch(() => ({ email: '', password: '', role: 'client' }))
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  const backend = env.BACKEND_URL
  let data: any | null = null
  try {
    const r = await fetch(`${backend}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: role || 'client' }),
    })
    if (!r.ok) {
      const text = await r.text()
      logger.warn('signup failed', { email })
      return NextResponse.json({ error: text || 'Signup failed' }, { status: 400 })
    }
    data = await r.json()
  } catch (e) {
    logger.error('signup backend_unreachable', { backend })
    return NextResponse.json({ error: 'Auth service unreachable' }, { status: 502 })
  }
  const token: string | undefined = data?.access_token
  const isProd = process.env.NODE_ENV === 'production'
  const cookie = (name: string, value: string, maxAge = 60 * 60) => [
    `${name}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
    ...(isProd ? ['Secure'] : []),
  ].join('; ')
  const res = NextResponse.json({ ok: true })
  res.headers.append('Set-Cookie', cookie('auth', '1'))
  if (token) res.headers.append('Set-Cookie', cookie('token', token))
  logger.info('signup success', { email })
  return res
}
