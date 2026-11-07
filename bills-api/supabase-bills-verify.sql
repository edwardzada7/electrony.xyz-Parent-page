-- Read-only verification for the existing Bills App Supabase project.
-- Select Bills App in the dashboard before running. Every statement is SELECT-only.
-- This does not change roles, grants, tables, policies, or transaction data.

-- Runtime role attributes, memberships, database ownership, and public-schema grants.
SELECT
  current_database() AS database_name,
  runtime_role.rolname,
  runtime_role.rolcanlogin AS can_login,
  runtime_role.rolsuper AS is_superuser,
  runtime_role.rolcreatedb AS can_create_databases,
  runtime_role.rolcreaterole AS can_create_roles,
  runtime_role.rolinherit AS inherits_roles,
  runtime_role.rolreplication AS can_replicate,
  runtime_role.rolbypassrls AS bypasses_rls,
  COALESCE(has_schema_privilege(runtime_role.oid, 'public', 'USAGE'), false) AS has_public_schema_usage,
  COALESCE(has_schema_privilege(runtime_role.oid, 'public', 'CREATE'), false) AS has_public_schema_create,
  COALESCE((
    SELECT bool_or(database_info.datdba = runtime_role.oid)
    FROM pg_database database_info
  ), false) AS owns_a_database,
  COALESCE((
    SELECT bool_or(membership.member = runtime_role.oid)
    FROM pg_auth_members membership
  ), false) AS has_role_memberships
FROM (VALUES (1)) AS one_row(dummy)
LEFT JOIN pg_roles runtime_role
  ON runtime_role.rolname = 'electrony_bills_runtime';

