# Korean DB ↔ Global Service 매핑

**작성일**: 2026-04-21
**출처**: 한국 백엔드 `global/document` Entity + Flyway DDL 기반 도메인 명세
**목적**: 글로벌 서비스(5/15 demo)가 한국 API로부터 **읽을 것 / 쓸 것 / 확장할 것 / 제외할 것**을 테이블·필드 단위로 확정하고, i18n 다국어 대상 필드를 식별한다. Korean API 계약 논의의 출발점.

**기준 규칙**

- 글로벌은 한국 DB를 공유/복제하지 않는다. Korean API를 통해 read/push 한다.
- 글로벌 전용 데이터(US 유저, 엔터프라이즈, 쿠폰, 부가서비스 요청 등)는 글로벌 서비스에만 저장한다.
- i18n은 **사용자에게 노출되는 텍스트 필드**에만 적용한다. 내부 관리용 텍스트는 제외.
- 한국 어드민 내부 워크플로우(검수, 정산, 진료내역 로그 등)는 글로벌 API 노출에서 제외한다.

---

## 분류 범례

| 표식 | 의미 |
| --- | --- |
| `READ` | Korean API에서 글로벌이 **읽어서 사용** |
| `WRITE` | 글로벌이 Korean API에 **생성/수정 요청** |
| `i18n` | EN/KO 번역 필요. 한국 DB에 `*_translations` 테이블 또는 `name_i18n` JSON 또는 `name_en` 컬럼으로 Korean team이 구조 제공 |
| `GLOBAL_ONLY` | 글로벌 서비스에만 존재하는 데이터 (한국 DB 미필요) |
| `EXTEND` | 한국 테이블에 **글로벌 전용 필드를 추가**해야 함 |
| `SKIP` | 5/15 demo 범위에서 제외 |

---

## 1. `departments` — 진료과

**분류**: `READ` — 진료과 선택 UI의 핵심 마스터.

| 컬럼 | 처리 | 비고 |
| --- | --- | --- |
| `id` | READ | 글로벌 모든 참조의 key |
| `name` | READ + **i18n** | 예: "피부과" → EN "Dermatology" |
| `order_no` | READ | 정렬 |
| `gnb` | READ + EXTEND 검토 | 한국 GNB 노출 플래그. 글로벌 GNB 구성은 다를 수 있음 — `global_gnb` 추가 검토 |
| `img` (jsonb) | READ | 이미지 URL은 CDN 공유 가능 |

**신규 필요**: `global_visible` (글로벌에서 해당 진료과를 노출할지), `global_order_no` (글로벌 전용 정렬) — Korean team과 논의 후 결정.

---

## 2. `treatments` — 상위 시술

**분류**: `READ`.

| 컬럼 | 처리 | 비고 |
| --- | --- | --- |
| `id` | READ | |
| `department_id` | READ | |
| `status` | READ | `ACTIVE`, `HIDDEN`만 노출 |
| `order_no` | READ | |
| `name` | READ + **i18n** | 시술 카테고리명 번역 필수 |
| `special` | READ | 특수/추천 플래그 — 글로벌도 활용 가능 |
| `register/update/delete_timestamp` | SKIP | 내부 감사용, 사용자 노출 불필요 |

---

## 3. `treatments_sub` — 하위 시술

**분류**: `READ`.

| 컬럼 | 처리 | 비고 |
| --- | --- | --- |
| `id` | READ | |
| `treatment_id` | READ | |
| `status` | READ | |
| `order_no` | READ | |
| `name` | READ + **i18n** | 세부 시술명 번역 필수 |
| `*_timestamp` | SKIP | |

---

## 4. `hospitals` — 병원

**분류**: `READ` 주 + 일부 `EXTEND` 필요.

### 4-1. 글로벌에서 읽어서 사용하는 필드

