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
