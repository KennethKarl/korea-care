# SafeDoc Global Service · 요구사항정의서 (SRS · Notion-import)

> Notion 데이터베이스 또는 페이지로 그대로 import 가능한 형식.
> 각 항목 = **번호 (H3 헤더)** + **메타 라인** (구분 · Priority · 상태 · 개발 예상일정) + **설명 본문**.
> 출처: `prototype/demo.html` v1.1, `docs/requirements-definition.html` v1.1, `docs/ui-ux-plan.html` v1.1.3.
> 버전 v1.0 · 2026-05-13 · 데모 D-2.

---

## 컬럼 정의 (Notion DB 스키마)

| 컬럼 | 타입 | 옵션 |
|------|------|------|
| 번호 | Text (Title) | `SRS-G-001` ~ |
| 요구사항 명칭 | Text | H3 헤더와 동일 |
| 구분 | Multi-select | `글로벌서비스` / `한국API` / `CMS` / `정책` / `법규` / `데이터` / `보안` / `접근성` / `i18n` / `디자인` / `데모` / `결제(P2)` / `B2B` |
| Priority | Select | `P0` (MUST 5/15) / `P1` (SHOULD M5–M6) / `P2` (Phase 2 이관) |
| 상태 | Select | `미정` / `진행중` / `완료` / `보류` |
| 개발 예상일정(Day) | Number | 1 day = 1인일(8h) |

---

## 1. 화면 라우트 (P01–P14 · FR-01 ~ FR-14)

### SRS-G-001 · 랜딩(홈) 에디토리얼 스크롤

**구분**: 글로벌서비스 / 디자인 / i18n &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 5

미국 거주자에게 가치 제안·신뢰 단서·가격 시뮬레이션을 60초 내 전달하는 단일 라우트 `#/`. 11개 에디토리얼 섹션(Hero · Trust marquee · Featured specialties · Before & After · Reviews · Providers · Guides · How it works · FAQ · Closing · Enterprise · Simulator)이 수직 연결되며, 헤더 메뉴(`#beforeafter`·`#reviews`·`#providers`·`#guides`·`#how`·`#faq`·`#enterprise`·`#simulator`)로 직접 점프 가능. 모든 카피는 EN/KO 이중 언어 i18n 키로 관리. 게스트 진입 가능. CWV 목표 LCP <2.5s.

**관련**: P01 · FR-01 · 하위 11 섹션 SRS-G-002 ~ SRS-G-012

---

### SRS-G-002 · 랜딩 Hero — 검색 + 신뢰 배지

**구분**: 글로벌서비스 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

Eyebrow "Care, considered. / 섬세한 의료 경험."(`hp_hero_eyebrow`) + H1(`hp_hero_title_v2` "Trusted Korean care, curated for you.") + 1줄 리드(`hp_hero_lede`) + 검색 입력(`hp_search_placeholder_v2` "Search treatments, clinics, or concerns") + 검색 버튼. 데스크톱 우측에 떠다니는 신뢰 배지 4종 — Verified clinics / English support / Before & After cases / Concierge care. 배경 `sd-mesh-hero`는 radial 3-stop + linear 그라디언트. `prefers-reduced-motion` 시 배경 정지.

**관련**: P01-A · FR-01.1

---

### SRS-G-003 · 랜딩 Trust marquee (sd-navy)

**구분**: 글로벌서비스 / 디자인 / 접근성 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

"AS SEEN IN" 라벨 + 가로 무한 스크롤 마퀴. JCI · KSAPS · ISAPS · KDA · English reports · Bilingual coordinator 키워드 반복 노출. 다크 네이비 배경 + 양 끝 페이드 마스크. `prefers-reduced-motion` 시 자동 정지 (a11y 필수).

**관련**: P01-B · FR-01.2

---

### SRS-G-004 · 랜딩 Featured specialties (6 photo-tile)

**구분**: 글로벌서비스 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

6개 대표 진료과 photo-tile (Skin & Laser · Health Checkups · Dental · Eye Care · Plastic Surgery · Orthopedics). 4:5 비율, 진료과 시그니처 그라디언트 팔레트. 각 타일에 클리닉 수 · 최저가(현재 페르소나 적용). hover 시 `translateY(-4px)` + 보더 컬러 전환. 클릭 시 `#/hospitals?dept={id}`로 진입.

**관련**: P01-C · FR-01.3

---

### SRS-G-005 · 랜딩 Before & After (sd-cloud · #beforeafter)

**구분**: 글로벌서비스 / 정책 / 법규 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

동의 기반 케이스 그리드. before/after 이미지 + 회복 기간 라벨(`hp_ba_recovery`) + 검증 마크(`hp_ba_verified`) + 디스클레이머 `BA_DISCLAIMER_DEFAULT` 양 언어. 신원 차단(눈가림·모자이크) 정책 필수. 한국 의료광고 사전심의 적용 여부 결정 전까지 EN-only 노출 검토(정책서 §9.2 참조).

**관련**: P01-D · FR-01.4

---

### SRS-G-006 · 랜딩 Reviews wall (sd-paper · #reviews)

**구분**: 글로벌서비스 / 정책 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

미국 환자 후기 카드 3종 (white/navy/blue 색 블록). 가명(`hp_story_*_name`)·메타 정보(`hp_story_*_meta`)·5-스타·환자 인용문(`hp_story_*_quote`). `REVIEW_DISCLAIMER_DEFAULT` EN/KO 양 언어 고정 노출 — "결과는 개인에 따라 달라질 수 있으며, 후기는 작성자의 개인적 경험을 바탕으로 합니다." "더 보기" 진입.

