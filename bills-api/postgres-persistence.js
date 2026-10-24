"use strict";

const fs = require("fs");
const crypto = require("crypto");
const tls = require("tls");
const { PLATFORM_FEE_RULES } = require("./platform-fees");

const REQUIRED_TABLES = [
  "electrony_products",
  "bill_fee_quotes",
  "bill_orders",
  "bill_payment_attempts",
  "bill_payment_webhook_events",
  "bill_platform_settings"
];

const CONNECTION_TIMEOUT_MS = 5000;
const QUERY_TIMEOUT_MS = 5000;
const POSTGRES_CA_CONFIGURATION_ERROR = "Bills PostgreSQL TLS configuration is invalid. Set exactly one of BILLS_POSTGRES_CA (PEM contents) or BILLS_POSTGRES_CA_FILE (mounted PEM path) to a valid Supabase root CA certificate.";
const POSTGRES_CA_CONFIGURATION_ERROR_CODE = "BILLS_POSTGRES_CA_CONFIGURATION";
const GUEST_ACCESS_HASH_KEY = "__guest_order_access_sha256";
const GUEST_ORDER_SECRET_BYTES = 32;

const CONNECTION_READINESS_QUERY = "SELECT 1 AS ready";
const SERVICES = Object.freeze(Object.fromEntries(
  Object.entries(PLATFORM_FEE_RULES).map(([service, rule]) => [service, rule.currency])
));
const QUOTE_STATUSES = new Set(["quoted", "used", "expired", "cancelled"]);
const ORDER_PAYMENT_STATUSES = new Set([
  "pending", "initiated", "paid", "failed", "cancelled", "refunded", "review_required"
]);
const ORDER_FULFILMENT_STATUSES = new Set([
  "not_started", "pending", "processing", "fulfilled", "failed", "review_required"
]);
const ATTEMPT_STATUSES = new Set([
  "initiated", "pending", "successful", "failed", "cancelled", "review_required"
]);
const WEBHOOK_STATUSES = new Set([
  "received", "processing", "processed", "ignored", "failed", "review_required"
]);
const PAYMENT_TRANSITIONS = Object.freeze({
  pending: new Set(["initiated", "failed", "cancelled", "review_required"]),
  initiated: new Set(["paid", "failed", "cancelled", "review_required"]),
  paid: new Set(["refunded", "review_required"]),
  failed: new Set(["review_required"]),
  cancelled: new Set(["review_required"]),
  refunded: new Set(),
  review_required: new Set(["paid", "failed", "cancelled", "refunded"])
});
const FULFILMENT_TRANSITIONS = Object.freeze({
  not_started: new Set(["pending", "processing", "failed", "review_required"]),
  pending: new Set(["processing", "failed", "review_required"]),
  processing: new Set(["fulfilled", "failed", "review_required"]),
  fulfilled: new Set(),
  failed: new Set(["review_required"]),
  review_required: new Set(["processing", "fulfilled", "failed"])
});
const ATTEMPT_TRANSITIONS = Object.freeze({
  initiated: new Set(["pending", "successful", "failed", "cancelled", "review_required"]),
  pending: new Set(["successful", "failed", "cancelled", "review_required"]),
  successful: new Set(),
  failed: new Set(["review_required"]),
  cancelled: new Set(["review_required"]),
  review_required: new Set(["successful", "failed", "cancelled"])
});
const SENSITIVE_FIELD = /(pass(word)?|secret|token|authorization|credential|card.?number|cvv|cvc|account.?number)/i;

function persistenceError(message, code) {
  const error = new Error(message);
  error.code = code;
  error.safePersistenceError = true;
  return error;
}

function sanitizeDatabaseError(error) {
  if (error?.code === "23505") {
    return persistenceError("A database uniqueness constraint was violated.", "unique_conflict");
  }
  if (["23502", "23503", "23514", "22P02"].includes(error?.code)) {
    return persistenceError("The database rejected the supplied record.", "constraint_violation");
  }
  if (error?.code === "42501") {
    return persistenceError("Database authorization denied this operation.", "database_unauthorized");
  }
  return persistenceError("Bills PostgreSQL operation failed.", "database_unavailable");
}

function getCausedErrors(error) {
  const errors = [];
  let current = error;
  while (
    current
    && (typeof current === "object" || typeof current === "function")
    && errors.length < 8
    && !errors.includes(current)
  ) {
    errors.push(current);
    current = current.cause;
  }
  return errors;
}

function isTlsConnectionErrorCode(code) {
  return /^(?:ERR_(?:SSL|TLS)_[A-Z0-9_]+|CERT_[A-Z0-9_]+|UNABLE_TO_[A-Z0-9_]*CERT[A-Z0-9_]*|SELF_SIGNED_CERT_IN_CHAIN|DEPTH_ZERO_SELF_SIGNED_CERT)$/.test(code);
}

function classifyConnectionFailure(error) {
  const errors = getCausedErrors(error);
  const codes = errors.map((item) => item.code).filter((code) => typeof code === "string");
  if (codes.some((code) => ["ENOTFOUND", "EAI_AGAIN", "EAI_NONAME"].includes(code))) {
    return "dns_error";
  }
  if (codes.includes("ECONNREFUSED")) return "connection_refused";
  if (codes.some((code) => ["ETIMEDOUT", "ESOCKETTIMEDOUT", "CONNECT_TIMEOUT"].includes(code))) {
    return "timeout";
  }
  if (codes.some(isTlsConnectionErrorCode)) {
    return "tls_error";
  }
  if (codes.some((code) => /^28[A-Z0-9]{3}$/.test(code))) return "authentication_failed";
  if (codes.includes("3D000")) return "database_missing";

  const messages = errors
    .map((item) => typeof item.message === "string" ? item.message.toLowerCase() : "")
    .join(" ");
  if (/getaddrinfo (?:enotfound|eai_again|eai_noname)|name or service not known/.test(messages)) {
    return "dns_error";
  }
  if (/connection refused/.test(messages)) return "connection_refused";
  if (/timed? ?out|timeout/.test(messages)) return "timeout";
  if (/ssl|tls|certificate/.test(messages)) return "tls_error";
  if (/password authentication failed|authentication failed|no password supplied/.test(messages)) {
    return "authentication_failed";
  }
  if (/database .* does not exist/.test(messages)) return "database_missing";
  return "unknown";
}

function safeConnectionErrorCode(error) {
  const errors = getCausedErrors(error);
  const codes = errors.map((item) => item.code).filter((code) => typeof code === "string");
  return codes.find((code) => /^(?:[A-Z][A-Z0-9_]{0,63}|[0-9A-Z]{5})$/.test(code)) || null;
}

function logConnectionFailure(error) {
  const category = classifyConnectionFailure(error);
  const errorCode = safeConnectionErrorCode(error);
  const details = { category };
  if (errorCode) details.errorCode = errorCode;
  console.error("Bills PostgreSQL connection failure.", details);
}

function validateText(value, field, { optional = false, maxLength = 255 } = {}) {
  if (optional && (value === null || value === undefined || value === "")) return null;
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw persistenceError(`${field} is invalid.`, "invalid_input");
  }
  return value.trim();
}

function validateMinorUnits(value, field, { allowZero = false } = {}) {
  if (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1)) {
    throw persistenceError(`${field} must be a valid integer amount in minor units.`, "invalid_input");
  }
  return value;
}

function validateMetadata(value, field = "metadata") {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) {
    throw persistenceError(`${field} must be a JSON object.`, "invalid_input");
  }
  const seen = new WeakSet();
  const pending = [value];
  while (pending.length) {
    const current = pending.pop();
    if (!current || typeof current !== "object" || seen.has(current)) continue;
    seen.add(current);
    for (const [key, nested] of Object.entries(current)) {
      if (SENSITIVE_FIELD.test(key)) {
        throw persistenceError(`${field} must not contain credentials or sensitive payment data.`, "sensitive_metadata");
      }
      pending.push(nested);
    }
  }
  try {
    JSON.stringify(value);
  } catch {
    throw persistenceError(`${field} must contain valid JSON data.`, "invalid_input");
  }
  return value;
}

function createGuestOrderSecret() {
  return crypto.randomBytes(GUEST_ORDER_SECRET_BYTES).toString("base64url");
}

function validateGuestOrderSecret(value, { optional = false } = {}) {
  if (optional && (value === null || value === undefined || value === "")) return null;
  if (typeof value !== "string"
    || !/^[A-Za-z0-9_-]{43}$/.test(value)
    || Buffer.from(value, "base64url").length !== GUEST_ORDER_SECRET_BYTES
    || Buffer.from(value, "base64url").toString("base64url") !== value) {
    throw persistenceError("A valid guest-order access secret is required.", "invalid_guest_order_secret");
  }
  return value;
}

function hashGuestOrderSecret(secret) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

function getOrderMetadata(order) {
  let metadata = order?.metadata;
  if (typeof metadata === "string") {
    try {
      metadata = JSON.parse(metadata);
    } catch {
      throw persistenceError("Stored order metadata is invalid.", "database_unavailable");
    }
  }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
  return metadata;
}

function verifyGuestOrderSecret(order, secret) {
  if (!order || order.customer_id !== null) return false;
  let validated;
  try {
    validated = validateGuestOrderSecret(secret);
  } catch {
    return false;
  }
  const storedHashValue = String(getOrderMetadata(order)[GUEST_ACCESS_HASH_KEY] || "");
  if (!/^[a-f0-9]{64}$/.test(storedHashValue)) return false;
  const storedHash = Buffer.from(storedHashValue, "hex");
  const suppliedHash = Buffer.from(hashGuestOrderSecret(validated), "hex");
  return storedHash.length === suppliedHash.length
    && crypto.timingSafeEqual(storedHash, suppliedHash);
}

function sanitizeOrder(order) {
  if (!order) return order;
  const metadata = { ...getOrderMetadata(order) };
  delete metadata[GUEST_ACCESS_HASH_KEY];
  return { ...order, metadata };
}

function authorizeOrder(order, authorization) {
  if (!order || !authorization || typeof authorization !== "object" || Array.isArray(authorization)) {
    return false;
  }
  const customerId = validateText(authorization.customerId, "customerId", { optional: true });
  const guestOrderSecret = validateGuestOrderSecret(authorization.guestOrderSecret, { optional: true });
  if (customerId && guestOrderSecret) {
    throw persistenceError("Provide customer authorization or guest-order authorization, not both.", "invalid_input");
  }
  if (order.customer_id !== null) return Boolean(customerId && customerId === order.customer_id);
  return Boolean(guestOrderSecret && verifyGuestOrderSecret(order, guestOrderSecret));
}

function validateCurrency(serviceType, currency) {
  if (!Object.prototype.hasOwnProperty.call(SERVICES, serviceType)
    || currency !== SERVICES[serviceType]) {
    throw persistenceError("Currency does not match the supported service type.", "invalid_input");
  }
}

function validateIsoDate(value, field) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    throw persistenceError(`${field} must be a valid timestamp.`, "invalid_input");
  }
  return date.toISOString();
}

function assertTransition(transitions, current, next, field) {
  if (!transitions[current]?.has(next)) {
    throw persistenceError(`Invalid ${field} transition.`, "invalid_transition");
  }
}

