# Conventions

## Severity levels

| Level | Definition | SLA to triage | SLA to first response |
|---|---|---|---|
| **CRITICAL** | Launch-blocking, PHI-exposing, data-loss, active security incident | 15 min | 1 hour |
| **HIGH** | Sprint-blocking, regression in production, HIPAA-adjacent | 1 business hour | 1 business day |
| **MEDIUM** | Degraded UX or maintainability concern, not blocking | 1 business day | Next sprint planning |
| **LOW** | Nice-to-have, stylistic, comment | 1 week | Backlog |

**HIPAA override**: any PHI-adjacent signal is at least HIGH, most often CRITICAL, regardless of what the reporter labeled it.

## File naming

- ADRs: `docs/adr/NNNN-<slug>.md` (zero-padded, kebab-case slug)
- Sprint docs: `.pm/sprints/S<N>/<artifact>.md`
- Threads: `.pm/threads/<YYYY-MM-DD>-<topic>.md`
- Status: `.pm/status/daily/<YYYY-MM-DD>.md`, `.pm/status/weekly/<YYYY-WW>.md`
- Templates: `.pm/templates/<name>.md`

## Commit conventions

- Follow `<type>: <description>` conventional commits: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.
- Scope `.pm/` changes under `chore:` or `docs:` unless the change is a process update worth calling out.
- Never commit secrets, `.env*`, or `settings.local.json`.

## PR conventions

- Title mirrors the conventional commit type + subject.
- Body includes a Summary (1-3 bullets) and a Test Plan (checklist).
- HIPAA/security-touching PRs **require** parallel review from `healthcare-reviewer` and `security-reviewer` before merge.
- No `--no-verify`; no hook bypass.

## Status report fields (daily)

- Sprint + day + health color
- Shipped (since previous digest)
- In-flight (owner → one-line status)
- Blockers (severity | owner | ETA)
- HIPAA watch
- Risks delta (new | escalated | resolved)
- Next 24h

## Escalation SLAs

- CRITICAL to human PM: 15 minutes
- HIGH to human PM: 1 business hour
- Cross-workstream conflict: escalate after 1 business day with no resolution
