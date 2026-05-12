-- migrations/2026-05-12-fix-docs-urls-immobile-6.sql
--
-- Hotfix 6.6: converte planimetria/ape da path relativi a URL completi
-- per id=6 (backfillato in hotfix 6.5 dalla tabella legacy `venditori`
-- che li aveva come path relativi pre-batch-5). Coerente col pattern
-- delle foto (batch 5 task 5.A) che standardizza URL completi via
-- getPublicUrl.
--
-- Stato pre-migration (verificato dal founder post-hotfix-6.5):
--   id=6 planimetria: 'planimetrie/1778518928396-awqfftw5j5e.pdf'
--   id=6 ape:         'ape/1778518928397-dcur0ns2hkp.pdf'
--
-- Stato atteso post-migration:
--   id=6 planimetria: 'https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/planimetrie/1778518928396-...pdf'
--   id=6 ape:         'https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/ape/1778518928397-...pdf'
--
-- Benefici operativi:
--   1. Coerenza con foto (un format unico nel DB → debug più semplice)
--   2. Storage cleanup di id=6 funzionerà se walktest4 modifica i doc
--      (oggi gli orphan PDF resterebbero nel bucket perché il check
--      `startsWith(bucketBase)` non matcha path relativi)
--
-- Idempotente: il CHECK `NOT LIKE 'https://%'` evita di toccare valori
-- già URL completi. Rilanciabile senza danno (0 righe modificate al
-- secondo run).
--
-- ESTENSIONE TUTTI GLI IMMOBILI PRE-HOTFIX: sostituire `WHERE id = 6`
-- con `WHERE planimetria NOT LIKE 'https://%' OR ape NOT LIKE 'https://%'`.
--
-- COME APPLICARE: copia in Supabase → SQL Editor → RUN. Eseguire DOPO
-- 2026-05-12-add-documenti-fields.sql e
-- 2026-05-12-backfill-documenti-immobile-6.sql (entrambe hotfix 6.5).

BEGIN;

UPDATE public.immobili
SET planimetria = 'https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/' || planimetria
WHERE id = 6
  AND planimetria IS NOT NULL
  AND planimetria NOT LIKE 'https://%';

UPDATE public.immobili
SET ape = 'https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/' || ape
WHERE id = 6
  AND ape IS NOT NULL
  AND ape NOT LIKE 'https://%';

COMMIT;
