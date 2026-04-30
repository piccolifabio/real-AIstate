import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --muted: #6b6b6b; --surface: #141414; --border: rgba(247,245,240,0.08);
    --warm: #1e1e1e; --gold: #c9a84c;
  }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  /* NAV */
  .en-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); gap: 2rem; }
  .en-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; flex-shrink: 0; }
  .en-nav-logo span { color: var(--red); }
  .en-nav-spacer { flex: 1; }
  .en-nav-lang { display: flex; align-items: center; gap: 0.5rem; }
  .en-nav-lang a { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 0.3rem 0.7rem; border-radius: 2px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .en-nav-lang a.active { background: var(--red); color: white; }
  .en-nav-lang a.inactive { color: var(--muted); border: 1px solid var(--border); }
  .en-nav-lang a.inactive:hover { color: var(--white); border-color: rgba(247,245,240,0.2); }
  .en-nav-cta { background: var(--red) !important; color: white !important; padding: 0.55rem 1.4rem !important; border-radius: 2px; font-size: 0.75rem !important; font-weight: 600; letter-spacing: 0.1em !important; }
  .en-nav-cta:hover { background: var(--red-dark) !important; }
  @media (max-width: 768px) { .en-nav { padding: 1rem 1.5rem; } }

  /* HERO */
  .en-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 8rem 3rem 5rem; max-width: 900px; margin: 0 auto; }
  .en-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .en-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .en-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3.5rem, 8vw, 7.5rem); line-height: 0.92; color: var(--white); margin-bottom: 1.5rem; }
  .en-h1 span { color: var(--red); }
  .en-sub { font-size: 1.1rem; font-weight: 300; line-height: 1.75; color: rgba(247,245,240,0.5); max-width: 600px; margin-bottom: 3rem; }
  .en-sub strong { color: var(--white); font-weight: 500; }
  .en-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-red-en { background: var(--red); color: white; padding: 1rem 2.2rem; border-radius: 2px; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: background 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-red-en:hover { background: var(--red-dark); }

  /* HOW IT WORKS */
  .en-how { padding: 6rem 3rem; max-width: 1100px; margin: 0 auto; }
  .en-section-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .en-section-label::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .en-section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 0.95; color: var(--white); margin-bottom: 3rem; }
  .en-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .en-step { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 2rem; position: relative; overflow: hidden; }
  .en-step::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--red); }
  .en-step-num { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: rgba(247,245,240,0.05); line-height: 1; margin-bottom: 0.5rem; }
  .en-step-title { font-size: 1rem; font-weight: 600; color: var(--white); margin-bottom: 0.7rem; }
  .en-step-text { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }

  /* PILLARS */
  .en-pillars { padding: 0 3rem 6rem; max-width: 1100px; margin: 0 auto; }
  .en-pillars-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .en-pillar { display: flex; gap: 1.2rem; background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 1.5rem; }
  .en-pillar-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 0.1rem; }
  .en-pillar-title { font-size: 0.95rem; font-weight: 600; color: var(--white); margin-bottom: 0.4rem; }
  .en-pillar-text { font-size: 0.83rem; color: var(--muted); line-height: 1.6; }

  /* EARLY ACCESS */
  .en-early { background: var(--warm); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 6rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .en-early::before { content: 'EARLY'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Bebas Neue', sans-serif; font-size: 20rem; color: rgba(247,245,240,0.02); line-height: 1; pointer-events: none; white-space: nowrap; }
  .en-early-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
  .en-early-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(217,48,37,0.1); border: 1px solid rgba(217,48,37,0.3); color: var(--red); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.4rem 1rem; border-radius: 2px; margin-bottom: 1.5rem; }
  .en-early-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 0.95; color: var(--white); margin-bottom: 1rem; }
  .en-early-sub { font-size: 1rem; font-weight: 300; color: rgba(247,245,240,0.45); line-height: 1.7; margin-bottom: 2.5rem; }
  .en-form { display: flex; gap: 0; max-width: 460px; margin: 0 auto 1rem; }
  .en-input { flex: 1; background: rgba(247,245,240,0.04); border: 1px solid rgba(247,245,240,0.12); border-right: none; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; padding: 0.9rem 1.2rem; border-radius: 2px 0 0 2px; outline: none; transition: border-color 0.2s; }
  .en-input:focus { border-color: var(--red); }
  .en-input::placeholder { color: rgba(247,245,240,0.2); }
  .en-btn { background: var(--red); border: none; color: white; padding: 0.9rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; border-radius: 0 2px 2px 0; letter-spacing: 0.08em; text-transform: uppercase; transition: background 0.2s; white-space: nowrap; }
  .en-btn:hover { background: var(--red-dark); }
  .en-success { font-size: 0.85rem; color: #4ade80; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }
  .en-form-note { font-size: 0.72rem; color: var(--muted); }

  /* SELL CTA */
  .en-sell { padding: 5rem 3rem; max-width: 900px; margin: 0 auto; }
  .en-sell-box { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; padding: 3rem; display: flex; align-items: center; justify-content: space-between; gap: 3rem; }
  .en-sell-left h3 { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); margin-bottom: 0.6rem; }
  .en-sell-left p { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }
  .en-sell-btn { background: transparent; border: 1px solid rgba(247,245,240,0.2); color: var(--white); padding: 0.9rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; border-radius: 2px; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.2s; white-space: nowrap; text-decoration: none; display: inline-block; }
  .en-sell-btn:hover { background: rgba(247,245,240,0.06); border-color: rgba(247,245,240,0.4); }

  /* FOOTER */
  .en-footer { padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); font-size: 0.75rem; color: rgba(247,245,240,0.2); gap: 1.5rem; flex-wrap: wrap; }
  .en-footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .en-footer-logo span { color: var(--red); }
  .en-footer-links { display: flex; gap: 2rem; align-items: center; flex: 1; justify-content: center; flex-wrap: wrap; }
  .en-footer-links a { color: rgba(247,245,240,0.2); text-decoration: none; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
  .en-footer-links a:hover { color: rgba(247,245,240,0.6); }

  @media (max-width: 768px) {
    .en-hero { padding: 7rem 1.5rem 4rem; }
    .en-how, .en-pillars, .en-sell { padding-left: 1.5rem; padding-right: 1.5rem; }
    .en-steps { grid-template-columns: 1fr; }
    .en-pillars-grid { grid-template-columns: 1fr; }
    .en-form { flex-direction: column; }
    .en-input { border-right: 1px solid rgba(247,245,240,0.12); border-radius: 2px; border-bottom: none; }
    .en-btn { border-radius: 2px; }
    .en-sell-box { flex-direction: column; gap: 1.5rem; }
    .en-early { padding: 4rem 1.5rem; }
  }
`;

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

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="en-nav">
        <a href="/en" className="en-nav-logo">Real<span>AI</span>state</a>
        <div className="en-nav-spacer" />
        <div className="en-nav-lang">
          <a href="/" className="inactive" title="Italiano">🇮🇹</a>
          <a href="/en" className="active" title="English">🇬🇧</a>
        </div>
        <a href="#early" className="btn-red-en" style={{ fontSize: "0.75rem", padding: "0.55rem 1.2rem" }}>Get early access</a>
      </nav>

      {/* HERO */}
      <div className="en-hero">
        <div className="en-eyebrow">AI-powered real estate</div>
        <h1 className="en-h1">Buying property<br />in Italy. Or elsewhere,<br />for that matter.<br /><span>Finally simple.</span></h1>
        <p className="en-sub">
          RealAIstate removes the middlemen from real estate transactions. <strong>AI handles valuation, documentation, and communication</strong> — so you pay for the property, not for the process.
        </p>
        <div className="en-hero-actions">
          <a href="#early" className="btn-red-en">Get early access →</a>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="en-how">
        <div className="en-section-label">How it works</div>
        <h2 className="en-section-title">Three steps.<br />No agency.</h2>
        <div className="en-steps">
          {[
            { n:"01", t:"Find your property", d:"Browse verified listings with a Fair Price Score — an AI-powered valuation based on official Italian government data (OMI). You'll know immediately if the asking price is fair." },
            { n:"02", t:"Connect directly", d:"Our AI mediates the conversation between buyer and seller — in your language. Ask questions, request documents, arrange viewings. No agent in between." },
            { n:"03", t:"Close with confidence", d:"We coordinate the notary, surveyor, and energy certification. Fixed fee, no percentage. Everything transparent before you sign anything." },
          ].map((s, i) => (
            <div key={i} className="en-step">
              <div className="en-step-num">{s.n}</div>
              <div className="en-step-title">{s.t}</div>
              <p className="en-step-text">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <div className="en-pillars">
        <div className="en-pillars-grid">
          {[
            { icon:"◎", t:"Fair Price Score", d:"Every listing comes with an AI valuation based on official Italian Revenue Agency data — updated every 6 months. Not an opinion. A number you can verify." },
            { icon:"⚡", t:"AI in your language", d:"Our AI communicates in real time between parties speaking different languages. Ask in English, get answers in English — even if the seller only speaks Italian." },
            { icon:"✓", t:"Fixed fee. No surprises.", d:"A flat fee instead of a percentage of the sale price. You know the cost before you start — and it's a fraction of what traditional agencies charge." },
            { icon:"→", t:"Verified professionals", d:"Notaries, surveyors, and energy assessors — all certified, all connected in the platform. No cold calls, no unknowns." },
          ].map((p, i) => (
            <div key={i} className="en-pillar">
              <div className="en-pillar-icon">{p.icon}</div>
              <div>
                <div className="en-pillar-title">{p.t}</div>
                <p className="en-pillar-text">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EARLY ACCESS */}
      <div className="en-early" id="early">
        <div className="en-early-inner">
          <div className="en-early-badge">⊙ Early Access</div>
          <h2 className="en-early-title">We're building this.<br />Join us early.</h2>
          <p className="en-early-sub">
            RealAIstate is currently in beta with a growing number of verified Italian properties. Leave your email and we'll reach out when we have something that matches your search — or when you're ready to start.
          </p>
          {!sent ? (
            <>
              <div className="en-form">
                <input
                  className="en-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button className="en-btn" onClick={handleSubmit} disabled={loading || !email.trim()}>
                  Join →
                </button>
              </div>
              <p className="en-form-note">No spam. We'll only contact you when it matters.</p>
            </>
          ) : (
            <div className="en-success">✓ You're on the list — we'll be in touch.</div>
          )}
        </div>
      </div>

      {/* SELL CTA */}
      <div className="en-sell">
        <div className="en-sell-box">
          <div className="en-sell-left">
            <h3>Do you own property in Italy?</h3>
            <p>If you need to sell your property in Italy, do reach out — we'd love to help you do it without an agency, transparently, and at a fair price.</p>
          </div>
          <a href="mailto:info@realaistate.ai?subject=I want to sell my property in Italy" className="en-sell-btn">
            Get in touch →
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="en-footer">
        <div className="en-footer-logo">Real<span>AI</span>state</div>
        <div className="en-footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/termini">Terms</a>
          <a href="mailto:info@realaistate.ai">Contact</a>
          <a href="https://www.instagram.com/realaistate.ai" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div>© 2025 RealAIstate</div>
      </footer>
    </>
  );
}
