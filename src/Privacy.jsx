import { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  .legal-container { max-width: 760px; margin: 0 auto; padding: 8rem 2rem 6rem; }
  .legal-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .legal-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--red); }
  .legal-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 6vw, 5rem); line-height: 1; color: var(--white); margin-bottom: 0.5rem; }
  .legal-date { font-size: 0.78rem; color: rgba(247,245,240,0.3); margin-bottom: 4rem; letter-spacing: 0.05em; }
  .legal-section { margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border); }
  .legal-section:last-child { border-bottom: none; }
  .legal-section h2 { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--white); margin-bottom: 1rem; letter-spacing: 0.02em; }
  .legal-section p { font-size: 0.92rem; line-height: 1.8; color: rgba(247,245,240,0.55); margin-bottom: 1rem; }
  .legal-section p:last-child { margin-bottom: 0; }
  .legal-section ul { list-style: none; margin: 1rem 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .legal-section ul li { font-size: 0.92rem; line-height: 1.7; color: rgba(247,245,240,0.55); display: flex; align-items: flex-start; gap: 0.8rem; }
  .legal-section ul li::before { content: '→'; color: var(--red); flex-shrink: 0; }
  .legal-section a { color: var(--red); text-decoration: none; }
  .legal-section a:hover { text-decoration: underline; }
  .legal-highlight { background: rgba(247,245,240,0.04); border-left: 2px solid var(--red); padding: 1.2rem 1.5rem; border-radius: 0 2px 2px 0; margin: 1.5rem 0; }
  .legal-highlight p { color: rgba(247,245,240,0.7) !important; }
  @media (max-width: 768px) { .legal-container { padding: 7rem 1.5rem 4rem; } }
`;

export default function Privacy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <style>{styles}</style>
      <NavBar />
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
            <li><strong>Dati di navigazione</strong> — raccolti automaticamente tramite Google Analytics (IP anonimizzato, pagine visitate, durata sessione)</li>
          </ul>
          <p>Non raccogliamo dati sensibili, dati di pagamento o informazioni personali ulteriori.</p>
        </div>

        <div className="legal-section">
          <h2>Come utilizziamo i tuoi dati</h2>
          <ul>
            <li>Gestire la lista d'attesa early access e comunicare l'apertura della piattaforma</li>
            <li>Inviare aggiornamenti sul progresso del prodotto (solo con consenso)</li>
            <li>Analizzare il traffico sul sito per migliorare l'esperienza utente</li>
          </ul>
          <p>Non vendiamo, affittiamo o cediamo i tuoi dati a terze parti per finalità commerciali.</p>
        </div>

        <div className="legal-section">
          <h2>Base giuridica del trattamento</h2>
          <ul>
            <li><strong>Consenso esplicito</strong> — per l'iscrizione alla lista d'attesa e l'invio di comunicazioni</li>
            <li><strong>Legittimo interesse</strong> — per l'analisi del traffico tramite Google Analytics</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Servizi di terze parti</h2>
          <ul>
            <li><strong>Brevo</strong> — gestione lista email. <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy policy Brevo</a></li>
            <li><strong>Google Analytics</strong> — analisi traffico con IP anonimizzato. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy policy Google</a></li>
            <li><strong>Vercel</strong> — hosting del sito. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy policy Vercel</a></li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Conservazione dei dati</h2>
          <ul>
            <li>Indirizzi email — conservati fino alla revoca del consenso o richiesta di cancellazione</li>
            <li>Dati di navigazione — aggregati e anonimizzati, conservati per 26 mesi (impostazione Google Analytics)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>I tuoi diritti (GDPR)</h2>
          <ul>
            <li>Accedere ai tuoi dati personali in nostro possesso</li>
            <li>Richiedere la rettifica di dati inesatti</li>
            <li>Richiedere la cancellazione dei tuoi dati</li>
            <li>Opporti al trattamento dei tuoi dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
          </ul>
          <p>Per esercitare i tuoi diritti: <a href="mailto:privacy@realaistate.ai">privacy@realaistate.ai</a>. Risponderemo entro 30 giorni.</p>
        </div>

        <div className="legal-section">
          <h2>Contatti</h2>
          <div className="legal-highlight">
            <p><strong>Fabio Piccoli — RealAIstate</strong><br />
            Email: <a href="mailto:privacy@realaistate.ai">privacy@realaistate.ai</a></p>
          </div>
          <p>Hai il diritto di proporre reclamo al <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">Garante per la Protezione dei Dati Personali</a>.</p>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}