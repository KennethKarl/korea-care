/* =========================================================================
   spec-overlay.jsx — 기획 모드 오버레이 (홈 전용)
   화면 요소 위 마커(1-1~1-6) → 클릭 시 팝오버(요약) → "상세 보기"로 상세 모달.
   "화면 보면서 기획" 용. ?spec=1 또는 우하단 토글로 on/off. client-only.
   마커 텍스트는 화면 기준 초안 — 추후 Notion 요구사항정의서와 연결/보강.
   ========================================================================= */
import React, { useState, useEffect, useCallback } from "react";
import { BLUE as TEAL, BLUE_SOFT as TEAL_SOFT, INK, SUB, MUTE, LINE, ACCENT, btn } from "./theme.js";

const MARKERS = [
  {
    id: "1-1", sel: '[data-spec="1-1"]', title: "글로벌 GNB (상단 내비)",
    desc: "전 페이지 공통 상단바. 메뉴(시술·병원·리뷰·Before/After·블로그·FAQ), 언어 토글(EN/KO), 로그인, 어드민(⚙).",
    detail: "글로벌 고객(미국·영국 보험가입자) 대상 영문 우선 GNB. 로그인은 Google(GIS) + 이메일, 로그인 시 마이페이지 진입. ⚙ 는 운영자용 콘텐츠 에디터(내부). 모바일은 가로 스크롤 메뉴.",
    req: "요구사항정의서: 공통 헤더 / 로그인·회원가입",
  },
  {
    id: "1-2", sel: '[data-spec="1-2"]', title: "보험사 추천 배너",
    desc: "보험사 referral 컨텍스트 표시 — \"You were referred by [보험사]\". 커버되는 프로그램을 강조한다는 안내.",
    detail: "B2B(보험사) 채널 진입 시 referral 기반으로 covered 프로그램을 강조. 현재는 고정 카피(Meridian) — 추후 보험사 파라미터/제휴사별 분기 및 커버리지 룰 연동 필요(백엔드).",
    req: "요구사항정의서: 커버리지 노출 규칙",
  },
  {
    id: "1-3", sel: '[data-spec="1-3"]', title: "히어로 + 검색",
    desc: "핵심 가치제안 카피(\"World-class treatment in Korea — fully managed\") + 시술·병원·지역 검색바.",
    detail: "인바운드(한국行) 메시지: 보험사가 시술비 커버, 나머지(항공·비자·통역·회복·사후관리)는 KoreCare가 원스톱 관리. 검색은 시술/병원 탭 분리(스샷의 '시술 1415 / 병원'에 대응) — 현재 프로토타입은 검색 UI만, 결과 연동은 확장 대상.",
    req: "요구사항정의서: 홈 / 통합검색",
  },
  {
    id: "1-4", sel: '[data-spec="1-4"]', title: "진료과 필터 칩",
    desc: "진료과별 필터(Oncology · Orthopedics & Spine · Cardiac Surgery …). 선택 시 하단 프로그램 목록이 필터링됨.",
    detail: "카테고리 = 진료과. 시술은 복수 진료과(deptIds)에 교차 노출 가능. 어드민 '시술 관리'의 노출 토글이 이 목록에 연동(mock). 추후 지역·정렬(인기순)·쿠폰 필터(스샷 1-6 '쿠폰 추가할인')로 확장 가능.",
    req: "요구사항정의서: 시술 리스트 / 필터",
  },
  {
    id: "1-5", sel: '[data-spec="1-5"]', title: "프로그램(병원·시술) 카드",
    desc: "병원명·인증(JCI)·Covered 배지·평점·정가(US, 취소선)/한국 올인가·절감액·'View plan'.",
    detail: "정가(US list) vs 세이프닥 할인가(Korea all-in)를 대비 노출 + 절감액. Covered 배지는 보험 커버. 'View plan' → 병원/시술 상세(/hospital/:deptId/:hospitalId). 스샷의 '쿠폰 적용가/복지 혜택' 배지 패턴을 차용해 추가 혜택 표기로 확장 가능.",
    req: "요구사항정의서: 시술/병원 카드 노출정보",
  },
  {
    id: "1-6", sel: '[data-spec="1-6"]', title: "토탈케어 5단계",
    desc: "\"One team, the whole journey\" — 매칭 · 이동(항공/비자) · 통역 · 회복 숙소 · 미국 사후관리.",
    detail: "원스톱 관리가 핵심 차별점. 5단계는 서비스 플로우의 요약이며, 예약 진행단계(예약요청>조율중>예약확정>방문완료>리뷰)와 연결되는 고객 여정의 상위 개념. 마이페이지 예약 상세의 스테퍼가 이 여정의 실데이터 버전.",
    req: "요구사항정의서: 서비스 플로우 / 마이페이지 예약단계",
  },
];

