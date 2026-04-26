import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --muted: #6b6b6b; --surface: #141414; --border: rgba(247,245,240,0.08);
    --warm: #1e1e1e;
  }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  .aff-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); }
  .aff-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .aff-nav-logo span { color: var(--red); }
  .aff-nav-back { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .aff-nav-back:hover { color: var(--white); }

  .aff-page { min-height: 100vh; display: flex; flex-direction: column; }

  .aff-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 5.5rem 3rem 2.5rem; max-width: 900px; margin: 0 auto; width: 100%; }

  .aff-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .aff-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }

  .aff-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; color: var(--white); margin-bottom: 1rem; }
  .aff-h1 span { color: var(--red); }

  .aff-desc { font-size: 1rem; color: rgba(247,245,240,0.45); line-height: 1.7; max-width: 620px; margin-bottom: 3rem; }
  .aff-desc strong { color: var(--white); font-weight: 600; }

  .aff-pillole { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3.5rem; }
  .aff-pillola { display: flex; align-items: center; gap: 0.6rem; background: rgba(247,245,240,0.04); border: 1px solid var(--border); border-radius: 2px; padding: 0.7rem 1.1rem; }
  .aff-pillola-icon { font-size: 1rem; }
  .aff-pillola span { font-size: 0.78rem; font-weight: 600; color: rgba(247,245,240,0.6); letter-spacing: 0.04em; }

  .aff-costo { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 2rem 2.5rem; max-width: 560px; margin-bottom: 3.5rem; position: relative; overflow: hidden; }
  .aff-costo::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--red); }
  .aff-costo-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .aff-costo-text { font-size: 0.95rem; color: rgba(247,245,240,0.65); line-height: 1.7; }
  .aff-costo-text strong { color: var(--white); }

  .aff-form { display: flex; gap: 0; max-width: 480px; }
  .aff-input { flex: 1; background: rgba(247,245,240,0.04); border: 1px solid rgba(247,245,240,0.12); border-right: none; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; padding: 0.9rem 1.2rem; border-radius: 2px 0 0 2px; outline: none; transition: border-color 0.2s; }
  .aff-input:focus { border-color: var(--red); }
  .aff-input::placeholder { color: rgba(247,245,240,0.2); }
  .aff-btn { background: var(--red); border: none; color: white; padding: 0.9rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; border-radius: 0 2px 2px 0; letter-spacing: 0.08em; text-transform: uppercase; transition: background 0.2s; white-space: nowrap; }
  .aff-btn:hover { background: var(--red-dark); }
  .aff-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .aff-success { font-size: 0.85rem; color: #4ade80; margin-top: 0.8rem; display: flex; align-items: center; gap: 0.4rem; }
  .aff-form-label { font-size: 0.72rem; color: var(--muted); margin-bottom: 0.6rem; }

  .aff-footer { background: var(--black); padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); font-size: 0.75rem; color: rgba(247,245,240,0.2); }
  .aff-footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .aff-footer-logo span { color: var(--red); }
  .aff-footer a { color: rgba(247,245,240,0.2); text-decoration: none; margin-left: 1.5rem; }
  .aff-footer a:hover { color: rgba(247,245,240,0.5); }

  @media (max-width: 768px) {
    .aff-nav { padding: 1rem 1.5rem; }
    .aff-hero { padding: 5.5rem 3rem 2.5rem; }
    .aff-form { flex-direction: column; }
    .aff-input { border-right: 1px solid rgba(247,245,240,0.12); border-radius: 2px; border-bottom: none; }
    .aff-btn { border-radius: 2px; }
    .aff-footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
  }`;

export default function AffittiPage() {
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
        body: JSON.stringify({ email, source: "affitti" }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="aff-page">

        <NavBar />

        <div className="aff-hero">
          <div className="aff-eyebrow">Prossimamente</div>
          <h1 className="aff-h1">Affitti.<br />Senza <span>sorprese.</span></h1>

          <p className="aff-desc">
            RealAIstate sta portando la stessa filosofia anche agli affitti. <strong>Un costo fisso calmierato, uguale per proprietario e inquilino.</strong> Niente percentuali sul canone, niente mesi di deposito all'agenzia. La tecnologia al servizio di chi cerca casa e di chi la affitta — con la stessa trasparenza che ci ha sempre contraddistinto.
          </p>

          <div className="aff-pillole">
            <div className="aff-pillola"><div className="aff-pillola-icon">◎</div><span>Trasparenza</span></div>
            <div className="aff-pillola"><div className="aff-pillola-icon">⚡</div><span>Efficienza</span></div>
            <div className="aff-pillola"><div className="aff-pillola-icon">✓</div><span>Supporto</span></div>
            <div className="aff-pillola"><div className="aff-pillola-icon">→</div><span>Risparmio</span></div>
          </div>

          <div className="aff-costo">
            <div className="aff-costo-label">Il modello che stiamo costruendo</div>
            <p className="aff-costo-text">
              <strong>Un costo fisso.</strong> Non una percentuale sul canone mensile, non mesi di affitto come provvigione. RealAIstate sta verificando come strutturare un servizio sostenibile e accessibile — per chi affitta e per chi cerca casa. In totale trasparenza.
            </p>
          </div>

          <div className="aff-form-label">Vuoi sapere quando sarà disponibile? Lascia la tua email.</div>
          {!sent ? (
            <div className="aff-form">
              <input
                className="aff-input"
                type="email"
                placeholder="la-tua@email.it"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button className="aff-btn" onClick={handleSubmit} disabled={loading || !email.trim()}>
                Avvisami →
              </button>
            </div>
          ) : (
            <div className="aff-success">✓ Perfetto — ti avvisiamo appena è disponibile.</div>
          )}
        </div>

        <SiteFooter />

      </div>
    </>
  );
}
