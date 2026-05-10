-- Migration — aggiunge campi indirizzo strutturati alla tabella immobili.
-- Da eseguire UNA volta dal founder via Supabase SQL Editor in occasione del
-- deploy del batch 2 (10/05/2026), task 2.D.
--
-- CONTESTO: prima del 10/05 il form /vendi catturava solo `indirizzo` come
-- testo libero. Conseguenze: indirizzi inventati / errati / incompleti
-- passavano senza validazione, niente CAP / città / provincia, impossibile
-- geocoding o ricerca per zona. Da oggi /vendi step 1 usa Google Places
-- Autocomplete e popola tutti i campi strutturati.
--
-- COLONNE NUOVE:
--   - cap         text     -- es. "20133"
--   - citta       text     -- es. "Milano"
--   - provincia   text     -- es. "MI" (short_name di administrative_area_level_2)
--   - latitudine  numeric  -- es. 45.4775 (per future feature: clustering, ricerca per raggio)
--   - longitudine numeric  -- es. 9.2275
--
-- La colonna `zona` (es. "Città Studi") esiste già nello schema da settimane
-- precedenti — è popolata da sublocality_level_1 / neighborhood quando Google
-- la fornisce, fallback al nome del comune quando manca (piccoli paesi).
--
-- Tutte le colonne sono NULLABLE: serve a mantenere idempotenza
-- (`IF NOT EXISTS`) e perché immobili già presenti pre-migrazione resteranno
-- senza i nuovi campi finché non vengono ri-salvati.

ALTER TABLE public.immobili
  ADD COLUMN IF NOT EXISTS cap text,
  ADD COLUMN IF NOT EXISTS citta text,
  ADD COLUMN IF NOT EXISTS provincia text,
  ADD COLUMN IF NOT EXISTS latitudine numeric,
  ADD COLUMN IF NOT EXISTS longitudine numeric;

-- Forza PostgREST a ricaricare lo schema cache: necessario dopo ALTER TABLE
-- altrimenti le serverless function ricevono "Could not find column ..."
-- finché Vercel non rinvia un cold start.
NOTIFY pgrst, 'reload schema';
