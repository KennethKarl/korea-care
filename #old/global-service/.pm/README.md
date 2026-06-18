# .pm — Project Management memory for Safedoc Global Service

This directory is the working memory for the `project-pm-orchestrator` agent. It is also human-readable so the team can audit how the PM agent reasons and routes.

## Contents

| File | Purpose |
|---|---|
| `agent-seed.md` | Persona prompt for the PM agent (mirrors `.claude/agents/project-pm-orchestrator.md`, version-controlled here for memory continuity) |
| `routing-table.md` | Full agent dispatch rules per task type |
| `raci.md` | Workstream ownership: human PM, engineers, and agents |
| `risk-register.md` | Live register of technical, regulatory, and launch risks |
| `cadence.md` | Sprint + ritual schedule |
| `glossary.md` | Safedoc and HIPAA terminology |
| `conventions.md` | File naming, severity levels, SLAs |
| `templates/status-daily.md` | Daily status digest template |
| `templates/status-weekly.md` | Weekly exec report template |
| `templates/sprint-plan.md` | Sprint planning doc template |

## How the PM agent uses this directory

On every invocation, the PM agent reads this directory before acting. Keep the content current — stale `.pm/` content produces stale decisions.

## Write access

- **PM agent** writes to all files under `.pm/`
- **Humans** edit any file here directly
- **Other agents** should not write here; if they need to record state, they hand it to the PM agent for incorporation
