export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { domanda, immobile } = req.body;
  if (!domanda || domanda.trim().length < 2) return res.status(400).json({ error: "Domanda non valida" });

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
        system: `Sei l'assistente AI di RealAIstate per il VENDITORE dell'immobile in ${immobile.indirizzo}, prezzo €${immobile.prezzo}, ${immobile.superficie}m², Fair Price Score ${immobile.fair_price_score}/100.

Il tuo ruolo è:
1. Aiutare il venditore a migliorare il suo annuncio
2. Prepararli alle domande dei compratori
3. Spiegare come funziona la piattaforma
4. Dare consigli su come valorizzare l'immobile

Tono: professionale, diretto, come un consulente esperto che lavora per il venditore.
Mai più di 3 frasi. Rispondi sempre in italiano.`,
        messages: [{ role: "user", content: domanda }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Errore API" });
    const text = data.content?.[0]?.text || "Risposta non disponibile.";
    return res.status(200).json({ risposta: text });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}
