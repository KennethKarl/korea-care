import React, { useState } from "react";
import {
  Search, MapPin, Star, Shield, Clock, Check, Plane,
  Building2, ChevronRight, Hotel, Languages, HeartPulse,
  Stethoscope, Award, Image as ImageIcon,
  Settings, Plus, Trash2, X, Eye, Type, Move, Palette,
  ArrowLeft, Phone, Mail, Send, ChevronDown, HelpCircle,
  Calendar, Users, CheckCircle2, MessageSquare, Globe, User, Newspaper,
} from "lucide-react";
import { treatments as TREATMENTS, reviews as REVIEWS, beforeAfter as BEFORE_AFTER, blogPosts as BLOG_POSTS, i18n as I18N } from "./site-data.js";
import { TreatmentsPage, TreatmentDetail, ReviewsPage, BeforeAfterPage, BlogPage, BlogPostPage, ReservationPage, MyPage } from "./screens.jsx";

/* =========================================================================
   KoreCare — fully admin-controllable
   Everything renders from `initialContent`. A future admin panel writes to
   the same shape (load from your API instead of this constant). The built-in
   editor on the right shows the exact controls the admin will expose:
     - swap any image by URL
     - overlay text on images (position / align / color / size / weight)
     - add / edit / remove departments, hospitals, programs
   ========================================================================= */

const TEAL = "#0b6b6b";
const TEAL_SOFT = "#e6f5f3";
const INK = "#11181c";
const SUB = "#52606b";
const MUTE = "#8a96a0";
const LINE = "#eef1f3";

