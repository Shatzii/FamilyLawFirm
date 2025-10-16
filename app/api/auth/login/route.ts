import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientKey } from '../../../../lib/rateLimit'
import { verifyCsrf } from '../../../../lib/csrf'
import { env } from '../../../../lib/env'
import { logger } from '../../../../lib/logger'

export async function POST(req: NextRequest) {
  // Basic rate limit to mitigate brute-force attempts
  const key = `login:${getClientKey(req.headers)}`
  if (!checkRateLimit(key, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': '600' } })
  }
  // CSRF check
  const csrf = req.headers.get('x-csrf-token')
  if (!verifyCsrf(csrf)) {
    logger.warn('login csrf_failed')
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }
  const { email, password } = await req.json().catch(() => ({ email: '', password: '' }))
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  const backend = env.BACKEND_URL
  const body = new URLSearchParams({ username: email, password })
  const r = await fetch(`${backend}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!r.ok) {
    logger.warn('login failed', { email })
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const data = await r.json()
  const token: string | undefined = data?.access_token
  const isProd = process.env.NODE_ENV === 'production'
  const cookieParts = (name: string, value: string, maxAge = 60 * 60) => [
    `${name}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
    ...(isProd ? ['Secure'] : []),
  ].join('; ')
  const res = NextResponse.json({ ok: true })
  const cookies: string[] = [cookieParts('auth', '1')]
  if (token) cookies.push(cookieParts('token', token))
  res.headers.append('Set-Cookie', cookies[0])
  if (cookies[1]) res.headers.append('Set-Cookie', cookies[1])
  logger.info('login success', { email })
  return res
}
