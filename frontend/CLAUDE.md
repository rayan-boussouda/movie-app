# Frontend architecture guide

React 19 + TypeScript + Vite + TanStack Query + React Router v7 + React Hook Form + Zod +
Tailwind v4, built as ports-and-adapters (hexagonal). This file documents the pattern so it can
be reused as a starting convention in other frontend projects.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — eslint check
- `npm run preview` — preview the production build locally

## Layers

```
domain  → entity shape + Zod schema + Gateway "port" (interface), no framework/HTTP code
infra   → adapters implementing a port (http-*-gateway, mock-*), the only place using httpClient
use-case → framework-free functions that take a gateway and return the operation
ui      → hooks (wire use-cases to React Query), pages/features, routes, layouts
```

Dependency direction is one-way: `ui → use-case → domain ← infra`. `domain` never imports from
`infra` or `ui`. `infra` depends on `domain` (implements its port) but not on `use-case`/`ui`.

- **`domain/<thing>.ts`**: the entity's Zod schema and inferred types (`Genre`,
  `CreateGenre`, `UpdateGenre` via `.omit()`/`.partial()` off the base schema).
- **`domain/<thing>.port.ts`**: a `Gateway` type — the interface the rest of the app codes
  against (`getAll`, `getById`, `createX`, `updateX`, `deleteX`, ...). This is what makes the
  backend swappable (real HTTP vs. mock) without touching use-cases or UI.
- **`infra/<thing>/http-<thing>-gateway.ts`**: implements the port using the shared
  `httpClient` (axios instance in `infra/http-client.ts`, with a request interceptor that
  attaches the bearer token from `localStorage`). Every response is parsed through the domain
  Zod schema (`schema.parse(response.data)`) — the gateway is also the runtime validation
  boundary against the API. A `mock-*` gateway implementing the same port is the pattern for
  tests/storybook, not a separate ad hoc mock per test.
- **`use-case/<thing>/<verb>.ts`**: plain functions shaped
  `buildX = (gateway: XGateway) => async (args) => {...}`, i.e. gateway is injected, not
  imported directly. Business rules that aren't the API's job live here (e.g. sorting a list
  after fetch), not in the gateway or the hook.
- **`ui/features/<feature>/hooks/use<Thing>.ts`**: the only place React Query is used. Each hook
  wraps one use-case: `useQuery`/`useMutation` with `queryFn`/`mutationFn: buildX(gateway)`, and
  mutations invalidate the relevant query key `onSuccess`. Components never call gateways or
  use-cases directly — always through a hook.
- **`ui/features/<feature>/pages/`**: route-level components composed from hooks + presentational
  pieces. **`ui/layouts/`**: shell components (`AppLayout`, `AuthLayout`). **`ui/routes/`**:
  `AppRoutes.tsx` maps paths to pages/layouts.

## Adding a new resource

1. `domain/<thing>.ts` (schema + types) and `domain/<thing>.port.ts` (gateway interface).
2. `infra/<thing>/http-<thing>-gateway.ts` implementing the port, parsing responses with the
   domain schema.
3. `use-case/<thing>/*.ts` — one `buildX(gateway) => fn` per operation.
4. `ui/features/<feature>/hooks/use<Thing>.ts` wiring use-cases to React Query.
5. Pages/components under `ui/features/<feature>/pages/` consuming the hooks.

Don't skip layers (e.g. calling `httpClient` from a component, or a hook calling a use-case
without a gateway) even for a resource that feels trivial — consistency across resources is the
point of the pattern.

## Forms

React Hook Form + `@hookform/resolvers/zod`, resolved against the same domain Zod schema used
by the gateway (`createXSchema`/`updateXSchema`) — one schema is the source of truth for both
client-side validation and the shape sent to the API.

## Design system boundary

`@rayan.boussouda/ui-kit` is an external, reusable package — it never receives business logic
(no `isAdmin`, roles, or feature-flag props baked in). It exposes generic, unopinionated props;
this app's `ui/` layer decides *when* and *with what values* to pass them. If a ui-kit component
needs to change, update its `.stories.tsx` and `.test.tsx` in the same change.

## Conventions to keep

- Path alias `@/` → `src/`.
- Env vars via `import.meta.env.VITE_*` (`VITE_API_URL` for the API base URL).
- ESLint: `@typescript-eslint/no-unused-vars` with `^_` ignore pattern for intentionally unused
  args/vars.
- Auth token lives in `localStorage`, attached via the axios interceptor — don't pass tokens
  manually per-request.
