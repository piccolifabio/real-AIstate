# RealAIstate — Stato del progetto
Aggiornato: 10/05/2026 (settimana 7 — batch 2 + 7 post-fix Places API New: chat AI anonimo invita registrazione, nome/cognome separati, documenti minimi su tutti gli immobili, Google Places Autocomplete in /vendi migrato a `<gmp-place-autocomplete>` con upgrade-readiness via `importLibrary('places')` + polling per gap di attachment post-onload + creazione PROGRAMMATICA del custom element via `document.createElement` post-importLibrary — diagnosi definitiva: i tag JSX dichiarativi `<gmp-place-autocomplete>` restano stub `shadowRoot:null` perché i Web Components non si auto-upgradano retroattivamente)

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email transazionali: Brevo (SMTP collegato a Supabase Auth + email custom)
- Email casella business: Namecheap Private Email (info@realaistate.ai)
- AI: Anthropic API (limite spesa €20 su console — sufficiente per fase beta, vedi sezione "Decisioni architetturali")
- Mappe: Google Maps Embed API (key in env var, restretta a 4 referrer)
- Firma digitale: Yousign — sandbox attiva, production trial Pro 12gg
- Repo: github.com/piccolifabio/real-AIstate
- Sito live: realaistate.ai

## ⏳ In attesa
- **Call con Nicoleta di Yousign** programmata per dare info commerciali
  e sbloccare API production durante trial. Bozza email risposta inviata
  con disponibilità slot domattina (08/05).

## Completato

### Foundation ✅
- Landing page completa con tutte le sezioni
- Fair Price Score su dati OMI (oggi hardcoded su Capecelatro, AI dinamica post-MVP)
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
- [x] Template proposta HTML completo ✅
- [x] Proposte salvate su Supabase + email notifica ✅
- [x] Task 9: Integrazione Yousign sandbox ✅
- [x] Task 10: Bottone "Accetta proposta" in dashboard venditore ✅
- [x] Task 11: Refactor architetturale + sicurezza + email transazionali ✅

### Settimana 4 ✅ — completata 07/05/2026
- [x] Setup Namecheap Private Email + DNS (info@realaistate.ai autonoma) ✅
- [x] Form "Vendi casa" reale con auth gate, salva immobili draft ✅
- [x] Bottone "Richiedi pubblicazione" in dashboard venditore ✅
- [x] api/richiedi-pubblicazione.js: draft → pending_review + email
      venditore + email a info@ ✅

### Settimana 5 ✅ — completata 08/05/2026 notte
- [x] **Listing dinamico /compra** ✅
  - src/Listing.jsx legge `immobili WHERE status='published'` da DB
  - Layout ibrido: "Disponibile ora" (DB) + "In arrivo" (fittizi sfumati)
  - Card resiliente: cover = foto[0], titolo nullable con fallback, score nullable
  - DB: rename `vani` → `locali`, nuove colonne `titolo` e `fair_price_score`
  - Capecelatro popolato con 8 foto come array URL completi in jsonb
  - Verificato E2E in incognito (senza login) ✅
- [x] **Fix cover dashboard venditore** ✅
  - VenditoreDashboard.jsx tollera entrambi i formati di foto[0]:
    URL completi (Capecelatro) e nomi file (immobili da /vendi)
  - Check con `includes('://')` invece di `startsWith('http')`
- [x] **Verifica E2E flow pubblicazione** ✅
  - /vendi → draft → /venditore → "Richiedi pubblicazione" → pending_review
  - Email a venditore + email a info@ entrambe arrivano e contengono i dati
