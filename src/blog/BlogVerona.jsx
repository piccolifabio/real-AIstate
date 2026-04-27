import { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f7f5f0; --red: #d93025; --red-dark: #b02020;
    --muted: #6b6b6b; --surface: #141414; --border: rgba(247,245,240,0.08);
    --warm: #1e1e1e; --gold: #c9a84c;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); overflow-x: hidden; }

  .art-page { min-height: 100vh; }

  /* HEADER ARTICOLO */
  .art-header { padding: 5.5rem 3rem 3rem; max-width: 780px; margin: 0 auto; }
  .art-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .art-tag { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.7rem; border-radius: 2px; background: rgba(217,48,37,0.15); color: var(--red); border: 1px solid rgba(217,48,37,0.3); }
  .art-date { font-size: 0.78rem; color: var(--muted); }
  .art-read { font-size: 0.78rem; color: var(--muted); }
  .art-h1 { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.15; color: var(--white); margin-bottom: 1.2rem; }
  .art-excerpt { font-size: 1.1rem; font-weight: 300; line-height: 1.7; color: rgba(247,245,240,0.5); border-left: 3px solid var(--red); padding-left: 1.2rem; margin-bottom: 2rem; }

  /* CORPO ARTICOLO */
  .art-body { max-width: 780px; margin: 0 auto; padding: 0 3rem 4rem; }
  .art-body h2 { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--white); margin: 2.5rem 0 1rem; }
  .art-body p { font-size: 0.97rem; line-height: 1.85; color: rgba(247,245,240,0.7); margin-bottom: 1.4rem; }
  .art-body strong { color: var(--white); font-weight: 600; }
  .art-body a { color: var(--red); text-decoration: none; }
  .art-body a:hover { text-decoration: underline; }

  /* PULL QUOTE */
  .art-pullquote { background: var(--warm); border-left: 4px solid var(--red); padding: 1.5rem 1.8rem; margin: 2rem 0; border-radius: 0 2px 2px 0; }
  .art-pullquote p { font-family: 'DM Serif Display', serif; font-size: 1.15rem; line-height: 1.6; color: var(--white); margin: 0; font-style: italic; }

  /* DATI BOX */
  .art-databox { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 1.5rem 2rem; margin: 2rem 0; }
  .art-databox-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 1rem; }
  .art-databox-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--border); font-size: 0.88rem; }
  .art-databox-row:last-child { border-bottom: none; }
  .art-databox-label { color: var(--muted); }
  .art-databox-val { color: var(--white); font-weight: 600; }

  /* CTA FINALE */
  .art-cta { background: var(--warm); border: 1px solid var(--border); border-radius: 3px; padding: 2.5rem; margin: 3rem 0; position: relative; overflow: hidden; }
  .art-cta::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--red); }
  .art-cta-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 0.8rem; }
  .art-cta-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--white); margin-bottom: 0.6rem; }
  .art-cta-text { font-size: 0.9rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.5rem; }
  .art-cta-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--red); color: white; text-decoration: none; padding: 0.85rem 1.8rem; border-radius: 2px; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; transition: background 0.2s; }
  .art-cta-btn:hover { background: var(--red-dark); text-decoration: none; }

  /* FONTE */
  .art-fonte { font-size: 0.75rem; color: var(--muted); border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 2rem; }

  /* BREADCRUMB */
  .art-breadcrumb { font-size: 0.75rem; color: var(--muted); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
  .art-breadcrumb a { color: var(--muted); text-decoration: none; }
  .art-breadcrumb a:hover { color: var(--white); }

  @media (max-width: 768px) {
    .art-header, .art-body { padding-left: 1.5rem; padding-right: 1.5rem; }
  }
`;

export default function BlogVerona() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <style>{styles}</style>
      <NavBar />
      <div className="art-page">

        <div className="art-header">
          <div className="art-breadcrumb">
            <a href="/blog">Blog</a>
            <span>›</span>
            <span>Trasparenza</span>
          </div>
          <div className="art-meta">
            <span className="art-tag">Trasparenza</span>
            <span className="art-date">24 Aprile 2026</span>
            <span className="art-read">· 5 min di lettura</span>
          </div>
          <h1 className="art-h1">7 agenzie abusive e 15 agenti senza patentino scoperti a Verona. Non è un caso isolato.</h1>
          <p className="art-excerpt">
            La Guardia di Finanza di Legnago ha scoperto nel Veronese sette agenzie e 15 agenti immobiliari che operavano senza le abilitazioni richieste dalla legge. Migliaia di clienti hanno pagato commissioni a intermediari non autorizzati. Ecco perché accade — e come proteggersi.
          </p>
        </div>

        <div className="art-body">

          <p>Il 24 aprile 2026 la Guardia di Finanza di Legnago ha reso noti i risultati di un'operazione nel Veronese: <strong>7 agenzie immobiliari e 15 mediatori</strong> operavano senza la prescritta iscrizione nel Registro delle Imprese e senza alcun titolo abilitativo. Sanzioni da 7.500 a 15.000 euro per ciascuno, e segnalazioni alla Camera di Commercio per le agenzie che li avevano assunti.</p>

          <p>Leggendo la notizia, la prima reazione è spesso sorpresa. La seconda, se hai comprato o venduto casa negli ultimi anni, potrebbe essere qualcosa di più scomodo.</p>

          <h2>Cosa ha scoperto la GdF</h2>

          <p>L'indagine è partita da un controllo su un singolo mediatore che operava per un'agenzia della bassa veronese. Da lì, gli accertamenti si sono allargati: nell'arco di due anni i finanzieri hanno individuato in totale 7 agenzie nei Comuni di Legnago e Cerea. Nessuno dei 15 agenti risultava iscritto nella sezione dedicata del Registro delle Imprese. Nessuno era in possesso del titolo abilitativo richiesto dalla legge.</p>

          <div className="art-databox">
            <div className="art-databox-title">I numeri dell'operazione</div>
            <div className="art-databox-row"><span className="art-databox-label">Agenzie abusive scoperte</span><span className="art-databox-val">7</span></div>
            <div className="art-databox-row"><span className="art-databox-label">Agenti senza patentino</span><span className="art-databox-val">15</span></div>
            <div className="art-databox-row"><span className="art-databox-label">Sanzione per ciascuno</span><span className="art-databox-val">€7.500 – €15.000</span></div>
            <div className="art-databox-row"><span className="art-databox-label">Comuni coinvolti</span><span className="art-databox-val">Legnago e Cerea (VR)</span></div>
            <div className="art-databox-row"><span className="art-databox-label">Durata dell'indagine</span><span className="art-databox-val">2 anni</span></div>
          </div>

          <p>Nel frattempo questi agenti <strong>gestivano direttamente le trattative di compravendita</strong>: accompagnavano i clienti nelle visite, raccoglievano proposte di acquisto, assistevano nella predisposizione dei contratti preliminari. Tutto ciò che fa un agente immobiliare regolare. Con la differenza che non avevano i requisiti per farlo.</p>

          <h2>Perché questo accade — e perché è un problema strutturale</h2>

          <p>La legge italiana (n. 39/1989) stabilisce che per esercitare l'attività di mediazione immobiliare è necessario superare un esame abilitativo e iscriversi al Registro delle Imprese. Un percorso che richiede tempo, studio e costi. Il risultato? Un incentivo a operare nell'ombra, soprattutto in mercati locali dove i controlli sono rari e la clientela si muove per passaparola.</p>

          <div className="art-pullquote">
            <p>Il problema non sono 15 agenti a Verona. Il problema è un modello di intermediazione che rende difficile distinguere chi è abilitato da chi non lo è — e che scarica tutto il rischio sul cliente.</p>
          </div>

          <p>Il cliente finale, in queste situazioni, non ha strumenti semplici per verificare chi ha di fronte. L'iscrizione al Registro delle Imprese è consultabile, ma quanti acquirenti la controllano prima di firmare un mandato? Quanti sanno che dovrebbero farlo?</p>

          <h2>Le commissioni che hai pagato erano legittime?</h2>

          <p>Questa è la domanda che pochi si fanno — e che la notizia di Verona rende improvvisamente concreta. Se hai comprato o venduto casa tramite un'agenzia, hai il diritto di verificare che il tuo interlocutore fosse regolarmente abilitato. Non è una questione di sfiducia: è tutela.</p>

          <p>Puoi verificare l'iscrizione di un'agenzia o di un agente sul portale del <strong>Registro delle Imprese</strong> (registroimprese.it) cercando la ragione sociale o il nome dell'agente nella sezione dedicata alla mediazione immobiliare.</p>

          <h2>Il mercato immobiliare italiano: grandi numeri, poca trasparenza</h2>

          <p>Nel 2025 in Italia sono state registrate <strong>766.756 compravendite residenziali</strong> — +6,5% rispetto all'anno precedente. Il fatturato dell'intermediazione immobiliare vale circa 14,3 miliardi di euro all'anno. È un mercato enorme, frammentato in oltre 38.000 micro-agenzie sparse sul territorio.</p>

          <p>In questo contesto, la verifica degli abilitati è affidata principalmente agli acquirenti stessi e a controlli a campione come quello di Legnago. Non esiste un sistema di verifica istantanea, pubblica e accessibile. Non esiste una piattaforma che mostri, in modo trasparente, chi stai pagando e perché.</p>

          <h2>Cosa cambia con RealAIstate</h2>

          <p>RealAIstate nasce esattamente da questo problema. Non dal desiderio di eliminare i professionisti del settore — ma dall'esigenza di costruire un modello in cui <strong>trasparenza e verifica siano strutturali</strong>, non opzionali.</p>

          <p>Su RealAIstate ogni professionista nella rete — notai, periti, geometri — è verificato. Il Fair Price Score è basato su dati pubblici dell'Agenzia delle Entrate. Le commissioni sono fisse e dichiarate prima ancora di iniziare. Non c'è nulla da nascondere perché non c'è niente che convenga nascondere.</p>

          <div className="art-cta">
            <div className="art-cta-label">RealAIstate</div>
            <div className="art-cta-title">Compra o vendi casa. In trasparenza.</div>
            <p className="art-cta-text">Nessuna agenzia. Nessun intermediario non verificato. Solo AI, dati pubblici e professionisti certificati. Scopri come funziona.</p>
            <a href="/compra/1" className="art-cta-btn">Vedi una scheda immobile →</a>
          </div>

          <div className="art-fonte">
            <strong>Fonti:</strong> ANSA, 24 aprile 2026 · Guardia di Finanza di Legnago · Agenzia delle Entrate / OMI, Statistiche IV trimestre 2025
          </div>

        </div>
      </div>
      <SiteFooter />
    </>
  );
}
