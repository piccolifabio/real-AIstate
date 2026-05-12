-- migrations/2026-05-12-backfill-documenti-immobile-6.sql
--
-- Backfill planimetria + ape sull'immobile id=6 (pubblicato pre-hotfix 6.5
-- via walktest4@gmail.com). I PDF sono in tabella legacy `venditori`
-- (colonne planimetria_url, ape_url) ma non in `immobili`. Questa migration
-- li copia matchando la riga venditori per email del venditore
-- (auth.users.email == venditori.email), prendendo la più recente.
--
-- Idempotente: COALESCE preserva valori già popolati. Rilanciabile senza
-- danno (es. se il primo run non matcha la riga venditori e il founder
-- popola manualmente, un secondo run non sovrascrive).
--
-- ESTENSIONE TUTTI GLI IMMOBILI: se vuoi backfillare tutti gli immobili
-- con planimetria/ape null, sostituisci la clausola WHERE finale con:
--   WHERE i.planimetria IS NULL OR i.ape IS NULL
-- Rilanciabile senza danno grazie a COALESCE.
--
-- COME APPLICARE: incolla in Supabase → SQL Editor → RUN. Eseguire DOPO
-- 2026-05-12-add-documenti-fields.sql (richiede le colonne nuove).
--
-- VERIFICA POST-RUN:
--   SELECT id, planimetria, ape FROM public.immobili WHERE id = 6;
--   -- atteso: entrambe popolate con URL https://...supabase.co/storage/v1/...

BEGIN;

UPDATE public.immobili i
SET
  planimetria = COALESCE(i.planimetria, (
    SELECT v.planimetria_url
    FROM public.venditori v
    WHERE v.email = (SELECT u.email FROM auth.users u WHERE u.id = i.venditore_user_id)
      AND v.planimetria_url IS NOT NULL
    ORDER BY v.created_at DESC
    LIMIT 1
  )),
  ape = COALESCE(i.ape, (
    SELECT v.ape_url
    FROM public.venditori v
    WHERE v.email = (SELECT u.email FROM auth.users u WHERE u.id = i.venditore_user_id)
      AND v.ape_url IS NOT NULL
    ORDER BY v.created_at DESC
    LIMIT 1
  ))
WHERE i.id = 6;

COMMIT;
