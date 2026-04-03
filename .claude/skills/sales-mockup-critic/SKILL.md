# Skill: sales-mockup-critic

## Purpose

Judge whether a generated mockup page would convincingly pass as a real Czech local-business website to a skeptical prospect. Flag any "AI-generated template" signals. Push realism over visual polish.

## Trigger conditions

Use this skill:
- After the first pass of any new niche mockup
- Before approving a screenshot for outreach use
- When reviewing a mockup for screenshot-readiness

## Evaluation framework

Score each dimension: **pass / partial / fail**. A mockup is outreach-ready only if all dimensions are pass or partial, no dimension is fail, and no hard blockers exist.

### 1. Business identity

Does the page feel like it belongs to a specific real business?

- **pass** — plausible business name, local address, phone number, and a logo placeholder that fits the niche
- **partial** — name and contact present but generic (e.g. "Servis Praha s.r.o.")
- **fail** — "Your Business Name", unfilled placeholders, or no contact details visible

### 2. Copy realism

Does the copy sound like a real Czech tradesman wrote it (or had it written)?

- **pass** — specific services with local pricing norms, natural Czech, no lorem ipsum
- **partial** — correct Czech, somewhat generic service list, no obvious AI phrasing
- **fail** — lorem ipsum, English words in body copy, or visibly machine-generated sentence structure

**Blocker:** Any lorem ipsum anywhere on the page = automatic fail. Do not proceed.

### 3. Visual hierarchy

Is the most important information above the fold?

**Note: this dimension requires a rendered screenshot to assess reliably.** If no screenshot is available, mark as partial and flag for human check before outreach approval.

- **pass** — hero with CTA, phone number, and primary service all visible without scrolling (assess at 1280px width)
- **partial** — CTA exists but is low contrast, or phone number requires scrolling
- **fail** — no CTA visible, or no phone number on the page at all

### 4. Trust signals

Are there credibility markers a local business would actually have?

Good signals: years in business, number of completed jobs, certifications (e.g. ČSN, ISO), local area names, customer first names in testimonials, a real-looking Google Maps embed placeholder.

- **pass** — two or more strong, specific trust signals
- **partial** — one generic signal (e.g. "10 let zkušeností")
- **fail** — no trust signals at all

### 5. Footer realism

Does the footer look like a real Czech business registered entity?

- **pass** — IČO, DIČ, registered address, links to GDPR/VOP pages (even if placeholder), copyright year
- **partial** — IČO present, some fields missing
- **fail** — footer missing, or clearly a template placeholder

**Blocker:** Missing IČO in footer = automatic fail for any Czech business mockup.

## Output format

```
MOCKUP CRITIQUE — <niche> — <slug>

Business identity:  pass / partial / fail
Copy realism:       pass / partial / fail
Visual hierarchy:   pass / partial / fail  [screenshot available: yes/no]
Trust signals:      pass / partial / fail
Footer realism:     pass / partial / fail

BLOCKERS: [list or "none"]

VERDICT: PASS / CONDITIONAL PASS / FAIL

Required fixes before outreach:
- [fix 1]
- [fix 2]
```

## Handoff

- PASS → hand to `outreach-asset-agent`
- CONDITIONAL PASS → list fixes, re-run this skill after fixes
- FAIL → hand to `copy-realism-agent` and/or `ui-polish-agent` for targeted repairs
