# RealAIstate — Stato del progetto
Aggiornato: 05/05/2026

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email: Brevo (SMTP collegato a Supabase)
- AI: Anthropic API
- Firma digitale: Yousign (sandbox attivo, 40gg trial API)
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

### Settimana 3 — in corso 05/05/2026
- [x] Task 8: Form proposta d'acquisto con modal ✅
- [x] Template proposta d'acquisto visibile nella sezione documenti ✅
- [x] API serverless proposta-submit.js ✅
- [x] Template HTML proposta d'acquisto completo (v2) con dati catastali, pertinenze, condizioni pagamento ✅
- [x] Task 9: Integrazione Yousign — firma digitale FEA funzionante ✅
  - PDF generato con pdf-lib
  - Documento caricato su Yousign sandbox
  - Signature request con due firmatari
  - Campi firma posizionati sul documento
  - Email inviata ai firmatari
  - Firma digitale completata con successo in sandbox

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
- src/BlogPage.jsx — lista articoli
- api/chat-immobile.js — chat AI con notifiche email
- api/proposta-submit.js — email proposta d'acquisto
- api/yousign-proposta.js — firma digitale FEA via Yousign
- public/proposta_acquisto_template.html — template proposta visualizzabile

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign — sandbox attivo, produzione quando prime transazioni
- Non loggati: prezzo, foto, descrizione, Fair Price Score + lucchetti documenti
- Loggati: documenti pubblici + chat con storico + proposta d'acquisto
- Documenti sensibili: su richiesta
- Email moderazione: info@realaistate.ai prima dell'inoltro al venditore
- Blog: aggiungere in cima ad articoli.js e BlogPage.jsx
- SRL: da aprire al primo commitment angel
- Yousign: sandbox per test, switch a produzione al primo commitment

## Prossima sessione
- Collegare bottone "Accetta proposta" in dashboard venditore → chiama api/yousign-proposta.js
- Creare tabella `proposte` su Supabase per salvare le proposte
- Task 7: Contatta notaio (si sblocca dopo offerta accettata)

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score interattivo — chat AI che restituisce range OMI o score motivato