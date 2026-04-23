export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { domanda, immobile, sessione_id, compratore_nome, compratore_email } = req.body;
  if (!domanda || domanda.trim().length < 2) return res.status(400).json({ error: "Domanda non valida" });

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  const immobileCtx = `
Immobile: ${immobile.indirizzo}, ${immobile.zona}
Prezzo: €${immobile.prezzo?.toLocaleString("it-IT")} (€${Math.round(immobile.prezzo/immobile.superficie)}/m²)
Superficie: ${immobile.superficie} m² | Locali: ${immobile.locali} | Piano: ${immobile.piano}
Classe energetica: ${immobile.classe_energetica} | Anno costruzione: ${immobile.anno_costruzione} | Ristrutturazione: ${immobile.anno_ristrutturazione}
Garage: ${immobile.garage ? "Sì, incluso" : "No"} | Spese condominiali: €${immobile.spese_condominio}/mese
Fair Price Score: ${immobile.fair_price_score}/100
  `.trim();

  // Save user message to Supabase
  const saveMessage = async (mittente, testo, da_inoltrare = false) => {
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
          compratore_nome: compratore_nome || null,
          compratore_email: compratore_email || null,
        }),
      });
    } catch (e) {
      console.error("Supabase save error:", e);
    }
  };

  // Send email notification when forwarding
  const sendForwardEmail = async (domandaOriginale, rispostaAI) => {
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
          subject: `💬 Domanda da inoltrare al venditore — Immobile ${immobile.indirizzo}`,
          htmlContent: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#0a0a0a;padding:20px;text-align:center;">
                <span style="font-family:Georgia,serif;font-size:22px;color:#f7f5f0;">Real</span>
                <span style="font-family:Georgia,serif;font-size:22px;color:#d93025;">AI</span>
                <span style="font-family:Georgia,serif;font-size:22px;color:#f7f5f0;">state</span>
              </div>
              <div style="padding:30px;background:#f9f9f9;">
                <h2 style="color:#0a0a0a;">Domanda da inoltrare al venditore</h2>
                <p><strong>Immobile:</strong> ${immobile.indirizzo}</p>
                <p><strong>Compratore:</strong> ${compratore_nome || "Anonimo"} — ${compratore_email || "email non fornita"}</p>
                <p><strong>Sessione:</strong> ${sessione_id}</p>
                <hr/>
                <p><strong>Domanda del compratore:</strong></p>
                <blockquote style="border-left:3px solid #d93025;padding-left:15px;color:#333;">${domandaOriginale}</blockquote>
                <p><strong>Risposta AI inviata:</strong></p>
                <blockquote style="border-left:3px solid #6b6b6b;padding-left:15px;color:#555;">${rispostaAI}</blockquote>
                <hr/>
                <p style="color:#666;font-size:13px;">Rispondi a <a href="mailto:${compratore_email}">${compratore_email || "compratore"}</a> entro 24 ore.</p>
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

Tono: professionale, diretto, rassicurante. Mai più di 3 frasi.
Se la domanda riguarda il prezzo, usa il Fair Price Score per contestualizzare.
Se la domanda va inoltrata al venditore, NON inoltrarla automaticamente. Chiedi prima: "Vuoi che inoltri questa domanda al venditore? Risponderà entro 24 ore."
Se l'utente risponde sì/confermo/inoltro/procedi o simili → rispondi ESATTAMENTE con: "Perfetto. Ho inoltrato la tua domanda al venditore — ti risponderà via email entro 24 ore." e nient'altro.
Rispondi SEMPRE in italiano.`,
        messages: [{ role: "user", content: domanda }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Errore API" });

    const text = data.content?.[0]?.text || "Risposta non disponibile.";
    const forwarded = text.toLowerCase().includes("ho inoltrato la tua domanda al venditore");

    // Save AI response
    await saveMessage("ai", text, forwarded);

    // Send email if forwarding
    if (forwarded) {
      await sendForwardEmail(domanda, text);
    }

    return res.status(200).json({ risposta: text, forwarded });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}
