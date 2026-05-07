# RealAIstate — Stato del progetto
Aggiornato: 07/05/2026 notte

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email transazionali: Brevo (SMTP collegato a Supabase Auth + email custom)
- Email casella business: Namecheap Private Email (info@realaistate.ai)
- AI: Anthropic API (Claude Sonnet 4.5)
- Firma digitale: Yousign — sandbox attiva, production trial Pro 12gg ma API production bloccate (in attesa risposta commerciale)
- Repo: github.com/piccolifabio/real-AIstate
- Sito live: realaistate.ai

## ⏳ In attesa
- **Risposta Yousign** (email inviata 07/05 mattina da info@realaistate.ai al
  contatto commerciale) — chiediamo accesso API production durante trial Pro
  per verificare se delivery email funziona in production come dovrebbe.

## Completato

### Foundation ✅
- Landing page completa con tutte le sezioni
- Fair Price Score su dati OMI
- Chat AI per immobile (api/chat-immobile.js)
- Verifica capacità d'acquisto (api/chat-affordability.js)
- Form venditore completo (api/vendi-submit.js)
- Marchio UIBM + EUIPO depositato (23 aprile 2026)
- Instagram @realaistate.ai attivo
- Blog live con 7 articoli

### Settimana 1 MVP ✅ — completata 04/05/2026
- [x] Supabase Auth, navbar dinamica, CSS globale ✅
- [x] Pagine protette + /account ✅
- [x] Documenti con controllo accesso ✅
- [x] Chat con storico persistente su Supabase ✅
- [x] Email conferma registrazione via Brevo ✅

### Settimana 2 ✅ — completata 05/05/2026
- [x] Refactor App.jsx: HomePage, ScusePage, Privacy, Termini separati ✅
- [x] Hover viola logo navbar su tutte le pagine ✅
- [x] Navbar mobile fix — bottone porta a /login ✅
- [x] Task 5: Notifiche email messaggi chat ✅
- [x] Task 6: Dashboard venditore /venditore ✅

### Settimana 3 ✅ — completata 06/05/2026
- [x] Task 8: Form proposta d'acquisto con modal e validazione ✅
- [x] Template proposta HTML completo con clausole legali, dati catastali, pertinenze ✅
- [x] Template proposta visibile nella sezione documenti scheda immobile ✅
- [x] Proposte salvate su Supabase (tabella proposte) ✅
- [x] Email notifica a info@ con dettagli proposta e delta prezzo ✅
- [x] Task 9: Integrazione Yousign — base flow funzionante in sandbox ✅
- [x] Fix scroll pagina immobile — si apre in cima ✅
- [x] Task 10: Bottone "Accetta proposta" in dashboard venditore ✅
- [x] Task 11: Refactor architetturale + sicurezza + email transazionali ✅

### Settimana 4 ✅ — completata 07/05/2026
- [x] Setup infrastruttura email business ✅
  - Acquistato Namecheap Private Email Pro (€25,49/anno primo anno, poi €35)
  - Casella info@realaistate.ai autonoma su privateemail.com (10GB)
  - 2 caselle aggiuntive disponibili (20GB residui da allocare)
  - DNS configurati: SPF (privateemail + brevo), DKIM, DMARC
  - Mail Settings Namecheap: Email Forwarding → Private Email
  - Verificato: Brevo continua a inviare correttamente (test E2E proposta superato)
  - Verificato: invio da info@ a Hotmail funzionante (post-greylisting iniziale)
- [x] Email a Yousign per richiedere API production durante trial ✅
- [x] llms.txt aggiornato con feature MVP attuali ✅
- [x] UX double-check email in signup: campo "Conferma email" in mode register
      con validazione case-insensitive, paste disabilitato, reset su switch
      login↔register ✅
- [x] Form "Vendi casa" reale ✅
  - Schema `immobili` esteso con campi MVP (tipologia, piano, vani/camere/bagni,
    superficie_calpestabile, anno_costruzione, classe_energetica, stato_immobile,
    foto jsonb, descrizione, status enum draft/published/sold/archived)
  - Fix `id` senza default → sequence `immobili_id_seq` agganciata
  - RLS `immobili` ripulite: 4 policy pulite (public_read su published, owner_read,
    owner_insert, owner_update). Rimosse legacy `Immobili pubblici in lettura`
    (USING true, bug sicurezza) e `Venditore modifica suo immobile` (duplicata)
  - Auth gate su `/vendi`: utente sloggato vede pre-onboarding con CTA login,
    loggato vede form 5 step
  - `api/vendi-submit.js` ora estrae JWT, identifica utente via `auth/v1/user`,
    salva sia in `venditori` (lead completo) sia in `immobili` (draft) con
    `venditore_user_id` corretto. Ritorna `immobile_id` al client.
  - Success screen porta a `/venditore` (era home)

