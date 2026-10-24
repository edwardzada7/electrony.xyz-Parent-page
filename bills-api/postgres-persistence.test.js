"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const tls = require("node:tls");
const {
  createPostgresPersistence,
  normalizeConnectionString
} = require("./postgres-persistence");

const REQUIRED_TABLES = [
  "electrony_products",
  "bill_fee_quotes",
  "bill_orders",
  "bill_payment_attempts",
  "bill_payment_webhook_events",
  "bill_platform_settings"
];

function securityRows({ superuser = false, bypassesRls = false, policy = true } = {}) {
  return REQUIRED_TABLES.map((tableName) => ({
    role_name: "electrony_bills_runtime",
    session_role_name: "electrony_bills_runtime",
    runtime_role_exists: true,
    is_runtime_role: true,
    is_superuser: superuser,
    bypasses_rls: bypassesRls,
    can_login: true,
    inherits_roles: false,
    can_create_roles: false,
    can_create_databases: false,
    can_replicate: false,
    has_role_memberships: false,
    has_schema_create: false,
    table_name: tableName,
    rls_enabled: true,
    owns_table: false,
    has_excessive_table_privileges: false,
    has_excessive_sequence_privileges: false,
    anon_unexpected_privileges: [],
    authenticated_unexpected_privileges: [],
    has_public_policy: false,
    has_unrestricted_server_policy: false,
    policy_evidence: [],
    has_server_policy: policy,
    has_required_policies: true,
    has_required_privileges: true
  }));
}

function makePersistence(responses, captured = {}, environment = {
  BILLS_POSTGRES_CA: tls.rootCertificates[0]
}) {
  class MockPool {
    constructor(options) {
      captured.options = options;
    }

    on() {}

    async query(query) {
      captured.queries ||= [];
      captured.queries.push(query);
      const response = responses.shift();
      if (response instanceof Error) throw response;
      if (!response && String(query.text || query).includes("private_table_public_role_access")) {
        return { rows: [{}] };
      }
      return response;
    }

    async connect() {
      return {
        query: async (text, values = []) => {
          captured.transactionQueries ||= [];
          captured.transactionQueries.push({ text, values });
          const response = responses.shift();
          if (response instanceof Error) throw response;
          return response || { rows: [] };
        },
        release: () => {
          captured.released = true;
        }
      };
    }

    async end() {
      captured.closed = true;
    }
  }

  return createPostgresPersistence(
    "postgresql://bills_backend:placeholder@db.example.test:5432/electrony?sslmode=disable",
    MockPool,
    environment
  );
}

test("connection URL validation requires PostgreSQL credentials and strips insecure SSL mode overrides", () => {
  assert.throws(() => normalizeConnectionString("not-a-url"), /valid PostgreSQL connection URL/);
  assert.throws(() => normalizeConnectionString("https://user:pass@example.test/db"), /PostgreSQL host/);
  assert.throws(() => normalizeConnectionString("postgres://user@example.test/db"), /PostgreSQL host/);

  const normalized = new URL(normalizeConnectionString(
    "postgresql://user:pass@example.test/db?sslmode=disable&application_name=test"
  ));
  assert.equal(normalized.searchParams.has("sslmode"), false);
  assert.equal(normalized.searchParams.get("application_name"), "test");

  const encodedCredentials = new URL(normalizeConnectionString(
    "postgresql://bills:p%40ss%3Aword@db.example.test:5432/electrony"
  ));
  assert.equal(encodedCredentials.password, "p%40ss%3Aword");
  assert.equal(encodedCredentials.pathname, "/electrony");
});

test("unconfigured persistence reports that no connection was checked", async () => {
  const persistence = createPostgresPersistence("");
  assert.deepEqual(await persistence.getReadiness(), {
    status: "not_configured",
    configured: false,
    connected: false,
    securityStatus: "not_checked",
    securityFailure: null,
    connectionFailure: null
  });
  await assert.rejects(
    persistence.createFeeQuote({}),
    /Bills PostgreSQL persistence is not configured/
  );
});

test("invalid configured URLs do not prevent safe health reporting", async () => {
  const persistence = createPostgresPersistence("https://db.example.test/private");
  const readiness = await persistence.getReadiness();

  assert.deepEqual(readiness, {
    status: "unavailable",
    configured: true,
    connected: false,
    securityStatus: "not_checked",
    securityFailure: null,
    connectionFailure: "invalid_configuration"
  });
});

