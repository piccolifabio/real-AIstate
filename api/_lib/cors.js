// api/_lib/cors.js
// CORS centralizzato. Restringe l'origin a domini noti invece di `*` aperto.
//
// Origin permessi:
//   - https://realaistate.ai             (production)
//   - https://www.realaistate.ai         (eventuale www)
//   - https://*.realaistate.ai           (sottodomini futuri)
//   - https://*.vercel.app               (preview deploy)
//   - http://localhost:5173              (vite dev)
//   - http://localhost:3000              (eventuale preview locale)
//
// Comportamento:
// - Se l'Origin del request matcha la lista, lo riflettiamo. Altrimenti
//   non settiamo Access-Control-Allow-Origin e il browser blocca.
// - Per richieste server-to-server (curl, Postman) Origin è assente:
//   non blocchiamo, perché CORS non c'entra.
// - OPTIONS preflight gestito qui: ritorna 204 e termina. Il chiamante
//   deve fare `if (handleCors(req, res)) return;` come prima cosa.

const ALLOWED_PATTERNS = [
  /^https:\/\/realaistate\.ai$/,
  /^https:\/\/www\.realaistate\.ai$/,
  /^https:\/\/[a-z0-9-]+\.realaistate\.ai$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
  /^http:\/\/localhost:(5173|3000|4173)$/,
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_PATTERNS.some((re) => re.test(origin));
}

/**
 * Setta gli header CORS e gestisce il preflight OPTIONS.
 * @returns {boolean} true se ha già scritto la risposta (preflight) — chi chiama deve `return`.
 */
export function handleCors(req, res) {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
