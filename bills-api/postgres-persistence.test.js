"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
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
    role_name: "bills_backend",
    is_superuser: superuser,
    bypasses_rls: bypassesRls,
    table_name: tableName,
    rls_enabled: true,
    owns_table: false,
    has_server_policy: policy
  }));
}

function makePersistence(responses, captured = {}) {
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
      return response;
    }

    async end() {
      captured.closed = true;
    }
  }

  return createPostgresPersistence(
    "postgresql://bills_backend:placeholder@db.example.test:5432/electrony?sslmode=disable",
    MockPool
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

test("readiness runs SELECT 1 with verified TLS before checking table security controls", async () => {
  const captured = {};
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows() }
  ], captured);

  assert.deepEqual(await persistence.getReadiness(), {
    status: "connection_verified",
    configured: true,
    connected: true,
    securityStatus: "controls_verified",
    securityFailure: null,
    connectionFailure: null
  });
  assert.equal(captured.options.ssl.rejectUnauthorized, true);
  assert.equal(captured.options.connectionTimeoutMillis, 5000);
  assert.equal(captured.options.statement_timeout, 5000);
  assert.equal(captured.queries[0].text, "SELECT 1 AS ready");
  assert.equal(captured.queries[0].query_timeout, 5000);
  assert.equal(captured.queries[1].values[0].length, REQUIRED_TABLES.length);
  await persistence.close();
  assert.equal(captured.closed, true);
});

test("connection failures are reported without exposing database errors", async () => {
  const persistence = makePersistence([
    new Error("password leaked from db.private.example.test")
  ]);
  const readiness = await persistence.getReadiness();

  assert.deepEqual(readiness, {
    status: "unavailable",
    configured: true,
    connected: false,
    securityStatus: "not_checked",
    securityFailure: null,
    connectionFailure: "connection_failed"
  });
  assert.equal(JSON.stringify(readiness).includes("db.private.example.test"), false);
});

test("missing RLS policies keep security readiness failed after connectivity succeeds", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows({ policy: false }) }
  ]);

  assert.deepEqual(await persistence.getReadiness(), {
    status: "security_failed",
    configured: true,
    connected: true,
    securityStatus: "failed",
    securityFailure: "server_role_policy_missing",
    connectionFailure: null
  });
});

test("privileged roles fail the security check without being reported as ready", async () => {
  const persistence = makePersistence([
    { rows: [{ ready: 1 }] },
    { rows: securityRows({ bypassesRls: true }) }
  ]);

  const readiness = await persistence.getReadiness();
  assert.equal(readiness.status, "security_failed");
  assert.equal(readiness.securityFailure, "dedicated_role_required");
});
