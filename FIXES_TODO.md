# Security pass — TODO che richiedono te

Generato: 2026-05-08
Riferimento: [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) sezione 6(a).

I 6 fix di pura codifica (1, 2, 4, 6, 7, 8) sono già stati applicati nel branch
`claude/brave-ramanujan-a72d08`. Restano questi 3 che richiedono setup esterno
o accessi che non posso fare per te.

---

## 1. Eseguire la migration RLS — `migrations/2026-05-08-rls-tighten.sql`

**Tempo**: 5 minuti.
**Perché**: chiude l'INSERT pubblico su `chat_messages` e `scuse`. Senza questo, il
fix lato API è incompleto — l'attaccante può ancora scrivere direttamente su
quelle tabelle bypassando le API.

**Passi**:
1. Apri Supabase → SQL Editor → New query.
2. Prima di tutto, verifica le policy esistenti (sostituisci `chat_messages` e
   ripeti per `scuse`):
   ```sql
   SELECT polname, polcmd, polroles::regrole[]
   FROM pg_policy
   WHERE polrelid = 'public.chat_messages'::regclass;
   ```
   Se vedi nomi di policy diversi da quelli che la migration prova a droppare,
   adatta la migration aggiungendo i tuoi nomi.
3. Incolla `migrations/2026-05-08-rls-tighten.sql` e premi RUN.
4. Verifica: nel pannello Authentication → Policies, le tabelle `chat_messages`
   e `scuse` non devono avere più policy con command INSERT per ruoli `anon` o
   `authenticated`.
5. Smoke test:
   - Apri `/immobili/1`, manda un messaggio in chat → deve funzionare (l'API
     scrive con service_role).
   - Apri DevTools console su `/immobili/1` e prova a scrivere direttamente:
     ```js
     window.__sb = (await import('/src/supabase.js')).supabase
     await window.__sb.from('chat_messages').insert({ testo: 'hack', sessione_id: 'x', immobile_id: 1, mittente: 'compratore' })
     ```
     Deve fallire con errore RLS. Se passa, la policy non è stata applicata.

**Nota importante**: il commit `fix(security): chat_messages writes with service_role`
ha già aggiornato `api/chat-immobile.js` per scrivere con `SUPABASE_SECRET_KEY`
invece che `SUPABASE_ANON_KEY`. La API continua a funzionare dopo la migration.

---

## 2. Setup Upstash Redis per rate-limit — punto #3 del review

**Tempo**: 10-15 minuti.
**Perché**: oggi le 4 API che chiamano Anthropic (chat-immobile, chat-affordability,
chat-venditore, smonta) sono anonime. Un attaccante può bruciare il tuo budget
Anthropic in poche ore. Il rate-limit è il vero argine.

**Passi**:
1. Vai su https://upstash.com → Sign up con GitHub (gratis fino a 10k req/giorno).
2. Crea un nuovo database Redis:
   - Name: `realaistate-ratelimit`
   - Type: Regional → `eu-west-1` (più vicino a Vercel)
   - Eviction: enabled
3. Apri il database → tab "REST API" → copia:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Aggiungili in Vercel:
   - Settings → Environment Variables
   - Aggiungi entrambi a Production + Preview + Development
   - Sensitive: ✓
5. Aggiungili anche in `.env.local` per lavoro in `vercel dev`.
6. Pingami al ritorno: scrivo `api/_lib/rate-limit.js` (sliding window con
   `@upstash/ratelimit`, 30 righe) e lo applico sulle 4 API. ~30 minuti di
   lavoro mio. Da decidere insieme: limit per IP loggato vs anon.

**Costo**: gratis fino a 10k req/giorno. A volume MVP non lo paghi mai.

**Alternativa se non vuoi Upstash**: Vercel KV ha free tier ma è meno generoso
e l'integrazione è equivalente. Upstash è la scelta standard.

---

## 3. Setup Sentry — punto #9 del review (opzionale ma raccomandato)

**Tempo**: 15 minuti.
**Perché**: oggi non hai modo di sapere cosa rompe in produzione fino a quando un
venditore ti scrive. Sentry cattura errori frontend (crash React) e backend
(errori nelle API serverless) con stack trace e contesto. Free tier copre 5k
events/mese.

**Passi**:
1. Vai su https://sentry.io → Sign up con GitHub.
2. Crea un nuovo progetto:
   - Platform: React
   - Project name: `realaistate-frontend`
3. Copia il DSN che ti mostra (formato `https://...@o....ingest.sentry.io/...`).
4. Aggiungilo in Vercel → Environment Variables come `VITE_SENTRY_DSN`
   (Production + Preview, NON sensitive — il DSN è pubblico per design).
5. Aggiungilo a `.env.local`.
6. Crea un secondo progetto per il backend:
   - Platform: Node.js
   - Project name: `realaistate-api`
7. Copia il DSN, aggiungilo a Vercel come `SENTRY_DSN_API` (Production + Preview,
   sensitive).
