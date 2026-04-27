import { useEffect } from "react";
import NavBar from "../NavBar.jsx";
import SiteFooter from "../SiteFooter.jsx";

export default function BlogOMI2025() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#f7f5f0" }}>
      <NavBar />

      {/* HEADER */}
      <div style={{ padding: "5.5rem 3rem 2rem", maxWidth: "780px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginBottom: "1.2rem", display: "flex", gap: "0.5rem" }}>
          <a href="/blog" style={{ color: "#6b6b6b", textDecoration: "none" }}>Blog</a>
          <span>›</span>
          <span>Mercato</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.7rem", borderRadius: "2px", background: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}>Mercato</span>
          <span style={{ fontSize: "0.78rem", color: "#6b6b6b" }}>20 Aprile 2026 · 6 min di lettura</span>
        </div>

        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15, color: "#f7f5f0", marginBottom: "1.2rem" }}>
          766.756 compravendite nel 2025: il mercato immobiliare italiano è in piena accelerazione.
        </h1>

        <p style={{ fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.7, color: "rgba(247,245,240,0.5)", borderLeft: "3px solid #c9a84c", paddingLeft: "1.2rem", marginBottom: "2rem" }}>
          I dati OMI del IV trimestre 2025 confermano: il mercato immobiliare italiano cresce del 6,5% anno su anno. Cosa significa per chi vuole comprare o vendere casa oggi — e perché i prezzi delle commissioni non hanno seguito la stessa traiettoria.
        </p>
      </div>

      {/* CORPO */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 3rem 5rem" }}>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          L'Agenzia delle Entrate ha pubblicato le statistiche OMI del IV trimestre 2025. Il dato più significativo: nel corso dell'intero anno 2025 sono state registrate in Italia <strong style={{ color: "#f7f5f0" }}>766.756 compravendite residenziali</strong>, con una crescita del 6,5% rispetto alle 719.578 del 2024. È il segnale più chiaro di un mercato che si è rimesso in moto — dopo anni di incertezza legata ai tassi di interesse e all'inflazione.
        </p>

        {/* Data box */}
        <div style={{ background: "#1e1e1e", border: "1px solid rgba(247,245,240,0.08)", borderRadius: "3px", padding: "1.5rem 2rem", margin: "2rem 0" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "1rem" }}>Il mercato immobiliare in cifre — 2025</div>
          {[
            ["Compravendite residenziali 2025", "766.756"],
            ["Variazione YoY", "+6,5%"],
            ["Compravendite residenziali 2024", "719.578"],
            ["Tasso mutuo medio (IV trim. 2025)", "3,5%"],
            ["Acquisti con mutuo ipotecario", "< 45%"],
            ["Acquisti prima casa", "~72%"],
            ["Nuovi contratti di locazione (IV trim.)", "~278.000"],
          ].map(([label, val], i, arr) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(247,245,240,0.06)" : "none", fontSize: "0.88rem" }}>
              <span style={{ color: "#6b6b6b" }}>{label}</span>
              <span style={{ color: "#f7f5f0", fontWeight: 600 }}>{val}</span>
            </div>
          ))}
          <div style={{ fontSize: "0.72rem", color: "#444", marginTop: "0.8rem" }}>Fonte: Agenzia delle Entrate — OMI, Statistiche trimestrali IV 2025</div>
        </div>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Cosa dicono i dati trimestre per trimestre</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          La crescita del 2025 non è stata uniforme. Il IV trimestre, con oltre <strong style={{ color: "#f7f5f0" }}>218.000 compravendite</strong>, ha mostrato una crescita più contenuta (+0,4% tendenziale) rispetto ai trimestri precedenti. Il rallentamento è concentrato nei <strong style={{ color: "#f7f5f0" }}>comuni capoluogo del Sud</strong>, mentre i comuni non capoluogo del Nord Ovest hanno continuato a crescere. Milano, Torino e Firenze registrano una flessione degli acquisti nell'ultimo trimestre, mentre Roma è in aumento.
        </p>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Il mercato degli affitti cresce in parallelo: quasi 278.000 nuovi contratti di locazione nel IV trimestre, con canoni complessivi per 2,1 miliardi di euro (+5% su base annua). La domanda di abitazioni — sia in acquisto che in locazione — è strutturalmente forte.
        </p>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>I mutui: il tasso sale, la quota scende</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Un dato che merita attenzione: la quota di acquisti finanziati con mutuo ipotecario è scesa sotto il 45%. Il tasso medio applicato alla prima rata ha raggiunto il <strong style={{ color: "#f7f5f0" }}>3,5%</strong>. Questo significa che sempre più acquirenti stanno comprando senza ricorrere al mutuo — probabilmente perché hanno liquidità propria, o perché i tassi rendono il finanziamento meno conveniente.
        </p>

        {/* Pull quote */}
        <div style={{ background: "#1e1e1e", borderLeft: "4px solid #c9a84c", padding: "1.5rem 1.8rem", margin: "2rem 0", borderRadius: "0 2px 2px 0" }}>
          <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#f7f5f0", margin: 0, fontStyle: "italic" }}>
            766.756 transazioni in un anno. Ognuna con una commissione. Il mercato cresce — ma il costo dell'intermediazione rimane invariato, percentuale sul prezzo.
          </p>
        </div>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Cosa significa per chi compra o vende casa</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Un mercato in crescita è generalmente una buona notizia per i venditori — più domanda significa più acquirenti potenziali e tempi di vendita più brevi. Per i compratori, invece, un mercato attivo significa più concorrenza sugli immobili migliori e meno margine di negoziazione.
        </p>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          C'è però un elemento che rimane costante, indipendentemente dall'andamento del mercato: <strong style={{ color: "#f7f5f0" }}>il costo dell'intermediazione immobiliare</strong>. Con il mercato a 766.756 compravendite e un prezzo medio nazionale in aumento, le commissioni delle agenzie crescono in valore assoluto — perché sono calcolate come percentuale sul prezzo di vendita.
        </p>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Su un appartamento da €300.000 a Milano, una commissione del 3% significa €9.000. Al 6% (compratore + venditore) si arriva a €18.000. Sono soldi che escono dalla transazione senza creare valore aggiunto per nessuna delle due parti.
        </p>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Il Fair Price Score: sapere se il prezzo è giusto, prima di firmare</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          In un mercato in accelerazione, il rischio di pagare troppo — o di vendere troppo poco — aumenta. Le valutazioni "a occhio" degli agenti riflettono spesso gli interessi dell'agenzia (chiudere veloce) più che quelli del cliente.
        </p>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          RealAIstate calcola il <strong style={{ color: "#f7f5f0" }}>Fair Price Score</strong> di ogni immobile usando i dati OMI ufficiali dell'Agenzia delle Entrate — gli stessi dati che abbiamo usato in questo articolo. Non una stima soggettiva: un calcolo trasparente, verificabile da chiunque, aggiornato ogni semestre.
        </p>

        {/* CTA */}
        <div style={{ background: "#1e1e1e", border: "1px solid rgba(247,245,240,0.08)", borderRadius: "3px", padding: "2.5rem", margin: "3rem 0", borderTop: "3px solid #d93025" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d93025", marginBottom: "0.8rem" }}>RealAIstate</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", marginBottom: "0.6rem" }}>Scopri il Fair Price Score del tuo immobile.</div>
          <p style={{ fontSize: "0.9rem", color: "#6b6b6b", lineHeight: 1.6, marginBottom: "1.5rem" }}>Dati OMI ufficiali, metodologia trasparente, nessun conflitto di interessi. Vedi come calcoliamo il prezzo giusto — e come ti facciamo risparmiare sulle commissioni.</p>
          <a href="/metodologia" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#d93025", color: "white", textDecoration: "none", padding: "0.85rem 1.8rem", borderRadius: "2px", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Scopri la metodologia →
          </a>
        </div>

        <div style={{ fontSize: "0.75rem", color: "#6b6b6b", borderTop: "1px solid rgba(247,245,240,0.08)", paddingTop: "1rem", marginTop: "2rem" }}>
          <strong>Fonte:</strong> Agenzia delle Entrate — Osservatorio del Mercato Immobiliare (OMI), Statistiche trimestrali residenziale IV 2025
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
