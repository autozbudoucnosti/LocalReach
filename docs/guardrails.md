# LocalReach — Guardrails

This document describes the validation checks, safety controls, and quality guardrails built into LocalReach. These exist to prevent accidental bulk sending, maintain message quality, and respect contacts who do not want to be reached.

---

## 1. Input Validation (Zod Schemas)

All operator input is validated using Zod schemas defined in `lib/validators.ts` before any database write or API call occurs.

### Lead input (`leadInputSchema`)

| Field | Rule |
|---|---|
| `businessName` | Required, max 160 characters |
| `email` | Optional; if provided, must be a valid email address |
| `phone` | Optional, max 80 characters |
| `website` | Optional; if provided, must be a parseable URL |
| `sourceUrl` | Optional; if provided, must be a parseable URL |
| `googleRating` | Optional number in range 0–5 |
| `googleReviewCount` | Optional integer in range 0–50000 |
| `status` | Must be one of the defined `LeadStatus` enum values |

Duplicate detection: Prisma enforces a unique constraint on `(businessName, website)` and a separate unique constraint on `email`. Attempts to import duplicates return a user-facing error without crashing.

### Discovery import (`discoveryImportRequestSchema`)

- The `classification` field must be `HAS_WEBSITE` or `NO_WEBSITE`.
- The `suggestedCampaignName` must be one of the defined campaign names.
- Maximum 20 leads per import batch.

### Settings (`settingsInputSchema`)

| Field | Rule |
|---|---|
| `dailySendCap` | Integer, 1–100 |
| `minimumSecondsBetweenSends` | Integer, 0–86400 (max 24 hours) |
| `senderEmail` | Must be a valid email address |
| All text fields | Trimmed; required fields must be non-empty |

### Draft edit (`draftEditSchema`)

- `subject` is required, max 200 characters.
- `body` is required, max 5000 characters.

---

## 2. Pre-Send Eligibility Checks

Before any email is dispatched, `lib/rate-limit.ts` runs a series of checks via `assertCanSendEmail`. Every check must pass or the send is blocked with a descriptive error.

### Check 1 — Draft status

```
Draft must have status = APPROVED
```

A draft can only be sent if an operator has explicitly approved it. Unapproved (`DRAFT`) or already-sent drafts are rejected.

### Check 2 — Lead has an email address

```
lead.email must not be null
```

Protects against attempting to send to a lead with no contact email.

### Check 3 — Lead opt-out status

```
lead.status must not be OPTED_OUT
```

Leads that have opted out are permanently blocked from receiving further outreach.

### Check 4 — Suppression list

```
lead.email must not appear in the SuppressionEntry table
```

The database suppression table is checked on every send. Adding an email to the suppression list immediately blocks all future outreach to that address.

### Check 5 — Daily send cap

```
count(OUTBOUND messages sent today) < settings.dailySendCap
```

The system counts outbound messages sent since midnight. If the cap is reached, sending is blocked until the next calendar day (or the operator increases the cap in settings).

Default cap: **10 emails per day**.

### Check 6 — Minimum interval between sends

```
seconds since last outbound send >= settings.minimumSecondsBetweenSends
```

Prevents burst sending. The operator is told exactly how many seconds to wait.

Default interval: **300 seconds (5 minutes)** between sends.

---

## 3. Opt-Out Handling

Every generated email body ends with a default opt-out line (set in `/settings`). The default Czech opt-out line is:

> *Pokud to pro Vás není relevantní, stačí odepsat, že nemáte zájem, a už se neozvu.*

(Translation: "If this is not relevant for you, just reply that you are not interested and I will not contact you again.")

When an opt-out is received:
1. The operator manually adds the email to the suppression list via `/settings`.
2. The `SuppressionEntry` record is created with reason `"Opted out"`.
3. The lead's status is updated to `OPTED_OUT`.
4. Opt-out suppressions are **permanent** and cannot be removed in the UI.

---

## 4. Suppression List Controls

The `SuppressionEntry` table is the authoritative do-not-contact list.

- Entries can be added manually in `/settings` (email + reason).
- Entries with reason `"Opted out"` are locked and cannot be deleted through the UI.
- All other suppression entries (e.g., "Competitor", "Wrong contact") can be removed.
- The legacy `data/suppressed.json` flat file is no longer the primary store but is kept for reference.

---

## 5. AI Prompt Guardrails

The system prompt in `lib/openai.ts` enforces the following constraints on generated drafts:

| Rule | How it is enforced |
|---|---|
| Write in Czech only | Explicit instruction in system prompt |
| Use formal Czech (vykání) | Explicit instruction in system prompt |
| Do not invent facts or metrics | Explicit prohibition in system prompt |
| Only use supplied data | Explicit instruction in system prompt |
| No hype or guaranteed results | Explicit prohibition in system prompt |
| 80–120 word body length | Explicit instruction in system prompt |
| Include opt-out line verbatim | Explicit instruction; library code also appends it |
| Do not add own signature | The signature block is appended programmatically |

After generation, the library code:
- Strips any trailing opt-out line the model may have added (to prevent duplication).
- Removes any signature the model may have added.
- Appends the canonical `SIGNATURE_BLOCK` and opt-out line.

The returned draft is validated against `outboundDraftSchema` (Zod). If the model returns a malformed response, the action returns a user-facing error rather than saving an invalid draft.

---

## 6. Message Quality Controls

- The personalization summary field is required and stored alongside the draft so the operator can verify that the AI used real lead-specific data.
- The operator can edit the subject and body before approving.
- Sending requires a separate explicit "Send" action after approval — approval does not auto-send.

---

## 7. Follow-Up Limits

The constant `FOLLOW_UP_MAX = 2` (in `lib/constants.ts`) defines the maximum number of follow-up messages that can be generated for a single lead. The minimum recommended interval between a send and the next follow-up is `FOLLOW_UP_RECOMMENDED_MIN_DAYS = 5` days.

---

## 8. Discovery Import Limits

The `discoveryImportRequestSchema` limits each import batch to **20 leads**. This is intentional — the system is designed for careful, low-volume prospecting, not bulk imports.
