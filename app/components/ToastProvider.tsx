'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

type ToastTone = 'success' | 'error' | 'info' | 'warn'
type ToastItem = { id: number; title?: string; description?: string; tone?: ToastTone; duration?: number }

type ToastContextType = {
  toast: (t: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(1)

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = idRef.current++
    const item: ToastItem = { id, duration: 3500, tone: 'info', ...t }
    setToasts(prev => [...prev, item])
    const timeout = setTimeout(() => remove(id), item.duration)
    return () => clearTimeout(timeout)
  }, [remove])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="fixed bottom-4 right-4 z-50 space-y-2 w-[min(92vw,380px)]">
        {toasts.map(t => (
          <div key={t.id} className={clsx(
            'rounded-md border shadow-lg p-3 text-sm bg-white/95 backdrop-blur flex items-start gap-2',
            t.tone === 'success' && 'border-green-300',
            t.tone === 'error' && 'border-red-300',
            t.tone === 'warn' && 'border-yellow-300',
            t.tone === 'info' && 'border-blue-300',
          )}>
            <div className={clsx('mt-1 h-2 w-2 rounded-full',
              t.tone === 'success' && 'bg-green-500',
              t.tone === 'error' && 'bg-red-500',
              t.tone === 'warn' && 'bg-yellow-500',
              t.tone === 'info' && 'bg-blue-500',
            )} />
            <div className="flex-1">
              {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
              {t.description && <div className="text-gray-700">{t.description}</div>}
            </div>
            <button className="text-gray-500 hover:text-gray-900" aria-label="Dismiss" onClick={() => remove(t.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
