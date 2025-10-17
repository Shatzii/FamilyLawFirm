"use client"
import { useEffect, useState } from 'react'
import { useToast } from '../components/ToastProvider'

export default function RegisterPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'lawyer' | 'admin'>('client')
  const [csrf, setCsrf] = useState<string | null>(null)
  const emailValid = /.+@.+\..+/.test(email)
  const pwdValid = password.length >= 6
  const canSubmit = !!csrf && emailValid && pwdValid

  useEffect(() => {
    fetch('/api/auth/csrf', { cache: 'no-store', credentials: 'same-origin' })
      .then(r => r.json())
      .then(d => setCsrf(d?.csrfToken ?? null))
      .catch(() => setCsrf(null))
  }, [])

  async function register(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (csrf) headers['x-csrf-token'] = csrf
      const r = await fetch('/api/auth/signup', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password, role }),
      })
      if (!r.ok) throw new Error((await r.json())?.error || 'Registration failed')
      toast({ tone: 'success', title: 'Account created', description: 'You are now signed in.' })
    } catch (e: any) {
      toast({ tone: 'error', title: 'Registration failed', description: e?.message || 'Please try again.' })
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <form onSubmit={register} className="bg-white border rounded p-4 space-y-3">
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
        <label className="block text-sm">
          <span className="block mb-1">Role (for testing)</span>
          <select className="w-full border rounded p-2" value={role} onChange={e => setRole(e.target.value as any)}>
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button className="bg-colorado-blue text-white rounded px-3 py-2 disabled:opacity-50" disabled={!canSubmit}>Create account</button>
          {!csrf && <span className="text-xs text-yellow-700">Waiting for CSRF…</span>}
        </div>
      </form>
      <div className="text-sm text-gray-600">
        Already have an account? <a href="/login" className="underline text-brand">Login</a>
      </div>
    </div>
  )
}
