# HIPAA & US Privacy Posture — Safedoc Global Service

> Status: Research draft for legal counsel review. Not legal advice.
> Author: Internal research (engineering). Date: 2026-04-21.
> Scope: 5/15/2026 demo launch (no payment integration); US-resident users booking treatment at Korean hospitals.

---

## TL;DR

- **HIPAA (federal) most likely does NOT apply** to Safedoc Global Service as designed. Safedoc is not a healthcare provider, health plan, or healthcare clearinghouse under 45 CFR 160.103, and the Korean hospitals are almost certainly not US HIPAA covered entities, so Safedoc cannot become a "business associate" of a US covered entity through them. [inference, based on the plain text of 45 CFR 160.103 and OCR guidance — confirm with counsel.]
- **Texas HB 300 (Tex. Health & Safety Code ch. 181) very likely DOES apply** if the Texas LLC operates the US-facing service, because Texas defines "covered entity" far more broadly than HIPAA — essentially anyone who "assembles, collects, analyzes, uses, evaluates, stores, or transmits" protected health information of a Texas resident, regardless of the entity's physical location.
- **CCPA/CPRA applies conditionally.** Safedoc is unlikely to meet the $26.625M revenue or 100,000-consumer thresholds at 5/15 demo. However, the data collected (passport number, citizenship, self-declared "health interest" via department selection) includes multiple categories that CPRA treats as Sensitive Personal Information (SPI), so a CCPA-compliant posture is prudent from day one and becomes mandatory before the thresholds are crossed.
- **South Korea PIPA applies to the outbound leg** (US user data → Korean API/hospital). PIPA treats health information and passport numbers as special categories; explicit, granular, separate opt-in consent is required before cross-border transfer. A consent flow, privacy notice, and written agreement with the Korean parent/hospitals are needed.
- **Recommended posture: Option C** — treat Safedoc as a **non-HIPAA consumer service** that still proactively applies (i) Texas HB 300, (ii) CCPA/CPRA-equivalent consumer rights, and (iii) Korean PIPA cross-border consent. Belt-and-suspenders controls recommended below. **Legal review is still required before launch** (Option D is overlaid on Option C for specific open questions identified at the end).

---

## Business model summary

Pulled from the product context for self-contained reference by counsel.

- **Entity structure**: Delaware C-corp parent; Texas LLC wholly owned subsidiary. The Texas LLC is expected to operate the US-facing service.
- **Users**: US residents (both US citizens and Korean nationals residing in the US, e.g. Korean Americans). Self-declared Korean citizenship toggles a pricing tier.
- **Service**: Responsive Next.js web app. Browse Korean hospitals, filter by department (e.g. "dermatology"), submit a booking request. Selected hospital confirms.
- **Data collected at booking**: full name, phone, age, gender, desired medical department, desired date, passport number, nationality, email, Korea entry date, Korea exit date. Optional: hotel/region, flight number.
- **Add-on services**: hotel / flight / tours collected as checkbox + free-text note. Handled by a Safedoc CS team over Slack manually. No medical content.
- **Backend**: new US service consumes an existing Korean Safedoc API operated by the Korean parent. Korean side maintains the hospital DB and its own admin UI.
- **Not stored by the US service**: no diagnoses, no clinical notes, no EHR data, no medical records, no lab values, no prescriptions, no imaging. Users choose a **department category**, not a diagnosis.
- **Payments**: Stripe, USD, Phase 2 only (post-demo).
- **Launch target**: 2026-05-15 demo. No native mobile apps at demo.

[inference] From the above, the US service is functionally a **lead-generation and booking concierge** — closer to a travel/referral agent than a healthcare provider. It does not bill health plans, does not conduct HIPAA standard transactions, does not operate as a clearinghouse, and does not deliver care.

---

## Analysis

### 1. HIPAA applicability

#### 1.1 What HIPAA actually covers

HIPAA's Privacy, Security, and Breach Notification Rules apply to "covered entities" and their "business associates." Both terms are defined in 45 CFR 160.103.

