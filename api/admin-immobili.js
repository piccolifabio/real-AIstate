// api/admin-immobili.js
// Lista degli immobili in pending_review per il pannello admin.
// Auth: stesso pattern di admin-scuse.js → header `x-admin-key` confrontato
// con env ADMIN_SECRET.
//
// Restituisce, per ogni immobile pending:
//   id, titolo, indirizzo, prezzo, foto, ai_*, status, created_at,
//   venditore_user_id, venditore_email, venditore_nome
//
// L'email del venditore è in auth.users (non in immobili), quindi serve
// una chiamata a /auth/v1/admin/users/{id} per ognuno (1-5 in pratica).

import { handleCors } from "./_lib/cors.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  if (!SUPABASE_URL || !SUPABASE_SECRET) {
    return res.status(500).json({ error: "Supabase env mancante" });
  }

  try {
    const listRes = await fetch(
      `${SUPABASE_URL}/rest/v1/immobili?status=eq.pending_review&select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_SECRET,
          Authorization: `Bearer ${SUPABASE_SECRET}`,
        },
      }
    );
    if (!listRes.ok) {
      const errBody = await listRes.text();
      return res.status(500).json({ error: "Errore lettura immobili", detail: errBody });
    }
    const immobili = await listRes.json();

    // Resolvi info venditore per ogni immobile (parallelo)
    const enriched = await Promise.all(
      immobili.map(async (im) => {
        let venditore_email = null;
        let venditore_nome = null;
        if (im.venditore_user_id) {
          try {
            const userRes = await fetch(
              `${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(im.venditore_user_id)}`,
              {
                headers: {
                  apikey: SUPABASE_SECRET,
                  Authorization: `Bearer ${SUPABASE_SECRET}`,
                },
              }
            );
            if (userRes.ok) {
              const userData = await userRes.json();
              venditore_email = userData.email || null;
              venditore_nome = userData.user_metadata?.full_name || null;
            }
          } catch {
            // ignora: lasciamo null
          }
        }
        return { ...im, venditore_email, venditore_nome };
      })
    );

    return res.status(200).json(enriched);
  } catch (err) {
    console.error("admin-immobili error:", err);
    return res.status(500).json({ error: "Errore server", detail: String(err) });
  }
}
