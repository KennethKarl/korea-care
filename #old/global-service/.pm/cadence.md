# Cadence & Rituals

## Sprint cadence

- **2-week sprints**, Monday start.
- **Scope freeze** at Day 7 (T-3 business days before sprint end). Any scope change after freeze requires human PM approval and a risk register entry.

## Recurring rituals

| Ritual | Frequency | Day / Time (PT) | Owner | Agent-run? |
|---|---|---|---|---|
| Async standup thread | Daily | 10:00 | `project-pm-orchestrator` | Yes (agent posts prompt, humans reply async) |
| Status digest | Daily | 17:00 | `project-pm-orchestrator` | Yes (uses `templates/status-daily.md`) |
| Sprint planning | Bi-weekly | Mon 09:00 | Human PM | Agent preps backlog + capacity |
| Sprint review | Bi-weekly | Fri 14:00 | Human PM | Human-only |
| Sprint retro | Bi-weekly | Fri 15:00 | Human PM | Human-only |
| Architecture sync | Weekly | Wed 11:00 | `architect` + engineering leads | Hybrid (agent preps, humans decide) |
| HIPAA review | Weekly | Thu 11:00 | `healthcare-reviewer` + human DPO | Human-owned decisions; agent preps findings |
| Risk review | Weekly | Fri 13:00 | `project-pm-orchestrator` | Yes (updates `risk-register.md`) |
| Vendor/BAA review | Monthly | 1st Wed | Human PM | Agent preps vendor register diff |

## Thread & artifact locations

- **Async threads**: one Slack channel per workstream (`#safedoc-global-<workstream>`), mirrored into `.pm/threads/<YYYY-MM-DD>-<topic>.md` by the PM agent for memory.
- **Status digests**: committed to `.pm/status/daily/<YYYY-MM-DD>.md` and `.pm/status/weekly/<YYYY-WW>.md`.
- **Sprint artifacts**: `.pm/sprints/S<N>/plan.md`, `retro.md`, `review.md`.

## Time-zone policy

- Team primary zone: US Pacific (PT).
- Global team members: rituals scheduled in PT; async standups give a 24-hour response window.