**관련**: P01-E · FR-01.5

---

### SRS-G-007 · 랜딩 Providers (sd-navy · #providers)

**구분**: 글로벌서비스 / 정책 / 법규 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

의료진 자격 검증 정책 4개 번호 불릿(KSAPS · ISAPS · KDA · JCI) + 떠다니는 의료진 카드 3종(이니셜 아바타 + 자격 + 클리닉). 인용 1개(`hp_provider_quote` + `hp_provider_quote_attr`). 환자 후기 수·시술 횟수·만족도 % 등 광고심의 영향 항목은 사전심의 통과 후만 노출.

**관련**: P01-F · FR-01.6

---

### SRS-G-008 · 랜딩 Guides (sd-mist · #guides)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P1 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

매거진 스타일 가이드 카드 3종 — 카테고리 태그(`hp_guide_a*_cat`) + 제목(`hp_guide_a*_t`) + 읽는 시간(`hp_guide_a*_meta`). Eyebrow "The reading room / 리딩 룸". 제목 `hp_guides_title_v2` "Quiet guidance, before you fly. / 방한 전, 차분히 읽어 보세요." 라이브러리 진입 CTA "Browse the library".

**관련**: P01-G · FR-01.7

---

### SRS-G-009 · 랜딩 How it works 3-step (sd-cloud · #how)

**구분**: 글로벌서비스 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

Discover → Request → Travel 3-step 카드 (chat / sparkle / plane 아이콘). 점선 커넥터 디자인. 각 카드 1줄 설명(`hp_step_*_b`). 부제 `hp_steps_sub` "Three steps, one coordinator, full visibility."

**관련**: P01-H · FR-01.8

---

### SRS-G-010 · 랜딩 FAQ (sd-paper · #faq)

**구분**: 글로벌서비스 / 접근성 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

`<details>` 시맨틱 아코디언 4문항. 열림 시 보더 강조 + 아이콘 45° 회전. Q&A 텍스트는 시드 사전(코드 내 하드코딩). 스크린리더 친화. 키보드 Tab/Enter 토글.

**관련**: P01-I · FR-01.9

---

### SRS-G-011 · 랜딩 Closing + Enterprise CTA (sd-navy + sd-mist · #enterprise)

**구분**: 글로벌서비스 / B2B &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

다크 네이비 클로징 배너 (`hp_closing_*`) + ACME Holdings 협상 할인 미리보기 카드(`enterprise_section_*`). CTA "For employers / 기업 전용". 기업 페르소나 활성 시 미리 할인 % 표기. Phase 2 — 자기 가입 기업 포털은 비스코프.

**관련**: P01-J · FR-01.10

---

### SRS-G-012 · 랜딩 Price Simulator (#simulator)

**구분**: 글로벌서비스 / 디자인 / 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

5개 레버 인터랙티브 가격 시뮬레이터 — (1) 서비스 선택 옵트그룹 / (2) Guest↔Signed in 토글 / (3) Enterprise(none/pending/verified) / (4) Coupon 입력 + Quick chips(SAFEDOC10, NEW200) / (5) 시나리오 슬라이더 0–3(Guest → Signed in → +Enterprise → +Coupon). 우측 라이브 영수증: Base · 티어 · Enterprise discount · Coupon · Estimated total · 절약 %. 게스트 상태에서 가격 잠금 + "Sign in to view" 칩. 충돌 시 라디오로 강제 선택. **본체 상태와 분리**(`simState`) — 네비게이션 이탈 시 초기화, 실제 카트·로그인 변경 안 함.

**관련**: P01-K · FR-01.11 · FR-SIM-1

---

### SRS-G-013 · P02 진료과 카탈로그

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

`#/departments`. 8개 진료과 photo-tile 카드 2/4 컬럼 반응형 그리드. Browse 서브내브(Specialties active ↔ Treatments). 각 카드: 진료과 시그니처 그라디언트 + 좌상단 아이콘 + 우상단 클리닉 수 + EN/KO 진료과명 + 1줄 보조 카피 + "View all →". 클릭 시 `#/hospitals?dept={id}`.

**관련**: P02 · FR-02

---

### SRS-G-014 · P03 시술 카탈로그 (필터 + 그룹)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

`#/services?dept=&concern=&price=&hospital=&sort=`. 듀얼 Browse 탭(Specialties/Treatments) + 가로 스크롤 진료과 서브내브 + concern 필터(조건부, `CONCERN_ORDER[dept]` 정의된 진료과만) + 5단 price 필터(`price_lt500`/`500_1500`/`1500_3000`/`gt3000`) + 5단 sort(추천/인기/가격↑↓/소요시간) + hospital select. 진료과에 `PROCEDURE_ORDER`가 있으면 카테고리 그룹 헤더로 분리, 없으면 플랫 그리드. 모든 필터는 URL 쿼리에 반영(딥링크·새로고침 보존). v1.1 스코핑 규칙: Treatments 탭에서 진료과 선택 시 병원 필터가 해당 진료과 소속으로 자동 한정(commit b1798c7).

**관련**: P03 · FR-05 · FR-BROWSE-1

---

### SRS-G-015 · P04 진료과별 병원 목록

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

`#/hospitals?dept={id}`. 상단 가로 스크롤 진료과 서브내브(활성 강조) + 진료과별 병원 그리드(md:2 / lg:3 컬럼). 각 hospital card: 그라디언트 photo-tile + 병원명(EN/KO) + 평점 + 위치 + 리뷰 수 + 사용자 티어 가격 범위 + 영어 진료 / 국제 병동 칩. 빈 상태 — `empty_dept_title` + Browse 진입.

**관련**: P04 · FR-03

