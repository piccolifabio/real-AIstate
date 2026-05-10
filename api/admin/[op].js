// api/admin/[op].js
// Dispatcher unico per tutte le operazioni admin sugli immobili.
// Consolidato in un singolo file per stare sotto il limite Vercel Hobby
// (max 12 serverless functions per deployment).
//
// Auth: header `x-admin-key` == ADMIN_SECRET.
//
// Endpoint:
//   GET  /api/admin/immobili → lista pending_review
//   POST /api/admin/pubblica → approva: status='published' + AI fill + email
//   POST /api/admin/rifiuta  → rifiuto: status='draft' + email con motivo

import { handleCors } from "../_lib/cors.js";
import { escapeHtml } from "../_lib/escape-html.js";
import { generateAndSaveImmobileAI } from "../_lib/ai-content.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET: process.env.SUPABASE_SECRET_KEY,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
  };
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET) {
    return res.status(500).json({ error: "Supabase env mancante" });
  }

  const op = req.query.op;
  switch (op) {
    case "immobili":
      if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
      return listImmobili(req, res, env);
    case "pubblica":
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      return pubblicaImmobile(req, res, env);
    case "rifiuta":
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      return rifiutaImmobile(req, res, env);
    default:
      return res.status(404).json({ error: `Unknown op: ${op}` });
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return req.body;
}

