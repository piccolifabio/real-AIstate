import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Privacy from "./Privacy.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --white: #f7f5f0;
    --red: #d93025;
    --red-dark: #b02020;
    --gold: #c9a84c;
    --muted: #6b6b6b;
    --surface: #141414;
    --border: rgba(247,245,240,0.08);
    --green: #2d6a4f;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--black);
    color: var(--white);
    overflow-x: hidden;
  }

  body::after {
    content: '';
    position: fixed; inset: 0; z-index: 9999; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.025;
  }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 3rem;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,10,0.9);
    backdrop-filter: blur(16px);
  }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .nav-logo span { color: var(--red); }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: var(--white); }
  .nav-cta { background: var(--red) !important; color: var(--white) !important; padding: 0.55rem 1.4rem; border-radius: 2px; font-size: 0.75rem !important; letter-spacing: 0.12em !important; transition: background 0.2s !important; }
  .nav-cta:hover { background: var(--red-dark) !important; }

  .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 8rem 3rem 5rem; position: relative; overflow: hidden; }
  .hero-bg-number { position: absolute; right: -2rem; top: 50%; transform: translateY(-50%); font-family: 'Bebas Neue', sans-serif; font-size: clamp(200px, 30vw, 420px); color: rgba(247,245,240,0.025); line-height: 1; user-select: none; pointer-events: none; }
  .hero-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 2rem; display: flex; align-items: center; gap: 0.8rem; }
  .hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .hero-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(4rem, 10vw, 10rem); line-height: 0.92; letter-spacing: 0.01em; color: var(--white); max-width: 900px; margin-bottom: 0.5rem; }
  .hero-h1 .strike { position: relative; display: inline-block; color: rgba(247,245,240,0.2); }
  .hero-h1 .strike::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 4px; background: var(--red); transform: rotate(-2deg); }
  .hero-answer { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3.5rem, 7vw, 7rem); color: var(--red); line-height: 1; letter-spacing: 0.02em; margin-bottom: 3rem; }
  .hero-sub { font-size: 1.1rem; font-weight: 300; line-height: 1.7; color: rgba(247,245,240,0.5); max-width: 500px; margin-bottom: 3rem; }
  .hero-sub strong { color: var(--white); font-weight: 500; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }

  .btn-red { background: var(--red); color: var(--white); border: none; padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: background 0.2s, transform 0.15s; text-decoration: none; display: inline-block; }
  .btn-red:hover { background: var(--red-dark); transform: translateY(-2px); }
  .btn-outline { background: transparent; color: rgba(247,245,240,0.6); border: 1px solid rgba(247,245,240,0.15); padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 400; cursor: pointer; border-radius: 2px; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; }
  .btn-outline:hover { border-color: rgba(247,245,240,0.4); color: var(--white); }

  .hero-cost { margin-top: 4rem; padding-top: 2.5rem; border-top: 1px solid var(--border); display: flex; gap: 3rem; align-items: center; }
  .cost-num { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; line-height: 1; color: var(--white); }
  .cost-num.red { color: var(--red); }
  .cost-label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.35); margin-top: 0.25rem; }
  .cost-divider { width: 1px; height: 48px; background: var(--border); }

  .excuses { background: var(--white); color: var(--black); padding: 7rem 3rem; }
  .excuses-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .excuses-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .excuses-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; color: var(--black); margin-bottom: 4rem; max-width: 700px; }
  .excuse-row { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid rgba(10,10,10,0.1); padding: 2rem 0; transition: background 0.2s; }
  .excuse-row:last-child { border-bottom: 1px solid rgba(10,10,10,0.1); }
  .excuse-row:hover { background: rgba(10,10,10,0.02); }
  .excuse-left { display: flex; align-items: flex-start; gap: 1.5rem; padding-right: 3rem; }
  .excuse-num { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: rgba(10,10,10,0.2); flex-shrink: 0; padding-top: 0.2rem; }
  .excuse-text { font-family: 'DM Serif Display', serif; font-size: 1.3rem; line-height: 1.3; color: rgba(10,10,10,0.4); font-style: italic; }
  .excuse-right { display: flex; align-items: flex-start; gap: 1rem; padding-left: 3rem; border-left: 1px solid rgba(10,10,10,0.08); }
  .excuse-arrow { font-size: 1.2rem; color: var(--red); flex-shrink: 0; padding-top: 0.1rem; }
  .excuse-answer { font-size: 0.95rem; line-height: 1.6; color: var(--black); }
  .excuse-answer strong { font-weight: 600; }

  .sentence-section { background: var(--red); padding: 6rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .sentence-section::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.03) 41px); }
  .sentence-text { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 5vw, 4.5rem); line-height: 1.05; color: var(--white); max-width: 900px; margin: 0 auto; position: relative; z-index: 1; letter-spacing: 0.02em; }
  .sentence-sub { font-size: 1rem; color: rgba(247,245,240,0.65); margin-top: 1.5rem; position: relative; z-index: 1; font-weight: 300; }

  .how-section { padding: 7rem 3rem; background: var(--black); }
  .how-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .how-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .how-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; color: var(--white); margin-bottom: 3rem; max-width: 600px; }
  .how-tabs { display: flex; gap: 0; margin-bottom: 3rem; border-bottom: 1px solid var(--border); }
  .how-tab { padding: 0.8rem 1.8rem; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.35); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; font-family: 'DM Sans', sans-serif; }
  .how-tab.active { color: var(--white); border-bottom-color: var(--red); }
  .how-tab:hover { color: rgba(247,245,240,0.7); }
  .how-step { display: grid; grid-template-columns: 80px 1fr auto; align-items: center; gap: 2rem; padding: 2rem 0; border-bottom: 1px solid var(--border); transition: background 0.2s; }
  .how-step:hover { background: rgba(247,245,240,0.02); }
  .how-step-num { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: rgba(247,245,240,0.08); line-height: 1; }
  .how-step-title { font-size: 1.05rem; font-weight: 600; color: var(--white); margin-bottom: 0.4rem; }
  .how-step-desc { font-size: 0.85rem; line-height: 1.6; color: rgba(247,245,240,0.4); }
  .how-step-tag { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 0.8rem; border-radius: 2px; white-space: nowrap; }
  .tag-ai { background: rgba(201,168,76,0.12); color: var(--gold); }
  .tag-auto { background: rgba(217,48,37,0.1); color: var(--red); }
  .tag-pro { background: rgba(247,245,240,0.06); color: rgba(247,245,240,0.5); }

  .forwho-section { padding: 7rem 3rem; background: var(--surface); }
  .forwho-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .forwho-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .forwho-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; color: var(--white); margin-bottom: 3rem; }
  .forwho-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .forwho-card { background: rgba(247,245,240,0.03); padding: 2.5rem; border: 1px solid var(--border); transition: background 0.3s; position: relative; overflow: hidden; }
  .forwho-card:hover { background: rgba(247,245,240,0.06); }
  .forwho-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--red); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
  .forwho-card:hover::before { transform: scaleX(1); }
  .forwho-role { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .forwho-name { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--white); margin-bottom: 0.8rem; line-height: 1; }
  .forwho-desc { font-size: 0.85rem; line-height: 1.7; color: rgba(247,245,240,0.4); margin-bottom: 1.5rem; }
  .forwho-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
  .forwho-list li { font-size: 0.8rem; color: rgba(247,245,240,0.5); display: flex; align-items: flex-start; gap: 0.6rem; }
  .forwho-list li::before { content: '→'; color: var(--red); flex-shrink: 0; }

  .cta-section { background: var(--white); color: var(--black); padding: 8rem 3rem; text-align: center; }
  .cta-pre { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.8rem; }
  .cta-pre::before, .cta-pre::after { content: ''; width: 24px; height: 1px; background: var(--red); }
  .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 7rem); line-height: 0.95; color: var(--black); margin-bottom: 1.5rem; }
  .cta-title span { color: var(--red); }
  .cta-sub { font-size: 1rem; color: rgba(10,10,10,0.5); max-width: 420px; margin: 0 auto 3rem; line-height: 1.7; font-weight: 300; }
  .cta-form { display: flex; gap: 0; justify-content: center; max-width: 480px; margin: 0 auto; }
  .cta-input { flex: 1; padding: 1rem 1.5rem; border: 2px solid rgba(10,10,10,0.15); border-right: none; background: transparent; color: var(--black); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; border-radius: 2px 0 0 2px; outline: none; transition: border-color 0.2s; }
  .cta-input::placeholder { color: rgba(10,10,10,0.3); }
  .cta-input:focus { border-color: var(--red); }
  .btn-cta-submit { background: var(--red); color: white; border: 2px solid var(--red); padding: 1rem 1.8rem; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 0 2px 2px 0; transition: background 0.2s; white-space: nowrap; }
  .btn-cta-submit:hover:not(:disabled) { background: var(--red-dark); border-color: var(--red-dark); }
  .btn-cta-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .cta-note { font-size: 0.72rem; color: rgba(10,10,10,0.3); margin-top: 1rem; }
  .cta-success { font-size: 1.1rem; color: var(--green); font-weight: 600; margin-top: 0.5rem; }
  .cta-success-sub { font-size: 0.85rem; color: rgba(10,10,10,0.4); margin-top: 0.5rem; }
  .cta-error { font-size: 0.85rem; color: var(--red); margin-top: 0.5rem; }

  .footer { background: var(--black); padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); font-size: 0.75rem; color: rgba(247,245,240,0.2); }
  .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: rgba(247,245,240,0.4); letter-spacing: 0.05em; }
  .footer-logo span { color: var(--red); }
  .footer-links { display: flex; gap: 2rem; }
  .footer-links a { color: rgba(247,245,240,0.2); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: rgba(247,245,240,0.6); }

  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 900px) {
    .nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .hero { padding: 7rem 1.5rem 4rem; }
    .hero-bg-number { display: none; }
    .hero-cost { gap: 1.5rem; flex-wrap: wrap; }
    .excuse-row { grid-template-columns: 1fr; gap: 1rem; }
    .excuse-right { border-left: none; border-top: 1px solid rgba(10,10,10,0.08); padding-left: 0; padding-top: 1rem; }
    .how-step { grid-template-columns: 50px 1fr; }
    .how-step-tag { display: none; }
    .forwho-grid { grid-template-columns: 1fr; }
    .excuses, .sentence-section, .how-section, .forwho-section, .cta-section { padding: 5rem 1.5rem; }
    .cta-form { flex-direction: column; }
    .cta-input { border-right: 2px solid rgba(10,10,10,0.15); border-bottom: none; border-radius: 2px 2px 0 0; }
    .btn-cta-submit { border-radius: 0 0 2px 2px; }
    .footer { flex-direction: column; gap: 1.5rem; text-align: center; padding: 2rem 1.5rem; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 100);
      }),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const excuses = [
  { text: '"Ho bisogno di qualcuno che conosca il mercato."', answer: <><strong>L&apos;AI analizza migliaia di transazioni nella tua zona.</strong> In tempo reale. Senza commissioni.</> },
  { text: '"Non saprei come fare le foto giuste."', answer: <><strong>RealAIstate valuta ogni foto che carichi</strong> e ti dice esattamente cosa migliorare, stanza per stanza.</> },
  { text: '"Per il notaio e i documenti ho bisogno di aiuto."', answer: <><strong>La piattaforma ti connette direttamente</strong> con notai, periti e professionisti certificati. Senza intermediari.</> },
  { text: '"Non riesco a capire se il prezzo è giusto."', answer: <><strong>Il Fair Price Score ti dice in 3 secondi</strong> se stai pagando troppo — e perché. Con dati, non opinioni.</> },
  { text: '"Ho paura di sbagliare senza qualcuno che mi segue."', answer: <><strong>L&apos;AI è con te in ogni passaggio</strong> — dalla valutazione alla trattativa, fino al rogito. Sempre disponibile, mai di parte.</> },
];

