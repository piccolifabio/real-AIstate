import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const faqStyles = `
  .faq-page { min-height: 100vh; background: var(--black); }

  /* NAV */
  .faq-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 3rem; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.9); backdrop-filter: blur(16px); }
  .faq-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 0.05em; color: var(--white); text-decoration: none; }
  .faq-nav-logo span { color: var(--red); }
  .faq-nav-back { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(247,245,240,0.4); text-decoration: none; transition: color 0.2s; }
  .faq-nav-back:hover { color: var(--white); }

  /* HERO */
  .faq-hero { padding: 5.5rem 3rem 2.5rem; max-width: 900px; margin: 0 auto; }
  .faq-eyebrow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; }
  .faq-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--red); }
  .faq-h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3rem, 7vw, 6rem); line-height: 0.95; color: var(--white); margin-bottom: 1rem; }
  .faq-sub { font-size: 1rem; color: rgba(247,245,240,0.45); line-height: 1.7; max-width: 560px; }

  /* CONTENT */
  .faq-content { max-width: 900px; margin: 0 auto; padding: 0 3rem 6rem; }

  /* CATEGORY */
  .faq-category { margin-bottom: 4rem; }
  .faq-category-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
  .faq-category-label::before { content: ''; width: 20px; height: 1px; background: var(--red); }

  /* FAQ ITEM */
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-item:first-of-type { border-top: 1px solid var(--border); }
  .faq-question { width: 100%; background: none; border: none; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500; text-align: left; padding: 1.4rem 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: color 0.2s; line-height: 1.4; }
  .faq-question:hover { color: rgba(247,245,240,0.7); }
  .faq-question.open { color: var(--white); }
  .faq-icon { font-size: 1.2rem; color: var(--red); flex-shrink: 0; transition: transform 0.3s; line-height: 1; }
  .faq-icon.open { transform: rotate(45deg); }
  .faq-answer { overflow: hidden; max-height: 0; transition: max-height 0.4s ease, padding 0.3s ease; }
  .faq-answer.open { max-height: 600px; }
  .faq-answer-inner { padding: 0 0 1.5rem; font-size: 0.93rem; line-height: 1.8; color: rgba(247,245,240,0.6); }
  .faq-answer-inner strong { color: var(--white); font-weight: 600; }
  .faq-answer-inner a { color: var(--red); text-decoration: none; }
  .faq-answer-inner a:hover { text-decoration: underline; }

  /* CTA */
  .faq-cta { background: var(--surface); border: 1px solid var(--border); border-radius: 3px; padding: 3rem; text-align: center; margin-top: 2rem; }
  .faq-cta-title { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; color: var(--white); margin-bottom: 0.8rem; }
  .faq-cta-title span { color: var(--red); }
  .faq-cta-sub { font-size: 0.9rem; color: rgba(247,245,240,0.45); margin-bottom: 2rem; }
  .faq-cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .faq-btn-red { background: var(--red); color: var(--white); border: none; padding: 0.9rem 2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 2px; text-decoration: none; display: inline-block; transition: background 0.2s; }
  .faq-btn-red:hover { background: var(--red-dark); }
  .faq-btn-outline { background: transparent; color: rgba(247,245,240,0.6); border: 1px solid rgba(247,245,240,0.15); padding: 0.9rem 2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer; border-radius: 2px; text-decoration: none; display: inline-block; transition: all 0.2s; }
  .faq-btn-outline:hover { border-color: rgba(247,245,240,0.4); color: var(--white); }

  /* FOOTER */

  @media (max-width: 900px) {
    .faq-nav { padding: 1rem 1.5rem; }
    .faq-hero { padding: 5.5rem 3rem 2.5rem; }
    .faq-content { padding: 0 1.5rem 4rem; }
  }`;

