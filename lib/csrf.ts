import crypto from 'crypto'
import { cookies } from 'next/headers'
import { env } from './env'

const secret = env.CSRF_SECRET || 'dev_csrf_secret_use_env_in_prod'

export function generateCsrfToken(sessionId: string) {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(sessionId)
  return hmac.digest('hex')
}

export function createCsrfPair() {
  const sid = crypto.randomBytes(16).toString('hex')
  const token = generateCsrfToken(sid)
  return { sid, token }
}

export async function verifyCsrf(headerToken?: string | null) {
  const jar = await cookies()
  const sid = jar.get('csrf_sid')?.value
  if (!sid || !headerToken) return false
  return generateCsrfToken(sid) === headerToken
}
