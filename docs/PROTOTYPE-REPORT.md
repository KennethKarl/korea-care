# SafeDoc Korea Care — 프로토타입 작성 완료 보고서

**작성일**: 2026-06-18 · **브랜드**: KoreCare · **상태**: 프론트엔드 프로토타입(mock) 완료, 원격 배포

## 라이브 URL (검증 완료, HTTP 200)
| 사이트 | URL |
|---|---|
| 고객 — 홈/프로그램 | https://kennethkarl.github.io/korea-care/ |
| 고객 — 마이페이지 | https://kennethkarl.github.io/korea-care/mypage/ |
| 운영자 어드민 | https://kennethkarl.github.io/korea-care/admin/ |
| 병원 관리자 | https://kennethkarl.github.io/korea-care/hospital-admin/ |
| 시술 상세(딥링크 예) | https://kennethkarl.github.io/korea-care/treatment/proton/ |

> 커스텀 도메인 `global.safedoc.io`는 DNS 준비 후 전환 예정(아래 §4). 현재는 github.io 서브경로로 즉시 확인 가능.

---

## 1. SEO/GEO 반영 설계

순수 CSR(React SPA)은 크롤러·생성형 엔진이 빈 `<div id=root>`만 받는다. 이를 구조적으로 해결하기 위해 **빌드 시 라우트별 정적 HTML 사전렌더(SSG)** 로 재설계했다.

- **렌더링**: `vite-react-ssg` + `react-router-dom` → 빌드 시 **29개 라우트가 각각 완성된 HTML**로 생성(크롤러/AI가 실제 본문 텍스트 수신).
- **사이트/페이지별 고유 URL**: 모든 화면이 독립 URL을 가짐 — `/programs`, `/treatment/:id`, `/hospital/:deptId/:hospitalId`, `/reviews`, `/blog/:id`, `/faq` 등. (기존 인메모리 라우팅 → URL 라우팅 전환)
- **per-route 메타 + 구조화 데이터(JSON-LD)**: 페이지마다 고유 `title`·`description`·`canonical`·OpenGraph + JSON-LD(`MedicalOrganization`/`WebSite`, 시술=`MedicalProcedure`, FAQ=`FAQPage`, `BreadcrumbList`). → 라이브 확인: `/treatment/proton/`는 `Proton Therapy | KoreCare`, `/faq/`는 `FAQ | KoreCare` 등 페이지별 상이.
- **GEO(생성형 엔진) 신호**: `robots.txt`에 AI 크롤러(GPTBot·PerplexityBot·ClaudeBot·Google-Extended) 허용, `llms.txt`(서비스 정의·핵심 페이지를 AI용으로 명문화), `sitemap.xml`(28 URL), 시맨틱 마크업(main/nav/section/article + h1/h2).
- **검색 분리**: 내부 화면(`/mypage`·`/admin`·`/hospital-admin`)은 `noindex` + sitemap 제외.
- **배포**: GitHub Pages 정적 호스팅(서버리스) — SSG라 서버 없이도 SEO/GEO 성립.

---

## 2. 사이트별 기능 + 테스트 방법

플랫폼은 **3개 시스템**이며, 프로토타입에서 세 시스템이 **동일 브라우저 localStorage를 공유**해 사이트 간 자동화가 실제로 동작한다(백엔드 없이 시연).

### A. 고객 웹사이트
- 홈(히어로·진료과 칩·프로그램 카드 정가/할인가·Covered 배지), 프로그램/시술 상세, 병원 상세, 리뷰, 비포/애프터, 블로그, FAQ, 회사소개, 이용방법, 문의, 예약.
- **마이페이지**(`/mypage`): 예약내역 리스트(진행단계·환자명·확정일/미정·방문완료 시 리뷰버튼) · 예약내역 상세(**5단계 스테퍼**: 예약요청>조율중>예약확정>방문완료>리뷰작성 · 옵션 · **예약취소요청**) · 장바구니(병원/시술 소개·정가/세이프닥 할인가·예약수·체크박스) · 고객정보(여권·통역언어·**국적=한국 시 건보 가입자 여부**) · 리뷰 작성. EN/KO 토글.
- **테스트**: 홈 접속 → 아무 이메일로 Login → 데모 예약 2건/장바구니 시드 → 탭 전환하며 스테퍼·취소·장바구니 수량·프로필 조건부 필드 확인.

