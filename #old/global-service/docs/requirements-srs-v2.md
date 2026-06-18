# SafeDoc Global Service · 요구사항정의서 v2 (SRS · Notion-import · 개발 관점 슬림)

> Notion 데이터베이스 또는 페이지로 그대로 import 가능한 형식.
> 각 항목 = **번호 (H3 헤더)** + **메타 라인** (구분 · Priority · 상태 · 개발 예상일정) + **설명 본문**.
> 출처: `prototype/demo.html` v1.1, `docs/requirements-definition.html` v1.1, `docs/ui-ux-plan.html` v1.1.3.
> 버전 v2.2 · 2026-05-15 · 데모 D-0.
> **v1 → v2 변경사항**: 정책·법규 종속 요구사항 삭제(SRS-G-045/046/047/057 제거), 순수 개발 관점 요구사항만 보존, 항목 번호 001~053으로 재매김.
> **v2.0 → v2.1 변경사항**: KR Python API 의존 제거(SRS-G-037 재작성), 데이터 계층 신규 항목 SRS-G-DB-001~016 추가, 카테고리 태그 정비(`한국API` → `데이터베이스`), 운영자 계약 인터페이스(SRS-G-038 갱신) + `audit_log.actor_id` prefix 구조화.
> **v2.1 → v2.2 변경사항**: 신규 라우트 5종(P15~P19) SRS 항목 8개 추가(SRS-G-054~061), DB schema 보강 4개(SRS-G-DB-017~020), 폰트 stack serif 2종 제거, 한국어 word-break keep-all 정책 추가.

---

## 컬럼 정의 (Notion DB 스키마)

| 컬럼 | 타입 | 옵션 |
|------|------|------|
| 번호 | Text (Title) | `SRS-G-001` ~ |
| 요구사항 명칭 | Text | H3 헤더와 동일 |
| 구분 | Multi-select | `글로벌서비스` / `데이터베이스` / `CMS` / `데이터` / `보안` / `접근성` / `i18n` / `디자인` / `데모` / `결제(P2)` / `B2B` / `운영자계약` |
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

**구분**: 글로벌서비스 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

동의 기반 케이스 그리드. before/after 이미지 + 회복 기간 라벨(`hp_ba_recovery`) + 검증 마크(`hp_ba_verified`) + 디스클레이머 `BA_DISCLAIMER_DEFAULT` 양 언어. 신원 차단(눈가림·모자이크) 정책 구현.

**관련**: P01-D · FR-01.4

---

### SRS-G-006 · 랜딩 Reviews wall (sd-paper · #reviews)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

미국 환자 후기 카드 3종 (white/navy/blue 색 블록). 가명(`hp_story_*_name`)·메타 정보(`hp_story_*_meta`)·5-스타·환자 인용문(`hp_story_*_quote`). `REVIEW_DISCLAIMER_DEFAULT` EN/KO 양 언어 고정 노출 — "결과는 개인에 따라 달라질 수 있으며, 후기는 작성자의 개인적 경험을 바탕으로 합니다." "더 보기" 진입.

**관련**: P01-E · FR-01.5

---

### SRS-G-007 · 랜딩 Providers (sd-navy · #providers)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

의료진 자격 검증 정책 4개 번호 불릿(KSAPS · ISAPS · KDA · JCI) + 떠다니는 의료진 카드 3종(이니셜 아바타 + 자격 + 클리닉). 인용 1개(`hp_provider_quote` + `hp_provider_quote_attr`). 환자 후기 수·시술 횟수·만족도 % 등 마케팅 콘텐츠는 법규 검수 후 노출.

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

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 4

`#/hospital/{id}?tab={services|overview|reviews|location}`. 상단 photo-tile Hero(병원 팔레트, 240~340px) + 외국인 친화 인증 칩(`kr_foreigner_friendly`). sticky 4-탭 스트립 `role="tablist"`, 좌/우 키 이동. **Services**: `<details>` 아코디언 시술 행, summary에 가격 라인업 즉시 노출. open 시 설명 + Add to cart / Book now. **Overview**: highlights · accreditation · about + 글로벌 i18n 필드(`name_i18n` · `address_i18n` · `working_hours` · `transport_i18n` · `landmark_i18n` · `notice_i18n`). **Reviews**: `tab_reviews_stub` placeholder. **Location**: `tab_location_stub` placeholder(P2 네이버·Google 지도 연동). 우측 sticky 가격 카드(대표 시술 자동 선정 + `cta_book`) + 쿠폰 입력 카드(`coupon_prompt` + `coupon_apply` + `coupon_try` 힌트) + Contact 카드.

**관련**: P05 · FR-04

---

### SRS-G-017 · P06 시술 상세 (글로벌 i18n 필드)

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2.5

`#/service/{id}`. photo-tile Hero(병원 팔레트, 240~320px) + 진료과·병원 칩(클릭 시 P05) + H1 EN + KO 부제. 좌측 본문은 글로벌 자체 i18n 필드 직접 조회(commit 181a8f5): `details_i18n.description`(Overview) · `details_i18n.included[]`(Included, 비면 섹션 숨김) · `details_i18n.process[]`(Process, 번호 매김) · `details_i18n.preparation[]`/`details_i18n.aftercare[]` 2-컬럼(preparation이 비면 `svc_no_prep` 안내). 같은 병원 다른 시술 미니카드 최대 3종. 우측 sticky 가격 카드 + `svc_add_cart`/`svc_in_cart` 토글 + `svc_book_now` → `#/book/{hospitalId}/{serviceId}`.

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

