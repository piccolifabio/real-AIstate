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

### Sessione 04/05/2026 ✅
- VS Code + Node.js installati e configurati
- Supabase Auth: login e registrazione live
- Navbar dinamica: "Accesso" → "Il mio account" se loggato
- CSS globale in index.css: reset unico, variabili centralizzate, footer corretto
- Footer: logo bianco/rosso, link alla home, hover viola
- Padding hero uniformato (8rem 3rem 5rem) su tutte le pagine
- Navbar custom rimossa da AffittiPage, ComeFunziona, FaqPage
- Quality check CSS completo su tutte le pagine src/
- RLS abilitata su tabella chat_messages (Supabase)
- File blog obsoleti rimossi (BlogVerona.jsx, BlogOMI2025.jsx, index.js)

### Settimana 1 MVP — in corso
- [x] Supabase Auth: login e registrazione ✅
- [x] Navbar dinamica: "Accesso"/"Il mio account" ✅
- [ ] Task 2: Pagine protette (scheda solo loggati)
- [ ] Task 3: Documenti scaricabili con controllo accesso
- [ ] Task 4: Chat immobile legata al login

## File chiave
- src/supabase.js — connessione Supabase (anon key eyJ...)
- src/AuthContext.jsx — gestione sessione utente globale
- src/LoginPage.jsx — pagina login/registrazione
- src/index.css — CSS globale: reset, variabili, footer, standard padding

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign per offerta d'acquisto
- Non loggati vedono: prezzo, foto, descrizione, Fair Price Score
- Loggati vedono: planimetrie, visure, APE, documenti
- SRL: da aprire al primo commitment angel

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- Termini.jsx: separare da App.jsx come file standalone
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth: aggiungere dopo email+password

## Prossima sessione — Task 2
- Proteggere scheda immobile: redirect a /login se non loggati
- Creare pagina /account base
- Mostrare documenti solo a utenti loggati