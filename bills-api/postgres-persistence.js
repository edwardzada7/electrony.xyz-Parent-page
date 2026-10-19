"use strict";

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

function classifyConnectionFailure(error) {
  const errors = [];
  let current = error;
  while (current && errors.length < 4 && !errors.includes(current)) {
    errors.push(current);
    current = current.cause;
  }

  const codes = errors.map((item) => item.code).filter((code) => typeof code === "string");
  if (codes.some((code) => ["ENOTFOUND", "EAI_AGAIN", "EAI_NONAME"].includes(code))) {
    return "dns_error";
  }
  if (codes.includes("ECONNREFUSED")) return "connection_refused";
  if (codes.some((code) => ["ETIMEDOUT", "ESOCKETTIMEDOUT", "CONNECT_TIMEOUT"].includes(code))) {
    return "timeout";
  }
  if (codes.some((code) => /^(?:ERR_SSL|ERR_TLS|CERT_|UNABLE_TO_VERIFY|SELF_SIGNED)/.test(code))) {
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

function logConnectionFailure(error) {
  console.error("Bills PostgreSQL connection failure.", {
    category: classifyConnectionFailure(error)
  });
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
    roles.rolsuper AS is_superuser,
    roles.rolbypassrls AS bypasses_rls,
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
        AND sequence_info.sequence_name IS NOT NULL
        AND NOT has_sequence_privilege(current_user, sequence_info.sequence_name, 'USAGE')
    ) AS has_required_privileges,
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
    ) AS has_required_policies
  FROM pg_roles roles
  LEFT JOIN pg_class relation
    ON relation.relnamespace = 'public'::regnamespace
    AND relation.relname = ANY($1::text[])
    AND relation.relkind IN ('r', 'p')
  WHERE roles.rolname = current_user
`;

function normalizeConnectionString(connectionString) {
  if (typeof connectionString !== "string" || !connectionString.trim()) {
    throw new Error("BILLS_POSTGRES_URL is not configured.");
  }

  let parsed;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error("BILLS_POSTGRES_URL must be a valid PostgreSQL connection URL.");
  }
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)
    || !parsed.hostname
    || !parsed.username
    || !parsed.password) {
    throw new Error("BILLS_POSTGRES_URL must include a PostgreSQL host and server-side credentials.");
  }

  for (const parameter of ["sslmode", "sslrootcert", "sslcert", "sslkey", "sslpassword"]) {
    parsed.searchParams.delete(parameter);
  }
  return parsed.toString();
}

function createPostgresPersistence(connectionString, PoolConstructor) {
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
  try {
    safeConnectionString = normalizeConnectionString(connectionString);
  } catch {
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
    ssl: { rejectUnauthorized: true },
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
    try {
      result = await pool.query({
        text: READINESS_QUERY,
        values: [REQUIRED_TABLES],
        query_timeout: QUERY_TIMEOUT_MS
      });
    } catch {
      const error = new Error("Bills PostgreSQL security controls could not be verified.");
      error.code = "security_check_failed";
      throw error;
    }

    const role = result.rows[0];
    if (!role || role.is_superuser || role.bypasses_rls) {
      const error = new Error("Bills PostgreSQL requires a dedicated, non-privileged role.");
      error.code = "dedicated_role_required";
      throw error;
    }

    const tables = new Map(
      result.rows
        .filter((row) => row.table_name)
        .map((row) => [row.table_name, row])
    );
    const missing = REQUIRED_TABLES.filter((tableName) => !tables.has(tableName));
    if (missing.length) {
      const error = new Error("Required Electrony Bills PostgreSQL tables are unavailable.");
      error.code = "required_tables_unavailable";
      throw error;
    }

    const tableRows = [...tables.values()];
    if (tableRows.some((table) => !table.rls_enabled)) {
      const error = new Error("Row Level Security must be enabled on every required table.");
      error.code = "rls_disabled";
      throw error;
    }
    if (tableRows.some((table) => table.owns_table)) {
      const error = new Error("The Bills PostgreSQL role must not own a required table.");
      error.code = "role_owns_table";
      throw error;
    }
    if (tableRows.some((table) => !table.has_server_policy)) {
      const error = new Error("A role-scoped RLS policy is required for each required table.");
      error.code = "server_role_policy_missing";
      throw error;
    }
    if (tableRows.some((table) => !table.has_required_policies)) {
      const error = new Error("RLS policies do not cover all required table operations.");
      error.code = "table_operation_policy_missing";
      throw error;
    }
    if (tableRows.some((table) => !table.has_required_privileges)) {
      const error = new Error("The Bills PostgreSQL role lacks required table privileges.");
      error.code = "table_privileges_missing";
      throw error;
    }

    return { securityControlsVerified: true, requiredTablePrivilegesVerified: true };
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
      return {
        status: "security_failed",
        configured: true,
        connected: true,
        securityStatus: "failed",
        securityFailure: error.code || "security_check_failed",
        connectionFailure: null
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
          || (requestedCustomerId && requestedCustomerId !== existing.customer_id)) {
          throw persistenceError("Order reference conflicts with an existing order.", "reference_conflict");
        }
        return existing;
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
          || (requestedCustomerId && requestedCustomerId !== existing.customer_id)) {
          throw persistenceError("Order reference conflicts with an existing order.", "reference_conflict");
        }
        return existing;
      }
      if (quote.status !== "quoted" || new Date(quote.expires_at).getTime() <= Date.now()) {
        throw persistenceError("Fee quote is expired or has already been used.", "quote_unavailable");
      }
      if (requestedCustomerId && requestedCustomerId !== quote.customer_id) {
        throw persistenceError("Fee quote belongs to a different customer.", "quote_customer_mismatch");
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
        JSON.stringify(metadata)
      ]);
      if (!result.rows[0]) {
        throw persistenceError("Database did not return the created order.", "write_not_confirmed");
      }
      return result.rows[0];
    });
  }

  async function getOrderByReference(orderReference) {
    const reference = validateText(orderReference, "orderReference");
    const result = await query(`
      SELECT * FROM public.bill_orders
      WHERE order_reference = $1
      LIMIT 1
    `, [reference]);
    return result.rows[0] || null;
  }

  async function getOrderByPaymentReference(paymentReference) {
    const reference = validateText(paymentReference, "paymentReference");
    const result = await query(`
      SELECT * FROM public.bill_orders
      WHERE payment_reference = $1
      LIMIT 1
    `, [reference]);
    return result.rows[0] || null;
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
      return result.rows[0];
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
      return result.rows[0];
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
