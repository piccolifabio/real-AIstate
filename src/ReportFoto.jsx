import { useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --gold: #c9a84c; --muted: #6b6b6b; --surface: #141414;
    --border: rgba(247,245,240,0.08); --green: #2d6a4f; --green-light: #4ade80;
    --warm: #1e1e1e; --orange: #fb923c; --red-light: #f87171;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .nav-logo span { color: var(--red); }
  .nav-back { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .nav-back:hover { color: var(--white); }

  .hero { padding: 8rem 3rem 3rem; max-width: 900px; margin: 0 auto; }
  .eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
  .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 5rem); line-height: 0.95; color: var(--white); margin-bottom: 1rem; }
  .hero-sub { font-size: 1rem; line-height: 1.7; color: rgba(247,245,240,0.5); max-width: 600px; font-weight: 300; }

  /* OVERALL SCORE */
  .overall-card { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 2rem; margin: 0 3rem 3rem; max-width: 900px; margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
  .overall-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--red-light), var(--orange), var(--gold)); }
  .overall-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .overall-score { font-family: 'Bebas Neue', sans-serif; font-size: 5rem; color: var(--orange); line-height: 1; }
  .overall-score span { font-size: 2rem; color: var(--muted); }
  .overall-verdict { font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-style: italic; color: rgba(247,245,240,0.7); line-height: 1.6; max-width: 500px; }
  .score-bars { display: flex; flex-direction: column; gap: 0.6rem; }
  .score-bar-row { display: flex; align-items: center; gap: 0.8rem; }
  .score-bar-label { font-size: 0.78rem; color: var(--muted); width: 130px; flex-shrink: 0; }
  .score-bar-track { flex: 1; height: 5px; background: rgba(247,245,240,0.06); border-radius: 3px; }
  .score-bar-fill { height: 5px; border-radius: 3px; }
  .score-bar-num { font-size: 0.78rem; font-weight: 600; width: 28px; text-align: right; }

  /* PRIORITY BOX */
  .priority-box { background: rgba(217,48,37,0.08); border: 1px solid rgba(217,48,37,0.2); border-radius: 3px; padding: 1.5rem; margin: 0 3rem 2rem; max-width: 900px; margin-left: auto; margin-right: auto; }
  .priority-title { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; }
  .priority-item { display: flex; align-items: flex-start; gap: 0.8rem; margin-bottom: 0.6rem; font-size: 0.88rem; color: rgba(247,245,240,0.7); line-height: 1.5; }
  .priority-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: var(--red); flex-shrink: 0; width: 20px; }

  /* ROOM CARDS */
  .content { max-width: 900px; margin: 0 auto; padding: 0 3rem 5rem; }
  .section-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin: 2.5rem 0 1rem; }
  .room-card { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 1.5rem; margin-bottom: 1rem; }
  .room-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .room-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: var(--white); }
  .score-badge { font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.8rem; border-radius: 2px; }
  .score-good { background: rgba(74,222,128,0.12); color: var(--green-light); }
  .score-mid { background: rgba(251,146,60,0.12); color: var(--orange); }
  .score-bad { background: rgba(248,113,113,0.12); color: var(--red-light); }
  .tag-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  .tag { font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 2px; font-weight: 500; }
  .tag-pro { background: rgba(74,222,128,0.1); color: var(--green-light); }
  .tag-con { background: rgba(248,113,113,0.1); color: var(--red-light); }
  .fix-title { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.6rem; }
  .fix-item { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.45rem; font-size: 0.85rem; color: rgba(247,245,240,0.65); line-height: 1.5; }
  .fix-arrow { color: var(--red); flex-shrink: 0; }

  /* ROI BOX */
  .roi-box { background: rgba(45,106,79,0.08); border: 1px solid rgba(45,106,79,0.2); border-radius: 3px; padding: 1.5rem; margin-top: 2rem; }
  .roi-title { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--green-light); margin-bottom: 0.8rem; }
  .roi-body { font-size: 0.9rem; line-height: 1.7; color: rgba(247,245,240,0.6); }
  .roi-body strong { color: var(--white); }

  .footer { background: var(--black); padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); font-size: 0.75rem; color: rgba(247,245,240,0.2); margin-top: 4rem; }
  .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .footer-logo span { color: var(--red); }

  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .hero, .content, .overall-card, .priority-box { padding-left: 1.5rem; padding-right: 1.5rem; }
    .overall-top { flex-direction: column; }
    .footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
  }
