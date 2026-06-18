# Sprint 0 Plan — 2026-04-22 → 2026-05-01

**Primary goal (one sentence)**: Ship a deployable Next.js skeleton with OAuth, i18n (EN/KO), and a Korean API contract (with mock server) in place, so Sprint 1 can swap in the real API and finish the 2026-05-15 demo.

**Sprint owner (human PM)**: US Human PM
**PM agent**: project-pm-orchestrator
**Product source of truth**: `../../product-brief.md`

## Sprint rhythm (special, overlaps 2026-05-15 demo)

- This is a **shortened foundation sprint** (Wed 2026-04-22 → Fri 2026-05-01 ≈ 8 working days) instead of the standard 10-day Monday-start sprint. The compressed cadence is due to the 2026-05-15 demo target.
- Sprint 1 follows: 2026-05-04 Mon → 2026-05-15 Fri (10 days, ends on demo day).
- Scope freeze for Sprint 1 at **2026-05-08** (R-012).

## Capacity

| Engineer / team | Workstream | Capacity (days) | Notes |
|---|---|---|---|
| US eng lead | Frontend / auth / integration | TBD | Must be staffed before 2026-04-23 |
| US eng (frontend) | UI pages + i18n | TBD |  |
| Korean eng | API contract + mock data + admin spec | TBD | Hard external dependency; see R-013, R-018 |
| Human PM | Scope, dispatch, legal, partnerships | 100% |  |
| `architect` agent | API contract review, monorepo shape | on-call |  |
| `healthcare-reviewer` + `security-reviewer` | HIPAA posture review | on-call |  |

**Risk:** Engineer slots are `TBD`. Not being staffed by 2026-04-23 is a Sprint 0 blocker and must be escalated.

## Committed items

| ID | Title | Workstream | Owner | Size | Exit criteria |
|---|---|---|---|---|---|
| S0-01 | Monorepo + Next.js app scaffold (App Router, TS, strict) | Frontend | US eng | M | `pnpm dev` boots; typecheck + lint green; `.gitignore`, `.env.example` in |
| S0-02 | CI + staging environment | DevOps | US eng | M | GitHub Actions runs lint/typecheck/test on PR; staging deploy pipeline (Vercel or equivalent) triggers on `main` |
| S0-03 | Korean API contract (OpenAPI) for hospital list / hospital detail / booking request create | Integration | `architect` + Korean eng | M | OpenAPI spec committed in repo; Korean team written sign-off; generated TS client in place |
| S0-04 | Mock Korean API server (from OpenAPI) | Integration | US eng | S | Prism / Mock Service Worker serving contract; wired in dev; 3 endpoints return realistic shapes |
| S0-05 | Google OAuth + Apple Sign-In integration (dev + staging) | Auth | US eng | M | End-to-end login from login page through OAuth callback returning an authenticated session in staging, for both providers |
| S0-06 | i18n scaffold (next-intl or equivalent) + language switcher | Frontend | US eng | S | EN + KO toggle works; strings routed through i18n; language persisted per user |
| S0-07 | Landing page with department selector | Frontend | US eng | S | Landing shows Safedoc branding, bilingual tagline, department pills; clicking a department routes to listings |
| S0-08 | Hospital list page (by department, via mock API) | Frontend | US eng | M | `/hospitals?department=X` renders list cards; filter/pagination if list > 20; loading and empty states |
| S0-09 | Hospital detail page (mock API) | Frontend | US eng | S | `/hospitals/[id]` renders detail; services list with tier-aware price placeholders |
| S0-10 | Booking form UI + field validation (no submit to backend yet) | Frontend | US eng | M | All required + optional fields per `product-brief.md` Data section; Zod schema; client-side validation; passport field masked and never logged |
| S0-11 | Pricing engine (unit-tested pure TS module) | Frontend | US eng | M | `display_price()` in `lib/pricing.ts`; unit tests cover (citizenship tier) × (enterprise discount applied/not) × (stackable/non-stackable coupon); 80% coverage |
| S0-12 | HIPAA / TX HB 300 / CCPA / PIPA posture doc v1 → legal review dispatched | Regulatory | Human PM + `healthcare-reviewer` + `security-reviewer` | L | `.pm/legal/hipaa-position.md` complete; legal counsel engaged and has the doc; BAAs/DPAs gap list produced |
| S0-13 | Korean admin US-field change request — delivered to Korean team | Coordination | Human PM | S | Written spec handed to Korean team: enterprise-code approval UI, Safedoc-side deposit amount, cancel-policy config, CS add-on notes; Korean team acknowledged receipt and target date |
| S0-14 | Risk register + weekly review cadence active | PM | `project-pm-orchestrator` | S | First weekly risk review held 2026-04-25; `.pm/risk-register.md` reflects Sprint 0 state |

