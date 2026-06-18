# SafeDoc Global Service · 기능명세서 (Functional Specification)

**버전**: v1.1  
**작성일**: 2026-05-15  
**진실의 원천(SoT)**: `prototype/demo.html` v1.2 (확장 14→19 라우트)  
**언어**: 한국어(설명) + 영문(라우트·식별자)  
**대상**: 2026-05-15 CEO 데모 어셉턴스

---

## 개요

SafeDoc Global Service는 미국 거주자를 위한 한국 의료 시술 크로스보더 예약 플랫폼입니다.  
본 문서는 19개 화면(P01~P19)의 동작 명세를 정의하며, 각 화면마다 다음 8개 필드를 상세 기술합니다:

1. **라우트** — 접근 URL, 권한 가드, 리다이렉트 조건
2. **목적** — 사용자 가치 제안 (1~2줄)
3. **레이아웃** — 반응형 구조 (데스크톱/모바일)
4. **입력 (Inputs)** — 폼 필드, 클릭 요소, URL 파라미터 (표)
5. **출력 (Outputs)** — 화면에 표시되는 데이터, 비어있을 때 상태
6. **상태 전이 (State transitions)** — 사용자 액션 → 상태 변경 → 라우트/토스트
7. **검증 & 에러** — 유효성 패턴, 인라인 오류, 리다이렉트 조건
8. **i18n & a11y** — i18n 키 카테고리, 키보드 흐름, ARIA, `prefers-reduced-motion`

---

## P01 · 랜딩 (홈) — 11개 섹션 스크롤

### 라우트
- **URL**: `#/`
- **권한 가드**: 게스트 진입 가능 (미인증 O)
- **리다이렉트**: 없음 (최상단 엔트리 포인트)

### 목적
미국 거주자에게 60초 이내에 SafeDoc의 가치(신뢰·투명한 가격·코디네이션)를 전달하고,  
진료과 Browse/시술 탐색 또는 가격 시뮬레이션으로 전환.

### 레이아웃

**데스크톱 (≥1024px)**
- Hero 섹션 (full width, mesh 배경, 검색 + 신뢰 배지 우측)
- 11개 섹션 수직 연결 (각 max-w-wide 정렬)
- 헤더 sticky top-0 z-30 (backdrop-blur)
- 푸터 고정

**모바일 (<1024px)**
- Hero 섹션 수직, 배지 아래로 이동
- 섹션별 풀 너비 (padding 양쪽 16px)
- 헤더/푸터 동일

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 | 기본값 |
|------|------|--------|---------|------|--------|
| 검색 입력 | text | search-query | N | 최소 1글자 | "" |
| 검색 버튼 | button | search-submit | N | 클릭 → `#/services?q={query}` | — |
| 진료과 타일(6개) | clickable | dept-tile | N | 클릭 → `#/hospitals?dept={dept_id}` | — |
| 메뉴 앵커 | anchor | nav-jump-{id} | N | 클릭 → `#{section_id}` (in-page scroll) | — |
| 가격 시뮬레이터 5개 레버 | 혼합 | sim-{lever} | N | 라이브 계산 → 우측 Receipt 갱신 | 첫 번째 |

#### 11개 섹션 목록

1. **P01-A: Hero** (`hp_hero_*`)  
   Eyebrow + H1 + Lead + 검색 + 신뢰 배지 4종

2. **P01-B: Trust Marquee** (`hp_marquee_*`)  
   다크 네이비, 가로 무한 마퀴 (JCI/KSAPS/ISAPS/KDA/English reports/Bilingual coordinator)

3. **P01-C: Featured Specialties** (6 photo-tile)  
   Dermatology / Health Checkups / Dental / Eye Care / Plastic Surgery / Orthopedics  
   각 타일: gradient + icon + clinic count + min price(현재 페르소나) + hover drop shadow

4. **P01-D: Before & After** (아이디: `#beforeafter`)  
   케이스 그리드 (이미지 + recovery time + verified mark + 면책 텍스트)

5. **P01-E: Reviews Wall** (아이디: `#reviews`)  
   3개 colored blocks (white/navy/blue) + 5-star + patient quote + 면책 + "더 보기"

6. **P01-F: Providers** (아이디: `#providers`)  
   의료진 자격 정책 4개 + floating 의료진 카드 3종 + 인용문

7. **P01-G: Guides** (아이디: `#guides`)  
   Eyebrow "The reading room" + 3개 magazine-style card (tag + 제목 + read time) + "Browse the library"

8. **P01-H: How it works** (아이디: `#how`)  
   3-step (Discover / Request / Travel) + 점선 커넥터 + 각 카드 1줄 설명

9. **P01-I: FAQ** (아이디: `#faq`)  
   `<details>` 아코디언 4문항 (open시 보더 강조, 아이콘 회전)

10. **P01-J: Closing + Enterprise** (아이디: `#enterprise`)  
    다크 네이비 클로징 배너 + ACME Holdings 협상 할인 미리보기 + "For employers" CTA

11. **P01-K: Price Simulator** (아이디: `#simulator`)  
    5개 레버 + 우측 receipt (Base / Tier / Enterprise discount / Coupon / Total / Savings %)

### 출력 (Outputs)

**모든 섹션 정적 콘텐츠** (i18n 키 기반)
- `hp_hero_*` — 제목, 리드, 버튼 텍스트
- `hp_step_*` — 3-step 설명
- `hp_story_*` — 환자 인용문 (3명)
- `hp_provider_*` — 의료진 자격, 인용
- `hp_guide_*` — 가이드 제목, 메타
- `hp_faq_*` — Q&A

**동적 데이터**
- 현재 페르소나(Persona Panel)에 따른 가격 계산 (min price per specialty)
- 언어 토글(EN/KO)에 따른 모든 텍스트 교체
- 시뮬레이터 상태 (`simState`) — 본체 상태와 독립, 네비게이션 이탈 시 초기화

**비어있을 때**
- N/A (모든 섹션 정적)

### 상태 전이 (State transitions)

| 사용자 액션 | 상태 변경 | 라우트 이동 | 토스트 |
|-----------|---------|----------|--------|
| 검색 제출 | search-query 저장 | `#/services?q={query}` | — |
| 진료과 타일 클릭 | — | `#/hospitals?dept={dept_id}` | — |
| 메뉴 앵커 클릭 | — | in-page scroll `#{id}` | — |
| 시뮬레이터 레버 조정 | `simState` 갱신 | — | — |
| 언어 토글 (EN/KO) | `state.lang` 전환 | 재렌더 | — |
| "Start Consultation" (헤더) | — | `#/services` | — |

### 검증 & 에러

| 입력 | 검증 규칙 | 에러 메시지 | 처리 |
|-----|---------|-----------|------|
| search-query | 최소 1글자 | (인라인 미표시, 검색 시 필터링) | 입력값 전달 |
| 페르소나 전환 | — | — | 즉시 가격 갱신 (시뮬레이터 + 섹션 min-price) |

### i18n & a11y

**i18n 키 카테고리**
- `hp_hero_*`, `hp_marquee_*`, `hp_step_*`, `hp_story_*`, `hp_provider_*`, `hp_guide_*`, `hp_faq_*`, `hp_closing_*`, `hp_enterprise_*`

**키보드 흐름** (Tab 순서)
1. 검색 입력 → 검색 버튼
2. 6개 진료과 타일 (좌상→우하)
3. 메뉴 앵커 6개
4. 시뮬레이터 5개 레버 (위→아래)
5. 푸터 링크

**ARIA**
- 마퀴: `aria-live="polite"` 아니고 `aria-label="Trust marquee, continuously scrolling"` (순수 장식 아님)
- FAQ 아코디언: `<summary>` native `<details>` 활용 (ARIA role 불필요)
- 신뢰 배지: `aria-label="Verified clinics, English support, Before & After cases, Concierge care"`

