import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import { useAuth } from "./AuthContext";
import { supabase } from "./supabase";

const vendiStyles = `
  .vendi-page { min-height: 100vh; background: var(--black); padding: 8rem 3rem 5rem; max-width: 1100px; margin: 0 auto; }
.vendi-hero { max-width: 900px; margin: 0 auto 4rem; padding: 0 3rem; }
  .vendi-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .vendi-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .vendi-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 6vw, 5.5rem); line-height: 0.95; color: var(--white); margin-bottom: 1rem; }
  .vendi-sub { font-size: 1rem; color: rgba(247,245,240,0.45); line-height: 1.7; max-width: 560px; }

  .vendi-stepper { display: flex; gap: 0; max-width: 760px; margin: 0 auto 3rem; }
  .vendi-step { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
  .vendi-step-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 0.9rem; border: 1px solid rgba(247,245,240,0.15); color: rgba(247,245,240,0.3); background: transparent; transition: all 0.3s; }
  .vendi-step.active .vendi-step-num { background: var(--red); border-color: var(--red); color: var(--white); }
  .vendi-step.done .vendi-step-num { background: rgba(217,48,37,0.15); border-color: var(--red); color: var(--red); }
  .vendi-step-label { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.25); text-align: center; }
  .vendi-step.active .vendi-step-label { color: var(--white); }
  .vendi-step.done .vendi-step-label { color: var(--red); }
  .vendi-step-line { flex: 1; height: 1px; background: rgba(247,245,240,0.1); margin-top: 16px; }
  .vendi-step-line.done { background: var(--red); }

  .vendi-card { max-width: 760px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 3rem; }
  .vendi-card-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); margin-bottom: 0.5rem; }
  .vendi-card-sub { font-size: 0.88rem; color: rgba(247,245,240,0.4); margin-bottom: 2.5rem; line-height: 1.6; }

  .vendi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.2rem; }
  .vendi-grid.single { grid-template-columns: 1fr; }
  .vendi-grid.three { grid-template-columns: 1fr 1fr 1fr; }
  .vendi-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .vendi-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.5); display: flex; align-items: center; gap: 0.4rem; }
  .vendi-label span.req { color: var(--red); }
  .vendi-input, .vendi-select { background: rgba(247,245,240,0.04); border: 1px solid rgba(247,245,240,0.1); color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; padding: 0.85rem 1rem; border-radius: 2px; outline: none; transition: border-color 0.2s; width: 100%; }
  .vendi-input:focus, .vendi-select:focus { border-color: var(--red); }
  .vendi-input::placeholder { color: rgba(247,245,240,0.2); }
  .vendi-select option { background: #1a1a1a; }

  .vendi-tooltip-wrap { position: relative; display: inline-flex; align-items: center; }
  .vendi-tooltip-btn { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(247,245,240,0.25); background: transparent; color: rgba(247,245,240,0.4); font-size: 0.6rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; flex-shrink: 0; }
  .vendi-tooltip-btn:hover { border-color: var(--red); color: var(--red); }
  .vendi-tooltip-box { position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background: #2a2a2a; border: 1px solid rgba(247,245,240,0.1); border-radius: 3px; padding: 0.6rem 0.8rem; font-size: 0.75rem; color: rgba(247,245,240,0.7); white-space: nowrap; z-index: 10; pointer-events: none; line-height: 1.5; }
  .vendi-tooltip-box::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: #2a2a2a; }

  .vendi-pertinenza { background: rgba(247,245,240,0.02); border: 1px solid var(--border); border-radius: 3px; padding: 1.2rem; margin-bottom: 1rem; }
  .vendi-pertinenza-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
  .vendi-pertinenza-title { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(247,245,240,0.5); }
  .vendi-toggle { display: flex; gap: 0; }
  .vendi-toggle button { padding: 0.3rem 0.9rem; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(247,245,240,0.15); background: transparent; color: rgba(247,245,240,0.35); cursor: pointer; transition: all 0.2s; }
  .vendi-toggle button:first-child { border-radius: 2px 0 0 2px; }
  .vendi-toggle button:last-child { border-radius: 0 2px 2px 0; border-left: none; }
  .vendi-toggle button.active { background: var(--red); border-color: var(--red); color: var(--white); }
  .vendi-pertinenza-body { margin-top: 1rem; }

  .vendi-doc-required { background: rgba(217,48,37,0.08); border: 1px solid rgba(217,48,37,0.3); border-radius: 3px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .vendi-doc-required-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; color: var(--white); margin-bottom: 0.3rem; }
  .vendi-doc-warning { font-size: 0.82rem; font-weight: 600; color: var(--red); margin-bottom: 1.2rem; padding: 0.8rem 1rem; border-left: 3px solid var(--red); background: rgba(217,48,37,0.06); }
  .vendi-doc-soon { background: rgba(247,245,240,0.03); border: 1px solid var(--border); border-radius: 3px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .vendi-doc-soon-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; color: var(--white); margin-bottom: 0.3rem; }
  .vendi-doc-soon-sub { font-size: 0.82rem; color: rgba(247,245,240,0.5); margin-bottom: 1rem; line-height: 1.5; }
  .vendi-doc-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
  .vendi-doc-list li { font-size: 0.85rem; color: rgba(247,245,240,0.6); display: flex; align-items: flex-start; gap: 0.6rem; }
  .vendi-doc-list li::before { content: '→'; color: var(--red); flex-shrink: 0; }
  .vendi-bold-note { font-size: 0.8rem; font-style: italic; color: rgba(247,245,240,0.35); margin-top: 0.5rem; }
  .vendi-bold-note strong { color: rgba(247,245,240,0.6); font-style: normal; }

  .vendi-upload-area { border: 2px dashed rgba(247,245,240,0.15); border-radius: 3px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 0.8rem; }
  .vendi-upload-area:hover { border-color: var(--red); background: rgba(217,48,37,0.04); }
  .vendi-upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .vendi-upload-text { font-size: 0.85rem; color: rgba(247,245,240,0.4); }
  .vendi-upload-text strong { color: var(--white); }
  .vendi-file-item { display: flex; align-items: center; justify-content: space-between; background: rgba(247,245,240,0.04); padding: 0.5rem 0.8rem; border-radius: 2px; font-size: 0.8rem; color: rgba(247,245,240,0.6); margin-bottom: 0.4rem; }
  .vendi-file-remove { color: var(--red); cursor: pointer; font-size: 1rem; }
  .vendi-or { text-align: center; font-size: 0.75rem; color: rgba(247,245,240,0.25); margin: 0.8rem 0; letter-spacing: 0.1em; text-transform: uppercase; }

  .vendi-photos-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem; margin-bottom: 1rem; }
  .vendi-photo-thumb { aspect-ratio: 1; border-radius: 2px; overflow: hidden; position: relative; background: rgba(247,245,240,0.04); border: 1px solid var(--border); }
  .vendi-photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .vendi-photo-remove { position: absolute; top: 4px; right: 4px; background: rgba(10,10,10,0.8); color: var(--red); border: none; cursor: pointer; width: 20px; height: 20px; border-radius: 50%; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; }

  .vendi-check-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-top: 0.5rem; }
  .vendi-check-item { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .vendi-check-item input { accent-color: var(--red); }
  .vendi-check-item label { font-size: 0.85rem; color: rgba(247,245,240,0.6); cursor: pointer; }

  .vendi-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }
  .vendi-btn-back { background: transparent; border: 1px solid rgba(247,245,240,0.15); color: rgba(247,245,240,0.5); padding: 0.85rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: all 0.2s; }
  .vendi-btn-back:hover { border-color: rgba(247,245,240,0.4); color: var(--white); }
  .vendi-btn-next { background: var(--red); border: none; color: var(--white); padding: 0.85rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: background 0.2s; }
  .vendi-btn-next:hover { background: var(--red-dark); }
  .vendi-btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
  .vendi-step-counter { font-size: 0.75rem; color: rgba(247,245,240,0.3); letter-spacing: 0.1em; }

  .vendi-success { max-width: 760px; margin: 0 auto; text-align: center; padding: 4rem 2rem; }
  .vendi-success-icon { font-size: 3rem; margin-bottom: 1.5rem; }
  .vendi-success-title { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: var(--white); margin-bottom: 1rem; }
  .vendi-success-title span { color: var(--red); }
  .vendi-success-sub { font-size: 1rem; color: rgba(247,245,240,0.5); line-height: 1.7; max-width: 480px; margin: 0 auto 2rem; }
  .vendi-success-steps { display: flex; flex-direction: column; gap: 1rem; max-width: 480px; margin: 0 auto 3rem; text-align: left; }
  .vendi-success-step { display: flex; gap: 1rem; align-items: flex-start; }
  .vendi-success-step-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: var(--red); flex-shrink: 0; }
  .vendi-success-step-text { font-size: 0.88rem; color: rgba(247,245,240,0.6); line-height: 1.6; }
  .vendi-error { font-size: 0.8rem; color: var(--red); margin-top: 0.3rem; }

  .vendi-gate-card { max-width: 560px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 3rem; text-align: center; }
  .vendi-gate-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .vendi-gate-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; color: var(--white); margin-bottom: 0.6rem; line-height: 1; }
  .vendi-gate-sub { font-size: 0.92rem; color: rgba(247,245,240,0.5); line-height: 1.7; margin-bottom: 2rem; }
  .vendi-gate-cta { display: inline-block; background: var(--red); color: var(--white); padding: 0.95rem 2.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 2px; transition: background 0.2s; }
  .vendi-gate-cta:hover { background: var(--red-dark); }
  .vendi-gate-bullets { display: flex; flex-direction: column; gap: 0.7rem; text-align: left; max-width: 380px; margin: 0 auto 2rem; }
  .vendi-gate-bullet { font-size: 0.85rem; color: rgba(247,245,240,0.55); line-height: 1.5; display: flex; gap: 0.6rem; }
  .vendi-gate-bullet::before { content: '→'; color: var(--red); flex-shrink: 0; }

  @media (max-width: 900px) {
    .vendi-page { padding: 8rem 3rem 5rem; }
    .vendi-card { padding: 2rem 1.5rem; }
    .vendi-grid { grid-template-columns: 1fr; }
    .vendi-grid.three { grid-template-columns: 1fr 1fr; }
    .vendi-photos-grid { grid-template-columns: repeat(3, 1fr); }
    .vendi-check-grid { grid-template-columns: 1fr 1fr; }
    .vendi-tooltip-box { white-space: normal; width: 200px; left: 0; transform: none; }
    .vendi-gate-card { padding: 2rem 1.5rem; }
  }
`;
const STEPS = [
  { label: "Immobile" },
  { label: "Prezzo" },
  { label: "Foto" },
  { label: "Documenti" },
  { label: "Contatti" },
];

