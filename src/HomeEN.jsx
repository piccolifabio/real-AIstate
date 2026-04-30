import { useState, useEffect } from "react";

const BK = "#0a0a0a";
const WH = "#f7f5f0";
const RD = "#d93025";
const RD2 = "#b02020";
const MU = "#6b6b6b";
const WM = "#1e1e1e";
const BR = "rgba(247,245,240,0.08)";

export default function HomeEN() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async () => {
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "en-landing" }),
      });
    } catch {}
    setSent(true);
    setLoading(false);
  };

  const p = (s) => ({ fontFamily: "'DM Sans', sans-serif", ...s });
  const bebas = (s) => ({ fontFamily: "'Bebas Neue', sans-serif", ...s });

  return (
    <div style={{ background: BK, minHeight: "100vh", color: WH, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", padding: "1.2rem 3rem", borderBottom: `1px solid ${BR}`, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(16px)", gap: "2rem" }}>
        <a href="/en" style={bebas({ fontSize: "1.6rem", letterSpacing: "0.05em", color: WH, textDecoration: "none" })}>
          Real<span style={{ color: RD }}>AI</span>state
        </a>
        <div style={{ flex: 1 }} />
        <a href="#early" style={p({ background: RD, color: WH, padding: "0.55rem 1.2rem", borderRadius: "2px", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" })}>
          Get early access
        </a>
        <a href="/" title="Italiano" style={{ display:"inline-flex", alignItems:"center", padding:"0.3rem 0.5rem", border:"1px solid rgba(247,245,240,0.1)", borderRadius:"2px", textDecoration:"none" }} dangerouslySetInnerHTML={{ __html: `<svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="14" fill="#CE2B37"/><rect width="13.33" height="14" fill="#fff"/><rect width="6.67" height="14" fill="#009246"/></svg>` }} />
      </nav>

      {/* HERO */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 3rem 5rem", maxWidth: "900px", margin: "0 auto", alignItems: "flex-start" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: RD, marginBottom: "1.5rem" }}>
          AI-powered real estate
        </div>
        <h1 style={bebas({ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 0.95, color: WH, marginBottom: "1.5rem" })}>
          Buying or selling<br />
          property.<br />
          <span style={{ color: RD }}>Finally simple.</span>
        </h1>
        <p style={{ fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.75, color: "rgba(247,245,240,0.5)", maxWidth: "600px", marginBottom: "3rem" }}>
          RealAIstate removes the middlemen from real estate transactions.{" "}
          <strong style={{ color: WH, fontWeight: 500 }}>AI handles valuation, documentation, and communication</strong>
          {" "}— so you pay for the property, not for the process.
        </p>
        <a href="#early" style={p({ background: RD, color: WH, padding: "1rem 2.2rem", borderRadius: "2px", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", width: "fit-content" })}>
          Get early access →
        </a>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: "6rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: RD, marginBottom: "1.5rem" }}>How it works</div>
        <h2 style={bebas({ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 0.95, color: WH, marginBottom: "3rem" })}>Three steps.<br />No agency.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            { n:"01", t:"Find your property", d:"Browse verified listings with a Fair Price Score — an AI-powered valuation based on official Italian government data (OMI). You'll know immediately if the asking price is fair." },
            { n:"02", t:"Connect directly", d:"Our AI mediates the conversation between buyer and seller — in your language. Ask questions, request documents, arrange viewings. No agent in between." },
            { n:"03", t:"Close with confidence", d:"We coordinate the notary, surveyor, and energy certification. Fixed fee, no percentage. Everything transparent before you sign anything." },
          ].map((s, i) => (
            <div key={i} style={{ background: WM, border: `1px solid ${BR}`, borderRadius: "3px", padding: "2rem", borderTop: `3px solid ${RD}` }}>
              <div style={bebas({ fontSize: "3rem", color: "rgba(247,245,240,0.05)", lineHeight: 1, marginBottom: "0.5rem" })}>{s.n}</div>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: WH, marginBottom: "0.7rem" }}>{s.t}</div>
              <p style={{ fontSize: "0.88rem", color: MU, lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <div style={{ padding: "0 3rem 6rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
          {[
            { icon:"◎", t:"Fair Price Score", d:"Every listing comes with an AI valuation based on official Italian Revenue Agency data — updated every 6 months. Not an opinion. A number you can verify." },
            { icon:"⚡", t:"AI in your language", d:"Our AI communicates in real time between parties speaking different languages. Ask in English, get answers in English — even if the seller only speaks Italian." },
            { icon:"✓", t:"Fixed fee. No surprises.", d:"A flat fee instead of a percentage of the sale price. You know the cost before you start — and it's a fraction of what traditional agencies charge." },
            { icon:"→", t:"Verified professionals", d:"Notaries, surveyors, and energy assessors — all certified, all connected in the platform. No cold calls, no unknowns." },
          ].map((p2, i) => (
            <div key={i} style={{ display: "flex", gap: "1.2rem", background: WM, border: `1px solid ${BR}`, borderRadius: "3px", padding: "1.5rem" }}>
              <div style={{ fontSize: "1.3rem", flexShrink: 0, marginTop: "0.1rem" }}>{p2.icon}</div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: WH, marginBottom: "0.4rem" }}>{p2.t}</div>
                <p style={{ fontSize: "0.83rem", color: MU, lineHeight: 1.6 }}>{p2.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EARLY ACCESS */}
      <div id="early" style={{ background: WM, borderTop: `1px solid ${BR}`, borderBottom: `1px solid ${BR}`, padding: "6rem 3rem", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(217,48,37,0.1)", border: "1px solid rgba(217,48,37,0.3)", color: RD, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "2px", marginBottom: "1.5rem" }}>
            ⊙ Early Access
          </div>
          <h2 style={bebas({ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 0.95, color: WH, marginBottom: "1rem" })}>
            We're building this.<br />Join us early.
          </h2>
          <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(247,245,240,0.45)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            RealAIstate is currently in beta with a growing number of verified properties. Leave your email and we'll reach out when we have something that matches your search — or when you're ready to start.
          </p>
          {!sent ? (
            <>
              <div style={{ display: "flex", maxWidth: "460px", margin: "0 auto 1rem" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{ flex: 1, background: "rgba(247,245,240,0.04)", border: "1px solid rgba(247,245,240,0.12)", borderRight: "none", color: WH, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", padding: "0.9rem 1.2rem", borderRadius: "2px 0 0 2px", outline: "none" }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading || !email.trim()}
                  style={{ background: RD, border: "none", color: WH, padding: "0.9rem 1.8rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", borderRadius: "0 2px 2px 0", letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  Join →
                </button>
              </div>
              <p style={{ fontSize: "0.72rem", color: MU }}>No spam. We'll only contact you when it matters.</p>
            </>
          ) : (
            <div style={{ fontSize: "0.85rem", color: "#4ade80" }}>✓ You're on the list — we'll be in touch.</div>
          )}
        </div>
      </div>

      {/* SELL CTA */}
      <div style={{ padding: "5rem 3rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ background: "#141414", border: `1px solid ${BR}`, borderRadius: "3px", padding: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "3rem", flexWrap: "wrap" }}>
          <div>
            <h3 style={bebas({ fontSize: "2rem", color: WH, marginBottom: "0.6rem" })}>Do you own property in Italy?</h3>
            <p style={{ fontSize: "0.9rem", color: MU, lineHeight: 1.6 }}>If you need to sell your property in Italy, do reach out — we'd love to help you do it without an agency, transparently, and at a fair price.</p>
          </div>
          <a href="mailto:info@realaistate.ai?subject=I want to sell my property in Italy" style={p({ background: "transparent", border: "1px solid rgba(247,245,240,0.2)", color: WH, padding: "0.9rem 1.8rem", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", borderRadius: "2px", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", whiteSpace: "nowrap" })}>
            Get in touch →
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "2rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${BR}`, fontSize: "0.75rem", color: "rgba(247,245,240,0.2)", gap: "1.5rem", flexWrap: "wrap" }}>
        <div style={bebas({ fontSize: "1.2rem", color: "rgba(247,245,240,0.4)" })}>
          Real<span style={{ color: RD }}>AI</span>state
        </div>
        <div style={{ display: "flex", gap: "2rem", flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Terms", "/termini"], ["Contact", "mailto:info@realaistate.ai"], ["Instagram", "https://www.instagram.com/realaistate.ai"]].map(([label, href]) => (
            <a key={label} href={href} style={{ color: "rgba(247,245,240,0.2)", textDecoration: "none" }}>{label}</a>
          ))}
        </div>
        <div>© 2025 RealAIstate</div>
      </footer>

    </div>
  );
}