**prefers-reduced-motion**
- 마퀴 정지 (animation 제거)
- Hero 배경 그라디언트 정지 (정적 배경으로 대체, 필요시)
- 호버 transition 비활성 (appearance 변경만)

---

## P02 · 진료과 카탈로그

### 라우트
- **URL**: `#/departments`
- **권한 가드**: 게스트 진입 가능

### 목적
8개 진료과를 카드 그리드로 한눈에 보여주고,  
각 진료과별 병원 목록으로 진입.

### 레이아웃

**데스크톱**
- 상단 Browse 탭 (Specialties active / Treatments) — 탭 전환 시 `#/services`로 이동
- 8개 카드 2/4 컬럼 responsive grid (`md:grid-cols-2 lg:grid-cols-4`)
- 각 카드: photo-tile + 좌상단 아이콘 + 우상단 clinic count + EN/KO 명칭 + 1줄 보조 카피 + "View all →"

**모바일**
- Browse 탭 유지
- 1 column full width, 카드 스택

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 | 기본값 |
|------|------|--------|---------|------|--------|
| Browse 탭 | segment | browse-mode | N | toggle → `#/services` | Specialties |
| 진료과 카드 | clickable | dept-{id} | N | 클릭 → `#/hospitals?dept={id}` | — |

### 출력 (Outputs)

**동적 데이터** (KR DB에서 수집)
- 각 진료과의 병원 개수 (count)
- 현재 페르소나 기준 min price

**정적 데이터** (i18n)
- 진료과명 (EN/KO)
- 1줄 설명 (`dept_description_*`)

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 진료과 타일 클릭 | — | `#/hospitals?dept={id}` | — |
| "Treatments" 탭 클릭 | — | `#/services` | — |

### 검증 & 에러

없음 (모두 유효한 진료과).

### i18n & a11y

**i18n**
- 진료과명: `dept_{id}_en` / `dept_{id}_ko`
- 설명: `dept_description_{id}`

**a11y**
- 각 카드: `role="link"`, `tabindex="0"`
- Browse 탭: `role="tablist"` + radio pattern

---

## P03 · 시술 카탈로그 (필터 + 그룹)

### 라우트
- **URL**: `#/services?dept=&concern=&price=&hospital=&sort=`
- **권한 가드**: 게스트 진입 가능
- **URL 파라미터**:
  - `dept` — 진료과 ID (예: `derm`, `plastic`)
  - `concern` — 증상/관심사 (예: `acne`, `aging`) — dept별 조건부
  - `price` — 가격대 (`lt500`, `500_1500`, `1500_3000`, `gt3000`)
  - `hospital` — 병원 ID (예: `smc`, `asan`)
  - `sort` — 정렬 (`recommend`, `popularity`, `price_asc`, `price_desc`, `duration_asc`)

### 목적
시술 탐색 시 다중 필터·정렬·그룹으로  
사용자 맞춤 추천 및 가격 비교 가능하게 함.

### 레이아웃

**데스크톱**
- 상단 Browse 탭 (Specialties / Treatments active) + 진료과 가로 스크롤 서브내브
- 좌측: 필터 패널 (concern / price / hospital / sort) — 각 변경 시 URL 쿼리 갱신
- 우측/중앙: 시술 카드 그리드 (`md:grid-cols-2 lg:grid-cols-3`)
  - `GROUPED_DEPTS`(plastic/dental/ophth/ortho)는 카테고리 헤더로 그룹화
  - 나머지는 플랫 그리드

**모바일**
- Browse 탭 + 진료과 가로 스크롤 유지
- 필터 → collapsible `<details>` 또는 modal
- 카드 1 column

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 | 기본값 |
|------|------|--------|---------|------|--------|
| 진료과 서브 | clickable | subnav-dept-{id} | N | 클릭 → `?dept={id}` 쿼리 갱신 | (URL에서 읽음) |
| Concern filter | select | filter-concern | N | dept별 조건부 노출 | "" |
| Price filter | checkbox | filter-price-{range} | N | multi-select 가능 | "" |
| Hospital filter | select | filter-hospital | N | Treatments 탭 + dept 선택 시 자동 한정 | "" |
| Sort select | dropdown | filter-sort | N | 단일 선택 | "recommend" |
| 시술 카드 | clickable | service-{id} | N | 클릭 → `#/service/{id}` | — |

### 출력 (Outputs)

**동적 데이터**
- Filtered 시술 list (KR DB)
- 그룹 헤더 (procedure category, 있는 경우)
- 각 카드: 진료과 chip + 시술명(EN/KO) + 병원명 + 가격(현재 페르소나) + 평점(있으면)

**빈 상태**
- `empty_services_t` / `empty_services_s` 메시지 + Browse CTA

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| Concern/Price/Hospital 선택 | filters 갱신 | URL 쿼리 갱신 (재렌더) | — |
| Sort 변경 | sort 갱신 | URL 쿼리 갱신 (재렌더) | — |
| 시술 카드 클릭 | — | `#/service/{id}` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|-----|------|------|
| dept + Treatments 탭 | Treatments 탭 활성화 시 선택된 진료과 소속 병원만 노출 | 자동 필터링 |
| concern 노출 | `CONCERN_ORDER[dept]` 정의된 진료과만 노출 | 다른 dept는 필터 숨김 |

### i18n & a11y

**i18n**
- `nav_procedures`, `nav_services`
- 필터 라벨: `filter_concern`, `filter_price_*`, `filter_hospital`, `filter_sort`
- 정렬 옵션: `sort_recommend`, `sort_popularity`, `sort_price_asc`, `sort_price_desc`, `sort_duration`

**a11y**
- 필터 라벨: `<label for="filter-concern">` 명시적 연결
- Sort select: `aria-label="정렬 기준 선택"`
- 빈 상태: `role="status"` + `aria-live="polite"`

---

## P04 · 진료과별 병원 목록

### 라우트
- **URL**: `#/hospitals?dept={id}`
- **권한 가드**: 게스트 진입 가능
- **필수 파라미터**: `dept`

### 목적
선택한 진료과의 병원을 시각적으로 비교하고,  
각 병원 상세로 진입.

### 레이아웃

**데스크톱**
- 상단 활성 진료과 강조 가로 스크롤 서브내브 (현재 진료과 highlight)
- 병원 카드 그리드 (`md:grid-cols-2 lg:grid-cols-3`)
- 각 카드: photo-tile + 병원명(EN/KO) + 평점 + 위치 + review count + 가격 범위(현재 페르소나) + 영어진료/국제 병동 칩

**모바일**
- 서브내브 유지 (가로 스크롤)
- 카드 1 column full width

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 | 기본값 |
|------|------|--------|---------|------|--------|
| 진료과 서브 | clickable | subnav-dept-{id} | N | 클릭 → `?dept={new_id}` | (URL에서) |
| 병원 카드 | clickable | hospital-{id} | N | 클릭 → `#/hospital/{id}` | — |

### 출력 (Outputs)

**동적 데이터** (KR DB)
- 병원 list (dept 기준)
- 각 카드: 병원명(EN/KO), 평점, 위치, review count, min/max price(dept별), 특징 칩

**빈 상태**
- `empty_dept_t` + "Browse our services" CTA → `#/services`

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 병원 카드 클릭 | — | `#/hospital/{id}` | — |
| 진료과 서브 클릭 | dept 파라미터 갱신 | `?dept={id}` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|------|------|------|
| dept 파라미터 | 유효한 진료과 ID | 유효하지 않으면 빈 상태 |

### i18n & a11y

**i18n**
- 병원명: `hospital_{id}_en` / `hospital_{id}_ko`
- 위치: `hospital_{id}_area_en` / `hospital_{id}_area_ko`

**a11y**
- 각 카드: `role="link"`
- 평점: `aria-label="평점 4.8 out of 5, based on 120 reviews"`

---

## P05 · 병원 상세 (sticky 4-탭)

