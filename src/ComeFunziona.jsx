import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --muted: #6b6b6b; --surface: #141414; --border: rgba(247,245,240,0.08);
    --green: #2d6a4f; --green-light: #4ade80; --warm: #1e1e1e; --gold: #c9a84c;
  }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  /* NAV */
  .cf-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.95); backdrop-filter: blur(16px); }
  .cf-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .cf-nav-logo span { color: var(--red); }
  .cf-nav-links { display: flex; gap: 1.5rem; align-items: center; }
  .cf-nav-link { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .cf-nav-link:hover { color: var(--white); }
  .cf-nav-cta { background: var(--red); color: white; border: none; padding: 0.5rem 1.4rem; border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer; text-decoration: none; letter-spacing: 0.06em; transition: background 0.2s; }
  .cf-nav-cta:hover { background: var(--red-dark); }

  /* HERO */
  .cf-hero { padding: 8rem 3rem 2.5rem; max-width: 1100px; margin: 0 auto; }
  .cf-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .cf-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .cf-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; color: var(--white); margin-bottom: 1rem; }
  .cf-h1 span { color: var(--red); }
  .cf-sub { font-size: 1rem; color: rgba(247,245,240,0.45); line-height: 1.7; max-width: 600px; margin-bottom: 3rem; }

  /* TOGGLE */
  .cf-toggle { display: inline-flex; background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 4px; gap: 4px; }
  .cf-toggle-btn { padding: 0.6rem 2rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border: none; border-radius: 2px; cursor: pointer; transition: all 0.2s; background: transparent; color: rgba(247,245,240,0.4); }
  .cf-toggle-btn.active { background: var(--red); color: white; }

  /* CONTENT */
  .cf-content { max-width: 1100px; margin: 0 auto; padding: 0 3rem 6rem; }

  /* STEP */
  .cf-steps { display: flex; flex-direction: column; gap: 0; }
  .cf-step { display: grid; grid-template-columns: 80px 1fr 1fr; gap: 3rem; padding: 3.5rem 0; border-bottom: 1px solid var(--border); align-items: start; }
  .cf-step:last-child { border-bottom: none; }
  .cf-step-num { font-family: 'Bebas Neue', sans-serif; font-size: 5rem; line-height: 1; color: rgba(247,245,240,0.06); padding-top: 0.2rem; }

  /* LEFT — RealAIstate */
  .cf-step-real { }
  .cf-step-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.7rem; border-radius: 2px; background: rgba(217,48,37,0.12); border: 1px solid rgba(217,48,37,0.25); font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .cf-step-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--white); line-height: 1; margin-bottom: 0.8rem; }
  .cf-step-desc { font-size: 0.9rem; color: rgba(247,245,240,0.65); line-height: 1.75; margin-bottom: 1.2rem; }
  .cf-step-highlight { display: flex; align-items: flex-start; gap: 0.6rem; background: rgba(45,106,79,0.1); border: 1px solid rgba(45,106,79,0.25); border-radius: 2px; padding: 0.8rem 1rem; font-size: 0.82rem; color: var(--green-light); line-height: 1.5; }
  .cf-step-highlight-icon { flex-shrink: 0; font-size: 1rem; }

  /* RIGHT — Agenzia */
  .cf-step-agency { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 1.5rem; position: relative; }
  .cf-step-agency::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(247,245,240,0.06); }
  .cf-agency-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
  .cf-agency-label::before { content: ''; width: 16px; height: 1px; background: var(--muted); }
  .cf-agency-title { font-size: 0.95rem; font-weight: 600; color: rgba(247,245,240,0.4); margin-bottom: 0.6rem; line-height: 1.4; }
  .cf-agency-desc { font-size: 0.83rem; color: rgba(247,245,240,0.3); line-height: 1.7; }
  .cf-agency-cost { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.8rem; padding: 0.3rem 0.7rem; background: rgba(217,48,37,0.08); border-radius: 2px; font-size: 0.75rem; color: rgba(217,48,37,0.6); font-weight: 600; }

  /* CTA BOTTOM */
  .cf-cta { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 4rem 3rem; text-align: center; margin-top: 2rem; position: relative; overflow: hidden; }
  .cf-cta::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--red); }
  .cf-cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--white); margin-bottom: 1rem; line-height: 1; }
  .cf-cta-title span { color: var(--red); }
  .cf-cta-sub { font-size: 0.95rem; color: rgba(247,245,240,0.4); margin-bottom: 2.5rem; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.7; }
  .cf-cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .cf-btn-red { background: var(--red); color: white; border: none; padding: 0.9rem 2.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 2px; text-decoration: none; display: inline-block; transition: background 0.2s; }
  .cf-btn-red:hover { background: var(--red-dark); }
  .cf-btn-outline { background: transparent; color: rgba(247,245,240,0.5); border: 1px solid rgba(247,245,240,0.15); padding: 0.9rem 2.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer; border-radius: 2px; text-decoration: none; display: inline-block; transition: all 0.2s; }
  .cf-btn-outline:hover { border-color: rgba(247,245,240,0.4); color: var(--white); }

  /* FOOTER */

  /* PILLOLE */
  .cf-pillole { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
  .cf-pillola { display: flex; align-items: center; gap: 0.7rem; background: rgba(247,245,240,0.04); border: 1px solid var(--border); border-radius: 2px; padding: 0.8rem 1.2rem; flex: 1; min-width: 200px; }
  .cf-pillola-icon { font-size: 1.1rem; flex-shrink: 0; }
  .cf-pillola-text strong { display: block; font-size: 0.78rem; font-weight: 600; color: var(--white); letter-spacing: 0.04em; margin-bottom: 0.15rem; }
  .cf-pillola-text span { font-size: 0.72rem; color: var(--muted); line-height: 1.4; }
  .cf-trasparenza { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 1.1rem; color: rgba(247,245,240,0.5); margin-top: 2rem; line-height: 1.6; }
  .cf-trasparenza em { color: var(--white); font-style: normal; }

  @media (max-width: 900px) {
    .cf-nav { padding: 1rem 1.5rem; }
    .cf-nav-links { display: none; }
    .cf-hero { padding: 8rem 3rem 2.5rem; }
    .cf-content { padding: 0 1.5rem 4rem; }
    .cf-step { grid-template-columns: 1fr; gap: 1.5rem; }
    .cf-step-num { font-size: 3rem; padding-top: 0; }
    .cf-cta { padding: 3rem 1.5rem; }
  }`;

const STEPS_VENDITORE = [
  {
    num: "01",
    title: "Pubblica l'annuncio",
    desc: "Inserisci i dati del tuo immobile in 5 minuti. RealAIstate genera automaticamente il Fair Price Score basato sui dati OMI ufficiali, analizza le tue foto stanza per stanza e crea l'annuncio ottimizzato. Nessuna visita dell'agente, nessuna firma di mandati.",
    highlight: "Risparmi il tempo di 3–4 appuntamenti con l'agente e non firmi nessun mandato esclusivo.",
    agency_title: "L'agenzia viene a casa tua, valuta 'a occhio' e ti fa firmare un mandato esclusivo",
    agency_desc: "Sei vincolato per mesi. Se trovi un acquirente da solo, paghi lo stesso. La valutazione è soggettiva — l'agente ha interesse a chiudere veloce, non al tuo prezzo massimo.",
    agency_cost: "Mandato esclusivo: 3–6 mesi di vincolo",
  },
  {
    num: "02",
    title: "Il Fair Price Score",
    desc: "Il prezzo del tuo immobile viene calcolato sui dati OMI dell'Agenzia delle Entrate — la fonte più affidabile in Italia, aggiornata ogni semestre. Il Fair Price Score ti dice se il tuo prezzo è in linea col mercato, spiegando ogni dettaglio con dati verificabili.",
    highlight: "Fonte ufficiale, dati pubblici, nessun conflitto di interessi. L'AI non guadagna di più se vendi a meno. → Come calcoliamo il Fair Price Score",
    highlightLink: "/metodologia",
    agency_title: "L'agente stima il prezzo in base alla sua esperienza — e al suo interesse a chiudere",
    agency_desc: "Il suo guadagno non dipende dal prezzo finale ma dalla velocità di chiusura. Spingere al ribasso gli conviene. A te no.",
    agency_cost: "Ogni €10.000 in meno = tu perdi, l'agente quasi niente",
  },
    {
    num: "03",
    title: "Documenti verificati",
    desc: "RealAIstate ti guida nella raccolta di tutti i documenti necessari: planimetria catastale, APE, visura catastale, atto di provenienza, delibere condominiali. Ogni documento caricato viene verificato e reso disponibile ai potenziali acquirenti direttamente sulla scheda immobile.",
    highlight: "Un annuncio con documenti completi vende più velocemente — l'acquirente non deve aspettare e non ha motivo di dubitare.",
    agency_title: "L'agenzia raccoglie i documenti quando serve — spesso all'ultimo momento",
    agency_desc: "I documenti arrivano a pezzi, spesso solo dopo che l'acquirente ha già fatto un'offerta. Rallenta tutto e crea incertezza inutile.",
    agency_cost: "Ritardi di settimane per documenti mancanti a ridosso del rogito",
  },
  {
    num: "04",
    title: "Gestisci le visite",
    desc: "I compratori ti contattano direttamente attraverso la chat mediata di RealAIstate. L'AI filtra i messaggi, protegge la tua privacy e prepara sia te che il compratore con le domande giuste prima della visita. Nessuna sorpresa, nessuna tensione.",
    highlight: "Parli solo con compratori seri, già informati sul prezzo e le caratteristiche dell'immobile.",
    agency_title: "L'agenzia gestisce lei le visite — spesso senza dirti chi viene o cosa ha detto",
    agency_desc: "Perdi il controllo del processo. Non sai con chi stai trattando davvero, né quanto è motivato l'acquirente.",
    agency_cost: "Zero trasparenza sul processo di visita",
  },
  {
    num: "05",
    title: "La proposta d'acquisto digitale",
    desc: "Il compratore compila e firma digitalmente la proposta d'acquisto direttamente in piattaforma. Niente carta, niente assegni consegnati all'agenzia. Il documento è valido legalmente ai sensi dell'art. 1341-1342 c.c. L'unica firma fisica rimane quella del rogito notarile.",
    highlight: "Firma digitale certificata. Nessun agente che detiene documenti o assegni a tuo nome.",
    agency_title: "L'agenzia gestisce la proposta su carta, raccoglie l'assegno e lo tiene in deposito",
    agency_desc: "Il tuo assegno di caparra va fisicamente all'agenzia. Se qualcosa va storto, recuperarlo è complicato.",
    agency_cost: "L'assegno di caparra passa per le mani dell'agente",
  },
  {
    num: "06",
    title: "La caparra confirmatoria",
    desc: "La caparra viene gestita tramite escrow digitale — un conto di terze parti che blocca i fondi in modo sicuro fino al rogito, senza che né il venditore né il compratore possano accedervi unilateralmente. In alternativa, il notaio può fungere da depositario fiduciario.",
    highlight: "I soldi sono al sicuro, tracciabili e protetti. Nessun agente coinvolto, zero rischi.",
    agency_title: "La caparra viene consegnata all'agente, che la tiene in deposito",
    agency_desc: "L'agente diventa custode dei tuoi soldi. Non è un istituto finanziario regolamentato. In caso di insolvenza o controversie, sei esposto.",
    agency_cost: "Rischio: fondi non in un conto regolamentato",
  },
  {
    num: "07",
    title: "Il rogito notarile",
    desc: "Il notaio rimane obbligatorio per legge — con o senza agenzia. RealAIstate ti connette con notai certificati, coordina la prenotazione e ti presenta all'appuntamento con tutti i documenti in ordine. È l'unica ora della tua vita che passi in uno studio notarile.",
    highlight: "Stesso notaio, stessa garanzia legale. Ma senza pagare il 3–6% di commissioni d'agenzia.",
    agency_title: "L'agenzia 'coordina' il notaio — ma il notaio lavorava già direttamente con le parti",
    agency_desc: "Il ruolo dell'agenzia nel rogito è marginale. Il notaio tutela entrambe le parti indipendentemente. Stai pagando migliaia di euro per un servizio che non aggiunge valore in questa fase.",
    agency_cost: "Commissione agenzia: €9.000–18.000 su €300.000",
  },
];

const STEPS_COMPRATORE = [
  {
    num: "01",
    title: "Cerca con il Fair Price Score",
    desc: "Ogni immobile su RealAIstate ha un Fair Price Score — una valutazione oggettiva basata sui dati OMI dell'Agenzia delle Entrate. Sai subito se il prezzo è in linea col mercato, sopra o sotto, con i dati che lo spiegano. Nessuna opinione, nessun conflitto di interessi.",
    highlight: "Cerchi casa con dati reali, non con prezzi gonfiati dall'agenzia per 'trattare'.",
    agency_title: "Gli annunci delle agenzie hanno prezzi strategicamente alzati per dare margine alla trattativa",
    agency_desc: "Il prezzo pubblicato non è mai il prezzo reale. Devi negoziare al ribasso partendo da un numero falso. L'agente gestisce la trattativa nell'interesse di chi gli paga di più.",
    agency_cost: "Prezzi gonfiati del 5–15% per 'margine di trattativa'",
  },
  {
    num: "02",
    title: "Analizza l'immobile",
    desc: "Per ogni immobile hai l'analisi AI completa: Fair Price Score, Investment Score, punti di forza, domande consigliate per la visita. Il venditore le ha già ricevute e si è preparato — nessuna sorpresa, nessuna tensione durante la visita.",
    highlight: "Arrivi alla visita preparato. Sai già tutto ciò che conta sull'immobile.",
    agency_title: "L'agente ti prepara una 'brochure' creata per vendere, non per informarti",
    agency_desc: "Le criticità non vengono mai citate. Le domande scomode vengono eluse. L'agente è lì per chiudere, non per aiutarti a decidere bene.",
    agency_cost: "Informazione di parte, filtrata dall'interesse dell'agente",
  },
    {
    num: "03",
    title: "Verifica la tua capacità d'acquisto",
    desc: "Prima di innamorarti di una casa, scopri se puoi davvero permettertela. La chat AI di RealAIstate ti fa le domande giuste — reddito, risparmi, rate esistenti, situazione lavorativa — e ti dice in pochi minuti se sei in linea per un mutuo e quanto puoi spendere. Zero giudizi, zero impegni. Una volta completata la verifica, RealAIstate ti mette in contatto con le banche e i broker più adeguati alla tua situazione — selezionati in base al tuo profilo, non in base a chi paga più commissioni.",
    highlight: "Arrivi alla trattativa già sapendo cosa puoi offrire — e con le banche giuste già al tuo fianco. Meglio per te, che eviti brutte sorprese. Meglio per il venditore, che tratta con un acquirente già qualificato.",
    agency_title: "L'agente ti porta a vedere case e ti fa fare offerte — senza mai verificare se puoi permettertele",
    agency_desc: "La verifica del mutuo arriva tardi, spesso dopo il compromesso. Se la banca dice no, hai già versato la caparra e sei in una situazione complicata.",
    agency_cost: "Caparra a rischio se il mutuo viene negato dopo l'offerta",
  },
  {
    num: "04",
    title: "Contatta il venditore",
    desc: "Parli direttamente con il venditore attraverso la chat mediata di RealAIstate. L'AI facilita la conversazione, filtra i toni e protegge entrambe le parti. Nessun intermediario che gestisce le informazioni nel proprio interesse.",
    highlight: "Comunicazione diretta, trasparente, mediata dall'AI — non da chi prende commissione.",
    agency_title: "L'agente intermedia ogni comunicazione — e decide cosa passarti e cosa no",
    agency_desc: "Non sai mai cosa ha davvero detto il venditore. Le informazioni vengono filtrate per favorire la chiusura.",
    agency_cost: "Zero accesso diretto al venditore",
  },
  {
    num: "05",
    title: "Fai la tua offerta",
    desc: "Compila e firma digitalmente la proposta d'acquisto direttamente in piattaforma. Il prezzo è supportato dall'AI con dati di mercato reali. La proposta è legalmente valida ai sensi dell'art. 1341-1342 c.c. — nessuna carta, nessun assegno all'agenzia.",
    highlight: "La tua offerta è documentata, tracciabile e firmata digitalmente. Nessun agente che gestisce i tuoi soldi.",
    agency_title: "Firmi la proposta in agenzia e consegni un assegno all'agente",
    agency_desc: "Il tuo assegno di caparra va fisicamente all'agenzia prima ancora che il venditore abbia accettato. Se la proposta non viene accettata, devi recuperarlo tu.",
    agency_cost: "Assegno consegnato all'agente prima dell'accettazione",
  },
  {
    num: "06",
    title: "La caparra in sicurezza",
    desc: "Scegli tu come gestire la caparra: escrow digitale (conto di terze parti regolamentato) o notaio come depositario fiduciario. I fondi sono bloccati e protetti fino al rogito. Se la trattativa salta per colpa del venditore, ricevi il doppio della caparra — per legge.",
    highlight: "Fondi protetti, tracciabili, in un conto regolamentato. Nessun agente coinvolto.",
    agency_title: "La caparra va all'agenzia, che la 'trasferirà' al venditore",
    agency_desc: "Stai affidando i tuoi soldi a un soggetto non regolamentato come istituto finanziario. In caso di controversia, recuperare la caparra può essere lungo e costoso.",
    agency_cost: "Fondi non in conto regolamentato",
  },
  {
    num: "07",
    title: "Il rogito — l'unica firma fisica",
    desc: "Il notaio è obbligatorio per legge ed è lui che garantisce la validità del trasferimento di proprietà. RealAIstate coordina tutto: prenota il notaio, verifica i documenti, ti prepara all'appuntamento. È l'unica ora che passi fisicamente in uno studio notarile.",
    highlight: "Stessa garanzia legale dell'agenzia. Ma senza pagare il 3–6% di commissioni d'agenzia.",
    agency_title: "L'agenzia 'accompagna al rogito' — per cui hai già pagato migliaia di euro",
    agency_desc: "Il notaio tutela entrambe le parti indipendentemente dalla presenza dell'agente. Stai pagando per un servizio che non aggiunge nulla in questa fase.",
    agency_cost: "Commissione compratore: 3–6% sul prezzo di acquisto",
  },
];

export default function ComeFunziona() {
  const [audience, setAudience] = useState("venditore");
  const steps = audience === "venditore" ? STEPS_VENDITORE : STEPS_COMPRATORE;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <style>{styles}</style>

      <NavBar />

      <div className="cf-hero">
        <div className="cf-eyebrow">Come funziona</div>
        <h1 className="cf-h1">Ogni passo.<br />Senza <span>agenzia.</span></h1>
        <p className="cf-sub">
          Compravendita immobiliare senza intermediari. Step by step — con il confronto diretto su cosa fa RealAIstate e cosa farebbe al suo posto un'agenzia.
        </p>
        <p className="cf-trasparenza">
          "Trasparenza totale — su ogni step, su ogni documento, su ogni euro. <em>Per tutti.</em>"
        </p>

        <div className="cf-pillole">
          <div className="cf-pillola">
            <div className="cf-pillola-icon">✓</div>
            <div className="cf-pillola-text">
              <strong>Documenti verificati</strong>
              <span>Tutto visibile prima dell'offerta</span>
            </div>
          </div>
          <div className="cf-pillola">
            <div className="cf-pillola-icon">◎</div>
            <div className="cf-pillola-text">
              <strong>Prezzi trasparenti</strong>
              <span>Fair Price Score su dati pubblici OMI</span>
            </div>
          </div>
          <div className="cf-pillola">
            <div className="cf-pillola-icon">⊘</div>
            <div className="cf-pillola-text">
              <strong>Zero conflitti di interessi</strong>
              <span>Non guadagniamo di più se chiudi prima</span>
            </div>
          </div>
        </div>

        <div className="cf-toggle" style={{ marginTop: "2.5rem" }}>
          <button className={`cf-toggle-btn ${audience === "venditore" ? "active" : ""}`} onClick={() => setAudience("venditore")}>
            Sto vendendo
          </button>
          <button className={`cf-toggle-btn ${audience === "compratore" ? "active" : ""}`} onClick={() => setAudience("compratore")}>
            Sto comprando
          </button>
        </div>
      </div>

      <div className="cf-content">
        <div className="cf-steps">
          {steps.map((step) => (
            <div className="cf-step" key={step.num}>
              <div className="cf-step-num">{step.num}</div>

              <div className="cf-step-real">
                <div className="cf-step-badge">✦ RealAIstate</div>
                <h2 className="cf-step-title">{step.title}</h2>
                <p className="cf-step-desc">{step.desc}</p>
                <div className="cf-step-highlight">
                  <span className="cf-step-highlight-icon">→</span>
                  <span>{step.highlight}</span>
                </div>
                {step.highlightLink && (
                  <div style={{ marginTop: "0.8rem" }}>
                    <a href={step.highlightLink} style={{ fontSize: "0.8rem", color: "var(--gold)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                      ✦ Come calcoliamo il Fair Price Score →
                    </a>
                  </div>
                )}
              </div>

              <div className="cf-step-agency">
                <div className="cf-agency-label">Con un'agenzia tradizionale</div>
                <div className="cf-agency-title">{step.agency_title}</div>
                <p className="cf-agency-desc">{step.agency_desc}</p>
                {step.agency_cost && (
                  <div className="cf-agency-cost">⚠ {step.agency_cost}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="cf-cta">
          <h2 className="cf-cta-title">
            {audience === "venditore"
              ? <>Pronto a <span>vendere</span>?</>
              : <>Pronto a <span>comprare</span>?</>
            }
          </h2>
          <p className="cf-cta-sub">
            {audience === "venditore"
              ? "Pubblica il tuo immobile gratuitamente. Nessun mandato, nessuna commissione sul prezzo di vendita."
              : "Cerca immobili con il Fair Price Score. Sai subito se il prezzo è giusto."}
          </p>
          <div className="cf-cta-actions">
            {audience === "venditore" ? (
              <>
                <a href="/vendi" className="cf-btn-red">Pubblica il tuo immobile →</a>
                <a href="/faq" className="cf-btn-outline">Hai domande? Leggi le FAQ</a>
              </>
            ) : (
              <>
                <a href="/immobile/1" className="cf-btn-red">Vedi un esempio →</a>
                <a href="/faq" className="cf-btn-outline">Hai domande? Leggi le FAQ</a>
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
