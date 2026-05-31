import { useState, useRef, useEffect } from "react";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://rukjeevvglztxaydhcyr.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1a2plZXZ2Z2x6dHhheWRoY3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTA1MDEsImV4cCI6MjA5NTYyNjUwMX0.crHJSqyToPRcGaH2yOYs1BshIS8Ns-7KPVOXdxvhDmM";
const ADMIN_PASS    = "TM@HR2026";  // ← change this

// ─── Brand ────────────────────────────────────────────────────────────────────
const TM = {
  red:     "#ED2831", redDk: "#C41E25",
  bg:      "#f5f5f5", white: "#ffffff",
  dark:    "#1a1a1a", gray:  "#6D6C71",
  border:  "#e0e0e0", borderDk: "#d0d0d0",
  textPri: "#1a1a1a", textSec: "#6D6C71", textMute: "#aaa",
  green:   "#16a34a", greenLt: "#dcfce7",
  surface: "#ffffff",
};

// ─── SDK ──────────────────────────────────────────────────────────────────────
const getSB = () => new Promise((res, rej) => {
  const KEY = '_sbTM';
  if (window[KEY]) { res(window[KEY]); return; }
  // Try unpkg as fallback if jsdelivr fails
  const tryLoad = (src) => new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = src; s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  });
  tryLoad("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js")
    .catch(() => tryLoad("https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js"))
    .then(() => { window[KEY] = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON); res(window[KEY]); })
    .catch(rej);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" }) : "—";
const daysLeft = d => d ? Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000)) : null;

