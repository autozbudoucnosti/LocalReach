# LocalReach — 5-Minute Demo Script

A walkthrough for a live screen-share demonstration of the LocalReach AI workflow. Each section is timed to fit within five minutes total.

---

## Before You Start (Setup)

- Run `npm run seed` to reset the database to a clean demo state.
- Start the dev server: `npm run dev`
- Open `http://localhost:3000` in your browser.
- Have the terminal visible in case you want to show environment setup.

---

## Minute 1 — Dashboard and Leads List

**Goal:** Show the operator's view of the pipeline at a glance.

1. Open `http://localhost:3000/dashboard`.
   - Point out the lead count by status: NEW, DRAFTED, SENT, REPLIED.
   - Show the recent activity log (seeded events).

2. Navigate to `/leads`.
   - Show the lead table with status badges, priority buckets, and score columns.
   - Filter by bucket = `HIGH` to show only the best-scored leads.
   - Open **Riverbend Plumbing** (status: DRAFTED) to go to the lead detail.

---

## Minute 2 — Lead Detail and Qualification

**Goal:** Show how the system scores and prioritizes a lead.

3. On the Riverbend Plumbing detail page:
   - Point out the qualification panel: score, priority bucket, recommended offer, recommended channel.
   - Explain that this was computed automatically on import from signals like website state, review strength, and reachability.
   - Show the notes field and the "Next best action" recommendation.

4. Scroll to the draft section.
   - Show the existing draft with subject, body, and personalization summary.
   - Explain the personalization summary: it records what specific observation the AI used.

---

## Minute 3 — Draft Generation (Live or Pre-Generated)

**Goal:** Show the AI draft generation step.

*Option A — Live generation (requires `OPENAI_API_KEY` in `.env`):*

5. Navigate to a lead with status `NEW`, such as **Oak Street Dental**.
   - Click "Analyze website" if a website URL is present.
   - After analysis completes, click "Generate draft".
   - Show the generated draft and point out:
     - The subject is short and natural.
     - The body is concise (~100 words).
     - The opt-out line is present.
     - The personalization summary explains what the AI observed.

*Option B — Pre-generated draft (no API key needed):*

5. Stay on **Riverbend Plumbing**.
   - Show the pre-seeded draft body.
   - Point out the Czech language, formal tone (vykání), and soft CTA.

---

## Minute 4 — Approval and Send

**Goal:** Show the manual approval gate and the pre-send checks.

6. On the Riverbend Plumbing draft:
   - Click "Approve draft".
   - Show that the draft status changes to `APPROVED`.
   - Explain: the email is not sent yet. Approval is deliberate.

7. Click "Send email".
   - If `RESEND_API_KEY` is configured, the email is sent and the lead advances to `SENT`.
   - If not configured, show the error message — this is expected in a demo without API keys.
   - Either way, explain what would happen: Resend API call → `EmailMessage` record → lead status → `SENT`.

8. Show the settings page (`/settings`):
   - Point out the daily send cap and minimum interval between sends.
   - Show the suppression list with **Northfield Legal** already suppressed.

---

## Minute 5 — Discovery and Suppression

**Goal:** Show how new leads enter the system and how opt-outs are handled.

9. Navigate to `/discovery`.
   - Show the search form: keyword, city, country, limit, website filters.
   - If SerpAPI is configured, run a live search for "instalatér" in "Brno".
   - If not, describe what the results look like (name, phone, website, rating).

10. Briefly show the **Harbor Fitness Studio** lead (status: REPLIED):
    - Show the inbound reply in the message history.
    - Explain: the operator reviews replies here and decides the next step manually.

11. Go to `/settings` > Suppression list:
    - Explain that adding an email here permanently blocks all outreach to that address.
    - Show the "Opted out" entry that cannot be deleted.

---

## Wrap-Up Talking Points

- The system is a working prototype, not a production-ready SaaS.
- Every send requires manual approval — there is no scheduled or automated sending.
- The AI generates drafts; the operator reads, edits, and approves each one individually.
- The guardrails (send cap, suppression list, opt-out line, approval gate) exist to keep outreach low-volume and compliant.
- The main technical challenge was structuring the AI output reliably and enforcing validation at every boundary.