test("mounted Supabase CA PEM is loaded into the verified PostgreSQL TLS options", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "bills-postgres-ca-"));
  const certificatePath = path.join(directory, "prod-ca-2021.crt");
  const certificate = tls.rootCertificates[0];
  fs.writeFileSync(certificatePath, certificate, { mode: 0o600 });

  try {
    const captured = {};
    const persistence = makePersistence([
      { rows: [{ ready: 1 }] },
      { rows: securityRows() }
    ], captured, { BILLS_POSTGRES_CA_FILE: certificatePath });

    assert.equal((await persistence.getReadiness()).connected, true);
    assert.equal(captured.options.ssl.ca, certificate);
    assert.equal(captured.options.ssl.rejectUnauthorized, true);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("missing or invalid Supabase CA fails closed with a sanitized configuration diagnostic", async () => {
  const connectionString = "postgres://user:private-password@db.example.test:5432/electrony";
  const configurations = [
    {},
    { BILLS_POSTGRES_CA: "not a certificate or a private value" },
    { BILLS_POSTGRES_CA_FILE: "/missing/private/path/prod-ca-2021.crt" },
    {
      BILLS_POSTGRES_CA: tls.rootCertificates[0],
      BILLS_POSTGRES_CA_FILE: "/etc/secrets/prod-ca-2021.crt"
    }
  ];
  const logged = [];
  const originalError = console.error;
  console.error = (...args) => logged.push(args);

  try {
    for (const environment of configurations) {
      let poolConstructed = false;
      class UnexpectedPool {
        constructor() {
          poolConstructed = true;
        }
      }

      const persistence = createPostgresPersistence(connectionString, UnexpectedPool, environment);
      assert.equal(poolConstructed, false);
      assert.deepEqual(await persistence.getReadiness(), {
        status: "unavailable",
        configured: true,
        connected: false,
        securityStatus: "not_checked",
        securityFailure: null,
        connectionFailure: "invalid_configuration"
      });
    }
  } finally {
    console.error = originalError;
  }

  assert.equal(logged.length, configurations.length);
  assert.ok(logged.every(([message]) => message.includes("BILLS_POSTGRES_CA")));
  assert.equal(JSON.stringify(logged).includes("private"), false);
  assert.equal(JSON.stringify(logged).includes(connectionString), false);
  assert.equal(JSON.stringify(logged).includes(tls.rootCertificates[0]), false);
});

test("readiness separates connection success from unverified RLS authorization semantics", async () => {
  const captured = {};
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows() }
  ], captured);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.status, "security_failed");
  assert.equal(readiness.connected, true);
  assert.equal(readiness.securityFailure, "rls_authorization_semantics_unverified");
  assert.equal(
    readiness.checks.rlsPolicies.authorizationSemantics,
    "not_verified"
  );
  assert.equal(readiness.checks.runtimeRole.leastPrivilegeVerified, true);
  assert.equal(readiness.checks.tablePermissions.requiredGrantsVerified, true);
  assert.equal(captured.options.ssl.rejectUnauthorized, true);
  assert.equal(captured.options.ssl.ca, tls.rootCertificates[0]);
  assert.equal(captured.options.connectionTimeoutMillis, 5000);
  assert.equal(captured.options.statement_timeout, 5000);
  assert.equal(captured.queries[0].text, "SELECT 1 AS ready");
  assert.equal(captured.queries[0].query_timeout, 5000);
  assert.equal(captured.queries[1].values[0].length, REQUIRED_TABLES.length);
  assert.match(captured.queries[1].text, /has_table_privilege/);
  assert.match(captured.queries[1].text, /has_schema_privilege/);
  assert.match(captured.queries[1].text, /has_sequence_privilege/);
  assert.match(captured.queries[1].text, /has_required_policies/);
  assert.match(captured.queries[1].text, /policy_evidence/);
  assert.match(captured.queries[1].text, /server_version_num/);
  assert.match(captured.queries[1].text, /has_table_privilege\(current_user, relation\.oid, 'MAINTAIN'\)/);
  assert.match(
    captured.queries[1].text,
    /relation\.relname IN \([\s\S]*'bill_payment_webhook_events'/
  );
  assert.match(captured.queries[2].text, /excessive_column_privileges/);
  assert.match(captured.queries[2].text, /aclexplode\(column_info\.attacl\)/);
  assert.match(captured.queries[2].text, /column_info\.attacl IS NOT NULL/);
  assert.doesNotMatch(captured.queries[2].text, /COALESCE\(column_info\.attacl, ARRAY\[\]::aclitem\[\]\)/);
  assert.match(captured.queries[2].text, /excessive_sequence_privileges/);
  assert.match(captured.queries[2].text, /user_function_execute_privileges/);
  assert.match(captured.queries[2].text, /private_table_public_role_access/);
  assert.match(captured.queries[2].text, /'scope', 'sequence'/);
  assert.match(captured.queries[2].text, /'other_role'/);
  assert.match(captured.queries[2].text, /runtime_role_tree/);
  assert.equal(
    (captured.queries[2].text.match(/JOIN pg_roles public_role_record ON/g) || []).length,
    3
  );
  assert.match(captured.queries[2].text, /has_table_privilege\(public_role_record\.oid/);
  assert.match(captured.queries[2].text, /has_column_privilege\(\s*public_role_record\.oid/);
  assert.match(captured.queries[2].text, /has_sequence_privilege\(\s*public_role_record\.oid/);
  assert.match(captured.queries[2].text, /current_setting\('server_version_num'\)::integer < 170000/);
  assert.match(captured.queries[1].text, /current_setting\('server_version_num'\)::integer >= 170000/);
  await persistence.close();
  assert.equal(captured.closed, true);
});

test("connection failures are safely classified in server logs while health remains generic", async () => {
  const failures = [
    ["ENOTFOUND", "dns_error"],
    ["ECONNREFUSED", "connection_refused"],
    ["ETIMEDOUT", "timeout"],
    ["ERR_TLS_CERT_ALTNAME_INVALID", "tls_error"],
    ["UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "tls_error"],
    ["28P01", "authentication_failed"],
    ["3D000", "database_missing"],
    ["OTHER", "unknown"]
  ];
  const logged = [];
  const originalError = console.error;
  console.error = (...args) => logged.push(args);
  try {
    for (const [code, category] of failures) {
      const error = new Error(`private diagnostic: password secret db.private.example.test (${code})`);
      error.code = code;
      const readiness = await makePersistence([error]).getReadiness();

      assert.deepEqual(readiness, {
        status: "unavailable",
        configured: true,
        connected: false,
        securityStatus: "not_checked",
        securityFailure: null,
        connectionFailure: "connection_failed"
      });
      assert.deepEqual(logged.at(-1), [
        "Bills PostgreSQL connection failure.",
        { category, errorCode: code }
      ]);
    }
  } finally {
    console.error = originalError;
  }
  assert.equal(JSON.stringify(logged).includes("password"), false);
  assert.equal(JSON.stringify(logged).includes("db.private.example.test"), false);
});

test("wrapped connection errors expose only a recognized nested code", async () => {
  const logged = [];
  const originalError = console.error;
  console.error = (...args) => logged.push(args);

  try {
    const tlsError = new Error("private certificate and db.private.example.test details");
    tlsError.code = "UNABLE_TO_GET_ISSUER_CERT_LOCALLY";
    const pgPoolError = new Error("private pool connection failure", { cause: tlsError });
    const readiness = await makePersistence([pgPoolError]).getReadiness();

    assert.equal(readiness.connected, false);
    assert.equal(readiness.connectionFailure, "connection_failed");
    assert.deepEqual(logged, [[
      "Bills PostgreSQL connection failure.",
      { category: "tls_error", errorCode: "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" }
    ]]);
    assert.equal(JSON.stringify(logged).includes("private"), false);
    assert.equal(JSON.stringify(logged).includes("db.private.example.test"), false);
  } finally {
    console.error = originalError;
  }
});

test("unknown connection errors do not log unsafe codes or raw messages", async () => {
  const logged = [];
  const originalError = console.error;
  console.error = (...args) => logged.push(args);

  try {
    const error = new Error("password=private db.private.example.test secret");
    error.code = "private_database_password";
    await makePersistence([error]).getReadiness();

    assert.deepEqual(logged, [[
      "Bills PostgreSQL connection failure.",
      { category: "unknown" }
    ]]);
    assert.equal(JSON.stringify(logged).includes("private"), false);
    assert.equal(JSON.stringify(logged).includes("db.private.example.test"), false);
  } finally {
    console.error = originalError;
  }
});

test("missing RLS policies keep security readiness failed after connectivity succeeds", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows({ policy: false }) }
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.status, "security_failed");
  assert.equal(readiness.connected, true);
  assert.equal(readiness.securityFailure, "server_role_policy_missing");
  assert.equal(readiness.checks.rlsPolicies.status, "failed");
});

