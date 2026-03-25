# Tech — CoffeeTrack

> How we build, test, ship, and fix.
> Read **Product.md** first — it defines WHAT to build. This file defines HOW.

---

## Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Language | TypeScript | 5.x |
| Framework | Next.js (App Router) | 14 |
| Styling | Tailwind CSS | 3.x |
| Database | SQLite via Prisma | Prisma 5.x |
| Hosting | Vercel | — |
| Package Manager | npm | — |

---

## Project Structure

```
coffeetrack/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard (P-003)
│   ├── chats/
│   │   ├── page.tsx        # Chat list (P-001)
│   │   └── [id]/page.tsx   # Chat detail / edit
│   └── followups/
│       └── page.tsx        # Follow-up list (P-002)
├── components/             # Shared UI components
├── lib/
│   └── db.ts               # Prisma client singleton
├── prisma/
│   ├── schema.prisma       # Data models
│   └── dev.db              # SQLite database (gitignored)
├── .env.local              # Environment variables
└── public/
```

---

## Setup

```bash
git clone https://github.com/MehrotraSoham/CoffeeTrack.git 
cd coffeetrack
npm install
cp .env.example .env.local
npx prisma generate
npx prisma db push
npm run dev
```

---

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `DATABASE_URL` | SQLite file path | `file:./prisma/dev.db` |

---

## Conventions

- Functional components only — no class components
- Server components by default; add `"use client"` only when needed (forms, interactivity)
- Prisma for all database access — no raw SQL
- Zod for input validation on API routes
- `const` / `let` only — no `var`
- No `any` type — use proper types or `unknown`

---

## Testing

| Test | Command | Last Run | Result |
|------|---------|----------|--------|
| Type check | `npx tsc --noEmit` | 2026-03-24 | Pass |
| Lint | `npm run lint` | 2026-03-24 | Pass — no warnings or errors |
| Build | `npm run build` | 2026-03-24 | Pass — 8 static pages generated |

---

## Deployment

**Method:** Push to `main` → Vercel auto-deploys
**URL:** [add after first deploy]

| Date | Version | Status | Notes |
|------|---------|--------|-------|
| | | | |

---

## Fix Log

### Open

| ID | Error | Cause | Status |
|----|-------|-------|--------|
| | | | |

### Resolved

| ID | Error | Cause | Fix | Date |
|----|-------|-------|-----|------|
| | | | | |

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `PrismaClientInitializationError` | `dev.db` missing | Run `npx prisma db push` |
| `useActionState is not a function` | `useActionState` is React 19+; project uses React 18 | Use `useFormState` / `useFormStatus` from `react-dom` instead |
| Form field not saving to DB | Field added to Zod schema and DB write but not extracted from `formData` in `safeParse` | Pass `formData.get("fieldName")` into the `safeParse` object |
| `Module not found` | Missing `"use client"` | Add directive to top of file |
| Hydration mismatch | Server/client component boundary issue | Move state to a client component |
| `ENOENT .env.local` | Env file missing | Copy `.env.example` to `.env.local` |

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
| `zod` | Input validation | 3.x |
