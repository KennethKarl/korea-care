# Product Brief — Safedoc Global Service

Single source of truth for what this product is, who it is for, and what it is not. All other `.pm/` documents (risk-register, sprints, raci) derive from this. Updated when product scope changes — not per sprint.

**Last updated**: 2026-04-21
**Owner**: Human PM + `project-pm-orchestrator`
**Status**: Confirmed via founding interview on 2026-04-21

---

## One-liner

A bilingual (EN/KO) web platform that lets US-resident users discover Safedoc-contracted **Korean hospitals** by medical department, see pricing tailored to their citizenship and corporate affiliation, and submit booking requests — with opt-in add-on services (lodging, flights, tours) handled by Safedoc CS.

Not an EHR. Not a telehealth service. Not a clinical record system. A **cross-border hospital booking platform** for elective medical travel to Korea.

---

## Target users

### Primary segments

1. **Western US residents** (US citizens, non-Korean) — shown **foreigner-tier pricing**.
2. **Korean-American residents with Korean citizenship** — shown **Korean-resident pricing** (domestic Korea hospital rates).
3. **Korean-American residents without Korean citizenship** — shown foreigner-tier pricing.

Citizenship is **self-declared at sign-up**. No document verification in v1.

### Account types

- **Individual** — self-paying user, standard pricing.
- **Enterprise-affiliated** — user enters an enterprise code at sign-up; Safedoc admin verifies and applies the enterprise's negotiated discount. One user → one enterprise. Offboarding is handled by the enterprise notifying Safedoc, then Safedoc admin revokes.

---

## Value proposition

- **For US users**: a trusted English+Korean interface to a curated network of Korean hospitals, with transparent pricing and a single coordinator (Safedoc) for booking + trip logistics.
- **For enterprises**: a channel to deliver subsidized elective care to employees as a benefit.
- **For Safedoc**: a US-market growth channel that reuses the existing Korean hospital contracts, DB, and admin tools.

---

## Scope

### In scope for 2026-05-15 demo

- Next.js responsive web (desktop + mobile browsers).
- EN / KO i18n via existing Korean DB translations.
- Google / Apple OAuth sign-in (no email-password).
- Citizenship self-declaration at sign-up → pricing-tier lock.
- Enterprise code entry at sign-up → manual admin verification flow.
- Hospital list (by department), hospital detail, booking request form.
- Booking flow: **request → hospital confirms → confirmed**. No real-time slot reservation.
- Pricing display: Korean-resident rate vs foreigner rate vs enterprise-discounted rate vs coupon-applied rate (coupon vs enterprise discount is user-selectable where they conflict).
- Add-on capture: checkbox + free text (hotel, flights, tours) → forwarded to Safedoc CS via admin.
- Booking status view for the user.
- HIPAA / Texas / CCPA / PIPA posture document in `.pm/legal/`.

### Explicitly out of scope for 2026-05-15 demo (moved to Phase 2)

- **Stripe payment integration.** Demo stops at "confirmed booking, payment instructions sent separately."
- Flutter Web app. Mobile users use the responsive web app.
- Native iOS / Android apps.
- In-app CS chat or video.
- Real-time slot availability or calendar sync.
- Refund / cancellation processing (policy displayed, but not enforced in code).
- Hospital self-serve portal (hospitals keep using the existing Korean admin).
- Document verification of citizenship claims.
- Medical record upload, diagnostic history, telehealth, clinical notes, provider messaging.
- Kakao / Naver login.
- Currencies other than USD.

### Permanently out of scope (at least through v1)

- EHR integration, SMART-on-FHIR, CCDA intake, OCR of medical documents, clinical decision support, LLM clinical summarization. This product does not touch medical record data.

> Note: prior `.pm/` drafts (e.g. `glossary.md`, `risk-register.md#R-002/R-003`) assumed an EHR scope. That assumption is wrong for this product. This brief overrides.

---

## Core user flows

### Flow 1 — Sign-up (first visit)
1. Land on EN/KO homepage (language auto-detect, manual override).
2. Browse hospitals without account.
3. Click "Book" or "See my rate" → prompted to sign in with Google or Apple.
4. After OAuth callback, one-time profile step: citizenship (KR / non-KR), optional enterprise code, contact email (pre-filled from OAuth).
5. Enterprise code, if entered, shows as "pending verification." User sees foreigner/KR rate meanwhile.