### 라우트
- **URL**: `#/hospital/{id}?tab={services|overview|reviews|location}`
- **권한 가드**: 게스트 진입 가능
- **필수 파라미터**: `id`
- **선택 파라미터**: `tab` (기본값: `services`)

### 목적
병원의 시술, 소개, 평판, 위치를 종합적으로 제시하고,  
시술 추가 또는 병원 상세 조회로 전환.

### 레이아웃

**데스크톱**
- Hero photo-tile (240~340px) + 외국인 친화 인증 칩 (`kr_foreigner_friendly`)
- sticky 4-탭 스트립 (Services / Overview / Reviews / Location) — 좌/우 키보드 이동 가능
- 좌측: 탭별 콘텐츠 (max-w-wide)
- 우측 sticky: 가격 카드 (대표 시술 자동 선정) + 쿠폰 카드 + Contact 카드

**모바일**
- Hero full width
- Sticky 탭 (horizontal scroll 가능)
- 콘텐츠 + 가격 카드 수직 스택

### 입력 (Inputs)

#### 공통

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 탭 선택 | segment | tab-{name} | N | 클릭 → URL `?tab={name}` 갱신 |

#### Services 탭

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 시술 아코디언 | `<details>` | service-{id} | N | open시 설명 + "Add to cart" / "Book now" 노출 |
| Add to cart | button | cart-add-{service_id} | N | 클릭 → 카트 추가 |
| Book now | button | book-now-{service_id} | N | 클릭 → `#/book/{hospital_id}/{service_id}` |

#### Overview 탭 (읽기전용, KR DB)

| 필드명 | 소스 | 표시 |
|--------|------|------|
| kr_phone | KR DB | 전화번호 |
| kr_hours | KR DB | 진료 시간 |
| kr_address | KR DB | 주소 |
| kr_transport | KR DB | 대중교통 접근 |
| kr_landmark | KR DB | 지역 특징 |
| kr_notice | KR DB | 공지사항 |

#### 우측 Sticky 카드 - 가격

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 대표 시술 자동 선정 | select | featured-service | N | (병원 가장 인기 시술) |
| 쿠폰 입력 | text | coupon-code | N | `/^[A-Z0-9]{4,20}$/` |
| 쿠폰 적용 버튼 | button | coupon-apply | N | 클릭 → COUPONS 검색 |

### 출력 (Outputs)

#### Services 탭

**동적 데이터** (KR DB)
- 병원 시술 list (아코디언 행)
- 각 시술: 가격 라인업 (summary에 즉시 노출)
- open시: 설명 + 버튼

**정적 데이터** (i18n)
- `tab_services_title`, `svc_add_cart`, `svc_book_now`

#### Overview 탭

**동적 데이터** (KR DB)
- Accreditation 칩들
- KR DB 필드: `kr_phone`, `kr_hours`, `kr_address`, `kr_transport`, `kr_landmark`, `kr_notice`
- 한국어 원문 그대로 노출 (i18n 라벨만)

**정적 데이터** (i18n)
- 섹션 라벨: `tab_overview_*`, `hosp_accreditation`, `hosp_about`

#### Reviews / Location 탭

**현재 (P2 비스코프)**
- 플레이홀더: `tab_reviews_stub`, `tab_location_stub`

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 탭 선택 | tab 파라미터 갱신 | URL `?tab={name}` 갱신 | — |
| Add to cart | state.cart.push() | — | `toast_added_cart` |
| 중복 시술 추가 | (차단) | — | `toast_already_in_cart` |
| Book now | — | `#/book/{hospital_id}/{service_id}` | — |
| 쿠폰 적용 | `state.couponCode` 갱신 | (우측 가격 재계산) | `toast_coupon_applied` 또는 `err_coupon_invalid` |
| 좌/우 키보드 | 탭 순회 | URL `?tab=...` 갱신 | — |

### 검증 & 에러

| 입력 | 검증 규칙 | 에러 키 | 처리 |
|-----|---------|--------|------|
| coupon-code | `/^[A-Z0-9]{4,20}$/` + COUPONS dict lookup | `err_coupon_invalid` | 인라인 토스트 |
| 중복 시술 | inCart(serviceId) | `err_duplicate_service` | 토스트 차단 |

### i18n & a11y

**i18n 키 카테고리**
- `tab_services_*`, `tab_overview_*`, `tab_reviews_*`, `tab_location_*`
- `hosp_*`, `coupon_*`, `svc_*`

**a11y**
- Sticky 탭: `role="tablist"` + `role="tab"` (각 탭)
- 좌/우 키: Arrow Left/Right로 탭 이동
- Overview 텍스트: `role="region"` + `aria-label="병원 개요"`
- 가격 카드: `aria-live="polite"` (가격 변동 시 읽어줌)

**prefers-reduced-motion**
- 탭 스크롤 animation 제거
- 호버 drop shadow → outline으로 대체

---

## P06 · 시술 상세 (KR DB 스키마 매핑)

### 라우트
- **URL**: `#/service/{id}`
- **권한 가드**: 게스트 진입 가능
- **필수 파라미터**: `id`

### 목적
시술의 전체 프로세스, 준비·사후관리, 포함 항목을 명확히 제시하고,  
카트 추가 또는 바로 예약 신청.

### 레이아웃

**데스크톱**
- Hero photo-tile (240~320px)
- 하단 2-컬럼: 좌측(본문) + 우측(sticky 가격 카드)
- 본문: Overview (desc) → Included → Process → Prep/Aftercare(2-col) → 다른 시술(미니카드 3개)

**모바일**
- Hero full width
- 1 column (사이드바 하단 위치)

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| Add to cart | button | cart-add-{service_id} | N | 이미 카트에 있으면 `svc_in_cart` 토글 |
| Book now | button | book-now | N | 클릭 → `#/book/{hospital_id}/{service_id}` |

### 출력 (Outputs)

**동적 데이터** (KR DB SERVICE_DETAILS)

| 섹션 | KR DB 필드 | 표시 조건 |
|-----|-----------|---------|
| Overview | `desc` (EN/KO) | 항상 노출 |
| Included | `included[]` (EN/KO) | 배열이 비어있지 않으면 |
| Process | `process[]` (EN/KO, 번호 매김) | 배열 있으면 |
| Prep | `prep[]` (EN/KO) | 배열 있으면, 없으면 `svc_no_prep` |
| Aftercare | `aftercare[]` (EN/KO) | 배열 있으면, 없으면 생략 |
| 다른 시술 | 같은 병원 다른 서비스 | max 3개 |

**정적 데이터** (i18n)
- 진료과 eyebrow + 병원 칩
- 섹션 제목: `svc_overview`, `svc_included`, `svc_process`, `svc_prep`, `svc_aftercare`

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| Add to cart | state.cart.push({serviceId, hospitalId, visitDate:''}) | — | `toast_added_cart` |
| 이미 카트 상태 보기 | — | `#/cart` | — |
| Book now | — | `#/book/{hospital_id}/{service_id}` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|------|------|------|
| 중복 추가 | inCart(serviceId) | 토스트 + "이미 카트에 있습니다" |

### i18n & a11y

**i18n 키**
- 진료과명: `dept_{id}` (EN/KO)
- 병원명: `hospital_{id}` (EN/KO)
- 섹션 제목: `svc_overview`, `svc_included`, `svc_process`, `svc_prep`, `svc_aftercare`
- 안내: `svc_no_prep`, `svc_add_cart`, `svc_in_cart`, `svc_book_now`

**a11y**
- Process: `<ol start="1">` (의미론적 번호)
- Included/Prep: checkmark icon `aria-hidden="true"` (텍스트로 충분)
- 가격 카드: `aria-live="polite"` (pagePersona 변경 시)

---

## P07 · 장바구니 (멀티-병원, 라인-아이템)

### 라우트
- **URL**: `#/cart`
- **권한 가드**: 게스트 진입 가능
- **리다이렉트 조건**: 없음 (비어있어도 진입 가능, 빈 상태 표시)

