-- migrations/2026-05-08-rls-tighten.sql
--
-- Security pass del 2026-05-08 — punto #5 di FIXES_TODO.md.
--
-- Obiettivo: chiudere i due buchi RLS rimanenti.
--   1. `chat_messages`: oggi accetta INSERT pubblico via anon key (chat-immobile.js
--      lo fa). Vogliamo che SOLO il service_role possa scrivere (la API
--      chat-immobile passerà attraverso service_role e fa i suoi controlli).
--      La lettura resta possibile per il venditore proprietario degli immobili
--      (già garantita dalla RLS esistente, vedi nota in fondo).
--   2. `scuse`: oggi smonta.js scrive con service_role, quindi possiamo
--      restringere INSERT pubblico se è attivo. Lettura pubblica può restare,
--      è il muro delle scuse "anonime" della pagina /scuse.
--
-- COME APPLICARE:
--   - Apri Supabase → SQL Editor
--   - Incolla questo file e premi RUN
--   - Verifica nel pannello Authentication → Policies che le nuove policy
--     siano attive e quelle vecchie rimosse.
--   - **PRIMA DI ESEGUIRE**: leggi i blocchi NOTE qui sotto. Se hai policy
--     custom non documentate in STATO_PROGETTO.md, fai prima un dump:
--         pg_dump --schema-only --table=chat_messages --table=scuse > backup.sql
--     o su Supabase: Database → Backups → Create.
--
-- DOPO L'APPLICAZIONE:
--   - chat-immobile.js continua a funzionare perché passa già da service_role
--     per la scrittura (lo aggiorneremo nel commit successivo, vedi NOTA in fondo).
--   - smonta.js continua a funzionare (già usa SUPABASE_SECRET_KEY).
--   - VenditoreDashboard.jsx continua a leggere chat_messages dei propri immobili
--     se la policy SELECT esistente è quella documentata.

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. chat_messages — chiudi INSERT pubblico
-- ─────────────────────────────────────────────────────────────────────────────

-- NOTE: assumiamo che esista una policy che permette INSERT public.
-- Lista delle policy attuali da console SQL prima di eseguire:
--   SELECT polname, polcmd, polroles::regrole[] FROM pg_policy
--   WHERE polrelid = 'public.chat_messages'::regclass;

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop policy permissive vecchie (se esistono — i nomi sono ipotesi tipiche
-- di Supabase Studio. Se hanno altri nomi, vedi query sopra e adatta).
DROP POLICY IF EXISTS "Enable insert for everyone"            ON public.chat_messages;
DROP POLICY IF EXISTS "Enable insert for anon users"          ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_anon_insert"             ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages"       ON public.chat_messages;
DROP POLICY IF EXISTS "Public insert"                         ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public insert"                   ON public.chat_messages;

-- Niente policy = niente INSERT per anon/authenticated.
-- Il service_role bypassa sempre RLS, quindi le API serverless continuano
-- a poter scrivere. Tutti i client browser falliscono → buono.

-- Manteniamo (o creiamo) la policy SELECT che permette al venditore di leggere
-- i messaggi sui propri immobili. Pattern documentato in STATO_PROGETTO.md.
DROP POLICY IF EXISTS "chat_messages_venditore_read" ON public.chat_messages;
CREATE POLICY "chat_messages_venditore_read"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (
    immobile_id IN (
      SELECT id FROM public.immobili WHERE venditore_user_id = auth.uid()
    )
  );

-- Policy SELECT per il compratore: legge i messaggi delle sue sessioni se
-- l'email matcha il suo auth.email. Utile per "le mie chat" lato compratore.
DROP POLICY IF EXISTS "chat_messages_compratore_read" ON public.chat_messages;
CREATE POLICY "chat_messages_compratore_read"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (
    compratore_email IS NOT NULL
    AND compratore_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. scuse — chiudi INSERT pubblico
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.scuse ENABLE ROW LEVEL SECURITY;

-- Stessa logica: smonta.js scrive con service_role, non serve INSERT pubblico.
DROP POLICY IF EXISTS "Enable insert for everyone"   ON public.scuse;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.scuse;
DROP POLICY IF EXISTS "scuse_anon_insert"            ON public.scuse;
DROP POLICY IF EXISTS "Public insert"                ON public.scuse;
DROP POLICY IF EXISTS "Allow public insert"          ON public.scuse;

-- Lettura pubblica (Hall of Excuses): lasciamola se la vuoi mantenere.
-- Se vuoi nasconderla, commenta il blocco seguente.
DROP POLICY IF EXISTS "scuse_public_read" ON public.scuse;
CREATE POLICY "scuse_public_read"
  ON public.scuse
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Audit policy `USING (true)` legacy su altre tabelle
-- ─────────────────────────────────────────────────────────────────────────────
-- Lo STATO_PROGETTO.md menziona "RLS legacy con USING (true): pattern velenoso,
-- audit periodico". Esegui questa query e rivedi caso per caso:
--
--   SELECT
--     n.nspname AS schema,
--     c.relname AS table,
--     pol.polname AS policy_name,
--     pol.polcmd AS command,
--     pol.polroles::regrole[] AS roles,
--     pg_get_expr(pol.polqual, pol.polrelid) AS using_expr,
--     pg_get_expr(pol.polwithcheck, pol.polrelid) AS check_expr
--   FROM pg_policy pol
--   JOIN pg_class c ON c.oid = pol.polrelid
--   JOIN pg_namespace n ON n.oid = c.relnamespace
--   WHERE n.nspname = 'public'
--   ORDER BY c.relname, pol.polname;
--
-- Per ogni riga con `using_expr = 'true'`, valuta:
--   - se è una policy SELECT pubblica intenzionale (es. listing immobili),
--     OK rinominarla a `*_public_read` per chiarezza ma lasciarla.
--   - se è un INSERT/UPDATE/DELETE con `USING (true)`, è un bug: vai a togliere
--     o restringere a service_role / auth.uid() owner.

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Reload schema cache PostgREST (necessario dopo policy changes)
-- ─────────────────────────────────────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';

COMMIT;

-- NOTA finale per chat-immobile.js:
-- Dopo aver applicato questa migration, le scritture su chat_messages dalla
-- API serverless devono passare da SUPABASE_SECRET_KEY (service_role), non più
-- da SUPABASE_ANON_KEY. Il file chat-immobile.js attualmente usa anon — va
-- aggiornato a SUPABASE_SECRET_KEY nel prossimo commit.
-- (Il commit "fix(security): chat_messages writes with service_role" lo fa già.)
