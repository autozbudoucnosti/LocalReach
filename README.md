# LocalReach — AI-Assisted Outreach Workflow

**Working prototype.** LocalReach is an end-to-end AI automation workflow for identifying Czech local businesses with weak or missing websites, generating personalized first-touch outreach emails, validating them, and sending approved messages through a human-controlled pipeline.

---

## Problem

Small local businesses often have weak or outdated websites, but prospecting and writing personalized outreach manually is slow and repetitive. At the same time, bulk automated sending is risky: it is legally questionable, easy to get wrong, and damaging to reputation if done carelessly.

This project explores whether AI can handle the repetitive parts (discovery, scoring, draft writing) while keeping a human firmly in the loop for every send decision.

---

## Solution

LocalReach provides a structured operator workflow:

1. Discover leads via a Google Maps search (SerpAPI).
2. Score and qualify each lead automatically against configurable signals.
3. Optionally analyze the lead's website with AI (cheerio + OpenAI).
4. Generate a personalized Czech outreach email draft using the OpenAI API.
5. The operator reviews, edits, and approves the draft manually.
6. The approved email is sent via the Resend API — one at a time.
7. Replies and opt-outs are tracked in the database.

---

## Workflow (high-level)

```
Discovery → Import → Qualification → Website Analysis (optional)
         → Draft Generation → Manual Approval → Send → Reply Tracking
```

See [`docs/workflow.md`](docs/workflow.md) for the full stage-by-stage description.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions, Prisma ORM, SQLite |
| AI draft generation | OpenAI Responses API (structured output via Zod) |
| Email sending | Resend API |
| Lead discovery | SerpAPI (Google Maps results) |
| Website analysis | cheerio (HTML parsing) + OpenAI |
| Scripting | tsx ("Paperclip routines" — standalone TypeScript scripts) |

---

## Current Status

**Working prototype.** The system can:
- Discover and import leads from Google Maps search results.
- Score and qualify leads using a configurable signal set.
- Analyze a business website and extract issues.
- Generate personalized Czech outreach drafts using the OpenAI API.
- Present drafts for operator review and approval.
- Send approved emails through Resend with pre-send safety checks.
- Track replies and opt-outs.

Not yet implemented: webhook-based inbound reply routing, scheduled follow-up reminders, multi-user access control.

---

## Demo Instructions

### Prerequisites

- Node.js 20+
- A `.env` file (copy `.env.example` if provided, or create one manually)

### Minimum required environment variables

```
DATABASE_URL=file:./dev.db
```

### Optional (needed for full functionality)

```
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=outreach@yourdomain.com
SERPAPI_KEY=...
```

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Apply database migrations
npm run prisma:migrate

# 3. Seed the database with demo data
npm run seed

# 4. Start the development server
npm run dev
```

Open `http://localhost:3000`.

- `/dashboard` — pipeline summary and activity log
- `/leads` — full lead list with filters
- `/leads/[id]` — lead detail, qualification, draft, send
- `/discovery` — search for new leads
- `/settings` — daily send cap, suppression list

For a guided walkthrough, see [`docs/demo-script.md`](docs/demo-script.md).

---

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for a description of all system components: frontend pages, server actions, database models, JSON state files, AI integration, and Paperclip scripts.

---

## Guardrails

The system enforces:
- Zod input validation on all operator input and AI-generated output.
- A manual approval gate before any email is sent.
- A daily send cap (default: 10/day) and minimum interval between sends (default: 5 minutes).
- A suppression list that permanently blocks opted-out contacts.
- AI prompt rules that prohibit invented facts, hype, and guaranteed results.

See [`docs/guardrails.md`](docs/guardrails.md) for the full list.

---

## Limitations

- This is a prototype, not a production-ready SaaS.
- The database is SQLite — not suitable for concurrent multi-user access.
- Inbound reply routing currently requires manual logging.
- Discovery is limited to SerpAPI (Google Maps results only).
- The system is designed for a single operator; there is no role-based access control.
- Send volume is intentionally limited to low numbers by design.

---

## What I Learned

- **Structured AI output is essential for automation.** Using OpenAI's structured output with a Zod schema made draft parsing reliable. Free-text generation would have required fragile post-processing.
- **Guardrails need to be explicit, not assumed.** Rate limits, suppression checks, and approval gates had to be coded explicitly — the AI does not enforce them on its own.
- **Qualification logic benefits from a scoring model rather than simple rules.** Computing a weighted lead score from multiple signals (website state, review count, reachability) produced more useful rankings than any single filter.
- **JSON state files are a practical step before a database.** Using `data/niches.json` for vertical config allowed rapid iteration without schema migrations for every small change.
- **Prompt honesty is a feature.** The system prompt explicitly forbids inventing facts. This reduced the risk of generating embarrassing or legally problematic emails, at the cost of slightly more generic output when data is sparse.