**구분**: 글로벌서비스 / 보안 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/signin?next={url}`. 중앙 카드 — 로고 + H1 "Sign in" + 부제 + Google/Apple 버튼 + Terms/Privacy 안내(`signin_terms`) + 데모 칩(`signin_mock`). 클릭 시 `state.signedIn=true`, `state.profile=PERSONAS[state.persona]`, profile.country 비었으면 P10 강제, 채워졌으면 `next`로 복귀. Phase 2 — Kakao/Naver 추가 검토. 비밀번호 보관 절대 금지. 세션 쿠키 HttpOnly + Secure + SameSite=Lax.

**관련**: P09 · FR-10

---

### SRS-G-022 · P10 온보딩 (시민권 + 기업코드)

**구분**: 글로벌서비스 / CMS &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

`#/onboarding?next={url}`. Email readonly(OAuth로부터) + Citizenship 라디오(US/KR 자가신고) + Enterprise code 입력(선택, mono uppercase, placeholder `ACME-2026`). 코드 입력 시 PENDING 상태(기본 티어 적용) + "Verify now" 버튼 노출 — admin 승인 시뮬레이션. 가입 1회만 진입, 완료 후 `next` 복귀. 시민권 변경은 이후 CS 경유(도용 방지). 데모 빌드의 Verify 버튼은 `NEXT_PUBLIC_DEMO_MODE` 가드.

**관련**: P10 · FR-11

---

### SRS-G-023 · P11 단일 시술 예약 신청서

**구분**: 글로벌서비스 / 데이터 / 보안 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

`#/book/{hospitalId}/{serviceId}`. 미인증 시 `#/signin?next=...` 리다이렉트. 좌측 폼 3섹션 — **Patient**(name·email 자동, phone, age, gender, nationality, passport+hint), **Travel**(department readonly, visitDate, entryDate, exitDate, hotel, flight, notes), **Add-ons**(3-체크박스 + addon_notes). 우측 sticky 가격(`computePrice` 라이브) + 충돌 발생 시 라디오 카드(`pick_enterprise` / `pick_coupon`). 유효성: 여권 6–12 alphanumeric(`err_passport`), exit > entry(`err_dates`). Submit → `state.bookings[id]` 생성 → `#/booking/{id}`.

**관련**: P11 · FR-12 · FR-PRICING-1

---

### SRS-G-024 · P12 예약 상태 (4-step 타임라인)

**구분**: 글로벌서비스 / 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/booking/{id}`. 좌측 Booking detail 카드(병원 photo-tile + 진료과 + 병원명 + 위치 + visitDate + 시술 라인 목록 + 환자 DL with 여권 마스킹 `●●●●●678`). Timeline 카드 4-step: Request submitted ✓ → Forwarded to hospital ✓ → Hospital confirmed (status=confirmed 시) → CS notified for add-ons (부가서비스 체크된 예약만). status=waiting → info 박스 + **Simulate hospital confirmation** 버튼(`#simulate-confirm`, 데모 전용, `simulate_hint` 카피). status=confirmed → success 박스 + `confirmed_summary`. 우측 sticky 가격 breakdown.

**관련**: P12 · FR-13

---

### SRS-G-025 · P13 내 예약 목록

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

`#/bookings`. 빈 상태 — `no_bookings_t`/`no_bookings_s` + Browse CTA → `#/departments`. 채워진 상태 — H1 + booking 카드 md:2 컬럼 그리드. 각 카드(클릭 → `#/booking/{id}`): 작은 photo-tile + 상태 칩(confirmed 녹색/waiting 황색) + booking ID mono + 병원명 + visitDate + 시술 개수 + 총 가격.

**관련**: P13 · FR-14

---

### SRS-G-054 · P15 Providers — list (필터 4종)

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/providers?spec=&loc=&eng=1&intl=1`. sd-paper 헤더 + sd-mist 필터바(specialty · location · english_support · international_ward 4종 select+checkbox). 카드 그리드 3-col(md). empty state. `gs.hospitals.global_is_published=true AND foreigner_friendly=true` 필터. 검색 결과 카운트.

**관련**: P15 · FR-15.1

---

### SRS-G-055 · P15 Providers — detail (navy hero · 신뢰 배지 · 시술/리뷰/B&A · Q&A CTA)

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

`#/providers/{hospitalId}`. Navy 배경 hero(병원 사진 + 이름 + 주소 + star rating) + 신뢰 배지(JCI/KSAPS/ISAPS/KDA/English 아이콘 표시). 3섹션: **Programs**(진료과별 시술 카드 그리드), **Patient reviews**(별점+콘텐츠 카드 목록), **Before & After**(케이스 그리드). 하단 CTA "Ask a question" → Q&A 카테고리 선택 → CS 인입.

**관련**: P15 · FR-15.2

---

### SRS-G-056 · P16 Reviews — 필터 3종 + 디스클레이머

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/reviews?rating=&hospital=&specialty=`. 필터바(rating 1–5 · hospital · specialty 3종 select/checkbox). 리뷰 카드(별점 + 병원 + 진료과 + 콘텐츠 + 가명 + 날짜). `REVIEW_DISCLAIMER_DEFAULT` 양 언어 상단 고정 노출. 정렬: 최신순/높은 점수순.

**관련**: P16 · FR-16

---

### SRS-G-057 · P17 Before & After — list (필터 3종 + 신원 차단)

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/beforeafter?specialty=&hospital=&program=`. 필터바(specialty · hospital · program 3종). Before/after 이미지 그리드(3-col md). 신원 차단(눈가림·모자이크) 강제 — `identity_masked=true`만 노출. 사진당 회복 기간(`recovery_period_days`) 라벨.

**관련**: P17 · FR-17

---

### SRS-G-058 · P17 Before & After — detail + 동의 메타 디스클레이머

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