| 컬럼 | 처리 | 비고 |
| --- | --- | --- |
| `id` | READ | |
| `name` | READ + **i18n** | 영문 병원명 필수 (예: "삼성의원" → "Samsung Clinic") |
| `phone_number` | READ | 국제전화 포맷으로 변환 필요 (+82…) |
| `transport` | READ + **i18n** | 교통편 안내. 한국어 기반이므로 영문 재작성 필요 |
| `introduce` | READ + **i18n** | 병원 소개 |
| `notice` | READ + **i18n** | 안내사항 |
| `working_times` (jsonb) | READ | 요일/시간은 숫자 기반이면 i18n 불필요. 요일 라벨은 클라이언트 i18n |
| `working_times_description` | READ + **i18n** | 설명 텍스트 |
| `lunch_time` (jsonb) | READ | 숫자 값 |
| `temporary_closures` (jsonb) | READ + 부분 i18n | 날짜는 불필요, 사유 텍스트는 i18n |
| `reception_time_ranges` (jsonb) | READ | |
| `department_ids[]` | READ | |
| `address` (jsonb) | READ + **i18n** | **주소는 한국어 기반 저장 가능성 높음 — 영문 주소 별도 필드 필요**. Korean team과 구조 협의 |
| `nearby_landmark` | READ + **i18n** | 랜드마크 설명 |
| `location` (geometry) | READ | 좌표 — i18n 무관 |
| `logo_image`, `thumbnail_image`, `base_thumbnail_image`, `title_banner_image`, `detail_page_image`, `program_thumbnail_image` (jsonb) | READ | CDN 공유. 단 **이미지 내 한글 텍스트 오버레이가 있다면 EN 버전 별도 필요** |
| `detail_content` (text) | READ + **i18n** | 상세 HTML/에디터 콘텐츠 — 가장 번역 공수 큰 필드 |
| `is_new`, `first_opened_timestamp` | READ + EXTEND 검토 | 한국 오픈일 ≠ 글로벌 오픈일. `global_first_opened_timestamp`, `global_is_new` 별도 필요 |
| `has_event` | READ + EXTEND 검토 | 한국 이벤트 ≠ 글로벌 이벤트. 분리 필요 |
| `is_published` | READ + EXTEND 필요 | 한국 노출 플래그. **글로벌 노출은 별도 `global_is_published` 필요** |
| `visibility` (jsonb) | READ 검토 | 노출 범위 설정. 글로벌용 정책은 별도 규칙 필요 |
| `star_rating`, `review_count`, `perfect_score_rates`, `recommend_feedbacks` | READ + 정책 결정 필요 | **한국 리뷰를 글로벌에도 노출할지 / 별도 수집할지**. demo에서는 한국 집계 공유 제안 |
| `contract_state` | READ (필터용) | `OPENED`만 글로벌 노출 대상 |

### 4-2. 글로벌에서 제외하는 필드 (한국 내부/운영 전용)

| 컬럼 | 이유 |
| --- | --- |
| `bank_name`, `account_name`, `account_number`, `account_image` | 정산 정보 — 글로벌 API 노출 절대 금지 |
| `use_settlement`, `is_settle_caution` | 정산 내부 플래그 |
| `memo` | CMS 운영 메모 |
| `notification_setting` | 한국 알림 설정. 글로벌 알림은 별도 설계 |
| `check_list` | 한국 운영 체크리스트 |
| `livelihood_support` | 한국 민생지원 정책 — 글로벌 무관 |
| `outlink` | 확인 필요 — 한국 전용 외부 링크면 제외 |
| `register/update_timestamp`, `programs_update_timestamp` | 내부 감사용 |

### 4-3. 글로벌 전용 신규 필드 (EXTEND 대상)

| 신규 필드 | 설명 |
| --- | --- |
| `global_is_published` | 글로벌 노출 on/off |
| `global_first_opened_timestamp` | 글로벌 오픈일 |
| `global_is_new` | 글로벌 NEW 배지 |
| `global_has_event` | 글로벌 이벤트 플래그 |
| `foreigner_friendly` | 외국인 응대 가능 (언어, 통역 등). 이미 유사 컬럼 있는지 Korean team 확인 필요 |
| `english_capable_staff_count` | (선택) 영어 상담 가능 인원 |

