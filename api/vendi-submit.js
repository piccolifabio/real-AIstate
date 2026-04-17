export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    // Leggi il body manualmente
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const raw = Buffer.concat(buffers).toString("utf8");
    const dati = JSON.parse(raw);

    // Salva in Supabase
    const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/venditori`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SECRET_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        tipologia: dati.tipologia,
        indirizzo: dati.indirizzo,
        piano: dati.piano,
        ascensore: dati.ascensore,
        metratura_commerciale: dati.metratura_commerciale,
        metratura_netta: dati.metratura_netta,
        vani: dati.vani,
        camere: dati.camere,
        bagni: dati.bagni,
        anno_costruzione: dati.anno_costruzione,
        stato: dati.stato,
        classe_energetica: dati.classe_energetica,
        cantina: dati.cantina,
        cantina_mq: dati.cantina_mq,
        garage: dati.garage,
        garage_mq: dati.garage_mq,
        prezzo_desiderato: dati.prezzo_desiderato,
        note_prezzo: dati.note_prezzo,
        nome: dati.nome,
        cognome: dati.cognome,
        email: dati.email,
        telefono: dati.telefono,
        disponibilita: dati.disponibilita,
        note: dati.note,
        planimetria_url: dati.planimetria || null,
        ape_url: dati.ape || null,
        status: "nuovo",
      }),
    });

    if (!sbRes.ok) {
      const err = await sbRes.text();
      console.error("Supabase error:", err);
    }

    // Email conferma al venditore
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: dati.email, name: `${dati.nome} ${dati.cognome || ""}`.trim() }],
        subject: "Abbiamo ricevuto il tuo immobile — RealAIstate",
        htmlContent: `
<div style="background:#f4f4f4;padding:0;margin:0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
<tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;">

  <!-- HEADER ROSSO -->
  <tr><td style="background:#0a0a0a;padding:28px 40px 24px;">
    <span style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#f7f5f0;">Real</span><span style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#d93025;">AI</span><span style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#f7f5f0;">state</span>
  </td></tr>

  <!-- STRISCIA ROSSA -->
  <tr><td style="background:#d93025;height:4px;font-size:0;">&nbsp;</td></tr>

  <!-- BODY -->
  <tr><td style="padding:40px 40px 16px;">
    <p style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;margin:0 0 12px;">Ci siamo, ${dati.nome}.</p>
    <p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0;line-height:1.7;">
      Abbiamo ricevuto i dati del tuo immobile in <strong style="color:#0a0a0a;">${dati.indirizzo}</strong>. Ti contatteremo entro 24 ore.
    </p>
  </td></tr>

  <!-- RIEPILOGO -->
  <tr><td style="padding:0 40px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:3px;overflow:hidden;">
      <tr><td style="background:#f9f9f9;padding:12px 16px;border-bottom:1px solid #e8e8e8;">
        <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#d93025;margin:0;">Riepilogo immobile</p>
      </td></tr>
      <tr><td style="padding:16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999999;padding:5px 0;width:40%;">Tipologia</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">${dati.tipologia}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999999;padding:5px 0;">Indirizzo</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">${dati.indirizzo}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999999;padding:5px 0;">Metratura</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">${dati.metratura_commerciale} mq commerciali</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999999;padding:5px 0;">Stato</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">${dati.stato}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999999;padding:5px 0;">Prezzo desiderato</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">€ ${parseInt(dati.prezzo_desiderato).toLocaleString("it-IT")}</td></tr>
          ${dati.cantina === "si" ? `<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999999;padding:5px 0;">Cantina</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">${dati.cantina_mq ? dati.cantina_mq + " mq" : "Sì"}</td></tr>` : ""}
          ${dati.garage === "si" ? `<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999999;padding:5px 0;">Garage/Box</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">${dati.garage_mq ? dati.garage_mq + " mq" : "Sì"}</td></tr>` : ""}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- DOCUMENTI -->
  <tr><td style="padding:0 40px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:3px;overflow:hidden;">
      <tr><td style="background:#f9f9f9;padding:12px 16px;border-bottom:1px solid #e8e8e8;">
        <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#0a0a0a;margin:0;">Tienili pronti — ti serviranno a breve</p>
      </td></tr>
      <tr><td style="padding:16px;">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#777777;margin:0 0 12px;line-height:1.6;">Non bloccano la pubblicazione oggi, ma sono obbligatori per arrivare al rogito.</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#333333;margin:4px 0;line-height:1.8;">→ Visura catastale</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#333333;margin:4px 0;line-height:1.8;">→ Atto di provenienza</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#333333;margin:4px 0;line-height:1.8;">→ Delibere condominiali (ultime 3 assemblee)</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#333333;margin:4px 0;line-height:1.8;">→ Certificato di agibilità</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#333333;margin:4px 0;line-height:1.8;">→ Eventuali concessioni edilizie</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #e8e8e8;">
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#999999;margin:0;line-height:1.7;">
      Per qualsiasi domanda scrivici a <a href="mailto:info@realaistate.ai" style="color:#d93025;text-decoration:none;">info@realaistate.ai</a><br/>
      <strong style="color:#0a0a0a;">realaistate.ai</strong> — Compra e vendi casa senza agenzia.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</div>
`

    // Notifica interna a Fabio
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: "info@realaistate.ai", name: "Fabio" }],
        subject: `🏠 Nuovo venditore — ${dati.indirizzo}`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;">
            <h2>Nuovo venditore registrato</h2>
            <p><strong>Nome:</strong> ${dati.nome} ${dati.cognome || ""}</p>
            <p><strong>Email:</strong> ${dati.email}</p>
            <p><strong>Telefono:</strong> ${dati.telefono}</p>
            <p><strong>Indirizzo:</strong> ${dati.indirizzo}</p>
            <p><strong>Tipologia:</strong> ${dati.tipologia} — ${dati.stato}</p>
            <p><strong>Metratura:</strong> ${dati.metratura_commerciale} mq${dati.metratura_netta ? ` / ${dati.metratura_netta} mq netti` : ""}</p>
            <p><strong>Vani:</strong> ${dati.vani || "—"} | Camere: ${dati.camere || "—"} | Bagni: ${dati.bagni || "—"}</p>
            <p><strong>Cantina:</strong> ${dati.cantina === "si" ? `Sì${dati.cantina_mq ? ` (${dati.cantina_mq} mq)` : ""}` : "No"}</p>
            <p><strong>Garage:</strong> ${dati.garage === "si" ? `Sì${dati.garage_mq ? ` (${dati.garage_mq} mq)` : ""}` : "No"}</p>
            <p><strong>Prezzo desiderato:</strong> € ${parseInt(dati.prezzo_desiderato).toLocaleString("it-IT")}</p>
            <p><strong>Disponibilità visite:</strong> ${dati.disponibilita || "non specificata"}</p>
            <p><strong>Note:</strong> ${dati.note || "—"}</p>
            <hr/>
            <p><strong>Documenti caricati:</strong></p>
            <p>→ Planimetria: ${dati.planimetria ? `<a href="${process.env.SUPABASE_URL}/storage/v1/object/documenti-venditori/${dati.planimetria}">Scarica</a>` : "non caricata"}</p>
            <p>→ APE: ${dati.ape ? `<a href="${process.env.SUPABASE_URL}/storage/v1/object/documenti-venditori/${dati.ape}">Scarica</a>` : "non caricata"}</p>
          </div>
        `,
      }),
    });

    res.status(200).json({ ok: true });

  } catch (e) {
    console.error("vendi-submit error:", e);
    res.status(500).json({ error: "Errore interno" });
  }
}
