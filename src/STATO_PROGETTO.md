# RealAIstate — Stato del progetto
Aggiornato: 12/05/2026 (settimana 7 — hotfix 6.6: coerenza URL completi per planimetria/ape su immobile id=6 + hardening safeStorageHref. Prima di questo: hotfix 6.5 documenti edit pre-popolazione, batch 6 fixes & polish — auth callback fix definitivo con explicit PKCE exchange + listener, endpoint preview-immobile service_role per anteprima admin/owner, copy hero /vendi meno aggressivo, label admin login, edit bozza venditore, elimina bozza con modal, modal rifiuto motivo obbligatorio + status='rejected' + migration rejection fields, email info@ post-approva/rifiuta, tabs filtro admin Pending/Pubblicati/Rifiutati/Bozze con counts)

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

### Settimana 7 — hotfix 6.6 ✅ — completata 12/05/2026 (coerenza URL completi planimetria/ape)
Verifica DB del founder post-hotfix-6.5 ha rivelato che il backfill per
id=6 ha inserito **path relativi** in `immobili.planimetria` / `ape`
(`planimetrie/...pdf`, `ape/...pdf`) — incoerente col pattern delle
foto che da batch 5 task 5.A usano URL completi
(`https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/...`).
Branch `hotfix/docs-url-coherence` (branchato da
`hotfix/edit-documenti-prepopulate`), 1 commit fix + 1 commit doc.
Tempo effettivo: ~15 min.

- [x] **Diagnosi via Explore agent** (12 consumer di planimetria/ape
  mappati):
  - Il codice è **fault-tolerant per path relativi (CASO A)**: render
    step 3 VendiForm mostra solo "✓ caricato" senza link clickable,
    INSERT/UPDATE salvano AS-IS, Storage cleanup skippa path che non
    matchano `startsWith(bucketBase)`, scheda pubblica non usa mai
    questi campi (hardcoded "Su richiesta").
  - Quindi tecnicamente NON c'era bug funzionale che bloccasse l'utente.
  - **Bug latente scoperto durante diagnosi**: `safeStorageHref` in
    api/vendi-submit.js (admin email "Nuovo venditore" per Fabio) usa
    `${supabaseStorageBase}/${encodeURI(path)}`. Se path è già un URL
    completo (caso post-batch-5: uploadFile ritorna getPublicUrl =
    full URL), il risultato era
    `.../documenti-venditori/https%3A%2F%2F...%2Fpublic%2F...` →
    link Brevo rotto. Founder non se ne era accorto perché probabilmente
    non clicca quei link, ma era rotto per ogni bozza submittata
    post-batch-5.

- [x] **Decisione: CASO B1 minimale** per i tre motivi:
  1. Coerenza con foto pattern (un format unico nel DB → debug più
     semplice in futuro)
  2. Storage cleanup di id=6 inizierà a funzionare: se walktest4 in
     futuro modifica planimetria/ape, il vecchio file viene cancellato
     da Storage (oggi resta orphan perché path relativo non matcha
     bucketBase nel cleanup)
  3. Fix bug latente safeStorageHref (admin email links)

- [x] **Fix in 2 parti, scope minimale**:
  1. **Migration** `migrations/2026-05-12-fix-docs-urls-immobile-6.sql`:
     UPDATE immobili WHERE id=6 prepende
     `https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/`
     ai path relativi di planimetria e ape. Idempotente con check
     `NOT LIKE 'https://%'`. Estensione documentata: per applicare a
     tutti gli immobili pre-hotfix sostituire `WHERE id=6` con
     `WHERE planimetria NOT LIKE 'https://%' OR ape NOT LIKE 'https://%'`.
  2. **api/vendi-submit.js** `safeStorageHref` hardening: se path è
     già URL assoluto (`http://` / `https://`), return as-is invece di
     prependere base URL. Path relativi legacy continuano a essere
     espansi col base (back-compat). Defense in depth.

- [x] **Niente modifiche frontend, niente modifiche INSERT/UPDATE
  backend**: `uploadFile()` in VendiForm già ritorna full URL via
  getPublicUrl (dal batch 5 task 5.A); l'INSERT su immobili (hotfix
  6.5) e l'UPDATE branch (batch 6.C) salvano AS-IS — coerentemente
  con la convention. Una volta convertito id=6 in URL completo, tutto
  il flow è uniforme.

- [x] **Build & QA**: `npm run build` pulita 1.59s. 1 commit fix +
  1 commit doc. Branch pushato su origin, **NIENTE merge automatico**.

**AZIONI FOUNDER REQUIRED post-merge hotfix 6.6** (UNA sola):
- Eseguire `migrations/2026-05-12-fix-docs-urls-immobile-6.sql` via
  Supabase SQL Editor. DOPO le 2 migration di hotfix 6.5
  (add-documenti-fields + backfill).

**Test E2E post-merge**:
1. **Verifica DB**:
   ```sql
   SELECT id, planimetria, ape FROM public.immobili WHERE id = 6;
   ```
   Atteso: entrambe le colonne con URL completi
   `https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/planimetrie/...pdf`
   e `.../ape/...pdf`.
2. **Edit mode invariato**: login walktest4 → Modifica id=6 → step 3
   → "✓ Planimetria già caricata" + "✓ APE già caricato" con × come
   prima (nessuna regressione UX).
3. **Edit submit invariato**: prosegui submit → planimetria/ape
   restano i full URL.
4. **Edit + nuovo PDF**: × planimetria → carica nuovo PDF → submit
   → DB ha nuovo URL completo, vecchio file RIMOSSO da Storage
   (verifica via Supabase Studio Storage → documenti-venditori →
   planimetrie/). Prima della migration questo non funzionava per
   id=6 (cleanup skippato per path relativo).
5. **Idempotenza migration**: rilancia la migration → 0 righe
   modificate (CHECK NOT LIKE 'https://%' skippa).

### Settimana 7 — hotfix 6.5 ✅ — completata 12/05/2026 (documenti edit pre-popolazione)
Test E2E post-batch-6 (12/05) ha rivelato un bug residuo critico in
modalità edit /vendi?edit=<id> (introdotta da batch 6 task 6.C): le foto
si pre-popolano nel form, ma planimetria PDF + APE PDF no. L'utente
arriva allo step 3 documenti e trova i campi vuoti — costretto a
ri-caricare anche se l'immobile li aveva (id=6). Bloccante: il gate
`return form.planimetria && form.ape` impedisce di proseguire e
testare l'UPDATE del submit. Branch `hotfix/edit-documenti-prepopulate`,
1 commit codice + 1 doc finale. Tempo effettivo: ~25 min.

- [x] **Root cause confermata via Explore**:
  - Tabella `public.immobili` NON ha colonne `planimetria` / `ape`.
    Migrations esistenti: cap/citta/provincia/lat/lng (10/05), foto
    (jsonb da launch), rejection_reason/rejected_at/rejected_by_email
    (12/05 batch 6.F). Nessuna colonna documenti.
  - `api/vendi-submit.js` INSERT venditori salva planimetria_url/ape_url
    su tabella legacy `venditori` (lead capture). INSERT immobili NON
    li include. Batch 6.C UPDATE branch NON li include nel PATCH.
  - `mapDbToForm` in src/VendiForm.jsx legge `db.planimetria` / `db.ape`
    → colonne non esistono → null → form vuoto → gate step 3 bloccato.
  - Scheda pubblica /immobili/:id renderizza solo placeholder "Su
    richiesta" hardcoded (DOCUMENT_TYPES in constants/) — niente
    regressione visiva post-hotfix: i PDF restano in Storage,
    indicizzati ora anche su immobili.*.

- [x] **Fix in 3 parti**:
  1. **Migration `migrations/2026-05-12-add-documenti-fields.sql`**: ADD
     COLUMN IF NOT EXISTS `planimetria TEXT`, `ape TEXT` + NOTIFY pgrst.
     Idempotente.
  2. **Migration `migrations/2026-05-12-backfill-documenti-immobile-6.sql`**:
     UPDATE immobili WHERE id=6 SET planimetria/ape = (SELECT
     planimetria_url/ape_url da venditori matchando per email
     auth.users.email == venditori.email, più recente). COALESCE
     preserva valori già popolati. Estensione documentata: per
     backfillare tutti gli immobili pre-hotfix sostituire WHERE id=6
     con WHERE planimetria IS NULL OR ape IS NULL.
  3. **api/vendi-submit.js**:
     - INSERT immobili payload: aggiungo `planimetria: dati.planimetria
       || null, ape: dati.ape || null`. Da ora ogni nuova bozza salva
       i PDF anche in immobili (single source of truth).
     - UPDATE branch (edit mode): logica preservation
       `dati.planimetria !== undefined ? dati.planimetria : existing.planimetria`
       — undefined preserva, null azzera (× user), stringa aggiorna.
     - Storage cleanup best-effort post-PATCH: se planimetria/ape sono
       cambiate e la vecchia URL è nel nostro bucket
       `documenti-venditori`, DELETE su Storage. Errori loggati,
       orphan tollerato (stesso pattern di 6.D elimina-bozza).