### Flow 2 — Browse & find
1. Home → department selector (e.g. Dermatology, Orthopedics, Ophthalmology).
2. Hospital list filtered by department. Each card shows: hospital name, location, rating (if provided by Korean API), price-range for the user's tier.
3. Hospital detail → services/treatments, pricing per service (tier-adjusted), booking button.

### Flow 3 — Book
1. On service selection, user fills booking form:
   - **Required**: name, phone, age, gender, desired department, desired date, passport number, nationality, email, Korea entry date, Korea exit date.
   - **Optional**: hotel/region, flight number, additional notes.
   - **Add-ons** (checkbox): lodging assist, flight assist, tour assist. Free-text notes.
2. Price summary shows: tier base → enterprise discount (if applicable) → coupon selector (if stacking disallowed, radio between enterprise discount and coupon).
3. Submit → booking saved as "pending hospital confirmation."
4. [5/15 demo stops here. In Phase 2: user proceeds to Stripe payment of deposit or full amount set by Safedoc admin.]

### Flow 4 — Hospital confirms (out-of-band for demo)
1. Hospital sees the pending request in the Korean Safedoc hospital admin (existing system).
2. Hospital accepts → request moves to "confirmed" state → user sees confirmation.
3. Hospital declines or proposes alternate date → user notified.

### Flow 5 — CS add-on consultation (out-of-band)
1. Bookings with add-ons appear in the Safedoc admin CS queue.
2. CS team uses the Slack channel to consult with the user via email / platform message.
3. Consultation notes logged in the admin against the booking.

---

## Pricing logic (v1)

```
display_price(service, user) =
  base_price(service, citizenship_tier)              // KR-resident or foreigner
  - enterprise_discount(user.enterprise, service.department)?  // if user has verified enterprise
  - coupon_discount(user.coupon)?                    // if user applied one
```

Constraints:
- Enterprise discount is a fixed percentage per (enterprise, department) pair.
- Coupons can be stackable or non-stackable.
- If a non-stackable coupon is selected and the user has an enterprise discount, the UI forces a choice (radio: enterprise vs coupon).
- Pricing displayed is what Safedoc charges the user; the hospital's list price is maintained in the Korean hospital admin.
- The **amount collected at booking time** (deposit vs full) is set per-hospital in the Safedoc admin. For the 5/15 demo, payment is skipped — the UI shows "payment instructions to follow."

---

## Data collected

### From OAuth provider
- Google / Apple sub, email, name, locale.

### User profile (at sign-up)
- Citizenship claim (KR / non-KR).
- Optional enterprise code.
- Preferred language (EN / KO).

### Per booking (all collected in one form)
- **Required**: name, phone, age, gender, desired department, desired date, **passport number**, nationality, email, Korea entry date, Korea exit date.
- **Optional**: hotel/region, flight number, free-text notes.
- **Add-ons**: checkbox flags + free text (lodging, flights, tours).

### Not collected
- Medical history, diagnoses, symptoms, prescriptions, test results, insurance information. The booking request is an **intent to consult a department**, not a clinical encounter.

### Why this matters (regulatory)
- Passport number is strong PII and a regulated identifier.
- Medical-department intent + contact info may qualify as health information under some state laws (TX HB 300, CCPA SPI) even if not PHI under federal HIPAA.
- Detailed posture in `.pm/legal/hipaa-position.md`.

---

## Backend integration

### Korean backend
- **Integration mode**: API client. Not a shared DB, not a read replica, not an initial copy.
- **Source of truth**: Korean DB (hospitals, departments, services, pricing, translations).
- **Direction**: pull for reads, push for booking requests / admin events (exact shape TBD — `architect` to define).
- **i18n**: EN/KO translations exist in the Korean DB for hospital names, department names, service names. New service consumes them via API.

### US-specific logic (lives in Safedoc global service only)
- Citizenship self-declaration and pricing-tier assignment.
- OAuth session and US user profile.
- Enterprise code entry at sign-up (verification happens in the Korean admin, extended with US fields).
- Add-on capture and forwarding to the CS queue.
- Display language and US-locale formatting.

