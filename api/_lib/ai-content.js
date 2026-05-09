// api/_lib/ai-content.js
// Logica core di generazione contenuto AI per un immobile (ai_summary,
// punti_forza, domande_consigliate). Riutilizzata da:
//   - generate-immobile-ai.js     → handler HTTP esposto al venditore/admin
//   - admin/[op].js (op=pubblica) → al passaggio pending_review → published
//
// Il chiamante è responsabile di auth + ownership check. Questo helper si
// limita a chiamare Anthropic e a salvare in DB.

const SYSTEM_PROMPT = `Sei un agente AI di RealAIstate, piattaforma immobiliare che disintermedia l'agenzia.
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

export async function generateAndSaveImmobileAI(immobile) {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!SUPABASE_URL || !SUPABASE_SECRET) throw new Error("Supabase env mancante");
  if (!ANTHROPIC_KEY) throw new Error("Anthropic env mancante");
  if (!immobile?.id) throw new Error("immobile.id mancante");

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

  const userPrompt = `Dati dell'immobile da analizzare:

${JSON.stringify(datiImmobile, null, 2)}

Genera ai_summary, punti_forza, domande_consigliate seguendo le regole.`;

  const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!aiRes.ok) {
    const errBody = await aiRes.text();
    throw new Error(`Anthropic API error: ${errBody}`);
  }

  const aiData = await aiRes.json();
  const text = aiData?.content?.[0]?.text?.trim();
  if (!text) throw new Error("Risposta AI vuota");

  const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  const payload = JSON.parse(cleaned);

  if (!payload.ai_summary || !Array.isArray(payload.punti_forza) || !Array.isArray(payload.domande_consigliate)) {
    throw new Error("Shape AI invalida");
  }

  const saveRes = await fetch(
    `${SUPABASE_URL}/rest/v1/immobili?id=eq.${encodeURIComponent(immobile.id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SECRET,
        Authorization: `Bearer ${SUPABASE_SECRET}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ai_summary: payload.ai_summary,
        punti_forza: payload.punti_forza,
        domande_consigliate: payload.domande_consigliate,
        ai_generated_at: new Date().toISOString(),
      }),
    }
  );

  if (!saveRes.ok) {
    const errBody = await saveRes.text();
    throw new Error(`Errore scrittura DB: ${errBody}`);
  }

  return payload;
}
