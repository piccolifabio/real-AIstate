-- migrations/2026-05-15-add-immobili-extra-fields.sql
--
-- Batch 7 task 7.A: aggiunge 4 colonne alla tabella public.immobili che
-- il form /vendi raccoglie ma che NON avevano una colonna corrispondente
-- in immobili (erano salvate solo nella tabella legacy `venditori`):
--   terrazzo_mq  NUMERIC  — metratura terrazzo/balcone
--   cantina      TEXT     — "si" / "no" (toggle)
--   cantina_mq   NUMERIC  — metratura cantina
--   note_prezzo  TEXT     — note libere del venditore sul prezzo
--
-- Contesto: test E2E 15/05 (FASE 4.4) — in edit mode /vendi?edit=<id> il
-- form non si pre-popola completamente. Root cause (esplorazione batch 7):
-- api/vendi-submit.js scrive ~11 campi solo in `venditori`, mai in
-- `immobili`. mapDbToForm legge da immobili.* → null → campo vuoto.
-- Stesso pattern di contatti pre-hotfix-6.7 e planimetria/ape pre-6.5.
--
-- Gli altri campi mancanti (ascensore, terrazzo, garage, garage_mq,
-- giardino_condominiale, riscaldamento, acqua_calda, spese_condominio,
-- anno_ristrutturazione, disponibilita_rogito) HANNO già la colonna in
-- immobili — vengono fixati lato vendi-submit/mapDbToForm, niente DDL.
-- Questa migration copre SOLO i 4 campi senza colonna.
--
-- COME APPLICARE: copia in Supabase → SQL Editor → RUN. Idempotente.
--
-- AZIONE FOUNDER REQUIRED post-merge batch 7. Senza, INSERT/UPDATE su
-- immobili fallisce con "Could not find the 'terrazzo_mq' column"
-- (PostgREST schema cache miss). Nessun backfill: campi nuovi → NULL
-- sulle righe esistenti (incl. id=1 Capecelatro), comportamento ok.

BEGIN;

ALTER TABLE public.immobili
  ADD COLUMN IF NOT EXISTS terrazzo_mq NUMERIC,
  ADD COLUMN IF NOT EXISTS cantina TEXT,
  ADD COLUMN IF NOT EXISTS cantina_mq NUMERIC,
  ADD COLUMN IF NOT EXISTS note_prezzo TEXT;

NOTIFY pgrst, 'reload schema';

COMMIT;