`#/beforeafter/{caseId}`. 전체 화면 hero(before/after 나란히 + 슬라이더 또는 탭). 병원 · 진료과 · 시술명 · 회복 기간. `BA_DISCLAIMER_DEFAULT` + 동의 메타(`consent_meta` JSONB 표시 — 환자 동의 날짜/버전). 신원 차단 정책 재확인.

**관련**: P17 · FR-17.2

---

### SRS-G-059 · P18 Blog — list (카테고리 필터 + SEO)

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P1 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/blog?category=`. 필터바(category select). 글 카드 목록(썸네일 + 제목 + 발행일 + 작가 + 발췌). `gs.blog_posts` (slug UNIQUE, title_i18n JSONB, body_i18n JSONB, category, tags TEXT[], published_at, featured bool). SEO 메타 `og:title` / `og:description` / `og:image` / `canonical`.

**관련**: P18 · FR-18

---

### SRS-G-060 · P18 Blog — detail + 추천 글 + 공유

**구분**: 글로벌서비스 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P1 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`#/blog/{slug}`. 전체 글 본문(마크다운 또는 리치 텍스트) + 발행일 + 카테고리 + 태그. 하단: **Related posts** 3개(같은 카테고리 또는 태그 기준), **Share** 버튼(Copy link · Email · Twitter · LinkedIn · KakaoTalk).

**관련**: P18 · FR-18.2

---

### SRS-G-061 · P19 Q&A — 카테고리 아코디언 + CS 인입 감소

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

`#/faq`. Accordion 컴포넌트(카테고리별 아코디언 — Procedures · Providers · Travel · Costs · Other). 각 아코디언에 Q&A pairs (질문 + 답변). 검색 바 상단. 하단 CTA "Didn't find an answer?" → Contact CS form. CS 이메일 인입 50% 감소 목표(FAQ 자가해결 유도).

**관련**: P19 · FR-19

---

## 2. 공통 위젯 / 동작

### SRS-G-026 · Header (sticky · 6 메뉴 + 언어 토글 + 카트 + 인증 + Start Consultation)

**구분**: 글로벌서비스 / i18n &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1.5

sticky top-0 z-30 + `backdrop-blur-md`. 좌: 로고 + 워드마크 2단 라벨(`brand`/`brand_sub`). 중: 데스크톱 6개 앵커 메뉴(Procedures · Providers · Reviews · Before&After · Guides · Q&A) + SIGNED 시 My bookings 추가. 우: 언어 토글 세그(EN/한국어) · 카트 알약 + 카운트 배지 · 인증 영역(게스트=Sign in, 로그인=프로필 칩+로그아웃 확인) · Primary CTA "Start Consultation". 최상단 검은 리본 — "DEMO PROTOTYPE · interactive walkthrough for CEO review · no real bookings are sent". 모바일 <1024px: 6개 메뉴 숨김.

**관련**: S01 · FR-COMMON

---

### SRS-G-027 · Footer (4-컬럼)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

4컬럼 — ① 브랜드 + 1줄 미션 + 법적 고지(`footer_legal`) ② Browse 5개 진료과 + All specialties ③ SafeDoc(How it works/For companies/My bookings) ④ Legal(Privacy/Terms, placeholder 링크). 데모 환경 SNS 링크·실제 주소·전화번호 노출 금지.

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

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

```
display_price(service, user) = base_price[tier]
  × (1 − enterprise_discount?)
  × (1 − coupon_discount?)
```
티어 결정: 시민권 KR → KR_RESIDENT, 비-KR → FOREIGNER. 기업 코드 verified → ENTERPRISE 추가. 코드 입력 중 admin 대기 → PENDING(기본 시민권 티어 적용). 적용은 카트·시술 상세·예약 폼·시뮬레이터 모든 화면에서 라이브 계산 + 페르소나 전환 시 즉시 갱신.

**관련**: FR-PRICING

---

### SRS-G-032 · 할인 충돌 해소 (쿠폰 vs 기업)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

비-스택 쿠폰(예: `NEW200`, $200 off)과 기업 할인 동시 적용 가능 시 사용자에게 라디오 양자택일 강제(`conflict_title` 카드). 기본 선택은 강한 할인이 자동 미리 선택되나, 사용자가 명시적으로 다른 쪽 선택 가능. 결과는 `state.conflictChoice`에 보존(새로고침 후 유지). 스택 가능 쿠폰(예: `SAFEDOC10`, 10% off)은 충돌 미발생.

**관련**: FR-PRICING-1

---

### SRS-G-033 · 통화 표시 (USD only at demo)

**구분**: 결제(P2) &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

데모: USD 단일. Phase 2(Stripe): KRW 옵션 추가. "예상 총액"이 최종 청구액이 아닐 수 있음 면책. 테스트 쿠폰 `SAFEDOC10`/`NEW200`은 데모 한정, 출시 전 코드 제거 + 빌드 가드 검증.

**관련**: 결제 정책 참조

---

## 4. 데이터 · 예약 폼

### SRS-G-034 · 회원가입 데이터 (OAuth + 시민권 + 기업 코드)

**구분**: 데이터 / 보안 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

OAuth 제공자(Google/Apple)로부터: 이메일(필수) · 이름(필수) · 프로필 이미지 URL(선택, 노출 안 함). 추가 수집: 시민권 자가신고(KR/non-KR), 기업 코드(선택). 비밀번호 비보관. 13세 미만 가입 차단 — 약관 명시 + 가입 시 연령 확인. 만 18세 이상 회원 자격.

**관련**: FR-COLLECT

---

### SRS-G-035 · 예약 요청 데이터 (단일 폼 일괄 수집)

**구분**: 데이터 / 보안 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