const DISPONIBILITA = [
  "Mattina (9-12)", "Pranzo (12-14)", "Pomeriggio (14-17)",
  "Sera (17-20)", "Weekend mattina", "Weekend pomeriggio"
];

function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="vendi-tooltip-wrap">
      <button className="vendi-tooltip-btn" onClick={() => setOpen(!open)} onBlur={() => setOpen(false)} type="button">?</button>
      {open && <div className="vendi-tooltip-box">{text}</div>}
    </div>
  );
}

// Carica una sola volta lo script Google Maps con Places library. Cache via
// document, così tornando a step 0 non ricarichiamo niente. La key è
// VITE_GOOGLE_MAPS_KEY, già usata per Maps Embed in Immobile.jsx — il founder
// l'ha estesa con Places API (New) sul progetto Google Cloud.
function loadGooglePlacesScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) return resolve();
    const existing = document.getElementById("gmaps-places-script");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Script load error")));
      return;
    }
    const script = document.createElement("script");
    script.id = "gmaps-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=it`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Script load error"));
    document.head.appendChild(script);
  });
}

// Estrae i campi strutturati dall'oggetto Place restituito dall'API Places.
// Mappa di componenti restituiti da Google → schema DB immobili.
function parsePlace(place) {
  if (!place || !place.address_components) return null;
  const get = (type) => place.address_components.find((c) => c.types.includes(type))?.long_name || null;
  const getShort = (type) => place.address_components.find((c) => c.types.includes(type))?.short_name || null;
  const route = get("route");
  const number = get("street_number");
  const indirizzo = [route, number].filter(Boolean).join(" ").trim();
  const citta = get("locality") || get("administrative_area_level_3") || null;
  // zona: sublocality (es. "Città Studi") o neighborhood. Fallback al comune
  // per piccoli paesi che non hanno sotto-aree riconosciute da Google.
  const zona = get("sublocality_level_1") || get("neighborhood") || citta;
  return {
    indirizzo,
    cap: get("postal_code"),
    citta,
    provincia: getShort("administrative_area_level_2"),
    zona,
    latitudine: place.geometry?.location?.lat?.() ?? null,
    longitudine: place.geometry?.location?.lng?.() ?? null,
    formatted: place.formatted_address || null,
  };
}

