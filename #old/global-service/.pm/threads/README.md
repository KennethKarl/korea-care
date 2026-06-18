# .pm/threads — Async thread mirror

Per `cadence.md`: the PM agent mirrors async workstream threads (Slack, email, GitHub issues) into this directory for memory continuity. Humans can also drop narrative notes here.

## File naming

Per `conventions.md:17`:

```
.pm/threads/<YYYY-MM-DD>-<topic>.md
```

Examples:

- `2026-04-24-korean-api-contract-kickoff.md`
- `2026-04-28-legal-counsel-engagement.md`
- `2026-05-02-sprint-0-retro-notes.md`

Topic is kebab-case; keep under ~50 chars.

## Content

Minimal frontmatter + narrative. Suggested fields:

```yaml
---
date: 2026-04-24
workstream: korean-api
participants: [us-eng-lead, korean-eng-lead, architect]
related: S0-03
severity: HIGH
---
```

Body: running notes, decisions, action items. Do not paste secrets, tokens, or PHI. Link to source (Slack permalink, email subject) when available.

## Escalation

If a thread contains any HIPAA / PHI-adjacent finding, the PM agent **must** flag it in `risk-register.md` and escalate to human PM per `project-pm-orchestrator.md` rules. Thread file alone is not sufficient tracking for regulated risks.

## Retention

Threads are kept for the life of the project. They are the source of truth for "how did this decision happen" audits.
