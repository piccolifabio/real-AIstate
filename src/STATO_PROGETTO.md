# RealAIstate — Stato del progetto
Aggiornato: 06/05/2026

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email: Brevo (SMTP collegato a Supabase)
- AI: Anthropic API
- Firma digitale: Yousign sandbox (40gg trial API)
- Repo: github.com/piccolifabio/real-AIstate
- Sito live: realaistate.ai

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
- [x] Task 9: Integrazione Yousign — firma digitale FEA funzionante ✅
  - Template Yousign sandbox ID: 71505658-23d8-4d5a-9ff1-2e221294e929
  - PDF generato da template HTML caricato su Yousign
  - Signature request con due firmatari (Compratore + Venditore)
  - Email inviata ai firmatari con link per firma digitale
  - Firma completata con successo in sandbox
- [x] Fix scroll pagina immobile — si apre in cima ✅

## File chiave
- src/HomePage.jsx — home page con Nav e CTA
- src/ScusePage.jsx — pagina scuse separata
- src/Privacy.jsx — privacy policy
- src/Termini.jsx — termini di servizio
- src/VenditoreDashboard.jsx — dashboard conversazioni venditore
- src/AccountPage.jsx — pagina account con link dashboard
- src/Immobile.jsx — scheda immobile con chat, documenti, proposta
- src/supabase.js — connessione Supabase
- src/AuthContext.jsx — gestione sessione
- src/LoginPage.jsx — login/registrazione
- src/ProtectedRoute.jsx — route protetta
- src/index.css — CSS globale
- src/blog/articoli.js — contenuto articoli
- src/BlogPage.jsx — lista articoli (aggiungere in cima per ordine cronologico)
- api/chat-immobile.js — chat AI con notifiche email
- api/proposta-submit.js — salvataggio proposta Supabase + email Brevo
- api/yousign-proposta.js — firma digitale FEA via Yousign
- api/vendi-submit.js — form venditore
- public/proposta_acquisto_template.html — template proposta visualizzabile e caricato su Yousign

## Supabase tabelle
- chat_messages — messaggi chat (user_id, immobile_id, sessione_id, mittente, testo)
- proposte — proposte d'acquisto (status: pending/accepted/rejected, yousign_id)
- scuse — scuse dalla pagina /scuse
- venditori — form venditori

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign sandbox — switch a produzione alla prima transazione reale
- Non loggati: prezzo, foto, descrizione, Fair Price Score + lucchetti documenti
- Loggati: documenti pubblici + chat con storico + proposta d'acquisto
- Documenti sensibili: su richiesta
- Email moderazione: info@realaistate.ai prima dell'inoltro al venditore
- Fee: €2.000 compratore + €499 venditore — dovute solo a rogito completato
- MAI riferimento a intermediazione immobiliare nel documento proposta
- Blog: aggiungere in cima ad articoli.js e BlogPage.jsx
- SRL: da aprire al primo commitment angel
- Yousign: sandbox per test, switch produzione al primo commitment

## Prossima sessione
- Bottone "Accetta proposta" in dashboard venditore → chiama api/yousign-proposta.js e aggiorna status proposta su Supabase
- llms.txt aggiornato con stato attuale prodotto
- Task 7: Contatta notaio (chat AI qualificante + email automatica)

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score interattivo — chat AI che restituisce range OMI o score motivato
- Automazione generazione PDF proposta (pdfshift o puppeteer)