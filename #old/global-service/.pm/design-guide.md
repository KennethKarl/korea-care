# Design Guide — Safedoc Global Service
# 디자인 가이드 — Safedoc 글로벌 서비스

**Status:** v1 (2026-04-21) — pending design lead sign-off
**Owner:** Design + PM (see `.pm/raci.md`)
**Source of truth for:** design tokens, component patterns, typography, bilingual rules, accessibility targets, voice & tone.
**Not source of truth for:** product scope (`.pm/product-brief.md`), visualization brief for current PM deliverables (`.pm/design-brief.md`), legal posture (`.pm/legal/hipaa-position.md`).

---

## 0. How this guide was built

Synthesized from three parallel specialist agent runs on 2026-04-21:

1. **US healthcare-adjacent booking UX conventions** — Zocdoc, One Medical, Forward, Ro, Sidecar/Sesame, Medical Departures, Qunomedical, Headway, Oscar, Medjet.
2. **WCAG 2.2 AA + ADA Title III + TX HB 300 + California Unruh + KWCAG design-system punch-list.**
3. **Korean SafeDoc brand palette → US-market token derivation (color-theory re-tune).**

Input artifacts: `SAFEDOC_Brand_Color_Guideline(241105).jpg`, `.pm/product-brief.md`, `.pm/design-brief.md`, `.pm/risk-register.md`, `.pm/korean-data-mapping.md`.

Agent dispatch logged in this file's change log.

---

## 0a. v2 design direction (2026-05-12) — RealSelf-inspired trust platform

> **Status:** active as of 2026-05-12. Supersedes §1 (where it conflicts), §2 (SAFE BLUE allowed surfaces — narrower), §3 (palette emphasis), §6 (extended with v2 cards), §7.3 (photography rules — before/after now allowed under consent), §11.3 (never-show list — pruned), §14 (ban list — pruned + extended). The v1 accessibility math (contrast ratios, focus rules, target-size rules, bilingual rules) is **preserved without change** — every v2 token below still passes WCAG 2.2 AA.
>
> **Reference, not template:** RealSelf is a *structural* reference for procedure-first discovery, review and before/after content hierarchy, educational article-driven conversion, and monochrome card-driven UX. We do **not** copy RealSelf brand, tone, illustrations, photography, or layout. We do **not** adopt cosmetic-surgery-marketplace voice. The destination is a credible US consumer healthcare discovery platform — calm, evidence-driven, photo-honest, review-driven — that retains the SafeDoc differentiator (Korea-clinic matching + concierge + translation + booking + travel coordination + follow-up).

### 0a.1 Updated visual direction

**Palette pivot — monochrome trust.**

- **Canvas:** `#FFFFFF` pure white.
- **Ink:** `#0B0B0F` near-true black (`color.ink.v2`). Replaces `text.primary` on product surfaces. Replaces `interactive.primary.default` blue fill on primary CTAs.
- **Warm gray ramp (new):** `warm-gray.50–950`. Replaces the v1 cool-tinted `neutral.*` ramp on product surfaces. The cool `neutral.*` ramp survives in non-product surfaces (admin, status badges, charts, marketing back-compat).
- **SAFE BLUE `#1B59FA`:** retained as the brand anchor, but its product-surface footprint shrinks to: logo / wordmark, in-text link color (via `blue.700`), focus ring, language-switcher hover. **Removed** from selected-tab underline, selected-row fill, primary CTA fill, "selected card" border, brand-subtle backgrounds. Selected states are now black-on-white inversions, not blue.
- **LIME `#CDFF1C`** re-enters the UI in **one** narrow role: the "SafeDoc verified" check icon (16–20px) and the verification chip background tint (`lime.100 #F2FFC2`, used at ≤2% screen area). **Banned** everywhere else: never on a button, link, focus ring, status, chart, or hero.
- **AQUA, PURPLE:** stay quarantined to illustration only (existing rule).
- **Gradients:** the Marketing Hero gradient (§7.4 A) is retained for landing-page hero only; the Quiet Hero gradient (§7.4 B) is **deprecated** on product surfaces. Replaced by flat `#FFFFFF` canvas with a hairline `border.subtle.v2` warm-gray divider.
- **Mesh / glassmorphism / glows:** banned on product surfaces (already implied by v1; reiterated here).
- **Per-specialty category colors:** removed. The v1 category-chip remap (§3.4) survives in admin and chart contexts. On product surfaces, all chips render in warm-gray-on-white with optional black-on-white "selected" inversion. The v1 chip pattern (`*.100` bg + `*.700` text + `.500` dot) is **off** for the consumer surface.

**Photography pivot — real, consented, time-stamped.**

- Hospital exterior + interior photography remains real and commissioned.
- **Before/after photography is reinstated** under strict authenticity rules — see §7.3 (rewritten) and §11.5 (new). Stock-photo clinicians and stock smiling-diverse-people remain banned.

**Illustration pivot — narrower role.**

- The heavy illustration system retreats to: empty states, 404/500, marketing hero, onboarding. Illustration disappears from procedure pages, review pages, before/after pages, provider pages, and guide pages — those surfaces are photo-led.

**Type pivot — preserved.**

- Typography from §4 is unchanged. Pretendard Variable + Inter fallback, 1.20 ratio, per-script line-height. The v2 surface uses the existing tokens; nothing about type changes.

### 0a.2 Updated UI principles

These extend / amend §1. Read both.

1. **Search first.** A persistent procedure-search bar lives in the global header on every page. The home page leads with a single full-width search input above the fold.
2. **Procedure-led discovery.** Discovery begins with a procedure (Rhinoplasty, Hair transplant, LASIK, Skin booster, etc.) — not a department, not a hospital. Hospitals/providers are surfaced as **matched outcomes** of a procedure query, not as the entry point.
3. **Reviews and before/after are first-class content.** Every procedure page, every provider page, and the home page surface real, verified reviews and before/after cases. Reviews require: author identity verification (account-bound), procedure tag, year-of-procedure, and a star rating with bucketed sub-ratings. Before/after requires: explicit signed consent, procedure tag, time-between-photos, age-band, and provider attribution. No consent → no publication.
4. **Education converts.** Long-form guides (procedure overviews, recovery, cost, traveling to Korea, aftercare) are a content vertical, not a footer link. Guides cross-link to procedures, providers, reviews, and the booking flow. Guides carry author bylines and last-reviewed dates.
5. **Concierge surfaces calmly and persistently.** A "How SafeDoc supports you" trust module (translation, booking, travel logistics, follow-up) appears on procedure detail and provider detail, plus the home page. It reads as reassurance, not upsell. No urgency framing.
6. **Trust over personality.** The product surface is restrained. Color comes from photography, not from chrome. Identity comes from logo, focus ring, and a single in-text link color. Brand neon stays a brand moment, not a UI moment.
7. **Anti-marketplace voice.** Even though we ship marketplace structure, the voice does not. No "Top doctors!" No "Best deal!" No "Limited spots!" No "Save 40%!" Pricing reads receipt-style (preserved from v1 §9.2). Provider language reads clinical-honest, not promotional.
8. **All v1 principles still apply.** Calm, spacious, high-contrast. Every sensitive-data ask is earned. WCAG 2.2 AA floor. Bilingual is first-class. No dark patterns.

### 0a.3 Recommended page hierarchy

```
/                              Home — search + featured procedures + featured reviews + featured cases + featured guides + concierge module
/procedures                    Procedure index — category browse + filter (price band, recovery, popularity)
/procedures/[slug]             Procedure detail — overview/cost/recovery/reviews/before-after/top providers/related guides
/reviews                       Reviews index — filter (procedure, provider, rating, verified, has-photo)
/reviews/[id]                  Review detail — full review + before/after gallery + provider link
/before-after                  Before/after gallery — filter (procedure, time-elapsed, age band, view angle)
/before-after/[caseId]         Case detail — full case study with consent + authenticity strip
/guides                        Guide index — category chips + featured + list
/guides/[slug]                 Guide article — long-form, internal links, in-line CTAs
/providers                     Provider directory — filter (city, specialty, accreditation, English-speaking)
/providers/[id]                Provider detail — profile / services / portfolio / reviews / team / location / concierge
/bookings/new                  Booking request flow — unchanged from v1 (5-step PII progressive disclosure, §9.1)
/bookings/[id]                 Booking status
/concierge                     Concierge support detail (translation, travel, follow-up)
/about                         About SafeDoc
/legal/*                       Privacy, terms, PIPA cross-border consent, accessibility statement
```

Existing v1 routes `/departments`, `/hospitals`, `/hospitals/[id]` continue to function in Sprint 0 / Sprint 1 booking flows; in v2 they become **secondary entry points** below the procedure-led front door. `/hospitals/[id]` and `/providers/[id]` resolve to the same data — pick the canonical route in S1 (recommend `/providers/[id]`) and 301-redirect the other.

### 0a.4 Component style rules

Implementation tokens below are additive — they layer on top of §3 v1 tokens.

**Warm-gray neutral ramp (new, v2):**

| Token | Hex | Replaces (on product surfaces) |
|---|---|---|
| `warm-gray.50` | `#FAFAF8` | `neutral.50` |
| `warm-gray.100` | `#F4F3EF` | `neutral.100` |
| `warm-gray.200` | `#E7E5DF` | `neutral.200` |
| `warm-gray.300` | `#D1CEC4` | `neutral.300` |
| `warm-gray.400` | `#A8A49A` | `neutral.400` |
| `warm-gray.500` | `#7A766C` | `neutral.500` |
| `warm-gray.600` | `#55524A` | `neutral.600` |
| `warm-gray.700` | `#3A3833` | `neutral.700` |
| `warm-gray.800` | `#232220` | `neutral.800` |
| `warm-gray.900` | `#141413` | `neutral.900` |
| `color.ink.v2` | `#0B0B0F` | `neutral.900` for ink-on-white surfaces |

Contrast (vs `#FFFFFF`): `warm-gray.500` 4.78:1 ✓ AA; `warm-gray.600` 7.36:1 ✓ AAA; `warm-gray.700` 11.4:1 ✓ AAA; `color.ink.v2` 19.4:1 ✓ AAA.

**v2 semantic remaps (light only — dark deferred):**

