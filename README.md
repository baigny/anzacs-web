# anzacs-web

ANZ Agri Crop Sciences — public website + CMS admin panel.

Vite + React + TypeScript + Tailwind CSS + shadcn/ui-style components, backed by Supabase (Postgres + Auth + RLS).

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in real Supabase project values once one is linked
npm run dev
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, folder structure, data model, RLS/roles, env vars, how to run locally and test
- [`docs/PHASE_CHECKLIST.md`](docs/PHASE_CHECKLIST.md) — what was built, phase by phase
- [`docs/TEST_REPORT.md`](docs/TEST_REPORT.md) — test coverage summary, pass/fail status

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | start the Vite dev server |
| `npm run build` | typecheck + production build |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run test` | Vitest unit/component tests |
| `npm run test:e2e` | Playwright e2e tests (starts the dev server itself) |
| `npm run lint` | ESLint |

## Supabase

Schema, RLS policies, and seed content live under `supabase/`:

```bash
supabase link --project-ref <your-ref>     # or `supabase start` for a local instance
supabase db push                            # applies supabase/migrations/*.sql
supabase db execute -f supabase/seed.sql    # loads seed content
```

See `docs/ARCHITECTURE.md` for the full data model and RLS write-up.
