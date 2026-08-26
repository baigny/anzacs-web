# Architecture

## Stack

- **Build tool**: Vite 5 + React 18 + TypeScript (strict mode)
- **Styling**: Tailwind CSS with semantic design tokens (`canopy`, `gold`, `charcoal`, `cream`, `lime`) defined in `tailwind.config.ts`
- **UI primitives**: shadcn/ui-style components built on Radix UI primitives, hand-authored in `src/components/ui/` (Button, Input, Select, Dialog, Checkbox, Card, Badge, Label, Textarea)
- **Backend**: Supabase (Postgres + Auth + Row Level Security + Edge Functions), accessed via `@supabase/supabase-js`
- **Routing**: React Router v6
- **Rich text**: Markdown (via `react-markdown` on read, a plain `<textarea>` on write) — deliberately dependency-light rather than a full WYSIWYG editor
- **Testing**: Vitest + React Testing Library (unit/component), Playwright (e2e)

There is a single Vite app at the repo root (no monorepo tooling) — this is a "basic tier" site per the brief, so a single `package.json` and `src/` tree is enough.

## Folder structure

```
src/
  app/App.tsx              -- route table, wraps everything in AuthProvider
  main.tsx                 -- React root, BrowserRouter
  index.css                -- Tailwind entry + base layer (focus rings, etc.)
  components/
    ui/                     -- shadcn/ui-style primitives (Button, Dialog, Select, ...)
    layout/                 -- PublicNav, PublicFooter, PublicLayout, AdminLayout
    enquiry/                -- EnquiryModal + EnquiryModalProvider (shared context)
  features/
    products/
      types/                -- Product, ProductAttribute, filters
      api/                  -- products.api.ts (public fetch + admin CRUD, mapped to/from DB rows)
      public/                -- ProductsPage, ProductCard
      admin/                -- AdminProductsListPage, AdminProductFormPage
      __tests__/             -- Vitest specs for both the public view and admin CRUD
    knowledge/    (same shape: types / api / public / admin / __tests__)
    testimonials/ (same shape)
    site-copy/    (same shape; "admin" folder holds the key/value editor)
    enquiries/    (same shape; public = form submission, admin = read/status-update inbox)
    auth/         (AuthProvider, ProtectedRoute, LoginPage, AdminUsersPage, auth.api.ts)
  lib/
    supabase.ts             -- Supabase client, reads import.meta.env
    withActiveOnly.ts        -- shared soft-delete query helper
    trackEvent.ts            -- single reusable client_events writer
    useLocalSettings.ts      -- localStorage-backed admin UI prefs hook
    database.types.ts        -- hand-written row types mirroring the SQL schema
    utils.ts                 -- cn() class merge helper
  pages/                     -- top-level route components that aren't feature-owned
    HomePage.tsx, AboutPage.tsx, ContactPage.tsx, NotFoundPage.tsx, admin/DashboardPage.tsx
  test/setup.ts              -- Vitest + Testing Library jest-dom setup
supabase/
  migrations/*.sql           -- schema + RLS, applied in numeric order
  seed.sql                   -- seed content (products, testimonials, site copy)
  functions/notify-enquiry/  -- stub edge function (see "Enquiry notification" below)
  config.toml                -- local Supabase CLI project config
e2e/                          -- Playwright specs + REST-mocking helpers
docs/                         -- this file, PHASE_CHECKLIST.md, TEST_REPORT.md
```

## Data model

| Table | Purpose | Soft delete? |
|---|---|---|
| `admin_profiles` | role claim (`root_admin` \| `app_admin`) for admin auth users | yes |
| `products` | seed catalog SKUs | yes |
| `product_attributes` | repeatable {label, value} agronomy rows per product | yes |
| `knowledge_articles` | markdown articles | yes |
| `testimonials` | farmer quotes, gated by `consent` | yes |
| `site_copy` | key/value editable text blocks | yes |
| `enquiries` | public enquiry form submissions | yes |
| `client_events` | no-PII observability sink for `trackEvent()` | yes |
| `server_logs` | error log sink for edge functions / backend code | yes |

Every table has `deleted_at timestamptz null`. **No app code path issues a hard `DELETE`** — admin "delete" actions call an `update` that sets `deleted_at = now()`. All reads (public and admin) go through `src/lib/withActiveOnly.ts`, which appends `.is("deleted_at", null)` (and, optionally, an `active`/`published`/`consent` truthiness filter) to a query builder chain.

`products.hero_image_url` replaces the old site's standalone Image Gallery — there is no separate gallery table/route in this rebuild.

## Roles & RLS

Two admin roles, stored in `admin_profiles.role`:

- **root_admin** — everything app_admin can do, plus manage other admin accounts (the `admin_profiles` table itself).
- **app_admin** — full CRUD on Products / Knowledge / Testimonials / Site Copy / Enquiries, but cannot touch `admin_profiles`.