**필수**: 성명, 전화, 연령(18–120), 성별(F/M/O), 여권 번호(6–12 alphanumeric, mono uppercase, AES-256 암호화 저장), 국적, 이메일, 희망 진료과(자동 채움), 희망 방문일, 한국 입국일, 한국 출국일. **선택**: 호텔/지역, 항공편 번호, 추가 메모. **부가서비스 의사**: 숙박/항공/투어 체크박스 + 자유 메모. 유효성: passport `/^[A-Za-z0-9]{6,12}$/`(err_passport), exit > entry(err_dates). 여권 암호화 이후 글로벌 DB(`gs` schema) `bookings.patient_profile_snapshot`에 저장.

**관련**: FR-COLLECT-BOOKING

---

### SRS-G-036 · 명시적 비수집 데이터 (영구 제외)

**구분**: 데이터 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

진단명 · 처방 · 임상 노트 · EHR · 영상 · 검사값 · 의료 진료 내역 — 한 줄도 저장하지 않음. 응급 연락처 · 친지 정보 — 예약 코디네이션에 불필요. 결제 정보(카드/계좌) — 데모 미연동, Phase 2 Stripe만 처리. 위치 정보 · 기기 정보 · 광고 식별자 — 분석 도구 도입 결정 후 재평가. 코드 레벨 보장 — 폼 필드·API 페이로드·로그 allowlist에서 모두 제외.

**관련**: FR-NOSCOPE

---

## 5. 시스템 연동

### SRS-G-037 · 데이터베이스 클라이언트 (Prisma) + BFF Route Handlers

**구분**: 데이터베이스 / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 5

Next.js Route Handlers가 Prisma로 KR PostgreSQL(`gs` schema)에 직결. 별도 KR Python API 없음. Prisma `previewFeatures = ["multiSchema"]` 활성화, 모든 모델 `@@schema("gs")` 어노테이션. 환경변수: `DATABASE_URL`은 PgBouncer 경유(transaction mode, `?pgbouncer=true&connection_limit=1`), `DIRECT_URL`은 마이그레이션 전용 직결. 트랜잭션 경계는 Route Handler 단위. 핵심 시나리오: ①카트 추가(UNIQUE 충돌 시 UPSERT) ②예약 제출(cart_lines FOR UPDATE → reservation_groups UPSERT → bookings + booking_services + booking_status_history + coupon_redemptions + audit_log 단일 트랜잭션) ③기업 검증(낙관적 잠금 + audit_log) ④페르소나 스위치(demo_state upsert + cart_lines computed_price 무효화). 슬로우 쿼리 임계 200ms, Sentry 자동 계측.

**관련**: FR-INTEGRATION-KR-API

---

### SRS-G-038 · 운영자 페이지(타팀) 인터페이스 계약

**구분**: 운영자계약 / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

병원관리자페이지·세이프닥관리자페이지(타팀 책임)는 동일 KR PostgreSQL의 `gs` schema를 별 채널로 R/W. 우리(글로벌 웹사이트)와의 인터페이스는 (1) `gs` schema의 컬럼·ENUM 값 계약 (2) `audit_log.actor_id` 구조화 prefix 컨벤션 — `user:<uuid>` / `hop:<staff_id>` / `sd:<admin_id>` / `system:<job_name>` 두 가지뿐. ENUM 값 추가는 양 팀 합의 후 마이그레이션, 삭제는 금지. `bookings.status` 운영자가 변경 시 `booking_status_history`에 새 row INSERT. `coupons.used_count` 직접 수정 금지(우리 트랜잭션만 증감). `audit_log` UPDATE/DELETE 금지. 운영자 화면 자체는 우리 스코프 외, 다만 schema 정합성 보장은 우리 책임. 운영자용 편의 뷰 `gs.v_booking_admin` 제공 권장.

**관련**: FR-ADMIN-ENTERPRISE

---

### SRS-G-039 · 예약 상태 동기화 (병원 확정 ↔ 사용자 화면)

**구분**: 한국API / CMS / 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 3

한국 병원이 자체 어드민에서 예약 요청 확인 → 승인(confirmed) 또는 일자 변경 제안 또는 거절. 글로벌 서비스는 polling(60초) 또는 webhook(M6 결정)으로 status 변경 감지 → 사용자 화면 즉시 반영(P12 timeline ✓ + 토스트 `toast_hospital_ok`). 부가서비스 포함 예약은 CS 큐에 동시 노출 → CS가 Slack/이메일로 사용자 응대. 데모: P12의 "Simulate hospital confirmation" 버튼으로 즉시 confirmed 전이.

**관련**: FR-STATUS-SYNC

---

## 6. 비기능 요구사항 (NFR)

### SRS-G-040 · 스택 (Next.js 15 / React 19 / TypeScript)

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

Next.js 15 + React 19 + TypeScript strict + Tailwind CSS(토큰 코드화). App Router + Server Components. 폰트: Pretendard Variable + JetBrains Mono(코드 전용). 디스플레이는 sans `.sd-display`. **DB**: KR PostgreSQL 공유 인스턴스의 `gs` schema(글로벌 전용). ORM Prisma(multiSchema). Pooler: PgBouncer(transaction mode). **인증**: NextAuth v5 + Prisma Adapter + DB Session. Google/Apple OAuth. **캐시**: Vercel KV(Seoul). **호스팅**: Vercel + Secure Compute → KR VPC. 글로벌 사용자 region hint Tokyo/Seoul. **관측성**: Sentry + PII allowlist scrubber.

**관련**: NFR-STACK

---

### SRS-G-041 · CWV 예산 (LCP <2.5s, INP <200ms, CLS <0.1)

**구분**: 글로벌서비스 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

