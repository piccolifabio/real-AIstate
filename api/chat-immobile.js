import { handleCors } from "./_lib/cors.js";
import { escapeHtml } from "./_lib/escape-html.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { domanda, immobile, sessione_id, compratore_nome, compratore_email, messaggi_precedenti } = req.body;
  if (!domanda || domanda.trim().length < 2) return res.status(400).json({ error: "Domanda non valida" });

  // Scriviamo su chat_messages con service_role: dopo la migration RLS del
  // 2026-05-08 l'INSERT pubblico è chiuso. La API è il solo writer legittimo.
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

  // JWT opzionale: la chat AI deve restare aperta agli anonimi, ma se il
  // compratore è loggato estraiamo nome/email dal token e li passiamo al
  // prompt — così l'AI NON gli chiede di nuovo "lasciami nome ed email"
  // (walkthrough 10/05).
  let authedNome = null;
  let authedEmail = null;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (token && SUPABASE_URL && SUPABASE_KEY) {
    try {
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
      });
      if (userRes.ok) {
        const u = await userRes.json();
        authedEmail = u.email || null;
        authedNome = u.user_metadata?.full_name || null;
      }
    } catch {
      // JWT invalido o errore di rete: trattiamo come anonimo, no fail.
    }
  }
  const compratoreIdentificato = !!authedEmail;

  const sn = (v) => (v === null || v === undefined || v === "" ? "non specificato" : v);
  const yn = (v) => (v === true ? "sì" : v === false ? "no" : "non specificato");

  const immobileCtx = `
${immobile.titolo ? `Titolo annuncio: ${immobile.titolo}` : ""}
Immobile: ${sn(immobile.tipologia)} in ${sn(immobile.indirizzo)}, ${sn(immobile.zona)}
Stato: ${sn(immobile.stato_immobile)}
Prezzo: €${immobile.prezzo?.toLocaleString("it-IT")} ${immobile.superficie ? `(€${Math.round(immobile.prezzo/immobile.superficie)}/m²)` : ""}
Superficie catastale: ${sn(immobile.superficie)} m² | Calpestabile: ${sn(immobile.superficie_calpestabile)} m²
Locali: ${sn(immobile.locali)} | Bagni: ${sn(immobile.bagni)} | Piano: ${sn(immobile.piano)} | Ascensore: ${yn(immobile.ascensore)}
Classe energetica: ${sn(immobile.classe_energetica)} | Anno costruzione: ${sn(immobile.anno_costruzione)} | Ristrutturazione: ${sn(immobile.anno_ristrutturazione)}
Riscaldamento: ${sn(immobile.riscaldamento)} | Acqua calda: ${sn(immobile.acqua_calda)}
Garage: ${yn(immobile.garage)}${immobile.garage_mq ? ` (${immobile.garage_mq} m²)` : ""}
Terrazzo/balcone: ${yn(immobile.terrazzo)}
Giardino condominiale: ${yn(immobile.giardino_condominiale)}
Spese condominiali: €${sn(immobile.spese_condominio)}/mese
Disponibilità rogito: ${sn(immobile.disponibilita_rogito)}
Fair Price Score: ${sn(immobile.fair_price_score)}/100

Descrizione completa fornita dal venditore:
${sn(immobile.descrizione)}
  `.trim();

  // Save user message to Supabase.
  // BATCH 2 (10/05/2026): scriviamo SOLO per compratori loggati. Per anonimi
  // niente persistenza — la chat resta utile come funzione discoverability,
  // ma non genera lead non qualificati né righe in chat_messages senza user_id.
  // Quando l'utente si registra dopo aver chattato da anonimo, parte una nuova
  // sessione: lo storico anonimo precedente non viene riassociato (decisione di
  // scope MVP — niente pattern session-merge complicati).
  const saveMessage = async (mittente, testo, da_inoltrare = false) => {
    if (!compratoreIdentificato) return;
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/chat_messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          sessione_id,
          immobile_id: immobile.id || 1,
          mittente,
          testo,
          da_inoltrare,
          // JWT è sempre la fonte autoritativa per nome/email — body ignorato.
          compratore_nome: authedNome,
          compratore_email: authedEmail,
        }),
      });
    } catch (e) {
      console.error("Supabase save error:", e.message);
    }
  };

  // Send email notification when forwarding
  // Tutti i campi user-controlled passano da escapeHtml.
  const sendForwardEmail = async (domandaOriginale, rispostaAI, nomeComp, emailComp) => {
    const indirizzoEsc = escapeHtml(immobile.indirizzo);
    const nomeEsc = nomeComp ? escapeHtml(nomeComp) : "Anonimo";
    const emailEsc = emailComp ? escapeHtml(emailComp) : "email non fornita";
    const emailHref = emailComp ? encodeURI(emailComp) : "";
    const sessioneEsc = escapeHtml(sessione_id);
    const domandaEsc = escapeHtml(domandaOriginale);
    const rispostaEsc = escapeHtml(rispostaAI);
    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: "RealAIstate Chat", email: "info@realaistate.ai" },
          to: [{ email: "info@realaistate.ai", name: "RealAIstate" }],
          replyTo: emailComp ? { email: emailComp, name: nomeComp || "Compratore" } : undefined,
          subject: `Domanda da inoltrare al venditore — Immobile ${immobile.indirizzo}`,
          htmlContent: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#0a0a0a;padding:20px;text-align:center;">
                <span style="font-family:Georgia,serif;font-size:22px;color:#f7f5f0;">Real</span>
                <span style="font-family:Georgia,serif;font-size:22px;color:#d93025;">AI</span>
                <span style="font-family:Georgia,serif;font-size:22px;color:#f7f5f0;">state</span>
              </div>
              <div style="padding:30px;background:#f9f9f9;">
                <h2 style="color:#0a0a0a;">Domanda da inoltrare al venditore</h2>
                <p><strong>Immobile:</strong> ${indirizzoEsc}</p>
                <p><strong>Compratore:</strong> ${nomeEsc} — ${emailEsc}</p>
                <p><strong>Sessione:</strong> ${sessioneEsc}</p>
                <hr/>
                <p><strong>Domanda del compratore:</strong></p>
                <blockquote style="border-left:3px solid #d93025;padding-left:15px;color:#333;">${domandaEsc}</blockquote>
                <p><strong>Risposta AI inviata:</strong></p>
                <blockquote style="border-left:3px solid #6b6b6b;padding-left:15px;color:#555;">${rispostaEsc}</blockquote>
                <hr/>
                <p style="color:#666;font-size:13px;">Rispondi a <a href="mailto:${emailHref}">${emailEsc}</a> entro 24 ore.</p>
              </div>
            </div>
          `,
        }),
      });
    } catch (e) {
      console.error("Email forward error:", e);
    }
  };

  try {
    // Save user message
    await saveMessage("user", domanda);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 400,
        system: `Sei l'assistente AI mediatore di RealAIstate per una scheda immobile specifica.