### Settimana 5 ✅ — completata 07/05/2026
- [x] Refactor Immobile.jsx — completo end-to-end ✅
  - Branch `feat/immobile-dinamico` (creato + pushato + merged su main)
  - `Immobile.jsx` legge `id` dall'URL via `useParams`, fetch immobile da
    Supabase con error handling
  - Pattern `const immobile = { ...IMMOBILE_FALLBACK, ...dbData }`:
    DB sovrascrive il fallback dove disponibile, fallback copre i campi
    non ancora in tabella (foto path, comparabili, documenti)
  - `AiChat` componente refactored: riceve `immobileId`/`immobile` come prop
    invece di referenziare la variabile globale (rimossa)
  - Descrizione: era hardcoded in 3 `<p>`, ora legge `immobile.descrizione`
    dal DB e splitta su righe vuote in paragrafi (`split(/\n\s*\n/)`)
- [x] Schema `immobili` esteso con 14 colonne nuove ✅
  - Descrittive: `titolo`, `terrazzo`, `garage`, `garage_mq`, `ascensore`,
    `giardino_condominiale`, `riscaldamento`, `acqua_calda`,
    `spese_condominio`, `anno_ristrutturazione`, `disponibilita_rogito`
  - AI cachata: `ai_summary` (text), `punti_forza` (jsonb),
    `domande_consigliate` (jsonb), `ai_generated_at` (timestamptz)
- [x] Capecelatro (id=1) popolato completamente in DB con i valori che
  prima erano nel fallback hardcoded (descrittivi + AI summary OMI calibrato).
  Resta in `published`, scheda visibile pubblicamente.
- [x] Inserito immobile id=3 (Via Pinturicchio 14, Città Studi, €285k) per test
  end-to-end della function AI. Passato a `status='draft'` post-test, non
  visibile pubblicamente ma recuperabile.
- [x] Function `api/generate-immobile-ai.js` ✅
  - POST `{ immobile_id }` → legge da DB, prompt strutturato a Claude
    Sonnet 4.5 (`claude-sonnet-4-5`), parsing JSON, UPDATE su `immobili`
    con i 3 campi AI + `ai_generated_at`
  - Bypassa RLS via `SUPABASE_SECRET_KEY` (service_role) sia in lettura
    che in scrittura
  - Pattern opzione C: AI cachato (generato una volta, riusato). Niente
    chiamate AI all'apertura della scheda — costo AI una tantum,
    zero latenza utente
  - Regole prompt: NO Fair Price Score, NO range OMI, NO €/mq di mercato.
    Solo contenuto descrittivo basato sui dati DB. Pricing/OMI è compito
    di un agente separato, da costruire in futuro
  - Trigger oggi: chiamata manuale via curl. Trigger futuro: automatico
    al passaggio status='draft' → 'published' di un immobile
- [x] Test end-to-end su Pinturicchio (id=3): function chiamata via curl
  sul preview deployment, generato AI summary + 5 punti_forza + 5 domande
  con qualità soddisfacente. Bug minor osservato: piano "4° su 6"
  letto come "terzo piano" — registrato come miglioramento prompt.
  - [x] Fix prompt `api/chat-immobile.js` ✅
  - Bug osservato live: AI chat su /compra/1 rispondeva "non ho questa
    informazione" su domande tipo balcone, terrazzo, garage_mq,
    riscaldamento — anche se i dati erano in DB e nel payload inviato
  - Causa: prompt server-side `immobileCtx` includeva solo 6 campi
    legacy. Tutti i nuovi campi del refactor non venivano mai
    "raccontati" all'AI nel system prompt
  - Fix: esteso `immobileCtx` a 23+ campi strutturati + descrizione
    completa in prosa. Aggiunta etichetta "Terrazzo/balcone" per
    forzare il sinonimo. Helper `sn()` per null safety, `yn()` per
    boolean → "sì"/"no" leggibili
  - Pattern lesson: ogni volta che si estende lo schema dati, verificare
    che TUTTI i punti di consumo (chat AI, generate-immobile-ai,
    eventuali altri prompt) ricevano i campi nuovi nel template prompt

