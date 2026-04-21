import { useEffect, useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; max-width: 100%; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --gold: #c9a84c; --muted: #6b6b6b; --surface: #141414;
    --border: rgba(247,245,240,0.08); --green: #2d6a4f; --green-light: #4ade80;
    --warm: #1e1e1e;
  }
  html { scroll-behavior: smooth; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  /* NAV */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .nav-logo span { color: var(--red); }
  .nav-back { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: color 0.2s; }
  .nav-back:hover { color: var(--white); }
  .nav-actions { display: flex; gap: 0.75rem; }
  .nav-btn { background: transparent; border: 1px solid var(--border); color: rgba(247,245,240,0.5); padding: 0.5rem 1.2rem; border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s; letter-spacing: 0.06em; }
  .nav-btn:hover { border-color: rgba(247,245,240,0.3); color: var(--white); }
  .nav-btn.primary { background: var(--red); border-color: var(--red); color: white; }
  .nav-btn.primary:hover { background: var(--red-dark); }

  /* GALLERY */
  .gallery { margin-top: 5rem; display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 280px 280px; gap: 3px; height: 563px; }
  .gallery-main { grid-row: 1 / 3; background: linear-gradient(135deg, #2a2420 0%, #1a1410 50%, #0f0c08 100%); position: relative; overflow: hidden; cursor: pointer; }
  .gallery-main::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%); }
  .gallery-thumb { background: linear-gradient(135deg, #1e2020 0%, #141818 100%); position: relative; overflow: hidden; cursor: pointer; }
  .gallery-thumb:hover { filter: brightness(1.15); }
  .gallery-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
  .gallery-placeholder svg { width: 48px; height: 48px; opacity: 0.15; }
  .gallery-badge { position: absolute; bottom: 1.5rem; left: 1.5rem; z-index: 2; display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.8rem; border-radius: 2px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .badge-verified { background: var(--green); color: white; }
  .badge-score { background: var(--gold); color: var(--black); }
  .badge-new { background: var(--red); color: white; }
  .gallery-count { position: absolute; bottom: 1.5rem; right: 1.5rem; z-index: 2; background: rgba(10,10,10,0.8); color: white; padding: 0.4rem 0.8rem; border-radius: 2px; font-size: 0.75rem; font-weight: 500; }

  /* LAYOUT */
  .page-layout { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; padding: 3rem; max-width: 1400px; margin: 0 auto; }

  /* LEFT COLUMN */
  .left-col {}

  /* HEADER */
  .prop-header { padding-bottom: 2rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
  .prop-location { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; }
  .prop-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); color: var(--white); line-height: 1; margin-bottom: 1rem; }
  .prop-price { font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem; color: var(--white); line-height: 1; }
  .prop-price-sub { font-size: 0.85rem; color: var(--muted); margin-top: 0.3rem; }
  .prop-specs { display: flex; gap: 2rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .spec { display: flex; flex-direction: column; gap: 0.2rem; }
  .spec-val { font-size: 1.1rem; font-weight: 600; color: var(--white); }
  .spec-label { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .spec-divider { width: 1px; background: var(--border); align-self: stretch; }

  /* AI ANALYSIS PANEL */
  .ai-panel { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 2rem; margin-bottom: 2rem; position: relative; overflow: hidden; }
  .ai-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--red), var(--gold)); }
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
  .score-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

  .ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .ai-section { }
  .ai-section-title { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.6rem; }
  .ai-item { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.83rem; line-height: 1.5; color: rgba(247,245,240,0.65); }
  .ai-item-icon { flex-shrink: 0; margin-top: 0.1rem; }

  /* QUESTIONS */
  .questions-section { margin-bottom: 2rem; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: var(--white); margin-bottom: 1rem; }
  .question-item { border-top: 1px solid var(--border); padding: 1rem 0; display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; }
  .question-item:last-child { border-bottom: 1px solid var(--border); }
  .question-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: var(--red); flex-shrink: 0; width: 28px; }
  .question-text { font-size: 0.9rem; color: rgba(247,245,240,0.7); line-height: 1.5; padding-top: 0.15rem; }

  /* DOCUMENTS */
  .docs-section { margin-bottom: 2rem; }
  .docs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; }
  .doc-item { background: var(--warm); border: 1px solid var(--border); border-radius: 2px; padding: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .doc-icon { width: 36px; height: 36px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .doc-icon.verified { background: rgba(45,106,79,0.2); }
  .doc-icon.missing { background: rgba(217,48,37,0.1); }
  .doc-info { flex: 1; min-width: 0; }
  .doc-name { font-size: 0.82rem; font-weight: 500; color: var(--white); margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .doc-status { font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase; }
  .doc-status.ok { color: var(--green-light); }
  .doc-status.ko { color: var(--red); }

  /* COMPARABLES */
  .comps-section { margin-bottom: 2rem; }
  .comp-item { background: var(--warm); border: 1px solid var(--border); border-radius: 2px; padding: 1.2rem; margin-bottom: 0.75rem; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 1rem; }
  .comp-addr { font-size: 0.85rem; color: rgba(247,245,240,0.7); margin-bottom: 0.3rem; }
  .comp-specs { font-size: 0.75rem; color: var(--muted); }
  .comp-price { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: var(--white); text-align: right; }
  .comp-sqm { font-size: 0.72rem; color: var(--muted); text-align: right; }
  .comp-delta { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 2px; margin-top: 0.3rem; display: inline-block; }
  .comp-delta.higher { background: rgba(217,48,37,0.1); color: var(--red); }
  .comp-delta.lower { background: rgba(45,106,79,0.15); color: var(--green-light); }
  .comp-delta.similar { background: rgba(201,168,76,0.1); color: var(--gold); }

  /* RIGHT COLUMN — STICKY CARD */
  .right-col { position: relative; }
  .sticky-card { position: sticky; top: 6rem; background: var(--warm); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; }
  .sticky-card-top { background: rgba(247,245,240,0.03); padding: 1.5rem; border-bottom: 1px solid var(--border); }
  .sticky-price { font-family: 'Bebas Neue', sans-serif; font-size: 2.4rem; color: var(--white); line-height: 1; }
  .sticky-price-sub { font-size: 0.78rem; color: var(--muted); margin-top: 0.3rem; }
  .sticky-card-body { padding: 1.5rem; }
  .sticky-row { display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 0; border-bottom: 1px solid rgba(247,245,240,0.04); font-size: 0.85rem; }
  .sticky-row:last-of-type { border-bottom: none; }
  .sticky-row-label { color: var(--muted); }
  .sticky-row-val { color: var(--white); font-weight: 500; }
  .sticky-cta { padding: 1.5rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.75rem; }
  .btn-primary { background: var(--red); color: white; border: none; padding: 0.9rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: background 0.2s; width: 100%; }
  .btn-primary:hover { background: var(--red-dark); }
  .btn-secondary { background: transparent; color: var(--white); border: 1px solid var(--border); padding: 0.9rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 400; cursor: pointer; border-radius: 2px; transition: all 0.2s; width: 100%; }
  .btn-secondary:hover { border-color: rgba(247,245,240,0.3); }

  .verified-box { background: rgba(45,106,79,0.12); border: 1px solid rgba(45,106,79,0.3); border-radius: 2px; padding: 1rem 1.5rem; margin: 0 1.5rem 1.5rem; }
  .verified-box-title { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green-light); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.4rem; }
  .verified-box-text { font-size: 0.78rem; color: rgba(247,245,240,0.5); line-height: 1.5; }

  /* MAP */
  .map-section { margin-bottom: 2rem; }
  .map-container { border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
  .map-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); }
  .map-tab { padding: 0.7rem 1.4rem; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(247,245,240,0.35); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; font-family: 'DM Sans', sans-serif; }
  .map-tab.active { color: var(--white); border-bottom-color: var(--red); }
  .map-tab:hover { color: rgba(247,245,240,0.7); }
  .map-frame { width: 100%; height: 380px; border: none; display: block; }

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
  .chat-msg.user .chat-msg-bubble { background: rgba(217,48,37,0.1); color: rgba(247,245,240,0.8); border-right: 2px solid var(--red); }
  .chat-msg-note { font-size: 0.68rem; color: var(--muted); font-style: italic; }
  .chat-input-row { display: flex; gap: 0; border-top: 1px solid var(--border); }
  .chat-input { flex: 1; background: transparent; border: none; padding: 1rem 1.2rem; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none; }
  .chat-input::placeholder { color: rgba(247,245,240,0.2); }
  .chat-send { background: var(--red); border: none; color: white; padding: 1rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: background 0.2s; letter-spacing: 0.06em; }
  .chat-send:hover:not(:disabled) { background: var(--red-dark); }
  .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
  .chat-typing { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0; }
  .chat-typing span { font-size: 0.75rem; color: var(--muted); font-style: italic; }

  .chat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: bounce 1.2s infinite; display: inline-block; }
  .chat-dot:nth-child(2) { animation-delay: 0.2s; }
  .chat-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }

  /* FOOTER */
  .footer { background: var(--black); padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); font-size: 0.75rem; color: rgba(247,245,240,0.2); margin-top: 4rem; }
  .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); }
  .footer-logo span { color: var(--red); }

  /* MOBILE */
  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-actions { display: none; }
    .gallery { grid-template-columns: 1fr; grid-template-rows: 260px; height: 260px; }
    .gallery-thumb { display: none; }
    .page-layout { grid-template-columns: 1fr; padding: 1.5rem; gap: 2rem; }
    .right-col { order: -1; }
    .sticky-card { position: static; }
    .ai-scores { grid-template-columns: repeat(3,1fr); }
    .ai-grid { grid-template-columns: 1fr; }
    .docs-grid { grid-template-columns: 1fr; }
    .comp-item { grid-template-columns: 1fr; gap: 0.5rem; }
    .map-frame { height: 260px; }
    .chat-messages { max-height: 300px; }
    .sticky-card-body { padding: 1rem; }
    .sticky-cta { padding: 1rem; }
    .verified-box { margin: 0 1rem 1rem; }
    .prop-specs { gap: 1rem; flex-wrap: wrap; }
    .footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
  }