### Admin
- **No new US admin.** The existing Korean admin is **extended** with US-specific fields (CS add-on notes, enterprise code approvals, Safedoc-side deposit amount, US-cancel policy) by the Korean dev team. This is a **hard dependency** on Korean team capacity.

---

## Platform & stack (5/15 demo)

- **Web**: Next.js (latest stable) with App Router + server components. Responsive; no separate mobile breakpoint app.
- **Auth**: Google OAuth + Apple Sign-In (Safedoc chooses between NextAuth / Clerk / custom in Sprint 0 — `architect` decision).
- **i18n**: next-intl or equivalent. EN + KO only.
- **Backend**: no new backend service for the demo — Next.js Route Handlers act as a BFF calling the Korean API.
- **Hosting**: TBD in Sprint 0. Texas-LLC operated; data residency / hosting region consequence goes into the HIPAA posture doc.
- **Observability**: logs + error tracking (Sentry or equivalent) with PII scrubbing on the field allowlist.

Stretch / Phase 2:
- Stripe integration (USD only at launch).
- Flutter Web app.
- Separate API gateway service (Spring or Python) — only if Korean API cannot cover US-specific orchestration needs.

---

## Team & dependencies

### Hard dependencies
- **Korean dev team** — owns the Korean API and the Korean admin. Owns: API contract for US service, admin field extensions for US workflows (CS notes, enterprise approvals, deposit config, cancel policy).
- **Safedoc US CS team** — consumes the Slack add-on consult flow. Needs admin access to the extended Korean admin.
- **Legal counsel** — required for HIPAA / TX HB 300 / CCPA / PIPA posture sign-off (see `.pm/legal/hipaa-position.md`).

### Soft dependencies
- Marketing / brand — for US landing content.
- Finance — for pricing display rules and USD rollout.

### Corporate structure (for legal posture)
- Delaware C-corp parent.
- 100%-owned Texas LLC likely operates the US-facing service.

---

## Timeline

- **2026-04-21** — Product brief confirmed (today).
- **2026-04-22 → 04-24** — Sprint 0 kickoff: architect + planner dispatched, Korean API contract drafted, HIPAA posture doc drafted.
- **2026-05-08** — Feature freeze candidate for demo.
- **2026-05-15** — **Demo launch**: E2E up to booking confirmation, no payment.

Aggressive schedule. Feature scope will get cut before the date slips. `risk-register.md#R-012` tracks this.

---

## Success criteria for 5/15 demo

A reviewer on demo day can:
1. Sign in with Google from a Korean-American user persona.
2. See Korean-resident pricing (because the user self-declared KR citizenship).
3. Enter an enterprise code at sign-up; see it flip to a discounted price after a Safedoc admin action in the Korean admin.
4. Find a real Korean hospital by department in both EN and KO.
5. Submit a booking request with all required fields.
6. See the booking in the admin; confirm it; user sees "confirmed" state.
7. Add-on request appears in the CS queue.

No payment. No refund. No native app.

---

## Open questions (tracked, not blocking brief)

- Korean API contract details (pull/push model, rate limits, latency, degrade strategy) — `architect` owns, needs Korean dev team interview.
- Hospital notification channel for booking requests (assumed to be the existing Korean admin) — confirm.
- US-specific legal posture — **draft complete** in `.pm/legal/hipaa-position.md` (2026-04-21). Recommended: Option C (non-HIPAA + TX HB 300 + CCPA/CPRA + PIPA). Awaiting US healthcare-privacy attorney + Korean PIPA specialist sign-off on 7 open legal questions (US-side covered-entity hooks, CMIA reach, reverse-flow PIPA consent, 50-state breach-notification matrix, entity-of-record decision between TX LLC and Delaware parent, minors/COPPA, marketing opt-in).
- Data residency for US user profile (US-hosted? Or accepted to flow to Korean DB?) — `architect` + legal; depends on entity-of-record decision.

---

## Change log

- 2026-04-21 — Initial brief written from founding interview. Supersedes the EHR-shaped assumptions in earlier `.pm/` drafts.
