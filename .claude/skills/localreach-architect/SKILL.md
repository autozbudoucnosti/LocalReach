# Skill: localreach-architect

## Purpose

Keep all implementation work grounded in the existing LocalReach repo structure. Prevent one-off implementations that drift from the established template system, routing conventions, and approval flow.

## Trigger conditions

Use this skill whenever you are about to:
- Add a new feature, route, or component
- Modify the template system
- Change how leads or briefs are stored or loaded
- Make any structural decision about the codebase

## Pre-implementation checklist

Before writing a single line of code, answer these questions:

1. **Does this fit an existing template niche?**
   - If yes → modify the existing niche template, do not create a parallel one.
   - If no → use `niche-brief-generator` first to define the new niche.

2. **Does this change the approval/suppression flow?**
   - Any change that bypasses `data/suppressed.json` or adds auto-send behaviour is **blocked**.
   - Raise this explicitly and wait for human confirmation.

3. **What is the smallest diff that achieves the goal?**
   - Describe the change in one sentence before writing code.
   - If the description requires more than one sentence, break the task down further.

4. **Which files will be touched?**
   - List them before editing. Do not touch files outside that list without re-checking.

## Implementation rules

- **Templates live in `/templates/<niche>/`** — do not put template HTML anywhere else.
- **Lead data lives in `/leads/<slug>/`** — one folder per prospect, always.
- **Briefs are always `brief.json`** — do not invent alternative names or formats.
- **Scripts go in `/scripts/`** — no helper scripts inline in templates.
- **CSS stays in `style.css`** — no `<style>` blocks inside `index.html` beyond a minimal reset. Exception: `/leads/<slug>/mockup.html` output files may have CSS inlined for single-file portability. Do not inline CSS in `/templates/`.

## After implementation

- Run a quick diff review: does this change anything outside the declared file list?
- If yes → revert and explain why.
- If no → hand off to `template-qa` or `sales-mockup-critic` for review.

## Anti-patterns to refuse

- Creating a `/mockups/` folder separate from `/leads/<slug>/`
- Generating HTML directly in a script without using the template system
- Adding API keys or credentials anywhere in the repo
- Auto-committing or auto-pushing changes
