-- migrations/2026-05-12-backfill-contatti-immobile-6.sql
--
-- Backfill dei 4 campi contatti su immobili.id=6, copiando dalla riga
-- venditori matchata per email del venditore (auth.users.email ==
-- venditori.email), riga più recente. Idempotente: COALESCE preserva
-- valori già popolati.
--
-- Eseguire DOPO 2026-05-12-add-contatti-fields.sql (richiede le colonne).
--
-- ESTENSIONE A TUTTI GLI IMMOBILI PRE-HOTFIX: sostituire la clausola
-- finale `WHERE i.id = 6` con:
--   WHERE i.contatto_nome IS NULL OR i.contatto_cognome IS NULL
--      OR i.contatto_email IS NULL OR i.contatto_telefono IS NULL
-- Rilanciabile senza danno (COALESCE non sovrascrive).
--
-- VERIFICA POST-RUN:
--   SELECT id, contatto_nome, contatto_cognome, contatto_email,
--          contatto_telefono FROM public.immobili WHERE id = 6;

BEGIN;

UPDATE public.immobili i
SET
  contatto_nome = COALESCE(i.contatto_nome, (
    SELECT v.nome FROM public.venditori v
    WHERE v.email = (SELECT u.email FROM auth.users u WHERE u.id = i.venditore_user_id)
      AND v.nome IS NOT NULL
    ORDER BY v.created_at DESC
    LIMIT 1
  )),
  contatto_cognome = COALESCE(i.contatto_cognome, (
    SELECT v.cognome FROM public.venditori v
    WHERE v.email = (SELECT u.email FROM auth.users u WHERE u.id = i.venditore_user_id)
      AND v.cognome IS NOT NULL
    ORDER BY v.created_at DESC
    LIMIT 1
  )),
  contatto_email = COALESCE(i.contatto_email, (
    SELECT v.email FROM public.venditori v
    WHERE v.email = (SELECT u.email FROM auth.users u WHERE u.id = i.venditore_user_id)
      AND v.email IS NOT NULL
    ORDER BY v.created_at DESC
    LIMIT 1
  )),
  contatto_telefono = COALESCE(i.contatto_telefono, (
    SELECT v.telefono FROM public.venditori v
    WHERE v.email = (SELECT u.email FROM auth.users u WHERE u.id = i.venditore_user_id)
      AND v.telefono IS NOT NULL
    ORDER BY v.created_at DESC
    LIMIT 1
  ))
WHERE i.id = 6;

COMMIT;