---

### SRS-G-016 · P05 병원 상세 (sticky 4-탭)

**구분**: 글로벌서비스 / 한국API / 데이터 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 4

`#/hospital/{id}?tab={services|overview|reviews|location}`. 상단 photo-tile Hero(병원 팔레트, 240~340px) + 외국인 친화 인증 칩(`kr_foreigner_friendly`). sticky 4-탭 스트립 `role="tablist"`, 좌/우 키 이동. **Services**: `<details>` 아코디언 시술 행, summary에 가격 라인업 즉시 노출. open 시 설명 + Add to cart / Book now. **Overview**: highlights · accreditation · about + KR DB 한국어 원문 필드(`kr_phone` · `kr_transport` · `kr_hours` · `kr_landmark` · `kr_notice` · `kr_address`). **Reviews**: `tab_reviews_stub` placeholder. **Location**: `tab_location_stub` placeholder(P2 네이버·Google 지도 연동). 우측 sticky 가격 카드(대표 시술 자동 선정 + `cta_book`) + 쿠폰 입력 카드(`coupon_prompt` + `coupon_apply` + `coupon_try` 힌트) + Contact 카드(`kr_contact_info`).

**관련**: P05 · FR-04

---

### SRS-G-017 · P06 시술 상세 (KR DB 스키마 매핑)

**구분**: 글로벌서비스 / 한국API / 데이터 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2.5

`#/service/{id}`. photo-tile Hero(병원 팔레트, 240~320px) + 진료과·병원 칩(클릭 시 P05) + H1 EN + KO 부제. 좌측 본문은 KR DB 필드 직접 매핑(commit 181a8f5): `desc`(Overview) · `included[]`(Included, 비면 섹션 숨김) · `process[]`(Process, 번호 매김) · `prep[]`/`aftercare[]` 2-컬럼(`prep`이 비면 `svc_no_prep` 안내). 같은 병원 다른 시술 미니카드 최대 3종. 우측 sticky 가격 카드 + `svc_add_cart`/`svc_in_cart` 토글 + `svc_book_now` → `#/book/{hospitalId}/{serviceId}`.

**관련**: P06 · FR-06

---

### SRS-G-018 · P07 장바구니 (멀티-병원, 라인-아이템)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

`#/cart`. 좌측 라인-아이템 카드 N장 — 88×88 photo-tile + 진료과 eyebrow + 시술명 + 병원명 + 라인별 `<input type="date" min={today+1}>` + Remove 버튼 + 가격(`computePrice` 라이브, 줄긋기 원가 + 적용가). 같은 시술 중복 추가 불가(토스트 차단). 우측 sticky 상단 — **Reservation grouping 카드**: `cartGroups()`가 `(hospitalId, visitDate)` 페어로 묶음 → 큰 숫자 = 예약 번호 개수. 우측 sticky 하단 — **합계 카드**: Items subtotal · Total savings · Estimated grand total. 모든 라인의 visitDate가 입력되어야 Primary `cart_proceed` 활성. 미입력 그룹은 warning 톤 카드.

**관련**: P07 · FR-07 · FR-CART-1

---

### SRS-G-019 · P08 결제 인테이크 (1프로필 N예약)

**구분**: 글로벌서비스 / 데이터 / 보안 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

`#/checkout`. **진입 가드**: 미인증 시 `#/signin?next=#/checkout`, 카트 비었거나 일부 라인 visitDate 누락 시 `#/cart`로 리다이렉트. 상단 Reservations summary 카드 — `cartGroups()` 페어별로 병원·visitDate·`checkout_treatments_in` 리스트 + 그룹 합계 표시. **1회만 입력하는 Patient 섹션**: name(자동) · email(자동, readonly) · phone · age(18–120) · gender · nationality · passport(6–12 alphanumeric). **Travel 섹션**: entryDate · exitDate · hotel(선택) · flight(선택) · notes(선택). visitDate는 카트에서 입력했으므로 본 폼에 없음. **Add-ons**: 3-체크박스(lodging/flight/tour) + 자유 메모. 우측 sticky 합계 카드 + 충돌 라디오 + 쿠폰 입력. Submit 시 그룹별 booking 생성 → cart 비움 → `#/checkout-done?ids={id1,id2,…}`.

**관련**: P08 · FR-08

---

### SRS-G-020 · P08' 결제 완료 인터스티셜

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

`#/checkout-done?ids={csv}`. URL `ids` 파라미터 CSV 파싱 → 각 booking 카드(병원 photo-tile + `status_waiting` 칩 + booking ID mono + 병원명 + visitDate + 시술 개수 + 총 가격) 그리드(md:2 컬럼). 누락된 ID는 카드 미렌더. 중앙 "View all bookings" 링크 → `#/bookings`.

**관련**: P08' · FR-09

---

### SRS-G-021 · P09 OAuth 로그인 (Interstitial)

**구분**: 글로벌서비스 / 보안 / 법규 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/signin?next={url}`. 중앙 카드 — 로고 + H1 "Sign in" + 부제 + Google/Apple 버튼 + Terms/Privacy 안내(`signin_terms`) + 데모 칩(`signin_mock`). 클릭 시 `state.signedIn=true`, `state.profile=PERSONAS[state.persona]`, profile.country 비었으면 P10 강제, 채워졌으면 `next`로 복귀. Phase 2 — Kakao/Naver 추가 검토. 비밀번호 보관 절대 금지. 세션 쿠키 HttpOnly + Secure + SameSite=Lax.

**관련**: P09 · FR-10

---

### SRS-G-022 · P10 온보딩 (시민권 + 기업코드)

**구분**: 글로벌서비스 / 정책 / CMS &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

`#/onboarding?next={url}`. Email readonly(OAuth로부터) + Citizenship 라디오(US/KR 자가신고, hint "Verified at the hospital on arrival.") + Enterprise code 입력(선택, mono uppercase, placeholder `ACME-2026`). 코드 입력 시 PENDING 상태(기본 티어 적용) + "Verify now" 버튼 노출 — admin 승인 시뮬레이션. 가입 1회만 진입, 완료 후 `next` 복귀. 시민권 변경은 이후 CS 경유(도용 방지). 데모 빌드의 Verify 버튼은 `NEXT_PUBLIC_DEMO_MODE` 가드.

