# Resources — CoffeeTrack

> Technical assets that cut across both Product and Tech.
> Environments, infrastructure, dependencies, and the component registry.
> AI agents: check here for names, locations, and service details before asking or guessing.
> Related: **Architecture.md** (component designs), **Project.md** (sprint deps), **Product.md** (what we're building).

---

## Component Registry

| Component | Type | Location | Description |
|-----------|------|----------|-------------|
| Root Layout | Frontend | `app/layout.tsx` | Global layout, nav, ClerkProvider (P-004) |
| Dashboard | Frontend | `app/page.tsx` | Stats: total chats, chats/month, follow-up summary (P-003) |
| Chat List | Frontend | `app/chats/page.tsx` | All chats in reverse chronological order (P-001) |
| New Chat | Frontend | `app/chats/new/page.tsx` | Create chat form page (P-001) |
| Chat Detail | Frontend | `app/chats/[id]/page.tsx` | Edit/view single chat (P-001) |
| Chat Actions | Server Actions | `app/chats/actions.ts` | createChat, updateChat, deleteChat (P-001) |
| Follow-up List | Frontend | `app/followups/page.tsx` | Follow-ups sorted by date, overdue highlighted (P-002) |
| Follow-up Actions | Server Actions | `app/followups/actions.ts` | markFollowUpDone (P-002) |
| ChatForm | Component | `components/ChatForm.tsx` | Reusable create/edit form with Zod validation (P-001) |
| Prisma Client | Database | `lib/db.ts` | Singleton client for Turso via libsql adapter |
| Auth Middleware | Middleware | `middleware.ts` | Clerk route protection — added in P-004 |
| CoffeeChat Model | Data Model | `prisma/schema.prisma` | Core DB model — gains `userId` in P-004 |

---

## Interactions

| From | To | Method | Purpose |
|------|----|--------|---------|
| Chat List / Detail | Chat Actions | Server Action import | CRUD operations |
| Follow-up List | Follow-up Actions | Server Action import | Mark done |
| All Server Actions | Prisma Client | import | DB reads/writes |
| All Server Actions | Clerk `auth()` | import (P-004) | Extract userId for query scoping |
| Prisma Client | Turso DB | libsql HTTP | Hosted SQLite queries |
| Next.js | Clerk Middleware | `middleware.ts` | Protect all routes |

---

## Environments

| Name | URL | Purpose | Config |
|------|-----|---------|--------|
| Local | `http://localhost:3000` | Development | `.env.local` — points to `coffeetrack-dev` Turso DB |
| Production | `https://coffeetrackvercel.vercel.app` | Live | Vercel environment variables — points to `coffeetrack` Turso DB |

---

## Infrastructure

| Service | Provider | Purpose | Cost |
|---------|----------|---------|------|
| App Hosting | Vercel | Auto-deploy on push to `main` | Free tier |
| Database (prod) | Turso | `coffeetrack` — production hosted SQLite | Free tier |
| Database (dev) | Turso | `coffeetrack-dev` — local development SQLite | Free tier |
| Auth | Clerk | Sign-up, sign-in, session management | Free tier (up to 10k MAU) |

---

## Dependencies

| Package | Purpose | Version |
|---------|---------|---------|
| `next` | Framework | 14.x |
| `react` / `react-dom` | UI | 18.x |
| `typescript` | Type safety | 5.x |
| `tailwindcss` | Styling | 3.x |
| `prisma` | ORM + migrations | 5.x |
| `@prisma/client` | DB client | 5.x |
| `@libsql/client` | Turso HTTP driver for Prisma | latest |
| `@prisma/adapter-libsql` | Prisma adapter for libSQL | latest |
| `zod` | Input validation | 3.x |
| `@clerk/nextjs` | Auth (sign-up, sign-in, middleware) | latest — added in P-004 |

---

## Secrets

| Secret | Stored In | Used By |
|--------|-----------|---------|
| `TURSO_DATABASE_URL` | Vercel env vars (prod DB) + `.env.local` (dev DB) | Prisma client |
| `TURSO_AUTH_TOKEN` | Vercel env vars (prod token) + `.env.local` (dev token) | Prisma client |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Vercel env vars + `.env.local` | Clerk frontend (P-004) |
| `CLERK_SECRET_KEY` | Vercel env vars + `.env.local` | Clerk server-side (P-004) |
