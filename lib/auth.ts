import { cookies } from 'next/headers'

export function isAuthenticated() {
  const c = cookies()
  return c.get('auth')?.value === '1'
}