Lighthouse CI 게이트 — LCP < 2.5s / INP < 200ms / CLS < 0.1 / FCP < 1.5s / TBT < 200ms. 모든 이미지 explicit width/height. Hero photo는 `loading="eager"` + `fetchpriority="high"`. 나머지 `loading="lazy"`. 폰트 최대 2 family + `font-display: swap`. JS 번들 < 150kb gzipped (landing) / < 300kb (앱 페이지). 애니메이션은 transform/opacity만(레이아웃 변경 금지).

**관련**: NFR-PERF

---

### SRS-G-042 · 접근성 (WCAG 2.2 AA)

**구분**: 접근성 / 디자인 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

WCAG 2.2 AA 준수 — 색 대비 ≥4.5:1, focus-visible(2px brand-500 outline + 2mm offset), 모든 폼 라벨 명시적 연결, ARIA 적절 사용. `:lang(ko)` line-height 1.65 / EN 1.55 분기. 한국어 본문은 `word-break: keep-all` (`.ko-keep-all` 유틸 클래스) 강제로 어절 단위 줄바꿈 보장 — 본문·카드·네비·푸터 모든 영역에 적용. `prefers-reduced-motion` 존중(마퀴·hover 트랜지션 정지). 키보드 흐름: 헤더 메뉴 → 본문 → 사이드 → 푸터. axe DevTools 게이트 통과 + 키보드 탭 순회 1회 + 색약 시뮬레이션 검증.

**관련**: NFR-A11Y

---

### SRS-G-043 · 보안 (TLS 1.3 + HSTS + CSP + PII 마스킹)

**구분**: 보안 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

TLS 1.3 강제, HTTPS-only(301 redirect). HSTS max-age=31536000 + includeSubDomains + preload. CSP nonce 기반(unsafe-inline 금지). X-Frame DENY · X-Content-Type-Options nosniff · Referrer-Policy strict-origin-when-cross-origin · Permissions-Policy(camera/mic/geolocation 차단). 여권 번호·여행 일정 등 PII는 애플리케이션 레이어 AES-256 암호화. 여권 평문 저장 금지, `passport_no_encrypted` 컬럼에만 암호화 후 저장. DB 자격증명: 글로벌 전용 user(`gs_app`)는 `gs` schema만 권한, `public` schema 권한 회수. 운영자 user(`gs_admin_hop`, `gs_admin_sd`)는 별 user로 분리. 모든 로그(Sentry/CloudWatch/Vercel)는 PII allowlist scrubber 통과. raw passport·이메일·전화는 로그 인입 금지.

**관련**: NFR-SEC

---

### SRS-G-044 · i18n 사전 (EN/KO 양 언어 + 글로벌 자체 i18n)

**구분**: i18n / 데이터베이스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 2

`next-intl` 또는 동등. 모든 UI 문자열은 `T` 키로 정의(EN/KO 양 언어 필수). 누락 키는 EN 폴백. 병원·진료과·시술명은 글로벌 서비스가 자체 보유한 `*_translations` 테이블 또는 JSONB `*_i18n` 컬럼에서 직접 조회. KR 외부 응답에 의존하지 않음. 날짜/통화/숫자 포맷은 사용자 로케일 기준. KO/EN 라인하이트 별도 튜닝 — `:lang(ko) { line-height: 1.65; }`. 자동 언어 감지(Accept-Language) + 수동 토글 + localStorage 영속.

**관련**: NFR-I18N

---

## 7. 데모 전용 (프로덕션 미반영)

### SRS-G-045 · Persona Panel (FR-COMMON-1 데모 전용)

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0

SRS-G-028 참조. 본 항목은 **출시 시 제거** 책임만 별도 표기. `NEXT_PUBLIC_DEMO_MODE !== 'true'` 시 렌더 차단. 코드 리뷰 시 가드 누락 차단 필수.

**관련**: FR-COMMON-1

---

### SRS-G-046 · Simulate hospital confirmation 버튼

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

P12 예약 상태 화면에서 한국 admin 없이 WAITING → CONFIRMED 즉시 전이. 청록 톤 dev 카드(`bg-info-100`), id `simulate-confirm`. 클릭 시 `state.bookings[id].status='confirmed'` + 토스트 `toast_hospital_ok` + 즉시 re-render. 출시 빌드에서 `NEXT_PUBLIC_DEMO_MODE` 가드로 제거. 카피 `simulate_hint` "Dev control: advance booking to 'confirmed' without the Korean admin."

**관련**: FR-DEMO-CONFIRM · P12

---

### SRS-G-047 · Simulate admin verification 버튼 (P10 온보딩)

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

P10 온보딩에서 기업 코드 입력 후 admin 승인 시뮬레이션. id `verify-now`. 클릭 시 `state.profile.enterpriseStatus='verified'` + 토스트 `toast_ent_verified`. 출시 시 제거. 코드 입력 후 PENDING 상태에서만 노출, 미입력 시 미노출.

**관련**: FR-DEMO-VERIFY · P10

---

### SRS-G-048 · 데모 리셋 (Persona Panel 내부)

**구분**: 데모 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 0.5

Persona Panel 펼친 상태에서 노출되는 빨강 텍스트 버튼 "Reset demo". `localStorage[safedoc_demo_v1]` 전체 초기화 + `#/`로 이동 + 토스트 `toast_reset`. 출시 시 제거.

**관련**: FR-DEMO-RESET

---

## 8. 성공 기준 (Demo Acceptance)

### SRS-G-049 · 5/15 데모 어셉턴스 시나리오

**구분**: 글로벌서비스 &nbsp;|&nbsp; **Priority**: P0 &nbsp;|&nbsp; **상태**: 미정 &nbsp;|&nbsp; **개발 예상일정(Day)**: 1