test("readiness reports exact excessive table, column, sequence, schema, and function privileges", async () => {
  const findings = {
    excessive_table_privileges: [{
      category: "table",
      object: "public.bill_orders",
      privilege: "DELETE",
      grantedTo: "electrony_bills_runtime",
      grantSource: "runtime",
      grantOption: false
    }],
    excessive_column_privileges: [{
      category: "column",
      object: "public.electrony_products.price",
      privilege: "UPDATE",
      grantedTo: "PUBLIC",
      grantSource: "public",
      grantOption: false
    }],
    excessive_sequence_privileges: [{
      category: "sequence",
      object: "public.bill_orders_id_seq",
      privilege: "UPDATE",
      grantedTo: "bills_writer",
      grantSource: "inherited",
      grantOption: false
    }],
    excessive_schema_privileges: [{
      category: "schema",
      object: "app_private",
      privilege: "USAGE",
      grantedTo: "electrony_bills_runtime",
      grantSource: "runtime",
      grantOption: false
    }],
    user_function_execute_privileges: [{
      category: "function",
      object: "public.legacy_helper(integer)",
      privilege: "EXECUTE",
      grantedTo: "PUBLIC",
      grantSource: "public",
      grantOption: false
    }],
    private_table_public_role_access: []
  };
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows() },
    { rows: [findings] }
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.securityFailure, "runtime_role_excessive_schema_privileges");
  assert.equal(readiness.checks.runtimeRole.leastPrivilegeVerified, false);
  assert.deepEqual(
    readiness.checks.tablePermissions.excessivePrivilegeDetails.map((finding) => finding.category),
    ["table", "column", "sequence"]
  );
  assert.equal(
    readiness.checks.tablePermissions.excessivePrivilegeDetails.some(
      (finding) => finding.grantedTo === "PUBLIC"
    ),
    true
  );
  assert.deepEqual(
    readiness.checks.runtimeRole.excessivePrivilegeDetails.map((finding) => finding.category),
    ["table", "column", "sequence", "schema", "function"]
  );
  assert.equal(
    JSON.stringify(readiness.checks.runtimeRole.excessivePrivilegeDetails).includes("password"),
    false
  );
});

