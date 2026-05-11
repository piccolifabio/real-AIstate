import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";
import { supabase } from "./supabase.js";

const styles = `
  .listing-page { min-height: 100vh; }

  /* HERO */
  .listing-hero { padding: 8rem 3rem 2.5rem; max-width: 1100px; margin: 0 auto; }
  .listing-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .listing-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .listing-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); color: var(--white); line-height: 0.95; margin-bottom: 0.5rem; }
  .listing-sub { font-size: 1rem; color: rgba(247,245,240,0.45); margin-bottom: 2rem; }

  /* FILTERS */
  .listing-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .filter-select { background: var(--surface); border: 1px solid var(--border); color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; padding: 0.6rem 1rem; border-radius: 2px; outline: none; cursor: pointer; transition: border-color 0.2s; }
  .filter-select:focus { border-color: var(--red); }
  .filter-select option { background: #1a1a1a; }
  .filter-count { font-size: 0.78rem; color: var(--muted); display: flex; align-items: center; margin-left: auto; }

  /* GRID */
  .listing-content { padding: 0 3rem 5rem; max-width: 1100px; margin: 0 auto; }
  .listing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

  /* CARD */
  .prop-card { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
  .prop-card.real:hover { border-color: rgba(247,245,240,0.2); transform: translateY(-2px); cursor: pointer; }
  .prop-card.fake { opacity: 0.78; }
  .prop-card.fake .prop-card-body { opacity: 0.6; }
  .prop-card-img { height: 200px; overflow: hidden; position: relative; background: var(--surface); }
  .prop-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .prop-card-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
  .prop-card-img-placeholder svg { width: 40px; height: 40px; opacity: 0.1; }
  .prop-card-img-art { width: 100%; height: 100%; display: block; }
  .prop-card-badges { position: absolute; bottom: 0.8rem; left: 0.8rem; display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .prop-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 2px; }
  .prop-badge-green { background: var(--green); color: white; }
  .prop-badge-gold { background: var(--gold); color: var(--black); }
  .prop-badge-soon { background: rgba(247,245,240,0.1); color: rgba(247,245,240,0.5); border: 1px solid rgba(247,245,240,0.1); }
  .prop-card-body { padding: 1.2rem; }
  .prop-card-location { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--red); margin-bottom: 0.4rem; }
  .prop-card-title { font-size: 0.92rem; font-weight: 600; color: var(--white); margin-bottom: 0.3rem; line-height: 1.4; }
  .prop-card-address { font-size: 0.78rem; color: var(--muted); margin-bottom: 1rem; }
  .prop-card-specs { display: flex; gap: 1.2rem; margin-bottom: 1rem; }
  .prop-card-spec { font-size: 0.75rem; color: var(--muted); }
  .prop-card-spec strong { color: rgba(247,245,240,0.7); font-weight: 600; }
  .prop-card-price { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; color: var(--white); line-height: 1; }
  .prop-card-sqm { font-size: 0.72rem; color: var(--muted); margin-top: 0.15rem; }
  .prop-card-score { text-align: right; }
  .prop-card-score-num { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: var(--green-light); line-height: 1; }
  .prop-card-score-label { font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }

  /* SECTION LABEL */
  .listing-section-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.2rem; margin-top: 2.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .listing-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  @media (max-width: 1100px) { .listing-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .listing-hero, .listing-content { padding-left: 1.5rem; padding-right: 1.5rem; }
    .listing-grid { grid-template-columns: 1fr; }
    .filter-count { margin-left: 0; width: 100%; }
  }
`;

