# RealAIstate — Stato del progetto
Aggiornato: 04/05/2026

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email: Brevo
- AI: Anthropic API
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
- Blog live con 6 articoli

### Settimana 1 MVP ✅ — completata 04/05/2026
- [x] Task 1: Supabase Auth — login e registrazione ✅
- [x] Navbar dinamica: "Accesso" → "Il mio account" se loggato ✅
- [x] CSS globale: reset unico, variabili centralizzate, footer corretto ✅
- [x] Quality check CSS completo su tutte le pagine src/ ✅
- [x] RLS abilitata su tabella chat_messages ✅
- [x] Task 2: Pagine protette + ProtectedRoute + pagina /account ✅
- [x] Task 3: Documenti con controllo accesso — lucchetto non loggati ✅
- [x] Task 4: Chat con storico persistente su Supabase ✅

## File chiave
- src/supabase.js — connessione Supabase (anon key eyJ...)
- src/AuthContext.jsx — gestione sessione utente globale
- src/LoginPage.jsx — pagina login/registrazione
- src/ProtectedRoute.jsx — componente route protetta
- src/AccountPage.jsx — pagina account utente con logout
- src/index.css — CSS globale: reset, variabili, footer, standard padding
- src/Immobile.jsx — scheda immobile con chat persistente

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign per offerta d'acquisto
- Non loggati vedono: prezzo, foto, descrizione, Fair Price Score + lucchetti documenti
- Loggati vedono: documenti pubblici scaricabili (APE, Visura, Planimetria) + chat con storico
- Documenti sensibili (Atto di provenienza, delibere): su richiesta per tutti
- SRL: da aprire al primo commitment angel

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- Termini.jsx: separare da App.jsx come file standalone
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth: aggiungere dopo email+password
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore

## Prossima sessione — Settimana 2
- Task 5: Storico chat per utente (dashboard conversazioni)
- Task 6: Notifiche email quando arriva un messaggio
- Task 7: Dashboard venditore — vede le conversazioni sui propri immobili
- Task 8: Form contatto notaio con email automatica