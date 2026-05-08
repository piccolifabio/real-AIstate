// api/proposta-submit.js
// Chiamato dal modal "Fai un'offerta" in Immobile.jsx
// Sicurezza:
//   - Richiede header Authorization: Bearer <jwt> dell'utente loggato
//   - user_id e user_email vengono letti dal token, NON dal body
//   - Prezzo e venditore vengono letti dal DB, NON dal body
//   - Tutti i campi user-controlled passano da escapeHtml prima dell'email
// Flusso:
//   1. Valida JWT, ottieni compratore (user)
//   2. Legge immobile + venditore_user_id dal DB (autoritativo)
//   3. Salva proposta su Supabase
//   4. Manda email B (notifica) a info@ + venditore reale
//   5. Manda email A (conferma) al compratore

import { verifyJwt } from "./_lib/auth.js";
import { handleCors } from "./_lib/cors.js";
import { escapeHtml } from "./_lib/escape-html.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // ── 0. Verifica JWT ──────────────────────────────────────────────────────────
  const auth = await verifyJwt(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const compratore_user_id = auth.user.id;
  const compratore_email   = auth.user.email;
  const compratore_nome    = auth.user.user_metadata?.full_name || null;

  // ── 1. Parse e valida body ──────────────────────────────────────────────────
  const { immobile_id, importo, condizioni, data_rogito, note } = req.body || {};

  if (!immobile_id) {
    return res.status(400).json({ error: "immobile_id mancante" });
  }
  const importoNum = Number(importo);
  if (!Number.isFinite(importoNum) || importoNum <= 0) {
    return res.status(400).json({ error: "Importo non valido" });
  }
  if (!data_rogito) {
    return res.status(400).json({ error: "Data rogito mancante" });
  }
  // Validazione data: deve essere futura
  const dataRogitoDate = new Date(data_rogito);
  if (isNaN(dataRogitoDate.getTime()) || dataRogitoDate <= new Date()) {
    return res.status(400).json({ error: "Data rogito deve essere futura" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
  const BREVO_KEY    = process.env.BREVO_API_KEY;

  const sbHeaders = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    // ── 2. Leggi immobile dal DB (autoritativo) ────────────────────────────────
    const immobileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/immobili?id=eq.${encodeURIComponent(immobile_id)}&select=id,indirizzo,zona,prezzo,venditore_user_id,status`,
      { headers: sbHeaders }
    );
    const immobiliArr = await immobileRes.json();
    const immobileDb  = Array.isArray(immobiliArr) ? immobiliArr[0] : null;

    if (!immobileDb) {
      return res.status(404).json({ error: "Immobile non trovato" });
    }
    if (immobileDb.status !== "published") {
      return res.status(400).json({ error: "Immobile non disponibile per proposte" });
    }
    // Defense in depth: il venditore non può fare proposte sul proprio immobile.
    if (immobileDb.venditore_user_id && immobileDb.venditore_user_id === compratore_user_id) {
      return res.status(400).json({ error: "Non puoi fare una proposta sul tuo immobile" });
    }

    const indirizzoVero = immobileDb.indirizzo;
    const prezzoVero    = Number(immobileDb.prezzo);

    const diff   = importoNum - prezzoVero;
    const perc   = prezzoVero > 0 ? Math.round(Math.abs(diff) / prezzoVero * 100) : 0;
    const colore = diff >= 0 ? '#2d6a4f' : '#d93025';
    const label  = diff >= 0 ? `+${perc}% sopra prezzo` : `${perc}% sotto prezzo`;

    // ── 3. Leggi email/nome venditore da auth.users ─────────────────────────────
    let venditore_email = null;
    let venditore_nome  = null;
    if (immobileDb.venditore_user_id) {
      try {
        const r = await fetch(
          `${SUPABASE_URL}/auth/v1/admin/users/${immobileDb.venditore_user_id}`,
          { headers: sbHeaders }
        );
        if (r.ok) {
          const u = await r.json();
          venditore_email = u?.email || null;
          venditore_nome  = u?.user_metadata?.full_name || 'Venditore';
        }
      } catch (e) {
        console.error("Errore lettura venditore:", e);
      }
    }

    // ── 4. Salva proposta su Supabase ──────────────────────────────────────────
    const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/proposte`, {
      method: "POST",
      headers: { ...sbHeaders, "Prefer": "return=representation" },
      body: JSON.stringify({
        immobile_id:        immobileDb.id,
        compratore_email:   compratore_email,
        compratore_nome:    compratore_nome,
        compratore_user_id: compratore_user_id,
        importo:            importoNum,
        condizioni:         condizioni || null,
        data_rogito:        data_rogito || null,
        note:               note || null,
        status:             'pending',
      }),
    });

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      return res.status(500).json({ error: "Supabase error", detail: errText });
    }

    // ── 5. Email B — notifica al venditore (e a info@) ─────────────────────────
    // Tutti i campi user-controlled passano da escapeHtml.
    const destinatariB = [{ email: 'info@realaistate.ai', name: 'RealAIstate' }];
    if (venditore_email && venditore_email !== 'info@realaistate.ai') {
      destinatariB.push({ email: venditore_email, name: venditore_nome || 'Venditore' });
    }

    const compratoreVisuale = compratore_nome
      ? `${escapeHtml(compratore_nome)} · ${escapeHtml(compratore_email)}`
      : escapeHtml(compratore_email);

    const indirizzoEsc = escapeHtml(indirizzoVero);
    const condizioniEsc = condizioni ? escapeHtml(condizioni) : '';
    const noteEsc = note ? escapeHtml(note) : '';
    const dataRogitoEsc = escapeHtml(data_rogito || 'Da concordare');

    const emailVenditoreHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f7f5f0;">
        <div style="background:#0a0a0a;padding:24px 30px;border-bottom:1px solid rgba(247,245,240,0.08);">
          <span style="font-size:22px;font-weight:700;color:#f7f5f0;letter-spacing:0.02em;">REAL</span><span style="font-size:22px;font-weight:700;color:#d93025;">AI</span><span style="font-size:22px;font-weight:700;color:#f7f5f0;">STATE</span>
        </div>
        <div style="padding:36px 30px;">
          <div style="font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#d93025;margin-bottom:14px;">
            Nuova proposta ricevuta
          </div>
          <h1 style="font-family:Arial,sans-serif;font-size:28px;font-weight:700;color:#f7f5f0;margin:0 0 8px;line-height:1.2;">
            Hai una nuova proposta.
          </h1>
          <p style="font-size:14px;color:rgba(247,245,240,0.55);margin:0 0 28px;line-height:1.5;">
            ${indirizzoEsc}
          </p>

          <div style="background:#141414;border:1px solid rgba(247,245,240,0.08);border-radius:3px;padding:22px;margin-bottom:24px;">
            <div style="display:block;margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Compratore</div>
              <div style="font-size:15px;color:#f7f5f0;">${compratoreVisuale}</div>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Importo offerto</div>
              <div style="font-size:22px;font-weight:700;color:#f7f5f0;">€${importoNum.toLocaleString('it-IT')}</div>
              <div style="font-size:13px;color:${colore};font-weight:600;margin-top:4px;">${label} (€${diff >= 0 ? '+' : ''}${diff.toLocaleString('it-IT')})</div>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Data rogito proposta</div>
              <div style="font-size:14px;color:#f7f5f0;">${dataRogitoEsc}</div>
            </div>
            ${condizioniEsc ? `
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Condizioni</div>
              <div style="font-size:14px;color:rgba(247,245,240,0.8);font-style:italic;">${condizioniEsc}</div>
            </div>` : ''}
            ${noteEsc ? `
            <div>
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Note</div>
              <div style="font-size:14px;color:rgba(247,245,240,0.8);font-style:italic;">${noteEsc}</div>
            </div>` : ''}
          </div>

          <a href="https://realaistate.ai/venditore" style="display:inline-block;background:#d93025;color:#f7f5f0;text-decoration:none;padding:14px 28px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;">
            Vai alla dashboard →
          </a>
        </div>
        <div style="padding:20px 30px;border-top:1px solid rgba(247,245,240,0.08);font-size:12px;color:rgba(247,245,240,0.35);">
          RealAIstate · realaistate.ai
        </div>
      </div>
    `;

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": BREVO_KEY },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: destinatariB,
        subject: `Nuova proposta su ${indirizzoVero}`,
        htmlContent: emailVenditoreHtml,
      }),
    });

    // ── 6. Email A — conferma al compratore ────────────────────────────────────
    const compratoreNomeVisuale = compratore_nome ? escapeHtml(compratore_nome.split(' ')[0]) : '';

    const emailCompratoreHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f7f5f0;">
        <div style="background:#0a0a0a;padding:24px 30px;border-bottom:1px solid rgba(247,245,240,0.08);">
          <span style="font-size:22px;font-weight:700;color:#f7f5f0;letter-spacing:0.02em;">REAL</span><span style="font-size:22px;font-weight:700;color:#d93025;">AI</span><span style="font-size:22px;font-weight:700;color:#f7f5f0;">STATE</span>
        </div>
        <div style="padding:36px 30px;">
          <div style="font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#d93025;margin-bottom:14px;">
            Proposta inviata
          </div>
          <h1 style="font-family:Arial,sans-serif;font-size:28px;font-weight:700;color:#f7f5f0;margin:0 0 8px;line-height:1.2;">
            ${compratoreNomeVisuale ? `Ricevuta, ${compratoreNomeVisuale}.` : 'Proposta ricevuta.'}
          </h1>
          <p style="font-size:14px;color:rgba(247,245,240,0.55);margin:0 0 28px;line-height:1.5;">
            La tua proposta per <strong style="color:rgba(247,245,240,0.8);">${indirizzoEsc}</strong> è stata inviata al venditore.
          </p>

          <div style="background:#141414;border:1px solid rgba(247,245,240,0.08);border-radius:3px;padding:22px;margin-bottom:24px;">
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Importo proposto</div>
              <div style="font-size:22px;font-weight:700;color:#f7f5f0;">€${importoNum.toLocaleString('it-IT')}</div>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Data rogito proposta</div>
              <div style="font-size:14px;color:#f7f5f0;">${dataRogitoEsc}</div>
            </div>
            ${condizioniEsc ? `
            <div>
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Condizioni</div>
              <div style="font-size:14px;color:rgba(247,245,240,0.8);font-style:italic;">${condizioniEsc}</div>
            </div>` : ''}
          </div>

          <div style="background:rgba(217,48,37,0.08);border-left:3px solid #d93025;padding:16px 20px;margin-bottom:28px;">
            <div style="font-size:13px;color:rgba(247,245,240,0.8);line-height:1.6;">
              <strong style="color:#f7f5f0;">Il venditore ha 24 ore per rispondere.</strong><br/>
              Ti notificheremo via email appena la proposta verrà accettata o rifiutata.
              Se viene accettata, riceverai un documento da firmare digitalmente.
            </div>
          </div>

          <a href="https://realaistate.ai/account" style="display:inline-block;background:#d93025;color:#f7f5f0;text-decoration:none;padding:14px 28px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;">
            Vedi le mie proposte →
          </a>
        </div>
        <div style="padding:20px 30px;border-top:1px solid rgba(247,245,240,0.08);font-size:12px;color:rgba(247,245,240,0.35);">
          RealAIstate · realaistate.ai
        </div>
      </div>
    `;

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": BREVO_KEY },
      body: JSON.stringify({
        sender: { name: "RealAIstate", email: "info@realaistate.ai" },
        to: [{ email: compratore_email, name: compratore_nome || compratore_email }],
        subject: `Proposta inviata — ${indirizzoVero}`,
        htmlContent: emailCompratoreHtml,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("proposta-submit error:", e);
    return res.status(500).json({ error: e.message });
  }
}
