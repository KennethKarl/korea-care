# Kickoff RACI

**R** = Responsible (does the work) · **A** = Accountable (owns outcome) · **C** = Consulted · **I** = Informed

Updated 2026-04-21 to reflect the confirmed product scope (see `product-brief.md`): US team builds the Next.js web front; Korean team owns the Korean backend API and the extended admin; CS team handles add-on consultations.

## Teams

| Team | Scope | Contact lead |
|---|---|---|
| **US engineering** | Next.js web app, OAuth, i18n, pricing UI, booking form, CS-queue send path | Human PM (US) |
| **Korean engineering** | Korean API contract for US service (hospital list/detail/booking), Korean admin US-field extensions (enterprise-code approval, deposit config, cancel policy, CS add-on notes) | TBD (Korean team lead) |
| **Safedoc US CS** | Add-on consultation via Slack + admin notes, user follow-up | TBD (CS lead) |
| **Legal counsel** | HIPAA / TX HB 300 / CCPA / PIPA posture sign-off; BAAs if required; privacy policy / ToS | TBD |
| **Partnerships** | Pilot hospital coordination for demo day | Human PM (US) |

## Workstream RACI

| Workstream | Human PM | US eng | Korean eng | CS team | Lead agent | Supporting agents |
|---|---|---|---|---|---|---|
| Product / planning | A | C | C | I | `planner` (R) | `architect` (C), `project-pm-orchestrator` (I) |
| Architecture | A | C | C | — | `architect` (R) | `security-reviewer` (C), `healthcare-reviewer` (C) |
| Korean API contract | A | C | **R** | — | `architect` (C) | — |
| Korean admin extension (US fields) | A | I | **R** | C | — | — |
| Frontend (Next.js web) | I | **R** | — | — | `typescript-reviewer` (C) | `performance-optimizer`, `e2e-runner`, `a11y-architect` |
| Auth (Google / Apple OAuth) | I | **R** | — | — | `security-reviewer` (C) | `typescript-reviewer` |
| i18n (EN/KO) | I | **R** | C | — | `typescript-reviewer` (C) | — |
| Pricing logic (tier + enterprise + coupon) | A | **R** | C | — | `architect` (C) | `tdd-guide` |
| Booking form + data capture | A | **R** | C | — | `security-reviewer` (C) | `healthcare-reviewer` (C for passport/PII) |
| Add-on → CS queue | I | **R** | C | C | — | — |
| CS add-on consult operation | I | — | — | **R** | — | — |
| Security + privacy posture | A | C | C | — | `healthcare-reviewer` (R) | `security-reviewer` (R), legal counsel (R) |
| Legal / HIPAA posture sign-off | A | — | — | — | legal counsel (R) | `healthcare-reviewer` (C) |
| DevOps / hosting / data residency | A | **R** | C | — | `architect` (C) | `security-reviewer` (C) |
| Pilot hospital coordination (demo) | **R**/A | I | C | I | — | — |
| Docs | I | C | C | I | `doc-updater` (R) | — |

## Phase 2 (post-2026-05-15, not in demo)

| Workstream | Human PM | US eng | Korean eng | Notes |
|---|---|---|---|---|
| Stripe payment | A | R | C | USD single currency |
| Refund/cancellation processing | A | R | C | Policy per hospital |
| Flutter Web app | A | R | — | After web is stable |

## Notes

- **Human PM is Accountable** for Product, Architecture, Korean-integration contracts, HIPAA/Legal, DevOps, and Pilot hospital coordination — regulatory + cross-team-critical domains.
- **Korean eng team is Responsible** for the Korean API contract and the admin extension. This is a **hard external dependency** (R-013, R-018 in risk register). Schedule dictates that Korean team engagement starts Sprint 0 day 1.
- **CS team is Responsible** for add-on consultation operation. They consume data the US eng team ships to the admin queue.
- **Legal counsel is Responsible** for posture sign-off. Without this, 5/15 demo cannot accept real user data. Texas LLC + Delaware C-corp structure is part of the analysis.
- **Agents review; do not commit** without explicit human instruction.
- **project-pm-orchestrator is Informed on every track**, Accountable for none. It synthesizes, does not decide.