- [x] **Zero modifiche frontend**: `mapDbToForm`, render step 3
  (`typeof === "string"` check con "✓ Planimetria già caricata" / "✓
  APE già caricato" + ×), uploadFile passthrough strings, submit
  payload — tutto già pronto dal batch 6.C. Bastava che le colonne DB
  esistessero.

- [x] **Build & QA**: `npm run build` pulita 1.60s. 1 commit fix +
  1 commit doc finale su `hotfix/edit-documenti-prepopulate`. Branch
  pushato su origin, **NIENTE merge automatico su main**.

**AZIONI FOUNDER REQUIRED post-merge hotfix 6.5** (in ordine):
1. Eseguire `migrations/2026-05-12-add-documenti-fields.sql` via
   Supabase SQL Editor. Senza, INSERT/UPDATE su immobili fallisce
   con "Could not find the 'planimetria' column" (PostgREST cache miss).
2. Eseguire `migrations/2026-05-12-backfill-documenti-immobile-6.sql`
   per popolare planimetria/ape sull'immobile id=6 (test walktest4).
3. Niente env var nuove né force redeploy.

**Test E2E post-merge** (incognito o login walktest4):
1. **Verifica backfill DB**:
   ```sql
   SELECT id, planimetria, ape FROM public.immobili WHERE id = 6;
   ```
   Atteso: entrambe le colonne popolate con URL Storage.
2. **Edit pre-popolazione**: login walktest4 → /venditore → Modifica
   id=6 → step 3 → vedi "✓ Planimetria già caricata" + "✓ APE già
   caricato" con bottone × per ognuno. "Continua" abilitato.
3. **Edit senza toccare doc**: prosegui fino step 4 → cambia prezzo a
   €340.000 → submit → atteso: status='draft', prezzo aggiornato,
   planimetria/ape INVARIATE in DB.
4. **Edit rimuovi + nuovo**: Modifica id=6 → step 3 → × planimetria
   → carica nuovo PDF → submit → atteso: nuovo URL in DB, vecchio
   file rimosso da Storage (verifica via Studio Storage).
5. **Nuova bozza fresca**: crea nuovo /vendi (no edit) → submit →
   verifica DB: planimetria/ape popolate in immobili (non solo in
   venditori).

### Settimana 7 — batch 6 ✅ — completata 12/05/2026 (2 bug residui priority-1 + 5 task ex-rimandati + 2 polish)
Test E2E batch 5 del 12/05 mattina ha rivelato 2 bug residui critici
nonostante 3 iterazioni precedenti: auth callback redirect (terza
iterazione fallita) e anteprima admin/owner non funzionante neanche col
login Supabase corretto + email in whitelist VITE_ADMIN_EMAILS. Founder
ha confermato via diagnostica che (a) URL bar va direttamente in HOME
senza transitare /auth/callback durante il signup conferma email,
(b) per anteprima admin RLS Supabase su immobili blocca SELECT a monte
quindi isAdminUser() frontend è inutile. Batch 6 raggruppa: 2 bug
residui priority-1 + 5 task rimandati da batch 5 (edit bozza, elimina
bozza, tabs admin, modal rifiuto, email info@) + 2 polish (copy /vendi,
admin login UI). 9 task totali, branch `feat/batch-6-fixes-polish`, un
commit per task. Build pulita.

- [x] **Task 6.A (priority-1): bug auth callback redirect (terza iterazione)** ✅
  - Sintomo 12/05 in incognito: /immobili/1 → "Accedi per fare proposta"
    → tab Registrati → Gmail → click conferma → atterra in HOME, NON
    su /immobili/1. URL bar va direttamente in / senza mai mostrare
    /auth/callback.
  - Root cause più probabile: supabase-js 2.105.1 default flowType=PKCE.
    Email link contiene `?code=<auth_code>` query param (non hash).
    AuthCallback chiamava solo `getSession()` che con PKCE non garantisce
    l'exchange esplicito del code in tutti gli scenari. Inoltre il
    template email Supabase potrebbe non usare `{{ .ConfirmationURL }}`
    (impossibile verificare senza ispezionare il Dashboard del founder).
  - **Fix difensivo che copre tutti gli scenari**:
    - `AuthCallback.jsx` rewrite useEffect: se `?code=` in URL chiama
      esplicitamente `supabase.auth.exchangeCodeForSession(code)` in
      try/catch. Errore "Auth code is invalid or already used" → success
      silenzioso (supabase-js può averlo già scambiato auto).
    - Se `?error=` esplicito → mostra UI errore + bottone "Vai al login".
    - `getSession()` dopo l'exchange. Se session esiste → navigate
      immediato. Se non esiste subscribe a `onAuthStateChange` listener
      che naviga al primo SIGNED_IN/INITIAL_SESSION. Fallback timer 800ms
      naviga comunque (la destination gestirà come "non loggato").
    - **Logging diagnostico** persistente in `localStorage` chiave
      `rai:auth-callback-debug` con array (max 5 entries FIFO) di event
      JSON. Se bug persiste, founder può dumpare da DevTools.
    - `HomePage.jsx` al mount: se esiste `rai:auth-callback-debug` con
      ultima entry < 60s fa E getSession ritorna null E pathname='/',
      logga in `rai:home-fallback-debug`. Cattura il caso "Supabase non
      usa emailRedirectTo affatto" che non passa mai da AuthCallback.
  - **AZIONE FOUNDER REQUIRED su Supabase Dashboard prima del test**:
    - Auth → URL Configuration → Site URL = `https://realaistate.ai`
      (NO trailing slash)
    - Auth → Email Templates → "Confirm signup" → body HTML del link
      deve contenere `{{ .ConfirmationURL }}` (non URL hardcoded)
    - Whitelist Redirect URLs già confermata corretta dal founder 12/05

- [x] **Task 6.B (priority-1): bug anteprima admin/owner non funziona** ✅
  - Sintomo 12/05: founder loggato con `fabiopiccoli@hotmail.it` (email
    in VITE_ADMIN_EMAILS sia Vercel che .env.local) apre /immobili/6
    (draft, user_id ≠ founder) → "Immobile non disponibile" invece della
    scheda preview attesa dal batch 5 task 5.G/5.I.
  - Root cause: RLS Supabase su `immobili` filtra `status='published'`
    a livello DB per anon-key client. La fetch in Immobile.jsx ritorna
    0 righe → immobileDb resta null → "non disponibile". `isAdminUser()`
    frontend è inutile perché RLS blocca a monte. Stesso problema per
    owner sulle proprie bozze (RLS forse permette solo a venditore di
    leggere il proprio published, non drafts — comportamento inferito
    da behavior, RLS policies documentate in ARCHITECTURE_REVIEW.md ma
    non in `migrations/*.sql`).
  - **Decisione di design**: endpoint API service_role + check email
    server-side, NIENTE migration RLS. Più reversibile, RLS resta tight.
    Single source of truth: `ADMIN_EMAILS` env var server-side (separata
    da `VITE_ADMIN_EMAILS` UI-only). Per il founder beta in pratica:
    stesso valore in entrambe.
  - `api/admin/[op].js` refactor:
    - Auth check da globale x-admin-key a **per-op map**: `OPS = { ...,
      'preview-immobile': { auth:'jwt', handler: previewImmobile } }`.
      Dispatcher fa method check, poi auth dispatch (admin-key OR jwt),
      poi chiama handler con `(req, res, env, ctx)`.
    - Helper `checkJwt`: estrae Bearer token, valida via
      `${SUPABASE_URL}/auth/v1/user`, ritorna `{ userId, userEmail }`.
    - Nuovo op `preview-immobile` (POST, auth=jwt): valida JWT → fetch
      immobile via service_role → autorizza se `userId === venditore_user_id`
      OR `userEmail in ADMIN_EMAILS_SERVER` → ritorna immobile o 403/404.
  - `src/lib/previewImmobile.js` (nuovo): `fetchImmobilePreview(id)`
    legge JWT da `supabase.auth.getSession()`, POST endpoint con
    `Authorization: Bearer`. Ritorna `{ immobile, error }`.
  - `src/Immobile.jsx` fetch logic: dopo la fetch RLS standard, se
    `data === null` E `user.id` esiste, ricade su `fetchImmobilePreview`.
    Se ritorna immobile, set `immobileDb`. Tutto il rendering banner
    giallo + sticky CTA owner/admin funziona già out-of-the-box dal
    batch 5. Anonimi: nessun fallback (endpoint richiede JWT).
  - **AZIONE FOUNDER REQUIRED**: aggiungere env `ADMIN_EMAILS=fabiopiccoli@hotmail.it`
    server-side in Vercel (Production + Preview + Development) e in
    `.env.local`. Force redeploy "no cache" se env aggiunta post-deploy.

- [x] **Task 6.H: copy hero /vendi non-loggato meno aggressivo** ✅
  - `src/VendiForm.jsx` linea 498 (branch `if (!user)`). Sostituito:
    - Vecchio: "Niente agenzia. Niente valutazioni gonfiate per
      strappare l'esclusiva. L'AI confronta il tuo prezzo con i dati
      ufficiali OMI, analizza le tue foto, pubblica il tuo annuncio. Tu
      decidi, noi ti diamo gli strumenti."
    - Nuovo: "Niente agenzia. L'AI confronta il tuo prezzo con i dati
      ufficiali OMI, analizza le tue foto, pubblica il tuo annuncio. Noi
      ti diamo gli strumenti, tu decidi."
  - Rimosso "Niente valutazioni gonfiate per strappare l'esclusiva"
    (tono troppo aggressivo per /vendi — l'utente sta dando fiducia, non
    attaccando il sistema). Invertito ordine "Tu decidi" / "noi ti diamo
    gli strumenti": chiusura su "tu decidi" enfatizza autonomia.

- [x] **Task 6.I: UX /admin login con label + helper text** ✅
  - `src/Admin.jsx` login screen (linee 135-185). Aggiunti:
    - Helper text sotto subtitle "Area amministrativa": "Inserisci la
      password fornita dal team RealAIstate. Non è richiesta una email
      — è un accesso condiviso amministratore."
    - Label uppercase sopra input: "Password amministratore" (con
      htmlFor + id per accessibilità).
  - Placeholder "Password" invariato. Nuovi stili `.admin-login-helper`
    / `.admin-login-label` coerenti col resto della UI (var(--muted),
    letterSpacing 0.08em uppercase).
  - OPZIONE A scelta come da spec. OPZIONE B (vero login email/password
    + whitelist VITE_ADMIN_EMAILS) è in backlog post-PMF.

- [x] **Task 6.C: modifica bozza venditore via /vendi?edit=<id>** ✅
  - Venditore può modificare bozze esistenti (status=draft o rejected)
    senza ricreare l'immobile da zero. Draft → save mantiene status.
    Rejected → save fa re-submit automatico (status → pending_review)
    così admin rivede.
  - `src/VenditoreDashboard.jsx`: bottone "Modifica" (outline) visibile
    per draft+rejected. Link a `/vendi?edit=<id>`. Non visibile per
    pending_review/published/sold/archived.
  - `src/VendiForm.jsx`:
    - Helper `mapDbToForm(db)`: mappa colonne DB immobili → keys del
      form (db.prezzo → form.prezzo_desiderato, db.superficie →
      form.superficie_catastale, db.locali → form.vani, db.stato_immobile
      → form.stato).
    - useEffect `?edit=<id>`: fetch via Supabase, valida ownership +
      status, poi setForm + editingId.
    - Gate UI: editLoading (spinner), editError (schermata "Impossibile
      modificare" + link dashboard).
    - `uploadFile()` riconosce stringhe (URL già caricato) e le passa
      through senza re-upload. Permette di mantenere foto/planimetria/
      ape esistenti.
    - Render foto/planimetria/ape: typeof check per scegliere src='url'
      (esistente) vs URL.createObjectURL(File) (nuovo upload).
    - Submit: se editingId, aggiunge `{ _mode:'update', immobile_id }`
      al payload.
    - Hero step 0 + success screen: copy dedicato edit mode.
  - `api/vendi-submit.js`: branch `_mode === 'update'` prima della
    INSERT venditori/immobili. Valida ownership + status (solo draft/
    rejected). PATCH immobili (no venditori legacy, no emails). Status:
    rejected → pending_review, draft → draft.
  - Foto rimosse dal form NON triggerano delete su Storage: file restano
    orphan. Cleanup batch in backlog post-MVP. Trade-off accettato.

- [x] **Task 6.D: elimina bozza con modal conferma + asset cleanup** ✅
  - Venditore può cancellare definitivamente bozze proprie (status=draft
    o rejected). Operazione irreversibile, conferma via modal.
  - `api/admin/[op].js` nuovo op `elimina-bozza` (POST, auth=jwt, owner-only):
    - Body `{immobile_id}`. Authorize: `userId === venditore_user_id`
      AND status IN ('draft','rejected'). Altri stati → 409.
    - DELETE riga immobili via service_role. Se fallisce, 500 + abort.
    - **Storage cleanup best-effort**: per ogni URL foto/planimetria/ape
      che punta al bucket `documenti-venditori`, DELETE su /storage/v1.
      Errori loggati come `asset_cleanup_warnings`, NON bloccano response.
      Razione: meglio file orphan in Storage che riga orphan in DB.
      Cleanup batch in backlog.
  - `src/VenditoreDashboard.jsx`:
    - Stato `eliminandoImmobile` (immobile in attesa conferma) +
      `eliminandoLoading`.
    - Bottone "Elimina bozza" rosso destructive (rgba red 10% bg, border
      30%, text red) accanto a "Modifica" per draft/rejected.
    - Modal inline (no astrazione — unico modal nella dashboard):
      backdrop blur scuro click-to-dismiss, titolo Bebas + body con
      indirizzo in evidenza, 2 bottoni Annulla (outline) + Elimina
      definitivamente (rosso primario). Loading state.

- [x] **Task 6.F: modal rifiuto admin con motivo obbligatorio + status='rejected'** ✅
  - Sostituisce `prompt()` di rifiuto con modal dedicato. Motivo
    obbligatorio (10-500 char), validato sia frontend che backend.
    Status passa da 'draft' (era così pre-batch 6) a 'rejected' con
    motivo + timestamp + admin persistiti in DB.
  - Nuova migration `migrations/2026-05-12-add-rejection-fields.sql`:
    ALTER TABLE public.immobili ADD COLUMN IF NOT EXISTS
    `rejection_reason TEXT`, `rejected_at TIMESTAMPTZ`,
    `rejected_by_email TEXT`. Idempotente, NOTIFY pgrst finale.
  - `api/admin/[op].js` op `rifiuta`:
    - Validation motivo: obbligatorio min 10 char (sotto è poco utile)
      max 500 char (sopra sospetta paste di documenti). Errori 400.
    - PATCH immobile: status='rejected', rejection_reason=<motivo>,
      rejected_at=now(), rejected_by_email='admin' (placeholder finché
      /admin login non passa a vero login Supabase con OPZIONE B).
    - Email venditore: subject "Il tuo immobile non è stato approvato"
      (era "Modifiche richieste sul tuo annuncio"), CTA "Modifica e
      ripubblica →" che linka /venditore.
  - `src/Admin.jsx`: stato rejectModal/rejectMotivo/rejectSubmitting.
    Modal full-screen con backdrop blur, textarea con label, counter
    "X/500 caratteri — min 10" cambia colore se fuori range. Bottone
    "Conferma rifiuto" disabled se motivo invalido.
  - **AZIONE FOUNDER REQUIRED**: eseguire la migration via SQL Editor
    Supabase. Senza, il PATCH fallisce con "Could not find the
    'rejection_reason' column".

- [x] **Task 6.G: email notifica a info@ post-approva/rifiuta** ✅
  - Helper `sendAdminNotificationEmail` in api/admin/[op].js: subject
    "Immobile approvato/rifiutato: <indirizzo>", body HTML riepilogativo
    (ID, indirizzo, prezzo, venditore, data ora, motivo se rifiuto,
    link Apri scheda + link Pannello admin). Sender info@realaistate.ai,
    to info@realaistate.ai.
  - Chiamato in op `pubblica` e `rifiuta` dopo email venditore (e dopo
    PATCH DB). Best-effort: errori NON bloccano response (notifica è
    informativa, fallirla non deve far apparire l'operazione come
    fallita al founder che vede già feedback nel pannello).
  - Aggiunto `admin_email_sent` al payload response per debug.

- [x] **Task 6.E: tabs filtro lista admin (Pending/Pubblicati/Rifiutati/Bozze)** ✅
  - Oggi admin Pubblicazioni mostra solo pending_review e dopo
    approva/rifiuta si svuota. Con tabs il founder naviga tutti gli
    stati + vede conteggi.
  - `api/admin/[op].js` op `immobili` estensione:
    - Query param `?status=pending_review|published|rejected|draft|all`
      (default pending_review per back-compat).
    - Query param `?counts=1` → `{counts: {pending_review:N, ...}}`
      invece della lista. Implementato con SELECT id per status in
      parallel + count lato server (immobili sono pochi per MVP).
  - `src/Admin.jsx`:
    - Stato `statusTab` (default 'pending_review') + `counts`.
    - `fetchData/refreshImmobili` accettano statusFilter, caricano
      counts in parallelo. Refresh post-approva/rifiuta aggiorna entrambi.
    - Sub-tabs row sotto "Pubblicazioni": 4 button con badge count.
      Tab attivo background rosso. Empty state dedicato per ogni status.
    - Per riga rejected: rejection_reason in italic muted sotto indirizzo.
    - Link "Apri scheda" usa fix 6.B per preview anche su non-published.
    - Approva/Rifiuta visibili solo su pending_review.
    - Header stats "Pending review N" legge counts.pending_review
      (prima leggeva immobili.length che ora cambia col tab).

- [x] **Build & QA**: `npm run build` passa pulita ad ogni commit
  (1.5-1.9s, 0 errori, solo warning chunk size standard). 9 commit
  atomici + 1 doc finale su `feat/batch-6-fixes-polish`. Branch pushato
  su origin, **NIENTE merge automatico su main**.

**AZIONI FOUNDER REQUIRED post-merge batch 6** (in ordine):
1. **Migration SQL** via Supabase SQL Editor: eseguire
   `migrations/2026-05-12-add-rejection-fields.sql` (per task 6.F).
2. **Env var server-side**: aggiungere `ADMIN_EMAILS=fabiopiccoli@hotmail.it`
   in Vercel (Production + Preview + Development) e in `.env.local`
   locale (per task 6.B). Separata da VITE_ADMIN_EMAILS che resta UI-only.
3. **Supabase Dashboard**: verificare Auth → URL Configuration → Site
   URL = `https://realaistate.ai` (NO trailing slash). Verificare
   Email Templates → "Confirm signup" body HTML contiene
   `{{ .ConfirmationURL }}` (per task 6.A).
4. **Force redeploy Vercel "no cache"** se env var aggiunta post-deploy.

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

### Settimana 7 — batch 2 — rollback a Places API legacy ✅ — completata 10/05/2026 (ottavo fix)
Dopo 7 fix consecutivi sul Web Component `<gmp-place-autocomplete>` (Places
API New) — migration legacy→New, mount race, Place Type `address`→
`street_address`, JSX vs `new+appendChild`, `importLibrary` upgrade-readiness,
polling sul gap `script.onload`→`importLibrary`, e tutti i corollari — in
produzione restavano edge case di upgrade-readiness non risolti col setup
Vite + React + custom element via `loading=async + importLibrary`. Decisione
di prodotto: ABBANDONARE Places API New per l'MVP e tornare al pattern
`google.maps.places.Autocomplete` legacy su `<input>` HTML standard. Il
founder ha abilitato la Places API legacy sul progetto Google Cloud
RealAIstate (ora ci sono 4 API attive: Maps Embed, Maps JavaScript, Places
API New, Places API legacy).

- [x] **Rollback completo a `google.maps.places.Autocomplete` legacy** ✅
  - **Razionale**: il pattern legacy è documentato in 100k tutorial dal
    2020 ed è usato da milioni di siti senza edge case noti. Google ha
    annunciato deprecation ma supporto operativo fino al 2027+ (ampio
    margine per la finestra MVP/pre-PMF). Il refactor a Places API New
    si riprenderà in futuro quando arriverà un wrapper React-friendly
    maturo (es. `@vis.gl/react-google-maps`) o quando si avvicinerà la
    sunset reale.
  - **VendiForm.jsx — codice rimosso**:
    - `waitForImportLibrary` (polling 50ms/3s su `importLibrary` attached)
    - Tutti i riferimenti a `google.maps.importLibrary("places")`
    - `customElements.whenDefined("gmp-place-autocomplete")`
    - Listener `gmp-select` con `event.placePrediction.toPlace()` +
      `place.fetchFields({ fields: [...] })`
    - Tag JSX `<gmp-place-autocomplete>` con CSS variables `--gmp-mat-*`
    - Mount programmatico con container ref + property dinamiche array
    - Effect split (1: load script, 2: configure picker)
    - Parsing camelCase `addressComponents` con `longText`/`shortText`
  - **VendiForm.jsx — codice aggiunto**:
    - `loadGoogleMapsScript`: URL legacy classico
      `https://maps.googleapis.com/maps/api/js?key=KEY&libraries=places&language=it`
      (niente `loading=async`, niente `v=weekly`).
    - Check "già caricato": `typeof google.maps.places.Autocomplete ===
      'function'` (la classe Autocomplete è il segnale di readiness).
    - `parsePlace` riscritto per struttura legacy:
      `address_components` (snake_case) con `long_name`/`short_name`/`types`,
      `place.geometry.location.lat()/lng()` (funzioni sul LatLng object),
      `place.formatted_address`.
    - `AddressAutocomplete` riscritto: `useRef` su `<input className="vendi-input">`
      HTML standard. Effect istanzia
      `new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'it' },
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry']
      })` e aggancia listener `place_changed` che chiama
      `autocomplete.getPlace()` → `parsePlace()` → `onSelect`.
      Cleanup: `google.maps.event.removeListener(listener)`.
    - Callback in ref (`onSelectRef`/`onUserTypeRef`) per usare valori
      freschi nel listener senza ri-agganciarlo ad ogni render.
    - `onChange` su input chiama `onUserType` (alimenta `addressTouched`
      come prima).
  - **UX invariata**: riquadro verde "✓ Indirizzo verificato" con cap+
    città+provincia, bottone "Cambia" che resetta selezione, validazione
    `canProceed` step 0 richiede `addressVerified`, errore inline
    "Seleziona un indirizzo dai suggerimenti", disclaimer "Powered by
    Google" sotto.
  - **Schema DB invariato**: cap/citta/provincia/latitudine/longitudine
    già presenti da migration `2026-05-10-add-address-fields.sql`.
  - **api/vendi-submit.js invariato**: già accetta i campi indirizzo
    strutturati (validazione 400 se cap/citta/provincia mancanti).
  - **src/Immobile.jsx invariato**: nessuna modifica al rendering.
  - Build pulita (`vite build` 1.73s, 0 errori, 0 nuovi warning). Branch
    `rollback/places-api-legacy`.

### Settimana 7 — batch 4 ✅ — completata 11/05/2026 (walkthrough fixes UX/copy + 1 bug auth)
Walkthrough UX 11/05 mattina in incognito sui flussi 1.1-1.7. Emersi 1 bug
auth confermato + 5 modifiche copy/UX + 1 verifica. Branch
`feat/batch-4-walkthrough-fixes`, un commit per task. Tempo effettivo: ~80 min.

- [x] **Task 4.A: bug redirect post conferma email — emailRedirectTo** ✅
  - Sintomo walkthrough: utente arriva su `/login?redirect=/immobili/1`,
    si registra, riceve mail Supabase, clicca link → torna in HOME invece
    che su /immobili/1.
  - Causa: `supabase.auth.signUp` non riceveva `options.emailRedirectTo`
    → Supabase fa fallback al Site URL configurato in dashboard (root).
  - Fix:
    - `src/LoginPage.jsx` handle(): costruisce `emailRedirectTo` come
      `${window.location.origin}${redirectTo}` solo in modalità register.
      `redirectTo` è già passato per `safeRedirect` (solo path relativi
      che iniziano con "/", no domini esterni — open-redirect protection
      già esistente dal batch 2 task 2.A).
    - `src/AuthContext.jsx` signUp(): firma estesa con quinto parametro
      opzionale `emailRedirectTo`, spread condizionale dentro options.
  - **AZIONE FONDER REQUIRED su Supabase Dashboard** (commento esplicito
    in AuthContext): in "Auth → URL Configuration → Redirect URLs"
    devono essere whitelistati `https://realaistate.ai/**` e
    `https://*.vercel.app/**`. Senza whitelist Supabase ignora
    emailRedirectTo e fa fallback al Site URL.
  - Test post-deploy (founder): logout → incognito su /immobili/1 →
    "Accedi per fare proposta" → tab Registrati → submit con email nuova
    (+walktest5@gmail.com) → click link conferma in Gmail → atteso ritorno
    su /immobili/1 loggato, non in home.

- [x] **Task 4.B: subtitle "Pubblica. Vendi. Incassa." su box "Stai vendendo"** ✅
  - `src/HomePage.jsx` array `cards`, primo elemento: aggiunto
    `name: "Pubblica. Vendi. Incassa."` per simmetria con gli altri 3 box
    (Stai comprando, Sei un investitore, Sei un professionista) che hanno
    già `name`. Render via il condizionale `{c.name && ...}` esistente.
  - Formulazione voluta con "Vendi" al centro (non "Incassa" diretto come
    la vecchia "Pubblica. Incassa. Tutto." rimossa in batch 3 task 3.B
    perché ingannevole).

- [x] **Task 4.C: verifica + bump leggibilità "(in costruzione)"** ✅
  - `src/HomePage.jsx` linee 218-222: il flag `inConstruction:true` e il
    render del muted erano già in codice dal batch 3 task 3.B. **Il
    problema riportato dal founder è di deploy/cache**, non codice.
  - Mitigazione: alzata leggibilità del muted (font-size 0.78rem → 0.82rem
    ≈ 13.1px desktop; opacity 0.4 → 0.6). Resta italic e di colore
    rgba(247,245,240,...) coerente col resto.
  - Comunicato al founder: hard refresh Ctrl+F5 su realaistate.ai, o
    verifica che il merge del branch `feat/copy-ux-polish` batch 3 sia
    effettivamente passato su main.

- [x] **Task 4.D: claim "X% in meno" uniformato a 80%** ✅
  - `src/HomePage.jsx` hero-cost: i due claim verdi
    `<div className="cost-num green">` (uno sotto "SE COMPRI", uno sotto
    "SE VENDI") erano rispettivamente "90% in meno" e "50% in meno".
    Entrambi sostituiti con "80% in meno". Tutto il resto (classe, layout,
    colore green, label "Con RealAIstate") invariato.

- [x] **Task 4.E: box dedicato Fair Price Score in home** ✅
  - `src/App.jsx` aggiunto blocco CSS `.fps-section / .fps-box / .fps-eyebrow
    / .fps-title / .fps-desc / .fps-cta` (collocato tra HERO COST e EXCUSES
    nel global style). Stile coerente col design system: bordo
    `rgba(217,48,37,0.4)` rosso brand soft, barra rossa solida 3px a
    sinistra come accento, background sub-rosso `rgba(217,48,37,0.04)`,
    border-radius 4px (stesso del resto), padding 2.5rem 2.8rem desktop /
    2rem 1.4rem mobile, max-width 880px, font Bebas Neue sul titolo.
  - `src/HomePage.jsx` nuova `<section className="fps-section">` inserita
    DOPO `</section>` del hero e PRIMA di `<section className="excuses">`.
    Contenuto: eyebrow "Fair Price Score", titolo "Il prezzo, oggettivo.",
    descrizione 2 frasi sulla base OMI Agenzia Entrate (trasparente,
    verificabile, stesso metro per tutti), CTA `<a href="/metodologia">Vedi
    la metodologia →</a>` (route già esistente in App.jsx).
  - **Motivazione di design**: il Fair Price Score è uno dei pochi punti
    distintivi del prodotto vs portali italiani concorrenti. Va valorizzato
    in home, non nascosto in pagina secondaria.

- [x] **Task 4.F: placeholder geometrico per card "In arrivo" su /compra** ✅
  - `src/Listing.jsx` nuovo componente `ComingSoonPlaceholder()` — SVG
    inline con viewBox 400×220, preserveAspectRatio xMidYMid slice, riempie
    `.prop-card-img` (200px). Composizione:
    - Sfondo solido `#0a0a0a` (color-background sito).
    - 9 rettangoli verticali stilizzati di altezze variabili
      (`#141414/#1a1a1a/#1c1c1c`) → skyline astratto.
    - 2 linee orizzontali subtle a 178/198 (`rgba(247,245,240,0.04-0.05)`)
      per dare ritmo orizzontale.
    - 2 "finestre" rosse `#d93025` (e una 40% opacità) sul rettangolo
      centrale come singolo accento brand.
    - Watermark "IN ARRIVO" in Bebas Neue 13px, letterSpacing 3.5,
      `rgba(247,245,240,0.22)` in alto al centro.
    Sostituisce il vecchio `prop-card-img-placeholder` + iconcina generica
    su `PropCardFake`. Il badge "In arrivo" sopra resta intatto.
  - CSS: `.prop-card.fake` opacity 0.5 → 0.78 (il body ha ora .6 separata
    via `.prop-card.fake .prop-card-body`) — il placeholder non viene più
    bruciato dall'opacity globale della card.
  - **Motivazione di design**: tono coerente col brand serio/bold del sito.
    Niente foto stock, niente illustrazioni casa carine, niente vibe
    template-shopify.

- [x] **Task 4.G: rewrite verdetto negativo chat affordability** ✅
  - `api/chat-affordability.js` system prompt sezione VERDETTO. Il copy
    precedente era 1 sola riga: "Se non sostenibile: sii onesto e
    costruttivo — spiega cosa manca". Risultato AI: risposte secche
    scoraggianti, tono da consulente bancario.
  - Nuova struttura vincolante in 3 blocchi netti:
    1. **Verdetto + numeri** senza addolcire (DTI%, soglia 35%, rata
       stimata €X).
    2. **2-3 leve concrete** calcolate sui SUOI dati (anticipo, durata
       mutuo, prezzo target, zona alternativa -15%) — niente leve
       generiche o inventate.
    3. **Chiusura non-pressante** in 1 riga: varianti suggerite ("Vuoi
       che proviamo con parametri diversi?" / "Rivedi i tuoi numeri
       quando vuoi e ripartiamo." / "Posso ricalcolare con un anticipo o
       un prezzo target diverso.").
  - Bandite esplicitamente le formule paternaliste: "ci dispiace",
    "purtroppo", "non te lo posso consigliare", "spero di esserti stato
    utile".
  - Lasciato invariato il resto del flow (sostenibile, contratto
    determinato/autonomo). Solo verdetto negativo/borderline modificato,
    come da richiesta task.

- [x] **Build & QA**: `npm run build` passa pulito (1.7s, 0 errori, solo
  il warning standard sul chunk size già esistente dal batch 3).
  7 commit atomici su `feat/batch-4-walkthrough-fixes` + 1 doc.
  Branch pushato su origin, **NIENTE merge automatico su main** — il
  founder verifica preview Vercel e mergia manualmente.

### Settimana 7 — hotfix 4.5 ✅ — completata 11/05/2026 (Google Places callback non aggiorna stato React)
Seconda regressione del flow indirizzo /vendi in 2 giorni dopo il rollback
del 10/05 a Places API legacy. Sintomo: dropdown Google funziona, click su
suggerimento popola l'input, MA riquadro verde "✓ Indirizzo verificato"
non compare, errore inline "Seleziona un indirizzo dai suggerimenti per
continuare." resta visibile, bottone Continua disabilitato. Bloccante per
onboarding venditori beta. Branch `hotfix/vendi-places-callback`, 1 commit.
Tempo effettivo: ~25 min.

- [x] **Diagnosi via console.log temporaneo** ✅
  - Aggiunti due `console.log("[Places DEBUG] ...")` nel listener
    `place_changed` di `AddressAutocomplete` (`src/VendiForm.jsx` linea
    284): uno sul `place` raw + uno su `parsed` con flag `*_ok` per
    ciascuno dei 4 campi gate (indirizzo/citta/cap/provincia).
  - Test in incognito su `localhost:5173/vendi` step 0 con query
    "Viale Murillo Milano" → log mostra: `address_components` ritornato
    da Google contiene `route` ("Viale Murillo"), `locality` ("Milano"),
    `administrative_area_level_2` ("MI") MA non `postal_code` né
    `street_number`. Conseguenza: `parsed.cap = null` → check
    `parsed.cap` al gating fallisce → `onSelectRef.current?.(null)`
    → `handleAddressSelect(null)` → `addressVerified: false`.

- [x] **Fix: CAP opzionale al gating** ✅
  - `src/VendiForm.jsx` linea 287: condizione cambiata da
    `parsed.indirizzo && parsed.citta && parsed.cap && parsed.provincia`
    a `parsed.indirizzo && parsed.citta && parsed.provincia`. Il CAP
    resta opzionale: viene comunque salvato in form state se Google lo
    ritorna (`cap: parsed.cap || ""` in `handleAddressSelect`), altrimenti
    resta stringa vuota. ~~Il backend `api/vendi-submit.js` (linee 83-92)
    già accetta cap vuoto se gli altri campi indirizzo sono presenti
    (defense in depth).~~ **[CORRETTO in hotfix 4.6]**: questa analisi era
    errata, il backend ha la validazione opposta (rifiuta 400 se cap
    vuoto). Conseguenza: 4.5 ha spostato il bug da step 0 a step 4. 4.6
    re-introduce il CAP come required al gating + messaggio UX dedicato.
  - Commento inline aggiunto per documentare la motivazione: vie lunghe
    come Viale Murillo attraversano più CAP, Google non assegna un
    `postal_code` univoco al Place a livello di route.
  - Rimossi i due `console.log("[Places DEBUG] ...")` di debug.

- [x] **Build pulita** (`vite build` 1.77s, 0 errori, solo il warning
  standard sul chunk size già esistente dal batch 3). Branch pushato
  su origin, **NIENTE merge automatico su main** — il founder verifica
  preview Vercel e mergia manualmente.

**Prevenzione (post-MVP)**: seconda regressione del flow indirizzo /vendi
in 48h (la prima era il rollback del 10/05 da Places API New a legacy,
batch 2). La soluzione strutturale è un test E2E (Playwright) sul submit
/vendi che copra: digitazione indirizzo, selezione suggerimento, verifica
`addressVerified=true`, click Continua, avanzamento step. Fuori scope per
questo hotfix — aggiunto come voce nella sezione "Da fare post-MVP".

### Settimana 7 — hotfix 4.6 ✅ — completata 11/05/2026 (Google Places non popola CAP per alcune vie — UX dedicata)
Terza regressione consecutiva del flow Places in 48h (rollback 10/05 +
hotfix 4.5 + ora 4.6). Sintomo: dopo 4.5 (CAP rimosso dal gating step 0),
l'utente che selezionava un indirizzo senza CAP otteneva il riquadro verde
"✓ Indirizzo verificato" ma al submit step 4 il backend
(`api/vendi-submit.js` linee 88-92) rifiutava con 400 "cap, città e
provincia sono obbligatori". Causa radice: errore di analisi nel hotfix
4.5 — avevo scritto che il backend accettava cap vuoto, ma in realtà ha
una validazione esplicita opposta. Branch
`hotfix/vendi-places-cap-extraction`, 1 commit. Tempo effettivo: ~30 min.

- [x] **Diagnosi rapida del bug 4.5** ✅
  - Letto `api/vendi-submit.js` linee 83-92: `if (!dati.cap || !dati.citta
    || !dati.provincia) return 400`. Il backend RICHIEDE il CAP. La nota
    "accetta cap vuoto" nel commit message di 4.5 era errata, basata su
    un'analisi superficiale non verificata di persona prima del commit.
  - Conseguenza pratica: 4.5 ha spostato il bug da step 0 (no riquadro
    verde) a step 4 (errore 400 al submit), peggiorando l'UX perché
    l'utente perdeva il lavoro fatto negli step intermedi.

- [x] **Fix UX dedicato (opzione A del task)** ✅
  - `src/VendiForm.jsx` linea 284-303: listener `place_changed` ora
    distingue 3 stati. Selezione completa → `onSelect(parsed)`. Selezione
    valida ma SENZA `postal_code` (es. vie lunghe come "Viale Murillo"
    che attraversano più CAP, anche con civico esplicito) →
    `onSelect({ ...parsed, _incomplete: 'missing_cap' })`. Nessuna
    selezione valida → `onSelect(null)`.
  - `src/VendiForm.jsx` linea 420-462: aggiunto state `addressMissingCap`
    (boolean). `handleAddressSelect` lo setta a true quando riceve il
    marker `_incomplete:'missing_cap'`, lasciando `addressVerified=false`.
    Reset su nuova selezione valida e su `handleChangeAddress`.
  - `src/VendiForm.jsx` linea 706-720: render del messaggio inline
    cambiato in cascata. Se `addressMissingCap` → "CAP non rilevato per
    questo indirizzo. Riprova inserendo l'indirizzo completo di numero
    civico (es. 'Via Roma 17 Milano')." Altrimenti se `addressTouched`
    → messaggio generico esistente "Seleziona un indirizzo dai
    suggerimenti per continuare."
  - Diagnostica via `console.log` temporanei in `place_changed` durante
    il test (rimossi dal commit finale).

- [x] **Test in incognito su `localhost:5173/vendi` step 0**:
  - "Via Capecelatro 38 Milano" (quartiere con CAP univoco 20148) →
    riquadro verde con CAP popolato, bottone Continua cliccabile ✅
  - "Viale Murillo Milano" (anche con civico esplicito) → messaggio
    "CAP non rilevato..." appare, riquadro verde NON appare, bottone
    Continua resta disabilitato ✅
  - Bug del 4.5 (utente arriva fino a submit e prende 400) eliminato
    perché il blocco avviene già a step 0 con messaggio specifico.

- [x] **Build pulita** (`vite build` 1.63s, 0 errori, solo warning chunk
  size standard). Branch pushato su origin, **NIENTE merge automatico su
  main** — il founder verifica preview Vercel e mergia manualmente.

**TECH DEBT prioritario (precedente all'onboarding venditori beta)**:
test E2E Playwright sul submit /vendi. Tre regressioni consecutive del
flow Places in 48h (rollback 10/05, hotfix 4.5, hotfix 4.6) dimostrano
che il pattern "diagnosi manuale + fix mirato" non scala — ogni
cambiamento può introdurre regressioni che emergono solo con utenti
reali. La voce in "Da fare post-MVP" è stata ri-prioritizzata di
conseguenza.

### Settimana 7 — batch 5 ✅ — completata 11/05/2026 (walkthrough fixes scope ridotto: 2 blocker + 5 polish)
Walkthrough completo flow venditore 11/05 da incognito + walktest4 ha
prodotto 12 task: 2 priority-1 blocker (foto non visibili + sezione
documenti vuota) + 10 secondari. Stima totale 5-7h, sopra il tetto 3h
indicato dal founder → **scope ridotto** a 7 task (priority-1 + polish
veloci + anteprima privata) per sbloccare l'onboarding venditori beta
subito. I 5 task fuori scope (5.F edit bozze, 5.H elimina bozza,
5.J tabs admin, 5.K modal rifiuto, 5.L email info@) sono UX polish non
blockanti, rimandati a batch 6. Branch `feat/batch-5-walkthrough-fixes`,
un commit per task. Tempo effettivo: ~90 min.

- [x] **Task 5.A (priority-1): bug foto non visibili su immobili nuovi** ✅
  - Sintomo walkthrough: walktest4 ha pubblicato immobile id=6 (Viale
    Murillo 17). Foto uploaded su Storage (200 OK), ma /compra non mostra
    cover e /immobili/6 ha gallery vuota. Capecelatro id=1 funziona.
  - Root cause: `VendiForm.uploadFile()` salvava nomi file relativi
    (`foto/{ts}-{rand}.{ext}`) invece di URL pubblici completi. Le righe
    in DB hanno quindi `immobili.foto` come array di nomi file, che
    `Listing.jsx`/`Immobile.jsx` passano direttamente come `<img src=>`
    → richiesta a `https://realaistate.ai/foto/{nome}` → 404 silenzioso.
    `VenditoreDashboard.jsx` invece aveva già un helper tollerante
    (`includes('://')` + ricostruzione URL base) → la cover lì funzionava
    senza che ce ne accorgessimo.
  - **Decisione di design**: salvare URL pubblici completi nel DB d'ora
    in poi (standard portabile, niente helper di ricostruzione sparsi).
    `src/VendiForm.jsx` linee 553-571: `uploadFile()` ora usa
    `supabase.storage.from('documenti-venditori').upload(filename, file)`
    + `getPublicUrl(filename)` e ritorna `data.publicUrl` invece del nome
    file. Il form state `form.foto` ora contiene URL completi, finiscono
    in `immobili.foto` jsonb senza altre modifiche.
  - Migration manuale per backfillare id=6 (e qualsiasi altro immobile
    pre-fix): `migrations/2026-05-11-backfill-foto-immobile-6.sql`.
    Idempotente — riconosce gli URL già completi via `LIKE '%://%'` e li
    lascia invariati; trasforma solo i path relativi prependendo il
    base URL Storage Supabase. Eseguito manualmente dal founder via SQL
    Editor post-merge (vedi "AZIONE FOUNDER REQUIRED" sotto).

- [x] **Task 5.B (priority-1): sezione documenti vuota su immobili non-demo** ✅
  - Sintomo walkthrough: /immobili/6 mostra solo "Template proposta
    d'acquisto" + lucchetto. Mancano i 6 documenti tipici (atto
    provenienza, visura, planimetria, APE, ecc.) che Capecelatro id=1
    mostra.
  - Root cause: in Immobile.jsx il rendering documenti era condizionale
    `isCapecelatroDemo ? <6-doc-hardcoded> : <solo-template-piu-placeholder>`.
    Decisione batch 2 task 2.C che era ragionevole all'epoca (Capecelatro
    aveva 6 doc verificati hardcoded, gli altri "su richiesta") ma con
    onboarding venditori reali in arrivo serve un rendering uniforme che
    metta lo stesso elenco di doc tipo su tutti gli immobili.
  - **Decisione di design**: lista tipi documento in
    `src/constants/documentTypes.js` (`DOCUMENT_TYPES` array di 6 oggetti
    `{key, label, description}` + `PROPOSAL_TEMPLATE` separato). Render
    unificato in Immobile.jsx: template proposta come prima card sempre
    disponibile (scaricabile da anonimi e loggati — è un PDF pubblico),
    poi 6 card "Su richiesta" con icona lucchetto. Loggati vedono
    "Richiedi via chat al venditore", anonimi vedono "🔒 Accedi per
    richiedere" + box top "Accedi per richiedere i documenti". La grid
    `.docs-grid` esistente è riusata.
  - Capecelatro id=1 perde la lista hardcoded e si comporta uguale agli
    altri (tutte "Su richiesta" finché non avremo `documenti_immobile`
    come tabella DB dedicata — backlog post-MVP).
  - **Effetto collaterale voluto**: rimossi anche il badge "✓ Immobile
    Verificato" / "{X}/{Y} Documenti" sopra la gallery e il verified-box
    nella sticky-card destra. Erano leak Capecelatro (decisione batch 2
    task 2.C diceva esplicitamente "no leak su immobili senza dati di
    verifica reali") — mantenerli richiedeva docsVerified/docsTotal/
    allVerified calcolati su una lista hardcoded che è proprio quello
    che il task ha eliminato. Future-proof: quando avremo upload reali,
    sarà naturale ricalcolare e re-introdurre i badge.

- [x] **Task 5.C: bug redirect post-conferma email (era Task 4.A rimandato)** ✅
  - Sintomo: utente arriva su `/login?redirect=/immobili/1`, signup,
    clicca link conferma Gmail, torna sul sito ma atterra in HOME invece
    che su /immobili/1. Whitelist Supabase Redirect URLs già configurata
    + batch 4 task 4.A aveva già aggiunto `emailRedirectTo` al signUp.
    Eppure il bug persisteva.
  - Root cause: Supabase reindirizzava direttamente alla destination
    (es. /immobili/1) con hash `#access_token=...` ma nessuna pagina di
    destinazione gestiva il parse dell'hash + set sessione. Risultato:
    utente atterrava sull'URL giusto ma non risultava loggato, o
    `onAuthStateChange` triggava troppo tardi e nel frattempo
    ProtectedRoute o altri redirectavano a /.
  - **Decisione di design**: pagina `/auth/callback` dedicata
    (`src/AuthCallback.jsx`). Pattern Supabase ufficiale, isolabile in
    test. Al mount fa `supabase.auth.getSession()` (supabase-js parsa
    l'hash automaticamente con `detectSessionInUrl:true` default) e poi
    `navigate(safeRedirect(searchParams.get('next')))`.
  - `LoginPage.jsx` signUp ora passa `emailRedirectTo` come
    `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    invece della destination diretta.
  - `safeRedirect()` estratto da LoginPage.jsx in
    `src/lib/safeRedirect.js` per riuso in AuthCallback. Same logic
    (path relativo, no `//`, length cap), default ora `'/'` invece di
    `null` per semplificare il chiamante.
  - Route `/auth/callback` aggiunta in App.jsx prima di /login.
  - **AZIONE FOUNDER REQUIRED su Supabase Dashboard**: in Auth → URL
    Configuration → Redirect URLs aggiungere
    `https://realaistate.ai/auth/callback`,
    `https://*.vercel.app/auth/callback`,
    `http://localhost:5173/auth/callback`. Senza whitelist Supabase
    ignora `emailRedirectTo` e fa fallback al Site URL.

- [x] **Task 5.D: copy hero /vendi non-loggato (claim OMI/anti-esclusiva)** ✅
  - `src/VendiForm.jsx` linea 498 (hero pre-registrazione, branch
    `if (!user)`). Sostituito sottotitolo:
    - Vecchio: "Niente agenzia. Niente trattative al ribasso. L'AI
      calcola il prezzo giusto, analizziamo le tue foto e pubblichiamo
      il tuo annuncio sui principali portali."
    - Nuovo: "Niente agenzia. Niente valutazioni gonfiate per strappare
      l'esclusiva. L'AI confronta il tuo prezzo con i dati ufficiali
      OMI, analizza le tue foto, pubblica il tuo annuncio. Tu decidi,
      noi ti diamo gli strumenti."
  - Il nuovo copy specifica il riferimento OMI (vantaggio differenziante
    vs portali classici) e mette il dito sul pain reale del venditore
    (agenzie che gonfiano per accaparrarsi il mandato).
  - Lasciata invariata la hero post-login (sottotitolo a step 0 dentro
    il form) come da specifica task — la decisione di tono è "non
    loggato".

- [x] **Task 5.E: messaggio CAP mancante step indirizzo più diretto** ✅
  - `src/VendiForm.jsx` linea 727 (branch `addressMissingCap` nel
    callback `place_changed` Google Places). Sostituito messaggio
    inline:
    - Vecchio: "CAP non rilevato per questo indirizzo. Riprova
      inserendo l'indirizzo completo di numero civico (es. 'Via Roma
      17 Milano')."
    - Nuovo: "Indirizzo incompleto: serve il CAP. Aggiungi il numero
      civico o scegli un suggerimento più specifico."
  - Più diretto, no esempio inline che intasava la riga. Gating gestito
    da `addressVerified=false` (Continua disabled) — già corretto da
    hotfix 4.6, niente cambio logico.

- [x] **Task 5.G + 5.I: anteprima privata owner + admin su non-published** ✅
  - Sintomo walkthrough: owner clicca "Apri scheda" su immobile bozza
    nella dashboard → pagina "Immobile non disponibile" perché la query
    in Immobile.jsx filtrava `.eq('status', 'published')`. Stessa cosa
    nel pannello admin: link "Preview ↗" su pending_review → 404.
  - **Decisione di design — admin tramite env var whitelist**: nuova
    `src/lib/isAdminUser.js` esporta `isAdminUser(user)` che legge
    `VITE_ADMIN_EMAILS` (comma-separated, default `fabiopiccoli@hotmail.it`)
    e ritorna true se `user.email` matcha. Pattern UI-only:
    - flag UI: bundle JS contiene la lista in chiaro, è OK perché serve
      solo a decidere cosa renderizzare in lettura
    - mutating operations admin restano via ADMIN_SECRET server-side
      (header x-admin-key in admin/[op]) — due livelli distinti
    - alternative scartate: `user_metadata.is_admin` richiedeva
      migration DB + update manuale per ogni admin; solo-owner non
      copriva 5.I (admin preview)
  - **Refactor visibilità in Immobile.jsx**:
    - Fetch immobile non filtra più `.eq('status', 'published')`
    - Calcolo post-fetch: `canViewAsPublic = status==='published'`,
      `canViewAsOwner = user.id === venditore_user_id`,
      `canViewAsAdmin = isAdminUser(user)`,
      `isPrivatePreview = !canViewAsPublic && (canViewAsOwner || canViewAsAdmin)`
    - "Immobile non disponibile" scatta se non esiste, oppure non
      published E utente non è owner/admin (anonimi vedono il fallback
      come prima)
    - Banner giallo top in modalità preview: "⚠ Anteprima privata —
      questo immobile non è ancora pubblico (status: {immobileDb.status}).
      Le azioni di contatto, proposta e chat sono nascoste."
    - Chat AI nascosta in preview (compratori non possono scrivere a
      immobile non pubblico; owner ha già la dashboard)
    - Affordability chat nascosta
    - Sticky CTA in preview: "Torna alla dashboard →" (owner) o
      "Torna al pannello admin →" (admin) + label
      "Anteprima privata · nessuna azione disponibile"
    - Shortlist button nascosto
  - `VenditoreDashboard.jsx`: bottone "Apri scheda →" diventa
    "Anteprima →" per immobili non-published (draft/pending_review/
    rejected/archived). Per published resta "Apri scheda →" perché è
    effettivamente pubblica.
  - Task 5.I (admin preview pending_review) è coperto automaticamente
    dal check `canViewAsAdmin`. Il link "Preview ↗" in Admin.jsx
    funziona out-of-the-box dopo questo cambio, niente modifica a
    Admin.jsx.
  - **.env.example**: nuova `VITE_ADMIN_EMAILS=fabiopiccoli@hotmail.it`
    con commento esplicativo (è flag UI, non auth).
  - **AZIONE FOUNDER REQUIRED**: aggiungere `VITE_ADMIN_EMAILS=fabiopiccoli@hotmail.it`
    in Vercel (Production + Preview + Development) e in `.env.local`
    locale, altrimenti il founder non risulta admin nemmeno per la
    preview UI.

- [x] **Build & QA**: `npm run build` passa pulito (1.98s, 0 errori, solo
  warning chunk size standard). 7 commit atomici su `feat/batch-5-walkthrough-fixes`
  + 1 doc. Branch pushato su origin, **NIENTE merge automatico su main**.

**Task fuori scope rimandati a batch 6** (non blockanti per onboarding):
- 5.F edit bozze (richiede modifiche grosse a VendiForm + backend
  vendi-submit per UPDATE vs INSERT)
- 5.H elimina bozza (nuovo endpoint + modal conferma + delete Storage)
- 5.J tabs filtro admin (Pending/Pubblicati/Rifiutati/Bozze)
- 5.K modal rifiuto con motivo obbligatorio + status='rejected' (richiede
  migration colonne `rejection_reason`/`rejected_at`)
- 5.L email a info@ post-approvazione/rifiuto

### Settimana 7 — batch 3 ✅ — completata 10/05/2026 (polish UX/copy walkthrough)
8 task atomici di copy + UX emersi dal walkthrough UX 10/05 sera dopo
il rollback Places. Nessun task critico, ma insieme alzano la qualità
percepita per l'onboarding venditore beta. Branch `feat/copy-ux-polish`,
un commit per task. Tempo effettivo: ~70 min.

- [x] **Task 3.A: nuovo claim home positivo** ✅
  - `src/HomePage.jsx` hero section. Sostituito il claim antagonista
    "Hai davvero bisogno di un'agenzia? **No.** Che scusa hai per non
    usare RealAIstate?" con un claim dichiarativo:
    - H1: "Comprare e vendere casa, indipendentemente."
    - Sottotitolo (`hero-challenge`): "La piattaforma AI che lavora per
      te, non per l'agenzia."
    - Descrizione (`hero-sub`): "Valutazione, documenti, professionisti
      — tutto incluso. Risparmio reale, in piena trasparenza."
  - **Decisione di design**: rimossi anche il `hero-bg-number` "NO."
    (giant background letter) e l'`hero-answer` "No." perché
    visivamente ancorati al vecchio framing antagonista. Il nuovo tono
    è positivo/dichiarativo, non più "smonta-le-scuse". L'`hero-eyebrow`
    "Piattaforma AI · Compra e vendi casa" resta — neutro/descrittivo.

- [x] **Task 3.B: box "Per te" — onestà su prodotto e copy professionista** ✅
  - `src/HomePage.jsx` array `cards`:
    - Box "Stai vendendo": rimosso il subtitle promozionale "Pubblica.
      Incassa. Tutto." (induceva in errore — non è letteralmente vero
      che con un click si pubblica e si incassa).
    - Box "Sei un investitore": aggiunto il flag `inConstruction: true`
      → render mostra "(in costruzione)" muted/grigio sotto il titolo,
      così sono onesti sullo stato del workspace investitore (Investment
      Score, pipeline, alert sono backlog post-MVP).
    - Box "Sei un professionista": secondo bullet da "Richieste da
      utenti qualificati dall'AI" a "Richieste da utenti qualificati"
      (overclaim AI rimosso).
  - Render `forwho-card`: condizionali su `c.name` (per supportare il
    card "Stai vendendo" senza name) e `c.inConstruction` (per il
    badge investitore). Inline style perché il pattern è isolato a un
    solo elemento — non aggiungiamo classe CSS dedicata.

- [x] **Task 3.C: rimosso bottone "Smonta la tua scusa" da hero** ✅
  - Eliminato il blocco `<div className="hero-actions">` con il
    `<a className="btn-red">Smonta la tua scusa →</a>`. Era troppo
    prominente per il nuovo tono dichiarativo del claim 3.A.
  - Il link a /scuse resta intatto in `excuses-subtitle` ("Hai una
    scusa diversa? Sfida l'AI →") sopra la scusa 01 — quello è il
    posto naturale per la CTA verso /scuse.
  - **Effetto desiderato**: i numeri di risparmio (`hero-cost`) salgono
    nella prima viewport senza scroll perché abbiamo guadagnato altezza.

- [x] **Task 3.D: risposte scuse 05/06/08 in HomePage** ✅
  - Scusa 05 ("Ho paura di sbagliare senza qualcuno che mi segue"):
    "**RealAIstate è con te in ogni passaggio** — dalla valutazione
    alla trattativa, fino al rogito." (era "L'AI è con te" — il
    prodotto, non solo l'AI).
  - Scusa 06 ("Non voglio dover negoziare"): "**L'AI di RealAIstate
    ti aiuta a negoziare** — lavora per te, non per l'agenzia. Senza
    fretta, senza commissioni: ottimizza il tuo prezzo." Riprende il
    claim principale dell'home (3.A) "lavora per te, non per
    l'agenzia".
  - Scusa 08 (caparra/assegno): "**L'assegno non serve.** Il notaio
    gestisce la caparra, tutto via bonifico. Tutela per venditore e
    compratore. In futuro potrai farlo direttamente su RealAIstate."
    (era "Con RealAIstate usi un escrow digitale" — feature non
    presente sul prodotto attuale, copy ingannevole).
  - **Inconsistenza nota fuori scope**: la stessa scusa caparra esiste
    anche in `src/ScusePage.jsx` `hallOfFame[4]` con il vecchio copy
    escrow. Da allineare manualmente quando si vuole — il task 3.D
    diceva esplicitamente "in src/HomePage.jsx" e "non improvvisare
    su scelte di copy non specificate".

- [x] **Task 3.E: conferma password in registrazione** ✅
  - `src/LoginPage.jsx` tab Registrati. Nuovo campo `confirmPassword`
    sotto password. Stesso pattern UX di `confirmEmail`:
    - Validazione alla submit: `if (password !== confirmPassword)
      setError('Le password non coincidono.')`.
    - Errore inline live (rosso) sotto il campo quando confirmPassword
      è popolato e diverge — utente vede subito il mismatch senza
      premere submit.
    - `onPaste` prevented per costringere l'utente a re-tipparla
      (riduce errori da copy-paste sbagliato; i password manager non
      autofillano confirm-password fields, quindi non rompiamo niente).
    - `autoComplete="new-password"`.
    - `switchMode` resetta sia `confirmEmail` che `confirmPassword`.
  - Niente refactor del button submit: la logica di validazione è
    inline nel `handle` come per confirm email.

- [x] **Task 3.F: chat affordability — trim "agevolazioni under 36"** ✅
  - `src/Immobile.jsx` `AffordabilityChat`. Rimossa la frase
    "— incluse eventuali agevolazioni under 36" dal primo messaggio AI.
    Il copy creava aspettative non sempre mantenute (l'AI nel resto
    della conversazione non sempre approfondiva le agevolazioni).
  - Aggiornato sia `messages` (UI) che `apiMessages` (storico inviato
    all'API Anthropic) per coerenza — entrambi inizializzati con la
    stessa stringa identica.

- [x] **Task 3.G: rimossi Monolocale/Bilocale dal dropdown tipologia** ✅
  - `src/VendiForm.jsx` step 0. Rimosse le opzioni `<option>Monolocale</option>`
    e `<option>Bilocale</option>` dal `<select>` tipologia. Ricadono
    in "Appartamento" via il campo "Vani" (numero locali) già presente
    nel form. Tenerli come tipologie separate creava ridondanza: un
    compratore che filtra per "Appartamento" non trovava i monolocali.
  - **Tipologie attive**: Appartamento, Villa, Villetta a schiera,
    Attico, Loft, Altro.
  - **Niente migration DB**: il campo tipologia è una stringa libera
    lato DB. Immobili pre-esistenti con valore "Monolocale"/"Bilocale"
    continuano a leggersi. Se il founder vuole uniformarli a
    "Appartamento" può fare una `UPDATE immobili SET tipologia =
    'Appartamento' WHERE tipologia IN ('Monolocale','Bilocale')` da
    SQL Editor.

- [x] **Task 3.H: bottone "Accedi per fare proposta" verde uniforme** ✅
  - `src/Immobile.jsx` sticky-cta destra. Per utenti NON loggati e non
    isOwner, il bottone è passato da `btn-secondary` (grigio neutro)
    a `btn-primary` con `style={{ background: '#2d6a4f' }}` — stesso
    verde del bottone "Fai una proposta" che vedono i loggati.
  - Coerenza visiva: l'azione "fare una proposta" è SEMPRE verde,
    indipendentemente dallo stato auth. L'unica differenza è il testo
    e il comportamento (il primo porta a /login, il secondo apre
    modal proposta).
  - Aggiunto `?redirect=` alla URL /login con
    `window.location.pathname + window.location.search` (stesso
    pattern usato in `AiChat` per la registrazione anonima → loggato,
    batch 2 task 2.A). Dopo il login l'utente torna sulla scheda
    immobile e può cliccare di nuovo "Fai una proposta".
  - Aggiunta freccia "→" al testo per uniformità col gemello verde.

- [x] **Build & QA**: `npm run build` passa pulito (1.7-1.8s, 0
  errori, solo il warning standard sul chunk size già esistente prima
  del batch). Un commit per task, branch `feat/copy-ux-polish` su
  origin. NON pushato su main — il founder mergia manualmente al
  rientro come per gli altri batch.

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
  Conferma email in signup; legge ?redirect= post-login con open-redirect protection;
  signUp emailRedirectTo passa per /auth/callback?next=<dest> da batch 5 task 5.C)
- src/AuthCallback.jsx — pagina di atterraggio post-conferma email Supabase.
  getSession() parsa hash, navigate(safeRedirect(next))
- src/lib/safeRedirect.js — open-redirect protection helper (path relativi only)
- src/lib/isAdminUser.js — whitelist email admin via VITE_ADMIN_EMAILS per UI
  privilegiate (anteprima privata). NON è auth — solo flag UI.
- src/constants/documentTypes.js — DOCUMENT_TYPES (6 tipi standard) +
  PROPOSAL_TEMPLATE per sezione documenti scheda
- src/ProtectedRoute.jsx — gate auth, propaga destination come ?redirect=
- src/VendiForm.jsx — form 5 step con auth gate, salva immobile draft + lead.
  Step 1 indirizzo via Places API LEGACY `google.maps.places.Autocomplete`
  su `<input>` HTML standard (`componentRestrictions: { country: 'it' }`,
  `types: ['address']`, `fields: ['address_components', 'formatted_address',
  'geometry']`) — popola indirizzo+cap+città+provincia+zona+lat/lng.
  Rollback 10/05/2026 ottavo fix dopo 7 fix falliti sulla Places API New
  Web Component. Step 4 contatti pre-popola nome+cognome separati ed
  email da user; email read-only; conferma email obbligatoria; cognome
  obbligatorio
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
- migrations/2026-05-11-backfill-foto-immobile-6.sql — backfill foto immobili
  pre-batch-5 (path relativi → URL pubblici completi). Idempotente, default
  scoped a id=6 (allargabile a tutti gli immobili). Da eseguire post-deploy
  batch 5 dal founder via SQL Editor.
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
  batch 2 task 2.D, ROLLBACK ottavo fix 10/05/2026). /vendi step 1 usa la
  **Places API legacy** Google via `google.maps.places.Autocomplete` su un
  `<input>` HTML standard per popolare cap/citta/provincia/zona/lat/lng come
  campi DB strutturati. Razionale di prodotto:
  (a) impossibile pubblicare immobili con indirizzi inventati o errati;
  (b) FPS dinamico futuro avrà bisogno di geocoding preciso;
  (c) ricerca per zona / mappa centrata richiedono lat/lng;
  (d) il rendering della scheda mostra "Via X, CAP Città (Prov)" pulito.
  Razionale tecnico (rollback): la Places API legacy funziona stabile,
  la deprecation Google è annunciata ma il supporto è operativo fino al
  2027+. Il progetto Google Cloud RealAIstate ha 4 API attive: Maps Embed,
  Maps JavaScript, Places API New, Places API legacy (l'ultima abilitata
  10/05/2026 dopo che 7 fix sulla New non hanno risolto edge case di
  upgrade-readiness in Vite + React).
  Validazione frontend (canProceed step 0 richiede addressVerified) +
  validazione server-side (vendi-submit rifiuta 400 se cap/citta/provincia
  mancanti). Niente nuove dipendenze npm — script Maps JS API caricato
  dinamicamente con la stessa key VITE_GOOGLE_MAPS_KEY già usata per Maps
  Embed. URL legacy classico
  `https://maps.googleapis.com/maps/api/js?key=KEY&libraries=places&language=it`,
  niente `loading=async`. Restrizioni:
  `componentRestrictions: { country: 'it' }`, `types: ['address']`,
  `fields: ['address_components', 'formatted_address', 'geometry']`.
  Migration alla Places API New riconsiderata in futuro con wrapper
  React-friendly (`@vis.gl/react-google-maps`) quando sarà più maturo,
  oppure quando arriverà sunset reale.
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
- **Places API New + Web Components + Vite + React: evitato per MVP**
  (lezione 10/05/2026, rollback ottavo fix batch 2). 7 fix consecutivi
  sul Web Component `<gmp-place-autocomplete>` non hanno risolto edge
  case di upgrade-readiness in produzione: `shadowRoot:null` nonostante
  `whenDefined` risolto, microtask gap su `importLibrary` post-`onload`,
  race tra mount JSX e `connectedCallback`, listbox dei suggerimenti
  che non viene mai renderizzato anche con Network 200 e classe
  registrata. La combo Vite + React 18 + custom element esterno via
  bootstrap async ha più punti di rottura (lifecycle Web Component,
  upgrade-readiness, microtask timing, refs vs JSX) di quanto valga la
  pena debuggare per un MVP. **Soluzione adottata**: Places API
  legacy `google.maps.places.Autocomplete` su `<input>` HTML normale —
  pattern documentato 2020-2024, stabile, niente custom element,
  niente shadow DOM, niente race condition. **Riprovare la Places API
  New solo quando**: (a) esce un wrapper React ufficiale o quasi-ufficiale
  con esempi maturi (es. `@vis.gl/react-google-maps` con supporto
  PlaceAutocompleteElement nativo), oppure (b) Google annuncia una data
  sunset concreta per la legacy che obblighi a migrare. Fino a quel
  momento, considerare il Web Component `<gmp-place-autocomplete>` come
  sotto-supportato per l'integrazione React/Vite. Non riaprire la
  questione "ottimizziamo" o "passiamo a quella nuova" senza un
  trigger reale dei due punti sopra.
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
- **AZIONI OBBLIGATORIE post-merge batch 5** (eseguire dopo che il
  founder ha fatto merge del branch `feat/batch-5-walkthrough-fixes`):
  1. Eseguire `migrations/2026-05-11-backfill-foto-immobile-6.sql` via
     Supabase SQL Editor. Riporta le foto di immobile id=6 da nomi file
     relativi a URL pubblici completi. Idempotente — rilanciabile senza
     danno. Senza questo step, /compra continua a non mostrare la cover
     di id=6.
  2. Aggiungere env var `VITE_ADMIN_EMAILS=fabiopiccoli@hotmail.it` in
     Vercel (Production + Preview + Development) e in `.env.local` per
     dev locale. Senza, il founder non risulta admin neanche per
     l'anteprima privata UI (5.G/5.I) — la mutating admin via password
     resta funzionante perché usa ADMIN_SECRET server-side, ma la
     scheda /immobili/:id non darà preview a immobili non-published.
  3. Verificare su Supabase Dashboard → Auth → URL Configuration →
     Redirect URLs che ci siano:
     - `https://realaistate.ai/auth/callback`
     - `https://*.vercel.app/auth/callback`
     - `http://localhost:5173/auth/callback`
     Senza whitelist, il fix redirect post-conferma email (5.C) non
     funziona — Supabase ignora `emailRedirectTo` e fa fallback al
     Site URL.

- **Test E2E batch 5 in incognito post-merge** (12/05 mattina):
  1. **5.A foto**: /compra mostra cover di id=6 (Viale Murillo); /immobili/6
     gallery completa. Crea nuovo draft da /vendi con 2-3 foto → verifica
     che `immobili.foto` in DB contenga URL completi
     `https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/...`.
  2. **5.B documenti**: /immobili/6 anonimo mostra 7 card (template
     proposta + 6 doc "Su richiesta") con lucchetti; loggato vede
     stesso layout, template scaricabile. /immobili/1 Capecelatro non
     ha più i badge "Immobile Verificato" / "6/6 Documenti".
  3. **5.C auth callback**: logout, incognito, /immobili/1 → "Accedi
     per fare proposta" → /login?redirect=/immobili/1 → Registrati →
     email nuova → submit → Gmail → click link conferma → loading
     "Stiamo verificando..." → atterra su /immobili/1 LOGGATO.
  4. **5.D copy**: /vendi da deslogato mostra nuovo sottotitolo
     "Niente valutazioni gonfiate... OMI..."
  5. **5.E warning CAP**: "Viale Murillo, Milano" senza civico →
     messaggio "Indirizzo incompleto: serve il CAP..." appare,
     Continua disabled. "Viale Murillo 17, Milano" → verde + abilitato.
  6. **5.G owner preview**: logged-in venditore con un draft → dashboard
     → click "Anteprima →" → scheda con banner giallo top, niente CTA
     transazionali, bottone "Torna alla dashboard →" nel sticky.
  7. **5.I admin preview**: logged-in come `fabiopiccoli@hotmail.it` →
     /admin → click "Preview ↗" su pending_review → scheda visibile
     con banner, "Torna al pannello admin →" nel sticky.
  8. **Anonimo/altro utente** su /immobili/<id-non-published> → continua
     a vedere "Immobile non disponibile" come prima.

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
- **TECH DEBT prioritario — Test E2E Playwright su /vendi** (precedente
  all'onboarding venditori beta): copertura completa del flow venditore
  (indirizzo step 0, prezzo, foto, documenti, contatti, submit). 3
  regressioni consecutive del flow Places in 48h (rollback 10/05,
  hotfix 4.5, hotfix 4.6) dimostrano che diagnosi manuale + fix mirato
  non scala. Setup minimo: playwright + mock Google Maps API per
  stabilità CI. Casi da coprire: (a) indirizzo completo con CAP da
  Google → submit ok; (b) indirizzo senza CAP (es. "Viale Murillo
  Milano") → step 0 blocca con messaggio dedicato; (c) selezione
  invalida → messaggio generico "Seleziona un indirizzo...".
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