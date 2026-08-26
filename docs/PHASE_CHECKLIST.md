# Phase Checklist

Fresh scaffold (Vite + React + TypeScript + Supabase + Tailwind + shadcn/ui). No prior codebase existed beyond a placeholder README.

## Phase 1 — Project scaffold
- [x] Vite + React + TypeScript project (`package.json`, `vite.config.ts`, `tsconfig*.json`)
- [x] Tailwind CSS configured with semantic tokens: `canopy`, `gold`, `charcoal`, `cream`, `lime` (`tailwind.config.ts`)
- [x] shadcn/ui-style primitives hand-authored on Radix UI: Button, Input, Textarea, Label, Checkbox, Select, Dialog, Card, Badge (`src/components/ui/`)
- [x] ESLint config, `.gitignore`, `.env.example`

## Phase 2 — Supabase schema & RLS
- [x] `supabase/config.toml` — local CLI project config, public signup disabled
- [x] `supabase/migrations/0001_extensions_and_helpers.sql` — `admin_profiles`, `is_admin()`/`is_root_admin()` helpers, `set_updated_at()` trigger
- [x] `0002_products.sql` — `products` + `product_attributes` (repeatable key/value agronomy rows, not a fixed 3-bullet field)
- [x] `0003_knowledge_articles.sql`
- [x] `0004_testimonials.sql` (consent-gated public visibility)
- [x] `0005_site_copy.sql`
- [x] `0006_enquiries.sql` (public insert-only, no public select, admin select/status-update)
- [x] `0007_events_and_logs.sql` — `client_events`, `server_logs`
- [x] `0008_notify_enquiry_webhook.sql` — documents the webhook wiring for the notify-enquiry stub
- [x] Every table: `deleted_at timestamptz null`; no hard `DELETE` anywhere in app code
- [x] RLS policies on every table enforcing public-vs-admin and root_admin-vs-app_admin distinctions

## Phase 3 — Seed content
- [x] `supabase/seed.sql`: 30 product SKUs (20 hybrid + 10 open-pollinated) with 3-6 structured agronomy attributes each
- [x] 3 testimonials seeded with `consent = false` (no consent record exists from the original site)
- [x] Site copy: hero, stats, CTA banner, About body, PGG Wrightson rebrand story (verbatim)
- [x] Admin account provisioning documented (not seeded directly — auth users can't be created via portable SQL)
- [x] Stripped: "100% purity" claim, "Best Agri Company" self-claim, stray template-artifact placeholder text, generic stock-illustration filler copy

## Phase 4 — Shared library
- [x] `src/lib/supabase.ts` — client from `import.meta.env`
- [x] `src/lib/withActiveOnly.ts` — shared soft-delete query helper, used by every feature's read path
- [x] `src/lib/trackEvent.ts` — single reusable, no-PII observability call
- [x] `src/lib/useLocalSettings.ts` — localStorage-backed admin UI prefs hook
- [x] `src/lib/database.types.ts` — hand-written row types mirroring the SQL schema

## Phase 5 — Public site
- [x] Sticky nav, hero (dark canopy gradient, eyebrow pill, two-line lime headline, dual CTA), stat strip
- [x] Products page: search + crop-type + region filters, responsive grid, "View product" opens the enquiry modal pre-filled with crop interest
- [x] Dark "Innovation & quality" split section
- [x] Knowledge section/page/detail route (empty-state ready; no seed articles per content gap)
- [x] Gold CTA banner
- [x] Footer with link columns
- [x] Enquiry modal: name/mobile/crop-interest/message/consent, persists to Supabase, thank-you state
- [x] About page (who-we-are body + rebrand story, both from site_copy)
- [x] Contact page: functional enquiry form + explicit "ANZ TO PROVIDE" placeholder for business details (no fabricated contact info)
- [x] Accessibility: semantic landmarks, one h1 per page, visible focus rings (`:focus-visible` in `index.css`), alt text on product/article images, dark-charcoal-on-lime/gold text combinations for contrast

## Phase 6 — Admin panel
- [x] Email/password login (`/admin/login`), no public signup
- [x] `ProtectedRoute` (session required; optional `requireRole="root_admin"`)
- [x] Dashboard with content counts
- [x] Products: full CRUD (list, create, edit, soft-delete), repeatable attribute rows
- [x] Knowledge Articles: full CRUD, markdown body field, published toggle
- [x] Testimonials: full CRUD, consent toggle surfaced explicitly
- [x] Site Copy: key/value editor for every documented key, live-read by public pages
- [x] Enquiries: read-only submitted fields + status dropdown (new/contacted/closed)
- [x] Manage Admins (root_admin only route + RLS-backed): list + deactivate; invite is a documented extension point pending a service-role edge function

## Phase 7 — Testing
- [x] Vitest + React Testing Library configured (`vitest.config` lives inside `vite.config.ts`, `src/test/setup.ts`)
- [x] Playwright configured (`playwright.config.ts`, `e2e/`), REST-mocking helper so specs don't need a live Supabase project
- [x] Every feature slice has at least one unit test covering both the public view and the admin CRUD, plus a validation-failure case
- [x] Playwright happy-path specs: public site (home/products/enquiry modal/knowledge/contact), admin auth gate

## Phase 8 — Docs
- [x] `docs/ARCHITECTURE.md`
- [x] `docs/PHASE_CHECKLIST.md` (this file)
- [x] `docs/TEST_REPORT.md`

## Deferred (explicitly out of scope this pass)
multilingual/i18n, dealer/distributor locator or map, product comparison tool, saved/favorite products, careers/ATS, CRM/PIM/DAM integrations, e-commerce/payments/dealer portal, analytics beyond `trackEvent()`, Brevo email notifications (stub only).