test("broad runtime RLS policies are reported but never verify guest authorization", async () => {
  const rows = securityRows();
  rows[0].has_unrestricted_server_policy = true;
  rows[0].policy_evidence = [{
    table: "electrony_products",
    command: "ALL",
    roles: ["electrony_bills_runtime"],
    permissive: "PERMISSIVE",
    usingRestricted: false,
    checkRestricted: false
  }];
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows },
    { rows: [{
      excessive_table_privileges: [],
      excessive_column_privileges: [],
      excessive_sequence_privileges: [],
      excessive_schema_privileges: [],
      user_function_execute_privileges: [],
      private_table_public_role_access: [{
        role: "anon",
        object: "public.bill_orders",
        privilege: "SELECT",
        scope: "table"
      }, {
        role: "authenticated",
        object: "public.bill_orders",
        privilege: "UPDATE",
        scope: "column"
      }]
    }] }
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.securityFailure, "other_role_excessive_privileges");
  assert.equal(readiness.checks.rlsPolicies.authorizationSemantics, "not_verified");
  assert.deepEqual(readiness.checks.rlsPolicies.unrestrictedServerPolicies, ["electrony_products"]);
  assert.equal(readiness.checks.rlsPolicies.policyEvidence[0].usingRestricted, false);
  assert.equal(readiness.checks.otherRoleGrants.unexpectedGrants[0].role, "anon");
  assert.equal(readiness.checks.otherRoleGrants.unexpectedGrants[1].role, "authenticated");
});

test("a direct excessive DELETE grant is reported as a security failure", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows() },
    { rows: [{
      excessive_table_privileges: [{
        category: "table",
        object: "public.bill_orders",
        privilege: "DELETE",
        grantedTo: "electrony_bills_runtime",
        grantSource: "runtime",
        grantOption: false
      }],
      excessive_column_privileges: [],
      excessive_sequence_privileges: [],
      excessive_schema_privileges: [],
      user_function_execute_privileges: [],
      private_table_public_role_access: []
    }] }
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.securityFailure, "runtime_role_excessive_table_privileges");
  assert.equal(readiness.checks.tablePermissions.excessiveGrantsFound, true);
  assert.deepEqual(
    readiness.checks.tablePermissions.excessivePrivilegeDetails.map(({ privilege }) => privilege),
    ["DELETE"]
  );
});

test("privileged, shared, and role-switched connections fail the role security check", async (t) => {
  const roleCases = [
    ["superuser", { is_superuser: true }, "runtime_role_excessive_privileges"],
    ["BYPASSRLS", { bypasses_rls: true }, "runtime_role_excessive_privileges"],
    ["role creation", { can_create_roles: true }, "runtime_role_excessive_privileges"],
    ["database creation", { can_create_databases: true }, "runtime_role_excessive_privileges"],
    ["replication", { can_replicate: true }, "runtime_role_excessive_privileges"],
    ["schema CREATE", { has_schema_create: true }, "runtime_role_schema_create"],
    ["table TRUNCATE", { has_excessive_table_privileges: true }, "runtime_role_excessive_table_privileges"],
    ["non-login role", { can_login: false }],
    ["inheriting role", { inherits_roles: true }],
    ["role with memberships", { has_role_memberships: true }],
    ["connected directly as the wrong role", {
      role_name: "bills_login",
      session_role_name: "bills_login",
      is_runtime_role: false
    }, "runtime_role_connection_mismatch"],
    ["role-switched connection", { session_role_name: "bills_login" }, "runtime_role_connection_mismatch"]
  ];

  for (const [name, overrides, expectedFailure = "dedicated_role_required"] of roleCases) {
    await t.test(name, async () => {
      const rows = securityRows();
      Object.assign(rows[0], overrides);
      const persistence = makePersistence([
        { rows: [{ ready: 1 }] },
        { rows }
      ]);

      const readiness = await persistence.getReadiness();
      assert.equal(readiness.status, "security_failed");
      assert.equal(readiness.securityFailure, expectedFailure);
    });
  }
});

test("missing runtime role fails closed after connection succeeds", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows().map((row) => ({
      ...row,
      runtime_role_exists: false,
      is_runtime_role: false
    })) },
    { rows: [{
      excessive_table_privileges: [],
      excessive_column_privileges: [],
      excessive_sequence_privileges: [],
      excessive_schema_privileges: [],
      user_function_execute_privileges: [],
      private_table_public_role_access: []
    }] }
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.status, "security_failed");
  assert.equal(readiness.securityFailure, "runtime_role_missing");
});

