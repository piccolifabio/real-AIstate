// Whitelist email amministratori per UI privilegiate (es. anteprima
// privata di immobili non-published in scheda /immobili/:id). Configurata
// via env var VITE_ADMIN_EMAILS (comma-separated).
//
// NOTA: questo è un flag UI per concedere visibilità extra in lettura.
// NON è una autorizzazione di mutating operations: per quelle si usa
// ADMIN_SECRET server-side via header x-admin-key (pattern admin/[op]).
// Sono due livelli distinti per design — esporre VITE_* significa che il
// bundle JS contiene la lista in chiaro; va bene per UI, mai per auth.

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminUser(user) {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}