| v1 semantic | v2 binding |
|---|---|
| `surface.default` | `#FFFFFF` |
| `surface.raised` | `#FFFFFF` |
| `surface.sunken` | `warm-gray.50 #FAFAF8` |
| `surface.muted` | `warm-gray.100 #F4F3EF` |
| `surface.brand-subtle` | **deprecated on product surfaces** — was `blue.50`; v2 uses `warm-gray.100` for hover/active row fills |
| `border.subtle` | `warm-gray.200 #E7E5DF` (1.23:1 — decorative) |
| `border.default` | `warm-gray.300 #D1CEC4` (1.50:1 — paired with AA-contrast text) |
| `border.strong` | `warm-gray.500 #7A766C` (4.78:1 ✓) |
| `text.primary` | `color.ink.v2 #0B0B0F` |
| `text.secondary` | `warm-gray.700 #3A3833` (11.4:1 ✓ AAA) |
| `text.tertiary` | `warm-gray.600 #55524A` (7.36:1 ✓ AAA — promoted from v1's AA-only) |
| `text.link` | `blue.700 #0F359A` (10.29:1 ✓ AAA — unchanged) |
| `interactive.primary.default` | `color.ink.v2 #0B0B0F` fill / `#FFFFFF` label (19.4:1 ✓ AAA) |
| `interactive.primary.hover` | `warm-gray.800 #232220` fill |
| `interactive.primary.active` | `warm-gray.900 #141413` fill |
| `interactive.primary.disabled` | `warm-gray.200` fill / `warm-gray.500` label |
| `interactive.secondary` | `#FFFFFF` fill / `color.ink.v2` 1px border / `color.ink.v2` label |
| `focus.ring` | `blue.500 #1B59FA` 2px ring + 2px offset — **unchanged** |
| `verified.icon` | `lime.500 #CDFF1C` 20×20 check icon |
| `verified.chip` | `lime.100 #F2FFC2` bg + `warm-gray.800` text + `lime.500` 16×16 check icon |

**Card** (all variants — hospital, procedure, review, before/after, guide, provider):

- Fill: `#FFFFFF`.
- Border: 1px `border.subtle` (warm-gray.200). No shadow.
- Radius: `radius.md` (8px) default; `radius.lg` (12px) for hero/featured.
- Padding: `space.6` (24px) for normal density, `space.4` (16px) for compact lists.
- Hover: border deepens to `border.default` (warm-gray.300); no scale, no shadow.
- Selected: border swaps to `color.ink.v2` 2px; no blue, no fill change.

**Primary CTA:** black fill, white label, `radius.md`, no gradient, no glow. Heights from v1 §6.1 unchanged. Min-widths per-script unchanged.

**Secondary CTA:** white fill, 1px black border, black label.

**Tertiary / link CTA:** `text.link` underlined-on-hover; never blue button fill.

**Filter chip:** `radius.full`, 1px `border.default`, white fill, `text.primary` label. Selected: black fill, white label, no border. Counts (e.g., "Rhinoplasty 142") use `tabular-nums` and `text.tertiary` color.

**Specialty / category card:** white card, 1px hairline border, monochrome 24px Lucide icon, label, count. No per-category color. Hover deepens border only.

**Review card** (new):
- Header row: avatar (28px circle — initials if no photo) + display name + verified-account badge (lime check 16px) + star rating (5-star, filled black, unfilled `warm-gray.300`).
- Meta row: procedure tag (`text.caption`) · "Posted Mar 2026" · "Procedure date: Jan 2026" · "Treated at: [Provider]" (link).
- Body: `text.body-md`, truncate at ~4 lines with "Read more."
- Optional before/after thumbnail strip below (2–4 thumbnails, 64×64, `radius.sm`).
- Footer: helpful-count + "Was this helpful?" buttons (secondary style, not destructive).

**Before/after case card** (new):
- 2-up photo grid (left = before, right = after, equal sized, `radius.md`, no filter / no enhancement). Above the grid: small caption "Before · After" with `text.caption`.
- Meta row: procedure tag · "12 weeks post-op" · age band · view angle · provider attribution (link).
- Authenticity strip (bottom of card): tiny lock icon + "Patient consented · unretouched photo" — pulls a real attribute, not decorative copy.

**Provider card** (new — replaces v1 §6.3.1 hospital card on consumer surface):
- Photo: real exterior, 16:9, `radius.md`.
- Accreditation badges row (above the name): JCI / KAHF / Korean MoH registration number — neutral, never colored.
- Name: EN line + KO line under (`lang="ko"`).
- Meta lines: city / district · "English-speaking staff: Yes" · "Operating since 2005" · review count + average rating (e.g., "4.8 · 312 reviews").
- Price line: "Procedures from $X" (tier-adjusted).
- Primary CTA: "View provider." Secondary: "Save."

**Guide card** (new):
- 4:3 cover photo, `radius.md`.
- Category chip (warm-gray) above title.
- Title: `text.heading-sm` (EN headline; KO subtitle if both available).
- Meta: reading time · author byline · "Last reviewed Apr 2026."
- Lead sentence: 1 line `text.body-sm` `text.secondary`.

**Persistent concierge module** (new):
- Renders inside a single-column band, `surface.sunken` fill, no border, `radius.lg`, padding `space.10`.
- Layout: 4 columns at `bp.lg`, stacked at `bp.sm` — Translation / Booking & coordination / Travel & lodging / Follow-up support. Each column = 24px Lucide icon + heading + 2-line body.
- One secondary CTA: "Talk to a concierge." No primary-style emphasis (the concierge is a reassurance, not a conversion target).

### 0a.5 Content hierarchy per page

**Home (`/`):**

1. **Global header** — Logo · persistent procedure search · primary nav (Procedures · Before & After · Reviews · Guides · Concierge) · `EN | 한국어` switcher · "Sign in."
2. **Hero block** — H1 ("Find vetted Korean clinics by procedure"), sub-headline, full-width procedure search input with autocomplete. Three trust micro-lines under the search ("Verified reviews · Real before & after · Bilingual concierge").
3. **Top procedures grid** — 8 procedure tiles (Lucide icon · name · "From $X" · "n reviews"). Each tile links to `/procedures/[slug]`.
4. **Featured reviews** — 3 review cards (recent + verified + has photo). CTA: "See all reviews."
5. **Featured before/after** — 4–6 case thumbnails (with consent strip visible). CTA: "Browse before & after."
6. **Featured guide** — 1 large guide card + 3 secondary guide cards. CTA: "Read more guides."
7. **Concierge module** — see §0a.4.
8. **Trust footer band** — accreditation logos row (JCI, KAHF, Korean MoH) · "How we verify clinics" link · "Patient consent policy" link · "Translation & travel support" link.
9. **Footer.**

**Procedures index (`/procedures`):**

1. **Sub-header** with H1 "Browse procedures by category" + persistent search.
2. **Filter rail** (sticky on `bp.lg+`): Category · Average price band · Recovery time · Popularity.
3. **Category sections** — Facial · Body · Hair · Vision · Dental · Skin · Wellness · Other. Each section: H2 + procedure tile grid (4×n on desktop, 2×n on mobile).
4. **CTA module:** "Not sure which procedure fits you? Read our guides" (links to `/guides`).
5. **Concierge module** (collapsed variant — 2 lines + CTA).

**Procedure detail (`/procedures/[slug]`):**

1. **Breadcrumb** — Home › Procedures › Category › [Procedure].
2. **Hero strip** — H1 (procedure name EN + KO under) + 1-sentence summary + 4 key-facts pills (Avg cost · Avg recovery · Avg sessions · Risk level — all neutral chips). No hero photo on this page (reads cosmetic-marketing); instead a small Lucide procedural illustration.
3. **Anchor nav** (sticky): Overview · Cost · Recovery · Reviews · Before & After · Top providers · Related guides.
4. **Overview** — 200–400 word neutral overview. No marketing voice. Sourced from `/guides/[procedure-overview]` and cross-linked.
5. **Cost** — receipt-style breakdown for the typical case · note: "Your tier price appears when you sign in" · CTA: "See my tier price" (if not logged in).
6. **Recovery** — typical timeline (week-by-week) · pre-op preparation · post-op care · cross-link to recovery guide.
7. **Reviews (procedure-scoped)** — filter sub-rail (rating · has-photo · verified · year) · review card list · "View all reviews for [procedure]."
8. **Before & After (procedure-scoped)** — consent + authenticity banner ABOVE the gallery · 6-tile grid · "View all cases for [procedure]."
9. **Top providers** — 3–5 provider cards · tier-adjusted prices · "View all providers offering [procedure]."
10. **Related guides** — 3–5 guide cards.
11. **Sticky bottom CTA bar** (desktop side rail, mobile bottom-fixed): "Get matched with a SafeDoc-verified clinic" → triggers concierge intake form / booking entry.
12. **Concierge module** — full variant.

**Reviews index (`/reviews`):**

1. **Header** — H1 "Real reviews from real patients" + sub-line ("Every review is account-verified and tied to a real treatment date").
2. **Filter rail** — Procedure · Provider · Rating · Verified-only · Has photo · Year.
3. **Sort dropdown** — Most recent (default) · Most helpful · Highest rated · Lowest rated.
4. **Review list** — full review cards (not truncated), one per row at `bp.lg`, two columns at `bp.xl`.
5. **Empty state** when filters return zero — "No reviews match these filters" · CTA "Reset filters."
6. **Pagination** (numbered, not infinite scroll — `prefers-reduced-motion` + a11y consideration).

**Before/After index (`/before-after`):**

1. **Consent + authenticity banner** (sticky top, `status.info-subtle` warm-gray variant, dismissible) — "All photos shown are real patient outcomes published with signed written consent. Photos are unretouched. Time elapsed and provider attribution are shown on every case."
2. **Filter rail** — Procedure · Provider · Time elapsed (1mo / 3mo / 6mo / 12mo+) · Age band · View angle · Ethnicity disclosure (optional, opt-in by the patient — never inferred).
3. **Grid** — 3 columns at `bp.lg`, 2 at `bp.md`, 1 at `bp.sm`. Each tile shows the 2-up photo grid + procedure tag + time-elapsed label + provider link.
4. **Pagination.**

**Guides index (`/guides`):**

1. **Hero guide** — large featured guide card (full-width on `bp.sm`, 2/3 width on `bp.lg`).
2. **Category chips** — Procedure overviews · Pre-op preparation · Recovery · Travel to Korea · Cost & financing · Insurance · Aftercare.
3. **Guide list grouped by category** — section H2 + 3–4 guide cards per section.
4. **Editorial trust block** — "Our editorial process · Authors · Last-reviewed policy" with link to the editorial standards page.
5. **Concierge module** (collapsed).

**Provider detail (`/providers/[id]`):**

1. **Hero strip** — exterior photo (16:9, full-width) · overlay: H1 (EN name + KO line) + city/district.
2. **At-a-glance bar** — accreditation badges · "English-speaking staff: Yes" · "Operating since 2005" · star rating + review count · save button.
3. **Anchor nav** (sticky): About · Services & Pricing · Before & After · Reviews · Team · Location · Concierge.
4. **About** — provider's introduce + notice (EN + KO fallback rule from `design-brief.md` §7.1). Attribution: "Profile sourced from Korean platform."
5. **Services & Pricing** — table of services (procedure · base price · tier-adjusted price · "Request consultation" inline CTA). Tier-adjusted prices follow `lib/pricing.ts` (`design-brief.md` §5).
6. **Before & After portfolio** — provider-specific gallery with consent strip above (same rules as `/before-after`).
7. **Reviews (provider-scoped)** — filter + sort + list (same component as `/reviews`).
8. **Team** — clinician cards (real photo · name · credential · languages spoken). Hidden when Korean API doesn't provide.
9. **Location** — map + nearest subway + transit time from major hotels and ICN/GMP airports + KST time zone label.
10. **Concierge module** — full variant.
11. **Sticky bottom CTA bar:** "Request consultation" (primary, black) + "Save provider" (secondary).

### 0a.6 What v2 supersedes / what survives

| v1 element | v2 status |
|---|---|
| §1 design principles | Survives; extended by §0a.2 |
| §2 SAFE BLUE allowed surfaces | **Tightened** — selected-tab underline, selected-row fill, brand-subtle backgrounds → removed; logo, focus ring, in-text link → preserved |
| §3.1 `neutral.*` ramp | **Demoted to non-product surfaces;** `warm-gray.*` is the product-surface ramp |
| §3.4 category chip US re-map | **Demoted to admin/charts;** consumer chips are warm-gray monochrome |
| §3.5 problematic pairings analysis | Survives — contrast math unchanged |
| §4 typography | Survives without change |
| §5 spacing / layout / radii / shadows | Survives; v2 prefers `elevation.0` (hairline border) over shadows on product surface |
| §6 components | Extended by §0a.4 (review card, before/after card, provider card, guide card, concierge module). v1 hospital card folded into provider card. |
| §7.1 icons (Lucide) | Survives |
| §7.2 illustration system | **Narrower role** — empty states / 404 / marketing only |
| §7.3 photography | **Rewritten** — before/after re-allowed under signed consent + authenticity rules (see updated §7.3 below) |
| §7.4 gradient system | Marketing Hero retained, Quiet Hero deprecated on product surfaces |
| §8 motion | Survives |
| §9 forms & sensitive-data patterns | Survives without change — booking flow PII progressive disclosure is the same |
| §10 bilingual patterns | Survives without change |
| §11 trust & content | **Extended** — see updated §11.3 and new §11.5 below; before/after no longer in never-show list |
| §12 accessibility | Survives — every v2 token passes WCAG 2.2 AA |
| §13 token export | Survives; add `warm-gray.*` and `color.ink.v2` exports |
| §14 ban list | **Pruned** — #15 (before/after photos) removed; #20 (LIME inside UI) softened to "LIME outside the narrow verified-check role"; medical-tourism framing remains banned |
| §15 open questions | D-04 (JCI/KAHF badge authorization), D-05 (photography commissioning), D-10 (PIPA banner copy) all carry over; add D-11 (before/after consent process owner), D-12 (review verification flow + moderation owner) |

### 0a.7 v2 additions to the open-questions list

| # | Priority | Question | Proposed next step |
|---|---|---|---|
| D-11 | P0 | Before/after publication consent flow — owner, retention, withdrawal | Legal + ops; standalone consent form per case; revocable; retention tied to consent record |
| D-12 | P0 | Review verification — account-bound identity, fake-review moderation, treatment-date attestation | Product + ops; pilot with provider-attested treatment dates before opening to free submission |
| D-13 | P1 | Editorial standards page for `/guides` — author bylines, medical reviewer policy, last-reviewed cadence | Content lead + legal; needed before any guide ships publicly |
| D-14 | P1 | Procedure catalog source of truth (Global CMS) — taxonomy, slugs, KO translations | Product + content; depends on Korean program/treatment master sync |
| D-15 | P2 | "Save" feature (bookmark providers / cases / guides) — anonymous vs auth-required | Product; recommend auth-required to avoid local-storage divergence |

---

## 1. Design principles

These are the tiebreakers when a specific decision is under debate. (v2 note: §0a.2 extends and in places overrides this list — read both.)

1. **Trust over vibrance.** The HQ brand is vibrant and K-app youthful. On the US product surface we dial that down. Brand presence is carried by one anchor (SAFE BLUE), not by every screen. **v2:** brand presence shrinks further — logo, focus ring, in-text link only. Selected states and brand-subtle backgrounds are now black-on-white, not blue.
2. **The product is a coordinator, not a provider.** No white-coat stock photography, no stethoscope iconography, no "clinical" pretense. SafeDoc introduces US residents to Korean hospitals — the hospital is the provider, the UI's job is to make that handshake feel legitimate.
3. **Calm, spacious, high-contrast.** Neutral-dominant canvas, generous whitespace, WCAG 2.2 AA floor.
4. **Bilingual is a first-class concern, not a translation overlay.** EN and KO have equal status in typography, layout, and motion. We design for the longer string, we size with `min-width`, we set line-height per-script.
5. **Every sensitive-data ask is earned.** Passport, DOB, and nationality are collected only after the user sees a hospital match. Each sensitive field carries an inline "why we need this" and a lock affordance.
6. **Accessibility is a contract, not a polish pass.** Tokens pass contrast math before they ship. Components use native semantics first, ARIA second. `prefers-reduced-motion` is respected without opt-in.
7. **Brand neons stay out of the UI.** AQUA, PURPLE, LIME live in illustration and marketing only. They never appear on a button, chip, form state, chart series, or focus ring inside the product.
8. **No dark patterns, ever.** No "N people viewing this hospital" scarcity. No countdown timers. No pre-checked marketing consent. No "urgent!" CTA framing. Cross-border medical trust is the brand — any manipulation erodes it permanently.

---

## 2. Brand anchor — role of SAFE BLUE

**SAFE BLUE `#1B59FA`** is the brand's single recognition anchor. It appears in every session, but it does not carry primary-CTA duty.

**v2 update (2026-05-12):** the allowed surface list below is tightened — "Selected tab underline" and "Hero headline accent (marketing)" are demoted to marketing-only. On product surfaces, selected tabs use a 2px `color.ink.v2` (near-black) underline, not blue. Brand illustration dominant shape is still SAFE BLUE in the illustration system but illustrations no longer appear on procedure / review / before-after / provider / guide pages (see §0a.1).

| Allowed surface for SAFE BLUE | Why |
|---|---|
| Logo mark and wordmark | Brand lockup |
| Hero headline accent (marketing pages only — v2) | Brand recognition |
| Focus ring | 4.49:1 vs white passes WCAG 1.4.11 (3:1 non-text) |
| In-text link color (via `blue.700`) | 10.29:1 ✓ AAA |
| 24px+ icon strokes (non-button — marketing pages only — v2) | Large-target contrast OK |
| Brand illustration dominant shape (illustration pages only — v2) | Illustration system |
| Selected tab underline | **v2: deprecated on product surfaces;** marketing-only |
| Marketing hero gradient first stop | See §7.4 |

| **NOT** for SAFE BLUE | Why |
|---|---|
| Primary CTA fill | 4.49:1 white-on-blue fails AA normal text by rounding margin — we use `blue.600 #1546C7` instead (6.71:1 ✓) |
| Body-text link color | Use `blue.700 #0F359A` for link text (10.3:1 ✓ AAA) |
| Data-surface backgrounds | Trust contexts need flat neutral |
| Any chart series fill (except as the primary data series) | Accessibility + semantic weight |

**Why we departed from the HQ guideline here:** the Korean palette treats SAFE BLUE as both brand and interactive color. In US healthcare-adjacent products, the de-facto pattern (One Medical, Forward, Oscar, Sidecar Health) is a darker/less-saturated interactive blue than the brand color, and a lighter/more-saturated blue reserved for brand touches. Our ramp supports both.

---

## 3. Color tokens

Two-tier: **primitives** (raw values, ramp-based) and **semantic tokens** (what components actually consume). Components must reference semantic tokens only.

**v2 note (2026-05-12):** the **product surface** (`/`, `/procedures`, `/reviews`, `/before-after`, `/guides`, `/providers`, `/bookings/*`) uses the warm-gray ramp + `color.ink.v2` defined in §0a.4 as its primary neutral palette and `color.ink.v2` as its primary CTA fill. The cool `neutral.*` ramp in §3.1 is retained for **non-product surfaces** (admin, internal tools, charts, status badges in `status.*`, and any legacy marketing pages not yet migrated). The two ramps must not mix on the same screen. LIME `#CDFF1C` (formerly quarantined in §3.1) is permitted on product surfaces in a single role: the "SafeDoc verified" check icon (16–20px) and the `lime.100 #F2FFC2` chip background tint. All other accent quarantines (AQUA, PURPLE) are unchanged.

### 3.1 Primitives

#### `color.blue.*` — re-sampled from SAFE BLUE ramp

| Token | Hex | Role |
|---|---|---|
| `color.blue.50` | `#EEF3FF` | Tint wash, selected-row fill |
| `color.blue.100` | `#D7E2FF` | Hover on blue-subtle surfaces |
| `color.blue.200` | `#B3C4FF` | Disabled primary |
| `color.blue.300` | `#7E9BFF` | Illustration mid, dark-mode link |
| `color.blue.400` | `#4B75FC` | Dark-mode primary CTA |
| `color.blue.500` | `#1B59FA` | **SAFE BLUE — brand anchor** |
| `color.blue.600` | `#1546C7` | **Light-mode primary CTA fill** |
| `color.blue.700` | `#0F359A` | Link text, CTA hover |
| `color.blue.800` | `#0A2570` | CTA active, deep surfaces |
| `color.blue.900` | `#061849` | Inverse surface accents |
| `color.blue.950` | `#020D26` | Near-black brand |

Note: the HQ guideline's supplied 20/30 steps were non-monotonic (20 lighter than 30). Re-sampled to a predictable tint/shade ramp anchored on `#1B59FA` at step 500.

#### `color.neutral.*` — re-sampled for AA at body sizes

| Token | Hex |
|---|---|
| `color.neutral.0` | `#FFFFFF` |
| `color.neutral.50` | `#F7F9FB` |
| `color.neutral.100` | `#F0F3F7` |
| `color.neutral.200` | `#E1E5EB` |
| `color.neutral.300` | `#CCD3DC` |
| `color.neutral.400` | `#A6B0BE` |
| `color.neutral.500` | `#7C8697` |
| `color.neutral.600` | `#55606F` |
| `color.neutral.700` | `#3A4454` |
| `color.neutral.800` | `#232C3A` |
| `color.neutral.900` | `#0F1520` |
| `color.neutral.950` | `#050912` |
| `color.ink` | `#000F2C` | **SAFE BLACK** — reserved for brand lockup contexts |

#### Semantic primitives (independent of brand — reassurance palette)

| Token | Hex | Used for |
|---|---|---|
| `color.green.100` | `#DFF5E7` | success subtle bg |
| `color.green.500` | `#1E8E5C` | success (border/icon) |
| `color.green.700` | `#0F5E3A` | success text on subtle bg |
| `color.amber.100` | `#FFF3D6` | warning subtle bg |
| `color.amber.500` | `#B4760C` | warning (border/icon), **burnt amber — not neon yellow** |
| `color.amber.700` | `#7A4F05` | warning text |
| `color.red.100` | `#FDE3E3` | error subtle bg |
| `color.red.500` | `#C8321F` | error — warm, not vermilion (never medical-red) |
| `color.red.700` | `#8B1E10` | error text |
| `color.teal.100` | `#DDF1F4` | info subtle bg |
| `color.teal.500` | `#10788C` | info — teal, replaces SAFE AQUA in UI |
| `color.teal.700` | `#09536A` | info text |

#### Quarantined brand accents — illustration/marketing only

| Token | Hex | Source brand name |
|---|---|---|
| `brand.accent.aqua` | `#2BE8FF` | SAFE AQUA |
| `brand.accent.purple` | `#4B15FA` | SAFE PURPLE |
| `brand.accent.lime` | `#CDFF1C` | SAFE LIME |
| `brand.accent.deep-blue` | `#0000C6` | SAFE DARK BLUE |

**These four tokens are banned from product UI.** Enforcement: lint rule in CSS-in-JS / Tailwind config flags any usage inside `apps/web/src/`. Allowed only under `apps/web/src/illustrations/`, marketing pages (`/marketing/*`), and hero components.

### 3.2 Semantic tokens — Light mode

#### Surfaces

| Token | → | Hex | Where |
|---|---|---|---|
| `surface.default` | `neutral.0` | `#FFFFFF` | Page canvas |
| `surface.raised` | `neutral.0` | `#FFFFFF` | Cards on sunken bg |
| `surface.sunken` | `neutral.50` | `#F7F9FB` | App bg behind raised cards |
| `surface.muted` | `neutral.100` | `#F0F3F7` | Input fill, sidebars |
| `surface.inverse` | `neutral.900` | `#0F1520` | Toasts, tooltips on light |
| `surface.brand-subtle` | `blue.50` | `#EEF3FF` | Selected row, active nav, subtle brand moment |

#### Borders

| Token | Hex | vs `surface.default` |
|---|---|---|
| `border.subtle` | `#E1E5EB` | 1.20:1 (decorative grouping only) |
| `border.default` | `#CCD3DC` | 1.45:1 (inputs, card edges — paired with label contrast) |
| `border.strong` | `#7C8697` | 3.24:1 ✓ (secondary button outlines, emphasized form structure) |

#### Text

| Token | Hex | On `surface.default` | Use |
|---|---|---|---|
| `text.primary` | `#0F1520` | 18.82:1 ✓ AAA | Body, headings |
| `text.secondary` | `#3A4454` | 10.80:1 ✓ AAA | Supporting text, dense UI labels |
| `text.tertiary` | `#55606F` | 6.85:1 ✓ AA (not AAA body) | Metadata, helper text, timestamps |
| `text.disabled` | `#A6B0BE` | 2.40:1 — decorative only (WCAG 1.4.3 exemption) | Disabled states |
| `text.inverse` | `#FFFFFF` | — | On dark surfaces |
| `text.link` | `#0F359A` | 10.29:1 ✓ AAA | In-text links |
| `text.link-hover` | `#0A2570` | 14.10:1 ✓ AAA | Link hover |

#### Interactive — primary

| Token | Hex | White label contrast |
|---|---|---|
| `interactive.primary.default` | `#1546C7` (blue.600) | 6.71:1 ✓ AA |
| `interactive.primary.hover` | `#0F359A` (blue.700) | 10.29:1 ✓ AAA |
| `interactive.primary.active` | `#0A2570` (blue.800) | 14.10:1 ✓ AAA |
| `interactive.primary.disabled` | `#E1E5EB` (neutral.200) with `text.disabled` label | — |
| `interactive.primary.subtle` | `#EEF3FF` (blue.50) with `text.link` label | 9.85:1 ✓ AAA |

#### Interactive — secondary (outline button)

| Layer | Token |
|---|---|
| Fill | `surface.default` `#FFFFFF` |
| Border | `border.strong` `#7C8697` (3.24:1 ✓) |
| Label | `text.primary` `#0F1520` |
| Hover fill | `surface.muted` `#F0F3F7` |

#### Interactive — destructive

| Token | Hex | White label |
|---|---|---|
| `interactive.destructive.default` | `#C8321F` (red.500) | 5.36:1 ✓ AA |
| `interactive.destructive.hover` | `#8B1E10` (red.700) | 10.8:1 ✓ AAA |

Destructive is for irreversible actions only (delete booking, remove account). Cancel/dismiss is secondary, not destructive.

#### Focus

| Token | Hex | Notes |
|---|---|---|
| `focus.ring` | `#1B59FA` (SAFE BLUE) | 2px ring, 2px offset, 4.49:1 on white ✓ 1.4.11 |
| `focus.ring-inset` | inner `#FFFFFF` + outer `#1B59FA` | For dark/brand-filled controls |

**Rule:** focus ring must never be obscured by sticky header/footer (SC 2.4.11). Sticky elements must use `scroll-margin` to reveal focused controls.

#### Status (all 3:1 non-text, all subtle pairs 4.5:1+ for text)

| Token | Hex | On white | Pair with subtle |
|---|---|---|---|
| `status.success` | `#1E8E5C` | 4.02:1 (borders/icons) | Text `green.700` on `green.100` = 9.6:1 |
| `status.success-subtle` | `#DFF5E7` | — | — |
| `status.warning` | `#B4760C` | 4.44:1 | Text `amber.700` on `amber.100` = 8.1:1 |
| `status.warning-subtle` | `#FFF3D6` | — | — |
| `status.error` | `#C8321F` | 5.36:1 (text OK) | Text `red.700` on `red.100` = 9.2:1 |
| `status.error-subtle` | `#FDE3E3` | — | — |
| `status.info` | `#10788C` | 5.08:1 ✓ | Text `teal.700` on `teal.100` = 7.4:1 |
| `status.info-subtle` | `#DDF1F4` | — | — |

**Never convey status by color alone (SC 1.4.1).** Pair every status color with an icon and a text label.

#### Overlay

| Token | Value |
|---|---|
| `overlay.scrim` | `rgba(15, 21, 32, 0.56)` — modal backdrop |
| `overlay.scrim-light` | `rgba(15, 21, 32, 0.32)` — side-panel backdrop |

#### Chart palette (8-slot, colorblind-distinguishable)

| Token | Hex |
|---|---|
| `chart.1` | `#1546C7` |
| `chart.2` | `#10788C` |
| `chart.3` | `#1E8E5C` |
| `chart.4` | `#B4760C` |
| `chart.5` | `#C8321F` |
| `chart.6` | `#7E9BFF` |
| `chart.7` | `#55606F` |
| `chart.8` | `#0A2570` |

### 3.3 Semantic tokens — Dark mode (deferred to Phase 2)

Dark mode is **not required for launch**. Tokens defined now so components aren't re-architected later. If and when shipped, every contrast ratio above must hold in both themes.

Dark-mode anchor is **`neutral.950 #050912`**, not SAFE BLACK (too cool-saturated for full-screen reading; causes blue-cast eyestrain). SAFE BLACK is reserved for brand-lock surfaces (splash, auth landing).

| Semantic | Dark hex | Notes |
|---|---|---|
| `surface.default` | `#0F1520` (neutral.900) | Page canvas |
| `surface.raised` | `#232C3A` (neutral.800) | Elevation via lightness, not shadow |
| `surface.sunken` | `#050912` (neutral.950) | Behind raised cards |
| `surface.muted` | `#232C3A` | Inputs |
| `surface.brand-subtle` | `#0A2570` (blue.800) | Selected row |
| `border.default` | `#3A4454` | 3.32:1 ✓ |
| `border.strong` | `#7C8697` | |
| `text.primary` | `#F7F9FB` | 17.1:1 ✓ AAA |
| `text.secondary` | `#CCD3DC` | 11.3:1 ✓ AAA |
| `text.tertiary` | `#A6B0BE` | 7.45:1 ✓ AAA |
| `text.link` | `#7E9BFF` (blue.300) | 7.12:1 ✓ AAA |
| `interactive.primary.default` | `#4B75FC` (blue.400) | White label 4.66:1 ✓ AA; dark label 6.04:1 ✓ AA — **prefer dark label for clarity** |
| `interactive.destructive.default` | `#E66B5C` | White label 4.52:1 ✓ AA |
| `focus.ring` | `#7E9BFF` | 6.0:1 vs page ✓ |
| `overlay.scrim` | `rgba(0, 0, 0, 0.72)` | |

Critical dark-mode rule: **primary CTA shifts lighter** (`blue.400`, not `blue.600`). Low-luma blues disappear against dark surfaces.

### 3.4 Category chips — US market re-map

The HQ guideline includes six "contents colors" (C_BLUE, C_SKY BLUE, C_LIME, C_NAVY, C_YELLOW, C_ORANGE) for Korean content verticals. On the US product, some read wrong:

| HQ token | HQ hex | HQ meaning | US-remapped | Why |
|---|---|---|---|---|
| C_BLUE | `#0000CB` | general | `blue.600 #1546C7` | Aligned to primary ramp |
| C_SKY BLUE | `#30E5FF` | 의료정보닥 medical info | `teal.500 #10788C` | Teal reads clinical; aqua reads pool |
| C_LIME | `#88FF01` | 생활정보닥 lifestyle | `green.500 #1E8E5C` | Forest green = health; lime = energy drink |
| C_NAVY | `#000468` | deep category | `blue.800 #0A2570` | Aligned to ramp |
| C_YELLOW | `#FFF100` | 병원정보닥 hospital | **`purple.600 #5B3FB8`** (new token) | `#FFF100` reads caution/biohazard in US clinical contexts — DROPPED |
| C_ORANGE | `#FF9B39` | 기업복지닥 corporate benefits | `amber.500 #B4760C` | Desaturated; orange at `#FF9B39` reads "promo sale" |

Implementation pattern: every chip uses a `*.100` subtle bg + `*.700` deep text + optional `.500` dot indicator. Every chip passes 7:1+ text contrast.

**Example — Medical info chip:** bg `#DDF1F4`, text `#09536A`, dot `#10788C`.

### 3.5 Problematic pairings (reviewed and resolved)

1. **SAFE BLUE as primary CTA fill** — fails AA (4.49:1 for white text). Demoted to brand anchor. Primary CTA uses `blue.600 #1546C7` (6.71:1 ✓).
2. **`text.tertiary` at 6.85:1** — passes AA body, fails AAA body. Constrained to helper text, timestamps, metadata. Do not use for reading passages.
3. **Disabled primary with white label** — `blue.200 #B3C4FF` + white = 1.64:1. Solution: disabled primary uses `neutral.200` fill + `text.disabled` label; never keeps blue fill with white label.
4. **Border-default at 1.45:1** — decorative only. Any form field needs `border.strong` (3.24:1) on the focused/error state; `border.default` is acceptable only when a labeled input renders AA text contrast adjacent.

---

## 4. Typography

### 4.1 Font stack — Pretendard Variable + Inter fallback

```css
font-family: 'Pretendard Variable', Inter, -apple-system, BlinkMacSystemFont,
             'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif;
```

**Decision rationale** (compared against Source Sans 3 + Noto Sans KR, IBM Plex Sans + Plex Sans KR):

- Pretendard is SIL OFL licensed, variable (100–900), renders Latin competently as well as Hangul — so the single-font fallback is acceptable on slow connections.
- x-height parity with Inter at ~0.72em vs Inter's 0.73em → Latin and Hangul visually land at the same baseline inside inline runs.
- Widely used across Korean product design (Toss, Kakao, Naver's newer surfaces) — Korean users recognize it as "modern," not dated (unlike Nanum Gothic).
- Subset woff2 for core weights ≈ 180 KB total.

Alternates rejected: Plex Sans KR limited weight range; Noto Sans KR is huge (~380 KB per weight, non-variable).

**Serif display option (deferred):** a warm humanist serif (e.g., Newsreader, Source Serif 4) for long-form marketing headlines. Not shipped in Sprint 0 — adds asset weight and a pairing decision. If added, must have a Korean serif pair (Nanum Myeongjo or similar) with matched optical weight.

### 4.2 Type scale

Base 16px. Ratio 1.20 (minor third) — restrained, not dramatic. This is a booking product, not a fashion magazine.

| Token | Size (rem) | Size (px @16) | Line-height EN | Line-height KO | Weight | Use |
|---|---|---|---|---|---|---|
| `text.display-2xl` | 4.00 | 64 | 1.12 | 1.25 | 700 | Marketing hero only |
| `text.display-xl` | 3.00 | 48 | 1.15 | 1.28 | 700 | Landing H1 |
| `text.display-lg` | 2.25 | 36 | 1.20 | 1.32 | 600 | Section H2 |
| `text.heading-lg` | 1.75 | 28 | 1.25 | 1.40 | 600 | Card H3 |
| `text.heading-md` | 1.50 | 24 | 1.30 | 1.45 | 600 | H4, modal title |
| `text.heading-sm` | 1.25 | 20 | 1.35 | 1.50 | 600 | H5, compact card |
| `text.body-lg` | 1.125 | 18 | 1.50 | 1.65 | 400 | Lead paragraph |
| `text.body-md` | 1.00 | 16 | 1.50 | 1.65 | 400 | **Default body** |
| `text.body-sm` | 0.875 | 14 | 1.45 | 1.60 | 400 | Supporting text |
| `text.caption` | 0.75 | 12 | 1.35 | 1.55 | 500 | Metadata, labels |
| `text.overline` | 0.6875 | 11 | 1.20 | 1.35 | 600 (uppercase, letter-spacing 0.08em — EN only) | Section eyebrow |

**Per-script line-height rule:** `:lang(ko) { line-height: 1.65; }` body baseline is tighter for Latin (1.50) and looser for Hangul. Implement via CSS `:lang()` attribute selectors, not classname toggles — the pseudo-selector cascades down inline runs correctly for mixed-script paragraphs.

**Letter-spacing rule:** `letter-spacing: 0` for Hangul (tracking hurts Hangul readability). `letter-spacing: -0.01em` acceptable for Latin display sizes (32px+) only. `letter-spacing: 0.08em` + `text-transform: uppercase` only on the `text.overline` token, and only in `:lang(en)` context (uppercase Hangul is not a style; it's a bug).

**Tabular nums:** use `font-variant-numeric: tabular-nums` for prices, dates, times, phone numbers, passport numbers.

### 4.3 Weights

Pretendard Variable provides 100–900. Ship these:
- `300` Light — not used by default; reserved for marketing display if requested
- `400` Regular — body
- `500` Medium — UI labels, buttons at `text.body-sm`
- `600` Semibold — headings, CTA labels at `text.body-md`+
- `700` Bold — display headings only

**Do not ship 800/900.** Excess weight reads as Korean e-commerce.

### 4.4 Passport-field monospace

Passport numbers use `font-variant-numeric: tabular-nums` plus:

```css
font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, 'Consolas', monospace;
```

Only inside the passport input and in passport display surfaces (e.g., booking confirmation). Monospace signals "verbatim string" to the user and avoids ambiguity between I/l/1 and O/0.

---

## 5. Spacing, layout, and grid

### 5.1 Spacing scale (8px base, 4px half-step)

| Token | px |
|---|---|
| `space.0` | 0 |
| `space.1` | 4 |
| `space.2` | 8 |
| `space.3` | 12 |
| `space.4` | 16 |
| `space.5` | 20 |
| `space.6` | 24 |
| `space.8` | 32 |
| `space.10` | 40 |
| `space.12` | 48 |
| `space.16` | 64 |
| `space.20` | 80 |
| `space.24` | 96 |
| `space.32` | 128 |

Component internal padding rarely goes below `space.3` (12px). Vertical section rhythm on marketing pages: `space.20` (80px) mobile, `space.32` (128px) desktop.

### 5.2 Container widths

| Token | px | Use |
|---|---|---|
| `container.narrow` | 680 | Long-form reading (legal, article) |
| `container.default` | 1120 | Product pages (hospital list, detail, booking) |
| `container.wide` | 1280 | Marketing landing hero |
| `container.full` | 100% | Background layers only |

Gutters: `space.4` (16px) below 640px, `space.6` (24px) 640–1024px, `space.8` (32px) 1024px+.

### 5.3 Breakpoints

| Token | Min-width | Notes |
|---|---|---|
| `bp.sm` | 640px | Tablet portrait |
| `bp.md` | 768px | Tablet landscape |
| `bp.lg` | 1024px | Desktop |
| `bp.xl` | 1280px | Wide desktop |
| `bp.2xl` | 1536px | Reserved; not optimizing below 1536 |

Design system starts mobile-first. No separate mobile app, no separate mobile breakpoint app — the same components must render at 360px.

### 5.4 Radii

| Token | px | Use |
|---|---|---|
| `radius.none` | 0 | Table rows, dividers |
| `radius.sm` | 4 | Tooltips, inline chips |
| `radius.md` | 8 | **Default** — buttons, inputs, cards |
| `radius.lg` | 12 | Larger cards, modals |
| `radius.xl` | 16 | Hero cards, feature modules |
| `radius.2xl` | 24 | Marketing feature blocks |
| `radius.full` | 9999 | Avatars, round icon buttons |

No `radius.xs` (2px) — reads bureaucratic. No `radius.3xl`+ — reads consumer-app.

### 5.5 Elevation / shadows

Prefer borders over shadows on the product surface (clinical calm). Shadows reserved for overlays.

| Token | Value | Use |
|---|---|---|
| `elevation.0` | none | Flat cards on `surface.sunken` |
| `elevation.1` | `0 1px 2px rgba(15, 21, 32, 0.04), 0 1px 3px rgba(15, 21, 32, 0.04)` | Dropdown menus |
| `elevation.2` | `0 4px 6px rgba(15, 21, 32, 0.04), 0 2px 4px rgba(15, 21, 32, 0.06)` | Popovers |
| `elevation.3` | `0 10px 15px rgba(15, 21, 32, 0.08), 0 4px 6px rgba(15, 21, 32, 0.04)` | Modals |
| `elevation.4` | `0 20px 25px rgba(15, 21, 32, 0.10), 0 10px 10px rgba(15, 21, 32, 0.04)` | Drawers |

Dark mode: shadows become mostly invisible; use border + raised surface instead.

---

## 6. Components — patterns and tokens

Patterns, not component specs. Implementation lives in the component library; here we fix the token mapping and accessibility contract.

### 6.1 Button

Primary / secondary / ghost / destructive. Link button is a separate pattern.

| Size | Height | Padding-x | Label token | Min-width (EN) | Min-width (KO) |
|---|---|---|---|---|---|
| `sm` | 32 | `space.3` | `body-sm / 500` | 80px | 96px |
| `md` | 40 | `space.4` | `body-md / 600` | 96px | 120px |
| `lg` | 48 | `space.5` | `body-md / 600` | 112px | 144px |

Per SC 2.5.8 (target size): every button hits 24×24 CSS px minimum; `sm` at 32×min-width satisfies. Icon-only buttons must be min 40×40 and carry an `aria-label`.

**Min-width is larger in KO because short Korean labels (e.g., "예약", "확인") compress too narrow otherwise.** Never use `width: auto` / `min-content` on buttons — always a token-driven min-width.

States: default, hover, active, focus, focus-visible, disabled, loading. Loading state preserves label text with a leading spinner; never collapses to spinner-only (SC 2.2.1 — gives reader enough time to parse what was submitted).

**Banned:** gradient fills, glow shadows, scale-on-press > 1.02, exclamation marks in labels, "신청하기!" style.

### 6.2 Input (text, email, tel, number, password, passport)

Anatomy: visible `<label>` above, input, optional helper text below, optional error below helper. Never use placeholder as the label (SC 3.3.2).

| Layer | Default | Hover | Focus | Error | Disabled |
|---|---|---|---|---|---|
| Fill | `surface.muted` | `surface.muted` | `surface.default` | `status.error-subtle` | `surface.muted` |
| Border | `border.default` | `border.strong` | `blue.600` 2px | `status.error` 2px | `border.subtle` |
| Label color | `text.secondary` | — | `text.primary` | `text.primary` | `text.disabled` |
| Helper color | `text.tertiary` | — | — | `status.error` (`red.700`) | `text.disabled` |

Height: 40px (`md`) default; 48px (`lg`) for single-field sensitive moments (passport entry). Padding-x: `space.4` (16px). Border-radius: `radius.md` (8px).

**Required-field marking:** the word "Required" appears in the label text. `aria-required="true"` on the input. A red asterisk is supplementary only.

**Helper + error coexistence:** helper text uses `aria-describedby="...-helper"`. On error, add `"-error"` to the `aria-describedby` list and set `aria-invalid="true"`. The error message includes an icon + text — never color alone (SC 1.4.1).

**Date:** native `<input type="date">` with `min`/`max`. Fallback text input accepting `YYYY-MM-DD` format, with helper "Format: YYYY-MM-DD" — ISO 8601 is unambiguous in both EN and KO.

**Nationality:** combobox (ARIA 1.2 pattern), typeahead, no native select with 250 options. Values stored as ISO 3166-1 alpha-2 codes; display uses the country name in the current locale.

**Passport:** monospace font, `inputmode="text"`, `spellcheck="false"`, `autocapitalize="characters"`, `autocomplete="off"` (not in the spec, so we explicitly disable autofill). Must still allow paste (SC 3.3.8). Inline helper: "As shown on your passport" + lock icon + "Stored encrypted; visible only to the receiving Korean hospital."

### 6.3 Card

Four variants:

1. **Hospital card** (list item) — `surface.raised`, `radius.lg` (12px), `border.subtle`, padding `space.6` (24px). Contains: exterior photo (not stock, 16:9 max), hospital name + KO name, city/ward, tier-adjusted price range, 1-2 trust badges (JCI / KAHF / years operating), primary CTA "View hospital."
2. **Stat card** — `surface.raised`, prominent numeral in `text.display-lg`, label in `text.caption`, optional trend indicator with `status.success` / `status.error` icon + text (never color alone).
3. **Empty-state card** — `surface.muted`, centered illustration (see §7), heading + body + single CTA.
4. **Selected card** (e.g., choosing a service) — `surface.brand-subtle`, `border.default` swapped for `blue.600` at 2px.

### 6.4 Chip (category, filter, status)

Anatomy: dot indicator (8px) + label (`text.caption / 500`) + optional close affordance.

Uses the US-remapped category palette (§3.4). Every chip is `*.100` bg + `*.700` text + `.500` dot.

Interaction: filter chips are checkboxes under the hood (`role="checkbox"` + `aria-checked`). Do not use toggle buttons for multi-select — assistive tech expects the checkbox role.

### 6.5 Badge (trust signal)

For JCI, KAHF, Korean Ministry of Health registration, "SafeDoc verified," etc.

Structure: small badge icon + text label (`text.caption / 600`). Neutral tokens only — never colored. `surface.default` fill + `border.strong` border + `text.primary` label.

Placement: badge row appears **above the hospital name on every hospital card** — trust before identity. (Pattern from Medical Departures, Qunomedical.)

### 6.6 Modal / Dialog

`elevation.3` shadow, `surface.default` fill, `radius.lg`, `space.6` padding, `space.6` gap between sections, `overlay.scrim` backdrop.

Max width: 560px (confirmations), 720px (forms embedded), 960px (very rare, legal disclosure).

Focus is trapped inside the modal; first focusable element gets focus on open (or the close button if no actions); focus returns to the trigger on close.

Close affordances: (1) close icon button top-right, (2) backdrop click (only if the modal is dismissible), (3) Escape key (always). Non-dismissible modals (destructive confirm) disable (2) and require explicit button choice.

### 6.7 Toast / snackbar

Appears at the bottom on mobile, top-right on desktop. Max one at a time (subsequent queue). Auto-dismiss after 5s + ~50ms per character of content. Pausable on hover/focus (SC 2.2.1).

Variants: `status.success-subtle` / `status.warning-subtle` / `status.error-subtle` / `status.info-subtle`, each with corresponding icon + `text.primary` body.

**Never** show a critical error as a toast alone — critical errors go inline to the failing action AND in a toast for confirmation.

### 6.8 Tab / segmented control

Use tabs only when content sections are meaningfully different and the user expects to switch views (e.g., Hospital detail: "Services" / "Location" / "Reviews").

Anatomy: text label (`text.body-md / 500`), active state = `blue.500` 2px underline + `text.primary`, inactive = `text.secondary`.

Keyboard: ArrowLeft/ArrowRight move focus, Home/End jump to ends, Enter/Space activate (ARIA Authoring Practices tab pattern).

### 6.9 Banner (site-wide, page-level)

Top-of-page informational banner for cross-border compliance notices ("Your data may be transferred to Korea…", PIPA consent reminder). Full-width, `status.info-subtle` fill, text + dismiss button.

Never stacking. Never more than one banner visible at a time.

---

## 7. Iconography and illustration

### 7.1 Icons

Use **Lucide** (MIT licensed, 1000+ icons, consistent 2px stroke, `currentColor` fill).

- Sizes: 16 / 20 / 24 px. No sizes outside this set.
- Stroke width: 2px baseline. 1.5px for 16px size.
- Color: `currentColor` — inherits from parent text color. Never color-hardcode icons.
- Decorative icons: `aria-hidden="true"`.
- Functional icons (icon-only buttons): always `aria-label` with a full action label.

**Ban:** glyph fonts (FontAwesome-class), emoji as UI, illustrated icons (use illustrations for empty states, not as icons).

### 7.2 Illustration system

Four rules:

1. **One dominant brand blue (`blue.500` or `blue.600`) = ~60% of illustration area.**
2. **One neon accent per illustration** (pick one of AQUA, PURPLE, or LIME) at ≤15% area — highlights, rim lights, motion accents only. Never two neons in one illustration.
3. **Remaining = neutrals + white space.**
4. **Style: flat, geometric, minimal line work.** No skeuomorphism, no 3D renders, no gradient-heavy compositions. Illustrations should look like the same illustrator drew all of them.

Illustrations appear in: empty states, onboarding steps, marketing hero, 404/500 pages, confirmation screens. Never inside a card list, a form, or behind quantitative data.

**Never draw:** stethoscopes, white coats, hospital beds, IV drips, prescription bottles, blood, needles, anatomical hearts. SafeDoc is a coordinator, not a clinic. Draw: airplane silhouettes, passport + phone, city skylines (stylized), buildings, calendars, conversation bubbles.

### 7.3 Photography

- **Hospital exterior photos: real, not stock.** Commissioned per-hospital; 3:2 or 16:9; daylight preferred.
- **Hospital interior photos: real, lobbies / waiting areas / consult rooms.** Never operating-room or treatment-bed photos.
- **Clinician photos: if used, real, with name + credential + language they speak.** Never stock-photo clinicians (US users identify stock healthcare imagery instantly and it erodes trust).
- **Lifestyle / travel photos: Korea-specific and location-relevant** — Seoul / Busan / Incheon cityscapes, neighborhood context shots. Never generic "Asia" stock.
- **Before/after photos (v2, 2026-05-12):** allowed on `/before-after`, `/before-after/[caseId]`, `/procedures/[slug]` (gallery section, not hero), `/providers/[id]` (portfolio section), and `/reviews/[id]` when a review has attached case photos. **Required for every case:** signed consent record, procedure tag, time elapsed, provider attribution, unretouched original, authenticity strip rendered on the card. See §11.5 for the full rule set. Cases that don't meet every condition do not publish.
- **Avoid:** group-of-smiling-diverse-people corporate stock; over-staged "doctor with clipboard" imagery; marketing-style enhancement of before/after photos (filters, smoothing, virtual makeup, color correction beyond camera-raw white balance); before/after content above the fold on the home page or procedure landing.

### 7.4 Gradient system

Two approved gradients. No others.

**A — "Marketing Hero"** (landing hero card only)

```css
background: linear-gradient(
  135deg,
  #1B59FA 0%,      /* SAFE BLUE */
  #0F359A 55%,     /* blue.700 */
  #0000C6 100%     /* SAFE DARK BLUE */
);
```

White headline + white body copy passes 10:1+ across the gradient middle-to-end.

**B — "Quiet Hero"** (empty states, onboarding step backgrounds)

```css
background: linear-gradient(
  180deg,
  #EEF3FF 0%,      /* blue.50 */
  #FFFFFF 100%     /* surface.default */
);
```

Near-flat wash; body text legible everywhere.

**Banned:** any gradient using AQUA, PURPLE, or LIME stops. Any gradient on a button, card, nav, chip, header, footer, data surface, or form field. Any three-hue gradient outside the two above.

---

## 8. Motion

### 8.1 Durations

| Token | ms | Use |
|---|---|---|
| `motion.duration.instant` | 0 | Reduced-motion fallback |
| `motion.duration.quick` | 100 | Button press, hover color swap |
| `motion.duration.default` | 150 | Modal enter, toast enter, most state changes |
| `motion.duration.relaxed` | 250 | Drawer slide, tab transition |
| `motion.duration.slow` | 400 | Page-level transitions (rare) |

### 8.2 Easing

| Token | Curve |
|---|---|
| `motion.easing.standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` |
| `motion.easing.emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| `motion.easing.emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` |
| `motion.easing.linear` | `linear` — only for indeterminate progress |

### 8.3 Rules

- **`prefers-reduced-motion: reduce`** — all non-essential transitions become `0ms`; auto-carousels disabled; parallax disabled. No user opt-in required — respect the OS signal (SC 2.3.3).
- **No content flashes > 3 per second** (SC 2.3.1).
- **No auto-playing media** on product surfaces. Marketing can use autoplay **only** muted, paused at first, with captions loaded.
- **Page transitions: none by default.** Next.js App Router navigations are snap cuts. Avoid the "fade every page" reflex — it slows perceived performance and fights SPA semantics.
- **Toast durations are readable-length** — 5000ms + 50ms per character; pause on hover/focus; dismiss on Escape when focused (SC 2.2.1).

---

## 9. Forms and sensitive-data patterns

### 9.1 Progressive disclosure of passport and PII

From the UX research: never surface passport and DOB on the booking-intent form. The booking form on this product is longer than typical US consumer forms, so sequencing matters.

**Proposed sequence for booking a service:**

1. **Selection step** — department + hospital + service chosen; desired date range; contact email (pre-filled from OAuth). *No passport yet.*
2. **Trip logistics step** — Korea entry/exit date, add-ons (lodging/flights/tours checkboxes + free text). *No passport yet.*
3. **Identity step** (the first step that feels regulated) — name, nationality, DOB, phone. Inline banner: *"We share these with the Korean hospital so they can prepare your admission paperwork. Encrypted in transit and at rest."*
4. **Passport step** (standalone, one field) — passport number. Large 48px input with monospace. Inline helper explaining encryption + who sees it. Lock icon.
5. **Review & submit** — summary with line-item pricing (tier → enterprise discount? → coupon?), all entered values visible, one primary CTA "Submit request." SC 3.3.7 (Redundant Entry) — do not re-ask anything.

Save draft after each step (localStorage or session) so users don't lose progress on accidental refresh.

### 9.2 Pricing display

From UX research: **receipt-style breakdown**, not a magician's math trick.

```
Service base (Foreigner rate)           $2,400.00
Acme Corp enterprise discount (10%)      −$240.00
─────────────────────────────────────────────────
Total                                   $2,160.00
```

Rules:

- Always show the **before-discount** and **after-discount** numbers in full, never strike-through-alone (reads manipulative without context).
- If enterprise vs coupon conflict (non-stackable coupon + verified enterprise), show a radio group with both dollar amounts visible: "Choose your discount." Never auto-pick.
- Currency symbol always `$` with USD trailing only in legal / receipt contexts; never `$ 2,400 USD` inline (redundant on US surface).
- Tabular-nums on all monetary figures.
- "Self-declared citizenship" footnote appears under the first rendered price of a session, not every price — avoids warning-fatigue.

### 9.3 Consent language (bilingual)

- "Continue" or "I agree" + explicit summary of what you're agreeing to — never "By continuing you agree to…"-style ambient consent.
- Cross-border transfer consent (PIPA + CCPA + TX HB 300 overlap): separate checkbox, not pre-checked, text of disclosure visible without expanding.
- All legal consent surfaces must meet WCAG 2.2 AA — disclaimer text cannot be `text.disabled`-level gray.

### 9.4 Login / auth

Google + Apple OAuth only for the 5/15 demo. No email-password.

Buttons follow brand guidelines for Google (Google Identity Services) and Apple (Apple Sign-In). These are **exempt** from our button styling — they have their own provider-mandated designs. Place them stacked vertically, Google first on Android-heavy user segments, Apple first on iOS-heavy; for Korean-American segment, no strong default — we'll A/B in Phase 2.

Never use silhouette/colored "G" or "" icons of our own making — must be the exact provider-supplied assets.

Accessible Authentication (SC 3.3.8): providers already meet this via passkey/biometric.

---

## 10. Bilingual patterns (EN / KO)

### 10.1 Language attribute

- `<html lang="en">` by default; swap to `ko` when user picks Korean.
- Inline foreign phrases wrap in `<span lang="...">` — for example, an English paragraph quoting a hospital's Korean name.
- `<link rel="alternate" hreflang="ko" href="...">` paired with `x-default` for SEO and assistive tech.

### 10.2 Language switcher

- **Placement:** top-right of the global header, keyboard-reachable **before** main nav (Tab order: logo → switcher → nav → primary CTA).
- **Label:** `EN | 한국어` — ISO-like for EN, endonym for KO. **No flags** — flags represent nation-states (and Korean is spoken across two).
- **Announce switch:** `aria-live="polite"` announces the new language name in that language.
- **Persist:** first-party cookie + URL segment (`/en/`, `/ko/`). **Never auto-switch by IP.** Korean-Americans on Korean IP addresses will be mis-served and the behavior also risks California Unruh dignitary-harm arguments.

### 10.3 Fallback rule

When `name_i18n.en` is missing (see `design-brief.md` §7.1), render `name_i18n.ko` with a small "original Korean" badge (`status.info-subtle` chip) so the user knows the translation wasn't available.

### 10.4 Typography per-script

Already covered in §4 — enforce via `:lang(ko)` CSS selectors, not component props.

### 10.5 Button min-width

`min-width` tokens per-script (see §6.1 table). Ensures Korean short-labels don't collapse.

### 10.6 Numerals and dates

- Both scripts share Latin digits. Do not render Korean numerals.
- Date format: ISO 8601 (`YYYY-MM-DD`) for machine/form contexts. Human-facing dates follow locale — `Apr 23, 2026` (EN), `2026년 4월 23일` (KO).
- Time zone on scheduling: show the user's local zone + `KST (+09:00)` for the hospital context. Always both, always with explicit label.

### 10.7 Image-embedded Korean text

Flagged in `korean-data-mapping.md` Open Q9. Rule: **every hospital image containing embedded Korean text must have a parallel EN asset.** If EN asset is missing at render time, display original + "Korean signage (original)" caption below.

---

## 11. Trust, credibility, and content patterns

Based on the UX research, these are non-negotiable for cross-border healthcare credibility.

### 11.1 Trust signal stack per hospital card

In this order, top to bottom:

1. **Accreditation badges row:** JCI (if applicable), KAHF (Korea Accreditation of Healthcare Facilities), Korean Ministry of Health registration number. Small, neutral, never colored.
2. **Hospital exterior photo** (real, not stock).
3. **Hospital name — EN + KO small under, with `lang="ko"`** on the KO line.
4. **City + district** with a city-kind icon (not a pin-drop icon).
5. **"English-speaking staff: Yes / By request" line** — critical for US-foreigner trust.
6. **Years operating** if ≥ 10 years ("Since 2005").
7. **Tier-adjusted price range** — "From $X" format; user sees their tier applied, not the list price.
8. **Primary CTA: "View hospital"** — secondary CTA: "Save" (bookmark).

### 11.2 Hospital detail page

- Lead with a **photo gallery** (exterior, lobby, consulting room — not OR photos).
- Services list with prices — tier-adjusted from the page context.
- Location panel with map + nearest subway station + transit time from major hotels / airports.
- "Meet the team" (if provided by Korean API — Open Q from korean-data-mapping §6) — names, credentials, photos, languages spoken.
- Reviews surfaced only if Korean API provides star_rating + review_count (Open Q7 in design-brief.md §13). If yes → show star rating + review count + attribution ("Source: Korean platform"). If no → hide the section entirely; do not show "No reviews yet" as that creates the wrong anchor.

### 11.3 What we never show

- Countdown timers / urgency pressure.
- "N people viewing this hospital" counters (fake or real).
- "Limited spots!" framing.
- Clinician photos with stock-photo appearance.
- White-coat / stethoscope / hospital-bed stock imagery.
- "Medical tourism" framing — we are "elective care booking" or "Korean care planning."
- Before/after photos **without** a signed consent record, time-elapsed label, provider attribution, and authenticity strip. (Before/after photography that meets those four conditions is allowed in v2 — see §0a.1 and the new §11.5.)
- Marketing-style enhancement of before/after photos (filters, retouching, virtual makeup, smoothing). Unretouched only.

### 11.5 Before/after content rules (v2, added 2026-05-12)

Before/after photography is reinstated for v2 only under the following non-negotiable controls. If any one is missing for a given case, that case does not publish.

1. **Signed written consent record** per case, stored separately from the image asset, with an audit trail. Patient may revoke at any time; revocation triggers depublication within 24 hours.
2. **Procedure tag** (matches the Global CMS procedure taxonomy).
3. **Time elapsed** between the two photos, in concrete units ("8 weeks post-op", not "after"). Photos taken less than the procedure's typical settling time are flagged with an "Early result — final result may differ" note.
4. **Provider attribution** — every case links to a real provider; anonymous-provider before/after is not allowed.
5. **Unretouched original.** No filters, no smoothing, no virtual makeup, no color correction beyond camera-raw white balance. Both photos in a pair must be taken under matched lighting and angle conditions.
6. **Optional patient self-disclosure fields** (age band, ethnicity, prior procedures) are surfaced only when the patient explicitly enters them. Never inferred. Never required to publish.
7. **Authenticity strip** on every case card and detail page: lock icon + "Patient consented · unretouched photo · [time elapsed]" — populated from real attributes, never decorative.
8. **No before/after carousels with auto-advance.** Static grids only. (Aligns with §8.3 motion rules.)
9. **No before/after photos on the home page hero or above-the-fold on procedure landing** — they sit in dedicated gallery sections so users reach them with context, not as ambient content.

If a procedure's typical evidence model is non-photographic (e.g., LASIK outcome data, hair-density measurements), substitute outcome charts / numerical evidence with the same authenticity controls (data source, time elapsed, provider attribution).



### 11.4 Voice and tone

**Plain-spoken, calm, bilingual-parallel.** Never cheerful-clinical ("We're so excited to match you with your new smile!"). Never apologetic-bureaucratic ("Unfortunately, at this time…").

- **Tense:** present + future. Past only for logged events ("Your request was submitted on…").
- **Voice:** active. "The hospital will confirm within 48 hours" — not "Confirmation will be received."
- **Sensitive-data language:** specific, not euphemistic. "Your passport number is encrypted and visible only to the receiving Korean hospital," not "Your data is safe with us."
- **Pricing language:** exact numbers always. "From $2,160" never "Affordable rates."
- **Apology / error language:** take responsibility without melodrama. "Something went wrong on our side. Please try again — your form is saved." Not "Oops!" or "We apologize for the inconvenience."

### 11.5 Internationalization of voice

- EN voice: American-English, restrained register.
- KO voice: 존댓말 (formal -요 ending) for user-facing copy; do not use 반말.
- Neither voice should sound translated. Translations are rewritten for tone, not line-by-line.

---

## 12. Accessibility targets (WCAG 2.2 AA floor)

This section enumerates the Success Criteria that directly constrain design. Full technical checklist in the a11y subagent's punch-list (§0 source 2).

### 12.1 Non-negotiable rules

1. **WCAG 2.2 AA is the contractual floor.** Product cannot launch until full pass.
2. **Target size ≥ 24×24 CSS px** (SC 2.5.8). Exception: inline text links of 24px-spacing from siblings.
3. **Focus never obscured** (SC 2.4.11). Focus ring has `scroll-margin` so sticky headers/footers reveal focused controls.
4. **Focus always visible** (SC 2.4.7) — 2px outline, 3:1 adjacent-color contrast, never `outline: none` without replacement.
5. **No drag-only interactions** (SC 2.5.7) — every drag has a tap/click/keyboard alternative.
6. **Accessible authentication** (SC 3.3.8) — no cognitive puzzle CAPTCHAs; allow paste into all fields including password/OTP; support password managers and passkeys.
7. **Consistent help** (SC 3.2.6) — help/contact affordance in the same DOM position on every page.
8. **Redundant entry** (SC 3.3.7) — never re-ask data the user already entered in this session.

### 12.2 Contrast matrix (condensed — full in §3.2)

| Element | Min ratio | SC |
|---|---|---|
| Body text ≤ 18pt / 14pt bold | 4.5:1 | 1.4.3 |
| Large text ≥ 18pt / 14pt bold | 3:1 | 1.4.3 |
| UI components (form borders, icons, button outlines) | 3:1 | 1.4.11 |
| Focus ring adjacent colors (both sides) | 3:1 | 1.4.11 + 2.4.11 |
| Placeholder text | 4.5:1 | 1.4.3 |
| Status indicators (text) | 4.5:1 | 1.4.1 (+ icon — never color alone) |

### 12.3 Form a11y contract

Already in §6.2 and §9. Key rules: visible labels; errors as `role="alert"` on submit; autocomplete tokens where applicable; paste always allowed; passport monospace + `autocomplete="off"`.

### 12.4 Motion a11y

Already in §8.3 — respect `prefers-reduced-motion`, no flashes, no auto-play.

### 12.5 Regulatory risks to track

Flagged from the a11y research; belong to PM + legal:

1. **California Unruh + ADA Title III** — continued plaintiff-firm demand-letter volume in 2024–2026; bilingual sites without proper `lang` attributes are a common trigger. Budget for a third-party VPAT/ACR before launch. → `risk-register.md` open risk, add as **R-020** (design lead + legal to own).
2. **KWCAG 2.2** — parallel to WCAG 2.2 AA. Designing to WCAG 2.2 AA + the bilingual rules here gets us KWCAG-compliant at design level.
3. **Stripe Phase 2 + SC 3.3.8** — do not re-implement card entry. Use Stripe Elements (paste + password manager compliant). Verify focus-ring contrast in the iframe against our surface token.
4. **TX HB 300 consent screens** — must themselves meet WCAG 2.2 AA. Legal copy cannot be low-contrast gray.

---

## 13. Token export format (handoff)

Design tokens ship as both CSS custom properties and JSON (Style Dictionary compatible) so engineering, Figma, and Storybook can consume the same source of truth.

### 13.1 CSS custom properties (excerpt)

```css
:root {
  /* color primitives */
  --color-blue-500: #1B59FA;
  --color-blue-600: #1546C7;
  /* ... full set */

  /* semantic tokens */
  --surface-default: var(--color-neutral-0);
  --surface-raised: var(--color-neutral-0);
  --surface-sunken: var(--color-neutral-50);
  --surface-muted: var(--color-neutral-100);
  --surface-brand-subtle: var(--color-blue-50);

  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-700);
  --text-tertiary: var(--color-neutral-600);
  --text-link: var(--color-blue-700);

  --interactive-primary-default: var(--color-blue-600);
  --interactive-primary-hover: var(--color-blue-700);
  --interactive-primary-active: var(--color-blue-800);

  --focus-ring: var(--color-blue-500);

  /* ... */
}

[data-theme="dark"] {
  --surface-default: var(--color-neutral-900);
  --surface-raised: var(--color-neutral-800);
  --surface-sunken: var(--color-neutral-950);
  --text-primary: var(--color-neutral-50);
  --interactive-primary-default: var(--color-blue-400);
  /* ... */
}

/* per-script adjustments */
:lang(ko) {
  line-height: 1.65;
  letter-spacing: 0;
}
```

### 13.2 JSON (Style Dictionary)

```json
{
  "color": {
    "blue": {
      "500": { "value": "#1B59FA", "comment": "SAFE BLUE — brand anchor" },
      "600": { "value": "#1546C7", "comment": "Primary CTA (light)" }
    }
  },
  "surface": {
    "default": { "value": "{color.neutral.0}" }
  }
}
```

### 13.3 Tailwind v4 theme (reference shape — do not treat as authoritative until `package.json` locked)

```css
@theme {
  --color-brand-50: #EEF3FF;
  --color-brand-500: #1B59FA;
  --color-brand-600: #1546C7;
  --color-brand-700: #0F359A;
  /* ... */
  --font-sans: 'Pretendard Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

### 13.4 Figma library

Token set mirrors the CSS structure. Every color style is a semantic token — designers never pick primitives directly. File naming: `safedoc-global/tokens/light`, `safedoc-global/tokens/dark` (deferred), `safedoc-global/components`.

---

## 14. What to avoid — explicit ban list

These are the highest-leverage "don'ts" for this specific product. Pinned here because each one materially reduces trust with US users.

1. **Gradient-fill buttons.** All buttons are flat color.
2. **Glossy / glow effects** on controls.
3. **Scale-on-press > 1.02** on buttons.
4. **Exclamation marks in CTAs.** "Book now!" → "Book now."
5. **"Request received!" celebration pages with confetti.** Use a calm confirmation card + clear next steps.
6. **Countdown timers** on pricing or availability.
7. **"N people are viewing this hospital" live counters** (fake or real).
8. **"Limited spots!"** framing.
9. **Chatbot popups within 5 seconds of page load.** A "Chat" affordance is fine if present; auto-invite is not.
10. **Pre-checked marketing consent.** Illegal in CA (CCPA), and a trust killer everywhere.
11. **Auto-play video with audio.**
12. **Hero carousels** with auto-advance.
13. **Medical-red** as brand or primary accent.
14. **Stethoscope / white-coat / hospital-bed / IV-drip iconography.**
15. **Before/after photos without all four authenticity controls** (consent record + time elapsed + provider attribution + unretouched). Compliant before/after IS allowed in v2 — see §0a.1 and §11.5.
16. **Stock-photo clinicians.**
17. **Stock "diverse-group-of-smiling-people."**
18. **Flag icons** as language switchers.
19. **IP-based auto language switch.**
20. **Brand neons (AQUA / PURPLE) inside the UI.** Illustration-only. **LIME inside the UI outside the single verified-check role** (16–20px check icon + `lime.100` chip background only) — see §0a.1.
21. **HQ-style three-stop rainbow gradients.** One approved gradient recipe survives on product surfaces — Marketing Hero only. Quiet Hero (§7.4 B) is deprecated on product surfaces in v2.
22. **Placeholders used as labels.**
23. **Red asterisks alone for required fields.**
24. **`outline: none` without a visible replacement.**
25. **Text-only status signaling** (every status has icon + text + color).
26. **Translations that sound translated.** Rewrite for tone per-language.
27. **Per-specialty colored cards / chips on consumer surfaces.** v2 product surface is warm-gray monochrome. (§3.4 category palette survives in admin and chart contexts only.)
28. **"Top doctors!" / "Best deals!" / "Save 40%!" marketplace voice.** Voice is calm-clinical-honest. Pricing is receipt-style (§9.2).
29. **Department-led front door on the consumer product.** Discovery starts from procedure in v2. `/departments` survives as a secondary entry point for the booking flow only.
30. **Before/after content above the fold on the home or procedure landing.** Compliant gallery sections must sit below context — see §11.5 rule 9.

---

## 15. Open questions (needs owner)

| # | Priority | Question | Proposed next step |
|---|---|---|---|
| D-01 | P0 | Design lead sign-off on the SAFE-BLUE-to-blue.600 CTA swap | Review with HQ brand team; may need a note in the brand guide |
| D-02 | P0 | Pretendard Variable font license confirmation (SIL OFL covers commercial use ✓; self-host vs CDN) | Eng (`typescript-reviewer`) + legal confirm |
| D-03 | P1 | Serif display font (Newsreader vs defer) | Design; deferred for v1 launch |
| D-04 | P1 | JCI / KAHF badge authorization — can we display these marks? | Legal + HQ brand |
| D-05 | P1 | Photography commissioning plan — each hospital needs 3–5 exterior + interior shots | Ops + BD |
| D-06 | P1 | Hospital-info category chip color — confirm `purple.600` replacement for C_YELLOW reads right in KO | HQ brand review |
| D-07 | P2 | Dark-mode launch target | Defer to Phase 2 |
| D-08 | P2 | Illustration system production — 8–12 pieces needed for Sprint 0 launch | Commission illustrator or use open-source set |
| D-09 | P2 | VPAT / ACR third-party audit vendor + timeline | Legal + PM; target before demo day |
| D-10 | P1 | Banner copy for PIPA cross-border consent in EN + KO | Legal + content writer |

---

## 16. How this fits with other `.pm/` docs

| Doc | Relationship |
|---|---|
| `.pm/product-brief.md` | Upstream — product decisions drive design requirements |
| `.pm/design-brief.md` | Sibling — visualization brief for PM deliverables; links here for tokens |
| `.pm/korean-data-mapping.md` | Upstream — i18n fallback and image-asset rules derived from §7 and §11 there |
| `.pm/risk-register.md` | Sibling — design risks (R-020 accessibility budget) tracked there |
| `.pm/sprints/S0/plan.md` | Downstream — S0-06 (i18n scaffold), S0-07 (landing), S0-08 (hospital list), S0-09 (detail), S0-10 (booking form) implement against this guide |
| `.pm/legal/hipaa-position.md` | Sibling — legal constraints shape consent copy, contrast floor, language attribution |

---

## Change log

- **2026-04-21** — v1 initial guide. Synthesized from three parallel specialist-agent runs (US healthcare-adjacent UX conventions, WCAG 2.2 AA + ADA/HB300/Unruh/KWCAG compliance targets, Korean brand palette → US token re-derivation). Supersedes the rendering-hints paragraph in `.pm/design-brief.md` §14. Pending design-lead and HQ-brand sign-off on D-01, D-02, D-04, D-06, D-10.
