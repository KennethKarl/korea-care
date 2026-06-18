# SafeDoc Global Service 요구사항정의서 v2.2
## 개발 관점 (Development Perspective)

**프로젝트**: SafeDoc Global Service  
**버전**: v2.2  
**작성일**: 2026-05-15  
**범위**: 2026-05-15 데모 + 신규 라우트 5종  
**기술 스택**: Next.js 15, React 19, TypeScript, Tailwind CSS, PostgreSQL (KR 공유 · `gs` schema), Prisma  
**언어**: 한국어 본문 · 기술용어 영문 그대로  

---

## 1. 개요

### 1.1 한 줄 정의

SafeDoc Global Service는 미국 거주자가 한국의 SafeDoc 제휴 의료기관(병원·클리닉)을 **진료과 단위로 탐색**하고, **본인의 시민권·기업 제휴에 따라 차등화된 가격**을 실시간으로 확인하여, **예약 요청과 부가서비스(숙박·항공·투어)**를 통합 제출할 수 있는 **이중언어(EN/KO) 웹 플랫폼**이다.

### 1.2 데모 목표 (5/15)

1. **호스피탈리티**: 미국 거주자(한인·non-한인 모두)에게 신뢰 기반의 영문 인터페이스 제공
2. **가격 투명성**: 시민권 자가 신고 기반 차등 가격(KR_RESIDENT vs FOREIGNER) 실시간 표시
3. **기업 연동**: 기업 코드 입력 후 어드민 검증 흐름 시뮬레이션
4. **예약 흐름**: 쇼핑(탐색) → 결제 인테이크 → 예약 제출 → 상태 추적까지의 엔드-투-엔드 경험
5. **인터랙티브 시뮬레이터**: 랜딩 페이지 내 5개 레버(서비스·로그인·시민권·기업·쿠폰)로 실시간 가격 시뮬레이션
6. **콘텐츠·신뢰 면**: 파트너 병원·환자 후기·전후 사진·블로그·Q&A 5개 면을 동일 라우트 모델로 노출

### 1.3 이 제품이 아닌 것

- EHR/EMR 시스템 ✗
- 원격진료(Telehealth) ✗
- 임상 기록 시스템 ✗
- 실시간 슬롯 예약 시스템 ✗
- 결제 처리(Stripe 통합) ✗ — Phase 2
- 네이티브 앱(iOS/Android) ✗ — Phase 2

---

## 2. 범위 정의

### 2.1 In-Scope (v1 데모, 2026-05-15)

#### 플랫폼
- Next.js 기반 반응형 웹 (데스크톱 + 모바일 브라우저)
- EN / KO 이중언어 i18n (next-intl 또는 동급)
- Google / Apple OAuth 로그인 (email-password 없음)

#### 사용자 흐름
- 게스트 탐색(병원·시술·콘텐츠 검색 · 가격 읽기 불가)
- OAuth 로그인
- 시민권 자가 신고(KR / non-KR) → 가격 티어 잠금
- 기업 코드 입력 → 검증 대기(pending) 상태 → 어드민 검증 시뮬레이션 → verified
- 병원·시술 탐색(진료과 · 필터 · 정렬)
- 콘텐츠 면 탐색(파트너 병원 · 리뷰 · 전후 사진 · 블로그 · Q&A)
- 파트너 병원 → 상세(시술·리뷰·B&A) → Q&A 문의 흐름
- 멀티-병원 멀티-시술 장바구니
- 환자 프로필 입력(1회성, 모든 예약에 공통)
- 예약 그룹 자동 묶음((병원, 방문날짜) 페어)
- 예약 제출
- 예약 상태 추적(WAITING → CONFIRMED 시뮬레이션)

#### 가격 정책
- 3-tier 정가: KR_RESIDENT · FOREIGNER · ENTERPRISE(+할인)
- 쿠폰 지원(예: `SAFEDOC10`, `NEW200`) — 비-스택 쿠폰
- 쿠폰 vs 기업 할인 충돌 해소(라디오 선택)
- 부가서비스(add-on) 체크박스: 숙박·항공·투어(CS 큐로 라우팅)

#### 데이터베이스 연동
- KR PostgreSQL 공유 인스턴스의 `gs` schema에 글로벌 서비스 전용 테이블 자체 보유
- Prisma ORM 직결 (multiSchema preview feature)
- 16개 테이블: 마스터(진료과·병원·시술·프로그램·번역·이미지) + 회원·인증 + 기업 + 카트·예약 + 쿠폰 + 감사
- 운영자 페이지(병원관리자·세이프닥관리자, 타팀)는 동일 `gs` schema에 별 채널로 R/W
- KR Python API 호출 없음 · `audit_log.actor_id` 구조화 prefix로 운영자 면 계약

#### 어드민 & 데모
- 페르소나 전환 패널(데모 전용): 3개 페르소나 즉시 전환 → 가격 라이브 업데이트
- 기업 코드 검증 시뮬레이션 버튼
- 병원 확정(WAITING→CONFIRMED) 시뮬레이션 버튼
- 데모 초기화 버튼(상태 리셋)
- `NEXT_PUBLIC_DEMO_MODE` 환경변수 가드

