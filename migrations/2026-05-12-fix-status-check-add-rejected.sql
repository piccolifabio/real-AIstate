-- migrations/2026-05-12-fix-status-check-add-rejected.sql
--
-- Hotfix 6.9 (doc only): batch 6 task 6.F (modal rifiuto admin) ha
-- introdotto lo stato 'rejected' su `immobili.status`, ma il CHECK
-- constraint `immobili_status_check` non era stato aggiornato — accettava
-- solo i 3 valori storici (draft, pending_review, published). Risultato:
-- ogni PATCH a `status='rejected'` falliva in produzione con
-- "new row for relation \"immobili\" violates check constraint
-- immobili_status_check".
--
-- Il founder ha già applicato MANUALMENTE in produzione il fix il
-- 12/05/2026 (DROP CONSTRAINT + ADD CONSTRAINT). Questa migration
-- documenta il cambio nel repo per coerenza e per restore futuri: se
-- mai serve ricostruire il DB da zero, l'esecuzione sequenziale delle
-- migration produce lo stato corretto.
--
-- Idempotente: DROP CONSTRAINT IF EXISTS lo rende rilanciabile senza
-- danno. Su DB già fixato manualmente, l'effetto è: drop costraint
-- corrente (che già accetta 'rejected') e ricreazione identica.
--
-- COME APPLICARE (se non già fatto): incolla in Supabase → SQL Editor →
-- RUN. In produzione 12/05 è già stato applicato a mano, quindi
-- esecuzione qui è NO-OP funzionale (ma idempotente — safe rilanciare).
--
-- Note future: se aggiungerai altri status (es. 'sold', 'archived'),
-- ricorda di aggiornare anche questo CHECK. Lista corrente in sync con
-- l'enum logico usato da Admin.jsx tabs (hotfix 6.E):
-- draft / pending_review / published / rejected.

BEGIN;

ALTER TABLE public.immobili
  DROP CONSTRAINT IF EXISTS immobili_status_check;

ALTER TABLE public.immobili
  ADD CONSTRAINT immobili_status_check
  CHECK (status IN ('draft', 'pending_review', 'published', 'rejected'));

NOTIFY pgrst, 'reload schema';

COMMIT;
