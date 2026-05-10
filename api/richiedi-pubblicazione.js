import { escapeHtml } from "./_lib/escape-html.js";
import { handleCors } from "./_lib/cors.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).end();

  try {
    // 1. Verifica auth user via JWT
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
    const userEmail = userData.email;
    const userName = userData.user_metadata?.full_name || userEmail;

    // 2. Parse body
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const raw = Buffer.concat(buffers).toString("utf8");
    const { immobile_id } = JSON.parse(raw);

    if (!immobile_id) return res.status(400).json({ error: "immobile_id mancante" });

    // 3. Verifica ownership: l'immobile deve appartenere all'utente
    //    e deve essere in stato 'draft' (non si richiede review se già pending o published)
    const checkRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/immobili?id=eq.${immobile_id}&select=*`,
      {
        headers: {
          "apikey": process.env.SUPABASE_SECRET_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        },
      }
    );
    const records = await checkRes.json();
    const immobile = records[0];

    if (!immobile) return res.status(404).json({ error: "Immobile non trovato" });
    if (immobile.venditore_user_id !== userId) {
      return res.status(403).json({ error: "Non sei il proprietario di questo immobile" });
    }
    if (immobile.status !== "draft") {
      return res.status(400).json({ error: `Stato corrente '${immobile.status}': non è possibile richiedere pubblicazione` });
    }

    // 4. Update status a pending_review (via service role, RLS bypassed)
    const updateRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/immobili?id=eq.${immobile_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SECRET_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
          "Prefer": "return=representation",
        },
        body: JSON.stringify({ status: "pending_review" }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error("Update status error:", err);
      return res.status(500).json({ error: "Errore aggiornamento stato" });
    }

    const supabaseStorageBase = `${process.env.SUPABASE_URL}/storage/v1/object/documenti-venditori`;
    const e = (v) => escapeHtml(v == null || v === "" ? "—" : v);
    const safeStorageHref = (path) => `${supabaseStorageBase}/${encodeURI(path)}`;

    const fotoLinks = Array.isArray(immobile.foto) && immobile.foto.length > 0
      ? immobile.foto.map((f, i) => `<p>&rarr; <a href="${safeStorageHref(f)}">Foto ${i + 1}</a></p>`).join("")
      : "<p>Nessuna foto caricata</p>";

    const prezzoFmt = immobile.prezzo
      ? Number(immobile.prezzo).toLocaleString("it-IT")
      : "—";

    // 5. Email a info@ con tutti i dati per la review
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: "info@realaistate.ai", name: "Fabio" }],
        subject: `Richiesta pubblicazione: ${immobile.indirizzo}`,
        htmlContent: [
          "<div style='font-family:Arial,sans-serif;max-width:600px;'>",
          "<h2>Richiesta pubblicazione immobile</h2>",
          "<p>Un venditore ha richiesto la pubblicazione del proprio immobile. Verifica i dati e le foto, poi approva o richiedi modifiche.</p>",
          "<hr/>",
          "<p><strong>Venditore:</strong> " + escapeHtml(userName) + " (" + escapeHtml(userEmail) + ")</p>",
          "<p><strong>User ID:</strong> " + escapeHtml(userId) + "</p>",
          "<p><strong>Immobile ID:</strong> " + escapeHtml(immobile_id) + "</p>",
          "<p><strong>Indirizzo:</strong> " + e(immobile.indirizzo) + "</p>",
          "<p><strong>Tipologia:</strong> " + e(immobile.tipologia) + " &mdash; " + e(immobile.stato_immobile) + "</p>",
          "<p><strong>Prezzo:</strong> &euro; " + escapeHtml(prezzoFmt) + "</p>",
          "<p><strong>Superficie:</strong> " + e(immobile.superficie) + " mq catastali" + (immobile.superficie_calpestabile ? " / " + e(immobile.superficie_calpestabile) + " mq calpestabili" : "") + "</p>",
          "<p><strong>Locali:</strong> " + e(immobile.locali) + " | Camere: " + e(immobile.camere) + " | Bagni: " + e(immobile.bagni) + "</p>",
          "<p><strong>Anno costruzione:</strong> " + e(immobile.anno_costruzione) + " | Classe energetica: " + e(immobile.classe_energetica) + "</p>",
          "<hr/>",
          "<p><strong>Foto (" + (immobile.foto ? immobile.foto.length : 0) + "):</strong></p>",
          fotoLinks,
          "<hr/>",
          "<p><strong>Per approvare:</strong> vai su Supabase → tabella immobili → riga id=" + escapeHtml(immobile_id) + " → cambia <code>status</code> a <code>published</code>.</p>",
          "<p><strong>Per rifiutare:</strong> rispondi a questa email scrivendo al venditore cosa va sistemato, poi riporta <code>status</code> a <code>draft</code>.</p>",
          "</div>",
        ].join(""),
      }),
    });

    // 6. Email di conferma al venditore
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: userEmail, name: userName }],
        subject: "Abbiamo ricevuto la tua richiesta di pubblicazione",
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
          '<p style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;margin:0 0 12px;">Richiesta ricevuta.</p>',
          '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0 0 16px;line-height:1.7;">',
          'Stiamo verificando i dati e le foto del tuo immobile in <strong style="color:#0a0a0a;">' + immobile.indirizzo + '</strong>. ',
          'Ti scriviamo entro 24 ore con l&apos;esito.',
          '</p>',
          '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0;line-height:1.7;">',
          'Quando il tuo annuncio sar&agrave; approvato, lo vedrai marcato come <strong>"Pubblicato"</strong> nella tua dashboard.',
          '</p></td></tr>',
          '<tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #e8e8e8;">',
          '<p style="font-family:Arial,sans-serif;font-size:13px;color:#999;margin:0;line-height:1.7;">',
          'Per qualsiasi domanda scrivici a <a href="mailto:info@realaistate.ai" style="color:#d93025;text-decoration:none;">info@realaistate.ai</a><br/>',
          '<strong style="color:#0a0a0a;">realaistate.ai</strong> &#8212; Compra e vendi casa senza agenzia.',
          '</p></td></tr>',
          '</table></td></tr></table></div>',
        ].join(""),
      }),
    });

    res.status(200).json({ ok: true, status: "pending_review" });

  } catch (e) {
    console.error("richiedi-pubblicazione error:", e);
    res.status(500).json({ error: "Errore interno" });
  }
}