const sellerSteps = [
  { title: "Pubblica il tuo immobile", desc: "Inserisci i dati base. L'AI genera titolo, descrizione ottimizzata e ti dice il prezzo di mercato corretto.", tag: "AI", tagClass: "tag-ai" },
  { title: "Valuta le tue foto", desc: "Carica le immagini. RealAIstate analizza luminosità, angolazione e composizione. Ti dice cosa rifare.", tag: "AI", tagClass: "tag-ai" },
  { title: "Ricevi le proposte", desc: "Gli acquirenti ti contattano direttamente. Nessun intermediario. Nessuna percentuale da pagare.", tag: "Automatico", tagClass: "tag-auto" },
  { title: "Chiudi con i professionisti", desc: "Notaio, perito energetico, geometra. Li trovi tutti sulla piattaforma, certificati e a prezzo trasparente.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const buyerSteps = [
  { title: "Cerca senza filtri inutili", desc: "Zona, budget, obiettivo. La mappa mostra gli immobili ordinati per Fair Price Score, non per chi paga di più.", tag: "AI", tagClass: "tag-ai" },
  { title: "Analizza ogni scheda", desc: "Valutazione del prezzo, punti di forza, criticità, domande da fare. Tutto generato dall'AI in automatico.", tag: "AI", tagClass: "tag-ai" },
  { title: "Fai un'offerta diretta", desc: "Contatta il venditore. RealAIstate ti supporta nella trattativa con dati di mercato reali.", tag: "Automatico", tagClass: "tag-auto" },
  { title: "Chiudi in sicurezza", desc: "Perizia, APE, atti notarili. La piattaforma coordina tutto. Tu arrivi al rogito preparato.", tag: "Rete Pro", tagClass: "tag-pro" },
];

const cards = [
  { role: "Stai vendendo", name: "Pubblica. Incassa. Tutto.", desc: "Smetti di cedere migliaia di euro a chi mette il tuo annuncio su un portale e risponde al telefono al posto tuo.", items: ["Valutazione AI del prezzo di mercato", "Analisi e miglioramento delle foto", "Annuncio generato e ottimizzato dall'AI", "Rete di professionisti certificati", "Gestione trattativa diretta col compratore"] },
  { role: "Stai comprando", name: "Cerca. Analizza. Decidi.", desc: "Finisci di dipendere da qualcuno che rappresenta il venditore e si fa pagare anche da te.", items: ["Fair Price Score su ogni immobile", "Analisi AI di punti di forza e criticità", "Domande consigliate prima della visita", "Connessione diretta col venditore", "Supporto AI dalla proposta al rogito"] },
  { role: "Sei un investitore", name: "Dati. Score. Pipeline.", desc: "Ogni ora persa a confrontare annunci è denaro. Il workspace investitore centralizza tutto in un flusso unico.", items: ["Investment Score con spiegazione", "Classificazione: rendita, flip, affitto breve", "Pipeline opportunità con stato avanzamento", "Report decisionale esportabile", "Alert automatici su nuovi immobili"] },
  { role: "Sei un professionista", name: "Entra nella rete.", desc: "Notai, periti, geometri, ingegneri: RealAIstate ti porta clienti qualificati, già informati, pronti a procedere.", items: ["Profilo verificato sulla piattaforma", "Richieste da utenti già qualificati dall'AI", "Nessuna agenzia nel mezzo", "Pagamenti trasparenti e tracciati", "Visibilità su tutto il territorio"] },
];

function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus("success"); setEmail(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section className="cta-section" id="early">
      <div className="cta-pre">Early Access</div>
      <h2 className="cta-title">Basta<br /><span>scuse.</span></h2>
      <p className="cta-sub">Stiamo costruendo RealAIstate. Entra in lista d&apos;attesa e ricevi l&apos;accesso anticipato quando apriamo.</p>
      {status === "success" ? (
        <div>
          <div className="cta-success">✓ Sei dentro.</div>
          <div className="cta-success-sub">Ti contatteremo non appena apriamo l&apos;accesso.</div>
        </div>
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

function Home() {
  useScrollReveal();
  const [tab, setTab] = useState("venditore");
  const steps = tab === "venditore" ? sellerSteps : buyerSteps;

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">Real<span>AI</span>state</a>
        <ul className="nav-links">
          <li><a href="#perche">Perché</a></li>
          <li><a href="#come-funziona">Come funziona</a></li>
          <li><a href="#per-chi">Per chi</a></li>
          <li><a href="#early" className="nav-cta">Accesso anticipato</a></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-bg-number">€15K</div>
        <div className="hero-eyebrow">Piattaforma AI · Compra e vendi casa</div>
        <h1 className="hero-h1">Hai davvero bisogno<br />di un&apos;<span className="strike">agenzia</span>?</h1>
        <div className="hero-answer">No.</div>
        <p className="hero-sub"><strong>RealAIstate</strong> mette venditore e compratore direttamente in contatto. L&apos;AI fa la valutazione, analizza le foto, trova i professionisti. Tu tieni i soldi.</p>
        <div className="hero-actions">
          <a href="#early" className="btn-red">Entra in lista d&apos;attesa</a>
          <a href="#perche" className="btn-outline"><span>↓</span> Scopri perché</a>
        </div>
        <div className="hero-cost">
          <div><div className="cost-num red">3–6%</div><div className="cost-label">Commissione media agenzia</div></div>
          <div className="cost-divider" />
          <div><div className="cost-num red">€9.000–18.000</div><div className="cost-label">Su una casa da €300k</div></div>
          <div className="cost-divider" />
          <div><div className="cost-num">€0</div><div className="cost-label">Con RealAIstate</div></div>
        </div>
      </section>

      <section className="excuses" id="perche">
        <div className="excuses-label">Le scuse finiscono qui</div>
        <h2 className="excuses-title">Perché continui<br />a pagare l&apos;agenzia?</h2>
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
        </div>
        <div>
          {steps.map((s, i) => (
            <div className="how-step reveal" key={i + tab}>
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

      <footer className="footer">
        <div className="footer-logo">Real<span>AI</span>state</div>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="#">Termini</a>
          <a href="mailto:info@realaistate.ai">Contatti</a>
        </div>
        <div>© 2025 RealAIstate</div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </>
  );
}