const immobiliFittizi = [
  { titolo: "Trilocale luminoso con balcone", zona: "Milano · Navigli", indirizzo: "Via Vigevano, 18", prezzo: 485000, superficie: 82, locali: 3, bagni: 2, piano: "3°" },
  { titolo: "Bilocale ristrutturato", zona: "Milano · Isola", indirizzo: "Via Borsieri, 7", prezzo: 320000, superficie: 58, locali: 2, bagni: 1, piano: "1°" },
  { titolo: "Attico con terrazza panoramica", zona: "Milano · Porta Venezia", indirizzo: "Corso Buenos Aires, 43", prezzo: 890000, superficie: 120, locali: 4, bagni: 2, piano: "6°" },
  { titolo: "Monolocale design", zona: "Milano · Brera", indirizzo: "Via Solferino, 22", prezzo: 245000, superficie: 38, locali: 1, bagni: 1, piano: "2°" },
  { titolo: "Quadrilocale con giardino", zona: "Milano · Lambrate", indirizzo: "Via Conte Rosso, 9", prezzo: 620000, superficie: 105, locali: 4, bagni: 2, piano: "T" },
  { titolo: "Trilocale con doppio affaccio", zona: "Milano · Sempione", indirizzo: "Via Procaccini, 34", prezzo: 540000, superficie: 90, locali: 3, bagni: 2, piano: "4°" },
  { titolo: "Appartamento centro storico", zona: "Verona · Centro", indirizzo: "Via Mazzini, 12", prezzo: 310000, superficie: 75, locali: 3, bagni: 1, piano: "2°" },
  { titolo: "Bilocale con vista Arena", zona: "Verona · Centro", indirizzo: "Corso Porta Nuova, 8", prezzo: 280000, superficie: 62, locali: 2, bagni: 1, piano: "3°" },
  { titolo: "Loft industriale", zona: "Milano · Bovisa", indirizzo: "Via Candiani, 72", prezzo: 395000, superficie: 95, locali: 2, bagni: 2, piano: "1°" },
];

