"use strict";

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

const READINESS_QUERY = `
  SELECT
    current_user AS role_name,
    roles.rolsuper AS is_superuser,
    roles.rolbypassrls AS bypasses_rls,
    relation.relname AS table_name,
    relation.relrowsecurity AS rls_enabled,
    pg_get_userbyid(relation.relowner) = current_user AS owns_table,
    EXISTS (
      SELECT 1
      FROM pg_policies pol
      WHERE pol.schemaname = 'public'
        AND pol.tablename = relation.relname
        AND current_user = ANY(pol.roles)
        AND NOT ('public' = ANY(pol.roles))
    ) AS has_server_policy
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
  if (!connectionString) {
    return {
      status: "not_configured",
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

  pool.on("error", () => {
    console.error("Bills PostgreSQL connection error; database operations are unavailable.");
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
    } catch {
      if (transactionStarted && client) {
        try {
          await client.query("ROLLBACK");
        } catch {
          console.error("Bills PostgreSQL transaction rollback failed.");
        }
      }
      throw new Error("Bills PostgreSQL transaction failed; no database details were logged.");
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

    return { securityControlsVerified: true };
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
    } catch {
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

  return {
    status: "configured_unverified",
    getReadiness,
    withTransaction,
    verifySecurityControls,
    close: () => pool.end()
  };
}

module.exports = {
  createPostgresPersistence,
  normalizeConnectionString
};
