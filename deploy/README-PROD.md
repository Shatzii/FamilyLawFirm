# Deploying to law.shatzii.com

This uses a single-domain setup with Nginx reverse proxy:

- <https://law.shatzii.com> → Next.js (frontend)
- <https://law.shatzii.com/api> → FastAPI (backend)

## 1) Prepare environment

Create a `.env.prod` at repo root:

```env
FRONTEND_ORIGIN=https://law.shatzii.com
BACKEND_URL=https://law.shatzii.com
DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>
REDIS_URL=redis://<host>:6379
MINIO_ENDPOINT=<host:port>
MINIO_ACCESS_KEY=<key>
MINIO_SECRET_KEY=<secret>
JWT_SECRET=<32+ char secret>
CSRF_SECRET=<32+ char secret>
```

Optional: AI_URL, MATRIX_URL, JITSI_URL, DOCUSEAL_URL, CALCOM_URL, UMAMI_URL

## 2) Build and run
- Build images and start services with the prod compose file.
- Add TLS (LetsEncrypt) by running Nginx with an SSL-enabled config (not included here).

## 3) Notes
- Backend CORS will only allow FRONTEND_ORIGIN.
- CSP in Next.js should be trimmed to production origins only.
- Replace any localhost references in env with the production URLs.
