import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "./supabase";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
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
  .badge-score { background: var(--green); color: white; }
  .badge-new { background: var(--red); color: white; }
  .gallery-count { position: absolute; bottom: 1.5rem; right: 1.5rem; z-index: 2; background: rgba(10,10,10,0.8); color: white; padding: 0.4rem 0.8rem; border-radius: 2px; font-size: 0.75rem; font-weight: 500; }

  /* LAYOUT */
  .page-layout { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; padding: 3rem; max-width: 1400px; margin: 0 auto; }

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

  /* AI PANEL */
  .ai-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; padding: 2rem; margin-bottom: 2rem; position: relative; overflow: hidden; }
  .ai-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--red), var(--gold)); }
  .ai-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
  .ai-label { display: flex; align-items: center; gap: 0.6rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); }
  .ai-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.4); } }
  .ai-summary { font-size: 0.95rem; line-height: 1.7; color: rgba(247,245,240,0.7); margin-bottom: 1.5rem; font-family: 'DM Serif Display', serif; font-style: italic; }
  .ai-scores { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem; max-width: 200px; }
  .score-card { background: rgba(247,245,240,0.04); border: 1px solid var(--border); border-radius: 2px; padding: 1rem; text-align: center; }
  .score-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; line-height: 1; margin-bottom: 0.2rem; }
  .score-num.green { color: var(--green-light); }
  .score-num.gold { color: var(--gold); }
  .score-num.orange { color: #fb923c; }
  .score-label { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .score-bar-wrap { margin-top: 0.5rem; height: 3px; background: rgba(247,245,240,0.08); border-radius: 2px; overflow: hidden; }
  .score-bar-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }
  .ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
  .doc-item { background: var(--surface); border: 1px solid var(--border); border-radius: 2px; padding: 1rem; display: flex; align-items: center; gap: 0.8rem; }
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
  .comp-item { background: var(--surface); border: 1px solid var(--border); border-radius: 2px; padding: 1.2rem; margin-bottom: 0.75rem; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 1rem; }
  .comp-addr { font-size: 0.85rem; color: rgba(247,245,240,0.7); margin-bottom: 0.3rem; }
  .comp-specs { font-size: 0.75rem; color: var(--muted); }
  .comp-price { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: var(--white); text-align: right; }
  .comp-sqm { font-size: 0.72rem; color: var(--muted); text-align: right; }
  .comp-delta { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 2px; margin-top: 0.3rem; display: inline-block; }
  .comp-delta.higher { background: rgba(217,48,37,0.1); color: var(--red); }
  .comp-delta.lower { background: rgba(45,106,79,0.15); color: var(--green-light); }
  .comp-delta.similar { background: rgba(201,168,76,0.1); color: var(--gold); }

  /* STICKY CARD */
  .right-col { position: relative; }
  .sticky-card { position: sticky; top: 6rem; background: var(--surface); border: 1px solid var(--border); border-radius: 3px; overflow: visible; }
  .sticky-card-top { background: rgba(247,245,240,0.03); padding: 1.5rem; border-bottom: 1px solid var(--border); border-radius: 3px 3px 0 0; }
  .sticky-price { font-family: 'Bebas Neue', sans-serif; font-size: 2.4rem; color: var(--white); line-height: 1; }
  .sticky-price-sub { font-size: 0.78rem; color: var(--muted); margin-top: 0.3rem; }
  .sticky-card-body { padding: 1.5rem; overflow: visible; }
  .sticky-row { display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 0; border-bottom: 1px solid rgba(247,245,240,0.04); font-size: 0.85rem; }
  .sticky-row:last-of-type { border-bottom: none; }
  .sticky-row-label { color: var(--muted); display: flex; align-items: center; gap: 0.4rem; }
  .sticky-row-val { color: var(--white); font-weight: 500; }
  .sticky-tooltip-wrap { position: relative; display: inline-flex; }
  .sticky-tooltip-btn { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(247,245,240,0.2); background: transparent; color: rgba(247,245,240,0.4); font-size: 0.55rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; }
  .sticky-tooltip-btn:hover { border-color: var(--red); color: var(--red); }
  .sticky-tooltip-box { position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%); background: #2a2a2a; border: 1px solid rgba(247,245,240,0.1); border-radius: 3px; padding: 0.5rem 0.8rem; font-size: 0.72rem; color: rgba(247,245,240,0.7); white-space: nowrap; z-index: 9999; pointer-events: none; line-height: 1.6; }
  .sticky-tooltip-box::after { content: ''; position: absolute; top: 100%; right: 6px; left: auto; transform: none; border: 4px solid transparent; border-top-color: #2a2a2a; }
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
  .chat-box { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; }
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

  /* AFFORDABILITY */
  .afford-section { margin-bottom: 2rem; }
  .afford-box { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; }
  .afford-header { background: rgba(45,106,79,0.12); border-bottom: 1px solid rgba(45,106,79,0.2); padding: 1.2rem 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .afford-header-icon { font-size: 1.2rem; }
  .afford-header-text { flex: 1; }
  .afford-header-title { font-size: 0.82rem; font-weight: 600; color: var(--green-light); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.2rem; }
  .afford-header-sub { font-size: 0.75rem; color: rgba(247,245,240,0.4); line-height: 1.4; }
  .afford-messages { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; min-height: 220px; max-height: 380px; overflow-y: auto; }
  .afford-msg { display: flex; flex-direction: column; gap: 0.3rem; max-width: 85%; }
  .afford-msg.ai { align-self: flex-start; }
  .afford-msg.user { align-self: flex-end; }
  .afford-msg-sender { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .afford-msg.ai .afford-msg-sender { color: var(--green-light); }
  .afford-msg.user .afford-msg-sender { color: var(--muted); text-align: right; }
  .afford-msg-bubble { padding: 0.8rem 1rem; border-radius: 2px; font-size: 0.88rem; line-height: 1.6; }
  .afford-msg.ai .afford-msg-bubble { background: rgba(45,106,79,0.1); color: rgba(247,245,240,0.8); border-left: 2px solid var(--green-light); }
  .afford-msg.user .afford-msg-bubble { background: rgba(247,245,240,0.06); color: rgba(247,245,240,0.8); border-right: 2px solid rgba(247,245,240,0.2); }
  .afford-input-row { display: flex; gap: 0; border-top: 1px solid var(--border); }
  .afford-input { flex: 1; background: transparent; border: none; padding: 1rem 1.2rem; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none; }
  .afford-input::placeholder { color: rgba(247,245,240,0.2); }
  .afford-send { background: var(--green); border: none; color: white; padding: 1rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: background 0.2s; letter-spacing: 0.06em; }
  .afford-send:hover:not(:disabled) { background: #1e4d38; }
  .afford-send:disabled { opacity: 0.4; cursor: not-allowed; }

  /* MOBILE */
  @media (max-width: 900px) {
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
  }
`;

const IMMOBILE_FALLBACK = {
  id: 1,
  titolo: "Appartamento con garage e terrazzino",
  zona: "Milano · San Siro",
  indirizzo: "Via Alfonso Capecelatro, 51",
  prezzo: 400000,
  superficie: 67,
  superficie_catastale: 69,
  superficie_calpestabile: 65,
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
  riscaldamento: "Autonomo",
  acqua_calda: "Autonoma",
  disponibilita_rogito: "Immediata",
  scores: {
    prezzo: 88,
  },
  ai_summary: "Scorporando il valore del garage (20 mq × €2.400/mq OMI = €48.000), il prezzo dell'appartamento puro è €352.000 — ovvero €5.254/mq. Il range OMI per abitazioni civili Ottimo in zona D24 è €4.300–€6.300/mq: il prezzo si posiziona quasi esattamente al centro (47,7%). Fonte: Agenzia delle Entrate – OMI, zona D24, 2° sem. 2025.",
  punti_forza: [
    "Prezzo al centro del range OMI — €5.254/mq su range €4.300–€6.300 (zona D24, 2025)",
    "Garage scorporato: valore OMI €48.000 — incluso nel prezzo totale",
    "Standing desk + libreria curata nello studio — carattere",
    "Terrazzo con accesso doppio dal soggiorno — oltre 8 mq stimati",
    "Ristrutturazione 2023 — materiali di qualità, pavimento legno chiaro",
  ],
  criticita: [],
  miglioramenti_foto: [],
  domande: [
    "Ci sono lavori straordinari deliberati o in programma in condominio?",
    "Le spese condominiali di €200/mese includono il riscaldamento?",
    "La ristrutturazione 2023 ha incluso anche impianto elettrico e idraulico?",
    "Qual è la metratura esatta del terrazzino?",
  ],
  documenti: [
    { nome: "Visura Catastale", verificato: true },
    { nome: "Planimetria Catastale", verificato: true },
    { nome: "APE — Classe Energetica C", verificato: true },
    { nome: "Atto di Provenienza", verificato: true },
    { nome: "Regolamento Condominiale", verificato: true },
    { nome: "Dichiarazione Ipoteche", verificato: true },
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

const FOTO_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/immobili/1/pub`;
const FOTO = [
  "soggiorno1.jpg",
  "soggiorno2.jpg",
  "soggiornoecucina1.jpg",
  "stanzaletto.jpg",
  "studio.jpg",
  "terrazzo.jpg",
  "bagno.jpg",
  "corridoio.jpg",
];

const deltaLabel = { higher: "▲ +5% vs questo", lower: "▼ -3% vs questo", similar: "≈ Allineato" };

function PropostaModal({ immobile, user, onClose }) {
  const [form, setForm] = useState({ importo: '', condizioni: '', data_rogito: '', note: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

const handleSubmit = async () => {
    // Validazione
    if (!form.importo || isNaN(Number(form.importo)) || Number(form.importo) <= 0) {
      setError('Inserisci un importo valido')
      return
    }
    if (!form.data_rogito) {
      setError('Inserisci una data rogito')
      return
    }
    const dataRogito = new Date(form.data_rogito)
    const oggi = new Date()
    oggi.setHours(0, 0, 0, 0)
    if (dataRogito <= oggi) {
      setError('La data rogito deve essere futura')
      return
    }
    setError('')
    setStatus('loading')
    try {
      await fetch("/api/proposta-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          immobile,
          user_email: user.email,
          user_id: user.id,
          importo: form.importo,
          condizioni: form.condizioni,
          data_rogito: form.data_rogito,
          note: form.note
        })
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#141414', border: '1px solid rgba(247,245,240,0.08)', borderRadius: 4, padding: '2.5rem', width: '100%', maxWidth: '480px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(247,245,240,0.4)', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#f7f5f0', marginBottom: '0.5rem' }}>Proposta inviata.</h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(247,245,240,0.5)', lineHeight: 1.6, marginBottom: '1.5rem' }}>Ti contatteremo entro 24 ore con la risposta del venditore.</p>
            <button onClick={onClose} style={{ background: '#d93025', border: 'none', color: 'white', padding: '0.9rem 2rem', borderRadius: 2, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 600 }}>Chiudi</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#d93025', marginBottom: '0.5rem' }}>Proposta d&apos;acquisto</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: '#f7f5f0', marginBottom: '0.3rem', lineHeight: 1 }}>{immobile.titolo}</h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(247,245,240,0.4)', marginBottom: '2rem' }}>Prezzo richiesto: €{immobile.prezzo.toLocaleString('it-IT')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.5)', display: 'block', marginBottom: '0.4rem' }}>Importo offerto (€) *</label>
<input type="number" min="1" step="1000" placeholder="es. 380000" value={form.importo} onChange={e => setForm(f => ({...f, importo: e.target.value}))} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(247,245,240,0.04)', border: '1px solid rgba(247,245,240,0.1)', borderRadius: 2, color: '#f7f5f0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.5)', display: 'block', marginBottom: '0.4rem' }}>Data rogito proposta</label>
                <input type="date" value={form.data_rogito} onChange={e => setForm(f => ({...f, data_rogito: e.target.value}))} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(247,245,240,0.04)', border: '1px solid rgba(247,245,240,0.1)', borderRadius: 2, color: '#f7f5f0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.5)', display: 'block', marginBottom: '0.4rem' }}>Condizioni</label>
                <input type="text" placeholder="es. soggetta a mutuo, libera immediata..." value={form.condizioni} onChange={e => setForm(f => ({...f, condizioni: e.target.value}))} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(247,245,240,0.04)', border: '1px solid rgba(247,245,240,0.1)', borderRadius: 2, color: '#f7f5f0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.5)', display: 'block', marginBottom: '0.4rem' }}>Note aggiuntive</label>
                <textarea placeholder="Qualsiasi altra informazione..." value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))} rows={3} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(247,245,240,0.04)', border: '1px solid rgba(247,245,240,0.1)', borderRadius: 2, color: '#f7f5f0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

{error && <div style={{ color: '#d93025', fontSize: '0.82rem', marginBottom: '1rem' }}>{error}</div>}
            {status === 'error' && <div style={{ color: '#d93025', fontSize: '0.82rem', marginBottom: '1rem' }}>Qualcosa è andato storto. Riprova.</div>}

<div style={{ background: 'rgba(45,106,79,0.08)', border: '1px solid rgba(45,106,79,0.2)', borderRadius: 2, padding: '1rem', marginBottom: '1rem', fontSize: '0.78rem', color: 'rgba(247,245,240,0.6)', lineHeight: 1.6 }}>
  <strong style={{ color: '#4ade80', display: 'block', marginBottom: '0.3rem' }}>ℹ️ Come funziona</strong>
  Questa proposta diventa vincolante solo dopo la firma digitale di entrambe le parti. Il venditore la valuterà e ti risponderà entro 24 ore.{' '}
  <a href="/proposta_acquisto_template.html" target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', fontWeight: 600 }}>
    Visualizza il documento che firmerai →
  </a>
</div>
            <button onClick={handleSubmit} disabled={!form.importo || status === 'loading'} style={{ width: '100%', padding: '1rem', background: '#2d6a4f', border: 'none', borderRadius: 2, color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {status === 'loading' ? '...' : 'Invia proposta →'}
            </button>
            <p style={{ fontSize: '0.72rem', color: 'rgba(247,245,240,0.3)', marginTop: '0.8rem', textAlign: 'center' }}>Ti risponderemo entro 24 ore con la risposta del venditore.</p>
          </>
        )}
      </div>
    </div>
  )
}

function StickyTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky-tooltip-wrap">
      <button className="sticky-tooltip-btn" onClick={() => setOpen(!open)} onBlur={() => setOpen(false)} type="button">?</button>
      {open && <div className="sticky-tooltip-box">{text}</div>}
    </div>
  );
}

function AiChat({ user, immobileId, immobile }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessioneId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  useEffect(() => {
  if (!user) return
  const loadHistory = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('immobile_id', immobileId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    
    if (data && data.length > 0) {
      setMessages(data.map(m => ({
        role: m.mittente === 'compratore' ? 'user' : 'ai',
        text: m.testo,
        note: null
      })))
    }
  }
  loadHistory()
}, [user])
  
 const prevLenChat = useRef(0);
useEffect(() => {
  if (messages.length > prevLenChat.current) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  prevLenChat.current = messages.length;
}, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg, note: "In attesa di revisione AI" }]);
    setLoading(true);

    if (user) {
      await supabase.from('chat_messages').insert({
        sessione_id: sessioneId,
        immobile_id: immobileId,
        mittente: 'compratore',
        testo: userMsg,
        user_id: user.id
      })
    }

    try {
      const res = await fetch("/api/chat-immobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domanda: userMsg,
          sessione_id: sessioneId,
          compratore_nome: null,
          compratore_email: null,
          messaggi_precedenti: messages,
          immobile: {
            id: immobile.id,
            indirizzo: immobile.indirizzo,
            zona: immobile.zona,
            prezzo: immobile.prezzo,
            superficie: immobile.superficie_catastale,
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
      if (user) {
        await supabase.from('chat_messages').insert({
          sessione_id: sessioneId,
          immobile_id: immobileId,
          mittente: 'ai',
          testo: data.risposta,
          user_id: user.id
        })
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Qualcosa è andato storto. Riprova tra un momento.", note: null }]);
    }
    setLoading(false);
  };

  const bottomRef = useRef(null);

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

function AffordabilityChat({ immobile }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Ciao! Sono l'AI di RealAIstate. Ti faccio qualche domanda per capire se puoi permetterti questo immobile — incluse eventuali agevolazioni under 36. Inizia pure quando vuoi, è riservato. Prima domanda: qual è il tuo reddito netto mensile? (se acquistate in due, indica il totale)" }
  ]);
  const [apiMessages, setApiMessages] = useState([
    { role: "assistant", content: "Ciao! Sono l'AI di RealAIstate. Ti faccio qualche domanda per capire se puoi permetterti questo immobile — incluse eventuali agevolazioni under 36. Inizia pure quando vuoi, è riservato. Prima domanda: qual è il tuo reddito netto mensile? (se acquistate in due, indica il totale)" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

   const prevLenAfford = useRef(0);
useEffect(() => {
  if (messages.length > prevLenAfford.current) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  prevLenAfford.current = messages.length;
}, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const newUserMsg = { role: "user", content: userText };
    const updatedApi = [...apiMessages, newUserMsg];
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setApiMessages(updatedApi);
    setLoading(true);
    try {
      const res = await fetch("/api/chat-affordability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedApi, immobile: { indirizzo: immobile.indirizzo, prezzo: immobile.prezzo, zona: immobile.zona } }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.risposta }]);
      setApiMessages(prev => [...prev, { role: "assistant", content: data.risposta }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Errore di connessione. Riprova." }]);
    }
    setLoading(false);
  };

  return (
    <div className="afford-box">
      <div className="afford-header">
        <div className="afford-header-icon">◎</div>
        <div className="afford-header-text">
          <div className="afford-header-title">Verifica la tua capacità d'acquisto</div>
          <div className="afford-header-sub">Rispondi alle domande — l'AI elabora la tua situazione in tempo reale.</div>
        </div>
      </div>
      <div className="afford-messages">
        {messages.map((m, i) => (
          <div className={`afford-msg ${m.role}`} key={i}>
            <div className="afford-msg-sender">{m.role === "ai" ? "✦ AI RealAIstate" : "Tu"}</div>
            <div className="afford-msg-bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="afford-msg ai">
            <div className="afford-msg-sender">✦ AI RealAIstate</div>
            <div className="chat-typing">
              <div className="chat-dot" /><div className="chat-dot" /><div className="chat-dot" />
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontStyle: "italic" }}>Elaboro...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="afford-input-row">
        <input className="afford-input" placeholder="Rispondi qui..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button className="afford-send" onClick={send} disabled={loading || !input.trim()}>Invia →</button>
      </div>
    </div>
  );
}

export default function ImmobilePage() {
  const { id: immobileId } = useParams();
  const { user } = useAuth()
  const [saved, setSaved] = useState(false);
  const [showProposta, setShowProposta] = useState(false)
  const [activeTab, setActiveTab] = useState("analisi");
  const [mapTab, setMapTab] = useState("streetview");
  const chatRef = useRef(null);
  const [activePhoto, setActivePhoto] = useState(0);

  // Stati per fetch immobile dal DB
  const [immobileDb, setImmobileDb] = useState(null);
  const [loadingImmobile, setLoadingImmobile] = useState(true);
  const [errorImmobile, setErrorImmobile] = useState(null);
  // Costruisce l'oggetto immobile usando dati DB con fallback hardcoded
  // per i campi non ancora presenti in tabella (ai_summary, comparabili, ecc.)
  const immobile = {
    ...IMMOBILE_FALLBACK,
    ...(immobileDb && {
      id: immobileDb.id,
      titolo: immobileDb.titolo ?? IMMOBILE_FALLBACK.titolo,
      indirizzo: immobileDb.indirizzo ?? IMMOBILE_FALLBACK.indirizzo,
      zona: immobileDb.zona ?? IMMOBILE_FALLBACK.zona,
      prezzo: immobileDb.prezzo ?? IMMOBILE_FALLBACK.prezzo,
      superficie_catastale: immobileDb.superficie ?? IMMOBILE_FALLBACK.superficie_catastale,
      superficie_calpestabile: immobileDb.superficie_calpestabile ?? IMMOBILE_FALLBACK.superficie_calpestabile,
      locali: immobileDb.vani ?? IMMOBILE_FALLBACK.locali,
      bagni: immobileDb.bagni ?? IMMOBILE_FALLBACK.bagni,
      piano: immobileDb.piano ?? IMMOBILE_FALLBACK.piano,
      classe_energetica: immobileDb.classe_energetica ?? IMMOBILE_FALLBACK.classe_energetica,
      anno_costruzione: immobileDb.anno_costruzione ?? IMMOBILE_FALLBACK.anno_costruzione,
      anno_ristrutturazione: immobileDb.anno_ristrutturazione ?? IMMOBILE_FALLBACK.anno_ristrutturazione,
      descrizione: immobileDb.descrizione ?? IMMOBILE_FALLBACK.descrizione,
      stato_immobile: immobileDb.stato_immobile ?? IMMOBILE_FALLBACK.stato_immobile,
      tipologia: immobileDb.tipologia ?? IMMOBILE_FALLBACK.tipologia,
            ascensore: immobileDb.ascensore ?? IMMOBILE_FALLBACK.ascensore,
      garage: immobileDb.garage ?? IMMOBILE_FALLBACK.garage,
      terrazzo: immobileDb.terrazzo ?? IMMOBILE_FALLBACK.terrazzo,
      giardino_condominiale: immobileDb.giardino_condominiale ?? IMMOBILE_FALLBACK.giardino_condominiale,
      spese_condominio: immobileDb.spese_condominio ?? IMMOBILE_FALLBACK.spese_condominio,
      riscaldamento: immobileDb.riscaldamento ?? IMMOBILE_FALLBACK.riscaldamento,
      acqua_calda: immobileDb.acqua_calda ?? IMMOBILE_FALLBACK.acqua_calda,
      disponibilita_rogito: immobileDb.disponibilita_rogito ?? IMMOBILE_FALLBACK.disponibilita_rogito,
      ai_summary: immobileDb.ai_summary ?? IMMOBILE_FALLBACK.ai_summary,
      punti_forza: immobileDb.punti_forza ?? IMMOBILE_FALLBACK.punti_forza,
      domande: immobileDb.domande_consigliate ?? IMMOBILE_FALLBACK.domande,
    }),
  };

  // Fetch immobile da Supabase
  useEffect(() => {
    const fetchImmobile = async () => {
      if (!immobileId) return;
      setLoadingImmobile(true);
      const { data, error } = await supabase
        .from('immobili')
        .select('*')
        .eq('id', immobileId)
        .eq('status', 'published')
        .maybeSingle();

      console.log('[Immobile fetch]', { immobileId, data, error });

      if (error) {
        setErrorImmobile(error.message);
      } else if (!data) {
        setErrorImmobile('Immobile non trovato');
      } else {
        setImmobileDb(data);
      }
      setLoadingImmobile(false);
    };
    fetchImmobile();
  }, [immobileId]);

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
      <NavBar />

      {/* GALLERY */}
      <div className="gallery">
        <div className="gallery-main" onClick={() => setActivePhoto((activePhoto + 1) % FOTO.length)}>
          <img src={`${FOTO_BASE}/${FOTO[activePhoto]}`} alt={FOTO[activePhoto]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div className="gallery-badge">
            {allVerified
              ? <span className="badge badge-verified">✓ Immobile Verificato</span>
              : <span className="badge badge-score">{docsVerified}/{docsTotal} Documenti</span>
            }
            <span className="badge badge-score">Fair Price {immobile.scores.prezzo}/100</span>
            <span className="badge badge-new">Nuovo</span>
          </div>
          <div className="gallery-count">{activePhoto + 1} / {FOTO.length} foto</div>
        </div>
        <div className="gallery-thumb" onClick={() => setActivePhoto(1)}>
          <img src={`${FOTO_BASE}/${FOTO[1]}`} alt={FOTO[1]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div className="gallery-thumb" onClick={() => setActivePhoto(2)}>
          <img src={`${FOTO_BASE}/${FOTO[2]}`} alt={FOTO[2]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
            <div className="prop-price-sub">€ {Math.round(immobile.prezzo / immobile.superficie_catastale).toLocaleString("it-IT")} / m² · Spese cond. €{immobile.spese_condominio}/mese</div>
            <div className="prop-specs">
              <div className="spec"><div className="spec-val">{immobile.superficie_catastale} m²</div><div className="spec-label">Superficie</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.locali}</div><div className="spec-label">Locali</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.bagni}</div><div className="spec-label">Bagni</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.piano}</div><div className="spec-label">Piano</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">Cl. {immobile.classe_energetica}</div><div className="spec-label">Energia</div></div>
              <div className="spec-divider" />
              <div className="spec"><div className="spec-val">{immobile.anno_ristrutturazione}</div><div className="spec-label">Ristrutturazione</div></div>
            </div>
          </div>

        {/* DESCRIZIONE */}
          {immobile.descrizione && (
            <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
              <h2 className="section-title" style={{ marginBottom: "1rem" }}>Descrizione</h2>
              {immobile.descrizione.split(/\n\s*\n/).map((paragrafo, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.8",
                    color: "rgba(247,245,240,0.7)",
                    marginBottom: i < immobile.descrizione.split(/\n\s*\n/).length - 1 ? "1rem" : 0,
                  }}
                >
                  {paragrafo.trim()}
                </p>
              ))}
            </div>
          )}

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
              <div className="ai-section" style={{ gridColumn: "1 / -1" }}>
                <div className="ai-section-title">✓ Punti di forza</div>
                {immobile.punti_forza.map((p, i) => (
                  <div className="ai-item" key={i}>
                    <span className="ai-item-icon" style={{ color: "#4ade80" }}>→</span>
                    <span>{p}</span>
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
  {!user && (
  <div style={{ background: "rgba(217,48,37,0.08)", border: "1px solid rgba(217,48,37,0.2)", borderRadius: 3, padding: "1.2rem 1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
    <span style={{ fontSize: "1.2rem" }}>🔒</span>
    <div>
      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f7f5f0", marginBottom: "0.3rem" }}>Accedi per scaricare i documenti</div>
      <div style={{ fontSize: "0.78rem", color: "rgba(247,245,240,0.5)" }}>
        Registrati gratuitamente per accedere a planimetria, visura catastale e APE.{" "}
        <a href="/login" style={{ color: "var(--red)", textDecoration: "none", fontWeight: 600 }}>Accedi →</a>
      </div>
    </div>
  </div>
)}
<div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 2, padding: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
  <div style={{ width: 36, height: 36, borderRadius: 2, background: "rgba(217,48,37,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>📄</div>
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--white)", marginBottom: "0.2rem" }}>Template Proposta d'Acquisto</div>
    <div style={{ fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--green-light)" }}>Disponibile</div>
<a href="/proposta_acquisto_template.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.7rem", color: "var(--red)", fontWeight: 600, textDecoration: "none", display: "block", marginTop: "0.3rem" }}>↓ Visualizza documento</a>
  </div>
</div>
  <div className="docs-grid">
    {immobile.documenti.map((doc, i) => {
      const pubblico = ["Visura Catastale", "Planimetria Catastale", "APE — Classe Energetica C"].includes(doc.nome)
      return (
        <div className="doc-item" key={i}>
          <div className={`doc-icon ${doc.verificato ? "verified" : "missing"}`}>
            {doc.verificato ? "✓" : "✗"}
          </div>
          <div className="doc-info">
            <div className="doc-name">{doc.nome}</div>
            <div className={`doc-status ${doc.verificato ? "ok" : "ko"}`}>
              {doc.verificato ? "Verificato" : "Mancante"}
            </div>
            {doc.verificato && (
              pubblico ? (
                user ? (
                  <div style={{ fontSize: "0.7rem", color: "var(--red)", marginTop: "0.3rem", cursor: "pointer", fontWeight: 600 }}>
                    ↓ Scarica
                  </div>
                ) : (
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                    🔒 Accedi per scaricare
                  </div>
                )
              ) : (
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                  Su richiesta
                </div>
              )
            )}
          </div>
        </div>
      )
    })}
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
           <AiChat user={user} immobileId={immobile.id} immobile={immobile} />
          </div>

          {/* AFFORDABILITY */}
          <div className="afford-section">
            <h2 className="section-title">Puoi permetterti questa casa?</h2>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1.2rem" }}>
              Verifica subito la tua capacità d'acquisto con l'AI. Poche domande, risposta immediata. RealAIstate ti mette poi in contatto con le banche più adeguate alla tua situazione.
            </div>
            <AffordabilityChat immobile={immobile} />
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
              <div className="sticky-price-sub">€ {Math.round(immobile.prezzo / immobile.superficie_catastale).toLocaleString("it-IT")} / m²</div>
            </div>
            <div className="sticky-card-body">
              {[
                ["Sup. catastale", `${immobile.superficie_catastale} m²`, "Registrata al catasto — nessuna sorpresa 😊"],
                ["Sup. calpestabile", `${immobile.superficie_calpestabile} m²`, "Quello che calpesti davvero, senza muri 😊"],
                ["Garage", "20 m²", null],
                ["Locali", immobile.locali, null],
                ["Bagni", immobile.bagni, null],
                ["Piano", immobile.piano, null],
                ["Ascensore", immobile.ascensore ? "Sì" : "No", null],
                ["Terrazzino", "Privato", null],
                ["Giardino", "Condominiale", null],
                ["Riscaldamento", immobile.riscaldamento, null],
                ["Acqua calda", immobile.acqua_calda, null],
                ["Classe energetica", `Cl. ${immobile.classe_energetica}`, null],
                ["Anno costruzione", immobile.anno_costruzione, null],
                ["Ristrutturazione", immobile.anno_ristrutturazione, null],
                ["Spese condominiali", `€ ${immobile.spese_condominio}/mese`, null],
                ["Disponibilità rogito", immobile.disponibilita_rogito, null],
              ].map(([k, v, tooltip]) => (
                <div className="sticky-row" key={k}>
                  <span className="sticky-row-label">
                    {k}
                    {tooltip && <StickyTooltip text={tooltip} />}
                  </span>
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
  {user ? (
    <button className="btn-primary" style={{ background: '#2d6a4f' }} onClick={() => setShowProposta(true)}>
      Fai una proposta →
    </button>
  ) : (
    <a href="/login" className="btn-secondary">Accedi per fare una proposta</a>
  )}
  <button className="btn-secondary" onClick={() => setSaved(!saved)}>
    {saved ? "♥ Salvato nella shortlist" : "♡ Aggiungi alla shortlist"}
  </button>
</div>
          </div>
        </div>

      </div>

{showProposta && (
  <PropostaModal
    immobile={immobile}
    user={user}
    onClose={() => setShowProposta(false)}
  />
)}

      <SiteFooter />
    </>
  );
}
