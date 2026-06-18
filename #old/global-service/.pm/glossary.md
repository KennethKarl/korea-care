# Glossary

## Safedoc project terms

- **Safedoc Global Service** — the new US-launch product; global-ready architecture but US-only at v1 launch.
- **Clinical zone** — the network + storage scope that may contain PHI. Anything outside this zone is assumed PHI-free.
- **Record intake** — the pipeline that accepts patient-uploaded medical records (PDF/image/CCDA) and produces structured data.
- **Care timeline** — the chronological view of a patient's clinical events.
- **Provider messaging** — asynchronous, audit-logged channel between patient and clinician.
- **Consent-based sharing** — time-limited signed links that give a recipient scoped access to a patient's records.

## HIPAA / regulatory terms

- **PHI** — Protected Health Information. The 18 identifiers defined at 45 CFR 164.514(b)(2).
- **BAA** — Business Associate Agreement. Required by 45 CFR 164.308(b) / 164.314 for any vendor that creates, receives, maintains, or transmits PHI.
- **Security Rule** — 45 CFR 164.308–.312. Administrative, physical, and technical safeguards.
- **Privacy Rule** — 45 CFR 164.500 series. Permissible uses and disclosures.
- **Breach Notification Rule** — 45 CFR 164.400 series. 60-day notification window.
- **Break-glass** — emergency access procedure for a workforce member needing PHI access outside their normal role. Must be logged, alerted, auto-expiring.
- **De-identification** — Safe Harbor (45 CFR 164.514(b)(2)) or Expert Determination (164.514(b)(1)). Required before PHI can enter analytics/warehouse.
- **HITRUST** — common certification framework aligned with HIPAA; vendors claiming it are easier to audit.

## HIPAA Go/No-Go gate (12 items, all must be true before v1 production accepts PHI)

1. Risk analysis signed; Security Officer + Privacy Officer appointed
2. BAAs executed with every in-scope vendor; register current
3. MFA enforced for 100% of workforce with PHI access
4. Encryption at rest (KMS-CMK) + TLS 1.2+ in transit verified
5. Audit log pipeline live, immutable, 6-year retention provisioned
6. RLS verified on every PHI table via automated test
7. Break-glass procedure tested in staging with alerting
8. Incident response + breach notification runbook rehearsed
9. Penetration test completed; CRITICAL and HIGH remediated
10. PHI scrubbing verified in logs, errors, analytics (red-team dump test)
11. Workforce HIPAA training attested; sanction policy published
12. Data processing / de-identification boundary for analytics documented

## Engineering / stack terms

- **Monorepo** — single repository containing `apps/`, `services/`, `packages/`, `infra/`. Chosen tool: pnpm workspaces + Turborepo.
- **BFF** — Backend-for-Frontend. Next.js Route Handlers serve this role for the web app only (session, CSRF, server-side PHI redaction).
- **RLS** — Row-Level Security in PostgreSQL. Required on every PHI table.
- **CMK** — Customer Managed Key (AWS KMS). Required for PHI encryption.
- **Envelope encryption** — application-layer encryption of high-sensitivity columns using KMS data keys, in addition to Aurora at-rest encryption.
- **SMART-on-FHIR** — OAuth 2.0 profile for EHR integration. Post-MVP scope.

## Agent terms

- **ECC** — Everything Claude Code plugin. Source of many built-in agents.
- **PM agent** — `project-pm-orchestrator`. Owns cadence and routing.
- **Lead agent** — the primary agent assigned to a task (see `routing-table.md`).
- **Supporting agent** — parallel reviewer (typically `security-reviewer` or `healthcare-reviewer`).
