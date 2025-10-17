# Deployment Guide — law.shatzii.com

This document explains how to:
- Create the subdomain in GoDaddy (law.shatzii.com)
- Choose a deployment path (Netlify + Railway or your own server with Docker + Nginx)
- Configure environment variables securely
- Add TLS and test locally over HTTPS
- Troubleshoot common issues (NXDOMAIN, ports, cookies)

If you only need the quick checklist, jump to the end.

> Recommended: Option A — Netlify (frontend) + Railway (backend). It’s the fastest to ship and lowest ops. The steps below include a 10‑minute quickstart for this path.

### Option A quickstart (10 minutes)

1) Netlify (frontend)
  - Connect the repo; it will pick up `netlify.toml` automatically.
  - Set env vars:
    - `BACKEND_URL = https://api.shatzii.com` (or your Railway backend URL)
    - `FRONTEND_ORIGIN = https://law.shatzii.com`
  - Add custom domain `law.shatzii.com` in Netlify Domains.
  - In GoDaddy, create a CNAME: `law` → your-site-name.netlify.app.

2) Railway (backend)
  - Create a service from this repo with Dockerfile: `packages/backend/Dockerfile`.
  - Set env vars:
    - `FRONTEND_ORIGIN = https://law.shatzii.com`
    - `JWT_SECRET`, `CSRF_SECRET`, `DATABASE_URL` (and any optional `REDIS_URL`, `MINIO_*`).
  - (Recommended) Attach custom domain `api.shatzii.com`; follow Railway’s CNAME instructions in GoDaddy.

3) Verify
  - Wait for DNS to propagate.
  - Visit `https://law.shatzii.com` and run the app.
  - Check `https://law.shatzii.com/api/health` — backend should be `up`.
  - Try signup/login; cookies require HTTPS.

## 1) Create the subdomain in GoDaddy

Goal: Make law.shatzii.com point to where your app is hosted.

- Sign in to GoDaddy → Domains → your root domain (shatzii.com) → DNS → Manage DNS.
- Decide where you will host:
  - If hosting yourself on a server/VM with Nginx: create an A record
    - Type: A
    - Name/Host: law
    - Value/Points to: <YOUR_SERVER_IPV4>
    - TTL: 1 hour (or default)
  - If hosting on Netlify (frontend): create a CNAME
    - Type: CNAME
    - Name/Host: law
    - Value/Points to: your-site-name.netlify.app
  - If your backend is on Railway with a separate subdomain (optional):
    - Type: CNAME
    - Name/Host: api
    - Value/Points to: your-backend-service.up.railway.app

Notes:
- DNS propagation can take 5–30 minutes (sometimes longer).
- To verify DNS from Windows PowerShell:

```powershell
Resolve-DnsName law.shatzii.com
Resolve-DnsName api.shatzii.com
```

If you use a browser with DNS-over-HTTPS (DoH) or a VPN, it may bypass system DNS. Disable DoH or use a standard resolver while testing.

## 2) Environment variables (Frontend + Backend)

These keys are used by the app. Set them in your platform (Netlify, Railway) or your server env file.

- BACKEND_URL: URL your frontend uses to call the API.
  - Production single-domain via Nginx: https://law.shatzii.com
  - Separate backend domain: https://api.shatzii.com or your Railway backend URL
- FRONTEND_ORIGIN: Exact origin allowed by CORS on the backend (e.g., https://law.shatzii.com)
- JWT_SECRET: 32+ character secret for backend JWT signing
- CSRF_SECRET: 16+ character secret (frontend CSRF helper)
- DATABASE_URL: e.g., postgresql://USER:PASS@HOST:5432/DB
- REDIS_URL: e.g., redis://HOST:6379 (optional)
- MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY: for object storage (optional)

Also useful:
- NODE_ENV=production
- NEXT_TELEMETRY_DISABLED=1

Reference files:
- Frontend parsing: `lib/env.ts`
- Backend usage: `packages/backend/main.py`
- Compose wiring: `docker-compose.prod.yml`

## 3) Deployment Options

You have two primary paths:

### Option A — Netlify (frontend) + Railway (backend)

Frontend (Netlify):
1) Connect repo to Netlify. Build command: `npm run build`. Publish: `.next` (already in `netlify.toml`).
2) Set env vars:
   - BACKEND_URL = your Railway backend URL or https://api.shatzii.com
   - (optional) FRONTEND_ORIGIN = https://law.shatzii.com
3) Add the custom domain in Netlify: law.shatzii.com. Netlify will give a target like your-site-name.netlify.app.
4) In GoDaddy DNS, create a CNAME for `law` → your-site-name.netlify.app.
5) Wait for DNS and confirm HTTPS works.

Backend (Railway):
1) Create a Railway service from this repo using `packages/backend/Dockerfile`.
2) Set env vars:
   - FRONTEND_ORIGIN = https://law.shatzii.com
   - JWT_SECRET, CSRF_SECRET, DATABASE_URL, REDIS_URL, MINIO_*
