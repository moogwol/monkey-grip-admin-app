# Copilot Instructions for Monkey Grip Admin App

## Project Overview
A full-stack BJJ club management system with member records, class coupons, and image uploads.

- Backend: Node.js + Express + PostgreSQL 17
- Frontend: React Router v7 (SSR) + TypeScript + Vite
- Orchestration: Docker Compose (dev and prod)
- Images: sharp + local volume file storage (MinIO removed)

## Architecture & Structure
- Backend API at `/api/*` in [mg-api/src](mg-api/src):
	- Routers: [routes/contacts.js](mg-api/src/routes/contacts.js) (`/api/members`), [routes/coupons.js](mg-api/src/routes/coupons.js), [routes/member-coupons.js](mg-api/src/routes/member-coupons.js), [routes/images.js](mg-api/src/routes/images.js)
	- Models: [models/Contact.js](mg-api/src/models/Contact.js), [models/ClassCoupon.js](mg-api/src/models/ClassCoupon.js)
	- Services: [services/imageService.js](mg-api/src/services/imageService.js) with atomic writes + resized variants
	- Entry: [src/server.js](mg-api/src/server.js) registers routes and health endpoint
	- DB: [src/database.js](mg-api/src/database.js) wraps pg.Pool
- Database schema and seed in [mg-backend](mg-backend): [init-db.sql](mg-backend/init-db.sql), [seed-data.sql](mg-backend/seed-data.sql)
- Frontend in [mg-frontend](mg-frontend):
	- API client: [app/api.ts](mg-frontend/app/api.ts) with `ApiResponse<T>` and `VITE_API_URL`
	- File-based routes: [routes](mg-frontend/routes) (e.g., `_layout.members.$memberId.tsx` patterns)
	- SSR config: [react-router.config.ts](mg-frontend/react-router.config.ts)

## Data Flow & Key Patterns
- Frontend calls the API via `apiClient` in [app/api.ts](mg-frontend/app/api.ts). Responses follow `{ success, data, message, errors?, count? }`.
- Members: CRUD at `/api/members`; soft-delete via `DELETE` sets `active=false`. Filters supported (e.g., `belt_rank`, `payment_status`). See [routes/contacts.js](mg-api/src/routes/contacts.js) and [models/Contact.js](mg-api/src/models/Contact.js).
- Coupons: CRUD + usage (`PATCH /api/coupons/:id/use`) + stats and expiring summaries. See [routes/coupons.js](mg-api/src/routes/coupons.js).
- Member coupons: `/api/members/:id/coupons` and summary. See [routes/member-coupons.js](mg-api/src/routes/member-coupons.js).
- Images: `POST /api/images/members/:memberId/profile-image` via `multer.memoryStorage` → sharp resized files written under `IMAGE_STORAGE_PATH` and served by `/api/images/serve/:bucket/:filename`. See [middleware/upload.js](mg-api/src/middleware/upload.js) and [services/imageService.js](mg-api/src/services/imageService.js).

## Conventions
- Validation: express-validator in routers; numeric `id` validated with regex (`^\d+$`).
- Models encapsulate SQL with prepared statements; avoid raw concatenation.
- Soft deletes for members; use dedicated PATCH routes for domain actions (`promote`, `payment-status`).
- Frontend routes use React Router v7 file naming for layouts (`_layout.*`) and dynamic segments (`$memberId`).

## Development Workflow
- Docker (recommended for full stack):
	- Dev: `docker compose -f docker-compose.dev.yml up`
	- Ports: API 3000, Frontend 5173, Postgres 5432, Adminer 8080
	- Env: Frontend uses `VITE_API_URL=http://mg-api:3000/api`; API uses `DB_*` and `IMAGE_STORAGE_PATH`.
- Local without Docker:
	- API: `cd mg-api && npm install && npm run dev`
	- Frontend: `cd mg-frontend && npm install && npm run dev`
	- Build/start frontend: `npm run build` then `npm start` (serves build/server & build/client).
- Quick API smoke test: [test-api.sh](test-api.sh) exercises `/health` and image upload/serve.

## Integration Points
- Database tables: see [init-db.sql](mg-backend/init-db.sql) for `members` and `class_coupons` schema, indexes, and constraints.
- Adminer available at `http://localhost:8080` (service `dd-admin`) in Compose.
- Images are stored in the filesystem under `IMAGE_STORAGE_PATH`. MinIO was removed; [config/minio.js](mg-api/src/config/minio.js) is a placeholder and not used.

## Extending the Project (examples)
- Add a new API endpoint: create a router in [mg-api/src/routes](mg-api/src/routes), register it in [src/server.js](mg-api/src/server.js), validate inputs with express-validator, and implement queries in a model under [mg-api/src/models](mg-api/src/models).
- Add a frontend view: create a file in [mg-frontend/routes](mg-frontend/routes) following React Router v7 conventions; use `apiClient` from [app/api.ts](mg-frontend/app/api.ts).

If any workflow or pattern is unclear or missing, tell me which sections to refine and I’ll iterate.
