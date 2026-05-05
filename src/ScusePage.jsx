import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  .scuse-hero { min-height: 55vh; display: flex; flex-direction: column; justify-content: center; padding: 5.5rem 3rem 2.5rem; position: relative; overflow: hidden; }
  .scuse-hero-bg { position: absolute; right: -2rem; top: 50%; transform: translateY(-50%); font-family: 'Bebas Neue', sans-serif; font-size: clamp(180px, 28vw, 380px); color: rgba(247,245,240,0.025); line-height: 1; user-select: none; pointer-events: none; }
  .scuse-form-section { background: var(--white); padding: 5rem 3rem; }
  .scuse-section-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .scuse-section-label::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .scuse-form-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1; color: var(--black); margin-bottom: 0.8rem; }
  .scuse-form-sub { font-size: 0.95rem; color: var(--muted); margin-bottom: 2.5rem; max-width: 560px; line-height: 1.6; }
  .scuse-input-wrap { display: flex; gap: 0; max-width: 640px; }
  .scuse-textarea { flex: 1; padding: 1rem 1.5rem; border: 2px solid rgba(10,10,10,0.15); border-right: none; background: transparent; color: var(--black); font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-style: italic; border-radius: 2px 0 0 2px; outline: none; transition: border-color 0.2s; resize: none; height: 64px; }
  .scuse-textarea::placeholder { color: rgba(10,10,10,0.25); font-style: italic; }
  .scuse-textarea:focus { border-color: var(--red); }
  .scuse-submit { background: var(--red); color: white; border: 2px solid var(--red); padding: 0 2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 0 2px 2px 0; transition: background 0.2s; white-space: nowrap; }
  .scuse-submit:hover:not(:disabled) { background: var(--red-dark); }
  .scuse-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .scuse-response { margin-top: 2rem; max-width: 640px; background: var(--black); border-radius: 3px; padding: 2rem; border-left: 3px solid var(--red); animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .scuse-response-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .scuse-response-text { font-size: 1rem; line-height: 1.7; color: var(--white); }
  .scuse-response-text strong { color: var(--gold); }
  .scuse-loading { display: flex; align-items: center; gap: 0.6rem; color: var(--muted); font-size: 0.9rem; margin-top: 2rem; }
  .scuse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: bounce 1.2s infinite; }
  .scuse-dot:nth-child(2) { animation-delay: 0.2s; }
  .scuse-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
  .hall-section { background: var(--surface); padding: 5rem 3rem; }
  .hall-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .hall-label::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
  .hall-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1; color: var(--white); margin-bottom: 3rem; }
  .hall-item { border-top: 1px solid var(--border); padding: 1.8rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; transition: background 0.2s; }
  .hall-item:last-child { border-bottom: 1px solid var(--border); }
  .hall-item:hover { background: rgba(247,245,240,0.02); }
  .hall-scusa { font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-style: italic; color: rgba(247,245,240,0.35); line-height: 1.4; }
  .hall-risposta { font-size: 0.9rem; line-height: 1.6; color: rgba(247,245,240,0.7); padding-left: 2rem; border-left: 1px solid var(--border); }
  .hall-risposta strong { color: var(--white); }
  @media (max-width: 900px) {
    .scuse-form-section { padding: 4rem 1.5rem; }
    .scuse-input-wrap { flex-direction: column; }
    .scuse-textarea { border-right: 2px solid rgba(10,10,10,0.15); border-bottom: none; border-radius: 2px 2px 0 0; }
    .scuse-submit { border-radius: 0 0 2px 2px; padding: 1rem; }
    .hall-section { padding: 4rem 1.5rem; }
    .hall-item { grid-template-columns: 1fr; gap: 1rem; }
    .hall-risposta { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 1rem; }
  }
