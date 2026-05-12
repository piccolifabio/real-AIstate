-- migrations/2026-05-12-add-documenti-fields.sql
--
-- Aggiunge colonne `planimetria` e `ape` (entrambe TEXT, URL pubblici
-- Supabase Storage) alla tabella public.immobili. Hotfix 6.5.
--
-- Contesto: batch 6 task 6.C ha introdotto modalità edit /vendi?edit=<id>.
-- Le foto si pre-popolano correttamente perché immobili.foto esiste come
-- jsonb. Planimetria e APE invece NO: erano salvate solo in tabella
-- legacy `venditori` (planimetria_url, ape_url), mai in immobili. Quindi
-- mapDbToForm in src/VendiForm.jsx legge db.planimetria/db.ape → null →
-- step 3 del form bloccato (gate `form.planimetria && form.ape`) → utente
-- costretto a ri-caricare i PDF.
--
-- Questa migration aggiunge le colonne, NOTIFY pgrst ricarica la cache
-- schema PostgREST. La hotfix backend (api/vendi-submit.js) popola
-- planimetria/ape sia in INSERT (nuove bozze) sia in PATCH (edit mode).
--
-- COME APPLICARE: incolla in Supabase → SQL Editor → RUN.
-- Idempotente: ADD COLUMN IF NOT EXISTS, rilanciabile senza danno.
--
-- AZIONE FOUNDER REQUIRED post-merge hotfix 6.5. Senza questa migration,
-- l'INSERT/UPDATE su immobili fallisce con "Could not find the 'planimetria'
-- column" (PostgREST cache miss).
--
-- DOPO questa migration, eseguire 2026-05-12-backfill-documenti-immobile-6.sql
-- per popolare planimetria/ape sull'immobile id=6 (e altri pre-hotfix)
-- copiando i valori da venditori.

BEGIN;

ALTER TABLE public.immobili
  ADD COLUMN IF NOT EXISTS planimetria TEXT,
  ADD COLUMN IF NOT EXISTS ape TEXT;

NOTIFY pgrst, 'reload schema';

COMMIT;
