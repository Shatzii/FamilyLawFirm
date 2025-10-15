import clsx from 'clsx'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}
export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus-visible:ring-2 ring-brand disabled:opacity-50'
  const variants = {
    primary: 'bg-brand text-white hover:opacity-90',
    secondary: 'bg-accent text-white hover:opacity-90',
    ghost: 'bg-transparent text-brand hover:bg-brand/10',
  } as const
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-5 py-2.5 text-lg' } as const
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-card border border-card rounded-lg',
        interactive && 'transition-transform shadow-sm hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
      {...props}
    />
  )
}

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & { tone?: 'success' | 'danger' | 'warn' | 'info' }
export function Badge({ className, tone = 'info', ...props }: BadgeProps) {
  const tones: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warn: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  }
  return <span className={clsx('px-2 py-0.5 rounded-full text-xs', tones[tone], className)} {...props} />
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
export function Input({ className, label, id, ...props }: InputProps) {
  const input = (
    <input
      id={id}
      className={clsx('w-full border border-card rounded px-3 py-2 bg-card focus-visible:ring-2 ring-brand outline-none', className)}
      {...props}
    />
  )
  if (!label) return input
  return (
    <label className="block text-sm">
      <span className="block mb-1 text-muted">{label}</span>
      {input}
    </label>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)} />
}