---

## 5. `programs` — 프로그램 (병원 상품)

**분류**: `READ` + `EXTEND` (외국인 가격 필수).

### 5-1. 읽어서 사용

| 컬럼 | 처리 | 비고 |
| --- | --- | --- |
| `id` | READ | |
| `hospital_id`, `treatment_id`, `treatment_sub_id` | READ | |
| `name` | READ + **i18n** | 프로그램명 영문 필수 |
| `price` | READ | **한국 거주자 기준가** |
| `discount_price` | READ | **한국 거주자 할인가** |
| `tax_type` | READ + 정책 결정 | 한국 부가세 체계. 외국인 표시 방식 확인. USD 표시 시 tax 포함 여부 기준 필요 |
| `composition` | READ + **i18n** | 구성 설명 번역 |
| `additional_info` | READ + **i18n** | 추가 안내 번역 |
| `label_ids[]` | READ | 라벨 마스터도 i18n 필요 (이 문서 범위 밖) |
| `order_no` | READ | |
| `status` | READ | `ACTIVE`, `HIDDEN` |
| `inquiry` | READ | 문의하기 버튼 노출 |
| `hide_price` | READ + 정책 결정 | 가격 숨김일 때 외국인 가격도 숨길지. 글로벌 기본은 "문의" 처리 |
| `has_event`, `today_discount` | READ + EXTEND 검토 | 위 `hospitals.has_event`와 동일 이슈 — `global_has_event` 별도 |
| `display_start_dt` | READ + EXTEND 검토 | 글로벌 노출 시작일 별도 필요 가능 |
| `thumbnail_common_image_id`, `custom_common_image_id` | READ | CDN 공유 + 이미지 내 텍스트 EN 버전 확인 |
| `detail_template_type`, `detail_template_color` | READ | |

### 5-2. 제외

| 컬럼 | 이유 |
| --- | --- |
| `memo` | 운영 메모 |
| `register/update/delete_timestamp` | 내부 감사용 |

### 5-3. 글로벌 전용 신규 필드 (EXTEND — **필수**)

| 신규 필드 | 설명 |
| --- | --- |
| `foreigner_price` | 외국인 기준가 (product brief의 "foreigner-tier pricing") |
| `foreigner_discount_price` | 외국인 할인가 |
| `global_visible` | 프로그램 단위 글로벌 노출 on/off (특정 프로그램만 글로벌 노출할 수 있게) |
| `global_display_start_dt` | 글로벌 노출 시작일 (옵션) |

> **Architect 결정 필요**: `foreigner_price`를 `programs`에 컬럼 추가 vs `program_pricing_foreigner(program_id, price, discount_price, currency)` 별도 테이블. 후자는 통화 확장(USD 외) 여유가 있고 한국 스키마 오염이 적다. **후자 권장.**

---

## 6. `programs_detail_template` — 프로그램 상세 섹션

**분류**: `READ`.

| 컬럼 | 처리 | 비고 |
| --- | --- | --- |
| `id`, `program_id`, `type`, `order_no` | READ | |
| `title` | READ + **i18n** | 섹션 제목 |
| `content` | READ + **i18n** | 섹션 본문 |
| `common_image_id` | READ | CDN. 이미지 내 한글 텍스트면 EN 버전 별도 |
| `reg_dtm`, `mod_dtm` | SKIP | |

---

## 7. `treatments_sub_template` — 하위 시술 기본 상세

**분류**: `READ` (프로그램별 커스텀 상세가 없을 때 폴백).

| 컬럼 | 처리 | 비고 |
| --- | --- | --- |
| `id`, `treatments_sub_id`, `type`, `order_no` | READ | |
| `title` | READ + **i18n** | |
| `content` | READ + **i18n** | |
| `common_image_id` | READ | |

