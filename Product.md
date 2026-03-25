# Product — CoffeeTrack

> What we're building and why. Discovery + Definition + Design in one file.

---

## Vision

CoffeeTrack helps college students and MBAs stay on top of their networking by logging coffee chats, tracking follow-ups, and seeing their outreach momentum over time — all in a simple, fast web app.

---

## Backlog

| ID | Feature | Status | Priority |
|----|---------|--------|----------|
| P-001 | Log a coffee chat | Done | Must Have |
| P-002 | Track follow-ups / reminders | Todo | Must Have |
| P-003 | Dashboard & stats | Todo | Should Have |

> Status: Todo → Building → Done
> Priority: Must Have / Should Have / Nice to Have

---

## Requirements

### P-001: Log a Coffee Chat

**Acceptance Criteria:**
- [ ] User can create a new chat entry with: person's name, company, role, date of chat, and free-text notes
- [ ] User can edit an existing chat entry
- [ ] User can delete a chat entry
- [ ] All entries persist across sessions (stored in database)
- [ ] List of chats is displayed in reverse chronological order

**Out of Scope:** Importing contacts from LinkedIn, email integration

---

### P-002: Track Follow-ups / Reminders

**Acceptance Criteria:**
- [ ] Each chat entry can have a follow-up date set
- [ ] A follow-up list shows all chats with upcoming or overdue follow-up dates
- [ ] Overdue follow-ups are visually distinct (e.g. highlighted in red)
- [ ] User can mark a follow-up as done

**Out of Scope:** Email or push notifications (v1 is in-app only)

---

### P-003: Dashboard & Stats

**Acceptance Criteria:**
- [ ] Dashboard shows total chats logged
- [ ] Dashboard shows chats per month (last 6 months)
- [ ] Dashboard shows how many follow-ups are pending vs. done
- [ ] Stats update in real time as data changes

**Out of Scope:** Exporting data, sharing stats

---

## Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Next.js 14 (App Router) | Full-stack in one repo, fast to prototype |
| Language | TypeScript | Catches errors early, better AI codegen |
| Styling | Tailwind CSS | Utility-first, no context switching |
| Database | SQLite via Prisma | Zero config locally, easy to migrate later |
| Hosting | Vercel | Free tier, deploys on git push |
| Auth | None (v1) | Single-user local app for now |

---

## Out of Scope

- User accounts / multi-user support (v1 is single-user)
- Mobile app (responsive web only)
- Email or push notifications
- LinkedIn or calendar integrations
- Data export

---

## Related Files

- **Tech.md** — Stack, setup, testing, deployment, and fix log. Read Product.md first, then Tech.md.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-23 | Product.md created |
