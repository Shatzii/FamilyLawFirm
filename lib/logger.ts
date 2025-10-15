type Level = 'debug' | 'info' | 'warn' | 'error'

function redact(value: unknown): unknown {
  if (typeof value === 'string') {
    // Basic redact for tokens/emails
    if (value.length > 12) return value.slice(0, 4) + '…' + value.slice(-4)
    return value.replace(/^[^@]+@/, '***@')
  }
  return value
}

export const logger = {
  log(level: Level, msg: string, data?: Record<string, unknown>) {
    const entry = { ts: new Date().toISOString(), level, msg, ...(data ? { data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, redact(v)])) } : {}) }
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](JSON.stringify(entry))
  },
  debug: (msg: string, data?: Record<string, unknown>) => logger.log('debug', msg, data),
  info: (msg: string, data?: Record<string, unknown>) => logger.log('info', msg, data),
  warn: (msg: string, data?: Record<string, unknown>) => logger.log('warn', msg, data),
  error: (msg: string, data?: Record<string, unknown>) => logger.log('error', msg, data),
}
