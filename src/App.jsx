import React, { useState } from "react";
import {
  Search, MapPin, Star, Shield, Clock, Check, Plane,
  Building2, ChevronRight, Hotel, Languages, HeartPulse,
  Stethoscope, Award, Image as ImageIcon,
  Settings, Plus, Trash2, X, Eye, Type, Move, Palette,
} from "lucide-react";

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

/* ============================== ROOT ============================== */
export default function App() {
  const [content, setContent] = useState(initialContent);
  const [showEditor, setShowEditor] = useState(true);
  const [activeDeptId, setActiveDeptId] = useState(initialContent.departments[0].id);

  const activeDepts = content.departments.filter((d) => d.active);
  const safeDeptId = activeDepts.find((d) => d.id === activeDeptId) ? activeDeptId : activeDepts[0]?.id;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f4f6f7", minHeight: "100vh", display: "flex" }}>
      <div style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
        <Nav content={content} onToggleEditor={() => setShowEditor((s) => !s)} editorOpen={showEditor} />
        <InsurerBanner insurer={content.brand.insurer} />
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px 60px" }}>
          <Hero hero={content.hero} />
          <DeptChips depts={activeDepts} activeId={safeDeptId} onPick={setActiveDeptId} />
          <Results dept={activeDepts.find((d) => d.id === safeDeptId)} />
          <TotalCare />
        </div>
      </div>

      {showEditor && (
        <AdminEditor
          content={content}
          setContent={setContent}
          activeDeptId={safeDeptId}
          setActiveDeptId={setActiveDeptId}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}

/* ------------------------------ Nav ------------------------------ */
function Nav({ content, onToggleEditor, editorOpen }) {
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 20, color: TEAL }}>
          <Plane size={20} /> {content.brand.name}
        </div>
        <button onClick={onToggleEditor} style={{ ...btn(editorOpen ? TEAL : "#fff", editorOpen ? "#fff" : SUB), border: editorOpen ? "none" : `1px solid ${LINE}`, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Settings size={15} /> {editorOpen ? "Admin: on" : "Admin"}
        </button>
      </div>
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
function OverlayImage({ image, height, radius = 16 }) {
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
          color: o.color, fontSize: o.size, fontWeight: o.weight,
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
function Hero({ hero }) {
  return (
    <div style={{ marginTop: 20 }}>
      <OverlayImage image={hero.image} height={300} />
      <div style={{ background: "#fff", padding: 8, borderRadius: 14, boxShadow: "0 6px 24px rgba(11,107,107,.12)", maxWidth: 720, marginTop: -28, marginLeft: 20, position: "relative" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#f6f8f9", borderRadius: 9, flex: 1, minWidth: 180, height: 50, color: MUTE }}>
            <Search size={18} />
            <input placeholder="Treatment, condition, or hospital" style={{ border: "none", background: "transparent", outline: "none", fontSize: 15, width: "100%", color: INK }} />
          </div>
          <button style={{ ...btn(TEAL, "#fff"), padding: "0 28px", fontSize: 15 }}>Find programs</button>
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
function Results({ dept }) {
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
              <button style={{ ...btn(TEAL, "#fff"), marginTop: 10, fontSize: 13, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", width: "100%" }}>
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
  const steps = [
    { icon: <Stethoscope size={20} />, t: "Care plan & match", d: "We match a covered program to your records." },
    { icon: <Plane size={20} />, t: "Travel arranged", d: "Flights, visa, pickup for you and a companion." },
    { icon: <Languages size={20} />, t: "In-Korea support", d: "Dedicated English interpreter and coordinator." },
    { icon: <Hotel size={20} />, t: "Recovery stay", d: "Hospital-adjacent accommodation booked." },
    { icon: <HeartPulse size={20} />, t: "US aftercare", d: "Follow-up coordinated with your home doctor." },
  ];
  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: INK, margin: "0 0 4px" }}>One team, the whole journey</h2>
      <p style={{ fontSize: 14, color: SUB, margin: "0 0 20px" }}>You never coordinate a single vendor yourself.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }} className="steps-grid">
        {steps.map((s, i) => (
          <div key={i} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12, padding: 18, position: "relative" }}>
            <div style={{ position: "absolute", top: 14, right: 14, fontSize: 12, fontWeight: 800, color: "#cfd8dd" }}>0{i + 1}</div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: TEAL_SOFT, color: TEAL, display: "grid", placeItems: "center", marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontWeight: 700, color: INK, fontSize: 14, marginBottom: 4 }}>{s.t}</div>
            <div style={{ fontSize: 12.5, color: SUB, lineHeight: 1.45 }}>{s.d}</div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:880px){.steps-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  );
}

/* =========================================================================
   ADMIN EDITOR
   ========================================================================= */
function AdminEditor({ content, setContent, activeDeptId, setActiveDeptId, onClose }) {
  const [tab, setTab] = useState("hero");

  const update = (fn) => setContent((prev) => {
    const next = structuredClone(prev);
    fn(next);
    return next;
  });

  const activeDept = content.departments.find((d) => d.id === activeDeptId) || content.departments.find((d) => d.active);

  return (
    <div style={{ width: 380, flexShrink: 0, background: "#fff", borderLeft: `1px solid ${LINE}`, height: "100vh", position: "sticky", top: 0, overflowY: "auto" }}>
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
