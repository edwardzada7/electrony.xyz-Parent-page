-- Add the missing provider transaction-reference key without changing rows.
-- Run as the database owner after reviewing the deployed Bills schema.
-- This does not alter column types, other columns, grants, or RLS policies.
-- The duplicate check excludes NULL because PostgreSQL unique keys allow multiple NULLs.

BEGIN;
SET LOCAL lock_timeout = '5s';

DO $$
DECLARE
  transaction_reference_attnum smallint;
  null_reference_count bigint;
BEGIN
  IF to_regclass('public.bill_orders') IS NULL THEN
    RAISE EXCEPTION 'public.bill_orders does not exist; migration was not applied';
  END IF;

  SELECT attnum
  INTO transaction_reference_attnum
  FROM pg_attribute
  WHERE attrelid = 'public.bill_orders'::regclass
    AND attname = 'provider_transaction_reference'
    AND attnum > 0
    AND NOT attisdropped;

  IF transaction_reference_attnum IS NULL THEN
    RAISE EXCEPTION 'bill_orders.provider_transaction_reference does not exist; migration was not applied';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_index
    WHERE indrelid = 'public.bill_orders'::regclass
      AND indisunique
      AND indisvalid
      AND indpred IS NULL
      AND indnatts = 1
      AND indkey[0] = transaction_reference_attnum
  ) THEN
    RAISE NOTICE 'A valid full unique key already covers provider_transaction_reference; no change needed';
    RETURN;
  END IF;

  SELECT count(*)
  INTO null_reference_count
  FROM public.bill_orders
  WHERE provider_transaction_reference IS NULL;

  RAISE NOTICE
    '% bill_orders rows have a NULL provider transaction reference; the nullable unique key will preserve them',
    null_reference_count;

  IF EXISTS (
    SELECT 1
    FROM public.bill_orders
    WHERE provider_transaction_reference IS NOT NULL
    GROUP BY provider_transaction_reference
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Duplicate non-NULL bill_orders.provider_transaction_reference values exist; inspect and resolve them without deleting records before retrying';
  END IF;

  IF to_regclass('public.bill_orders_provider_transaction_reference_key') IS NOT NULL THEN
    RAISE EXCEPTION
      'The intended unique-key name is already in use; inspect that index or constraint before retrying';
  END IF;

  ALTER TABLE public.bill_orders
    ADD CONSTRAINT bill_orders_provider_transaction_reference_key
    UNIQUE (provider_transaction_reference);
END;
$$;

COMMIT;
