// api/_lib/escape-html.js
// Escape minimo per interpolazione di stringhe user-controlled in template HTML email.
// Da usare su QUALSIASI campo che arrivi dal frontend (note, condizioni, nome,
// descrizione, domande, risposte AI) prima di inserirlo in template `<...>`.
//
// NON è una sanitizzazione completa anti-XSS per browser — i client email moderni
// (Gmail, Outlook, Apple Mail) bloccano <script>, ma <img onerror>, tracking pixel
// remoti, tag <a> con href javascript:, e link visualmente camuffati passano se
// non escapiamo. Questo helper neutralizza tutti i casi pratici.

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"'`=/]/g, (c) => HTML_ESCAPES[c]);
}

// Helper per casi in cui vuoi mostrare "—" per valori vuoti, ma escape se presenti
export function escapeHtmlOrDash(value) {
  if (value === null || value === undefined || value === '') return '—';
  return escapeHtml(value);
}
