# Test Report

Last run: 2026-08-26. All suites green.

## Summary

| Suite | Files | Tests | Status |
|---|---|---|---|
| Vitest (unit/component) | 12 | 24 | ✅ all passing |
| Playwright (e2e) | 2 | 7 | ✅ all passing |
| `tsc -b --noEmit` (typecheck) | — | — | ✅ no errors |
| `vite build` (production build) | — | — | ✅ succeeds |

Run yourself with:

```bash
npm run typecheck
npm run test        # vitest run
npm run test:e2e    # playwright test (starts the Vite dev server itself)
npm run build        # tsc -b && vite build
```

## Vitest results (24 tests, 12 files)

```
 Test Files  12 passed (12)
      Tests  24 passed (24)
```

Coverage by feature slice (every slice has at least one public-view test and one admin-CRUD test, per the brief):

| Slice | File | What it covers |
|---|---|---|
| products | `src/features/products/__tests__/ProductsPage.test.tsx` | public catalog renders fetched products, search filter narrows results, and an API failure surfaces a visible error (not a silent blank page) |
| products | `src/features/products/__tests__/AdminProductForm.test.tsx` | admin create form blocks submit + shows validation error on empty required fields; happy path calls `createProduct` with the right payload |
| knowledge | `src/features/knowledge/__tests__/KnowledgePage.test.tsx` | public page renders the empty state (matches the real content gap — no articles exist yet) and renders articles once present |
| knowledge | `src/features/knowledge/__tests__/AdminKnowledgeForm.test.tsx` | admin form validation (title/slug required) + happy path saves a draft (`published: false` by default) |
| testimonials | `src/features/testimonials/__tests__/TestimonialsSection.test.tsx` | public section renders nothing when there are no consented testimonials, renders them once returned by the (consent-filtered) API |
| testimonials | `src/features/testimonials/__tests__/AdminTestimonialsPage.test.tsx` | admin create flow defaults `consent: false` — matches the seed data rule (no consent record exists) |
| site-copy | `src/features/site-copy/__tests__/siteCopy.test.ts` | `copy()` fallback helper: known key, missing key with fallback, missing key with no fallback |
| site-copy | `src/features/site-copy/__tests__/AdminSiteCopyPage.test.tsx` | editor loads existing values and calls `upsertSiteCopy` with the edited value on Save |
| enquiries | `src/features/enquiries/__tests__/EnquiryModal.test.tsx` | public modal blocks submit without consent (validation failure case) and, on the happy path, calls `submitEnquiry` and shows the thank-you state |
| enquiries | `src/features/enquiries/__tests__/AdminEnquiriesPage.test.tsx` | admin inbox renders submitted fields read-only plus a per-row status control |
| auth | `src/features/auth/__tests__/LoginPage.test.tsx` | shows an error on failed sign-in (failure case) and calls `signInWithPassword` with the entered credentials on the happy path |
| auth | `src/features/auth/__tests__/ProtectedRoute.test.tsx` | redirects to `/admin/login` with no session, renders protected content with a session, and blocks `app_admin` from a `root_admin`-only route |

Notes on test environment quirks fixed during this build:
- jsdom doesn't implement `ResizeObserver`, which Radix UI's Checkbox/Select primitives use — polyfilled in `src/test/setup.ts`.
- Native HTML5 `required` attributes intercept form submission in jsdom before React's `onSubmit` fires, which would have made the custom validation-message tests unreachable; the admin Products/Knowledge forms validate in `handleSubmit` instead of relying on the browser's built-in constraint validation, so the app's own error messaging is what's under test (and what a screen reader user actually sees, since native constraint-validation bubbles are inconsistently announced).

## Playwright results (7 tests, 2 files)

```
7 passed (21.1s)
```

| File | Test | What it covers |
|---|---|---|
| `e2e/public-site.spec.ts` | home page renders the hero and stat strip | smoke test: one `<h1>`, hero CTA visible |
| `e2e/public-site.spec.ts` | products page lists seeded products and supports search filtering | catalog renders mocked product data, search narrows to "no products match" |
| `e2e/public-site.spec.ts` | enquiry modal opens from the nav CTA, validates consent, and submits | full public enquiry happy path: open modal → validation error without consent → fill + consent → thank-you state |
| `e2e/public-site.spec.ts` | knowledge page shows an empty state when no articles are published | matches the real "no Knowledge content yet" gap |
| `e2e/public-site.spec.ts` | contact page shows the ANZ-to-provide placeholder instead of fake contact details | guards against ever silently fabricating phone/email/address |
| `e2e/admin-auth.spec.ts` | unauthenticated visitors are redirected from /admin to the login page | RLS/auth gate exercised through the real route tree |
| `e2e/admin-auth.spec.ts` | login page shows a clear error on invalid credentials, never a public signup link | confirms no public sign-up affordance exists anywhere in the UI |

Playwright specs run against the real Vite dev server with Supabase REST calls intercepted via `e2e/mocks.ts` (no live Supabase project is linked in this scaffold) — this exercises real component/network wiring end-to-end rather than mocking React internals.

## What is intentionally NOT covered

Per the brief's "happy-path + one or two meaningful failure cases, not exhaustive" guidance:
- No test suite exercises real Postgres RLS policies against a running Postgres instance (that requires `supabase start` + a local Postgres, which is out of scope for this offline scaffold). The RLS policies themselves are reviewed by hand in `docs/ARCHITECTURE.md` and the migration files are the source of truth.
- Admin invite-a-new-admin flow (`inviteAdmin()`) is untested because it's an intentional stub that throws until a service-role edge function exists (see `docs/ARCHITECTURE.md`).
- No visual/screenshot regression testing.
