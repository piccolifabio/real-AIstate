export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { domanda, immobile } = req.body;
  if (!domanda || domanda.trim().length < 2) return res.status(400).json({ error: "Domanda non valida" });

  const immobileCtx = `
Immobile: ${immobile.indirizzo}, ${immobile.zona}
Prezzo: €${immobile.prezzo.toLocaleString("it-IT")} (€${Math.round(immobile.prezzo/immobile.superficie).toLocaleString("it-IT")}/m²)
Superficie: ${immobile.superficie} m² | Locali: ${immobile.locali} | Piano: ${immobile.piano}
Classe energetica: ${immobile.classe_energetica} | Anno costruzione: ${immobile.anno_costruzione} | Ristrutturazione: ${immobile.anno_ristrutturazione}
Garage: ${immobile.garage ? "Sì, incluso" : "No"} | Spese condominiali: €${immobile.spese_condominio}/mese
Fair Price Score: ${immobile.fair_price_score}/100
  `.trim();

  try {
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
2. Per domande che richiedono il venditore (lavori, storia, motivazioni vendita, trattative), riformulare la domanda in modo professionale e comunicare che verrà inoltrata

Dati dell'immobile:
${immobileCtx}

Tono: professionale, diretto, rassicurante. Mai più di 3 frasi. 
Se la domanda riguarda il prezzo, usa il Fair Price Score per contestualizzare.
Se la domanda va inoltrata al venditore, concludi con "Ho inoltrato la tua domanda al venditore — risponderà entro 24 ore."
Rispondi SEMPRE in italiano.`,
        messages: [{ role: "user", content: domanda }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Errore API" });

    const text = data.content?.[0]?.text || "Risposta non disponibile.";
    const forwarded = text.toLowerCase().includes("inoltrat");

    return res.status(200).json({ risposta: text, forwarded });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}
