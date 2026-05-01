# LocalReach — Architecture

This document describes how the system is structured: what each layer does, how the components communicate, and how state moves through the application.

---

## System Diagram

```
Browser (Next.js UI)
        │
        │  Server Actions (Next.js App Router)
        ▼
┌───────────────────────────────────────────┐
│              Application Layer             │
│  actions/lead-actions.ts                  │
│  actions/outreach-actions.ts              │
│  actions/campaign-actions.ts              │
│  actions/discovery-actions.ts             │
│  actions/settings-actions.ts              │
└────────────┬──────────────────────────────┘
             │
     ┌───────┴───────────────────────────┐
     │                                   │
     ▼                                   ▼
┌─────────────────┐            ┌──────────────────────┐
│   SQLite DB      │            │   External APIs       │
│   (via Prisma)   │            │   OpenAI              │
│                  │            │   Resend              │
│   Lead           │            │   SerpAPI             │
│   EmailDraft     │            └──────────────────────┘
│   EmailMessage   │
│   Campaign       │
│   WebsiteAnalysis│
│   SuppressionEntry│
│   ActivityLog    │
│   AppSetting     │
└─────────────────┘
```

---

## Frontend

**Technology:** Next.js 16 (App Router), TypeScript, Tailwind CSS

### Pages and their roles

| Route | Purpose |
|---|---|
| `/dashboard` | Summary counts, recent activity log |
| `/leads` | Paginated lead list with filters (status, bucket, niche, city) |
| `/leads/[id]` | Lead detail: qualification, drafts, messages, website analysis |
| `/discovery` | SerpAPI search UI, result review, and import |
| `/campaigns` | Campaign list and editor |
| `/templates` | Prompt/template gallery |
| `/mockups` | Static mockup viewer (v1 and v2) |
| `/settings` | App settings, suppression list management |

All data mutations use **Next.js Server Actions** — there is no separate REST API layer. Server Actions run in the Next.js server process and call Prisma directly.

---

## Backend / Server Layer

### Server Actions (`actions/`)

Each file groups actions by domain:

- **`lead-actions.ts`** — create, update, import from CSV, delete, status transitions
- **`outreach-actions.ts`** — website analysis, draft generation, draft approval, send email, log reply
- **`campaign-actions.ts`** — campaign CRUD
- **`discovery-actions.ts`** — SerpAPI search, lead import from discovery results
- **`settings-actions.ts`** — save settings, manage suppression list

### Library modules (`lib/`)

| Module | Role |
|---|---|
| `prisma.ts` | Singleton Prisma client |
| `openai.ts` | Prompt construction and draft generation via OpenAI structured output |
| `resend.ts` | Email sending via Resend API |
| `serpapi.ts` | Google Maps search via SerpAPI |
| `website-analysis.ts` | Homepage fetch + AI analysis |
| `rate-limit.ts` | Pre-send eligibility checks (send cap, time gap, suppression) |
| `lead-qualification.ts` | Scoring and signal derivation for each lead |
| `validators.ts` | Zod schemas for all input boundaries |
| `settings.ts` | Read/write `AppSetting` table |
| `constants.ts` | Enum values, default settings, compliance note |
| `activity.ts` | Helper to write `ActivityLog` records |
| `channel-strategy.ts` | Logic for recommending an outreach channel |
| `utils.ts` | URL normalization, email normalization, text formatting |

---

## Database

**Technology:** SQLite, managed by Prisma ORM.

The schema (`prisma/schema.prisma`) defines the following models:

| Model | Purpose |
|---|---|
| `Lead` | Core entity: one row per prospective business |
| `EmailDraft` | A draft outreach email linked to a lead |
| `EmailMessage` | Sent or received email messages |
| `Campaign` | A named targeting configuration |
| `WebsiteAnalysis` | AI-generated analysis of a lead's homepage |
| `SuppressionEntry` | Permanent opt-out / do-not-contact list |
| `ActivityLog` | Append-only event log for all state changes |
| `AppSetting` | Key/value store for operator-configurable settings |