## File chiave
- src/HomePage.jsx — home page con Nav e CTA
- src/ScusePage.jsx — pagina scuse separata
- src/Privacy.jsx — privacy policy
- src/Termini.jsx — termini di servizio
- src/VenditoreDashboard.jsx — dashboard venditore (gated, multi-immobile-ready)
- src/AccountPage.jsx — account con nome modificabile + sezione "Le mie proposte"
- src/Immobile.jsx — scheda immobile DB-driven (campi base, amenities,
  AI cachato, descrizione tutti da DB con fallback hardcoded). Foto
  ancora hardcoded da Storage `immobili/1/pub` (vedi post-MVP)
- src/LoginPage.jsx — login/registrazione (con campo nome + Conferma email in signup)
- src/VendiForm.jsx — form 5 step con auth gate, salva immobile draft + lead venditore
- src/AuthContext.jsx — gestione sessione + signUp con full_name + updateFullName
- src/supabase.js — connessione Supabase
- src/ProtectedRoute.jsx — route protetta
- src/index.css — CSS globale
- src/blog/articoli.js — contenuto articoli
- src/BlogPage.jsx — lista articoli (aggiungere in cima per ordine cronologico)
- api/chat-immobile.js — chat AI con notifiche email
- api/proposta-submit.js — salvataggio + email A (compratore) + email B (info@ + venditore)
- api/yousign-proposta.js — firma digitale FEA via Yousign (con JWT auth + ownership check + ordered_signers)
- api/vendi-submit.js — form venditore: scrive in venditori + immobili (draft), JWT-authenticated
- api/generate-immobile-ai.js — serverless function che genera ai_summary
  + punti_forza + domande_consigliate via Claude e cacha in DB. Chiamata
  manualmente per ora, trigger automatico in futuro al "Pubblica"
- public/proposta_acquisto_template.html — template proposta visualizzabile e caricato su Yousign
- public/llms.txt — descrittore per AI agent (aggiornato 07/05)

## Supabase tabelle
- chat_messages — messaggi chat (user_id, immobile_id, sessione_id, mittente, testo)
- proposte — proposte d'acquisto (status: pending/accepted/rejected, yousign_id, compratore_nome)
- immobili — id (sequence), indirizzo, zona, prezzo, superficie, tipologia, piano,
  superficie_calpestabile, vani, camere, bagni, anno_costruzione, classe_energetica,
  stato_immobile, foto (jsonb), descrizione, status (draft/published/sold/archived),
  venditore_user_id (FK auth.users), created_at, **+ campi sessione 5**:
  titolo, terrazzo, garage, garage_mq, ascensore, giardino_condominiale,
  riscaldamento, acqua_calda, spese_condominio, anno_ristrutturazione,
  disponibilita_rogito, ai_summary, punti_forza (jsonb), domande_consigliate
  (jsonb), ai_generated_at. RLS attive con 4 policy.
- scuse — scuse dalla pagina /scuse
- venditori — form venditori (lead completo onboarding, ~30 campi)

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign — sandbox per test, switch a production al primo angel committed o transazione reale
- Non loggati: prezzo, foto, descrizione, Fair Price Score + lucchetti documenti
- Loggati: documenti pubblici + chat con storico + proposta d'acquisto
- Documenti sensibili: su richiesta
- info@realaistate.ai: ora casella autonoma Private Email — usata per
  comunicazioni operative manuali (es. trattative B2B con Yousign, partner)
  oltre che destinatario notifiche prodotto
- email venditore reale (auth.users): documenti che richiedono azione personale (firma Yousign)
- Fee: €2.000 compratore + €499 venditore — dovute solo a rogito completato
- MAI riferimento a intermediazione immobiliare nel documento proposta
- Blog: aggiungere in cima ad articoli.js e BlogPage.jsx
- SRL: da aprire al primo commitment angel
- Policy RLS hardcoded su email: VIETATE. Sempre via venditore_user_id ↔ auth.uid().
- DMARC policy: per ora `p=none` (monitoring). Stringere a `quarantine` poi
  `reject` solo dopo settimane di osservazione che SPF+DKIM funzionano.
- **Separazione `venditori` vs `immobili`**: `venditori` = lead onboarding completo
  (~30 campi: pertinenze, riscaldamento, ecc.), `immobili` = ciò che serve a
  scheda pubblica e relazioni con proposte/chat. Vivono in parallelo, JOIN se servono.
