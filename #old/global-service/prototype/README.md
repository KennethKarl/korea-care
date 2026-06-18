# SafeDoc Global Service — Demo Prototype

Interactive, single-file UI/UX prototype for the SafeDoc Global Service CEO demo. Zero build step, zero dependencies to install — just open `demo.html` in any modern browser.

---

## Run it

### Option A — double-click

Open Finder, navigate to this folder, and double-click `demo.html`. It opens in your default browser via `file://`.

### Option B — one-line local server (recommended for screen sharing)

```bash
cd /Users/williamlee/global-service/prototype
python3 -m http.server 4321
# open http://localhost:4321/demo.html
```

Either way, no `npm install`, no build, no backend. The Pretendard font and Tailwind runtime load from public CDNs (jsdelivr / Tailwind Play) on first open — an internet connection is needed the first time the file is opened.

---

## What's wired

**Screens**

1. Landing (`#/`) — hero, trust strip, featured specialties, 3-step how-it-works, enterprise callout.
2. Departments (`#/departments`) — all 8 specialties with hospital counts.
3. Hospital list (`#/hospitals?dept=…`) — filtered by specialty, tier-adjusted pricing on each card.
4. Hospital detail (`#/hospital/:id`) — hero, tabs (Services / Overview / Reviews / Location), service-level pricing.
5. Sign-in interstitial (`#/signin`) — mocked Google / Apple buttons.
6. Onboarding (`#/onboarding`) — citizenship self-declaration + optional enterprise code.
7. Booking form (`#/book/:hospital/:service`) — patient, travel, add-on sections with live price summary.
8. Booking status (`#/booking/:id`) — WAITING → CONFIRMED with a "Simulate hospital confirmation" dev button.
9. My bookings (`#/bookings`) — list of submitted requests.

**Persona switcher** (bottom-right corner, always visible)

- `US individual` — Western US, US citizen → `FOREIGNER` rate.
- `Korean-American (KR citizen)` — dual citizen → `KR_RESIDENT` rate.
- `Enterprise-affiliated (ACME)` — KR citizen + verified ACME code → `KR_RESIDENT` + enterprise discount.

Switching personas live-updates pricing everywhere. If signed in, the header profile updates too.

**Language toggle** (header, segmented control) — EN / 한국어. Every user-facing string is bilingual, with Hangul-tuned line-height applied via `:lang(ko)`.

**Pricing engine** implements the `.pm/design-brief.md §5` decision tree:

```
display_price = base(tier) − enterprise_discount(dept)? − coupon?
```

- `SAFEDOC10` — 10% off, stackable with enterprise discount.
- `NEW200` — $200 off, **non-stackable** → triggers a user-visible radio choice (enterprise vs coupon).

**Reset demo state** link in the persona panel clears localStorage.

---

## Demo script (suggested 3-minute run-through)

1. Open `demo.html`. Note the Demo-mode ribbon at the top.
2. Open the **persona switcher** (bottom-right) and pick `US individual`. Point out the floating price card shows the `FOREIGNER` rate.
3. Switch to `Korean-American (KR citizen)`. Price drops to the `KR_RESIDENT` tier — same service, different tier, no sign-in required.
4. Switch to `Enterprise-affiliated (ACME)`. Price drops further — the enterprise discount stacks on the resident rate.
5. Toggle **한국어** in the header. Every string flips, including the Korean hospital names.
6. Click `Browse specialties` → `Dermatology` → pick `Samsung Medical Center` → open `Medical Laser Treatment`.
7. Click `Start booking`. You'll be routed through the mocked sign-in and onboarding (the ACME code pre-fills from the persona, with a "Simulate admin verification" button to show the pending → verified flip).
8. On the booking form, enter any data. Try the coupon input with `NEW200` while the enterprise persona is active to see the non-stackable conflict UI. Submit.
9. On the booking status screen, click **Simulate hospital confirmation**. Timeline advances WAITING → CONFIRMED.
10. Navigate back to `My bookings` to show the list.

---

## What's NOT wired (intentional, per `.pm/product-brief.md` §Scope)

- Real OAuth — sign-in is mocked to demonstrate the flow only.
- Real Korean API — all hospital / department / service / pricing data is hard-coded for the demo.
- Payment — Stripe is Phase 2. Booking flow stops at "confirmed, CS will follow up."
- Reviews tab and map — placeholders with explanatory copy, to be wired against real sources in production.
- Document verification for citizenship claims — v1 is self-declared per the product brief.
- Admin experience — out of scope; the Korean admin extension is the Korean team's delivery.

---

## Files

```
prototype/
├── demo.html   # the entire prototype (~1,080 lines, ~100 KB)
└── README.md   # this file
```

Everything — routes, components, mock data, EN/KO i18n, pricing engine, persona switcher, localStorage persistence — lives in `demo.html`. Splitting into a real Next.js app is Sprint-0 work per `.pm/sprints/S0/plan.md`; this prototype is not that skeleton.

---

## Resetting

If the demo gets into a weird state:

- Click `Reset demo` in the persona panel, **or**
- Open devtools → Application → Local Storage → delete the key `safedoc_demo_v1`.

---

## Sources

Design tokens and content derive from:

- `.pm/product-brief.md` — scope, user segments, pricing logic, data collected.
- `.pm/design-brief.md` — 6-screen inventory, 5-flow map, pricing decision tree.
- `.pm/design-guide.md` — color ramp (SAFE BLUE anchor, `blue.600` for primary CTA), Pretendard typography, 8 px spacing scale, WCAG 2.2 AA focus rings, bilingual line-height rules.
- Hospital names are publicly known Korean tertiary hospitals; all service details and prices are illustrative.
