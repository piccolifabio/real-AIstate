export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages, immobile } = req.body;

  const system = `Sei l'assistente AI di RealAIstate specializzato nella verifica della capacità d'acquisto immobiliare.

L'utente sta valutando questo immobile:
- Indirizzo: ${immobile?.indirizzo || "Via Alfonso Capecelatro 51, Milano"}
- Prezzo: €${immobile?.prezzo?.toLocaleString("it-IT") || "400.000"}
- Zona: ${immobile?.zona || "Milano San Siro"}

Il tuo compito è fare UNA domanda alla volta per capire se l'utente può permettersi questo immobile. Le domande da fare in ordine sono:
1. Reddito netto mensile (singolo o coppia)
2. Risparmi disponibili per l'anticipo (di solito 20% del valore)
3. Rate di finanziamenti esistenti (mutui, prestiti, auto)
4. Tipo di contratto lavorativo (dipendente/autonomo/altro)
5. Quante persone contribuiscono al reddito familiare

Dopo aver raccolto tutte le informazioni, dai un verdetto chiaro:
- Se può permetterselo: spiega perché, stima la rata mensile del mutuo (usa formula standard: mutuo = prezzo - anticipo, durata 20-25 anni, tasso ~3.5%), e di' che RealAIstate lo metterà in contatto con le banche più adeguate alla sua situazione.
- Se non può permetterselo ora: sii onesto ma costruttivo, spiega cosa manca e cosa potrebbe fare.

Regole:
- Fai UNA sola domanda per messaggio
- Sii diretto, amichevole, senza giudizi
- Usa il tu
- Rispondi sempre in italiano
- Tieni le risposte brevi e chiare
- Non fare mai più di una domanda per volta
- Quando hai tutte le informazioni, dai il verdetto completo`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 400,
        system,
        messages: messages || [],
      }),
    });

    const data = await response.json();
    const testo = data.content?.[0]?.text || "Qualcosa è andato storto. Riprova.";
    res.status(200).json({ risposta: testo });
  } catch {
    res.status(500).json({ risposta: "Errore del server. Riprova tra un momento." });
  }
}