### 목적
선택한 시술들을 병원·방문일별로 묶어 관리하고,  
예약 그룹화를 시각화한 후 결제로 진입.

### 레이아웃

**데스크톱**
- 좌측: 라인-아이템 카드들 (N장)
  - 각 카드: 88×88 photo-tile + 진료과 eyebrow + 시술명 + 병원명 + 방문일 input + Remove 버튼 + 가격
- 우측 sticky:
  - 상단: **Reservation grouping** 카드 (`cartGroups()` by (hospitalId, visitDate) pair)
    - 큰 번호 (예약 그룹 번호)
    - 각 그룹: 병원명 + visitDate (없으면 warning 톤) + 시술 개수
  - 하단: **합계** 카드 (Subtotal + Savings + Grand Total)

**모바일**
- 1 column (라인-아이템 + 사이드바 순서대로 스택)

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 라인 Remove | button | cart-remove-{service_id} | N | 클릭 → state.cart 필터링 |
| 라인 visitDate | input[date] | cart-date-{service_id} | Y | min={today+1} ISO date |
| 결제 진행 | button | cart-proceed | N | 모든 라인 visitDate 입력 필수 |

### 출력 (Outputs)

**동적 데이터** (state.cart)
- 각 라인: serviceId + hospitalId + visitDate (입력값) + 계산 가격

**Grouping 카드**
- `cartGroups()` 호출 결과: (hospitalId, visitDate)별로 묶음
- 그룹 번호 (1부터 시작)
- 각 그룹: 병원명 + visitDate (또는 "방문일 선택 필요") + 시술 개수

**합계 카드**
- Items subtotal (원가 합)
- Total savings (할인 합)
- Estimated grand total (적용가 합)

**빈 상태**
- `cart_empty_t` + `cart_empty_s` 메시지
- "Browse our services" CTA → `#/services`

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| Remove | state.cart = state.cart.filter(...) | — | `toast_removed` |
| visitDate 입력 | 해당 라인 visitDate 업데이트 + Grouping 재계산 | — | — |
| 모든 라인 visitDate 완료 | cart_proceed 버튼 활성화 | — | — |
| 결제 진행 | 없음 (버튼 활성화 조건) | `#/checkout` | — |

### 검증 & 에러

| 입력 | 규칙 | 처리 |
|------|------|------|
| visitDate | min={today+1}, ISO date | 자동 유효성, 미입력 시 경고 톤 |
| 결제 진행 | `cartReadyGroups().length > 0` | 미입력 라인 존재 시 버튼 disabled |

### i18n & a11y

**i18n 키**
- `cart_title`, `cart_sub`, `cart_empty_t`, `cart_empty_s`, `cart_browse`
- `cart_select_date`, `cart_remove`, `cart_continue`
- `cart_groups_t`, `cart_groups_count`, `cart_groups_s`
- `cart_subtotal`, `cart_savings`, `cart_grand_total`, `cart_proceed`, `cart_pick_date_first`

**a11y**
- 각 라인: `role="article"` + `aria-label="시술명, 병원명, visitDate"`
- Grouping 카드: `role="region"` + `aria-live="polite"` (그룹 업데이트 시 읽어줌)
- visitDate input: `aria-label="예약 방문일, YYYY-MM-DD 형식"`

---

## P08 · 결제 인테이크 (1프로필 N예약)

### 라우트
- **URL**: `#/checkout`
- **권한 가드**: 미인증 시 `#/signin?next=#/checkout`로 리다이렉트
- **리다이렉트 조건**:
  - 카트 비어있음 → `#/cart`
  - 일부 라인 visitDate 누락 → `#/cart` (경고 토스트)

### 목적
1회 Patient 정보(자동 채워짐) + Travel 정보 + Add-ons를 수집하여  
그룹별 booking을 생성하고 완료 페이지로 이동.

### 레이아웃

**데스크톱**
- 상단: Reservations summary 카드 (cartGroups() 페어별 정리)
- 좌측 폼 3섹션:
  1. **Patient** (1회만)
  2. **Travel** (1회만)
  3. **Add-ons** (1회만)
- 우측 sticky:
  - 합계 카드
  - 충돌 라디오 (coupon vs enterprise 선택 필요시)
  - 쿠폰 입력

**모바일**
- 상단 summary
- 1 column 폼 + 사이드바 하단

### 입력 (Inputs)

#### Reservations Summary

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| (읽기전용) | — | — | — | `cartGroups()` 페어별 병원·visitDate·시술 list |

#### Patient 섹션

| 필드 | 타입 | 필드명 | 필수여부 | 검증 | 기본값 |
|------|------|--------|---------|------|--------|
| Name | text | patient-name | Y | (읽기전용, OAuth) | state.profile.name |
| Email | email | patient-email | Y | (읽기전용) | state.profile.email |
| Phone | tel | patient-phone | Y | `^[+\d\-\s()]{10,20}$` | "" |
| Age | number | patient-age | Y | 18–120 | "" |
| Gender | radio | patient-gender | Y | F/M/O | "" |
| Nationality | select | patient-nationality | Y | (dropdown) | "" |
| Passport | text | patient-passport | Y | `/^[A-Za-z0-9]{6,12}$/` | "" |

#### Travel 섹션

| 필드 | 타입 | 필드명 | 필수여부 | 검증 | 기본값 |
|------|------|--------|---------|------|--------|
| Entry date | date | travel-entry | Y | ≥ today | "" |
| Exit date | date | travel-exit | Y | > entry date | "" |
| Hotel | text | travel-hotel | N | (자유 텍스트) | "" |
| Flight | text | travel-flight | N | (자유 텍스트) | "" |
| Notes | textarea | travel-notes | N | max 500 chars | "" |

#### Add-ons 섹션

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| Lodging | checkbox | addon-lodging | N | (선택 가능) |
| Flight | checkbox | addon-flight | N | (선택 가능) |
| Tour | checkbox | addon-tour | N | (선택 가능) |
| Notes | textarea | addon-notes | N | max 300 chars |

#### 충돌 라디오 (우측 카드)

| 옵션 | 필드명 | 조건 |
|------|--------|------|
| Enterprise discount | conflict-pick-enterprise | entDiscount > 0 && couponDiscount > 0 && !stackable |
| Coupon discount | conflict-pick-coupon | (동일 조건) |

### 출력 (Outputs)

**Reservations Summary**
- `cartGroups()` 페어별:
  - 병원명 + 방문일 + 시술 list (checkout_treatments_in i18n)
  - 그룹별 소계

**동적 가격 계산** (우측)
- Base price
- Enterprise discount (적용되면)
- Coupon discount (적용되면)
- Estimated total

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 폼 제출 (Submit) | 각 cartGroup마다 booking 생성 | `#/checkout-done?ids={id1,id2,…}` | `toast_booking_submitted` |
| 제출 후 | state.cart = [] (비움) | — | — |

### 검증 & 에러

| 입력 | 규칙 | 에러 키 | 처리 |
|------|------|--------|------|
| phone | `^[+\d\-\s()]{10,20}$` | `err_phone` | 인라인 오류 |
| age | 18 ≤ age ≤ 120 | `err_age` | 인라인 오류 |
| passport | `/^[A-Za-z0-9]{6,12}$/` | `err_passport` | 인라인 오류 |
| entry/exit | exit > entry | `err_dates` | 인라인 오류 |
| 필수 필드 | (모두 입력됨) | `err_required` | 섹션별 하이라이트 |
| 충돌 선택 | conflict 발생 시 선택 필수 | — | 라디오 강제 선택 |

### i18n & a11y

**i18n 키**
- `checkout_reservations_t`, `checkout_reservations_s`
- `checkout_patient_*`, `checkout_travel_*`, `checkout_addons_*`
- `checkout_confirm`, `checkout_cancel`
- `err_phone`, `err_age`, `err_passport`, `err_dates`, `err_required`
- `conflict_title`, `conflict_pick_enterprise`, `conflict_pick_coupon`

