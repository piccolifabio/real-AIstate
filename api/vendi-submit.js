import { escapeHtml } from "./_lib/escape-html.js";
import { handleCors } from "./_lib/cors.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).end();

  try {
    // 1. Verifica auth: leggi JWT dall'header e recupera user
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Non autenticato" });

    const userRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "apikey": process.env.SUPABASE_SECRET_KEY,
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!userRes.ok) return res.status(401).json({ error: "Sessione non valida" });
    const userData = await userRes.json();
    const userId = userData.id;

    // 2. Parse body
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const raw = Buffer.concat(buffers).toString("utf8");
    const dati = JSON.parse(raw);

    // 3. Salva in venditori (lead completo, come prima)
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
        superficie_catastale: dati.superficie_catastale,
        superficie_calpestabile: dati.superficie_calpestabile,
        anno_ristrutturazione: dati.anno_ristrutturazione,
        riscaldamento: dati.riscaldamento,
        acqua_calda: dati.acqua_calda,
        spese_condominio: dati.spese_condominio,
        terrazzo: dati.terrazzo,
        terrazzo_mq: dati.terrazzo_mq,
        giardino: dati.giardino,
        disponibilita_rogito: dati.disponibilita_rogito,
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
      console.error("Supabase venditori error:", err);
    }

    // 4. NUOVO: insert in immobili (status=draft) per l'utente loggato
    const immobiliPayload = {
      indirizzo: dati.indirizzo,
      zona: null,
      prezzo: dati.prezzo_desiderato ? parseFloat(dati.prezzo_desiderato) : null,
      superficie: dati.superficie_catastale ? parseFloat(dati.superficie_catastale) : null,
      tipologia: dati.tipologia || null,
      piano: dati.piano || null,
      superficie_calpestabile: dati.superficie_calpestabile ? parseFloat(dati.superficie_calpestabile) : null,
      vani: dati.vani ? parseInt(dati.vani) : null,
      camere: dati.camere ? parseInt(dati.camere) : null,
      bagni: dati.bagni ? parseInt(dati.bagni) : null,
      anno_costruzione: dati.anno_costruzione ? parseInt(dati.anno_costruzione) : null,
      classe_energetica: dati.classe_energetica || null,
      stato_immobile: dati.stato || null,
      foto: dati.foto || [],
      venditore_user_id: userId,
      status: "draft",
    };

    const immobileRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/immobili`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SECRET_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify(immobiliPayload),
    });

    let immobileId = null;
    if (immobileRes.ok) {
      const immobileData = await immobileRes.json();
      immobileId = immobileData[0]?.id;
    } else {
      const err = await immobileRes.text();
      console.error("Supabase immobili error:", err);
    }

    const supabaseStorageBase = `${process.env.SUPABASE_URL}/storage/v1/object/documenti-venditori`;

    // Tutti i campi user-controlled passano da escapeHtml prima dell'interpolazione.
    const e = (v) => escapeHtml(v == null || v === "" ? "—" : v);
    const eRaw = (v) => escapeHtml(v ?? "");
    const prezzoFmt = dati.prezzo_desiderato
      ? parseInt(dati.prezzo_desiderato).toLocaleString("it-IT")
      : "—";

    // 5. Email conferma venditore
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: dati.email, name: (dati.nome + " " + (dati.cognome || "")).trim() }],
        subject: "Abbiamo ricevuto il tuo immobile — RealAIstate",
        htmlContent: [
          '<div style="background:#f4f4f4;padding:0;margin:0;">',
          '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">',
          '<tr><td align="center" style="padding:40px 20px;">',
          '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;">',
          '<tr><td style="background:#0a0a0a;padding:28px 40px 24px;">',
          '<span style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#f7f5f0;">Real</span>',
          '<span style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#d93025;">AI</span>',
          '<span style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#f7f5f0;">state</span>',
          '</td></tr>',
          '<tr><td style="background:#d93025;height:4px;font-size:0;">&nbsp;</td></tr>',
          '<tr><td style="padding:40px 40px 16px;">',
          '<p style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;margin:0 0 12px;">Ci siamo, ' + eRaw(dati.nome) + '.</p>',
          '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0;line-height:1.7;">',
          'Abbiamo ricevuto i dati del tuo immobile in <strong style="color:#0a0a0a;">' + e(dati.indirizzo) + '</strong>. Ti contatteremo entro 24 ore.',
          '</p></td></tr>',
          '<tr><td style="padding:0 40px 32px;">',
          '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:3px;overflow:hidden;">',
          '<tr><td style="background:#f9f9f9;padding:12px 16px;border-bottom:1px solid #e8e8e8;">',
          '<p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#d93025;margin:0;">Riepilogo immobile</p>',
          '</td></tr><tr><td style="padding:16px;">',
          '<table width="100%" cellpadding="0" cellspacing="0">',
          '<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999;padding:5px 0;width:40%;">Tipologia</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">' + e(dati.tipologia) + '</td></tr>',
          '<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999;padding:5px 0;">Indirizzo</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">' + e(dati.indirizzo) + '</td></tr>',
          '<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999;padding:5px 0;">Superficie</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">' + e(dati.superficie_catastale) + ' mq catastali</td></tr>',
          '<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999;padding:5px 0;">Stato</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">' + e(dati.stato) + '</td></tr>',
          '<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#999;padding:5px 0;">Prezzo desiderato</td><td style="font-family:Arial,sans-serif;font-size:13px;color:#0a0a0a;font-weight:600;padding:5px 0;">&#8364; ' + escapeHtml(prezzoFmt) + '</td></tr>',
          '</table></td></tr></table></td></tr>',
          '<tr><td style="padding:0 40px 40px;">',
          '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:3px;overflow:hidden;">',
          '<tr><td style="background:#f9f9f9;padding:12px 16px;border-bottom:1px solid #e8e8e8;">',
          '<p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#0a0a0a;margin:0;">Tienili pronti — ti serviranno a breve</p>',
          '</td></tr><tr><td style="padding:16px;">',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#777;margin:0 0 12px;">Non bloccano la pubblicazione oggi, ma sono obbligatori per arrivare al rogito.</p>',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#333;margin:4px 0;">&#8594; Visura catastale</p>',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#333;margin:4px 0;">&#8594; Atto di provenienza</p>',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#333;margin:4px 0;">&#8594; Delibere condominiali (ultime 3 assemblee)</p>',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#333;margin:4px 0;">&#8594; Certificato di agibilit&#224;</p>',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#333;margin:4px 0;">&#8594; Eventuali concessioni edilizie</p>',
          '</td></tr></table></td></tr>',
          '<tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #e8e8e8;">',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#999;margin:0;line-height:1.7;">',
          'Per qualsiasi domanda scrivici a <a href="mailto:info@realaistate.ai" style="color:#d93025;text-decoration:none;">info@realaistate.ai</a><br/>',
          '<strong style="color:#0a0a0a;">realaistate.ai</strong> &#8212; Compra e vendi casa senza agenzia.',
          '</p></td></tr>',
          '</table></td></tr></table></div>',
        ].join(""),
      }),
    });

    // 6. Notifica interna a Fabio
    // Anche qui escapeHtml su tutti i campi user-controlled — lo storage path
    // viene encodeURI per rendere safe i nomi file con caratteri speciali.
    const safeStorageHref = (path) => `${supabaseStorageBase}/${encodeURI(path)}`;
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: "info@realaistate.ai", name: "Fabio" }],
        subject: "Nuovo venditore: " + dati.indirizzo,
        htmlContent: [
          "<div style='font-family:Arial,sans-serif;max-width:600px;'>",
          "<h2>Nuovo venditore registrato</h2>",
          "<p><strong>User ID (auth):</strong> " + escapeHtml(userId) + "</p>",
          "<p><strong>Immobile ID (draft):</strong> " + escapeHtml(immobileId || "ERRORE — non creato") + "</p>",
          "<p><strong>Nome:</strong> " + eRaw(dati.nome) + " " + eRaw(dati.cognome || "") + "</p>",
          "<p><strong>Email:</strong> " + eRaw(dati.email) + "</p>",
          "<p><strong>Telefono:</strong> " + eRaw(dati.telefono) + "</p>",
          "<p><strong>Indirizzo:</strong> " + e(dati.indirizzo) + "</p>",
          "<p><strong>Tipologia:</strong> " + e(dati.tipologia) + " &mdash; " + e(dati.stato) + "</p>",
          "<p><strong>Superficie:</strong> " + e(dati.superficie_catastale) + " mq catastali" + (dati.superficie_calpestabile ? " / " + e(dati.superficie_calpestabile) + " mq calpestabili" : "") + "</p>",
          "<p><strong>Vani:</strong> " + e(dati.vani) + " | Camere: " + e(dati.camere) + " | Bagni: " + e(dati.bagni) + "</p>",
          "<p><strong>Cantina:</strong> " + (dati.cantina === "si" ? "S&igrave;" + (dati.cantina_mq ? " (" + e(dati.cantina_mq) + " mq)" : "") : "No") + "</p>",
          "<p><strong>Garage:</strong> " + (dati.garage === "si" ? "S&igrave;" + (dati.garage_mq ? " (" + e(dati.garage_mq) + " mq)" : "") : "No") + "</p>",
          "<p><strong>Prezzo desiderato:</strong> &euro; " + escapeHtml(prezzoFmt) + "</p>",
          "<p><strong>Disponibilit&agrave; visite:</strong> " + e(dati.disponibilita) + "</p>",
          "<p><strong>Note:</strong> " + e(dati.note) + "</p>",
          "<hr/>",
          "<p><strong>Documenti:</strong></p>",
          "<p>&rarr; Planimetria: " + (dati.planimetria ? '<a href="' + safeStorageHref(dati.planimetria) + '">Scarica</a>' : "non caricata") + "</p>",
          "<p>&rarr; APE: " + (dati.ape ? '<a href="' + safeStorageHref(dati.ape) + '">Scarica</a>' : "non caricata") + "</p>",
          "<p><strong>Foto (" + (dati.foto ? dati.foto.length : 0) + "):</strong></p>",
          (dati.foto && dati.foto.length > 0 ? dati.foto.map(function(f, i) { return "<p>&rarr; <a href='" + safeStorageHref(f) + "'>Foto " + (i+1) + "</a></p>"; }).join("") : "<p>Nessuna foto caricata</p>"),
          "</div>",
        ].join(""),
      }),
    });

    res.status(200).json({ ok: true, immobile_id: immobileId });

  } catch (e) {
    console.error("vendi-submit error:", e);
    res.status(500).json({ error: "Errore interno" });
  }
}