// ─── useIsDesktop ─────────────────────────────────────────────────────────────
const useIsDesktop = () => {
  const [d, setD] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 860 : true);
  useEffect(() => {
    let t; const fn = () => { clearTimeout(t); t = setTimeout(() => setD(window.innerWidth >= 860), 150); };
    window.addEventListener("resize", fn); return () => { window.removeEventListener("resize", fn); clearTimeout(t); };
  }, []);
  return d;
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = () => {
  const done = useRef(false);
  if (!done.current && typeof document !== "undefined") {
    done.current = true;
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#f5f5f5;font-family:'Inter',sans-serif;color:#1a1a1a;}
      input,button,select,textarea{font-family:'Inter',sans-serif;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      .fu{animation:fadeUp 0.4s ease both;}
      @keyframes spin{to{transform:rotate(360deg)}}
      .spin{animation:spin 0.85s linear infinite;display:inline-block;}
      @keyframes pop{from{transform:scale(0.6);opacity:0}to{transform:scale(1);opacity:1}}
      .tm-input{width:100%;background:#fff;border:1.5px solid #e0e0e0;border-radius:8px;padding:12px 14px;font-size:14px;color:#1a1a1a;outline:none;transition:all 0.2s;}
      .tm-input:focus{border-color:#ED2831;box-shadow:0 0 0 3px rgba(237,40,49,0.1);}
      .tm-input::placeholder{color:#aaa;}
    `;
    document.head.appendChild(el);
  }
  return null;
};

// ─── TM Logo ──────────────────────────────────────────────────────────────────
const TMLogo = ({ h = 28 }) => (
  <svg height={h} viewBox="0 0 228 44" fill="none">
    <text x="0"  y="34" fontFamily="Georgia,serif" fontSize="30" fontWeight="700" fill="#3a3a3d">Tech</text>
    <text x="74" y="34" fontFamily="Georgia,serif" fontSize="30" fontWeight="800" fill="#ED2831">Mahindra</text>
    <rect x="0" y="38" width="228" height="2.5" rx="1.25" fill="#ED2831" opacity="0.25"/>
  </svg>
);

// ─── Button ───────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, loading, full, ghost, sm, disabled }) => (
  <button onClick={onClick} disabled={loading || disabled} style={{
    width: full ? "100%" : "auto",
    padding: sm ? "8px 16px" : "12px 24px",
    borderRadius: 8, fontSize: sm ? 13 : 14, fontWeight: 600,
    background: ghost ? "transparent" : disabled || loading ? "#f0f0f0" : TM.red,
    border: ghost ? `1.5px solid ${TM.border}` : "none",
    color: ghost ? TM.textSec : disabled || loading ? TM.textMute : "#fff",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    boxShadow: ghost || disabled || loading ? "none" : "0 2px 10px rgba(237,40,49,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.2s", touchAction: "manipulation",
  }}
    onMouseEnter={e => { if (!ghost && !disabled && !loading) { e.currentTarget.style.background = TM.redDk; e.currentTarget.style.transform = "translateY(-1px)"; }}}
    onMouseLeave={e => { if (!ghost && !disabled && !loading) { e.currentTarget.style.background = TM.red; e.currentTarget.style.transform = "translateY(0)"; }}}
  >
    {loading ? <><svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/></svg> Please wait…</> : children}
  </button>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, type = "text", placeholder, value, onChange, error }) => (
  <div>
    <label style={{ display:"block", fontSize:11, fontWeight:600, color:TM.textSec, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>{label}</label>
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="tm-input"/>
    {error && <p style={{ color:TM.red, fontSize:12, marginTop:5 }}>⚠ {error}</p>}
  </div>
);

// ─── Countdown Badge ──────────────────────────────────────────────────────────
const CountdownBadge = ({ joiningDate }) => {
  const days = daysLeft(joiningDate);
  if (days === null) return null;
  const color = days <= 7 ? "#dc2626" : days <= 14 ? "#d97706" : TM.green;
  const bg    = days <= 7 ? "#fef2f2" : days <= 14 ? "#fffbeb" : TM.greenLt;
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:bg, border:`1px solid ${color}33`, borderRadius:20, padding:"6px 14px" }}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:color }}/>
      <span style={{ fontSize:13, fontWeight:600, color }}>
        {days === 0 ? "Joining today!" : `${days} days to joining`}
      </span>
    </div>
  );
};

// ─── Offer Card ───────────────────────────────────────────────────────────────
const OfferCard = ({ offer, onDownload, downloading }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const shareWA = () => {
    const txt = `Hi, I received my offer letter from Tech Mahindra for the position of ${offer.job_title}. Joining date: ${fmtDate(offer.joining_date)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank");
  };

  return (
    <div style={{ background:TM.white, borderRadius:16, border:`1px solid ${TM.border}`, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
      {/* Red top bar */}
      <div style={{ background:TM.red, height:5 }}/>

      {/* Header */}
      <div style={{ padding:"24px 28px", borderBottom:`1px solid ${TM.border}` }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div>
            <p style={{ fontSize:12, color:TM.textSec, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Offer Letter</p>
            <h2 style={{ fontSize:22, fontWeight:700, color:TM.dark, marginBottom:6 }}>{offer.candidate_name}</h2>
            <p style={{ fontSize:14, color:TM.textSec }}>{offer.job_title}</p>
          </div>
          <CountdownBadge joiningDate={offer.joining_date}/>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding:"20px 28px", borderBottom:`1px solid ${TM.border}` }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 24px" }}>
          {[
            { label:"Email",         value:offer.candidate_email },
            { label:"Phone",         value:offer.candidate_phone },
            { label:"Joining Date",  value:fmtDate(offer.joining_date) },
            { label:"Offer Status",  value:offer.status === "pending" ? "⏳ Pending acceptance" : offer.status === "accepted" ? "✅ Accepted" : "❌ Declined", isStatus:true },
          ].map((f,i) => (
            <div key={i}>
              <p style={{ fontSize:11, fontWeight:600, color:TM.textMute, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{f.label}</p>
              <p style={{ fontSize:13, color:TM.textPri, fontWeight:500 }}>{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Download stats */}
      <div style={{ padding:"14px 28px", background:"#fafafa", borderBottom:`1px solid ${TM.border}`, display:"flex", alignItems:"center", gap:8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TM.textSec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span style={{ fontSize:12, color:TM.textSec }}>Downloaded <strong style={{ color:TM.dark }}>{offer.download_count}</strong> time{offer.download_count !== 1 ? "s" : ""}</span>
        <span style={{ color:TM.border, margin:"0 4px" }}>·</span>
        <span style={{ fontSize:12, color:TM.textSec }}>Uploaded {fmtDate(offer.uploaded_at)}</span>
      </div>

      {/* Actions */}
      <div style={{ padding:"20px 28px", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <Btn onClick={onDownload} loading={downloading}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Offer Letter
        </Btn>
        <Btn ghost sm onClick={copyLink}>
          {copied ? "✓ Copied!" : "📋 Copy link"}
        </Btn>
        <Btn ghost sm onClick={shareWA}>
          💬 Share on WhatsApp
        </Btn>
      </div>
    </div>
  );
};

// ─── Admin Panel ──────────────────────────────────────────────────────────────
const AdminPanel = ({ onBack }) => {
  const [pass, setPass]         = useState("");
  const [authed, setAuthed]     = useState(false);
  const [authErr, setAuthErr]   = useState("");
  const [form, setForm]         = useState({ name:"", email:"", phone:"", dob:"", jobTitle:"", joiningDate:"" });
  const [file, setFile]         = useState(null);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");
  const [offers, setOffers]     = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const fileRef = useRef();

  const login = () => {
    if (pass === ADMIN_PASS) { setAuthed(true); loadOffers(); }
    else setAuthErr("Incorrect password");
  };

  const loadOffers = async () => {
    setLoadingList(true);
    try {
      const db = await getSB();
      const { data } = await db.from("offer_letters").select("*").eq("company","Tech Mahindra").order("uploaded_at",{ascending:false});
      setOffers(data || []);
    } catch(e) { console.error(e); }
    setLoadingList(false);
  };

  const handleUpload = async () => {
    if (!form.name || !form.email || !form.phone || !form.dob || !form.jobTitle) { setMsg("⚠ Fill all required fields"); return; }
    if (!file) { setMsg("⚠ Please select a PDF file"); return; }
    setSaving(true); setMsg("");
    try {
      const db = await getSB();
      const path = `techmahindra/${form.email.replace(/[^a-z0-9]/gi,"_")}_${Date.now()}.pdf`;
      const { error: ue } = await db.storage.from("offer-letters").upload(path, file, { upsert:true });
      if (ue) throw ue;
      const { error: ie } = await db.from("offer_letters").upsert({
        candidate_name:  form.name,
        candidate_email: form.email.toLowerCase().trim(),
        candidate_phone: form.phone,
        candidate_dob:   form.dob,
        job_title:       form.jobTitle,
        joining_date:    form.joiningDate || null,
        company:         "Tech Mahindra",
        file_path:       path,
        file_name:       file.name,
        status:          "pending",
        download_count:  0,
        uploaded_at:     new Date().toISOString(),
      }, { onConflict:"candidate_email,company" });
      if (ie) throw ie;
      setMsg("✅ Offer letter uploaded successfully!");
      setForm({ name:"", email:"", phone:"", dob:"", jobTitle:"", joiningDate:"" });
      setFile(null);
      loadOffers();
    } catch(e) {
      console.error("[Upload Error]", e);
      let errMsg = e.message || "Unknown error";
      if (errMsg.includes("fetch")) errMsg = "Network error — check your internet connection and try again";
      if (errMsg.includes("bucket") || errMsg.includes("not found")) errMsg = "Storage bucket not found — please run the Supabase setup SQL first";
      if (errMsg.includes("policy") || errMsg.includes("violates")) errMsg = "Permission denied — please add RLS policies in Supabase";
      if (errMsg.includes("duplicate") || errMsg.includes("unique")) errMsg = "This candidate already has an offer letter. It has been updated.";
      setMsg("❌ " + errMsg);
    }
    setSaving(false);
  };

  if (!authed) return (
    <div style={{ minHeight:"100vh", background:TM.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <CSS/>
      <div style={{ background:TM.white, borderRadius:16, border:`1px solid ${TM.border}`, padding:36, width:"100%", maxWidth:380, boxShadow:"0 8px 32px rgba(0,0,0,0.1)" }}>
        <div style={{ height:4, background:TM.red, borderRadius:"4px 4px 0 0", margin:"-36px -36px 28px" }}/>
        <TMLogo h={26}/>
        <h2 style={{ fontSize:18, fontWeight:700, margin:"20px 0 6px" }}>HR Admin Access</h2>
        <p style={{ color:TM.textSec, fontSize:13, marginBottom:24 }}>Enter admin password to manage offer letters.</p>
        <input type="password" placeholder="Admin password" value={pass} onChange={e=>setPass(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()} className="tm-input" style={{ marginBottom:8 }}/>
        {authErr && <p style={{ color:TM.red, fontSize:12, marginBottom:8 }}>⚠ {authErr}</p>}
        <Btn full onClick={login}>Login to Admin</Btn>
        <button onClick={onBack} style={{ display:"block", margin:"14px auto 0", background:"none", border:"none", color:TM.textSec, cursor:"pointer", fontSize:13 }}>← Back to Candidate Portal</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:TM.bg, fontFamily:"'Inter',sans-serif" }}>
      <CSS/>
      {/* Header */}
      <header style={{ background:TM.white, borderBottom:`1px solid ${TM.border}`, padding:"0 clamp(16px,4vw,48px)", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <TMLogo h={24}/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:12, color:TM.textSec, background:"#fff3f3", border:`1px solid #ffc8c8`, borderRadius:6, padding:"3px 10px", fontWeight:600, color:TM.red }}>HR Admin</span>
          <button onClick={onBack} style={{ background:"none", border:`1px solid ${TM.border}`, borderRadius:6, padding:"6px 12px", fontSize:12, color:TM.textSec, cursor:"pointer" }}>← Exit Admin</button>
        </div>
      </header>

      <main style={{ maxWidth:900, margin:"0 auto", padding:"32px clamp(16px,4vw,48px) 80px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>

          {/* Upload form */}
          <div style={{ background:TM.white, borderRadius:14, border:`1px solid ${TM.border}`, overflow:"hidden" }}>
            <div style={{ padding:"18px 22px", borderBottom:`1px solid ${TM.border}`, background:"#fff8f8" }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:TM.dark }}>Upload New Offer Letter</h3>
              <p style={{ fontSize:12, color:TM.textSec, marginTop:3 }}>Fill candidate details and attach PDF</p>
            </div>
            <div style={{ padding:22, display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { label:"Full Name *",      key:"name",        type:"text",  ph:"Candidate full name" },
                { label:"Email Address *",  key:"email",       type:"email", ph:"candidate@gmail.com" },
                { label:"Phone Number *",   key:"phone",       type:"tel",   ph:"10-digit mobile" },
                { label:"Date of Birth *",  key:"dob",         type:"date",  ph:"" },
                { label:"Job Title *",      key:"jobTitle",    type:"text",  ph:"e.g. Senior Analyst" },
                { label:"Joining Date",     key:"joiningDate", type:"date",  ph:"" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11, fontWeight:600, color:TM.textSec, letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} className="tm-input"/>
                </div>
              ))}

              {/* File upload */}
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:TM.textSec, letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:5 }}>Offer Letter PDF *</label>
                <div style={{ border:`2px dashed ${file ? TM.green : TM.border}`, borderRadius:8, padding:"16px", textAlign:"center", background:file?"#f0fdf4":"#fafafa", cursor:"pointer", transition:"all 0.2s" }}
                  onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e => setFile(e.target.files?.[0] || null)}/>
                  {file ? (
                    <div>
                      <p style={{ fontSize:13, color:TM.green, fontWeight:600 }}>✓ {file.name}</p>
                      <p style={{ fontSize:11, color:TM.textMute, marginTop:3 }}>{(file.size/1024/1024).toFixed(1)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize:13, color:TM.textSec }}>Click to select PDF</p>
                      <p style={{ fontSize:11, color:TM.textMute, marginTop:3 }}>Max 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {msg && <p style={{ fontSize:13, color:msg.startsWith("✅")?TM.green:TM.red, padding:"10px 14px", background:msg.startsWith("✅")?"#f0fdf4":"#fff5f5", borderRadius:6, border:`1px solid ${msg.startsWith("✅")?"#bbf7d0":"#fecaca"}` }}>{msg}</p>}
              <Btn full onClick={handleUpload} loading={saving}>Upload Offer Letter</Btn>
            </div>
          </div>

          {/* Existing offers list */}
          <div style={{ background:TM.white, borderRadius:14, border:`1px solid ${TM.border}`, overflow:"hidden" }}>
            <div style={{ padding:"18px 22px", borderBottom:`1px solid ${TM.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h3 style={{ fontSize:15, fontWeight:700, color:TM.dark }}>All Offer Letters</h3>
                <p style={{ fontSize:12, color:TM.textSec, marginTop:3 }}>{offers.length} records</p>
              </div>
              <button onClick={loadOffers} style={{ background:"none", border:`1px solid ${TM.border}`, borderRadius:6, padding:"6px 12px", fontSize:12, cursor:"pointer", color:TM.textSec }}>↻ Refresh</button>
            </div>
            <div style={{ maxHeight:480, overflowY:"auto" }}>
              {loadingList ? (
                <div style={{ padding:40, textAlign:"center", color:TM.textMute }}>Loading…</div>
              ) : offers.length === 0 ? (
                <div style={{ padding:40, textAlign:"center", color:TM.textMute }}>No offer letters yet</div>
              ) : offers.map((o,i) => (
                <div key={o.id} style={{ padding:"14px 22px", borderBottom:`1px solid ${TM.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:TM.dark, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.candidate_name}</p>
                    <p style={{ fontSize:11, color:TM.textSec, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.candidate_email}</p>
                    <p style={{ fontSize:11, color:TM.textMute, marginTop:1 }}>{o.job_title}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:4, background:o.status==="accepted"?"#dcfce7":"#fff3f3", color:o.status==="accepted"?TM.green:TM.red }}>
                      {o.status}
                    </span>
                    <p style={{ fontSize:11, color:TM.textMute, marginTop:4 }}>↓ {o.download_count}×</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function TMOfferPortal() {
  const isDesktop = useIsDesktop();
  const [screen, setScreen]   = useState(() => { if(typeof window !== "undefined" && window.location.search.includes("hr_access=true")) return "admin"; return "login"; });
  const [form, setForm]       = useState({ email:"", dob:"", phone:"" });
  const [errs, setErrs]       = useState({});
  const [loading, setLoading] = useState(false);
  const [offer, setOffer]     = useState(null);
  const [loginErr, setLoginErr] = useState("");
  const [downloading, setDl]  = useState(false);

  const setF = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = async () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.dob)   e.dob   = "Date of birth required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit mobile required";
    setErrs(e);
    if (Object.keys(e).length) return;
    setLoading(true); setLoginErr("");
    try {
      const db = await getSB();
      const { data, error } = await db.from("offer_letters")
        .select("*")
        .eq("candidate_email", form.email.toLowerCase().trim())
        .eq("candidate_dob",   form.dob)
        .eq("candidate_phone", form.phone)
        .eq("company",         "Tech Mahindra")
        .single();
      if (error || !data) { setLoginErr("No offer letter found. Please check your details or contact HR."); }
      else { setOffer(data); setScreen("offer"); }
    } catch(err) { setLoginErr("Connection error. Please try again."); }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!offer?.file_path) return;
    setDl(true);
    try {
      const db = await getSB();
      const { data } = await db.storage.from("offer-letters").createSignedUrl(offer.file_path, 60);
      if (data?.signedUrl) {
        const a = document.createElement("a");
        a.href = data.signedUrl;
        a.download = offer.file_name || "offer-letter.pdf";
        a.click();
        await db.from("offer_letters").update({ download_count: (offer.download_count || 0) + 1 }).eq("id", offer.id);
        setOffer(p => ({ ...p, download_count: (p.download_count || 0) + 1 }));
      }
    } catch(e) { alert("Download failed. Please try again."); }
    setDl(false);
  };

  if (screen === "admin") return <AdminPanel onBack={() => setScreen("login")}/>;

  return (
    <div style={{ minHeight:"100vh", background:TM.bg, fontFamily:"'Inter',sans-serif", color:TM.textPri }}>
      <CSS/>

      {/* Header */}
      <header style={{ background:TM.white, borderBottom:`1px solid ${TM.border}`, padding:"0 clamp(16px,4vw,40px)", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <TMLogo h={isDesktop?26:22}/>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {screen === "offer" && (
            <button onClick={() => { setScreen("login"); setOffer(null); setForm({ email:"", dob:"", phone:"" }); }}
              style={{ background:"none", border:`1px solid ${TM.border}`, borderRadius:6, padding:"6px 12px", fontSize:12, color:TM.textSec, cursor:"pointer" }}>
              Sign Out
            </button>
          )}
          <button onClick={() => setScreen("admin")} style={{ background:"none", border:"none", fontSize:11, color:TM.textMute, cursor:"pointer" }}>
            HR Admin
          </button>
        </div>
      </header>

      <main style={{ maxWidth: screen==="offer"?640:420, margin:"0 auto", padding:"clamp(28px,5vw,56px) clamp(16px,4vw,40px) 80px" }}>

        {/* ── LOGIN ── */}
        {screen === "login" && (
          <div className="fu">
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ width:60, height:60, borderRadius:14, background:"#fff3f3", border:`1px solid #ffc8c8`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 16px" }}>📄</div>
              <h1 style={{ fontSize:24, fontWeight:700, marginBottom:6 }}>Offer Letter Portal</h1>
              <p style={{ color:TM.textSec, fontSize:14, lineHeight:1.6 }}>Access your Tech Mahindra offer letter securely.</p>
            </div>

            <div style={{ background:TM.white, borderRadius:14, border:`1px solid ${TM.border}`, padding:28, boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <Field label="Registered Email *" type="email" placeholder="your@gmail.com" value={form.email} onChange={setF("email")} error={errs.email}/>
                <Field label="Date of Birth *" type="date" placeholder="" value={form.dob} onChange={setF("dob")} error={errs.dob}/>
                <Field label="Mobile Number *" type="tel" placeholder="10-digit number" value={form.phone} onChange={setF("phone")} error={errs.phone}/>
              </div>

              {loginErr && (
                <div style={{ marginTop:16, padding:"12px 14px", background:"#fff5f5", border:`1px solid #fecaca`, borderRadius:8, fontSize:13, color:"#dc2626" }}>
                  ⚠ {loginErr}
                </div>
              )}

              <div style={{ marginTop:20 }}>
                <Btn full onClick={handleLogin} loading={loading}>Access My Offer Letter →</Btn>
              </div>
            </div>

            <p style={{ textAlign:"center", fontSize:12, color:TM.textMute, marginTop:16, lineHeight:1.6 }}>
              🔒 Your details are verified securely. Only you can access your offer letter.
            </p>
          </div>
        )}

        {/* ── OFFER VIEW ── */}
        {screen === "offer" && offer && (
          <div className="fu">
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:12, color:TM.textSec, marginBottom:4 }}>Welcome back,</p>
              <h1 style={{ fontSize:22, fontWeight:700 }}>{offer.candidate_name} 👋</h1>
            </div>
            <OfferCard offer={offer} onDownload={handleDownload} downloading={downloading}/>
            <p style={{ textAlign:"center", fontSize:11, color:TM.textMute, marginTop:16, lineHeight:1.7 }}>
              For any queries contact hr.onboarding@techmahindra.com
            </p>
          </div>
        )}

      </main>

      <footer style={{ borderTop:`1px solid ${TM.border}`, padding:"16px 24px", textAlign:"center", fontSize:11, color:TM.textMute, background:TM.white }}>
        © {new Date().getFullYear()} Tech Mahindra Limited · Confidential · All rights reserved
      </footer>
    </div>
  );
}