### 2.2 Out-of-Scope (Phase 2 이후)

| 항목 | 사유 |
|------|------|
| Stripe 결제 통합 | 데모는 "payment instructions sent separately" |
| 네이티브 앱 | 반응형 웹 사용 |
| 실시간 슬롯 예약 | 요청 기반 흐름만 |
| 환불·취소 처리 | 정책 표시만, 코드 미구현 |
| 병원 자가 포털 | 한국 어드민 시스템 기존 사용 |
| 시민권 서류 검증 | 자가 신고만 |
| 의료 기록 업로드 | 단순 부가 정보만 |
| Kakao / Naver 로그인 | Google / Apple만 |
| USD 외 통화 | USD only(demo) |

### 2.3 Phase 2 후보

- 결제 결과 통보(결제 게이트웨이)
- 상태 알림(이메일·SMS·인앱 푸시)
- 환자 세부 정보 재입력 제거(저장된 프로필 재사용)
- 병원 슬롯 달력 동기화
- 고급 필터(의사·언어·시간 등)

---

## 3. 이해관계자 & 페르소나

### 3.1 주요 페르소나 (3종)

#### Persona 1: FOREIGNER (미국 일반 거주자)
- **정의**: 미국 시민권자, 한국 시민권 미보유
- **지역**: 텍사스, 캘리포니아, 뉴욕 등 미국 대도시
- **특성**: 
  - 외국인 단가(FOREIGNER) 노출
  - 영문 인터페이스 필수
  - 부가서비스(숙박·항공) 높은 관심
- **예시**: "미국 시민 30대 여성, 피부과 시술 문의"

#### Persona 2: KR_RESIDENT (한국 시민권 미국 거주자)
- **정의**: 미국 거주 한국 시민권자(이중국적 포함)
- **지역**: LA·뉴욕 등 한인 밀집 지역
- **특성**:
  - 한국 거주자 단가(KR_RESIDENT) 노출
  - KO 인터페이스 선호, EN 병행
  - 기존 병원 상담 경험 있음
- **예시**: "LA 거주 미국 시민권자이면서 한국 시민권 유지, 성형 시술"

#### Persona 3: KR_RESIDENT + ENTERPRISE
- **정의**: Persona 2 + 기업 코드(예: `ACME-2026`) 입력 → 검증 완료
- **특성**:
  - 기업 협상 할인율 적용
  - 부서별·사원별 할인 차등
  - 기업 HR 검증 필요
- **예시**: "Google Korea 임직원, 기업 복지 선택 진료비 보조"

### 3.2 계정 유형 & 가입 흐름

| 계정 유형 | 가입 입력 | 가격 적용 | 상태 전이 |
|-----------|---------|---------|---------|
| **Individual** | OAuth + 시민권 자가 신고(KR/non-KR) | 표준(KR_RESIDENT or FOREIGNER) | 즉시 active |
| **Enterprise-affiliated** | 위 + 기업 코드(예: `ACME-2026`) | 검증 전: 기본 시민권 가격 · 검증 후: 기업 할인 스택 | pending → verified(어드민) |

#### 시민권 자가 신고 정책 (v1)
- 여권·서류 검증 미수행
- 가입 시 2개 옵션 중 선택 → 가격 티어 **즉시 잠금**
- 허위 신고 시 결제·치료 단계 검증은 한국 어드민·CS 흐름에 위임

---

## 4. 시스템 아키텍처 개요

### 4.1 아키텍처 다이어그램

```
┌──────────────────────────────────────────────────────────────┐
│          글로벌 프론트엔드 (Vercel / Next.js 15)             │
│  ├─ 페이지: 랜딩, 진료과, 병원, 시술, 장바구니, 예약 등     │
│  ├─ Route Handlers: /api/auth, /api/cart, /api/bookings    │
│  └─ 상태: Zustand(클라이언트) + TanStack Query(캐싱)       │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS (세션 쿠키 HttpOnly+Secure)
                   │ Prisma ORM · Vercel KV (Seoul)
                   ▼
┌──────────────────────────────────────────────────────────────┐
│      Next.js Route Handlers (API Gateway / BFF)              │
│  ├─ POST /api/auth/callback → OAuth(Google/Apple) → DB     │
│  ├─ GET /api/hospitals → Prisma 쿼리 · 캐싱(5분)          │
│  ├─ GET /api/programs → Prisma 쿼리 · 캐싱                │
│  ├─ POST /api/bookings → Prisma 트랜잭션(FOR UPDATE)      │
│  ├─ GET /api/bookings/:id → 상태 폴링(30초 캐시)          │
│  └─ POST /api/demo/* → 데모 시뮬레이션(검증·상태변경)     │
│                                                              │
│  인증: NextAuth v5 + Prisma Adapter · DB Session           │
│  캐싱: Vercel KV (Seoul) — 마스터 5분, 상태 30초           │
└──────────────────┬──────────────────────────────────────────┘
                   │ Secure Compute (KR VPC 접근)
                   ▼
┌──────────────────────────────────────────────────────────────┐
│      KR VPC 내 PgBouncer (Transaction Mode)                 │
│  ├─ Connection pooling: Prisma `pgbouncer=true`            │
│  ├─ DDL 작업: `DIRECT_URL` 별도 연결                       │
└──────────────────┬──────────────────────────────────────────┘
                   │ 내부 DB 링크
                   ▼
┌──────────────────────────────────────────────────────────────┐
│    KR PostgreSQL (Shared) · `gs` Schema (글로벌 서비스)     │
│  ├─ 마스터: specialties, hospitals, programs, images 등    │
│  ├─ 회원: users, oauth_accounts, sessions, profiles        │
│  ├─ 예약: cart_lines, bookings, booking_services 등        │
│  └─ 감시: audit_log (actor_id prefix: user/hop/sd/system) │
│                                                              │
│  운영자 면(타팀): 동일 schema, 별 채널(①②) R/W           │
└──────────────────────────────────────────────────────────────┘

외부:
├─ Google / Apple OAuth
└─ External IDP (세션 발급)
```