-- Effective table privileges and effective SELECT access for frontend roles.
WITH expected_tables(table_name, allows_insert_update) AS (
  VALUES
    ('electrony_products', false),
    ('bill_fee_quotes', true),
    ('bill_orders', true),
    ('bill_payment_attempts', true),
    ('bill_payment_webhook_events', true),
    ('bill_platform_settings', false)
)
SELECT
  expected.table_name,
  relation.oid IS NOT NULL AS table_exists,
  relation.relrowsecurity AS rls_enabled,
  pg_get_userbyid(relation.relowner) AS table_owner,
  COALESCE(has_table_privilege(runtime_role.oid, relation.oid, 'SELECT'), false) AS runtime_select,
  COALESCE(has_table_privilege(runtime_role.oid, relation.oid, 'INSERT'), false) AS runtime_insert,
  COALESCE(has_table_privilege(runtime_role.oid, relation.oid, 'UPDATE'), false) AS runtime_update,
  COALESCE(has_table_privilege(runtime_role.oid, relation.oid, 'DELETE'), false) AS runtime_delete,
  COALESCE(has_table_privilege(runtime_role.oid, relation.oid, 'TRUNCATE'), false) AS runtime_truncate,
  COALESCE(has_table_privilege(runtime_role.oid, relation.oid, 'REFERENCES'), false) AS runtime_references,
  COALESCE(has_table_privilege(runtime_role.oid, relation.oid, 'TRIGGER'), false) AS runtime_trigger,
  COALESCE((
    SELECT array_agg(grant_info.privilege_type ORDER BY grant_info.privilege_type)
    FROM aclexplode(COALESCE(relation.relacl, acldefault('r', relation.relowner))) grant_info
    WHERE grant_info.grantee = runtime_role.oid
  ), ARRAY[]::text[]) AS direct_runtime_table_grants,
  COALESCE((
    SELECT array_agg(grant_info.privilege_type ORDER BY grant_info.privilege_type)
    FROM aclexplode(COALESCE(relation.relacl, acldefault('r', relation.relowner))) grant_info
    WHERE grant_info.grantee = runtime_role.oid
      AND grant_info.is_grantable
  ), ARRAY[]::text[]) AS runtime_grant_options,
  COALESCE((
    SELECT array_agg(grant_info.privilege_type ORDER BY grant_info.privilege_type)
    FROM aclexplode(COALESCE(relation.relacl, acldefault('r', relation.relowner))) grant_info
    WHERE grant_info.grantee = 0
  ), ARRAY[]::text[]) AS public_table_grants,
  COALESCE(
    has_table_privilege(anon_role.oid, relation.oid, 'SELECT')
      OR has_any_column_privilege(anon_role.oid, relation.oid, 'SELECT'),
    false
  ) AS anon_can_select,
  COALESCE(
    has_table_privilege(authenticated_role.oid, relation.oid, 'SELECT')
      OR has_any_column_privilege(authenticated_role.oid, relation.oid, 'SELECT'),
    false
  ) AS authenticated_can_select,
  COALESCE((
    SELECT array_agg(privilege_name ORDER BY privilege_name)
    FROM unnest(ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']::text[])
      AS privilege(privilege_name)
    WHERE has_table_privilege(anon_role.oid, relation.oid, privilege_name)
  ), ARRAY[]::text[]) AS anon_table_privileges,
  COALESCE((
    SELECT array_agg(privilege_name ORDER BY privilege_name)
    FROM unnest(ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']::text[])
      AS privilege(privilege_name)
    WHERE has_table_privilege(authenticated_role.oid, relation.oid, privilege_name)
  ), ARRAY[]::text[]) AS authenticated_table_privileges,
  expected.allows_insert_update
FROM expected_tables expected
LEFT JOIN pg_class relation
  ON relation.relnamespace = 'public'::regnamespace
  AND relation.relname = expected.table_name
  AND relation.relkind IN ('r', 'p')
LEFT JOIN pg_roles runtime_role
  ON runtime_role.rolname = 'electrony_bills_runtime'
LEFT JOIN pg_roles anon_role
  ON anon_role.rolname = 'anon'
LEFT JOIN pg_roles authenticated_role
  ON authenticated_role.rolname = 'authenticated'
ORDER BY expected.table_name;

-- Every expected role-specific policy should be present and match the operation.
WITH expected_policies(table_name, command, expected_using, expected_check) AS (
  VALUES
    ('electrony_products', 'SELECT', 'true', NULL::text),
    ('bill_fee_quotes', 'SELECT', 'true', NULL::text),
    ('bill_fee_quotes', 'INSERT', NULL::text, 'true'),
    ('bill_fee_quotes', 'UPDATE', 'true', 'true'),
    ('bill_orders', 'SELECT', 'true', NULL::text),
    ('bill_orders', 'INSERT', NULL::text, 'true'),
    ('bill_orders', 'UPDATE', 'true', 'true'),
    ('bill_payment_attempts', 'SELECT', 'true', NULL::text),
    ('bill_payment_attempts', 'INSERT', NULL::text, 'true'),
    ('bill_payment_attempts', 'UPDATE', 'true', 'true'),
    ('bill_payment_webhook_events', 'SELECT', 'true', NULL::text),
    ('bill_payment_webhook_events', 'INSERT', NULL::text, 'true'),
    ('bill_payment_webhook_events', 'UPDATE', 'true', 'true'),
    ('bill_platform_settings', 'SELECT', 'true', NULL::text)
)
SELECT
  expected.table_name,
  expected.command,
  policy.policyname,
  policy.roles,
  policy.permissive,
  policy.qual AS using_expression,
  policy.with_check AS check_expression,
  policy.policyname IS NOT NULL
    AND policy.roles = ARRAY['electrony_bills_runtime']::name[]
    AND policy.permissive = 'PERMISSIVE'
    AND policy.qual IS NOT DISTINCT FROM expected.expected_using
    AND policy.with_check IS NOT DISTINCT FROM expected.expected_check AS matches_expected
FROM expected_policies expected
LEFT JOIN pg_policies policy
  ON policy.schemaname = 'public'
  AND policy.tablename = expected.table_name
  AND policy.cmd = expected.command
ORDER BY expected.table_name, expected.command, policy.policyname;

-- Show any additional policies on the six tables, including PUBLIC/frontend roles.
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check AS check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'electrony_products',
    'bill_fee_quotes',
    'bill_orders',
    'bill_payment_attempts',
    'bill_payment_webhook_events',
    'bill_platform_settings'
  )
ORDER BY tablename, policyname;

-- Explicit column-level grants can exist alongside table-level privileges.
SELECT
  relation.relname AS table_name,
  column_info.attname AS column_name,
  CASE
    WHEN grant_info.grantee = 0 THEN 'PUBLIC'
    ELSE grantee_role.rolname
  END AS granted_to,
  grant_info.privilege_type,
  grant_info.is_grantable
FROM pg_attribute column_info
JOIN pg_class relation
  ON relation.oid = column_info.attrelid
JOIN pg_namespace schema_info
  ON schema_info.oid = relation.relnamespace
CROSS JOIN LATERAL aclexplode(
  COALESCE(column_info.attacl, ARRAY[]::aclitem[])
) grant_info
LEFT JOIN pg_roles grantee_role
  ON grantee_role.oid = grant_info.grantee
WHERE schema_info.nspname = 'public'
  AND relation.relname IN (
    'electrony_products',
    'bill_fee_quotes',
    'bill_orders',
    'bill_payment_attempts',
    'bill_payment_webhook_events',
    'bill_platform_settings'
  )
  AND column_info.attnum > 0
  AND NOT column_info.attisdropped
  AND (
    grant_info.grantee = 0
    OR grantee_role.rolname IN ('electrony_bills_runtime', 'anon', 'authenticated')
  )
ORDER BY relation.relname, column_info.attname, granted_to, grant_info.privilege_type;
