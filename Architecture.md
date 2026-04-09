# Architecture — CoffeeTrack

> Design. How we build it — stack, components, interfaces, and standards.
> AI agents: follow these conventions exactly. Don't deviate without updating this file first.
> Related: **Product.md** (what to build), **Resources.md** (component registry), **Project.md** (execution).

---

## Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript 5.x | Type safety, better AI codegen |
| Framework | Next.js 14 (App Router) | Full-stack in one repo, server components, server actions |
| Styling | Tailwind CSS 3.x | Utility-first, no context switching |
| Database | Turso (hosted SQLite) via Prisma 5.x | SQLite-compatible, works on Vercel serverless |
| Auth | Clerk | Hosted auth, Next.js middleware integration, no session management to write |
| AI | Google Gemini Flash | Transcript analysis — free tier, sufficient for current scale |
| Hosting | Vercel | Free tier, deploys on git push |
| Package Manager | npm | — |

---

## Project Structure

```
coffeetrack/
├── app/
│   ├── layout.tsx              # Root layout (Clerk provider wraps here)
│   ├── page.tsx                # Dashboard (P-003)
│   ├── chats/
│   │   ├── page.tsx            # Chat list (P-001)
│   │   ├── actions.ts          # Server actions: createChat, updateChat, deleteChat
│   │   ├── new/page.tsx        # New chat form
│   │   └── [id]/page.tsx       # Chat detail / edit
│   └── followups/
│       ├── page.tsx            # Follow-up list (P-002)
│       └── actions.ts          # Server actions: markFollowUpDone
├── components/
│   └── ChatForm.tsx            # Reusable chat create/edit form
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   └── gemini.ts               # Gemini client + analyzeTranscript helper (P-005)
├── middleware.ts               # Clerk route protection (added in P-004)
├── prisma/
│   └── schema.prisma           # Data models
├── .env.local                  # Environment variables (gitignored)
└── public/
```

---

## Components

### Chat Module (implements P-001)

**Responsibilities:** Create, read, update, delete coffee chat records.

**Server Actions (`app/chats/actions.ts`):**
```
createChat(prevState, formData: FormData) → redirect /chats
updateChat(id, prevState, formData: FormData) → redirect /chats
deleteChat(id) → redirect /chats
```

**Data Model (`CoffeeChat`):**
```
id           Int       @id @default(autoincrement())
userId       String    (added in P-004 — scopes records per user)
personName   String
company      String
role         String
chatDate     DateTime
notes        String    @default("")
followUpDate DateTime?
followUpDone Boolean   @default(false)
transcript   String?   (added in P-005 — raw uploaded transcript text)
aiAnalysis   String?   (added in P-005 — JSON blob of structured analysis)
createdAt    DateTime  @default(now())
updatedAt    DateTime  @updatedAt
```

**Validation (Zod `ChatSchema`):**
- personName, company, role: non-empty strings
- chatDate: cannot be in the future
- followUpDate: must be after chatDate (if provided)

---

### Follow-up Module (implements P-002)

**Responsibilities:** Display follow-up list; mark follow-ups done.

**Server Actions (`app/followups/actions.ts`):**
```
markFollowUpDone(id) → revalidatePath /followups
```

**Query:** All CoffeeChats where `followUpDate != null`, ordered by `followUpDate ASC`.  
Overdue = `followUpDate < today && followUpDone == false`.

---

### Dashboard (implements P-003)

**Responsibilities:** Show total chats, chats per month (last 6 months), follow-up summary.

**Data:** Server component; reads directly from Prisma. No client-side fetching.

---

### AI Analysis Module (implements P-005)

**Responsibilities:** Accept a `.txt` transcript, call Gemini Flash, store structured analysis, display debrief on Chat Detail.

**Key files:**
- `lib/gemini.ts` — Gemini client singleton + `analyzeTranscript(transcript: string)` helper; returns typed `ChatAnalysis` object
- `app/chats/actions.ts` — `uploadTranscript(id, formData)` server action; validates length, calls `analyzeTranscript`, writes `transcript` + `aiAnalysis` to DB
- `components/TranscriptUpload.tsx` — client component; `.txt` file input, triggers server action
- `components/AnalysisDisplay.tsx` — server component; parses `aiAnalysis` JSON, renders debrief UI
- `app/chats/[id]/page.tsx` — wires both components into Chat Detail

