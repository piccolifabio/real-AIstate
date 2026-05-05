import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import SiteFooter from "./SiteFooter.jsx";

function useScrollReveal(dep = null) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (dep !== null) els.forEach(el => el.classList.remove("visible"));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 80);
      }),
      { threshold: 0.05 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [dep]);
}

const excuses = [
  { text: '"Ho bisogno di qualcuno che conosca il mercato."', answer: <><strong>L&apos;AI analizza migliaia di transazioni nella tua zona.</strong> In tempo reale. Senza commissioni.</> },
  { text: '"Non saprei come fare le foto giuste."', answer: <><strong>RealAIstate valuta ogni foto che carichi</strong> e ti dice esattamente cosa migliorare, stanza per stanza.</> },
  { text: '"Per il notaio e i documenti ho bisogno di aiuto."', answer: <><strong>La piattaforma ti connette direttamente</strong> con notai, periti e professionisti certificati. Senza intermediari.</> },
  { text: '"Non riesco a capire se il prezzo è giusto."', answer: <><strong>Il Fair Price Score ti dice in 3 secondi</strong> se stai pagando troppo o se stai vendendo sotto mercato. Con dati, non opinioni.</> },
  { text: '"Ho paura di sbagliare senza qualcuno che mi segue."', answer: <><strong>L&apos;AI è con te in ogni passaggio</strong> — dalla valutazione alla trattativa, fino al rogito.</> },
  { text: '"Non voglio dover negoziare con gli acquirenti."', answer: <><strong>L&apos;AI negozia per te. Senza fretta, senza conflitti.</strong> Non ha commissioni da incassare — ottimizza il tuo prezzo.</> },
  { text: '"Ho bisogno di qualcuno che faccia vedere la casa."', answer: <><strong>Chi conosce casa tua meglio di te? Nessuno.</strong> RealAIstate ti prepara con script e punti di forza. Tu sei il miglior agente di casa tua.</> },
  { text: '"Non ho nessuno a cui lasciare l\'assegno della caparra. Di certo non posso lasciarlo al venditore."', answer: <><strong>L&apos;assegno non lo lasci a nessuno — lo blocchi.</strong> Con RealAIstate usi un escrow digitale: i soldi restano congelati su un conto terzo fino al rogito. Tutela per venditore e compratore.</> },
  { text: '"Non conosco nessun notaio valido di cui fidarmi. Almeno l\'agente può consigliarmene uno."', answer: <><strong>L&apos;agente ti consiglia il notaio con cui lavora abitualmente.</strong> Indovina chi paga le commissioni di riferimento? Su RealAIstate scegli tra notai certificati e indipendenti — sia che tu compri sia che tu venda.</> },
];

