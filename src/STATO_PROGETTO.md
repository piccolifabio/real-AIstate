# RealAIstate — Stato del progetto
Aggiornato: 10/05/2026 (settimana 7 — fix walkthrough batch 1 + 1.5: vani→locali, AI no-leak, chat JWT, isolamento storico chat per immobile, AI genera titolo)

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

## File chiave
- src/HomePage.jsx — home page con Nav e CTA
- src/ScusePage.jsx — pagina scuse separata
- src/Privacy.jsx — privacy policy
- src/Termini.jsx — termini di servizio
- src/VenditoreDashboard.jsx — dashboard venditore (gated, multi-immobile,
  cover tollerante a entrambi i formati foto)
- src/AccountPage.jsx — account con nome modificabile + sezione "Le mie proposte"
- src/Immobile.jsx — scheda immobile DINAMICA da Supabase con fallback
  Capecelatro hardcoded per campi non ancora in DB (documenti/comparabili)
- src/Listing.jsx — pagina /compra dinamica da Supabase + fittizi "In arrivo"
- src/LoginPage.jsx — login/registrazione (con campo nome + Conferma email
  in signup; legge ?redirect= post-login con open-redirect protection)
- src/ProtectedRoute.jsx — gate auth, propaga destination come ?redirect=
- src/VendiForm.jsx — form 5 step con auth gate, salva immobile draft + lead.
  Step 4 contatti pre-popola nome/email da user; email read-only; conferma
  email obbligatoria
- src/Admin.jsx — pannello admin con tab Pubblicazioni | Scuse, bottoni
  Approva/Rifiuta sugli immobili pending_review
- src/AuthContext.jsx — gestione sessione + signUp con full_name + updateFullName
- src/supabase.js — connessione Supabase
- src/App.jsx — routing centrale con alias /compra/:id ↔ /immobili/:id
- api/_lib/auth.js — verifyJwt(req) helper condiviso
- api/_lib/cors.js — handleCors(req, res) restringe origin a whitelist
- api/_lib/escape-html.js — escapeHtml() per template email
- api/chat-immobile.js — chat AI con notifiche email (writes via service_role).
  JWT opzionale: se Bearer presente, system prompt riceve "Compratore
  identificato: <nome> <email>" e salta la richiesta nome/email; per
  anonimi il flow 3-step resta invariato
- api/proposta-submit.js — JWT-validated, blocca self-proposta, escape email
- api/yousign-proposta.js — firma digitale FEA via Yousign sandbox
- api/vendi-submit.js — form venditore JWT-auth, AI genera summary/punti/domande
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
- immobili — id (sequence), titolo, indirizzo, zona, prezzo, superficie,
  tipologia, piano, superficie_calpestabile, locali (ex vani), camere, bagni,
  anno_costruzione, classe_energetica, stato_immobile, foto (jsonb),
  descrizione, fair_price_score, ai_summary, punti_forza (jsonb array),
  domande_consigliate (jsonb array), status (draft/pending_review/published/
  sold/archived), venditore_user_id (FK auth.users), created_at.
  RLS attive con 4 policy.
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
- **AZIONE OBBLIGATORIA su Supabase post-deploy settimana 7**: nel SQL
  Editor eseguire `NOTIFY pgrst, 'reload schema';` per pulire la cache
  PostgREST. Senza questo step il fix vani→locali del 10/05 potrebbe
  ancora vedere lo schema stale e fallire.
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
- Estrazione zona da indirizzo via geocoding
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