**관련**: P10 · FR-11

---

### SRS-G-023 · P11 단일 시술 예약 신청서

**구분**: 글로벌서비스 / 데이터 / 보안 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

`#/book/{hospitalId}/{serviceId}`. 미인증 시 `#/signin?next=...` 리다이렉트. 좌측 폼 3섹션 — **Patient**(name·email 자동, phone, age, gender, nationality, passport+hint), **Travel**(department readonly, visitDate, entryDate, exitDate, hotel, flight, notes), **Add-ons**(3-체크박스 + addon_notes). 우측 sticky 가격(`computePrice` 라이브) + 충돌 발생 시 라디오 카드(`pick_enterprise` / `pick_coupon`). 유효성: 여권 6–12 alphanumeric(`err_passport`), exit > entry(`err_dates`). Submit → `state.bookings[id]` 생성 → `#/booking/{id}`.

**관련**: P11 · FR-12 · FR-PRICING-1

---

### SRS-G-024 · P12 예약 상태 (4-step 타임라인)

**구분**: 글로벌서비스 / 한국API / 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/booking/{id}`. 좌측 Booking detail 카드(병원 photo-tile + 진료과 + 병원명 + 위치 + visitDate + 시술 라인 목록 + 환자 DL with 여권 마스킹 `●●●●●678`). Timeline 카드 4-step: Request submitted ✓ → Forwarded to hospital ✓ → Hospital confirmed (status=confirmed 시) → CS notified for add-ons (부가서비스 체크된 예약만). status=waiting → info 박스 + **Simulate hospital confirmation** 버튼(`#simulate-confirm`, 데모 전용, `simulate_hint` 카피). status=confirmed → success 박스 + `confirmed_summary`. 우측 sticky 가격 breakdown.

**관련**: P12 · FR-13

---

### SRS-G-025 · P13 내 예약 목록

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

`#/bookings`. 빈 상태 — `no_bookings_t`/`no_bookings_s` + Browse CTA → `#/departments`. 채워진 상태 — H1 + booking 카드 md:2 컬럼 그리드. 각 카드(클릭 → `#/booking/{id}`): 작은 photo-tile + 상태 칩(confirmed 녹색/waiting 황색) + booking ID mono + 병원명 + visitDate + 시술 개수 + 총 가격.

**관련**: P13 · FR-14

---

## 2. 공통 위젯 / 동작

### SRS-G-026 · Header (sticky · 6 메뉴 + 언어 토글 + 카트 + 인증 + Start Consultation)

**구분**: 글로벌서비스 / i18n &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

sticky top-0 z-30 + `backdrop-blur-md`. 좌: 로고 + 워드마크 2단 라벨(`brand`/`brand_sub`). 중: 데스크톱 6개 앵커 메뉴(Procedures · Providers · Reviews · Before&After · Guides · Q&A) + SIGNED 시 My bookings 추가. 우: 언어 토글 세그(EN/한국어) · 카트 알약 + 카운트 배지 · 인증 영역(게스트=Sign in, 로그인=프로필 칩+로그아웃 확인) · Primary CTA "Start Consultation". 최상단 검은 리본 — "DEMO PROTOTYPE · interactive walkthrough for CEO review · no real bookings are sent". 모바일 <1024px: 6개 메뉴 숨김.

**관련**: S01 · FR-COMMON

---

### SRS-G-027 · Footer (4-컬럼)

**구분**: 글로벌서비스 / 법규 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

4컬럼 — ① 브랜드 + 1줄 미션 + 법적 고지(`footer_legal`) ② Browse 5개 진료과 + All specialties ③ SafeDoc(How it works/For companies/My bookings) ④ Legal(Privacy/Terms/HIPAA Posture, placeholder 링크). 데모 환경 SNS 링크·실제 주소·전화번호 노출 금지.

**관련**: S02 · FR-COMMON

---

### SRS-G-028 · Persona Panel (플로팅 위젯 · 데모 전용)

**구분**: 데모 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

우하단 fixed bottom-5 right-5 z-40. 접힘 = 동그란 아이콘 + 페르소나 이름 + chevron. 펼침(`data-open=1`) → 폭 340px, 3개 라디오(`us_individual`/`ka_kr_citizen`/`ka_enterprise`) + Signed-in 상태 라벨 + Reset demo 버튼. 240ms cubic-bezier 폭 트랜지션. 전환 시 가격·온보딩·로그인 상태가 즉시 변경되어 시연에서 티어 차이를 한 화면에서 시각화. 카트·쿠폰·예약 데이터는 보존. **프로덕션 빌드에 포함 안 됨** — `NEXT_PUBLIC_DEMO_MODE` 가드로 코드 레벨 제거.

**관련**: S03 · FR-COMMON-1

---

### SRS-G-029 · Toast (aria-live polite)

**구분**: 글로벌서비스 / 접근성 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

