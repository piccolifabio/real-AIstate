// api/yousign-proposta.js
// Chiamata dal bottone "Accetta proposta" in VenditoreDashboard.jsx
// Sicurezza:
//   - Richiede header Authorization: Bearer <jwt> dell'utente loggato
//   - Verifica che l'utente sia il venditore_user_id dell'immobile collegato alla proposta
// Flusso:
//   1. Valida JWT, ottieni user
//   2. Legge proposta + immobile da DB
//   3. Verifica ownership (user.id === immobile.venditore_user_id)
//   4. Legge dati venditore + compratore
//   5. Crea signature request Yousign + activate
//   6. Aggiorna status proposta su Supabase

import { createClient } from '@supabase/supabase-js'
import { handleCors } from './_lib/cors.js'

// Client service role per operazioni server-side (bypass RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

const YOUSIGN_API = 'https://api-sandbox.yousign.app/v3'
const YOUSIGN_KEY = process.env.YOUSIGN_API_KEY
const TEMPLATE_ID = '71505658-23d8-4d5a-9ff1-2e221294e929'

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 1. Valida JWT chiamante
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' })
  }
  const token = authHeader.slice(7)

  const { data: { user: caller }, error: errAuth } = await supabase.auth.getUser(token)
  if (errAuth || !caller) {
    return res.status(401).json({ error: 'Token non valido o sessione scaduta' })
  }

  const { proposta_id } = req.body
  if (!proposta_id) {
    return res.status(400).json({ error: 'proposta_id mancante' })
  }

  // 2. Leggi proposta da Supabase
  const { data: proposta, error: errProposta } = await supabase
    .from('proposte')
    .select('*')
    .eq('id', proposta_id)
    .single()

  if (errProposta || !proposta) {
    return res.status(404).json({ error: 'Proposta non trovata' })
  }

  if (proposta.status !== 'pending') {
    return res.status(400).json({ error: `Proposta già in stato: ${proposta.status}` })
  }

  // 3. Leggi immobile collegato
  const { data: immobile, error: errImmobile } = await supabase
    .from('immobili')
    .select('id, indirizzo, venditore_user_id')
    .eq('id', proposta.immobile_id)
    .single()

  if (errImmobile || !immobile) {
    return res.status(404).json({ error: 'Immobile non trovato' })
  }

  if (!immobile.venditore_user_id) {
    return res.status(400).json({ error: 'Immobile senza venditore associato' })
  }

  // 4. Verifica ownership: il chiamante deve essere il venditore dell'immobile
  if (caller.id !== immobile.venditore_user_id) {
    return res.status(403).json({ error: 'Non sei autorizzato ad accettare questa proposta' })
  }

  // 5. Leggi dati venditore (è il caller, ma teniamo logica esplicita)
  const venditore_email = caller.email
  const venditore_nome = caller.user_metadata?.full_name || 'Venditore'

  // 6. Split nome / cognome per Yousign
  const compratoreParts = (proposta.compratore_nome || 'Compratore').trim().split(/\s+/)
  const compratoreFirst = compratoreParts[0]
  const compratoreLast = compratoreParts.slice(1).join(' ') || '—'

  const venditoreParts = venditore_nome.trim().split(/\s+/)
  const venditoreFirst = venditoreParts[0]
  const venditoreLast = venditoreParts.slice(1).join(' ') || '—'

  try {
    // 7. Crea signature request Yousign dal template
    const signatureRes = await fetch(`${YOUSIGN_API}/signature_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUSIGN_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Proposta acquisto – ${immobile.indirizzo} – ${new Date().toLocaleDateString('it-IT')}`,
        delivery_mode: 'email',
        timezone: 'Europe/Rome',
        template_id: TEMPLATE_ID,
        template_placeholders: {
          signers: [
            {
              label: 'Compratore',
              info: {
                first_name: compratoreFirst,
                last_name:  compratoreLast,
                email:      proposta.compratore_email,
                locale:     'it',
              },
            },
            {
              label: 'Venditore',
              info: {
                first_name: venditoreFirst,
                last_name:  venditoreLast,
                email:      venditore_email,
                locale:     'it',
              },
            },
          ],
        },
      }),
    })

    if (!signatureRes.ok) {
      const errBody = await signatureRes.text()
      console.error('Yousign error:', errBody)
      return res.status(502).json({ error: 'Errore creazione firma Yousign', detail: errBody })
    }

    const signatureData = await signatureRes.json()
    const yousign_id = signatureData.id

    // 8. Attiva signature request → manda email firmatari
    const activateRes = await fetch(`${YOUSIGN_API}/signature_requests/${yousign_id}/activate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${YOUSIGN_KEY}` },
    })

    if (!activateRes.ok) {
      const errBody = await activateRes.text()
      console.error('Yousign activate error:', errBody)
      // non blocchiamo
    }

    // 9. Aggiorna proposta su Supabase
    const { error: errUpdate } = await supabase
      .from('proposte')
      .update({ status: 'accepted', yousign_id })
      .eq('id', proposta_id)

    if (errUpdate) {
      console.error('Supabase update error:', errUpdate)
    }

    return res.status(200).json({
      ok: true,
      yousign_id,
      message: 'Proposta accettata. Email di firma inviate.'
    })

  } catch (err) {
    console.error('yousign-proposta error:', err)
    return res.status(500).json({ error: err.message || 'Errore interno' })
  }
}