- **Covered entity** (45 CFR 160.103) means:
  1. a health plan,
  2. a healthcare clearinghouse, or
  3. a **healthcare provider who transmits any health information in electronic form in connection with a transaction covered by** the HIPAA Administrative Simplification subchapter (the "standard transactions" — claims, eligibility, enrollment, referral authorizations, remittance, etc.).
  Source: [eCFR 45 CFR 160.103](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103); [LII/Cornell 45 CFR 160.103](https://www.law.cornell.edu/cfr/text/45/160.103).
- **Business associate** (45 CFR 160.103) means a person who, on behalf of a covered entity (or an organized healthcare arrangement), "creates, receives, maintains, or transmits protected health information" for a regulated function or service.
  Source: [HHS.gov — Business Associates](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html).
- **Protected Health Information (PHI)** means individually identifiable health information transmitted or maintained in any form. "Individually identifiable health information" requires two things under §160.103: (i) it is health information (past/present/future physical or mental health condition, provision of care, or payment for care) AND (ii) it identifies the individual or could reasonably be used to identify them — and it must have been **"created or received by a health care provider, health plan, public health authority, employer, life insurer, school or university, or health care clearinghouse."** Source: [LII/Cornell 45 CFR 160.103](https://www.law.cornell.edu/cfr/text/45/160.103).

Key OCR framing: "If an entity does not meet the definition of a covered entity or business associate, it does not have to comply with the HIPAA Rules." Source: [HHS.gov — Covered Entities and Business Associates](https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html).

#### 1.2 Is Safedoc a covered entity?

Working through each prong:

- **Health plan**: No. Safedoc does not provide or pay for medical care, does not underwrite risk, and is not an insurer, HMO, Medicare/Medicaid program, or ERISA welfare plan.
- **Healthcare clearinghouse**: No. Safedoc does not process non-standard data into HIPAA standard transactions, and does not sit between providers and payers.
- **Healthcare provider who transmits standard transactions electronically**: No on both prongs.
  - Safedoc does not furnish healthcare. The Korean hospital provides the treatment; Safedoc is a discovery and booking intermediary.
  - Even if Safedoc were arguably a "provider of a service" (broad reading), it does not conduct any of the HIPAA-covered electronic transactions (claims, enrollment, eligibility, referral authorization with an insurer, remittance advice, etc.). The platform does not touch US health insurance.
  - OCR and CMS consistently emphasize that the trigger for "healthcare provider" status under HIPAA is the combination of (a) furnishing care and (b) using the standard electronic transactions. Cash-only operators that do not engage in standard transactions are not covered. Source: [CMS — Are You a Covered Entity?](https://www.cms.gov/priorities/key-initiatives/burden-reduction/administrative-simplification/hipaa/covered-entities); [HIPAA Journal — Covered Entities Under HIPAA (2026)](https://www.hipaajournal.com/covered-entities-under-hipaa/).

**Conclusion [inference]**: Safedoc is not a HIPAA covered entity under any of the three prongs.

#### 1.3 Is Safedoc a business associate?

A business associate relationship requires, on the other side of the contract, a US covered entity. The Korean hospitals on whose behalf Safedoc might arguably act are **not** US covered entities because:

- They are located in South Korea, they treat patients in Korea, they bill patients (or Korean insurers / foreign self-pay) in Korea, and they do not transmit HIPAA standard transactions into the US health-transaction ecosystem.
- HIPAA's BAA requirement is a US-law obligation of the US covered entity. It reaches foreign vendors only because a US covered entity pulls them into scope by retaining them. Source: [Paubox — Do foreign vendors have to sign a business associate agreement?](https://www.paubox.com/blog/do-foreign-vendors-have-to-sign-a-business-associate-agreement); [Compliancy Group — Is HIPAA International?](https://compliancy-group.com/is-hipaa-international/).
- There is no US covered entity in the Safedoc flow. Therefore there is no "on behalf of a covered entity" hook.

**Conclusion [inference]**: Safedoc is not a HIPAA business associate, because no US covered entity is on the other side of the transaction.

Edge case worth flagging to counsel: if any Safedoc-listed hospital turns out to have a US affiliate, a US physician practice relationship, or a US-billing entity that does conduct HIPAA standard transactions (e.g., for cross-border continuing care, US-based telehealth follow-ups, or US insurance settlements), the analysis changes for **that specific hospital relationship**. See "Open legal questions" below.

#### 1.4 Does "department selection + passport + contact info" constitute PHI?

Two framings:

- **Technical HIPAA framing [inference]**: PHI requires the information to have been **created or received by one of the listed entities** (provider, plan, public health authority, employer, life insurer, school/university, clearinghouse). Safedoc is none of those. Information created and received by Safedoc, from the user, about the user's preferred department does not meet §160.103's "health information" predicate on that technical reading alone.
- **Practical/risk framing**: The 2024 federal-court vacatur of OCR's online-tracking-technologies expanded-IIHI theory reinforces that OCR cannot unilaterally stretch IIHI to cover generic web metadata. A court held that metadata such as IP addresses input into an unauthenticated public webpage does not constitute IIHI. Source: [Ropes & Gray — Federal Judge Vacates Key Points of HHS OCR HIPAA Online Tracking Technology Guidance](https://www.ropesgray.com/en/insights/alerts/2024/06/federal-judge-vacates-key-points-of-hhs-ocr-hipaa-online-tracking-technology-guidance); [Morrison Foerster — Federal Judge Vacates Portions of OCR Guidance on Online Tracking Technologies](https://www.mofo.com/resources/insights/240718-federal-judge-vacates-ocr-guidance). This cuts against any argument that a department selection on Safedoc's site becomes PHI.

That said:

- "Department" (e.g., dermatology, oncology, fertility) combined with identifiers **is** sensitive and reveals a plausible area of health concern. Even if not PHI under HIPAA, it is sensitive under Texas HB 300, CCPA SPI rules, and Korean PIPA sensitive-data rules. See §§2–4.

**Conclusion [inference]**: Department choice + passport + contact info is **not PHI under HIPAA** as Safedoc is structured, but it is sensitive personal data under multiple other regimes and should be treated as such. Do not rely on the narrow HIPAA non-applicability alone.

---

### 2. Texas HB 300 applicability

#### 2.1 The Texas definition

Texas HB 300 (2011; amended and operative through Tex. Health & Safety Code ch. 181) defines "covered entity" far more broadly than HIPAA. Under Tex. Health & Safety Code §181.001, a covered entity is "any person who for commercial, financial, or professional gain … engages, in whole or in part, and with real or constructive knowledge, in the practice of assembling, collecting, analyzing, using, evaluating, storing, or transmitting protected health information." The statute enumerates inclusions: a business associate, healthcare payer, governmental unit, IT/computer management entity, school, health researcher, healthcare facility, clinic, healthcare provider, or "person who maintains an Internet site," plus any employee, agent, or contractor of such persons.

Sources: [FindLaw — Tex. Health & Safety Code §181.001](https://codes.findlaw.com/tx/health-and-safety-code/health-safety-sect-181-001/); [Texas Statutes — ch. 181](https://statutes.capitol.texas.gov/Docs/HS/htm/HS.181.htm); [HIPAA Journal — What is Texas HB 300?](https://www.hipaajournal.com/what-is-texas-hb-300/); [Accountable — Texas HB 300 Explained](https://www.accountablehq.com/post/texas-hb-300-texas-medical-privacy-act-explained-requirements-training-and-penalties).

HB 300 pulls its "protected health information" definition by reference from HIPAA. Source: [LawServer — Tex. H&S §181.001](https://www.lawserver.com/law/state/texas/tx-codes/texas_health_and_safety_code_181-001).

#### 2.2 Does HB 300 reach Safedoc?

- **Texas LLC operator**: If the Texas LLC operates the US service, it is a person engaged in commercial practice in Texas that "assembles, collects, analyzes, uses, evaluates, stores, or transmits" information related to medical departments of interest tied to identified individuals. Under the statute's plain reading this likely qualifies, notwithstanding that the user's chosen department is not a diagnosis. [inference — needs counsel confirmation.]
- **Out-of-state / nationwide reach**: Guidance is consistent that entities outside Texas come into HB 300 scope when they process PHI of Texas residents, "regardless of where the Texas resident was at the time the information was collected." Source: [Compliancy Group — Who Does Texas HB 300 Apply To?](https://compliancy-group.com/who-does-texas-hb-300-apply-to/); [Accountable — Texas PHI Breach Notification Rules](https://www.accountablehq.com/post/texas-phi-breach-notification-rules-hipaa-and-hb-300-requirements-explained).

**Operational obligations (if HB 300 applies)** (summary, not verbatim):

- **Employee training** on state and federal PHI rules appropriate to job duties. New hires within 90 days. Re-train after material legal changes within a reasonable period and no later than the first anniversary. Keep signed training records for 6 years.
  Source: [HIPAA Guide — HB 300 Training](https://www.hipaaguide.net/hb-300-training); [Accountable — Texas HB 300 Explained](https://www.accountablehq.com/post/texas-hb-300-texas-medical-privacy-act-explained-requirements-training-and-penalties).
- **Breach notification**: for a breach of system security involving sensitive personal information (including health info), notify affected individuals "as quickly as possible," not later than the 60th day. If ≥250 Texas residents are affected, notify the Texas Attorney General electronically no later than the 30th day.
  Source: [Accountable — Texas Breach Notification Law for Healthcare](https://www.accountablehq.com/post/texas-breach-notification-law-for-healthcare-what-hipaa-and-hb-300-require).
- **Patient right of access / authorization forms**: use of the Texas AG's authorization-to-disclose-PHI form for express disclosures is customary.
  Source: [Texas AG — Authorization to Disclose PHI](https://www.texasattorneygeneral.gov/sites/default/files/files/divisions/consumer-protection/hb300-Authorization-Disclose-Health-Info.pdf).
- **Stricter than HIPAA** in some consumer-facing rights and in scope of who must comply.

**Conclusion [inference]**: HB 300 compliance is the most likely actually-binding US healthcare-privacy obligation on Safedoc at demo time. Plan for it as a baseline even if HIPAA does not apply.

---

### 3. California CCPA/CPRA applicability

#### 3.1 CCPA/CPRA thresholds

A business is subject to CCPA/CPRA if it does business in California, determines purposes and means of processing California residents' personal information, and meets at least one of:

- Gross annual revenue over the statutory threshold — **$26,625,000 for 2026** (the $25M statutory figure adjusted for CPI);
- Buys, sells, or shares personal information of **100,000 or more** California consumers or households per year; or
- Derives 50% or more of annual revenue from selling/sharing consumers' personal information.

Sources: [CPPA — Updated Monetary Thresholds](https://cppa.ca.gov/regulations/cpi_adjustment.html); [CPPA — FAQs](https://cppa.ca.gov/faq.html); [Jackson Lewis — 30+ Essential FAQs](https://www.jacksonlewis.com/insights/navigating-california-consumer-privacy-act-30-essential-faqs-covered-businesses-including-clarifying-regulations-effective-1126).

**Applicability assessment [inference]**:

- At demo launch Safedoc is unlikely to exceed $26.625M revenue and is unlikely to have 100,000 California consumers. It does not plan to "sell" personal information. So CCPA/CPRA may not strictly apply at the demo moment.
- However: Safedoc is a consumer-facing site collecting personal information from California residents, and the company should plan for CCPA/CPRA to apply as soon as scale or business model crosses a threshold. The right-to-know, right-to-delete, right-to-correct, right-to-limit-use-of-SPI disclosures should be designed now.

#### 3.2 What is "Sensitive Personal Information" (SPI)?

Under Cal. Civ. Code §1798.140(ae) and related CPPA regulations, SPI includes:

- SSN, driver's license, state ID, **passport number**,
- account login + password/credentials,
- precise geolocation,
- racial/ethnic origin, religion, union membership,
- genetic data,
- biometric data for identification,
- **personal information collected and analyzed concerning a consumer's health**,
- sex life / sexual orientation,
- **citizenship and immigration status** (added by AB 947, effective Jan 1, 2024).

Sources: [CookieYes — CPRA Sensitive Personal Information](https://www.cookieyes.com/blog/cpra-sensitive-personal-information/); [Akin Gump — California Expands Definition of SPI](https://www.akingump.com/en/insights/blogs/ag-data-dive/california-expands-definition-of-sensitive-personal-information-covered-under-cpra); [Hunton — California Amends CCPA re Neural Data and Scope](https://www.hunton.com/privacy-and-information-security-law/california-amends-ccpa-to-cover-neural-data-and-clarify-scope-of-personal-information); [Jackson Lewis FAQs](https://www.jacksonlewis.com/insights/navigating-california-consumer-privacy-act-30-essential-faqs-covered-businesses-including-clarifying-regulations-effective-1126).

**Safedoc's booking form collects at least four SPI categories simultaneously**: passport number; citizenship/nationality; health-interest (department) signal; and — from the Korean-American audience flag — in some cases racial/ethnic origin indirectly. Treat the booking payload as SPI-dense.

#### 3.3 The CCPA HIPAA exemption

CCPA exempts PHI collected by HIPAA covered entities or business associates, and medical information governed by CMIA. It does **not** exempt an entity that is not a covered entity/business associate and not a CMIA-regulated entity.

Sources: [HIPAA Journal — CCPA HIPAA Exemption](https://www.hipaajournal.com/ccpa-hipaa-exemption/); [Compliancy Group — CCPA HIPAA Exemption](https://compliancy-group.com/the-ccpa-hipaa-exemption/); [Datavant — CCPA Exemptions for Health Companies](https://www.datavant.com/hipaa-privacy/ccpa-exemptions-what-they-really-mean-for-health-companies); [IAPP — CCPA Deserves Your Attention Despite HIPAA Exemption](https://iapp.org/news/a/paging-all-health-care-privacy-pros-cacpa-deserves-your-attention-despite-hipaa-exemption).

**[inference]** Because Safedoc is not a HIPAA covered entity or BA, the HIPAA exemption does not shield Safedoc. If CCPA ever attaches (threshold-based), Safedoc will be fully subject with SPI-specific limits.

#### 3.4 CMIA

California's Confidentiality of Medical Information Act is broader than HIPAA and reaches certain non-providers that maintain medical information in California. Whether it reaches a booking/referral concierge is unclear and fact-specific. Sources: [DLA Piper — California expands scope of CMIA](https://www.dlapiper.com/en/insights/publications/2022/11/california-expands-scope-of-confidentiality-of-medical-information-act); [Covington — California Expands Scope of CMIA](https://www.covingtondigitalhealth.com/2022/11/california-expands-the-scope-of-the-cmia-to-cover-certain-digital-mental-health-services-and-information/); [Accountable — CMIA Explained](https://www.accountablehq.com/post/california-confidentiality-of-medical-information-act). Flag as an open question for counsel.

---

### 4. South Korea PIPA + cross-border data

#### 4.1 PIPA reaches Safedoc

PIPA applies extraterritorially to foreign business operators that process Korean residents' personal information, and — under the April 4, 2024 PIPC Guidelines for Foreign Business Operators — clarifies obligations for entities outside Korea. Source: [Baker McKenzie Connect On Tech — Guidelines for Foreign Business Operators](https://connectontech.bakermckenzie.com/south-korea-issues-guidelines-on-applying-the-personal-information-protection-act-to-foreign-business-operators/); [IAPP — PIPC flexes its muscles](https://iapp.org/news/a/south-korea-s-pipc-flexes-its-muscles-what-to-know-about-ai-model-deletion-cross-border-transfers-and-more); [PIPC official site](https://www.pipc.go.kr/eng/index.do).

In Safedoc's flow, the primary transfer direction is actually the reverse of the classic extraterritorial case: Safedoc's US service sends **US user data** to the Korean parent's API and, in confirmed bookings, to the Korean hospitals. The **Korean parent and hospitals** are in-country PIPA data handlers; their obligations attach directly, and Safedoc's obligations attach through the contractual chain.

#### 4.2 Sensitive data under PIPA

PIPA (Art. 23) treats "sensitive information" as a special category requiring separate explicit consent. This includes ideology/beliefs, political opinions, union membership, **health or sex life**, genetic information, criminal history, biometric identification data, and race/ethnicity.

Separately, Art. 24 treats "unique identification information" including **passport numbers, resident registration numbers, driver's license numbers, and alien registration numbers** with restrictions similar to sensitive information.

Sources: [Baker McKenzie Resource Hub — South Korea Key Definitions](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/asia-pacific/south-korea/topics/key-definitions); [Chambers — South Korea Data Protection 2026](https://practiceguides.chambers.com/practice-guides/data-protection-privacy-2026/south-korea/trends-and-developments); [ICLG — Korea 2024-2025](https://iclg.com/practice-areas/data-protection-laws-and-regulations/korea); [Shin & Kim — 2024 PIPC Casebook Legal Insights (Healthcare)](https://shinkim.com/eng/media/newsletter/2585).

Separate opt-in is required for both sensitive information and unique identification information. Safedoc's booking form contains **both types** (passport + health-department interest).

#### 4.3 Cross-border transfer

Under PIPA Arts. 28-8 / 28-9, cross-border transfer of personal information generally requires:

1. **Separate explicit consent** from the data subject after a granular notice (recipient name, transfer purpose, items transferred, country, retention period, etc.); OR
2. An **adequacy-style recognition** by PIPC of the destination country; OR
3. The recipient holds PIPC-approved certification (e.g., ISMS-P); OR
4. A limited exception where transfer is necessary for contract performance and the transfer is disclosed in the privacy policy or notified to the data subject.

Sources: [Baker McKenzie Connect On Tech](https://connectontech.bakermckenzie.com/south-korea-issues-guidelines-on-applying-the-personal-information-protection-act-to-foreign-business-operators/); [IAPP — PIPC flexes its muscles](https://iapp.org/news/a/south-korea-s-pipc-flexes-its-muscles-what-to-know-about-ai-model-deletion-cross-border-transfers-and-more); [DLA Piper — Transfer of Personal Data in South Korea](https://www.dlapiperdataprotection.com/index.html?t=transfer&c=KR); [Securiti — South Korea PIPA](https://securiti.ai/south-korea-personal-information-protection-act/); [VeraSafe — Korean PIPA Guide](https://verasafe.com/blog/understanding-korean-pipa-a-guide-for-foreign-businesses/).

Enforcement matters: in Jan 2025 the PIPC fined KakaoPay KRW 5.9B and Apple Distribution International KRW 2.4B for failing to notify users of cross-border processing. This is a live, actively-enforced regime. Source: [IAPP — PIPC flexes its muscles](https://iapp.org/news/a/south-korea-s-pipc-flexes-its-muscles-what-to-know-about-ai-model-deletion-cross-border-transfers-and-more).

#### 4.4 Which direction of transfer is the Safedoc concern?

- **US → KR (primary in this product)**: the Safedoc US entity transfers US resident data to a Korean data handler. This is the **US side's** obligation under US law (CCPA cross-border disclosure expectations, TX HB 300 disclosure and safeguards) and the **KR recipient's** PIPA obligation on receipt and onward processing. Because the Korean parent/hospitals will be data handlers under PIPA, Safedoc should expect to sign a data-handling / transfer agreement that documents purpose limits, security, retention, and onward transfer.
- **KR → US (secondary)**: when the Korean system sends confirmation data, pricing, or hospital responses back, the Korean data handlers are exporting personal information to Safedoc US. That is a PIPA cross-border transfer from the Korean side and needs either separate consent at the Korean point-of-collection (if applicable) or a contractual/"necessary for contract" basis plus privacy policy disclosure.

#### 4.5 Not a GDPR-SCC situation, but the shape is similar

PIPA does not use the EU's SCCs. The comparable instruments are (a) a **written data transfer / processing agreement** between the exporter and importer; (b) explicit separate consent at collection; and (c) recipient safeguards. Korea has an EU adequacy decision (Dec 17, 2021), which is irrelevant for US↔KR flows but useful context for the Korean parent's general posture. Sources: [IAPP](https://iapp.org/news/a/south-korea-s-pipc-flexes-its-muscles-what-to-know-about-ai-model-deletion-cross-border-transfers-and-more); [TJC Group — PIPA Guide](https://www.tjc-group.com/blogs/data-privacy-law-a-guide-to-south-koreas-pipa-regulation/).

---

## Recommended posture

### Recommendation: Option C (with a Option D overlay on open questions)

**Option C — treat Safedoc as a non-HIPAA consumer service, but proactively apply Texas HB 300, CCPA/CPRA-equivalent consumer rights, and Korean PIPA cross-border consent.**

### Rationale

1. **HIPAA mechanically does not apply.** Forcing Safedoc into the HIPAA regime (Option A) would require fabricating a regulatory hook that does not exist and would impose Security Rule, Breach Notification Rule, and BAA obligations that cannot be symmetrically enforced against the Korean hospitals, since they are not US covered entities. It would also commit the company to a full Security Rule and Privacy Rule program prematurely.
2. **BAA-to-every-hospital (Option B) is not meaningfully enforceable.** BAAs exist because the US covered entity at the top of the chain needs them. Without a US covered entity, a BAA is contractually plausible but conceptually hollow. It may even confuse Korean counterparties, who are regulated under PIPA, not HIPAA.
3. **Texas HB 300 is the most likely actually-binding US privacy law.** Its covered-entity definition reaches Safedoc's Texas LLC on its face. The baseline controls it requires (training, breach notification, authorization for disclosures, reasonable safeguards) are reasonable and should be implemented regardless.
4. **CCPA/CPRA is not yet mandatory but will be.** Plan SPI handling and consumer rights disclosures now; the booking payload is SPI-dense (passport, citizenship, health-interest).
5. **PIPA is mandatory on day 1** because Safedoc's core transaction transfers identifiable + sensitive + unique-identifier data to Korea. Separate consent + notice + written transfer agreement with the Korean parent/hospitals is non-negotiable.
6. **Option D overlay**: specific questions need a US-licensed healthcare-privacy attorney and a Korean PIPA specialist before launch (see "Open legal questions" below).

### Required engineering controls

Implement all of these before 5/15 demo unless explicitly deferred with sign-off.

1. **Transport & storage encryption**
   - TLS 1.2+ for all client↔server and server↔KR-API traffic; HSTS preload; modern cipher suites only.
   - AES-256 at rest for the primary database and backups.
   - Encryption keys in a managed KMS (e.g., AWS KMS, GCP KMS); rotate annually or on compromise.
2. **Field-level protection for high-risk fields**
   - Encrypt passport number and nationality at the application layer with a separate envelope key, in addition to at-rest DB encryption. Decrypt only in the booking-submit path.
   - Hash + pepper any identifiers used as lookup keys (email, phone) where whole-value search is not required.
3. **Access control**
   - Role-based access with least privilege. Separate roles for CS, engineering, admin, and data analyst.
   - SSO + mandatory MFA for all internal admin access. No shared accounts.
   - Revoke on departure SLA: same day.
4. **Audit logging**
   - Append-only audit log of every read/write of booking records, keyed by actor identity, timestamp, action, record ID.
   - Store audit logs separately from production data; retain ≥ 6 years (tracks the Texas HB 300 training-record retention window as a reasonable baseline).
5. **Data retention & deletion**
   - Define and enforce retention: e.g., booking records 24 months after trip end; add-on service free-text notes 12 months.
   - Support consumer deletion requests (CCPA-style) end-to-end including Korean-side erasure requests to the parent.
6. **Consent surfaces**
   - **Cross-border transfer consent** at point of collection: a separate, checkbox-distinct opt-in listing (i) recipient (Korean Safedoc / hospital), (ii) country (Republic of Korea), (iii) items transferred (name, contact, passport, department, dates), (iv) purpose, (v) retention period, (vi) right to withhold and consequences.
   - **Sensitive data consent**: separate opt-in for health-department selection and for passport-number collection (covers PIPA's distinct consent tracks + CPRA right-to-limit-use-of-SPI).
7. **Breach readiness**
   - Incident response playbook with role-assignment, forensic preservation, and 60/30-day Texas AG + consumer notification timelines pre-written.
   - 72-hour internal escalation target to align with Korean PIPA's 72-hour reporting expectation for sensitive/unique-id incidents.
8. **Data minimization**
   - Do not store payment data in Phase 2 — keep Stripe as the system of record and only retain Stripe customer IDs / last-4 / receipts.
   - Never store diagnoses, clinical notes, or imaging. Document this exclusion in the data map.
   - For add-on services, treat free-text notes as potentially sensitive and apply the same controls.
9. **Logging hygiene**
   - Scrub passport, email, and phone from application logs. Replace with stable hashed IDs where traceability is needed.
10. **Third-party inventory**
    - Maintain a live register of all sub-processors (hosting, email, analytics, error tracking, Stripe, etc.) with the personal-information categories each receives.
    - Default to self-hosting or first-party analytics for the booking pages; avoid third-party tag managers and social pixels on the department/booking flow in particular (post-OCR-tracking-vacatur, the federal risk is lower for non-covered entities, but the Texas HB 300 and PIPA risks remain non-trivial and the reputational risk is real).

### Required legal / contractual items

These are outside engineering but on the same critical path for launch.

1. **Privacy policy** (US-facing): CCPA/CPRA-style structure even if thresholds are not yet met; explicit disclosure of cross-border transfer to Korea; clear SPI section; enumerated consumer rights + "do not sell/share" posture (even if N/A); contact channel; effective date.
2. **Terms of service**: scope of the booking service (facilitation, not provision of care); liability limits; dispute resolution venue (Delaware / Texas); user obligations regarding accurate identity data for Korean immigration.
3. **Cross-border data transfer agreement** between (a) the Texas LLC and (b) the Korean Safedoc parent, documenting purpose limitation, security, sub-processing, incident notification, and assistance with data-subject rights. Written in a form that tracks Korean PIPC's cross-border transfer expectations.
4. **Hospital data-handling addendum** (template): minimum standards that each hospital must agree to before receiving booking data, including purpose limitation (only for this booking), no onward marketing use, deletion on completion/cancellation, and an incident-notification SLA.
5. **BAAs — only where there is a genuine hook.** [inference] Do not paper-over BAAs with every hospital. Do sign BAAs with any US-based sub-processor that will ever touch PHI-ish data if the service ever pivots, and keep a watchlist for any US-side covered-entity partnerships (telehealth follow-ups, US-insurance settlements, etc.).
6. **Sub-processor agreements**: DPA-equivalent language for all vendors (hosting, email, analytics, customer support tooling, error tracking).
7. **Texas HB 300 training program**: workforce training materials, acknowledgement log, 90-day-after-hire deadline, annual refresh, 6-year retention.
8. **Breach notification playbook** that satisfies Texas HB 300 (60/30 day), California data-breach law (§1798.82 et seq.), and Korean PIPA reporting channels.
9. **Records of processing**: internal data map listing every personal data element, system, retention period, cross-border transfer, legal basis, and consent source.
10. **Record of the non-HIPAA-applicability analysis** (this document, cleaned up by counsel) filed with the company's compliance records so the rationale is preserved.

### Open legal questions (attorney required)

1. **Any US-side covered-entity hooks?** Are any of the Korean hospitals or Safedoc partners linked to a US provider practice, US telemedicine license, US CPT-billing entity, or US insurance-billing flow? If yes, the HIPAA analysis for that relationship flips and BAAs become necessary.
2. **CMIA reach in California.** Does Safedoc meet the CMIA definition of a "business that offers software or hardware to consumers, including a mobile application or other related device, that is designed to maintain medical information" or any adjacent expanded category as amended? If yes, California-specific consent/authorization rules kick in.
3. **PIPA cross-border consent mechanics for the reverse flow.** How should Safedoc and the Korean parent allocate notice responsibilities when confirmation data flows from Korean hospitals back to the US LLC? Which party gathers what consent, in what language, at what timing?
4. **State breach-notification patchwork** beyond Texas/California: 50-state breach notification statutes still apply to the Safedoc user base even outside those two states. A consolidated matrix (or counsel memo) is needed before launch.
5. **Entity of record for the US service.** Final decision on Texas LLC vs. Delaware parent as the consumer-facing operator affects (i) HB 300 applicability analysis, (ii) venue clauses in ToS, (iii) licensing/business-registration filings per state.
6. **Children / minors.** Confirm Safedoc will not accept bookings for users under 13 (COPPA) or collect minor users' SPI without verified parental consent; if yes, a separate flow is needed.
7. **Marketing / email opt-in.** CAN-SPAM + state-specific rules for health-adjacent marketing; a separate non-coupled opt-in for marketing beyond booking confirmations.

---

## Sources

### US federal — HIPAA

- [eCFR — 45 CFR 160.103 Definitions](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103)
- [LII / Cornell — 45 CFR 160.103](https://www.law.cornell.edu/cfr/text/45/160.103)
- [HHS.gov — Covered Entities and Business Associates](https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html)
- [HHS.gov — Business Associates guidance](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html)
- [HHS.gov — Summary of the HIPAA Privacy Rule](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html)
- [CMS — Are You a Covered Entity?](https://www.cms.gov/priorities/key-initiatives/burden-reduction/administrative-simplification/hipaa/covered-entities)
- [HIPAA Journal — Covered Entities Under HIPAA (2026)](https://www.hipaajournal.com/covered-entities-under-hipaa/)
- [HIPAA Journal — What is considered PHI under HIPAA?](https://www.hipaajournal.com/considered-phi-hipaa/)
- [HIPAA Journal — Individually Identifiable Health Information (2026)](https://www.hipaajournal.com/individually-identifiable-health-information/)

### US federal — OCR online-tracking vacatur (2024)

- [Ropes & Gray — Federal Judge Vacates Key Points of HHS OCR HIPAA Online Tracking Technology Guidance](https://www.ropesgray.com/en/insights/alerts/2024/06/federal-judge-vacates-key-points-of-hhs-ocr-hipaa-online-tracking-technology-guidance)
- [Morrison Foerster — Federal Judge Vacates Portions of OCR Guidance on Online Tracking Technologies](https://www.mofo.com/resources/insights/240718-federal-judge-vacates-ocr-guidance)
- [Norton Rose Fulbright — Applying HIPAA to Online Tracking Technologies: Court Finds HHS Guidance Exceeds Authority](https://www.nortonrosefulbright.com/en-us/knowledge/publications/77cf7f04/applying-hipaa-to-online-tracking-technologies)
- [Arnold & Porter — Federal Court Vacates Part of HHS OCR Guidance](https://www.arnoldporter.com/en/perspectives/advisories/2024/07/federal-district-court-vacates-part-of-hhs-ocr-guidance)

### Texas HB 300 / ch. 181

- [Texas Statutes — H&S Code ch. 181](https://statutes.capitol.texas.gov/Docs/HS/htm/HS.181.htm)
- [FindLaw — Tex. H&S §181.001](https://codes.findlaw.com/tx/health-and-safety-code/health-safety-sect-181-001/)
- [LawServer — Tex. H&S §181.001](https://www.lawserver.com/law/state/texas/tx-codes/texas_health_and_safety_code_181-001)
- [Texas AG — HB 300 Authorization to Disclose PHI](https://www.texasattorneygeneral.gov/sites/default/files/files/divisions/consumer-protection/hb300-Authorization-Disclose-Health-Info.pdf)
- [HIPAA Journal — What is Texas HB 300?](https://www.hipaajournal.com/what-is-texas-hb-300/)
- [Accountable — Texas HB 300 Explained](https://www.accountablehq.com/post/texas-hb-300-texas-medical-privacy-act-explained-requirements-training-and-penalties)
- [Accountable — Texas PHI Breach Notification Rules](https://www.accountablehq.com/post/texas-phi-breach-notification-rules-hipaa-and-hb-300-requirements-explained)
- [Accountable — Texas Breach Notification Law for Healthcare](https://www.accountablehq.com/post/texas-breach-notification-law-for-healthcare-what-hipaa-and-hb-300-require)
- [HIPAA Guide — HB 300 Training](https://www.hipaaguide.net/hb-300-training)
- [Compliancy Group — Who Does Texas HB 300 Apply To?](https://compliancy-group.com/who-does-texas-hb-300-apply-to/)

### California CCPA / CPRA / CMIA

- [CPPA — Updated Monetary Thresholds](https://cppa.ca.gov/regulations/cpi_adjustment.html)
- [CPPA — FAQs](https://cppa.ca.gov/faq.html)
- [Jackson Lewis — 30+ Essential FAQs (effective 1.1.26 regs)](https://www.jacksonlewis.com/insights/navigating-california-consumer-privacy-act-30-essential-faqs-covered-businesses-including-clarifying-regulations-effective-1126)
- [CookieYes — CPRA Sensitive Personal Information](https://www.cookieyes.com/blog/cpra-sensitive-personal-information/)
- [Akin — California Expands SPI Definition](https://www.akingump.com/en/insights/blogs/ag-data-dive/california-expands-definition-of-sensitive-personal-information-covered-under-cpra)
- [Hunton — California Amends CCPA for Neural Data / SPI Scope](https://www.hunton.com/privacy-and-information-security-law/california-amends-ccpa-to-cover-neural-data-and-clarify-scope-of-personal-information)
- [HIPAA Journal — CCPA HIPAA Exemption](https://www.hipaajournal.com/ccpa-hipaa-exemption/)
- [Compliancy Group — The CCPA HIPAA Exemption in Healthcare](https://compliancy-group.com/the-ccpa-hipaa-exemption/)
- [Datavant — CCPA Exemptions: What They Really Mean for Health Companies](https://www.datavant.com/hipaa-privacy/ccpa-exemptions-what-they-really-mean-for-health-companies)
- [IAPP — CCPA Deserves Your Attention Despite HIPAA Exemption](https://iapp.org/news/a/paging-all-health-care-privacy-pros-cacpa-deserves-your-attention-despite-hipaa-exemption)
- [DLA Piper — California Expands Scope of CMIA](https://www.dlapiper.com/en/insights/publications/2022/11/california-expands-scope-of-confidentiality-of-medical-information-act)
- [Covington — California Expands CMIA to Digital Mental Health](https://www.covingtondigitalhealth.com/2022/11/california-expands-the-scope-of-the-cmia-to-cover-certain-digital-mental-health-services-and-information/)
- [Accountable — California CMIA Explained](https://www.accountablehq.com/post/california-confidentiality-of-medical-information-act)

### South Korea PIPA / PIPC

- [PIPC (official, English)](https://www.pipc.go.kr/eng/index.do)
- [Baker McKenzie Connect On Tech — Guidelines on Applying PIPA to Foreign Business Operators](https://connectontech.bakermckenzie.com/south-korea-issues-guidelines-on-applying-the-personal-information-protection-act-to-foreign-business-operators/)
- [Baker McKenzie Resource Hub — South Korea Key Definitions](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/asia-pacific/south-korea/topics/key-definitions)
- [IAPP — South Korea's PIPC Flexes Its Muscles (AI, cross-border, fines)](https://iapp.org/news/a/south-korea-s-pipc-flexes-its-muscles-what-to-know-about-ai-model-deletion-cross-border-transfers-and-more)
- [DLA Piper — Transfer of Personal Data in South Korea](https://www.dlapiperdataprotection.com/index.html?t=transfer&c=KR)
- [ICLG — Data Protection Laws and Regulations Korea 2024-2025](https://iclg.com/practice-areas/data-protection-laws-and-regulations/korea)
- [Chambers — Data Protection & Privacy 2026: South Korea](https://practiceguides.chambers.com/practice-guides/data-protection-privacy-2026/south-korea/trends-and-developments)
- [Shin & Kim — 2024 PIPC Casebook Legal Insights (Healthcare)](https://shinkim.com/eng/media/newsletter/2585)
- [TJC Group — Data Privacy Law: Guide to PIPA](https://www.tjc-group.com/blogs/data-privacy-law-a-guide-to-south-koreas-pipa-regulation/)
- [Securiti — South Korea PIPA](https://securiti.ai/south-korea-personal-information-protection-act/)
- [VeraSafe — Understanding Korean PIPA](https://verasafe.com/blog/understanding-korean-pipa-a-guide-for-foreign-businesses/)

### Foreign-vendor / international HIPAA context

- [Paubox — Do foreign vendors have to sign a business associate agreement?](https://www.paubox.com/blog/do-foreign-vendors-have-to-sign-a-business-associate-agreement)
- [Paubox — Do international companies have to abide by HIPAA?](https://www.paubox.com/blog/do-international-companies-have-to-abide-by-hipaa)
- [Compliancy Group — Is HIPAA International?](https://compliancy-group.com/is-hipaa-international/)
- [Paubox — HIPAA fundamentals and jurisdictional impact on medical tourism](https://www.paubox.com/blog/hipaa-fundamentals-and-jurisdictional-impact-on-medical-tourism)
