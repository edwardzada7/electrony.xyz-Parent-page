"use strict";

const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const net = require("node:net");
const path = require("node:path");
const test = require("node:test");

async function getAvailablePort() {
  const listener = net.createServer();
  await new Promise((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", resolve);
  });
  const { port } = listener.address();
  await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
  return port;
}

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Bills API test server did not start.")), 5000);
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes("Electrony Bills API listening")) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Bills API test server exited before listening (${code}).`));
    });
  });
}

test("sandbox mode is fixed at startup and cannot be enabled by an API request", async () => {
  for (const setting of [undefined, "false"]) {
    const port = await getAvailablePort();
    const env = {
      PATH: process.env.PATH,
      NODE_ENV: "production",
      PORT: String(port),
      MONNIFY_API_KEY: "sandbox-api-key",
      MONNIFY_SECRET_KEY: "sandbox-secret-key",
      MONNIFY_CONTRACT_CODE: "sandbox-contract-code",
      MONNIFY_ENVIRONMENT: "sandbox",
      MONNIFY_BASE_URL: "https://sandbox.monnify.com"
    };
    if (setting !== undefined) env.BILLS_SANDBOX_MODE = setting;
    const child = spawn(process.execPath, ["bills-api/server.js"], {
      cwd: path.resolve(__dirname, ".."),
      env,
      stdio: ["ignore", "pipe", "pipe"]
    });

    try {
      await waitForServer(child);
      const healthResponse = await fetch(`http://127.0.0.1:${port}/health`);
      const health = await healthResponse.json();
      assert.equal(health.configuration.billsSandboxModeEnabled, false);
      assert.equal(health.sandboxMode.enabled, false);
      assert.equal(health.sandboxMode.status, "disabled");
      assert.equal(health.readinessChecks.collectionInitialization.ready, false);
      assert.equal(
        health.readinessChecks.collectionInitialization.status,
        "disabled_pending_contract_verification"
      );
      assert.equal(health.checks.collectionInitialization.ready, false);
      assert.equal(health.readinessChecks.authoritativePaymentVerification.ready, false);
      assert.equal(health.readinessChecks.webhookAuthenticity.ready, false);

      const catalogueResponse = await fetch(
        `http://127.0.0.1:${port}/api/services/catalog?BILLS_SANDBOX_MODE=true`
      );
      const catalogue = await catalogueResponse.json();
      assert.equal(catalogueResponse.status, 503);
      assert.equal(catalogue.status, "disabled");
      assert.equal(catalogue.message, "Sandbox catalogue access is disabled. Set BILLS_SANDBOX_MODE=true to enable the Monnify sandbox.");

      for (const [pathname, body] of [
        ["/api/payments/session", { amount: 100, service: "airtime" }],
        ["/api/payments/verify", { reference: "unverified-test-reference" }],
        ["/api/payments/webhook", { event: "unverified-test-event" }]
      ]) {
        const paymentResponse = await fetch(`http://127.0.0.1:${port}${pathname}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        assert.equal(paymentResponse.status, 503);
        assert.equal((await paymentResponse.json()).ok, false);
      }
    } finally {
      if (child.exitCode === null) {
        const exited = once(child, "exit");
        child.kill("SIGTERM");
        await exited;
      }
    }
  }
});
