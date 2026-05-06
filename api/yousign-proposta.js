export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { compratore_email, compratore_nome, venditore_email, venditore_nome, immobile, importo, condizioni, data_rogito, note } = req.body;

  const YOUSIGN_API_KEY = process.env.YOUSIGN_API_KEY;
  const YOUSIGN_BASE = "https://api-sandbox.yousign.app/v3";
  const TEMPLATE_ID = "71505658-23d8-4d5a-9ff1-2e221294e929";

  const oggi = new Date().toLocaleDateString("it-IT");
  const diff = Number(importo) - immobile.prezzo;
  const perc = Math.round(Math.abs(diff) / immobile.prezzo * 100);
  const diffLabel = diff >= 0 ? `+${perc}% sopra prezzo` : `${perc}% sotto prezzo`;

  try {
    const response = await fetch(`${YOUSIGN_BASE}/signature_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${YOUSIGN_API_KEY}`,
      },
      body: JSON.stringify({
        name: `Proposta acquisto — ${immobile.indirizzo}`,
        delivery_mode: "email",
        timezone: "Europe/Rome",
        template_id: TEMPLATE_ID,
        template_placeholders: {
          signers: [
            {
              label: "Compratore",
              info: {
                first_name: compratore_nome.split(" ")[0],
                last_name: compratore_nome.split(" ").slice(1).join(" ") || "—",
                email: compratore_email,
                locale: "it",
              },
            },
            {
              label: "Venditore",
              info: {
                first_name: venditore_nome.split(" ")[0],
                last_name: venditore_nome.split(" ").slice(1).join(" ") || "—",
                email: venditore_email,
                locale: "it",
              },
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Errore Yousign", detail: data });
    }

    // Attiva
    const activateResponse = await fetch(`${YOUSIGN_BASE}/signature_requests/${data.id}/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${YOUSIGN_API_KEY}`,
      },
    });

    const activateData = await activateResponse.json();
    if (!activateResponse.ok) {
      return res.status(500).json({ error: "Errore attivazione Yousign", detail: activateData });
    }

    return res.status(200).json({ ok: true, signature_request_id: data.id });

  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}