# SafeDoc Global Service — 개발팀 합의 미팅 아젠다

**대상 미팅**: 한국 본사 백엔드/어드민 팀 ↔ 글로벌 신규 팀 합동
**제안 일정**: 2026-05-07 또는 5-08 (D-8 ~ D-7 from 5/15 CEO 데모)
**소요시간**: **120 분 1세션** 또는 **60 분 × 2세션 (Day 1 아키텍처 / Day 2 보안·운영)**
**참석자**: 한국 백엔드 SPOC 1, 한국 어드민/병원 워크플로 SPOC 1, 글로벌 FE/BE 리드 2-3, Human PM, (옵션) 법무 자문 1
**목표**: P0 18건 항목 합의 + ADR 작성 책임자 지정 → 2026-05-15 데모 직전 게이트 통과 가능 상태로 진입
**참조**: `.pm/product-brief.md` · `.pm/korean-data-mapping.md` · `.pm/risk-register.md` · `.pm/legal/hipaa-position.md` · `docs/SafeDoc-요구사항정의서-v1.0.pdf` · `docs/SafeDoc-UI-UX-기획서-v1.0.pdf`

---

## 0. Opening & 공통 전제 정렬 (10분)

| # | 항목 | 합의 포인트 |
|---|------|-------------|
| 0-1 | 제품 정의 재확인 | 비-EHR · 비-임상 시스템 · 한국 병원 예약 플랫폼 (US 거주자 대상). EHR/CCDA/임상 LLM은 영구 out-of-scope (`product-brief.md`) |
| 0-2 | 컴플라이언스 자세 | **Option C** — non-HIPAA + Texas HB 300 + CCPA/CPRA-equivalent + PIPA cross-border consent (`legal/hipaa-position.md`) |
| 0-3 | 핵심 아키텍처 원칙 | **한국 DB 공유/복제 안 함, Korean API로 read/push** (이미 결정 — `korean-data-mapping.md`) |
| 0-4 | 데모 스코프 | Stripe · Flutter Web · 네이티브 앱은 **Phase 2** 명시적 deferred. 데모는 "request → hospital confirm → confirmed"까지 |

---

## 1. 아키텍처 & 인프라 (40분)

### 1-A. 서버·배포 토폴로지 [P0]

| # | 결정 질문 | 옵션 | 권장 | 트레이드오프 / 리스크 |
|---|-----------|------|------|----------------------|
| **A-1** | 글로벌 백엔드 형태 | A) Next.js Route Handlers BFF 단독 / B) 별도 API 서비스 + Next.js / C) 한국 서비스 직접 확장 | **A → 데모, B 후보 GA** | C는 한국 스키마 오염·PII 거주성 위반. A는 단일 배포·속도. |
| **A-2** | 호스팅 타깃 | A) Vercel(FE/BFF) + Supabase·Neon(DB) us-east / B) AWS ECS+RDS(us-east) / C) Cloud Run | **A 데모, B 후보 GA → ADR 트랙** | A는 데모 속도·preview env 자동. B는 HB 300·엔터프라이즈 정합 우수. |
| **A-3** | 도메인·CSP 격리 | A) `global.safedoc.io` 분리 호스트 / B) `safedoc.io/global` 경로 / C) 신규 브랜드 도메인 | **A** | 쿠키·CSP 격리 깨끗, HSTS preload, X-Frame DENY. |
| **A-4** | 환경 분리 / CI·CD | dev/staging/prod 3환경 + PR preview, lint→test→build→deploy(preview)→manual prod | **확정** | Snyk·Gitleaks 게이트 R-009. |

### 1-B. 한국 ↔ 글로벌 인터페이스 계약 [P0]

| # | 결정 질문 | 옵션 | 권장 | 비고 |
|---|-----------|------|------|------|
| **A-5** | API 계약 형식 | A) OpenAPI 3.1 + 코드젠 / B) GraphQL / C) gRPC | **A** | 한국팀 친숙도·툴 성숙. R-013 dependency. |
| **A-6** | KR API 모킹 전략 | A) Prism + OpenAPI 자동 mock / B) MSW handler / C) KR staging 직접 의존 | **A 1차 + B 컴포넌트 단위** | C는 R-013 그대로 노출. FE 블로킹 방지. |
| **A-7** | KR API 호출 인증 | A) 정적 API 키 (env) / B) **Secrets Manager에 키 + 30일 순환** / C) JWT(15min) 또는 mTLS | **B 데모, C 검토 GA** | mTLS는 한국팀 인프라 확인 필요. R-016. |