---

## 8. `reservations` — 예약/상담

**분류**: `WRITE` (글로벌에서 생성) + 일부 `READ` (상태 조회) + **`EXTEND` 필수**.

### 8-1. 글로벌이 WRITE 하는 기존 필드

| 컬럼 | 글로벌 값 |
| --- | --- |
| `member_id` | 글로벌 유저 ID (별도 ID 네임스페이스 or 매핑 필요 — architect 결정) |
| `hospital_id`, `program_id`, `treatment_id`, `treatment_sub_id` | 선택값 |
| `hospital_name`, `program_name`, `treatment_name`, `treatment_sub_name` | **예약 당시 EN 스냅샷** 으로 저장 (사용자 언어 기준). KO 스냅샷은 한국 어드민이 별도로 해석하거나 병렬 저장 |
| `name` | booking form의 이름 (영문) |
| `phone_number` | 국제전화 |
| `birth_day` | 생년월일 |
| `content` | 자유 메모 (사용자 입력) |
| `wished_date` | 희망 방문일 (`yyyyMMdd`) |
| `reservation_status` | `WAITING` 으로 시작 |
| `consultation_status` | `NONE` |
| `inflow_type` | **신규 enum 값 `GLOBAL` 추가 필요** |
| `inflow_channel` | 글로벌 채널 enum 값 추가 검토 |
| `reg_by_type` | `USER` |
| `reg_by_id` | 글로벌 유저 ID |
| `personnel_status` | demo에서는 `SELF=1` 고정 |
| `agreements` (jsonb) | 글로벌 이용약관 동의 이력 (한국 약관과 별도) |

### 8-2. 글로벌 예약 전용 신규 필드 (EXTEND — **필수**)

`reservations`에 직접 추가 vs `reservations_global(reservation_id, …)` 별도 테이블. **별도 테이블 권장** (한국 스키마 오염 최소화, PII 격리 용이).

| 신규 필드 | 설명 | PII 등급 |
| --- | --- | --- |
| `passport_number` | 여권번호 | **강 PII — 암호화 필수** |
| `nationality` | 국적 (ISO 3166) | 중 |
| `email` | 연락 이메일 | 중 |
| `korea_entry_date` | 한국 입국일 | 하 |
| `korea_exit_date` | 한국 출국일 | 하 |
| `hotel_region` | 호텔/숙소 지역 (옵션) | 하 |
| `flight_number` | 항공편 (옵션) | 하 |
| `addon_lodging` | 숙소 부가서비스 요청 여부 (bool) | 하 |
| `addon_flight` | 항공 부가서비스 요청 여부 (bool) | 하 |
| `addon_tour` | 관광 부가서비스 요청 여부 (bool) | 하 |
| `addon_notes` | 부가서비스 자유 메모 | 하 |
| `pricing_tier` | `KR_RESIDENT` / `FOREIGNER` | 하 |
| `applied_enterprise_id` | 적용된 엔터프라이즈 (nullable) | 하 |
| `applied_coupon_id` | 적용된 쿠폰 (nullable) | 하 |
| `display_price_usd` | 유저에게 보여준 확정 가격 (USD) | 하 |
| `display_language` | `EN` / `KO` | 하 |
| `age`, `gender` | booking form의 나이/성별 | 중 |
| `desired_department_id` | product brief의 "desired department" (treatment_id와 중복 가능 — 확인) | 하 |

> **Healthcare-reviewer / security-reviewer 필수 리뷰 포인트**: 여권번호 암호화, TX HB 300 · CCPA 대응. `.pm/legal/hipaa-position.md` 참조.

### 8-3. 제외/사용 안 함