- **Status immobile**: nuovi inserimenti vanno in `draft`. Per pubblicare oggi
  serve UPDATE manuale a `published` su Supabase (post-validazione Fabio).
  Bottone "Pubblica" in dashboard venditore = task aperto.
- **AI cachato per scheda immobile** (decisione 07/05): i 3 campi AI
  (`ai_summary`, `punti_forza`, `domande_consigliate`) sono **generati una
  volta** alla pubblicazione e salvati in DB, NON generati runtime.
  Vantaggi: nessuna latenza all'apertura, costo AI una tantum (~€0.02/immobile),
  rigenerabile via re-call della function. La function AI **non valuta
  prezzo**: niente Fair Price Score, niente range OMI, niente €/mq.
  Pattern multi-agent futuro: descriptor (oggi) + pricer-agent (OMI) +
  legal-agent (documenti) + comps-agent (comparabili).
- **Workflow pubblicazione immobile** (futuro): venditore compila /vendi
  → immobile in `draft`. Backoffice: scaricare dati OMI ufficiali,
  calcolare Fair Price Score manualmente, validare campi → click
  "Pubblica" → trigger automatico `api/generate-immobile-ai` →
  status='published'. Per ora il passaggio draft→published è manuale via SQL.

## Memo tecnici (gotchas già imparati — non ripetere errori)
- **Yousign `template_placeholders.signers[].label`**: case-sensitive, deve
  matchare ESATTAMENTE i placeholder signer label nel template UI Yousign.
  NON usare `role`, `role_name`, `roleName` — solo `label`.
- **Yousign documents riutilizzo**: un `document_id` da `POST /documents` è
  legato a UNA sola signature request. Per riusarlo serve nuovo upload.
  Il `template_id` invece è riutilizzabile N volte (Yousign clona internamente).
- **Yousign sandbox: delivery email instabile** (06/05/2026). In production
  trial il problema potrebbe non esistere ma API production bloccate.
- **Vercel + html-pdf-node**: non gira (Puppeteer/Chromium ~250MB > 50MB).
  Usare API esterna tipo PDFShift quando serve PDF dinamico.
- **PostgREST schema cache**: dopo ALTER TABLE / ADD CONSTRAINT, eseguire
  `NOTIFY pgrst, 'reload schema';` per fare riprendere la cache.
- **Supabase JOIN in REST**: la sintassi `select('*, altra_tabella(col)')`
  richiede una FK esplicita tra le due tabelle (non basta convenzione di nome).
- **Tipi colonne FK**: `bigint != integer` per Postgres. Allineare i tipi
  prima di creare la FK altrimenti ALTER TABLE fallisce silenziosamente.
- **Supabase rate limit email built-in**: 3-4 email/ora su free tier. Configurare
  Custom SMTP (Brevo) su Project Settings → Auth → SMTP Settings.
- **Site URL Supabase Auth**: di default `localhost:3000`. Configurare a
  `realaistate.ai` su Auth → URL Configuration prima di lanciare.
- **Hotmail/Outlook + sub-addressing**: il `+nome` è supportato in iscrizione
  ma talvolta filtrato in delivery. Per test usare Gmail (sub-addressing
  pienamente supportato) o email dedicate.
- **Credenziali in chat**: MAI condividere API keys, password, service role,
  SMTP credentials in chat. Le si tengono solo in env vars / dashboard.
- **Outlook greylisting prima email**: la prima email da un sender nuovo
  (es. info@realaistate.ai appena attivata su Private Email) può ritardare
  10-30 min o non arrivare. Le successive entrano normalmente.
- **DNS propagation MX**: cambio MX records può impiegare 5-60 min globalmente.
  Usare mxtoolbox.com per verificare (non solo `dig` locale).
- **SPF un solo record per dominio**: se aggiungi sender (es. Brevo + Private
  Email), li metti tutti nello stesso record con `include:` multipli, non
  due record separati. Più di un SPF = errore di validazione.
- **Vercel API routes in dev locale**: `npm run dev` (Vite) NON serve le API
  in `api/`. Per testare le API in locale serve `vercel dev` — ma su Windows
  cerca yarn al build iniziale. Workaround: `npm i -g yarn`. Nella maggior
  parte dei casi è più semplice testare direttamente sul preview Vercel del
  branch invece di combattere con vercel dev in locale.