const sellerSteps = [
  { title: "Pubblica il tuo immobile", desc: "L'AI genera titolo, descrizione ottimizzata e ti dice il prezzo di mercato corretto.", tag: "AI", tagClass: "tag-ai" },
  { title: "Valuta le tue foto", desc: "RealAIstate analizza luminosità, angolazione e composizione. Ti dice cosa rifare.", tag: "AI", tagClass: "tag-ai" },
  { title: "Ricevi le proposte", desc: "Gli acquirenti ti contattano direttamente. Nessun intermediario. Nessuna percentuale.", tag: "Automatico", tagClass: "tag-auto" },
  { title: "Chiudi con i professionisti", desc: "Notaio, perito energetico, geometra. Li trovi tutti sulla piattaforma, a prezzo trasparente.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const buyerSteps = [
  { title: "Cerca senza filtri inutili", desc: "Zona, budget, obiettivo. La mappa mostra gli immobili ordinati per Fair Price Score.", tag: "AI", tagClass: "tag-ai" },
  { title: "Analizza ogni scheda", desc: "Valutazione del prezzo, punti di forza, criticità, domande da fare. Tutto in automatico.", tag: "AI", tagClass: "tag-ai" },
  { title: "Fai un'offerta diretta", desc: "Contatta il venditore. RealAIstate ti supporta nella trattativa con dati reali.", tag: "Automatico", tagClass: "tag-auto" },
  { title: "Chiudi in sicurezza", desc: "Perizia, APE, atti notarili. La piattaforma coordina tutto. Tu arrivi al rogito preparato.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const proSteps = [
  { title: "Entra nella rete certificata", desc: "Crea il tuo profilo verificato su RealAIstate. Notaio, perito, geometra, ingegnere — ogni categoria ha il suo spazio dedicato.", tag: "Gratis", tagClass: "tag-auto" },
  { title: "Ricevi lead qualificati", desc: "Gli utenti della piattaforma vengono indirizzati ai professionisti nella loro zona. Nessun intermediario nel mezzo — il cliente arriva direttamente a te.", tag: "AI", tagClass: "tag-ai" },
  { title: "Lavora con clienti preparati", desc: "L'AI prepara il cliente prima che ti contatti — documenti, domande, aspettative chiare. Meno tempo perso, più transazioni concluse.", tag: "AI", tagClass: "tag-ai" },
  { title: "Pagamenti trasparenti", desc: "Fee fissa per ogni incarico completato. Nessuna percentuale nascosta, nessuna agenzia di mezzo che prende la sua parte.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const cards = [
  { role: "Stai vendendo", name: "Pubblica. Incassa. Tutto.", desc: "Smetti di cedere migliaia di euro a chi mette il tuo annuncio su un portale.", items: ["Valutazione AI del prezzo di mercato", "Analisi e miglioramento delle foto", "Annuncio generato dall'AI", "Rete di professionisti certificati", "Gestione trattativa diretta"] },
  { role: "Stai comprando", name: "Cerca. Analizza. Decidi.", desc: "Finisci di dipendere da qualcuno che rappresenta il venditore e si fa pagare anche da te.", items: ["Fair Price Score su ogni immobile", "Analisi AI punti di forza e criticità", "Domande consigliate pre-visita", "Connessione diretta col venditore", "Supporto AI dalla proposta al rogito"] },
  { role: "Sei un investitore", name: "Dati. Score. Pipeline.", desc: "Ogni ora persa a confrontare annunci è denaro. Il workspace investitore centralizza tutto.", items: ["Investment Score con spiegazione", "Classificazione: rendita, flip, affitto", "Pipeline opportunità con stato", "Report decisionale esportabile", "Alert automatici su nuovi immobili"] },
  { role: "Sei un professionista", name: "Entra nella rete.", desc: "RealAIstate ti porta clienti qualificati, già informati, pronti a procedere.", items: ["Profilo verificato sulla piattaforma", "Richieste da utenti qualificati dall'AI", "Nessuna agenzia nel mezzo", "Pagamenti trasparenti e tracciati", "Visibilità su tutto il territorio"] },
];

function Nav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">Real<span>AI</span>state</a>
        <div style={{width: "1.5rem"}}></div>
        <ul className="nav-links">
          <li><a href="/come-funziona">Come funziona</a></li>
          <li><a href="/scuse">Le scuse</a></li>
          <li style={{flex: 1}}></li>
          <li><a href="/affitti">Affitti</a></li>
          <li><a href="/compra">Compra casa</a></li>
          <li><a href="/vendi">Vendi casa</a></li>
          <li><a href={user ? "/account" : "/login"} className="nav-cta">{user ? "Il mio account" : "Accesso"}</a></li>
          <li><a href="/en" style={{ display:"inline-flex", alignItems:"center", padding:"0.3rem 0.5rem", border:"1px solid rgba(247,245,240,0.1)", borderRadius:"2px" }} title="English" dangerouslySetInnerHTML={{ __html: `<svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="14" fill="#012169"/><path d="M0,0 L20,14 M20,0 L0,14" stroke="#fff" stroke-width="2.8"/><path d="M0,0 L20,14 M20,0 L0,14" stroke="#C8102E" stroke-width="1.8"/><path d="M10,0 V14 M0,7 H20" stroke="#fff" stroke-width="4.5"/><path d="M10,0 V14 M0,7 H20" stroke="#C8102E" stroke-width="2.8"/></svg>` }} /></li>
        </ul>
        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      {open && (
        <div className="nav-mobile-menu" style={{ display: "flex" }}>
          <a href="/" onClick={() => setOpen(false)}>Home</a>
          <a href="/come-funziona" onClick={() => setOpen(false)}>Come funziona</a>
          <a href="/scuse" onClick={() => setOpen(false)}>Le scuse</a>
          <a href="/affitti" onClick={() => setOpen(false)}>Affitti</a>
          <a href="/compra" onClick={() => setOpen(false)}>Compra casa</a>
          <a href="/vendi" onClick={() => setOpen(false)}>Vendi casa</a>
          <a href={user ? "/account" : "/login"} className="nav-mobile-cta" onClick={() => setOpen(false)}>{user ? "Il mio account" : "Accesso →"}</a>
        </div>
      )}
    </>
  );
}

function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) { setStatus("success"); setEmail(""); } else setStatus("error");
    } catch { setStatus("error"); }
  };
  return (
    <section className="cta-section" id="early">
      <div className="cta-pre">Early Access</div>
      <h2 className="cta-title">Basta<br /><span>scuse.</span></h2>
      <p className="cta-sub">Stiamo costruendo RealAIstate. Entra in lista d&apos;attesa e ricevi l&apos;accesso anticipato.</p>
      {status === "success" ? (
        <div><div className="cta-success">✓ Sei dentro.</div><div className="cta-success-sub">Ti contatteremo non appena apriamo.</div></div>
      ) : (
        <>
          <div className="cta-form">
            <input className="cta-input" type="email" placeholder="la-tua@email.it" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} disabled={status === "loading"} />
            <button className="btn-cta-submit" onClick={handleSubmit} disabled={status === "loading"}>{status === "loading" ? "..." : "Voglio l'accesso →"}</button>
          </div>
          {status === "error" && <div className="cta-error">Qualcosa è andato storto. Riprova.</div>}
          <div className="cta-note">Nessuno spam. Solo aggiornamenti rilevanti.</div>
        </>
      )}
    </section>
  );
}

