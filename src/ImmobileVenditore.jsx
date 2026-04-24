import { useEffect, useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --gold: #c9a84c; --muted: #6b6b6b; --surface: #141414;
    --border: rgba(247,245,240,0.08); --green: #2d6a4f; --green-light: #4ade80;
    --warm: #1e1e1e; --blue: #3b82f6;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .nav-logo span { color: var(--red); }
  .nav-back { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .nav-back:hover { color: var(--white); }
  .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
  .nav-btn { background: transparent; border: 1px solid var(--border); color: rgba(247,245,240,0.5); padding: 0.5rem 1.2rem; border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.06em; }
  .nav-btn:hover { border-color: rgba(247,245,240,0.3); color: var(--white); }
  .nav-btn.primary { background: var(--red); border-color: var(--red); color: white; }
  .nav-btn.primary:hover { background: var(--red-dark); }
  .view-badge { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); padding: 0.4rem 1rem; border-radius: 2px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }

  .gallery { margin-top: 5rem; display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 280px 280px; gap: 3px; height: 563px; }
  .gallery-main { grid-row: 1 / 3; background: linear-gradient(135deg, #2a2420 0%, #1a1410 50%, #0f0c08 100%); position: relative; overflow: hidden; cursor: pointer; }
  .gallery-thumb { background: linear-gradient(135deg, #1e2020 0%, #141818 100%); position: relative; overflow: hidden; cursor: pointer; }
  .gallery-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
  .gallery-placeholder svg { width: 48px; height: 48px; opacity: 0.15; }
  .gallery-badge { position: absolute; bottom: 1.5rem; left: 1.5rem; z-index: 2; display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.8rem; border-radius: 2px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .badge-gold { background: var(--gold); color: var(--black); }
  .badge-green { background: var(--green); color: white; }
  .badge-red { background: var(--red); color: white; }

  .page-layout { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; padding: 3rem; max-width: 1400px; margin: 0 auto; }

  .prop-header { padding-bottom: 2rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
  .prop-location { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 0.6rem; }
  .prop-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); color: var(--white); line-height: 1; margin-bottom: 1rem; }
  .prop-price { font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem; color: var(--white); line-height: 1; }
  .prop-price-sub { font-size: 0.85rem; color: var(--muted); margin-top: 0.3rem; }
  .prop-specs { display: flex; gap: 2rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .spec { display: flex; flex-direction: column; gap: 0.2rem; }
  .spec-val { font-size: 1.1rem; font-weight: 600; color: var(--white); }
  .spec-label { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .spec-divider { width: 1px; background: var(--border); align-self: stretch; }

  /* STATS BAR */
  .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 3px; margin-bottom: 2rem; overflow: hidden; }
  .stat-item { background: var(--warm); padding: 1.2rem; text-align: center; }
  .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); line-height: 1; }
  .stat-num.gold { color: var(--gold); }
  .stat-num.green { color: var(--green-light); }
  .stat-label { font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-top: 0.3rem; }

  /* AI PANEL */
  .ai-panel { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 2rem; margin-bottom: 2rem; position: relative; overflow: hidden; }
  .ai-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--red)); }
  .ai-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
  .ai-label { display: flex; align-items: center; gap: 0.6rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); }
  .ai-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.4); } }
  .ai-summary { font-size: 0.95rem; line-height: 1.7; color: rgba(247,245,240,0.7); margin-bottom: 1.5rem; font-family: 'DM Serif Display', serif; font-style: italic; }
  .ai-scores { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .score-card { background: rgba(247,245,240,0.04); border: 1px solid var(--border); border-radius: 2px; padding: 1rem; text-align: center; }
  .score-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; line-height: 1; margin-bottom: 0.2rem; }
  .score-num.green { color: var(--green-light); }
  .score-num.gold { color: var(--gold); }
  .score-num.orange { color: #fb923c; }
  .score-label { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .score-bar-wrap { margin-top: 0.5rem; height: 3px; background: rgba(247,245,240,0.08); border-radius: 2px; overflow: hidden; }
  .score-bar-fill { height: 100%; border-radius: 2px; }
  .ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .ai-section-title { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.6rem; }
  .ai-item { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.83rem; line-height: 1.5; color: rgba(247,245,240,0.65); }

  /* MIGLIORA ANNUNCIO */
  .improve-section { margin-bottom: 2rem; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: var(--white); margin-bottom: 1rem; }
  .improve-item { background: var(--warm); border: 1px solid var(--border); border-radius: 2px; padding: 1.2rem; margin-bottom: 0.75rem; display: flex; align-items: flex-start; gap: 1rem; }
  .improve-icon { width: 32px; height: 32px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
  .improve-icon.warn { background: rgba(251,146,60,0.15); }
  .improve-icon.ok { background: rgba(74,222,128,0.12); }
  .improve-icon.tip { background: rgba(201,168,76,0.12); }
  .improve-title { font-size: 0.88rem; font-weight: 600; color: var(--white); margin-bottom: 0.25rem; }
  .improve-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; }

  /* DOMANDE ATTESE */
  .questions-section { margin-bottom: 2rem; }
  .question-item { border-top: 1px solid var(--border); padding: 1rem 0; display: flex; align-items: flex-start; gap: 1rem; }
  .question-item:last-child { border-bottom: 1px solid var(--border); }
  .question-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: var(--gold); flex-shrink: 0; width: 28px; }
  .question-text { font-size: 0.9rem; color: rgba(247,245,240,0.7); line-height: 1.5; padding-top: 0.15rem; }
  .question-hint { font-size: 0.75rem; color: var(--muted); margin-top: 0.3rem; font-style: italic; }

  /* DOCUMENTI */
  .docs-section { margin-bottom: 2rem; }
  .docs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; }
  .doc-item { background: var(--warm); border: 1px solid var(--border); border-radius: 2px; padding: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .doc-icon { width: 36px; height: 36px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .doc-icon.verified { background: rgba(45,106,79,0.2); }
  .doc-icon.missing { background: rgba(217,48,37,0.1); }
  .doc-name { font-size: 0.82rem; font-weight: 500; color: var(--white); margin-bottom: 0.2rem; }
  .doc-status { font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase; }
  .doc-status.ok { color: var(--green-light); }
  .doc-status.ko { color: var(--red); }
  .doc-action { font-size: 0.7rem; color: var(--red); cursor: pointer; text-decoration: underline; margin-top: 0.15rem; }

  /* CHAT */
  .chat-section { margin-bottom: 2rem; }
  .chat-box { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; }
  .chat-messages { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; min-height: 280px; max-height: 400px; overflow-y: auto; }
  .chat-msg { display: flex; flex-direction: column; gap: 0.3rem; max-width: 85%; }
  .chat-msg.ai { align-self: flex-start; }
  .chat-msg.user { align-self: flex-end; }
  .chat-msg-sender { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .chat-msg.ai .chat-msg-sender { color: var(--gold); }
  .chat-msg.user .chat-msg-sender { color: var(--muted); text-align: right; }
  .chat-msg-bubble { padding: 0.8rem 1rem; border-radius: 2px; font-size: 0.88rem; line-height: 1.6; }
  .chat-msg.ai .chat-msg-bubble { background: rgba(247,245,240,0.06); color: rgba(247,245,240,0.8); border-left: 2px solid var(--gold); }
  .chat-msg.user .chat-msg-bubble { background: rgba(201,168,76,0.1); color: rgba(247,245,240,0.8); border-right: 2px solid var(--gold); }
  .chat-msg-note { font-size: 0.68rem; color: var(--muted); font-style: italic; }
  .chat-input-row { display: flex; gap: 0; border-top: 1px solid var(--border); }
  .chat-input { flex: 1; background: transparent; border: none; padding: 1rem 1.2rem; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none; }
  .chat-input::placeholder { color: rgba(247,245,240,0.2); }
  .chat-send { background: var(--gold); border: none; color: var(--black); padding: 1rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: background 0.2s; letter-spacing: 0.06em; }
  .chat-send:hover:not(:disabled) { background: #b8962a; }
  .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
  .chat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: bounce 1.2s infinite; display: inline-block; }
  .chat-dot:nth-child(2) { animation-delay: 0.2s; }
  .chat-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
  .chat-typing { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0; }
  .chat-typing span { font-size: 0.75rem; color: var(--muted); font-style: italic; }

  /* STICKY */
  .right-col { position: relative; }
  .sticky-card { position: sticky; top: 6rem; background: var(--warm); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; }
  .sticky-card-top { background: rgba(201,168,76,0.06); padding: 1.5rem; border-bottom: 1px solid var(--border); }
  .sticky-price { font-family: 'Bebas Neue', sans-serif; font-size: 2.4rem; color: var(--white); line-height: 1; }
  .sticky-price-sub { font-size: 0.78rem; color: var(--muted); margin-top: 0.3rem; }
  .sticky-status { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2); color: var(--green-light); padding: 0.35rem 0.8rem; border-radius: 2px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.8rem; }
  .sticky-card-body { padding: 1.5rem; }
  .sticky-row { display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 0; border-bottom: 1px solid rgba(247,245,240,0.04); font-size: 0.85rem; }
  .sticky-row:last-of-type { border-bottom: none; }
  .sticky-row-label { color: var(--muted); }
  .sticky-row-val { color: var(--white); font-weight: 500; }
  .sticky-cta { padding: 1.5rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.75rem; }
  .btn-gold { background: var(--gold); color: var(--black); border: none; padding: 0.9rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: background 0.2s; width: 100%; }
  .btn-gold:hover { background: #b8962a; }
  .btn-outline { background: transparent; color: var(--white); border: 1px solid var(--border); padding: 0.9rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 400; cursor: pointer; border-radius: 2px; transition: all 0.2s; width: 100%; }
  .btn-outline:hover { border-color: rgba(247,245,240,0.3); }

  .footer { background: var(--black); padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); font-size: 0.75rem; color: rgba(247,245,240,0.2); margin-top: 4rem; }
  .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .footer-logo span { color: var(--red); }

  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-actions .nav-btn:not(.primary) { display: none; }
    .gallery { grid-template-columns: 1fr; grid-template-rows: 260px; height: 260px; }
    .gallery-thumb { display: none; }
    .page-layout { grid-template-columns: 1fr; padding: 1.5rem; gap: 2rem; }
    .right-col { order: -1; }
    .sticky-card { position: static; }
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .ai-scores { grid-template-columns: repeat(3,1fr); }
    .ai-grid { grid-template-columns: 1fr; }
    .docs-grid { grid-template-columns: 1fr; }
    .footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
  }
`;

const BASE_URL = "https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/immobili/";

const immobile = {
  titolo: "Appartamento con garage e terrazzino",
  zona: "Milano · San Siro",
  indirizzo: "Via Alfonso Capecelatro, 51",
  prezzo: 400000,
  superficie: 67,
  superficie_catastale: 69,
  superficie_calpestabile: 65,
  riscaldamento: "Autonomo",
  acqua_calda: "Autonoma",
  disponibilita_rogito: "Immediata",
  locali: 2,
  bagni: 1,
  piano: "2° su 5",
  classe_energetica: "C",
  spese_condominio: 200,
  anno_costruzione: 2010,
  anno_ristrutturazione: 2023,
  scores: { prezzo: 88, investimento: 81, qualita: 88 },
  ai_summary: "Il tuo annuncio è in buona forma. Il prezzo è allineato al mercato di San Siro per questa metratura. La ristrutturazione 2023 è un punto di forza da valorizzare maggiormente. Mancano ancora 2 documenti — completali per ottenere il badge 'Immobile Verificato' e aumentare le probabilità di contatto.",
  punti_forza: [
    "Costruzione 2010 — edificio moderno",
    "Ristrutturazione interna 2023",
    "Garage 20 mq incluso — raro in zona",
    "Giardino condominiale",
    "Ascensore presente",
  ],
  criticita: [
    "Classe energetica C — menziona il riscaldamento",
    "2 documenti ancora mancanti",
    "Foto del garage non ancora caricate",
  ],
  miglioramenti: [
    { tipo: "warn", icon: "📸", titolo: "Aggiungi foto del garage", desc: "Il garage è un punto di forza chiave — non ha ancora una foto. Gli acquirenti lo cercano." },
    { tipo: "warn", icon: "📄", titolo: "Carica Regolamento Condominiale", desc: "Mancano ancora 2 documenti. Senza badge Verificato ricevi il 40% di contatti in meno." },
    { tipo: "tip", icon: "✍️", titolo: "Valorizza la ristrutturazione 2023", desc: "Menziona cosa è stato rifatto — cucina, bagno, impianti? I dettagli aumentano la fiducia." },
    { tipo: "ok", icon: "✓", titolo: "Prezzo allineato al mercato", desc: "Il Fair Price Score è 88/100. Sei nella fascia giusta per San Siro con questa metratura." },
  ],
  domande_attese: [
    { q: "Ci sono lavori straordinari in programma?", hint: "Prepara: verbale ultima assemblea condominiale" },
    { q: "Le spese di €200/mese includono il riscaldamento?", hint: "Prepara: dettaglio spese condominiali" },
    { q: "Il garage è in proprietà separata o pertinenza?", hint: "Prepara: visura catastale del garage" },
    { q: "Cosa è stato rifatto nella ristrutturazione 2023?", hint: "Prepara: lista interventi — cucina, bagno, impianti" },
    { q: "Il terrazzino è privato? Quanti mq?", hint: "Prepara: planimetria con metrature" },
  ],
  documenti: [
    { nome: "Visura Catastale", verificato: true },
    { nome: "Planimetria Catastale", verificato: true },
    { nome: "APE — Classe Energetica C", verificato: true },
    { nome: "Atto di Provenienza", verificato: true },
    { nome: "Regolamento Condominiale", verificato: false },
    { nome: "Dichiarazione Ipoteche", verificato: false },
  ],
};

const initialMessages = [
  {
    role: "ai",
    text: "Ciao! Sono il tuo assistente AI. Sto già rispondendo alle domande dei potenziali compratori sul tuo immobile. Ti coinvolgo solo quando serve davvero la tua risposta diretta. Hai domande su come migliorare l'annuncio?",
    note: null,
  }
];

function VenditoreChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg, note: null }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat-venditore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domanda: userMsg, immobile: { indirizzo: immobile.indirizzo, prezzo: immobile.prezzo, superficie: immobile.superficie_catastale, fair_price_score: immobile.scores.prezzo } })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.risposta, note: null }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Errore di connessione. Riprova.", note: null }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div className={`chat-msg ${m.role}`} key={i}>
            <div className="chat-msg-sender">{m.role === "ai" ? "✦ AI RealAIstate" : "Tu"}</div>
            <div className="chat-msg-bubble">{m.text}</div>
            {m.note && <div className="chat-msg-note">{m.note}</div>}
          </div>
        ))}
        {loading && (
          <div className="chat-msg ai">
            <div className="chat-msg-sender">✦ AI RealAIstate</div>
            <div className="chat-typing">
              <div className="chat-dot" /><div className="chat-dot" /><div className="chat-dot" />
              <span>Sto elaborando...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-row">
        <input className="chat-input" placeholder="Chiedi come migliorare l'annuncio..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>Invia →</button>
      </div>
    </div>
  );
}

export default function ImmobileVenditore() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const docsVerified = immobile.documenti.filter(d => d.verificato).length;
  const docsTotal = immobile.documenti.length;

  return (
    <>
      <style>{styles}</style>
      <nav className="nav">
        <a href="/" className="nav-logo">Real<span>AI</span>state</a>
        <a href="/" className="nav-back">← I miei annunci</a>
        <div className="nav-actions">
          <span className="view-badge">👤 Vista Venditore</span>
          <a href="/compra/1" className="nav-btn">Vedi come compratore</a>
          <button className="nav-btn primary">Modifica annuncio</button>
        </div>
      </nav>

      <div className="gallery">
        <div className="gallery-main" style={{ background: `url(${BASE_URL}IMG_4782.jpg) center/cover no-repeat`, position: "relative" }}>
          <div className="gallery-badge">
            <span className="badge badge-gold">✦ Vista Venditore</span>
            <span className="badge badge-green">{docsVerified}/{docsTotal} Documenti</span>
          </div>
          <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", background: "rgba(251,146,60,0.92)", color: "#0a0a0a", padding: "0.3rem 0.8rem", borderRadius: "2px", fontSize: "0.82rem", fontWeight: 700, zIndex: 2 }}>Soggiorno 65/100</div>
        </div>
        <div className="gallery-thumb" style={{ background: `url(${BASE_URL}IMG_4788.jpg) center/cover no-repeat`, position: "relative" }}>
          <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", background: "rgba(74,222,128,0.92)", color: "#0a0a0a", padding: "0.2rem 0.5rem", borderRadius: "2px", fontSize: "0.7rem", fontWeight: 700 }}>Studio 70/100</div>
        </div>
        <div className="gallery-thumb" style={{ background: `url(${BASE_URL}IMG_4789.jpg) center/cover no-repeat`, position: "relative" }}>
          <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", background: "rgba(248,113,113,0.92)", color: "#0a0a0a", padding: "0.2rem 0.5rem", borderRadius: "2px", fontSize: "0.7rem", fontWeight: 700 }}>Terrazzo 35/100</div>
        </div>
      </div>

      <div className="page-layout">
        <div>
          <div className="prop-header">
            <div className="prop-location">📍 {immobile.zona}</div>
            <h1 className="prop-title">{immobile.titolo}</h1>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem" }}>{immobile.indirizzo}</div>
            <div className="prop-price">€ {immobile.prezzo.toLocaleString("it-IT")}</div>
            <div className="prop-price-sub">€ {Math.round(immobile.prezzo / immobile.superficie_catastale).toLocaleString("it-IT")} / m² · Pubblicato il 13 aprile 2025</div>
            <div className="prop-specs">
              <div className="spec"><div className="spec-val">{immobile.superficie_catastale} m²</div><div className="spec-label">Superficie</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.locali}</div><div className="spec-label">Locali</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.piano}</div><div className="spec-label">Piano</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">Cl. {immobile.classe_energetica}</div><div className="spec-label">Energia</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.anno_ristrutturazione}</div><div className="spec-label">Rist.</div></div>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-bar">
            <div className="stat-item"><div className="stat-num gold">47</div><div className="stat-label">Visualizzazioni</div></div>
            <div className="stat-item"><div className="stat-num green">8</div><div className="stat-label">Salvati</div></div>
            <div className="stat-item"><div className="stat-num">3</div><div className="stat-label">Richieste contatto</div></div>
            <div className="stat-item"><div className="stat-num gold">88</div><div className="stat-label">Fair Price Score</div></div>
          </div>

          {/* AI PANEL */}
          <div className="ai-panel">
            <div className="ai-panel-header">
              <div className="ai-label"><div className="ai-dot" /> Analisi AI del tuo annuncio</div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Aggiornata oggi</div>
            </div>
            <div className="ai-summary">{immobile.ai_summary}</div>
            <div className="ai-scores">
              {[
                { label: "Fair Price Score", val: immobile.scores.prezzo, cls: "green", color: "#4ade80" },
                { label: "Investment Score", val: immobile.scores.investimento, cls: "gold", color: "#c9a84c" },
                { label: "Qualità Annuncio", val: immobile.scores.qualita, cls: "green", color: "#4ade80" },
              ].map(s => (
                <div className="score-card" key={s.label}>
                  <div className={`score-num ${s.cls}`}>{s.val}</div>
                  <div className="score-label">{s.label}</div>
                  <div className="score-bar-wrap"><div className="score-bar-fill" style={{ width: `${s.val}%`, background: s.color }} /></div>
                </div>
              ))}
            </div>
            <div className="ai-grid">
              <div>
                <div className="ai-section-title">✓ Punti di forza</div>
                {immobile.punti_forza.map((p, i) => (
                  <div className="ai-item" key={i}><span style={{ color: "#4ade80" }}>→</span><span>{p}</span></div>
                ))}
              </div>
              <div>
                <div className="ai-section-title">⚠ Da migliorare</div>
                {immobile.criticita.map((c, i) => (
                  <div className="ai-item" key={i}><span style={{ color: "#fb923c" }}>→</span><span>{c}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* PHOTO SCORE */}
          <div className="improve-section">
            <h2 className="section-title">Analisi foto AI</h2>
            <div style={{ background: "var(--warm)", border: "1px solid var(--border)", borderRadius: "3px", padding: "1.5rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.3rem" }}>📸 Photo Score</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "#fb923c", lineHeight: 1 }}>58<span style={{ fontSize: "1.2rem", color: "var(--muted)" }}>/100</span></div>
                  <div style={{ fontSize: "0.78rem", color: "#fb923c", marginTop: "0.2rem" }}>Pubblicabile — ma lascia €€€ sul tavolo</div>
                </div>
                <a href="/immobile/1/report-foto" style={{ background: "var(--red)", color: "white", padding: "0.7rem 1.2rem", borderRadius: "2px", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}>
                  Vedi report completo →
                </a>
              </div>
              <div style={{ fontSize: "0.82rem", color: "rgba(247,245,240,0.5)", lineHeight: 1.6, marginBottom: "1rem", fontStyle: "italic", fontFamily: "'DM Serif Display', serif" }}>
                Immobile con buone fondamenta: spazi renovati, materiali di qualità, layout funzionale. Le foto sono scattate da chi ci vive, non da chi vende — con un reshoot lo score sale a 85+.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "Studio", score: 70, color: "#4ade80" },
                  { label: "Soggiorno/Cucina", score: 65, color: "#4ade80" },
                  { label: "Corridoio", score: 60, color: "#fb923c" },
                  { label: "Camera", score: 55, color: "#fb923c" },
                  { label: "Bagni", score: 50, color: "#fb923c" },
                  { label: "Terrazzo", score: 35, color: "#f87171" },
                ].map(({ label, score, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", width: "120px", flexShrink: 0 }}>{label}</div>
                    <div style={{ flex: 1, height: "4px", background: "rgba(247,245,240,0.06)", borderRadius: "2px" }}>
                      <div style={{ height: "4px", borderRadius: "2px", background: color, width: `${score}%`, transition: "width 1s ease" }} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color, fontWeight: 600, width: "30px", textAlign: "right" }}>{score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIGLIORA ANNUNCIO */}
          <div className="improve-section">
            <h2 className="section-title">Come migliorare l&apos;annuncio</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1rem" }}>Suggerimenti AI per aumentare le probabilità di vendita.</div>
            {immobile.miglioramenti.map((m, i) => (
              <div className="improve-item" key={i}>
                <div className={`improve-icon ${m.tipo}`}>{m.icon}</div>
                <div>
                  <div className="improve-title">{m.titolo}</div>
                  <div className="improve-desc">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* DOMANDE ATTESE */}
          <div className="questions-section">
            <h2 className="section-title">Preparati a queste domande</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
              L&apos;AI ha analizzato il tuo annuncio e prevede queste domande dai compratori.
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--gold)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>✦</span><span>Le stesse domande vengono mostrate ai compratori come suggerimento pre-visita.</span>
            </div>
            {immobile.domande_attese.map((item, i) => (
              <div className="question-item" key={i}>
                <div className="question-num">0{i + 1}</div>
                <div>
                  <div className="question-text">{item.q}</div>
                  <div className="question-hint">💡 {item.hint}</div>
                </div>
              </div>
            ))}
          </div>

          {/* DOCUMENTI */}
          <div className="docs-section">
            <h2 className="section-title">Documenti</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
              {docsVerified}/{docsTotal} documenti caricati.
            </div>
            {docsVerified < docsTotal && (
              <div style={{ fontSize: "0.82rem", color: "var(--red)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>⚠</span><span>Completa la documentazione entro 30 giorni per ottenere il badge Immobile Verificato.</span>
              </div>
            )}
            <div className="docs-grid">
              {immobile.documenti.map((doc, i) => (
                <div className="doc-item" key={i}>
                  <div className={`doc-icon ${doc.verificato ? "verified" : "missing"}`}>{doc.verificato ? "✓" : "✗"}</div>
                  <div>
                    <div className="doc-name">{doc.nome}</div>
                    <div className={`doc-status ${doc.verificato ? "ok" : "ko"}`}>{doc.verificato ? "Verificato" : "Mancante"}</div>
                    {!doc.verificato && <div className="doc-action">Carica ora →</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT VENDITORE */}
          <div className="chat-section">
            <h2 className="section-title">Il tuo assistente AI</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
              L&apos;AI risponde autonomamente alle domande dei compratori sul tuo immobile.
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--gold)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>✦</span><span>Verrai coinvolto solo quando la risposta richiede la tua conoscenza diretta.</span>
            </div>
            <VenditoreChat />
          </div>
        </div>

        {/* RIGHT STICKY */}
        <div className="right-col">
          <div className="sticky-card">
            <div className="sticky-card-top">
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>Il tuo annuncio</div>
              <div className="sticky-price">€ {immobile.prezzo.toLocaleString("it-IT")}</div>
              <div className="sticky-price-sub">€ {Math.round(immobile.prezzo / immobile.superficie).toLocaleString("it-IT")} / m²</div>
              <div className="sticky-status">● Pubblicato · Attivo</div>
            </div>
            <div className="sticky-card-body">
              {[
                ["Visualizzazioni", "47 (+12 oggi)"],
                ["Salvati", "8"],
                ["Richieste contatto", "3"],
                ["Fair Price Score", "88/100"],
                ["Documenti", `${docsVerified}/${docsTotal} verificati`],
                ["Pubblicato il", "13 aprile 2025"],
              ].map(([k, v]) => (
                <div className="sticky-row" key={k}>
                  <span className="sticky-row-label">{k}</span>
                  <span className="sticky-row-val">{v}</span>
                </div>
              ))}
            </div>
            <div className="sticky-cta">
              <button className="btn-gold">Modifica annuncio →</button>
              <button className="btn-outline">Carica documenti mancanti</button>
              <button className="btn-outline">Vedi come ti vedono i compratori</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">Real<span>AI</span>state</div>
        <div style={{ color: "rgba(247,245,240,0.2)" }}>© 2025 RealAIstate · realaistate.ai</div>
      </footer>
    </>
  );
}
