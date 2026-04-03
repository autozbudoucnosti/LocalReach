# LocalReach Agent Guide

## Product Goal
- LocalReach is a low-volume outreach tool for personalized website redesign and modernization outreach to Czech local businesses.
- The product is built for careful manual review, honest personalization, and compliance-first sending.

## Non-Negotiable Rules
- Never remove manual approval before sending.
- Never build mass-spam features, bulk blasting, or automation that reduces human review.
- Always preserve suppression and opt-out handling.
- Keep outreach low-volume and highly personalized.
- Default outreach language is Czech.
- Use formal Czech (vykání).
- Never invent website observations, business facts, or results.
- If website analysis is weak, stay honest and generic.
- Prefer small, reviewable diffs over large rewrites.

## Writing Guidance
- Emails must stay plain text.
- Write concise, natural Czech.
- Avoid spammy language, fake urgency, and exaggerated claims.
- Never promise guaranteed results.
- Use soft CTA only.
- Usually keep the body around 80–120 words.

## Technical Guidance
- Preserve Prisma schema integrity and existing data assumptions.
- Do not break existing routes, page flows, or server actions.
- Do not remove compliance UI, approval steps, suppression controls, or sending safeguards.
- Prefer focused fixes over broad refactors.

## Before Finishing Any Task
- Explain what changed in clear, practical terms.
- List every file changed.
- Mention risks, tradeoffs, or unverified areas honestly.
