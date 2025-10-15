# Security Overview

This document summarizes security controls implemented in the codebase.

## Headers and Transport

- Next.js `next.config.js` sets:
  - Content-Security-Policy (CSP)
  - Strict-Transport-Security (HSTS)
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Referrer-Policy: no-referrer
  - Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy / Cross-Origin-Embedder-Policy
  - X-Download-Options & X-Permitted-Cross-Domain-Policies

## Cookies and Session

- Auth cookies use `HttpOnly`, `SameSite=Strict`, `Secure` (in production). Logout clears them safely.

## CSRF

- `lib/csrf.ts` issues a `sid` and `token`; `/api/auth/csrf` returns the token.
- Sensitive routes (login, cases POST, AI analyze POST) enforce `x-csrf-token`.

## Rate Limiting

- `lib/rateLimit.ts` implements a sliding window limiter applied to login, cases create, and AI analyze.

## CORS

- Backend (`packages/backend/main.py`) restricts CORS to `FRONTEND_ORIGIN` (from env).

## Cache Control on Protected Routes

- `middleware.ts` applies `Cache-Control: no-store` (+ `Pragma`, `Expires`) for authenticated protected paths.

## Environment Validation

- `lib/env.ts` validates critical vars using Zod.

## Logging

- `lib/logger.ts` provides structured logging and basic redaction of secrets.

## Secrets Management

- Local development uses `.env`/`.env.local`. In production, use platform secrets (not committed) and rotate regularly.

## Next Steps

- Add CI status checks to branch protection
- Add periodic dependency audit (npm audit / pip safety)
- Add security.txt endpoint if public-facing