3) Attach a custom domain (optional): api.shatzii.com. Railway will instruct you to set a CNAME in GoDaddy.
4) Confirm the Railway URL responds (and custom domain if configured).

Notes:
- The frontend must have BACKEND_URL pointing to the backend’s domain.
- CSP is already strict; ensure BACKEND_URL matches what you’ve configured.
- More details in `deploy/RAILWAY.md`.

### Option B — Your Server/VM with Docker + Nginx (single-domain)

This repo ships a production compose + Nginx proxy that serves:
- https://law.shatzii.com → Next.js (frontend)
- https://law.shatzii.com/api → FastAPI (backend)

Steps on your server:
1) Clone the repo and create a `.env.prod` at the repo root based on `.env.prod.example`.
2) Set required env vars:
   - FRONTEND_ORIGIN=https://law.shatzii.com
   - BACKEND_URL=https://law.shatzii.com
   - JWT_SECRET, CSRF_SECRET, DATABASE_URL, etc.
3) Bring up the stack:

```powershell
docker compose -f docker-compose.prod.yml up -d --build
```

4) Point your DNS A record (law) to the server’s public IPv4.
5) Add TLS:
   - Easiest: install a TLS-enabled Nginx config and certificates
   - Replace `deploy/nginx.conf` with `deploy/nginx.ssl.conf` and mount certs

```powershell
# After you provision certs to deploy/certs
docker compose -f docker-compose.prod.yml -f docker-compose.ssl.yml up -d
```

Files involved:
- `docker-compose.prod.yml` (frontend, backend, nginx)
- `deploy/nginx.conf` (HTTP only)
- `deploy/nginx.ssl.conf` (HTTPS; expects certs at deploy/certs)
- `docker-compose.ssl.yml` (enables 443 and mounts certs)

Certificate options:
- Let’s Encrypt on the server (recommended for public): place fullchain/key into `deploy/certs/law.shatzii.com.pem` and `law.shatzii.com-key.pem`.
- For local-only testing, use mkcert to generate trusted local certs.

## 4) Local HTTPS testing (production-like)

If you want to test production behavior (Secure cookies, HSTS, CSP) locally:
1) Add to hosts file (Windows) to map the subdomain to localhost:

```
C:\Windows\System32\drivers\etc\hosts
127.0.0.1   law.shatzii.com
```

2) Disable browser DNS-over-HTTPS or use a browser/profile without DoH while testing.
3) Generate or place certs in `deploy/certs/`:
   - `law.shatzii.com.pem`
   - `law.shatzii.com-key.pem`
4) Run the TLS compose override:

```powershell
docker compose -f docker-compose.prod.yml -f docker-compose.ssl.yml up -d --build
```

5) Visit https://law.shatzii.com

PowerShell quick checks:

```powershell
Test-NetConnection -ComputerName law.shatzii.com -Port 443
```

If you see DNS_PROBE_FINISHED_NXDOMAIN, double-check hosts file and DoH/VPN.

## 5) Troubleshooting

- NXDOMAIN / DNS doesn’t resolve:
  - Propagation: wait and verify with `Resolve-DnsName law.shatzii.com`
  - Disable DoH/VPN; ensure hosts override is effective for local testing
- 404s or blank page:
  - Confirm `BACKEND_URL` is correct and reachable
  - For single-domain, `BACKEND_URL` should be https://law.shatzii.com; API is proxied at /api
- CORS errors:
  - Backend allows only `FRONTEND_ORIGIN`. Ensure it matches the exact scheme + host
- Cookies not set in production:
  - Secure/HttpOnly cookies require HTTPS; test over https://
- Port conflicts (local):
  - Free port 3001 if running dev; prod compose exposes services internally and publishes via Nginx

Useful PowerShell one-liners:

```powershell
Resolve-DnsName law.shatzii.com
curl -I https://law.shatzii.com
Test-NetConnection -ComputerName law.shatzii.com -Port 80
Test-NetConnection -ComputerName law.shatzii.com -Port 443
```

## 6) Security notes

- CSP/HSTS/X-Frame-Options are set in `next.config.js` and reinforced by Nginx.
- Production CSP should include only your backend URL/origin.
- Rotate JWT_SECRET and CSRF_SECRET if compromised.
- Store secrets in platform secret managers (Netlify, Railway, cloud provider), not in git.

## 7) Quick checklist

- GoDaddy → add law.shatzii.com (A for server, or CNAME to Netlify)
- Set env vars (FRONTEND_ORIGIN, BACKEND_URL, JWT_SECRET, DATABASE_URL, etc.)
- Deploy via:
  - Netlify (frontend) + Railway (backend), or
  - Docker + Nginx on your server (single-domain /api proxy)
- Add TLS (Let’s Encrypt on server or Netlify-managed certs)
- Verify over HTTPS; test login and calculators
- Troubleshoot with Resolve-DnsName, Test-NetConnection, curl -I

References:
- `deploy/README-PROD.md`
- `deploy/RAILWAY.md`
- `deploy/nginx.conf` and `deploy/nginx.ssl.conf`
- `docker-compose.prod.yml` and `docker-compose.ssl.yml`