8. Pingami: integro `@sentry/react` in `main.jsx` con error boundary e
   `@sentry/node` come wrapper attorno agli handler delle API. ~1 ora di lavoro
   mio.

**Alternativa light**: solo Vercel Log Drains → BetterStack (Logtail). Meno
features ma zero setup. Scegli tu.

---

## 4. Cancellare branch git remoti morti

**Tempo**: 2 minuti. Lo faccio io se mi dai OK esplicito, altrimenti fallo tu
da GitHub UI per sicurezza.

I branch remoti che il review consigliava di cancellare:
- `origin/feat/listing-dinamico` (mergiato in main con PR precedenti)
- `origin/feat/vendi-reale` (mergiato)
- `origin/fix/dashboard-venditore-cover` (mergiato)

**Verifica prima di cancellare** che siano davvero mergiati:
```bash
git log --oneline origin/main ^origin/feat/listing-dinamico
git log --oneline origin/main ^origin/feat/vendi-reale
git log --oneline origin/main ^origin/fix/dashboard-venditore-cover
```
Se l'output è vuoto, sono safe da cancellare.

**Cancellazione via GitHub UI** (raccomandato):
- https://github.com/piccolifabio/real-AIstate/branches → click cestino accanto
  a ogni branch.

**Cancellazione via CLI** (se preferisci):
```bash
git push --delete origin feat/listing-dinamico feat/vendi-reale fix/dashboard-venditore-cover
git fetch --prune
```

---

## 5. Aggiornare le env Vercel (verifica, non setup)

I miei cambi assumono che queste env esistano già in Vercel (le usavi già):

| Env var | Production | Preview | Note |
|---|---|---|---|
| `VITE_SUPABASE_URL` | ✓ | ✓ | Già configurata |
| `VITE_SUPABASE_ANON_KEY` | ✓ | ✓ | Già configurata |
| `VITE_GOOGLE_MAPS_KEY` | ✓ | ✓ | Già configurata |
| `SUPABASE_URL` | ✓ | ✓ | Già configurata |
| `SUPABASE_SECRET_KEY` | ✓ | ✓ | Già configurata |
| `ANTHROPIC_API_KEY` | ✓ | ✓ | Già configurata |
| `BREVO_API_KEY` | ✓ | ✓ | Già configurata |
| `YOUSIGN_API_KEY` | ✓ | ✓ | Già configurata |
| `ADMIN_SECRET` | ✓ | ✓ | Già configurata |

Verifica veloce su Vercel → Settings → Environment Variables. Se manca qualcosa,
fammelo sapere.

**Nuove env da aggiungere** (vedi punti 2 e 3 sopra):
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `VITE_SENTRY_DSN`, `SENTRY_DSN_API`

---

## 6. Smoke test post-merge

Dopo che mergi `claude/brave-ramanujan-a72d08` su main e Vercel deploya:

**Frontend**:
- [ ] `/` carica
- [ ] `/compra` mostra Capecelatro
- [ ] `/immobili/1` carica con foto + chat
- [ ] Login → `/account` mostra le mie proposte
- [ ] Login → `/venditore` (se sei venditore di Capecelatro)

**API critiche**:
- [ ] Manda una proposta loggato da `/immobili/1` → email arriva, dashboard
      venditore la vede.
- [ ] Manda una proposta NON loggato → bottone "Fai un'offerta" non
      compare comunque (gating frontend), ma se chiami direttamente l'API
      con curl senza Authorization header dovrebbe rispondere 401:
      ```bash
      curl -X POST https://realaistate.ai/api/proposta-submit \
        -H 'Content-Type: application/json' \
        -d '{"immobile_id":1,"importo":1,"data_rogito":"2027-01-01"}'
      # atteso: {"error":"Token mancante"}
      ```
- [ ] Chat in `/immobili/1` funziona, messaggi salvati su Supabase.
- [ ] CORS test: dalla console di un dominio esterno (es. https://example.com)
      `fetch('https://realaistate.ai/api/chat-immobile', ...)` deve fallire
      per CORS (era `*` prima, ora ristretto).

**Email**:
- [ ] `condizioni`/`note` con `<script>alert(1)</script>` nel testo non
      esegue nulla quando arriva nell'inbox del venditore (deve apparire come
      testo letterale, escapato).

---

## TL;DR per il pranzo del lunedì

1. Apri Supabase, esegui `migrations/2026-05-08-rls-tighten.sql` (5 min).
2. Crea Upstash account, aggiungi 2 env in Vercel (10 min).
3. (Opzionale) Crea Sentry account, aggiungi 2 env in Vercel (10 min).
4. Cancella i 3 branch remoti su GitHub UI (2 min).
5. Smoke test post-deploy (15 min).

Totale: ~45 minuti di lavoro tuo. Poi mi pinghi e finisco rate-limit + Sentry SDK.
