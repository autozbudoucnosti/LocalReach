# LocalReach AI Automation Case Study

LocalReach is a practical AI automation workflow for finding Czech local businesses, preparing personalized outreach drafts, validating them, and sending approved SMS messages through an operator-controlled pipeline.

## What problem it solves

Small businesses often have weak websites, but manual prospecting and outreach is repetitive. This project explores how AI agents can assist with discovery, draft generation, quality checks, and operator approval.

## Core workflow

1. Discover local business leads
2. Score and filter leads
3. Generate Czech first-touch SMS drafts
4. Write drafts into a structured JSON batch
5. Materialize the batch into an approval queue
6. Human approves selected messages
7. SMS is sent through API
8. Replies are tracked and routed to handoff

## Why this is not just prompting

The project includes:
- structured data handoff between agents and backend
- validation guards
- stale-file protection
- placeholder phone protection
- manual approval before sending
- send logs
- reply status tracking
- smoke test for the SMS pipeline

## Tech used

- Next.js
- TypeScript
- Paperclip routines
- OpenClaw / Codex agents
- Vonage SMS API
- JSON-based workflow state
- GitHub for versioning and documentation

## Current status

Working prototype. The system can generate SMS batches, materialize them into an approval queue, approve leads manually, send messages through the API, and track replies.


## Limitations

This is a prototype. Some parts are intentionally operator-controlled because automatic sending without human review would be risky.
