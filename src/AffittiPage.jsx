import { useState, useEffect } from "react";

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

  .aff-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 10rem 3rem 5rem; max-width: 900px; margin: 0 auto; width: 100%; }

  .aff-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .aff-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }

  .aff-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3.5rem, 8vw, 7rem); line-height: 0.95; color: var(--white); margin-bottom: 2rem; }
  .aff-h1 span { color: var(--red); }

  .aff-desc { font-size: 1.05rem; color: rgba(247,245,240,0.6); line-height: 1.8; max-width: 620px; margin-bottom: 3rem; }
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
    .aff-hero { padding: 8rem 1.5rem 4rem; }
    .aff-form { flex-direction: column; }
    .aff-input { border-right: 1px solid rgba(247,245,240,0.12); border-radius: 2px; border-bottom: none; }
    .aff-btn { border-radius: 2px; }
    .aff-footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
  }

  .std-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); gap: 2rem; }
  .std-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .std-nav-logo span { color: var(--red); }
  .std-nav-links { display: flex; gap: 2.5rem; list-style: none; align-items: center; margin: 0; padding: 0; flex: 1; }
  .std-nav-links li { list-style: none; }
  .std-nav-links a { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
  .std-nav-links a:hover { color: var(--white); }
  .std-nav-cta { background: var(--red); color: white !important; padding: 0.4rem 1rem; border-radius: 2px; }
  .std-nav-cta:hover { background: var(--red-dark); }
  .std-footer { background: var(--black); padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); font-size: 0.75rem; color: rgba(247,245,240,0.2); }
  .std-footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .std-footer-logo span { color: var(--red); }
  .std-footer-links { display: flex; gap: 1.5rem; align-items: center; }
  .std-footer-links a { color: rgba(247,245,240,0.2); text-decoration: none; transition: color 0.2s; }
  .std-footer-links a:hover { color: rgba(247,245,240,0.5); }
  @media (max-width: 768px) {
    .std-nav { padding: 1rem 1.5rem; }
    .std-nav-links { display: none; }
    .std-footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
    .std-footer-links { flex-wrap: wrap; justify-content: center; }
  }

`;

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

        <nav className="std-nav">
        <a href="/" className="std-nav-logo">Real<span>AI</span>state</a>
        <div style={{width: "1.5rem"}}></div>
        <ul className="std-nav-links">
          <li><a href="/come-funziona">Come funziona</a></li>
          <li><a href="/scuse">Le scuse</a></li>
          <li style={{flex: 1}}></li>
          <li><a href="/affitti">Affitti</a></li>
          <li><a href="/immobile/1">Compra casa</a></li>
          <li><a href="/vendi">Vendi casa</a></li>
          <li><a href="/#early" className="std-nav-cta">Accesso</a></li>
        </ul>
      </nav>

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

        <footer className="std-footer">
        <div className="std-footer-logo">Real<span>AI</span>state</div>
        <div className="std-footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/termini">Termini</a>
          <a href="/faq">FAQ</a>
          <a href="mailto:info@realaistate.ai">Contatti</a>
          <a href="https://www.instagram.com/realaistate.ai" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"0.4rem"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            @realaistate.ai
          </a>
        </div>
        <div>© 2025 RealAIstate</div>
      </footer>

      </div>
    </>
  );
}
