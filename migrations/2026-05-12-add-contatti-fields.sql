-- migrations/2026-05-12-add-contatti-fields.sql
--
-- Hotfix 6.7: aggiunge 4 colonne contatti (contatto_nome, contatto_cognome,
-- contatto_email, contatto_telefono) alla tabella public.immobili. Tutti
-- TEXT.
--
-- Contesto: test E2E post-batch-6 (12/05) ha rivelato che lo step 4
-- contatti del form /vendi NON si pre-popola in modalità edit
-- /vendi?edit=<id>. Tutti gli altri campi sì (foto, indirizzo, prezzo,
-- documenti dopo hotfix 6.5+6.6). Root cause: i contatti sono salvati
-- solo nella tabella legacy `venditori`, mai in `immobili`. mapDbToForm
-- legge da immobili.* → undefined → form vuoto. Stesso pattern di
-- planimetria/ape pre-hotfix-6.5.
--
-- Decisione design: per-immobile, NON per-utente. Se l'utente ha 5
-- immobili e cambia il telefono in uno solo, gli altri 4 restano col
-- numero vecchio. Comportamento intenzionale — possono essere referenti
-- diversi per immobili diversi (es. studio professionale per uno,
-- referente personale per un altro). Single source of truth = immobili.
-- venditori legacy resta come lead capture ma non più SoT per i contatti
-- dell'annuncio.
--
-- Naming columns con prefisso `contatto_` per evitare collisioni
-- semantiche: `immobili.email` confliggerebbe con auth.users.email
-- (ambiguo), `immobili.nome` con il nome dell'immobile (titolo).
--
-- COME APPLICARE: copia in Supabase → SQL Editor → RUN. Idempotente.
--
-- AZIONE FOUNDER REQUIRED post-merge hotfix 6.7. Senza, INSERT/UPDATE
-- su immobili fallisce con "Could not find the 'contatto_nome' column"
-- (PostgREST cache miss).
--
-- DOPO eseguire 2026-05-12-backfill-contatti-immobile-6.sql per
-- popolare i contatti su id=6 (e altri immobili pre-hotfix).

BEGIN;

ALTER TABLE public.immobili
  ADD COLUMN IF NOT EXISTS contatto_nome TEXT,
  ADD COLUMN IF NOT EXISTS contatto_cognome TEXT,
  ADD COLUMN IF NOT EXISTS contatto_email TEXT,
  ADD COLUMN IF NOT EXISTS contatto_telefono TEXT;

NOTIFY pgrst, 'reload schema';

COMMIT;