// Componente Autocomplete dell'indirizzo. Quando l'utente seleziona un Place
// dai suggerimenti, chiama onSelect con l'oggetto strutturato. NON usa
// stato proprio per il valore dell'input: lo gestisce il DOM nativo, e la
// fonte di verità rimane il form parent (popolato solo dopo la selezione).
function AddressAutocomplete({ apiKey, onSelect, onUserType }) {
  const inputRef = useRef(null);
  const acRef = useRef(null);
  const [scriptStatus, setScriptStatus] = useState("loading");

  useEffect(() => {
    if (!apiKey) {
      setScriptStatus("error");
      return;
    }
    loadGooglePlacesScript(apiKey)
      .then(() => setScriptStatus("ready"))
      .catch(() => setScriptStatus("error"));
  }, [apiKey]);

  useEffect(() => {
    if (scriptStatus !== "ready" || !inputRef.current || acRef.current) return;
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "it" },
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["address"],
    });
    acRef.current = ac;
    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const parsed = parsePlace(place);
      if (parsed && parsed.indirizzo && parsed.citta && parsed.cap && parsed.provincia) {
        onSelect(parsed);
      } else {
        // Place senza dati sufficienti (raro: l'utente ha cliccato un risultato
        // ambiguo). Lo segnaliamo al parent come "non verificato".
        onSelect(null);
      }
    });
    return () => {
      window.google?.maps?.event?.removeListener?.(listener);
    };
  }, [scriptStatus, onSelect]);

  if (scriptStatus === "error") {
    return (
      <div style={{ fontSize: "0.85rem", color: "var(--red)", padding: "0.85rem 1rem", border: "1px solid rgba(217,48,37,0.3)", borderRadius: 2, background: "rgba(217,48,37,0.06)" }}>
        Impossibile caricare i suggerimenti indirizzo. Ricarica la pagina o scrivici a <a href="mailto:info@realaistate.ai" style={{ color: "var(--red)" }}>info@realaistate.ai</a>.
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        className="vendi-input"
        placeholder={scriptStatus === "ready" ? "Inizia a digitare via, città..." : "Caricamento suggerimenti..."}
        autoComplete="off"
        onChange={(e) => onUserType?.(e.target.value)}
        disabled={scriptStatus !== "ready"}
      />
      <div style={{ fontSize: "0.7rem", color: "rgba(247,245,240,0.35)", marginTop: "0.4rem" }}>
        Powered by Google — i suggerimenti arrivano dai server Google Maps.
      </div>
    </>
  );
}

