export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { immobile, user_email, importo, condizioni, data_rogito, note } = req.body;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: "info@realaistate.ai", name: "RealAIstate" }],
        subject: `💰 Nuova proposta — ${immobile.indirizzo}`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0a0a0a;padding:20px;">
              <span style="font-size:22px;font-weight:700;color:#f7f5f0;">REAL</span><span style="font-size:22px;font-weight:700;color:#d93025;">AI</span><span style="font-size:22px;font-weight:700;color:#f7f5f0;">STATE</span>
            </div>
            <div style="padding:30px;background:#f9f9f9;">
              <h2 style="color:#0a0a0a;">Nuova proposta d'acquisto</h2>
              <p><strong>Immobile:</strong> ${immobile.indirizzo}</p>
              <p><strong>Prezzo richiesto:</strong> €${immobile.prezzo.toLocaleString('it-IT')}</p>
              <hr/>
              <p><strong>Compratore:</strong> ${user_email}</p>
              <p><strong>Importo offerto:</strong> €${Number(importo).toLocaleString('it-IT')}</p>
              <p><strong>Condizioni:</strong> ${condizioni || 'Nessuna'}</p>
              <p><strong>Data rogito proposta:</strong> ${data_rogito || 'Da concordare'}</p>
              <p><strong>Note:</strong> ${note || 'Nessuna'}</p>
              <hr/>
              <p style="color:#d93025;font-weight:600;">Differenza: €${(immobile.prezzo - Number(importo)).toLocaleString('it-IT')} (${Math.round((1 - Number(importo)/immobile.prezzo)*100)}% sotto prezzo)</p>
            </div>
          </div>
        `,
      }),
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}