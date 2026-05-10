-- Migration ONE-SHOT — split full_name in nome + cognome per utenti esistenti.
-- Da eseguire UNA volta dal founder via Supabase SQL Editor dopo il deploy
-- del batch 2 (10/05/2026), task 2.B.
--
-- CONTESTO: prima del 10/05 il signup salvava SOLO `full_name` in
-- auth.users.user_metadata. Da oggi salviamo `nome` + `cognome` separati e
-- mantenamo `full_name` come derivato. Per gli utenti pre-migrazione il
-- frontend (LoginPage / AccountPage / VendiForm) ha già un fallback runtime
-- che splitta full_name al primo whitespace; questa query rende
-- l'allineamento persistente lato DB così le email transazionali e
-- qualunque altro consumer leggano direttamente `nome`/`cognome`.
--
-- LOGICA:
--   - nome    = primo token di full_name (split_part su ' ')
--   - cognome = tutto ciò che segue il primo whitespace, NULL se vuoto
--               (es. utente con un solo token come "Madonna" → cognome NULL)
-- Filtro WHERE: tocca solo utenti che hanno full_name e che non hanno
-- ancora il campo `nome` (idempotente — rilanciabile senza danni).
--
-- NOTA: stiamo modificando dati in jsonb, non lo schema. Non serve
-- `NOTIFY pgrst, 'reload schema'`.

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data
  || jsonb_build_object(
       'nome', split_part(raw_user_meta_data->>'full_name', ' ', 1),
       'cognome', NULLIF(
         regexp_replace(raw_user_meta_data->>'full_name', '^\S+\s*', ''),
         ''
       )
     )
WHERE raw_user_meta_data ? 'full_name'
  AND NOT (raw_user_meta_data ? 'nome');