**a11y**
- 각 섹션: `<fieldset>` + `<legend>`
- 필수 필드: `aria-required="true"`
- 오류: `aria-invalid="true"` + `aria-describedby="error-{field}"`
- 합계 카드: `aria-live="polite"` (가격 변동 시)

---

## P08' · 결제 완료 인터스티셜

### 라우트
- **URL**: `#/checkout-done?ids={csv}`
- **권한 가드**: 게스트도 진입 가능 (예약 ID 공개 노출 X, 보안 주의)
- **파라미터**: `ids` — CSV booking IDs (예: `id1,id2,id3`)

### 목적
제출된 예약들을 카드 그리드로 확인하고  
"내 예약 보기"로 상세 추적 페이지로 진입.

### 레이아웃

**데스크톱**
- H1 "예약 완료!" + 부제
- booking 카드 grid (md:grid-cols-2)
- 각 카드: photo-tile + status chip(waiting 황색) + booking ID(mono) + 병원명 + visitDate + 시술 개수 + 가격
- 중앙 "내 예약 모두 보기" 링크

**모바일**
- 1 column 풀 너비

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 카드 클릭 | clickable | booking-{id} | N | 클릭 → `#/booking/{id}` |
| "모두 보기" | link | view-all-bookings | N | 클릭 → `#/bookings` |

### 출력 (Outputs)

**동적 데이터** (state.bookings)
- URL `ids` 파라미터 파싱 (CSV)
- 각 ID마다:
  - 병원 photo-tile
  - `status_waiting` 칩
  - booking ID (mono font)
  - 병원명
  - visitDate
  - 시술 개수
  - 총 가격

**누락된 ID**
- 카드 미렌더 (무시)

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 카드 클릭 | — | `#/booking/{id}` | — |
| "모두 보기" | — | `#/bookings` | — |

### 검증 & 에러

없음 (읽기전용 확인 화면).

### i18n & a11y

**i18n 키**
- `checkout_done_t`, `checkout_done_s`
- `view_all_bookings`
- `status_waiting`, `booking_id`, `hospital_name`, `visit_date`, `service_count`, `total_price`

**a11y**
- 각 카드: `role="link"`, `tabindex="0"`
- 카드 정보: `aria-label="예약 ABC-001, Samsung Medical Center, 2026-06-15, 2개 시술, $1,500"`

---

## P09 · OAuth 로그인 (Interstitial)

### 라우트
- **URL**: `#/signin?next={url}`
- **권한 가드**: 이미 로그인한 경우 next로 리다이렉트
- **파라미터**: `next` (선택, 기본값: `#/`)

### 목적
Google/Apple OAuth를 통해 사용자 인증하고  
프로필 기본정보 수집 후 온보딩 또는 요청 라우트로 진입.

### 레이아웃

**중앙 카드** (모든 해상도)
- 로고 + H1 "Sign in" + 부제
- Google 버튼 (Google 로고 + 텍스트)
- Apple 버튼 (Apple 로고 + 텍스트)
- Terms/Privacy 약관 안내 (`signin_terms`)
- 데모 전용 칩 (`signin_mock` "Demo mode: use any account")

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| Google 버튼 | button | signin-google | N | 클릭 → OAuth flow |
| Apple 버튼 | button | signin-apple | N | 클릭 → OAuth flow |

### 출력 (Outputs)

**데모 전용** (실제 OAuth 미구현)
- 클릭 시 `state.signedIn = true`
- `state.profile = PERSONAS[state.persona]` 설정
- 프로필이 완성되어 있으면 (citizenship 입력됨) → `next` 복귀
- 프로필 미완성 (citizenship 비어있음) → `#/onboarding?next={next}` 강제

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| OAuth 성공 (demo) | state.signedIn = true, state.profile 설정 | next 또는 `#/onboarding?next={next}` | — |
| OAuth 실패 | (에러 처리) | — | `toast_signin_error` |
| next 파라미터 미지정 | — | `#/` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|------|------|------|
| OAuth 결과 | profile.citizenship 확인 | citizenship 비어있으면 P10 강제 |
| next URL | 유효한 hash route | 유효하지 않으면 `#/` |

### i18n & a11y

**i18n 키**
- `signin_title`, `signin_subtitle`
- `signin_google`, `signin_apple`
- `signin_terms`, `signin_mock`

**a11y**
- Google/Apple 버튼: `aria-label="Google 계정으로 로그인"`, `aria-label="Apple 계정으로 로그인"`
- 약관 링크: `role="link"`, `tabindex="0"`

---

## P10 · 온보딩 (시민권 + 기업코드)

### 라우트
- **URL**: `#/onboarding?next={url}`
- **권한 가드**: 미인증 시 `#/signin?next={current}`로 리다이렉트
- **파라미터**: `next` (선택, 기본값: `#/`)

### 목적
시민권 자가신고(US/KR) + 기업 코드(선택) 수집하여  
사용자 티어 결정 및 가격 시뮬레이션 준비.

### 레이아웃

**중앙 폼** (모든 해상도)
- 로고 + H1 + 부제
- Email 필드 (읽기전용, OAuth로부터)
- **Citizenship** 라디오 (US / KR) + hint "Verified at the hospital on arrival."
- **Enterprise code** 입력 (선택, mono font, uppercase, placeholder `ACME-2026`)
- 코드 입력 시 "Verify now" 버튼 (데모 전용)
- Primary "Complete" 버튼

### 입력 (Inputs)

| 필드 | 타입 | 필드명 | 필수여부 | 검증 | 기본값 |
|------|------|--------|---------|------|--------|
| Email | text | email | Y | (읽기전용) | state.profile.email |
| Citizenship | radio | citizenship | Y | US/KR | (비어있음) |
| Enterprise code | text | enterprise-code | N | `/^[A-Z0-9\-]{4,20}$/` | "" |
| Verify now (demo) | button | verify-now | N | `NEXT_PUBLIC_DEMO_MODE` 가드 | — |

### 출력 (Outputs)

**동적 상태**
- Citizenship 선택 시: 가격 티어 즉시 반영
- Enterprise code 입력 시: PENDING 상태 + "Verify now" 버튼 노출
- Verify 클릭 후: VERIFIED 상태 + 토스트 + 가격 할인 적용

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| Citizenship 선택 | state.profile.citizenship 업데이트 | (재렌더) | — |
| Enterprise code 입력 | state.profile.enterprise 설정 + enterpriseStatus='pending' | (재렌더, "Verify now" 노출) | — |
| Verify now (demo) | state.profile.enterpriseStatus='verified' | (재렌더) | `toast_ent_verified` |
| Complete 클릭 | state.onboarded=true | `next` 복귀 | — |

### 검증 & 에러

| 입력 | 규칙 | 에러 키 | 처리 |
|------|------|--------|------|
| citizenship | 필수 선택 | — | 라디오 강제 |
| enterprise-code | `/^[A-Z0-9\-]{4,20}$/` | `err_enterprise_format` | 인라인 오류 |
| 미입력 enterprise | (선택이므로 패스) | — | 기본 시민권 티어 적용 |

### i18n & a11y

**i18n 키**
- `onboarding_title`, `onboarding_subtitle`
- `onboarding_email`, `onboarding_citizenship`, `onboarding_citizenship_hint`
- `onboarding_enterprise_code`, `onboarding_verify_now`, `onboarding_complete`

**a11y**
- Citizenship 라디오: `role="radio"`, `aria-checked="true|false"`
- Enterprise input: `aria-label="기업 코드, 선택 항목"`
- Verify 버튼: `aria-label="데모 모드: 즉시 인증"`(데모 전용)

---

## P11 · 단일 시술 예약 신청서

### 라우트
- **URL**: `#/book/{hospitalId}/{serviceId}`
- **권한 가드**: 미인증 시 `#/signin?next={current}` 리다이렉트
- **필수 파라미터**: `hospitalId`, `serviceId`

