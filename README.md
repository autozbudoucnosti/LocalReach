# LocalReach

AI-assisted lead discovery and SMS outreach workflow for Czech local businesses.

LocalReach is a portfolio project that shows a practical agentic automation system, not just prompt generation. The system finds local businesses, prepares personalized Czech first-touch SMS drafts, validates the batch, requires human approval, sends approved messages through an SMS API, and tracks replies.

## Problem

Small local businesses often have weak, outdated, or hard-to-use websites. Finding these leads, checking their websites, preparing a relevant first-touch message, and tracking follow-up is repetitive manual work.

LocalReach explores how AI agents can support that workflow while keeping the risky step — sending outreach — under human control.

## What the system does

1. Discovers Czech local business leads.
2. Classifies the opportunity, for example weak website, poor contact flow, or missing website.
3. Generates short Czech outreach drafts using vykání.
4. Writes the selected SMS-ready leads into a structured JSON batch.
5. Materializes the JSON batch into an approval queue.
6. Lets the operator approve or reject each message.
7. Sends only approved messages through the SMS API.
8. Logs sends and tracks replies.

## Why this is more than prompting

The main value is the workflow around the model output:

- agent routines for discovery, drafting, review, and operations control
- structured JSON handoff between agents and the backend
- manual approval before any SMS is sent
- stale-file protection so old batches are not resent by accident
- placeholder phone protection
- message validation before materialization
- approval queue UI
- send queue UI
- send logs and reply tracking
- smoke test for the SMS pipeline

## Current prototype status

Working locally:

- daily draft JSON generation
- SMS batch materialization
- approval queue
- approval-to-send transition
- batch send flow
- SMS API send path
- reply status tracking
- smoke test for the SMS pipeline

Known active improvement areas:

- lead discovery quality still needs stronger source checks
- messages can become too similar across leads and need better personalization rules
- more robust deduplication is needed across batches and source files
- production deployment is not the goal yet; this is a local operator-controlled prototype

## Architecture

```text
Paperclip routines / agents
        |
        v
Lead discovery + draft generation
        |
        v
company/localreach/draft-approve/daily-sms-draft-prep.latest.json
        |
        v
materialize-batch API
        |
        v
company/localreach/batches/<batch_id>/sms_approval_queue.json
        |
        v
Approval UI -> Send UI -> SMS API
        |
        v
send logs + reply status
```

## Example SMS draft format

```json
{
  "batch_id": "2026-04-27-sms-0830",
  "generated_at": "2026-04-27T08:30:00Z",
  "leads": [
    {
      "lead_id": "example-business-brno",
      "company_name": "Example Business Brno",
      "phone_e164": "+420777123456",
      "channel": "sms",
      "message": "Dobrý den, narazil jsem na Váš web a myslím, že by šel zjednodušit a lépe zpřehlednit. Mohu poslat krátký návrh modernější verze webu?",
      "score": 8,
      "niche": "služby",
      "city": "Brno",
      "source_url": "https://example.cz",
      "recommended_priority": "medium"
    }
  ]
}
```

## Safety and validation guards

Before a batch can be materialized, the system should verify:

- the JSON file is fresh
- the batch contains real leads
- phone numbers are valid E.164 numbers
- placeholder phones are rejected
- each lead has a non-empty SMS message
- old test leads are not reused
- already-sent leads are deduplicated

The goal is not full autonomy. The goal is controlled automation with visible checks.

## Local smoke test

Run from the project directory:

```bash
cd /Users/open-claw/workspace/projects/localreach/LocalReach
npx tsx scripts/smoke-test-sms-pipeline.ts
```

Expected result:

```text
[PASS] JSON updated today
[PASS] No placeholder leads found
[PASS] No placeholder phones found
[PASS] All leads have messages
[PASS] All phones valid E164
[PASS] Materialize returned batch_id: <batch-id>
Smoke test PASSED
```

## Tech stack

- Next.js
- TypeScript
- Paperclip routines
- OpenClaw / Codex-style agents
- Vonage SMS API
- JSON file-based workflow state
- GitHub for documentation and version control

## Main screens

Recommended screenshots to add:

- `docs/screenshots/approval-queue.png`
- `docs/screenshots/send-queue.png`
- `docs/screenshots/paperclip-routines.png`
- `docs/screenshots/smoke-test-pass.png`

These should show the operator-controlled workflow: generated leads, approval, send queue, and validation.

## What this demonstrates

This project demonstrates ability to:

- design an AI-assisted business workflow
- connect agents with backend state
- build guardrails around model output
- create human-in-the-loop approval flows
- debug real integration problems across UI, API routes, files, and scheduled routines
- document a working prototype for review

## Limitations

This is a local prototype, not a finished SaaS product.

Main limitations:

- source extraction is not yet reliable enough for unsupervised lead generation
- lead quality depends on the available source data
- SMS deliverability and reply rate require more real-world testing
- UI is intentionally minimal
- all sending should remain human-approved until the pipeline has stronger quality controls

## Roadmap

Next practical improvements:

1. Improve lead discovery with stronger source validation and scoring.
2. Add anti-similarity rules so SMS messages do not look templated.
3. Add stronger batch deduplication across all prior sends.
4. Add a dashboard showing reply rate, sent count, and conversion steps.
5. Add screenshots and a short demo video for portfolio use.
6. Package the workflow as a clearer case study for job applications.