**`ChatAnalysis` type (stored as JSON in `aiAnalysis`):**
```ts
type ChatAnalysis = {
  overallAssessment: string       // 2-3 sentence written summary
  conversationBalance: string     // "good" | "talked_too_much" | "too_quiet"
  questionQuality: string         // "surface" | "mixed" | "substantive"
  nextStepEstablished: boolean
  nextStep: string                // what the next step was, or "None identified"
  keyLearnings: string[]          // bullet list of things learned about the person
  coachingTips: string[]          // 2-3 actionable improvement tips
  followUpDraft: string           // full draft follow-up message
}
```

---

### Auth (implements P-004)

**Responsibilities:** Sign-up, sign-in, sign-out via Clerk. Protect all routes. Scope DB queries to `userId`.

**Key files:**
- `middleware.ts` — Clerk's `authMiddleware` / `clerkMiddleware`; protects all routes except sign-in/sign-up
- `app/layout.tsx` — Wrap with `<ClerkProvider>`
- All server actions — call `auth()` from `@clerk/nextjs/server`; extract `userId`; filter all DB queries by `userId`

---

## Naming Conventions

| Entity | Pattern | Example |
|--------|---------|---------|
| Components | PascalCase | `ChatForm` |
| Functions / actions | camelCase | `createChat`, `markFollowUpDone` |
| API / page routes | kebab-case | `/chats/new`, `/followups` |
| Database fields | camelCase (Prisma) | `personName`, `followUpDate` |
| Environment vars | SCREAMING_SNAKE | `TURSO_DATABASE_URL` |
| Branches | `feat/` `fix/` `chore/` | `feat/auth-clerk` |

---

## Code Standards

- Functional components only — no class components
- Server components by default; add `"use client"` only for forms and interactive elements
- Prisma for all DB access — no raw SQL
- Zod for input validation on all server actions
- `const` / `let` only — no `var`
- No `any` type — use proper types or `unknown`
- Don't import server modules (`prisma`, `auth`, `fs`) in client components

---

## Design Decisions Log

| Date | Decision | Options Considered | Choice | Reasoning |
|------|----------|--------------------|--------|-----------|
| 2026-03-23 | Framework | Create React App, Remix, Next.js | Next.js 14 App Router | Full-stack in one repo, server components for fast load |
| 2026-03-23 | Database | PostgreSQL, SQLite local, Turso | Turso hosted SQLite | SQLite-compatible + works on Vercel serverless |
| 2026-03-23 | Styling | CSS Modules, styled-components, Tailwind | Tailwind CSS | Utility-first, no context switching |
| 2026-03-31 | Auth | NextAuth, Auth.js, Clerk, Supabase Auth | Clerk | Hosted, Next.js 14 App Router native, no session management, free tier |
| 2026-04-01 | DB environments | Single Turso DB for all environments | Two Turso DBs (`coffeetrack` prod, `coffeetrack-dev` local) | Prevents local dev/migrations from affecting production data |
| 2026-04-01 | Pre-auth data migration | Seed userId, keep rows, or delete | Delete all existing rows when adding `userId` | Solo project with no real users; simpler than a backfill |
| 2026-04-07 | AI analysis storage format | Individual DB columns vs. JSON blob | JSON blob (`aiAnalysis String?`) | Flexible for evolving analysis shape; pattern analysis (P-006) can parse JSON at query time |
| 2026-04-07 | AI provider | OpenAI, Claude, Gemini | Gemini Flash | Free tier sufficient at current scale; swap is one-line change if needed |

---

## Security

- All routes protected by Clerk middleware — unauthenticated users redirected to sign-in
- All DB queries scoped to `userId` from Clerk — no cross-user data leakage
- Input validation via Zod on all server actions — no raw user input reaches the DB
- Secrets stored in Vercel environment variables — never in code or committed files
- No `any` type — prevents accidental bypass of type-safe DB queries
