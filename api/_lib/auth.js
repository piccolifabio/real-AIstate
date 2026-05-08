// api/_lib/auth.js
// Helper condiviso per validare il JWT di Supabase Auth nelle API serverless.
//
// Pattern: il frontend manda `Authorization: Bearer <access_token>`.
// Questa funzione lo verifica chiamando `auth/v1/user` con la SECRET key,
// che è il modo ufficiale di Supabase di validare un JWT lato server senza
// dover decodificare la firma a mano.
//
// Restituisce sempre un oggetto:
//   { ok: true,  user: { id, email, user_metadata, ... } }
//   { ok: false, status: 401, error: "..." }
//
// Esempio di uso in handler:
//   const auth = await verifyJwt(req);
//   if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
//   const userId = auth.user.id;

export async function verifyJwt(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Token mancante' };
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    return { ok: false, status: 401, error: 'Token vuoto' };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  if (!SUPABASE_URL || !SUPABASE_SECRET) {
    return { ok: false, status: 500, error: 'Configurazione server mancante' };
  }

  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_SECRET,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!r.ok) {
      return { ok: false, status: 401, error: 'Sessione non valida o scaduta' };
    }
    const user = await r.json();
    if (!user?.id) {
      return { ok: false, status: 401, error: 'Utente non trovato' };
    }
    return { ok: true, user };
  } catch (err) {
    return { ok: false, status: 500, error: 'Errore verifica sessione' };
  }
}