test("diagnostic SQL failure preserves connectivity and reports its safe stage and code", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows() },
    databaseError("42501")
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.status, "security_failed");
  assert.equal(readiness.connected, true);
  assert.equal(readiness.securityFailure, "privilege_diagnostics_query_failed");
  assert.deepEqual(readiness.diagnosticFailure, {
    stage: "privilege_diagnostics",
    code: "privilege_diagnostics_query_failed"
  });
  assert.equal(readiness.checks.runtimeRole.exists, true);
  assert.equal(readiness.checks.runtimeRole.connectedAsExpectedRole, true);
  assert.equal(readiness.checks.runtimeRole.status, "not_verified");
  assert.equal(readiness.checks.runtimeRole.excessivePrivilegeDetails, null);
  assert.equal(readiness.checks.tablePermissions.excessivePrivilegeDetails, null);
  assert.equal(readiness.checks.otherRoleGrants.unexpectedGrants, null);
  assert.equal(JSON.stringify(readiness).includes("private database detail"), false);
});

test("readiness query failure does not claim that the runtime role is missing", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    databaseError("42501")
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.connected, true);
  assert.equal(readiness.securityFailure, "role_security_query_failed");
  assert.deepEqual(readiness.diagnosticFailure, {
    stage: "role_security",
    code: "role_security_query_failed"
  });
  assert.equal(readiness.checks.runtimeRole.exists, null);
  assert.equal(readiness.checks.runtimeRole.connectedAsExpectedRole, null);
  assert.equal(readiness.checks.runtimeRole.excessivePrivilegeDetails, null);
});

test("a later diagnostics failure preserves a confirmed excessive-privilege category", async () => {
  const rows = securityRows();
  rows[0].has_excessive_table_privileges = true;
  rows[0].anon_unexpected_privileges = ["TRUNCATE"];
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows },
    databaseError("42501")
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.connected, true);
  assert.equal(readiness.securityFailure, "runtime_role_excessive_table_privileges");
  assert.deepEqual(readiness.diagnosticFailure, {
    stage: "privilege_diagnostics",
    code: "privilege_diagnostics_query_failed"
  });
  assert.equal(readiness.checks.tablePermissions.excessiveGrantsFound, true);
  assert.equal(readiness.checks.tablePermissions.excessivePrivilegeDetails, null);
  assert.equal(readiness.checks.otherRoleGrants.status, "remediation_required");
  assert.deepEqual(readiness.checks.otherRoleGrants.unexpectedGrants, [{
    table: "electrony_products",
    role: "anon",
    privileges: ["TRUNCATE"]
  }]);
});

test("missing privilege-diagnostic results preserve verified connection and role facts", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows() },
    { rows: [] }
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.status, "security_failed");
  assert.equal(readiness.connected, true);
  assert.equal(readiness.securityFailure, "privilege_diagnostics_result_unavailable");
  assert.deepEqual(readiness.diagnosticFailure, {
    stage: "privilege_diagnostics",
    code: "privilege_diagnostics_result_unavailable"
  });
  assert.equal(readiness.checks.runtimeRole.exists, true);
  assert.equal(readiness.checks.runtimeRole.connectedAsExpectedRole, true);
  assert.equal(readiness.checks.tablePermissions.requiredGrantsVerified, true);
  assert.equal(readiness.checks.otherRoleGrants.unexpectedGrants, null);
  assert.equal(readiness.checks.rlsPolicies.authorizationSemantics, "not_verified");
});

function databaseError(code) {
  const error = new Error("private database detail must not escape");
  error.code = code;
  return error;
}

function quoteRow(overrides = {}) {
  return {
    id: "quote-id",
    quote_reference: "QUOTE-1",
    customer_id: null,
    service_type: "airtime",
    provider_code: "provider",
    product_code: "product",
    customer_reference: "customer-ref",
    amount_minor: 10000,
    platform_fee_minor: 10000,
    provider_fee_minor: null,
    currency: "NGN",
    status: "quoted",
    expires_at: new Date(Date.now() + 60000).toISOString(),
    ...overrides
  };
}

function configuredPersistence(responses, captured = {}) {
  return makePersistence(responses, captured);
}

test("fee quotes use parameterized SQL and validate service, currency, money, expiry, and metadata", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [{ quote_reference: "QUOTE-1" }] },
    { rows: [] }
  ], captured);
  const row = await persistence.createFeeQuote({
    quoteReference: "QUOTE-1",
    serviceType: "airtime",
    amountMinor: 10000,
    platformFeeMinor: 10000,
    currency: "NGN",
    expiresAt: new Date(Date.now() + 60000).toISOString()
  });

  assert.equal(row.quote_reference, "QUOTE-1");
  const insert = captured.transactionQueries.find(({ text }) => text.includes("INSERT INTO public.bill_fee_quotes"));
  assert.match(insert.text, /INSERT INTO public\.bill_fee_quotes/);
  assert.equal(insert.values[0], "QUOTE-1");
  assert.equal(insert.values[6], 10000);
  await assert.rejects(
    persistence.createFeeQuote({
      quoteReference: "BAD",
      serviceType: "airtime",
      amountMinor: 100,
      platformFeeMinor: 0,
      currency: "NGN",
      expiresAt: new Date(Date.now() + 60000).toISOString()
    }),
    { code: "invalid_input" }
  );
  await assert.rejects(
    persistence.createFeeQuote({
      quoteReference: "BAD",
      serviceType: "airtime",
      amountMinor: 100,
      platformFeeMinor: 0,
      currency: "NGN",
      expiresAt: new Date(Date.now() - 1).toISOString(),
      metadata: { provider: { apiToken: "do-not-store" } }
    }),
    { code: "sensitive_metadata" }
  );
  const circularMetadata = {};
  circularMetadata.self = circularMetadata;
  await assert.rejects(
    persistence.createFeeQuote({
      quoteReference: "BAD",
      serviceType: "airtime",
      amountMinor: 100,
      platformFeeMinor: 10000,
      currency: "NGN",
      expiresAt: new Date(Date.now() + 60000).toISOString(),
      metadata: circularMetadata
    }),
    { code: "invalid_input" }
  );
  assert.equal(captured.transactionQueries.filter(({ text }) => text.includes("INSERT INTO public.bill_fee_quotes")).length, 1);
});

