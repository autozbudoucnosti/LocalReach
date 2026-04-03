# Skill: niche-brief-generator

## Purpose

Turn raw lead observations or business context into a short, structured `brief.json` that drives all downstream work — mockup generation, copy, and outreach. Do not start building anything until this brief exists and is approved.

## Trigger conditions

Use this skill:
- Before creating or customising a template for a new niche
- Before passing context to Claude for mockup generation
- Before writing outreach copy for a new lead
- Whenever you have a lead but no `brief.json` yet

## Input you need

Collect as many of these as available (not all are required):

- Business name (or "unknown")
- Niche / trade (required)
- City or region (required)
- Current website URL (if any)
- Observations about current online presence (optional)
- Known services or specialisations (optional)
- Approximate size (solo, small team, larger) (optional)

## Brief schema (brief.json)

```json
{
  "slug": "kebab-case-business-identifier",
  "niche": "instalatér | zubař | trenér | elektrikář | úklid | ...",
  "business_name": "string or null",
  "city": "string",
  "region": "string or null",
  "current_site": "url or null",
  "site_observations": "string or null",
  "trust_signals": ["array", "of", "strings"],
  "services": ["array", "of", "strings"],
  "cta_type": "phone | form | booking | email",
  "section_order": ["hero", "services", "about", "testimonials", "contact"],
  "visual_tone": "professional | friendly | trade | medical | wellness",
  "copy_language": "formal | semi-formal",
  "suppressed": false
}
```

### Field guidance

**trust_signals** — pick 2–4 that fit the niche and region:
- "X let na trhu"
- "Certifikát [name]"
- "Referenční zakázky v [city]"
- "Člen [association]"
- "Pojištění odpovědnosti"
- "Recenze Google [X] hvězd"

**section_order** — default is `["hero", "services", "about", "testimonials", "contact"]`. Adjust:
- Medical: move "certifications" before "testimonials"
- Solo trades: can drop "about" if services section carries the personality
- Wellness: add "pricing" before "contact"

**visual_tone:**
- `professional` — law, accounting, medical
- `friendly` — cleaning, wellness, childcare
- `trade` — plumbing, electrical, construction
- `medical` — dental, physio, specialist clinics
- `wellness` — fitness, nutrition, yoga

**cta_type:**
- `phone` — trades, anything urgent
- `form` — B2B, higher-consideration services
- `booking` — medical, fitness
- `email` — creative, consulting

## Output

1. Complete `brief.json` ready to save to `/leads/<slug>/brief.json`
2. One-paragraph human summary of the brief for quick review
3. Flag any fields that were guessed vs. confirmed

## Validation before handoff

- `niche` must match a key in `data/niches.json`
- `slug` must be unique (check `/leads/` folder)
- `suppressed` must be `false` (if true, stop — do not generate assets)
- `cta_type` and `visual_tone` must be consistent (e.g. do not use `friendly` tone with `form` CTA for a plumber)
