'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const ls = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const prefers = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
    const isDark = ls ? ls === 'dark' : prefers
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
  }

  if (!mounted) return null
  return (
    <button onClick={toggle} className="text-sm underline text-blue-700">
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
