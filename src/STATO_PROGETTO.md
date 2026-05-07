# RealAIstate — Stato del progetto
Aggiornato: 08/05/2026 notte (sessione 07/05 sera → 08/05 mattina)

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email transazionali: Brevo (SMTP collegato a Supabase Auth + email custom)
- Email casella business: Namecheap Private Email (info@realaistate.ai)
- AI: Anthropic API
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
- src/LoginPage.jsx — login/registrazione (con campo nome + Conferma email in signup)
- src/VendiForm.jsx — form 5 step con auth gate, salva immobile draft + lead
- src/AuthContext.jsx — gestione sessione + signUp con full_name + updateFullName
- src/supabase.js — connessione Supabase
- src/App.jsx — routing centrale con alias /compra/:id ↔ /immobili/:id
- api/chat-immobile.js — chat AI con notifiche email
- api/proposta-submit.js — salvataggio + email A (compratore) + email B (info@ + venditore)
- api/yousign-proposta.js — firma digitale FEA via Yousign sandbox
- api/vendi-submit.js — form venditore: scrive in venditori + immobili (draft),
  JWT-authenticated, l'AI genera summary/punti_forza/domande in automatico
- api/richiedi-pubblicazione.js — draft → pending_review + email venditore + email info@
- public/proposta_acquisto_template.html — template proposta visualizzabile
- public/llms.txt — descriptor per AI agent

## Supabase tabelle
- chat_messages — messaggi chat (user_id, immobile_id, sessione_id, mittente, testo)
- proposte — proposte d'acquisto (status: pending/accepted/rejected, yousign_id)
- immobili — id (sequence), titolo, indirizzo, zona, prezzo, superficie,
  tipologia, piano, superficie_calpestabile, locali (ex vani), camere, bagni,
  anno_costruzione, classe_energetica, stato_immobile, foto (jsonb),
  descrizione, fair_price_score, ai_summary, punti_forza (jsonb array),
  domande_consigliate (jsonb array), status (draft/pending_review/published/
  sold/archived), venditore_user_id (FK auth.users), created_at.
  RLS attive con 4 policy.
- scuse — scuse dalla pagina /scuse
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

## ⚠️ Bug aperti (cosmetici, non bloccanti)
- **Pagina /immobili/:id scrolla a metà al caricamento**: comportamento non
  deterministico (a volte scrolla più, a volte meno). Ipotesi non confermate:
  iframe Google Maps che fa reflow durante caricamento, scrollIntoView delle
  chat (AiChat e AffordabilityChat), sticky positioning della sticky-card
  destra. Tentativi falliti durante sessione 07/05 notte:
  (a) useLayoutEffect per scroll a 0,
  (b) timeout multipli a 50/200/500ms con scrollTo,
  (c) sostituire scrollIntoView con scrollTop = scrollHeight (rotto comportamento
      chat normale, rollbackato),
  (d) cambio scroll-behavior CSS da smooth ad auto (innocuo, lasciato in App.jsx
      ma poi rollbackato per pulizia).
  **Diagnosi vera da fare in sessione fresca**: F12 → Console → patchare
  `window.scrollTo` con stack trace per identificare il chiamante esatto.
  Tempo stimato fix vero: 15-30 min con strumenti dev usati correttamente.
  Workaround attuale: nessuno, l'utente fa scroll su a mano. Non bloccante
  per nessuna funzione né conversione. **Non urgente.**

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
- **Bug scroll /immobili/:id**: 15-30 min con diagnosi corretta tramite
  console window.scrollTo monkey-patch + stack trace.
- **Email al venditore quando approvi pubblicazione**: oggi UPDATE SQL
  `pending_review → published` bypassa l'app, venditore non sa che è online.
  Soluzioni: (a) tool admin con bottone approva, (b) trigger DB con webhook
  Brevo, (c) UPDATE via API serverless con email automatica.
- Task 7: Contatta notaio (chat AI qualificante + email automatica)
- Switch Yousign production se call commerciale va bene

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score AI dinamico (oggi hardcoded per Capecelatro)
- Generazione PDF dinamica della proposta (PDFShift)
- Webhook Yousign per aggiornare status='signed' su Supabase a firma completata
- Redirect post-login: se utente clicca link CTA email mentre non è loggato,
  dopo login deve tornare alla destination, non alla home
- Validazione form /vendi: doppio campo email anche nel form venditore
- Estrazione zona da indirizzo via geocoding
- Pre-popolazione campi contatti in /vendi dal profilo Supabase
- Link firma diretto in dashboard venditore (signature_link Yousign in jsonb)
- Stringere DMARC policy da `p=none` a `p=quarantine` poi `p=reject`
- Configurare client email mobile (IMAP/SMTP) per leggere info@ da iPhone
- Fix warning React keys in VendiForm.jsx stepper
- **Standardizzazione formato `foto` jsonb**: scegliere formato unico
  (URL completi consigliati) e migrare i record esistenti
- **Tool admin per approvazione pubblicazioni** con email automatica al venditore
- **Documenti immobile come tabella DB** (oggi hardcoded fallback)
- **Comparabili immobile come tabella DB** (oggi hardcoded fallback)
- **Cancellare branch git vecchi** (feat/vendi-reale, feat/immobile-dinamico
  remote, fix/dashboard-venditore-cover) — pulizia repo
- **Cancellare src/App.jsx.backup** — file orfano in repo