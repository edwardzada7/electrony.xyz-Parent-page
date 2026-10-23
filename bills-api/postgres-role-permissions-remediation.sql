-- Administrator-run, narrowly scoped cleanup for direct grants to the Bills
-- runtime role. Review /health checks.privilegeDiagnostics first; this does not alter
-- PUBLIC, anon, authenticated, role memberships, owners, RLS, functions, or other schemas.

BEGIN;

DO $$
DECLARE
  table_name text;
  relation_oid oid;
  has_rls boolean;
  owner_name text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'electrony_bills_runtime'
  ) THEN
    RAISE EXCEPTION 'electrony_bills_runtime is missing; no permission changes applied';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_auth_members membership
    JOIN pg_roles runtime_role ON runtime_role.oid = membership.member
    WHERE runtime_role.rolname = 'electrony_bills_runtime'
  ) THEN
    RAISE EXCEPTION 'electrony_bills_runtime has role memberships; no permission changes applied';
  END IF;

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
      RAISE EXCEPTION 'Required public.% table is missing; no permission changes applied', table_name;
    END IF;

    SELECT relation.relrowsecurity, pg_get_userbyid(relation.relowner)
    INTO has_rls, owner_name
    FROM pg_class relation
    WHERE relation.oid = relation_oid;

    IF NOT has_rls OR owner_name <> 'postgres' THEN
      RAISE EXCEPTION
        'public.% must remain RLS-enabled and owned by postgres; no permission changes applied',
        table_name;
    END IF;
  END LOOP;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_class relation
    JOIN pg_namespace schema_info ON schema_info.oid = relation.relnamespace
    JOIN (VALUES
      ('electrony_products', ARRAY['SELECT']::text[]),
      ('bill_fee_quotes', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_orders', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_payment_attempts', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_payment_webhook_events', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_platform_settings', ARRAY['SELECT']::text[])
    ) required(table_name, privileges) ON required.table_name = relation.relname
    CROSS JOIN LATERAL aclexplode(
      COALESCE(relation.relacl, acldefault('r', relation.relowner))
    ) grant_info
    WHERE schema_info.nspname = 'public'
      AND relation.relkind IN ('r', 'p')
      AND grant_info.grantee = (
        SELECT oid FROM pg_roles WHERE rolname = 'electrony_bills_runtime'
      )
      AND (
        grant_info.privilege_type <> ALL(required.privileges)
        OR grant_info.is_grantable
      )
  )
  AND NOT EXISTS (
    SELECT 1
    FROM pg_attribute column_info
    JOIN pg_class relation ON relation.oid = column_info.attrelid
    JOIN pg_namespace schema_info ON schema_info.oid = relation.relnamespace
    JOIN (VALUES
      ('electrony_products', ARRAY['SELECT']::text[]),
      ('bill_fee_quotes', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_orders', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_payment_attempts', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_payment_webhook_events', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_platform_settings', ARRAY['SELECT']::text[])
    ) required(table_name, privileges) ON required.table_name = relation.relname
    CROSS JOIN LATERAL aclexplode(
      COALESCE(column_info.attacl, ARRAY[]::aclitem[])
    ) grant_info
    WHERE schema_info.nspname = 'public'
      AND relation.relkind IN ('r', 'p')
      AND column_info.attnum > 0
      AND NOT column_info.attisdropped
      AND grant_info.grantee = (
        SELECT oid FROM pg_roles WHERE rolname = 'electrony_bills_runtime'
      )
      AND (
        grant_info.privilege_type <> ALL(required.privileges)
        OR grant_info.is_grantable
        OR NOT has_table_privilege(
          'electrony_bills_runtime',
          relation.oid,
          grant_info.privilege_type
        )
      )
  )
  AND NOT EXISTS (
    SELECT 1
    FROM pg_class sequence_info
    JOIN pg_namespace schema_info ON schema_info.oid = sequence_info.relnamespace
    CROSS JOIN LATERAL aclexplode(
      COALESCE(sequence_info.relacl, acldefault('S', sequence_info.relowner))
    ) grant_info
    WHERE sequence_info.relkind = 'S'
      AND schema_info.nspname !~ '^pg_'
      AND schema_info.nspname <> 'information_schema'
      AND grant_info.grantee = (
        SELECT oid FROM pg_roles WHERE rolname = 'electrony_bills_runtime'
      )
      AND (
        grant_info.privilege_type <> 'USAGE'
        OR grant_info.is_grantable
        OR NOT EXISTS (
          SELECT 1
          FROM pg_class target_table
          JOIN pg_attribute target_column ON target_column.attrelid = target_table.oid
          WHERE target_table.relnamespace = 'public'::regnamespace
            AND target_table.relname IN (
              'bill_fee_quotes',
              'bill_orders',
              'bill_payment_attempts',
              'bill_payment_webhook_events'
            )
            AND target_column.attnum > 0
            AND NOT target_column.attisdropped
            AND to_regclass(pg_get_serial_sequence(
              format('%I.%I', 'public', target_table.relname),
              target_column.attname
            )) = sequence_info.oid
        )
      )
  )
  AND NOT EXISTS (
    SELECT 1
    FROM pg_namespace schema_info
    CROSS JOIN LATERAL aclexplode(
      COALESCE(schema_info.nspacl, acldefault('n', schema_info.nspowner))
    ) grant_info
    WHERE schema_info.nspname = 'public'
      AND grant_info.grantee = (
        SELECT oid FROM pg_roles WHERE rolname = 'electrony_bills_runtime'
      )
      AND (grant_info.privilege_type = 'CREATE' OR grant_info.is_grantable)
  ) THEN
    RAISE EXCEPTION
      'No excessive direct grants in this script scope were found; no permission changes applied';
  END IF;
END;
$$;

REVOKE ALL PRIVILEGES ON TABLE
  public.electrony_products,
  public.bill_fee_quotes,
  public.bill_orders,
  public.bill_payment_attempts,
  public.bill_payment_webhook_events,
  public.bill_platform_settings
FROM electrony_bills_runtime;

DO $$
DECLARE
  table_name text;
  column_record record;
  sequence_name text;
  privilege_name text;
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
    FOR column_record IN
      SELECT attribute.attname
      FROM pg_attribute attribute
      WHERE attribute.attrelid = format('public.%I', table_name)::regclass
        AND attribute.attnum > 0
        AND NOT attribute.attisdropped
    LOOP
      FOREACH privilege_name IN ARRAY ARRAY['SELECT', 'INSERT', 'UPDATE', 'REFERENCES']
      LOOP
        EXECUTE format(
          'REVOKE %s (%I) ON TABLE public.%I FROM electrony_bills_runtime',
          privilege_name,
          column_record.attname,
          table_name
        );
      END LOOP;

      sequence_name := pg_get_serial_sequence(
        format('public.%I', table_name),
        column_record.attname
      );
      IF sequence_name IS NOT NULL THEN
        EXECUTE format(
          'REVOKE ALL PRIVILEGES ON SEQUENCE %s FROM electrony_bills_runtime',
          sequence_name
        );
        IF table_name IN (
          'bill_fee_quotes',
          'bill_orders',
          'bill_payment_attempts',
          'bill_payment_webhook_events'
        ) THEN
          EXECUTE format(
            'GRANT USAGE ON SEQUENCE %s TO electrony_bills_runtime',
            sequence_name
          );
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

REVOKE CREATE ON SCHEMA public FROM electrony_bills_runtime;
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