function validateVerification(verification, { reference, amountMinor, currency, status }) {
  if (!verification
    || verification.verified !== true
    || verification.status !== status
    || verification.reference !== reference
    || verification.amountMinor !== amountMinor
    || verification.currency !== currency
    || !verification.verifiedAt
    || Number.isNaN(new Date(verification.verifiedAt).getTime())) {
    throw persistenceError("A matching authoritative provider verification is required.", "verification_required");
  }
}

const READINESS_QUERY = `
  SELECT
    current_user AS role_name,
    session_user AS session_role_name,
    EXISTS (
      SELECT 1 FROM pg_roles runtime_role
      WHERE runtime_role.rolname = 'electrony_bills_runtime'
    ) AS runtime_role_exists,
    roles.rolname = 'electrony_bills_runtime' AS is_runtime_role,
    roles.rolsuper AS is_superuser,
    roles.rolbypassrls AS bypasses_rls,
    roles.rolcanlogin AS can_login,
    roles.rolinherit AS inherits_roles,
    roles.rolcreaterole AS can_create_roles,
    roles.rolcreatedb AS can_create_databases,
    roles.rolreplication AS can_replicate,
    EXISTS (
      SELECT 1
      FROM pg_auth_members membership
      WHERE membership.member = roles.oid
    ) AS has_role_memberships,
    has_schema_privilege(current_user, 'public', 'USAGE') AS has_public_schema_usage,
    relation.relname AS table_name,
    relation.relrowsecurity AS rls_enabled,
    pg_get_userbyid(relation.relowner) = current_user AS owns_table,
    CASE relation.relname
      WHEN 'electrony_products' THEN
        has_table_privilege(current_user, relation.oid, 'SELECT')
      WHEN 'bill_fee_quotes' THEN
        has_table_privilege(current_user, relation.oid, 'SELECT')
        AND has_table_privilege(current_user, relation.oid, 'INSERT')
        AND has_table_privilege(current_user, relation.oid, 'UPDATE')
      WHEN 'bill_orders' THEN
        has_table_privilege(current_user, relation.oid, 'SELECT')
        AND has_table_privilege(current_user, relation.oid, 'INSERT')
        AND has_table_privilege(current_user, relation.oid, 'UPDATE')
      WHEN 'bill_payment_attempts' THEN
        has_table_privilege(current_user, relation.oid, 'SELECT')
        AND has_table_privilege(current_user, relation.oid, 'INSERT')
        AND has_table_privilege(current_user, relation.oid, 'UPDATE')
      WHEN 'bill_payment_webhook_events' THEN
        has_table_privilege(current_user, relation.oid, 'SELECT')
        AND has_table_privilege(current_user, relation.oid, 'INSERT')
        AND has_table_privilege(current_user, relation.oid, 'UPDATE')
      WHEN 'bill_platform_settings' THEN
        has_table_privilege(current_user, relation.oid, 'SELECT')
      ELSE FALSE
    END
    AND has_schema_privilege(current_user, 'public', 'USAGE')
    AND NOT EXISTS (
      SELECT 1
      FROM pg_attribute column_info
      CROSS JOIN LATERAL (
        SELECT CASE WHEN relation.oid IS NOT NULL THEN
          pg_get_serial_sequence(
            format('%I.%I', 'public', relation.relname),
            column_info.attname
          )
        END AS sequence_name
      ) sequence_info
      WHERE column_info.attrelid = relation.oid
        AND column_info.attnum > 0
        AND NOT column_info.attisdropped
        AND relation.relname IN (
          'bill_fee_quotes',
          'bill_orders',
          'bill_payment_attempts',
          'bill_payment_webhook_events'
        )
        AND sequence_info.sequence_name IS NOT NULL
        AND NOT has_sequence_privilege(current_user, sequence_info.sequence_name, 'USAGE')
    ) AS has_required_privileges,
    has_schema_privilege(current_user, 'public', 'CREATE') AS has_schema_create,
    EXISTS (
      SELECT 1
      FROM pg_attribute column_info
      CROSS JOIN LATERAL (
        SELECT CASE WHEN relation.oid IS NOT NULL THEN
          pg_get_serial_sequence(
            format('%I.%I', 'public', relation.relname),
            column_info.attname
          )
        END AS sequence_name
      ) sequence_info
      WHERE column_info.attrelid = relation.oid
        AND column_info.attnum > 0
        AND NOT column_info.attisdropped
        AND relation.relname = ANY($1::text[])
        AND sequence_info.sequence_name IS NOT NULL
        AND has_sequence_privilege(current_user, sequence_info.sequence_name, 'UPDATE')
    ) AS has_excessive_sequence_privileges,
    (
      has_table_privilege(current_user, relation.oid, 'DELETE')
      OR has_table_privilege(current_user, relation.oid, 'TRUNCATE')
      OR CASE
        WHEN current_setting('server_version_num')::integer >= 170000
          THEN has_table_privilege(current_user, relation.oid, 'MAINTAIN')
        ELSE FALSE
      END
      OR has_table_privilege(current_user, relation.oid, 'TRIGGER')
      OR has_table_privilege(current_user, relation.oid, 'REFERENCES')
    ) AS has_excessive_table_privileges,
    ARRAY(
      SELECT privilege.privilege_type
      FROM aclexplode(
        COALESCE(relation.relacl, acldefault('r', relation.relowner))
      ) privilege
      WHERE privilege.grantee = (SELECT oid FROM pg_roles WHERE rolname = 'anon')
        AND privilege.privilege_type IN ('MAINTAIN', 'REFERENCES', 'TRIGGER', 'TRUNCATE')
      ORDER BY privilege.privilege_type
    ) AS anon_unexpected_privileges,
    ARRAY(
      SELECT privilege.privilege_type
      FROM aclexplode(
        COALESCE(relation.relacl, acldefault('r', relation.relowner))
      ) privilege
      WHERE privilege.grantee = (SELECT oid FROM pg_roles WHERE rolname = 'authenticated')
        AND privilege.privilege_type IN ('MAINTAIN', 'REFERENCES', 'TRIGGER', 'TRUNCATE')
      ORDER BY privilege.privilege_type
    ) AS authenticated_unexpected_privileges,
    EXISTS (
      SELECT 1
      FROM pg_policies pol
      WHERE pol.schemaname = 'public'
        AND pol.tablename = relation.relname
        AND current_user = ANY(pol.roles)
        AND NOT ('public' = ANY(pol.roles))
    ) AS has_server_policy,
    NOT EXISTS (
      SELECT 1
      FROM unnest(
        CASE relation.relname
          WHEN 'electrony_products' THEN ARRAY['SELECT']
          WHEN 'bill_fee_quotes' THEN ARRAY['SELECT', 'INSERT', 'UPDATE']
          WHEN 'bill_orders' THEN ARRAY['SELECT', 'INSERT', 'UPDATE']
          WHEN 'bill_payment_attempts' THEN ARRAY['SELECT', 'INSERT', 'UPDATE']
          WHEN 'bill_payment_webhook_events' THEN ARRAY['SELECT', 'INSERT', 'UPDATE']
          WHEN 'bill_platform_settings' THEN ARRAY['SELECT']
          ELSE ARRAY[]::text[]
        END
      ) AS required_policy(command)
      WHERE NOT EXISTS (
        SELECT 1
        FROM pg_policies pol
        WHERE pol.schemaname = 'public'
          AND pol.tablename = relation.relname
          AND current_user = ANY(pol.roles)
          AND NOT ('public' = ANY(pol.roles))
          AND pol.cmd IN (required_policy.command, 'ALL')
      )
    ) AS has_required_policies,
    EXISTS (
      SELECT 1
      FROM pg_policies pol
      WHERE pol.schemaname = 'public'
        AND pol.tablename = relation.relname
        AND (
          'public' = ANY(pol.roles)
          OR 'anon' = ANY(pol.roles)
          OR 'authenticated' = ANY(pol.roles)
        )
    ) AS has_public_policy,
    EXISTS (
      SELECT 1
      FROM pg_policies pol
      WHERE pol.schemaname = 'public'
        AND pol.tablename = relation.relname
        AND current_user = ANY(pol.roles)
        AND (
          (
            pol.cmd IN ('SELECT', 'DELETE')
            AND (
              pol.qual IS NULL
              OR regexp_replace(lower(btrim(pol.qual)), '[()[:space:]]', '', 'g')
                IN ('true', 'true::boolean', 'true::pg_catalog.bool')
            )
          )
          OR (
            pol.cmd = 'INSERT'
            AND (
              pol.with_check IS NULL
              OR regexp_replace(lower(btrim(pol.with_check)), '[()[:space:]]', '', 'g')
                IN ('true', 'true::boolean', 'true::pg_catalog.bool')
            )
          )
          OR (
            pol.cmd = 'UPDATE'
            AND (
              pol.qual IS NULL
              OR regexp_replace(lower(btrim(pol.qual)), '[()[:space:]]', '', 'g')
                IN ('true', 'true::boolean', 'true::pg_catalog.bool')
              OR pol.with_check IS NULL
              OR regexp_replace(lower(btrim(pol.with_check)), '[()[:space:]]', '', 'g')
                IN ('true', 'true::boolean', 'true::pg_catalog.bool')
            )
          )
          OR (
            pol.cmd = 'ALL'
            AND (
              (
                pol.qual IS NULL
                OR regexp_replace(lower(btrim(pol.qual)), '[()[:space:]]', '', 'g')
                  IN ('true', 'true::boolean', 'true::pg_catalog.bool')
              )
              AND (
                pol.with_check IS NULL
                OR regexp_replace(lower(btrim(pol.with_check)), '[()[:space:]]', '', 'g')
                  IN ('true', 'true::boolean', 'true::pg_catalog.bool')
              )
            )
          )
        )
    ) AS has_unrestricted_server_policy,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'table', relation.relname,
        'command', pol.cmd,
        'roles', pol.roles,
        'permissive', pol.permissive,
        'usingRestricted', pol.qual IS NOT NULL
          AND regexp_replace(lower(btrim(pol.qual)), '[()[:space:]]', '', 'g')
            NOT IN ('true', 'true::boolean', 'true::pg_catalog.bool'),
        'checkRestricted', pol.with_check IS NOT NULL
          AND regexp_replace(lower(btrim(pol.with_check)), '[()[:space:]]', '', 'g')
            NOT IN ('true', 'true::boolean', 'true::pg_catalog.bool')
      ))
      FROM pg_policies pol
      WHERE pol.schemaname = 'public'
        AND pol.tablename = relation.relname
    ), '[]'::jsonb) AS policy_evidence
  FROM pg_roles roles
  LEFT JOIN pg_class relation
    ON relation.relnamespace = 'public'::regnamespace
    AND relation.relname = ANY($1::text[])
    AND relation.relkind IN ('r', 'p')
  WHERE roles.rolname = current_user
`;