const faqs = [
  {
    categoria: "Vendere casa",
    domande: [
      {
        q: "È legale vendere casa senza agenzia in Italia?",
        a: "Sì, assolutamente. In Italia non esiste alcun obbligo di legge che imponga l'utilizzo di un'agenzia immobiliare per vendere la propria casa. La compravendita tra privati è perfettamente legale e molto diffusa. L'unica figura professionale obbligatoria per legge è il notaio, che deve rogitare l'atto finale di compravendita.",
      },
      {
        q: "Quanto si risparmia vendendo casa senza agenzia?",
        a: "Le agenzie immobiliari applicano mediamente una commissione tra il 3% e il 6% del prezzo di vendita, divisa tra venditore e compratore. Su una casa da 300.000 euro significa pagare fino a 18.000 euro. Vendendo senza agenzia, quella cifra rimane nelle tue tasche — o ti permette di essere più competitivo sul prezzo.",
      },
      {
        q: "Quali documenti servono per vendere casa?",
        a: "<strong>Obbligatori per la pubblicazione:</strong> planimetria catastale e APE (Attestato di Prestazione Energetica). <strong>Necessari per il rogito:</strong> visura catastale, atto di provenienza, delibere condominiali delle ultime 3 assemblee, certificato di agibilità ed eventuali concessioni edilizie. RealAIstate ti guida nella raccolta di ogni documento.",
      },
      {
        q: "Come si stabilisce il prezzo giusto di un immobile?",
        a: "Il metodo più affidabile è basarsi sui dati OMI — l'Osservatorio del Mercato Immobiliare dell'Agenzia delle Entrate. Pubblicati ogni semestre, riportano i valori reali per zona, tipologia e stato dell'immobile. Il Fair Price Score di RealAIstate utilizza esattamente questi dati, incrociati con le transazioni reali della zona, per darti una valutazione oggettiva e verificabile.",
      },
      {
        q: "Chi gestisce il rogito se non c'è un'agenzia?",
        a: "Il notaio. Il rogito notarile è obbligatorio per legge indipendentemente dall'agenzia — con o senza intermediario, la presenza del notaio è sempre richiesta. RealAIstate ti connette con notai certificati, li prenota e ti prepara a presentarti al rogito con tutti i documenti in ordine.",
      },
      {
        q: "Si può firmare tutto digitalmente?",
        a: "Quasi tutto. La proposta d'acquisto, il compromesso, i documenti e le perizie possono essere firmati elettronicamente con firma digitale certificata. <strong>L'unica eccezione obbligatoria per legge è il rogito notarile</strong>, che richiede la presenza fisica davanti al notaio. È l'unica ora che passi in uno studio notarile in tutta la transazione.",
      },
    ],
  },
  {
    categoria: "Comprare casa",
    domande: [
      {
        q: "Come faccio a sapere se un prezzo è giusto?",
        a: "Il Fair Price Score di RealAIstate analizza ogni immobile rispetto ai dati OMI della zona — la fonte ufficiale dell'Agenzia delle Entrate. Ti dice se il prezzo è allineato al mercato, sopra o sotto, e ti spiega il perché con i dati. Nessuna opinione, nessun conflitto di interessi: solo numeri verificabili.",
      },
      {
        q: "Quali rischi ci sono a comprare da un privato?",
        a: "Gli stessi che esistono comprando da un'agenzia — e spesso anche meno, perché la documentazione è verificata. I rischi reali nella compravendita immobiliare riguardano i documenti (ipoteche, difformità catastali, mancanza di agibilità) — non l'assenza dell'agenzia. RealAIstate verifica i documenti e ti connette con un perito indipendente.",
      },
      {
        q: "Come funziona la caparra senza agenzia?",
        a: "La caparra viene gestita tramite escrow digitale — un conto di terze parti che blocca i fondi fino al rogito, senza che né il venditore né il compratore possano accedervi unilateralmente. In alternativa, il notaio può fungere da depositario della caparra, svolgendo la stessa funzione in modo completamente legale e riconosciuto.",
      },
      {
        q: "Devo per forza usare un assegno per la caparra?",
        a: "No. L'assegno è ancora lo strumento più diffuso per abitudine, ma non è obbligatorio. La caparra può essere versata tramite <strong>escrow digitale</strong> gestito da una piattaforma autorizzata o tramite il notaio come depositario fiduciario. Entrambe le soluzioni offrono le stesse garanzie — con il vantaggio di essere completamente tracciabili e sicure.",
      },
    ],
  },
  {
    categoria: "Il processo",
    domande: [
      {
        q: "Il notaio è obbligatorio anche senza agenzia?",
        a: "Sì — il notaio è obbligatorio per legge in qualsiasi compravendita immobiliare, con o senza agenzia. Non è una figura opzionale: è il garante della validità legale dell'atto. <strong>La buona notizia è che l'agenzia non aggiunge alcun valore in questo passaggio</strong> — il notaio lavora direttamente con venditore e compratore.",
      },
      {
        q: "Quanto tempo ci vuole per chiudere una compravendita?",
        a: "Con tutti i documenti in ordine, una compravendita tra privati richiede mediamente 60-90 giorni dal momento dell'accordo al rogito. I tempi dipendono principalmente dalla disponibilità del notaio, dai tempi bancari per il mutuo (se presente) e dalla completezza della documentazione. RealAIstate ti aiuta a preparare tutto in anticipo per non perdere tempo.",
      },
      {
        q: "Come si gestisce la trattativa tra privati?",
        a: "Su RealAIstate la trattativa viene supportata dall'AI, che suggerisce contro-offerte basate sui dati di mercato e media la comunicazione tra le parti. L'AI non ha commissioni da incassare — ottimizza il prezzo reale per entrambi, senza fretta e senza conflitti di interesse.",
      },
    ],
  },
  {
    categoria: "RealAIstate",
    domande: [
      {
        q: "Cos'è il Fair Price Score?",
        a: "È la valutazione AI di ogni immobile basata sui dati OMI dell'Agenzia delle Entrate — la fonte più affidabile sulle transazioni immobiliari reali in Italia, aggiornata ogni semestre. Il Fair Price Score ti dice in modo oggettivo se un prezzo è in linea col mercato, sopra o sotto, spiegandoti il ragionamento con dati verificabili. Nessuna stima soggettiva, nessun conflitto di interessi.",
      },
      {
        q: "RealAIstate è un'agenzia immobiliare?",
        a: "<strong>No.</strong> RealAIstate non è un'agenzia immobiliare e non svolge attività di intermediazione ai sensi della Legge 39/1989. Siamo una piattaforma tecnologica che utilizza l'AI per rendere la compravendita immobiliare più trasparente, veloce e sicura. Le nostre fee sono una frazione di quelle di un'agenzia tradizionale — perché usiamo la tecnologia per eliminare inefficienze e costi inutili, non per replicare un modello che non funziona.",
      },
      {
        q: "Quanto costa usare RealAIstate?",
        a: "Per i venditori: accesso gratuito agli strumenti base. Per i compratori: una fee ridotta sulla transazione completata — una frazione di quello che chiederebbe un'agenzia. Siamo trasparenti sui costi: nessuna sorpresa, nessuna percentuale nascosta. I dettagli aggiornati sono sempre disponibili su realaistate.ai.",
      },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className={`faq-question ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className={`faq-icon ${open ? "open" : ""}`}>+</span>
      </button>
      <div className={`faq-answer ${open ? "open" : ""}`}>
        <div
          className="faq-answer-inner"
          dangerouslySetInnerHTML={{ __html: a }}
        />
      </div>
    </div>
  );
}

export default function FaqPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <style>{faqStyles}</style>
      <div className="faq-page">

        <NavBar />

        <div className="faq-hero">
          <div className="faq-eyebrow">Domande frequenti</div>
          <h1 className="faq-h1">Tutto quello<br />che vuoi sapere.</h1>
          <p className="faq-sub">Risposte chiare alle domande più comuni su come comprare e vendere casa senza agenzia in Italia. Senza marketing, senza omissioni.</p>
        </div>

        <div className="faq-content">
          {faqs.map((cat) => (
            <div className="faq-category" key={cat.categoria}>
              <div className="faq-category-label">{cat.categoria}</div>
              {cat.domande.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          ))}

          <div className="faq-cta">
            <h2 className="faq-cta-title">Hai ancora <span>dubbi?</span></h2>
            <p className="faq-cta-sub">Sfida l'AI con la tua obiezione o scrivici direttamente.</p>
            <div className="faq-cta-actions">
              <a href="/scuse" className="faq-btn-red">Sfida l'AI →</a>
              <a href="mailto:info@realaistate.ai" className="faq-btn-outline">Scrivici</a>
            </div>
          </div>
        </div>

        <SiteFooter />

      </div>
    </>
  );
}
