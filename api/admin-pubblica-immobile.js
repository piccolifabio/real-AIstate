// api/admin-pubblica-immobile.js
// Approva la pubblicazione di un immobile in pending_review.
//
// Auth: header `x-admin-key` == ADMIN_SECRET (stesso pattern di admin-scuse).
//
// Logica:
//   1. UPDATE immobili.status = 'published' (idempotente se già published)
//   2. Se ai_summary/punti_forza/domande_consigliate sono mancanti, chiama
//      l'helper generateAndSaveImmobileAI per popolarli. Se la generazione
//      fallisce, l'immobile resta published comunque (l'AI è opzionale —
//      la scheda ha un fallback). Logghiamo l'errore.
//   3. Recupera email venditore via auth.users (admin endpoint).
//   4. Email Brevo "Il tuo immobile è online" con link cliccabile alla scheda.

import { handleCors } from "./_lib/cors.js";
import { escapeHtml } from "./_lib/escape-html.js";
import { generateAndSaveImmobileAI } from "./_lib/ai-content.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!SUPABASE_URL || !SUPABASE_SECRET) {
    return res.status(500).json({ error: "Supabase env mancante" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Body JSON invalido" });
  }
  const immobile_id = body?.immobile_id;
  if (!immobile_id) return res.status(400).json({ error: "immobile_id mancante" });

  try {
    // 1. UPDATE status a published, restituisce l'immobile aggiornato
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/immobili?id=eq.${encodeURIComponent(immobile_id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SECRET,
          Authorization: `Bearer ${SUPABASE_SECRET}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status: "published" }),
      }
    );

    if (!updateRes.ok) {
      const errBody = await updateRes.text();
      return res.status(500).json({ error: "Errore aggiornamento status", detail: errBody });
    }
    const rows = await updateRes.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: "Immobile non trovato" });
    }
    const immobile = rows[0];

    // 2. Se mancano i campi AI, popola via helper. Errore qui non blocca pubblicazione.
    const aiMissing =
      !immobile.ai_summary ||
      !Array.isArray(immobile.punti_forza) ||
      immobile.punti_forza.length === 0 ||
      !Array.isArray(immobile.domande_consigliate) ||
      immobile.domande_consigliate.length === 0;

    let aiGenerated = false;
    let aiError = null;
    if (aiMissing) {
      try {
        await generateAndSaveImmobileAI(immobile);
        aiGenerated = true;
      } catch (err) {
        aiError = String(err?.message || err);
        console.error("admin-pubblica-immobile: AI generation failed:", aiError);
      }
    }

    // 3. Recupera email venditore
    let venditoreEmail = null;
    let venditoreNome = null;
    if (immobile.venditore_user_id) {
      try {
        const userRes = await fetch(
          `${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(immobile.venditore_user_id)}`,
          {
            headers: {
              apikey: SUPABASE_SECRET,
              Authorization: `Bearer ${SUPABASE_SECRET}`,
            },
          }
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          venditoreEmail = userData.email || null;
          venditoreNome = userData.user_metadata?.full_name || null;
        }
      } catch (err) {
        console.error("admin-pubblica-immobile: lookup venditore failed:", err);
      }
    }

    // 4. Email "il tuo immobile è online"
    let emailSent = false;
    if (BREVO_API_KEY && venditoreEmail) {
      const linkScheda = `https://realaistate.ai/immobili/${encodeURIComponent(immobile.id)}`;
      const indirizzoSafe = escapeHtml(immobile.indirizzo || "il tuo immobile");
      const nomeSafe = escapeHtml(venditoreNome || "");
      const greet = nomeSafe ? `Ciao ${nomeSafe},` : "Ciao,";

      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { name: "RealAIstate", email: "info@realaistate.ai" },
            to: [{ email: venditoreEmail, name: venditoreNome || venditoreEmail }],
            subject: "Il tuo immobile è online su RealAIstate",
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
              '<p style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;margin:0 0 12px;">Il tuo immobile &egrave; online.</p>',
              '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0 0 24px;line-height:1.7;">',
              escapeHtml(greet) + ' abbiamo approvato la pubblicazione del tuo annuncio in <strong style="color:#0a0a0a;">' + indirizzoSafe + '</strong>. ',
              "&Egrave; visibile a chiunque visiti la piattaforma e i compratori interessati possono ora contattarti tramite chat AI o inviare una proposta.",
              '</p>',
              '<table cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td style="background:#d93025;border-radius:2px;">',
              '<a href="' + encodeURI(linkScheda) + '" style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#ffffff;text-decoration:none;">Vedi la scheda &rarr;</a>',
              '</td></tr></table>',
              '<p style="font-family:Arial,sans-serif;font-size:14px;color:#666;margin:0 0 8px;line-height:1.7;">',
              "Da ora in poi riceverai una email ogni volta che un compratore ti scrive una domanda o ti invia una proposta. Puoi monitorare lo stato dei contatti dalla tua dashboard:",
              '</p>',
              '<p style="font-family:Arial,sans-serif;font-size:14px;margin:0;line-height:1.7;">',
              '<a href="https://realaistate.ai/venditore" style="color:#d93025;text-decoration:none;">realaistate.ai/venditore</a>',
              '</p>',
              '</td></tr>',
              '<tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #e8e8e8;">',
              '<p style="font-family:Arial,sans-serif;font-size:13px;color:#999;margin:0;line-height:1.7;">',
              'Per qualsiasi domanda scrivici a <a href="mailto:info@realaistate.ai" style="color:#d93025;text-decoration:none;">info@realaistate.ai</a><br/>',
              '<strong style="color:#0a0a0a;">realaistate.ai</strong> &#8212; Compra e vendi casa senza agenzia.',
              '</p></td></tr>',
              '</table></td></tr></table></div>',
            ].join(""),
          }),
        });
        emailSent = brevoRes.ok;
        if (!brevoRes.ok) {
          const errBody = await brevoRes.text();
          console.error("admin-pubblica-immobile: Brevo error:", errBody);
        }
      } catch (err) {
        console.error("admin-pubblica-immobile: email send failed:", err);
      }
    }

    return res.status(200).json({
      ok: true,
      immobile_id,
      status: "published",
      ai_generated: aiGenerated,
      ai_skipped: aiMissing && !aiGenerated,
      ai_error: aiError,
      email_sent: emailSent,
      venditore_email: venditoreEmail,
    });
  } catch (err) {
    console.error("admin-pubblica-immobile error:", err);
    return res.status(500).json({ error: "Errore interno", detail: String(err?.message || err) });
  }
}
