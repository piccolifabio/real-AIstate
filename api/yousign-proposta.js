// api/yousign-proposta.js
// Chiamata dal bottone "Accetta proposta" in VenditoreDashboard.jsx
// Flusso: riceve proposta_id → legge proposta da Supabase →
//         crea signature request Yousign con 2 firmatari →
//         aggiorna status + yousign_id su Supabase → risponde al frontend

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY // service role per operazioni server-side
)

const YOUSIGN_API   = 'https://api-sandbox.yousign.app/v3'
const YOUSIGN_KEY   = process.env.YOUSIGN_API_KEY
const TEMPLATE_ID   = '71505658-23d8-4d5a-9ff1-2e221294e929'

// Email venditore fissa per ora — da spostare su DB quando multi-immobile
const VENDITORE_EMAIL = 'info@realaistate.ai'
const VENDITORE_NOME  = 'RealAIstate (venditore)'

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

  try {
    // 2. Crea signature request su Yousign dal template
    const signatureRes = await fetch(`${YOUSIGN_API}/signature_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUSIGN_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Proposta acquisto – ${proposta.compratore_email} – ${new Date().toLocaleDateString('it-IT')}`,
        delivery_mode: 'email',
        timezone: 'Europe/Rome',
        signers: [
          {
            info: {
              first_name: 'Compratore',
              last_name:  '',
              email:      proposta.compratore_email,
            },
            signature_level: 'electronic_signature',
            signature_authentication_mode: 'no_otp',
          },
          {
            info: {
              first_name: 'RealAIstate',
              last_name:  'Venditore',
              email:      VENDITORE_EMAIL,
            },
            signature_level: 'electronic_signature',
            signature_authentication_mode: 'no_otp',
          },
        ],
        documents: [
          {
            nature: 'signable_document',
            template_id: TEMPLATE_ID,
          }
        ],
      }),
    })

    if (!signatureRes.ok) {
      const errBody = await signatureRes.text()
      console.error('Yousign error:', errBody)
      return res.status(502).json({ error: 'Errore creazione firma Yousign', detail: errBody })
    }

    const signatureData = await signatureRes.json()
    const yousign_id = signatureData.id

    // 3. Attiva la signature request (la mette in stato "ongoing" e invia le email)
    const activateRes = await fetch(`${YOUSIGN_API}/signature_requests/${yousign_id}/activate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${YOUSIGN_KEY}` },
    })

    if (!activateRes.ok) {
      const errBody = await activateRes.text()
      console.error('Yousign activate error:', errBody)
      // Non blocchiamo — aggiorniamo Supabase comunque con status accepted
    }

    // 4. Aggiorna proposta su Supabase
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