하단 중앙 fixed, 자동 닫힘 4초. `bg-ink` 다크 알약 + 흰 텍스트 + `shadow-pop` + z-60. `aria-live="polite"` 슬롯. 주요 트리거 i18n 키 `toast_*` (저장/리셋/쿠폰 적용·오류/기업 승인/요청 전송/병원 확정/카트 추가·제거). 4초+ 주의 필요 메시지(필수 필드 누락 등)는 토스트 대신 인라인 오류.

**관련**: S04 · FR-COMMON

---

### SRS-G-030 · Language toggle (EN/한국어)

**구분**: i18n / 접근성 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

헤더 우측 세그먼트 컨트롤 `.seg`. `aria-pressed` 활성 상태 표시. 클릭 즉시 i18n 키 전체 교체, 디자인 토큰은 그대로. `localStorage[safedoc_demo_v1].lang`에 영속 + `document.documentElement.lang` 동기화 → `:lang(ko)` CSS 분기 활성(라인하이트 1.65). 누락된 키는 EN 기본값 폴백. 모든 UI 문자열은 `T` 사전 키로 정의.

**관련**: FR-COMMON-2

---

## 3. 가격 정책

### SRS-G-031 · 가격 결정 트리 (`computePrice`)

**구분**: 정책 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

```
display_price(service, user) = base_price[tier]
  × (1 − enterprise_discount?)
  × (1 − coupon_discount?)
```
티어 결정: 시민권 KR → KR_RESIDENT, 비-KR → FOREIGNER. 기업 코드 verified → ENTERPRISE 추가. 코드 입력 중 admin 대기 → PENDING(기본 시민권 티어 적용). 적용은 카트·시술 상세·예약 폼·시뮬레이터 모든 화면에서 라이브 계산 + 페르소나 전환 시 즉시 갱신.

**관련**: FR-PRICING / 정책서 §5.1

---

### SRS-G-032 · 할인 충돌 해소 (쿠폰 vs 기업)

**구분**: 정책 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

비-스택 쿠폰(예: `NEW200`, $200 off)과 기업 할인 동시 적용 가능 시 사용자에게 라디오 양자택일 강제(`conflict_title` 카드). 기본 선택은 강한 할인이 자동 미리 선택되나, 사용자가 명시적으로 다른 쪽 선택 가능. 결과는 `state.conflictChoice`에 보존(새로고침 후 유지). 스택 가능 쿠폰(예: `SAFEDOC10`, 10% off)은 충돌 미발생.

**관련**: FR-PRICING-1

---

### SRS-G-033 · 통화 표시 (USD only at demo)

**구분**: 정책 / 결제(P2) &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

데모: USD 단일. Phase 2(Stripe): KRW 옵션 추가. "예상 총액"이 최종 청구액이 아닐 수 있음 면책 + 환율 변동 면책. 한국 의료 부가세 표시(포함/별도) 결정 변호사 사인오프 대기. 테스트 쿠폰 `SAFEDOC10`/`NEW200`은 데모 한정, 출시 전 코드 제거 + 빌드 가드 검증.

**관련**: 정책서 §5.4-5.6

---

## 4. 데이터 · 예약 폼

### SRS-G-034 · 회원가입 데이터 (OAuth + 시민권 + 기업 코드)

**구분**: 데이터 / 보안 / 법규 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

OAuth 제공자(Google/Apple)로부터: 이메일(필수) · 이름(필수) · 프로필 이미지 URL(선택, 노출 안 함). 추가 수집: 시민권 자가신고(KR/non-KR), 기업 코드(선택). 비밀번호 비보관. 13세 미만 가입 차단(COPPA 대응) — 약관 명시 + 가입 시 연령 확인. 만 18세 이상 회원 자격.

**관련**: FR-COLLECT · 정책서 §3.1

---

### SRS-G-035 · 예약 요청 데이터 (단일 폼 일괄 수집)

**구분**: 데이터 / 보안 / 한국API &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

**필수**: 성명, 전화, 연령(18–120), 성별(F/M/O), 여권 번호(6–12 alphanumeric, mono uppercase), 국적, 이메일, 희망 진료과(자동 채움), 희망 방문일, 한국 입국일, 한국 출국일. **선택**: 호텔/지역, 항공편 번호, 추가 메모. **부가서비스 의사**: 숙박/항공/투어 체크박스 + 자유 메모. 유효성: passport `/^[A-Za-z0-9]{6,12}$/`(err_passport), exit > entry(err_dates). 한국 병원 API로 그대로 전달.

**관련**: FR-COLLECT-BOOKING · 정책서 §3.1

---

### SRS-G-036 · 명시적 비수집 데이터 (영구 제외)

**구분**: 데이터 / 정책 / 법규 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

진단명 · 처방 · 임상 노트 · EHR · 영상 · 검사값 · 의료 진료 내역 — 한 줄도 저장하지 않음. 응급 연락처 · 친지 정보 — 예약 코디네이션에 불필요. 결제 정보(카드/계좌) — 데모 미연동, Phase 2 Stripe만 처리. 위치 정보 · 기기 정보 · 광고 식별자 — 분석 도구 도입 결정 후 재평가. 코드 레벨 보장 — 폼 필드·API 페이로드·로그 allowlist에서 모두 제외.

**관련**: FR-NOSCOPE · 정책서 §3.2 · HIPAA Position

---

## 5. 시스템 연동

### SRS-G-037 · 한국 API 클라이언트 (BFF)

**구분**: 한국API / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 5

한국 본사 API 단일 SoT 호출 — 도메인/진료과/병원/시술/예약 요청. TypeScript typed BFF (Next.js Route Handlers). 응답 캐싱(stale-while-revalidate). 인증: 서버 측 API key(절대 클라이언트 노출 금지). 한국어 원문 보존 필드(`kr_phone`/`kr_transport`/`kr_hours`/`kr_landmark` 등)는 라벨만 i18n. 예약 상태 변경은 polling 또는 webhook(M6에서 결정).