### 목적
단일 시술에 대해 환자 + 여행 + 부가서비스 정보를 수집하여  
booking을 생성하고 상태 페이지로 진입.

### 레이아웃

**데스크톱**
- 상단: 시술 정보 hero strip (photo-tile + 진료과 + 병원명 + 시술명)
- 좌측: 폼 3섹션 (Patient / Travel / Add-ons) — P08과 동일
- 우측 sticky: 가격 카드 + 충돌 라디오 + 쿠폰 입력

**모바일**
- 1 column (hero + 폼 + 사이드바 순)

### 입력 (Inputs)

**모두 P08과 동일** (Patient / Travel / Add-ons 폼)

### 출력 (Outputs)

**상단 Hero Strip**
- 시술 photo-tile (병원 팔레트)
- 진료과명 (eyebrow)
- 병원명 + 링크
- 시술명 (대제목)

**우측 가격 카드**
- 현재 페르소나 기준 가격 (라이브 계산)

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 폼 제출 (Submit) | 새 booking 생성 (state.bookings[id]) | `#/booking/{id}` | `toast_booking_created` |
| 유효성 실패 | (폼 유지) | — | `toast_validation_error` |

### 검증 & 에러

| 입력 | 규칙 | 에러 키 | 처리 |
|------|------|--------|------|
| phone | `^[+\d\-\s()]{10,20}$` | `err_phone` | 인라인 오류 |
| age | 18–120 | `err_age` | 인라인 오류 |
| passport | `/^[A-Za-z0-9]{6,12}$/` | `err_passport` | 인라인 오류 |
| entry/exit | exit ≥ visit, entry ≤ visit | `err_dates` | 인라인 오류 |
| 필수 필드 | (모두 입력) | `err_required` | 섹션별 하이라이트 |
| 충돌 | entDiscount > 0 && coupon && !stackable | — | 라디오 강제 선택 |

### i18n & a11y

**i18n 키** — P08과 동일

**a11y** — P08과 동일

---

## P12 · 예약 상태 (4-step 타임라인)

### 라우트
- **URL**: `#/booking/{id}`
- **권한 가드**: 미인증 시 `#/signin?next={current}` 리다이렉트
- **필수 파라미터**: `id` (booking ID)

### 목적
예약의 전체 진행 상황을 4-step 타임라인으로 시각화하고,  
상태 변경(병원 승인)을 시뮬레이션 또는 감시.

### 레이아웃

**데스크톱**
- 좌측: Booking detail 카드 (병원 photo-tile + 진료과 + 병원명 + 위치 + visitDate + 시술 list + 환자 DL with 여권 마스킹) + Timeline
- 우측 sticky: 가격 breakdown

**모바일**
- 1 column (detail + timeline + 가격 순)

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| Simulate confirmation (demo) | button | simulate-confirm | N | `NEXT_PUBLIC_DEMO_MODE` 가드 |

### 출력 (Outputs)

**Booking Detail**
- 병원 photo-tile (팔레트)
- 진료과명 (eyebrow)
- 병원명 + 위치 (address)
- visitDate
- 시술 list (이름 + 가격 × N개)
- 환자 정보:
  - 이름, 성별, 나이
  - 여권 마스킹 (`●●●●●678` 형식 — 마지막 3글자만)

**4-Step Timeline**
1. **Request submitted** ✓ (항상 완료)
2. **Forwarded to hospital** ✓ (항상 완료)
3. **Hospital confirmed** (status=confirmed시만 ✓)
4. **CS notified for add-ons** (addon 체크된 예약만, status=confirmed시)

**상태별 표시**
- status=waiting:
  - info 박스 "예약 대기 중입니다"
  - **Simulate hospital confirmation** 버튼 (데모 전용, id `simulate-confirm`)
  - hint 텍스트 `simulate_hint`
- status=confirmed:
  - success 박스 "예약이 확정되었습니다"
  - `confirmed_summary` 메시지

**우측 가격 카드**
- Base + Enterprise discount + Coupon discount + Total breakdown

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| Simulate confirm 클릭 | state.bookings[id].status='confirmed' | (재렌더) | `toast_hospital_ok` |
| (실제 API) | 병원 확인 후 webhook/polling | (자동 재렌더) | `toast_hospital_ok` |

### 검증 & 에러

없음 (읽기 및 시뮬레이션 전용).

### i18n & a11y

**i18n 키**
- `booking_detail_t`, `booking_detail_s`
- `booking_patient_info`, `booking_passport_masked`
- `booking_timeline_*` (4-step 제목)
- `booking_status_waiting`, `booking_status_confirmed`
- `simulate_hint`, `confirmed_summary`
- `toast_hospital_ok`

**a11y**
- Timeline: `role="list"` + `role="listitem"` per step
- 각 step: `aria-current="step"` (현재 단계 표시)
- Simulate 버튼: `aria-label="데모 모드: 병원 승인 시뮬레이션 (개발용)"`

**prefers-reduced-motion**
- Timeline step 연결선 animation 제거
- 상태 전이 transition 비활성

---

## P13 · 내 예약 목록

### 라우트
- **URL**: `#/bookings`
- **권한 가드**: 미인증 시 `#/signin?next=#/bookings` 리다이렉트

### 목적
사용자의 모든 booking을 카드 그리드로 보여주고,  
각 예약의 상세 페이지로 진입.

### 레이아웃

**데스크톱**
- H1 + 부제
- booking 카드 grid (md:grid-cols-2)
- 각 카드: 작은 photo-tile + status chip(confirmed 녹색/waiting 황색) + booking ID(mono) + 병원명 + visitDate + 시술 개수 + 총 가격

**모바일**
- H1 + 부제
- 1 column 풀 너비

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 카드 클릭 | clickable | booking-{id} | N | 클릭 → `#/booking/{id}` |

### 출력 (Outputs)

**동적 데이터** (state.bookings)
- 모든 booking의 목록

**각 카드**
- 작은 photo-tile (병원 팔레트)
- status 칩 (confirmed = 녹색 `pill-confirmed` / waiting = 황색 `pill-waiting`)
- booking ID (mono font, 예: `ABC-0001`)
- 병원명
- visitDate
- 시술 개수 (예: `2 × Services`)
- 총 가격 (계산값)

**빈 상태**
- `no_bookings_t` + `no_bookings_s` 메시지
- "Browse services" CTA → `#/departments`

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 카드 클릭 | — | `#/booking/{id}` | — |
| Browse CTA | — | `#/departments` | — |

### 검증 & 에러

없음 (읽기전용).

### i18n & a11y

**i18n 키**
- `bookings_title`, `bookings_subtitle`
- `no_bookings_t`, `no_bookings_s`, `no_bookings_cta`
- `status_confirmed`, `status_waiting`
- `booking_id`, `hospital_name`, `visit_date`, `service_count`, `total_price`

**a11y**
- 각 카드: `role="link"`, `tabindex="0"`
- 카드 정보: `aria-label="예약 ABC-0001, Samsung Medical Center, 2026-06-15, 상태: 확정, 2개 시술, $1,500"`

---

## P15 · Providers (파트너 병원 목록 + 상세)

### 라우트
- **List**: `#/providers?spec={dept}&loc={location}&eng=1&intl=1`
- **Detail**: `#/providers/:id`
- **권한 가드**: 게스트 열람 가능, 로그인 시 예약 진행

### 목적
미국 거주자에게 검증된 한국 의료 파트너를 신뢰 단서와 함께 노출하고,  
진료과·지역·외국인 친화 필터 → 상세 → 시술·리뷰·B&A → 문의 CTA로 전환.

### 레이아웃

**List 화면 (데스크톱)**
- sd-paper 헤더 (eyebrow + H1 + subtitle)
- sd-mist 필터바 (specialty, location, english_support, international_ward 4종 select)
- 병원 카드 그리드 3-col (responsive)
- Empty state + 제안

