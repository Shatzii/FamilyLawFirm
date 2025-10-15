"use client"
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (res.ok) setStatus('Logged in'); else setStatus('Login failed')
  }
  async function doLogout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' })
    if (res.ok) setStatus('Logged out')
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={doLogin} className="bg-white border rounded p-4 space-y-3">
        <label className="block text-sm">
          <span className="block mb-1">Email</span>
          <input type="email" className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label className="block text-sm">
          <span className="block mb-1">Password</span>
          <input type="password" className="w-full border rounded p-2" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button className="bg-colorado-blue text-white rounded px-3 py-2">Sign In</button>
      </form>
      <div className="flex items-center gap-3">
        <button className="border rounded px-3 py-2" onClick={doLogout}>Logout</button>
        {status && <span className="text-sm text-gray-600">{status}</span>}
      </div>
    </div>
  )
}
