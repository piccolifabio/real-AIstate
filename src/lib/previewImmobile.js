import { supabase } from "../supabase";

// Fallback fetch per preview admin/owner di immobili non-published. La fetch
// RLS standard via supabase-js anon-key ritorna 0 righe per drafts altrui
// (RLS filtra per status='published'). Questo helper chiama l'endpoint API
// /api/admin/preview-immobile che usa service_role + check email server-side
// (ADMIN_EMAILS env) per autorizzare la lettura.
//
// Ritorna { immobile, error }. immobile=null se non autorizzato o non esiste.
export async function fetchImmobilePreview(immobileId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return { immobile: null, error: "no-session" };
    }
    const r = await fetch("/api/admin/preview-immobile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ immobile_id: immobileId }),
    });
    if (!r.ok) {
      return { immobile: null, error: `http-${r.status}` };
    }
    const json = await r.json();
    return { immobile: json?.immobile || null, error: null };
  } catch (e) {
    return { immobile: null, error: String(e?.message || e) };
  }
}