### 1-C. 캐시·관측성·가격 계산 [P1]

| # | 결정 질문 | 옵션 | 권장 |
|---|-----------|------|------|
| **A-8** | KR API 응답 캐시 | A) Next.js `revalidate` / B) Upstash Redis BFF / C) CDN edge | **마스터 데이터 A+C, 가격 B (TTL 60s)** |
| **A-9** | 관측성 분리 | A) Sentry+Datadog us-east 글로벌 전용 / B) 한국 관측 스택 공유 / C) self-host | **A** — `beforeSend` PHI 스크러버 의무 (R-006) |
| **A-10** | 가격 계산 위치 | A) 글로벌 BFF / B) 한국 API / C) 클라이언트 | **A** — base price snapshot은 KR API에서, 시민권·엔터·쿠폰 적용은 글로벌 (mapping §8-2) |
| **A-11** | i18n 텍스트 소스 | A) 한국 DB jsonb `name_i18n` / B) 글로벌 캐시 / C) `*_translations` 테이블 | **A** (mapping §11) |

---

## 2. 데이터 레이어 (30분)

### 2-A. 글로벌 DB 엔진 + 거주성 [P0]

| # | 결정 질문 | 옵션 | 권장 |
|---|-----------|------|------|
| **D-1** | 글로벌 DB 엔진 | A) RDS Postgres 16 us-east-1 / B) Aurora Serverless v2 / C) Supabase·Neon | **A** — KMS CMK·VPC·`pgcrypto` 즉시 |
| **D-2** | 미국 사용자 PII 위치 | A) US 리전 / B) KR 리전 한국 DB와 동거 / C) 멀티리전 | **A** — PIPA cross-border + CCPA + HB 300 |
| **D-3** | 강 PII 저장 위치 | A) `reservations_global`(글로벌 DB) + 매핑 / B) 한국 `reservations` 컬럼 추가 / C) 한국 DB 별도 테이블 | **A** — mapping §8-2 일치 |
| **D-4** | 컬럼 암호화 | A) Application + KMS DEK envelope / B) `pgcrypto.pgp_sym_encrypt` / C) RDS at-rest only | **A** — `passport_number`·`nationality`·`email` 대상 (R-016) |

### 2-B. 일관성·스키마 거버넌스 [P0]

| # | 결정 질문 | 옵션 | 권장 |
|---|-----------|------|------|
| **D-5** | KR↔Global 일관성 | A) Read-through cache + circuit breaker / B) 동기 호출 / C) 마스터 데이터 글로벌 복제 | **A** — Redis TTL 마스터 5분, 가격 1분 |
| **D-6** | 한국 EXTEND 컬럼 소유권 | A) 글로벌팀 DDL 초안 → 한국팀 적용 / B) 한국팀 자체 작성 / C) 글로벌 별도 테이블로 우회 | **C 우선, 불가피한 컬럼만 A** (mapping §5-3, §8-2) |
| **D-7** | KR DDL 변경 감지 | A) OpenAPI 변경 PR 알림 / B) Flyway 변경 슬랙 웹훅 / C) CI에서 schema 스냅샷 비교 | **A + C 병행 + "breaking change 2주 전 통지" SLA** |
| **D-8** | 마이그레이션 도구 | A) Flyway / B) Prisma Migrate / C) sqitch | **A** — KR팀과 동일 패턴 통일 |

### 2-C. 권한 모델·감사·백업 [P0~P1]

| # | 결정 질문 | 권장 | 비고 |
|---|-----------|------|------|
| **D-9** | RLS 정책 | **`reservations_global`·`global_users`·`coupon_redemptions` RLS 활성화. `USING (user_id = (SELECT current_setting('app.current_user_id')::bigint))` 패턴 강제. user_id 컬럼 B-tree 인덱스 필수.** 매 마이그레이션 RLS 자동 테스트. | R-007 |
| **D-10** | 감사 로그 | **DB `audit_log` 90일 핫 + S3 Glacier 7년 콜드. PII 값 절대 미기록. `passport_number` 조회는 `pii_access_log` 분리.** | R-006 |
| **D-11** | 백업·DR | RDS PIT 활성화·35일 스냅샷·교차 리전(us-west-2) GA, 예약 데이터 5년·감사 7년 보관, 사용자 `deletion_requests` 별도 설계 | PIPA 의무 |
| **D-12** | dev/staging seed | **OpenAPI mock 서버 + Faker 합성 데이터.** 실 PII 절대 미복제. | R-006 |