### 4.2 데이터 흐름

**탐색 흐름**: 사용자 → Vercel Edge → Next.js Route Handler → Prisma → PgBouncer → KR DB(`gs` schema) → 캐싱(5분, Vercel KV Seoul) → 가격 티어 적용 → 렌더링

**예약 제출 흐름**: 사용자(폼 작성) → POST /api/bookings → Prisma 트랜잭션(cart_lines FOR UPDATE → bookings + booking_services + status_history + coupon_redemption + audit_log) → DB 커밋 → 운영자 페이지(타팀)가 동일 schema의 `booking_status_history` 상태 전이 → 사용자가 폴링으로 반영(30초 캐시 invalidate via revalidateTag)

---

## 5. 화면 라우트 맵

### 5.1 19개 주요 라우트 & 권한

| # | 화면명 | Route | 로그인 | 핵심 기능 | P |
|---|--------|-------|--------|----------|---|
| P01 | 랜딩(홈) | `#/` | 게스트 | Hero · 신뢰 마퀴 · 추천 · 전후 · 후기 · 3-step · FAQ · 가격 시뮬레이터 | P0 |
| P02 | 진료과 목록 | `#/departments` | 게스트 | 8개 카드, 병원 수, 진료과 목록 | P0 |
| P03 | 시술 카탈로그 | `#/services?dept=&price=&sort=` | 게스트 | 필터(진료과·병원·가격·고민), 정렬, 그룹핑 | P0 |
| P04 | 병원 목록 | `#/hospitals?dept=` | 게스트 | 진료과 필터 · 병원 카드(가격 범위 표시) | P0 |
| P05 | 병원 상세 | `#/hospital/:id?tab=services` | 게스트 | 4-탭(Services·Overview·Reviews·Location) · 시술 아코디언 · KR DB 필드 · sticky 가격 | P0 |
| P06 | 시술 상세 | `#/service/:id` | 게스트 | Hero · 설명·포함내용·과정·사후관리 · 같은 병원 추천 · 장바구니 | P0 |
| P07 | 장바구니 | `#/cart` | 로그인 | 라인-아이템(날짜 입력) · 예약 묶음(자동) · 합계 · 결제 진행 | P0 |
| P08 | 결제 인테이크 | `#/checkout` | 로그인 | 환자 프로필(1회성) · 예약 그룹 요약 · 부가서비스 · 제출 | P0 |
| P09 | 결제 완료 | `#/checkout-done` | 로그인 | 예약번호 리스트 · "전체 예약 보기" 진입 | P0 |
| P10 | 로그인 | `#/signin?next=` | 게스트 | Google/Apple OAuth 버튼(데모) · ?next= 콜백 | P0 |
| P11 | 온보딩 | `#/onboarding` | OAuth 직후 | 시민권 신고 · 기업 코드 입력 · 검증 시뮬 버튼 | P0 |
| P12 | 예약 폼(단건) | `#/book/:hospital/:service` | 로그인 | 환자/여행/부가서비스 입력 · 라이브 가격 · 쿠폰 충돌 라디오 | P0 |
| P13 | 예약 상태 | `#/booking/:id` | 로그인 | WAITING→CONFIRMED 타임라인 · 폴링 · 병원 확정 시뮬(데모) | P0 |
| P14 | 예약 목록 | `#/bookings` | 로그인 | 제출된 예약 리스트 · 상태 배지 · 상세 진입 | P0 |
| P15 | Providers (list+detail) | `#/providers?spec=&loc=&eng=&intl=` + `#/providers/:id` | 게스트 | 필터 4종 · navy hero · 신뢰 배지 · 시술/리뷰/B&A · Q&A 문의 | P0 |
| P16 | Reviews | `#/reviews?provider=&dept=&rating=` | 게스트 | 필터 3종 · 리뷰 카드 · 검증 마크 · 가명/디스클레이머 | P0 |
| P17 | Before & After (list+detail) | `#/before-after?spec=&provider=&recovery=` + `#/before-after/:caseId` | 게스트 | 필터 3종 · 동의 메타 · 신원 차단 · 디스클레이머 | P0 |
| P18 | Blog (list+detail) | `#/blog?cat=&tag=` + `#/blog/:slug` | 게스트 | 카테고리 필터 · SEO · 추천 글 | P1 |
| P19 | Q&A | `#/qa` | 게스트 | 카테고리 아코디언 · CS 인입 감소 | P0 |

