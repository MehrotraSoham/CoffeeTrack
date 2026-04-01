# CLAUDE.md — CoffeeTrack

You are working on CoffeeTrack, a Next.js 14 app that helps college students log coffee chats, track follow-ups, and view networking stats. This is a solo project at Level 2 of the 7D Framework — four files define the entire project.

---

## Files

| File | What it contains | When to read it |
|------|-----------------|-----------------|
| `Product.md` | Vision, backlog (P-001–P-004), requirements, acceptance criteria | Before building anything |
| `Architecture.md` | Stack, components, interfaces, naming conventions, code standards | Before writing code |
| `Resources.md` | Component registry, environments, dependencies, secrets | Before adding a package or creating a component |
| `Project.md` | Sprint tasks, deployment log, test results, fix log | Before starting a task; after completing one |

**Always read all four files before starting any task.** They are the source of truth. Do not invent requirements, components, or conventions not defined there.

---

## How You Work

### Before Building
1. Read `Product.md` — understand what feature you're working on and its acceptance criteria
2. Read `Architecture.md` — confirm the stack, component design, and conventions
3. Read `Resources.md` — check the component registry before creating anything new
4. Check the Fix Log in `Project.md` for known errors related to your task
5. If anything is unclear, ask before coding

### While Building
- Follow the project structure in `Tech.md` exactly — put files where they belong
- Use server components by default; add `"use client"` only for interactive components
- Access the database through Prisma only — no raw SQL
- Validate all user input with Zod before writing to the database
- Use Tailwind for all styling — no inline styles, no CSS modules

### After Building
- Run `npx tsc --noEmit` — fix all type errors before considering a task done
- Run `npm run lint` — fix all lint errors
- Update the Status column in `Product.md` backlog if a feature is complete
- Log the task in the Development Log in `Project.md`
- If you hit an error that took more than one attempt to fix, log it in the Fix Log in `Project.md`

---

## When Unsure

**"Should I add auth?"** — No. Auth is explicitly out of scope for v1. See Product.md Out of Scope.

**"What database should I use for this?"** — SQLite via Prisma (Turso hosted). See Architecture.md Stack.

**"Should I create a new component or inline the UI?"** — Create a component in `components/` if it's used in more than one place or is more than ~30 lines. Register it in Resources.md Component Registry.

**"The design doesn't cover this edge case — what do I do?"** — Stop and ask. Don't invent behavior for uncovered cases.

**"Should I use the pages/ router or app/ router?"** — App Router only. See Architecture.md.

**"Is this component already built?"** — Check Resources.md Component Registry before creating anything new.

---

## Don't

- Don't use class components
- Don't use the `pages/` router — this project uses the App Router
- Don't import server modules (`prisma`, `fs`, etc.) in client components
- Don't skip the `"use client"` directive on components with state or event handlers
- Don't use `any` type — use proper types or `unknown`
- Don't write raw SQL — use Prisma
- Don't add packages without a clear reason — check if the need is already met
- Don't skip Zod validation on API route inputs
- Don't modify `.env.local` — tell the user what variable to add and why

---

## Customizing This File

As the project evolves, keep this file current:
- Add new conventions when you establish a pattern worth repeating
- Add new Don'ts when you catch a recurring mistake
- Update the File map if new files are added
- Seed the Fix Log in `Project.md` with any new recurring errors
- Update Resources.md Component Registry when new components are added