const initialContent = {
  brand: { name: "KoreCare", insurer: "Meridian Health Insurance" },
  hero: {
    image: {
      url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
      alt: "Modern hospital",
      overlays: [
        { id: "h1", text: "World-class treatment in Korea — fully managed.", x: 6, y: 32, size: 36, weight: 800, color: "#ffffff", align: "left", maxWidth: 62 },
        { id: "h2", text: "Your insurer covers the procedure. We handle everything else.", x: 6, y: 64, size: 16, weight: 500, color: "#e8f4f3", align: "left", maxWidth: 50 },
      ],
      overlayScrim: 0.45,
    },
  },
  departments: [
    {
      id: "onco", name: "Oncology", active: true,
      hospitals: [
        { id: "snc", name: "Seoul National Cancer Center", city: "Seoul", rating: 4.9, reviews: 540, accred: "JCI", program: "Comprehensive Cancer Program", weeks: "3–5 wks", us: 145000, kr: 52000, covered: true, lead: "Proton therapy & robotic surgery",
          image: { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80", alt: "Cancer center", overlays: [{ id: "o1", text: "Proton Therapy Center", x: 8, y: 78, size: 15, weight: 700, color: "#ffffff", align: "left", maxWidth: 85 }], overlayScrim: 0.4 } },
        { id: "asan", name: "Asan Medical Oncology Inst.", city: "Seoul", rating: 4.9, reviews: 612, accred: "JCI", program: "Targeted Therapy Track", weeks: "4–6 wks", us: 168000, kr: 61000, covered: true, lead: "Asia's largest cancer caseload",
          image: { url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80", alt: "Hospital building", overlays: [], overlayScrim: 0.35 } },
      ],
    },
    {
      id: "ortho", name: "Orthopedics & Spine", active: true,
      hospitals: [
        { id: "wooridul", name: "Wooridul Spine Hospital", city: "Seoul", rating: 4.9, reviews: 720, accred: "JCI", program: "Minimally-Invasive Spine", weeks: "2–3 wks", us: 92000, kr: 28000, covered: true, lead: "Endoscopic spine pioneers",
          image: { url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80", alt: "Spine clinic", overlays: [], overlayScrim: 0.35 } },
      ],
    },
    {
      id: "cardiac", name: "Cardiac Surgery", active: true,
      hospitals: [
        { id: "samsung", name: "Samsung Heart Institute", city: "Seoul", rating: 4.9, reviews: 502, accred: "JCI", program: "Coronary Bypass Program", weeks: "3–4 wks", us: 158000, kr: 47000, covered: true, lead: "Hybrid cardiac suites",
          image: { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", alt: "Heart institute", overlays: [], overlayScrim: 0.35 } },
      ],
    },
    {
      id: "screen", name: "Full Health Screening", active: false,
      hospitals: [
        { id: "asanhp", name: "Asan Health Promotion Ctr.", city: "Seoul", rating: 4.9, reviews: 890, accred: "JCI", program: "Executive Deep Screening", weeks: "3–5 days", us: 8500, kr: 2200, covered: true, lead: "Whole-body MRI + PET-CT",
          image: { url: "https://images.unsplash.com/photo-1631563019676-dade0dbdb8fc?w=600&q=80", alt: "Screening center", overlays: [], overlayScrim: 0.35 } },
      ],
    },
  ],
};

/* ----------------------- shared: total-care steps ----------------------- */
const CARE_STEPS = [
  { icon: Stethoscope, t: "Care plan & match", d: "We match a covered program to your records." },
  { icon: Plane, t: "Travel arranged", d: "Flights, visa, pickup for you and a companion." },
  { icon: Languages, t: "In-Korea support", d: "Dedicated English interpreter and coordinator." },
  { icon: Hotel, t: "Recovery stay", d: "Hospital-adjacent accommodation booked." },
  { icon: HeartPulse, t: "US aftercare", d: "Follow-up coordinated with your home doctor." },
];

/* ---------------------- responsive helper ---------------------- */
function useIsMobile(maxWidth = 900) {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(`(max-width:${maxWidth}px)`).matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width:${maxWidth}px)`);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxWidth]);
  return mobile;
}

/* ============================== ROOT ============================== */
export default function App() {
  const isMobile = useIsMobile(900);
  const [content, setContent] = useState(initialContent);
  // editor starts closed on mobile so the site is visible first
  const [showEditor, setShowEditor] = useState(
    () => !(typeof window !== "undefined" && window.matchMedia("(max-width:900px)").matches)
  );
  const [activeDeptId, setActiveDeptId] = useState(initialContent.departments[0].id);
  // simple in-app routing: { name: "home" | "detail" | "faq" | "contact" | "treatments" | "treatment" | "reviews" | "beforeafter" | "blog" | "blogpost" | "reservation" | "mypage", ... }
  const [route, setRoute] = useState({ name: "home" });
  const [lang, setLang] = useState("en");
  const t = I18N[lang];

  const activeDepts = content.departments.filter((d) => d.active);
  const safeDeptId = activeDepts.find((d) => d.id === activeDeptId) ? activeDeptId : activeDepts[0]?.id;

  const go = (next) => { setRoute(next); window.scrollTo({ top: 0, behavior: "auto" }); };
  const goHome = () => go({ name: "home" });

  // resolve detail target live from content (stays in sync with admin edits)
  const detailDept = route.name === "detail" ? content.departments.find((d) => d.id === route.deptId) : null;
  const detailHospital = detailDept ? detailDept.hospitals.find((h) => h.id === route.hospitalId) : null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f4f6f7", minHeight: "100vh", display: "flex" }}>
      <div style={{ flex: 1, minWidth: 0, overflowX: "hidden", display: "flex", flexDirection: "column" }}>
        <Nav content={content} route={route} onNav={go} onHome={goHome} onToggleEditor={() => setShowEditor((s) => !s)} editorOpen={showEditor} isMobile={isMobile} lang={lang} onToggleLang={() => setLang((l) => (l === "en" ? "ko" : "en"))} t={t} />
        <InsurerBanner insurer={content.brand.insurer} />
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 60px", width: "100%", boxSizing: "border-box", flex: 1 }}>
          {route.name === "home" && (
            <>
              <Hero hero={content.hero} isMobile={isMobile} />
              <DeptChips depts={activeDepts} activeId={safeDeptId} onPick={setActiveDeptId} />
              <Results
                dept={activeDepts.find((d) => d.id === safeDeptId)}
                onView={(h, d) => go({ name: "detail", deptId: d.id, hospitalId: h.id })}
              />
              <TotalCare />
            </>
          )}
          {route.name === "detail" && (
            <HospitalDetail
              hospital={detailHospital}
              dept={detailDept}
              insurer={content.brand.insurer}
              onBack={goHome}
              onContact={() => go({ name: "contact", hospitalId: route.hospitalId, deptId: route.deptId })}
            />
          )}
          {route.name === "faq" && <FAQPage onContact={() => go({ name: "contact" })} />}
          {route.name === "contact" && (
            <ContactPage
              depts={content.departments}
              prefillHospital={content.departments.find((d) => d.id === route.deptId)?.hospitals.find((h) => h.id === route.hospitalId)}
            />
          )}
          {route.name === "about" && <AboutPage insurer={content.brand.insurer} onContact={() => go({ name: "contact" })} onPrograms={goHome} />}
          {route.name === "howitworks" && <HowItWorksPage onPrograms={goHome} onContact={() => go({ name: "contact" })} />}
          {route.name === "legal" && <LegalPage doc={route.doc} onContact={() => go({ name: "contact" })} />}

          {route.name === "treatments" && (
            <TreatmentsPage treatments={TREATMENTS} departments={content.departments} lang={lang} t={t}
              onOpen={(id) => go({ name: "treatment", treatmentId: id })} />
          )}
          {route.name === "treatment" && (
            <TreatmentDetail treatment={TREATMENTS.find((x) => x.id === route.treatmentId)} departments={content.departments} lang={lang} t={t}
              onBack={() => go({ name: "treatments" })} onBook={(id) => go({ name: "reservation", treatmentId: id })} />
          )}
          {route.name === "reviews" && <ReviewsPage reviews={REVIEWS} lang={lang} t={t} />}
          {route.name === "beforeafter" && <BeforeAfterPage beforeAfter={BEFORE_AFTER} lang={lang} t={t} />}
          {route.name === "blog" && <BlogPage blogPosts={BLOG_POSTS} lang={lang} t={t} onOpen={(id) => go({ name: "blogpost", postId: id })} />}
          {route.name === "blogpost" && <BlogPostPage post={BLOG_POSTS.find((p) => p.id === route.postId)} lang={lang} t={t} onBack={() => go({ name: "blog" })} />}
          {route.name === "reservation" && <ReservationPage treatments={TREATMENTS} lang={lang} t={t} prefillTreatmentId={route.treatmentId} />}
          {route.name === "mypage" && <MyPage lang={lang} t={t} onBook={() => go({ name: "reservation" })} />}
        </div>
        <Footer brand={content.brand} onNav={go} onHome={goHome} />
      </div>

      {showEditor && isMobile && (
        <div onClick={() => setShowEditor(false)} style={{ position: "fixed", inset: 0, background: "rgba(8,20,24,.45)", zIndex: 40 }} />
      )}
      {showEditor && (
        <AdminEditor
          content={content}
          setContent={setContent}
          activeDeptId={safeDeptId}
          setActiveDeptId={setActiveDeptId}
          onClose={() => setShowEditor(false)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

/* ------------------------------ Nav ------------------------------ */
function Nav({ content, route, onNav, onHome, onToggleEditor, editorOpen, isMobile, lang, onToggleLang, t }) {
  // primary menu = 요구사항정의서 상단 메뉴 (시술·병원·리뷰·비포/애프터·블로그·FAQ)
  const links = [
    { id: "treatments", label: t.nav.treatments, on: () => onNav({ name: "treatments" }) },
    { id: "home", label: t.nav.hospitals, on: () => onHome() },
    { id: "reviews", label: t.nav.reviews, on: () => onNav({ name: "reviews" }) },
    { id: "beforeafter", label: t.nav.beforeafter, on: () => onNav({ name: "beforeafter" }) },
    { id: "blog", label: t.nav.blog, on: () => onNav({ name: "blog" }) },
    { id: "faq", label: t.nav.faq, on: () => onNav({ name: "faq" }) },
  ];
  const LinkButtons = () => links.map((l) => {
    const active = route?.name === l.id || (l.id === "blog" && route?.name === "blogpost") || (l.id === "treatments" && route?.name === "treatment");
    return (
      <button key={l.id} onClick={l.on} style={{
        border: "none", background: "transparent", cursor: "pointer", whiteSpace: "nowrap",
        padding: "8px 10px", borderRadius: 8, fontSize: 14,
        fontWeight: active ? 700 : 500, color: active ? TEAL : SUB,
      }}>{l.label}</button>
    );
  });
  const langBtn = (
    <button onClick={onToggleLang} title="Language" style={{ border: `1px solid ${LINE}`, background: "#fff", color: SUB, cursor: "pointer", borderRadius: 8, padding: "8px 10px", fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
      <Globe size={14} /> {lang === "en" ? "EN" : "한"}
    </button>
  );
  const loginBtn = (
    <button onClick={() => onNav({ name: "mypage" })} style={{ ...btn(TEAL, "#fff"), display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, padding: "9px 14px" }}>
      <User size={15} /> {t.nav.login}
    </button>
  );
  const adminBtn = (
    <button onClick={onToggleEditor} title="Admin" style={{ border: `1px solid ${LINE}`, background: editorOpen ? TEAL : "#fff", color: editorOpen ? "#fff" : MUTE, cursor: "pointer", borderRadius: 8, padding: "8px 10px", display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
      <Settings size={15} />
    </button>
  );
  const brand = (
    <button onClick={onHome} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 20, color: TEAL, padding: 0 }}>
      <Plane size={20} /> {content.brand.name}
    </button>
  );

  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${LINE}`, position: "sticky", top: 0, zIndex: 5 }}>
      {isMobile ? (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            {brand}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{langBtn}{loginBtn}{adminBtn}</div>
          </div>
          {/* horizontally scrollable link row */}
          <div style={{ display: "flex", gap: 2, marginTop: 8, overflowX: "auto", WebkitOverflowScrolling: "touch", marginLeft: -4 }}>
            <LinkButtons />
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          {brand}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <LinkButtons />
            <span style={{ display: "inline-flex", gap: 6, marginLeft: 6 }}>{langBtn}{loginBtn}{adminBtn}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function InsurerBanner({ insurer }) {
  return (
    <div style={{ background: TEAL, color: "#fff" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, flexWrap: "wrap" }}>
        <Shield size={15} />
        <span style={{ opacity: .95 }}>You were referred by <b>{insurer}</b>. Covered programs are highlighted below.</span>
      </div>
    </div>
  );
}

/* --------------- reusable: image with text overlays --------------- */
function OverlayImage({ image, height, radius = 16, textScale = 1 }) {
  if (!image || !image.url) {
    return (
      <div style={{ height: height === "100%" ? "100%" : height, minHeight: 120, borderRadius: radius, background: "#dfe6e9", display: "grid", placeItems: "center", color: MUTE }}>
        <ImageIcon size={28} />
      </div>
    );
  }
  const scrim = image.overlayScrim ?? 0;
  return (
    <div style={{ position: "relative", height, minHeight: 120, borderRadius: radius, overflow: "hidden", background: "#dfe6e9" }}>
      <img src={image.url} alt={image.alt || ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {scrim > 0 && (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(8,20,24,${scrim}) 0%, rgba(8,20,24,${scrim * 0.4}) 60%, rgba(8,20,24,0) 100%)` }} />
      )}
      {(image.overlays || []).map((o) => (
        <div key={o.id} style={{
          position: "absolute",
          left: o.align === "center" ? 0 : `${o.x}%`,
          right: o.align === "center" ? 0 : "auto",
          top: `${o.y}%`,
          transform: "translateY(-50%)",
          maxWidth: o.align === "center" ? "100%" : `${o.maxWidth || 80}%`,
          padding: o.align === "center" ? "0 6%" : 0,
          color: o.color, fontSize: Math.round(o.size * textScale), fontWeight: o.weight,
          textAlign: o.align, lineHeight: 1.15,
          textShadow: "0 1px 8px rgba(0,0,0,.35)",
          pointerEvents: "none",
        }}>
          {o.text}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- Hero ----------------------------- */
function Hero({ hero, isMobile }) {
  return (
    <div style={{ marginTop: isMobile ? 12 : 20 }}>
      <OverlayImage image={hero.image} height={isMobile ? 380 : 300} textScale={isMobile ? 0.62 : 1} />
      <div style={{ background: "#fff", padding: 8, borderRadius: 14, boxShadow: "0 6px 24px rgba(11,107,107,.12)", maxWidth: 720, marginTop: -28, marginLeft: isMobile ? 0 : 20, position: "relative" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#f6f8f9", borderRadius: 9, flex: 1, minWidth: 160, height: 50, color: MUTE }}>
            <Search size={18} />
            <input placeholder="Treatment, condition, or hospital" style={{ border: "none", background: "transparent", outline: "none", fontSize: 15, width: "100%", color: INK }} />
          </div>
          <button style={{ ...btn(TEAL, "#fff"), padding: "0 28px", fontSize: 15, flex: isMobile ? 1 : "none" }}>Find programs</button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Dept chips --------------------------- */
function DeptChips({ depts, activeId, onPick }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
      {depts.map((d) => {
        const on = d.id === activeId;
        return (
          <button key={d.id} onClick={() => onPick(d.id)} style={{
            border: on ? `1.5px solid ${TEAL}` : `1px solid ${LINE}`,
            background: on ? TEAL_SOFT : "#fff", color: on ? TEAL : SUB,
            borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{d.name}</button>
        );
      })}
    </div>
  );
}

/* ----------------------------- Results ----------------------------- */
function Results({ dept, onView }) {
  if (!dept) return <div style={{ marginTop: 30, color: MUTE }}>No active departments. Enable one in the admin panel.</div>;
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: INK, margin: 0 }}>{dept.name} programs</h2>
        <span style={{ fontSize: 13, color: MUTE }}>{dept.hospitals.length} matched · sorted by your coverage</span>
      </div>

      {dept.hospitals.map((h) => (
        <div key={h.id} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, overflow: "hidden", marginBottom: 12, display: "flex", flexWrap: "wrap" }}>
          <div style={{ width: 200, minWidth: 160, flexShrink: 0 }}>
            <OverlayImage image={h.image} height={"100%"} radius={0} />
          </div>
          <div style={{ flex: 1, minWidth: 220, padding: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, color: INK, fontSize: 16 }}>{h.name}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#eef6ff", color: "#2563a8", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                  <Award size={11} /> {h.accred}
                </span>
                {h.covered && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: TEAL_SOFT, color: TEAL, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    <Check size={11} /> Covered
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13.5, color: TEAL, fontWeight: 600, marginTop: 6 }}>{h.program}</div>
              <div style={{ fontSize: 13, color: SUB, marginTop: 2 }}>{h.lead}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, fontSize: 13, color: SUB, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Star size={13} fill="#f5a623" color="#f5a623" /><b style={{ color: INK }}>{h.rating}</b> ({h.reviews})</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {h.city}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {h.weeks}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", minWidth: 130 }}>
              <div style={{ fontSize: 11, color: MUTE }}>US cost</div>
              <div style={{ fontSize: 13, color: MUTE, textDecoration: "line-through" }}>${h.us.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>Korea all-in</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: TEAL }}>${h.kr.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#1f9d6b", fontWeight: 700 }}>Save ${(h.us - h.kr).toLocaleString()}</div>
              <button onClick={() => onView(h, dept)} style={{ ...btn(TEAL, "#fff"), marginTop: 10, fontSize: 13, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", width: "100%" }}>
                View plan <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- Total care --------------------------- */
function TotalCare() {
  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: INK, margin: "0 0 4px" }}>One team, the whole journey</h2>
      <p style={{ fontSize: 14, color: SUB, margin: "0 0 20px" }}>You never coordinate a single vendor yourself.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }} className="steps-grid">
        {CARE_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: 18, position: "relative" }}>
              <div style={{ position: "absolute", top: 14, right: 14, fontSize: 12, fontWeight: 800, color: "#cfd8dd" }}>0{i + 1}</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: TEAL_SOFT, color: TEAL, display: "grid", placeItems: "center", marginBottom: 12 }}><Icon size={20} /></div>
              <div style={{ fontWeight: 700, color: INK, fontSize: 14, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 12.5, color: SUB, lineHeight: 1.45 }}>{s.d}</div>
            </div>
          );
        })}
      </div>
      <style>{`@media(max-width:880px){.steps-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  );
}

/* ========================================================================
   HOSPITAL DETAIL  (shown on "View plan")
   ======================================================================== */
function HospitalDetail({ hospital, dept, insurer, onBack, onContact }) {
  if (!hospital) {
    return (
      <div style={{ marginTop: 40, textAlign: "center", color: MUTE }}>
        <p>This program is no longer available.</p>
        <button onClick={onBack} style={{ ...btn(TEAL, "#fff"), marginTop: 8 }}>Back to programs</button>
      </div>
    );
  }
  const save = hospital.us - hospital.kr;
  const savePct = hospital.us > 0 ? Math.round((save / hospital.us) * 100) : 0;
  const programIncludes = [
    "Specialist consultation & second-opinion review",
    `${dept?.name || "Treatment"} procedure at ${hospital.name}`,
    "Pre-op diagnostics and imaging",
    "Inpatient stay & nursing care",
    "Post-op check-ups before discharge",
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", color: SUB, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, padding: "6px 0", marginBottom: 8 }}>
        <ArrowLeft size={16} /> Back to {dept?.name || "programs"}
      </button>

      <OverlayImage image={hospital.image} height={280} />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 20, alignItems: "flex-start" }}>
        {/* main column */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: INK, margin: 0 }}>{hospital.name}</h1>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#eef6ff", color: "#2563a8", padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              <Award size={12} /> {hospital.accred}
            </span>
            {hospital.covered && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: TEAL_SOFT, color: TEAL, padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                <Check size={12} /> Covered
              </span>
            )}
          </div>
          <div style={{ fontSize: 16, color: TEAL, fontWeight: 700, marginTop: 8 }}>{hospital.program}</div>
          {hospital.lead && <div style={{ fontSize: 14.5, color: SUB, marginTop: 4 }}>{hospital.lead}</div>}

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, fontSize: 14, color: SUB, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Star size={15} fill="#f5a623" color="#f5a623" /><b style={{ color: INK }}>{hospital.rating}</b> ({hospital.reviews} reviews)</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={15} /> {hospital.city}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={15} /> {hospital.weeks} in Korea</span>
          </div>

          <SectionDivider />

          <h3 style={{ fontSize: 17, fontWeight: 800, color: INK, margin: "0 0 12px" }}>What this program includes</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {programIncludes.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: SUB }}>
                <CheckCircle2 size={18} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} /> {p}
              </div>
            ))}
          </div>

          <SectionDivider />

          <h3 style={{ fontSize: 17, fontWeight: 800, color: INK, margin: "0 0 6px" }}>End-to-end, handled by KoreCare</h3>
          <p style={{ fontSize: 14, color: SUB, margin: "0 0 16px" }}>Beyond the procedure itself, your full journey is coordinated for you.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="detail-care-grid">
            {CARE_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ display: "flex", gap: 12, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: TEAL_SOFT, color: TEAL, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={18} /></div>
                  <div>
                    <div style={{ fontWeight: 700, color: INK, fontSize: 13.5 }}>{s.t}</div>
                    <div style={{ fontSize: 12.5, color: SUB, lineHeight: 1.45, marginTop: 2 }}>{s.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* price / cta column */}
        <div style={{ width: 320, flexShrink: 0, position: "sticky", top: 80 }} className="detail-aside">
          <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: 22, boxShadow: "0 6px 24px rgba(11,107,107,.08)" }}>
            <div style={{ fontSize: 12, color: MUTE }}>Typical US cost</div>
            <div style={{ fontSize: 15, color: MUTE, textDecoration: "line-through" }}>${hospital.us.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: MUTE, marginTop: 8 }}>Korea all-in price</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: TEAL, lineHeight: 1.1 }}>${hospital.kr.toLocaleString()}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eafaf2", color: "#1f9d6b", padding: "5px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700, marginTop: 10 }}>
              Save ${save.toLocaleString()} ({savePct}% less)
            </div>

            {hospital.covered && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 14, fontSize: 12.5, color: SUB, background: TEAL_SOFT, borderRadius: 10, padding: "10px 12px" }}>
                <Shield size={15} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Covered under your <b>{insurer}</b> referral. Final out-of-pocket confirmed after records review.</span>
              </div>
            )}

            <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
              <button onClick={onContact} style={{ ...btn(TEAL, "#fff"), display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Send size={16} /> Request this plan
              </button>
              <button onClick={onContact} style={{ ...btn("#fff", TEAL), border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Phone size={16} /> Talk to a coordinator
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 12, color: MUTE }}>
              <Calendar size={14} /> Estimated stay: {hospital.weeks}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.detail-aside{width:100%!important;position:static!important}.detail-care-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, background: LINE, margin: "24px 0" }} />;
}

