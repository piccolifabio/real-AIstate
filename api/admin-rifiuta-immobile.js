// api/admin-rifiuta-immobile.js
// Riporta un immobile in pending_review allo stato draft con motivazione
// inviata al venditore via email.
//
// Auth: header `x-admin-key` == ADMIN_SECRET.
// Body: { immobile_id, motivo? }

import { handleCors } from "./_lib/cors.js";
import { escapeHtml } from "./_lib/escape-html.js";

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
  const motivo = (body?.motivo || "").toString().trim();
  if (!immobile_id) return res.status(400).json({ error: "immobile_id mancante" });

  try {
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
        body: JSON.stringify({ status: "draft" }),
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
        console.error("admin-rifiuta-immobile: lookup venditore failed:", err);
      }
    }

    let emailSent = false;
    if (BREVO_API_KEY && venditoreEmail) {
      const indirizzoSafe = escapeHtml(immobile.indirizzo || "il tuo immobile");
      const nomeSafe = escapeHtml(venditoreNome || "");
      const greet = nomeSafe ? `Ciao ${nomeSafe},` : "Ciao,";
      const motivoBlock = motivo
        ? '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0 0 16px;line-height:1.7;"><strong style="color:#0a0a0a;">Cosa va sistemato:</strong><br/>' + escapeHtml(motivo) + '</p>'
        : "";

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
            subject: "Modifiche richieste sul tuo annuncio",
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
              '<p style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;margin:0 0 12px;">Modifiche richieste.</p>',
              '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0 0 16px;line-height:1.7;">',
              escapeHtml(greet) + " abbiamo revisionato il tuo annuncio in <strong style=\"color:#0a0a0a;\">" + indirizzoSafe + "</strong> e prima di pubblicarlo serve una sistemata.",
              '</p>',
              motivoBlock,
              '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0 0 24px;line-height:1.7;">',
              "Trovi l'annuncio in stato “bozza” nella tua dashboard. Aggiorna i dati e clicca di nuovo su “Richiedi pubblicazione”.",
              '</p>',
              '<table cellpadding="0" cellspacing="0" style="margin:0 0 16px;"><tr><td style="background:#d93025;border-radius:2px;">',
              '<a href="https://realaistate.ai/venditore" style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#ffffff;text-decoration:none;">Vai alla dashboard &rarr;</a>',
              '</td></tr></table>',
              '</td></tr>',
              '<tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #e8e8e8;">',
              '<p style="font-family:Arial,sans-serif;font-size:13px;color:#999;margin:0;line-height:1.7;">',
              'Hai dubbi? Rispondi a questa email o scrivici a <a href="mailto:info@realaistate.ai" style="color:#d93025;text-decoration:none;">info@realaistate.ai</a><br/>',
              '<strong style="color:#0a0a0a;">realaistate.ai</strong> &#8212; Compra e vendi casa senza agenzia.',
              '</p></td></tr>',
              '</table></td></tr></table></div>',
            ].join(""),
          }),
        });
        emailSent = brevoRes.ok;
        if (!brevoRes.ok) {
          const errBody = await brevoRes.text();
          console.error("admin-rifiuta-immobile: Brevo error:", errBody);
        }
      } catch (err) {
        console.error("admin-rifiuta-immobile: email send failed:", err);
      }
    }

    return res.status(200).json({
      ok: true,
      immobile_id,
      status: "draft",
      email_sent: emailSent,
      venditore_email: venditoreEmail,
    });
  } catch (err) {
    console.error("admin-rifiuta-immobile error:", err);
    return res.status(500).json({ error: "Errore interno", detail: String(err?.message || err) });
  }
}
