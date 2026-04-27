import { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function BlogVerona() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#f7f5f0" }}>
      <NavBar />

      {/* HEADER */}
      <div style={{ padding: "5.5rem 3rem 2rem", maxWidth: "780px", margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginBottom: "1.2rem", display: "flex", gap: "0.5rem" }}>
          <a href="/blog" style={{ color: "#6b6b6b", textDecoration: "none" }}>Blog</a>
          <span>›</span>
          <span>Trasparenza</span>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.7rem", borderRadius: "2px", background: "rgba(217,48,37,0.15)", color: "#d93025", border: "1px solid rgba(217,48,37,0.3)" }}>Trasparenza</span>
          <span style={{ fontSize: "0.78rem", color: "#6b6b6b" }}>24 Aprile 2026 · 5 min di lettura</span>
        </div>

        {/* Titolo */}
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15, color: "#f7f5f0", marginBottom: "1.2rem" }}>
          7 agenzie abusive e 15 agenti senza patentino scoperti a Verona. Non è un caso isolato.
        </h1>

        {/* Excerpt */}
        <p style={{ fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.7, color: "rgba(247,245,240,0.5)", borderLeft: "3px solid #d93025", paddingLeft: "1.2rem", marginBottom: "2rem" }}>
          La Guardia di Finanza di Legnago ha scoperto nel Veronese sette agenzie e 15 agenti immobiliari che operavano senza le abilitazioni richieste dalla legge. Ecco perché accade — e come proteggersi.
        </p>
      </div>

      {/* CORPO */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 3rem 5rem" }}>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Il 24 aprile 2026 la Guardia di Finanza di Legnago ha reso noti i risultati di un'operazione nel Veronese: <strong style={{ color: "#f7f5f0" }}>7 agenzie immobiliari e 15 mediatori</strong> operavano senza la prescritta iscrizione nel Registro delle Imprese e senza alcun titolo abilitativo. Sanzioni da 7.500 a 15.000 euro per ciascuno, e segnalazioni alla Camera di Commercio per le agenzie che li avevano assunti.
        </p>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Leggendo la notizia, la prima reazione è spesso sorpresa. La seconda, se hai comprato o venduto casa negli ultimi anni, potrebbe essere qualcosa di più scomodo.
        </p>

        {/* H2 */}
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Cosa ha scoperto la GdF</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          L'indagine è partita da un controllo su un singolo mediatore che operava per un'agenzia della bassa veronese. Da lì, gli accertamenti si sono allargati: nell'arco di due anni i finanzieri hanno individuato 7 agenzie nei Comuni di Legnago e Cerea. Nessuno dei 15 agenti risultava iscritto nella sezione dedicata del Registro delle Imprese. Nessuno era in possesso del titolo abilitativo richiesto dalla legge.
        </p>

        {/* Data box */}
        <div style={{ background: "#1e1e1e", border: "1px solid rgba(247,245,240,0.08)", borderRadius: "3px", padding: "1.5rem 2rem", margin: "2rem 0" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d93025", marginBottom: "1rem" }}>I numeri dell'operazione</div>
          {[
            ["Agenzie abusive scoperte", "7"],
            ["Agenti senza patentino", "15"],
            ["Sanzione per ciascuno", "€7.500 – €15.000"],
            ["Comuni coinvolti", "Legnago e Cerea (VR)"],
            ["Durata dell'indagine", "2 anni"],
          ].map(([label, val], i, arr) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(247,245,240,0.06)" : "none", fontSize: "0.88rem" }}>
              <span style={{ color: "#6b6b6b" }}>{label}</span>
              <span style={{ color: "#f7f5f0", fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Nel frattempo questi agenti <strong style={{ color: "#f7f5f0" }}>gestivano direttamente le trattative di compravendita</strong>: accompagnavano i clienti nelle visite, raccoglievano proposte di acquisto, assistevano nella predisposizione dei contratti preliminari. Tutto ciò che fa un agente regolare — senza averne i requisiti.
        </p>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Perché questo accade — e perché è un problema strutturale</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          La legge italiana (n. 39/1989) stabilisce che per esercitare l'attività di mediazione immobiliare è necessario superare un esame abilitativo e iscriversi al Registro delle Imprese. Un percorso che richiede tempo, studio e costi. Il risultato? Un incentivo a operare nell'ombra, soprattutto in mercati locali dove i controlli sono rari.
        </p>

        {/* Pull quote */}
        <div style={{ background: "#1e1e1e", borderLeft: "4px solid #d93025", padding: "1.5rem 1.8rem", margin: "2rem 0", borderRadius: "0 2px 2px 0" }}>
          <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.1rem", lineHeight: 1.6, color: "#f7f5f0", margin: 0, fontStyle: "italic" }}>
            Il problema non sono 15 agenti a Verona. Il problema è un modello di intermediazione che rende difficile distinguere chi è abilitato da chi non lo è — e che scarica tutto il rischio sul cliente.
          </p>
        </div>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Le commissioni che hai pagato erano legittime?</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Se hai comprato o venduto casa tramite un'agenzia, hai il diritto di verificare che il tuo interlocutore fosse regolarmente abilitato. Puoi farlo sul portale del <strong style={{ color: "#f7f5f0" }}>Registro delle Imprese</strong> (registroimprese.it) cercando la ragione sociale nella sezione dedicata alla mediazione immobiliare.
        </p>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Il mercato immobiliare italiano: grandi numeri, poca trasparenza</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          Nel 2025 in Italia sono state registrate <strong style={{ color: "#f7f5f0" }}>766.756 compravendite residenziali</strong> (+6,5% sul 2024). Il fatturato dell'intermediazione immobiliare vale circa 14,3 miliardi di euro all'anno. È un mercato enorme, frammentato in oltre 38.000 micro-agenzie. In questo contesto, la verifica degli abilitati è affidata quasi interamente agli acquirenti stessi.
        </p>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", margin: "2.5rem 0 1rem" }}>Cosa cambia con RealAIstate</h2>

        <p style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "rgba(247,245,240,0.7)", marginBottom: "1.4rem" }}>
          RealAIstate nasce esattamente da questo problema. Non dal desiderio di eliminare i professionisti del settore — ma dall'esigenza di costruire un modello in cui <strong style={{ color: "#f7f5f0" }}>trasparenza e verifica siano strutturali</strong>, non opzionali. Il Fair Price Score è basato su dati pubblici. Le commissioni sono fisse e dichiarate prima di iniziare. Non c'è nulla da nascondere.
        </p>

        {/* CTA */}
        <div style={{ background: "#1e1e1e", border: "1px solid rgba(247,245,240,0.08)", borderRadius: "3px", padding: "2.5rem", margin: "3rem 0", borderTop: "3px solid #d93025" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d93025", marginBottom: "0.8rem" }}>RealAIstate</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f7f5f0", marginBottom: "0.6rem" }}>Compra o vendi casa. In trasparenza.</div>
          <p style={{ fontSize: "0.9rem", color: "#6b6b6b", lineHeight: 1.6, marginBottom: "1.5rem" }}>Nessuna agenzia. Nessun intermediario non verificato. Solo AI, dati pubblici e professionisti certificati.</p>
          <a href="/compra/1" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#d93025", color: "white", textDecoration: "none", padding: "0.85rem 1.8rem", borderRadius: "2px", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Vedi una scheda immobile →
          </a>
        </div>

        {/* Fonte */}
        <div style={{ fontSize: "0.75rem", color: "#6b6b6b", borderTop: "1px solid rgba(247,245,240,0.08)", paddingTop: "1rem", marginTop: "2rem" }}>
          <strong>Fonti:</strong> ANSA, 24 aprile 2026 · Guardia di Finanza di Legnago · Agenzia delle Entrate / OMI, Statistiche IV trimestre 2025
        </div>

      </div>

      <SiteFooter />
    </div>
  );
}
