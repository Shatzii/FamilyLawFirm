import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // In host-based dev, backend container maps 4001->3001, so default to 4001
  BACKEND_URL: z.string().url().default('http://localhost:4001'),
  FRONTEND_ORIGIN: z.string().url().optional(),
  CSRF_SECRET: z.string().min(16).optional(),
})

export type Env = z.infer<typeof EnvSchema>

export const env: Env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  CSRF_SECRET: process.env.CSRF_SECRET,
})
