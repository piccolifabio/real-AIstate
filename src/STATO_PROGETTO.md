# RealAIstate — Stato del progetto
Aggiornato: 06/05/2026 — fine giornata

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email transazionali: Brevo (SMTP collegato a Supabase Auth + email custom)
- AI: Anthropic API
- Firma digitale: Yousign sandbox (passaggio a production previsto)
- Repo: github.com/piccolifabio/real-AIstate
- Sito live: realaistate.ai

## ⚠️ Stato critico aperto
**Yousign sandbox: delivery email instabile (06/05/2026 sera).**
Codice nostro testato e corretto (Vercel logs: 3 chiamate Yousign tutte 201/200/204).
Sintomi osservati:
- Stato `signature_request` ha mostrato regressione da `ongoing` a `draft` senza nostra azione
- Email a volte arrivano a uno solo dei due firmatari, a volte a nessuno
- Comportamento intermittente nello stesso pomeriggio (prima funzionante, poi rotto)
- Cambiare a `ordered_signers: true` non ha risolto

**Decisione**: NON si toccherà il codice né si farà workaround. Si attribuisce a sandbox non-prod-grade.
**Prossimo passo**: domani mattina (07/05/2026) prima cosa testare:
1. Sandbox Yousign — se funziona di nuovo era blip
2. Se ancora rotto → switch a Yousign production (offerta trial 13gg gratis sull'account)

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
  - Nome utente in signup (auth.users.user_metadata.full_name)
  - Modificabile su /account (card "Nome e cognome")
  - Tabella `immobili` con `venditore_user_id` (FK a auth.users)
  - FK proposte.immobile_id → immobili.id (con tipi allineati a bigint)
  - Policy RLS pulite:
    * Compratore vede solo sue proposte (compratore_user_id = auth.uid())
    * Venditore vede solo proposte sui suoi immobili (via JOIN immobili.venditore_user_id)
    * Venditore può aggiornare status (per bottone "Rifiuta")
    * Immobili: SELECT pubblico, UPDATE solo venditore proprietario
  - Dashboard venditore gated: empty state se utente non ha immobili in vendita
  - Backend yousign-proposta verifica JWT chiamante + ownership immobile
  - Email transazionali Brevo (design dark coerente):
    * Compratore: "Proposta inviata" con riepilogo + banner 24h + CTA /account
    * Venditore: "Nuova proposta" inviata sia a info@ sia all'email del venditore reale
  - Sezione "Le mie proposte" su /account (con join immobili per indirizzo)
  - Yousign signers con nomi e email dinamici (no più hardcoded info@/Compratore/Venditore)
  - Site URL Supabase Auth configurato a realaistate.ai (no più localhost nei link)
  - Custom SMTP Brevo su Supabase Auth (no più rate limit 3-4/ora)
  - ordered_signers: true (compratore prima, venditore dopo)

## File chiave
- src/HomePage.jsx — home page con Nav e CTA
- src/ScusePage.jsx — pagina scuse separata
- src/Privacy.jsx — privacy policy
- src/Termini.jsx — termini di servizio
- src/VenditoreDashboard.jsx — dashboard venditore (gated, multi-immobile-ready)
- src/AccountPage.jsx — account con nome modificabile + sezione "Le mie proposte"
- src/Immobile.jsx — scheda immobile con chat, documenti, proposta
- src/LoginPage.jsx — login/registrazione (con campo nome in signup)
- src/AuthContext.jsx — gestione sessione + signUp con full_name + updateFullName
- src/supabase.js — connessione Supabase
- src/ProtectedRoute.jsx — route protetta
- src/index.css — CSS globale
- src/blog/articoli.js — contenuto articoli
- src/BlogPage.jsx — lista articoli (aggiungere in cima per ordine cronologico)
- api/chat-immobile.js — chat AI con notifiche email
- api/proposta-submit.js — salvataggio + email A (compratore) + email B (info@ + venditore)
- api/yousign-proposta.js — firma digitale FEA via Yousign (con JWT auth + ownership check + ordered_signers)
- api/vendi-submit.js — form venditore
- public/proposta_acquisto_template.html — template proposta visualizzabile e caricato su Yousign

## Supabase tabelle
- chat_messages — messaggi chat (user_id, immobile_id, sessione_id, mittente, testo)
- proposte — proposte d'acquisto (status: pending/accepted/rejected, yousign_id, compratore_nome)
- immobili — id, indirizzo, zona, prezzo, superficie, venditore_user_id (FK auth.users)
- scuse — scuse dalla pagina /scuse
- venditori — form venditori

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign — sandbox per test, switch a production al primo angel committed o transazione reale
- Non loggati: prezzo, foto, descrizione, Fair Price Score + lucchetti documenti
- Loggati: documenti pubblici + chat con storico + proposta d'acquisto
- Documenti sensibili: su richiesta
- info@realaistate.ai: notifiche operative del prodotto (proposte ricevute, alert)
- email venditore reale (auth.users): documenti che richiedono azione personale (firma Yousign)
- Fee: €2.000 compratore + €499 venditore — dovute solo a rogito completato
- MAI riferimento a intermediazione immobiliare nel documento proposta
- Blog: aggiungere in cima ad articoli.js e BlogPage.jsx
- SRL: da aprire al primo commitment angel
- Policy RLS hardcoded su email: VIETATE. Sempre via venditore_user_id ↔ auth.uid().

## Memo tecnici (gotchas già imparati — non ripetere errori)
- **Yousign `template_placeholders.signers[].label`**: case-sensitive, deve
  matchare ESATTAMENTE i placeholder signer label nel template UI Yousign.
  NON usare `role`, `role_name`, `roleName` — solo `label`.
- **Yousign documents riutilizzo**: un `document_id` da `POST /documents` è
  legato a UNA sola signature request. Per riusarlo serve nuovo upload.
  Il `template_id` invece è riutilizzabile N volte (Yousign clona internamente).
- **Yousign sandbox: delivery email instabile** (vedi sezione "Stato critico").
  Non aggiungere workaround complessi nel codice. Aspettare/passare a production.
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

## Switch Yousign sandbox → production (quando si farà)
Da fare se domani sandbox è ancora rotto, oppure al primo commitment angel.
Tempo stimato: 60-90 minuti.
Steps:
1. Login su Yousign **production** (account separato da sandbox)
2. Verificare offerta trial 13gg gratis attiva
3. Configurare dominio sender (DNS SPF/DKIM su realaistate.ai) — 30-60 min
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

## Prossima sessione (07/05/2026)
1. **Test Yousign sandbox** — se funziona, era blip. Se rotto, valutare switch production.
2. llms.txt aggiornato con stato attuale prodotto
3. Task 7: Contatta notaio (chat AI qualificante + email automatica)
4. UX double-check email in form signup (per evitare typo come "+nme01@")

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score interattivo — chat AI che restituisce range OMI o score motivato
- **Generazione PDF dinamica della proposta** (PDFShift): necessaria col secondo immobile
- **Refactor Immobile.jsx**: leggere dati immobile da DB invece di hardcoded
- **Webhook Yousign** per aggiornare status='signed' su Supabase a firma completata
- **Redirect post-login**: se utente clicca link CTA email mentre non è loggato,
  dopo login deve tornare alla destination, non alla home (oggi va alla home)
- **Form "Vendi casa" reale**: oggi /vendi raccoglie info ma non crea record
  in `immobili`. Serve flusso che: salva immobile in DB, associa
  venditore_user_id all'utente loggato, abilita policy INSERT su immobili.
- **Validazione form proposta/signup**: doppio campo email per evitare typo;
  tutti i form transazionali dovrebbero averla.
- **Link firma diretto in dashboard venditore** (opzione C non implementata):
  salvare i `signature_link` Yousign in `proposte` come jsonb e mostrarli come
  bottone "Apri pagina firma" — utile come fallback quando email non arriva.

## Bilancio giornata 06/05/2026
**Quello che ha funzionato:**
- Refactor architetturale serio in mezza giornata: tabella immobili, RLS pulita,
  gating dashboard, JWT backend, email transazionali con design custom,
  sezione "Le mie proposte", custom SMTP Brevo, FK + tipi allineati
- Pipeline end-to-end testata almeno una volta con successo (compratore ha
  ricevuto, ha firmato — la prima signature request del pomeriggio)

**Quello che è rimasto aperto:**
- Yousign sandbox delivery instabile (non risolvibile dal nostro lato)

**Lezioni:**
- Quando codice + payload + log indicano "tutto a posto" ma il sintomo persiste,
  il problema è esterno. Smettere di cercare bug nel proprio codice.
- Le decisioni di switch ambiente (sandbox→production) si prendono lucidi,
  non a fine giornata su un bug intermittente.