`;

const BASE_URL = "https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/immobili/";

const rooms = [
  {
    title: "Soggiorno + Cucina open space",
    photo: `${BASE_URL}IMG_4782.jpg`,
    score: 65,
    scoreClass: "score-mid",
    pros: ["Spazio ampio", "Pavimento legno chiaro", "Doppio accesso terrazzo"],
    cons: ["Bidoni spazzatura visibili", "Cucina in disordine", "Angolo cottura esposto male"],
    fixes: [
      "Rimuovi tutti i contenitori rifiuti — in entrambe le foto. È il primo elemento che l'occhio individua.",
      "Libera il piano cottura e il bancone dalla spesa, bottiglie, sacchi. La cucina è bella: falla vedere.",
      "Angolo corretto: dalla cucina verso il soggiorno, non viceversa — valorizza la profondità.",
      "Apri completamente le porte del terrazzo per portare luce naturale dentro.",
    ]
  },
  {
    title: "Corridoio zona notte",
    photo: `${BASE_URL}IMG_4784.jpg`,
    score: 60,
    scoreClass: "score-mid",
    pros: ["Porte scure di qualità", "Pavimento continuo"],
    cons: ["Asciugamano appeso alla porta", "Prospettiva compressa"],
    fixes: [
      "Rimuovi l'asciugamano verde dalla maniglia — dettaglio banale che abbassa immediatamente il tono.",
      "Questa foto è quasi inutile nell'annuncio. Sostituiscila con uno scatto dalla camera verso il corridoio, più narrativo.",
    ]
  },
  {
    title: "Camera principale",
    photo: `${BASE_URL}IMG_4785.jpg`,
    score: 55,
    scoreClass: "score-mid",
    pros: ["Armadio scorrevole di design", "Finestra con verde esterno", "Quadro Magritte — personalità"],
    cons: ["Letto disfatto con vestiti", "Angolo di ripresa troppo alto", "Oggetti a terra"],
    fixes: [
      "Letto fatto impeccabilmente: lenzuola bianche stirate, 2 cuscini, nessun capo d'abbigliamento.",
      "Scatta da un angolo più basso (altezza torace) — allarga visivamente la stanza.",
      "Rimuovi zaino e oggetti a terra. Il quadro Magritte è un asset — tienilo inquadrato.",
    ]
  },
  {
    title: "Bagno principale + bagno secondario",
    photo: `${BASE_URL}IMG_4786.jpg`,
    score: 50,
    scoreClass: "score-mid",
    pros: ["Doppio bagno — asset raro a Milano", "Box doccia in maiolica scura", "Sanitari sospesi moderni"],
    cons: ["Asciugamani appesi ovunque", "Prodotti personali esposti", "Foto scattata dalla porta"],
    fixes: [
      "Svuota completamente i piani: nessun prodotto, nessun asciugamano sul radiatore, nessun oggetto personale.",
      "Entra nel bagno e scatta dall'interno verso la finestra — sfrutta la luce naturale.",
      "Il doppio bagno è un selling point enorme a Milano. Vale 5–8% di premium sul prezzo — non ha una sola foto che lo valorizza.",
      "Aggiungi un asciugamano piegato di design (bianco o grigio cenere) come unico accessorio decorativo.",
    ]
  },
  {
    title: "Studio / seconda camera",
    photo: `${BASE_URL}IMG_4788.jpg`,
    score: 70,
    scoreClass: "score-good",
    pros: ["Standing desk — moderno", "Libreria curata", "Stampe Da Vinci — carattere"],
    cons: ["Cavi sul pavimento", "Divano come punto focale sbagliato"],
    fixes: [
      "Gestisci i cavi: uno strip organizer o anche un semplice nastro fa la differenza.",
      "Mostra anche la funzione camera: togli il laptop, scatta una versione 'stanza degli ospiti' con divano letto aperto.",
    ]
  },
  {
    title: "Terrazzo",
    photo: `${BASE_URL}IMG_4789.jpg`,
    score: 35,
    scoreClass: "score-bad",
    pros: ["Ampio — oltre 8 mq stimati", "Verde cortile visibile"],
    cons: ["Completamente vuoto", "Condizionatore dominante", "Luce piatta, cielo coperto", "Nessuna prospettiva sulla città"],
    fixes: [
      "Questo è lo scatto più penalizzante dell'intero set. Un terrazzo vuoto sembra abbandonato.",
      "Aggiungi almeno: 2 sedie e un tavolino minimal, 1 pianta. Costo: €80 da IKEA. ROI immediato.",
      "Scatta in golden hour (ora dopo il tramonto) — la luce piatta di giornata nuvolosa azzera il valore percepito.",
      "Cambia angolo: scatta dall'esterno verso le porte finestre per mostrare il rapporto interno/esterno.",
    ]
  },
];

const scoreColor = (score) => {
  if (score >= 70) return "#4ade80";
  if (score >= 50) return "#fb923c";
  return "#f87171";
};

export default function ReportFotoPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <style>{styles}</style>
      <nav className="nav">
        <a href="/" className="nav-logo">Real<span>AI</span>state</a>
        <a href="/immobile/1/vendi" className="nav-back">← Torna alla tua scheda</a>
      </nav>

      <div className="hero">
        <div className="eyebrow">Solo per te · Confidenziale</div>
        <h1 className="hero-title">Report foto AI<br />Via Capecelatro, 51</h1>
        <p className="hero-sub">L&apos;AI ha analizzato le tue 8 foto. Questo report è visibile solo a te — i compratori non lo vedono. Seguilo prima del reshoot.</p>
      </div>

      {/* OVERALL SCORE */}
      <div className="overall-card">
        <div className="overall-top">
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>RealAIstate Photo Score</div>
            <div className="overall-score">58<span>/100</span></div>
            <div style={{ fontSize: "0.85rem", color: "var(--orange)", marginTop: "0.3rem", fontWeight: 600 }}>Pubblicabile — ma lascia €€€ sul tavolo</div>
          </div>
          <div className="overall-verdict">
            Immobile con buone fondamenta: spazi renovati, materiali di qualità, layout funzionale. Ma le foto sono scattate da chi ci vive, non da chi vende. Disordine, angoli sbagliati e luce povera deprimono il valore percepito.
          </div>
        </div>
        <div className="score-bars">
          {rooms.map(r => (
            <div className="score-bar-row" key={r.title}>
              <div className="score-bar-label">{r.title.split(" ")[0]}{r.title.includes("+") ? " + " + r.title.split(" + ")[1]?.split(" ")[0] : ""}</div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${r.score}%`, background: scoreColor(r.score) }} />
              </div>
              <div className="score-bar-num" style={{ color: scoreColor(r.score) }}>{r.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIORITY */}
      <div className="priority-box">
        <div className="priority-title">⚡ Priorità interventi — prima del reshoot</div>
        {[
          "Rimuovi ogni traccia di vita quotidiana: rifiuti, vestiti, prodotti personali da tutti gli ambienti",
          "Stylea il terrazzo — è il punto più debole e uno dei più vendibili. €80 da IKEA, ROI immediato",
          "Rifai i bagni da zero — doppio bagno a Milano vale 5–8% di premium sul prezzo",
          "Reshoot cucina in condizioni di luce naturale al mattino con piano vuoto",
          "Considera un fotografo immobiliare professionista: ROI quasi certo su questa tipologia",
        ].map((item, i) => (
          <div className="priority-item" key={i}>
            <div className="priority-num">0{i + 1}</div>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* ROOM ANALYSIS */}
      <div className="content">
        <div className="section-label">Analisi per ambiente</div>

        {rooms.map((room, i) => (
          <div className="room-card" key={i}>
            <div className="room-header">
              <div className="room-title">{room.title}</div>
              <span className={`score-badge ${room.scoreClass}`}>{room.score}/100</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "1.2rem", marginBottom: "1rem" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={room.photo}
                  alt={room.title}
                  style={{ width: "160px", height: "110px", objectFit: "cover", borderRadius: "2px", display: "block" }}
                />
                <div style={{
                  position: "absolute", bottom: "0.4rem", right: "0.4rem",
                  background: scoreColor(room.score) === "#4ade80" ? "rgba(74,222,128,0.92)" : scoreColor(room.score) === "#fb923c" ? "rgba(251,146,60,0.92)" : "rgba(248,113,113,0.92)",
                  color: "#0a0a0a", padding: "0.15rem 0.5rem", borderRadius: "2px", fontSize: "0.7rem", fontWeight: 700
                }}>{room.score}/100</div>
              </div>
              <div>
                <div className="tag-row">
                  {room.pros.map(p => <span key={p} className="tag tag-pro">✓ {p}</span>)}
                  {room.cons.map(c => <span key={c} className="tag tag-con">✗ {c}</span>)}
                </div>
              </div>
            </div>
            <div className="fix-title">Da correggere prima di scattare</div>
            {room.fixes.map((fix, j) => (
              <div className="fix-item" key={j}>
                <span className="fix-arrow">→</span>
                <span>{fix}</span>
              </div>
            ))}
          </div>
        ))}

        {/* ROI BOX */}
        <div className="roi-box">
          <div className="roi-title">💰 Perché vale la pena farlo</div>
          <div className="roi-body">
            Un reshoot professionale costa <strong>€200–400</strong>. Su un appartamento da <strong>€400.000</strong> a Milano,
            foto migliori si traducono mediamente in <strong>tempi di vendita più brevi del 30%</strong> e
            un <strong>prezzo finale più alto del 2–5%</strong> — ovvero <strong>€8.000–20.000 in più</strong>.
            Il ROI del reshoot è praticamente garantito. Il terrazzo da solo, stylea correttamente,
            può valere <strong>€5.000–10.000</strong> di percezione in più sul prezzo finale.
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">Real<span>AI</span>state</div>
        <div>Report riservato · Via Capecelatro 51 · © 2025 RealAIstate</div>
      </footer>
    </>
  );
}