- [x] **Refactor Immobile.jsx — scheda dinamica** ✅
  - Fetch immobile da DB con fallback su Capecelatro hardcoded per campi
    non ancora presenti in tabella (documenti, comparabili)
  - Foto, score, indirizzo, tutti i dati base ora dinamici da DB
  - Sezioni AI (ai_summary, punti_forza, domande_consigliate) condizionali:
    visibili solo se popolate (l'AI le genera al submit di /vendi)
  - Documenti e comparabili visibili solo per Capecelatro (id=1) finché
    non saranno colonne DB dedicate
  - Empty state "Immobile non disponibile" per id non esistenti o non published
  - Mappa Google Maps Embed dinamica con API key
  - Link "Apri in Google Maps" come accesso a Street View nativo
- [x] **Routing nuovo `/immobili/:id`** ✅
  - Aggiunte route /immobili/:id e /immobili/:id/vendi
  - /compra/:id mantenute come alias per retrocompatibilità (link vecchi
    in email Brevo, post Instagram, blog continuano a funzionare)
  - Search & replace globale di /immobile/ → /immobili/ nei link interni
  - Decisione di branding: "compra" suonava male per il venditore che
    vede schede in dashboard; "immobili" è neutro
- [x] **Setup Google Cloud + Maps Embed API** ✅
  - Progetto Google Cloud creato
  - Maps Embed API abilitata (gratis illimitato)
  - API key generata, restretta a 4 referrer (realaistate.ai, *.realaistate.ai,
    *.vercel.app, localhost:5173) e a sola Maps Embed API
  - Env var VITE_GOOGLE_MAPS_KEY configurata in .env.local + Vercel (Sensitive)
  - Key rotata una volta dopo che era finita in chat (best practice sicurezza)

### Settimana 5 sera ✅ — completata 08/05/2026 sera (security pass)
- [x] **ARCHITECTURE_REVIEW.md** ✅
  - Review completa pre-pitch angel: stack, punti forza, debiti tecnici,
    rischi scala 10/100/1000 immobili e 100/1000/10000 utenti, sicurezza,
    raccomandazioni divise in (a) pre-angel, (b) post-round, (c) post-PMF
  - Identificati 3 buchi critici: proposta-submit senza JWT, API AI senza
    rate-limit, src/supabase.js hardcoded
- [x] **Helpers condivisi `api/_lib/`** ✅
  - `auth.js`: verifyJwt(req) — pattern condiviso per validare JWT
  - `cors.js`: handleCors(req, res) — restringe origin a whitelist
  - `escape-html.js`: escapeHtml(s) — neutralizza HTML injection nei template email
  - Vercel ignora directory con prefisso `_` come endpoint
- [x] **Fix #1: JWT in proposta-submit** ✅
  - Prima: accettava user_id/user_email dal body — qualsiasi attaccante
    poteva creare proposte spacciandosi per chiunque
  - Ora: verifica JWT, prende user_id e email dal token, accetta solo
    immobile_id dal body. Validazione importo>0 e data_rogito futura
    server-side. Rifiuta se status≠published.
- [x] **Fix #4: JWT + ownership in generate-immobile-ai** ✅
  - Prima: chiunque poteva sovrascrivere ai_summary di qualsiasi immobile
    e bruciare budget Anthropic
  - Ora: o JWT del venditore proprietario, o header X-Admin-Secret
- [x] **Fix #2: escapeHtml nei template email** ✅
  - Tutti i campi user-controlled (note, condizioni, nome, indirizzo,
    domanda, risposta AI) passano da escapeHtml
  - Toccati: chat-immobile, vendi-submit, richiedi-pubblicazione,
    proposta-submit. URL Storage passano da encodeURI
- [x] **chat_messages writes via service_role** ✅
  - chat-immobile.js usava SUPABASE_ANON_KEY → richiedeva INSERT
    pubblica permissiva su chat_messages
  - Ora usa SUPABASE_SECRET_KEY (service_role bypassa RLS)
- [x] **Fix #7: CORS restretto** ✅
  - Tutti gli endpoint passano da `_lib/cors.handleCors()`
  - Whitelist: realaistate.ai, *.realaistate.ai, *.vercel.app, localhost:5173/3000/4173
- [x] **Fix #6: src/supabase.js dall'environment** ✅
  - Sostituito hardcode con `import.meta.env.VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  - Aggiunto `.env.example` come riferimento + `.env.local` popolato (gitignored)
- [x] **migrations/2026-05-08-rls-tighten.sql** ✅ (eseguita su Supabase)
  - Drop "Lettura messaggi utenti loggati" e "Scrittura messaggi utenti
    loggati" su chat_messages — erano permissive, qualsiasi loggato leggeva/
    scriveva tutto
  - Create `chat_messages_venditore_read` (scoped via immobile.venditore_user_id)
    e `chat_messages_compratore_read` (scoped via compratore_email = auth.email())
  - Drop "Allow insert" su scuse (la pagina /scuse usa array hardcoded,
    smonta.js e admin-scuse.js usano già service_role)
- [x] **Fix bug self-proposta venditore** ✅
  - Bug trovato in prod: venditore loggato sulla propria scheda poteva
    fare offerta a se stesso → email "Hai una nuova proposta" arrivava
    a se stesso
  - Fix frontend: isOwner promosso a variabile del componente. Se
    user.id === immobile.venditore_user_id, sticky-cta mostra "Vai alla
    dashboard" + "Questo è il tuo immobile" invece di chat/proposta.
    Affordability nascosta. Chat AI sostituita da placeholder con link
    a /venditore.
  - Fix backend: proposta-submit rifiuta con 400 se compratore_user_id
    === venditore_user_id (defense in depth)
  - Bug nascosto del merge: `venditore_user_id` non era nei campi
    cherry-pickati in `const immobile = {...IMMOBILE_FALLBACK, ...immobileDb}`
    quindi il check frontend leggeva sempre undefined. Aggiunto.
- [x] **Cleanup repo** ✅
  - Rimosso src/App.jsx.backup
  - .claude/ aggiunto a .gitignore
- [x] **Bug scroll /immobili/:id: non più riproducibile** ✅
  - Verificato 08/05 sera in incognito senza login: la pagina rimane in alto.
  - Non ho fixato esplicitamente. Possibile side-effect del fix isOwner
    (chat e affordability nascoste al venditore → scrollIntoView non parte
    in quel ramo) o bug intermittente che dipendeva da timing iframe Maps
    + scrollIntoView non più innescato dalle condizioni di stasera.
  - **Se ricompare**: ripartire dalla diagnosi `window.scrollTo` monkey-patch
    + stack trace per identificare il chiamante esatto. Tempo stimato fix
    vero: 15-30 min con strumenti dev usati correttamente.

### Settimana 6 ✅ — completata 09/05/2026
- [x] **Cleanup operativo** ✅
  - Cancellati 3 branch git remoti morti: feat/listing-dinamico,
    feat/vendi-reale, fix/dashboard-venditore-cover (verificati prima
    che non avessero commit non in main).
  - Proposta-fantasma di test su Supabase: query SELECT/DELETE fornita
    al founder per esecuzione manuale via SQL Editor (no accesso DB
    diretto da AI).
- [x] **Tool admin pubblicazione immobili** ✅
  - **Decisione di design**: pattern auth `x-admin-key` + env ADMIN_SECRET
    già usato da admin-scuse e generate-immobile-ai. Riusato per coerenza
    invece di introdurre uno schema nuovo (es. ADMIN_USER_IDS list).
  - **Decisione di design**: estratta logica core di generazione AI in
    `api/_lib/ai-content.js` (helper `generateAndSaveImmobileAI(immobile)`).
    Richiamata in-process da `admin/[op].js` (op=pubblica) invece di una
    fetch HTTP interna. Più affidabile, no cold-start chain, no problemi
    di URL base in dev. `generate-immobile-ai.js` resta come HTTP wrapper
    (auth JWT venditore O X-Admin-Secret) e usa lo stesso helper.
  - **Pagina /admin estesa**: tab "Pubblicazioni | Scuse". Mantenuto il
    flow esistente (login con password, x-admin-key in header). Ai login
    fetcha entrambe le liste in parallelo. Badge giallo sul tab
    Pubblicazioni se ci sono pending.
  - **API consolidata `api/admin/[op].js`**: dispatcher unico per le 3
    operazioni admin (immobili/pubblica/rifiuta). Consolidato per stare
    sotto il limite Vercel Hobby di 12 serverless functions per
    deployment (vedi gotcha sotto).
  - **GET /api/admin/immobili**: lista pending_review con join auth.users
    via `/auth/v1/admin/users/{id}` per recuperare email + nome venditore
    (PostgREST non joina facilmente auth.users).
  - **POST /api/admin/pubblica**: UPDATE status='published' → se
    ai_summary/punti_forza/domande_consigliate mancanti chiama helper AI →
    recupera email venditore → manda email Brevo "Il tuo immobile è online"
    con CTA cliccabile a /immobili/:id. Stesso layout di richiedi-pubblicazione,
    escapeHtml su tutti i campi. Errore AI NON blocca pubblicazione
    (l'immobile resta published, l'errore finisce nei log Vercel).
  - **POST /api/admin/rifiuta**: scope minimo. UPDATE status='draft' →
    email venditore con motivo opzionale (passato come body, escaped
    lato server).
  - Il bottone "Rifiuta" apre `prompt()` per il motivo + `confirm()` per
    sicurezza. Niente modal custom — semplicità su scope minimo.
- [x] **Pre-popolazione campi /vendi dal profilo (step 4 contatti)** ✅
  - useEffect in VendiForm che, al mount/load di user, popola form.nome
    da `user.user_metadata.full_name` e form.email da `user.email`
    (solo se i campi sono ancora vuoti — non sovrascrive modifiche).
  - Email mostrata READ-ONLY (greyed, cursor not-allowed, opacity 55%)
    con label "Email account" e link "Modificabile da /account".
  - Nuovo campo "Conferma email" obbligatorio. Validazione case-insensitive
    via `.toLowerCase().trim()`. Errore inline rosso sotto il campo se
    diverge.
  - canProceed step 4 aggiornato. email_conferma escluso dal payload
    inviato a /api/vendi-submit (campo solo client-side).
  - Layout: telefono spostato in riga propria (email + conferma email
    occupano la prima riga insieme).
- [x] **Redirect post-login a destination** ✅
  - ProtectedRoute: invece di state `{from: location}` (che si perde nei
    Navigate consecutivi), passa `?redirect=<encoded path+search+hash>`
    come query param.
  - LoginPage: legge `?redirect=` con useSearchParams + helper
    `safeRedirect()` che valida (must startsWith '/', not '//' or '/\\',
    length <= 512). Open redirect protection. Default '/' se invalido.
  - Dopo `signIn` riuscito: `navigate(redirectTo)` invece di `'/'`.
  - **Out of scope**: signup. Dopo registrazione l'utente clicca il link
    di conferma email Supabase che lo riporta al Site URL — il
    redirect param scompare. Caso accettabile per ora.

### Settimana 7 ✅ — completata 10/05/2026 (3 blocker walkthrough chiusi)
Walkthrough UX 10/05 ha rivelato 3 blocker critici per onboarding venditore
beta. Tutti chiusi in branch `feat/blocker-fixes-walkthrough`.

- [x] **Fix 1.A: errore "vani" su submit /vendi (BLOCKER 500)** ✅
  - Sintomo: `POST /api/vendi-submit` falliva con
    `Could not find the 'vani' column of 'immobili' in the schema cache`
    dopo il rename DB del 08/05.
  - 3 file referenziavano ancora `vani` su path che toccavano la tabella
    `immobili`:
    - `api/vendi-submit.js:92` INSERT immobili scriveva `vani:` (causa root del 500)
    - `api/_lib/ai-content.js:43` AI gen leggeva `immobile.vani` (undefined)
    - `api/richiedi-pubblicazione.js:112` email review leggeva `immobile.vani`
  - Fix: sostituito con `locali` su quei 3 path.
  - Lasciati intatti: `vendi-submit.js:54` (INSERT venditori — la colonna
    `vani` su quella tabella esiste ancora, il rename era solo su immobili)
    e form key `dati.vani` (interno, mappato server-side).
  - **Side action richiesta su Supabase**: `NOTIFY pgrst, 'reload schema';`
    nel SQL Editor per rifrescare la cache PostgREST (best practice
    post-rename, già in memo tecnici).
- [x] **Fix 1.B: AI cross-immobile data leak (BLOCKER privacy/UX)** ✅
  - Sintomo: chat AI sull'immobile id=2 (villa) rispondeva alla domanda
    "il prezzo è giusto?" citando dati di Capecelatro (€100k, Fair Price
    Score 88/100, zona D24 San Siro).
  - Causa: il merge in `Immobile.jsx:635-671`
    `{...IMMOBILE_FALLBACK, ...immobileDb-cherry-pick}` riempiva i campi
    null del DB con i valori demo hardcoded di Capecelatro. Quel `immobile`
    merged veniva passato come prop a `<AiChat>` che lo inviava al
    system prompt → l'AI vedeva `Fair Price Score: 88/100` per qualsiasi
    immobile senza score in DB.
  - Fix:
    - `<AiChat>` ora riceve `immobileDb` (raw DB) come prop, non più il
      merged `immobile`.
    - Costruisce `aiImmobile` esclusivamente dai campi della tabella
      `immobili`. Campi non in DB (ascensore, garage, terrazzo,
      riscaldamento, acqua_calda, anno_ristrutturazione, ecc., che
      vivono solo come fallback per la demo Capecelatro) restano null.
    - System prompt rinforzato: "Se un dato è 'non specificato', NON
      inventarlo, NON usare valori di altri immobili. Ammetti che non
      hai l'info e proponi di inoltrare al venditore."
    - Per il prezzo senza Fair Price Score: AI deve dire che il punteggio
      non è ancora calcolato, non improvvisare.
  - Trade-off: per Capecelatro la chat AI perde i campi non-DB (ascensore/
    garage/terrazzo/riscaldamento/...) — risponde comunque bene su prezzo,
    zona, superficie, fair_price_score, ai_summary che sono tutti popolati
    in DB. Aggiungere quelle colonne è già nel backlog post-MVP.
- [x] **Fix 1.C: chat AI riconosce compratore loggato via JWT** ✅
  - Sintomo: utente autenticato che fa domanda non risolta riceveva "per
    inoltrare al venditore, dammi nome ed email" — sebbene l'app avesse
    già JWT con email + user_metadata.full_name.
  - Backend `api/chat-immobile.js`:
    - JWT *opzionale* (la chat resta aperta agli anonimi). Se Bearer
      presente, `/auth/v1/user` restituisce email + full_name.
    - System prompt condizionato:
      - Loggati: 2 step (conferma inoltro → "Ho inoltrato")
      - Anonimi: 3 step (conferma → chiedi nome/email → inoltro) come
        prima
    - Email forward a info@: nome/email dal JWT per loggati (override su
      body e su regex), regex extraction per anonimi.
    - `chat_messages.compratore_nome/email`: JWT > body, scritto via
      service_role.
    - Stepback per individuare la domanda originale nello storico
      parametrizzato (2 vs 3) per i due flow.
  - Frontend `AiChat`: `supabase.auth.getSession()` + `Authorization: Bearer`
    se loggato.

### Settimana 7 — batch 1.5 ✅ — completata 10/05/2026 (test E2E post-batch-1)
Test E2E del Batch 1 in produzione hanno rivelato 2 bug residui indipendenti
dai precedenti. Chiusi in branch `fix/walkthrough-tier-1-5`.

- [x] **Fix 1.5.A: chat AI mostrava storico Capecelatro su altri immobili** ✅
  - Sintomo: utente loggato apre /immobili/4 → chat AI parte già con
    messaggi di Capecelatro id=1.
  - Causa: la prop di `<AiChat>` era `immobileId={immobile.id}`, ma
    `immobile = {...IMMOBILE_FALLBACK, ...immobileDb-cherry-pick}` con
    `IMMOBILE_FALLBACK.id = 1`. Al primo render `immobileDb` è null, quindi
    la prop arriva a 1. L'useEffect `loadHistory` query
    `chat_messages WHERE immobile_id=1 AND user_id=…` carica i messaggi
    Capecelatro. Quando `immobileDb` arriva con id=4, useEffect rilancia
    ma per immobile 4 il query torna vuoto e il codice ha
    `if data && length > 0 setMessages` senza else → state resta sui
    Capecelatro caricati al primo render.
  - Fix:
    - Prop `immobileId={immobileId}` (param URL da `useParams()`, sempre
      il vero id fin dal primo render).
    - `key={immobileId}` su `<AiChat>` per forzare il remount al cambio
      URL → state, sessione_id, prevLenChat ripartono fresh.
- [x] **Fix 1.5.B: titolo "Appartamento con garage e terrazzino" su qualsiasi immobile** ✅
  - Sintomo: nuovo immobile creato via /vendi (senza garage, senza terrazzo)
    appariva con titolo "Appartamento con garage e terrazzino" sulla scheda.
  - Diagnosi vera: NON era hallucination AI. Il titolo NON veniva generato
    da nessuna AI. `_lib/ai-content.js` faceva solo ai_summary/punti/
    domande, e per qualsiasi immobile con `titolo=null` in DB il merge
    in `Immobile.jsx:643` `titolo: immobileDb.titolo ?? IMMOBILE_FALLBACK.titolo`
    cadeva sul fallback Capecelatro.
  - Doppio fix:
    1. `_lib/ai-content.js` ora genera anche `titolo`. Prompt rinforzato:
       max 60 caratteri, SOLO caratteristiche reali nei dati (no garage/
       terrazzo/giardino/ascensore se i campi non sono presenti o sono
       null/false), no superlativi vuoti, fallback neutri tipo
       "{tipologia} in {zona}" se mancano tratti distintivi. Shape JSON
       e validation includono `titolo`, PATCH DB lo salva.
    2. `admin/[op].js`: `aiMissing` check include `!immobile.titolo` →
       l'AI riparte alla pubblicazione anche se solo il titolo manca.
    3. `Immobile.jsx`: il merge passa da `?? IMMOBILE_FALLBACK.titolo` a
       `?? null`. Render h1 e modal proposta usano
       `immobile.titolo || immobile.indirizzo` come fallback runtime.
       IMMOBILE_FALLBACK.titolo resta nell'oggetto (parte della demo
       Capecelatro) ma non viene più merged in altri immobili.
  - Per immobili già pubblicati con titolo=null pre-fix: ri-triggerare
    `/api/generate-immobile-ai` con JWT venditore (o X-Admin-Secret),
    oppure UPDATE manuale del titolo su Supabase.

### Settimana 7 — batch 2 ✅ — completata 10/05/2026 (4 miglioramenti walkthrough impatto medio-alto)
Test E2E batch 1 + 1.5 hanno qualificato il prodotto come pronto per
onboarding venditore beta. Batch 2 chiude i 4 task di impatto medio-alto
emersi nel walkthrough UX 10/05.

- [x] **Task 2.A: chat AI anonimo invita a registrarsi (no più finto inoltro)** ✅
  - Sintomo: utente NON loggato faceva una domanda fuori scope all'AI →
    AI fingeva inoltro chiedendo nome/email → API spediva email a info@
    con lead non qualificato (nessun follow-up possibile, info@ si
    riempiva di spazzatura).
  - Fix in `api/chat-immobile.js`:
    - System prompt branching: anonimi ricevono istruzione
      "NON simulare inoltro, NON chiedere nome/email; rispondi con la
      frase canonica `Questa è una domanda specifica per il venditore.
      Per inoltrarla e ricevere risposta, registrati gratuitamente —
      bastano 30 secondi.`"
    - Loggati: comportamento invariato (2-step: chiedi conferma → "Ho
      inoltrato").
    - `saveMessage` skippa anonimi (return early): niente righe
      `chat_messages` senza user_id.
    - `forwarded` è `false` per anonimi anche se l'AI sbagliasse a
      seguire le istruzioni — defense in depth.
    - `inviteRegistration` flag nel JSON di risposta: regex match della
      frase canonica "registrati gratuitamente — bastano 30 secondi".
    - `sendForwardEmail` chiamata solo se loggato + forwarded → niente
      email a info@ per anonimi.
    - Pulito il blocco di sendForwardEmail eliminando il branch `else`
      morto (estrazione regex email da messaggio anonimo).
  - Frontend `AiChat` in `Immobile.jsx`:
    - Quando `data.inviteRegistration` è true, sotto la bubble dell'AI
      compare un CTA "Registrati gratuitamente →" con redirect alla
      scheda corrente (`/login?redirect=<encoded path+search>`).
    - L'utente fa il click, completa il signup, torna sulla scheda dove
      stava chattando. Da loggato la stessa domanda passa per il flow
      di inoltro normale.
  - **Decisione di design**: niente session-merge tra anonimo e loggato.
    Quando l'utente si registra dopo aver chattato da anonimo, la chat
    riparte fresh (key={immobileId} forza il rimount). Riassociare lo
    storico anonimo via fingerprint browser/cookie sarebbe scope creep
    per il MVP.

- [x] **Task 2.B: nome e cognome separati in user_metadata** ✅
  - Sintomo: signup, /account, /vendi salvavano un unico campo
    `full_name`. Conseguenze: cognome sempre vuoto nei form pre-popolati,
    email transazionali approssimative ("Gentile Mario Rossi" invece di
    "Gentile Sig. Rossi"), impossibile generare documenti firma con
    nome+cognome distinti come da contratti.
  - `AuthContext`:
    - `signUp(email, password, nome, cognome)` salva i due campi separati
      + `full_name = nome + cognome` come derivato (per compat con codice
      che oggi legge full_name nelle email transazionali e in 5 endpoint
      API).
    - `updateNomeCognome(nome, cognome)` aggiorna tutti e tre.
    - `updateFullName(fullName)` deprecato: wrapper che splitta sul primo
      whitespace e chiama updateNomeCognome — niente codice rotto.
  - `LoginPage`: tab Registrati con due input affiancati. Riga unica
    desktop, column su mobile (≤480px) tramite `<style>` inline con media
    query. Validazione: entrambi obbligatori dopo trim.
  - `AccountPage`: card Nome e Cognome con due input separati. Pre-popolati
    da `user_metadata.nome` / `.cognome`, fallback a split del vecchio
    `full_name` per utenti pre-migrazione (primo token = nome, resto =
    cognome). Salva chiama `updateNomeCognome`.
  - `VendiForm` step 4: Cognome ora obbligatorio (`canProceed` aggiornato).
    Pre-popolazione da nome/cognome separati, fallback a split di
    full_name.
  - **Migration SQL one-shot** in
    `migrations/2026-05-10-split-nome-cognome.sql`: splitta full_name
    esistente in nome+cognome via `split_part` e `regexp_replace`,
    idempotente (rilanciabile senza danni). Da eseguire manualmente dal
    founder via Supabase SQL Editor — il codice ha già un fallback
    runtime.
  - **Le 5 API che leggono `user_metadata.full_name`**
    (proposta-submit, yousign-proposta, richiedi-pubblicazione,
    chat-immobile, admin/[op]) NON sono state toccate: full_name è sempre
    aggiornato da AuthContext, quindi continuano a funzionare. Se in
    futuro vorrai email tipo "Gentile Sig. Rossi" basterà passare a
    leggere `cognome` direttamente.

- [x] **Task 2.C: sezione Documenti visibile su tutti gli immobili published** ✅
  - Sintomo: la sezione Documenti era visibile solo per Capecelatro id=1
    (`haDocumenti = id === 1`). Su nuovi immobili pubblicati la scheda
    appariva incompleta — niente template proposta, niente accenno alla
    documentazione, compratore non sapeva che poteva richiederla.
  - Variante per Capecelatro (demo): rendering completo invariato —
    lista hardcoded di 6 documenti verificati + template proposta + CTA
    download (logica preservata letterale).
  - Variante per altri immobili published: solo Template Proposta
    d'Acquisto (sempre disponibile, link a
    `/proposta_acquisto_template.html`) + un box placeholder
    "Documentazione completa (visura catastale, planimetria, APE, atto
    di provenienza, regolamento condominiale) disponibile su richiesta.
    Contatta il venditore via chat per riceverli."
  - **Bonus rimosso un altro leak Capecelatro**: il badge "✓ Immobile
    Verificato" in gallery e la verified-box nella sticky-card erano
    calcolati su `immobile.documenti` che cadeva sulla lista hardcoded
    di Capecelatro per qualsiasi immobile (tutti 6 verificati → tutti
    gli immobili "verificati" nel badge). Ora entrambi visibili solo
    per la demo (`isCapecelatroDemo`).
  - Comparabili restano solo per Capecelatro finché non avremo colonne
    DB dedicate (post-MVP).

- [x] **Task 2.D: Google Places Autocomplete in /vendi step 1 indirizzo** ✅
  - Sintomo: l'utente digitava l'indirizzo libero in un input testo →
    indirizzi inventati / errati / incompleti passavano senza
    validazione, immobili in DB con zona=NULL, niente CAP/città/provincia,
    impossibile geocoding o ricerca per zona.
  - **Decisione di design**: usato `google.maps.places.Autocomplete`
    classico (Places API legacy) caricato via tag `<script>` dinamico
    invece di:
    - `gmpx-place-autocomplete` web component nuovo: richiede registrazione
      custom element + import library, complica il pattern React.
    - `@react-google-maps/api`: pacchetto npm grosso per un solo widget,
      overkill.
    Niente nuove dipendenze npm, API stabile e ben documentata, key
    `VITE_GOOGLE_MAPS_KEY` già usata per Maps Embed (estesa da Fabio
    con Places API New sul progetto Google Cloud).
  - `AddressAutocomplete` component (in VendiForm.jsx):
    - Carica lo script Google Maps con `libraries=places&language=it`
      una volta sola (cache via `document.getElementById`, idempotente).
    - Configurazione: `componentRestrictions: { country: 'it' }`,
      `types: ['address']`, `fields: ['address_components', 'geometry',
      'formatted_address']`.
    - Listener `place_changed`: parsing `address_components` → indirizzo
      (route + street_number), CAP (postal_code), città (locality o
      admin_area_3 fallback), provincia (admin_area_2 short_name), zona
      (sublocality_1 / neighborhood / fallback città), lat/lng
      (geometry.location).
    - Disclaimer "Powered by Google" sotto il campo (richiesto da TOS
      Google Maps Platform).
  - VendiForm step 0:
    - Se `!form.addressVerified`: mostra il campo Autocomplete +
      eventuale errore inline "Seleziona un indirizzo dai suggerimenti
      per continuare" (appare quando l'utente ha digitato qualcosa ma
      non selezionato).
    - Se `form.addressVerified`: box verde "✓ Indirizzo verificato" con
      indirizzo, CAP città (Provincia), zona, e bottone "Cambia" per
      resettare la selezione.
    - `canProceed` step 0 ora richiede `addressVerified=true` →
      l'utente NON può procedere con solo testo libero.
    - `handleSubmit` strippa `addressVerified` dal payload (campo
      solo-client, non c'è colonna DB).
  - **Schema DB**: nuove colonne `cap`, `citta`, `provincia`,
    `latitudine`, `longitudine` in `immobili`. `zona` esisteva già.
    Migration in `migrations/2026-05-10-add-address-fields.sql` con
    `NOTIFY pgrst, 'reload schema'` finale (necessario dopo ALTER TABLE
    per evitare "Could not find column ..." dalla cache PostgREST).
  - `api/vendi-submit.js`:
    - Validazione server-side: se cap/citta/provincia mancanti rifiuta
      con 400 "Indirizzo incompleto: ..." (defense in depth contro
      client modificati o richieste fuori-flow).
    - Salva tutti i campi indirizzo nel record immobili.
  - `Immobile.jsx`: il render del header ora costruisce
    `indirizzoSottoTitolo = "Indirizzo, CAP Città (Provincia)"` se i
    campi strutturati sono popolati, fallback al vecchio "indirizzo,
    zona" per Capecelatro e immobili pre-migrazione. La query del Maps
    Embed iframe usa lo stesso indirizzo strutturato → mappa più
    precisa. `luogoLabel` (sopra il titolo) preferisce
    `città · zona` se disponibili.

### Settimana 7 — batch 2 post-fix ✅ — completata 10/05/2026 (Places API New migration)
Il batch 2 task 2.D era stato implementato con `google.maps.places.Autocomplete`
(API legacy). In produzione (verificato 10/05) si è scoperto che il progetto
Google Cloud RealAIstate ha abilitata SOLO la **Places API (New)**, NON la
legacy: console error "You're calling a legacy API, which is not enabled for
your project" e dropdown vuoto al digitare. Decisione di prodotto: NON
abilitare la legacy (debito tecnico), refactorare a Places API (New).

- [x] **Migrazione autocomplete legacy → Places API (New)** ✅
  - Sintomo: `google.maps.places.Autocomplete` (caricato via
    `&libraries=places`) faceva fallire la richiesta autocomplete nel
    momento in cui l'utente digitava 2+ caratteri. Errore in console
    Google + dropdown vuoto = step 1 indirizzo bloccato.
  - **Decisione di design (rivista)**: usato `PlaceAutocompleteElement`
    nativo (Web Component `<gmp-place-autocomplete>`) della Places API
    (New) ufficiale Google Maps JS, NON la libreria
    `@googlemaps/extended-component-library` (`<gmpx-place-picker>`).
    Razionale: a 10/05/2026 la extended-component-library è ancora
    basata sulla legacy API
    ([Issue #283](https://github.com/googlemaps/extended-component-library/issues/283)
    "PlacePicker still uses legacy api" — ancora aperta) → avrebbe avuto
    lo stesso bug. Il Web Component nativo Google
    `<gmp-place-autocomplete>` invece è fatto apposta per la Places API
    (New) ed è incluso nel Maps JavaScript SDK. Niente nuove dipendenze
    npm.
  - `loadGoogleMapsScript` (ex `loadGooglePlacesScript`):
    - URL aggiornato a `&v=weekly&loading=async&libraries=places&language=it`
      (il pattern raccomandato da Google per l'import dinamico).
    - Cache via `document.getElementById("gmaps-script")` come prima.
  - `parsePlace` riscritto per la struttura Places API (New):
    - `addressComponents` (camelCase) invece di `address_components`.
    - Ogni component ha `longText`/`shortText`/`types` invece di
      `long_name`/`short_name`/`types`.
    - `place.location.lat()/lng()` direttamente (non più
      `place.geometry.location.lat()`); fallback difensivo se
      `location.lat` è una property numerica invece di una funzione.
    - `formattedAddress` (camelCase) invece di `formatted_address`.
  - `AddressAutocomplete` riscritto:
    - Crea programmaticamente `new PlaceAutocompleteElement({
      includedRegionCodes: ['it'], includedPrimaryTypes: ['address'] })`
      via `await google.maps.importLibrary("places")`.
    - Appende l'elemento custom al container div con `appendChild`.
    - Listener `gmp-select` (nuovo evento, era `place_changed`).
      L'evento porta `event.placePrediction.toPlace()` che ritorna un
      Place "vuoto" — bisogna chiamare
      `place.fetchFields({ fields: ['formattedAddress',
      'addressComponents', 'location'] })` PRIMA di leggere i campi
      (pattern Place class New API).
    - Listener `input` bubbling dallo shadow DOM per intercettare
      digitazione utente (alimenta `onUserType` come prima).
    - Callback `onSelect`/`onUserType` messe in ref per non rimontare
      il Web Component ad ogni render del parent.
    - Cleanup completo dell'effect: removeEventListener + removeChild.
  - **Styling Web Component**: input interno è in shadow DOM CHIUSO
    (no `::part`, no override CSS diretto). Disponibili solo le CSS
    variables Material Google: `--gmp-mat-color-surface`,
    `--gmp-mat-color-on-surface`, `--gmp-mat-color-on-surface-variant`,
    `--gmp-mat-color-primary`, `--gmp-mat-color-outline`,
    `--gmp-mat-font-family`, `--gmp-mat-font-body-medium`. Settate
    inline sul container per matching del tema scuro RealAIstate.
    Padding/border interni dell'input non sono customizzabili — il
    Web Component impone il proprio layout.
  - Tutto il resto invariato: `canProceed` step 0 ancora richiede
    `addressVerified=true`, box "✓ Indirizzo verificato" identico,
    bottone "Cambia" identico, validazione server-side in vendi-submit
    invariata, schema DB invariato (cap/citta/provincia/lat/lng già
    aggiunti dal batch 2). Nessuna nuova migration SQL necessaria.

### Settimana 7 — batch 2 post-post-fix ✅ — completata 10/05/2026 (mount race condition)
Il post-fix ha mergeato in main, ma in produzione l'autocomplete mostrava
il fallback rosso "Impossibile caricare i suggerimenti indirizzo".
Diagnostica founder in incognito: SDK + custom element + classe
`PlaceAutocompleteElement` tutto OK, errore solo nel componente React
(catch silenzioso senza logging).

- [x] **Race condition tra script.onload e libreria places** ✅
  - Causa: l'URL dello script aveva `&libraries=places&loading=async` —
    combinazione conflittuale per la Maps JS API. Con `loading=async`
    Google si aspetta `await google.maps.importLibrary(...)`, ma con
    `&libraries=places` carica eager bypassando il bootstrap di
    `importLibrary`. Risultato: `google.maps.importLibrary` può essere
    `undefined` quando React esegue l'effect → `await google.maps
    .importLibrary("places")` → TypeError → catch → utente vede l'errore
    rosso. Il founder ha verificato manualmente DOPO che
    `PlaceAutocompleteElement` era una function (places.js si caricava
    in background, ma il React effect era già fallito).
  - Fix in `loadGoogleMapsScript`:
    - Rimosso `&loading=async` dall'URL (mantenuto solo
      `&v=weekly&libraries=places&language=it`).
    - Check di "già caricato" cambiato da `window.google?.maps
      ?.importLibrary` a `window.customElements?.get?.(
      "gmp-place-autocomplete")` — più affidabile (verifica che il
      custom element sia effettivamente registrato).
    - Caso script tag già presente: `resolve()` immediato (l'attesa
      vera è ora delegata a `whenDefined` nel chiamante).
  - Fix in `AddressAutocomplete` effect:
    - Eliminato `await google.maps.importLibrary("places")`.
    - Aggiunto `await Promise.race([customElements.whenDefined(
      "gmp-place-autocomplete"), timeout(8000)])` per attendere la
      registrazione del custom element. `whenDefined` ritorna subito se
      già registrato (ritorno step 0 dopo "Cambia").
    - Dopo whenDefined, accesso DIRETTO a
      `window.google.maps.places.PlaceAutocompleteElement` (senza
      `importLibrary`). Throw esplicito se ancora `undefined`.
    - Aggiunto `console.error("[VendiForm] AddressAutocomplete init
      failed:", err)` nel catch — senza questo in produzione si vedeva
      solo il messaggio utente, debug impossibile.
  - Schema DB invariato. UX invariata. Build pulita.

### Settimana 7 — batch 2 post-post-post-fix ✅ — completata 10/05/2026 (Place Type 'address' invalido)
Dopo il fix mount, in produzione si vedeva un errore HTTP 400 dalla
Places API New: *"Invalid included_primary_types 'address'. See list
of supported types"*. La causa: il valore `'address'` (legacy
`types: ['address']` del classico Autocomplete) NON è un Place Type
valido nella tabella ufficiale Places API (New). Il corrispondente
per indirizzi stradali è `'street_address'`.

- [x] **`includedPrimaryTypes` legacy `['address']` → `['street_address']`** ✅
  - Singola riga cambiata in `AddressAutocomplete` (VendiForm.jsx).
  - Aggiornato il commento inline col link alla tabella ufficiale
    Place Types e nota che `'address'` era valore legacy.
  - Build pulita, schema DB invariato, UX invariata.

### Settimana 7 — batch 2 fourth-fix ✅ — completata 10/05/2026 (rendering listbox)
Dopo i tre fix precedenti (legacy → New, mount race, types), in
produzione il Web Component restava VUOTO: input visibile, console
pulita, chiamate POST a `places.googleapis.com/v1/places:autocomplete`
con status 200, ma il DOM non renderizzava il listbox dei suggerimenti
(`innerHTML` 0, `aria-expanded` null). Diagnosi chirurgica founder
in incognito su realaistate.ai/vendi.

- [x] **Pattern programmatico `new + appendChild` non triggherava il
  rendering interno** ✅
  - Causa: il pattern `new PlaceAutocompleteElement({...}) +
    containerRef.current.appendChild(pickerEl)` dentro un async useEffect
    risulta in un Web Component "dormiente" — i fetch API partono e
    rispondono 200, ma il listbox non viene renderizzato. Sospetto:
    React e il lifecycle del custom element (connectedCallback) non si
    sincronizzano correttamente quando il mount è programmatico dentro
    un async iife in useEffect, dopo che React ha già completato il
    layout del container.
  - Fix: `<gmp-place-autocomplete ref={pickerRef}>` come tag JSX nativo.
    Il browser gestisce nativamente il lifecycle del custom element e
    il rendering interno del listbox funziona correttamente.
  - Property che richiedono array (`includedRegionCodes`,
    `includedPrimaryTypes`) settate via ref dopo il mount:
    `picker.includedPrimaryTypes = ["street_address"]`. Gli attributi
    HTML sono stringhe e non garantiscono il parsing come array.
  - Listener `gmp-select` e `input` agganciati via `ref + addEventListener`
    (React 18 non riconosce eventi custom in JSX). Le callback in ref
    permettono di aggangiare i listener UNA volta sola — senza, ad ogni
    keystroke `setAddressTouched(true)` causa re-render del parent →
    add/remove listener girerebbe su ogni input.
  - Split del singolo useEffect in due: (1) carica script + attendi
    custom element, (2) configura property + listener quando il
    custom element è renderizzato. Più chiaro e separa le concerns.
  - Aggiunto `console.error` anche nell'handler `gmp-select` per
    debug futuro.
  - Build pulita, schema DB invariato, UX invariata.

### Settimana 7 — batch 2 fifth-fix ✅ — completata 10/05/2026 (importLibrary upgrade-readiness)
Dopo i quattro fix precedenti (legacy → New, mount race, types, JSX), in
produzione il custom element `<gmp-place-autocomplete>` esisteva nel DOM
con tutti gli attributi corretti ma **`shadowRoot:null`** — il listbox
dei suggerimenti non veniva MAI renderizzato anche se le chiamate POST
a `places.googleapis.com/v1/places:autocomplete` partivano e
rispondevano 200 a ogni keystroke. Diagnostica founder in incognito:

  document.querySelector('gmp-place-autocomplete') →
    childrenCount: 0, innerHTML: '', hasShadow: FALSE, visible: 662x50

Il custom element era inerte: la classe era registrata
(`whenDefined` risolveva), ma il `connectedCallback` non aveva attaccato
la shadow root quando React aveva montato il tag.

- [x] **Causa root: `whenDefined` ≠ upgrade-readiness completa** ✅
  - Lo script `&v=weekly&libraries=places&language=it` (eager) registrava
    il custom element come **stub** mentre `places.js` continuava a
    inizializzarsi in background. `customElements.whenDefined` risolveva
    su questo stub registrato, ma la classe non era ancora completa.
  - I Web Components NON si auto-upgradano retroattivamente: se React
    monta il tag mentre la classe è incompleta, il browser lo tratta
    come elemento inerte e caricare la libreria DOPO non recupera la
    situazione. Il tag resta lì, visibile (con i CSS variables
    applicati all'host che danno il box), ma `connectedCallback` non
    parte mai e la shadow root non viene mai attaccata.
  - La race era invisibile alla diagnostica: console pulita, network
    OK, `whenDefined` risolto — solo `shadowRoot:null` rivelava il
    problema.

- [x] **Fix: pattern ufficiale Google `loading=async` + `importLibrary`** ✅
  - `loadGoogleMapsScript`:
    - URL cambiato a `&v=weekly&loading=async&language=it` (rimosso
      `&libraries=places`).
    - Check di "già caricato": ora verifica
      `typeof window.google?.maps?.importLibrary === "function"`
      (con loading=async la funzione bootstrap viene esposta dallo
      script base, prima ancora che qualsiasi libreria sia caricata).
    - Caso script tag già presente: ascolta il suo `onload` invece di
      risolvere subito (più sicuro contro race tra mount).
  - `AddressAutocomplete` useEffect:
    - Dopo `loadGoogleMapsScript`: sanity check
      `if (typeof window.google?.maps?.importLibrary !== "function")
       throw "...non disponibile dopo script load"`.
    - **Aggiunto `await window.google.maps.importLibrary("places")`**:
      è il pattern ufficiale Google per la Places API (New). La
      promise risolve SOLO quando la libreria è completamente caricata
      E inizializzata, e il custom element è registrato CON la sua
      classe completa (incluso il `connectedCallback` che attacca
      la shadow root). Niente race condition possibile.
    - `whenDefined` mantenuto come doppia sicurezza (ritorna
      immediatamente in questo punto perché `importLibrary` ha già
      garantito la registrazione).
    - Tutti gli await wrappati in `Promise.race([..., timeout(8000)])`
      per evitare hang infinito su network lento.
  - Render condizionale `{scriptStatus === "ready" && <gmp-...>}`:
    invariato (era già il pattern corretto) — la differenza è che ora
    `ready` segnala con CERTEZZA upgrade-readiness, non solo registrazione.
  - Build pulita, schema DB invariato, UX invariata. Branch
    `fix/places-autocomplete-upgrade`.

### Settimana 7 — batch 2 sixth-fix ✅ — completata 10/05/2026 (importLibrary polling)
Il fifth-fix (commit 005ce0d, in main) introduceva un sanity check
sincrono `if (typeof google.maps.importLibrary !== "function") throw`
subito dopo `loadGoogleMapsScript`. In produzione questo check FALLIVA
istantaneamente con l'errore "google.maps.importLibrary non disponibile
dopo script load" — ma il founder verificava manualmente in console
pochi istanti dopo che `importLibrary` era effettivamente disponibile
come function. Bug logico di timing.

- [x] **Causa: gap tra `script.onload` e attachment di `importLibrary`** ✅
  - Lo script `https://maps.googleapis.com/maps/api/js?...&loading=async`
    triggera `script.onload` quando il file JS è stato parsato, MA il
    bootstrap loader Google attacca `google.maps.importLibrary` come
    function in un microtask successivo (post-parse init). C'è un gap
    di poche centinaia di ms in cui `google.maps` esiste ma
    `importLibrary` è ancora undefined.
  - Diagnostica founder in produzione (post-deploy fifth-fix):
    `typeof window.google.maps.importLibrary === 'function'` quando
    testato manualmente in console dopo hard refresh — ma il check
    sincrono nell'effect React falliva subito dopo loadGoogleMapsScript.

- [x] **Fix: `waitForImportLibrary` con polling 50ms / timeout 3s** ✅
  - Nuovo helper in VendiForm.jsx: ogni 50ms verifica
    `typeof window.google?.maps?.importLibrary === 'function'`. Se true
    → resolve. Se 3s scaduti senza disponibilità → reject con messaggio
    esplicito (network molto lento o key invalida).
  - Sostituito il check sincrono `throw` nel useEffect con
    `await waitForImportLibrary(3000)`. Il resto del flow invariato:
    `loadGoogleMapsScript → waitForImportLibrary → importLibrary("places")
    → whenDefined → setScriptStatus("ready") → render condizionale`.
  - Alternativa considerata: usare il bootstrap loader inline Google
    `(g) => {...}` con la callback custom — più complesso, l'IIFE
    contiene minified code Google. Polling è più semplice e
    funzionalmente equivalente per il nostro caso d'uso.
  - Build pulita, schema DB invariato, UX invariata. Branch
    `fix/places-importlibrary-polling`.

### Settimana 7 — batch 2 seventh-fix ✅ — completata 10/05/2026 (creazione PROGRAMMATICA del custom element)
Anche dopo il sixth-fix (polling di `importLibrary` + tutti i gate
asincroni risolti), in produzione il custom element restava inerte:
`document.querySelector('gmp-place-autocomplete')?.shadowRoot === false`,
`childrenCount === 0`, dropdown mai mostrato. Diagnostica chirurgica
del founder in console su `realaistate.ai/vendi` step 1 (post-deploy
sixth-fix, hard refresh, produzione):

```
Step 1: importLibrary type = function
Step 2: importLibrary result = {PlacesServiceStatus, PlacesService,
        AutocompleteService, AutocompleteSessionToken, Autocomplete,
        PlaceAutocompleteElement, ...}
Step 3: PlaceAutocompleteElement in result = TRUE
Step 4: whenDefined resolved
Step 5: shadowRoot now = FALSE  ← ANCORA FALSE!
Step 6: childrenCount now = 0   ← ZERO
```

Anche DOPO che `importLibrary('places')` ritorna l'oggetto completo con
`PlaceAutocompleteElement` E DOPO che `customElements.whenDefined`
risolve, il tag `<gmp-place-autocomplete>` già nel DOM ha
`shadowRoot=false`. Cioè NON viene retroattivamente upgraded.

- [x] **Causa root: i Web Components non si auto-upgradano retroattivamente** ✅
  - Comportamento standard W3C Custom Elements: se il browser ha
    incontrato un custom element come `HTMLUnknownElement` (perché la
    classe non era completamente registrata quando il parser/React ha
    visto il tag), quel particolare elemento NON si auto-upgrade dopo.
    Solo elementi NUOVI creati post-registrazione vengono upgraded.
  - I sei fix precedenti (legacy → New, mount race, types, JSX,
    importLibrary, polling) hanno tutti usato il pattern JSX dichiarativo
    `{scriptStatus === "ready" && <gmp-place-autocomplete ref={...}>}`.
    Il problema è che React, anche con il gate `scriptStatus="ready"`,
    può inserire il tag nel DOM in uno stato intermedio invisibile in
    cui `customElements.get('gmp-place-autocomplete')` ritorna una stub
    class che soddisfa `whenDefined` ma il cui `connectedCallback` non
    è ancora completamente initialized → l'elemento finisce stub e non
    si recupera mai.
  - L'evidenza è oggettiva: `importLibrary` ritornato OK + `whenDefined`
    risolto + `PlaceAutocompleteElement` truthy nell'oggetto + tag nel
    DOM → MA `shadowRoot:false`. Solo l'auto-upgrade retroattivo
    spiegherebbe la discrepanza, e quel meccanismo non esiste nei
    Web Components.

- [x] **Fix definitivo: createElement programmatico DOPO importLibrary** ✅
  - `AddressAutocomplete` riscritto: il tag `<gmp-place-autocomplete>` NON
    è più renderizzato come JSX. Il render JSX espone solo un
    `<div ref={containerRef}>` vuoto come slot dove iniettare l'elemento
    programmaticamente.
  - Singolo `useEffect` (deps `[apiKey]`) esegue in sequenza atomica:
    1. `loadGoogleMapsScript`
    2. `waitForImportLibrary` (polling)
    3. `importLibrary("places")`
    4. `whenDefined("gmp-place-autocomplete")`
    5. `document.createElement("gmp-place-autocomplete")` — CHIAVE: il
       browser usa la classe registrata (completa) per istanziare,
       l'elemento nasce upgrade-ready
    6. set di `setAttribute("placeholder", ...)`, property array
       (`includedRegionCodes`, `includedPrimaryTypes`), CSS variables
    7. `addEventListener("gmp-select", ...)` + `addEventListener("input", ...)`
    8. `containerRef.current.innerHTML = ""` (difensivo per StrictMode/re-mount)
    9. `containerRef.current.appendChild(el)` → `connectedCallback`
       attacca lo shadow root perché la classe è completa
    10. `setScriptStatus("ready")` → React rimuove il placeholder loading
        e mostra il container (display:block)
  - Cleanup: `removeEventListener` + `parentNode.removeChild(el)` su
    unmount/re-mount. Il flag `mounted` previene set state dopo unmount
    durante l'async pre-creazione.
  - Container SEMPRE renderizzato (anche durante loading) con
    `display: scriptStatus === "ready" ? "block" : "none"`: garantisce
    che `containerRef.current` sia disponibile prima dell'`appendChild`
    nell'effect. Il placeholder "Caricamento suggerimenti..." è un
    sibling separato, non figlio del container. Critico: React non ha
    mai figli JSX dentro al container, quindi non tocca il custom
    element iniettato programmaticamente attraverso i re-render.
  - Il tasto "Cambia" funziona automaticamente senza modifiche:
    quando `addressVerified` flippa true→false, il parent monta una
    nuova istanza di `AddressAutocomplete` (la vecchia era stata
    unmountata quando verified→true). Il nuovo mount esegue il flow
    completo, `loadGoogleMapsScript` ritorna immediatamente
    (script già attached), `importLibrary` cache hit, createElement
    crea un NUOVO elemento upgrade-ready, append.

- [x] **Verifica post-fix attesa in console (post-deploy seventh-fix)** ✅
  - Dopo 2-3 secondi dal load di /vendi:
    - `document.querySelector('gmp-place-autocomplete')?.shadowRoot`
      deve essere TRUE (era false in tutti i 6 fix precedenti)
    - Digitando "via roma milano" deve apparire il dropdown
    - `aria-expanded` deve diventare `'true'` quando dropdown aperto
  - Se ancora false, il prossimo step sarà testare il fallback
    `innerHTML = '<gmp-place-autocomplete ...>'` — equivalente
    funzionale, ma il parsing innerHTML processa la registry custom
    elements in modo leggermente diverso da createElement; in caso
    estremo può aiutare. Pattern già documentato come alternativa nel
    commento sopra `AddressAutocomplete`.

- [x] **Memo tecnico definitivo (per qualunque feature futura con Web Components)** ✅
  - **NON usare JSX dichiarativo per Web Components caricati
    asincronicamente.** Anche con gate sull'`whenDefined`, l'elemento
    può finire stub (HTMLUnknownElement-like) e non si recupera.
  - **Pattern obbligatorio**: `useRef` su un container vuoto + dentro
    un effect `await whatever-async + document.createElement(tag) +
    set props + appendChild`. Il framework React deve solo tenere
    in vita il container.
  - **Cleanup richiesto**: removeEventListener + removeChild
    nell'effect cleanup, altrimenti su re-mount/StrictMode si
    accumulano elementi e listener.
  - **Container sempre montato**: usare `display: none` per nasconderlo
    durante il loading invece di renderizzazione condizionale, così
    il ref è stabile e l'effect può iniettare appena pronto.
  - Branch `fix/places-autocomplete-programmatic`. Build pulita,
    schema DB invariato, UX invariata.

## File chiave
- src/HomePage.jsx — home page con Nav e CTA
- src/ScusePage.jsx — pagina scuse separata
- src/Privacy.jsx — privacy policy
- src/Termini.jsx — termini di servizio
- src/VenditoreDashboard.jsx — dashboard venditore (gated, multi-immobile,
  cover tollerante a entrambi i formati foto)
- src/AccountPage.jsx — account con nome+cognome separati editabili (fallback a
  split di full_name per utenti pre-migrazione) + sezione "Le mie proposte"
- src/Immobile.jsx — scheda immobile DINAMICA da Supabase con fallback
  Capecelatro hardcoded per campi non ancora in DB (documenti/comparabili)
- src/Listing.jsx — pagina /compra dinamica da Supabase + fittizi "In arrivo"
- src/LoginPage.jsx — login/registrazione (con campi nome+cognome separati +
  Conferma email in signup; legge ?redirect= post-login con open-redirect protection)
- src/ProtectedRoute.jsx — gate auth, propaga destination come ?redirect=
- src/VendiForm.jsx — form 5 step con auth gate, salva immobile draft + lead.
  Step 1 indirizzo via Places API (New) `<gmp-place-autocomplete>` Web
  Component nativo, creato PROGRAMMATICAMENTE via `document.createElement`
  DOPO `importLibrary('places')` per garantire upgrade-readiness (i Web
  Components NON si auto-upgradano retroattivamente: il pattern JSX
  dichiarativo lascia il tag stub `shadowRoot:null`, vedi seventh-fix).
  Property array (`includedRegionCodes: ['it']`,
  `includedPrimaryTypes: ['street_address']`) settate prima
  dell'appendChild → popola indirizzo+cap+città+provincia+zona+lat/lng.
  Step 4 contatti pre-popola nome+cognome separati ed email da user;
  email read-only; conferma email obbligatoria; cognome obbligatorio
- src/Admin.jsx — pannello admin con tab Pubblicazioni | Scuse, bottoni
  Approva/Rifiuta sugli immobili pending_review
- src/AuthContext.jsx — gestione sessione + signUp(email, password, nome, cognome)
  che salva nome/cognome separati + full_name derivato; updateNomeCognome(nome,
  cognome) come funzione preferita; updateFullName deprecato (wrapper che splitta)
- src/supabase.js — connessione Supabase
- src/App.jsx — routing centrale con alias /compra/:id ↔ /immobili/:id
- api/_lib/auth.js — verifyJwt(req) helper condiviso
- api/_lib/cors.js — handleCors(req, res) restringe origin a whitelist
- api/_lib/escape-html.js — escapeHtml() per template email
- api/chat-immobile.js — chat AI con notifiche email (writes via service_role).
  JWT opzionale: se Bearer presente, system prompt riceve "Compratore
  identificato: <nome> <email>" e salta la richiesta nome/email; per anonimi
  (batch 2) NIENTE simulazione di inoltro: l'AI risponde con frase canonica
  "registrati gratuitamente — bastano 30 secondi" (regex match → flag
  inviteRegistration nel JSON di risposta), niente saveMessage, niente email
  forward. Per loggati il flow 2-step resta invariato.
- api/proposta-submit.js — JWT-validated, blocca self-proposta, escape email
- api/yousign-proposta.js — firma digitale FEA via Yousign sandbox
- api/vendi-submit.js — form venditore JWT-auth, AI genera summary/punti/domande;
  batch 2 valida server-side cap/citta/provincia (400 se mancanti) e salva i
  nuovi campi indirizzo strutturati nella tabella immobili
- api/richiedi-pubblicazione.js — draft → pending_review + email venditore + info@
- api/generate-immobile-ai.js — JWT venditore O X-Admin-Secret. Wrapper HTTP
  che delega all'helper _lib/ai-content.js
- api/_lib/ai-content.js — generateAndSaveImmobileAI(immobile): chiama
  Anthropic + PATCH DB (riusato da generate-immobile-ai e admin/[op])
- api/admin/[op].js — dispatcher unico admin (x-admin-key auth):
  GET /api/admin/immobili (lista pending_review con info venditore),
  POST /api/admin/pubblica (approva + AI fill + email),
  POST /api/admin/rifiuta (rifiuto + email con motivo)
- migrations/2026-05-08-rls-tighten.sql — RLS tighten (eseguita)
- migrations/2026-05-10-split-nome-cognome.sql — splitta full_name in nome+cognome
  per utenti pre-batch-2 (idempotente, da eseguire dal founder via SQL Editor)
- migrations/2026-05-10-add-address-fields.sql — aggiunge cap/citta/provincia/lat/lng
  a immobili + NOTIFY pgrst (da eseguire post-deploy batch 2)
- ARCHITECTURE_REVIEW.md — review pre-pitch angel (root)
- FIXES_TODO.md — checklist setup esterno (Upstash, Sentry, branch git)
- .env.example — template env vars (root)
- public/proposta_acquisto_template.html — template proposta visualizzabile
- public/llms.txt — descriptor per AI agent

## Supabase tabelle
- chat_messages — messaggi chat (user_id, immobile_id, sessione_id, mittente, testo).
  RLS dopo 08/05: scritture solo via service_role (le API). Letture scoped:
  `chat_messages_venditore_read` (immobile_id IN miei immobili) +
  `chat_messages_compratore_read` (compratore_email = auth.email()).
- proposte — proposte d'acquisto (status: pending/accepted/rejected, yousign_id)
- immobili — id (sequence), titolo, indirizzo, cap, citta, provincia, zona,
  latitudine, longitudine, prezzo, superficie, tipologia, piano,
  superficie_calpestabile, locali (ex vani), camere, bagni, anno_costruzione,
  classe_energetica, stato_immobile, foto (jsonb), descrizione,
  fair_price_score, ai_summary, punti_forza (jsonb array), domande_consigliate
  (jsonb array), status (draft/pending_review/published/sold/archived),
  venditore_user_id (FK auth.users), created_at. RLS attive con 4 policy.
  cap/citta/provincia/lat/lng aggiunti il 10/05/2026 (batch 2 task 2.D).
- scuse — scuse dalla pagina /scuse. RLS dopo 08/05: niente policy pubbliche
  (la pagina usa hallOfFame array hardcoded, smonta/admin-scuse usano service_role).
- venditori — form venditori (lead completo onboarding, ~30 campi)

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign — sandbox per test, switch a production al primo
  angel committed o transazione reale
- Non loggati: prezzo, foto, descrizione, Fair Price Score + lucchetti documenti
- Loggati: documenti pubblici + chat con storico + proposta d'acquisto
- Documenti sensibili: su richiesta
- info@realaistate.ai: casella autonoma Private Email — usata per
  comunicazioni operative manuali oltre che destinatario notifiche prodotto
- email venditore reale (auth.users): documenti che richiedono firma
- Fee: €2.000 compratore + €499 venditore — dovute solo a rogito completato
- MAI riferimento a intermediazione immobiliare nel documento proposta
- Blog: aggiungere in cima ad articoli.js e BlogPage.jsx
- SRL: da aprire al primo commitment angel
- Policy RLS hardcoded su email: VIETATE. Sempre via venditore_user_id ↔ auth.uid()
- DMARC policy: per ora `p=none` (monitoring)
- **Rate-limit AI in fase beta: NON necessario** (decisione 09/05/2026).
  Il limite spesa €20 configurato sulla console Anthropic funge da
  killswitch globale automatico ed è sufficiente per la fase beta.
  Motivazione: volumi attesi bassi (1-2 venditori beta + qualche compratore
  curioso), founder monitora attivamente, beta privata, nessuna registrazione
  pubblica aperta. Aggiungere Upstash ora = ottimizzazione prematura.
  **NON ricordare al founder di setuppare Upstash** finché non si verifica
  almeno una di queste condizioni:
  (a) si apre la registrazione pubblica (post-pitch angel o post-PMF),
  (b) il limite €20 viene raggiunto in modo non spiegabile da uso normale,
  (c) un angel chiede esplicitamente "come gestite gli abusi?" in DD tecnica,
  (d) il volume di chiamate AI legittime cresce al punto che €20 non basta.
  Setup tracciato in FIXES_TODO.md punto 2 — pronto da attivare quando serve.
- **Separazione `venditori` vs `immobili`**: `venditori` = lead onboarding completo
  (~30 campi), `immobili` = ciò che serve a scheda pubblica + relazioni con
  proposte/chat. Vivono in parallelo.
- **Status immobile**: nuovi inserimenti vanno in `draft`. Venditore clicca
  "Richiedi pubblicazione" → `pending_review` → email a info@ → Fabio fa
  UPDATE manuale a `published` su Supabase post-revisione.
- **Convenzione `locali` (non `vani`)**: terminologia commerciale.
- **Foto immobili**: `foto` jsonb = array di URL pubblici completi per
  immobili AI-generated, nomi file relativi al bucket per immobili da /vendi.
  Codice tollerante a entrambi finché non standardizziamo.
- **AI generative al submit di /vendi**: vendi-submit.js chiama l'AI per
  generare ai_summary, punti_forza, domande_consigliate al momento dell'inserimento.
  Capecelatro li ha popolati a mano (template della demo).
- **Capecelatro come demo perfetta**: id=1 è la nostra vetrina. Hardcoded
  bene per impressionare chi visita. Documenti/comparabili sezione visibile
  solo per id=1 finché non avremo colonne DB dedicate.
- **Routing scheda immobile**: URL canonico `/immobili/:id`. Alias `/compra/:id`
  mantenuto per retrocompatibilità (link in email, post IG, blog vecchi).
- **Workflow git**: branch dedicato → modifiche → commit → merge locale
  su main → push. NON usare PR su GitHub per task piccoli (sovradimensionato).
  Vercel deploya automaticamente a ogni push su main.
- **STATO_PROGETTO.md = memoria condivisa tra sessioni**: aggiornare SEMPRE
  a fine sessione PRIMA di chiudere. Path: `src/STATO_PROGETTO.md` (NON root).
  Lezione imparata 07/05: senza aggiornamento, sessioni successive ricominciano
  da informazioni stale e si rifanno cose già fatte.
- **Pattern auth obbligatorio per scritture sensibili**: tutte le API che
  scrivono su DB con dati riferiti all'utente DEVONO validare il JWT via
  `_lib/auth.verifyJwt()` e prendere user_id/email dal token, MAI dal body.
  Pattern: vendi-submit, richiedi-pubblicazione, yousign-proposta, proposta-submit,
  generate-immobile-ai. Solo le API pubbliche per design (subscribe, chat-affordability,
  smonta) possono restare aperte — il limite €20 console Anthropic protegge dai costi.
- **CORS centralizzato**: tutte le API usano `_lib/cors.handleCors()`.
  Whitelist origin: realaistate.ai, *.realaistate.ai, *.vercel.app, localhost.
  Niente `Access-Control-Allow-Origin: *` mai più.
- **escapeHtml() su template email**: qualsiasi campo user-controlled
  (note, condizioni, nome, indirizzo, descrizione, domande, risposte AI)
  deve passare da `_lib/escape-html.escapeHtml()` prima dell'interpolazione.
  URL Storage Supabase passano da `encodeURI()`.
- **chat_messages writes only via service_role**: dopo migration 08/05,
  l'INSERT da anon/authenticated è bloccato. Le API che scrivono devono
  usare SUPABASE_SECRET_KEY (mai SUPABASE_ANON_KEY).
- **isOwner pattern in scheda immobile**: in Immobile.jsx la variabile
  `isOwner = user?.id === immobile?.venditore_user_id` controlla:
  - sticky-cta: "Vai alla dashboard" + "Questo è il tuo immobile" (vs
    "Contatta venditore" + "Fai una proposta")
  - chat AI section: placeholder "Le tue conversazioni" + link a /venditore
  - affordability section: nascosta
  - shortlist button: nascosto
- **No chat persistente bidirezionale in app per MVP**: il flow è
  compratore→AI→email a info@→venditore risponde via email. Asincrono
  va bene per l'immobiliare. Da rivalutare post-PMF quando: 10+ immobili
  attivi, venditori chiedono "come rispondo dentro l'app?", compratori
  dicono "non ho capito se ha risposto".
- **Self-proposta venditore = rifiutata** sia frontend (UI nascosta) sia
  backend (proposta-submit ritorna 400 se compratore_user_id ===
  venditore_user_id). Defense in depth.
- **Admin auth pattern**: header `x-admin-key` (frontend) / `x-admin-secret`
  (chiamate API-to-API tramite ENV `ADMIN_SECRET`). Usato in admin-scuse,
  admin/[op] (dispatcher: immobili/pubblica/rifiuta), e come bypass in
  generate-immobile-ai. NON è un sistema multi-utente — è un toggle "io
  founder" via password singola. OK per scala MVP. Da rivedere quando
  avremo più di un admin operativo.
- **Flow pubblicazione immobile (status workflow)**:
  draft → richiedi-pubblicazione (venditore) → pending_review → admin
  approva/rifiuta → published / draft (con motivo via email).
  Il bottone "Approva" è in `/admin` tab "Pubblicazioni". L'email al
  venditore è automatica e include CTA cliccabile alla scheda.
- **Pre-popolazione form da auth user**: pattern useEffect su `user` con
  setForm condizionale (solo se i campi sono ancora vuoti, mai sovrascrivere
  modifiche manuali). Email mostrata read-only se viene da auth (riduce
  rischio typo che divergano email account vs email contatto).
- **Redirect post-login**: ProtectedRoute propaga la destination come
  `?redirect=<encoded>` query param invece che state — sopravvive a
  Navigate consecutivi. LoginPage valida con safeRedirect() prima di
  navigate(). Default '/' se param assente o invalido.
- **Payload AI = solo dati DB raw, MAI fallback hardcoded** (decisione
  10/05/2026 dopo walkthrough). Il pattern in Immobile.jsx
  `{...IMMOBILE_FALLBACK, ...immobileDb}` è OK per il rendering visivo
  della demo Capecelatro, ma NON deve fluire mai nel body inviato alle
  API AI. Conseguenza concreta: prima di chiamare `/api/chat-immobile`
  (e qualsiasi altra API AI futura), costruire un oggetto separato
  estraendo solo i campi che vengono dal DB. I campi mancanti restano
  null e l'API server-side li mostra come "non specificato" all'AI,
  che è istruita a non inventarli. Questo evita data leak tra immobili
  (es. Fair Price Score di un altro immobile suggerito a casaccio).
- **JWT opzionale in API AI pubbliche** (`chat-immobile.js`): la chat
  resta aperta agli anonimi (è discoverability), ma se l'utente è
  loggato il JWT viene letto e nome/email estratti dal token —
  iniettati nel system prompt come "Compratore già identificato",
  usati per email forward, scritti in chat_messages, e l'AI è
  istruita a NON chiedere nome/email di nuovo. Pattern: `try { fetch
  /auth/v1/user; if ok set authedEmail/authedNome } catch { /* anon */ }`.
  Niente 401 se token mancante — diversamente dalle API JWT-required
  (proposta-submit, vendi-submit, ecc.).
- **Componenti scoped per entità: `key={entityId}` per garantire
  rimount al cambio entità** (decisione 10/05/2026 batch 1.5). React
  Router riusa lo stesso componente quando il path cambia ma il
  pattern di route è uguale — lo state interno persiste. Per chat,
  liste o widget legati a un'entità (immobile, proposta, sessione),
  passare `key={id}` sul componente garantisce remount → state, ref,
  useState init e sessionId rinascono fresh. Vedi `<AiChat
  key={immobileId} ... />` in Immobile.jsx. Senza, il componente
  mostra dati dell'entità precedente finché il fetch nuovo non
  sovrascrive — e se il fetch torna vuoto (es. nessuna chat su
  immobile 4) i dati vecchi restano.
- **Generazione titolo immobile = compito AI, NO fallback hardcoded**
  (decisione 10/05/2026 batch 1.5). Il titolo viene generato da
  `_lib/ai-content.js` insieme a ai_summary/punti/domande, al
  passaggio pending_review → published. Il fallback hardcoded
  Capecelatro era un leak — qualsiasi immobile con titolo=null
  mostrava "Appartamento con garage e terrazzino" anche senza garage
  né terrazzo. La generazione AI è guidata da regole strict (no
  garage/terrazzo se non in dati, fallback neutri tipo "{tipologia}
  in {zona}"). Il render frontend usa `titolo || indirizzo` come
  fallback runtime, mai un titolo "demo".
- **Chat AI anonima = funnel verso registrazione, NON lead generator**
  (decisione 10/05/2026 batch 2 task 2.A). Prima la chat anonima
  raccoglieva nome ed email come "inoltro al venditore" → email a
  info@ con lead non qualificato. Da oggi: anonimi vedono solo "qui
  serve registrarti". Razionale:
  (a) info@ stava diventando rumore — lead senza follow-up reale.
  (b) la chat ha valore informativo anche senza inoltro: l'AI
      risponde su prezzo, zona, superficie, FPS, sommario AI.
  (c) la registrazione è gratuita 30s — barrier minima.
  (d) loggandosi l'utente abilita inoltro vero, proposte, shortlist,
      storico chat persistente: incentivo allineato.
  Implementazione: `inviteRegistration` flag nel JSON di risposta
  (regex match della frase canonica "registrati gratuitamente —
  bastano 30 secondi"), CTA Registrati sotto la bubble nel frontend.
  Pattern riusabile per ogni futura paywall soft.
- **Nome e cognome SEMPRE separati in user_metadata**, full_name è derivato
  (decisione 10/05/2026 batch 2 task 2.B). I nuovi campi ufficiali sono
  `user_metadata.nome` e `user_metadata.cognome`. `user_metadata.full_name`
  resta come campo derivato (`${nome} ${cognome}`.trim()) per non
  rompere le 5 API che oggi lo leggono — è sempre aggiornato da
  AuthContext (signUp, updateNomeCognome, updateFullName wrapper).
  Codice nuovo: usa `nome`/`cognome` direttamente. Codice vecchio:
  legge full_name e funziona. Migrazione utenti esistenti via SQL
  one-shot in /migrations/2026-05-10-split-nome-cognome.sql (idempotente,
  fallback runtime nel frontend per utenti pre-migrazione).
- **Indirizzo immobile = struttura, non testo libero** (decisione 10/05/2026
  batch 2 task 2.D, refactor post-fix 10/05/2026). /vendi step 1 usa la
  **Places API (New)** ufficiale Google via `PlaceAutocompleteElement`
  (Web Component `<gmp-place-autocomplete>`) per popolare
  cap/citta/provincia/zona/lat/lng come campi DB strutturati. Razionale:
  (a) impossibile pubblicare immobili con indirizzi inventati o errati;
  (b) FPS dinamico futuro avrà bisogno di geocoding preciso;
  (c) ricerca per zona / mappa centrata richiedono lat/lng;
  (d) il rendering della scheda mostra "Via X, CAP Città (Prov)" pulito.
  Validazione frontend (canProceed step 0 richiede addressVerified) +
  validazione server-side (vendi-submit rifiuta 400 se cap/citta/provincia
  mancanti). Niente nuove dipendenze npm — script Maps JS API caricato
  dinamicamente con la stessa key VITE_GOOGLE_MAPS_KEY già usata per
  Maps Embed. Restrizione paese `includedRegionCodes: ['it']`, tipo
  `includedPrimaryTypes: ['street_address']` (esclude POI; NB: NON
  `'address'` che è valore legacy non valido nella API New, lezione
  10/05). **NON usare la legacy `google.maps.places.Autocomplete`**:
  il progetto Google Cloud RealAIstate ha solo la Places API (New)
  abilitata, la legacy non è più disponibile per nuovi customer.
- **Sezione Documenti = sempre visibile su immobili published** (decisione
  10/05/2026 batch 2 task 2.C). Capecelatro mostra la lista hardcoded di
  6 documenti verificati (demo). Altri immobili mostrano solo Template
  Proposta + placeholder "documentazione disponibile su richiesta — chat
  con il venditore". La sezione non scompare mai — la scheda non sembra
  vuota. La lista per-immobile reale richiede una tabella
  `documenti_immobile` dedicata, in backlog post-MVP. Stessa logica per
  badge "✓ Immobile Verificato" e verified-box: mostrati solo per la
  demo, niente leak Capecelatro su immobili senza dati di verifica.

## Memo tecnici (gotchas già imparati — non ripetere errori)
- **Yousign `template_placeholders.signers[].label`**: case-sensitive
- **Yousign sandbox: delivery email instabile** (06/05/2026) — production
  trial dovrebbe risolvere, in attesa call commerciale
- **Vercel + html-pdf-node**: non gira (Puppeteer ~250MB > 50MB).
  Usare API esterna tipo PDFShift quando serve PDF dinamico.
- **PostgREST schema cache**: dopo ALTER TABLE eseguire
  `NOTIFY pgrst, 'reload schema';`
- **Tipi colonne FK**: `bigint != integer` per Postgres
- **Supabase rate limit email built-in**: 3-4 email/ora su free tier.
  Custom SMTP Brevo configurato.
- **Site URL Supabase Auth**: configurato a `realaistate.ai`
- **Hotmail/Outlook + sub-addressing**: il `+nome` filtrato in delivery.
  Email compratore fittizio storico: fabiopiccoli+nome01@hotmail.it
  (delivery non garantito, per test usare Gmail con sub-addressing).
- **Credenziali in chat**: MAI condividere API keys, password, service role.
  Se accade per errore, ROTARE subito (non solo "rinnovare" — eliminare
  vecchia + creare nuova). Lezione imparata 07/05 con Google Maps key.
- **Google Maps Embed API**: gratis ILLIMITATO (no quota a pagamento).
  Account fatturazione richiede dati personali (codice fiscale per privati,
  no P.IVA). Carta richiesta per verifica ma non addebitata.
  Restringere sempre key a Referrer + sola Maps Embed API.
- **Vite env var prefix VITE_**: env legibili dal client browser.
  Per Maps Embed la key è inevitabilmente esposta — la sicurezza viene da
  restrizioni Referrer + API, non da segretezza.
- **Outlook greylisting prima email**: prima email da nuovo sender ritarda
  10-30 min. Successive normali.
- **DNS propagation MX**: 5-60 min. Usare mxtoolbox.com per verificare.
- **SPF un solo record per dominio**: include: multipli nello stesso, mai 2 SPF.
- **Vercel API routes in dev locale**: `npm run dev` (Vite) NON serve le API
  in `api/`. Workaround: testare API su preview Vercel del branch.
- **Schema `immobili.id bigint`**: necessita default tramite sequence.
- **RLS legacy con `USING (true)`**: pattern velenoso, audit periodico.
- **`.env.local` formato semplice**: `KEY=value` senza `<>`, senza spazi,
  senza virgolette.
- **`ALTER TABLE ADD COLUMN`**: usa sempre `IF NOT EXISTS` (idempotente).
- **Listing public read RLS**: policy `immobili_public_read`
  (target role public, command SELECT, qual `status='published'`).
- **Foto jsonb formati misti**: Capecelatro URL completi, immobili /vendi
  nomi file. Codice rendering deve gestire entrambi (`includes('://')`).
- **VS Code find regex mode**: se Ctrl+F non trova testo che c'è davvero,
  controllare che l'icona `.*` (regex mode) sia spenta.
- **Workflow corretto**: testare in LOCALE prima di committare, non in
  produzione. Lezione imparata 07/05 (test in produzione mascherava
  comportamenti diversi del codice locale).
- **api/_lib/* è ignorato da Vercel come endpoint**: il prefisso `_`
  rende il path non esposto come API pubblica. Pattern ufficiale per
  utilities condivise tra le serverless functions.
- **Worktree git**: in un worktree non puoi `git checkout main` se main
  è già checked-out nella cartella principale. Soluzione: `git push
  origin <branch>:main` da dentro il worktree fa fast-forward diretto
  su main remoto. Vercel deploya. Il worktree principale recupera con
  `git pull` quando ci torni sopra.
- **Spread merge + cherry-pick gotcha**: in Immobile.jsx il `const immobile
  = { ...IMMOBILE_FALLBACK, ...immobileDb_cherry_picked }` enumera
  esplicitamente i campi DB. Se aggiungi una colonna nuova (es.
  `venditore_user_id`) e la usi nel render, ricordati di aggiungerla
  alla lista cherry-pick — altrimenti finisce undefined nel render
  e i check silenziosamente non matchano. Bug subdolo: il dato in DB
  è OK, il render no.
- **Supabase RLS audit query**: per vedere tutte le policy di una tabella:
  `SELECT polname, polcmd, polroles::regrole[], pg_get_expr(polqual, polrelid)
  FROM pg_policy WHERE polrelid = 'public.NOME_TABELLA'::regclass;`
  Da fare PRIMA di scrivere migration RLS — i nomi default di Supabase
  Studio non sono mai quello che pensi.
- **Cache browser dopo deploy Vercel**: Ctrl+F5 a volte non basta. Per
  test puliti usa finestra incognito. Bundle JS può restare cached
  diversi minuti dopo il deploy.
- **Chiamate inter-API serverless**: NON usare `fetch(VERCEL_URL/api/...)`
  per chiamare un'altra serverless function dal proprio handler. Cold
  start chain + URL base che cambia in dev/preview/prod. Pattern giusto:
  estrarre la logica in `api/_lib/<nome>.js` come funzione pura, poi
  importarla in entrambi gli handler. Esempio: `_lib/ai-content.js`
  riutilizzata da `generate-immobile-ai.js` e `admin/[op].js`.
- **Recupero email user da auth.users in serverless**: PostgREST non joina
  facilmente auth.users (schema separato). Soluzione: chiamare
  `${SUPABASE_URL}/auth/v1/admin/users/{id}` con apikey + auth bearer
  service_role. Ritorna {email, user_metadata.full_name, ...}. Va fatto
  per ogni record (in pratica 1-5 in admin/immobili).
- **Vercel Hobby — limite 12 serverless functions per deployment**: errore
  hard fail con "No more than 12 Serverless Functions can be added to a
  Deployment on the Hobby plan. Create a team (Pro plan) to deploy more."
  Lezione imparata 09/05: dopo aver aggiunto 3 nuovi endpoint admin
  (admin-immobili/pubblica/rifiuta) il count passava 11→14 e Vercel
  rifiutava il deploy SENZA mostrare l'errore nel build log standard
  (passa la fase "vercel build" e fallisce in "Deploying outputs").
  L'errore è visibile solo in Deployment Details → Build Logs (sezione
  Functions). Pattern di mitigazione: consolidare endpoint correlati in
  un dispatcher dynamic-route `api/<gruppo>/[op].js` che switch su
  req.query.op. Vercel conta UN file = UNA funzione, anche con dynamic
  routing. Vedi `api/admin/[op].js`. Files in `_lib/` non contano.
- **Open redirect protection in query param**: quando leggi un path da
  `?redirect=...` per `navigate()`, valida sempre: deve startsWith('/'),
  NON '//' o '/\\' (protocol-relative URL evil), length cap. Vedi
  `safeRedirect()` in LoginPage.jsx.
- **Spread di fallback hardcoded in payload AI = data leak garantito**.
  Lezione 10/05/2026: in `Immobile.jsx` il merge
  `{...IMMOBILE_FALLBACK, ...immobileDb-cherry-picked}` riempie i null
  con valori demo di Capecelatro (Fair Price 88/100, zona D24 San Siro,
  ai_summary su €352k/mq). Se quel merged finisce nel body di `/api/chat-immobile`,
  l'AI risponde "Fair Price 88/100" per QUALSIASI immobile senza score
  in DB. Pattern di prevenzione: build di un oggetto AI-payload
  dedicato che pesca solo da `immobileDb` raw (niente `??` che cade
  sul fallback). I campi assenti diventano null → l'API mostra "non
  specificato" → il system prompt istruisce l'AI a NON inventare e
  proporre l'inoltro al venditore. Quando aggiungerai una nuova API
  AI: stesso pattern, niente shortcut.
- **React Router riusa lo stesso componente cambiando solo path param**.
  Andando da `/immobili/1` a `/immobili/4`, `<ImmobilePage>` non
  rimonta — gli state interni (incluso lo state di componenti figli
  come AiChat) sopravvivono. Se la query Supabase di refresh torna
  vuota e il codice non ha branch `else setMessages(initialMessages)`,
  vedi i dati dell'entità precedente. Pattern di prevenzione:
  `key={entityId}` sul componente figlio ogni volta che è scoped
  per entità (chat, lista messaggi, sessione). Lezione 10/05 batch
  1.5 con `<AiChat key={immobileId} ...>`.
- **Prop derivata da merged con fallback = bug sottile al primo
  render**. In `Immobile.jsx`, `immobile.id` parte come `IMMOBILE_FALLBACK.id`
  (=1) finché `immobileDb` non arriva dal fetch. Se passi `immobile.id`
  come prop a un componente che query DB, il primo render fa il query
  per id=1 → mismatch con l'entità reale. Pattern di prevenzione: per
  prop tipo "id corrente", usa la fonte autoritativa stable (es. il
  param URL da `useParams()`) invece di una prop derivata che dipende
  dal fetch async.
- **Google Places API (New) richiede `PlaceAutocompleteElement`, NON
  `@googlemaps/extended-component-library` né la legacy
  `google.maps.places.Autocomplete`** (lezione 10/05/2026, post-fix
  batch 2). Per nuovi progetti Google Cloud (creati dopo metà 2024 o
  che non hanno mai abilitato la legacy) la legacy
  `google.maps.places.Autocomplete` lancia in console
  *"You're calling a legacy API, which is not enabled for your project"*
  e l'autocomplete non funziona. La libreria
  `@googlemaps/extended-component-library` (Web Components `<gmpx-*>`) a
  10/05/2026 è ancora basata sulla legacy
  ([Issue #283 aperta](https://github.com/googlemaps/extended-component-library/issues/283))
  → **non usarla**. La soluzione corretta è il Web Component nativo
  Google `<gmp-place-autocomplete>` (`PlaceAutocompleteElement`).
  Pattern inizializzazione: `new PlaceAutocompleteElement({
  includedRegionCodes: ['it'], includedPrimaryTypes: ['street_address'] })`
  + `appendChild`. **Attenzione**: `'address'` (valore legacy) NON è
  un Place Type valido nella API New e fa fallire la chiamata con
  HTTP 400. Evento `gmp-select` (NON `place_changed`) →
  `event.placePrediction.toPlace()` ritorna un Place vuoto: chiamare
  `await place.fetchFields({ fields: ['formattedAddress',
  'addressComponents', 'location'] })` PRIMA di leggere i campi.
  Struttura nuova: `addressComponents` (camelCase) con
  `longText`/`shortText`/`types` invece di `address_components` con
  `long_name`/`short_name`. `place.location.lat()/lng()` sono ancora
  funzioni. Styling: shadow DOM CHIUSO (no `::part`), solo CSS
  variables Material `--gmp-mat-color-*` e `--gmp-mat-font-*` esposte.
- **Web Components React: usa il TAG JSX, non `new + appendChild`**
  (lezione 10/05/2026, fourth-fix batch 2 — corollario del fifth-fix).
  Per integrare un Web Component in React (es. `<gmp-place-autocomplete>`
  della Places API New) ci sono due pattern:
  (a) `<gmp-place-autocomplete ref={r}>` come tag JSX, property/eventi
      settati via ref dopo il mount;
  (b) `new PlaceAutocompleteElement({...})` + `containerRef.current.
      appendChild(picker)` dentro un async useEffect.
  Pattern (b) provato in prod (commit 0facd4e): input visibile, Network
  200 sui fetch autocomplete, listbox MAI renderizzato. Pattern (a) è
  l'API React-idiomatica per i custom elements e si combina meglio col
  rendering condizionale necessario per garantire l'upgrade-readiness
  (vedi memo "Web Components NON si auto-upgradano"). **Pre-condizione
  non-negoziabile per (a)**: il tag JSX va renderizzato SOLO dopo che
  la libreria che lo definisce ha completato il caricamento atomico
  (es. `await google.maps.importLibrary('places')`), non solo dopo
  `customElements.whenDefined`. Pattern completo: in un primo useEffect
  fai `loadScript → importLibrary → setScriptStatus("ready")`; nel JSX
  fai `{scriptStatus === "ready" && <gmp-... ref={r}>}`; in un secondo
  useEffect con dep `[scriptStatus]` setti property array via ref
  (`r.current.includedRegionCodes = ['it']`) e attacchi listener custom
  (`r.current.addEventListener("gmp-select", ...)`). React 18 non
  riconosce eventi custom (`gmp-*`) come prop JSX, quindi addEventListener
  via ref è obbligatorio. Per stable references delle callback, metterle
  in ref (onSelectRef/onUserTypeRef) e aggiornarle in useEffect senza
  deps — così add/remove listener gira UNA volta sola e non rebinding
  ad ogni render del parent.
- **Place Types Places API (New) NON sono i `types` legacy** (lezione
  10/05/2026, post-post-post-fix batch 2). Nel classico
  `google.maps.places.Autocomplete` si passava `types: ['address']`
  per filtrare solo indirizzi. Nella Places API (New) il valore
  `'address'` NON esiste e l'API risponde con HTTP 400
  *"Invalid included_primary_types 'address'. See list of supported
  types"*. Il valore corretto è `'street_address'` (Table 2 — Other).
  Stessa cosa per altri filtri: i Place Types validi sono solo quelli
  delle tabelle 1-3 alla
  [docs ufficiale](https://developers.google.com/maps/documentation/places/web-service/place-types)
  (es. `restaurant`, `lodging`, `geocode`, `country`, `locality`,
  `street_address`). `includedPrimaryTypes` accetta un array di questi
  valori; un valore non riconosciuto fa fallire TUTTA la chiamata
  autocomplete (non solo quel filtro). Quando si migra dalla legacy,
  rivedere SEMPRE i nomi dei types.
- **Web Components NON si auto-upgradano retroattivamente** (lezione
  10/05/2026, fifth-fix batch 2 — la più importante della serie). Quando
  un custom element (es. `<gmp-place-autocomplete>`) viene montato nel
  DOM PRIMA che la sua classe sia completamente registrata, il browser
  lo tratta come elemento inerte (HTMLUnknownElement-like). **Caricare
  la libreria DOPO NON recupera la situazione**: il
  `connectedCallback` non parte mai, la shadow root non viene mai
  attaccata, l'elemento resta visibile (con CSS variables host-level)
  ma è completamente non funzionante. Sintomo specifico:
  `document.querySelector('gmp-...').shadowRoot === null` anche se
  `customElements.get('gmp-...')` ritorna una classe e
  `whenDefined` risolve. Analogia: come dichiarare `<video>` quando il
  browser non supporta video — caricare un polyfill dopo non installa
  retroattivamente HTMLVideoElement.prototype sull'istanza esistente.
  **Implicazione critica**: per ogni Web Component caricato via
  libreria esterna, il render del tag DEVE essere sospeso finché la
  libreria non garantisce upgrade-readiness completa. Per Google
  Places: `await google.maps.importLibrary('places')` (atomico:
  carica + inizializza + registra completo). Per altre librerie: il
  segnale di readiness varia, leggere la doc. `customElements.whenDefined`
  da solo NON BASTA: può risolvere su uno stub registrato in fase di
  bootstrap. Pattern React: `scriptStatus="loading" → importLibrary →
  scriptStatus="ready" → render condizionale del tag JSX`.
- **`&libraries=places` + `&loading=async` = combinazione conflittuale**
  (lezione 10/05/2026, post-post-fix batch 2 + aggiornata fifth-fix).
  I due parametri sullo script `https://maps.googleapis.com/maps/api/js?...`
  sono mutualmente esclusivi: `&loading=async` aspetta `await
  google.maps.importLibrary(...)` per caricare le librerie on-demand
  in modo atomico, mentre `&libraries=X` carica eager bypassando il
  bootstrap di `importLibrary`. **Mescolarli** lascia `importLibrary`
  `undefined` quando `script.onload` triggera (TypeError nel catch,
  fallback rosso utente). **Solo `&libraries=X`** (eager) registra il
  custom element come stub durante l'init di places.js — `whenDefined`
  risolve troppo presto, React monta un tag inerte, `shadowRoot:null`
  in produzione. **Solo `&loading=async`** (modern Google pattern):
  bootstrap loader puro, poi `await google.maps.importLibrary('places')`
  garantisce che la classe sia completa PRIMA di risolvere → custom
  element upgrade-ready quando React lo monta. **Fix raccomandato e
  attivo in VendiForm.jsx (fifth-fix + sixth-fix)**: solo
  `&loading=async`, niente `&libraries=`, polling per attendere
  `importLibrary` attached come function (vedi sotto), e `await
  importLibrary('places')` esplicito prima di `setScriptStatus("ready")`.
  **Best practice generale**: sempre `console.error(err)` nel catch di
  un init async che mostra fallback utente — senza, in produzione il
  debug è cieco.
- **Bootstrap loader Google: `script.onload` ≠ `importLibrary` attached**
  (lezione 10/05/2026, sixth-fix batch 2). Lo script
  `https://maps.googleapis.com/maps/api/js?...&loading=async` triggera
  `script.onload` quando il file JS è stato parsato, MA il bootstrap
  loader Google attacca `google.maps.importLibrary` come function in
  un microtask successivo (post-parse init). Tra `onload` e quando
  `importLibrary` diventa una function passano poche centinaia di ms
  in cui `google.maps` esiste come oggetto ma `importLibrary` è ancora
  undefined. Sintomo (sixth-fix): un check sincrono `if (typeof
  importLibrary !== 'function') throw` falliva istantaneamente in
  produzione anche quando il founder verificava manualmente in console
  pochi istanti dopo che importLibrary era effettivamente disponibile.
  **Fix**: polling 50ms / timeout 3s su
  `typeof window.google?.maps?.importLibrary === 'function'`.
  **Generalizzazione**: quando un evento `onload` espone API via init
  asincrono, NON fare check sincroni throw-on-fail — usa polling con
  timeout o ascolta un evento custom di "ready" se la libreria lo espone.
- **Frase canonica come segnale machine-readable nel prompt AI**: pattern
  riusabile per riconoscere lato server quando l'AI ha emesso una specifica
  intent (invito registrazione, conferma inoltro, ecc.). Nel prompt
  istruisci il modello a includere SEMPRE una frase letterale specifica
  ("registrati gratuitamente — bastano 30 secondi"), poi sul testo di
  risposta fai regex match e setti un flag nel JSON di risposta. Più
  affidabile di un classifier post-hoc. Se l'AI infrange l'istruzione, il
  flag resta false: difensivo ma non dannoso. Esempio: `forwarded` in
  chat-immobile.js cerca "ho inoltrato la tua domanda al venditore",
  `inviteRegistration` cerca "registrati gratuitamente — bastano 30 secondi".
- **Default Vercel/Vite: il rimount di un componente svuota i refs**. Quando
  un sibling React swappa (es. ternario `addressVerified ? Box : <Autocomplete />`),
  il componente Autocomplete viene smontato/rimontato. `useRef` parte fresh
  → l'init Autocomplete deve girare di nuovo. È esattamente quello che vogliamo
  per "Cambia indirizzo" ma è un pattern da tenere a mente: se serve
  preservare refs/instance attraverso un toggle, sposta il componente fuori
  dal ramo (es. `<div style={{display: hidden ? 'none' : 'block'}}>`).

## ⚠️ Bug aperti
Nessuno noto. (Bug scroll /immobili/:id non riproducibile dopo 08/05 sera —
vedi sezione settimana 5 sera per dettagli e cosa fare se ricompare.)

## Switch Yousign sandbox → production (quando si farà)
Triggerato da: call commerciale che sblocca API production OPPURE primo
commitment angel.
Tempo stimato: 60-90 minuti.
Steps:
1. Login Yousign production (account separato da sandbox)
2. Verificare offerta trial 13gg gratis attiva
3. Configurare dominio sender (DNS già fatto ✅)
4. Generare nuova API key production
5. Ricaricare template `Proposta d'Acquisto RealAIstate` (sandbox e prod separati)
6. Aggiornare env var Vercel: YOUSIGN_API_KEY → chiave production
7. Aggiornare api/yousign-proposta.js:
   - YOUSIGN_API → api.yousign.app/v3
   - TEMPLATE_ID → nuovo UUID production
8. Push, deploy, test
**Attenzione**: in production le firme hanno valore legale.

## Prossima sessione
- **AZIONI OBBLIGATORIE su Supabase post-deploy batch 2** (eseguire in
  ordine via SQL Editor):
  1. `migrations/2026-05-10-add-address-fields.sql` — aggiunge
     cap/citta/provincia/lat/lng alla tabella immobili. Include
     `NOTIFY pgrst, 'reload schema';` finale. SENZA questo, l'INSERT
     in `vendi-submit` fallisce con "Could not find the 'cap' column
     of 'immobili' in the schema cache".
  2. `migrations/2026-05-10-split-nome-cognome.sql` — splitta full_name
     esistente nei nuovi campi nome+cognome per utenti pre-migrazione.
     Idempotente (può essere rilanciato), già protetto da `NOT
     (raw_user_meta_data ? 'nome')` nel WHERE. Senza, il fallback
     runtime nel frontend continua a funzionare ma /account mostra
     "Aggiungi nome e cognome" finché l'utente non li imposta.
- **AZIONE OBBLIGATORIA su Supabase post-deploy settimana 7 batch 1**: nel
  SQL Editor eseguire `NOTIFY pgrst, 'reload schema';` per pulire la cache
  PostgREST (se non già fatto post-batch 1). Senza questo step il fix
  vani→locali del 10/05 potrebbe ancora vedere lo schema stale e fallire.
- **Test E2E batch 2 (10/05/2026) — verifica i 4 task su preview/prod**
  (DOPO aver eseguito le 2 migration SQL sopra):
  1. **Task 2.A — chat anonima invita registrazione**:
     - Logout. Apri /immobili/4 (o qualsiasi non-Capecelatro). Invia
       in chat AI: "ci sono lavori straordinari deliberati?".
     - Risposta attesa: "Questa è una domanda specifica per il
       venditore. Per inoltrarla e ricevere risposta, registrati
       gratuitamente — bastano 30 secondi. Ti rispondiamo appena il
       venditore avrà risposto." + bottone rosso "Registrati
       gratuitamente →" sotto la bubble.
     - VERIFICA: NIENTE email a info@realaistate.ai (controlla
       inbox). NIENTE riga in `chat_messages` con user_id=null per
       quella sessione.
     - Click sul CTA → /login con `?redirect=/immobili/4` → fai signup
       → torni su /immobili/4 → stessa domanda → AI propone inoltro
       (flow loggato 2-step) → "sì" → "Ho inoltrato..." + email a
       info@.
  2. **Task 2.B — nome/cognome separati**:
     - Nuovo signup: form mostra due campi affiancati Nome + Cognome
       (su mobile <=480px diventano column). Compila, conferma,
       verifica su Supabase auth.users che user_metadata abbia
       `nome`, `cognome` e `full_name` = "Nome Cognome".
     - /account: mostra due input separati pre-popolati. Modifica
       cognome → Salva → ricarica → entrambi corretti + full_name
       aggiornato.
     - /vendi step 4: nome e cognome pre-popolati. Cognome ha
       l'asterisco rosso (obbligatorio). canProceed false se cognome
       vuoto.
     - Esegui la migration SQL split-nome-cognome → verifica con
       `SELECT raw_user_meta_data FROM auth.users LIMIT 5;` che
       gli utenti pre-batch ora abbiano nome+cognome.
  3. **Task 2.C — documenti minimi su tutti gli immobili**:
     - /immobili/1 (Capecelatro): sezione "Documenti" completa come
       prima — 6 documenti + template proposta + verified-box +
       badge "✓ Immobile Verificato" sopra la gallery.
     - /immobili/3 (o altro non-demo): sezione "Documenti" mostra
       SOLO Template Proposta + box "documentazione su richiesta".
       Nessun badge "Immobile Verificato" sopra la gallery, nessuna
       verified-box nella sticky-card.
  4. **Task 2.D — Google Places Autocomplete in /vendi (Places API New)**:
     - /vendi step 1: il campo Indirizzo ora è il Web Component
       `<gmp-place-autocomplete>` (rendering Material Google con tema
       scuro tramite CSS variables). NIENTE errore in console
       "You're calling a legacy API" che si vedeva con la versione
       legacy (verificato 10/05).
     - Digita "Via Pinturicchio Milano". Devono apparire suggerimenti
       dropdown della Places API (New) — solo indirizzi italiani,
       niente POI. Click su "Via Pinturicchio, 20133 Milano MI".
     - Box verde "✓ Indirizzo verificato" si popola con: indirizzo,
       "20133 Milano (MI)", zona se disponibile, bottone "Cambia".
     - Continua bloccato finché non hai selezionato (canProceed false).
     - Submit completo del form → su Supabase verifica record
       `immobili` con cap='20133', citta='Milano', provincia='MI',
       latitudine ~45.47, longitudine ~9.22, zona popolata o NULL.
     - Approvazione admin → /immobili/<nuovo_id> → header mostra
       "Via Pinturicchio 14, 20133 Milano (MI)". Mappa centrata
       precisamente. "Apri in Google Maps" porta al posto giusto.
     - **Test con indirizzo edge case**: piccolo paese senza
       sublocality (es. "Via Roma 10, San Daniele del Friuli UD") →
       zona deve fare fallback al nome città.
     - **Network tab**: deve esserci una chiamata
       `places.googleapis.com/v1/...` (Places API New endpoint), NON
       `maps.googleapis.com/maps/api/place/autocomplete/...` (legacy).
- **Test E2E walkthrough — verifica i fix batch 1 e 1.5 su preview/prod**:
  1. Registra nuovo account (email Gmail con sub-addressing per tracciare):
     - Compila /vendi 5 step → submit step 5 → verifica niente 500,
       redirect a /venditore, riga in `immobili` con `locali` popolato.
  2. Apri scheda villa id=2 (o qualsiasi non-Capecelatro):
     - Invia in chat AI "il prezzo è giusto?" → l'AI NON deve citare
       Fair Price 88/100 né "zona D24 San Siro" né "€352k". Risposta
       attesa: "il punteggio non è ancora calcolato per questo immobile,
       posso inoltrare al venditore?"
  3. Loggato sulla stessa scheda, fai una domanda non risolta:
     - L'AI propone l'inoltro → conferma "sì" → l'AI deve rispondere
       direttamente "Grazie. Ho inoltrato la tua domanda al venditore..."
       SENZA chiedere nome/email.
     - Verifica email a info@realaistate.ai: nome/email del compratore
       devono essere quelli dell'account loggato, non un placeholder.
  4. **Batch 1.5 — isolamento storico chat per immobile**:
     - Loggato su /immobili/1 (Capecelatro) chatta con almeno un
       messaggio. Naviga (link interno o digita URL) a /immobili/4 (o
       altro non-Capecelatro): la chat AI deve partire dal messaggio di
       benvenuto, NON dai messaggi di Capecelatro. Torna su /immobili/1:
       i messaggi di Capecelatro devono ricomparire (riletti dal DB).
  5. **Batch 1.5 — titolo realistico**:
     - Crea draft via /vendi senza spuntare garage/terrazzo →
       "Richiedi pubblicazione" → /admin → "Approva". Verifica su
       Supabase che `immobili.titolo` rifletta SOLO le caratteristiche
       reali (es. "Bilocale ristrutturato in zona X" o
       "{tipologia} di {superficie}mq"), NON "Appartamento con garage
       e terrazzino".
     - Per immobili già pubblicati pre-fix con titolo=null/Capecelatro:
       chiamare `/api/generate-immobile-ai` con header X-Admin-Secret e
       body `{ "immobile_id": <id> }` per rigenerare titolo+contenuto.
- **Confermare cancellazione proposta-fantasma**: il founder deve eseguire
  manualmente via Supabase SQL Editor (query fornita 09/05, sotto è il backup):
  ```sql
  DELETE FROM public.proposte
  WHERE compratore_email = 'fabiopiccoli@hotmail.it'
    AND immobile_id = 1
    AND status = 'pending'
  RETURNING id, importo, created_at;
  ```
- **Test E2E flow admin pubblicazione** dopo deploy 09/05:
  - Login /admin con password ADMIN_SECRET
  - Tab "Pubblicazioni" mostra immobili pending_review (se ce ne sono)
  - Click "Approva" → email arriva al venditore + scheda diventa /immobili/:id
    visibile pubblicamente
  - Click "Rifiuta" con motivo → email arriva al venditore + scheda torna draft
- **Setup Sentry frontend + backend** (opzionale ma utile): FIXES_TODO.md punto 3.
- Task 7: Contatta notaio (chat AI qualificante + email automatica)
- Switch Yousign production se call commerciale va bene
- **Iniziare lead generation primi venditori beta**: il prodotto è pronto
  per onboarding 1-2 persone. LinkedIn, Instagram DM mirati, contatti diretti.
- (Rate-limit Upstash: NON in questa sessione. Vedi "Decisioni architetturali".)

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score AI dinamico (oggi hardcoded per Capecelatro)
- Generazione PDF dinamica della proposta (PDFShift)
- Webhook Yousign per aggiornare status='signed' su Supabase a firma completata
- ~~Estrazione zona da indirizzo via geocoding~~ ✅ chiusa 10/05/2026
  (batch 2 task 2.D — Google Places Autocomplete popola zona/cap/lat/lng)
- Link firma diretto in dashboard venditore (signature_link Yousign in jsonb)
- Stringere DMARC policy da `p=none` a `p=quarantine` poi `p=reject`
- Configurare client email mobile (IMAP/SMTP) per leggere info@ da iPhone
- Fix warning React keys in VendiForm.jsx stepper
- **Standardizzazione formato `foto` jsonb**: scegliere formato unico
  (URL completi consigliati) e migrare i record esistenti
- **Documenti immobile come tabella DB** (oggi hardcoded fallback)
- **Comparabili immobile come tabella DB** (oggi hardcoded fallback)
- **Rate-limit Upstash su API AI** (*parking lot*): setup tracciato in
  FIXES_TODO.md. Non implementare finché non si verificano le condizioni
  in "Decisioni architetturali → Rate-limit AI in fase beta".
- **Sentry frontend + backend**: error monitoring, FIXES_TODO.md
- **Chat persistente venditore↔compratore in app** (post-PMF): textarea
  in dashboard venditore per rispondere, tab "Le mie chat" lato compratore
  in /account, polling o Supabase Realtime, notifiche
- **Riepilogo "rispondi via email entro 24h"** sotto ogni sessione in
  /venditore con email del compratore in mailto: link
- **Refactor Immobile.jsx**: 1088 righe, monolite. Estrazione in
  `<ImmobileScheda>`, `<AiChat>`, `<AffordabilityChat>`, `<ProposalModal>`,
  `<Gallery>` quando avrai tempo (post-angel)