test("quote retrieval derives usability from both status and database expiry", async () => {
  const persistence = configuredPersistence([
    { rows: [{ ...quoteRow(), is_valid: true }] },
    { rows: [{ ...quoteRow({ status: "used" }), is_valid: false }] }
  ]);
  assert.equal((await persistence.getFeeQuoteByReference("QUOTE-1")).is_valid, true);
  assert.equal((await persistence.getFeeQuoteByReference("QUOTE-1")).is_valid, false);
});

test("expired and reused quotes cannot be converted into orders", async () => {
  for (const quote of [
    quoteRow({ expires_at: new Date(Date.now() - 1000).toISOString() }),
    quoteRow({ status: "used" })
  ]) {
    const captured = {};
    const persistence = configuredPersistence([
      { rows: [] },
      { rows: [] },
      { rows: [quote] },
      { rows: [] }
    ], captured);
    await assert.rejects(
      persistence.createOrderFromQuote({ orderReference: "ORDER-1", quoteReference: "QUOTE-1" }),
      { code: "quote_unavailable" }
    );
    assert.equal(captured.transactionQueries.at(-1).text, "ROLLBACK");
    assert.equal(captured.transactionQueries.some(({ text }) => text.includes("INSERT INTO public.bill_orders")), false);
  }
});

test("order creation consumes the quote and inserts the exact quoted totals in one transaction", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [] },
    { rows: [quoteRow()] },
    { rows: [] },
    { rows: [{ id: "quote-id" }] },
    { rows: [{ order_reference: "ORDER-1", total_amount_minor: 20000 }] },
    { rows: [] }
  ], captured);
  const order = await persistence.createOrderFromQuote({
    orderReference: "ORDER-1",
    quoteReference: "QUOTE-1",
    metadata: { channel: "web" }
  });

  assert.equal(order.total_amount_minor, 20000);
  const statements = captured.transactionQueries.map(({ text }) => text);
  assert.equal(statements[0], "BEGIN");
  assert.match(statements[4], /UPDATE public\.bill_fee_quotes/);
  assert.match(statements[5], /INSERT INTO public\.bill_orders/);
  assert.equal(statements.at(-1), "COMMIT");
  const insert = captured.transactionQueries.find(({ text }) => text.includes("INSERT INTO public.bill_orders"));
  assert.equal(insert.values[0], "ORDER-1");
  assert.equal(insert.values[7], 10000);
  assert.equal(insert.values[8], 10000);
  assert.equal(insert.values[10], 20000);
  assert.equal(captured.released, true);
});

test("order retries return the existing order rather than creating another", async () => {
  const captured = {};
  const guestOrderSecret = Buffer.alloc(32).toString("base64url");
  const guestAccessHash = crypto.createHash("sha256").update(guestOrderSecret).digest("hex");
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [{
      order_reference: "ORDER-1",
      quote_id: "quote-id",
      customer_id: null,
      metadata: { __guest_order_access_sha256: guestAccessHash }
    }] },
    { rows: [{ id: "quote-id", customer_id: null }] }
  ], captured);
  const order = await persistence.createOrderFromQuote({
    orderReference: "ORDER-1",
    quoteReference: "QUOTE-1",
    guestOrderSecret
  });

  assert.equal(order.order_reference, "ORDER-1");
  assert.deepEqual(order.metadata, {});
  assert.equal(captured.transactionQueries.some(({ text }) => text.includes("INSERT INTO public.bill_orders")), false);
});

test("order retries do not authorize guest orders by reference alone", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [{
      order_reference: "ORDER-1",
      quote_id: "quote-id",
      customer_id: null,
      metadata: {}
    }] },
    { rows: [{ id: "quote-id", customer_id: null }] },
    { rows: [] }
  ], captured);

  await assert.rejects(
    persistence.createOrderFromQuote({
      orderReference: "ORDER-1",
      quoteReference: "QUOTE-1"
    }),
    (error) => error.code === "reference_conflict"
  );
  assert.equal(captured.transactionQueries.some(({ text }) => text.includes("INSERT INTO public.bill_orders")), false);
});

test("a failed order insert rolls back quote consumption and sanitizes constraint errors", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [] },
    { rows: [quoteRow()] },
    { rows: [] },
    { rows: [{ id: "quote-id" }] },
    databaseError("23514"),
    { rows: [] },
    { rows: [] }
  ], captured);
  await assert.rejects(
    persistence.createOrderFromQuote({ orderReference: "ORDER-1", quoteReference: "QUOTE-1" }),
    (error) => error.code === "constraint_violation"
      && !error.message.includes("private database detail")
  );
  assert.equal(captured.transactionQueries.at(-1).text, "ROLLBACK");
});