---

## 6. 공통 위젯 & 레이아웃

### 6.1 Header

- **좌측**: 로고 + 브랜드명(`#/` 진입)
- **우측**: 언어 토글(EN/KO) + 프로필(게스트: "Sign in" / 로그인: 이니셜 드롭다운)

### 6.2 Footer

- 저작권·링크(About·Blog·Contact) · 소셜

### 6.3 Persona Panel (데모 전용)

**위치**: 우하단 떠다니는 위젯  
**기능**: 라디오로 3개 페르소나 즉시 전환(`demoPersona` 세션 쿠키) → 앱 전역 가격 재계산  
**보호**: `NEXT_PUBLIC_DEMO_MODE=true` 가드

### 6.4 Toast Notifications

- "이미 담겨 있습니다" (중복 카트)
- "기업 검증 완료"
- "예약 제출됨" (성공)
- 에러 메시지 (3초 자동 소멸)

### 6.5 Language Toggle

- Header 우측 EN/KO 세그먼트
- next-intl locale 변경 → 렌더링
- localStorage 영속

### 6.6 Sticky 가격 카드

**위치**: 우측(desktop) / 하단(mobile)  
**요소**: 기본가(strike-through) · 사용자 적용가 · 기업할인 · 쿠폰할인 · **총액(강조)** · 절약률 · CTA

---

## 7. 가격 정책 (개발 관점)

### 7.1 가격 계산 함수 (`computePrice`)

```typescript
// 의사코드
function computePrice(service, user, coupon) {
  let base = service.price;  // KR 거주자 기준가
  let tierPrice = base;
  
  // 1단계: 시민권별 조정
  switch(user.citizenship) {
    case 'KR': tierPrice = base; break;
    case 'NON_KR': tierPrice = base * 1.35; break;  // +35% markup
  }
  
  // 2단계: 기업 할인 적용(if verified)
  let enterpriseDiscount = 0;
  if (user.enterpriseStatus === 'VERIFIED') {
    enterpriseDiscount = tierPrice * user.enterpriseDiscountRate;
    tierPrice -= enterpriseDiscount;
  }
  
  // 3단계: 쿠폰 vs 기업 충돌 해소
  let couponDiscount = 0;
  if (coupon && enterpriseDiscount > 0) {
    // 사용자 선택 강제: 라디오로 양자택일
    if (userChoseEnterprise) {
      coupon = null;
    } else {
      enterpriseDiscount = 0;
    }
  }
  
  // 4단계: 쿠폰 할인
  if (coupon) {
    couponDiscount = coupon.type === 'FLAT' 
      ? coupon.amount 
      : tierPrice * coupon.rate;
  }
  
  let total = tierPrice - couponDiscount;
  
  return {
    base,
    tierPrice,
    enterpriseDiscount,
    couponDiscount,
    total,
    savings: (base - total) / base * 100,
  };
}
```

### 7.2 3-Tier 정가 모델

| Tier | 대상 | 기준가 | 예시(Base $500) |
|------|------|--------|-----------------|
| **KR_RESIDENT** | 한국 시민권 | 한국 기준가 | $500 |
| **FOREIGNER** | non-한국 시민권 | Base × 1.35 | $675 |
| **ENTERPRISE(+검증)** | 기업 코드 검증 완료 | Base − 기업할인율 | $400 (−20%) |

### 7.3 쿠폰 & 충돌 해소

**충돌 조건**: Enterprise discount > 0 AND Coupon code 입력  
**해소**: 라디오 강제 선택(약한 쪽 무효화)  
**쿠폰 예시**: `SAFEDOC10` (10%), `NEW200` ($200 flat)

---

## 8. 데이터 모델

**PK**: UUID (`gen_random_uuid()`) · 시간: `TIMESTAMPTZ DEFAULT now()` · 금액: `cents` (USD) · i18n: JSONB + `*_translations` 테이블

### A. 마스터 테이블 (의료기관·시술)

#### 8.1 Hospital (병원)

