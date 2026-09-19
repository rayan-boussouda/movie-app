# Backend architecture guide

Node.js + Express 5 + TypeScript + Prisma (PostgreSQL) + Zod + BullMQ/Redis + pino + Sentry.
This file documents the layered pattern this backend follows, so it can be dropped into other
Express/Prisma services as a starting convention.

## Commands

- `npm run dev` — start dev server (nodemon + ts-node)
- `npm run build` — compile TypeScript (`tsc`)
- `npm run lint` — eslint check
- `npm test` — run test suite against `.env.test`
- `npm run migrate:dev` / `migrate:deploy` — run Prisma migrations via Docker

## Request flow

```
route → [auth] → [requireRole] → validate(schema) → controller → service → prisma
```

- **Routes** (`src/routes/*.routes.ts`): wire an Express `Router` to a controller. Apply
  middleware here, in order: `auth` (JWT) → `requireRole(role)` → `validate(schema)`. Routes
  contain no logic.
- **Controllers** (`src/controllers/*.controller.ts`): translate HTTP ↔ service calls only.
  Every handler is `async (req, res, next) => { try { ... } catch (error) { next(error) } }`.
  No business logic, no direct Prisma access.
- **Services** (`src/services/*.service.ts`): all business logic and the only layer that talks
  to Prisma. Catch `Prisma.PrismaClientKnownRequestError` and translate known codes (`P2002`
  duplicate, `P2025` not found, `P2003` FK constraint) into an `AppError` with the right status
  code; rethrow anything else.
- **Schemas** (`src/schemas/*.schemas.ts`): one Zod object per route shaped as
  `z.object({ body, params, query })` (only the parts actually used). Export the inferred
  `['body']`/`['params']` types and use those as service function parameter types — services
  are typed from the schema, not from hand-written interfaces.

## Errors

- One error type: `AppError extends Error` with `statusCode` (`src/midellewares/errorHandler.ts`).
  Throw it from services for expected failures (`404`, `409`, `403`…).
- `validate` middleware catches `ZodError` and converts it to `AppError(messages, 400)`
  automatically — don't hand-roll validation error responses in controllers.
- The global `errorHandler` is the last middleware in `app.ts`. It handles `AppError`, known
  Prisma error codes, then falls back to a generic `500`. Sentry's Express error handler is
  wired in before it to capture unhandled cases.

## Auth

- `auth` middleware (`src/midellewares/auth.ts`) verifies a Bearer JWT and attaches
  `req.user = { userId, role }`.
- `requireRole(role)` gates a route to a single role (checked after `auth`). Public reads (e.g.
  `GET` list/by-id) skip `auth` entirely; mutations require it; admin-only mutations add
  `requireRole('ADMIN')`.

## Background work

- BullMQ queues live in `src/queues/*.queue.ts` (e.g. `new Queue(name, { connection: redisConnection, defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } } })`).
  Corresponding workers live in `src/workers/*.worker.ts`. Enqueue from a service, never from a
  controller directly, so the enqueue is part of the same business-logic unit it belongs to.
- Redis connection is centralized in `src/config/redis.ts`; reuse it rather than creating new
  connections per queue/cache use.

## Logging & observability

- Structured logging via `pino`, wired as request middleware with `pinoHttp({ logger })` in
  `app.ts`. Use the shared `logger` from `src/config/logger.ts`; don't `console.log` in
  application code (validation's debug `console.log` is the one intentional exception, not a
  pattern to copy).
- Sentry (`@sentry/node`) is initialized separately (`src/instrument.ts`) and its Express error
  handler registered before the final `errorHandler`.

## Data layer

- Prisma is the only ORM access point, via the singleton client in `src/config/prisma.ts`.
- Migrations are applied through Docker (`migrate:dev` / `migrate:deploy` exec into the app
  container), not run bare against a local DB.
- Seed data lives under `prisma/seeds/` (`reference/` for lookup tables, `sample/` for demo
  data), driven by `prisma/seed.ts`.

## Testing

- Vitest + Supertest, integration-style: real Postgres via `globalSetup.ts`, not mocked Prisma.
  Tests live in `src/__tests__/*.integration.test.ts`, one file per resource, run with
  `fileParallelism: false` since they share a database.
- Run with `.env.test` env file (`node --env-file=.env.test vitest run`) so tests never touch
  dev/prod data.

## Conventions to keep

- Prettier: semicolons, single quotes, trailing commas, 2-space indent (`.prettierrc`).
- `strict: true` TypeScript, CommonJS output, `rootDir: src`.
- New resource = new route + controller + service + schema file, following the existing
  resource modules as the template — don't collapse layers even for small resources.

## Don't

- Don't access Prisma directly from a controller — go through a service.
- Don't hand-roll validation error responses in controllers — the `validate` middleware +
  `AppError` handle it.
- Don't create a new Redis connection per queue/cache use — reuse `src/config/redis.ts`.