test("payment attempts reject a reused merchant reference for another order", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [{
      order_reference: "OTHER-ORDER",
      amount_minor: 20000,
      currency: "NGN"
    }] },
    { rows: [] }
  ], captured);
  await assert.rejects(
    persistence.createPaymentAttempt({
      orderReference: "ORDER-1",
      provider: "monnify",
      merchantReference: "MERCHANT-1",
      amountMinor: 20000,
      currency: "NGN"
    }),
    { code: "merchant_reference_conflict" }
  );
  assert.equal(captured.transactionQueries.at(-1).text, "ROLLBACK");
});

test("payment-attempt creation moves the order to initiated in the same transaction", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [] },
    { rows: [{
      id: "order-id",
      order_reference: "ORDER-1",
      payment_status: "pending",
      total_amount_minor: 20000,
      currency: "NGN"
    }] },
    { rows: [] },
    { rows: [{ id: "order-id" }] },
    { rows: [{ id: "attempt-id", status: "initiated" }] },
    { rows: [] }
  ], captured);
  const attempt = await persistence.createPaymentAttempt({
    orderReference: "ORDER-1",
    provider: "monnify",
    merchantReference: "MERCHANT-1",
    amountMinor: 20000,
    currency: "NGN",
    checkoutUrl: "https://checkout.example.test/session"
  });

  assert.equal(attempt.id, "attempt-id");
  const statements = captured.transactionQueries.map(({ text }) => text);
  assert.ok(statements.some((text) => text.includes("SET payment_status = 'initiated'")));
  assert.ok(statements.some((text) => text.includes("INSERT INTO public.bill_payment_attempts")));
  assert.equal(statements.at(-1), "COMMIT");
});

test("a payment attempt can be retrieved only for its expected order", async () => {
  const captured = {};
  const persistence = configuredPersistence([{ rows: [{ merchant_reference: "MERCHANT-1" }] }], captured);
  const result = await persistence.getPaymentAttemptByMerchantReference("MERCHANT-1", "ORDER-1");
  assert.equal(result.merchant_reference, "MERCHANT-1");
  assert.deepEqual(captured.queries[0].values, ["MERCHANT-1", "ORDER-1"]);
  assert.match(captured.queries[0].text, /o\.order_reference = \$2/);
});

test("verified payment-attempt success changes attempt and order atomically", async () => {
  const captured = {};
  const verifiedAt = new Date().toISOString();
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [{
      id: "attempt-id",
      merchant_reference: "MERCHANT-1",
      provider: "monnify",
      provider_reference: "PROVIDER-1",
      status: "initiated",
      amount_minor: 20000,
      currency: "NGN",
      order_reference: "ORDER-1",
      total_amount_minor: 20000,
      order_currency: "NGN",
      order_payment_status: "initiated",
      linked_order_id: "order-id"
    }] },
    { rows: [{ id: "attempt-id", status: "successful" }] },
    { rows: [] },
    { rows: [] },
    { rows: [{ id: "order-id" }] },
    { rows: [] }
  ], captured);
  const result = await persistence.recordVerifiedPaymentAttemptStateChange({
    merchantReference: "MERCHANT-1",
    orderReference: "ORDER-1",
    status: "successful",
    providerReference: "PROVIDER-1",
    verification: {
      verified: true,
      reference: "MERCHANT-1",
      status: "successful",
      amountMinor: 20000,
      currency: "NGN",
      verifiedAt
    }
  });
  assert.equal(result.status, "successful");
  const statements = captured.transactionQueries.map(({ text }) => text);
  assert.ok(statements.some((text) => text.includes("UPDATE public.bill_payment_attempts")));
  assert.ok(statements.some((text) => text.includes("UPDATE public.bill_orders")));
  assert.equal(statements.at(-1), "COMMIT");
});

test("browser-supplied payment success and invalid payment transitions are rejected", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [{ order_reference: "ORDER-1", payment_status: "initiated" }] },
    { rows: [] }
  ], captured);
  await assert.rejects(
    persistence.updateOrderPaymentState({
      orderReference: "ORDER-1",
      expectedStatus: "initiated",
      paymentStatus: "paid",
      paymentReference: "CLIENT-CLAIMED"
    }),
    { code: "verification_required" }
  );
  assert.equal(captured.transactionQueries.at(-1).text, "ROLLBACK");

  const invalid = configuredPersistence([
    { rows: [] },
    { rows: [{ order_reference: "ORDER-1", payment_status: "pending" }] },
    { rows: [] }
  ]);
  await assert.rejects(
    invalid.updateOrderPaymentState({
      orderReference: "ORDER-1",
      expectedStatus: "pending",
      paymentStatus: "refunded"
    }),
    { code: "invalid_transition" }
  );
});