- **Schema `immobili.id bigint`**: necessita default tramite sequence per
  insert dinamici. Pattern: `CREATE SEQUENCE ... OWNED BY ...; ALTER TABLE
  ... SET DEFAULT nextval(...)`. Senza default l'INSERT fallisce silently.
- **RLS legacy con `USING (true)`**: pattern velenoso, visto in `Immobili
  pubblici in lettura`. Bypassa qualunque filtro applicativo. Sempre `qual`
  esplicito (es. `status = 'published'`). Audit periodico delle policy.
- **Vercel preview deployment protection**: su free plan i preview richiedono
  login Vercel — protegge anche le serverless function `/api/*`. Per testare
  function via curl sul preview serve generare un bypass token (Settings →
  Deployment Protection → Protection Bypass for Automation), oppure
  disabilitare temporaneamente la protezione (poi riattivarla!).
- **`.env.local` in formato semplice**: `KEY=value` senza `<>`, senza spazi
  iniziali, senza virgolette. Le env VITE_* sono lette dal client; quelle
  senza prefisso solo dal backend.
- **Env vars Vercel su 3 environment**: env aggiunte dopo un deploy esistente
  NON vanno retroattivamente al deploy. Si applicano solo ai nuovi build.
  Importante spuntare Production + Preview + Development quando si aggiunge
  una variabile, altrimenti i preview deployment falliscono silenziosamente.
- **Windows CMD multi-linea commit message**: `git commit -m "riga1\nriga2"`
  fallisce su CMD perché le `-` di inizio riga sono interpretate come comandi.
  Usare commit message su una riga sola, oppure `git commit` da solo per
  aprire l'editor di default.
- **Refactor JSX e variabili globali**: rinominare una `const immobile = {}`
  globale rompe i sotto-componenti che la referenziano (es. AiChat con
  `immobile.id` dentro `loadHistory`). Sempre passare via prop quando si
  splittano componenti, mai affidarsi a closure su variabili globali.
- **JSX merge object con spread + `??`**: per propagare campi DB nel pattern
  `{...FALLBACK, ...(dbData && {...mappings})}`, OGNI campo va listato
  esplicitamente nel mapping. Dimenticarne uno = `undefined` quando il
  fallback è omesso. Capitato per descrizione, stato_immobile, tipologia.
  - **Prompt template e payload**: estendere il payload frontend NON
  basta. Ogni serverless function che usa quel payload (es.
  `chat-immobile.js`) ha un suo template stringa che cita i campi
  uno per uno. Se il template non include il campo nuovo, l'AI non
  lo "vede" anche se il payload è perfetto. Verificare sempre con il
  Network tab del browser cosa arriva all'API e con un breakpoint
  o log cosa entra nel prompt.
- **Colonne `vani` e `camere` su `immobili`**: ridondanti? Da chiarire
  se `vani` = totale locali, `camere` = camere da letto, o se sono
  duplicate. Audit a tempo debito.
- **Branch `feat/vendi-reale` ancora presente** in locale e su origin.
  Va cancellato quando sei sicuro che main contiene tutto. Comando:
  `git branch -d feat/vendi-reale && git push origin --delete feat/vendi-reale`.

## Switch Yousign sandbox → production (quando si farà)
Triggerato da: risposta commerciale Yousign che sblocca API production
durante trial OPPURE primo commitment angel.
Tempo stimato: 60-90 minuti.
Steps:
1. Login su Yousign **production** (account separato da sandbox)
2. Verificare offerta trial 13gg gratis attiva
3. Configurare dominio sender (DNS SPF/DKIM su realaistate.ai) — già fatto ✅
4. Generare nuova API key production
5. Ricaricare template `Proposta d'Acquisto RealAIstate` (sandbox e prod sono separati)
   - Riposizionare fields firma
   - Configurare placeholder signer Compratore/Venditore con label esatti
6. Aggiornare env var Vercel: `YOUSIGN_API_KEY` → chiave production
7. Aggiornare codice `api/yousign-proposta.js`:
   - `YOUSIGN_API` da `api-sandbox.yousign.app/v3` → `api.yousign.app/v3`
   - `TEMPLATE_ID` → nuovo UUID production
8. Push, deploy, test
**Attenzione**: in production le firme hanno valore legale. Test solo con
documenti che possono essere firmati senza conseguenze, o usare account email
intestati a sé stesso.