async function lookupVenditore(env, userId) {
  if (!userId) return { email: null, nome: null };
  try {
    const r = await fetch(
      `${env.SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          apikey: env.SUPABASE_SECRET,
          Authorization: `Bearer ${env.SUPABASE_SECRET}`,
        },
      }
    );
    if (!r.ok) return { email: null, nome: null };
    const data = await r.json();
    return {
      email: data.email || null,
      nome: data.user_metadata?.full_name || null,
    };
  } catch {
    return { email: null, nome: null };
  }
}

async function patchImmobileStatus(env, immobileId, status) {
  const r = await fetch(
    `${env.SUPABASE_URL}/rest/v1/immobili?id=eq.${encodeURIComponent(immobileId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: env.SUPABASE_SECRET,
        Authorization: `Bearer ${env.SUPABASE_SECRET}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ status }),
    }
  );
  if (!r.ok) {
    const errBody = await r.text();
    return { ok: false, error: errBody };
  }
  const rows = await r.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, error: "Immobile non trovato", notFound: true };
  }
  return { ok: true, immobile: rows[0] };
}

async function sendBrevo(env, { to, name, subject, html }) {
  if (!env.BREVO_API_KEY || !to) return false;
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: to, name: name || to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!r.ok) {
      const errBody = await r.text();
      console.error("Brevo error:", errBody);
    }
    return r.ok;
  } catch (err) {
    console.error("Brevo send failed:", err);
    return false;
  }
}

// ── op: immobili (GET) ───────────────────────────────────────────────────────

async function listImmobili(req, res, env) {
  try {
    const listRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/immobili?status=eq.pending_review&select=*&order=created_at.desc`,
      {
        headers: {
          apikey: env.SUPABASE_SECRET,
          Authorization: `Bearer ${env.SUPABASE_SECRET}`,
        },
      }
    );
    if (!listRes.ok) {
      const errBody = await listRes.text();
      return res.status(500).json({ error: "Errore lettura immobili", detail: errBody });
    }
    const immobili = await listRes.json();
    const enriched = await Promise.all(
      immobili.map(async (im) => {
        const v = await lookupVenditore(env, im.venditore_user_id);
        return { ...im, venditore_email: v.email, venditore_nome: v.nome };
      })
    );
    return res.status(200).json(enriched);
  } catch (err) {
    console.error("admin/immobili error:", err);
    return res.status(500).json({ error: "Errore server", detail: String(err) });
  }
}

// ── op: pubblica (POST) ──────────────────────────────────────────────────────

async function pubblicaImmobile(req, res, env) {
  const body = parseBody(req);
  if (body === null) return res.status(400).json({ error: "Body JSON invalido" });
  const immobile_id = body?.immobile_id;
  if (!immobile_id) return res.status(400).json({ error: "immobile_id mancante" });

  try {
    const upd = await patchImmobileStatus(env, immobile_id, "published");
    if (!upd.ok) {
      const status = upd.notFound ? 404 : 500;
      return res.status(status).json({ error: upd.error });
    }
    const immobile = upd.immobile;

    // AI fill se mancante (errore non blocca pubblicazione)
    const aiMissing =
      !immobile.titolo ||
      !immobile.ai_summary ||
      !Array.isArray(immobile.punti_forza) || immobile.punti_forza.length === 0 ||
      !Array.isArray(immobile.domande_consigliate) || immobile.domande_consigliate.length === 0;

    let aiGenerated = false;
    let aiError = null;
    if (aiMissing) {
      try {
        await generateAndSaveImmobileAI(immobile);
        aiGenerated = true;
      } catch (err) {
        aiError = String(err?.message || err);
        console.error("admin/pubblica: AI generation failed:", aiError);
      }
    }

    const v = await lookupVenditore(env, immobile.venditore_user_id);

    let emailSent = false;
    if (v.email) {
      const linkScheda = `https://realaistate.ai/immobili/${encodeURIComponent(immobile.id)}`;
      const indirizzoSafe = escapeHtml(immobile.indirizzo || "il tuo immobile");
      const nomeSafe = escapeHtml(v.nome || "");
      const greet = nomeSafe ? `Ciao ${nomeSafe},` : "Ciao,";
      const html = [
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
      ].join("");
      emailSent = await sendBrevo(env, {
        to: v.email,
        name: v.nome,
        subject: "Il tuo immobile è online su RealAIstate",
        html,
      });
    }

    return res.status(200).json({
      ok: true,
      immobile_id,
      status: "published",
      ai_generated: aiGenerated,
      ai_skipped: aiMissing && !aiGenerated,
      ai_error: aiError,
      email_sent: emailSent,
      venditore_email: v.email,
    });
  } catch (err) {
    console.error("admin/pubblica error:", err);
    return res.status(500).json({ error: "Errore interno", detail: String(err?.message || err) });
  }
}

// ── op: rifiuta (POST) ───────────────────────────────────────────────────────

async function rifiutaImmobile(req, res, env) {
  const body = parseBody(req);
  if (body === null) return res.status(400).json({ error: "Body JSON invalido" });
  const immobile_id = body?.immobile_id;
  const motivo = (body?.motivo || "").toString().trim();
  if (!immobile_id) return res.status(400).json({ error: "immobile_id mancante" });

  try {
    const upd = await patchImmobileStatus(env, immobile_id, "draft");
    if (!upd.ok) {
      const status = upd.notFound ? 404 : 500;
      return res.status(status).json({ error: upd.error });
    }
    const immobile = upd.immobile;
    const v = await lookupVenditore(env, immobile.venditore_user_id);

    let emailSent = false;
    if (v.email) {
      const indirizzoSafe = escapeHtml(immobile.indirizzo || "il tuo immobile");
      const nomeSafe = escapeHtml(v.nome || "");
      const greet = nomeSafe ? `Ciao ${nomeSafe},` : "Ciao,";
      const motivoBlock = motivo
        ? '<p style="font-family:Arial,sans-serif;font-size:15px;color:#555555;margin:0 0 16px;line-height:1.7;"><strong style="color:#0a0a0a;">Cosa va sistemato:</strong><br/>' + escapeHtml(motivo) + '</p>'
        : "";
      const html = [
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
      ].join("");
      emailSent = await sendBrevo(env, {
        to: v.email,
        name: v.nome,
        subject: "Modifiche richieste sul tuo annuncio",
        html,
      });
    }

    return res.status(200).json({
      ok: true,
      immobile_id,
      status: "draft",
      email_sent: emailSent,
      venditore_email: v.email,
    });
  } catch (err) {
    console.error("admin/rifiuta error:", err);
    return res.status(500).json({ error: "Errore interno", detail: String(err?.message || err) });
  }
}