const PRIVILEGE_DIAGNOSTICS_QUERY = `
  WITH RECURSIVE runtime_role_tree(role_oid, role_name, grant_source) AS (
    SELECT oid, rolname, 'runtime'
    FROM pg_roles
    WHERE rolname = current_user
    UNION
    SELECT inherited_role.oid, inherited_role.rolname, 'inherited'
    FROM pg_auth_members membership
    JOIN runtime_role_tree member_role ON membership.member = member_role.role_oid
    JOIN pg_roles inherited_role ON inherited_role.oid = membership.roleid
  ),
  required_tables(table_name, required_privileges) AS (
    VALUES
      ('electrony_products', ARRAY['SELECT']::text[]),
      ('bill_fee_quotes', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_orders', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_payment_attempts', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_payment_webhook_events', ARRAY['SELECT', 'INSERT', 'UPDATE']::text[]),
      ('bill_platform_settings', ARRAY['SELECT']::text[])
  ),
  private_tables(table_name) AS (
    VALUES
      ('bill_fee_quotes'),
      ('bill_orders'),
      ('bill_payment_attempts'),
      ('bill_payment_webhook_events')
  )
  SELECT
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'category', 'table',
        'object', format('%I.%I', schema_info.nspname, relation.relname),
        'privilege', grant_info.privilege_type,
        'grantedTo', CASE
          WHEN grant_info.grantee = 0 THEN 'PUBLIC'
          ELSE grant_role.rolname
        END,
        'grantSource', CASE
          WHEN grant_info.grantee = 0 THEN 'public'
          WHEN role_tree.grant_source IS NOT NULL THEN role_tree.grant_source
          ELSE 'other_role'
        END,
        'grantOption', grant_info.is_grantable
      ))
      FROM pg_class relation
      JOIN pg_namespace schema_info ON schema_info.oid = relation.relnamespace
      JOIN required_tables required ON required.table_name = relation.relname
      CROSS JOIN LATERAL aclexplode(
        COALESCE(relation.relacl, acldefault('r', relation.relowner))
      ) grant_info
      LEFT JOIN pg_roles grant_role ON grant_role.oid = grant_info.grantee
      LEFT JOIN runtime_role_tree role_tree ON role_tree.role_oid = grant_info.grantee
      WHERE schema_info.nspname = 'public'
        AND relation.relkind IN ('r', 'p')
        AND (grant_info.grantee = 0 OR role_tree.role_oid IS NOT NULL)
        AND (
          (
            grant_info.grantee = 0
            AND required.table_name IN (SELECT table_name FROM private_tables)
          )
          OR
          grant_info.privilege_type <> ALL(required.required_privileges)
          OR grant_info.is_grantable
        )
    ), '[]'::jsonb) AS excessive_table_privileges,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'category', 'column',
        'object', format('%I.%I.%I', schema_info.nspname, relation.relname, column_info.attname),
        'privilege', grant_info.privilege_type,
        'grantedTo', CASE
          WHEN grant_info.grantee = 0 THEN 'PUBLIC'
          ELSE grant_role.rolname
        END,
        'grantSource', CASE
          WHEN grant_info.grantee = 0 THEN 'public'
          WHEN role_tree.grant_source IS NOT NULL THEN role_tree.grant_source
          ELSE 'other_role'
        END,
        'grantOption', grant_info.is_grantable
      ))
      FROM pg_attribute column_info
      JOIN pg_class relation ON relation.oid = column_info.attrelid
      JOIN pg_namespace schema_info ON schema_info.oid = relation.relnamespace
      JOIN required_tables required ON required.table_name = relation.relname
      CROSS JOIN LATERAL aclexplode(column_info.attacl) grant_info
      LEFT JOIN pg_roles grant_role ON grant_role.oid = grant_info.grantee
      LEFT JOIN runtime_role_tree role_tree ON role_tree.role_oid = grant_info.grantee
      WHERE schema_info.nspname = 'public'
        AND relation.relkind IN ('r', 'p')
        AND column_info.attnum > 0
        AND NOT column_info.attisdropped
        AND column_info.attacl IS NOT NULL
        AND (
          grant_info.grantee = 0
          OR role_tree.role_oid IS NOT NULL
          OR grant_role.rolname IN ('anon', 'authenticated')
        )
        AND (
          (
            grant_info.grantee = 0
            AND required.table_name IN (SELECT table_name FROM private_tables)
          )
          OR
          grant_info.privilege_type <> ALL(required.required_privileges)
          OR grant_info.is_grantable
        )
    ), '[]'::jsonb) AS excessive_column_privileges,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'category', 'sequence',
        'object', format('%I.%I', schema_info.nspname, sequence_info.relname),
        'privilege', grant_info.privilege_type,
        'grantedTo', CASE
          WHEN grant_info.grantee = 0 THEN 'PUBLIC'
          ELSE grant_role.rolname
        END,
        'grantSource', CASE
          WHEN grant_info.grantee = 0 THEN 'public'
          WHEN role_tree.grant_source IS NOT NULL THEN role_tree.grant_source
          ELSE 'other_role'
        END,
        'grantOption', grant_info.is_grantable
      ))
      FROM pg_class sequence_info
      JOIN pg_namespace schema_info ON schema_info.oid = sequence_info.relnamespace
      CROSS JOIN LATERAL aclexplode(
        COALESCE(sequence_info.relacl, acldefault('S', sequence_info.relowner))
      ) grant_info
      LEFT JOIN pg_roles grant_role ON grant_role.oid = grant_info.grantee
      LEFT JOIN runtime_role_tree role_tree ON role_tree.role_oid = grant_info.grantee
      WHERE sequence_info.relkind = 'S'
        AND EXISTS (
          SELECT 1
          FROM pg_class target_table
          JOIN pg_attribute target_column ON target_column.attrelid = target_table.oid
          WHERE target_table.relnamespace = 'public'::regnamespace
            AND target_table.relname IN (
              'electrony_products',
              'bill_fee_quotes',
              'bill_orders',
              'bill_payment_attempts',
              'bill_payment_webhook_events',
              'bill_platform_settings'
            )
            AND target_column.attnum > 0
            AND NOT target_column.attisdropped
            AND to_regclass(pg_get_serial_sequence(
              format('%I.%I', 'public', target_table.relname),
              target_column.attname
            )) = sequence_info.oid
            AND (
              (
                (grant_info.grantee = 0 OR grant_role.rolname IN ('anon', 'authenticated'))
                AND target_table.relname IN (SELECT table_name FROM private_tables)
              )
              OR (
                role_tree.role_oid IS NOT NULL
                AND (
                  target_table.relname NOT IN (
                    'bill_fee_quotes',
                    'bill_orders',
                    'bill_payment_attempts',
                    'bill_payment_webhook_events'
                  )
                  OR grant_info.privilege_type <> 'USAGE'
                  OR grant_info.is_grantable
                )
              )
            )
        )
    ), '[]'::jsonb) AS excessive_sequence_privileges,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'category', 'schema',
        'object', schema_info.nspname,
        'privilege', grant_info.privilege_type,
        'grantedTo', CASE
          WHEN grant_info.grantee = 0 THEN 'PUBLIC'
          ELSE grant_role.rolname
        END,
        'grantSource', CASE
          WHEN grant_info.grantee = 0 THEN 'public'
          WHEN role_tree.grant_source IS NOT NULL THEN role_tree.grant_source
          ELSE 'other_role'
        END,
        'grantOption', grant_info.is_grantable
      ))
      FROM pg_namespace schema_info
      CROSS JOIN LATERAL aclexplode(
        COALESCE(schema_info.nspacl, acldefault('n', schema_info.nspowner))
      ) grant_info
      LEFT JOIN pg_roles grant_role ON grant_role.oid = grant_info.grantee
      LEFT JOIN runtime_role_tree role_tree ON role_tree.role_oid = grant_info.grantee
      WHERE schema_info.nspname = 'public'
        AND grant_info.privilege_type = 'CREATE'
        AND grant_info.grantee <> schema_info.nspowner
    ), '[]'::jsonb) AS unexpected_schema_create_grants,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'category', 'function',
        'object', format('%I.%I(%s)', schema_info.nspname, routine_info.proname,
          pg_get_function_identity_arguments(routine_info.oid)),
        'privilege', grant_info.privilege_type,
        'grantedTo', CASE
          WHEN grant_info.grantee = 0 THEN 'PUBLIC'
          ELSE grant_role.rolname
        END,
        'grantSource', CASE
          WHEN grant_info.grantee = 0 THEN 'public'
          WHEN role_tree.grant_source IS NOT NULL THEN role_tree.grant_source
          ELSE 'other_role'
        END,
        'grantOption', grant_info.is_grantable,
        'schema', schema_info.nspname,
        'owner', pg_get_userbyid(routine_info.proowner),
        'securityDefiner', routine_info.prosecdef
      ))
      FROM pg_proc routine_info
      JOIN pg_namespace schema_info ON schema_info.oid = routine_info.pronamespace
      CROSS JOIN LATERAL aclexplode(
        COALESCE(routine_info.proacl, acldefault('f', routine_info.proowner))
      ) grant_info
      LEFT JOIN pg_roles grant_role ON grant_role.oid = grant_info.grantee
      LEFT JOIN runtime_role_tree role_tree ON role_tree.role_oid = grant_info.grantee
      WHERE routine_info.prosecdef
        AND grant_info.grantee <> routine_info.proowner
        AND grant_info.privilege_type = 'EXECUTE'
        AND routine_info.prosrc ~* (
          '(^|[^[:alnum:]_])('
          || 'bill_fee_quotes|bill_orders|bill_payment_attempts|bill_payment_webhook_events'
          || ')([^[:alnum:]_]|$)'
        )
    ), '[]'::jsonb) AS sensitive_function_exposure,
    COALESCE((
      SELECT jsonb_agg(access_finding)
      FROM (
        SELECT jsonb_build_object(
          'role', public_role.role_name,
          'object', format('%I.%I', 'public', relation.relname),
          'privilege', privilege.privilege_type,
          'scope', 'table'
        ) AS access_finding
        FROM pg_class relation
        JOIN private_tables private_table ON private_table.table_name = relation.relname
        CROSS JOIN (VALUES ('anon'), ('authenticated')) public_role(role_name)
        CROSS JOIN unnest(
          ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN']::text[]
        ) privilege(privilege_type)
        JOIN pg_roles public_role_record ON public_role_record.rolname = public_role.role_name
        WHERE relation.relnamespace = 'public'::regnamespace
          AND relation.relkind IN ('r', 'p')
          AND CASE
            WHEN privilege.privilege_type = 'MAINTAIN'
              AND current_setting('server_version_num')::integer < 170000
            THEN FALSE
            ELSE has_table_privilege(public_role_record.oid, relation.oid, privilege.privilege_type)
          END
        UNION ALL
        SELECT jsonb_build_object(
          'role', public_role.role_name,
          'object', format('%I.%I.%I', 'public', relation.relname, column_info.attname),
          'privilege', privilege.privilege_type,
          'scope', 'column'
        )
        FROM pg_attribute column_info
        JOIN pg_class relation ON relation.oid = column_info.attrelid
        JOIN private_tables private_table ON private_table.table_name = relation.relname
        CROSS JOIN (VALUES ('anon'), ('authenticated')) public_role(role_name)
        CROSS JOIN unnest(ARRAY['SELECT', 'INSERT', 'UPDATE', 'REFERENCES']::text[]) privilege(privilege_type)
        JOIN pg_roles public_role_record ON public_role_record.rolname = public_role.role_name
        WHERE relation.relnamespace = 'public'::regnamespace
          AND relation.relkind IN ('r', 'p')
          AND column_info.attnum > 0
          AND NOT column_info.attisdropped
          AND has_column_privilege(
            public_role_record.oid,
            relation.oid,
            column_info.attnum,
            privilege.privilege_type
          )
          AND NOT has_table_privilege(
            public_role_record.oid,
            relation.oid,
            privilege.privilege_type
          )
        UNION ALL
        SELECT jsonb_build_object(
          'role', public_role.role_name,
          'object', format('%I.%I', schema_info.nspname, sequence_info.relname),
          'privilege', privilege.privilege_type,
          'scope', 'sequence'
        )
        FROM pg_class sequence_info
        JOIN pg_namespace schema_info ON schema_info.oid = sequence_info.relnamespace
        CROSS JOIN (VALUES ('anon'), ('authenticated')) public_role(role_name)
        CROSS JOIN unnest(ARRAY['USAGE', 'SELECT', 'UPDATE']::text[]) privilege(privilege_type)
        JOIN pg_roles public_role_record ON public_role_record.rolname = public_role.role_name
        WHERE sequence_info.relkind = 'S'
          AND EXISTS (
            SELECT 1
            FROM pg_class target_table
            JOIN private_tables private_table ON private_table.table_name = target_table.relname
            JOIN pg_attribute target_column ON target_column.attrelid = target_table.oid
            WHERE target_table.relnamespace = 'public'::regnamespace
              AND target_column.attnum > 0
              AND NOT target_column.attisdropped
              AND to_regclass(pg_get_serial_sequence(
                format('%I.%I', 'public', target_table.relname),
                target_column.attname
              )) = sequence_info.oid
          )
          AND has_sequence_privilege(
            public_role_record.oid,
            sequence_info.oid,
            privilege.privilege_type
          )
          UNION ALL
          SELECT jsonb_build_object(
            'role', 'PUBLIC',
            'object', format('%I.%I', 'public', relation.relname),
            'privilege', grant_info.privilege_type,
            'scope', 'table'
          )
          FROM pg_class relation
          JOIN private_tables private_table ON private_table.table_name = relation.relname
          CROSS JOIN LATERAL aclexplode(
            COALESCE(relation.relacl, acldefault('r', relation.relowner))
          ) grant_info
          WHERE relation.relnamespace = 'public'::regnamespace
            AND relation.relkind IN ('r', 'p')
            AND grant_info.grantee = 0
          UNION ALL
          SELECT jsonb_build_object(
            'role', 'PUBLIC',
            'object', format('%I.%I.%I', 'public', relation.relname, column_info.attname),
            'privilege', grant_info.privilege_type,
            'scope', 'column'
          )
          FROM pg_attribute column_info
          JOIN pg_class relation ON relation.oid = column_info.attrelid
          JOIN private_tables private_table ON private_table.table_name = relation.relname
          CROSS JOIN LATERAL aclexplode(column_info.attacl) grant_info
          WHERE relation.relnamespace = 'public'::regnamespace
            AND relation.relkind IN ('r', 'p')
            AND column_info.attnum > 0
            AND NOT column_info.attisdropped
            AND grant_info.grantee = 0
          UNION ALL
          SELECT jsonb_build_object(
            'role', 'PUBLIC',
            'object', format('%I.%I', schema_info.nspname, sequence_info.relname),
            'privilege', grant_info.privilege_type,
            'scope', 'sequence'
          )
          FROM pg_class sequence_info
          JOIN pg_namespace schema_info ON schema_info.oid = sequence_info.relnamespace
          CROSS JOIN LATERAL aclexplode(
            COALESCE(sequence_info.relacl, acldefault('S', sequence_info.relowner))
          ) grant_info
          WHERE sequence_info.relkind = 'S'
            AND grant_info.grantee = 0
            AND EXISTS (
              SELECT 1
              FROM pg_class target_table
              JOIN private_tables private_table ON private_table.table_name = target_table.relname
              JOIN pg_attribute target_column ON target_column.attrelid = target_table.oid
              WHERE target_table.relnamespace = 'public'::regnamespace
                AND target_column.attnum > 0
                AND NOT target_column.attisdropped
                AND to_regclass(pg_get_serial_sequence(
                  format('%I.%I', 'public', target_table.relname),
                  target_column.attname
                )) = sequence_info.oid
            )
      ) public_access
    ), '[]'::jsonb) AS private_table_public_role_access
`;