### B. 운영자 어드민 (`/admin`)
- 예약 관리(예약 **단계 변경**), 정산 관리, 유저 관리(추천인 5% 안내), 리뷰 관리, 병원 관리(**노출여부 토글** + 병원 등록).
- **테스트**: `/admin` 접속(또는 고객 사이트 푸터 "운영자 어드민") → 예약 관리에서 단계 드롭다운 변경.

### C. 병원 관리자 (`/hospital-admin`)
- 글로벌 예약(어드민이 '예약 확정' 이상으로 바꾼 건만 노출), **정산 금액 입력→등록**, 정산 내역.

### ⭐ End-to-End 자동화 테스트 (3시스템 연동 시연)
1. `/admin` → 예약 관리 → Proton 예약을 **'예약 확정'** 으로 변경
2. → `/hospital-admin` → **글로벌 예약에 Proton 자동 노출**(확정일시 표기)
3. → 금액 입력 후 **등록** → 정산 생성
4. → `/admin` → **정산 관리에 반영**
5. → `/mypage` → 고객 예약내역이 **"Confirmed"로 자동 갱신**

---

## 3. 요구사항정의서 대비 구현 여부

(출처: Notion 「글로벌 웹사이트 요구사항정의서」 DB)

### 고객 웹사이트
| 화면 | 구현 |
|---|---|
| 홈 / 시술 리스트 / 시술 상세 | ✅ |
| 병원 상세 | ✅ |
| 병원 리스트(독립 화면) | ⚠️ 홈에서 진료과→병원으로 제공(독립 리스트 페이지 별도 아님) |
| 리뷰 / 비포·애프터 / 블로그 / FAQ | ✅ |
| 로그인 / 마이페이지(예약내역 리스트·상세·고객정보·장바구니) | ✅ (mock) |
| 회원가입 플로우 | ⚠️ mock 로그인 + 고객정보 폼으로 대체(정식 가입/서드파티 미구현) |

### 운영자 어드민
| 화면 | 구현 |
|---|---|
| 병원 관리(노출토글) / 병원 등록 | ✅ |
| 예약 내역 관리 / 정산 관리 / 유저 관리 / 리뷰 관리 | ✅ |
| 시술 관리 / 시술 등록 | ❌ 미구현 |
| FAQ 관리 / 블로그 CMS | ❌ 미구현 |

### 병원 관리자
| 화면 | 구현 |
|---|---|
| 글로벌 예약 / 정산(금액 입력) | ✅ |

### 사이트 간 자동화 (12종)
| 자동화 | 구현 |
|---|---|
| 웹 예약신청 → 어드민 예약 DB | ✅ mock |
| 어드민 예약상태 변경 → 웹 예약내역 연동 | ✅ mock |
| 어드민 예약확정 → 병원관리자 글로벌예약 노출 | ✅ mock |
| 병원 금액입력 → 어드민 정산 반영 | ✅ mock |
| 웹 리뷰작성 → 어드민 리뷰관리 | ✅ mock |
| 웹 취소요청 → 어드민 예약내역 | ✅ mock |
| 어드민 병원/시술정보 → 웹 연동 | ⚠️ 병원 등록은 mock, 웹 실반영은 백엔드 필요 |
| 어드민 블로그/FAQ → 웹 연동 | ❌ 백엔드 필요 |
| 웹 채팅 → 어드민 채팅접수 | ⚠️ ChannelTalk 위젯(env)만, 접수화면 없음 |
| 웹 문의 → 슬랙 알림 / 고객 이메일 발송 | ❌ 백엔드(서버 후처리) 필요 — `docs/SERVER-REQUEST.md` 명시 |

