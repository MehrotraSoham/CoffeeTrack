# Project — CoffeeTrack

> People, time, and execution. Development + Diagnostics + Deployment tracking.
> Who's doing what, sprint status, test results, deploy log, and error tracking.
> Related: **Product.md** (backlog + requirements), **Architecture.md** (design to follow), **Resources.md** (component registry).

---

## Team

| Name | Role | Focus |
|------|------|-------|
| Soham Mehrotra | Solo Developer | Everything |

---

## Sprint 1 — v1.0 Core Features

**Dates:** 2026-03-23 → 2026-03-30

| Task | Product ID | Status | Notes |
|------|------------|--------|-------|
| Log coffee chat (create, edit, delete) | P-001 | Done | |
| Chat list in reverse chronological order | P-001 | Done | |
| Follow-up date + overdue highlighting | P-002 | Done | |
| Mark follow-up as done | P-002 | Done | |
| Dashboard stats (total, per month, follow-up summary) | P-003 | Done | |
| Migrate DB from local SQLite to Turso | — | Done | Required for Vercel deployment |
| Deploy to Vercel | — | Done | |

### Sprint 1 Review

- **Completed:** 7/7
- **Carried over:** None
- **What went well:** Full v1.0 shipped on schedule
- **What didn't:** Several Prisma/Turso setup errors slowed deployment (see Fix Log)
- **Changes for next sprint:** —

---

## Sprint 2 — Authentication

**Dates:** 2026-03-31 → 2026-04-14

| Task | Owner | Product ID | Branch | Status | Notes |
|------|-------|------------|--------|--------|-------|
| Install and configure Clerk | Soham | P-004-F01 | `feat/auth-clerk` | Done | Pinned to @clerk/nextjs@5 (Next.js 14 compat) |
| Wrap layout with ClerkProvider + add sign-in/sign-out UI | Soham | P-004-F03 | `feat/auth-clerk` | Done | |
| Add `middleware.ts` for route protection | Soham | P-004-F04 | `feat/auth-clerk` | Done | |
| Add `userId` to CoffeeChat model + DB migration | Soham | P-004-F06 | `feat/auth-clerk` | Done | Schema updated; run `prisma db push` on dev DB after clearing rows |
| Scope all server actions and queries by `userId` | Soham | P-004-F05 | `feat/auth-clerk` | Done | |
| Add Clerk env vars to Vercel | Soham | — | — | Todo | NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY |
| Pre-deploy checks (tsc, lint, build) | Soham | — | — | Todo | |
| Deploy v2.0 | Soham | — | — | Todo | |

### Sprint 2 Review

- **Completed:** —
- **Carried over:** —
- **What went well:** —
- **What didn't:** —
- **Changes for next sprint:** —

---

## Development Log

| Date | What | Files | Notes |
|------|------|-------|-------|
| 2026-03-23 | Project scaffolded, P-001 built | `app/chats/**`, `prisma/schema.prisma` | |
| 2026-03-25 | P-002 follow-ups built | `app/followups/**` | |
| 2026-03-26 | P-003 dashboard built | `app/page.tsx` | |
| 2026-03-25 | DB migrated from local SQLite to Turso | `lib/db.ts`, `prisma/schema.prisma` | Needed for Vercel |
| 2026-03-30 | v1.0 deployed to Vercel | — | All P-001–P-003 live |
| 2026-03-31 | Upgraded framework to Level 2 | `Architecture.md`, `Resources.md`, `Project.md` | |
| 2026-04-01 | Decided two-DB strategy (dev/prod split) + migration strategy (delete existing rows) | `Architecture.md`, `Resources.md`, `Product.md` | |
| 2026-04-01 | Sprint 2 auth implementation (P-004-F01–F06) | `middleware.ts`, `app/layout.tsx`, `app/**/page.tsx`, `app/**/actions.ts`, `prisma/schema.prisma` | |

---

## Pre-Deploy Checks

| Check | Command | Last Result | Date |
|-------|---------|-------------|------|
| Type check | `npx tsc --noEmit` | Pass | 2026-03-24 |
| Lint | `npm run lint` | Pass | 2026-03-24 |
| Build | `npm run build` | Pass | 2026-03-24 |

---

## Test Coverage

| Product ID | Requirement | Test | Status |
|-----------|-------------|------|--------|
| P-001 | Create chat | Manual | Pass |
| P-001 | Edit chat | Manual | Pass |
| P-001 | Delete chat | Manual | Pass |
| P-002 | Overdue highlighting | Manual | Pass |
| P-002 | Mark done | Manual | Pass |
| P-003 | Dashboard stats | Manual | Pass |
| P-004 | Route protection | — | Todo |
| P-004 | userId scoping | — | Todo |

---

## Deployment Log

| Date | Version | Environment | Status | Notes |
|------|---------|-------------|--------|-------|
| 2026-03-30 | v1.0 | Production | Live | Initial deployment — all P-001, P-002, P-003 complete |

---

## Fix Log

### Open Issues

| ID | Severity | Error | Cause | Sprint |
|----|----------|-------|-------|--------|
| — | — | — | — | — |

### Resolved

| ID | Error | Root Cause | Fix | Date |
|----|-------|------------|-----|------|
| — | — | — | — | — |

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `PrismaClientInitializationError` | `dev.db` missing | Run `npx prisma db push` |
| `PrismaClientInitializationError` on Vercel | Vercel caches deps, skipping Prisma generation | Add `prisma generate &&` before `next build` in `package.json` build script |
| `useActionState is not a function` | `useActionState` is React 19+; project uses React 18 | Use `useFormState` / `useFormStatus` from `react-dom` |
| Form field not saving to DB | Field added to Zod schema and DB write but not extracted from `formData` | Pass `formData.get("fieldName")` into `safeParse` object |
| `Module not found` | Missing `"use client"` directive | Add directive to top of file |
| Hydration mismatch | Server/client component boundary issue | Move state to a client component |
| `ENOENT .env.local` | Env file missing | Copy `.env.example` to `.env.local` |
| `Unable to open the database file` on Vercel | Vercel has ephemeral filesystem | Migrate to Turso hosted SQLite |
| `PrismaLibSQL is not a constructor` | webpack bundles `@libsql/client` incorrectly | Add `config.externals.push(...)` via `webpack` key in `next.config.mjs` |
| Prisma adapter version mismatch | `@prisma/adapter-libsql` must match `@prisma/client` exactly | Pin both to same version (e.g. `5.22.0`) |
| `@clerk/nextjs` peer dep error on install | Latest Clerk requires Next.js 15+; project is on Next.js 14 | Install `@clerk/nextjs@5` explicitly |
