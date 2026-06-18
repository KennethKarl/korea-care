# Risk Register

Live register. Update on every sprint-end, on any new finding, and on any escalation.

Severity: **CRITICAL** (launch/PHI-blocking) · **HIGH** (must fix pre-sprint-end) · **MEDIUM** (monitor) · **LOW** (log only)

Status: **open** · **mitigating** · **resolved** · **accepted**

---

## R-001 — HIPAA / state-privacy posture: legal sign-off + controls implementation
- **Severity:** HIGH (was CRITICAL; downgraded after research draft)
- **Status:** mitigating
- **Category:** regulatory
- **Owner:** Human PM + `healthcare-reviewer` + legal counsel
- **Mitigation:** Research draft complete in `.pm/legal/hipaa-position.md` (2026-04-21). Recommended posture: **Option C** — non-HIPAA consumer service + proactive Texas HB 300 + CCPA/CPRA-equivalent + Korean PIPA cross-border consent. Rationale: no US covered entity in the chain to create a BAA hook. Implementation plan: 10 engineering controls listed in the posture doc (TLS 1.2+, field-level encryption for passport/nationality, RBAC+MFA, append-only audit logs, retention + deletion, cross-border consent UI, breach playbook 72h, data minimization, log scrubbing, sub-processor register). Plus 10 legal/contractual items (privacy policy, ToS, US↔KR data transfer agreement, hospital data-handling addendum, HB 300 training, etc.). Plus Option D overlay — 7 open legal questions requiring US healthcare-privacy attorney + Korean PIPA specialist before launch.
- **Detection:** Legal counsel sign-off artifact on the posture doc; control-by-control checklist before 5/15; sub-processor register + data map filed; HB 300 training log.

## R-002 — [OUT OF SCOPE] LLM hallucination in clinical summaries
- **Severity:** N/A
- **Status:** accepted (out of scope)
- **Category:** —
- **Owner:** —
- **Mitigation:** Product is a booking platform, not a clinical system. No LLM clinical summarization in scope for v1. Entry retained for historical context from pre-interview assumption. See `product-brief.md` "Permanently out of scope".
- **Detection:** N/A.

## R-003 — [OUT OF SCOPE] OCR / CCDA extraction quality
- **Severity:** N/A
- **Status:** accepted (out of scope)
- **Category:** —
- **Owner:** —
- **Mitigation:** No medical record intake in v1 — users enter booking intent (department + travel dates), not clinical records. Entry retained from pre-interview assumption. See `product-brief.md`.
- **Detection:** N/A.

## R-004 — Team skill split across Next.js / Flutter / backend
- **Severity:** MEDIUM
- **Status:** open
- **Category:** execution
- **Owner:** Human PM
- **Mitigation:** One shared OpenAPI spec with codegen clients; weekly cross-stack pairing; Flutter Web pinned to a thin shell over the Next.js design system.
- **Detection:** Sprint-end retrospective blocker count; agent-dispatch log frequency.

## R-005 — Scope creep toward EHR integration
- **Severity:** MEDIUM
- **Status:** open
- **Category:** execution
- **Owner:** Human PM
- **Mitigation:** Written "deferred" list in kickoff plan; change-control through PM agent; ADR required for any move of deferred items into an active sprint.
- **Detection:** Sprint scope review vs original kickoff scope.

## R-006 — PHI leakage into logs, errors, or analytics
- **Severity:** CRITICAL
- **Status:** open
- **Category:** regulatory
- **Owner:** `security-reviewer` + `healthcare-reviewer`
- **Mitigation:** Structured logging with allowlist fields; PHI scrubber middleware at the logging boundary; Sentry `beforeSend` hook; ban `log.info(request.body)` via lint rule; third-party pixels banned behind auth wall.
- **Detection:** Red-team dump test pre-launch; periodic log sampling.

## R-007 — IDOR on medical records
- **Severity:** CRITICAL
- **Status:** open
- **Category:** application security
- **Owner:** `security-reviewer` + engineering
- **Mitigation:** Postgres RLS on every PHI table; org + consent checks at DB layer, not only at API; automated RLS test on every migration.
- **Detection:** RLS test suite; periodic penetration testing.

## R-008 — Credential stuffing against patient login
- **Severity:** HIGH
- **Status:** open
- **Category:** application security
- **Owner:** `security-reviewer`
- **Mitigation:** Cognito breached-password detection + adaptive MFA; rate limiting per IP and per username independently; Redis token bucket at API gateway.
- **Detection:** Failed-login monitoring; IP reputation alerts.

## R-009 — Supply chain compromise (npm / PyPI)
- **Severity:** HIGH
- **Status:** open
- **Category:** application security
- **Owner:** `security-reviewer`
- **Mitigation:** Snyk blocks HIGH+ CVEs; Dependabot auto-PRs; Syft SBOM per release; Gitleaks secret scanning.
- **Detection:** CI gate failures; SBOM diff per release.

## R-010 — SSRF via RSC or backend outbound
- **Severity:** HIGH
- **Status:** open
- **Category:** application security
- **Owner:** `security-reviewer`
- **Mitigation:** Strict allowlist for outbound URLs before fetch; Semgrep custom rule flagging `fetch(variable)` without allowlist check; IMDSv2 enforced on EC2/ECS.
- **Detection:** SAST findings; outbound-DNS monitoring.