## Stretch items (only if committed clears)

| ID | Title | Workstream | Owner | Size |
|---|---|---|---|---|
| S0-S1 | Booking status page (pending / confirmed mock states) | Frontend | US eng | S |
| S0-S2 | Sentry (or equivalent) wired with PII scrubber middleware | Observability | US eng | S |
| S0-S3 | Design system stub (tokens, 1-2 base components: Button, Card) | Frontend | US eng | S |

## Deferred (out of scope — log, do not pull in)

- Stripe integration (Phase 2)
- Flutter Web app (Phase 2)
- Native iOS / Android apps
- Real-time slot availability / calendar sync
- Refund / cancellation processing
- Document verification of citizenship
- Hospital self-serve portal (hospitals keep using the existing Korean admin)
- Kakao / Naver / email-password login
- Currencies other than USD
- In-app chat / video
- EHR integration, SMART-on-FHIR, OCR, LLM clinical summarization (permanently out of scope per `product-brief.md`)

## Dependencies & prerequisites

### Cross-team
- **Korean eng team** engagement by **2026-04-23**. Without this, S0-03 slips, which blocks Sprint 1. Escalate to human PM on day 1 if no contact.
- Korean team must produce at least one working mock response per endpoint so US team can integrate before contract final.

### External
- Google Cloud Console: OAuth client credentials for `dev.safedoc-global.*` and `staging.safedoc-global.*`.
- Apple Developer: Services ID + private key for Sign in with Apple.
- Legal counsel engagement (for S0-12). Start engagement conversation **day 1**.
- Domain / hosting decision — needed for CI env. Proposed: Vercel for demo; revisit in Phase 2.
- Pilot hospital coordination (Safedoc partnerships team) — for Sprint 1 demo day confirmation flow.

### Internal
- `product-brief.md` confirmed (done 2026-04-21).
- `raci.md` updated with Korean team + CS team + legal (done 2026-04-21).
- `routing-table.md` — PM agent uses to dispatch reviewers.

## HIPAA / security / privacy touchpoints in scope

- **Passport number field** — booking form includes it (S0-10). Design decision in this sprint: do NOT store in the booking form state beyond submit; on backend persistence, envelope-encrypt at column level. Never log.
- **PII logging rules** — field allowlist for the logger; `beforeSend` hook for Sentry; S0-S2 (stretch) operationalizes.
- **Citizenship self-declaration** — stored as an enum `KR | NON_KR` on the user profile, not a document artifact. R-014.
- **Cross-border data transfer** — US user profile hits Korean API for booking creation. Posture documented in S0-12 output. PIPA + CCPA cross-border consent language drafted for sign-up (legal counsel must sign off before any real user data).
- **Required reviewers (parallel):** `healthcare-reviewer` + `security-reviewer` on S0-10 (booking form) and S0-12 (posture doc).

## Exit gate for sprint end (2026-05-01)

- [ ] S0-01 … S0-14 all in `done` or explicitly carried-over-with-reason
- [ ] Next.js app deployable to staging; staging URL shareable with human PM
- [ ] OAuth (Google + Apple) working on staging for at least one test account each
- [ ] EN / KO i18n switcher demonstrably working
- [ ] Hospital list + detail + booking form UIs rendering against **mock** Korean API
- [ ] Pricing engine: 80%+ unit-test coverage
- [ ] Korean API OpenAPI spec signed off by Korean team lead; mock server live
- [ ] `.pm/legal/hipaa-position.md` delivered to legal counsel with explicit questions
- [ ] No CRITICAL findings open in risk register
- [ ] Sprint 1 backlog drafted in `.pm/sprints/S1/plan.md`
- [ ] Retro notes captured in `.pm/sprints/S0/retro.md`

## Sprint 1 preview (2026-05-04 → 2026-05-15 demo day)

Not committed yet. Indicative contents, subject to Sprint 0 retro:

- Replace mock Korean API with real endpoints
- Book submission E2E (user → Korean API → Korean admin → hospital confirms → user sees confirmation)
- Enterprise-code admin flow working (approval in Korean admin → price flips for user)
- Coupon selector + enterprise-discount conflict UI (R-011 pricing edge cases)
- Add-on request forwarded to Korean admin CS queue
- Pilot hospital coordination (3–5 pilots confirmed)
- Demo dry-run 2026-05-13
- Feature freeze 2026-05-08
- Demo 2026-05-15 Fri
