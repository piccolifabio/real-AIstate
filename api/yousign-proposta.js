// api/yousign-proposta.js
// Chiamata dal bottone "Accetta proposta" in VenditoreDashboard.jsx
// Flusso: riceve proposta_id → legge proposta + immobile + venditore da Supabase →
//         crea signature request Yousign con 2 firmatari (nomi e email dinamici) →
//         aggiorna status + yousign_id su Supabase → risponde al frontend

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY // service role per operazioni server-side
)

const YOUSIGN_API   = 'https://api-sandbox.yousign.app/v3'
const YOUSIGN_KEY   = process.env.YOUSIGN_API_KEY
const TEMPLATE_ID   = '71505658-23d8-4d5a-9ff1-2e221294e929'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { proposta_id } = req.body

  if (!proposta_id) {
    return res.status(400).json({ error: 'proposta_id mancante' })
  }

  // 1. Leggi proposta da Supabase
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

  // 2. Leggi l'immobile collegato per ottenere il venditore_user_id
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

  // 3. Leggi i dati del venditore (email + nome) da auth.users via admin API
  const { data: venditoreUserData, error: errVenditore } =
    await supabase.auth.admin.getUserById(immobile.venditore_user_id)

  if (errVenditore || !venditoreUserData?.user) {
    return res.status(404).json({ error: 'Utente venditore non trovato' })
  }

  const venditore = venditoreUserData.user
  const venditore_email = venditore.email
  const venditore_nome  = venditore.user_metadata?.full_name || 'Venditore'

  // 4. Split nome / cognome per Yousign (richiede first_name e last_name separati)
  const compratoreParts = (proposta.compratore_nome || 'Compratore').trim().split(/\s+/)
  const compratoreFirst = compratoreParts[0]
  const compratoreLast  = compratoreParts.slice(1).join(' ') || '—'

  const venditoreParts = venditore_nome.trim().split(/\s+/)
  const venditoreFirst = venditoreParts[0]
  const venditoreLast  = venditoreParts.slice(1).join(' ') || '—'

  try {
    // 5. Crea signature request su Yousign dal template
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

    // 6. Attiva la signature request (la mette in stato "ongoing" e invia le email)
    const activateRes = await fetch(`${YOUSIGN_API}/signature_requests/${yousign_id}/activate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${YOUSIGN_KEY}` },
    })

    if (!activateRes.ok) {
      const errBody = await activateRes.text()
      console.error('Yousign activate error:', errBody)
      // Non blocchiamo — aggiorniamo Supabase comunque con status accepted
    }

    // 7. Aggiorna proposta su Supabase
    const { error: errUpdate } = await supabase
      .from('proposte')
      .update({
        status:     'accepted',
        yousign_id: yousign_id,
      })
      .eq('id', proposta_id)

    if (errUpdate) {
      console.error('Supabase update error:', errUpdate)
      // Yousign è già partito — logghiamo ma non blocchiamo il frontend
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