export default function HomePage() {
  const [tab, setTab] = useState("venditore");
  useScrollReveal(tab);
  const steps = tab === "venditore" ? sellerSteps : tab === "compratore" ? buyerSteps : proSteps;
  return (
    <>
      <Nav />
      <section className="hero">
        <div className="hero-bg-number">NO.</div>
        <div className="hero-eyebrow">Piattaforma AI · Compra e vendi casa</div>
        <h1 className="hero-h1">
          Hai davvero bisogno<br />
          di un&apos;<span className="strike">agenzia</span>?
        </h1>
        <div className="hero-answer">No.</div>
        <p className="hero-challenge">Che scusa hai per non usare <strong>RealAIstate</strong>?</p>
        <p className="hero-sub">La piattaforma AI per comprare e vendere casa senza agenzia. Valutazione, documenti e professionisti — tutto incluso. Anche il risparmio. In trasparenza.</p>
        <div className="hero-actions">
          <a href="/scuse" className="btn-red">Smonta la tua scusa →</a>
        </div>
        <div className="hero-cost">
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginBottom: "1rem" }}>SE COMPRI</div>
            <div className="cost-row">
              <div><div className="cost-num red">3–6%</div><div className="cost-label">Commissione media agenzia</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num red">€9.000–18.000</div><div className="cost-label">Su una casa da €300k</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num green">90% in meno</div><div className="cost-label">Con RealAIstate</div></div>
            </div>
            <div style={{ width: "100%", height: "1px", background: "var(--border)", marginBottom: "2rem" }} />
            <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginBottom: "1rem" }}>SE VENDI</div>
            <div className="cost-row">
              <div><div className="cost-num red">1%</div><div className="cost-label">Commissione media agenzia</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num red">€3.000</div><div className="cost-label">Su una casa da €300k</div></div>
              <div className="cost-divider" />
              <div><div className="cost-num green">50% in meno</div><div className="cost-label">Con RealAIstate</div></div>
            </div>
            <div style={{ borderLeft: "3px solid var(--red)", paddingLeft: "1rem", marginTop: "0.5rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--white)", marginBottom: "0.3rem" }}>Il prezzo giusto.</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(247,245,240,0.4)", lineHeight: 1.6 }}>L&apos;AI non ha fretta di chiudere. Tu decidi quando vendere.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="excuses" id="perche">
        <div className="excuses-label">Le scuse finiscono qui</div>
        <h2 className="excuses-title">Perché continui<br />a pagare l&apos;agenzia?</h2>
        <p className="excuses-subtitle">Le scuse più comuni — smontate una per una. <a href="/scuse">Hai una scusa diversa? Sfida l&apos;AI →</a></p>
        <div>
          {excuses.map((e, i) => (
            <div className="excuse-row reveal" key={i}>
              <div className="excuse-left"><div className="excuse-num">0{i + 1}</div><div className="excuse-text">{e.text}</div></div>
              <div className="excuse-right"><div className="excuse-arrow">→</div><div className="excuse-answer">{e.answer}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="sentence-section">
        <div className="sentence-text">L&apos;agenzia immobiliare sarà<br />l&apos;ultima cosa che paghi<br />senza capire perché.</div>
        <div className="sentence-sub">Il cambiamento è già iniziato.</div>
      </section>

      <section className="how-section" id="come-funziona">
        <div className="how-label">Come funziona</div>
        <h2 className="how-title">Zero agenzie.<br />Zero commissioni.</h2>
        <div className="how-tabs">
          <button className={`how-tab ${tab === "venditore" ? "active" : ""}`} onClick={() => setTab("venditore")}>Sei un venditore</button>
          <button className={`how-tab ${tab === "compratore" ? "active" : ""}`} onClick={() => setTab("compratore")}>Sei un compratore</button>
          <button className={`how-tab ${tab === "professionista" ? "active" : ""}`} onClick={() => setTab("professionista")}>Sei un professionista</button>
        </div>
        <div key={tab}>
          {steps.map((s, i) => (
            <div className="how-step" key={i}>
              <div className="how-step-num">0{i + 1}</div>
              <div><div className="how-step-title">{s.title}</div><div className="how-step-desc">{s.desc}</div></div>
              <span className={`how-step-tag ${s.tagClass}`}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="forwho-section" id="per-chi">
        <div className="forwho-label">Per chi è</div>
        <h2 className="forwho-title">Chiunque compra<br />o vende casa.</h2>
        <div className="forwho-grid">
          {cards.map((c) => (
            <div className="forwho-card reveal" key={c.role}>
              <div className="forwho-role">{c.role}</div>
              <div className="forwho-name">{c.name}</div>
              <p className="forwho-desc">{c.desc}</p>
              <ul className="forwho-list">{c.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <SiteFooter />
    </>
  );
}