## R-011 — PM agent single-point-of-routing failure
- **Severity:** MEDIUM
- **Status:** open
- **Category:** operations
- **Owner:** Human PM
- **Mitigation:** All routing rules and RACI are human-readable in `.pm/`; humans can dispatch manually if PM agent misroutes; quarterly review of routing-table efficacy.
- **Detection:** Weekly check on mis-routed tasks in retro.

## R-012 — Aggressive 2026-05-15 demo timeline (3.5 weeks)
- **Severity:** HIGH
- **Status:** open
- **Category:** execution
- **Owner:** Human PM
- **Mitigation:** Scope hard-cut already applied (no Stripe, no Flutter, no native apps). Sprint 0 demo scope documented in `product-brief.md` "Success criteria". Feature-freeze candidate at 2026-05-08 (7 days before demo). Any additional scope proposal rejected until post-demo. Daily standup + mid-sprint review at 2026-05-01.
- **Detection:** `planner` task burndown vs 2026-05-15. Any task slipping past 2026-05-08 escalates to human PM.

## R-013 — Korean API and Korean dev team as critical path
- **Severity:** HIGH
- **Status:** open
- **Category:** execution + architecture
- **Owner:** Human PM + `architect`
- **Mitigation:** Contract-first: `architect` drafts OpenAPI contract for the 3 endpoints needed for demo (hospital list, hospital detail, booking request create) in Sprint 0 week 1 and gets explicit Korean team sign-off before UI work committees. Mock server in dev against the contract so FE is not blocked by backend. Identify a single point-of-contact on the Korean team. Weekly sync cadence.
- **Detection:** Any blocker awaiting Korean team input > 2 business days escalates. Mock/real API divergence tracked in CI.

## R-014 — Self-declared Korean citizenship → price-tier fraud
- **Severity:** MEDIUM
- **Status:** open
- **Category:** fraud + regulatory
- **Owner:** Human PM + `security-reviewer`
- **Mitigation:** For v1 demo: self-declaration is accepted; ToS includes a representation-and-warranty clause; passport number collected at booking allows back-end audit (hospital can detect non-KR passport claiming KR rate). Post-demo: consider passport-document OCR or KYC vendor. Rate-switch monitoring: flag accounts that change declared citizenship.
- **Detection:** Hospital-side audit reports; any mismatched passport-vs-claim case logged and reviewed.

## R-015 — Texas HB 300 applicability broader than federal HIPAA
- **Severity:** HIGH
- **Status:** open
- **Category:** regulatory
- **Owner:** Human PM + `healthcare-reviewer` + legal counsel
- **Mitigation:** Operating entity (Texas LLC) triggers Texas Medical Records Privacy Act (HB 300) if the platform handles "protected health information" under the Texas-broader definition. `.pm/legal/hipaa-position.md` documents the analysis. Baseline controls: workforce training, breach notification runbook, encryption at rest + TLS 1.2+ in transit, access logs. Re-evaluate entity-of-operation with counsel — possible to route through Delaware parent or a separate entity.
- **Detection:** Legal review artifact; controls attestation before 5/15.

## R-016 — Passport number handling (strong PII)
- **Severity:** HIGH
- **Status:** open
- **Category:** application security
- **Owner:** `security-reviewer` + engineering
- **Mitigation:** Encrypt-at-rest with column-level encryption (KMS data keys) for passport_number. Never logged. Not returned in list APIs — only in the single-record booking detail authorized to owner or admin role. Access audit-logged. DB row-level security (RLS) on bookings table by user_id + admin role.
- **Detection:** RLS test suite on migrations; log-scan red-team test for passport patterns (9-char alnum).

## R-017 — Cross-border data transfer (US user data → Korean API → PIPA scope)
- **Severity:** MEDIUM
- **Status:** open
- **Category:** regulatory
- **Owner:** Human PM + legal counsel
- **Mitigation:** Data transfer minimized — only booking-request fields required by the hospital travel to Korea. US profile (OAuth sub, email, citizenship claim, enterprise code) stays in US-hosted store where possible. Data Processing Agreement between Texas LLC and Korean parent; PIPA cross-border transfer consent wording in sign-up flow. Posture detailed in `.pm/legal/hipaa-position.md`.
- **Detection:** Privacy policy audit before 5/15; DPIA-lite artifact.

## R-018 — Korean admin extension as hidden critical path
- **Severity:** HIGH
- **Status:** open
- **Category:** execution
- **Owner:** Human PM
- **Mitigation:** The existing Korean admin needs new US-specific fields before 5/15: enterprise-code approval UI, Safedoc deposit amount per-hospital, cancel-policy config, CS add-on note. Korean dev team must be engaged in Sprint 0 week 1 with a written list of required admin changes. This is a dependency outside the global-service repo and outside the US team's direct control.
- **Detection:** Weekly check-in with Korean team; admin change status tracked in `.pm/status/` daily.

## R-019 — Hospital-side demo readiness for 500 hospitals
- **Severity:** MEDIUM
- **Status:** open
- **Category:** execution + product
- **Owner:** Human PM + Safedoc partnerships
- **Mitigation:** Demo scope clarified: not all 500 hospitals need to be fully onboarded for demo — the demo demonstrates end-to-end booking with at least one hospital that actively confirms. Coordinate with 3–5 pilot hospitals who will participate in demo day confirmations. Remaining hospitals show as listings.
- **Detection:** Demo-day dry run at 2026-05-13 with pilot hospitals.