Il tuo ruolo è duplice:
1. Rispondere direttamente alle domande su caratteristiche, prezzo e documenti dell'immobile che conosci già
2. Per domande che richiedono il venditore (lavori, storia, motivazioni vendita, dettagli non disponibili), proponi di inoltrarla chiedendo prima conferma all'utente

Dati dell'immobile:
${immobileCtx}

REGOLE INDEROGABILI sui dati:
- I dati sopra sono gli UNICI dati che conosci. Non hai memoria di altri immobili.
- Se un dato è "non specificato", NON inventarlo, NON stimarlo, NON usare valori plausibili o di altri immobili che potresti conoscere.
- Se l'utente chiede un dato "non specificato", ammetti che non ce l'hai e proponi di inoltrare la domanda al venditore.
- Se la domanda è sul prezzo e il Fair Price Score è "non specificato", NON dare un giudizio: spiega che il punteggio non è ancora calcolato e proponi di inoltrare la domanda al venditore o di confrontare con i comparabili in zona.

Tono: professionale, diretto, rassicurante. Mai più di 3 frasi.
${compratoreIdentificato
  ? `Compratore già identificato: ${authedNome || "(nome non in profilo)"} <${authedEmail}>.
NON chiedere nome ed email — sono già noti. Quando devi inoltrare al venditore, segui questo flusso:
1. Prima chiedi: "Vuoi che inoltri questa domanda al venditore? Risponderà entro 24 ore."
2. Se l'utente risponde sì/confermo/inoltro/procedi o simili → rispondi ESATTAMENTE con: "Grazie. Ho inoltrato la tua domanda al venditore — ti risponderà via email entro 24 ore." e nient'altro.
NON inoltrare automaticamente: usa sempre lo step di conferma.`
  : `Compratore NON registrato (anonimo). NON puoi inoltrare domande al venditore — solo gli utenti registrati hanno questo canale.
Quando una domanda richiede il venditore (lavori, motivazioni, dettagli non disponibili nei dati che hai):
- NON simulare inoltro, NON dire "ho inoltrato la tua domanda al venditore", NON dire "inoltro la tua domanda", NON usare verbi al futuro tipo "girerò la domanda".
- NON chiedere nome ed email.
- Rispondi ESATTAMENTE con questa frase (puoi anteporre una breve premessa contestuale di una frase): "Questa è una domanda specifica per il venditore. Per inoltrarla e ricevere risposta, registrati gratuitamente — bastano 30 secondi. Ti rispondiamo appena il venditore avrà risposto."
La frase "registrati gratuitamente — bastano 30 secondi" è il segnale che il sistema usa per riconoscere l'invito alla registrazione: includila SEMPRE letterale quando inviti l'utente a registrarsi.`}
Rispondi SEMPRE in italiano.`,
        messages: [
          ...(messaggi_precedenti || []).map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text
          })),
          { role: "user", content: domanda }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Errore API" });

    const text = data.content?.[0]?.text || "Risposta non disponibile.";
    // Solo i loggati hanno il canale di inoltro: per anonimi forwarded resta
    // sempre false anche se l'AI dovesse infrangere la regola del prompt.
    const forwarded = compratoreIdentificato &&
      text.toLowerCase().includes("ho inoltrato la tua domanda al venditore");
    // Segnale al frontend per mostrare un CTA "Registrati" sotto la risposta:
    // l'AI è istruita a includere la frase ESATTA "registrati gratuitamente
    // — bastano 30 secondi" quando una domanda anonima richiederebbe il venditore.
    const inviteRegistration = !compratoreIdentificato &&
      /registrati gratuitamente\s*[—-]\s*bastano 30 secondi/i.test(text);

    // Save AI response (skip per anonimi — saveMessage lo gestisce internamente)
    await saveMessage("ai", text, forwarded);

    // Send email if forwarding. forwarded è già `false` per anonimi (vedi sopra),
    // quindi qui siamo sempre in branch loggato: nome/email vengono dal JWT.
    if (forwarded) {
      // Step-back: il flow loggato è 2 step (chiedi conferma → conferma+inoltro),
      // quindi la domanda originale è il penultimo user message.
      let domandaOriginale = domanda;
      if (messaggi_precedenti && messaggi_precedenti.length >= 2) {
        const userMsgs = messaggi_precedenti.filter(m => m.role === "user");
        if (userMsgs.length >= 2) {
          domandaOriginale = userMsgs[userMsgs.length - 2].text || domanda;
        }
      }

      await sendForwardEmail(domandaOriginale, text, authedNome, authedEmail);
    }

    return res.status(200).json({ risposta: text, forwarded, inviteRegistration });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}