The database file is excluded from version control. Use `npm run seed` to populate it with representative demo data.

---

## JSON State Files (`data/`)

Two static JSON files complement the database:

### `data/niches.json`

Defines per-vertical configuration used by the mockup generator and offer logic:

```json
{
  "instalater": {
    "label": "Instalatér / voda topení plyn",
    "visual_tone": "trade",
    "cta_type": "phone",
    "trust_signals": ["X let na trhu", "Certifikát ČSN", ...],
    "mockup_vertical": "PLUMBER",
    "status": "live"
  }
}
```

### `data/suppressed.json`

Legacy flat-file suppression list. The database `SuppressionEntry` table is now the authoritative store. This file is kept for backwards compatibility and historical reference.

See `examples/` for mock versions of both files.

---

## "Paperclip Routines" (Scripts)

Paperclip routines are standalone TypeScript scripts run directly with `tsx`. They are used for batch processing tasks that are not triggered by the UI.

### Available scripts

| Script | npm command | Purpose |
|---|---|---|
| `scripts/backfill-lead-qualification.ts` | `npm run qualification:backfill` | Re-scores all leads in the database using the current qualification logic |
| `scripts/export-mockups.ts` | `npm run mockups:export` | Generates HTML mockup files from niche config (v1) |
| `scripts/export-mockups-v2.ts` | `npm run mockups:v2:export` | Generates HTML mockup files using the v2 template system |
| `prisma/seed.ts` | `npm run seed` | Wipes and re-seeds the database with demo data |
| `prisma/apply-migrations.ts` | `npm run prisma:migrate` | Applies pending Prisma migrations |

Scripts are invoked from the terminal. They load environment variables via `dotenv/config` and share the same Prisma client and library modules as the main application.

---

## Email API Integration (Resend)

LocalReach uses **Resend** (resend.com) to send transactional emails.

### How it works

1. `lib/resend.ts` wraps the Resend SDK.
2. The `sendEmail` function reads `RESEND_FROM_EMAIL` and `RESEND_API_KEY` from environment variables.
3. It constructs the `from` address as `[Sender Name] <from@domain>`.
4. It sends a plain-text email (no HTML template).
5. On success, the Resend message ID is stored on the `EmailMessage` record for delivery tracking.

### Environment variables required

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=outreach@yourdomain.com
RESEND_REPLY_TO_EMAIL=reply@yourdomain.com   # optional
```

Resend requires a verified sending domain. See [resend.com/docs](https://resend.com/docs) for setup instructions.

---

## AI Draft Generation (OpenAI)

LocalReach uses the **OpenAI Responses API** with structured output (via Zod schema) to generate first-touch outreach drafts.

### How it works

1. `lib/openai.ts` builds a structured JSON prompt from lead data, campaign config, and website analysis.
2. It submits the prompt using `client.responses.parse` with a `zodTextFormat` schema.
3. The model returns a validated `{ subject, body, personalizationSummary }` object.
4. The library appends the sender signature block and opt-out line to the body.

### Environment variables required

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini   # optional, defaults to gpt-5-mini
```

---

## Configuration and Settings

Operator-configurable settings are stored in the `AppSetting` database table and edited via `/settings`. Defaults are defined in `lib/constants.ts`:

| Setting | Default | Description |
|---|---|---|
| `senderName` | `LocalReach` | Name shown in the From field |
| `senderEmail` | `outreach@example.com` | Sending email address |
| `serviceDescription` | (Czech description) | Injected into AI prompts |
| `defaultOffer` | (Czech) | Default offer angle |
| `defaultCta` | (Czech) | Default call-to-action |
| `defaultOptOut` | (Czech) | Opt-out line appended to every email |
| `dailySendCap` | `10` | Maximum emails per calendar day |
| `minimumSecondsBetweenSends` | `300` | Minimum gap between sends |
| `openAiModel` | `gpt-5-mini` | OpenAI model name |
