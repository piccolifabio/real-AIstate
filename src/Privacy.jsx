import { useEffect } from "react";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --white: #f7f5f0;
    --red: #d93025;
    --muted: #6b6b6b;
    --border: rgba(247,245,240,0.08);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--black);
    color: var(--white);
    overflow-x: hidden;
  }

  .legal-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 3rem;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,10,0.95);
    backdrop-filter: blur(16px);
  }
  .legal-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .legal-nav-logo span { color: var(--red); }
  .legal-nav-back { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; display: flex; align-items: center; gap: 0.4rem; }
  .legal-nav-back:hover { color: var(--white); }

  .legal-container {
    max-width: 760px;
    margin: 0 auto;
    padding: 8rem 2rem 6rem;
  }

  .legal-eyebrow {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--red);
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.8rem;
  }
  .legal-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--red); }

  .legal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 5rem);
    line-height: 1; color: var(--white);
    margin-bottom: 0.5rem;
  }

  .legal-date {
    font-size: 0.78rem; color: rgba(247,245,240,0.3);
    margin-bottom: 4rem; letter-spacing: 0.05em;
  }

  .legal-section {
    margin-bottom: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--border);
  }
  .legal-section:last-child { border-bottom: none; }

  .legal-section h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem; color: var(--white);
    margin-bottom: 1rem; letter-spacing: 0.02em;
  }

  .legal-section p {
    font-size: 0.92rem; line-height: 1.8;
    color: rgba(247,245,240,0.55);
    margin-bottom: 1rem;
  }
  .legal-section p:last-child { margin-bottom: 0; }

  .legal-section ul {
    list-style: none; margin: 1rem 0;
    display: flex; flex-direction: column; gap: 0.5rem;
  }
  .legal-section ul li {
    font-size: 0.92rem; line-height: 1.7;
    color: rgba(247,245,240,0.55);
    display: flex; align-items: flex-start; gap: 0.8rem;
  }
  .legal-section ul li::before { content: '→'; color: var(--red); flex-shrink: 0; }

  .legal-section a { color: var(--red); text-decoration: none; }
  .legal-section a:hover { text-decoration: underline; }

  .legal-highlight {
    background: rgba(247,245,240,0.04);
    border-left: 2px solid var(--red);
    padding: 1.2rem 1.5rem;
    border-radius: 0 2px 2px 0;
    margin: 1.5rem 0;
  }
  .legal-highlight p { color: rgba(247,245,240,0.7) !important; }

  @media (max-width: 768px) {
    .legal-nav { padding: 1rem 1.5rem; }
    .legal-container { padding: 7rem 1.5rem 4rem; }
  }
`;

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <nav className="legal-nav">
        <a href="/" className="legal-nav-logo">Real<span>AI</span>state</a>
        <a href="/" className="legal-nav-back">← Torna alla home</a>
      </nav>

      <div className="legal-container">
        <div className="legal-eyebrow">Documento legale</div>
        <h1 className="legal-title">Privacy Policy</h1>
        <div className="legal-date">Ultimo aggiornamento: aprile 2025</div>

        <div className="legal-section">
          <h2>Chi siamo</h2>
          <p>RealAIstate è una piattaforma web per la compravendita immobiliare assistita da intelligenza artificiale, attualmente in fase di sviluppo e raccolta di early access.</p>
          <div className="legal-highlight">
            <p><strong>Titolare del trattamento:</strong> Fabio Piccoli<br />
            <strong>Email:</strong> <a href="mailto:privacy@realaistate.ai">privacy@realaistate.ai</a><br />
            <strong>Sito web:</strong> www.realaistate.ai</p>
          </div>
        </div>

        <div className="legal-section">
          <h2>Dati che raccogliamo</h2>
          <p>Raccogliamo solo i dati strettamente necessari al funzionamento del servizio:</p>
          <ul>
            <li><strong>Indirizzo email</strong> — fornito volontariamente tramite il modulo di iscrizione alla lista d'attesa early access</li>
            <li><strong>Dati di navigazione</strong> — raccolti automaticamente tramite Google Analytics (indirizzo IP anonimizzato, pagine visitate, durata della sessione, dispositivo utilizzato)</li>
          </ul>
          <p>Non raccogliamo dati sensibili, dati di pagamento o informazioni personali ulteriori rispetto a quelli indicati.</p>
        </div>

        <div className="legal-section">
          <h2>Come utilizziamo i tuoi dati</h2>
          <p>I dati raccolti vengono utilizzati esclusivamente per:</p>
          <ul>
            <li>Gestire la lista d'attesa early access e comunicare l'apertura della piattaforma</li>
            <li>Inviare aggiornamenti sul progresso del prodotto (solo se hai fornito il consenso)</li>
            <li>Analizzare il traffico sul sito per migliorare l'esperienza utente</li>
          </ul>
          <p>Non vendiamo, affittiamo o cediamo i tuoi dati a terze parti per finalità commerciali.</p>
        </div>

        <div className="legal-section">
          <h2>Base giuridica del trattamento</h2>
          <p>Il trattamento dei dati si basa su:</p>
          <ul>
            <li><strong>Consenso esplicito</strong> — per l'iscrizione alla lista d'attesa e l'invio di comunicazioni</li>
            <li><strong>Legittimo interesse</strong> — per l'analisi del traffico tramite Google Analytics</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Servizi di terze parti</h2>
          <p>Utilizziamo i seguenti servizi esterni, ciascuno con la propria privacy policy:</p>
          <ul>
            <li><strong>Brevo (ex Sendinblue)</strong> — per la gestione della lista email. <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy policy Brevo</a></li>
            <li><strong>Google Analytics</strong> — per l'analisi del traffico con IP anonimizzato. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy policy Google</a></li>
            <li><strong>Vercel</strong> — per l'hosting del sito. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy policy Vercel</a></li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Conservazione dei dati</h2>
          <p>I tuoi dati vengono conservati per il tempo strettamente necessario:</p>
          <ul>
            <li>Gli indirizzi email della lista d'attesa vengono conservati fino alla cancellazione volontaria o alla chiusura del servizio</li>
            <li>I dati di navigazione raccolti da Google Analytics vengono conservati per 14 mesi</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>I tuoi diritti</h2>
          <p>In conformità al GDPR (Reg. UE 2016/679), hai il diritto di:</p>
          <ul>
            <li>Accedere ai tuoi dati personali in nostro possesso</li>
            <li>Richiedere la rettifica di dati inesatti</li>
            <li>Richiedere la cancellazione dei tuoi dati ("diritto all'oblio")</li>
            <li>Opporti al trattamento dei tuoi dati</li>
            <li>Richiedere la portabilità dei dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
          </ul>
          <p>Per esercitare i tuoi diritti: <a href="mailto:privacy@realaistate.ai">privacy@realaistate.ai</a>. Risponderemo entro 30 giorni.</p>
        </div>

        <div className="legal-section">
          <h2>Cookie</h2>
          <p>Il sito utilizza esclusivamente cookie tecnici necessari al funzionamento e cookie analitici di Google Analytics. Non utilizziamo cookie di profilazione o pubblicitari.</p>
          <p>Puoi disabilitare i cookie analitici tramite il <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Add-on</a>.</p>
        </div>

        <div className="legal-section">
          <h2>Modifiche alla privacy policy</h2>
