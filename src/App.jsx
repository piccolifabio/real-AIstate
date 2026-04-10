import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0f0f0e;
    --paper: #f5f2ec;
    --warm: #e8e2d6;
    --gold: #b89a5a;
    --gold-light: #d4b87a;
    --muted: #7a7368;
    --surface: #ffffff;
    --accent: #1a3a2a;
    --accent-light: #2d5c42;
    --red: #c0392b;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--paper);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 3rem;
    background: rgba(245,242,236,0.88);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(184,154,90,0.15);
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600;
    letter-spacing: -0.01em; color: var(--ink); text-decoration: none;
  }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); text-decoration: none; transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--ink); }
  .nav-cta {
    background: var(--accent) !important; color: white !important;
    padding: 0.55rem 1.4rem; border-radius: 2px;
    font-size: 0.78rem !important; letter-spacing: 0.1em !important;
    transition: background 0.2s !important;
  }
  .nav-cta:hover { background: var(--accent-light) !important; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; padding: 0 3rem; padding-top: 5rem; gap: 4rem;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; top: -20%; right: -10%;
    width: 60vw; height: 120%;
    background: radial-gradient(ellipse at 70% 40%, rgba(184,154,90,0.07) 0%, transparent 65%),
                radial-gradient(ellipse at 30% 80%, rgba(26,58,42,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .hero-text { max-width: 560px; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 1.8rem;
  }
  .hero-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--gold); }
  .hero h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 5vw, 4.8rem); font-weight: 300;
    line-height: 1.08; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 1.8rem;
  }
  .hero h1 em { font-style: italic; color: var(--gold); }
  .hero-sub {
    font-size: 1.05rem; font-weight: 300; line-height: 1.7;
    color: var(--muted); max-width: 440px; margin-bottom: 2.8rem;
  }
  .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--accent); color: white; border: none;
    padding: 0.9rem 2rem; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.06em;
    cursor: pointer; border-radius: 2px;
    transition: background 0.2s, transform 0.15s; text-decoration: none; display: inline-block;
  }
  .btn-primary:hover { background: var(--accent-light); transform: translateY(-1px); }
  .btn-ghost {
    background: transparent; color: var(--ink);
    border: 1px solid rgba(15,15,14,0.2); padding: 0.9rem 2rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 400;
    cursor: pointer; border-radius: 2px;
    transition: border-color 0.2s, background 0.2s; text-decoration: none;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-ghost:hover { border-color: var(--ink); background: rgba(15,15,14,0.03); }
  .hero-stats {
    display: flex; gap: 2.5rem; margin-top: 3.5rem;
    padding-top: 2rem; border-top: 1px solid rgba(15,15,14,0.08);
  }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: var(--ink); line-height: 1;
  }
  .stat-label {
    font-size: 0.72rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--muted); margin-top: 0.3rem;
  }

  /* HERO CARD */
  .hero-visual {
    display: flex; justify-content: center; align-items: center; position: relative;
  }
  .property-card-demo {
    background: var(--surface); border-radius: 4px;
    box-shadow: 0 24px 80px rgba(15,15,14,0.12), 0 4px 16px rgba(15,15,14,0.06);
    width: 100%; max-width: 420px; overflow: hidden;
    animation: floatCard 6s ease-in-out infinite;
  }
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
    50% { transform: translateY(-10px) rotate(0.5deg); }
  }
  .card-img {
    height: 220px;
    background: linear-gradient(135deg, #c9bfa8 0%, #a8987e 50%, #8a7a62 100%);
    position: relative; overflow: hidden;
  }
  .card-img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(15,15,14,0.4) 100%);
  }
  .card-img-text {
    position: absolute; bottom: 1rem; left: 1.2rem; z-index: 1;
    color: white; font-size: 0.72rem; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: 0.9;
  }
  .card-badge {
    position: absolute; top: 1rem; right: 1rem; z-index: 1;
    background: var(--accent); color: white; font-size: 0.68rem;
    font-weight: 500; letter-spacing: 0.08em;
    padding: 0.3rem 0.7rem; border-radius: 2px; text-transform: uppercase;
  }
  .map-bg {
    position: absolute; inset: 0;
    display: grid; grid-template-columns: repeat(8,1fr); grid-template-rows: repeat(5,1fr);
    opacity: 0.18;
  }
  .map-bg span { border: 1px solid rgba(255,255,255,0.5); }
  .card-body { padding: 1.2rem; }
  .card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600; color: var(--ink); line-height: 1; margin-bottom: 0.3rem;
  }
  .card-address { font-size: 0.78rem; color: var(--muted); margin-bottom: 1rem; }
  .card-specs {
    display: flex; gap: 1rem; margin-bottom: 1rem;
    padding-bottom: 1rem; border-bottom: 1px solid var(--warm);
  }
  .spec-item { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 0.3rem; }
  .ai-panel { background: var(--paper); border-radius: 3px; padding: 0.8rem; margin-bottom: 0.8rem; }
  .ai-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; }
  .ai-label {
    font-size: 0.65rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gold);
    display: flex; align-items: center; gap: 0.35rem;
  }
  .ai-label::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }
  .score-chips { display: flex; gap: 0.4rem; }
  .score-chip { font-size: 0.68rem; font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 2px; }
  .chip-green { background: rgba(26,58,42,0.1); color: var(--accent); }
  .chip-gold { background: rgba(184,154,90,0.12); color: #8a6a20; }
  .ai-insight { font-size: 0.75rem; line-height: 1.5; color: var(--muted); }
  .ai-insight strong { color: var(--ink); font-weight: 500; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; }
  .score-bar-label { font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.3rem; }
  .score-bar { height: 4px; background: var(--warm); border-radius: 2px; overflow: hidden; width: 120px; }
  .score-fill { height: 100%; width: 78%; background: linear-gradient(90deg, var(--accent), var(--gold)); border-radius: 2px; }
  .card-actions { display: flex; gap: 0.5rem; }
  .card-btn {
    width: 32px; height: 32px; border: 1px solid var(--warm);
    background: transparent; border-radius: 2px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; transition: background 0.15s;
  }
  .card-btn:hover { background: var(--warm); }
  .float-badge {
    position: absolute; top: -1.5rem; right: -1.5rem;
    background: var(--surface); border-radius: 4px; padding: 0.7rem 1rem;
    box-shadow: 0 8px 32px rgba(15,15,14,0.1);
    display: flex; align-items: center; gap: 0.6rem;
    animation: floatBadge 5s ease-in-out 1s infinite;
  }
  @keyframes floatBadge {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .badge-icon { font-size: 1.1rem; }
  .badge-text { font-size: 0.72rem; line-height: 1.3; }
  .badge-text strong { display: block; font-weight: 500; color: var(--ink); }
  .badge-text span { color: var(--muted); }
  .float-badge-2 {
    position: absolute; bottom: 1rem; left: -2rem;
    background: var(--accent); color: white; border-radius: 4px;
    padding: 0.6rem 1rem; box-shadow: 0 8px 24px rgba(26,58,42,0.3);
    font-size: 0.72rem; line-height: 1.4;
    animation: floatBadge 5s ease-in-out 2.5s infinite;
  }
  .float-badge-2 strong { display: block; font-size: 1.1rem; font-weight: 600; font-family: 'Cormorant Garamond', serif; }

  /* SECTIONS */
  .section { padding: 6rem 3rem; }
  .section-label {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .section-label::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300;
    line-height: 1.12; letter-spacing: -0.02em; color: var(--ink);
  }
  .section-title em { font-style: italic; color: var(--gold); }

  /* HOW IT WORKS */
  .how-works { background: var(--ink); color: white; }
  .how-works .section-label { color: var(--gold-light); }
  .how-works .section-label::before { background: var(--gold-light); }
  .how-works .section-title { color: white; }
  .how-works .section-title em { color: var(--gold-light); }
  .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 4rem; }
  .how-step {
    background: rgba(255,255,255,0.03); padding: 2.5rem 2rem;
    border: 1px solid rgba(255,255,255,0.06); position: relative;
    transition: background 0.3s;
  }
  .how-step:hover { background: rgba(255,255,255,0.06); }
  .step-num {
    font-family: 'Cormorant Garamond', serif; font-size: 4rem;
    font-weight: 300; color: rgba(184,154,90,0.2); line-height: 1;
    margin-bottom: 1.5rem; display: block;
  }
  .step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 400; color: white; margin-bottom: 0.8rem; }
  .step-desc { font-size: 0.85rem; line-height: 1.7; color: rgba(255,255,255,0.45); }

  /* FEATURES */
  .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-top: 4rem; }
  .feature-card {
    background: var(--surface); border-radius: 3px; padding: 2rem;
    border: 1px solid rgba(15,15,14,0.06); transition: box-shadow 0.3s, transform 0.3s;
  }
  .feature-card:hover { box-shadow: 0 12px 40px rgba(15,15,14,0.08); transform: translateY(-3px); }
  .feature-card-wide { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
  .feature-icon {
    width: 44px; height: 44px; background: var(--paper); border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; margin-bottom: 1.2rem;
  }
  .feature-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 400; margin-bottom: 0.6rem; color: var(--ink); }
  .feature-desc { font-size: 0.83rem; line-height: 1.7; color: var(--muted); }
  .feature-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; }
  .ftag {
    font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.25rem 0.6rem; border-radius: 2px;
    background: var(--paper); color: var(--muted); font-weight: 500;
  }
  .score-preview { background: var(--paper); border-radius: 3px; padding: 1.5rem; }
  .score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; }
  .score-row:last-child { margin-bottom: 0; }
  .score-name { font-size: 0.78rem; color: var(--muted); font-weight: 400; }
  .score-val { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; }
  .sv-green { color: var(--accent); }
  .sv-gold { color: #8a6a20; }
  .sv-muted { color: var(--muted); }
  .mini-bar { height: 3px; background: var(--warm); border-radius: 2px; margin-top: 0.25rem; overflow: hidden; }
  .mini-fill { height: 100%; border-radius: 2px; }
  .score-insight { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--warm); font-size: 0.72rem; color: var(--muted); line-height: 1.6; }

  /* TARGET */
  .target-section { background: var(--warm); }
  .target-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
  .target-card {
    background: var(--surface); border-radius: 3px; padding: 2rem 1.8rem;
    border-top: 3px solid transparent; transition: border-color 0.3s, box-shadow 0.3s;
  }
  .target-card:hover { border-color: var(--gold); box-shadow: 0 8px 32px rgba(15,15,14,0.08); }
  .target-card-active { border-color: var(--accent); }
  .target-role { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); font-weight: 500; margin-bottom: 0.6rem; }
  .target-name { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 400; color: var(--ink); margin-bottom: 0.8rem; }
  .target-need { font-size: 0.82rem; line-height: 1.6; color: var(--muted); margin-bottom: 1.2rem; }
  .target-features { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
  .target-features li { font-size: 0.78rem; color: var(--muted); display: flex; align-items: flex-start; gap: 0.5rem; }
  .target-features li::before { content: '→'; color: var(--gold); flex-shrink: 0; }

  /* CTA */
  .cta-section {
    background: var(--accent); text-align: center; padding: 7rem 3rem;
    position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(184,154,90,0.15) 0%, transparent 65%);
  }
  .cta-eyebrow { font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(184,154,90,0.8); margin-bottom: 1.5rem; }
  .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 300; color: white; line-height: 1.1; margin-bottom: 1.5rem; }
  .cta-title em { font-style: italic; color: var(--gold-light); }
  .cta-sub { font-size: 0.95rem; color: rgba(255,255,255,0.5); max-width: 420px; margin: 0 auto 2.5rem; line-height: 1.7; }
  .cta-form { display: flex; gap: 0.75rem; justify-content: center; align-items: center; flex-wrap: wrap; }
  .cta-input {
    padding: 0.9rem 1.4rem; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.07); color: white;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    border-radius: 2px; width: 280px; outline: none; transition: border-color 0.2s;
  }
  .cta-input::placeholder { color: rgba(255,255,255,0.3); }
  .cta-input:focus { border-color: var(--gold); }
  .btn-gold {
    background: var(--gold); color: var(--ink); border: none;
    padding: 0.9rem 2rem; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em;
    cursor: pointer; border-radius: 2px; transition: background 0.2s, transform 0.15s;
  }
  .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
  .cta-note { font-size: 0.72rem; color: rgba(255,255,255,0.3); margin-top: 1rem; letter-spacing: 0.05em; }
  .cta-success { font-size: 0.9rem; color: var(--gold-light); margin-top: 1rem; }

  /* FOOTER */
  .footer {
    background: var(--ink); color: rgba(255,255,255,0.4);
    padding: 2.5rem 3rem; display: flex; align-items: center;
    justify-content: space-between; font-size: 0.78rem; letter-spacing: 0.04em;
  }
  .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: rgba(255,255,255,0.6); }
  .footer-logo span { color: var(--gold); }
  .footer-links { display: flex; gap: 2rem; }
  .footer-links a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: rgba(255,255,255,0.7); }

  /* SCROLL REVEAL */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; padding: 7rem 1.5rem 3rem; min-height: auto; gap: 3rem; }
    .hero-visual { display: none; }
    .section { padding: 4rem 1.5rem; }
    .how-grid { grid-template-columns: 1fr; gap: 1px; }
    .features-grid { grid-template-columns: 1fr; }
    .feature-card-wide { grid-column: 1; display: block; }
    .target-grid { grid-template-columns: 1fr; }
    .cta-section { padding: 5rem 1.5rem; }
    .footer { flex-direction: column; gap: 1.5rem; text-align: center; padding: 2rem 1.5rem; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 120);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, []);
}