test("fulfilment requires provider confirmation and conditional transitions prevent double fulfilment", async () => {
  const unpaid = configuredPersistence([
    { rows: [] },
    { rows: [{
      order_reference: "ORDER-1",
      payment_status: "initiated",
      fulfilment_status: "not_started"
    }] },
    { rows: [] }
  ]);
  await assert.rejects(
    unpaid.updateOrderFulfillmentState({
      orderReference: "ORDER-1",
      expectedStatus: "not_started",
      fulfilmentStatus: "processing"
    }),
    { code: "payment_not_confirmed" }
  );

  const noConfirmation = configuredPersistence([
    { rows: [] },
    { rows: [{
      order_reference: "ORDER-1",
      payment_status: "paid",
      fulfilment_status: "processing"
    }] },
    { rows: [] }
  ]);
  await assert.rejects(
    noConfirmation.updateOrderFulfillmentState({
      orderReference: "ORDER-1",
      expectedStatus: "processing",
      fulfilmentStatus: "fulfilled",
      providerTransactionReference: "VEND-1"
    }),
    { code: "fulfilment_confirmation_required" }
  );

  const captured = {};
  const duplicate = configuredPersistence([
    { rows: [] },
    { rows: [{
      order_reference: "ORDER-1",
      payment_status: "paid",
      fulfilment_status: "processing"
    }] },
    { rows: [] },
    { rows: [] }
  ], captured);
  await assert.rejects(
    duplicate.updateOrderFulfillmentState({
      orderReference: "ORDER-1",
      expectedStatus: "processing",
      fulfilmentStatus: "fulfilled",
      providerTransactionReference: "VEND-1",
      providerConfirmation: { confirmed: true }
    }),
    { code: "state_conflict" }
  );
  assert.equal(captured.transactionQueries.at(-1).text, "ROLLBACK");
});

test("webhook events are inserted idempotently and can only be claimed once", async () => {
  const captured = {};
  const event = { provider: "monnify", provider_event_id: "EVENT-1", processing_status: "processed" };
  const persistence = configuredPersistence([
    { rows: [] },
    { rows: [] },
    { rows: [event] },
    { rows: [] },
    { rows: [] }
  ], captured);
  const recorded = await persistence.recordWebhookEvent({
    provider: "monnify",
    providerEventId: "EVENT-1",
    eventType: "payment",
    merchantReference: "MERCHANT-1",
    payload: { eventType: "payment" }
  });
  assert.equal(recorded.duplicate, true);
  assert.equal(recorded.event.provider_event_id, "EVENT-1");
  assert.match(captured.transactionQueries[1].text, /ON CONFLICT \(provider, provider_event_id\) DO NOTHING/);
  assert.equal(await persistence.claimWebhookEvent("monnify", "EVENT-1"), null);
  assert.equal(captured.transactionQueries.at(-1).text, "COMMIT");
  assert.equal(captured.transactionQueries.at(-2).text.includes("processing_status = 'received'"), true);
});

test("webhook completion is conditional on a single claimed processing state", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [{ provider_event_id: "EVENT-1", processing_status: "processed" }] }
  ], captured);
  const event = await persistence.completeWebhookEvent({
    provider: "monnify",
    providerEventId: "EVENT-1",
    status: "processed"
  });
  assert.equal(event.processing_status, "processed");
  assert.match(captured.queries[0].text, /processing_status = 'processing'/);
  assert.deepEqual(captured.queries[0].values, ["monnify", "EVENT-1", "processed", null]);
});

test("database permission errors are sanitized and never cause a JSON fallback", async () => {
  const persistence = configuredPersistence([databaseError("42501")]);
  await assert.rejects(
    persistence.getActiveProducts(),
    (error) => error.code === "database_unauthorized"
      && !error.message.includes("private database detail")
  );
});

test("readiness requires the required table privileges", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows().map((row, index) => ({
      ...row,
      has_required_privileges: index !== 2
    })) }
  ]);
  const readiness = await persistence.getReadiness();
  assert.equal(readiness.status, "security_failed");
  assert.equal(readiness.securityFailure, "table_privileges_missing");
  assert.equal(readiness.checks.tablePermissions.status, "failed");
});

test("readiness fails when role-scoped policies omit a required SQL operation", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows().map((row, index) => ({
      ...row,
      has_required_policies: index !== 1
    })) }
  ]);
  const readiness = await persistence.getReadiness();
  assert.equal(readiness.securityFailure, "table_operation_policy_missing");
});

test("product and settings reads are parameterized and exclude inactive products", async () => {
  const captured = {};
  const persistence = configuredPersistence([
    { rows: [{ slug: "active-product", status: "active" }] },
    { rows: [{ setting_key: "fee_rate", setting_value: "100" }] }
  ], captured);
  assert.equal((await persistence.getProductBySlug("active-product")).status, "active");
  assert.deepEqual(await persistence.getPlatformSettings(["fee_rate"]), [{
    setting_key: "fee_rate",
    setting_value: "100"
  }]);
  assert.match(captured.queries[0].text, /status = 'active'/);
  assert.deepEqual(captured.queries[0].values, ["active-product"]);
  assert.deepEqual(captured.queries[1].values, [["fee_rate"]]);
  await assert.rejects(persistence.getPlatformSetting("payment_secret"), { code: "sensitive_setting" });
  assert.equal(captured.queries.length, 2);
});