> 요약: **고객 핵심 화면 + 운영자/병원 핵심 운영 + 6종 자동화는 mock으로 동작**. 시술관리·CMS·실제 알림/이메일·인증·결제·실데이터는 백엔드 연동 필요(범위 명시됨).

---

## 4. 기술 스펙 (세이프닥 이식 가능성 포함)

| 항목 | 스펙 |
|---|---|
| 프레임워크 | React 18 + Vite + **vite-react-ssg**(SSG) + react-router-dom |
| 데이터 | **mock(localStorage)** — 백엔드 미연동 시 폼은 graceful fallback |
| 분석/CS | GA4·Meta Pixel·MS Clarity·ChannelTalk 로더(전부 env 키 기반, 미설정 시 no-op) |
| API 연동 | `VITE_API_BASE` 기반 fetch 클라이언트(미설정 시 mock) — 계약은 `docs/SERVER-REQUEST.md` |
| 호스팅 | GitHub Pages 정적(서버리스). `VITE_BASE`로 서브경로/루트 전환 |

**레퍼런스 대비**: safedoc.io = Next.js(SSR), global.safedoc.io = imweb(서버렌더 HTML). 본 프로토타입은 정적 호스팅에서 SSR급 SEO를 얻기 위해 **SSG**를 택함.

**세이프닥 이식 가능성**
- **바로 이식 가능**: 디자인 토큰/컴포넌트, SEO·GEO 구조(per-route 메타·JSON-LD·llms.txt), 고객 UI/플로우, 마이페이지 UX. (정적 자산·프론트 로직)
- **백엔드 연동 필요(즉시 불가)**: 운영자 어드민/병원 관리자 실데이터, 예약 DB·단계 관리·정산, 인증/회원가입, 리뷰/문의 실연동, 슬랙/이메일 알림. → 세이프닥 서버에 **`docs/SERVER-REQUEST.md`의 엔드포인트(`/v1/leads`·`/v1/reservations`·`/cancel`·`/reviews`·`/profile`) + CORS** 제공 시, 프론트는 **코드 수정 없이 env 주입만으로 연결**되도록 설계됨.
- 결론: **프론트(디자인·SEO·고객화면)는 즉시 이식, 백엔드 의존부는 API 계약대로 연동** — 단계적 이식 가능.

---

## 5. 세이프닥 디자인 적용 / 주요 변경사항

- **디자인 시스템 전면 리브랜드**(global.safedoc.io 실측 토큰 반영):
  - Primary Blue **#1b59fa**, Accent Coral **#ff2552**, Ink #212121, BG #f5f7f8, 폰트 **Pretendard**.
  - 기존 KoreCare 틸(#0b6b6b) → SafeDoc 블루로 전면 교체. `src/theme.js`로 토큰 중앙화.
- **브랜드명 `KoreCare` 유지**: 영미권이 *Korea + Care*로 즉시 인식(타깃=미국·영국 보험 가입자의 한국 인바운드 치료).
- **프로젝트/도메인 정비**: 프로젝트 식별자 `safedoc-korea-care`(= `projects/safedoc/korea-care`), 정식 도메인 `global.safedoc.io`(canonical/sitemap/OG 반영, DNS 후 전환).
- **마케팅/계측 스택 정렬**: global.safedoc.io 계열(GA4·Pixel·Clarity·ChannelTalk) env 슬롯 준비.

---

## 다음 단계
1. **백엔드 연동**: `docs/SERVER-REQUEST.md`를 세이프닥 개발부에 전달(API·CORS·키).
2. **커스텀 도메인**: SafeDoc DNS에 `global.safedoc.io` → `kennethkarl.github.io` CNAME 등록 → 빌드 `VITE_BASE=/` + CNAME 복원 → 레포 Pages 커스텀 도메인 지정.
3. **미구현 화면**: 시술 관리/등록, FAQ·블로그 CMS, 정식 회원가입.