`;

const immobile = {
  id: 1,
  titolo: "Appartamento con garage e terrazzino",
  zona: "Milano · San Siro",
  indirizzo: "Via Alfonso Capecelatro, 51",
  prezzo: 400000,
  superficie: 67,
  locali: 2,
  bagni: 1,
  piano: "2° su 5",
  ascensore: true,
  garage: true,
  terrazzo: true,
  giardino_condominiale: true,
  classe_energetica: "C",
  spese_condominio: 200,
  anno_costruzione: 2010,
  anno_ristrutturazione: 2023,
  scores: {
    prezzo: 88,
    investimento: 81,
    qualita: 58,
  },
  ai_summary: "Scorporando il valore del garage (20 mq × €2.400/mq OMI = €48.000), il prezzo dell'appartamento puro è €352.000 — ovvero €5.254/mq. Il range OMI per abitazioni civili Ottimo in zona D24 è €4.300–€6.300/mq: il prezzo si posiziona quasi esattamente al centro (47,7%). Le foto attuali penalizzano il valore percepito — con un reshoot professionale lo score qualità sale a 85+. Fonte: Agenzia delle Entrate – OMI, zona D24, 2° sem. 2025.",
  punti_forza: [
    "Prezzo al centro del range OMI — €5.254/mq su range €4.300–€6.300 (zona D24, 2025)",
    "Garage scorporato: valore OMI €48.000 — incluso nel prezzo totale",
    "Doppio bagno — asset raro, vale 5–8% di premium a Milano",
    "Standing desk + libreria curata nello studio — carattere",
    "Terrazzo con accesso doppio dal soggiorno — oltre 8 mq stimati",
    "Ristrutturazione 2023 — materiali di qualità, pavimento legno chiaro",
  ],
  criticita: [
    "Foto terrazzo 35/100 — completamente vuoto, condizionatore dominante",
    "Foto bagni 50/100 — prodotti personali esposti, asciugamani ovunque",
    "Foto camera 55/100 — letto disfatto, vestiti visibili",
    "Reshoot necessario prima della pubblicazione definitiva",
  ],
  miglioramenti_foto: [
    { stanza: "Terrazzo", score: 35, fixes: ["Aggiungi 2 sedie + tavolino + 1 pianta (€80 da IKEA)", "Scatta in golden hour — non con cielo coperto", "Cambia angolo: dall'esterno verso le porte finestre"] },
    { stanza: "Bagni", score: 50, fixes: ["Svuota completamente i piani — zero prodotti personali", "Foto 5: scatta dall'interno verso la finestra", "Il doppio bagno è un selling point enorme — valorizzalo"] },
    { stanza: "Camera", score: 55, fixes: ["Letto fatto impeccabilmente: lenzuola bianche stirate", "Scatta da angolo più basso (altezza torace)", "Rimuovi zaino e oggetti a terra — tieni il Magritte"] },
    { stanza: "Soggiorno/Cucina", score: 65, fixes: ["Rimuovi bidoni spazzatura — primo elemento che l'occhio vede", "Libera piano cottura e bancone", "Apri porte terrazzo per portare luce naturale"] },
    { stanza: "Studio", score: 70, fixes: ["Gestisci i cavi con uno strip organizer", "Scatta versione 'camera ospiti' con divano letto aperto"] },
  ],
  domande: [
    "Ci sono lavori straordinari deliberati o in programma in condominio?",
    "Le spese condominiali di €200/mese includono il riscaldamento?",
    "Il garage è in proprietà separata o pertinenza dell'appartamento?",
    "La ristrutturazione 2023 ha incluso anche impianto elettrico e idraulico?",
    "Il terrazzino è privato o condiviso? Qual è la metratura esatta?",
  ],
  documenti: [
    { nome: "Visura Catastale", verificato: true },
    { nome: "Planimetria Catastale", verificato: true },
    { nome: "APE — Classe Energetica C", verificato: true },
    { nome: "Atto di Provenienza", verificato: true },
    { nome: "Regolamento Condominiale", verificato: false },
    { nome: "Dichiarazione Ipoteche", verificato: false },
  ],
  comparabili: [
    { indirizzo: "Via Giambellino, 34", mq: 70, prezzo: 420000, locali: 2, delta: "higher" },
    { indirizzo: "Via Odazio, 8", mq: 65, prezzo: 375000, locali: 2, delta: "lower" },
    { indirizzo: "Via Segneri, 19", mq: 68, prezzo: 405000, locali: 2, delta: "similar" },
  ],
};

const initialMessages = [
  {
    role: "ai",
    text: "Ciao! Sono l'assistente AI di RealAIstate. Posso risponderti subito su prezzi, documenti e caratteristiche dell'immobile. Per domande al venditore, medierò io la conversazione. Come posso aiutarti?",
    note: null,
  }
];

function AiChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg, note: "In attesa di revisione AI" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat-immobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domanda: userMsg,
          immobile: {
            indirizzo: immobile.indirizzo,
            zona: immobile.zona,
            prezzo: immobile.prezzo,
            superficie: immobile.superficie,
            locali: immobile.locali,
            piano: immobile.piano,
            classe_energetica: immobile.classe_energetica,
            anno_costruzione: immobile.anno_costruzione,
            anno_ristrutturazione: immobile.anno_ristrutturazione,
            spese_condominio: immobile.spese_condominio,
            garage: immobile.garage,
            fair_price_score: immobile.scores.prezzo,
          }
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], note: null },
        { role: "ai", text: data.risposta, note: data.forwarded ? "Inoltrato al venditore — risponderà entro 24h" : null }
      ]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Qualcosa è andato storto. Riprova tra un momento.", note: null }]);
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
        <input
          className="chat-input"
          placeholder="Chiedi qualcosa sull'immobile..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
          Invia →
        </button>
      </div>
    </div>
  );
}

export default function ImmobilePage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("analisi");
  const [mapTab, setMapTab] = useState("streetview");
  const chatRef = useRef(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const docsVerified = immobile.documenti.filter(d => d.verificato).length;
  const docsTotal = immobile.documenti.length;
  const allVerified = docsVerified === docsTotal;

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">Real<span>AI</span>state</a>
        <a href="/" className="nav-back">← Torna alla ricerca</a>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setSaved(!saved)}>
            {saved ? "♥ Salvato" : "♡ Salva"}
          </button>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button className="nav-btn" style={{ opacity: 0.5, cursor: "not-allowed" }} title="Prossimamente">⤢ Confronta</button>
          </div>
          <a href="/vendi" className="nav-btn" style={{ color: "var(--red)", borderColor: "var(--red)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Vendi casa</a>
          <button className="nav-btn primary" onClick={scrollToChat}>Contatta venditore</button>
        </div>
      </nav>

      {/* GALLERY */}
      <div className="gallery">
        <div className="gallery-main">
          <div className="gallery-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
          <div className="gallery-badge">
            {allVerified
              ? <span className="badge badge-verified">✓ Immobile Verificato</span>
              : <span className="badge badge-score">{docsVerified}/{docsTotal} Documenti</span>
            }
            <span className="badge badge-score">Fair Price {immobile.scores.prezzo}/100</span>
            <span className="badge badge-new">Nuovo</span>
          </div>
          <div className="gallery-count">1 / 8 foto</div>
        </div>
        <div className="gallery-thumb">
          <div className="gallery-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          </div>
        </div>
        <div className="gallery-thumb">
          <div className="gallery-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="page-layout">

        {/* LEFT */}
        <div className="left-col">

          {/* HEADER */}
          <div className="prop-header">
            <div className="prop-location">📍 {immobile.zona}</div>
            <h1 className="prop-title">{immobile.titolo}</h1>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem" }}>{immobile.indirizzo}</div>
            <div className="prop-price">€ {immobile.prezzo.toLocaleString("it-IT")}</div>
            <div className="prop-price-sub">€ {Math.round(immobile.prezzo / immobile.superficie).toLocaleString("it-IT")} / m² · Spese cond. €{immobile.spese_condominio}/mese</div>
            <div className="prop-specs">
              <div className="spec"><div className="spec-val">{immobile.superficie} m²</div><div className="spec-label">Superficie</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.locali}</div><div className="spec-label">Locali</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.bagni}</div><div className="spec-label">Bagni</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.piano}</div><div className="spec-label">Piano</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">Cl. {immobile.classe_energetica}</div><div className="spec-label">Energia</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.anno_ristrutturazione}</div><div className="spec-label">Rist.</div></div>
            </div>
          </div>

          {/* DESCRIZIONE */}
          <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>Descrizione</h2>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.8", color: "rgba(247,245,240,0.7)", marginBottom: "1rem" }}>
              Appartamento ristrutturato nel 2023 al secondo piano di una palazzina con ascensore in Via Alfonso Capecelatro, nel quartiere San Siro. La ristrutturazione è stata eseguita con materiali di qualità: pavimento in legno chiaro, impianti a norma, finiture curate in ogni stanza.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.8", color: "rgba(247,245,240,0.7)", marginBottom: "1rem" }}>
              L'appartamento si sviluppa su 67 mq commerciali con doppio bagno — asset raro a Milano — e uno studio indipendente che può essere facilmente convertito in camera ospiti. Il terrazzino privato con doppio accesso dal soggiorno aggiunge uno spazio esterno esclusivo.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.8", color: "rgba(247,245,240,0.7)" }}>
              Incluso nel prezzo: garage di 20 mq in proprietà — il cui valore OMI è stimato in €48.000 — e accesso al giardino condominiale. Classe energetica C, spese condominiali €200/mese.
            </p>
          </div>

          {/* AI PANEL */}
          <div className="ai-panel">
            <div className="ai-panel-header">
              <div className="ai-label"><div className="ai-dot" /> Analisi AI</div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.06em" }}>Aggiornata oggi</div>
            </div>

            <div className="ai-summary">{immobile.ai_summary}</div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(45,106,79,0.12)", border: "1px solid rgba(45,106,79,0.25)", borderRadius: "2px", padding: "0.4rem 0.9rem", marginBottom: "1.5rem" }}>
              <span style={{ color: "var(--green-light)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>✓ Validato da dati OMI — Agenzia delle Entrate · Zona D24 · 2° sem. 2025</span>
              <a href="/metodologia" style={{ color: "var(--gold)", fontSize: "0.7rem", textDecoration: "none", borderLeft: "1px solid rgba(247,245,240,0.1)", paddingLeft: "0.5rem", marginLeft: "0.2rem" }}>Come calcoliamo →</a>
            </div>

            <div className="ai-scores">
              {[
                { label: "Fair Price Score", val: immobile.scores.prezzo, cls: "green", color: "#4ade80" },
                { label: "Investment Score", val: immobile.scores.investimento, cls: "gold", color: "#c9a84c" },
                { label: "Qualità Annuncio", val: immobile.scores.qualita, cls: "green", color: "#4ade80" },
              ].map(s => (
                <div className="score-card" key={s.label}>
                  <div className={`score-num ${s.cls}`}>{s.val}</div>
                  <div className="score-label">{s.label}</div>
                  <div className="score-bar-wrap">
                    <div className="score-bar-fill" style={{ width: `${s.val}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="ai-grid">
              <div className="ai-section">
                <div className="ai-section-title">✓ Punti di forza</div>
                {immobile.punti_forza.map((p, i) => (
                  <div className="ai-item" key={i}>
                    <span className="ai-item-icon" style={{ color: "#4ade80" }}>→</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
              <div className="ai-section">
                <div className="ai-section-title">⚠ Attenzione</div>
                {immobile.criticita.map((c, i) => (
                  <div className="ai-item" key={i}>
                    <span className="ai-item-icon" style={{ color: "#fb923c" }}>→</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QUESTIONS */}
          <div className="questions-section">
            <h2 className="section-title">Domande consigliate per la visita</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
              Generate dall'AI analizzando l&apos;annuncio.
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--green-light)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>✓</span>
              <span>Il venditore le ha ricevute e si è preparato. Nessuna sorpresa per nessuno.</span>
            </div>
            {immobile.domande.map((q, i) => (
              <div className="question-item" key={i}>
                <div className="question-num">0{i + 1}</div>
                <div className="question-text">{q}</div>
              </div>
            ))}
          </div>

          {/* DOCUMENTS */}
          <div className="docs-section">
            <h2 className="section-title">Documenti</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1rem" }}>
              {docsVerified} su {docsTotal} documenti verificati.
              {!allVerified && <span style={{ color: "var(--gold)" }}> Il venditore ha 30 giorni per completare la documentazione.</span>}
            </div>
            <div className="docs-grid">
              {immobile.documenti.map((doc, i) => (
                <div className="doc-item" key={i}>
                  <div className={`doc-icon ${doc.verificato ? "verified" : "missing"}`}>
                    {doc.verificato ? "✓" : "✗"}
                  </div>
                  <div className="doc-info">
                    <div className="doc-name">{doc.nome}</div>
                    <div className={`doc-status ${doc.verificato ? "ok" : "ko"}`}>
                      {doc.verificato ? "Verificato" : "Mancante"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAP & STREET VIEW */}
          <div className="map-section">
            <h2 className="section-title">Posizione e Street View</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1rem" }}>
              Via Alfonso Capecelatro, 51 · Milano · San Siro
            </div>
            <div className="map-container">
              <div style={{ background: "var(--warm)", borderBottom: "1px solid var(--border)" }}>
                <div className="map-tabs">
                  <button className={`map-tab ${mapTab === "streetview" ? "active" : ""}`} onClick={() => setMapTab("streetview")}>📷 Street View</button>
                  <button className={`map-tab ${mapTab === "mappa" ? "active" : ""}`} onClick={() => setMapTab("mappa")}>🗺 Mappa</button>
                </div>
              </div>
              {mapTab === "streetview" ? (
                <iframe
                  className="map-frame"
                  src="https://www.google.com/maps/embed?pb=!4v1775988656589!6m8!1m7!1sDG_9D_LELR8eSKQj9bghTA!2m2!1d45.47161747952469!2d9.12922276417182!3f227.02966046055374!4f-2.0427435132226037!5f0.7820865974627469"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Street View Via Capecelatro 51 Milano"
                />
              ) : (
                <iframe
                  className="map-frame"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.5!2d9.1369!3d45.4654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c3b3b3b3b3b3%3A0x4786c3b3b3b3b3b3!2sVia%20Alfonso%20Capecelatro%2C%2051%2C%2020148%20Milano%20MI!5e0!3m2!1sit!2sit!4v1700000000000"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa Via Capecelatro 51 Milano"
                />
              )}
            </div>
          </div>

          {/* AI CHAT */}
          <div className="chat-section" ref={chatRef}>
            <h2 className="section-title">Chatta con l&apos;AI — o col venditore</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
              L&apos;AI risponde subito alle domande che conosce. Per tutto il resto, media la conversazione con il venditore — filtrando i toni e proteggendo entrambe le parti.
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--gold)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>✦</span>
              <span>Ogni messaggio è revisionato dall&apos;AI prima di essere consegnato. Nessuna sorpresa, nessuna tensione.</span>
            </div>
            <AiChat />
          </div>

          {/* COMPARABLES */}
          <div className="comps-section">
            <h2 className="section-title">Immobili comparabili</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1rem" }}>
              Selezionati dall&apos;AI nella stessa zona, metratura simile, stesso numero di locali.
            </div>
            {immobile.comparabili.map((c, i) => (
              <div className="comp-item" key={i}>
                <div>
                  <div className="comp-addr">{c.indirizzo}</div>
                  <div className="comp-specs">{c.mq} m² · {c.locali} locali</div>
                  <span className={`comp-delta ${c.delta}`}>{deltaLabel[c.delta]}</span>
                </div>
                <div>
                  <div className="comp-price">€ {c.prezzo.toLocaleString("it-IT")}</div>
                  <div className="comp-sqm">€ {Math.round(c.prezzo / c.mq).toLocaleString("it-IT")}/m²</div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT — STICKY */}
        <div className="right-col">
          <div className="sticky-card">
            <div className="sticky-card-top">
              <div className="sticky-price">€ {immobile.prezzo.toLocaleString("it-IT")}</div>
              <div className="sticky-price-sub">€ {Math.round(immobile.prezzo / immobile.superficie).toLocaleString("it-IT")} / m²</div>
            </div>
            <div className="sticky-card-body">
              {[
                ["Superficie", `${immobile.superficie} m²`],
                ["Garage", "20 m² incluso"],
                ["Locali", immobile.locali],
                ["Bagni", immobile.bagni],
                ["Piano", immobile.piano],
                ["Ascensore", immobile.ascensore ? "Sì" : "No"],
                ["Terrazzino", "Privato"],
                ["Giardino", "Condominiale"],
                ["Classe energetica", `Cl. ${immobile.classe_energetica}`],
                ["Anno costruzione", immobile.anno_costruzione],
                ["Ristrutturazione", immobile.anno_ristrutturazione],
                ["Spese condominiali", `€ ${immobile.spese_condominio}/mese`],
              ].map(([k, v]) => (
                <div className="sticky-row" key={k}>
                  <span className="sticky-row-label">{k}</span>
                  <span className="sticky-row-val">{v}</span>
                </div>
              ))}
            </div>

            <div className="verified-box">
              <div className="verified-box-title">
                {allVerified ? "✓ Immobile Verificato" : `⚠ ${docsVerified}/${docsTotal} Documenti`}
              </div>
              <div className="verified-box-text">
                {allVerified
                  ? "Tutti i documenti sono stati caricati e verificati. Nessuna sorpresa."
                  : "Documentazione parziale. Il venditore ha 30 giorni per completarla."}
              </div>
            </div>

            <div className="sticky-cta">
              <button className="btn-primary" onClick={scrollToChat}>Contatta il venditore →</button>
              <button className="btn-secondary" onClick={() => setSaved(!saved)}>
                {saved ? "♥ Salvato nella shortlist" : "♡ Aggiungi alla shortlist"}
              </button>
              <button className="btn-secondary" style={{ opacity: 0.5, cursor: "not-allowed" }} title="Prossimamente">⤢ Confronta con altri</button>
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