**관련**: FR-INTEGRATION-KR-API · 시스템 §7.1

---

### SRS-G-038 · 기업 코드 admin 워크플로우 (CMS)

**구분**: CMS / 정책 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

사용자가 기업 코드 입력 → PENDING 상태 진입(기본 시민권 티어 가격 적용) → SafeDoc admin 검토 1영업일 이내 → verified 처리 → 사용자 자동 통보(이메일) + 가격 자동 갱신. 오프보딩(퇴사)은 기업이 SafeDoc에 통보 → admin이 verified 해제. 도용 의심 패턴(동일 코드 다수 가입, 이메일 도메인 불일치 등) 감지 시 자동 보류 + 본인 확인 요청. 데모에서는 "Simulate admin verification" 버튼(`#verify-now`, P10 온보딩 인라인)으로 즉시 verified 전이.

**관련**: FR-ADMIN-ENTERPRISE · 정책서 §8.2

---

### SRS-G-039 · 예약 상태 동기화 (병원 확정 ↔ 사용자 화면)

**구분**: 한국API / CMS / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

한국 병원이 자체 어드민에서 예약 요청 확인 → 승인(confirmed) 또는 일자 변경 제안 또는 거절. 글로벌 서비스는 polling(60초) 또는 webhook(M6 결정)으로 status 변경 감지 → 사용자 화면 즉시 반영(P12 timeline ✓ + 토스트 `toast_hospital_ok`). 부가서비스 포함 예약은 CS 큐에 동시 노출 → CS가 Slack/이메일로 사용자 응대. 데모: P12의 "Simulate hospital confirmation" 버튼으로 즉시 confirmed 전이.

**관련**: FR-STATUS-SYNC · 시스템 §7.2

---

## 6. 비기능 요구사항 (NFR)

### SRS-G-040 · 스택 (Next.js 15 / React 19 / TypeScript)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

Next.js 15 + React 19 + TypeScript strict + Tailwind CSS(토큰 코드화). App Router + Server Components. 폰트: Pretendard Variable + Fraunces + Playfair Display + JetBrains Mono. 호스팅: Vercel 또는 Cloudflare(데이터 레지던시 결정 후 — 정책서 §10.7). 인증: NextAuth 또는 Clerk(Sprint 0 결정). 관측성: Sentry + PII allowlist scrubber.

**관련**: NFR-STACK · §8.1

---

### SRS-G-041 · CWV 예산 (LCP <2.5s, INP <200ms, CLS <0.1)

**구분**: 글로벌서비스 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

Lighthouse CI 게이트 — LCP < 2.5s / INP < 200ms / CLS < 0.1 / FCP < 1.5s / TBT < 200ms. 모든 이미지 explicit width/height. Hero photo는 `loading="eager"` + `fetchpriority="high"`. 나머지 `loading="lazy"`. 폰트 최대 2 family + `font-display: swap`. JS 번들 < 150kb gzipped (landing) / < 300kb (앱 페이지). 애니메이션은 transform/opacity만(레이아웃 변경 금지).

**관련**: NFR-PERF · §8.2

---

### SRS-G-042 · 접근성 (WCAG 2.2 AA)

**구분**: 접근성 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

WCAG 2.2 AA 준수 — 색 대비 ≥4.5:1, focus-visible(2px brand-500 outline + 2mm offset), 모든 폼 라벨 명시적 연결, ARIA 적절 사용. `:lang(ko)` line-height 1.65 / EN 1.55 분기. `prefers-reduced-motion` 존중(마퀴·hover 트랜지션 정지). 키보드 흐름: 헤더 메뉴 → 본문 → 사이드 → 푸터. axe DevTools 게이트 통과 + 키보드 탭 순회 1회 + 색약 시뮬레이션 검증.

**관련**: NFR-A11Y · §8.3

---

### SRS-G-043 · 보안 (TLS 1.3 + HSTS + CSP + PII 마스킹)

**구분**: 보안 / 법규 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

TLS 1.3 강제, HTTPS-only(301 redirect). HSTS max-age=31536000 + includeSubDomains + preload(변호사 사인오프 대기). CSP nonce 기반(unsafe-inline 금지). X-Frame DENY · X-Content-Type-Options nosniff · Referrer-Policy strict-origin-when-cross-origin · Permissions-Policy(camera/mic/geolocation 차단). 여권 번호·여행 일정 등 PII는 KMS-managed key AES-256(envelope encryption). 모든 로그(Sentry/CloudWatch/Vercel)는 PII allowlist scrubber 통과. raw passport·이메일·전화는 로그 인입 금지.

**관련**: NFR-SEC · §8.4 · 정책서 §10

---

### SRS-G-044 · i18n 사전 (EN/KO 양 언어 + KR DB 번역)

**구분**: i18n / 한국API &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`next-intl` 또는 동등. 모든 UI 문자열은 `T` 키로 정의(EN/KO 양 언어 필수). 누락 키는 EN 폴백. 병원/진료과/시술 명칭은 한국 DB 번역(en/ko) 그대로 사용 — 라벨만 i18n. 날짜/통화/숫자 포맷은 사용자 로케일 기준. KO/EN 라인하이트 별도 튜닝 — `:lang(ko) { line-height: 1.65; }`. 자동 언어 감지(Accept-Language) + 수동 토글 + localStorage 영속.

**관련**: NFR-I18N · §8.5

---

## 7. 법규 · 컴플라이언스

