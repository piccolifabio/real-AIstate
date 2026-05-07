# RealAIstate — Stato del progetto
Aggiornato: 07/05/2026 sera (chiusura giornata)

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email transazionali: Brevo (SMTP collegato a Supabase Auth + email custom)
- Email casella business: Namecheap Private Email (info@realaistate.ai)
- AI: Anthropic API
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
    foto jsonb, descrizione, status enum draft/pending_review/published/sold/archived)
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
- [x] Dashboard venditore: tab "I miei immobili" ✅
  - Default tab cambiata a immobili (era conversazioni)
  - Card per ogni immobile con thumbnail, indirizzo, prezzo, badge status
  - Bottoni dinamici per stato: draft→Richiedi pubblicazione,
    pending_review→messaggio in attesa, published→Archivia, archived→Ripubblica
  - Update status via Supabase con RLS owner_update che valida ownership
- [x] Review interno pre-pubblicazione ✅
  - Nuovo status `pending_review` aggiunto al check constraint
  - RLS owner_update stretto: il venditore può solo navigare tra
    draft/pending_review/archived, NON può settare published direttamente
  - Bottone "Pubblica" → "Richiedi pubblicazione" (chiama API server)
  - Nuova `api/richiedi-pubblicazione.js`: ownership check, update status,
    email a info@ con dati + foto per review, email conferma al venditore
  - Approvazione manuale via Supabase (UPDATE status='published') — automatable
    in futuro con pagina /admin

## File chiave
- src/HomePage.jsx — home page con Nav e CTA
- src/ScusePage.jsx — pagina scuse separata
- src/Privacy.jsx — privacy policy
- src/Termini.jsx — termini di servizio
- src/VenditoreDashboard.jsx — dashboard venditore con tab immobili/conversazioni/proposte,
  bottoni richiesta pubblicazione e archiviazione
- src/AccountPage.jsx — account con nome modificabile + sezione "Le mie proposte"
- src/Immobile.jsx — scheda immobile con chat, documenti, proposta (ANCORA HARDCODED su Capecelatro — prossimo task: refactor)
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
- api/richiedi-pubblicazione.js — venditore richiede review per pubblicazione,
  status va a pending_review e parte mail a info@ + conferma al venditore
- public/proposta_acquisto_template.html — template proposta visualizzabile e caricato su Yousign
- public/llms.txt — descriptor per AI agent (aggiornato 07/05)

## Supabase tabelle
- chat_messages — messaggi chat (user_id, immobile_id, sessione_id, mittente, testo)
- proposte — proposte d'acquisto (status: pending/accepted/rejected, yousign_id, compratore_nome)
- immobili — id (sequence), indirizzo, zona, prezzo, superficie, tipologia, piano,
  superficie_calpestabile, vani, camere, bagni, anno_costruzione, classe_energetica,
  stato_immobile, foto (jsonb), descrizione,
  status (draft/pending_review/published/sold/archived),
  venditore_user_id (FK auth.users), created_at. RLS attive con 4 policy.
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
- **Workflow status immobile**:
  - `draft` → creato dal form, modificabile dal venditore
  - `pending_review` → venditore ha richiesto pubblicazione, in attesa review Fabio
  - `published` → approvato, visibile pubblicamente (transizione SOLO via admin/Fabio)
  - `archived` → tolto dalla home dal venditore (può ripubblicare)
  - `sold` → venduto (transizione futura via webhook Yousign post-rogito?)
- **RLS owner_update stretta**: il venditore può portare il suo immobile tra
  draft/pending_review/archived ma NON può settare `published` o `sold`.
  Quei due status passano solo dal backend admin (service_role) o da
  UPDATE manuale Fabio su Supabase.

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
  login Vercel. OK se sviluppi da solo, da gestire quando arrivano collaboratori.
- **`.env.local` in formato semplice**: `KEY=value` senza `<>`, senza spazi
  iniziali, senza virgolette. Le env VITE_* sono lette dal client; quelle
  senza prefisso solo dal backend.
- **Strategia branch per task multi-step**: per task piccoli (singolo file,
  singola sera) push diretto su main è ok. Per task con stati intermedi
  rotti (refactor che dura giorni, modifiche multi-file) creare branch
  dedicato `feat/nome-task`. Mergiare in main solo a fine task testato.

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
- **Refactor Immobile.jsx** (TASK PRINCIPALE, ~2-3h): leggere dati immobile da
  DB invece di hardcoded. Sblocca scheda dinamica per ogni nuovo immobile
  pubblicato. Da fare su branch `feat/immobile-dinamico`. Sotto-step:
  - Route `/immobile/:id` (verificare se già configurata in App.jsx)
  - Fetch immobile da Supabase con gestione loading/not-found/access-denied
  - Galleria foto da `foto[]` jsonb caricate da Supabase Storage
  - Owner-only badge "Bozza/In revisione" se utente loggato è il venditore
  - Fair Price Score: placeholder "Calcolo in corso" (calcolo AI dinamico è task post-MVP)
  - Verificare chat AI: passa `immobile_id` correttamente al backend
  - Bottone proposta d'acquisto invariato
- **Listing dinamico**: la pagina `/listing` deve leggere
  `immobili WHERE status='published'` invece di essere statica. Da fare DOPO
  il refactor Immobile.jsx (le card del listing linkano alla scheda).
- Task 7: Contatta notaio (chat AI qualificante + email automatica)
- Switch Yousign production se arriva risposta commerciale

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score interattivo — chat AI che restituisce range OMI o score motivato
- **Fair Price Score AI dinamico**: oggi hardcoded su Capecelatro. Per un
  immobile nuovo l'AI deve calcolare lo score da dati OMI + caratteristiche.
- **Pagina /admin**: lista immobili pending_review con bottoni approva/rifiuta
  che fanno UPDATE status (oggi manualmente via Supabase UI).
- **Generazione PDF dinamica della proposta** (PDFShift): necessaria col secondo immobile
- **Webhook Yousign** per aggiornare status='signed' su Supabase a firma completata
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
- **Webhook Yousign per status='sold'**: a rogito firmato, transitare
  l'immobile da published a sold automaticamente.