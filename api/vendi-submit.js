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
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f7f5f0;padding:40px;">
            <div style="font-size:28px;font-weight:900;margin-bottom:4px;">Real<span style="color:#d93025;">AI</span>state</div>
            <div style="width:40px;height:3px;background:#d93025;margin-bottom:32px;"></div>
            <h1 style="font-size:24px;color:#f7f5f0;margin-bottom:8px;">Ci siamo, ${dati.nome}.</h1>
            <p style="color:rgba(247,245,240,0.6);font-size:15px;line-height:1.7;margin-bottom:32px;">
              Abbiamo ricevuto i dati del tuo immobile in <strong style="color:#f7f5f0;">${dati.indirizzo}</strong>.
              Ti contatteremo entro 24 ore.
            </p>
            <div style="background:rgba(247,245,240,0.04);border:1px solid rgba(247,245,240,0.1);border-radius:4px;padding:24px;margin-bottom:24px;">
              <div style="font-size:11px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;color:#d93025;margin-bottom:16px;">Riepilogo immobile</div>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:5px 0;color:rgba(247,245,240,0.4);font-size:13px;width:40%;">Tipologia</td><td style="color:#f7f5f0;font-size:13px;">${dati.tipologia}</td></tr>
                <tr><td style="padding:5px 0;color:rgba(247,245,240,0.4);font-size:13px;">Indirizzo</td><td style="color:#f7f5f0;font-size:13px;">${dati.indirizzo}</td></tr>
                <tr><td style="padding:5px 0;color:rgba(247,245,240,0.4);font-size:13px;">Metratura</td><td style="color:#f7f5f0;font-size:13px;">${dati.metratura_commerciale} mq commerciali</td></tr>
                <tr><td style="padding:5px 0;color:rgba(247,245,240,0.4);font-size:13px;">Stato</td><td style="color:#f7f5f0;font-size:13px;">${dati.stato}</td></tr>
                <tr><td style="padding:5px 0;color:rgba(247,245,240,0.4);font-size:13px;">Prezzo desiderato</td><td style="color:#f7f5f0;font-size:13px;">€ ${parseInt(dati.prezzo_desiderato).toLocaleString("it-IT")}</td></tr>
                ${dati.cantina === "si" ? `<tr><td style="padding:5px 0;color:rgba(247,245,240,0.4);font-size:13px;">Cantina</td><td style="color:#f7f5f0;font-size:13px;">${dati.cantina_mq ? dati.cantina_mq + " mq" : "Sì"}</td></tr>` : ""}
                ${dati.garage === "si" ? `<tr><td style="padding:5px 0;color:rgba(247,245,240,0.4);font-size:13px;">Garage/Box</td><td style="color:#f7f5f0;font-size:13px;">${dati.garage_mq ? dati.garage_mq + " mq" : "Sì"}</td></tr>` : ""}
              </table>
            </div>
            <div style="background:rgba(247,245,240,0.03);border:1px solid rgba(247,245,240,0.08);border-radius:4px;padding:24px;margin-bottom:24px;">
              <div style="font-size:11px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;color:#f7f5f0;margin-bottom:12px;">Tienili pronti — ti serviranno a breve</div>
              <ul style="margin:0;padding:0;list-style:none;">
                ${["Visura catastale","Atto di provenienza","Delibere condominiali (ultime 3 assemblee)","Certificato di agibilità","Eventuali concessioni edilizie"].map(d => `<li style="font-size:13px;color:rgba(247,245,240,0.6);padding:4px 0;">→ ${d}</li>`).join("")}
              </ul>
            </div>
            <div style="font-size:13px;color:rgba(247,245,240,0.4);line-height:1.7;border-top:1px solid rgba(247,245,240,0.08);padding-top:24px;">
              Per qualsiasi domanda scrivici a <a href="mailto:info@realaistate.ai" style="color:#d93025;">info@realaistate.ai</a><br/>
              <strong style="color:#f7f5f0;">realaistate.ai</strong> — Compra e vendi casa senza agenzia.
            </div>
          </div>
        `,
      }),
    });

    // Notifica interna
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
