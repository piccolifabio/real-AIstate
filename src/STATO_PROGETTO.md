# RealAIstate — Stato del progetto
Aggiornato: 05/05/2026

## Stack
- Frontend: React + Vite, deploy su Vercel
- Backend: Supabase (auth + database + storage)
- API serverless: Vercel functions (api/)
- Email: Brevo (SMTP collegato a Supabase)
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

## File chiave
- src/HomePage.jsx — home page con Nav e CTA
- src/ScusePage.jsx — pagina scuse separata
- src/Privacy.jsx — privacy policy
- src/Termini.jsx — termini di servizio
- src/VenditoreDashboard.jsx — dashboard conversazioni venditore
- src/AccountPage.jsx — pagina account con link dashboard
- src/supabase.js — connessione Supabase
- src/AuthContext.jsx — gestione sessione
- src/LoginPage.jsx — login/registrazione
- src/ProtectedRoute.jsx — route protetta
- src/index.css — CSS globale
- src/blog/articoli.js — contenuto articoli
- src/BlogPage.jsx — lista articoli (aggiungere in cima per ordine cronologico)

## Decisioni architetturali
- Pagamenti: esclusi MVP v1, notaio partner come depositario
- Firma: FEA via Yousign per offerta d'acquisto
- Non loggati: prezzo, foto, descrizione, Fair Price Score + lucchetti documenti
- Loggati: documenti pubblici scaricabili (APE, Visura, Planimetria) + chat con storico
- Documenti sensibili (Atto di provenienza, delibere): su richiesta per tutti
- Email moderazione: info@realaistate.ai prima dell'inoltro al venditore
- Blog: aggiungere nuovo articolo in cima ad articoli.js e BlogPage.jsx
- SRL: da aprire al primo commitment angel

## Prossima sessione — Settimana 3

### Task 8: Form proposta d'acquisto
- Bottone "Fai una proposta" sulla scheda immobile (solo loggati)
- Form: importo offerta, condizioni, data proposta rogito, note
- Email automatica a info@realaistate.ai con tutti i dati
- Venditore riceve notifica e può accettare/rifiutare dalla dashboard

### Task 7: Contatta notaio (si sblocca dopo offerta accettata)
- Flusso AI qualificante: hai un notaio di fiducia? (Sì/No)
- Se sì → raccoglie dati notaio e invia briefing completo via email
- Se no → propone notai certificati nella zona dell'immobile
- Email automatica al notaio con: dati immobile, parti, documenti, istruzioni caparra

### Task 9: Integrazione Yousign — firma digitale FEA
- Firma digitale sulla proposta d'acquisto
- Valida legalmente ai sensi dell'art. 1341-1342 c.c.

## Da fare post-MVP
- ImmobileVenditore.jsx: refactor CSS e navbar
- VendiForm.jsx: fix allineamento padding laterale
- Google OAuth
- Memoria condivisa per immobile: AI risponde con risposte già date dal venditore
- Fair Price Score interattivo — chat AI che fa domande e restituisce:
  1. Range di prezzo suggerito su dati OMI (modalità "quanto vale la mia casa?")
  2. Fair Price Score motivato se il venditore ha già un prezzo in mente
  Posizionamento: pagina /valuta o widget nella landing