---
name: localreach-qa
description: Use this skill when verifying LocalReach behavior such as route verification, lead lifecycle checks, form behavior review, website analysis validation, draft generation checks, approval-flow validation, or suppression and send-safeguard checks. Do not use this skill for copywriting-only tasks, marketing tone improvements, schema redesign, or unrelated styling work.
---

# LocalReach QA

## Use This Skill When
- Verifying that core routes load and behave correctly.
- Checking lead lifecycle behavior across create, edit, draft, approve, send, reply, opt-out, and suppression states.
- Reviewing form behavior, validation, save flows, and error handling.
- Validating website analysis behavior with realistic inputs and failure cases.
- Testing draft generation behavior, including clear success and failure states.
- Confirming approval flow and send safeguards still work as intended.

## Do Not Use This Skill When
- The task is only about outreach copywriting or rewriting email text.
- The task is mainly about marketing tone or subject-line improvement.
- The task is redesigning the schema, data model, or migrations.
- The task is unrelated visual polish, styling, or layout refactoring.

## Rules
- Prefer minimal, targeted fixes over broad refactors.
- Do not remove safeguards, approval gates, suppression behavior, or send limits.
- Do not weaken compliance behavior, even if doing so would simplify the flow.
- Be explicit about what was tested, what was not tested, and any remaining uncertainty.

## QA Checklist
- Dashboard loads without breaking.
- Leads page loads without breaking.
- Lead detail page loads without breaking.
- Lead edits save correctly and persist expected values.
- Website analysis handles valid URLs and invalid URLs with clear outcomes.
- Draft generation succeeds when prerequisites are present or fails with a clear message.
- Manual approval is required before send.
- Suppressed leads cannot be sent and cannot bypass safeguards.
- Status transitions behave correctly across the lead and draft lifecycle.
- UI copy fits Czech-market usage where relevant, especially around outreach, opt-out, and compliance-facing text.

## Expected QA Output
- State the exact routes, actions, or flows checked.
- Note any commands, pages, or fixtures used.
- Separate confirmed behavior from assumptions.
- Call out blockers and gaps directly.
- If fixes were made, explain why they were the smallest safe change.
