# Railway deployment

This repo supports Railway for both services:

- Frontend (Next.js): use `Dockerfile.frontend.prod`
- Backend (FastAPI): use `packages/backend/Dockerfile`

## Setup

1) Create two Railway services from this repo:
   - Frontend → specify Dockerfile path: `Dockerfile.frontend.prod`
   - Backend → specify Dockerfile path: `packages/backend/Dockerfile`
2) Set variables in Railway for each service:

    - Frontend:
       - NODE_ENV=production
       - BACKEND_URL (e.g.):

          ```text
          https://your-backend.railway.app
          ```

       - FRONTEND_ORIGIN (e.g.):

          ```text
          https://familylaw.netlify.app
          ```

    - Backend:
       - FRONTEND_ORIGIN (e.g.):

          ```text
          https://familylaw.netlify.app
          ```

       - JWT_SECRET, CSRF_SECRET
       - DATABASE_URL, REDIS_URL
       - MINIO_* or S3 equivalents
3) Domains
   - Attach your custom domains when ready: law.shatzii.com (frontend) and api.shatzii.com (backend)
4) Notes
   - Both containers honor Railway’s dynamic PORT automatically.
   - CSP in Next.js is production-safe by default; ensure BACKEND_URL is accurate.

## Troubleshooting

If your Railway logs show something like:

- "Railpack 0.9.x – Detected Node" and it runs `npm ci` / `npm run build` for Next.js
- Then tries to `uvicorn main:app` and healthcheck `/` fails repeatedly

It means the service was created with Railpack auto-detection at the repo root (frontend), not using the backend Dockerfile.

Fix:
- Recreate (or edit) the Railway service to use the backend Dockerfile:
   - Deployment method: Dockerfile
   - Dockerfile path: `packages/backend/Dockerfile`
   - Start command: none needed (embedded in Dockerfile)
   - Env vars: set `FRONTEND_ORIGIN`, `JWT_SECRET`, `CSRF_SECRET`, `DATABASE_URL`, etc.
- Alternatively, if you must use Nixpacks (auto): set Root Directory to `packages/backend` and Start Command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.

Remember: in Option A, Railway should only run the backend API. The frontend is deployed on Netlify.