## Prossima sessione
- **Listing dinamico** (`/compra`): la pagina deve leggere
  `immobili WHERE status='published'` invece di mostrare solo Capecelatro
  hardcoded. Card per ogni immobile con preview foto + prezzo + zona +
  CTA "Vedi scheda → `/compra/{id}`". Sblocca apparizione automatica dei
  nuovi immobili dopo "Pubblica".
- **Bottone "Pubblica" in dashboard venditore**: porta un immobile da
  `draft` → `published`. Dopo il click, chiamata a
  `api/generate-immobile-ai` per popolare i 3 campi AI (oggi solo manuale
  via curl). Eventuale review interna pre-published da decidere.
- **Migliorare prompt `generate-immobile-ai`**: errore osservato su
  Pinturicchio (piano "4°" letto come "terzo"). Aggiungere regola tipo
  "rispetta letteralmente i valori numerici dei campi forniti senza
  trasformarli in altre forme grammaticali".
- **Foto dinamiche per immobile**: oggi path Storage hardcoded
  `${VITE_SUPABASE_URL}/storage/v1/object/public/immobili/1/pub`.
  Va parametrizzato con `immobile.id` e l'array foto va letto da
  `immobili.foto` (jsonb) invece dell'array `FOTO` hardcoded nel JSX.
- Task 7: Contatta notaio (chat AI qualificante + email automatica)
- Switch Yousign production se arriva risposta commerciale

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score interattivo — chat AI che restituisce range OMI o score motivato
- **Fair Price Score AI dinamico**: oggi hardcoded su Capecelatro (88). Per un
  immobile nuovo l'AI deve calcolare lo score da dati OMI + caratteristiche.
  Workflow: agente specializzato `pricer-agent` separato dal descrittore.
- **Documenti come tabella separata**: oggi array hardcoded di 6 nel fallback.
  In realtà dovrebbero essere file caricati su Storage con metadata su tabella
  `documenti_immobile` (FK a immobili.id). Mini-progetto a sé.
- **Comparabili dinamici**: oggi array hardcoded di 3. Servirà un agente che
  cerca su DB altri immobili nella stessa zona/metratura e propone match.
- **Generazione PDF dinamica della proposta** (PDFShift): necessaria col secondo immobile
- **Webhook Yousign** per aggiornare status='signed' su Supabase a firma completata
- **Webhook Yousign per status='sold'**: a rogito firmato, transitare
  l'immobile da published a sold automaticamente.
- **Redirect post-login**: se utente clicca link CTA email mentre non è loggato,
  dopo login deve tornare alla destination, non alla home (oggi va alla home)
- **Validazione form /vendi**: doppio campo email anche nel form venditore
  (è l'ultimo flusso pubblico dove l'email è digitata a mano da utente non
  loggato — anche se ora il form è gated, i campi nome/email/telefono sono
  ancora ribattuti dall'utente in step 4 e potrebbero divergere dall'account).
- **Estrazione zona da indirizzo**: oggi `immobili.zona` è NULL al submit.
  Idealmente derivata via geocoding o LLM dall'indirizzo completo.
- **Pre-popolazione campi contatti in /vendi**: nome/email dell'utente loggato
  potrebbero essere pre-compilati dal profilo Supabase invece che ribattuti.
- **Link firma diretto in dashboard venditore** (opzione C non implementata):
  salvare i `signature_link` Yousign in `proposte` come jsonb e mostrarli come
  bottone "Apri pagina firma" — utile come fallback quando email non arriva.
- **Stringere DMARC policy** da `p=none` a `p=quarantine` poi `p=reject` dopo
  alcune settimane di osservazione email transazionali.
- **Configurare client email mobile** (IMAP/SMTP) per leggere info@ da iPhone
  (oggi solo via webmail privateemail.com).
- **Fix warning React keys** in VendiForm.jsx stepper (warning console:
  "Each child in a list should have a unique key prop"). Cosmetico.
- **Audit `vani` vs `camere`** sulla tabella `immobili`: chiarire semantica
  o rimuovere ridondanza.
- **Cancellazione branch `feat/vendi-reale`** quando sicuri che main lo contiene.
- **Loading state e 404 in Immobile.jsx**: gli stati `loadingImmobile` e
  `errorImmobile` sono settati nel useEffect ma non usati nel render.
  Aggiungere skeleton/spinner durante fetch e pagina "Immobile non trovato"
  per id inesistenti.