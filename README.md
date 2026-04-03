# LocalReach

LocalReach is a production-leaning MVP for low-volume, highly targeted outreach to local businesses that may need a website redesign or modernization. It is intentionally built for manual review and compliance-first sending, not mass outreach.

## What the app does

- Import leads from CSV or add them manually
- Store business name, public business email, website, city, niche, source URL, and notes
- Run a lightweight homepage analysis using simple heuristics
- Generate personalized cold email drafts with the OpenAI Responses API
- Require manual review and approval before every send
- Send plain-text emails through Resend
- Track lead status across draft, approved, sent, replied, opted out, and bounced
- Generate up to 2 manual follow-up drafts per lead
- Maintain a suppression list and block sends to suppressed contacts

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development
- OpenAI Responses API
- Resend
- Zod
- date-fns
- Sonner for toasts

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Add your keys to `.env`:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_key"
RESEND_API_KEY="your_resend_key"
RESEND_FROM_EMAIL="LocalReach <verified@yourdomain.com>"
REPLY_TO_EMAIL="you@yourdomain.com"
SERPAPI_API_KEY="your_serpapi_key"
APP_BASE_URL="http://localhost:3000"
```

4. Generate Prisma client and create the local SQLite database:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Seed demo data:

```bash
npm run seed
```

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Put all secrets in the project root `.env` file.

- `DATABASE_URL`: SQLite file for local development
- `OPENAI_API_KEY`: used for personalized draft generation
- `RESEND_API_KEY`: used for sending outbound email
- `RESEND_FROM_EMAIL`: verified sender identity for Resend
- `REPLY_TO_EMAIL`: optional reply-to inbox used on outgoing emails; must be a valid email address
- `SERPAPI_API_KEY`: used for low-volume Google Maps lead discovery through SerpAPI
- `APP_BASE_URL`: local app URL

## Database and migrations

- Prisma schema lives in `prisma/schema.prisma`
- The initial SQL migration is bundled in `prisma/migrations/202603062355_init/migration.sql`
- `npm run prisma:migrate` applies the included SQLite migrations locally

This keeps the local SQLite workflow simple and still gives you a real Prisma schema plus checked-in migration SQL.

## How to use it

### Import CSV

Go to `/leads/import` and upload a CSV with columns like:

- `businessName`
- `contactName`
- `email`
- `website`
- `city`
- `niche`
- `sourceUrl`
- `notes`

Invalid rows are skipped. Duplicate leads are skipped by email, or by business name plus website when possible.

### Discover from Google Maps

Go to `/discovery` and search Google Maps through SerpAPI using a niche plus city.

- review businesses before import
- classify `HAS_WEBSITE` vs `NO_WEBSITE`
- see the suggested campaign for each result
- skip likely duplicates by default
- import selected results as normal leads for manual review

Imported discovery leads may not have a public business email yet. Add one manually before generating drafts or sending outreach.

### Add or edit a lead

Go to `/leads/new` to add a lead, or open `/leads/[id]` from the leads table to edit one.

### Analyze the website

On the lead detail page:

1. Add a website URL
2. Click `Run website analysis`
3. Review the summary, issues, and HTML snippet
4. Optionally add manual notes

### Generate, approve, and send outreach

On the lead detail page:

1. Optionally pick a campaign
2. Click `Generate draft`
3. Review and edit the subject/body
4. Click `Approve draft`
5. Click `Send approved email`

Guardrails enforced before send:

- suppressed leads are blocked
- opt-outs are blocked
- draft must be approved
- daily send cap must not be exceeded
- minimum seconds between sends must be satisfied

### Follow-ups

- Use `Generate follow-up` from the lead detail page
- Every follow-up is still manual-review only
- The MVP allows up to 2 follow-up drafts per lead
- The UI recommends waiting 5 to 7 days after the last send

### Replies and opt-outs

On the lead detail page you can:

- mark a lead as replied
- mark a lead as opted out
- manually add a lead to suppression

Opt-out suppressions are treated as permanent in the MVP.

## Pages

- `/dashboard`: summary cards and recent activity
- `/leads`: filters, search, and lead table
- `/leads/new`: manual lead creation
- `/leads/import`: CSV import
- `/leads/[id]`: lead detail, analysis, drafting, send flow, history
- `/campaigns`: simple campaign CRUD
- `/settings`: integration status, sender defaults, guardrails, suppression list

## Limitations

- Single-user local tool only, no auth
- No inbox sync or reply parsing
- No scraping of private personal emails
- No bulk blast tooling
- No automatic follow-up scheduler
- Website analysis uses rough heuristics, not a full technical audit
- Sending is plain text only in v1
- SQLite is the default local database; Prisma schema is structured so you can switch to Postgres later

## Compliance reminder

Use only for low-volume, personalized business outreach. Only use public business contact details that you entered manually or imported yourself. Check local legal requirements before sending.

## What I built

- A complete local outreach dashboard with leads, campaigns, settings, suppression handling, and activity logging
- A lightweight website analysis workflow
- OpenAI Responses API draft generation with structured JSON validation
- Resend-based manual send flow with approval, send caps, and spacing rules
- Seed data, checked-in migration SQL, and a runnable local setup
