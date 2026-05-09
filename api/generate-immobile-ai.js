// api/generate-immobile-ai.js
// Genera ai_summary, punti_forza, domande_consigliate per un immobile e li
// scrive in DB (caching). Idempotente: chiamarla più volte sovrascrive.
//
// Sicurezza:
//   - Richiede JWT del venditore proprietario dell'immobile
//   - OPPURE header X-Admin-Secret == ADMIN_SECRET (per trigger amministrativo
//     quando approvi una pubblicazione)
//
// Trigger:
//   - Manuale dal venditore via dashboard (futuro: bottone "rigenera testi AI")
//   - Admin tool al passaggio pending_review → published
//
// Importante: NON calcola Fair Price Score, NON cita range OMI specifici.

import { verifyJwt } from "./_lib/auth.js";
import { handleCors } from "./_lib/cors.js";
import { generateAndSaveImmobileAI } from "./_lib/ai-content.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  if (!SUPABASE_URL || !SUPABASE_SECRET) {
    return res.status(500).json({ error: "Supabase env mancante" });
  }

  const { immobile_id } = req.body || {};
  if (!immobile_id) return res.status(400).json({ error: "immobile_id mancante" });

  // ── Auth: o JWT del venditore, o admin secret ──────────────────────────────
  const adminHeader = req.headers["x-admin-secret"] || req.headers["X-Admin-Secret"];
  const isAdmin = ADMIN_SECRET && adminHeader === ADMIN_SECRET;

  let callerUserId = null;
  if (!isAdmin) {
    const auth = await verifyJwt(req);
    if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
    callerUserId = auth.user.id;
  }

  // ── Leggi immobile (con service_role per bypassare RLS) ────────────────────
  let immobile;
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/immobili?id=eq.${encodeURIComponent(immobile_id)}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SECRET,
          Authorization: `Bearer ${SUPABASE_SECRET}`,
        },
      }
    );
    const rows = await r.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: "Immobile non trovato" });
    }
    immobile = rows[0];
  } catch (err) {
    return res.status(500).json({ error: "Errore lettura immobile", detail: String(err) });
  }

  // ── Ownership check (skippato per admin) ───────────────────────────────────
  if (!isAdmin) {
    if (!immobile.venditore_user_id || immobile.venditore_user_id !== callerUserId) {
      return res.status(403).json({ error: "Non sei autorizzato a rigenerare i testi di questo immobile" });
    }
  }

  // ── Genera + salva via helper ──────────────────────────────────────────────
  try {
    const payload = await generateAndSaveImmobileAI(immobile);
    return res.status(200).json({
      ok: true,
      immobile_id,
      ai_summary: payload.ai_summary,
      punti_forza: payload.punti_forza,
      domande_consigliate: payload.domande_consigliate,
    });
  } catch (err) {
    console.error("generate-immobile-ai error:", err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