---

## 3. 보안 · 컴플라이언스 (25분)

### 3-A. 데이터 흐름·동의 [P0]

| # | 결정 질문 | 권장 | 리스크 |
|---|-----------|------|--------|
| **S-1** | Cross-border 동의 UI | **회원가입 2-step: ① 서비스 약관 ② 민감정보·해외전송 별도 체크박스 2개.** 예약 폼에는 전송 대상·목적·보유기간 인라인 표시. | R-001 / R-017 |
| **S-2** | 강 PII 수명주기 | **여행 종료 +24개월 보관 → KMS 키 폐기 + DB purge.** 사용자 right-to-erasure 즉시 이행, 법적 hold 예외만 별도 플래그. | R-001 / R-016 |

### 3-B. 애플리케이션 보안 게이트 [P0]

| # | 결정 질문 | 권장 |
|---|-----------|------|
| **S-3** | 로그 PHI 스크러버 (R-006 CRITICAL) | **Sentry `beforeSend` redact + 로거 allowlist + ESLint `eslint-plugin-security` 룰로 `log.*(req.body)` CI 차단.** |
| **S-4** | IDOR 방어 (R-007 CRITICAL) | **DB RLS 주 방어선 + API 미들웨어 이중 체크 + CI에 RLS 스모크 테스트.** |
| **S-5** | OAuth 토큰 보안 | **httpOnly Secure SameSite=Strict 쿠키 (P0). NEXTAUTH_SECRET KMS·90일 순환 (P1).** localStorage 토큰 금지. |
| **S-6** | Rate limit + breached pw | **IP rate limit (P0, 로그인 5회/분). username 독립 bucket·HaveIBeenPwned (P1).** 로그인·예약 엔드포인트 양쪽 적용. |
| **S-7** | HTTP 보안 헤더 | **HSTS·X-Frame: DENY·X-Content-Type·Referrer-Policy·Permissions-Policy (P0). Nonce 기반 CSP (P1).** |
| **S-8** | 의존성·시크릿 스캔 | **Dependabot auto-PR + `npm audit` HIGH 게이트 + Gitleaks pre-commit (P0). Snyk + Syft SBOM (P1).** |

### 3-C. 침해 대응·운영 [P0/P1]

| # | 결정 질문 | 권장 |
|---|-----------|------|
| **S-9** | 침해 플레이북 | **(P0) 역할별 에스컬레이션 연락처 + Texas HB 300 60/30일 타임라인 메모. (P1) Sentry → Slack `#security-alerts` 자동 라우팅 + PagerDuty.** |
| **S-10** | PHI/PIPA 인시던트 override | **시간대 무관 즉시 Human PM + healthcare-reviewer 호출.** PIPA 72h 보고 초안 사전 준비. |

---

## 4. PM · 팀 코디네이션 (20분)

### 4-A. 의사결정·소통 채널 [P0]

| # | 결정 질문 | 권장 |
|---|-----------|------|
| **P-1** | 단일 SPOC + 동기 케이던스 | **KR SPOC 1·Global SPOC 1. 주 1회 동기 미팅 수 09:00 KST = 화 17:00 PT + 일 비동기 24h SLA.** |
| **P-2** | RACI 충돌 시 결정권자 | **(a) 어드민 US-필드 변경 → KR Eng R, Human PM A. (b) 가격·티어 정책 → Human PM A. (c) KR DDL → KR Eng R + Global Architect 24h veto window. 미해결 1영업일 → Human PM 에스컬레이션.** |
| **P-3** | 이슈 트래킹 단일 도구 | **GitHub Projects (저장소 인접·KR팀 GitHub 사용). ID 네이밍 `SDG-###` `conventions.md`에 명시.** |
| **P-4** | KR DDL 변경 cross-team review | **KR PR에 `global-impact` 라벨 의무 + Global Architect 24h SLA + ADR 작성.** |
| **P-5** | CS 운영 채널·SLA | **Confirm/decline → KR 어드민 → US 사용자 이메일 (영업일 24h SLA, 데모 주간 4h). 부가서비스 → `#safedoc-global-cs` Slack + 어드민 노트.** |

### 4-B. 마일스톤·게이트 [P0]

| # | 결정 질문 | 권장 |
|---|-----------|------|
| **P-6** | 5/15 데모까지 게이트 일정 | **5/08 스코프 freeze · 5/10 법무 sign-off (R-001) · 5/11 보안 통제 10건 attest · 5/13 dry-run 3-5 pilot 병원 · 5/14 go/no-go.** 미통과 → 즉시 PM 에스컬레이션. |

