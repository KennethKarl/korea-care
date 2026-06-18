# Agent Routing Table

Route inbound tasks to the correct agent(s). Prefer parallel dispatch for independent domains.

## Lead-agent matrix

| Inbound task type | Lead agent | Supporting agents (parallel) |
|---|---|---|
| HIPAA / PHI / BAA / consent / audit log | `healthcare-reviewer` | `security-reviewer` |
| Auth, encryption, secrets, OWASP, CSP | `security-reviewer` | language reviewer (stack-specific) |
| Next.js perf / bundle / CWV / rendering | `performance-optimizer` | `typescript-reviewer` |
| New feature request | `planner` | `architect` (if cross-system) |
| Bug report | `tdd-guide` (reproduce + test) | language reviewer |
| Flutter Web responsiveness / widget issues | `flutter-reviewer` | `e2e-runner` |
| API contract design (OpenAPI) | `architect` | language reviewer(s) |
| DB schema change / migration | `database-reviewer` | `healthcare-reviewer` (if PHI touched) |
| SQL query perf | `database-reviewer` | `performance-optimizer` |
| Java/Spring code review | `java-reviewer` | `code-reviewer` |
| Python code review | `python-reviewer` | `code-reviewer` |
| TypeScript code review | `typescript-reviewer` | `code-reviewer` |
| Accessibility (a11y) | `a11y-architect` | `typescript-reviewer` |
| E2E / user flow | `e2e-runner` | frontend reviewer |
| SEO (marketing pages only — never auth'd surfaces) | `seo-specialist` | `typescript-reviewer` |
| Documentation drift | `doc-updater` | — |
| Build failure — Java | `java-build-resolver` | — |
| Build failure — Flutter/Dart | `dart-build-resolver` | — |
| Build failure — TypeScript/Node | `build-error-resolver` | — |
| Silent/swallowed errors | `silent-failure-hunter` | language reviewer |
| Dead code / cleanup | `refactor-cleaner` | language reviewer |
| Unclear / ambiguous request | `planner` | — (triage first) |

## Dispatch algorithm

1. Classify the request (triage rules in `conventions.md`).
2. Match to the lead-agent row above.
3. If the task touches PHI or auth, **always** add `healthcare-reviewer` and/or `security-reviewer` as a parallel reviewer — never as an afterthought.
4. Dispatch lead + supporting agents in parallel (one Agent tool call per agent in the same message).
5. Record the dispatch in `.pm/threads/<date>-<topic>.md` with: requester, timestamp, agents dispatched, expected outputs.
6. On agent return, synthesize and update `risk-register.md` if new risks surfaced.

## Parallel dispatch rules

- Independent work → parallel (same message, multiple Agent calls).
- Dependent work → sequential (wait for lead-agent output before dispatching supporter).
- HIPAA/security reviewers → **always parallel** with the domain reviewer; never delay safety review.

## When to escalate instead of dispatching

- HIPAA/PHI/BAA/consent keyword → escalate to human first, dispatch second.
- CRITICAL severity → escalate before dispatch.
- Launch-date risk > 2 days → escalate.
- No matching agent → ask human PM; do not guess.
