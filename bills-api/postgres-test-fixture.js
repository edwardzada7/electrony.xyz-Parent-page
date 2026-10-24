"use strict";

const { Pool } = require("pg");

const RUNTIME_ROLE = "electrony_bills_runtime";
const REFERENCE_PREFIX = "electrony-postgres-test-";
const PRODUCT_SLUG = "electrony-postgres-test-product";
const PRODUCT_CODE = "electrony-postgres-test-product";
const FAILURE_ORDER_REFERENCE = `${REFERENCE_PREFIX}fail-order-insert`;
const FIXTURE_METADATA = "postgres-test-fixture";
const TRIGGER_NAME = "electrony_postgres_test_order_failure";
const FUNCTION_NAME = "electrony_postgres_test_order_failure";

function getConfiguration(environment = process.env) {
  const adminConnectionString = environment.BILLS_TEST_ADMIN_DATABASE_URL;
  const runtimeConnectionString = environment.BILLS_RUNTIME_DATABASE_URL;
  if (!adminConnectionString || !runtimeConnectionString) {
    throw new Error(
      "Set BILLS_TEST_ADMIN_DATABASE_URL and BILLS_RUNTIME_DATABASE_URL for the disposable PostgreSQL test database."
    );
  }
  return {
    adminConnectionString,
    runtimeConnectionString,
    failureOrderReference: environment.BILLS_TEST_FAILURE_ORDER_REFERENCE
      || FAILURE_ORDER_REFERENCE
  };
}

async function verifyConnections(adminPool, runtimePool) {
  const [adminResult, runtimeResult] = await Promise.all([
    adminPool.query("SELECT current_database() AS database_name, current_user AS role_name"),
    runtimePool.query("SELECT current_database() AS database_name, current_user AS role_name")
  ]);
  const admin = adminResult.rows[0];
  const runtime = runtimeResult.rows[0];
  if (!admin || !runtime || admin.database_name !== runtime.database_name) {
    throw new Error("Admin and runtime connections must point to the same test database.");
  }
  if (runtime.role_name !== RUNTIME_ROLE) {
    throw new Error(`Runtime connection must authenticate directly as ${RUNTIME_ROLE}.`);
  }
  if (admin.role_name === RUNTIME_ROLE) {
    throw new Error("BILLS_TEST_ADMIN_DATABASE_URL must use a separate database owner/admin role.");
  }
}

async function deleteFixtureRecords(client) {
  await client.query(`
    DELETE FROM public.bill_payment_webhook_events
    WHERE provider_event_id LIKE ($1 || '%')
       OR merchant_reference LIKE ($1 || '%')
       OR merchant_reference IN (
         SELECT attempt.merchant_reference
         FROM public.bill_payment_attempts AS attempt
         JOIN public.bill_orders AS test_order ON test_order.id = attempt.order_id
         WHERE test_order.order_reference LIKE ($1 || '%')
            OR test_order.payment_reference LIKE ($1 || '%')
            OR test_order.quote_id IN (
              SELECT quote.id
              FROM public.bill_fee_quotes AS quote
              WHERE quote.quote_reference LIKE ($1 || '%')
                 OR quote.product_code = $2
            )
       )
  `, [REFERENCE_PREFIX, PRODUCT_CODE]);
  await client.query(`
    DELETE FROM public.bill_payment_attempts AS attempt
    WHERE attempt.merchant_reference LIKE ($1 || '%')
       OR attempt.order_id IN (
         SELECT test_order.id
         FROM public.bill_orders AS test_order
         WHERE test_order.order_reference LIKE ($1 || '%')
            OR test_order.payment_reference LIKE ($1 || '%')
            OR test_order.quote_id IN (
              SELECT quote.id
              FROM public.bill_fee_quotes AS quote
              WHERE quote.quote_reference LIKE ($1 || '%')
                 OR quote.product_code = $2
            )
       )
  `, [REFERENCE_PREFIX, PRODUCT_CODE]);
  await client.query(`
    DELETE FROM public.bill_orders
    WHERE order_reference LIKE ($1 || '%')
       OR payment_reference LIKE ($1 || '%')
       OR quote_id IN (
         SELECT id
         FROM public.bill_fee_quotes
         WHERE quote_reference LIKE ($1 || '%')
            OR product_code = $2
       )
  `, [REFERENCE_PREFIX, PRODUCT_CODE]);
  await client.query(`
    DELETE FROM public.bill_fee_quotes
    WHERE quote_reference LIKE ($1 || '%') OR product_code = $2
  `, [REFERENCE_PREFIX, PRODUCT_CODE]);
  await client.query(`
    DELETE FROM public.electrony_products
    WHERE slug = $1 AND metadata->>'fixture' = $2
  `, [PRODUCT_SLUG, FIXTURE_METADATA]);
}