function normalizeConnectionString(connectionString) {
  if (typeof connectionString !== "string" || !connectionString.trim()) {
    throw new Error("BILLS_RUNTIME_DATABASE_URL is not configured.");
  }

  let parsed;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error("BILLS_RUNTIME_DATABASE_URL must be a valid PostgreSQL connection URL.");
  }
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)
    || !parsed.hostname
    || !parsed.username
    || !parsed.password) {
    throw new Error("BILLS_RUNTIME_DATABASE_URL must include a PostgreSQL host and server-side credentials.");
  }

  for (const parameter of ["sslmode", "sslrootcert", "sslcert", "sslkey", "sslpassword"]) {
    parsed.searchParams.delete(parameter);
  }
  return parsed.toString();
}

function loadPostgresCaCertificate(environment) {
  const inlineCertificate = typeof environment.BILLS_POSTGRES_CA === "string"
    ? environment.BILLS_POSTGRES_CA.trim()
    : "";
  const certificatePath = typeof environment.BILLS_POSTGRES_CA_FILE === "string"
    ? environment.BILLS_POSTGRES_CA_FILE.trim()
    : "";

  function invalidConfiguration() {
    const error = new Error(POSTGRES_CA_CONFIGURATION_ERROR);
    error.code = POSTGRES_CA_CONFIGURATION_ERROR_CODE;
    return error;
  }

  if (Boolean(inlineCertificate) === Boolean(certificatePath)) {
    throw invalidConfiguration();
  }

  let certificate = inlineCertificate;
  if (certificatePath) {
    try {
      certificate = fs.readFileSync(certificatePath, "utf8").trim();
    } catch {
      throw invalidConfiguration();
    }
  }

  if (!/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/.test(certificate)) {
    throw invalidConfiguration();
  }

  try {
    tls.createSecureContext({ ca: certificate });
  } catch {
    throw invalidConfiguration();
  }
  return certificate;
}