function PropCardReal({ imm }) {
  const cover = imm.foto?.[0];
  const titolo = imm.titolo || `Immobile · ${imm.zona || ""}`;
  const link = `/immobili/${imm.id}`;

  return (
    <a href={link} style={{ textDecoration: "none" }}>
      <div className="prop-card real">
        <div className="prop-card-img">
          {cover ? (
            <img src={cover} alt={titolo} />
          ) : (
            <div className="prop-card-img-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}
          <div className="prop-card-badges">
            <span className="prop-badge prop-badge-green">✓ Verificato</span>
          </div>
        </div>
        <div className="prop-card-body">
          <div className="prop-card-location">📍 {imm.zona}</div>
          <div className="prop-card-title">{titolo}</div>
          <div className="prop-card-address">{imm.indirizzo}</div>
          <div className="prop-card-specs">
            <div className="prop-card-spec"><strong>{imm.superficie} m²</strong></div>
            <div className="prop-card-spec"><strong>{imm.locali}</strong> locali</div>
            <div className="prop-card-spec"><strong>{imm.bagni}</strong> bagni</div>
            <div className="prop-card-spec">Piano <strong>{imm.piano}</strong></div>
          </div>
          <div className="prop-card-footer">
            <div>
              <div className="prop-card-price">€ {imm.prezzo.toLocaleString("it-IT")}</div>
              <div className="prop-card-sqm">€ {Math.round(imm.prezzo / imm.superficie).toLocaleString("it-IT")} / m²</div>
            </div>
            <div className="prop-card-score">
              <div className="prop-card-score-num" style={!imm.fair_price_score ? { color: "var(--muted)" } : undefined}>
                {imm.fair_price_score ?? "—"}
              </div>
              <div className="prop-card-score-label">Fair Price</div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

// Placeholder geometrico brand per le card "In arrivo": skyline astratto su
// fondo dark con un singolo accento rosso (finestra "accesa"). Sostituisce il
// nero pieno + iconcina generica delle card fittizie. SVG inline, riempie
// l'area .prop-card-img (200px h) tramite preserveAspectRatio=xMidYMid slice.
function ComingSoonPlaceholder() {
  return (
    <svg
      className="prop-card-img-art"
      viewBox="0 0 400 220"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="400" height="220" fill="#0a0a0a" />
      <line x1="0" y1="178" x2="400" y2="178" stroke="rgba(247,245,240,0.05)" strokeWidth="1" />
      <line x1="0" y1="198" x2="400" y2="198" stroke="rgba(247,245,240,0.04)" strokeWidth="1" />
      <rect x="30" y="100" width="34" height="100" fill="#141414" />
      <rect x="68" y="70" width="42" height="130" fill="#1a1a1a" />
      <rect x="114" y="90" width="30" height="110" fill="#141414" />
      <rect x="148" y="55" width="46" height="145" fill="#1c1c1c" />
      <rect x="198" y="105" width="34" height="95" fill="#141414" />
      <rect x="236" y="78" width="40" height="122" fill="#1a1a1a" />
      <rect x="280" y="118" width="28" height="82" fill="#141414" />
      <rect x="312" y="62" width="38" height="138" fill="#1a1a1a" />
      <rect x="354" y="98" width="30" height="102" fill="#141414" />
      <rect x="164" y="95" width="8" height="5" fill="#d93025" />
      <rect x="178" y="95" width="8" height="5" fill="#d93025" opacity="0.4" />
      <text
        x="200" y="32"
        fontFamily="Bebas Neue, sans-serif"
        fontSize="13"
        fill="rgba(247,245,240,0.22)"
        textAnchor="middle"
        letterSpacing="3.5"
      >IN ARRIVO</text>
    </svg>
  );
}

function PropCardFake({ imm }) {
  return (
    <div className="prop-card fake">
      <div className="prop-card-img">
        <ComingSoonPlaceholder />
        <div className="prop-card-badges">
          <span className="prop-badge prop-badge-soon">In arrivo</span>
        </div>
      </div>
      <div className="prop-card-body">
        <div className="prop-card-location">📍 {imm.zona}</div>
        <div className="prop-card-title">{imm.titolo}</div>
        <div className="prop-card-address">{imm.indirizzo}</div>
        <div className="prop-card-specs">
          <div className="prop-card-spec"><strong>{imm.superficie} m²</strong></div>
          <div className="prop-card-spec"><strong>{imm.locali}</strong> locali</div>
          <div className="prop-card-spec"><strong>{imm.bagni}</strong> bagni</div>
          <div className="prop-card-spec">Piano <strong>{imm.piano}</strong></div>
        </div>
        <div className="prop-card-footer">
          <div>
            <div className="prop-card-price">€ {imm.prezzo.toLocaleString("it-IT")}</div>
            <div className="prop-card-sqm">€ {Math.round(imm.prezzo / imm.superficie).toLocaleString("it-IT")} / m²</div>
          </div>
          <div className="prop-card-score">
            <div className="prop-card-score-num" style={{ color: "var(--muted)" }}>—</div>
            <div className="prop-card-score-label">Fair Price</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingPage() {
  const [città, setCittà] = useState("tutte");
  const [immobiliReali, setImmobiliReali] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    async function fetchImmobili() {
      const { data, error } = await supabase
        .from("immobili")
        .select("id, titolo, indirizzo, zona, prezzo, superficie, locali, bagni, piano, foto, fair_price_score")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Errore fetch immobili:", error);
        setImmobiliReali([]);
      } else {
        setImmobiliReali(data || []);
      }
      setLoading(false);
    }
    fetchImmobili();
  }, []);

  const tutteLeCittà = ["tutte", "Milano", "Verona"];
  const fittiziFiltrati = città === "tutte"
    ? immobiliFittizi
    : immobiliFittizi.filter(i => i.zona.includes(città));

  return (
    <>
      <style>{styles}</style>
      <NavBar />
      <div className="listing-page">
        <div className="listing-hero">
          <div className="listing-eyebrow">Compra casa</div>
          <h1 className="listing-h1">Immobili verificati.<br />Prezzi trasparenti.</h1>
          <p className="listing-sub">Ogni immobile ha un Fair Price Score basato sui dati OMI — sai subito se il prezzo è giusto.</p>

          <div className="listing-filters">
            <select className="filter-select" value={città} onChange={e => setCittà(e.target.value)}>
              {tutteLeCittà.map(c => (
                <option key={c} value={c}>{c === "tutte" ? "Tutte le città" : c}</option>
              ))}
            </select>
            <div className="filter-count">
              {loading ? "Carico…" : `${immobiliReali.length + fittiziFiltrati.length} immobili`}
            </div>
          </div>
        </div>

        <div className="listing-content">
          <div className="listing-section-label">Disponibile ora</div>
          <div className="listing-grid">
            {loading ? (
              <div style={{ color: "var(--muted)", fontSize: "0.85rem", gridColumn: "1 / -1" }}>
                Carico immobili…
              </div>
            ) : immobiliReali.length === 0 ? (
              <div style={{ color: "var(--muted)", fontSize: "0.85rem", gridColumn: "1 / -1" }}>
                Nessun immobile disponibile al momento.
              </div>
            ) : (
              immobiliReali.map(i => <PropCardReal key={i.id} imm={i} />)
            )}
          </div>

          <div className="listing-section-label">In arrivo</div>
          <div className="listing-grid">
            {fittiziFiltrati.map((i, idx) => <PropCardFake key={idx} imm={i} />)}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
