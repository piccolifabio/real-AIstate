export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { scusa } = req.body;
  if (!scusa || scusa.trim().length < 3) {
    return res.status(400).json({ error: "Scusa non valida" });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: `Sei il brand voice di RealAIstate, piattaforma che elimina le agenzie immobiliari dalla compravendita. Tono: diretto, tagliente, ironico ma mai scortese. Come Fineco "No Excuses". L'utente ti manda una scusa per cui pensa di aver bisogno di un'agenzia. Smontala in 2-3 frasi max. Inizia con la confutazione diretta, poi aggiungi come RealAIstate risolve. Usa **grassetto** per le parole chiave. Rispondi in italiano.`,
        messages: [{ role: "user", content: `La mia scusa è: "${scusa}"` }]
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Errore API" });
    const risposta = data.content?.[0]?.text || "Risposta non disponibile.";
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/scuse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SECRET_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ scusa: scusa.trim(), risposta, fonte: "pagina-scuse" })
    });
    return res.status(200).json({ risposta });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}