/* ========================================================================
   FAQ
   ======================================================================== */
const FAQ_ITEMS = [
  { q: "Is my procedure really covered by my insurer?", a: "If you were referred to KoreCare by your insurer, the listed program is covered under that referral. We confirm your exact out-of-pocket amount after a short records review — before you commit to anything." },
  { q: "Which hospitals do you work with?", a: "Only internationally accredited (e.g. JCI) tertiary hospitals in Korea, each with a dedicated international patient center. You see the accreditation and patient ratings on every program card." },
  { q: "What exactly does KoreCare arrange?", a: "Everything outside the treatment room: care-plan matching, flights and visa support, airport pickup, a dedicated English interpreter and coordinator, hospital-adjacent recovery accommodation, and follow-up coordination with your doctor back home." },
  { q: "Can a companion travel with me?", a: "Yes. Travel and accommodation for one companion are included in the standard journey arrangement." },
  { q: "Will language be a problem?", a: "No. You are assigned an English-speaking coordinator and medical interpreter for every appointment, from consultation through discharge." },
  { q: "How long will I need to stay in Korea?", a: "It depends on the program — each card shows a typical stay (for example 3–5 weeks for oncology, a few days for screening). Your coordinator confirms the schedule once your treatment plan is set." },
  { q: "How is aftercare handled once I'm home?", a: "Before you fly home we prepare a full medical summary and coordinate follow-up directly with your US physician, so your local care continues seamlessly." },
  { q: "How do I get started?", a: "Pick a program and tap “Request this plan”, or send us a message from the Contact page. A coordinator follows up to review your records and confirm coverage." },
];

