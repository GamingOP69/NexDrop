# NexDrop

Single-package full-stack file storage app built with Next.js App Router, Prisma, PostgreSQL, and optional Redis.

## Run locally
1. Copy `.env.example` to `.env`.
2. Start PostgreSQL and Redis.
3. Install dependencies: `npm install`
4. Push schema: `npx prisma db push`
5. Start: `npm run dev`

## Docker
`docker compose up --build`

## Notes
- Frontend and backend live in the same Next.js app.
- API routes are under `app/api`.
- Uploads are chunked and stored on disk under `STORAGE_PATH`.
- PostgreSQL is required; Redis is optional for future rate limiting and cache features.