function Pertinenza({ title, value, onToggle, metratura, onMetratura, tooltip }) {
  return (
    <div className="vendi-pertinenza">
      <div className="vendi-pertinenza-header">
        <div className="vendi-pertinenza-title">{title}</div>
        <div className="vendi-toggle">
          <button type="button" className={value === "si" ? "active" : ""} onClick={() => onToggle("si")}>Sì</button>
          <button type="button" className={value === "no" ? "active" : ""} onClick={() => onToggle("no")}>No</button>
        </div>
      </div>
      {value === "si" && (
        <div className="vendi-pertinenza-body">
          <div className="vendi-field">
            <label className="vendi-label">Metratura (mq) {tooltip && <Tooltip text={tooltip} />}</label>
            <input className="vendi-input" type="number" placeholder="es. 12" value={metratura} onChange={e => onMetratura(e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendiForm() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    tipologia: "",
    // Indirizzo strutturato — popolato da Google Places Autocomplete in step 0.
    // addressVerified diventa true quando l'utente seleziona un Place dai
    // suggerimenti (è il vero gate per procedere allo step successivo).
    indirizzo: "", cap: "", citta: "", provincia: "", zona: "",
    latitudine: "", longitudine: "", addressVerified: false,
    piano: "", ascensore: "",
    superficie_catastale: "", superficie_calpestabile: "",
    vani: "", camere: "", bagni: "",
    anno_costruzione: "", anno_ristrutturazione: "",
    stato: "", classe_energetica: "",
    riscaldamento: "", acqua_calda: "",
    spese_condominio: "",
    terrazzo: "", terrazzo_mq: "",
    giardino: "",
    cantina: "", cantina_mq: "",
    garage: "", garage_mq: "",
    disponibilita_rogito: "",
    prezzo_desiderato: "", note_prezzo: "",
    foto: [],
    planimetria: null, ape: null,
    nome: "", cognome: "", email: "", email_conferma: "", telefono: "",
    disponibilita: [], note: "",
  });

  // Pre-popolazione step 4 contatti: nome e cognome separati da user_metadata.
  // Pattern: legge user_metadata.nome / .cognome se presenti (post-migrazione SQL
  // del 10/05/2026 che splitta full_name nei due campi). Fallback per utenti
  // pre-migrazione: split di full_name (primo token = nome, resto = cognome).
  // Setta solo se il campo del form è vuoto: non sovrascrive modifiche manuali.
  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    let nome = meta.nome || '';
    let cognome = meta.cognome || '';
    if (!nome && !cognome && meta.full_name) {
      const fn = meta.full_name.trim();
      const idx = fn.indexOf(' ');
      nome = idx >= 0 ? fn.slice(0, idx) : fn;
      cognome = idx >= 0 ? fn.slice(idx + 1).trim() : '';
    }
    setForm(f => {
      const next = { ...f };
      if (!f.nome && nome) next.nome = nome;
      if (!f.cognome && cognome) next.cognome = cognome;
      if (!f.email && user.email) next.email = user.email;
      return next;
    });
  }, [user]);

  const planimetriaRef = useRef();
  const apeRef = useRef();
  const fotoRef = useRef();
  // Diventa true appena l'utente digita qualcosa nel campo autocomplete ma non
  // ha ancora selezionato un Place. Serve a mostrare l'errore inline "Seleziona
  // un indirizzo dai suggerimenti" senza farlo apparire al primo render.
  const [addressTouched, setAddressTouched] = useState(false);
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const handleAddressSelect = (parsed) => {
    if (!parsed) {
      // L'utente ha cliccato un suggerimento incompleto. Resettiamo il flag
      // verified ma teniamo `addressTouched` per mostrare ancora la guida.
      setForm((f) => ({ ...f, addressVerified: false }));
      return;
    }
    setForm((f) => ({
      ...f,
      indirizzo: parsed.indirizzo,
      cap: parsed.cap || "",
      citta: parsed.citta || "",
      provincia: parsed.provincia || "",
      zona: parsed.zona || "",
      latitudine: parsed.latitudine != null ? String(parsed.latitudine) : "",
      longitudine: parsed.longitudine != null ? String(parsed.longitudine) : "",
      addressVerified: true,
    }));
    setAddressTouched(false);
  };

  const handleChangeAddress = () => {
    setForm((f) => ({
      ...f,
      indirizzo: "", cap: "", citta: "", provincia: "", zona: "",
      latitudine: "", longitudine: "", addressVerified: false,
    }));
    setAddressTouched(false);
  };

  // Gate auth: stato di caricamento sessione
  if (authLoading) {
    return (
      <>
        <style>{vendiStyles}</style>
        <NavBar />
        <div className="vendi-page" style={{ textAlign: 'center', color: 'rgba(247,245,240,0.4)', paddingTop: '12rem' }}>
          Caricamento...
        </div>
      </>
    );
  }

  // Gate auth: utente non loggato → pre-onboarding
  if (!user) {
    return (
      <>
        <style>{vendiStyles}</style>
        <NavBar />
        <div className="vendi-page">
          <div className="vendi-hero">
            <div className="vendi-eyebrow">Vendi il tuo immobile</div>
            <h1 className="vendi-h1">Pubblica il tuo<br />immobile. Gratis.</h1>
            <p className="vendi-sub">Niente agenzia. Niente trattative al ribasso. L'AI calcola il prezzo giusto, analizziamo le tue foto e pubblichiamo il tuo annuncio sui principali portali.</p>
          </div>
          <div className="vendi-gate-card">
            <div className="vendi-gate-icon">🔑</div>
            <div className="vendi-gate-title">Accedi per pubblicare</div>
            <div className="vendi-gate-sub">
              Per pubblicare il tuo immobile ti serve un account. Lo crei in 30 secondi ed è gratuito.
            </div>
            <div className="vendi-gate-bullets">
              <div className="vendi-gate-bullet">Gestisci il tuo annuncio dalla dashboard</div>
              <div className="vendi-gate-bullet">Ricevi le proposte d'acquisto direttamente</div>
              <div className="vendi-gate-bullet">Chat e documenti tracciati in un posto solo</div>
            </div>
            <Link to="/login" className="vendi-gate-cta">Accedi o registrati →</Link>
          </div>
        </div>
      </>
    );
  }

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleDisp = (d) => {
    setForm(f => ({
      ...f,
      disponibilita: f.disponibilita.includes(d)
        ? f.disponibilita.filter(x => x !== d)
        : [...f.disponibilita, d]
    }));
  };

  const handleFotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm(f => ({ ...f, foto: [...f.foto, ...files].slice(0, 20) }));
  };

  const removeFoto = (i) => setForm(f => ({ ...f, foto: f.foto.filter((_, idx) => idx !== i) }));

  const handleDocUpload = (key, e) => {
    const file = e.target.files[0];
    if (file) update(key, file);
  };

  const canProceed = () => {
    if (step === 0) return form.tipologia && form.indirizzo && form.addressVerified && form.superficie_catastale && form.stato;
    if (step === 1) return form.prezzo_desiderato;
    if (step === 2) return form.foto.length >= 3;
    if (step === 3) return form.planimetria && form.ape;
    if (step === 4) {
      const emailMatch = form.email_conferma.trim().toLowerCase() === form.email.trim().toLowerCase();
      return form.nome && form.cognome && form.email && form.email_conferma && emailMatch && form.telefono;
    }
    return true;
  };

  const uploadFile = async (file, folder) => {
    const ext = file.name.split(".").pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/documenti-venditori/${filename}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      }
    );
    if (!res.ok) throw new Error(`Upload fallito: ${file.name}`);
    return filename;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
       const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessione scaduta");
      const [planimetriaUrl, apeUrl] = await Promise.all([
        form.planimetria ? uploadFile(form.planimetria, "planimetrie") : Promise.resolve(null),
        form.ape ? uploadFile(form.ape, "ape") : Promise.resolve(null),
      ]);
      const fotoUrls = await Promise.all(form.foto.map(f => uploadFile(f, "foto")));
      // Strippiamo i campi solo-client che non hanno colonna DB:
      // email_conferma (validazione conferma email) e addressVerified (gate UX).
      const { email_conferma: _eic, addressVerified: _av, ...formForApi } = form;
      const payload = {
        ...formForApi,
        foto: fotoUrls,
        planimetria: planimetriaUrl,
        ape: apeUrl,
        disponibilita: form.disponibilita.join(", "),
      };
      const res = await fetch("/api/vendi-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch (e) {
      setError("Qualcosa è andato storto. Riprova o scrivici a info@realaistate.ai");
    }
    setLoading(false);
  };

  if (submitted) return (
    <>
      <style>{vendiStyles}</style>
      <NavBar />
      
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="vendi-success">
          <div className="vendi-success-icon">✓</div>
          <h1 className="vendi-success-title">Ci siamo.<br /><span>Quasi.</span></h1>
          <p className="vendi-success-sub">Abbiamo ricevuto tutto. Ti abbiamo inviato una email di conferma con il riepilogo e i prossimi passi.</p>
          <div className="vendi-success-steps">
            <div className="vendi-success-step"><div className="vendi-success-step-num">01</div><div className="vendi-success-step-text">Analizziamo i tuoi dati e calcoliamo il Fair Price Score del tuo immobile.</div></div>
            <div className="vendi-success-step"><div className="vendi-success-step-num">02</div><div className="vendi-success-step-text">Ti contatteremo entro 24 ore per confermare i dettagli e raccogliere i documenti mancanti.</div></div>
            <div className="vendi-success-step"><div className="vendi-success-step-num">03</div><div className="vendi-success-step-text">Il tuo annuncio viene pubblicato su RealAIstate e sui principali portali immobiliari.</div></div>
          </div>
          <a href="/venditore" className="btn-red">Vai alla mia dashboard →</a>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{vendiStyles}</style>
      <NavBar />
      <div className="vendi-page">

        <div className="vendi-hero">
          <div className="vendi-eyebrow">Vendi il tuo immobile</div>
          <h1 className="vendi-h1">Pubblica il tuo<br />immobile. Gratis.</h1>
          <p className="vendi-sub">Niente agenzia. Niente trattative al ribasso. L'AI calcola il prezzo giusto, analizziamo le tue foto e pubblichiamo il tuo annuncio sui principali portali.</p>
        </div>

        <div className="vendi-stepper">
          {STEPS.map((s, i) => (
            <>
              <div key={i} className={`vendi-step ${i === step ? "active" : i < step ? "done" : ""}`}>
                <div className="vendi-step-num">{i < step ? "✓" : i + 1}</div>
                <div className="vendi-step-label">{s.label}</div>
              </div>
              {i < STEPS.length - 1 && <div key={`line-${i}`} className={`vendi-step-line ${i < step ? "done" : ""}`} />}
            </>
          ))}
        </div>

        <div className="vendi-card">

          {/* STEP 0 — Immobile */}
          {step === 0 && <>
            <div className="vendi-card-title">Il tuo immobile</div>
            <div className="vendi-card-sub">Raccontaci di cosa si tratta. Più precisamente compili, più accurato sarà il Fair Price Score.</div>

            <div className="vendi-grid single">
              <div className="vendi-field">
                <label className="vendi-label">Tipologia <span className="req">*</span></label>
                <select className="vendi-select" value={form.tipologia} onChange={e => update("tipologia", e.target.value)}>
                  <option value="">Seleziona...</option>
                  <option>Appartamento</option><option>Villa</option>
                  <option>Villetta a schiera</option><option>Attico</option>
                  <option>Loft</option><option>Monolocale</option>
                  <option>Bilocale</option><option>Altro</option>
                </select>
              </div>
            </div>

            <div className="vendi-grid single">
              <div className="vendi-field">
                <label className="vendi-label">Indirizzo <span className="req">*</span></label>
                {form.addressVerified ? (
                  <div style={{
                    background: "rgba(45,106,79,0.08)",
                    border: "1px solid rgba(45,106,79,0.3)",
                    borderRadius: 3,
                    padding: "1rem 1.2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green-light)", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          ✓ Indirizzo verificato
                        </div>
                        <div style={{ fontSize: "0.95rem", color: "var(--white)", fontWeight: 600, marginBottom: "0.2rem" }}>
                          {form.indirizzo}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "rgba(247,245,240,0.55)" }}>
                          {form.cap} {form.citta}{form.provincia ? ` (${form.provincia})` : ""}
                          {form.zona && form.zona !== form.citta ? ` · ${form.zona}` : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleChangeAddress}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(247,245,240,0.15)",
                          color: "rgba(247,245,240,0.7)",
                          padding: "0.5rem 1rem",
                          borderRadius: 2,
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontFamily: "DM Sans, sans-serif",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          flexShrink: 0,
                        }}
                      >
                        Cambia
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <AddressAutocomplete
                      apiKey={googleMapsKey}
                      onSelect={handleAddressSelect}
                      onUserType={(v) => { if (v) setAddressTouched(true); }}
                    />
                    {addressTouched && (
                      <div className="vendi-error" style={{ marginTop: "0.4rem" }}>
                        Seleziona un indirizzo dai suggerimenti per continuare.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">Piano</label>
                <input className="vendi-input" placeholder="es. 3" value={form.piano} onChange={e => update("piano", e.target.value)} />
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Ascensore</label>
                <select className="vendi-select" value={form.ascensore} onChange={e => update("ascensore", e.target.value)}>
                  <option value="">Seleziona...</option>
                  <option>Sì</option><option>No</option>
                </select>
              </div>
            </div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">
                  Superficie catastale (mq) <span className="req">*</span>
                  <Tooltip text="Registrata al catasto — la trovi nella visura o nel rogito. Puoi modificarla dopo." />
                </label>
                <input className="vendi-input" placeholder="es. 90" type="number" value={form.superficie_catastale} onChange={e => update("superficie_catastale", e.target.value)} />
              </div>
              <div className="vendi-field">
                <label className="vendi-label">
                  Superficie calpestabile (mq)
                  <Tooltip text="Quello che calpesti davvero, senza muri. Di solito è il 75-80% della catastale. Puoi modificarla dopo." />
                </label>
                <input className="vendi-input" placeholder="es. 75" type="number" value={form.superficie_calpestabile} onChange={e => update("superficie_calpestabile", e.target.value)} />
              </div>
            </div>

            <div className="vendi-grid three">
              <div className="vendi-field">
                <label className="vendi-label">Vani</label>
                <input className="vendi-input" placeholder="es. 4" type="number" value={form.vani} onChange={e => update("vani", e.target.value)} />
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Camere da letto</label>
                <input className="vendi-input" placeholder="es. 2" type="number" value={form.camere} onChange={e => update("camere", e.target.value)} />
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Bagni</label>
                <input className="vendi-input" placeholder="es. 1" type="number" value={form.bagni} onChange={e => update("bagni", e.target.value)} />
              </div>
            </div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">Anno di costruzione</label>
                <input className="vendi-input" placeholder="es. 1985" type="number" value={form.anno_costruzione} onChange={e => update("anno_costruzione", e.target.value)} />
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Anno di ristrutturazione</label>
                <input className="vendi-input" placeholder="es. 2020 (se applicabile)" type="number" value={form.anno_ristrutturazione} onChange={e => update("anno_ristrutturazione", e.target.value)} />
              </div>
            </div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">Classe energetica</label>
                <select className="vendi-select" value={form.classe_energetica} onChange={e => update("classe_energetica", e.target.value)}>
                  <option value="">Seleziona...</option>
                  {["A4","A3","A2","A1","B","C","D","E","F","G"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Stato dell'immobile <span className="req">*</span></label>
                <select className="vendi-select" value={form.stato} onChange={e => update("stato", e.target.value)}>
                  <option value="">Seleziona...</option>
                  <option>Ottimo / ristrutturato</option>
                  <option>Buono stato</option>
                  <option>Da ristrutturare</option>
                  <option>In costruzione</option>
                </select>
              </div>
            </div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">Riscaldamento</label>
                <select className="vendi-select" value={form.riscaldamento} onChange={e => update("riscaldamento", e.target.value)}>
                  <option value="">Seleziona...</option>
                  <option>Autonomo</option>
                  <option>Centralizzato</option>
                  <option>Teleriscaldamento</option>
                  <option>Pompa di calore</option>
                  <option>Assente</option>
                </select>
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Acqua calda</label>
                <select className="vendi-select" value={form.acqua_calda} onChange={e => update("acqua_calda", e.target.value)}>
                  <option value="">Seleziona...</option>
                  <option>Autonoma</option>
                  <option>Centralizzata</option>
                  <option>Boiler elettrico</option>
                  <option>Solare termico</option>
                </select>
              </div>
            </div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">Spese condominiali (€/mese)</label>
                <input className="vendi-input" placeholder="es. 150" type="number" value={form.spese_condominio} onChange={e => update("spese_condominio", e.target.value)} />
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Disponibilità al rogito</label>
                <select className="vendi-select" value={form.disponibilita_rogito} onChange={e => update("disponibilita_rogito", e.target.value)}>
                  <option value="">Seleziona...</option>
                  <option>Immediata</option>
                  <option>Entro 3 mesi</option>
                  <option>Entro 6 mesi</option>
                  <option>Da concordare</option>
                </select>
              </div>
            </div>

            {/* PERTINENZE */}
            <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(247,245,240,0.5)", marginBottom: "0.8rem" }}>Pertinenze</div>
              <Pertinenza
                title="Terrazzo / Balcone"
                value={form.terrazzo}
                onToggle={v => update("terrazzo", v)}
                metratura={form.terrazzo_mq}
                onMetratura={v => update("terrazzo_mq", v)}
                tooltip="La metratura del terrazzo o balcone. Puoi modificarla dopo."
              />
              <Pertinenza
                title="Cantina"
                value={form.cantina}
                onToggle={v => update("cantina", v)}
                metratura={form.cantina_mq}
                onMetratura={v => update("cantina_mq", v)}
                tooltip="La metratura della cantina. Puoi modificarla dopo."
              />
              <Pertinenza
                title="Garage / Box auto"
                value={form.garage}
                onToggle={v => update("garage", v)}
                metratura={form.garage_mq}
                onMetratura={v => update("garage_mq", v)}
                tooltip="La metratura del garage. Incluso nel prezzo dell'immobile."
              />
              <div className="vendi-pertinenza">
                <div className="vendi-pertinenza-header">
                  <div className="vendi-pertinenza-title">Giardino</div>
                  <div className="vendi-toggle">
                    <button type="button" className={form.giardino === "privato" ? "active" : ""} onClick={() => update("giardino", "privato")}>Privato</button>
                    <button type="button" className={form.giardino === "condominiale" ? "active" : ""} onClick={() => update("giardino", "condominiale")}>Condominiale</button>
                    <button type="button" className={form.giardino === "no" ? "active" : ""} onClick={() => update("giardino", "no")}>No</button>
                  </div>
                </div>
              </div>
            </div>
          </>}

          {/* STEP 1 — Prezzo */}
          {step === 1 && <>
            <div className="vendi-card-title">Il tuo prezzo</div>
            <div className="vendi-card-sub">Dicci a quanto vorresti vendere. Il nostro Fair Price Score calcolerà il prezzo reale di mercato — che potrebbe essere diverso, ma sempre spiegato con i dati.</div>

            <div className="vendi-grid single">
              <div className="vendi-field">
                <label className="vendi-label">Prezzo desiderato (€) <span className="req">*</span></label>
                <input className="vendi-input" placeholder="es. 320000" type="number" value={form.prezzo_desiderato} onChange={e => update("prezzo_desiderato", e.target.value)} />
              </div>
            </div>

            <div style={{ background: "rgba(247,245,240,0.03)", border: "1px solid var(--border)", borderLeft: "3px solid var(--red)", padding: "1.2rem 1.5rem", borderRadius: "0 2px 2px 0", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.82rem", color: "rgba(247,245,240,0.7)", lineHeight: 1.7 }}>
                <strong style={{ color: "var(--white)" }}>Il Fair Price Score è neutro.</strong><br />
                L'AI non ha commissioni da incassare. Analizza i dati OMI dell'Agenzia delle Entrate e le transazioni reali nella tua zona. Se il tuo prezzo è in linea, ottimo. Se no, ti diciamo perché — con i dati.
              </div>
            </div>

            <div className="vendi-grid single">
              <div className="vendi-field">
                <label className="vendi-label">Note sul prezzo</label>
                <input className="vendi-input" placeholder="es. Prezzo trattabile..." value={form.note_prezzo} onChange={e => update("note_prezzo", e.target.value)} />
              </div>
            </div>
          </>}

          {/* STEP 2 — Foto */}
          {step === 2 && <>
            <div className="vendi-card-title">Le foto</div>
            <div className="vendi-card-sub">Carica almeno 3 foto. L'AI analizzerà luminosità, angolazione e composizione di ogni immagine e ti dirà cosa migliorare prima della pubblicazione.</div>

            <div className={`vendi-upload-area ${form.foto.length > 0 ? "has-files" : ""}`} onClick={() => fotoRef.current.click()}>
              <div className="vendi-upload-icon">📷</div>
              <div className="vendi-upload-text">
                <strong>Clicca per caricare le foto</strong><br />
                JPG, PNG — max 10MB per foto — fino a 20 immagini
              </div>
              <input ref={fotoRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFotoUpload} />
            </div>

            {form.foto.length > 0 && (
              <div className="vendi-photos-grid">
                {form.foto.map((f, i) => (
                  <div className="vendi-photo-thumb" key={i}>
                    <img src={URL.createObjectURL(f)} alt="" />
                    <button className="vendi-photo-remove" onClick={() => removeFoto(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
            {form.foto.length < 3 && <div className="vendi-error">Carica almeno 3 foto per procedere.</div>}
          </>}

          {/* STEP 3 — Documenti */}
          {step === 3 && <>
            <div className="vendi-card-title">I documenti</div>

            <div className="vendi-doc-required">
              <div className="vendi-doc-required-title">Documenti obbligatori per la pubblicazione</div>
              <div className="vendi-doc-warning">
                Senza questi documenti il tuo annuncio perde efficacia. Su RealAIstate vogliamo verificare ogni immobile — richiede un attimo più di lavoro prima, ma aumenta la fiducia del compratore, la credibilità dell'annuncio e, alla fine, vende casa più velocemente. 🚀
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div className="vendi-label" style={{ marginBottom: "0.5rem" }}>Planimetria catastale <span className="req">*</span></div>
                {form.planimetria ? (
                  <div className="vendi-file-item">
                    <span>✓ {form.planimetria.name}</span>
                    <span className="vendi-file-remove" onClick={() => update("planimetria", null)}>×</span>
                  </div>
                ) : (
                  <div className="vendi-upload-area" style={{ padding: "1rem", marginBottom: 0 }} onClick={() => planimetriaRef.current.click()}>
                    <div className="vendi-upload-text"><strong>Carica planimetria</strong> — PDF o immagine</div>
                    <input ref={planimetriaRef} type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={e => handleDocUpload("planimetria", e)} />
                  </div>
                )}
              </div>

              <div>
                <div className="vendi-label" style={{ marginBottom: "0.5rem" }}>APE — Attestato di Prestazione Energetica <span className="req">*</span></div>
                {form.ape ? (
                  <div className="vendi-file-item">
                    <span>✓ {form.ape.name}</span>
                    <span className="vendi-file-remove" onClick={() => update("ape", null)}>×</span>
                  </div>
                ) : (
                  <div className="vendi-upload-area" style={{ padding: "1rem", marginBottom: 0 }} onClick={() => apeRef.current.click()}>
                    <div className="vendi-upload-text"><strong>Carica APE</strong> — PDF</div>
                    <input ref={apeRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleDocUpload("ape", e)} />
                  </div>
                )}
              </div>

              <div className="vendi-or">oppure</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(247,245,240,0.5)", textAlign: "center" }}>
                Mandali a <a href="mailto:info@realaistate.ai" style={{ color: "var(--red)" }}>info@realaistate.ai</a> e ti risponderemo entro 24 ore.
              </div>
            </div>

            <div className="vendi-doc-soon">
              <div className="vendi-doc-soon-title">Tienili pronti — ti serviranno a breve</div>
              <div className="vendi-doc-soon-sub">Non bloccano la pubblicazione oggi, ma sono obbligatori per arrivare al rogito. Ecco dove trovarli.</div>
              <ul className="vendi-doc-list">
                <li><span><strong style={{color:"var(--white)"}}>Visura catastale</strong> — richiedila gratis online. <a href="https://sister.agenziaentrate.gov.it" target="_blank" rel="noopener noreferrer" style={{color:"var(--red)"}}>Vai al sito →</a></span></li>
                <li><span><strong style={{color:"var(--white)"}}>Atto di provenienza</strong> — l'atto notarile di acquisto. Se non lo trovi, richiedilo al notaio o tramite ispezione ipotecaria. <a href="https://www.agenziaentrate.gov.it/portale/web/guest/schede/istanze/ispezione-ipotecaria" target="_blank" rel="noopener noreferrer" style={{color:"var(--red)"}}>Come richiederla →</a></span></li>
                <li><span><strong style={{color:"var(--white)"}}>Delibere condominiali</strong> — chiedi all'amministratore i verbali delle ultime 3 assemblee.</span></li>
                <li><span><strong style={{color:"var(--white)"}}>Certificato di agibilità</strong> — rilasciato dal Comune. Non necessario per immobili pre-1967.</span></li>
                <li><span><strong style={{color:"var(--white)"}}>Concessioni edilizie</strong> — se hai fatto lavori, recupera i titoli abilitativi (SCIA, DIA, permesso di costruire).</span></li>
              </ul>
              <div className="vendi-bold-note" style={{marginTop:"1rem"}}>
                Hai dubbi su un documento? <a href="mailto:info@realaistate.ai" style={{color:"var(--red)"}}>Scrivici</a> — ti aiutiamo a capire cosa ti serve.
              </div>
            </div>
          </>}

          {/* STEP 4 — Contatti */}
          {step === 4 && <>
            <div className="vendi-card-title">I tuoi contatti</div>
            <div className="vendi-card-sub">Come ti contatta chi è interessato al tuo immobile. Nessuno spam — solo richieste reali di potenziali acquirenti.</div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">Nome <span className="req">*</span></label>
                <input className="vendi-input" placeholder="Mario" value={form.nome} onChange={e => update("nome", e.target.value)} />
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Cognome <span className="req">*</span></label>
                <input className="vendi-input" placeholder="Rossi" value={form.cognome} onChange={e => update("cognome", e.target.value)} />
              </div>
            </div>

            <div className="vendi-grid">
              <div className="vendi-field">
                <label className="vendi-label">Email account</label>
                <input
                  className="vendi-input"
                  type="email"
                  value={form.email}
                  readOnly
                  style={{ opacity: 0.55, cursor: "not-allowed", background: "rgba(247,245,240,0.04)" }}
                />
                <div style={{ fontSize: "0.72rem", color: "rgba(247,245,240,0.35)", marginTop: "0.4rem" }}>
                  Modificabile da <Link to="/account" style={{ color: "var(--red)" }}>/account</Link>.
                </div>
              </div>
              <div className="vendi-field">
                <label className="vendi-label">Conferma email <span className="req">*</span></label>
                <input
                  className="vendi-input"
                  type="email"
                  placeholder="Riscrivi la tua email"
                  value={form.email_conferma}
                  onChange={e => update("email_conferma", e.target.value)}
                />
                {form.email_conferma && form.email_conferma.trim().toLowerCase() !== form.email.trim().toLowerCase() && (
                  <div style={{ fontSize: "0.72rem", color: "var(--red)", marginTop: "0.4rem" }}>
                    Le email non coincidono.
                  </div>
                )}
              </div>
            </div>

            <div className="vendi-grid single">
              <div className="vendi-field">
                <label className="vendi-label">Telefono <span className="req">*</span></label>
                <input className="vendi-input" placeholder="+39 333 1234567" value={form.telefono} onChange={e => update("telefono", e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: "1.2rem" }}>
              <label className="vendi-label" style={{ marginBottom: "0.6rem", display: "block" }}>Disponibilità per le visite</label>
              <div className="vendi-check-grid">
                {DISPONIBILITA.map(d => (
                  <label key={d} className="vendi-check-item">
                    <input type="checkbox" checked={form.disponibilita.includes(d)} onChange={() => toggleDisp(d)} />
                    <label style={{ fontSize: "0.82rem", color: "rgba(247,245,240,0.6)" }}>{d}</label>
                  </label>
                ))}
              </div>
            </div>

            <div className="vendi-grid single">
              <div className="vendi-field">
                <label className="vendi-label">Note aggiuntive</label>
                <input className="vendi-input" placeholder="Qualcosa che vuoi aggiungere..." value={form.note} onChange={e => update("note", e.target.value)} />
              </div>
            </div>

            {error && <div className="vendi-error" style={{ marginTop: "1rem" }}>{error}</div>}
          </>}

          <div className="vendi-nav">
            <div>
              {step > 0 && <button className="vendi-btn-back" onClick={() => setStep(s => s - 1)}>← Indietro</button>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <span className="vendi-step-counter">{step + 1} / {STEPS.length}</span>
              {step < STEPS.length - 1 ? (
                <button className="vendi-btn-next" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>Continua →</button>
              ) : (
                <button className="vendi-btn-next" onClick={handleSubmit} disabled={!canProceed() || loading}>
                  {loading ? "Invio in corso..." : "Pubblica il mio immobile →"}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}