2026-05-15 데모일에 리뷰어가 다음 8단계 시나리오를 처음부터 끝까지 수행할 수 있어야 한다 — (1) 한인 페르소나로 Google 로그인, (2) 한국 시민권 자가신고 → KR_RESIDENT 가격 확인, (3) 기업 코드 입력 → admin 승인 시뮬레이션 후 할인가로 플립 확인, (4) EN/KO 토글로 진료과·병원·시술 명칭 모두 번역됨 확인, (5) Browse → Dermatology → Samsung Medical Center → Medical Laser Treatment 진입, (6) 모든 필수 필드 채워 예약 요청 제출, (7) Simulate 버튼으로 CONFIRMED 전이 확인, (8) 부가서비스 요청 CS 큐 노출 확인. **비-목표**: 결제 X, 환불 X, 네이티브 앱 X.

**관련**: Demo Acceptance

---

## 9. Phase 2 후보 (DEFERRED — M7+)

### SRS-G-050 · Stripe 결제 + KRW 통화 옵션

**구분**: 결제(P2) &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 15

M7(2026-08) 진입. Stripe Checkout 또는 Payment Intents API. 환불 처리 코드 enforcement. PCI-DSS 준수. 결제 정보는 글로벌 서비스에 절대 저장 안 함(Stripe direct). KRW 옵션 사용자 선택(환율은 Stripe FX).

**관련**: Phase 2

---

### SRS-G-051 · Flutter Web / 네이티브 iOS·Android

**구분**: 결제(P2) / 디자인 &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 60

데모는 반응형 웹으로 모바일 커버. Phase 2에서 Flutter Web 보류 여부 확정 후 진행. 네이티브 앱 — App Store/Play Store 제출 + iOS Health 통합 검토(비스코프). 디자인 시스템 코드화 완성 전제.

**관련**: Phase 2

---

### SRS-G-052 · 실시간 슬롯 / 캘린더 동기화

**구분**: 데이터베이스 / 결제(P2) &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 20

글로벌 DB(`gs` schema) 확장 필요 — 병원별 실시간 슬롯 테이블 추가, 시간대별 노출. 사용자가 직접 시간 선택. M6 안정 이후 평가. v1은 비동기 컨펌(WAITING → CONFIRMED) 패턴 유지.

**관련**: Phase 2

---

### SRS-G-053 · 인앱 CS 채팅 / Kakao·Naver 로그인 / 서류 검증

**구분**: 결제(P2) &nbsp;|&nbsp; **Priority**: P2 &nbsp;|&nbsp; **상태**: 보류 &nbsp;|&nbsp; **개발 예상일정(Day)**: 40

인앱 채팅 — CS ↔ User 직접 메시지(이메일 인입 대체). Kakao/Naver — 한국 거주자 대응 추가 OAuth. 여권/시민권 서류 검증 — v1은 자가신고, 검증 도입은 법무·KYC 비용 평가 후.

**관련**: Phase 2

---

## 5. 데이터 계층 (FR-DB · KR DB 공유 / `gs` schema)

### SRS-G-DB-001 · `gs` PostgreSQL 스키마 분리

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 1

KR PostgreSQL에 `CREATE SCHEMA gs`. Prisma `previewFeatures = ["multiSchema"]` + 모든 모델 `@@schema("gs")` 어노테이션. `gs` schema 외 권한 회수. `pg_dump --schema=gs`로 글로벌 데이터만 백업 가능.

**관련**: FR-DB

---

### SRS-G-DB-002 · ENUM 타입 11종

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

ENUM 타입 정의: `specialty_slug`(8값), `media_type`(photo/before_after/video), `oauth_provider`(google/apple), `citizenship_type`(KR/NON_KR), `pricing_tier`(KR_RESIDENT/FOREIGNER/ENTERPRISE), `affiliation_status`(none/pending/verified/revoked), `booking_status`(WAITING/CONFIRMED/CANCELLED), `addon_type`(lodging/flights/tours), `addon_status`(pending/in_progress/resolved/cancelled), `coupon_type`(FLAT/PCT).

**관련**: FR-DB

---

### SRS-G-DB-003 · 마스터 — specialties + 번역

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.specialties` (id UUID PK, slug ENUM UNIQUE, display_order, global_visible) + `gs.specialty_translations` (specialty_id FK, locale CHECK in (en,ko), name, summary, UNIQUE(specialty_id,locale)). 8개 진료과 시드(dermatology, plastic-surgery, dental, eye-care, health-checkup, orthopedics, ob-gyn, internal-medicine).

**관련**: FR-DB

---

### SRS-G-DB-004 · 마스터 — hospitals

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 1

`gs.hospitals` (id UUID PK, name_i18n JSONB, address_i18n JSONB, working_hours JSONB, transport_i18n, landmark_i18n, intro_i18n, notice_i18n, foreigner_friendly bool, foreigner_languages text[], global_is_published bool, star_rating numeric(3,2), review_count, latitude/longitude numeric(9,6), kr_hospital_ref TEXT(참조용 메타, FK 아님)). 부분 인덱스 `WHERE global_is_published=true`. JSONB GIN 인덱스 `name_i18n`.

**관련**: FR-DB

---

### SRS-G-DB-005 · 마스터 — hospital_specialties (N:M)

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.2

`gs.hospital_specialties` (hospital_id FK CASCADE, specialty_id FK RESTRICT, PK composite). `specialty_id` 단일 인덱스 추가.

**관련**: FR-DB

---

### SRS-G-DB-006 · 마스터 — programs (시술/프로그램)

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 1.5

`gs.programs` (id UUID PK, hospital_id FK CASCADE, specialty_id FK SET NULL, base_price_usd_cents INTEGER NOT NULL, foreigner_price_usd_cents INTEGER NOT NULL, display_currency CHAR(3) DEFAULT 'USD', hide_price bool, name_i18n JSONB, details_i18n JSONB {description, included[], process[], preparation[], aftercare[]}, display_order, global_visible). 부분 인덱스 `WHERE global_visible=true`.

**관련**: FR-DB

---

### SRS-G-DB-007 · 마스터 — media + before/after

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.hospital_media` / `gs.program_media` (id UUID, url, alt_i18n JSONB, type ENUM, display_order). `gs.before_after_cases` (id UUID, hospital_id/program_id SET NULL, before_url/after_url, identity_masked bool DEFAULT true, consent_meta JSONB, recovery_period_days, caption_i18n).

