import crypto from 'crypto'
import { cookies } from 'next/headers'
import { env } from './env'

const secret = env.CSRF_SECRET || 'dev_csrf_secret_use_env_in_prod'

export function generateCsrfToken(sessionId: string) {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(sessionId)
  return hmac.digest('hex')
}

export function issueCsrfCookie() {
  const sid = crypto.randomBytes(16).toString('hex')
  const token = generateCsrfToken(sid)
  // HttpOnly=false so the client can read it for header; bind to SameSite=Strict
  cookies().set('csrf_sid', sid, { httpOnly: true, sameSite: 'strict', path: '/', secure: process.env.NODE_ENV === 'production' })
  cookies().set('csrf_token', token, { httpOnly: false, sameSite: 'strict', path: '/', secure: process.env.NODE_ENV === 'production' })
  return token
}

export function verifyCsrf(headerToken?: string | null) {
  const sid = cookies().get('csrf_sid')?.value
  if (!sid || !headerToken) return false
  return generateCsrfToken(sid) === headerToken
}