### 4-C. 운영·거버넌스 [P1]

| # | 결정 질문 | 권장 |
|---|-----------|------|
| **P-7** | 인시던트 on-call 분담 | **Follow-the-sun: PT 영업시간 = Global, KST 영업시간 = KR. 야간 겹침 PagerDuty 라운드로빈. PHI 인시던트는 시간대 무관 Human PM + healthcare-reviewer 즉시.** |
| **P-8** | `.pm/` 거버넌스 | **`.pm/` 쓰기는 PM agent + Human PM 한정. KR팀은 ADR PR로 기여. 모든 결정 항목 = ADR 의무.** |
| **P-9** | Phase 2 우선순위 결정 절차 | **5/16-5/22 retro 주간 → 5/22 Architecture sync에서 Stripe·Flutter Web·Refund ROI 비교 → 5/23 Human PM 단독 결정 + ADR.** |

---

## 5. 합의 결과 · 액션 아이템 (15분)

### 미팅 직후 산출물
- ADR 작성 책임자 + due date 지정 (각 P0 결정 1건당 1 ADR)
- `.pm/raci.md`·`.pm/cadence.md` 업데이트 (`doc-updater` 디스패치)
- `.pm/sprints/S0/plan.md`에 P-6 마일스톤 게이트 추가, 일별 burndown 시작
- `.pm/adr/0001-cross-team-ddl-review.md` 첫 ADR 신규 작성 (P-4)
- KR API OpenAPI 계약 초안 PR (A-5) — D+3까지

### 의사결정 우선순위 카운트
- **P0 (5/15 데모 전 필수)**: 18건 — 1세션 내 합의 목표
- **P1 (GA 전 필수)**: 13건 — 데모 후 14일 내 합의
- **P2 (GA 직후)**: 2건

### 미해결 / 추가 자문 필요
- **법무 자문 의제** — D-2(미국 PII 위치) · S-1(동의 UI 문구) · S-2(보관 24개월 적정성) · S-9(HB 300 60/30일 통지 구체 절차). US healthcare-privacy 변호사 + 한국 PIPA 전문가 dual review 필요.
- **재무 의제** — Vercel + Sentry + Datadog + Upstash + RDS 월 비용 시뮬레이션 (별도 미팅 권고).

---

## 부록 A. 우선순위별 결정 항목 일람 (총 33건)

### P0 (18건) — 5/15 데모 전 합의 필수
A-1 백엔드 형태 · A-2 호스팅 타깃 · A-3 도메인 · A-4 환경/CI · A-5 API 계약 · A-6 KR API mock · A-7 KR API 인증
D-1 DB 엔진 · D-2 PII 위치 · D-3 강 PII 저장 · D-4 컬럼 암호화 · D-5 일관성 · D-6 EXTEND 소유권 · D-9 RLS · D-10 감사 로그
S-1 Cross-border 동의 · S-2 PII 수명주기 · S-3 로그 PHI 스크러버 · S-4 IDOR/RLS · S-5 OAuth (httpOnly) · S-6 IP rate limit · S-7 HTTP 헤더 · S-8 Dependabot+Gitleaks · S-9 침해 플레이북 (B 수준) · S-10 PHI override
P-1 SPOC + 케이던스 · P-2 RACI 충돌 룰 · P-3 이슈 트래킹 · P-4 KR DDL review · P-5 CS SLA · P-6 데모 게이트

### P1 (13건) — GA 전 14일 내 합의
A-8 캐시 · A-9 관측성 · A-10 가격 계산 · A-11 i18n
D-7 DDL 변경 감지 · D-8 마이그레이션 도구 · D-11 백업 · D-12 seed
S-5(C) KMS 순환 · S-6(C) username bucket · S-7(C) nonce CSP · S-8(C) Snyk·SBOM · S-9(C) Sentry→Slack
P-7 on-call · P-8 거버넌스 · P-9 Phase 2 결정

### P2 (2건) — GA 직후
한국 어드민 확장 채널 · 부가서비스 CS 큐 데이터 모델

---

**작성**: Human PM · architect · database-reviewer · security-reviewer · project-pm-orchestrator (병렬 디스패치)
**작성일**: 2026-05-06
**문서 위치**: `/Users/williamlee/global-service/docs/dev-meeting-agenda.md`
