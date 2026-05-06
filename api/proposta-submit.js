// api/proposta-submit.js
// Chiamato dal modal "Fai un'offerta" in Immobile.jsx
// Flusso:
//   1. Riceve dati proposta dal frontend
//   2. Legge immobile + venditore da DB (autoritativo, frontend non può manipolare prezzo/venditore)
//   3. Salva proposta su Supabase con compratore_nome letto da auth metadata
//   4. Manda email B (notifica) a info@ + venditore reale
//   5. Manda email A (conferma) al compratore

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { immobile, user_email, user_id, importo, condizioni, data_rogito, note } = req.body;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
  const BREVO_KEY    = process.env.BREVO_API_KEY;

  // Helper Supabase REST
  const sbHeaders = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    // ── 1. Leggi immobile dal DB (autoritativo) ────────────────────────────────
    const immobileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/immobili?id=eq.${immobile.id}&select=id,indirizzo,zona,prezzo,venditore_user_id`,
      { headers: sbHeaders }
    );
    const immobiliArr = await immobileRes.json();
    const immobileDb  = Array.isArray(immobiliArr) ? immobiliArr[0] : null;

    if (!immobileDb) {
      return res.status(404).json({ error: "Immobile non trovato" });
    }

    const indirizzoVero = immobileDb.indirizzo;
    const prezzoVero    = Number(immobileDb.prezzo);

    // Calcoli delta sul prezzo letto da DB, non da frontend
    const diff   = Number(importo) - prezzoVero;
    const perc   = Math.round(Math.abs(diff) / prezzoVero * 100);
    const colore = diff >= 0 ? '#2d6a4f' : '#d93025';
    const label  = diff >= 0 ? `+${perc}% sopra prezzo` : `${perc}% sotto prezzo`;

    // ── 2. Leggi nome compratore + email/nome venditore da auth.users ──────────
    let compratore_nome = null;
    if (user_id) {
      try {
        const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user_id}`, { headers: sbHeaders });
        if (r.ok) {
          const u = await r.json();
          compratore_nome = u?.user_metadata?.full_name || null;
        }
      } catch (e) {
        console.error("Errore lettura compratore:", e);
      }
    }

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

    // ── 3. Salva proposta su Supabase ──────────────────────────────────────────
    const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/proposte`, {
      method: "POST",
      headers: { ...sbHeaders, "Prefer": "return=representation" },
      body: JSON.stringify({
        immobile_id:        immobileDb.id,
        compratore_email:   user_email,
        compratore_nome:    compratore_nome,
        compratore_user_id: user_id || null,
        importo:            Number(importo),
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

    // ── 4. Email B — notifica al venditore (e a info@) ─────────────────────────
    const destinatariB = [{ email: 'info@realaistate.ai', name: 'RealAIstate' }];
    if (venditore_email && venditore_email !== 'info@realaistate.ai') {
      destinatariB.push({ email: venditore_email, name: venditore_nome || 'Venditore' });
    }

    const compratoreVisuale = compratore_nome
      ? `${compratore_nome} · ${user_email}`
      : user_email;

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
            ${indirizzoVero}
          </p>

          <div style="background:#141414;border:1px solid rgba(247,245,240,0.08);border-radius:3px;padding:22px;margin-bottom:24px;">
            <div style="display:block;margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Compratore</div>
              <div style="font-size:15px;color:#f7f5f0;">${compratoreVisuale}</div>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Importo offerto</div>
              <div style="font-size:22px;font-weight:700;color:#f7f5f0;">€${Number(importo).toLocaleString('it-IT')}</div>
              <div style="font-size:13px;color:${colore};font-weight:600;margin-top:4px;">${label} (€${diff >= 0 ? '+' : ''}${diff.toLocaleString('it-IT')})</div>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Data rogito proposta</div>
              <div style="font-size:14px;color:#f7f5f0;">${data_rogito || 'Da concordare'}</div>
            </div>
            ${condizioni ? `
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Condizioni</div>
              <div style="font-size:14px;color:rgba(247,245,240,0.8);font-style:italic;">${condizioni}</div>
            </div>` : ''}
            ${note ? `
            <div>
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Note</div>
              <div style="font-size:14px;color:rgba(247,245,240,0.8);font-style:italic;">${note}</div>
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

    // ── 5. Email A — conferma al compratore ────────────────────────────────────
    const compratoreNomeVisuale = compratore_nome ? compratore_nome.split(' ')[0] : '';

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
            La tua proposta per <strong style="color:rgba(247,245,240,0.8);">${indirizzoVero}</strong> è stata inviata al venditore.
          </p>

          <div style="background:#141414;border:1px solid rgba(247,245,240,0.08);border-radius:3px;padding:22px;margin-bottom:24px;">
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Importo proposto</div>
              <div style="font-size:22px;font-weight:700;color:#f7f5f0;">€${Number(importo).toLocaleString('it-IT')}</div>
            </div>
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Data rogito proposta</div>
              <div style="font-size:14px;color:#f7f5f0;">${data_rogito || 'Da concordare'}</div>
            </div>
            ${condizioni ? `
            <div>
              <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,245,240,0.4);margin-bottom:4px;">Condizioni</div>
              <div style="font-size:14px;color:rgba(247,245,240,0.8);font-style:italic;">${condizioni}</div>
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
        to: [{ email: user_email, name: compratore_nome || user_email }],
        subject: `Proposta inviata — ${indirizzoVero}`,
        htmlContent: emailCompratoreHtml,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}