`;

const hallOfFame = [
  { scusa: '"Non mi fido a vendere casa senza un esperto."', risposta: <><strong>L&apos;esperto ha un conflitto di interessi.</strong> Vuole chiudere veloce, tu vuoi vendere al prezzo giusto. Non sono la stessa cosa.</> },
  { scusa: '"E se mi chiamano alle 3 di notte per una visita?"', risposta: <><strong>Con RealAIstate gestisci tu gli orari.</strong> Nessuno ti chiama. Tu decidi quando fare vedere casa. Sempre.</> },
  { scusa: '"Non ho tempo per gestire tutto."', risposta: <><strong>Ci vuole meno tempo di quanto pensi.</strong> L&apos;AI genera l&apos;annuncio, risponde alle domande e coordina i professionisti. Tu approvi.</> },
  { scusa: '"E se arriva un acquirente strano?"', risposta: <><strong>Chi porta gli acquirenti oggi? L&apos;agenzia.</strong> Gli stessi che entrano in casa tua. Almeno con RealAIstate sai chi hai di fronte.</> },
  { scusa: '"Non ho nessuno a cui lasciare l\'assegno della caparra. Di certo non posso lasciarlo al venditore."', risposta: <><strong>L&apos;assegno non lo lasci a nessuno — lo blocchi.</strong> Con RealAIstate usi un escrow digitale: i soldi restano congelati su un conto terzo fino al rogito.</> },
  { scusa: '"Non conosco nessun notaio valido di cui fidarmi. Almeno l\'agente può consigliarmene uno."', risposta: <><strong>L&apos;agente ti consiglia il notaio con cui lavora abitualmente.</strong> Su RealAIstate scegli tra notai certificati e indipendenti — nessun conflitto di interessi.</> },
];

export default function ScusePage() {
  const [scusa, setScusa] = useState("");
  const [status, setStatus] = useState("idle");
  const [risposta, setRisposta] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async () => {
    if (!scusa.trim() || status === "loading") return;
    setStatus("loading");
    setRisposta("");
    try {
      const res = await fetch("/api/smonta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scusa })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      setRisposta(data.risposta);
      setStatus("done");
    } catch { setStatus("error"); }
  };

  const formatText = (text) => text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );

  return (
    <>
    <style>{styles}</style>
      <NavBar />
      <section className="scuse-hero">
        <div className="scuse-hero-bg">?</div>
        <div className="hero-eyebrow">Il grande libro delle scuse</div>
        <h1 className="hero-h1">
          La tua scusa<br />non regge.
        </h1>
        <p className="hero-sub">Hai una scusa per cui pensi di aver bisogno di un&apos;agenzia? Mandacela. L&apos;AI te la smonta in 3 secondi.</p>
      </section>

      <section className="scuse-form-section">
        <div className="scuse-section-label">Sfida l&apos;AI</div>
        <h2 className="scuse-form-title">Scrivi la tua scusa.</h2>
        <p className="scuse-form-sub">Qual è il motivo per cui pensi di aver bisogno di un&apos;agenzia? Scrivila qui sotto.</p>
        <div className="scuse-input-wrap">
          <textarea
            className="scuse-textarea"
            placeholder='"Ho paura di fare errori senza un esperto..."'
            value={scusa}
            onChange={(e) => setScusa(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          />
          <button className="scuse-submit" onClick={handleSubmit} disabled={status === "loading" || !scusa.trim()}>
            {status === "loading" ? "..." : "Smontala →"}
          </button>
        </div>
        {status === "loading" && (
          <div className="scuse-loading">
            <div className="scuse-dot" /><div className="scuse-dot" /><div className="scuse-dot" />
            <span>L&apos;AI sta analizzando la tua scusa...</span>
          </div>
        )}
        {status === "done" && risposta && (
          <div className="scuse-response">
            <div className="scuse-response-label">● Risposta di RealAIstate</div>
            <div className="scuse-response-text">{formatText(risposta)}</div>
          </div>
        )}
        {status === "error" && (
          <div className="scuse-response">
            <div className="scuse-response-text" style={{ color: "var(--red)" }}>Qualcosa è andato storto. Riprova tra un momento.</div>
          </div>
        )}
      </section>

      <section className="hall-section">
        <div className="hall-label">Hall of Fame</div>
        <h2 className="hall-title">Le scuse più creative.<br />Smontate.</h2>
        <div>
          {hallOfFame.map((item, i) => (
            <div className="hall-item" key={i}>
              <div className="hall-scusa">{item.scusa}</div>
              <div className="hall-risposta">{item.risposta}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section" id="early">
        <div className="cta-pre">Early Access</div>
        <h2 className="cta-title">Basta<br /><span>scuse.</span></h2>
        <p className="cta-sub">Stiamo costruendo RealAIstate. Entra in lista d&apos;attesa e ricevi l&apos;accesso anticipato.</p>
        <div className="cta-form">
          <a href="/login" className="btn-cta-submit">Crea il tuo account →</a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}