**List 화면 (모바일)**
- 헤더 유지
- 필터바 collapsible `<details>`
- 카드 1 column

**Detail 화면 (데스크톱)**
- sd-navy hero (병원명, 주소, 별점, 리뷰수)
- sd-paper 본문 grid (좌측 main, 우측 sticky 320px)
- Overview · 신뢰 배지 4종 · 진료과 칩 · 시술 그리드 · 관련 리뷰 4건 · B&A 케이스 · "이 파트너에 대해 문의" CTA

**Detail 화면 (모바일)**
- Hero full width
- 1 column 본문 + 사이드바 하단

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 진료과 필터 | select | filter-spec | N | URL params |
| 지역 필터 | select | filter-loc | N | URL params |
| 영어 진료 체크 | checkbox | filter-eng | N | URL params |
| 국제 병동 체크 | checkbox | filter-intl | N | URL params |
| 병원 카드 (list) | clickable | hospital-{id} | N | 클릭 → detail |

### 출력 (Outputs)

**List 화면**
- 병원 카드 그리드: 이름 · 진료과 칩 · 평점 · 리뷰수 · 지역 · "View provider" CTA
- Empty state (필터 조합 빈 결과 시)

**Detail 화면**
- 병원 상세정보 (이름, 주소, 연락처)
- 신뢰 배지 4종 (JCI, KSAPS, ISAPS, English reports)
- 진료과별 시술 그리드 (가격 페르소나 적용)
- 관련 리뷰 4건 카드
- B&A 케이스
- "이 파트너에 대해 문의" CTA (→ `#/qa`)

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 필터 변경 | filters 갱신 | URL push → fetch hospitals | — |
| 병원 카드 클릭 | — | `#/providers/:id` | — |
| "문의하기" CTA | — | `#/qa` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|-----|------|------|
| 필터 조합 빈 결과 | 결과 ≤ 0 | Empty state + 제안 |
| 없는 hospital_id | URL에서 파싱 실패 | 404 fallback (empty) |

### i18n & a11y

**i18n 키**
- `pv_*` (providers list 텍스트)
- `pvd_*` (provider detail 텍스트)
- 필터 라벨, 버튼 텍스트

**a11y**
- 필터 라벨: `<label for="filter-spec">` 명시적
- 병원 카드: `role="link"`, `tabindex="0"`
- navy hero 텍스트: 명도비 ≥ 4.5:1 검증
- 한국어 본문: `word-break: keep-all` (`.ko-keep-all` 유틸리티)

---

## P16 · Reviews (환자 후기)

### 라우트
- **URL**: `#/reviews?provider={id}&dept={spec}&rating={1-5}`
- **권한 가드**: 게스트 열람만 가능

### 목적
검증된 환자 후기를 한 곳에서 필터링하여 신뢰 단서 제공.  
가명·신원 차단 정책 준수.

### 레이아웃

**데스크톱**
- sd-paper 헤더 (eyebrow + H1 + subtitle)
- sd-mist 필터바 (provider, specialty, rating 3종)
- 리뷰 카드 그리드 2-col
- Empty state + 카운트

**모바일**
- 헤더 유지
- 필터 collapsible
- 카드 1 column

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 병원 필터 | select | filter-provider | N | URL params |
| 진료과 필터 | select | filter-dept | N | URL params |
| 평점 필터 | select | filter-rating | N | URL params (1-5) |
| 리뷰 카드 | clickable | review-{id} | N | 클릭 → provider detail |

### 출력 (Outputs)

- 리뷰 카드 (가명 · 메타 · 5-star rating · 인용문 · posted_at · verified 마크 · 언어)
- `REVIEW_DISCLAIMER_DEFAULT` 양 언어 고정 표시
- 필터 조합 결과 count

**빈 상태**
- `empty_reviews_t` + 제안 CTA

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 필터 변경 | filters 갱신 | URL push → fetch reviews | — |
| 리뷰 카드 클릭 | — | `#/providers/:id` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|-----|------|------|
| 필터 조합 빈 결과 | 결과 ≤ 0 | Empty state |

### i18n & a11y

**i18n 키**
- `rv_*` (reviews 텍스트, 필터 라벨)
- `REVIEW_DISCLAIMER_DEFAULT`

**a11y**
- Rating star: `aria-label="별점 {n}/5"`
- 리뷰 카드: `role="article"` + `aria-label="환자 후기, {병원명}, {평점}, {요약}"`
- 한국어: `word-break: keep-all`

---

## P17 · Before & After (전후 사진)

### 라우트
- **List**: `#/before-after?spec={dept}&provider={id}&recovery={days}`
- **Detail**: `#/before-after/:caseId`
- **권한 가드**: 게스트 열람 가능

### 목적
동의 기반 전·후 사례를 진료과·병원·회복 기간 필터로 탐색.  
한국 의료광고 정책 준수 (신원 차단·디스클레이머).

### 레이아웃

**List 화면 (데스크톱)**
- sd-paper 헤더
- sd-mist 필터 3종 (specialty, provider, recovery_days)
- 케이스 카드 그리드 3-col (before/after 분할 이미지, 진료과, 회복기간, 검증마크)
- Empty state

**Detail 화면 (데스크톱)**
- 큰 before/after 비교 hero (4:5 이미지 비율)
- 진료과 칩 · 회복기간·날짜 메타
- Provider 링크
- 동의 디스클레이머 (consent_meta 기반)
- "View this provider" CTA (→ `#/providers/:id`)
- 같은 진료과 다른 케이스 추천 3개

**모바일**
- Hero full width
- 1 column 정보 + 추천

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 진료과 필터 | select | filter-spec | N | URL params |
| 병원 필터 | select | filter-provider | N | URL params |
| 회복기간 필터 | select | filter-recovery | N | URL params |
| 케이스 카드 | clickable | case-{id} | N | 클릭 → detail |

### 출력 (Outputs)

**List 화면**
- 케이스 카드 (before/after 이미지 4:5 · 진료과 · 회복기간 · verified mark)
- Empty state (필터 조합 빈 결과 시)

**Detail 화면**
- Before/After 큰 비교 이미지
- 진료과, 회복기간, 시술 날짜 메타
- Provider 링크
- `BA_DISCLAIMER_DEFAULT` 양 언어 고정
- "View this provider" CTA
- 같은 진료과 추천 케이스 3개

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 필터 변경 | filters 갱신 | URL push → fetch cases | — |
| 케이스 카드 | — | `#/before-after/:caseId` | — |
| "Provider 보기" | — | `#/providers/:id` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|-----|------|------|
| consent_meta 만료 | expires < today | 자동 숨김 |
| identity_masked=false | 신원 식별 가능 이미지 | 비노출 |

### i18n & a11y

**i18n 키**
- `ba_*` (before-after list)
- `bad_*` (before-after detail)
- `BA_DISCLAIMER_DEFAULT`

**a11y**
- 이미지: `alt` 필수 (예: "시술 전 사진, 비포앤애프터 케이스 ID: {id}")
- 회복기간: 시간 단위 i18n (`hours`, `days`)
- 한국어: `word-break: keep-all`

---

## P18 · Blog (블로그)

### 라우트
- **List**: `#/blog?cat={category}&tag={tag}`
- **Detail**: `#/blog/:slug`
- **권한 가드**: 게스트 열람 가능

### 목적
한국 의료 가이드·치료 비용·여행 팁 등 콘텐츠로 SEO 유입 + 신뢰 강화.

### 레이아웃

**List 화면 (데스크톱)**
- sd-paper 헤더
- sd-mist 카테고리 필터 (또는 tag)
- 블로그 카드 그리드 (커버 이미지 · 카테고리 칩 · 제목 · 메타·일자)
- Pagination (또는 infinite scroll)

