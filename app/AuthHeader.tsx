'use client'

import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function AuthHeader() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string; role?: string } } | null>(null)

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
            {auth.user?.role && (
              <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 border border-blue-200">
                {auth.user.role}
              </span>
            )}
            <span className="text-muted">{auth.user?.email}</span>
            <button className="underline text-brand" onClick={logout}>Logout</button>
          </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href="/login" className="underline text-brand">Login</a>
              <a href="/register" className="underline">Register</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
