"use client"
import { useEffect, useState } from 'react'
import { useToast } from '../components/ToastProvider'

export default function LoginPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [csrf, setCsrf] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<any>(null)
  const emailValid = /.+@.+\..+/.test(email)
  const pwdValid = password.length >= 6

  useEffect(() => {
    // Issue CSRF token on page load so we can include header for login
    fetch('/api/auth/csrf', { cache: 'no-store', credentials: 'same-origin' })
      .then(r => r.json())
      .then(d => setCsrf(d?.csrfToken ?? null))
      .catch(() => setCsrf(null))
  }, [])

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!emailValid) { setError('Please enter a valid email.'); return }
    if (!pwdValid) { setError('Password must be at least 6 characters.'); return }
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (csrf) headers['x-csrf-token'] = csrf
    const res = await fetch('/api/auth/login', { method: 'POST', headers, body: JSON.stringify({ email, password }), credentials: 'same-origin' })
    if (res.ok) {
      setStatus('Logged in')
      toast({ tone: 'success', title: 'Welcome back', description: 'You are now signed in.' })
      // Fetch current user info
      const m = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' })
      if (m.ok) setMe(await m.json())
    } else {
      setStatus('Login failed')
      try {
        const data = await res.json()
        setError(data?.error || 'Unknown error')
        toast({ tone: 'error', title: 'Login failed', description: data?.error || 'Please check your credentials.' })
      } catch {
        setError('Unknown error')
        toast({ tone: 'error', title: 'Login failed', description: 'Unknown error' })
      }
    }
  }
  async function doLogout() {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    if (res.ok) {
      setStatus('Logged out')
      setMe(null)
      toast({ tone: 'info', title: 'Signed out', description: 'You have been logged out.' })
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={doLogin} className="bg-white border rounded p-4 space-y-3">
        <label className="block text-sm">
          <span className="block mb-1">Email</span>
          <input type="email" className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} required aria-describedby="email-help" />
          {!emailValid && <div id="email-help" className="text-xs text-red-700 mt-1">Enter a valid email address.</div>}
        </label>
        <label className="block text-sm">
          <span className="block mb-1">Password</span>
          <input type="password" className="w-full border rounded p-2" value={password} onChange={e => setPassword(e.target.value)} required aria-describedby="pwd-help" />
          {!pwdValid && <div id="pwd-help" className="text-xs text-red-700 mt-1">Minimum 6 characters.</div>}
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="bg-colorado-blue text-white rounded px-3 py-2 disabled:opacity-50" disabled={!csrf || !emailValid || !pwdValid}>Sign In</button>
          <button type="button" className="border rounded px-3 py-2 text-sm" onClick={() => { setEmail('admin@example.com'); setPassword('admin123!') }}>Use Admin</button>
          <button type="button" className="border rounded px-3 py-2 text-sm" onClick={() => { setEmail('lawyer@example.com'); setPassword('lawyer123!') }}>Use Lawyer</button>
          <button type="button" className="border rounded px-3 py-2 text-sm" onClick={() => { setEmail('client@example.com'); setPassword('client123!') }}>Use Client</button>
          {!csrf && <span className="text-xs text-yellow-700">Waiting for CSRF…</span>}
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
      <div className="text-sm text-gray-600">
        New here? <a href="/register" className="underline text-brand">Create an account</a>
      </div>
      <div className="flex items-center gap-3">
        <button className="border rounded px-3 py-2" onClick={doLogout}>Logout</button>
        {status && <span className="text-sm text-gray-600">{status}</span>}
        {me && me.authenticated && (
          <span className="text-sm text-gray-700">{me.user?.email} ({me.user?.role ?? 'user'})</span>
        )}
      </div>
    </div>
  )
}