**Detail 화면 (데스크톱)**
- 커버 이미지 hero (full width)
- 카테고리·일자·읽기 시간 메타
- 본문 (markdown rendered to HTML)
- 추천 글 3건
- 공유 옵션 (URL copy · Twitter · LinkedIn)

**모바일**
- 커버 hero
- 1 column 본문 + 추천

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 카테고리 필터 | select | filter-cat | N | URL params |
| Tag 필터 | select | filter-tag | N | URL params |
| 블로그 카드 | clickable | post-{slug} | N | 클릭 → detail |
| 공유 버튼 | button | share-{provider} | N | Twitter/LinkedIn/Copy |

### 출력 (Outputs)

**List 화면**
- 블로그 카드 (커버 · 카테고리 칩 · 제목 · 발행일 · 읽기 시간)
- Pagination controls

**Detail 화면**
- 커버 이미지
- Metadata (카테고리, 발행일, 읽기 시간)
- 본문 콘텐츠 (HTML, markdown 렌더됨)
- 추천 글 3건 (같은 카테고리 또는 recent)
- 공유 옵션

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 카테고리 필터 | filter 갱신 | URL push | — |
| 블로그 카드 | — | `#/blog/:slug` | — |
| 추천 글 | — | `#/blog/:slug` | — |
| 공유 버튼 | — | 외부 링크 또는 clipboard | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|-----|------|------|
| published_at future | `published_at > today` | 비노출 (draft) |
| 잘못된 slug | slug not found | 404 page |

### i18n & a11y

**i18n 키**
- `bg_*` (blog 텍스트, 필터 라벨)
- `blog_read_time`, `blog_share`

**a11y**
- Heading hierarchy h1-h3 검증
- 커버 이미지: `alt` 필수
- 한국어: `word-break: keep-all`
- 공유 버튼: `aria-label="Twitter로 공유"` 등

---

## P19 · Q&A (자주 묻는 질문)

### 라우트
- **URL**: `#/qa`
- **권한 가드**: 게스트 열람 가능

### 목적
진료 일정·요금·파트너·여행·SafeDoc 지원에 대한 자주 묻는 질문을 카테고리별로 제공.  
CS 인입 큐 감소.

### 레이아웃

**데스크톱 & 모바일**
- sd-paper 헤더 (eyebrow + H1 + subtitle)
- 카테고리 네비 (providers · treatments · pricing · travel · support 등, 수평 또는 버튼)
- 각 카테고리별 Q&A 아코디언 (`<details>`)
- 검색 입력 (Phase 2, optional)
- 추가 문의 CTA (→ `mailto:cs@safedoc.io`)

### 입력 (Inputs)

| 요소 | 타입 | 필드명 | 필수여부 | 검증 |
|------|------|--------|---------|------|
| 카테고리 네비 | button | cat-{name} | N | URL hash 갱신 (또는 scroll) |
| Q&A 아코디언 | `<details>` | qa-{id} | N | open/close toggle |
| 추가 문의 CTA | link | contact-cs | N | → `mailto:cs@safedoc.io` |

### 출력 (Outputs)

**동적 콘텐츠**
- 카테고리별 Q&A 아이템 (question · answer · category)
- 비어있는 카테고리는 숨김

**정적 콘텐츠**
- 헤더 텍스트
- 카테고리 라벨
- 추가 문의 안내 링크

### 상태 전이 (State transitions)

| 액션 | 상태 변경 | 라우트 | 토스트 |
|------|---------|--------|--------|
| 카테고리 클릭 | active category 갱신 | URL hash 갱신 (또는 in-page scroll) | — |
| 아코디언 open | `<details open>` | — | — |
| 추가 문의 클릭 | — | `mailto:cs@safedoc.io` | — |

### 검증 & 에러

| 항목 | 규칙 | 처리 |
|-----|------|------|
| 비어있는 카테고리 | qa_items.length === 0 | 숨김 |

### i18n & a11y

**i18n 키**
- `qa_*` (Q&A 텍스트, 카테고리 라벨)
- `qa_contact_cs`

**a11y**
- `<details>` native keyboard support (Enter/Space to toggle)
- `<summary>`: `aria-expanded="true|false"` (브라우저 자동)
- 카테고리 버튼: `aria-selected="true|false"`
- 한국어: `word-break: keep-all`

---

## 공통 섹션 (모든 화면)

### Header (sticky · 6 메뉴 + 언어 토글 + 카트 + 인증)

**위치**: sticky top-0 z-30 + `backdrop-blur-md`

**구성**
- **좌**: 로고 + 워드마크 2단 라벨
- **중**: 6개 메뉴 (MD 이상) + 로그인 시 My bookings
- **우**: 언어 토글 + 카트 알약 + 프로필/Sign in + CTA

**최상단**: 데모 리본 (검정)

### Footer (4-컬럼)

**구성**
- 브랜드 + 진료과 5개 + SafeDoc + Legal

### Persona Panel (플로팅, 데모 전용)

**위치**: fixed bottom-5 right-5 z-40  
**동작**: 3개 라디오 (us_individual / ka_kr_citizen / ka_enterprise) + Reset demo

### Toast (aria-live polite)

**위치**: 하단 중앙 fixed  
**자동 닫힘**: 4초

### Language Toggle (EN/한국어)

**위치**: 헤더 우측 세그먼트  
**동작**: 클릭 즉시 i18n 전체 교체 + `localStorage` 영속 + `document.documentElement.lang` 동기화

---

## 가격 정책 · computePrice()

```
base_price = user.citizenship === 'KR' ? service.kr_price : service.fx_price

enterprise_discount = user.enterprise && user.enterpriseStatus === 'verified' 
  ? floor(base_price × discount_pct / 100) 
  : 0

coupon_discount = couponCode ? COUPONS[couponCode].amount or pct : 0

if enterprise_discount > 0 && coupon_discount > 0 && !coupon.stackable:
  conflict = true
  
total = base_price - enterprise_discount - coupon_discount
```

---

## 상태 영속화 · localStorage

**키**: `safedoc_demo_v1` (JSON)

**스키마**:
- `lang`, `persona`, `signedIn`, `profile`, `cart`, `couponCode`, `conflictChoice`, `bookings`

---

## i18n 키 카테고리

| 카테고리 | 용도 |
|---------|------|
| `hp_*` | 랜딩(P01) |
| `nav_*` | 네비게이션 |
| `dept_*` | 진료과 |
| `svc_*` | 시술 |
| `hosp_*` | 병원 |
| `tab_*` | 탭 라벨 |
| `cart_*` | 장바구니 |
| `checkout_*` | 결제 |
| `booking_*` | 예약 상태 |
| `signin_*` / `onboarding_*` | 인증 |
| `status_*` | 상태 칩 |
| `toast_*` / `err_*` | 메시지 |
| `footer_*` | 푸터 |
| `kr_*` | KR DB 라벨 |
| `pv_*` / `pvd_*` | Providers (P15) |
| `rv_*` | Reviews (P16) |
| `ba_*` / `bad_*` | Before & After (P17) |
| `bg_*` | Blog (P18) |
| `qa_*` | Q&A (P19) |

---

## 키보드 & 접근성

**전역 Tab 순서**:  
Header → 본문 (섹션 내) → 사이드바 → Footer → Persona Panel

**WCAG 2.2 AA**: 색 대비 4.5:1, focus-visible, ARIA 적절

**prefers-reduced-motion**: 애니메이션 제거 (마퀴, 탭, 호버 transition)

---

## 비기능 요구사항 (NFR)

| 항목 | 목표 |
|------|------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| JS 번들 | < 150kb gzipped |
| WCAG | 2.2 AA |
| i18n | EN/KO |

---

## 데모 환경 가드

**제거 대상** (`NEXT_PUBLIC_DEMO_MODE` 가드)
- Persona Panel
- Simulate 버튼 (P10, P12)
- Reset demo 버튼
- Demo chip/ribbon
- Mock OAuth

---

**End of Functional Specification v1.0**
