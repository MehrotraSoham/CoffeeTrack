# Product — CoffeeTrack

> Discovery + Definition. What we're building, why, and the detailed requirements.
> AI agents: read this BEFORE writing any code.

---

## Vision

CoffeeTrack helps college students and MBAs stay on top of their networking by logging coffee chats, tracking follow-ups, and seeing their outreach momentum over time — all in a simple, fast web app.

---

## Backlog

| ID | Feature | Status | Priority |
|----|---------|--------|----------|
| P-001 | Log a coffee chat | Done | Must Have |
| P-002 | Track follow-ups / reminders | Done | Must Have |
| P-003 | Dashboard & stats | Done | Should Have |
| P-004 | Authentication (Clerk) | Building | Must Have |

> Status: Todo → Defining → Defined → Building → Done
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

### P-004: Authentication (Clerk)

**Functional Requirements:**
- [ ] **P-004-F01:** User can sign up via Clerk (email + social providers) → Acceptance: sign-up flow completes and creates a Clerk user
- [ ] **P-004-F02:** User can sign in via Clerk → Acceptance: sign-in redirects to dashboard
- [ ] **P-004-F03:** User can sign out → Acceptance: session cleared, redirected to sign-in
- [ ] **P-004-F04:** All app routes are protected — unauthenticated users are redirected to sign-in → Acceptance: visiting `/chats`, `/followups`, `/` without a session redirects to Clerk sign-in
- [ ] **P-004-F05:** Each user only sees their own CoffeeChat records → Acceptance: two accounts cannot see each other's data
- [ ] **P-004-F06:** CoffeeChat model has a `userId` field scoped to the Clerk user ID → Acceptance: DB migration runs cleanly; existing rows handled

**Non-functional Requirements:**
- [ ] **P-004-N01:** Auth flow adds no more than one extra redirect to protected pages → Metric: single redirect to Clerk sign-in, then back

**Edge Cases:**
- Existing chats created before auth was added: need a migration strategy (set `userId` to a seed value or delete — decide before shipping)
- What happens if Clerk is down: Clerk middleware will block access — acceptable for v2 scope

**Out of Scope:** SSO / SAML, org-level permissions, custom auth UI (use Clerk hosted pages)

---

## Out of Scope

- Mobile app (responsive web only)
- Email or push notifications
- LinkedIn or calendar integrations
- Data export
- SSO / SAML / org-level permissions

---

## Glossary

| Term | Definition |
|------|-----------|
| Coffee chat | An informal 1:1 networking conversation, logged as a single record |
| Follow-up | A scheduled reminder tied to a chat entry; can be marked done |
| userId | The Clerk-issued user identifier used to scope all DB records per user |

---

## Related Files

- **Architecture.md** — Stack, components, interfaces, naming conventions.
- **Resources.md** — Component registry, environments, dependencies.
- **Project.md** — Sprint tasks, diagnostics, deployment, fix log.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-23 | Product.md created |
| 2026-03-25 | Migrated database from local SQLite to Turso for Vercel compatibility |
| 2026-03-31 | Upgraded to Level 2 — split Design Decisions to Architecture.md; added P-004 Auth |