```typescript
interface Hospital {
  id: string;                     // UUID
  name_i18n: I18nText;            // { en: string, ko: string }
  description_i18n?: I18nText;
  address: string;                // 한국 주소
  phone: string;
  website_url?: string;
  images: string[];               // 이미지 UUID 배열
  verified_by_admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 8.2 Hospital 보강 컬럼 메모

```
englishSupport: boolean;          // 영문 상담 가능 여부 (foreignerFriendly과 별도)
internationalWard: boolean;       // 외국인 전용 병동 보유
accreditation: string[];          // 인증 배열: ['JCI', 'AABB', ...] (신뢰 배지용)
```

#### 8.3 Program (시술)

```typescript
interface Program {
  id: string;                     // UUID
  hospitalId: string;             // FK Hospital
  name_i18n: I18nText;
  description_i18n: I18nText;
  includedItems_i18n: I18nText;
  process_i18n?: I18nText;
  aftercare_i18n?: I18nText;
  basePriceCents: number;         // 한국 거주자 기준가(USD cents)
  specialtyId: string;            // FK Specialty
  createdAt: Date;
  updatedAt: Date;
}
```

#### 8.4 Specialty (진료과)

```typescript
interface Specialty {
  id: string;
  name_i18n: I18nText;
  description_i18n?: I18nText;
  createdAt: Date;
}
```

#### 8.5 HospitalSpecialty

```typescript
interface HospitalSpecialty {
  id: string;
  hospitalId: string;
  specialtyId: string;
  createdAt: Date;
}
```

**보조**: HospitalMedia, ProgramMedia, BeforeAfterCases (이미지 관리)

### B. 회원 & 인증

#### 8.6 User (회원)

```typescript
interface User {
  id: string;                     // UUID
  email: string;                  // 유니크
  citizenship: CitizenshipType;   // 'KR' | 'NON_KR'
  tier: PricingTier;              // 'KR_RESIDENT' | 'FOREIGNER' | 'ENTERPRISE'
  citizenship_change_count: number; // 6개월 내 변경 횟수(제한 2회)
  enterprise_affiliation_id?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 8.7 Profile (프로필)

```typescript
interface Profile {
  id: string;
  userId: string;                 // FK User
  firstName: string;
  lastName: string;
  dateOfBirth?: string;           // YYYY-MM-DD
  gender?: string;
  phone?: string;
  passport_no_encrypted?: string; // AES-256 암호화, 평문 금지
  nationality?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 8.8 OAuthAccount

```typescript
interface OAuthAccount {
  id: string;
  userId: string;
  provider: 'google' | 'apple';
  providerAccountId: string;
  createdAt: Date;
}
```

**보조**: Session, VerificationToken

### C. 기업

#### 8.9 EnterpriseCompany

```typescript
interface EnterpriseCompany {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}
```

#### 8.10 EnterpriseAffiliation

```typescript
interface EnterpriseAffiliation {
  id: string;
  userId: string;
  enterpriseCompanyId: string;
  status: AffiliationStatus;      // 'pending' | 'verified' | 'rejected'
  discount_rate_bps: number;      // basis points (e.g., 2000 = 20%)
  verified_at?: Date;
  verified_by?: string;           // admin user ID or email
  createdAt: Date;
  updatedAt: Date;
}
```

### D. 카트 & 예약

#### 8.11 CartLine (장바구니 라인)

```typescript
interface CartLine {
  id: string;
  userId: string;
  hospitalId: string;
  programId: string;
  visitDate?: string;             // YYYY-MM-DD
  computedPrice: ComputedPrice;   // 스냅샷
  appliedCouponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ComputedPrice {
  baseCents: number;
  tierDiscountCents: number;      // FOREIGNER +35%
  enterpriseDiscountCents: number;
  couponDiscountCents: number;
  totalCents: number;
  currency: 'USD';
}
```

#### 8.12 ReservationGroup (예약 그룹)

```typescript
interface ReservationGroup {
  id: string;
  userId: string;
  hospitalId: string;
  visitDate: string;              // YYYY-MM-DD
  cartLineIds: string[];
  groupNumber: number;
  subtotalCents: number;
  createdAt: Date;
}
```

#### 8.13 Booking (예약)

```typescript
interface Booking {
  id: string;                     // UUID
  userId: string;
  reservationGroupId: string;
  hospitalId: string;
  visitDate: string;
  status: BookingStatus;          // 'WAITING' | 'CONFIRMED' | 'CANCELLED'
  patientProfileSnapshot: {
    firstName: string;
    lastName: string;
    gender?: string;
    passportRef: string;          // 암호화 참조 ID (평문 금지)
  };
  totalAmountCents: number;
  appliedCouponCode?: string;
  requestedAt: Date;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 8.14 BookingService (예약 상세 서비스)

```typescript
interface BookingService {
  id: string;
  bookingId: string;
  programId: string;
  basePriceCents: number;
  appliedTierCents: number;       // 최종 티어 가격
  createdAt: Date;
}
```

#### 8.15 BookingStatusHistory (상태 추적)

```typescript
interface BookingStatusHistory {
  id: string;
  bookingId: string;
  oldStatus: BookingStatus;
  newStatus: BookingStatus;
  changedBy?: string;             // admin ID
  reason?: string;
  createdAt: Date;
}
```

#### 8.16 AddonRequest (부가서비스)

```typescript
interface AddonRequest {
  id: string;
  bookingId: string;
  lodging: boolean;
  flights: boolean;
  tours: boolean;
  notes?: string;
  routed_to?: string;             // CS 큐
  createdAt: Date;
}
```

### E. 쿠폰

#### 8.17 Coupon

```typescript
interface Coupon {
  id: string;
  code: string;                   // 유니크
  type: CouponType;               // 'FLAT' | 'PERCENT'
  amountOrRate: number;           // FLAT: cents, PERCENT: 0.0~1.0
  maxUses?: number;
  expiresAt?: Date;
  createdAt: Date;
}
```

#### 8.18 CouponRedemption

```typescript
interface CouponRedemption {
  id: string;
  couponId: string;
  userId: string;
  bookingId: string;
  discountCents: number;
  redeemedAt: Date;
}
```

### F. 콘텐츠 — Reviews · Blog · QA

#### 8.19 Review (리뷰)

```typescript
interface Review {
  id: string;                     // UUID
  hospitalId: string;             // FK Hospital
  userId?: string;                // FK User (nullable — 가명 리뷰)
  rating: number;                 // 1-5
  contentI18n: I18nText;          // 리뷰 본문
  locale?: string;                // 작성 언어 (en/ko)
  verified: boolean;              // 검증 마크
  postedAt: Date;
  source: 'manual' | 'imported' | 'user';  // 출처
  createdAt: Date;
  updatedAt: Date;
}
```

#### 8.20 BlogPost (블로그 글)

```typescript
interface BlogPost {
  id: string;                     // UUID
  slug: string;                   // UNIQUE, URL 친화적
  titleI18n: I18nText;
  bodyI18n: I18nText;
  coverUrl?: string;
  category: string;               // 카테고리 (e.g., 'recovery', 'tips')
  tags: string[];                 // 태그 배열
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}
```

#### 8.21 QAItem (Q&A)

```typescript
interface QAItem {
  id: string;                     // UUID
  category: string;               // 카테고리 (e.g., 'insurance', 'recovery', 'visa')
  questionI18n: I18nText;
  answerI18n: I18nText;
  displayOrder: number;           // 정렬 순서
  createdAt: Date;
  updatedAt: Date;
}
```

### G. 감시 & 데모

#### 8.22 AuditLog

```typescript
interface AuditLog {
  id: BigInt;                     // BIGSERIAL
  actor_id: string;               // prefix: 'user:<uuid>', 'hop:<id>', 'sd:<id>', 'system:<job>'
  resource: string;               // 'bookings' | 'users' | etc.
  action: string;                 // 'create' | 'update' | 'verify'
  changes: Record<string, any>;   // JSONB diff
  timestamp: Date;
}
```

#### 8.23 DemoState

```typescript
interface DemoState {
  id: string;
  sessionId: string;
  demoPersona: 'individual' | 'kr_citizen' | 'enterprise';
  state: Record<string, any>;     // JSONB
  lastUpdated: Date;
}
```

**Enums**:
```typescript
type CitizenshipType = 'KR' | 'NON_KR';
type PricingTier = 'KR_RESIDENT' | 'FOREIGNER' | 'ENTERPRISE';
type AffiliationStatus = 'pending' | 'verified' | 'rejected';
type BookingStatus = 'WAITING' | 'CONFIRMED' | 'CANCELLED';
type CouponType = 'FLAT' | 'PERCENT';

interface I18nText {
  en: string;
  ko: string;
}

interface I18nTextRequired {
  en: string;
  ko: string;
}
```

---

## 9. 외부 시스템 연동

### 9.1 외부 IDP (OAuth)

#### Google OAuth 2.0

| 항목 | 값 |
|------|---|
| **공급자** | Google Cloud Console |
| **Flow** | Authorization Code + PKCE |
| **Scopes** | `openid email profile` |
| **Callback** | `https://global.safedoc.io/api/auth/callback/google` |

#### Apple Sign-In

| 항목 | 값 |
|------|---|
| **공급자** | Apple Developer |
| **Flow** | OAuth 2.0 Authorization Code |
| **Scopes** | `name email` |
| **Callback** | `https://global.safedoc.io/api/auth/callback/apple` |

**구현**: NextAuth v5 + Prisma Adapter (oauth_accounts 테이블) · 다중 OAuth 자동연결 금지(1 OAuth account per user)

### 9.2 운영자 페이지(타팀) 인터페이스 계약

#### 동일 `gs` Schema 공유 구조

| 항목 | 값 |
|------|---|
| **Host** | PgBouncer (KR VPC) |
| **Database** | 동일 PostgreSQL 인스턴스 |
| **Schema** | `gs` (글로벌 서비스 공유) |
| **인증** | 별도 DB user (read/write 권한 차등화) |

#### `audit_log.actor_id` 구조화 Prefix

```
user:<uuid>                    # 글로벌 서비스 사용자 액션
hop:<hospital_admin_id>        # 병원 관리자 (①)
sd:<safedoc_admin_id>          # 세이프닥 관리자 (②)
system:<scheduled_job_name>    # 시스템 자동화
```

**예시**: 병원관리자(① id=5)가 booking 상태 변경 → `audit_log.actor_id = 'hop:5'`

#### ENUM 값 변경 정책

- 새 status 추가: 양 팀 합의 후 Prisma migration + 그래들 배포
- 기존 status 제거 금지 (backward compatible)
- i18n 변경: 각자 schema에서 `*_i18n` 또는 `*_translations` 유지

#### 운영자 페이지 스코프

- 우리 시스템: `booking_status_history` 기록, audit_log 작성만
- 타팀 책임: 병원관리자(①), 세이프닥관리자(②) 페이지 구현 및 `bookings.status` 업데이트

---

## 10. 국제화 (i18n)

### 10.1 언어 지원

- **EN / KO** (자동 감지 + 토글)
- **라인하이트**: EN 1.6, KO 1.65
- **영속성**: localStorage

### 10.2 번역 대상

- 사용자 노출 텍스트: 병원명, 시술명, 설명, 주소, 시술 과정
- 내부 제외: 상태 코드, 시스템 메시지

### 10.3 i18n 데이터 저장

글로벌 서비스 자체 보유 i18n 컬럼 (`name_i18n: JSONB { en: string, ko: string }`):
- 마스터 테이블에 i18n 컬럼 직접 포함 (hospitals.name_i18n, programs.description_i18n 등)
- 또는 별 `*_translations` 테이블 (specialty_translations, etc.)
- KR DB 외부 응답에 의존하지 않음 · 글로벌 서비스가 완전 자체 보유
- 다국어 필터·정렬도 모두 로컬 schema에서 처리

---

## 11. 비기능 요구사항 (NFR)

### 11.1 성능 (Core Web Vitals)

| 메트릭 | 목표 |
|--------|------|
| **LCP** | < 2.5s (Hero 이미지 eager, 동기 폰트) |
| **INP** | < 200ms (debounce 필터, 배치 업데이트) |
| **CLS** | < 0.1 (explicit 이미지 크기, min-height) |
| **FCP** | < 1.5s (inline critical CSS) |
| **TBT** | < 200ms (청크 분할, long task 최소화) |

### 11.2 번들 예산

- 랜딩: JS < 150KB, CSS < 30KB
- 탐색: JS < 200KB, CSS < 40KB
- 예약: JS < 150KB, CSS < 25KB

### 11.3 접근성 (WCAG 2.2 AA)

- 명도비 ≥ 4.5:1 (normal text)
- 포커스 표시 · Tab 키 접근
- `role=`, `aria-label`, `aria-expanded` 적절히 적용
- `prefers-reduced-motion` 지원(애니메이션 정지)
- 모든 이미지 alt text
- 폼 명시적 `<label>`
- 한국어 본문은 `word-break: keep-all` (`ko-keep-all` 유틸 클래스) 강제. 어절 단위 줄바꿈 보장.

### 11.4 보안 (일반 웹 수준)

- **HTTPS**: TLS 1.2+ · HSTS header
- **세션**: NextAuth v5 DB Session · HttpOnly · Secure · SameSite=Lax · 24h 타임아웃
- **CSRF**: NextAuth 기본 보호
- **XSS**: sanitize (DOMPurify) · CSP nonce
- **DB 자격증명**: 글로벌 서비스 전용 user(`gs_app`)로 분리 · `gs` schema 외 권한 제거
- **DB 접근**: PgBouncer 거쳐 KR VPC 내부 링크만 · Public IP 미노출
- **여권번호**: 애플리케이션 레이어 AES-256 암호화 (`Profile.passport_no_encrypted`) · 평문 저장 금지
- **입력 검증**: Zod 스키마 · 날짜 범위 · 전화 포맷
- **비밀번호**: OAuth만(저장소 없음)

---

## 12. 기술 스택

| 계층 | 기술 | 버전 |
|------|------|------|
| **프레임워크** | Next.js | 15 |
| **UI** | React | 19 |
| **언어** | TypeScript | strict |
| **스타일** | Tailwind CSS | 4.x |
| **상태** | Zustand + TanStack Query | v5 |
| **폼** | React Hook Form + Zod | - |
| **i18n** | next-intl | 3.x |
| **ORM** | Prisma | latest (multiSchema preview) |
| **인증** | NextAuth v5 + Prisma Adapter | - |
| **캐싱** | Vercel KV (Redis, Seoul) | - |
| **Connection Pool** | PgBouncer | transaction mode |
| **호스팅** | Vercel (Secure Compute) | Edge Runtime |
| **DB** | PostgreSQL (KR 공유, `gs` schema) | - |
| **가격 계산** | 서버 단독 (`lib/pricing/`) | - |
| **폰트** | Pretendard Variable + JetBrains Mono(코드 전용) | - |
| **디자인 시스템** | B/W/navy 모노크롬 베이스 (sd-paper · sd-mist · sd-ink · sd-navy) | - |
| **로깅** | Sentry | - |
| **테스트** | Vitest + Playwright | - |

---

## 13. 데모 전용 기능

### 13.1 Persona Panel

```typescript
if (isDemoMode) {
  <FloatingButton>
    3개 페르소나 라디오
    (us_individual / ka_kr_citizen / ka_enterprise)
    선택 시 demoPersona 세션 쿠키 + 가격 재계산
  </FloatingButton>
}
```

### 13.2 검증 시뮬레이션

- 온보딩: "관리자 승인 시뮬" 버튼 → pending → verified
- 예약 상태: "병원 확정 시뮬" 버튼 → WAITING → CONFIRMED

### 13.3 데모 초기화

- Settings → "Reset demo" → localStorage/쿠키 삭제 → 홈 리다이렉트

### 13.4 환경 변수 가드

```typescript
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
if (!isDemoMode) return null;  // 프로덕션에서 숨김
```

---

## 14. 마일스톤 & 일정

| Sprint | 기간 | 초점 | 담당 |
|--------|------|------|------|
| **0** | 5/6~5/8 | 셋업·아키텍처 | 아키텍트 |
| **1** | 5/9~5/10 | 랜딩·시뮬레이터 | FE 리드 |
| **2** | 5/11~5/12 | 탐색 흐름(P02~P06) | FE + 한국 API |
| **3** | 5/13~5/14 | 장바구니·예약(P07~P09) | FE + BFF |
| **4** | 5/14~5/15 | 상태·데모·QA | 전체 |

**주요 마일스톤**:
- M0 (5/8): 프로젝트 초기화 · API 계약
- M1 (5/10): 랜딩 + 시뮬레이터
- M2 (5/12): 탐색 + 장바구니
- M3 (5/14): 모든 14개 라우트
- M4 (5/15): QA + 데모

---

## 15. 수용 기준 (Demo Acceptance)

### 시나리오 1-9 체크리스트

1. **게스트 탐색**: 로그인 없이 병원 탐색, 가격 "Sign in" 잠금 ✓
2. **로그인 & 시민권**: KR/non-KR 선택 → 가격 즉시 변경 ✓
3. **기업 검증**: 코드 입력 → pending → "승인" 클릭 → verified → 할인 적용 ✓
4. **가격 시뮬레이터**: 5개 레버 조작 → 실시간 가격 계산 정확 ✓
5. **필터 & 정렬**: 모든 필터(진료과·가격·정렬) 작동 · URL 저장 ✓
6. **장바구니 묶음**: (병원, 날짜) 페어 자동 묶음 · 중복 차단 ✓
7. **결제 인테이크**: 폼 입력 → 제출 검증 · 예약 그룹 요약 ✓
8. **상태 추적**: WAITING → 운영자 페이지(타팀)가 동일 DB의 status 컬럼 변경 → "확정 시뮬" 버튼으로 시뮬 → CONFIRMED · 폴링 후 revalidateTag로 반영 ✓
9. **콘텐츠 면 탐색**: Providers/Reviews/B&A/Blog/Q&A 5개 면 모두 게스트 진입 가능, 필터 작동, empty state 정상 ✓

### 기술 검사

- **성능**: Lighthouse LCP < 2.5s ✓
- **접근성**: axe-core 0 violations · 키보드 탐색 ✓
- **반응형**: 375/768/1440px 모두 정상 ✓
- **i18n**: EN/KO 전환 완전 ✓
- **보안**: HTTPS · CSRF · sanitize · API 키 비공개 ✓

---

## 16. 환경 변수

### .env.local (서버 비공개)

```bash
# Database (PgBouncer via Secure Compute)
DATABASE_URL=postgres://gs_app:password@pgbouncer.kr-internal:6432/gs?pgbouncer=true&connection_limit=1&schema=gs
DIRECT_URL=postgres://gs_app:password@primary.kr-internal:5432/gs?schema=gs
DATABASE_SCHEMA=gs

# NextAuth
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=https://global.safedoc.io

# OAuth Providers
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
APPLE_CLIENT_ID=com.safedoc.global
APPLE_CLIENT_SECRET=xxxxx

# Caching (Vercel KV, Seoul)
KV_REST_API_URL=https://[project-id].kv.vercel.sh
KV_REST_API_TOKEN=xxxxx

# Logging
SENTRY_DSN=https://xxxxx@sentry.io
LOG_DRAIN_URL=https://log-drain.example.com

# Demo & Limits
CITIZENSHIP_CHANGE_LIMIT_PER_6M=2
NEXT_PUBLIC_DEMO_MODE=true

# Env
NODE_ENV=production
```

### .env.public (NEXT_PUBLIC_)

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_BASE=/api
```

---

## 17. 디렉터리 구조 (예상)

```
src/
├── app/
│   ├── (auth)/{signin,onboarding}/
│   ├── api/
│   │   ├── auth/
│   │   ├── hospitals/
│   │   ├── services/
│   │   ├── programs/
│   │   ├── cart/
│   │   ├── bookings/
│   │   └── demo/
│   ├── {departments,hospital,service,cart,checkout,booking,bookings}/
│   ├── providers/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── reviews/page.tsx
│   ├── before-after/
│   │   ├── page.tsx
│   │   └── [caseId]/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── qa/page.tsx
│   └── layout.tsx
├── components/{header,footer,persona-panel,simulator,cards}/
├── lib/
│   ├── auth.ts                  # NextAuth v5 config
│   ├── pricing/                 # 서버 가격 계산
│   │   ├── compute.ts
│   │   └── tiers.ts
│   ├── db/                      # Prisma client + queries
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── cache.ts                 # Vercel KV wrapper
│   ├── validator.ts
│   ├── demo.ts
│   └── encryption.ts            # 여권번호 AES-256
├── hooks/{useAuth,useCart,usePricing,useI18n,useDemoMode}/
├── types/{index,models}/
├── locales/{en.json,ko.json}/
└── styles/{globals.css,tokens.css}/

prisma/
├── schema.prisma                # @@schema("gs")
└── migrations/

tests/
├── unit/
├── integration/
└── e2e/
```

---

**문서 버전**: v2.2  
**최종 수정**: 2026-05-15  
**대상**: 개발팀 · 아키텍트 · QA

