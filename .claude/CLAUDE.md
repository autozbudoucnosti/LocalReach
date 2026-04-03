# LocalReach — Project Memory (CLAUDE.md)

## What this project is

LocalReach generates realistic mockup websites for Czech local businesses (plumbers, dentists, trainers, etc.) and pairs each mockup with a personalised outreach email. The goal is to show a prospect what their website *could* look like and convert that into a paid build.

## Hard rules — always follow these

1. **Stay inside the repo structure.** Never create one-off implementations that live outside the established template and skill system.
2. **Prefer small diffs.** Make the minimal change that achieves the goal. Do not refactor unrelated code.
3. **Manual approval gate.** No outreach asset (mockup, email, brief) is sent, published, or auto-committed. Everything requires explicit human sign-off. Never call any email-send endpoint — draft only.
4. **Suppression list.** Before generating any outreach asset, check `data/suppressed.json`. Do not generate assets for suppressed leads.
6. **Czech by default.** All copy inside mockups and outreach emails is written in Czech unless told otherwise.
7. **Realism over prettiness.** A page that looks like a real local business is more valuable than a polished template. Favour realism signals.

## Repo structure (simplified)

```
/
├── .claude/
│   ├── CLAUDE.md          ← you are here
│   ├── skills/            ← reusable skill prompts
│   └── agents/            ← subagent definitions
├── templates/             ← niche HTML templates
│   └── <niche>/
│       ├── index.html
│       ├── style.css
│       └── brief.json
├── leads/                 ← one folder per prospect
│   └── <slug>/
│       ├── brief.json
│       ├── mockup.html
│       └── outreach.md
├── data/
│   ├── suppressed.json
│   └── niches.json
└── scripts/               ← build/screenshot helpers
```

## Pipeline sequence

Run steps in this order for every lead. Do not skip or reorder.

1. **`niche-brief-generator`** — produce `brief.json` for the lead
2. **`localreach-architect`** — confirm template choice, declare files to be touched
3. **Build** — fill template variables, render `mockup.html` into `/leads/<slug>/`
4. **`sales-mockup-critic`** — score the mockup, resolve any blockers
5. **`local-business-realism-check`** — second-pass realism score
6. **`template-qa`** — technical/layout/screenshot readiness
7. **`czech-outreach-copy`** — draft outreach email
8. **`outreach-asset-agent`** — package everything, set `status: ready-for-review`
9. **Human review** — approve and send manually

## Template variable schema

All templates use `{{double_brace}}` placeholders. Canonical variable names:

| Variable | Example value |
|---|---|
| `{{business_name}}` | Instalatérství Novák |
| `{{city}}` | Praha 6 |
| `{{phone}}` | +420 731 123 456 |
| `{{ico}}` | 12345678 |
| `{{dic}}` | CZ12345678 |
| `{{niche}}` | instalatér |
| `{{slug}}` | novak-instalater-praha6 |
| `{{service_area}}` | Praha 6, 7 a okolí |
| `{{years_in_business}}` | 14 |
| `{{primary_cta}}` | Zavolejte nyní |

Do not invent variable names outside this list. If a new variable is needed, add it here first.

## Skill invocation guide

| Situation | Skill to use |
|---|---|
| Adding a feature or route | `localreach-architect` |
| Reviewing a rendered mockup | `sales-mockup-critic` |
| Writing Czech outreach copy | `czech-outreach-copy` |
| Starting a new niche | `niche-brief-generator` |
| Final template QA | `template-qa` |
| Realism second-pass | `local-business-realism-check` |

## Subagent guide

| Agent | Scope |
|---|---|
| `ui-polish-agent` | Structure, spacing, hierarchy only — no strategy |
| `copy-realism-agent` | Headings, services, testimonials, trust signals |
| `repo-guard-agent` | Reviews proposed edits, blocks architecture drift |
| `outreach-asset-agent` | Packages final mockup + copy + rationale |

## MCP servers (active)

Start with only these three:
- **filesystem** — lead folders, briefs, generated assets
- **browser/screenshot** — rendered template QA
- **sheets/CRM** — lead status and niche metadata

Do not add further MCP servers without a concrete recurring need.

## Cost discipline

- Use skills to compress context before long tasks.
- Pass only the relevant brief/template into each agent — not the whole repo.
- Do not re-read files that have already been loaded in the current session.
