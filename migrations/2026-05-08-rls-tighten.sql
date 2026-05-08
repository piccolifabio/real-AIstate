-- migrations/2026-05-08-rls-tighten.sql
--
-- Adattato ai nomi policy effettivi del DB (verificati via discovery query 2026-05-08).
--
-- Cambia che fa:
--   1. chat_messages: oggi qualsiasi loggato legge TUTTO e scrive come vuole
--      (incluso impersonare 'ai'). Chiudo: SELECT solo al venditore proprietario
--      o al compratore originario via email; INSERT solo via service_role.
--   2. scuse: oggi INSERT pubblico aperto. Chiudo: solo via service_role
--      (smonta.js e admin-scuse.js già la usano).
--
-- COME APPLICARE: incolla in Supabase → SQL Editor → RUN.
-- Tempo: < 1 secondo.
--
-- DOPO: smoke test chat su /immobili/1 (deve ancora funzionare perché
-- chat-immobile.js usa SUPABASE_SECRET_KEY dal commit 4d99afa).

BEGIN;

-- ── chat_messages ────────────────────────────────────────────────────────────
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lettura messaggi utenti loggati"   ON public.chat_messages;
DROP POLICY IF EXISTS "Scrittura messaggi utenti loggati" ON public.chat_messages;

CREATE POLICY "chat_messages_venditore_read"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (
    immobile_id IN (
      SELECT id FROM public.immobili WHERE venditore_user_id = auth.uid()
    )
  );

CREATE POLICY "chat_messages_compratore_read"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (compratore_email IS NOT NULL AND compratore_email = auth.email());

-- ── scuse ────────────────────────────────────────────────────────────────────
ALTER TABLE public.scuse ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert" ON public.scuse;

NOTIFY pgrst, 'reload schema';

COMMIT;
