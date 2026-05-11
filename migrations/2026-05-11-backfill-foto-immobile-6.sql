-- Batch 5 task 5.A — backfill foto immobile id=6
-- (utente walktest4, Viale Murillo 17, pubblicato prima del fix che salva
-- URL completi via supabase.storage.getPublicUrl).
--
-- Sintomo: la riga immobili.id=6 ha foto jsonb come array di NOMI FILE
-- relativi (es. "foto/1715425234123-abc123.jpg"). Listing.jsx e Immobile.jsx
-- li passano direttamente come <img src=...> → 404 silenzioso.
--
-- Fix runtime: VendiForm.jsx ora salva URL completi via getPublicUrl().
-- Per gli immobili pre-fix serve questo backfill.
--
-- Idempotente: solo i path relativi (senza '://') vengono trasformati;
-- gli URL già completi restano invariati. Rilanciabile più volte senza danno.

UPDATE public.immobili
SET foto = (
  SELECT jsonb_agg(
    CASE
      WHEN value::text LIKE '%://%' THEN value
      ELSE to_jsonb(
        'https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/'
        || trim('"' FROM value::text)
      )
    END
  )
  FROM jsonb_array_elements(foto) AS value
)
WHERE id = 6
  AND foto IS NOT NULL
  AND jsonb_array_length(foto) > 0;

-- Verifica post-update: gli URL devono iniziare con
-- "https://strigywjvkhbubyszuxp.supabase.co/storage/v1/object/public/documenti-venditori/"
SELECT id, indirizzo, jsonb_array_length(foto) AS n_foto, foto
FROM public.immobili
WHERE id = 6;

-- Volendo applicare a tutti gli immobili pre-fix (non solo id=6):
-- togliere il "AND id = 6" dalla WHERE. La condizione foto NOT NULL +
-- length > 0 protegge gli immobili senza foto.