**관련**: FR-DB

---

### SRS-G-DB-008 · 회원 — users + OAuth + sessions

**구분**: 데이터베이스 / 보안 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 1

`gs.users` (id UUID PK, email UNIQUE, citizenship ENUM, cached_tier ENUM, locale_pref CHECK in (en,ko)). `gs.oauth_accounts` (provider+provider_sub UNIQUE, user_id FK CASCADE, raw_profile JSONB). `gs.sessions` (NextAuth Adapter 호환: session_token UNIQUE, user_id FK, expires TIMESTAMPTZ, ip INET, user_agent). `gs.verification_tokens` (identifier+token PK). 다중 OAuth 자동연결 금지, 명시적 연결 UX.

**관련**: FR-DB · FR-AUTH

---

### SRS-G-DB-009 · 회원 — profiles (PII 집중)

**구분**: 데이터베이스 / 보안 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.profiles` (user_id PK FK, first_name, last_name, dob DATE, gender CHECK in (M,F,O,N), phone, passport_no_encrypted TEXT — AES-256 암호화 후 저장 평문 금지, nationality CHAR(2), korea_entry_date, korea_exit_date). 복호화는 서버 레이어 전용.

**관련**: FR-DB · FR-AUTH

---

### SRS-G-DB-010 · 기업 — companies + affiliations

**구분**: 데이터베이스 / B2B | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.enterprise_companies` (code TEXT PK, name, default_discount_rate_bp SMALLINT CHECK 0~10000, active). `gs.enterprise_affiliations` (id UUID, user_id FK CASCADE, company_code FK RESTRICT, status ENUM, requested_at, verified_at, verified_by_admin_id TEXT, UNIQUE(user_id, company_code)). 부분 인덱스 `WHERE status='pending'`.

**관련**: FR-DB · FR-B2B

---

### SRS-G-DB-011 · 카트 — cart_lines

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.cart_lines` (id UUID, user_id FK CASCADE, hospital_id FK CASCADE, program_id FK CASCADE, visit_date DATE, applied_coupon_code FK SET NULL, computed_price JSONB {base_cents, tier_discount_cents, enterprise_discount_cents, coupon_discount_cents, total_cents, currency}, UNIQUE(user_id, hospital_id, program_id, visit_date)). 페르소나 변경 시 `computed_price` 무효화.

**관련**: FR-DB · FR-CART

---

### SRS-G-DB-012 · 예약 — reservation_groups + bookings + booking_services + status_history

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 1.5

`gs.reservation_groups` (id UUID, user_id FK, hospital_id FK, visit_date, subtotal_cents, group_number TEXT UNIQUE, UNIQUE(user_id, hospital_id, visit_date)). `gs.bookings` (id UUID, user_id FK RESTRICT, reservation_group_id FK RESTRICT, hospital_id FK RESTRICT, status ENUM DEFAULT WAITING, total_amount_cents, applied_coupon_code TEXT 스냅샷, patient_profile_snapshot JSONB — passport는 암호화 참조 ID만, addons JSONB, requested_at, confirmed_at, kr_admin_external_ref TEXT). `gs.booking_services` (booking_id FK CASCADE, program_id FK RESTRICT, snapshot_name_en/ko, snapshot_price_usd_cents). `gs.booking_status_history` (booking_id FK CASCADE, from_status, to_status, changed_at, actor_admin_id TEXT, actor_user_id UUID SET NULL, note).

**관련**: FR-DB · FR-BOOKING

---

### SRS-G-DB-013 · 예약 부가 — addon_requests

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.addon_requests` (id UUID, booking_id FK CASCADE, type ENUM lodging/flights/tours, status ENUM pending/in_progress/resolved/cancelled, cs_owner_admin_id TEXT, notes, requested_at, resolved_at). 부분 인덱스 `WHERE status IN ('pending','in_progress')`.

**관련**: FR-DB

---

### SRS-G-DB-014 · 쿠폰 — coupons + redemptions

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.coupons` (code PK, type ENUM, amount_cents INTEGER CHECK >0 — FLAT 전용, rate_bp SMALLINT CHECK 1~10000 — PCT 전용, CHECK 타입별 컬럼 강제, valid_from/to, max_uses, used_count, active). `gs.coupon_redemptions` (id UUID, coupon_code FK RESTRICT, user_id FK RESTRICT, booking_id FK RESTRICT, applied_at, discount_amount_cents, UNIQUE(coupon_code, booking_id)). used_count는 예약 트랜잭션 안에서만 증감, 운영자 직접 수정 금지.

**관련**: FR-DB · FR-PRICING

---

### SRS-G-DB-015 · 감사 — audit_log

**구분**: 데이터베이스 / 보안 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.audit_log` (id BIGSERIAL PK, actor_admin_id TEXT, actor_user_id UUID SET NULL, action, target_type, target_id TEXT, payload JSONB, ip INET, user_agent, at TIMESTAMPTZ). 인덱스 (target_type, target_id, at DESC) + (actor_admin_id, at DESC) 부분. UPDATE/DELETE 금지 정책. `actor_id`는 구조화 prefix(`user:<uuid>` / `hop:<id>` / `sd:<id>` / `system:<job>`).

