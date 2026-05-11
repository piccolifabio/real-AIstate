// Open-redirect protection per path passati come query param (?redirect=,
// ?next=). Accetta solo path relativi che iniziano con "/", rifiuta
// protocol-relative URLs ("//evil.com") e mismatch lunghezza.
//
// Estratto da LoginPage.jsx batch 5 task 5.C — riusato anche in AuthCallback.

export function safeRedirect(raw, fallback = "/") {
  if (!raw || typeof raw !== "string") return fallback;
  if (raw.length > 512) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}