function FAQPage({ onContact }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ marginTop: 28, maxWidth: 760 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: TEAL_SOFT, color: TEAL, padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
        <HelpCircle size={15} /> Frequently asked questions
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "14px 0 6px" }}>Everything you might be wondering</h1>
      <p style={{ fontSize: 15, color: SUB, margin: "0 0 24px" }}>Can't find your answer? Our coordinators are one message away.</p>

      <div style={{ display: "grid", gap: 10 }}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ background: "#fff", border: `1px solid ${isOpen ? TEAL : LINE}`, borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 18px", border: "none", background: isOpen ? TEAL_SOFT : "#fff", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{item.q}</span>
                <ChevronDown size={18} color={isOpen ? TEAL : MUTE} style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 16px", fontSize: 14, color: SUB, lineHeight: 1.6 }}>{item.a}</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 26, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Still have a question?</div>
          <div style={{ fontSize: 13.5, color: SUB, marginTop: 2 }}>Talk to a KoreCare coordinator — no obligation.</div>
        </div>
        <button onClick={onContact} style={{ ...btn(TEAL, "#fff"), display: "inline-flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={16} /> Contact us
        </button>
      </div>
    </div>
  );
}

/* ========================================================================
   CONTACT
   ======================================================================== */
function ContactPage({ depts, prefillHospital }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    interest: prefillHospital ? `${prefillHospital.name} — ${prefillHospital.program}` : "",
    message: prefillHospital ? `I'd like to know more about the ${prefillHospital.program} at ${prefillHospital.name}.` : "",
  });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email);

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    // No backend in this prototype — submission is captured client-side only.
    setSent(true);
  };

  const interestOptions = [];
  depts.forEach((d) => d.hospitals.forEach((h) => interestOptions.push(`${h.name} — ${h.program}`)));

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: TEAL_SOFT, color: TEAL, padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
        <Mail size={15} /> Contact us
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "14px 0 6px" }}>Talk to a care coordinator</h1>
      <p style={{ fontSize: 15, color: SUB, margin: "0 0 24px" }}>Tell us a little about what you need. A coordinator replies within one business day.</p>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* form */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {sent ? (
            <div style={{ background: "#fff", border: `1px solid ${TEAL}`, borderRadius: 16, padding: 32, textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: TEAL_SOFT, color: TEAL, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
                <CheckCircle2 size={30} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: INK, margin: "0 0 6px" }}>Thanks, {form.name.split(" ")[0] || "there"}!</h3>
              <p style={{ fontSize: 14, color: SUB, margin: "0 0 18px", lineHeight: 1.6 }}>Your request has been received. A KoreCare coordinator will reach out to <b>{form.email}</b> within one business day.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", interest: "", message: "" }); }} style={{ ...btn("#fff", TEAL), border: `1px solid ${TEAL}` }}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: 22 }}>
              <Field label="Full name *">
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" style={contactInput} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="contact-row">
                <Field label="Email *">
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@email.com" style={contactInput} />
                </Field>
                <Field label="Phone">
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" style={contactInput} />
                </Field>
              </div>
              <Field label="Program of interest">
                <select value={form.interest} onChange={(e) => set("interest", e.target.value)} style={{ ...contactInput, background: "#fff" }}>
                  <option value="">— Select a program (optional) —</option>
                  {interestOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Message">
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} placeholder="Tell us about your condition, timing, or questions…" style={{ ...contactInput, resize: "vertical", fontFamily: "inherit" }} />
              </Field>
              <button type="submit" disabled={!valid} style={{ ...btn(valid ? TEAL : "#cfd8dd", "#fff"), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: valid ? "pointer" : "not-allowed", marginTop: 4 }}>
                <Send size={16} /> Send request
              </button>
              <div style={{ fontSize: 11.5, color: MUTE, textAlign: "center", marginTop: 10 }}>By sending, you agree to be contacted about your inquiry. We never share your information.</div>
            </form>
          )}
        </div>

        {/* contact info */}
        <div style={{ width: 300, flexShrink: 0 }} className="contact-aside">
          <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: INK, margin: "0 0 14px" }}>Reach us directly</h3>
            <ContactRow icon={<Mail size={16} />} label="Email" value="care@korecare.example" />
            <ContactRow icon={<Phone size={16} />} label="Coordinator line" value="+1 (888) 555-0142" />
            <ContactRow icon={<MessageSquare size={16} />} label="Hours" value="Mon–Fri, 9am–6pm ET" />
            <ContactRow icon={<Users size={16} />} label="In Korea" value="Seoul international patient desk" last />
          </div>
          <div style={{ background: TEAL_SOFT, borderRadius: 16, padding: 18, marginTop: 12, fontSize: 13, color: TEAL, display: "flex", gap: 10 }}>
            <Shield size={18} style={{ flexShrink: 0 }} />
            <span>Referred by your insurer? Mention it and we'll fast-track your coverage check.</span>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.contact-aside{width:100%!important}.contact-row{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: SUB, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