function createPostgresPersistence(connectionString, PoolConstructor, environment = process.env) {
  const unavailableMethods = {
    createFeeQuote: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getFeeQuoteByReference: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    createOrderFromQuote: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getOrderByReference: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getOrderByPaymentReference: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    updateOrderPaymentState: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    updateOrderFulfillmentState: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    createPaymentAttempt: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getPaymentAttemptByMerchantReference: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    recordVerifiedPaymentAttemptStateChange: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    recordWebhookEvent: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    claimWebhookEvent: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    completeWebhookEvent: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getActiveProducts: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getProductBySlug: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getPlatformSetting: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); },
    getPlatformSettings: async () => { throw new Error("Bills PostgreSQL persistence is not configured."); }
  };
  if (!connectionString) {
    return {
      status: "not_configured",
      ...unavailableMethods,
      getReadiness: async () => ({
        status: "not_configured",
        configured: false,
        connected: false,
        securityStatus: "not_checked",
        securityFailure: null,
        connectionFailure: null
      }),
      withTransaction: async () => {
        throw new Error("Bills PostgreSQL persistence is not configured.");
      },
      verifySecurityControls: async () => {
        throw new Error("Bills PostgreSQL persistence is not configured.");
      },
      close: async () => {}
    };
  }

  let safeConnectionString;
  let caCertificate;
  try {
    safeConnectionString = normalizeConnectionString(connectionString);
    caCertificate = loadPostgresCaCertificate(environment);
  } catch (error) {
    if (error?.code === POSTGRES_CA_CONFIGURATION_ERROR_CODE) {
      console.error(error.message);
    }
    return {
      status: "configured_unverified",
      ...unavailableMethods,
      getReadiness: async () => ({
        status: "unavailable",
        configured: true,
        connected: false,
        securityStatus: "not_checked",
        securityFailure: null,
        connectionFailure: "invalid_configuration"
      }),
      withTransaction: async () => {
        throw new Error("Bills PostgreSQL configuration is invalid.");
      },
      verifySecurityControls: async () => {
        throw new Error("Bills PostgreSQL configuration is invalid.");
      },
      close: async () => {}
    };
  }

  const Pool = PoolConstructor || require("pg").Pool;
  const pool = new Pool({
    connectionString: safeConnectionString,
    ssl: { ca: caCertificate, rejectUnauthorized: true },
    max: 5,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: 30000,
    query_timeout: QUERY_TIMEOUT_MS,
    statement_timeout: QUERY_TIMEOUT_MS,
    application_name: "electrony-bills-api"
  });

  pool.on("error", (error) => {
    logConnectionFailure(error);
  });

  async function withTransaction(operation) {
    if (typeof operation !== "function") {
      throw new TypeError("A PostgreSQL transaction operation is required.");
    }

    let client;
    let transactionStarted = false;
    try {
      client = await pool.connect();
      await client.query("BEGIN");
      transactionStarted = true;
      const result = await operation((text, values = []) => client.query(text, values));
      await client.query("COMMIT");
      transactionStarted = false;
      return result;
    } catch (error) {
      if (transactionStarted && client) {
        try {
          await client.query("ROLLBACK");
        } catch {
          console.error("Bills PostgreSQL transaction rollback failed.");
        }
      }
      if (error?.safePersistenceError) throw error;
      throw sanitizeDatabaseError(error);
    } finally {
      if (client) client.release();
    }
  }

  async function verifySecurityControls() {
    let result;
    let role;

    function rejectUnverifiedDiagnostic(stage, failureCode, knownRole = null, knownRows = []) {
      const error = new Error("Bills PostgreSQL security diagnostics could not be completed.");
      error.diagnosticFailure = { stage, code: failureCode };
      const roleExists = typeof knownRole?.runtime_role_exists === "boolean"
        ? knownRole.runtime_role_exists
        : null;
      const connectedAsExpectedRole = knownRole
        ? Boolean(knownRole.is_runtime_role && knownRole.role_name === knownRole.session_role_name)
        : null;
      const tables = new Map(
        knownRows
          .filter((row) => row.table_name)
          .map((row) => [row.table_name, row])
      );
      const tableRows = [...tables.values()];
      const tableNames = knownRows.map((row) => row.table_name).filter(Boolean);
      const allTablesPresent = knownRows.length === REQUIRED_TABLES.length
        && tableNames.length === REQUIRED_TABLES.length
        && new Set(tableNames).size === tableNames.length
        && tableNames.every((tableName) => REQUIRED_TABLES.includes(tableName))
        && REQUIRED_TABLES.every((tableName) => tables.has(tableName));
      const knownOtherRoleGrants = tableRows.flatMap((table) => {
        const anon = table.anon_unexpected_privileges || [];
        const authenticated = table.authenticated_unexpected_privileges || [];
        return [
          ...(anon.length ? [{ table: table.table_name, role: "anon", privileges: anon }] : []),
          ...(authenticated.length
            ? [{ table: table.table_name, role: "authenticated", privileges: authenticated }]
            : [])
        ];
      });
      const excessiveTablePrivilegesFound = tableRows.some((table) => (
        table.has_excessive_table_privileges || table.has_excessive_sequence_privileges
      ));
      const requiredTablePrivilegesVerified = allTablesPresent
        && tableRows.every((table) => table.has_required_privileges);
      const allTablesHaveRls = allTablesPresent && tableRows.every((table) => table.rls_enabled);
      const allPoliciesCoverRequiredOperations = allTablesPresent
        && tableRows.every((table) => table.has_server_policy && table.has_required_policies);
      let confirmedFailureCode = null;
      if (knownRole && !roleExists) {
        confirmedFailureCode = "runtime_role_missing";
      } else if (knownRole && !connectedAsExpectedRole) {
        confirmedFailureCode = "runtime_role_connection_mismatch";
      } else if (knownRole && (
        knownRole.is_superuser
        || knownRole.bypasses_rls
        || knownRole.can_create_roles
        || knownRole.can_create_databases
        || knownRole.can_replicate
      )) {
        confirmedFailureCode = "runtime_role_excessive_privileges";
      } else if (knownRole && (
        !knownRole.can_login
        || knownRole.inherits_roles
        || knownRole.has_role_memberships
      )) {
        confirmedFailureCode = "dedicated_role_required";
      } else if (!allTablesPresent && knownRows.length) {
        confirmedFailureCode = "required_tables_unavailable";
      } else if (tableRows.some((table) => !table.rls_enabled)) {
        confirmedFailureCode = "rls_disabled";
      } else if (tableRows.some((table) => table.owns_table)) {
        confirmedFailureCode = "role_owns_table";
      } else if (knownRole?.has_schema_create) {
        confirmedFailureCode = "runtime_role_schema_create";
      } else if (excessiveTablePrivilegesFound) {
        confirmedFailureCode = "runtime_role_excessive_table_privileges";
      } else if (allTablesPresent && !requiredTablePrivilegesVerified) {
        confirmedFailureCode = "table_privileges_missing";
      }
      error.code = confirmedFailureCode || failureCode;
      error.readinessChecks = {
        runtimeRole: {
          name: "electrony_bills_runtime",
          exists: roleExists,
          connectedAsExpectedRole,
          leastPrivilegeVerified: false,
          excessivePrivilegeDetails: null,
          status: confirmedFailureCode ? "failed" : "not_verified"
        },
        tablePermissions: {
          status: !allTablesPresent && knownRows.length
            ? "not_checked"
            : excessiveTablePrivilegesFound || (allTablesPresent && !requiredTablePrivilegesVerified)
              ? "failed"
              : "not_verified",
          requiredGrantsVerified: allTablesPresent ? requiredTablePrivilegesVerified : null,
          excessiveGrantsFound: excessiveTablePrivilegesFound ? true : null,
          excessivePrivilegeDetails: null
        },
        privilegeDiagnostics: {
          requiredGrantsVerified: allTablesPresent ? requiredTablePrivilegesVerified : null,
          publicSchemaUsageVerified: typeof knownRole?.has_public_schema_usage === "boolean"
            ? knownRole.has_public_schema_usage
            : null,
          excessiveBillsTableGrants: null,
          unexpectedSchemaCreateGrants: null,
          privateTablePublicAccess: null,
          unexpectedSequenceAccess: null,
          sensitiveFunctionExposure: null,
          diagnosticsUnverified: true
        },
        rlsPolicies: {
          status: allTablesPresent && (!allTablesHaveRls || !allPoliciesCoverRequiredOperations)
            ? "failed"
            : "not_verified",
          enabledOnAllTables: allTablesPresent ? allTablesHaveRls : null,
          roleScopedOperationCoverage: allTablesPresent ? allPoliciesCoverRequiredOperations : null,
          authorizationSemantics: "not_verified",
          publicRolePoliciesFound: tableRows.some((table) => table.has_public_policy) || null,
          unrestrictedServerPolicies: null,
          policyEvidence: null
        },
        otherRoleGrants: {
          status: knownOtherRoleGrants.length ? "remediation_required" : "not_verified",
          unexpectedGrants: knownOtherRoleGrants.length ? knownOtherRoleGrants : null
        }
      };
      throw error;
    }

    try {
      result = await pool.query({
        text: READINESS_QUERY,
        values: [REQUIRED_TABLES],
        query_timeout: QUERY_TIMEOUT_MS
      });
    } catch {
      rejectUnverifiedDiagnostic("role_security", "role_security_query_failed");
    }

    role = Array.isArray(result?.rows) ? result.rows[0] : null;
    if (!role) {
      rejectUnverifiedDiagnostic("role_security", "role_security_result_unavailable");
    }
    const initialTableNames = result.rows.map((row) => row.table_name).filter(Boolean);
    const requiredTableRowsUnambiguous = result.rows.length === REQUIRED_TABLES.length
      && initialTableNames.length === REQUIRED_TABLES.length
      && new Set(initialTableNames).size === initialTableNames.length
      && REQUIRED_TABLES.every((tableName) => initialTableNames.includes(tableName));

    let privilegeResult;
    try {
      privilegeResult = await pool.query({
        text: PRIVILEGE_DIAGNOSTICS_QUERY,
        query_timeout: QUERY_TIMEOUT_MS
      });
    } catch {
      rejectUnverifiedDiagnostic(
        "privilege_diagnostics",
        "privilege_diagnostics_query_failed",
        role,
        result.rows
      );
    }
    if (!Array.isArray(privilegeResult?.rows) || !privilegeResult.rows[0]) {
      rejectUnverifiedDiagnostic(
        "privilege_diagnostics",
        "privilege_diagnostics_result_unavailable",
        role,
        result.rows
      );
    }

    const privilegeDiagnostics = privilegeResult.rows[0];
    const diagnosticFields = [
      "excessive_table_privileges",
      "excessive_column_privileges",
      "excessive_sequence_privileges",
      "unexpected_schema_create_grants",
      "sensitive_function_exposure",
      "private_table_public_role_access"
    ];
    if (diagnosticFields.some((field) => !Array.isArray(privilegeDiagnostics[field]))) {
      rejectUnverifiedDiagnostic(
        "privilege_diagnostics",
        "privilege_diagnostics_result_unavailable",
        role,
        result.rows
      );
    }
    const tables = new Map(
      result.rows
        .filter((row) => row.table_name)
        .map((row) => [row.table_name, row])
    );
    const tableRows = [...tables.values()];
    const allTablesPresent = requiredTableRowsUnambiguous
      && REQUIRED_TABLES.every((tableName) => tables.has(tableName));
    const roleExists = Boolean(role?.runtime_role_exists);
    const connectedAsRuntimeRole = Boolean(
      role?.is_runtime_role && role.role_name === role.session_role_name
    );
    const roleHasExcessiveAttributes = Boolean(
      role?.is_superuser
      || role?.bypasses_rls
      || role?.can_create_roles
      || role?.can_create_databases
      || role?.can_replicate
    );
    const roleHasUnsafeSettings = Boolean(
      !role?.can_login || role?.inherits_roles || role?.has_role_memberships
    );
    const requiredTablePrivilegesVerified = allTablesPresent
      ? tableRows.every((table) => table.has_required_privileges)
      : null;
    const excessivePrivilegeDetails = [
      ...(privilegeDiagnostics.excessive_table_privileges || []),
      ...(privilegeDiagnostics.excessive_column_privileges || []),
      ...(privilegeDiagnostics.excessive_sequence_privileges || []),
      ...(privilegeDiagnostics.unexpected_schema_create_grants || []),
      ...(privilegeDiagnostics.sensitive_function_exposure || [])
    ];
    const tablePrivilegeDetails = [
      ...(privilegeDiagnostics.excessive_table_privileges || []),
      ...(privilegeDiagnostics.excessive_column_privileges || [])
    ];
    const unexpectedSequenceAccess = privilegeDiagnostics.excessive_sequence_privileges || [];
    const unexpectedSchemaCreateGrants = privilegeDiagnostics.unexpected_schema_create_grants || [];
    const sensitiveFunctionExposure = privilegeDiagnostics.sensitive_function_exposure || [];
    const excessiveTablePrivilegesFound = tableRows.some((table) => (
      table.has_excessive_table_privileges
    )) || tablePrivilegeDetails.length > 0;
    const runtimeSchemaCreateFound = Boolean(role?.has_schema_create);
    const schemaCreateFound = runtimeSchemaCreateFound || unexpectedSchemaCreateGrants.length > 0;
    const excessiveFunctionPrivilegesFound = sensitiveFunctionExposure.length > 0;
    const tableOwnershipFound = tableRows.some((table) => table.owns_table);
    const allTablesHaveRls = allTablesPresent && tableRows.every((table) => table.rls_enabled);
    const allPoliciesCoverRequiredOperations = allTablesPresent
      && tableRows.every((table) => table.has_server_policy && table.has_required_policies);
    const publicPoliciesFound = tableRows.some((table) => table.has_public_policy);
    const unrestrictedServerPolicies = tableRows
      .filter((table) => table.has_unrestricted_server_policy)
      .map((table) => table.table_name);
    const publicRoleAccess = privilegeDiagnostics.private_table_public_role_access || [];
    const unexpectedGrants = [
      ...tableRows.flatMap((table) => {
        const anon = table.anon_unexpected_privileges || [];
        const authenticated = table.authenticated_unexpected_privileges || [];
        return [
          ...(anon.length ? [{ table: table.table_name, role: "anon", privileges: anon }] : []),
          ...(authenticated.length
            ? [{ table: table.table_name, role: "authenticated", privileges: authenticated }]
            : [])
        ];
      }),
      ...publicRoleAccess
    ];
    const roleLeastPrivilegeVerified = roleExists
      && connectedAsRuntimeRole
      && allTablesPresent
      && !roleHasExcessiveAttributes
      && !roleHasUnsafeSettings
      && !schemaCreateFound
      && !tableOwnershipFound
      && !excessiveTablePrivilegesFound
      && unexpectedSequenceAccess.length === 0
      && !excessiveFunctionPrivilegesFound
      && unexpectedSchemaCreateGrants.length === 0;
    const readinessChecks = {
      runtimeRole: {
        name: "electrony_bills_runtime",
        exists: roleExists,
        connectedAsExpectedRole: connectedAsRuntimeRole,
        leastPrivilegeVerified: roleLeastPrivilegeVerified,
        excessivePrivilegeDetails,
        status: roleLeastPrivilegeVerified ? "verified" : "failed"
      },
      tablePermissions: {
        requiredGrantsVerified: requiredTablePrivilegesVerified,
        excessiveGrantsFound: excessiveTablePrivilegesFound,
        excessivePrivilegeDetails: tablePrivilegeDetails,
        status: !allTablesPresent
          ? "not_checked"
          : requiredTablePrivilegesVerified && !excessiveTablePrivilegesFound
            ? "verified"
            : "failed"
      },
      privilegeDiagnostics: {
        requiredGrantsVerified: requiredTablePrivilegesVerified,
        publicSchemaUsageVerified: Boolean(role?.has_public_schema_usage),
        excessiveBillsTableGrants: tablePrivilegeDetails,
        unexpectedSchemaCreateGrants,
        privateTablePublicAccess: publicRoleAccess,
        unexpectedSequenceAccess,
        sensitiveFunctionExposure,
        diagnosticsUnverified: !allTablesPresent
      },
      rlsPolicies: {
        enabledOnAllTables: allTablesHaveRls,
        roleScopedOperationCoverage: allPoliciesCoverRequiredOperations,
        authorizationSemantics: "not_verified",
        publicRolePoliciesFound: publicPoliciesFound,
        unrestrictedServerPolicies,
        policyEvidence: tableRows.flatMap((table) => table.policy_evidence || []),
        status: allTablesHaveRls && allPoliciesCoverRequiredOperations
          ? "authorization_semantics_unverified"
          : "failed"
      },
      otherRoleGrants: {
        status: unexpectedGrants.length || publicPoliciesFound
          ? "remediation_required"
          : "none_detected",
        unexpectedGrants
      }
    };
    const reject = (code, message) => {
      const error = new Error(message);
      error.code = code;
      error.readinessChecks = readinessChecks;
      throw error;
    };

    if (!roleExists) {
      reject("runtime_role_missing", "The electrony_bills_runtime role does not exist.");
    }
    if (!connectedAsRuntimeRole) {
      reject("runtime_role_connection_mismatch", "Bills PostgreSQL must connect directly as electrony_bills_runtime.");
    }
    if (roleHasExcessiveAttributes) {
      reject("runtime_role_excessive_privileges", "The Bills PostgreSQL role has prohibited role-level privileges.");
    }
    if (roleHasUnsafeSettings) {
      reject("dedicated_role_required", "Bills PostgreSQL requires a direct, non-inheriting runtime login with no role memberships.");
    }
    if (!allTablesPresent) {
      reject("required_tables_unavailable", "Required Electrony Bills PostgreSQL tables are unavailable.");
    }
    if (!allTablesHaveRls) {
      reject("rls_disabled", "Row Level Security must be enabled on every required table.");
    }
    if (tableOwnershipFound) {
      reject("role_owns_table", "The Bills PostgreSQL role must not own a required table.");
    }
    if (schemaCreateFound) {
      reject(
        runtimeSchemaCreateFound ? "runtime_role_schema_create" : "unexpected_schema_create_grant",
        "Unexpected CREATE access to the public Bills schema requires deliberate review."
      );
    }
    if (excessiveTablePrivilegesFound) {
      reject(
        "runtime_role_excessive_table_privileges",
        "The Bills PostgreSQL role has prohibited table, column, or sequence privileges."
      );
    }
    if (unexpectedSequenceAccess.some((finding) => (
      finding.grantSource === "runtime" || finding.grantSource === "inherited"
    ))) {
      reject(
        "runtime_role_excessive_sequence_privileges",
        "The Bills PostgreSQL role has unexpected access to Bills transaction sequences."
      );
    }
    if (!requiredTablePrivilegesVerified) {
      reject("table_privileges_missing", "The Bills PostgreSQL role lacks required table privileges.");
    }
    if (unexpectedGrants.length) {
      reject(
        "other_role_excessive_privileges",
        "Public or non-runtime access to private Bills tables or sequences requires deliberate review."
      );
    }
    if (publicPoliciesFound) {
      reject(
        "public_role_policy_found",
        "A public, anon, or authenticated RLS policy applies to a private Bills table."
      );
    }
    if (excessiveFunctionPrivilegesFound) {
      reject(
        "sensitive_function_exposure",
        "An exposed SECURITY DEFINER function references private Bills transaction data."
      );
    }
    if (!allPoliciesCoverRequiredOperations) {
      reject(
        tableRows.some((table) => !table.has_server_policy)
          ? "server_role_policy_missing"
          : "table_operation_policy_missing",
        "Role-scoped RLS policies must cover every required table operation."
      );
    }

    reject(
      "rls_authorization_semantics_unverified",
      "RLS policy coverage is present, but its authorization semantics are not verified."
    );
  }

  async function getReadiness() {
    try {
      const result = await pool.query({
        text: CONNECTION_READINESS_QUERY,
        query_timeout: QUERY_TIMEOUT_MS
      });
      if (Number(result.rows[0]?.ready) !== 1) {
        return {
          status: "unavailable",
          configured: true,
          connected: false,
          securityStatus: "not_checked",
          securityFailure: null,
          connectionFailure: "connection_failed"
        };
      }
    } catch (error) {
      logConnectionFailure(error);
      return {
        status: "unavailable",
        configured: true,
        connected: false,
        securityStatus: "not_checked",
        securityFailure: null,
        connectionFailure: "connection_failed"
      };
    }

    try {
      await verifySecurityControls();
      return {
        status: "connection_verified",
        configured: true,
        connected: true,
        securityStatus: "controls_verified",
        securityFailure: null,
        connectionFailure: null
      };
    } catch (error) {
      const diagnosticFailure = error.diagnosticFailure || (!error.readinessChecks
        ? { stage: "security_evaluation", code: "security_evaluation_failed" }
        : null);
      return {
        status: "security_failed",
        configured: true,
        connected: true,
        securityStatus: "failed",
        securityFailure: error.code || diagnosticFailure?.code || "security_evaluation_failed",
        connectionFailure: null,
        diagnosticFailure,
        checks: error.readinessChecks || null
      };
    }
  }

  async function query(text, values = []) {
    try {
      return await pool.query({ text, values, query_timeout: QUERY_TIMEOUT_MS });
    } catch (error) {
      throw sanitizeDatabaseError(error);
    }
  }

  function validateQuote(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("A fee quote is required.", "invalid_input");
    }
    const quote = {
      quoteReference: validateText(input.quoteReference, "quoteReference"),
      customerId: validateText(input.customerId, "customerId", { optional: true }),
      serviceType: validateText(input.serviceType, "serviceType"),
      providerCode: validateText(input.providerCode, "providerCode", { optional: true }),
      productCode: validateText(input.productCode, "productCode", { optional: true }),
      customerReference: validateText(input.customerReference, "customerReference", { optional: true }),
      amountMinor: validateMinorUnits(input.amountMinor, "amountMinor"),
      platformFeeMinor: validateMinorUnits(input.platformFeeMinor, "platformFeeMinor", { allowZero: true }),
      providerFeeMinor: input.providerFeeMinor === null || input.providerFeeMinor === undefined
        ? null
        : validateMinorUnits(input.providerFeeMinor, "providerFeeMinor", { allowZero: true }),
      currency: validateText(input.currency, "currency").toUpperCase(),
      expiresAt: validateIsoDate(input.expiresAt, "expiresAt"),
      metadata: validateMetadata(input.metadata)
    };
    validateCurrency(quote.serviceType, quote.currency);
    if (quote.platformFeeMinor !== PLATFORM_FEE_RULES[quote.serviceType].fixedFeeMinor) {
      throw persistenceError("Platform fee does not match the server fee rules.", "invalid_input");
    }
    if (new Date(quote.expiresAt).getTime() <= Date.now()) {
      throw persistenceError("Fee quote expiry must be in the future.", "invalid_input");
    }
    return quote;
  }

  async function createFeeQuote(input) {
    const quote = validateQuote(input);
    return withTransaction(async (transactionQuery) => {
      const result = await transactionQuery(`
        INSERT INTO public.bill_fee_quotes (
          quote_reference, customer_id, service_type, provider_code, product_code,
          customer_reference, amount_minor, platform_fee_minor, provider_fee_minor,
          currency, status, expires_at, metadata
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'quoted', $11, $12::jsonb
        )
        RETURNING *
      `, [
        quote.quoteReference,
        quote.customerId,
        quote.serviceType,
        quote.providerCode,
        quote.productCode,
        quote.customerReference,
        quote.amountMinor,
        quote.platformFeeMinor,
        quote.providerFeeMinor,
        quote.currency,
        quote.expiresAt,
        JSON.stringify(quote.metadata)
      ]);
      if (!result.rows[0]) {
        throw persistenceError("Database did not return the created fee quote.", "write_not_confirmed");
      }
      return result.rows[0];
    });
  }

  async function getFeeQuoteByReference(quoteReference) {
    const reference = validateText(quoteReference, "quoteReference");
    const result = await query(`
      SELECT *, (status = 'quoted' AND expires_at > NOW()) AS is_valid
      FROM public.bill_fee_quotes
      WHERE quote_reference = $1
      LIMIT 1
    `, [reference]);
    return result.rows[0] || null;
  }

  async function createOrderFromQuote(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("An order request is required.", "invalid_input");
    }
    const orderReference = validateText(input.orderReference, "orderReference");
    const quoteReference = validateText(input.quoteReference, "quoteReference");
    const requestedCustomerId = validateText(input.customerId, "customerId", { optional: true });
    const metadata = validateMetadata(input.metadata);
    if (Object.prototype.hasOwnProperty.call(metadata, GUEST_ACCESS_HASH_KEY)) {
      throw persistenceError("Order metadata contains a reserved field.", "invalid_input");
    }
    const requestedGuestOrderSecret = validateGuestOrderSecret(input.guestOrderSecret, { optional: true });
    if (requestedCustomerId && requestedGuestOrderSecret) {
      throw persistenceError("Customer orders must not include guest-order authorization.", "invalid_input");
    }
    return withTransaction(async (transactionQuery) => {
      const existingResult = await transactionQuery(`
        SELECT * FROM public.bill_orders
        WHERE order_reference = $1
        FOR UPDATE
      `, [orderReference]);
      if (existingResult.rows[0]) {
        const quoteResult = await transactionQuery(`
          SELECT id, customer_id FROM public.bill_fee_quotes
          WHERE quote_reference = $1
          LIMIT 1
        `, [quoteReference]);
        const existing = existingResult.rows[0];
        const quote = quoteResult.rows[0];
        if (!quote
          || existing.quote_id !== quote.id
          || existing.customer_id !== quote.customer_id
          || requestedCustomerId !== existing.customer_id
          || !authorizeOrder(existing, {
            customerId: requestedCustomerId,
            guestOrderSecret: requestedGuestOrderSecret
          })) {
          throw persistenceError("Order reference conflicts with an existing order.", "reference_conflict");
        }
        return sanitizeOrder(existing);
      }

      const quoteResult = await transactionQuery(`
        SELECT * FROM public.bill_fee_quotes
        WHERE quote_reference = $1
        FOR UPDATE
      `, [quoteReference]);
      const quote = quoteResult.rows[0];
      if (!quote) throw persistenceError("Fee quote was not found.", "quote_not_found");
      const concurrentOrderResult = await transactionQuery(`
        SELECT * FROM public.bill_orders
        WHERE order_reference = $1
        FOR UPDATE
      `, [orderReference]);
      if (concurrentOrderResult.rows[0]) {
        const existing = concurrentOrderResult.rows[0];
        if (existing.quote_id !== quote.id
          || existing.customer_id !== quote.customer_id
          || requestedCustomerId !== existing.customer_id
          || !authorizeOrder(existing, {
            customerId: requestedCustomerId,
            guestOrderSecret: requestedGuestOrderSecret
          })) {
          throw persistenceError("Order reference conflicts with an existing order.", "reference_conflict");
        }
        return sanitizeOrder(existing);
      }
      if (quote.status !== "quoted" || new Date(quote.expires_at).getTime() <= Date.now()) {
        throw persistenceError("Fee quote is expired or has already been used.", "quote_unavailable");
      }
      if (requestedCustomerId !== quote.customer_id) {
        throw persistenceError("Fee quote belongs to a different customer.", "quote_customer_mismatch");
      }
      if (quote.customer_id === null && requestedGuestOrderSecret) {
        throw persistenceError("Guest-order secrets are generated by the server.", "invalid_guest_order_secret");
      }
      if (!Object.prototype.hasOwnProperty.call(SERVICES, quote.service_type)
        || quote.currency !== SERVICES[quote.service_type]
        || Number(quote.platform_fee_minor) !== PLATFORM_FEE_RULES[quote.service_type].fixedFeeMinor
        || !Number.isSafeInteger(Number(quote.amount_minor))
        || Number(quote.amount_minor) <= 0
        || !Number.isSafeInteger(Number(quote.platform_fee_minor))
        || Number(quote.platform_fee_minor) < 0
        || (quote.provider_fee_minor !== null
          && (!Number.isSafeInteger(Number(quote.provider_fee_minor)) || Number(quote.provider_fee_minor) < 0))) {
        throw persistenceError("Fee quote contains invalid monetary or service values.", "quote_invalid");
      }
      const totalAmountMinor = Number(quote.amount_minor)
        + Number(quote.platform_fee_minor)
        + (quote.provider_fee_minor === null ? 0 : Number(quote.provider_fee_minor));
      if (!Number.isSafeInteger(totalAmountMinor)) {
        throw persistenceError("Fee quote total is outside the supported range.", "quote_invalid");
      }
      const guestOrderSecret = quote.customer_id === null ? createGuestOrderSecret() : null;
      const orderMetadata = guestOrderSecret
        ? { ...metadata, [GUEST_ACCESS_HASH_KEY]: hashGuestOrderSecret(guestOrderSecret) }
        : metadata;

      const consumed = await transactionQuery(`
        UPDATE public.bill_fee_quotes
        SET status = 'used'
        WHERE id = $1 AND status = 'quoted' AND expires_at > NOW()
        RETURNING id
      `, [quote.id]);
      if (!consumed.rows[0]) {
        throw persistenceError("Fee quote is expired or has already been used.", "quote_unavailable");
      }
      const result = await transactionQuery(`
        INSERT INTO public.bill_orders (
          order_reference, customer_id, quote_id, service_type, provider_code,
          product_code, customer_reference, amount_minor, platform_fee_minor,
          provider_fee_minor, total_amount_minor, currency, payment_status,
          fulfilment_status, metadata
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
          'pending', 'not_started', $13::jsonb
        )
        RETURNING *
      `, [
        orderReference,
        quote.customer_id,
        quote.id,
        quote.service_type,
        quote.provider_code,
        quote.product_code,
        quote.customer_reference,
        quote.amount_minor,
        quote.platform_fee_minor,
        quote.provider_fee_minor,
        totalAmountMinor,
        quote.currency,
        JSON.stringify(orderMetadata)
      ]);
      if (!result.rows[0]) {
        throw persistenceError("Database did not return the created order.", "write_not_confirmed");
      }
      return {
        ...sanitizeOrder(result.rows[0]),
        ...(guestOrderSecret ? { guestOrderSecret } : {})
      };
    });
  }

  async function getOrderByReference(orderReference, authorization) {
    const reference = validateText(orderReference, "orderReference");
    const result = await query(`
      SELECT * FROM public.bill_orders
      WHERE order_reference = $1
      LIMIT 1
    `, [reference]);
    const order = result.rows[0] || null;
    if (!order) return null;
    if (!authorizeOrder(order, authorization)) {
      throw persistenceError("Order was not found or access was denied.", "order_not_found");
    }
    return sanitizeOrder(order);
  }

  async function getOrderByPaymentReference(paymentReference, authorization) {
    const reference = validateText(paymentReference, "paymentReference");
    const result = await query(`
      SELECT * FROM public.bill_orders
      WHERE payment_reference = $1
      LIMIT 1
    `, [reference]);
    const order = result.rows[0] || null;
    if (!order) return null;
    if (!authorizeOrder(order, authorization)) {
      throw persistenceError("Order was not found or access was denied.", "order_not_found");
    }
    return sanitizeOrder(order);
  }

  async function assertPaymentReferenceAvailable(transactionQuery, paymentReference, orderReference) {
    await transactionQuery("SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))", [paymentReference]);
    const duplicate = await transactionQuery(`
      SELECT id FROM public.bill_orders
      WHERE payment_reference = $1 AND order_reference <> $2
      LIMIT 1
      FOR UPDATE
    `, [paymentReference, orderReference]);
    if (duplicate.rows[0]) {
      throw persistenceError("Payment reference is already assigned to another order.", "payment_reference_conflict");
    }
  }

  async function updateOrderPaymentState(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("A payment state change is required.", "invalid_input");
    }
    const orderReference = validateText(input.orderReference, "orderReference");
    const expectedStatus = validateText(input.expectedStatus, "expectedStatus");
    const paymentStatus = validateText(input.paymentStatus, "paymentStatus");
    if (!ORDER_PAYMENT_STATUSES.has(paymentStatus) || !ORDER_PAYMENT_STATUSES.has(expectedStatus)) {
      throw persistenceError("Payment status is invalid.", "invalid_input");
    }
    const paymentReference = validateText(input.paymentReference, "paymentReference", { optional: true });
    const paymentProvider = validateText(input.paymentProvider, "paymentProvider", { optional: true });
    const failureReason = validateText(input.failureReason, "failureReason", { optional: true, maxLength: 500 });
    return withTransaction(async (transactionQuery) => {
      const found = await transactionQuery(`
        SELECT * FROM public.bill_orders
        WHERE order_reference = $1
        FOR UPDATE
      `, [orderReference]);
      const order = found.rows[0];
      if (!order) throw persistenceError("Order was not found.", "order_not_found");
      if (order.payment_status !== expectedStatus) {
        throw persistenceError("Order payment state changed before this update.", "state_conflict");
      }
      assertTransition(PAYMENT_TRANSITIONS, expectedStatus, paymentStatus, "payment");
      if (paymentStatus === "paid" || paymentStatus === "refunded") {
        const verifiedReference = paymentStatus === "paid" ? paymentReference : order.payment_reference;
        if (!verifiedReference || (paymentStatus === "refunded"
          && paymentReference && paymentReference !== order.payment_reference)) {
          throw persistenceError("A matching verified payment reference is required.", "verification_required");
        }
        validateVerification(input.verification, {
          reference: verifiedReference,
          amountMinor: Number(order.total_amount_minor),
          currency: order.currency,
          status: paymentStatus
        });
        if (paymentStatus === "paid") {
          await assertPaymentReferenceAvailable(transactionQuery, paymentReference, orderReference);
        }
      }
      if (paymentReference && paymentStatus !== "paid") {
        await assertPaymentReferenceAvailable(transactionQuery, paymentReference, orderReference);
      }
      const result = await transactionQuery(`
        UPDATE public.bill_orders
        SET payment_status = $3,
            payment_reference = COALESCE($4, payment_reference),
            payment_provider = COALESCE($5, payment_provider),
            paid_at = CASE WHEN $3 = 'paid' THEN NOW() ELSE paid_at END,
            failure_reason = $6,
            updated_at = NOW()
        WHERE order_reference = $1 AND payment_status = $2
        RETURNING *
      `, [
        orderReference,
        expectedStatus,
        paymentStatus,
        paymentReference,
        paymentProvider,
        failureReason
      ]);
      if (!result.rows[0]) throw persistenceError("Order payment state changed before this update.", "state_conflict");
      return sanitizeOrder(result.rows[0]);
    });
  }

  async function updateOrderFulfillmentState(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("A fulfilment state change is required.", "invalid_input");
    }
    const orderReference = validateText(input.orderReference, "orderReference");
    const expectedStatus = validateText(input.expectedStatus, "expectedStatus");
    const fulfilmentStatus = validateText(input.fulfilmentStatus, "fulfilmentStatus");
    if (!ORDER_FULFILMENT_STATUSES.has(fulfilmentStatus) || !ORDER_FULFILMENT_STATUSES.has(expectedStatus)) {
      throw persistenceError("Fulfilment status is invalid.", "invalid_input");
    }
    const providerTransactionReference = validateText(
      input.providerTransactionReference,
      "providerTransactionReference",
      { optional: true }
    );
    const failureReason = validateText(input.failureReason, "failureReason", { optional: true, maxLength: 500 });
    return withTransaction(async (transactionQuery) => {
      const found = await transactionQuery(`
        SELECT * FROM public.bill_orders
        WHERE order_reference = $1
        FOR UPDATE
      `, [orderReference]);
      const order = found.rows[0];
      if (!order) throw persistenceError("Order was not found.", "order_not_found");
      if (order.fulfilment_status !== expectedStatus) {
        throw persistenceError("Order fulfilment state changed before this update.", "state_conflict");
      }
      assertTransition(FULFILMENT_TRANSITIONS, expectedStatus, fulfilmentStatus, "fulfilment");
      if (["processing", "fulfilled"].includes(fulfilmentStatus) && order.payment_status !== "paid") {
        throw persistenceError("Verified payment is required before fulfilment begins.", "payment_not_confirmed");
      }
      if (fulfilmentStatus === "fulfilled"
        && (input.providerConfirmation?.confirmed !== true
          || !providerTransactionReference)) {
        throw persistenceError("Confirmed payment and provider fulfilment are required.", "fulfilment_confirmation_required");
      }
      const result = await transactionQuery(`
        UPDATE public.bill_orders
        SET fulfilment_status = $3,
            provider_transaction_reference = COALESCE($4, provider_transaction_reference),
            fulfilled_at = CASE WHEN $3 = 'fulfilled' THEN NOW() ELSE fulfilled_at END,
            failure_reason = COALESCE($5, failure_reason),
            updated_at = NOW()
        WHERE order_reference = $1
          AND fulfilment_status = $2
          AND ($3 <> 'fulfilled' OR payment_status = 'paid')
        RETURNING *
      `, [
        orderReference,
        expectedStatus,
        fulfilmentStatus,
        providerTransactionReference,
        failureReason
      ]);
      if (!result.rows[0]) throw persistenceError("Order fulfilment state changed before this update.", "state_conflict");
      return sanitizeOrder(result.rows[0]);
    });
  }

  async function createPaymentAttempt(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("A payment attempt is required.", "invalid_input");
    }
    const orderReference = validateText(input.orderReference, "orderReference");
    const provider = validateText(input.provider, "provider");
    const merchantReference = validateText(input.merchantReference, "merchantReference");
    const amountMinor = validateMinorUnits(input.amountMinor, "amountMinor");
    const currency = validateText(input.currency, "currency").toUpperCase();
    const checkoutUrl = validateText(input.checkoutUrl, "checkoutUrl", { optional: true, maxLength: 2048 });
    if (checkoutUrl) {
      let parsed;
      try {
        parsed = new URL(checkoutUrl);
      } catch {
        throw persistenceError("checkoutUrl must be a valid HTTPS URL.", "invalid_input");
      }
      if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
        throw persistenceError("checkoutUrl must be a valid HTTPS URL.", "invalid_input");
      }
    }
    const metadata = validateMetadata(input.metadata);
    return withTransaction(async (transactionQuery) => {
      const prior = await transactionQuery(`
        SELECT a.*, o.order_reference FROM public.bill_payment_attempts a
        JOIN public.bill_orders o ON o.id = a.order_id
        WHERE a.merchant_reference = $1
        LIMIT 1
        FOR UPDATE OF a
      `, [merchantReference]);
      if (prior.rows[0]) {
        const existing = prior.rows[0];
        if (existing.order_reference !== orderReference
          || existing.provider !== provider
          || Number(existing.amount_minor) !== amountMinor
          || existing.currency !== currency) {
          throw persistenceError("Merchant reference conflicts with an existing payment attempt.", "merchant_reference_conflict");
        }
        return existing;
      }
      const orderResult = await transactionQuery(`
        SELECT * FROM public.bill_orders
        WHERE order_reference = $1
        FOR UPDATE
      `, [orderReference]);
      const order = orderResult.rows[0];
      if (!order) throw persistenceError("Order was not found.", "order_not_found");
      const concurrentAttempt = await transactionQuery(`
        SELECT a.*, o.order_reference
        FROM public.bill_payment_attempts a
        JOIN public.bill_orders o ON o.id = a.order_id
        WHERE a.merchant_reference = $1
        LIMIT 1
        FOR UPDATE OF a
      `, [merchantReference]);
      if (concurrentAttempt.rows[0]) {
        const existing = concurrentAttempt.rows[0];
        if (existing.order_reference !== orderReference
          || existing.provider !== provider
          || Number(existing.amount_minor) !== amountMinor
          || existing.currency !== currency) {
          throw persistenceError("Merchant reference conflicts with an existing payment attempt.", "merchant_reference_conflict");
        }
        return existing;
      }
      if (order.payment_status !== "pending" && order.payment_status !== "initiated") {
        throw persistenceError("Order cannot start another payment attempt in its current state.", "state_conflict");
      }
      if (amountMinor !== Number(order.total_amount_minor) || currency !== order.currency) {
        throw persistenceError("Payment attempt amount or currency does not match the order.", "amount_mismatch");
      }
      if (order.payment_status === "pending") {
        const initiated = await transactionQuery(`
          UPDATE public.bill_orders
          SET payment_status = 'initiated', updated_at = NOW()
          WHERE id = $1 AND payment_status = 'pending'
          RETURNING id
        `, [order.id]);
        if (!initiated.rows[0]) {
          throw persistenceError("Order payment state changed before this attempt.", "state_conflict");
        }
      }
      const result = await transactionQuery(`
        INSERT INTO public.bill_payment_attempts (
          order_id, provider, merchant_reference, amount_minor, currency,
          status, checkout_url, metadata
        ) VALUES ($1, $2, $3, $4, $5, 'initiated', $6, $7::jsonb)
        RETURNING *
      `, [
        order.id,
        provider,
        merchantReference,
        amountMinor,
        currency,
        checkoutUrl,
        JSON.stringify(metadata)
      ]);
      if (!result.rows[0]) {
        throw persistenceError("Database did not return the created payment attempt.", "write_not_confirmed");
      }
      return result.rows[0];
    });
  }

  async function getPaymentAttemptByMerchantReference(merchantReference, expectedOrderReference) {
    const merchant = validateText(merchantReference, "merchantReference");
    const orderReference = validateText(expectedOrderReference, "expectedOrderReference");
    const result = await query(`
      SELECT a.*
      FROM public.bill_payment_attempts a
      JOIN public.bill_orders o ON o.id = a.order_id
      WHERE a.merchant_reference = $1 AND o.order_reference = $2
      LIMIT 1
    `, [merchant, orderReference]);
    return result.rows[0] || null;
  }

  async function recordVerifiedPaymentAttemptStateChange(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("A verified payment-attempt state change is required.", "invalid_input");
    }
    const merchantReference = validateText(input.merchantReference, "merchantReference");
    const orderReference = validateText(input.orderReference, "orderReference");
    const status = validateText(input.status, "status");
    const providerReference = validateText(input.providerReference, "providerReference", { optional: true });
    if (!ATTEMPT_STATUSES.has(status)) {
      throw persistenceError("Payment-attempt status is invalid.", "invalid_input");
    }
    return withTransaction(async (transactionQuery) => {
      const found = await transactionQuery(`
        SELECT a.*, o.order_reference, o.total_amount_minor, o.currency AS order_currency,
               o.payment_status AS order_payment_status, o.id AS linked_order_id
        FROM public.bill_payment_attempts a
        JOIN public.bill_orders o ON o.id = a.order_id
        WHERE a.merchant_reference = $1 AND o.order_reference = $2
        FOR UPDATE OF a, o
      `, [merchantReference, orderReference]);
      const attempt = found.rows[0];
      if (!attempt) throw persistenceError("Payment attempt was not found for this order.", "attempt_not_found");
      if (attempt.status === status) return attempt;
      assertTransition(ATTEMPT_TRANSITIONS, attempt.status, status, "payment-attempt");
      validateVerification(input.verification, {
        reference: merchantReference,
        amountMinor: Number(attempt.amount_minor),
        currency: attempt.currency,
        status
      });
      if (Number(attempt.amount_minor) !== Number(attempt.total_amount_minor)
        || attempt.currency !== attempt.order_currency) {
        throw persistenceError("Payment attempt amount or currency does not match the order.", "amount_mismatch");
      }
      const updated = await transactionQuery(`
        UPDATE public.bill_payment_attempts
        SET status = $2,
            provider_reference = COALESCE($3, provider_reference),
            verified_at = $4,
            updated_at = NOW()
        WHERE id = $1 AND status = $5
        RETURNING *
      `, [
        attempt.id,
        status,
        providerReference,
        input.verification.verifiedAt,
        attempt.status
      ]);
      if (!updated.rows[0]) throw persistenceError("Payment-attempt state changed before this update.", "state_conflict");

      if (status === "successful") {
        if (attempt.order_payment_status !== "initiated"
          && attempt.order_payment_status !== "pending") {
          throw persistenceError("Order cannot transition to paid from its current state.", "state_conflict");
        }
        assertTransition(PAYMENT_TRANSITIONS, attempt.order_payment_status, "paid", "payment");
        const paymentReference = providerReference || merchantReference;
        await assertPaymentReferenceAvailable(transactionQuery, paymentReference, orderReference);
        const orderUpdated = await transactionQuery(`
          UPDATE public.bill_orders
          SET payment_status = 'paid',
              payment_reference = $3,
              payment_provider = $4,
              paid_at = NOW(),
              updated_at = NOW()
          WHERE id = $1 AND payment_status = $2
          RETURNING id
        `, [attempt.linked_order_id, attempt.order_payment_status, paymentReference, attempt.provider]);
        if (!orderUpdated.rows[0]) throw persistenceError("Order payment state changed before this update.", "state_conflict");
      }
      return updated.rows[0];
    });
  }

  async function recordWebhookEvent(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("A webhook event is required.", "invalid_input");
    }
    const provider = validateText(input.provider, "provider");
    const providerEventId = validateText(input.providerEventId, "providerEventId");
    const eventType = validateText(input.eventType, "eventType");
    const merchantReference = validateText(input.merchantReference, "merchantReference", { optional: true });
    const payload = validateMetadata(input.payload, "payload");
    return withTransaction(async (transactionQuery) => {
      const inserted = await transactionQuery(`
        INSERT INTO public.bill_payment_webhook_events (
          provider, provider_event_id, event_type, merchant_reference,
          processing_status, payload
        ) VALUES ($1, $2, $3, $4, 'received', $5::jsonb)
        ON CONFLICT (provider, provider_event_id) DO NOTHING
        RETURNING *
      `, [provider, providerEventId, eventType, merchantReference, JSON.stringify(payload)]);
      if (inserted.rows[0]) return { duplicate: false, event: inserted.rows[0] };
      const prior = await transactionQuery(`
        SELECT * FROM public.bill_payment_webhook_events
        WHERE provider = $1 AND provider_event_id = $2
        LIMIT 1
      `, [provider, providerEventId]);
      if (!prior.rows[0]) {
        throw persistenceError("Webhook event could not be recorded or found.", "write_not_confirmed");
      }
      return { duplicate: true, event: prior.rows[0] || null };
    });
  }

  async function claimWebhookEvent(provider, providerEventId) {
    const providerName = validateText(provider, "provider");
    const eventId = validateText(providerEventId, "providerEventId");
    return withTransaction(async (transactionQuery) => {
      const result = await transactionQuery(`
        UPDATE public.bill_payment_webhook_events
        SET processing_status = 'processing'
        WHERE provider = $1 AND provider_event_id = $2 AND processing_status = 'received'
        RETURNING *
      `, [providerName, eventId]);
      return result.rows[0] || null;
    });
  }

  async function completeWebhookEvent(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw persistenceError("A webhook completion is required.", "invalid_input");
    }
    const provider = validateText(input.provider, "provider");
    const providerEventId = validateText(input.providerEventId, "providerEventId");
    const status = validateText(input.status, "status");
    const errorMessage = validateText(input.errorMessage, "errorMessage", { optional: true, maxLength: 500 });
    if (!["processed", "ignored", "failed", "review_required"].includes(status)
      || !WEBHOOK_STATUSES.has(status)) {
      throw persistenceError("Webhook processing status is invalid.", "invalid_input");
    }
    const result = await query(`
      UPDATE public.bill_payment_webhook_events
      SET processing_status = $3,
          processed_at = NOW(),
          error_message = $4
      WHERE provider = $1 AND provider_event_id = $2 AND processing_status = 'processing'
      RETURNING *
    `, [provider, providerEventId, status, errorMessage]);
    if (!result.rows[0]) {
      throw persistenceError("Webhook event is not claimed or has already completed.", "state_conflict");
    }
    return result.rows[0];
  }

  async function getActiveProducts() {
    const result = await query(`
      SELECT id, slug, name, category, short_description, website_url, status,
             display_order, metadata, created_at, updated_at
      FROM public.electrony_products
      WHERE status = 'active'
      ORDER BY display_order ASC, name ASC
    `);
    return result.rows;
  }

  async function getProductBySlug(slug) {
    const productSlug = validateText(slug, "slug");
    const result = await query(`
      SELECT id, slug, name, category, short_description, website_url, status,
             display_order, metadata, created_at, updated_at
      FROM public.electrony_products
      WHERE slug = $1 AND status = 'active'
      LIMIT 1
    `, [productSlug]);
    return result.rows[0] || null;
  }

  function validateSettingKey(key) {
    const settingKey = validateText(key, "settingKey");
    if (SENSITIVE_FIELD.test(settingKey)) {
      throw persistenceError("Sensitive platform settings are not available through this reader.", "sensitive_setting");
    }
    return settingKey;
  }

  async function getPlatformSetting(key) {
    const settingKey = validateSettingKey(key);
    const result = await query(`
      SELECT setting_key, setting_value, description, updated_at
      FROM public.bill_platform_settings
      WHERE setting_key = $1
      LIMIT 1
    `, [settingKey]);
    return result.rows[0] || null;
  }

  async function getPlatformSettings(keys) {
    if (!Array.isArray(keys) || keys.some((key) => typeof key !== "string")) {
      throw persistenceError("Platform setting keys must be an array of strings.", "invalid_input");
    }
    const settingKeys = [...new Set(keys.map(validateSettingKey))];
    if (settingKeys.length === 0) return [];
    const result = await query(`
      SELECT setting_key, setting_value, description, updated_at
      FROM public.bill_platform_settings
      WHERE setting_key = ANY($1::text[])
      ORDER BY setting_key
    `, [settingKeys]);
    return result.rows;
  }

  return {
    status: "configured_unverified",
    getReadiness,
    withTransaction,
    verifySecurityControls,
    createFeeQuote,
    getFeeQuoteByReference,
    createOrderFromQuote,
    getOrderByReference,
    getOrderByPaymentReference,
    updateOrderPaymentState,
    updateOrderFulfillmentState,
    createPaymentAttempt,
    getPaymentAttemptByMerchantReference,
    recordVerifiedPaymentAttemptStateChange,
    recordWebhookEvent,
    claimWebhookEvent,
    completeWebhookEvent,
    getActiveProducts,
    getProductBySlug,
    getPlatformSetting,
    getPlatformSettings,
    close: () => pool.end()
  };
}

module.exports = {
  classifyConnectionFailure,
  createPostgresPersistence,
  normalizeConnectionString
};