### SRS-G-045 · HIPAA · Option C (non-HIPAA + TX HB 300 + CCPA/CPRA + PIPA)

**구분**: 법규 / 정책 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`.pm/legal/hipaa-position.md` 기준 권고 포지션 Option C. **non-HIPAA** — Covered Entity/Business Associate 아님(PHI 비수집·비저장). **Texas HB 300 적용** — Texas LLC 운영, 건강정보 광범위 정의 대응(사고 통보 60일 개인/30일 AG, 워크포스 교육 90일 채용 후 + 6년 기록). **CCPA/CPRA 적용** — 사용자 권리 페이지 + DSAR 폼(Know/Delete/Correct/Portability/Limit SPI). **PIPA 적용** — 한국 본사로의 국외 이전 동의 + DPA. 외부 변호사 사인오프 대기 7개 미해결 질문 closeout 후 게시.

**관련**: NFR-LEGAL · §9 · 정책서 §10.6

---

### SRS-G-046 · PIPA 국외 이전 동의 UI

**구분**: 법규 / 정책 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

미국 거주자 데이터를 한국 본사 + 선택 병원으로 이전. 동의 화면에서 명시 고지 — 받는 자 · 국가(한국) · 목적(병원 예약 접수) · 항목(§3.5 표) · 보유 기간(§3.4 표) · 거부 시 결과(서비스 이용 불가). 동의 위치(가입 vs 예약 단계) 및 민감정보(진료과)·고유식별정보(여권) 별도 체크박스 분리 여부 — **변호사 사인오프 대기**. 동의 기록 5년 보관(IP·타임스탬프·동의 버전·항목별). 동의 철회는 계정 설정 또는 `privacy@safedoc.io`.

**관련**: NFR-LEGAL-PIPA · 정책서 §3.6 · §7

---

### SRS-G-047 · CCPA/CPRA 권리 페이지 + DSAR

**구분**: 법규 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P1 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

캘리포니아 거주자(추후 전 미국 거주자 확대) 권리 노출 — Right to Know · Delete · Correct · Portability · Opt-out of Sale/Share(현재 판매·공유 없음) · Limit Use of SPI(여권·시민권·진료과 카테고리). DSAR 폼 1개 — 이메일 인증 후 요청 접수. 45일 응답(45일 추가 연장 가능). 사용자에게 응답 SLA 명시.

**관련**: NFR-LEGAL-CCPA · 정책서 §3.7

---

## 8. 데모 전용 (프로덕션 미반영)

### SRS-G-048 · Persona Panel (FR-COMMON-1 데모 전용)

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0

SRS-G-028 참조. 본 항목은 **출시 시 제거** 책임만 별도 표기. `NEXT_PUBLIC_DEMO_MODE !== 'true'` 시 렌더 차단. 코드 리뷰 시 가드 누락 차단 필수.

**관련**: FR-COMMON-1

---

### SRS-G-049 · Simulate hospital confirmation 버튼

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

P12 예약 상태 화면에서 한국 admin 없이 WAITING → CONFIRMED 즉시 전이. 청록 톤 dev 카드(`bg-info-100`), id `simulate-confirm`. 클릭 시 `state.bookings[id].status='confirmed'` + 토스트 `toast_hospital_ok` + 즉시 re-render. 출시 빌드에서 `NEXT_PUBLIC_DEMO_MODE` 가드로 제거. 카피 `simulate_hint` "Dev control: advance booking to 'confirmed' without the Korean admin."

**관련**: FR-DEMO-CONFIRM · P12

---

### SRS-G-050 · Simulate admin verification 버튼 (P10 온보딩)

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

P10 온보딩에서 기업 코드 입력 후 admin 승인 시뮬레이션. id `verify-now`. 클릭 시 `state.profile.enterpriseStatus='verified'` + 토스트 `toast_ent_verified`. 출시 시 제거. 코드 입력 후 PENDING 상태에서만 노출, 미입력 시 미노출.

**관련**: FR-DEMO-VERIFY · P10

---

### SRS-G-051 · 데모 리셋 (Persona Panel 내부)

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

Persona Panel 펼친 상태에서 노출되는 빨강 텍스트 버튼 "Reset demo". `localStorage[safedoc_demo_v1]` 전체 초기화 + `#/`로 이동 + 토스트 `toast_reset`. 출시 시 제거.

**관련**: FR-DEMO-RESET

---

## 9. 성공 기준 (Demo Acceptance)

### SRS-G-052 · 5/15 데모 어셉턴스 시나리오

**구분**: 정책 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

2026-05-15 데모일에 리뷰어가 다음 8단계 시나리오를 처음부터 끝까지 수행할 수 있어야 한다 — (1) 한인 페르소나로 Google 로그인, (2) 한국 시민권 자가신고 → KR_RESIDENT 가격 확인, (3) 기업 코드 입력 → admin 승인 시뮬레이션 후 할인가로 플립 확인, (4) EN/KO 토글로 진료과·병원·시술 명칭 모두 번역됨 확인, (5) Browse → Dermatology → Samsung Medical Center → Medical Laser Treatment 진입, (6) 모든 필수 필드 채워 예약 요청 제출, (7) Simulate 버튼으로 CONFIRMED 전이 확인, (8) 부가서비스 요청 CS 큐 노출 확인. **비-목표**: 결제 X, 환불 X, 네이티브 앱 X.

**관련**: §11 Demo Acceptance

---

## 10. Phase 2 후보 (DEFERRED — M7+)

### SRS-G-053 · Stripe 결제 + KRW 통화 옵션

**구분**: 결제(P2) / 법규 &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 15

