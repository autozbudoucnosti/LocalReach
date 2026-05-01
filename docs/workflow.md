# LocalReach — End-to-End Workflow

This document describes the full lifecycle of a lead through the LocalReach system, from initial discovery to the tracking of replies.

---

## Overview

```
Discovery → Import → Qualification → Draft generation → Approval → Send → Reply tracking
```

Each stage produces or updates a database record. No outbound messages are sent without an explicit operator approval step.

---

## Stage 1 — Lead Discovery

**Input:** A keyword and a city entered on the Discovery page.

The operator runs a SerpAPI-powered Google Maps search via the `/discovery` UI. Results arrive as a list of local businesses with name, category, address, phone, website URL (if any), and Google rating/review count.

The operator manually reviews each result and selects which leads to import.

**Output:** A set of selected leads stored in the `Lead` table with status `NEW`.

---

## Stage 2 — Lead Qualification

**Input:** A `Lead` record.

On import (and optionally via a backfill script), the system runs `deriveLeadQualificationSnapshot`, which scores each lead against a set of signals:

| Signal | Description |
|---|---|
| Website state | Does the business have a website? Is it weak or decent? |
| ICP fit | How well does the lead match the target customer profile? |
| Review strength | Volume and quality of Google reviews |
| Reachability | Is there a public business email address? |
| Owner-led probability | Signs that the business is run directly by an owner |

These signals produce:
- a numeric lead score (0–100)
- a priority bucket (`LOW`, `MEDIUM`, `HIGH`)
- a recommended offer (`LAUNCH_PAGE`, `SIMPLE_WEBSITE`, `REDESIGN_SPRINT`)
- a recommended outreach channel (`PHONE`, `WARM_EMAIL`, `CONTACT_FORM`, etc.)
- a next best action recommendation

**Output:** Updated `Lead` record with scoring fields populated.

---

## Stage 3 — Website Analysis (optional)

**Input:** A `Lead` with a `website` URL.

The operator can trigger a website analysis from the lead detail page. The system fetches the homepage HTML using `cheerio`, extracts the page title, meta description, and visible text, then sends a structured prompt to the OpenAI API requesting a plain-language summary and a list of detected issues (mobile-unfriendly, missing CTA, slow, outdated design, etc.).

**Output:** A `WebsiteAnalysis` record linked to the lead.

---

## Stage 4 — Draft Generation

**Input:** A `Lead` record and optionally a `Campaign` and `WebsiteAnalysis`.

The operator clicks "Generate draft" on the lead detail page. The system calls `generatePersonalizedDraft` in `lib/openai.ts`, which:

1. Selects the outreach case (`website_improvement`, `new_website`, or `generic_outreach`).
2. Builds a structured JSON prompt containing lead details, campaign context, website analysis, and sending constraints.
3. Submits the prompt to the OpenAI API using structured output (Zod schema).
4. Parses and validates the returned `subject`, `body`, and `personalizationSummary`.
5. Appends the sender signature block and the default opt-out line to the body.

**Output:** A new `EmailDraft` record with status `DRAFT`.

---

## Stage 5 — Manual Review and Approval

**Input:** An `EmailDraft` with status `DRAFT`.

The operator reads the draft in the lead detail view. They can:
- Edit the subject and body.
- Approve the draft (status → `APPROVED`).
- Archive the draft if it is not usable.

**No email is sent at this stage.** Approval is a separate deliberate action.

**Output:** An `EmailDraft` with status `APPROVED`.

---

## Stage 6 — Send

**Input:** An `EmailDraft` with status `APPROVED`.

The operator clicks "Send" in the UI. Before sending, the system runs a series of eligibility checks (see `docs/guardrails.md`). If all checks pass:

1. The email is sent via the Resend API.
2. An `EmailMessage` record is written with direction `OUTBOUND`, the Resend message ID, and a `sentAt` timestamp.
3. The `Lead` status advances to `SENT`.
4. The `EmailDraft` status advances to `SENT`.

**Output:** `EmailMessage` record + updated lead and draft statuses.

---

## Stage 7 — Reply Tracking

**Input:** An inbound reply (currently logged manually or via webhook).

When a reply is received, an `EmailMessage` record with direction `INBOUND` is created. The `Lead` status advances to `REPLIED`. The operator reviews the reply in the lead detail view and decides the next step.

**Output:** Updated `Lead` status and activity log entry.

---

## State Diagram

```
Lead statuses:
NEW → DRAFTED → APPROVED → SENT → REPLIED
                                 → OPTED_OUT (at any stage)
                                 → BOUNCED

Draft statuses:
DRAFT → APPROVED → SENT
      → ARCHIVED
```

---

## Supporting Data Files

| File | Purpose |
|---|---|
| `data/niches.json` | Static config for each supported business vertical (visual tone, trust signals, mockup kind) |
| `data/suppressed.json` | Legacy flat-file suppression list (superseded by the `SuppressionEntry` DB table) |
| `prisma/seed.ts` | Seeds the database with representative demo leads and one sample campaign |

See `examples/` for safe mock versions of these data structures.
