import { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function Termini() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <NavBar />
      <div className="legal-container">
        <div className="legal-eyebrow">Documento legale</div>
        <h1 className="legal-title">Termini di Servizio</h1>
        <div className="legal-date">Ultimo aggiornamento: aprile 2025</div>

        <div className="legal-section">
          <h2>1. Accettazione dei termini</h2>
          <p>Accedendo a RealAIstate (realaistate.ai) accetti i presenti Termini di Servizio. Se non li accetti, ti invitiamo a non utilizzare il sito.</p>
          <div className="legal-highlight">
            <p><strong>RealAIstate è attualmente in fase beta.</strong> Il servizio è in sviluppo attivo. Alcune funzionalità potrebbero non essere disponibili o essere modificate senza preavviso.</p>
          </div>
        </div>

        <div className="legal-section">
          <h2>2. Descrizione del servizio</h2>
          <p>RealAIstate è una piattaforma digitale che fornisce strumenti basati su intelligenza artificiale per supportare la compravendita immobiliare tra privati. Il servizio include:</p>
          <ul>
            <li>Valutazione automatica degli immobili tramite AI (Fair Price Score)</li>
            <li>Analisi delle fotografie degli immobili</li>
            <li>Generazione di descrizioni e annunci ottimizzati</li>
            <li>Connessione con professionisti certificati (notai, periti, geometri)</li>
            <li>Supporto alla negoziazione tramite strumenti AI</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Natura informativa del servizio</h2>
          <p>Le valutazioni, i punteggi e le analisi fornite dall&apos;AI di RealAIstate hanno natura <strong>esclusivamente informativa</strong> e non costituiscono:</p>
          <ul>
            <li>Consulenza professionale immobiliare ai sensi di legge</li>
            <li>Perizia tecnica o stima ufficiale del valore dell&apos;immobile</li>
            <li>Consulenza legale o fiscale</li>
            <li>Garanzia sul prezzo di vendita o acquisto</li>
          </ul>
          <p>RealAIstate non è un&apos;agenzia immobiliare e non svolge attività di intermediazione ai sensi della Legge 39/1989. L&apos;utente è responsabile delle proprie decisioni di acquisto o vendita.</p>
        </div>

        <div className="legal-section">
          <h2>4. Obblighi dell&apos;utente</h2>
          <ul>
            <li>Fornire informazioni veritiere e accurate sugli immobili</li>
            <li>Non utilizzare il servizio per finalità illecite o fraudolente</li>
            <li>Non pubblicare contenuti offensivi, discriminatori o lesivi di diritti di terzi</li>
            <li>Non tentare di aggirare i sistemi di sicurezza della piattaforma</li>
            <li>Rispettare la normativa vigente in materia di compravendita immobiliare</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Limitazione di responsabilità</h2>
          <ul>
            <li>Decisioni di acquisto o vendita prese sulla base delle analisi AI</li>
            <li>Eventuali discrepanze tra il Fair Price Score e il valore reale di mercato</li>
            <li>Il comportamento di terzi connessi tramite la piattaforma</li>
            <li>Interruzioni del servizio dovute a manutenzione o cause tecniche</li>
            <li>Perdite economiche derivanti dall&apos;utilizzo del servizio</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>6. Proprietà intellettuale</h2>
          <p>Tutti i contenuti di RealAIstate sono di proprietà di Fabio Piccoli / RealAIstate e sono protetti dalle leggi sul diritto d&apos;autore. È vietata la riproduzione senza autorizzazione scritta.</p>
        </div>

        <div className="legal-section">
          <h2>7. Modifiche al servizio</h2>
          <p>RealAIstate si riserva il diritto di modificare, sospendere o interrompere il servizio in qualsiasi momento, con o senza preavviso.</p>
        </div>

        <div className="legal-section">
          <h2>8. Legge applicabile</h2>
          <p>I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro di Milano.</p>
        </div>

        <div className="legal-section">
          <h2>9. Contatti</h2>
          <div className="legal-highlight">
            <p><strong>Fabio Piccoli — RealAIstate</strong><br />Email: <a href="mailto:info@realaistate.ai">info@realaistate.ai</a><br />Sito web: www.realaistate.ai</p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}