M7(2026-08) 진입. Stripe Checkout 또는 Payment Intents API. 환불 처리 코드 enforcement(정책서 §6.2 — 100%/90%/부분/0%). PCI-DSS 준수. 결제 정보는 글로벌 서비스에 절대 저장 안 함(Stripe direct). KRW 옵션 사용자 선택(환율은 Stripe FX).

**관련**: §10.1 · Phase 2

---

### SRS-G-054 · Flutter Web / 네이티브 iOS·Android

**구분**: 결제(P2) / 디자인 &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 60

데모는 반응형 웹으로 모바일 커버. Phase 2에서 Flutter Web 보류 여부 확정 후 진행. 네이티브 앱 — App Store/Play Store 제출 + iOS Health 통합 검토(비스코프). 디자인 시스템 코드화 완성 전제.

**관련**: §10.1

---

### SRS-G-055 · 실시간 슬롯 / 캘린더 동기화

**구분**: 한국API / 결제(P2) &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 20

한국 본사 API 확장 필요 — 병원별 실시간 슬롯 노출(시간대별). 사용자가 직접 시간 선택. M6 안정 이후 평가. v1은 비동기 컨펌(WAITING → CONFIRMED) 패턴 유지.

**관련**: §10.1

---

### SRS-G-056 · 인앱 CS 채팅 / Kakao·Naver 로그인 / 서류 검증

**구분**: 결제(P2) / 법규 &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 40

인앱 채팅 — CS ↔ User 직접 메시지(이메일 인입 대체). Kakao/Naver — 한국 거주자 대응 추가 OAuth. 여권/시민권 서류 검증 — v1은 자가신고, 검증 도입은 법무·KYC 비용 평가 후.

**관련**: §10.1

---

## 11. 영구 비스코프 (Permanent Out-of-scope)

### SRS-G-057 · EHR · CCDA · LLM 임상 요약 (v1+ 영구 비스코프)

**구분**: 법규 / 데이터 &nbsp;|&nbsp; **Priority**: — &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: —

EHR 통합 · SMART-on-FHIR · CCDA 인테이크 · 의료 문서 OCR · 임상 의사결정 지원 · LLM 임상 요약/진단 서포트 — **본 제품에서 영구 비스코프**. 이런 기능을 추가하면 HIPAA Position이 완전히 뒤집힘(BAA 필요, Covered Entity 트리거). 이 경계는 제품 정체성의 핵심. 변경 시 변호사 동의 + HIPAA Position 재작성 필수.

**관련**: §10.2 · HIPAA Position §1

---

## 부록 A · 구분(Category) 태그 정의

| 태그 | 의미 |
|------|------|
| **글로벌서비스** | US-facing Next.js 프론트엔드, BFF Route Handlers |
| **한국API** | 한국 본사 API 호출, KR DB 필드 매핑 |
| **CMS** | SafeDoc 내부 admin — 기업 인증 / 예약 큐 / CS 노트 |
| **정책** | 가격 · 환불 · 보유 기간 · 인증 · 콘텐츠 정책 |
| **법규** | HIPAA · TX HB 300 · CCPA/CPRA · PIPA · COPPA · CAN-SPAM |
| **데이터** | 수집/제외 항목, 유효성, 보유 기간 |
| **보안** | 암호화 · 로그 마스킹 · 권한 · 사고 대응 |
| **접근성** | WCAG 2.2 AA · 키보드 · `prefers-reduced-motion` |
| **i18n** | EN/KO 사전, 라인하이트 분기, KR DB 번역 |
| **디자인** | 토큰 · 컴포넌트 · 시각 직관 |
| **데모** | `NEXT_PUBLIC_DEMO_MODE` 가드 — 출시 시 제거 |
| **결제(P2)** | Phase 2 이관 — Stripe · KRW |
| **B2B** | 기업 페르소나 · ACME · 협상 할인 |

---

## 부록 B · 우선순위 정의

| Priority | 의미 |
|----------|------|
| **P0** | MUST — 2026-05-15 데모일 어셉턴스 시나리오 필수 |
| **P1** | SHOULD — 2026 M5–M6 일반 출시 진입 전 |
| **P2** | DEFERRED — Phase 2(M7+) 이관, 데모 비스코프 |

## 부록 C · 상태 정의

| 상태 | 의미 |
|------|------|
| **미정** | 계획됨, 미착수 |
| **진행중** | R 배정됨, 작업 중 |
| **완료** | 산출물 검증됨 |
| **보류** | 외부 종속(변호사·KR본사·결정 큐)으로 차단 |

---

## 부록 D · 관련 문서

| 문서 | 위치 |
|------|------|
| 요구사항정의서 (산문형 A4) | `docs/requirements-definition.html` v1.1 |
| UI/UX 기획서 (페이지 카드 + 스크린샷) | `docs/ui-ux-plan.html` v1.1.3 |
| WBS (작업 분해 구조) | `docs/wbs.html` v1.0 |
| 정책서 (Privacy/ToS/환불/콘텐츠 통합) | `docs/policies.html` v1.0 |
| HIPAA Posture (변호사 검토 근거) | `.pm/legal/hipaa-position.md` |
| 제품 브리프 | `.pm/product-brief.md` |
| 프로토타입 (vanilla HTML+JS) | `prototype/demo.html` v1.1 (3,481줄) |
| v1.1 스크린샷 19장 | `docs/screenshots/v11/` |

---

> 본 SRS 리스트는 데모 D-1까지 매일 PM이 갱신한다. 신규 SRS 추가 시 마지막 번호 +1, 삭제 시 본 문서에 strike-through로 보존. 우선순위·상태 변경은 본 문서를 SoT로 한다.