export default function SpecOverlay() {
  const [on, setOn] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("spec") === "1"; } catch { return false; }
  });
  const [rects, setRects] = useState({});
  const [sel, setSel] = useState(null);      // 팝오버 대상 marker id
  const [detail, setDetail] = useState(null); // 상세 모달 marker id

  const measure = useCallback(() => {
    const r = {};
    MARKERS.forEach((m) => {
      const el = document.querySelector(m.sel);
      if (el) { const b = el.getBoundingClientRect(); r[m.id] = { top: b.top, left: b.left, w: b.width }; }
    });
    setRects(r);
  }, []);

  useEffect(() => {
    if (!on) return;
    measure();
    const onMove = () => measure();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    const t = setInterval(measure, 600); // 이미지 로드 등 늦은 레이아웃 보정
    return () => { window.removeEventListener("scroll", onMove, true); window.removeEventListener("resize", onMove); clearInterval(t); };
  }, [on, measure]);

  const m = sel ? MARKERS.find((x) => x.id === sel) : null;
  const dm = detail ? MARKERS.find((x) => x.id === detail) : null;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;

  return (
    <>
      {/* 토글 */}
      <button onClick={() => { setOn((o) => !o); setSel(null); }} title="기획 모드"
        style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9000, ...btn(on ? ACCENT : TEAL, "#fff"),
          boxShadow: "0 6px 20px rgba(0,0,0,.18)", display: "inline-flex", alignItems: "center", gap: 7 }}>
        {on ? "✕ 기획 모드 닫기" : "📐 기획 모드"}
      </button>

      {on && (
        <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 9000, background: "#fff", border: `1px solid ${LINE}`,
          borderRadius: 10, padding: "8px 12px", fontSize: 12, color: SUB, boxShadow: "0 4px 14px rgba(0,0,0,.1)", maxWidth: 260 }}>
          숫자 마커를 클릭하면 기획 설명이 열립니다. (홈 화면 전용 · 공유: <code>?spec=1</code>)
        </div>
      )}

      {/* 마커 */}
      {on && MARKERS.map((mk) => {
        const r = rects[mk.id]; if (!r) return null;
        const active = sel === mk.id;
        return (
          <button key={mk.id} onClick={() => setSel(active ? null : mk.id)}
            style={{ position: "fixed", top: Math.max(8, r.top + 8), left: r.left + 8, zIndex: 8800,
              background: ACCENT, color: "#fff", border: "2px solid #fff", borderRadius: 8,
              minWidth: 34, height: 24, padding: "0 7px", fontSize: 12.5, fontWeight: 800, cursor: "pointer",
              boxShadow: active ? `0 0 0 3px ${ACCENT}55` : "0 2px 8px rgba(0,0,0,.25)" }}>
            {mk.id}
          </button>
        );
      })}

      {/* 팝오버 (요약 + 상세 링크) */}
      {on && m && rects[m.id] && (
        <div style={{ position: "fixed", zIndex: 8900,
          top: Math.min((rects[m.id].top || 0) + 40, (typeof window !== "undefined" ? window.innerHeight : 800) - 220),
          left: Math.min(rects[m.id].left + 8, vw - 320),
          width: 300, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.18)", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontWeight: 800, color: TEAL, fontSize: 14 }}>
              <span style={{ background: ACCENT, color: "#fff", borderRadius: 6, padding: "1px 7px", fontSize: 12, marginRight: 6 }}>{m.id}</span>
              {m.title}
            </span>
            <button onClick={() => setSel(null)} style={xBtn}>✕</button>
          </div>
          <div style={{ fontSize: 13, color: SUB, marginTop: 8, lineHeight: 1.55 }}>{m.desc}</div>
          <button onClick={() => setDetail(m.id)} style={{ ...btn(TEAL, "#fff"), marginTop: 12, fontSize: 12.5, padding: "8px 12px", width: "100%" }}>
            상세 보기 →
          </button>
        </div>
      )}

      {/* 상세 모달 (B) */}
      {on && dm && (
        <div onClick={() => setDetail(null)}
          style={{ position: "fixed", inset: 0, zIndex: 9100, background: "rgba(15,23,42,.5)", display: "grid", placeItems: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 560, background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: INK }}>
                <span style={{ background: ACCENT, color: "#fff", borderRadius: 7, padding: "2px 9px", fontSize: 14, marginRight: 8 }}>{dm.id}</span>
                {dm.title}
              </h3>
              <button onClick={() => setDetail(null)} style={xBtn}>✕</button>
            </div>
            <p style={{ color: SUB, lineHeight: 1.65, marginTop: 14, fontSize: 14.5 }}>{dm.detail}</p>
            <div style={{ marginTop: 16, background: TEAL_SOFT, color: TEAL, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>
              🔗 {dm.req}
            </div>
            <div style={{ textAlign: "right", marginTop: 18 }}>
              <button onClick={() => setDetail(null)} style={{ ...btn(TEAL, "#fff") }}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const xBtn = { border: "none", background: "transparent", cursor: "pointer", color: "#9aa5b1", fontSize: 16, lineHeight: 1, padding: 2, flexShrink: 0 };