| 컬럼 | 이유 |
| --- | --- |
| `examined_by_cs` | 한국 CS 내부 상태 |
| `admin_content` | 관리자 내부 메모 — 글로벌이 쓰지 않음 |
| `affiliation_id`, `affiliation_name`, `occupation_type` | 한국 제휴사 구조. 글로벌은 enterprise_id 별도 필드 |
| `first_wished_time`, `second_wished_time` | demo는 날짜만. 시간 선택 미구현 |
| `consultation_*` 전부 | demo는 예약만. 상담 flow 제외 |
| `family_info`, `family_parent_id`, `has_family_link`, `has_companion`, `consultation_participants` | demo는 개인 예약만 |
| `additional_inquiry_programs` | demo 범위 외 |
| `cancel_*` | demo 범위 외 (취소 기능 없음) |
| `review_type` | demo 범위 외 |
| `manager_id`, `hospital_manager_id` | 한국 관리자 할당 |

### 8-4. READ (상태 조회)

유저의 "내 예약" 페이지는 아래만 읽는다:
- `id`, `reservation_status`, `confirm_date` (`yyyy-MM-dd`), `changed_reservation_status_dtm`
- 스냅샷 필드(`hospital_name`, `program_name`, `treatment_name`, `treatment_sub_name`)
- 확장 테이블의 글로벌 전용 필드

---

## 9. 완전 제외 (글로벌 범위 밖)

| 테이블 | 사유 |
| --- | --- |
| `treatment_histories` | 진료내역. demo에서 결제/시술 진행/완료 흐름 없음. **PHI 리스크** — `healthcare-reviewer` 확인 하에 범위 밖 확정 |
| `treatment_payment_history` | 결제 이력. Stripe 연동은 Phase 2 |
| `treatment_histories_log` | 진료내역 변경 로그. 한국 어드민 전용 |
| `program_inspection` | 프로그램 검수 워크플로우. 한국 어드민 전용 |
| `program_inspection_group` | 검수 그룹. 동상 |
| `program_inspection_draft` | 검수 임시저장. 동상 |

---

## 10. 글로벌 서비스 전용 신규 테이블 (Korean DB 외, 글로벌 서비스 DB에 존재)

product brief의 US-specific logic은 Korean DB에 넣지 않고 **글로벌 서비스 DB**(또는 Next.js BFF의 저장소)에 분리 저장한다.

| 테이블 | 목적 | 주요 필드 |
| --- | --- | --- |
| `global_users` | 글로벌 서비스 유저 | `id`, `oauth_provider` (GOOGLE/APPLE), `oauth_sub`, `email`, `name`, `citizenship` (KR/NON_KR), `preferred_language` (EN/KO), `enterprise_id` (nullable), `enterprise_verification_status`, `korean_member_id` (한국 `members`와의 매핑 — architect 결정), `created_at`, `updated_at` |
| `enterprises` | 엔터프라이즈 회사 마스터 | `id`, `code`, `name_i18n`, `status`, `created_at` |
| `enterprise_discounts` | 진료과별 엔터프라이즈 할인율 | `enterprise_id`, `department_id`, `discount_rate`, `valid_from`, `valid_to` |
| `coupons` | 쿠폰 마스터 | `id`, `code`, `discount_type` (PCT/AMT), `discount_value`, `stackable` (bool), `applicable_department_ids[]`, `valid_from`, `valid_to`, `max_uses` |
| `coupon_redemptions` | 쿠폰 사용 이력 | `coupon_id`, `user_id`, `reservation_id`, `redeemed_at` |
| `reservations_global` (또는 `reservations` 확장) | 글로벌 예약 전용 필드 (8-2 참조) | 위 표 참조 |
| `addon_consultations` | 부가서비스 CS 요청 큐 | `reservation_id`, `type` (LODGING/FLIGHT/TOUR), `notes`, `status`, `assigned_cs_id`, `created_at` |

---

## 11. i18n 구현 옵션 비교

Korean team과 합의해야 할 구조 결정. **architect 논의 주제**.

