export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { compratore_email, compratore_nome, venditore_email, venditore_nome, immobile, importo, condizioni, data_rogito, note } = req.body;

  const YOUSIGN_API_KEY = process.env.YOUSIGN_API_KEY;
  const YOUSIGN_BASE = "https://api-sandbox.yousign.app/v3";

  try {
    // 1. Crea il documento HTML compilato
    const htmlContent = generateHTML({ compratore_email, compratore_nome, venditore_email, venditore_nome, immobile, importo, condizioni, data_rogito, note });
    
    // 2. Converti HTML in base64
    const base64Doc = Buffer.from(htmlContent).toString("base64");

    // 3. Crea la firma request su Yousign
    const signatureResponse = await fetch(`${YOUSIGN_BASE}/signature_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${YOUSIGN_API_KEY}`,
      },
      body: JSON.stringify({
        name: `Proposta acquisto — ${immobile.indirizzo}`,
        delivery_mode: "email",
        timezone: "Europe/Rome",
        signers: [
          {
            info: { first_name: compratore_nome.split(" ")[0], last_name: compratore_nome.split(" ").slice(1).join(" ") || "—", email: compratore_email },
            signature_level: "electronic_signature",
            signature_authentication_mode: "no_otp",
          },
          {
            info: { first_name: venditore_nome.split(" ")[0], last_name: venditore_nome.split(" ").slice(1).join(" ") || "—", email: venditore_email },
            signature_level: "electronic_signature",
            signature_authentication_mode: "no_otp",
          },
        ],
        documents: [
          {
            name: "Proposta_Acquisto_RealAIstate.pdf",
            content_type: "application/pdf",
            content: base64Doc,
          },
        ],
      }),
    });

    const signatureData = await signatureResponse.json();
    
    if (!signatureResponse.ok) {
      console.error("Yousign error:", signatureData);
      return res.status(500).json({ error: "Errore Yousign", detail: signatureData });
    }

    // 4. Attiva la signature request
    await fetch(`${YOUSIGN_BASE}/signature_requests/${signatureData.id}/activate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${YOUSIGN_API_KEY}`,
      },
    });

    return res.status(200).json({ ok: true, signature_request_id: signatureData.id });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}

function generateHTML({ compratore_nome, compratore_email, venditore_nome, venditore_email, immobile, importo, condizioni, data_rogito, note }) {
  const oggi = new Date().toLocaleDateString("it-IT");
  const diff = Number(importo) - immobile.prezzo;
  const perc = Math.round(Math.abs(diff) / immobile.prezzo * 100);
  const diffLabel = diff >= 0 ? `+${perc}% sopra prezzo` : `${perc}% sotto prezzo`;

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #d93025; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 18pt; font-weight: 700; }
  .logo span { color: #d93025; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 8pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #d93025; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 10px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .field label { font-size: 7pt; color: #888; display: block; margin-bottom: 2px; text-transform: uppercase; }
  .field .val { border-bottom: 1px solid #ddd; padding-bottom: 2px; min-height: 18px; font-size: 10pt; }
  .field .val.big { font-size: 13pt; font-weight: 700; }
  .notice { background: #fff8f8; border-left: 3px solid #d93025; padding: 8px 12px; font-size: 8pt; color: #444; margin-bottom: 20px; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px; }
  .sig-box { border: 1px solid #ddd; padding: 14px; }
  .sig-line { border-bottom: 1px solid #999; height: 40px; margin-top: 12px; }
  .footer { margin-top: 24px; border-top: 1px solid #eee; padding-top: 10px; font-size: 7.5pt; color: #aaa; display: flex; justify-content: space-between; }
</style>
</head>
<body>
<div class="header">
  <div class="logo">REAL<span>AI</span>STATE</div>
  <div style="text-align:right">
    <div style="font-size:12pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Proposta d'Acquisto</div>
    <div style="font-size:8pt;color:#666;">Data: ${oggi}</div>
  </div>
</div>

<div class="notice">La presente proposta diventa contrattualmente vincolante per entrambe le parti al momento della firma digitale del Venditore. RealAIstate non è un'agenzia immobiliare e non svolge attività di mediazione ai sensi della L. 39/1989.</div>

<div class="section">
  <div class="section-title">1 · Immobile</div>
  <div class="grid-2">
    <div class="field"><label>Indirizzo</label><div class="val">${immobile.indirizzo}</div></div>
    <div class="field"><label>Zona</label><div class="val">${immobile.zona}</div></div>
    <div class="field"><label>Prezzo richiesto</label><div class="val big">€ ${immobile.prezzo.toLocaleString("it-IT")}</div></div>
    <div class="field"><label>Superficie catastale</label><div class="val">${immobile.superficie} m²</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">2 · Proponente (Compratore)</div>
  <div class="grid-2">
    <div class="field"><label>Nome e Cognome</label><div class="val">${compratore_nome}</div></div>
    <div class="field"><label>Email</label><div class="val">${compratore_email}</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">3 · Venditore</div>
  <div class="grid-2">
    <div class="field"><label>Nome e Cognome</label><div class="val">${venditore_nome}</div></div>
    <div class="field"><label>Email</label><div class="val">${venditore_email}</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">4 · Proposta economica</div>
  <div class="grid-2">
    <div class="field"><label>Importo offerto</label><div class="val big">€ ${Number(importo).toLocaleString("it-IT")}</div></div>
    <div class="field"><label>Differenza rispetto al prezzo richiesto</label><div class="val">${diffLabel}</div></div>
    <div class="field"><label>Condizioni</label><div class="val">${condizioni || "—"}</div></div>
    <div class="field"><label>Data rogito proposta</label><div class="val">${data_rogito || "Da concordare"}</div></div>
  </div>
  ${note ? `<div class="field" style="margin-top:8px"><label>Note</label><div class="val">${note}</div></div>` : ""}
</div>

<div class="section" style="background:#f8f8f8;border:1px solid #e0e0e0;padding:12px;border-radius:3px;">
  <div class="section-title">5 · Corrispettivo servizio RealAIstate</div>
  <div class="grid-2">
    <div class="field"><label>A carico del Compratore</label><div class="val" style="font-weight:700;">€ 2.000</div></div>
    <div class="field"><label>A carico del Venditore</label><div class="val" style="font-weight:700;">€ 499</div></div>
  </div>
  <div style="font-size:7.5pt;color:#888;margin-top:8px;">Dovuto esclusivamente a transazione completata con rogito notarile.</div>
</div>

<div class="sig-grid">
  <div class="sig-box">
    <div style="font-size:7pt;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Proponente (Compratore)</div>
    <div style="font-size:10pt;font-weight:600;margin-top:4px;">${compratore_nome}</div>
    <div style="font-size:8pt;color:#888;">Data: ${oggi}</div>
    <div class="sig-line"></div>
    <div style="font-size:7pt;color:#aaa;text-align:center;margin-top:4px;">Firma digitale</div>
  </div>
  <div class="sig-box">
    <div style="font-size:7pt;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Venditore — Accettazione</div>
    <div style="font-size:10pt;font-weight:600;margin-top:4px;">${venditore_nome}</div>
    <div style="font-size:8pt;color:#888;">Data: _______________</div>
    <div class="sig-line"></div>
    <div style="font-size:7pt;color:#aaa;text-align:center;margin-top:4px;">Firma digitale per accettazione</div>
  </div>
</div>

<div class="footer">
  <span>REALAISTATE · realaistate.ai · info@realaistate.ai</span>
  <span>RealAIstate non è un'agenzia immobiliare</span>
</div>
</body>
</html>`;
}