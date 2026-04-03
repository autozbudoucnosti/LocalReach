# Skill: local-business-realism-check

## Purpose

A second-pass review that asks one specific question: **would a real Czech local business owner plausibly have this website?** This is separate from technical QA (`template-qa`) and visual sales review (`sales-mockup-critic`). It focuses on believability from the business owner's point of view, not the prospect-as-buyer.

## Trigger conditions

Use this skill:
- On every generated mockup as a second pass, after `sales-mockup-critic`
- When something "looks fine" but feels off and you can't name why
- Before approving a template niche for operational batch use

## Core question

> If you showed this page to a Czech plumber, dentist, or personal trainer and said "did you make this website?", would they nod — or would they frown?

## Realism signals — check for presence

These are things real Czech local-business sites actually have. Score how many apply.

**Strong realism signals (2 points each):**
- Business owner's first name used somewhere ("Jiří Novák, majitel")
- A real-looking photo placeholder (labelled "foto majitele" or "náš tým", not "hero image")
- Service area listed by specific town/district names ("Pracujeme v Praze 6, 7, a okolí")
- A specific phone number format: `+420 XXX XXX XXX` or `XXX XXX XXX`
- A working hours block ("Po–Pá 7:00–17:00, So po domluvě")
- Mention of a specific certification or membership that exists in that niche (e.g. "Člen Cechu instalatérů ČR")

**Moderate realism signals (1 point each):**
- Plural "my" language where appropriate ("Jsme tým…" for multi-person businesses)
- Singular "já" language for solo operators ("Přijíždím po celé Praze")
- Price ranges that match Czech market norms for the niche
- A mention of cash or invoice payment options
- A VAT status note ("Nejsme plátci DPH" for small operators)

## Realism red flags — check for absence

These are things that break believability. Each is a deduction.

**Hard red flags (automatic fail):**
- Stock photo descriptions visible as `alt` text or filenames in the HTML
- Generic testimonials with no first name, city, or service mentioned
- Services listed as bullet points without any description or price context
- "We offer high-quality services at competitive prices" or equivalent
- Section headers that are clearly template labels: "Our Services", "Why Choose Us", "About Us" (untranslated or overly generic)

**Soft red flags (note but do not auto-fail):**
- No mention of how long the business has existed
- No mention of a specific local competitor area
- Testimonials with suspiciously round numbers ("100% spokojenost")

## Scoring

| Score | Verdict |
|---|---|
| 8+ points, 0 hard red flags | REALISTIC — proceed |
| 5–7 points, 0 hard red flags | PLAUSIBLE — minor improvements recommended |
| Any hard red flag present | FAIL — fix before outreach |
| Below 5 points | WEAK — significant copy work needed |

## Output format

```
REALISM CHECK — <niche> — <slug>

Strong signals present:  [list]
Moderate signals present: [list]
Hard red flags: [list or "none"]
Soft red flags: [list or "none"]

Score: X points
Verdict: REALISTIC / PLAUSIBLE / WEAK / FAIL

Recommended fixes:
- [fix 1]
- [fix 2]
```

## Handoff

- REALISTIC → approved for outreach asset packaging
- PLAUSIBLE → note improvements, can proceed with caution
- WEAK → send to `copy-realism-agent` before outreach
- FAIL → block outreach, fix hard red flags first