async function insertProduct(client) {
  const inserted = await client.query(`
    INSERT INTO public.electrony_products (
      slug, name, category, short_description, website_url,
      status, display_order, metadata
    ) VALUES ($1, $2, $3, $4, NULL, 'active', 0, $5::jsonb)
    ON CONFLICT (slug) DO NOTHING
    RETURNING slug
  `, [
    PRODUCT_SLUG,
    "PostgreSQL Test Product",
    "test",
    "Disposable product for fee-quote and order verification.",
    JSON.stringify({ fixture: FIXTURE_METADATA, product_code: PRODUCT_CODE })
  ]);
  if (inserted.rows[0]) return;

  const existing = await client.query(`
    SELECT metadata->>'fixture' AS fixture
    FROM public.electrony_products
    WHERE slug = $1
  `, [PRODUCT_SLUG]);
  if (existing.rows[0]?.fixture !== FIXTURE_METADATA) {
    throw new Error(`Product slug ${PRODUCT_SLUG} already belongs to a non-fixture record.`);
  }
}

async function createFailureTrigger(client, failureOrderReference) {
  await client.query(`
    CREATE FUNCTION public.${FUNCTION_NAME}()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $failure$
    BEGIN
      IF NEW.order_reference = TG_ARGV[0] THEN
        RAISE EXCEPTION USING
          ERRCODE = 'P0001',
          MESSAGE = 'Intentional PostgreSQL test failure for targeted order reference';
      END IF;
      RETURN NEW;
    END;
    $failure$
  `);
  const triggerStatement = await client.query(`
    SELECT format(
      'CREATE TRIGGER ${TRIGGER_NAME} BEFORE INSERT ON public.bill_orders '
      || 'FOR EACH ROW EXECUTE FUNCTION public.${FUNCTION_NAME}(%L)',
      $1
    ) AS statement
  `, [failureOrderReference]);
  await client.query(triggerStatement.rows[0].statement);
}

async function setupFixture(adminPool, runtimePool, failureOrderReference = FAILURE_ORDER_REFERENCE) {
  await verifyConnections(adminPool, runtimePool);
  const client = await adminPool.connect();
  try {
    await client.query("BEGIN");
    await deleteFixtureRecords(client);
    await client.query(`DROP TRIGGER IF EXISTS ${TRIGGER_NAME} ON public.bill_orders`);
    await client.query(`DROP FUNCTION IF EXISTS public.${FUNCTION_NAME}()`);
    await insertProduct(client);
    await createFailureTrigger(client, failureOrderReference);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  return {
    productSlug: PRODUCT_SLUG,
    productCode: PRODUCT_CODE,
    referencePrefix: REFERENCE_PREFIX,
    failureOrderReference
  };
}

async function cleanupFixture(adminPool, runtimePool) {
  await verifyConnections(adminPool, runtimePool);
  const client = await adminPool.connect();
  try {
    await client.query("BEGIN");
    await deleteFixtureRecords(client);
    await client.query(`DROP TRIGGER IF EXISTS ${TRIGGER_NAME} ON public.bill_orders`);
    await client.query(`DROP FUNCTION IF EXISTS public.${FUNCTION_NAME}()`);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function withFixture(run, environment = process.env) {
  if (typeof run !== "function") throw new TypeError("withFixture requires a callback.");
  const configuration = getConfiguration(environment);
  const adminPool = new Pool({ connectionString: configuration.adminConnectionString });
  const runtimePool = new Pool({ connectionString: configuration.runtimeConnectionString });
  let fixture;
  let operationError;
  try {
    fixture = await setupFixture(
      adminPool,
      runtimePool,
      configuration.failureOrderReference
    );
    return await run({ ...fixture, runtimePool });
  } catch (error) {
    operationError = error;
    throw error;
  } finally {
    try {
      if (fixture) await cleanupFixture(adminPool, runtimePool);
    } catch (cleanupError) {
      if (operationError) {
        throw new AggregateError(
          [operationError, cleanupError],
          "Verification and PostgreSQL fixture cleanup both failed."
        );
      }
      throw cleanupError;
    } finally {
      await Promise.all([adminPool.end(), runtimePool.end()]);
    }
  }
}

async function runCommand(command, environment = process.env) {
  if (command !== "setup" && command !== "cleanup") {
    throw new Error("Usage: node bills-api/postgres-test-fixture.js <setup|cleanup>");
  }
  const configuration = getConfiguration(environment);
  const adminPool = new Pool({ connectionString: configuration.adminConnectionString });
  const runtimePool = new Pool({ connectionString: configuration.runtimeConnectionString });
  try {
    if (command === "setup") {
      return await setupFixture(adminPool, runtimePool, configuration.failureOrderReference);
    }
    await cleanupFixture(adminPool, runtimePool);
    return { cleaned: true };
  } finally {
    await Promise.all([adminPool.end(), runtimePool.end()]);
  }
}

if (require.main === module) {
  runCommand(process.argv[2]).then((result) => {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  }).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  FAILURE_ORDER_REFERENCE,
  PRODUCT_CODE,
  PRODUCT_SLUG,
  REFERENCE_PREFIX,
  cleanupFixture,
  runCommand,
  setupFixture,
  withFixture
};