function Nav() {
  return (
    <nav className="nav">
      <a href="#" className="nav-logo">Real<span>AI</span>state</a>
      <ul className="nav-links">
        <li><a href="#come-funziona">Come funziona</a></li>
        <li><a href="#funzionalita">Funzionalità</a></li>
        <li><a href="#per-chi">Per chi</a></li>
        <li><a href="#early" className="nav-cta">Accesso anticipato</a></li>
      </ul>
    </nav>
  );
}

function PropertyCard() {
  return (
    <div className="hero-visual">
      <div className="float-badge">
        <div className="badge-icon">📈</div>
        <div className="badge-text">
          <strong>Sotto mercato del 8%</strong>
          <span>Fair Price Score</span>
        </div>
      </div>
      <div className="property-card-demo">
        <div className="card-img">
          <div className="map-bg">
            {Array(40).fill(null).map((_, i) => <span key={i} />)}
          </div>
          <div className="card-img-text">Milano · Porta Romana</div>
          <div className="card-badge">Analisi AI ✦</div>
        </div>
        <div className="card-body">
          <div className="card-price">€ 485.000</div>
          <div className="card-address">Via Lamarmora, 18 · 3 locali · 92 m²</div>
          <div className="card-specs">
            <div className="spec-item">🛏 2 camere</div>
            <div className="spec-item">🛁 2 bagni</div>
            <div className="spec-item">⚡ Cl. B</div>
            <div className="spec-item">🅿 Box</div>
          </div>
          <div className="ai-panel">
            <div className="ai-panel-header">
              <span className="ai-label">Analisi AI</span>
              <div className="score-chips">
                <span className="score-chip chip-green">✓ Prezzo ok</span>
                <span className="score-chip chip-gold">★ Buon rendimento</span>
              </div>
            </div>
            <div className="ai-insight">
              <strong>Punti di forza:</strong> ottima classe energetica, zona in rivalutazione, box incluso.<br />
              <strong>Attenzione:</strong> spese condominiali non indicate nell'annuncio.
            </div>
          </div>
          <div className="card-footer">
            <div>
              <div className="score-bar-label">Investment Score</div>
              <div className="score-bar"><div className="score-fill" /></div>
            </div>
            <div className="card-actions">
              <button className="card-btn">♡</button>
              <button className="card-btn">⤢</button>
              <button className="card-btn">✎</button>
            </div>
          </div>
        </div>
      </div>
      <div className="float-badge-2">
        <strong>7.8/10</strong>
        Investment Score
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <div className="hero-eyebrow">Piattaforma AI per il Real Estate</div>
        <h1>Ogni immobile<br />è una <em>decisione</em></h1>
        <p className="hero-sub">RealAIstate trasforma gli annunci in centri decisionali. Analisi del prezzo, scoring qualitativo, comparabili automatici e sintesi AI — in un'unica scheda.</p>
        <div className="hero-actions">
          <a href="#early" className="btn-primary">Richiedi accesso anticipato</a>
          <a href="#come-funziona" className="btn-ghost"><span>↓</span> Come funziona</a>
        </div>
        <div className="hero-stats">
          <div><div className="stat-num">3s</div><div className="stat-label">per un'analisi completa</div></div>
          <div><div className="stat-num">AI</div><div className="stat-label">Scoring spiegabile</div></div>
          <div><div className="stat-num">∞</div><div className="stat-label">Comparabili automatici</div></div>
        </div>
      </div>
      <PropertyCard />
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Cerca e filtra", desc: "Inserisci zona, budget e criteri. La mappa interattiva e i filtri intelligenti portano in superficie solo ciò che è rilevante per il tuo obiettivo." },
    { num: "02", title: "Analizza in profondità", desc: "Ogni scheda include valutazione AI del prezzo, comparabili automatici, punti di forza e criticità, domande consigliate da fare prima della visita." },
    { num: "03", title: "Decidi con sicurezza", desc: "Organizza la tua shortlist, confronta più immobili affiancati, aggiungi note private ed esporta un report decisionale condivisibile." },
  ];
  return (
    <section className="section how-works" id="come-funziona">
      <div className="section-label">Come funziona</div>
      <h2 className="section-title">Dal dato grezzo<br />alla <em>decisione giusta</em></h2>
      <div className="how-grid">
        {steps.map((s) => (
          <div className="how-step reveal" key={s.num}>
            <span className="step-num">{s.num}</span>
            <div className="step-title">{s.title}</div>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section" id="funzionalita" style={{ background: "var(--paper)" }}>
      <div className="section-label">Funzionalità</div>
      <h2 className="section-title">Strumenti pensati<br />per <em>chi decide</em></h2>
      <div className="features-grid">
        <div className="feature-card feature-card-wide reveal">
          <div>
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Fair Price Score</h3>
            <p className="feature-desc">Il motore AI valuta ogni immobile rispetto al mercato locale, tenendo conto di zona, metratura, stato, classe energetica e caratteristiche. Il punteggio è sempre spiegato — nessuna black box.</p>
            <div className="feature-tags">
              <span className="ftag">Prezzo sotto/sopra mercato</span>
              <span className="ftag">Comparabili automatici</span>
              <span className="ftag">Trend zona</span>
              <span className="ftag">Spiegazione testuale</span>
            </div>
          </div>
          <div className="score-preview">
            <div className="score-row">
              <div><div className="score-name">Fair Price Score</div><div className="mini-bar"><div className="mini-fill" style={{ width: "82%", background: "var(--accent)" }} /></div></div>
              <div className="score-val sv-green">82/100</div>
            </div>
            <div className="score-row">
              <div><div className="score-name">Investment Score</div><div className="mini-bar"><div className="mini-fill" style={{ width: "78%", background: "var(--gold)" }} /></div></div>
              <div className="score-val sv-gold">78/100</div>
            </div>
            <div className="score-row">
              <div><div className="score-name">Qualità annuncio</div><div className="mini-bar"><div className="mini-fill" style={{ width: "55%", background: "var(--muted)" }} /></div></div>
              <div className="score-val sv-muted">55/100</div>
            </div>
            <div className="score-insight">
              💡 <em>Il prezzo è allineato al mercato di zona. L'annuncio manca di informazioni su spese condominiali e piano — chiedi prima della visita.</em>
            </div>
          </div>
        </div>
        <div className="feature-card reveal">
          <div className="feature-icon">🔎</div>
          <h3 className="feature-title">Question Generator</h3>
          <p className="feature-desc">L'AI analizza l'annuncio e produce automaticamente le domande che dovresti fare all'agente o al proprietario — colmando le lacune informative prima della visita.</p>
          <div className="feature-tags">
            <span className="ftag">Domande pre-visita</span>
            <span className="ftag">Red flags</span>
            <span className="ftag">Checklist visita</span>
          </div>
        </div>
        <div className="feature-card reveal">
          <div className="feature-icon">📋</div>
          <h3 className="feature-title">Workspace personale</h3>
          <p className="feature-desc">Preferiti, shortlist, confronti multi-immobile, note private e stato del processo: da valutare, da visitare, offerta inviata, scartato.</p>
          <div className="feature-tags">
            <span className="ftag">Shortlist</span>
            <span className="ftag">Confronto affiancato</span>
            <span className="ftag">Note private</span>
            <span className="ftag">Export PDF</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TargetSection() {
  const targets = [
    {
      role: "Acquirente privato", name: "Capire prima di decidere",
      need: "Non sei un esperto del mercato. RealAIstate ti dice in 3 secondi se l'immobile vale davvero quello che chiedono — e perché.",
      features: ["Valutazione del prezzo in linguaggio semplice", "Domande consigliate da fare all'agente", "Confronto tra più opzioni in shortlist", "Alert su nuovi immobili compatibili"],
      active: false
    },
    {
      role: "Investitore", name: "Massimizzare il rendimento",
      need: "Ogni ora persa a confrontare dati è denaro. Il workspace investitore centralizza analisi, scoring e pipeline opportunità in un unico flusso.",
      features: ["Investment Score con spiegazione", "Classificazione: rendita, flip, affitto breve", "Pipeline opportunità con stato", "Report decisionale esportabile"],
      active: true
    },
    {
      role: "Agente immobiliare", name: "Lavorare meglio sugli annunci",
      need: "Genera descrizioni ottimizzate con AI, analizza il posizionamento di ogni annuncio e gestisci i lead con un CRM leggero integrato.",
      features: ["Riscrittura annunci con AI", "Report di posizionamento condivisibile", "Mini CRM lead e trattative", "Analisi performance annunci"],
      active: false
    },
  ];
  return (
    <section className="section target-section" id="per-chi">
      <div className="section-label">Per chi è pensato</div>
      <h2 className="section-title">Ogni utente ha<br />il suo <em>valore chiave</em></h2>
      <div className="target-grid reveal">
        {targets.map((t) => (
          <div className={`target-card ${t.active ? "target-card-active" : ""}`} key={t.role}>
            <div className="target-role">{t.role}</div>
            <div className="target-name">{t.name}</div>
            <p className="target-need">{t.need}</p>
            <ul className="target-features">
              {t.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email && email.includes("@")) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="cta-section" id="early">
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="cta-eyebrow">Early Access</div>
        <h2 className="cta-title">Sii tra i primi a<br /><em>usarlo davvero</em></h2>
        <p className="cta-sub">Stiamo costruendo RealAIstate. Lascia la tua email per entrare nella lista d'attesa e ricevere accesso anticipato.</p>
        {!submitted ? (
          <>
            <div className="cta-form">
              <input
                className="cta-input"
                type="email"
                placeholder="la-tua@email.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button className="btn-gold" onClick={handleSubmit}>Voglio l'accesso anticipato →</button>
            </div>
            <div className="cta-note">Nessuno spam. Solo aggiornamenti rilevanti.</div>
          </>
        ) : (
          <div className="cta-success">✓ Ottimo! Sei nella lista. Ti contatteremo presto.</div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">Real<span>AI</span>state</div>
      <div className="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Termini</a>
        <a href="#">Contatti</a>
      </div>
      <div>© 2025 RealAIstate</div>
    </footer>
  );
}

export default function App() {
  useScrollReveal();

  return (
    <>
      <style>{styles}</style>
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <TargetSection />
      <CTASection />
      <Footer />
    </>
  );
}
