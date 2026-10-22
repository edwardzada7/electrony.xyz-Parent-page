-- Administrator-run SQL for the existing Electrony Bills database.
-- Review the target database and existing role before running this file.
-- Set the password separately in psql; never store credentials in this file.

BEGIN;

DO $$
DECLARE
  table_name text;
  relation_oid oid;
  has_rls boolean;
  owner_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'electrony_products',
    'bill_fee_quotes',
    'bill_orders',
    'bill_payment_attempts',
    'bill_payment_webhook_events',
    'bill_platform_settings'
  ]
  LOOP
    relation_oid := to_regclass(format('public.%I', table_name));
    IF relation_oid IS NULL THEN
      RAISE EXCEPTION 'Required public.% table is missing; no role changes applied', table_name;
    END IF;

    SELECT relation.relrowsecurity, pg_get_userbyid(relation.relowner)
    INTO has_rls, owner_name
    FROM pg_class relation
    WHERE relation.oid = relation_oid;

    IF NOT has_rls OR owner_name <> 'postgres' THEN
      RAISE EXCEPTION
        'public.% must remain RLS-enabled and owned by postgres; no role changes applied',
        table_name;
    END IF;
  END LOOP;
END;
$$;

CREATE ROLE electrony_bills_runtime
  LOGIN
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOINHERIT
  NOREPLICATION
  NOBYPASSRLS;

GRANT USAGE ON SCHEMA public TO electrony_bills_runtime;

GRANT SELECT ON TABLE
  public.electrony_products,
  public.bill_platform_settings
TO electrony_bills_runtime;

GRANT SELECT, INSERT, UPDATE ON TABLE
  public.bill_fee_quotes,
  public.bill_orders,
  public.bill_payment_attempts,
  public.bill_payment_webhook_events
TO electrony_bills_runtime;

COMMIT;
