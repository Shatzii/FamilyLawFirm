'use client'

import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function AuthHeader() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string } } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }))
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuth({ authenticated: false })
  }

  return (
    <div className="w-full bg-card/80 backdrop-blur border-b border-card">
      <div className="max-w-6xl mx-auto p-3 text-sm flex items-center justify-between">
        <div className="font-medium text-fg">BAM FamiLex AI</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {auth?.authenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-muted">{auth.user?.email}</span>
            <button className="underline text-brand" onClick={logout}>Logout</button>
          </div>
          ) : (
            <a href="/login" className="underline text-brand">Login</a>
          )}
        </div>
      </div>
    </div>
  )
}
