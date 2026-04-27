import { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --gold: #c9a84c; --muted: #6b6b6b; --surface: #141414;
    --border: rgba(247,245,240,0.08); --green: #2d6a4f; --green-light: #4ade80;
    --warm: #1e1e1e;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  .metod-hero { padding: 5.5rem 3rem 2.5rem; margin-top: 5rem; max-width: 860px; margin-left: auto; margin-right: auto; }
  .eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .metod-hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; color: var(--white); margin-bottom: 1rem; }
  .metod-hero-sub { font-size: 1rem; line-height: 1.7; color: rgba(247,245,240,0.45); max-width: 640px; font-weight: 300; }

  .content { max-width: 860px; margin: 0 auto; padding: 0 3rem 6rem; }

  .section { margin-bottom: 4rem; padding-bottom: 4rem; border-bottom: 1px solid var(--border); }
  .section:last-child { border-bottom: none; }
  .section-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; color: var(--white); margin-bottom: 1.2rem; line-height: 1; }
  .section-body { font-size: 0.95rem; line-height: 1.8; color: rgba(247,245,240,0.6); margin-bottom: 1.2rem; }
  .section-body strong { color: var(--white); font-weight: 600; }

  /* FORMULA BOX */
  .formula-box { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 2rem; margin: 2rem 0; position: relative; overflow: hidden; }
  .formula-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--red), var(--gold)); }
  .formula-title { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.2rem; }
  .formula { font-family: 'DM Sans', sans-serif; font-size: 1.1rem; color: var(--white); line-height: 2; }
  .formula .var { color: var(--gold); font-weight: 600; }
  .formula .result { color: var(--green-light); font-weight: 600; }
  .formula .comment { color: var(--muted); font-size: 0.82rem; font-style: italic; }

  /* RANGE VISUALIZER */
  .range-section { margin: 2rem 0; }
  .range-title { font-size: 0.82rem; font-weight: 600; color: rgba(247,245,240,0.5); margin-bottom: 1.2rem; letter-spacing: 0.06em; text-transform: uppercase; }
  .range-bar-wrap { position: relative; margin-bottom: 0.6rem; }
  .range-track { height: 12px; background: rgba(247,245,240,0.06); border-radius: 6px; position: relative; overflow: visible; }
  .range-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, rgba(217,48,37,0.3), rgba(74,222,128,0.5), rgba(217,48,37,0.3)); }
  .range-marker { position: absolute; top: -4px; width: 20px; height: 20px; border-radius: 50%; border: 3px solid var(--white); transform: translateX(-50%); }
  .range-marker.green { background: var(--green-light); }
  .range-labels { display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--muted); }
  .range-legend { display: flex; gap: 1.5rem; margin-top: 1rem; flex-wrap: wrap; }
  .range-legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: rgba(247,245,240,0.5); }
  .range-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* ESEMPIO */
  .example-box { background: rgba(45,106,79,0.08); border: 1px solid rgba(45,106,79,0.2); border-radius: 3px; padding: 1.8rem; margin: 2rem 0; }
  .example-title { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--green-light); margin-bottom: 1.2rem; }
  .example-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid rgba(247,245,240,0.04); font-size: 0.9rem; }
  .example-row:last-child { border-bottom: none; }
  .example-label { color: rgba(247,245,240,0.5); }
  .example-val { color: var(--white); font-weight: 500; }
  .example-val.highlight { color: var(--green-light); font-weight: 600; }
  .example-val.red { color: var(--red); }

  /* SCORE TABLE */
  .score-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
  .score-table th { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 0.6rem 1rem; border-bottom: 1px solid var(--border); text-align: left; }
  .score-table td { font-size: 0.88rem; padding: 0.8rem 1rem; border-bottom: 1px solid rgba(247,245,240,0.04); color: rgba(247,245,240,0.7); }
  .score-table tr:last-child td { border-bottom: none; }
  .score-table td.score { font-weight: 600; }
  .score-table td.score.green { color: var(--green-light); }
  .score-table td.score.gold { color: var(--gold); }
  .score-table td.score.red { color: var(--red); }

  /* OMI BADGE */
  .omi-badge { display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(45,106,79,0.1); border: 1px solid rgba(45,106,79,0.25); border-radius: 2px; padding: 0.6rem 1.2rem; margin: 1rem 0; }
  .omi-badge-text { font-size: 0.78rem; color: var(--green-light); font-weight: 500; }

  .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .footer-logo span { color: var(--red); }

  @media (max-width: 900px) {
    .hero, .content { padding-left: 1.5rem; padding-right: 1.5rem; }
  }
