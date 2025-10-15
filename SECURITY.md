# Security Policy

We take client confidentiality and data protection seriously. This project implements multiple safeguards aligned with SOC 2 principles.

Report a vulnerability by opening a private security advisory (GitHub Security Advisories) or emailing the repository owner.

## Supported Versions

- Main branch is actively maintained. Releases (when cut) will indicate support windows.

## Disclosure Policy

- Please provide a clear description, reproduction steps, and potential impact.
- Do not test against production data; use local or staging environments.

## Hardening Highlights

- Strict browser headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, COOP/CORP/COEP)
- Secure cookies (HttpOnly, SameSite=Strict, Secure in production)
- CSRF protection with sid/token and header enforcement on sensitive routes
- Sliding-window rate limiting on login/AI/cases
- No-store caching for protected routes
- Backend CORS restricted to configured `FRONTEND_ORIGIN`
- Environment validation using Zod
- Structured logging with redaction

See `docs/SECURITY_OVERVIEW.md` for implementation details.
