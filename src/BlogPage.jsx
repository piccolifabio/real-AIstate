import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  .blog-page { min-height: 100vh; }
  .blog-hero { padding: 8rem 3rem 3rem; max-width: 1100px; margin: 0 auto; position: relative; }
  .blog-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .blog-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .blog-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; color: var(--white); margin-bottom: 0.5rem; }
  .blog-h1 span { color: var(--red); }
  .blog-sub { font-size: 1rem; font-weight: 300; line-height: 1.7; color: rgba(247,245,240,0.45); max-width: 560px; margin-bottom: 2.5rem; }
  .blog-cats { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 3rem; }
  .blog-cat { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.45rem 1rem; border-radius: 2px; cursor: pointer; transition: all 0.2s; border: 1px solid var(--border); color: var(--muted); background: transparent; font-family: 'DM Sans', sans-serif; }
  .blog-cat:hover, .blog-cat.active { background: var(--red); border-color: var(--red); color: white; }
  .blog-tag { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.7rem; border-radius: 2px; }
  .blog-tag-red { background: rgba(217,48,37,0.15); color: var(--red); border: 1px solid rgba(217,48,37,0.3); }
  .blog-tag-gold { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
  .blog-tag-gray { background: rgba(247,245,240,0.05); color: var(--muted); border: 1px solid var(--border); }
  .blog-date { font-size: 0.75rem; color: var(--muted); }
  .blog-grid-section { max-width: 1100px; margin: 0 auto; padding: 0 3rem 5rem; }
  .blog-section-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .blog-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .blog-card { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; text-decoration: none; transition: border-color 0.2s, transform 0.2s; display: flex; flex-direction: column; cursor: pointer; }
  .blog-card:hover { border-color: rgba(247,245,240,0.15); transform: translateY(-2px); }
  .blog-card-body { padding: 1.3rem; flex: 1; display: flex; flex-direction: column; }
  .blog-card-meta { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.8rem; }
  .blog-card-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--white); line-height: 1.3; margin-bottom: 0.7rem; flex: 1; }
  .blog-card-excerpt { font-size: 0.82rem; color: rgba(247,245,240,0.4); line-height: 1.6; margin-bottom: 1rem; }
  .blog-card-read { font-size: 0.72rem; color: var(--muted); }
  .blog-card-arrow { font-size: 0.75rem; color: var(--red); font-weight: 600; }
  .blog-newsletter { max-width: 1100px; margin: 0 auto; padding: 0 3rem 5rem; }
  .blog-newsletter-box { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; padding: 3rem; display: flex; align-items: center; justify-content: space-between; gap: 3rem; position: relative; overflow: hidden; }
  .blog-newsletter-box::before { content: 'BLOG'; position: absolute; right: -1rem; top: 50%; transform: translateY(-50%); font-family: 'Bebas Neue', sans-serif; font-size: 10rem; color: rgba(247,245,240,0.02); line-height: 1; pointer-events: none; }
  .blog-nl-left { flex: 1; }
  .blog-nl-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); margin-bottom: 0.5rem; }
  .blog-nl-sub { font-size: 0.9rem; color: var(--muted); }
  .blog-nl-form { display: flex; gap: 0; flex-shrink: 0; }
  .blog-nl-input { background: rgba(247,245,240,0.04); border: 1px solid rgba(247,245,240,0.12); border-right: none; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; padding: 0.85rem 1.2rem; border-radius: 2px 0 0 2px; outline: none; width: 240px; transition: border-color 0.2s; }
  .blog-nl-input:focus { border-color: var(--red); }
  .blog-nl-input::placeholder { color: rgba(247,245,240,0.2); }
  .blog-nl-btn { background: var(--red); border: none; color: white; padding: 0.85rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600; cursor: pointer; border-radius: 0 2px 2px 0; letter-spacing: 0.08em; text-transform: uppercase; transition: background 0.2s; white-space: nowrap; }
  .blog-nl-btn:hover { background: var(--red-dark); }
  .blog-nl-success { font-size: 0.85rem; color: #4ade80; display: flex; align-items: center; gap: 0.4rem; }
  @media (max-width: 1024px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .blog-hero, .blog-grid-section, .blog-newsletter { padding-left: 1.5rem; padding-right: 1.5rem; }
    .blog-grid { grid-template-columns: 1fr; }
    .blog-newsletter-box { flex-direction: column; gap: 1.5rem; }
    .blog-nl-form { width: 100%; }
    .blog-nl-input { flex: 1; width: auto; }
  }
`;

const articoli = [
  {
    id: 0,
    slug: "piano-casa-2026-costo-nascosto",
    categoria: "Normativa",
    tagClass: "blog-tag-red",
    data: "04 Maggio 2026",
    lettura: "5 min",
    titolo: "Il governo stanzia 10 miliardi per la casa. Ma nessuno parla del costo nascosto che svuota il tuo budget prima ancora di iniziare.",
    excerpt: "Il Piano Casa 2026 promette 100.000 alloggi a prezzi calmierati e uno sconto del 33% sul mercato. Ma se compri tramite agenzia, una parte di quello sconto sparisce in commissioni.",
    num: "10B",
  },
  {
    id: 1,
    slug: "agenzie-abusive-verona",
    categoria: "Trasparenza",
    tagClass: "blog-tag-red",
    data: "23 Aprile 2026",
    lettura: "4 min",
    titolo: "7 agenzie abusive e 15 agenti senza patentino scoperti a Verona. Non è un caso isolato.",
    excerpt: "La Guardia di Finanza ha scoperto nel Veronese 7 agenzie e 15 agenti immobiliari che operavano senza le abilitazioni richieste dalla legge. Migliaia di clienti hanno pagato commissioni ad intermediari non autorizzati.",
    num: "07",
  },
  {
    id: 2,
    slug: "mercato-immobiliare-2025-dati",
    categoria: "Mercato",
    tagClass: "blog-tag-gold",
    data: "20 Aprile 2026",
    lettura: "6 min",
    titolo: "766.756 compravendite nel 2025: il mercato immobiliare italiano è in piena accelerazione",
    excerpt: "I dati OMI del IV trimestre 2025 confermano: il mercato immobiliare italiano cresce del 6,5% anno su anno. Cosa significa per chi vuole comprare o vendere casa oggi.",
    num: "766",
  },
  {
    id: 3,
    slug: "commissioni-agenzia-quanto-costano",
    categoria: "Trasparenza",
    tagClass: "blog-tag-red",
    data: "15 Aprile 2026",
    lettura: "5 min",
    titolo: "Quanto costa davvero un'agenzia immobiliare? Il conto che nessuno ti fa",
    excerpt: "3-6% di commissione sul prezzo di vendita. Su una casa da €300.000 significa fino a €18.000 che escono dalla tua tasca. Ecco tutto quello che devi sapere prima di firmare un mandato.",
    num: "18K",
  },
  {
    id: 4,
    slug: "under-36-agevolazioni-prima-casa",
    categoria: "Normativa",
    tagClass: "blog-tag-gray",
    data: "10 Aprile 2026",
    lettura: "7 min",
    titolo: "Under 36 e prima casa: la guida completa alle agevolazioni fiscali 2025",
    excerpt: "Imposta di registro al 2%, esenzione IMU, garanzia Consap fino all'80% del mutuo. Se hai meno di 36 anni e stai comprando la prima casa, potresti risparmiare migliaia di euro.",
    num: "36",
  },
  {
    id: 5,
    slug: "fair-price-score-come-funziona",
    categoria: "Guide",
    tagClass: "blog-tag-gray",
    data: "5 Aprile 2026",
    lettura: "5 min",
    titolo: "Come funziona il Fair Price Score: la valutazione AI basata sui dati dello Stato",
    excerpt: "Non un algoritmo proprietario. Non una stima soggettiva. Il Fair Price Score di RealAIstate usa i dati OMI dell'Agenzia delle Entrate — gli stessi che usa il fisco.",
    num: "OMI",
  },
  {
    id: 6,
    slug: "ai-real-estate-morgan-stanley",
    categoria: "Mercato",
    tagClass: "blog-tag-gold",
    data: "28 Aprile 2026",
    lettura: "6 min",
    titolo: "L'AI cambierà il modo in cui compri casa. Secondo Morgan Stanley, vale $34 miliardi. In Italia, è già iniziato.",
    excerpt: "Un'analisi di Morgan Stanley stima $34 miliardi di efficienza che l'AI porterà al settore immobiliare entro il 2030. Ma cosa significa concretamente per chi compra o vende casa oggi?",
    num: "$34B",
  },
];

const categorie = ["Tutti", "Mercato", "Trasparenza", "Normativa", "Guide"];

export default function BlogPage() {
  const [catAttiva, setCatAttiva] = useState("Tutti");
  const [email, setEmail] = useState("");
  const [iscritto, setIscritto] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = articoli.filter(a => catAttiva === "Tutti" || a.categoria === catAttiva);

  return (
    <>
      <style>{styles}</style>
      <NavBar />
      <div className="blog-page">
        <div className="blog-hero">
          <div className="blog-eyebrow">Blog</div>
          <h1 className="blog-h1">Il mercato immobiliare<br />spiegato senza filtri.<br /><span>In trasparenza.</span></h1>
          <p className="blog-sub">Dati, analisi e storie sul mercato immobiliare italiano. Senza conflitti di interesse. Senza agenzia.</p>
          <div className="blog-cats">
            {categorie.map(c => (
              <button key={c} className={`blog-cat ${catAttiva === c ? "active" : ""}`} onClick={() => setCatAttiva(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="blog-grid-section">
          <div className="blog-section-label">Tutti gli articoli</div>
          <div className="blog-grid">
            {filtered.map(art => (
              <div key={art.id} className="blog-card" onClick={() => window.location.href = `/blog/${art.slug}`}>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className={`blog-tag ${art.tagClass}`}>{art.categoria}</span>
                    <span className="blog-date">{art.data}</span>
                  </div>
                  <h3 className="blog-card-title">{art.titolo}</h3>
                  <p className="blog-card-excerpt">{art.excerpt}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="blog-card-read">{art.lettura} di lettura</span>
                    <span className="blog-card-arrow">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blog-newsletter">
          <div className="blog-newsletter-box">
            <div className="blog-nl-left">
              <div className="blog-nl-title">Il mercato cambia. Tu rimani aggiornato.</div>
              <div className="blog-nl-sub">Nuovi articoli ogni settimana. Niente spam. Solo dati e trasparenza.</div>
            </div>
            {!iscritto ? (
              <div className="blog-nl-form">
                <input className="blog-nl-input" type="email" placeholder="la-tua@email.it" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && email.trim() && setIscritto(true)} />
                <button className="blog-nl-btn" onClick={() => email.trim() && setIscritto(true)}>Iscriviti →</button>
              </div>
            ) : (
              <div className="blog-nl-success">✓ Perfetto — ti avvisiamo ad ogni nuovo articolo.</div>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}