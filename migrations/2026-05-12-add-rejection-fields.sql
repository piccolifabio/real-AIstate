-- migrations/2026-05-12-add-rejection-fields.sql
--
-- Aggiunge colonne per persistere il motivo di rifiuto admin sull'immobile.
-- Batch 6 task 6.F: oggi /admin → "Rifiuta" usa prompt() per chiedere
-- motivo, manda email al venditore col testo, e setta status='draft' senza
-- traccia del motivo nel DB. Con queste colonne:
--   - rejection_reason: testo del motivo (10-500 char, sanitizzato)
--   - rejected_at: timestamp del rifiuto (last)
--   - rejected_by_email: email admin che ha rifiutato (oggi placeholder
--     'admin' perché /admin login usa ADMIN_SECRET shared, non un Supabase
--     user; quando passeremo a OPZIONE B in batch futuro popoleremo l'email
--     reale dal JWT admin)
--
-- Status cambia da 'draft' (era così pre-batch 6) a 'rejected'. Il
-- venditore vede badge dedicato in dashboard e bottone "Modifica" attivo
-- (task 6.C) — quando ri-submitta, status passa a 'pending_review' (vedi
-- api/vendi-submit.js branch _mode=update).
--
-- COME APPLICARE: copia in Supabase → SQL Editor → RUN. Idempotente: le
-- colonne sono creates con IF NOT EXISTS, NOTIFY pgrst alla fine ricarica
-- la cache schema PostgREST.
--
-- AZIONE FOUNDER REQUIRED post-merge batch 6: eseguire questa migration.
-- Senza, il PATCH in /api/admin/rifiuta fallisce con errore "Could not
-- find the 'rejection_reason' column" (PostgREST cache miss).

BEGIN;

ALTER TABLE public.immobili
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_by_email TEXT;

NOTIFY pgrst, 'reload schema';

COMMIT;