**관련**: FR-DB · NFR-SEC

---

### SRS-G-DB-016 · 데모 — demo_state

**구분**: 데이터베이스 / 데모 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.2

`gs.demo_state` (user_id PK FK CASCADE, persona TEXT, set_at). `NEXT_PUBLIC_DEMO_MODE` 가드. 페르소나 스위치 시 demo_state upsert + users.citizenship/cached_tier 재계산 + cart_lines.computed_price 무효화(stale flag) 단일 트랜잭션.

**관련**: FR-DB · FR-DEMO

---

### SRS-G-DB-017 · 콘텐츠 — gs.reviews

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.reviews` (id UUID PK, hospital_id FK CASCADE, user_id FK SET NULL, rating SMALLINT CHECK 1-5, content_i18n JSONB, locale CHAR(2), verified bool, posted_at TIMESTAMPTZ, source ENUM manual|imported|user). 인덱스 (hospital_id, posted_at DESC), (rating). 가명 표시는 클라이언트 변환(last-name initial + first-letter + region).

**관련**: P15 · P16 · FR-DB · 마이그레이션 Phase 2

---

### SRS-G-DB-018 · 콘텐츠 — gs.blog_posts

**구분**: 데이터베이스 | **Priority**: P1 | **상태**: 미정 | **개발 예상일정(Day)**: 0.5

`gs.blog_posts` (id UUID PK, slug TEXT UNIQUE NOT NULL, title_i18n JSONB {en, ko}, body_i18n JSONB {en, ko}, category TEXT NOT NULL, tags TEXT[] DEFAULT '{}', featured bool DEFAULT false, published_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ). 인덱스 (category, published_at DESC), (slug UNIQUE).

**관련**: P18 · FR-DB · 마이그레이션 Phase 2

---

### SRS-G-DB-019 · 콘텐츠 — gs.qa_items

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.3

`gs.qa_items` (id UUID PK, category TEXT NOT NULL, question_i18n JSONB {en, ko}, answer_i18n JSONB {en, ko}, display_order INTEGER, created_at TIMESTAMPTZ). 인덱스 (category, display_order). CS 인입 감소 목표 달성을 위해 초기 20–30개 Q&A 시드 필수.

**관련**: P19 · FR-DB · 마이그레이션 Phase 2

---

### SRS-G-DB-020 · 마스터 — gs.hospitals 컬럼 보강

**구분**: 데이터베이스 | **Priority**: P0 | **상태**: 미정 | **개발 예상일정(Day)**: 0.3

`ALTER TABLE gs.hospitals` — 컬럼 추가: `english_support` bool NOT NULL DEFAULT false, `international_ward` bool NOT NULL DEFAULT false, `accreditation` TEXT[] NOT NULL DEFAULT '{}'. foreigner_friendly와는 별개의 구체 플래그. 필터 인덱스 `(english_support, international_ward)` 부분 인덱스 추가 `WHERE global_is_published=true`.

**관련**: P15 · FR-DB · 마이그레이션 Phase 2

---

## 부록 A · 구분(Category) 태그 정의

| 태그 | 의미 |
|------|------|
| **글로벌서비스** | US-facing Next.js 프론트엔드, BFF Route Handlers |
| **데이터베이스** | KR PostgreSQL 공유 인스턴스의 `gs` schema 자체 보유 테이블·인덱스·트랜잭션 |
| **운영자계약** | 병원관리자/세이프닥관리자(타팀)와의 schema·actor_id 컨벤션 계약 |
| **CMS** | SafeDoc 내부 admin — 기업 인증 / 예약 큐 / CS 노트 |
| **데이터** | 수집/제외 항목, 유효성, 보유 기간 |
| **보안** | 암호화 · 로그 마스킹 · 권한 · 사고 대응 |
| **접근성** | WCAG 2.2 AA · 키보드 · `prefers-reduced-motion` |
| **i18n** | EN/KO 사전, 라인하이트 분기, 글로벌 자체 i18n 필드 |
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

---

## 부록 C · 상태 정의

| 상태 | 의미 |
|------|------|
| **미정** | 계획됨, 미착수 |
| **진행중** | R 배정됨, 작업 중 |
| **완료** | 산출물 검증됨 |
| **보류** | 외부 종속(KR본사·결정 큐)으로 차단 |

---

## 부록 D · 관련 문서

| 문서 | 위치 |
|------|------|
| 요구사항정의서 (산문형 A4) | `docs/requirements-definition.html` v1.1 |
| UI/UX 기획서 (페이지 카드 + 스크린샷) | `docs/ui-ux-plan.html` v1.1.3 |
| 요구사항정의서 v2 (개발 관점) | `docs/requirements-srs-v2.html` v2.2 |
| 기능명세서 | `docs/functional-spec.html` v1.1 |
| WBS (작업 분해 구조) | `docs/wbs.html` v1.2 |
| 정책서 (Privacy/ToS/환불/콘텐츠 통합) | `docs/policies.html` v1.0 |
| 제품 브리프 | `.pm/product-brief.md` |
| 프로토타입 (vanilla HTML+JS) | `prototype/demo.html` v1.1 (3,481줄) |
| v1.1 스크린샷 19장 | `docs/screenshots/v11/` |
| 데이터 모델 DDL + 마이그레이션 | `prisma/schema.prisma` · `prisma/migrations/` (Phase 2-9 27개 마이그레이션) |

---

> 본 SRS v2는 개발 관점 슬림 버전입니다. 법규·정책 종속 항목은 별도 정책 문서에서 관리합니다. 데모 D-1까지 PM이 필요 시 갱신합니다.