RLS is the source of truth (not just UI route guards). Two SQL helper functions in `0001_extensions_and_helpers.sql` back every policy:

```sql
public.is_admin()       -- true if auth.uid() has an active, non-deleted admin_profiles row
public.is_root_admin()  -- true if that row's role = 'root_admin'
```

Policy shape, table by table:

- **products / knowledge_articles / testimonials / site_copy**: public `SELECT` only where the relevant flag (`active` / `published` / `consent`) is true and `deleted_at is null`; admin `SELECT`/`INSERT`/`UPDATE` gated by `is_admin()`.
- **product_attributes**: same public/admin split, scoped through the parent product's flag via an `exists(...)` subquery.
- **enquiries**: public `INSERT` only (`to anon, authenticated`, with a `with check` requiring consent + non-empty name/mobile) — **there is no public SELECT policy at all**, so submitted data can never be read back by an unauthenticated client. Admin `SELECT`/`UPDATE` gated by `is_admin()`.
- **client_events**: public `INSERT` allowed (fire-and-forget observability), admin-only `SELECT`.
- **server_logs**: written by trusted server-side code (service role bypasses RLS); admin-only `SELECT`.
- **admin_profiles**: `is_root_admin()` gets full `ALL`; every admin can additionally `SELECT` their own row (`id = auth.uid()`) so `getCurrentAdminSession()` works for app_admin too.

The app layer double-enforces some of this (e.g. the admin Enquiries UI only exposes a status dropdown, never an edit form for the submitted fields) but the RLS policies are what actually stop a non-admin or a compromised client from writing/reading data it shouldn't.

## Auth model

- Supabase Auth, email/password. **No public sign-up route exists anywhere in the app** (`enable_signup = false` in `supabase/config.toml`, and there's no `/admin/signup` component).
- New admins are provisioned two ways:
  1. `supabase/seed.sql` documents the CLI command to create an auth user, then an `insert into admin_profiles (...)` to attach the role.
  2. A root-only "invite" path (`inviteAdmin()` in `src/features/auth/api/auth.api.ts`) is stubbed as an explicit extension point — it throws today because creating an auth user requires the service-role key, which must run server-side (an edge function), not from the browser client. Wiring a real edge function for this is the one auth piece intentionally left as a TODO with a clear seam.
- `AuthProvider` (`src/features/auth/AuthProvider.tsx`) resolves the Supabase session into an `AdminSession` (joins `admin_profiles`) and exposes it via `useAuth()`.
- `ProtectedRoute` (`src/features/auth/admin/ProtectedRoute.tsx`) redirects to `/admin/login` when there's no session, and can additionally require `requireRole="root_admin"` for the admin-management route.

## Enquiry notification extension point

Per the brief, Brevo/email notifications are explicitly deferred. `supabase/functions/notify-enquiry/index.ts` is a stub Deno edge function that logs the enquiry (to `server_logs` when service credentials are present, otherwise to console) and returns success — it does not send email. `supabase/migrations/0008_notify_enquiry_webhook.sql` documents exactly how to wire a Database Webhook (or a `pg_net`-based trigger) once a real project is linked, so a future phase can drop a Brevo call into the marked `NOTE` in that function without touching the enquiry flow or schema.

## Environment variables

Copy `.env.example` to `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

`src/lib/supabase.ts` reads these via `import.meta.env` and falls back to a placeholder URL/key (with a console warning) so the app still boots without a linked project — every network call will simply fail until real values are supplied.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in real Supabase values once a project is linked
npm run dev                  # Vite dev server on http://127.0.0.1:5173
```

To stand up the schema against a real (or local) Supabase project:

```bash
supabase link --project-ref <your-ref>     # or `supabase start` for a local instance
supabase db push                            # applies supabase/migrations/*.sql
supabase db execute -f supabase/seed.sql    # loads seed content
```

## Running tests

```bash
npm run typecheck   # tsc -b --noEmit
npm run test        # Vitest (unit/component), all feature slices
npm run test:e2e    # Playwright (starts the Vite dev server itself)
```

Playwright specs intercept Supabase REST calls (`e2e/mocks.ts`) so they exercise real UI/network wiring without needing a live Supabase project.

## Observability & admin UX conventions

- `trackEvent(name, meta)` (`src/lib/trackEvent.ts`) is the single call site the whole public app uses to write to `client_events` — no PII, fire-and-forget, never throws.
- `useLocalSettings(key, default)` (`src/lib/useLocalSettings.ts`) is the only place admin UI preferences (e.g. table density) are persisted — always to `localStorage`, never to Supabase.
- Every edge-function code path wraps in try/catch and (when service credentials are available) logs to `server_logs`.