`;

// Range visualizer component
function RangeVisualizer({ min, max, value, label, color = "green" }) {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  return (
    <div className="range-bar-wrap">
      <div style={{ fontSize: "0.75rem", color: "rgba(247,245,240,0.4)", marginBottom: "0.4rem" }}>{label}</div>
      <div className="range-track">
        <div className="range-fill" style={{ width: "100%" }} />
        <div className="range-marker green" style={{ left: `${pct}%` }} />
      </div>
      <div className="range-labels">
        <span>Min €{min.toLocaleString("it-IT")}/mq</span>
        <span style={{ color: "var(--green-light)", fontWeight: 600 }}>€{value.toLocaleString("it-IT")}/mq ({pct}%)</span>
        <span>Max €{max.toLocaleString("it-IT")}/mq</span>
      </div>
    </div>
  );
}

export default function MetodologiaPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <style>{styles}</style>
      <NavBar />

      <div className="metod-hero" style={{ paddingTop: "5.5rem", paddingBottom: "2rem" }}>
        <div className="eyebrow">Trasparenza totale</div>
        <h1 className="metod-hero-title">Come calcoliamo<br />il Fair Price Score.</h1>
        <p className="metod-hero-sub">Nessun algoritmo misterioso. Nessun dato inventato. Il Fair Price Score è basato su dati ufficiali dell&apos;Agenzia delle Entrate — e puoi verificarlo tu stesso.</p>
      </div>

      <div className="content">

        {/* SEZIONE 1 — LA FONTE */}
        <div className="section">
          <div className="section-label">La fonte dei dati</div>
          <h2 className="section-title">Dati OMI — Agenzia delle Entrate</h2>
          <p className="section-body">Il Fair Price Score è alimentato dalla <strong>Banca Dati delle Quotazioni Immobiliari OMI</strong> — l&apos;Osservatorio del Mercato Immobiliare dell&apos;Agenzia delle Entrate.</p>
          <p className="section-body">I dati OMI forniscono, per ogni zona territoriale omogenea di ciascun comune italiano, un intervallo minimo e massimo di valore in €/mq — aggiornato ogni semestre. Sono i dati più affidabili e ufficiali disponibili in Italia sul mercato immobiliare reale.</p>
          <div className="omi-badge">
            <span style={{ color: "var(--green-light)" }}>✓</span>
            <span className="omi-badge-text">Dati aggiornati ogni 6 mesi · Copertura nazionale · Fonte: Agenzia delle Entrate – OMI</span>
          </div>
          <p className="section-body" style={{ marginTop: "1rem" }}>Puoi consultare i dati OMI direttamente sul sito dell&apos;Agenzia delle Entrate o tramite l&apos;app gratuita <strong>OMI Mobile</strong>.</p>
        </div>

        {/* SEZIONE 2 — LA FORMULA */}
        <div className="section">
          <div className="section-label">La formula</div>
          <h2 className="section-title">Come si calcola.</h2>
          <p className="section-body">Il Fair Price Score misura dove il prezzo richiesto si posiziona all&apos;interno del range OMI della zona. Un punteggio alto significa prezzo equilibrato o conveniente. Un punteggio basso significa prezzo sopra mercato.</p>

          <div className="formula-box">
            <div className="formula-title">📐 Formula base</div>
            <div className="formula">
              <div><span className="var">Posizione %</span> = (Prezzo/mq – Min OMI) / (Max OMI – Min OMI) × 100</div>
              <div style={{ marginTop: "0.5rem" }}><span className="result">Fair Price Score</span> = 100 – (Posizione % × 0,4)</div>
              <div style={{ marginTop: "0.8rem", fontSize: "0.8rem" }} className="comment">Se il prezzo è al centro del range → Score ~80. Se è sotto il minimo → Score ~100. Se è sopra il massimo → Score ~60.</div>
            </div>
          </div>

          <p className="section-body">Il punteggio non scende mai sotto 50 né supera 100 — indica sempre la qualità relativa della valutazione, non un giudizio assoluto.</p>
        </div>

        {/* SEZIONE 3 — GARAGE E PERTINENZE */}
        <div className="section">
          <div className="section-label">Garage e pertinenze</div>
          <h2 className="section-title">Il prezzo si scorpora.</h2>
          <p className="section-body">Quando un immobile include pertinenze — <strong>garage, box, cantina, posto auto</strong> — il loro valore viene scorporato dal prezzo totale prima di calcolare il Fair Price Score.</p>
          <p className="section-body">Questo perché il range OMI residenziale si riferisce all&apos;abitazione pura. Confrontare il prezzo totale (comprensivo di garage) con il range OMI delle abitazioni darebbe un risultato distorto — sembrerebbe che il prezzo sia più alto di quanto sia in realtà.</p>

          <div className="formula-box">
            <div className="formula-title">📐 Formula con pertinenze</div>
            <div className="formula">
              <div><span className="var">Valore pertinenza</span> = mq pertinenza × valore OMI pertinenza</div>
              <div style={{ marginTop: "0.5rem" }}><span className="var">Prezzo abitazione pura</span> = Prezzo totale – Valore pertinenza</div>
              <div style={{ marginTop: "0.5rem" }}><span className="var">Prezzo/mq corretto</span> = Prezzo abitazione pura / mq abitazione</div>
              <div style={{ marginTop: "0.5rem" }}><span className="result">Fair Price Score</span> = calcolato sul Prezzo/mq corretto</div>
            </div>
          </div>
        </div>

        {/* SEZIONE 4 — ESEMPIO GENERICO */}
        <div className="section">
          <div className="section-label">Esempio di calcolo</div>
          <h2 className="section-title">Come funziona in pratica.</h2>
          <p className="section-body">Esempio generico basato su parametri tipici del mercato milanese — i valori OMI variano per zona, tipologia e semestre.</p>

          <div className="example-box">
            <div className="example-title">✓ Esempio · Appartamento con garage · Milano · Zona centrale</div>
            <div className="example-row"><span className="example-label">Prezzo totale richiesto</span><span className="example-val">€350.000</span></div>
            <div className="example-row"><span className="example-label">Superficie abitazione</span><span className="example-val">75 mq</span></div>
            <div className="example-row"><span className="example-label">Garage incluso</span><span className="example-val">15 mq</span></div>
            <div className="example-row"><span className="example-label">Valore garage OMI (Box, Normale)</span><span className="example-val red">– €33.000 (15 mq × €2.200/mq)</span></div>
            <div className="example-row"><span className="example-label">Prezzo abitazione pura</span><span className="example-val">€317.000</span></div>
            <div className="example-row"><span className="example-label">Prezzo/mq corretto</span><span className="example-val">€4.227/mq</span></div>
            <div className="example-row"><span className="example-label">Range OMI Abitazioni Civili Normale</span><span className="example-val">€3.500 – €5.500/mq</span></div>
            <div className="example-row"><span className="example-label">Posizione nel range</span><span className="example-val highlight">36,3% — primo terzo del range</span></div>
            <div className="example-row"><span className="example-label">Fair Price Score</span><span className="example-val highlight">85 / 100</span></div>
          </div>

          <div className="range-section">
            <div className="range-title">Visualizzazione del range OMI</div>
            <RangeVisualizer min={3500} max={5500} value={4227} label="Abitazioni Civili Normale — Milano zona centrale" />
            <div style={{ marginTop: "1rem" }}>
              <RangeVisualizer min={1600} max={2800} value={2200} label="Box/Garage Normale — Milano zona centrale" />
            </div>
            <div className="range-legend">
              <div className="range-legend-item"><div className="range-dot" style={{ background: "var(--green-light)" }} /><span>Posizione del prezzo nel range OMI</span></div>
              <div className="range-legend-item"><div className="range-dot" style={{ background: "rgba(217,48,37,0.5)" }} /><span>Estremi del range (Min/Max OMI)</span></div>
            </div>
          </div>
          <p className="section-body" style={{ marginTop: "1rem" }}>I valori OMI reali per ogni zona italiana sono consultabili gratuitamente sul sito dell&apos;Agenzia delle Entrate — <a href="https://www.agenziaentrate.gov.it/portale/web/guest/schede/fabbricati-e-altri-beni-immobili/omi" target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)" }}>vai al portale OMI →</a></p>
        </div>

        {/* SEZIONE 5 — TABELLA SCORE */}
        <div className="section">
          <div className="section-label">Interpretazione</div>
          <h2 className="section-title">Cosa significa il punteggio.</h2>
          <table className="score-table">
            <thead>
              <tr>
                <th>Fair Price Score</th>
                <th>Posizione nel range OMI</th>
                <th>Interpretazione</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="score green">90 – 100</td><td>Sotto il minimo OMI o al minimo</td><td>Prezzo molto conveniente — raro in zona</td></tr>
              <tr><td className="score green">80 – 89</td><td>Primo terzo del range</td><td>Prezzo corretto — buona opportunità</td></tr>
              <tr><td className="score gold">70 – 79</td><td>Centro del range</td><td>Prezzo allineato al mercato</td></tr>
              <tr><td className="score gold">60 – 69</td><td>Secondo terzo del range</td><td>Prezzo nella fascia alta — giustificato solo da caratteristiche premium</td></tr>
              <tr><td className="score red">50 – 59</td><td>Sopra il massimo OMI</td><td>Prezzo sopra mercato — valutare con attenzione</td></tr>
            </tbody>
          </table>
        </div>

        {/* SEZIONE 6 — LIMITI */}
        <div className="section">
          <div className="section-label">Limiti e trasparenza</div>
          <h2 className="section-title">Cosa il Fair Price Score non è.</h2>
          <p className="section-body">Il Fair Price Score è uno strumento di orientamento, non una perizia professionale. Come specificato dall&apos;Agenzia delle Entrate stessa, le quotazioni OMI indicano un intervallo in cui ricade il valore medio di immobili in condizioni ordinarie — non sostituiscono la stima puntuale di un singolo immobile.</p>
          <p className="section-body">Fattori come <strong>vista, luminosità, stato degli impianti, piano, esposizione</strong> possono giustificare scostamenti significativi dal range OMI. Il Fair Price Score va sempre letto in combinazione con l&apos;analisi AI completa dell&apos;immobile.</p>
          <p className="section-body">Per una perizia ufficiale, RealAIstate ti connette con periti certificati della nostra rete professionale.</p>
        </div>

      </div>

      <SiteFooter />
    </>
  );
}
