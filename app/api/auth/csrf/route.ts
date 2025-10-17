import { NextResponse } from 'next/server'
import { createCsrfPair } from '../../../../lib/csrf'

export async function GET() {
  const { sid, token } = createCsrfPair()
  const isProd = process.env.NODE_ENV === 'production'
  const cookie = (name: string, value: string, opts?: { httpOnly?: boolean; maxAge?: number }) => [
    `${name}=${value}`,
    'Path=/',
    'SameSite=Strict',
    ...(opts?.httpOnly ? ['HttpOnly'] : []),
    ...(opts?.maxAge ? [`Max-Age=${opts.maxAge}`] : []),
    ...(isProd ? ['Secure'] : []),
  ].join('; ')
  const res = NextResponse.json({ csrfToken: token })
  res.headers.append('Set-Cookie', cookie('csrf_sid', sid, { httpOnly: true, maxAge: 60 * 60 }))
  res.headers.append('Set-Cookie', cookie('csrf_token', token, { httpOnly: false, maxAge: 60 * 60 }))
  return res
}
