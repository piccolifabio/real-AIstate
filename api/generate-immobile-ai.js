// api/generate-immobile-ai.js
// Genera ai_summary, punti_forza, domande_consigliate per un immobile
// e li scrive in DB (caching). Idempotente: chiamarla più volte sovrascrive.
//
// Trigger: chiamata manuale per ora (es. via curl/Postman dopo aver pubblicato
// un immobile da /vendi). In futuro: chiamata automatica al passaggio
// status='draft' → 'published'.
//
// Importante: NON calcola Fair Price Score, NON cita range OMI specifici.
// Genera solo contenuto descrittivo basato sui dati dell'immobile.
// Il pricing reale è fatto manualmente dal team con dati OMI ufficiali.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { immobile_id } = req.body || {};
  if (!immobile_id) return res.status(400).json({ error: "immobile_id mancante" });

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  if (!SUPABASE_URL || !SUPABASE_SECRET) {
    return res.status(500).json({ error: "Supabase env mancante" });
  }
  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: "Anthropic env mancante" });
  }

  // 1. Leggi l'immobile dal DB (con service_role per bypassare RLS)
  let immobile;
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/immobili?id=eq.${immobile_id}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SECRET,
          Authorization: `Bearer ${SUPABASE_SECRET}`,
        },
      }
    );
    const rows = await r.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: "Immobile non trovato" });
    }
    immobile = rows[0];
  } catch (err) {
    return res.status(500).json({ error: "Errore lettura immobile", detail: String(err) });
  }

  // 2. Prepara il prompt per Claude
  const datiImmobile = {
    titolo: immobile.titolo,
    indirizzo: immobile.indirizzo,
    zona: immobile.zona,
    prezzo: immobile.prezzo,
    superficie_catastale: immobile.superficie,
    superficie_calpestabile: immobile.superficie_calpestabile,
    locali: immobile.vani,
    bagni: immobile.bagni,
    piano: immobile.piano,
    ascensore: immobile.ascensore,
    garage: immobile.garage,
    garage_mq: immobile.garage_mq,
    terrazzo: immobile.terrazzo,
    giardino_condominiale: immobile.giardino_condominiale,
    classe_energetica: immobile.classe_energetica,
    anno_costruzione: immobile.anno_costruzione,
    anno_ristrutturazione: immobile.anno_ristrutturazione,
    riscaldamento: immobile.riscaldamento,
    acqua_calda: immobile.acqua_calda,
    spese_condominio: immobile.spese_condominio,
    stato_immobile: immobile.stato_immobile,
    descrizione: immobile.descrizione,
    tipologia: immobile.tipologia,
  };

  const systemPrompt = `Sei un agente AI di RealAIstate, piattaforma immobiliare che disintermedia l'agenzia.
Il tuo compito è generare contenuto descrittivo per la scheda di un immobile.

REGOLE INDEROGABILI:
- NON calcolare il Fair Price Score, NON valutare se il prezzo è giusto, NON citare range OMI o €/mq di mercato. Quello è compito di un agente separato che lavora sui dati OMI ufficiali.
- Resta strettamente descrittivo: racconta cosa offre l'immobile, NON giudicare il prezzo.
- Italiano impeccabile. Tono asciutto, fattuale, leggermente caldo. Mai frasi fatte da agenzia ("imperdibile", "occasione unica", "splendido").
- Lunghezza ai_summary: 80-130 parole.
- 4-6 punti di forza, ognuno una frase concreta basata sui dati forniti. Mai vaghi tipo "ottima posizione".
- 3-5 domande consigliate per il compratore in vista della visita. Pratiche, specifiche all'immobile (condominio, ristrutturazione, impianti, spese), non generiche.

OUTPUT: SOLO un oggetto JSON valido con questa shape, senza markdown, senza commenti, senza altro testo:
{
  "ai_summary": "stringa",
  "punti_forza": ["stringa", "stringa", ...],
  "domande_consigliate": ["stringa", "stringa", ...]
}`;

  const userPrompt = `Dati dell'immobile da analizzare:

${JSON.stringify(datiImmobile, null, 2)}

Genera ai_summary, punti_forza, domande_consigliate seguendo le regole.`;

  // 3. Chiama Claude
  let aiPayload;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!r.ok) {
      const errBody = await r.text();
      return res.status(500).json({ error: "Anthropic API error", detail: errBody });
    }

    const data = await r.json();
    const text = data?.content?.[0]?.text?.trim();
    if (!text) {
      return res.status(500).json({ error: "Risposta AI vuota" });
    }

    // Parse difensivo: a volte il modello include backtick anche con istruzioni esplicite
    const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    aiPayload = JSON.parse(cleaned);

    if (!aiPayload.ai_summary || !Array.isArray(aiPayload.punti_forza) || !Array.isArray(aiPayload.domande_consigliate)) {
      return res.status(500).json({ error: "Shape AI invalida", payload: aiPayload });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore generazione AI", detail: String(err) });
  }

  // 4. Salva in DB
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/immobili?id=eq.${immobile_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SECRET,
          Authorization: `Bearer ${SUPABASE_SECRET}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          ai_summary: aiPayload.ai_summary,
          punti_forza: aiPayload.punti_forza,
          domande_consigliate: aiPayload.domande_consigliate,
          ai_generated_at: new Date().toISOString(),
        }),
      }
    );
    if (!r.ok) {
      const errBody = await r.text();
      return res.status(500).json({ error: "Errore scrittura DB", detail: errBody });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore scrittura DB", detail: String(err) });
  }

  return res.status(200).json({
    ok: true,
    immobile_id,
    ai_summary: aiPayload.ai_summary,
    punti_forza: aiPayload.punti_forza,
    domande_consigliate: aiPayload.domande_consigliate,
  });
}