function ContactRow({ icon, label, value, last }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingBottom: last ? 0 : 14, marginBottom: last ? 0 : 14, borderBottom: last ? "none" : `1px solid ${LINE}` }}>
      <span style={{ color: TEAL, marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11.5, color: MUTE }}>{label}</div>
        <div style={{ fontSize: 14, color: INK, fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}
const contactInput = { width: "100%", border: `1px solid ${LINE}`, borderRadius: 9, padding: "10px 12px", fontSize: 14, color: INK, outline: "none", boxSizing: "border-box" };

/* ------------------------------- Footer ------------------------------- */
function Footer({ brand, onNav, onHome }) {
  return (
    <div style={{ background: "#fff", borderTop: `1px solid ${LINE}`, marginTop: "auto" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, color: TEAL }}>
            <Plane size={17} /> {brand.name}
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 13.5, flexWrap: "wrap" }}>
            <button onClick={onHome} style={footerLink}>Programs</button>
            <button onClick={() => onNav({ name: "howitworks" })} style={footerLink}>How It Works</button>
            <button onClick={() => onNav({ name: "about" })} style={footerLink}>About</button>
            <button onClick={() => onNav({ name: "faq" })} style={footerLink}>FAQ</button>
            <button onClick={() => onNav({ name: "contact" })} style={footerLink}>Contact Us</button>
          </div>
        </div>
        <div style={{ height: 1, background: LINE, margin: "16px 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 16, fontSize: 12.5, flexWrap: "wrap" }}>
            <button onClick={() => onNav({ name: "legal", doc: "privacy" })} style={footerLink}>Privacy Policy</button>
            <button onClick={() => onNav({ name: "legal", doc: "terms" })} style={footerLink}>Terms of Service</button>
            <button onClick={() => onNav({ name: "legal", doc: "refund" })} style={footerLink}>Refund Policy</button>
          </div>
          <div style={{ fontSize: 12, color: MUTE }}>© {brand.name}. Prototype — not medical advice.</div>
        </div>
      </div>
    </div>
  );
}
const footerLink = { border: "none", background: "transparent", cursor: "pointer", color: SUB, fontSize: 13.5, padding: 0, fontWeight: 500 };

/* ========================================================================
   ABOUT  (mirrors SafeDoc "Company")
   ======================================================================== */
function AboutPage({ insurer, onContact, onPrograms }) {
  const stats = [
    { n: "500+", l: "Partner hospitals & clinics in Korea" },
    { n: "12", l: "JCI-accredited tertiary centers" },
    { n: "60%+", l: "Average savings vs. US list price" },
    { n: "24/7", l: "English coordinator support" },
  ];
  const values = [
    { icon: Shield, t: "Insurer-aligned", d: "We work directly with referrers so covered programs are clear before you commit." },
    { icon: Award, t: "Accredited only", d: "Every partner is internationally accredited (JCI) with a dedicated international patient center." },
    { icon: Users, t: "One team, end to end", d: "From records review to US aftercare, a single coordinator owns your journey." },
  ];
  return (
    <div style={{ marginTop: 28, maxWidth: 860 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: TEAL_SOFT, color: TEAL, padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
        <Building2 size={15} /> About KoreCare
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "14px 0 6px" }}>World-class care in Korea, fully managed</h1>
      <p style={{ fontSize: 15.5, color: SUB, margin: "0 0 22px", lineHeight: 1.6 }}>
        KoreCare connects internationally-referred patients with Korea's top accredited hospitals — and manages
        every step around the procedure. Your insurer covers the treatment; we handle travel, language, recovery,
        and follow-up so you never coordinate a single vendor yourself.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="about-stats">
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: TEAL }}>{s.n}</div>
            <div style={{ fontSize: 12.5, color: SUB, marginTop: 4, lineHeight: 1.4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <SectionDivider />

      <h3 style={{ fontSize: 18, fontWeight: 800, color: INK, margin: "0 0 14px" }}>What we stand for</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <div key={i} style={{ display: "flex", gap: 14, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: TEAL_SOFT, color: TEAL, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={20} /></div>
              <div>
                <div style={{ fontWeight: 700, color: INK, fontSize: 15 }}>{v.t}</div>
                <div style={{ fontSize: 13.5, color: SUB, marginTop: 3, lineHeight: 1.5 }}>{v.d}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 22, background: TEAL_SOFT, borderRadius: 14, padding: 20, fontSize: 13.5, color: TEAL, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Shield size={18} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Referred by <b>{insurer}</b>? Your covered programs are highlighted across the site — start from Programs or talk to a coordinator.</span>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <button onClick={onPrograms} style={{ ...btn(TEAL, "#fff"), display: "inline-flex", alignItems: "center", gap: 8 }}>Browse programs <ChevronRight size={16} /></button>
        <button onClick={onContact} style={{ ...btn("#fff", TEAL), border: `1px solid ${TEAL}`, display: "inline-flex", alignItems: "center", gap: 8 }}>Contact us</button>
      </div>
      <style>{`@media(max-width:760px){.about-stats{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  );
}

/* ========================================================================
   HOW IT WORKS  (mirrors SafeDoc "Service" + Transportation/Accommodation/Tour)
   ======================================================================== */
function HowItWorksPage({ onPrograms, onContact }) {
  const journey = [
    { icon: Stethoscope, t: "1 · Match & review", d: "Share your records. We match a covered program and confirm your out-of-pocket before you commit." },
    { icon: Plane, t: "2 · Transportation", d: "Flights, visa support and airport pickup arranged for you and one companion." },
    { icon: Hotel, t: "3 · Accommodation", d: "Hospital-adjacent recovery stay booked to fit your treatment schedule." },
    { icon: Languages, t: "4 · In-Korea support", d: "A dedicated English coordinator and medical interpreter join every appointment." },
    { icon: MapPin, t: "5 · Tour & recovery", d: "Optional guided tours and wellness activities during recovery downtime." },
    { icon: HeartPulse, t: "6 · US aftercare", d: "We prepare your medical summary and coordinate follow-up with your home doctor." },
  ];
  return (
    <div style={{ marginTop: 28, maxWidth: 920 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: TEAL_SOFT, color: TEAL, padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
        <Plane size={15} /> How it works
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "14px 0 6px" }}>One team, the whole journey</h1>
      <p style={{ fontSize: 15.5, color: SUB, margin: "0 0 24px", lineHeight: 1.6 }}>
        Your insurer covers the procedure — KoreCare manages everything around it. Transportation, accommodation,
        language, tours and aftercare are all handled by a single coordinator.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="how-grid">
        {journey.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ display: "flex", gap: 14, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: 18 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: TEAL_SOFT, color: TEAL, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={20} /></div>
              <div>
                <div style={{ fontWeight: 700, color: INK, fontSize: 15 }}>{s.t}</div>
                <div style={{ fontSize: 13.5, color: SUB, marginTop: 3, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Ready to see covered programs?</div>
          <div style={{ fontSize: 13.5, color: SUB, marginTop: 2 }}>Browse by department and see your savings instantly.</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={onPrograms} style={{ ...btn(TEAL, "#fff"), display: "inline-flex", alignItems: "center", gap: 8 }}>View programs <ChevronRight size={16} /></button>
          <button onClick={onContact} style={{ ...btn("#fff", TEAL), border: `1px solid ${TEAL}` }}>Contact us</button>
        </div>
      </div>
      <style>{`@media(max-width:760px){.how-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

/* ========================================================================
   LEGAL  (Privacy / Terms / Refund — mirrors SafeDoc footer)
   ======================================================================== */
const LEGAL_DOCS = {
  privacy: {
    title: "Privacy Policy",
    intro: "How KoreCare collects, uses and protects your personal and health information.",
    sections: [
      { h: "Information we collect", b: "Contact details you submit (name, email, phone) and any medical records you share to confirm program coverage. We collect only what is needed to coordinate your care." },
      { h: "How we use it", b: "To match you to covered programs, confirm out-of-pocket costs with your insurer, and arrange travel, accommodation and aftercare. We never sell your information." },
      { h: "Sharing", b: "We share relevant medical details only with the partner hospital you select and, where applicable, your referring insurer — always to deliver your care." },
      { h: "Your rights", b: "You may request access to, correction of, or deletion of your data at any time by contacting us." },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "The terms that govern your use of the KoreCare website and coordination services.",
    sections: [
      { h: "Service scope", b: "KoreCare is a care-coordination service. We arrange and manage the journey around medical treatment; we do not provide medical care ourselves and are not a substitute for professional medical advice." },
      { h: "Quotes & coverage", b: "Prices shown are estimates. Final out-of-pocket amounts are confirmed after a records review with your insurer before any commitment." },
      { h: "Bookings", b: "Travel, accommodation and treatment bookings are made on your behalf with third-party providers and partner hospitals, subject to their terms." },
      { h: "Liability", b: "This site is a prototype for demonstration. Treatment outcomes are the responsibility of the providing hospital and your medical team." },
    ],
  },
  refund: {
    title: "Refund Policy",
    intro: "When and how coordination fees and bookings can be refunded.",
    sections: [
      { h: "Coordination fees", b: "Any coordination fee is fully refundable until you confirm a program. After confirmation, refunds are prorated against services already arranged." },
      { h: "Travel & accommodation", b: "Flights and stays follow the cancellation terms of the airline and property. We help you secure flexible options where possible." },
      { h: "Treatment deposits", b: "Hospital deposits are refundable according to the partner hospital's policy, which we disclose before you pay." },
      { h: "How to request", b: "Email our coordinator line with your booking reference; refunds are processed to your original payment method." },
    ],
  },
};

function LegalPage({ doc, onContact }) {
  const d = LEGAL_DOCS[doc] || LEGAL_DOCS.privacy;
  return (
    <div style={{ marginTop: 28, maxWidth: 760 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: TEAL_SOFT, color: TEAL, padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
        <Shield size={15} /> Legal
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "14px 0 6px" }}>{d.title}</h1>
      <p style={{ fontSize: 15, color: SUB, margin: "0 0 22px", lineHeight: 1.6 }}>{d.intro}</p>

      <div style={{ display: "grid", gap: 14 }}>
        {d.sections.map((s, i) => (
          <div key={i} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontWeight: 700, color: INK, fontSize: 15, marginBottom: 6 }}>{s.h}</div>
            <div style={{ fontSize: 13.5, color: SUB, lineHeight: 1.6 }}>{s.b}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, fontSize: 12.5, color: MUTE }}>
        Prototype document for demonstration — not legal advice. Questions?{" "}
        <button onClick={onContact} style={{ ...footerLink, color: TEAL, fontWeight: 600 }}>Contact us</button>.
      </div>
    </div>
  );
}

/* =========================================================================
   ADMIN EDITOR
   ========================================================================= */
function AdminEditor({ content, setContent, activeDeptId, setActiveDeptId, onClose, isMobile }) {
  const [tab, setTab] = useState("hero");

  const update = (fn) => setContent((prev) => {
    const next = structuredClone(prev);
    fn(next);
    return next;
  });

  const activeDept = content.departments.find((d) => d.id === activeDeptId) || content.departments.find((d) => d.active);

  const shellStyle = isMobile
    ? { position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 400, background: "#fff", borderLeft: `1px solid ${LINE}`, height: "100vh", overflowY: "auto", zIndex: 41, boxShadow: "-8px 0 40px rgba(8,20,24,.25)" }
    : { width: 380, flexShrink: 0, background: "#fff", borderLeft: `1px solid ${LINE}`, height: "100vh", position: "sticky", top: 0, overflowY: "auto" };
  return (
    <div style={shellStyle}>
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: INK }}>
          <Settings size={18} color={TEAL} /> Content admin
        </div>
        <button onClick={onClose} style={{ border: "none", background: "#f6f8f9", borderRadius: 8, padding: 6, cursor: "pointer", color: SUB }}><X size={16} /></button>
      </div>

      <div style={{ display: "flex", gap: 6, padding: "12px 18px", borderBottom: `1px solid ${LINE}` }}>
        {[["hero", "Hero image"], ["depts", "Departments"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, border: "none", cursor: "pointer", borderRadius: 8, padding: "8px 0", fontSize: 13, fontWeight: 600,
            background: tab === id ? TEAL_SOFT : "#f6f8f9", color: tab === id ? TEAL : SUB,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: 18 }}>
        {tab === "hero" && (
          <ImageEditor
            label="Hero banner"
            image={content.hero.image}
            onChange={(img) => update((n) => { n.hero.image = img; })}
          />
        )}
        {tab === "depts" && (
          <DeptEditor content={content} update={update} activeDept={activeDept} setActiveDeptId={setActiveDeptId} />
        )}
      </div>
    </div>
  );
}

/* ---------------- image + overlay editor (shared) ---------------- */
function ImageEditor({ label, image, onChange }) {
  const setField = (k, v) => onChange({ ...image, [k]: v });
  const setOverlay = (id, k, v) => onChange({ ...image, overlays: image.overlays.map((o) => o.id === id ? { ...o, [k]: v } : o) });
  const addOverlay = () => onChange({ ...image, overlays: [...(image.overlays || []), { id: "ov" + Date.now(), text: "New text", x: 6, y: 50, size: 22, weight: 700, color: "#ffffff", align: "left", maxWidth: 70 }] });
  const removeOverlay = (id) => onChange({ ...image, overlays: image.overlays.filter((o) => o.id !== id) });

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: MUTE, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>

      <div style={{ marginBottom: 12 }}>
        <OverlayImage image={image} height={130} radius={10} />
      </div>

      <FieldLabel icon={<ImageIcon size={13} />} text="Image URL" />
      <input value={image.url} onChange={(e) => setField("url", e.target.value)} placeholder="https://… or /uploads/…" style={input} />

      <div style={{ marginTop: 8 }}>
        <FieldLabel icon={<Palette size={13} />} text={`Scrim (text shade) · ${Math.round((image.overlayScrim ?? 0) * 100)}%`} />
        <input type="range" min={0} max={0.8} step={0.05} value={image.overlayScrim ?? 0} onChange={(e) => setField("overlayScrim", parseFloat(e.target.value))} style={{ width: "100%" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0 8px" }}>
        <FieldLabel icon={<Type size={13} />} text="Text overlays" noMargin />
        <button onClick={addOverlay} style={{ ...btn(TEAL_SOFT, TEAL), padding: "5px 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Plus size={13} /> Add text
        </button>
      </div>

      {(image.overlays || []).length === 0 && (
        <div style={{ fontSize: 12.5, color: MUTE, padding: "8px 0" }}>No overlay text. Add one to layer text on the image.</div>
      )}

      {(image.overlays || []).map((o) => (
        <div key={o.id} style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: 12, marginBottom: 10, background: "#fafbfc" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <input value={o.text} onChange={(e) => setOverlay(o.id, "text", e.target.value)} style={{ ...input, marginTop: 0 }} />
            <button onClick={() => removeOverlay(o.id)} style={{ border: "none", background: "#fff", color: "#c0392b", borderRadius: 7, padding: "0 8px", cursor: "pointer" }}><Trash2 size={14} /></button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Mini label={`X ${o.x}%`} icon={<Move size={11} />}>
              <input type="range" min={0} max={90} value={o.x} onChange={(e) => setOverlay(o.id, "x", +e.target.value)} style={{ width: "100%" }} />
            </Mini>
            <Mini label={`Y ${o.y}%`} icon={<Move size={11} />}>
              <input type="range" min={0} max={100} value={o.y} onChange={(e) => setOverlay(o.id, "y", +e.target.value)} style={{ width: "100%" }} />
            </Mini>
            <Mini label={`Size ${o.size}px`}>
              <input type="range" min={11} max={48} value={o.size} onChange={(e) => setOverlay(o.id, "size", +e.target.value)} style={{ width: "100%" }} />
            </Mini>
            <Mini label="Weight">
              <select value={o.weight} onChange={(e) => setOverlay(o.id, "weight", +e.target.value)} style={selectS}>
                <option value={400}>Regular</option><option value={500}>Medium</option>
                <option value={700}>Bold</option><option value={800}>Heavy</option>
              </select>
            </Mini>
            <Mini label="Align">
              <select value={o.align} onChange={(e) => setOverlay(o.id, "align", e.target.value)} style={selectS}>
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select>
            </Mini>
            <Mini label="Color">
              <input type="color" value={o.color} onChange={(e) => setOverlay(o.id, "color", e.target.value)} style={{ width: "100%", height: 28, border: `1px solid ${LINE}`, borderRadius: 6, background: "#fff", cursor: "pointer" }} />
            </Mini>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------- department / hospital editor ------------------- */
function DeptEditor({ content, update, activeDept, setActiveDeptId }) {
  const addDept = () => {
    const id = "dept" + Date.now();
    update((n) => { n.departments.push({ id, name: "New Department", active: true, hospitals: [] }); });
    setActiveDeptId(id);
  };
  const addHospital = (deptId) => update((n) => {
    const d = n.departments.find((x) => x.id === deptId);
    d.hospitals.push({
      id: "h" + Date.now(), name: "New Hospital", city: "Seoul", rating: 4.8, reviews: 0,
      accred: "JCI", program: "New Program", weeks: "2–3 wks", us: 100000, kr: 35000, covered: true, lead: "",
      image: { url: "", alt: "", overlays: [], overlayScrim: 0.35 },
    });
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <FieldLabel icon={<Stethoscope size={13} />} text="Departments" noMargin />
        <button onClick={addDept} style={{ ...btn(TEAL_SOFT, TEAL), padding: "5px 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Plus size={13} /> Add
        </button>
      </div>

      {content.departments.map((d) => (
        <div key={d.id} style={{ border: `1px solid ${d.id === activeDept?.id ? TEAL : LINE}`, borderRadius: 10, padding: 10, marginBottom: 8, background: d.id === activeDept?.id ? TEAL_SOFT : "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input value={d.name} onChange={(e) => update((n) => { n.departments.find((x) => x.id === d.id).name = e.target.value; })} style={{ ...input, marginTop: 0, fontWeight: 600 }} />
            <button onClick={() => setActiveDeptId(d.id)} title="Preview" style={{ border: "none", background: "#fff", borderRadius: 7, padding: "0 8px", cursor: "pointer", color: TEAL }}><Eye size={14} /></button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: SUB, cursor: "pointer" }}>
              <input type="checkbox" checked={d.active} onChange={(e) => update((n) => { n.departments.find((x) => x.id === d.id).active = e.target.checked; })} />
              Visible on site
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: MUTE }}>{d.hospitals.length} hospitals</span>
              <button onClick={() => update((n) => { n.departments = n.departments.filter((x) => x.id !== d.id); })} style={{ border: "none", background: "transparent", color: "#c0392b", cursor: "pointer", padding: 0 }}><Trash2 size={13} /></button>
            </div>
          </div>
        </div>
      ))}

      {activeDept && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <FieldLabel icon={<Building2 size={13} />} text={`Hospitals · ${activeDept.name}`} noMargin />
            <button onClick={() => addHospital(activeDept.id)} style={{ ...btn(TEAL_SOFT, TEAL), padding: "5px 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Plus size={13} /> Add
            </button>
          </div>

          {activeDept.hospitals.map((h) => (
            <HospitalEditor key={h.id} hospital={h} deptId={activeDept.id} update={update} />
          ))}
          {activeDept.hospitals.length === 0 && <div style={{ fontSize: 12.5, color: MUTE }}>No hospitals yet. Add one above.</div>}
        </div>
      )}
    </div>
  );
}

function HospitalEditor({ hospital, deptId, update }) {
  const [open, setOpen] = useState(false);
  const setH = (k, v) => update((n) => {
    const h = n.departments.find((x) => x.id === deptId).hospitals.find((x) => x.id === hospital.id);
    h[k] = v;
  });
  const setImage = (img) => update((n) => {
    const h = n.departments.find((x) => x.id === deptId).hospitals.find((x) => x.id === hospital.id);
    h.image = img;
  });
  const remove = () => update((n) => {
    const d = n.departments.find((x) => x.id === deptId);
    d.hospitals = d.hospitals.filter((x) => x.id !== hospital.id);
  });

  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", cursor: "pointer", background: "#fafbfc" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{hospital.name}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={(e) => { e.stopPropagation(); remove(); }} style={{ border: "none", background: "transparent", color: "#c0392b", cursor: "pointer", padding: 0 }}><Trash2 size={13} /></button>
          <ChevronRight size={15} color={MUTE} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
        </div>
      </div>

      {open && (
        <div style={{ padding: 12, borderTop: `1px solid ${LINE}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Labeled label="Name"><input value={hospital.name} onChange={(e) => setH("name", e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="City"><input value={hospital.city} onChange={(e) => setH("city", e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="Program"><input value={hospital.program} onChange={(e) => setH("program", e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="Accreditation"><input value={hospital.accred} onChange={(e) => setH("accred", e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="Tagline"><input value={hospital.lead} onChange={(e) => setH("lead", e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="Stay"><input value={hospital.weeks} onChange={(e) => setH("weeks", e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="US cost $"><input type="number" value={hospital.us} onChange={(e) => setH("us", +e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="Korea $"><input type="number" value={hospital.kr} onChange={(e) => setH("kr", +e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="Rating"><input type="number" step="0.1" value={hospital.rating} onChange={(e) => setH("rating", +e.target.value)} style={inputSm} /></Labeled>
            <Labeled label="Reviews"><input type="number" value={hospital.reviews} onChange={(e) => setH("reviews", +e.target.value)} style={inputSm} /></Labeled>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: SUB, margin: "8px 0 14px", cursor: "pointer" }}>
            <input type="checkbox" checked={hospital.covered} onChange={(e) => setH("covered", e.target.checked)} /> Covered by insurer
          </label>

          <ImageEditor label="Hospital image" image={hospital.image} onChange={setImage} />
        </div>
      )}
    </div>
  );
}

/* ------------------------- small UI atoms ------------------------- */
function FieldLabel({ icon, text, noMargin }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: SUB, marginBottom: noMargin ? 0 : 6 }}>
      <span style={{ color: TEAL }}>{icon}</span>{text}
    </div>
  );
}
function Mini({ label, icon, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: MUTE, marginBottom: 3, display: "flex", alignItems: "center", gap: 3 }}>{icon}{label}</div>
      {children}
    </div>
  );
}
function Labeled({ label, children }) {
  return <div><div style={{ fontSize: 11, color: MUTE, marginBottom: 3 }}>{label}</div>{children}</div>;
}

const input = { width: "100%", border: `1px solid ${LINE}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, color: INK, outline: "none", boxSizing: "border-box" };
const inputSm = { width: "100%", border: `1px solid ${LINE}`, borderRadius: 7, padding: "6px 8px", fontSize: 12.5, color: INK, outline: "none", boxSizing: "border-box" };
const selectS = { width: "100%", border: `1px solid ${LINE}`, borderRadius: 6, padding: "5px 6px", fontSize: 12, color: INK, background: "#fff", outline: "none" };

function btn(bg, fg) {
  return { background: bg, color: fg, border: "none", padding: "11px 18px", borderRadius: 9, fontWeight: 600, cursor: "pointer", fontSize: 14 };
}
