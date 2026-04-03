# Skill: template-qa

## Purpose

Verify that a niche template is maintainable, screenshot-usable, and operationally ready before it is used for real lead mockups. This is a structural and technical check — not a sales or copy review (use `sales-mockup-critic` for that).

## Trigger conditions

Use this skill:
- After building or significantly modifying a niche template
- Before using a template for the first batch of leads in a new niche
- When a template has not been used in 30+ days and may have drifted

## Checklist

Run each check and mark ✅ pass or ❌ fail with a note.

### Layout quality

- [ ] Page renders without horizontal scroll at 1280px viewport width
- [ ] Page renders without horizontal scroll at 390px viewport width (mobile)
- [ ] No broken layout caused by missing images (all `<img>` tags have meaningful `alt` and a CSS fallback background)
- [ ] Sections have consistent padding — no section touching another without visual separation
- [ ] Font sizes are readable: body ≥ 16px, headings appropriately larger

### CTA visibility

- [ ] Primary CTA (button or phone number) is visible above the fold at 1280px
- [ ] CTA has sufficient contrast (pass WCAG AA minimum — 4.5:1 for normal text)
- [ ] CTA label is in Czech and niche-appropriate (check against `czech-outreach-copy` CTA table)
- [ ] CTA is clickable area ≥ 44×44px on mobile

### Footer realism

- [ ] Footer contains IČO placeholder (`IČO: 00000000`)
- [ ] Footer contains a registered address placeholder
- [ ] Footer contains copyright year (use current year variable or hardcoded)
- [ ] Footer links to GDPR/VOP pages (can be `#` placeholder but link must exist)

### Screenshot usability

- [ ] No `alert()`, `console.error()`, or JS errors on load (check browser console)
- [ ] No external fonts that could fail to load (use system fonts or locally bundled)
- [ ] No placeholder text visible in default state: "Lorem ipsum", "Your Name", "Click here", "Placeholder"
- [ ] All template variables (e.g. `{{business_name}}`) are replaced before screenshot

### Maintainability

- [ ] Template uses a single `style.css` — no inline `<style>` blocks with more than 10 lines
- [ ] No hardcoded lead-specific data in the template (business name, phone, address must come from brief)
- [ ] Template is self-contained: no dependency on files outside `/templates/<niche>/`
- [ ] A `brief.json` schema comment or example exists in the template folder

## Output format

```
TEMPLATE QA — <niche>

Layout:          PASS / FAIL
CTA:             PASS / FAIL
Footer:          PASS / FAIL
Screenshot:      PASS / FAIL
Maintainability: PASS / FAIL

OVERALL: READY / NEEDS FIXES / BLOCKED

Issues to fix:
- [issue 1]
- [issue 2]
```

## Handoff

- READY → template can be used for live leads; hand to `localreach-architect` if further features needed
- NEEDS FIXES → list specific fixes, re-run this skill after
- BLOCKED → escalate to human — do not use this template until resolved