| 옵션 | 장점 | 단점 |
| --- | --- | --- |
| A. `<table>_translations(entity_id, locale, field, value)` | 정규화. 언어 확장 쉬움 | JOIN 다수. 기존 조회 쿼리 대대적 수정 |
| B. `name_i18n` jsonb 컬럼 `{"ko": "...", "en": "..."}` | 스키마 변경 최소. 마이그레이션 쉬움 | 인덱싱/검색 제약 |
| C. `name`, `name_en` 컬럼 각각 | 조회 쿼리 최소 수정 | 3번째 언어 추가 시 스키마 변경 반복 |

**권장**: **옵션 B** (jsonb) — 5/15 demo 일정 고려, 기존 한국 쿼리 영향 최소, EN만 추가하면 되므로 인덱싱 제약 감내 가능.

i18n 대상 필드 총집합:
- `departments.name`
- `treatments.name`
- `treatments_sub.name`
- `hospitals.name`, `transport`, `introduce`, `notice`, `working_times_description`, `nearby_landmark`, `detail_content`, `address` (값 객체 중 일부 필드)
- `programs.name`, `composition`, `additional_info`
- `programs_detail_template.title`, `content`
- `treatments_sub_template.title`, `content`
- (범위 밖이지만) 라벨 마스터, 이벤트 배너, 푸시 템플릿 등도 장기적으로 i18n 필요

---

## 12. Architect / Korean team 논의가 필요한 Open Question

1. **유저 ID 네임스페이스** — 글로벌 유저가 한국 `members`와 동일 ID 공간인가, 별도인가? 별도라면 매핑 테이블 위치는?
2. **Foreigner pricing 위치** — `programs`에 컬럼 추가 vs `program_pricing_foreigner` 별도 테이블. (이 문서는 후자 권장)
3. **글로벌 예약 확장 필드 위치** — `reservations`에 컬럼 추가 vs `reservations_global` 별도 테이블. (이 문서는 후자 권장 — PII 격리)
4. **여권번호 암호화** — 한국 DB에 평문 저장 금지. Application-layer 암호화 + KMS 전략 수립 필요.
5. **i18n 구조** — Option A/B/C 결정. (이 문서는 B 권장)
6. **글로벌 노출 플래그** — `global_is_published` 같은 컬럼을 한국 테이블에 추가 vs 글로벌 서비스 DB에 화이트리스트 저장. 후자는 동기화 부담, 전자는 Korean team 작업 필요.
7. **리뷰 집계 공유** — 한국 `star_rating`, `review_count`를 글로벌에도 노출할지. 정책 결정.
8. **주소 구조** — `hospitals.address` jsonb 내 한국어 주소 + 영문 주소 병렬 저장 구조 합의.
9. **이미지 내 텍스트** — 상세 이미지/배너에 한글 텍스트 오버레이가 있을 경우 EN 버전 별도 업로드 플로우 필요.
10. **inflow_type GLOBAL enum 값 추가** — Korean service enum 확장 합의.
11. **Price snapshot 통화** — 예약 저장 시 KRW 기준 + USD 기준 둘 다 저장할지, USD만 저장할지.

---

## 13. Sprint 0 액션 체크리스트

- [ ] architect: 이 문서 기반 Korean API 계약 초안 작성 (`GET /hospitals`, `GET /hospitals/{id}`, `GET /departments`, `GET /treatments`, `GET /programs`, `POST /reservations`)
- [ ] architect + Korean team: 섹션 12의 Open Question 1~11 해결
- [ ] healthcare-reviewer + security-reviewer: 8-2 섹션의 여권번호/PII 처리 검토
- [ ] database-reviewer: 글로벌 전용 신규 테이블(섹션 10) 스키마 초안
- [ ] doc-updater: 계약 합의 후 본 문서 버전 2 반영

---

## 14. 변경 이력

- 2026-04-21 — 초안 작성. 한국 도메인 명세 + product brief 대조 기반 매핑.
