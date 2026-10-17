const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "dist");
const publicDirectories = ["assets", "automobile", "bills", "energy", "hardware", "src", "styles"];
const publicRootFiles = ["index.html"];

function getPublicApiUrl() {
  const configuredUrl = String(process.env.BILLS_API_BASE_URL || "").trim();
  if (!configuredUrl) {
    throw new Error("Set BILLS_API_BASE_URL in the Vercel build environment to the deployed Railway API base URL.");
  }

  let apiUrl;
  try {
    apiUrl = new URL(configuredUrl);
  } catch (error) {
    throw new Error("BILLS_API_BASE_URL must be a valid absolute HTTP(S) URL.");
  }

  const isLocal = ["localhost", "127.0.0.1"].includes(apiUrl.hostname);
  if ((apiUrl.protocol !== "https:" && !(isLocal && apiUrl.protocol === "http:"))
    || apiUrl.pathname !== "/"
    || apiUrl.username
    || apiUrl.password
    || apiUrl.search
    || apiUrl.hash) {
    throw new Error("BILLS_API_BASE_URL must be an HTTPS URL without credentials, query, or fragment.");
  }

  return apiUrl.href.replace(/\/+$/, "");
}

function buildStaticSite() {
  const apiUrl = getPublicApiUrl();
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const directory of publicDirectories) {
    fs.cpSync(path.join(projectRoot, directory), path.join(outputDirectory, directory), { recursive: true });
  }
  for (const filename of publicRootFiles) {
    fs.copyFileSync(path.join(projectRoot, filename), path.join(outputDirectory, filename));
  }

  const configPath = path.join(outputDirectory, "src", "config.js");
  const config = fs.readFileSync(configPath, "utf8");
  const localApiUrl = 'billsApiBaseUrl: "http://localhost:4174"';
  if (!config.includes(localApiUrl)) {
    throw new Error("Unable to locate the local Bills API setting in src/config.js.");
  }
  fs.writeFileSync(
    configPath,
    config.replace(localApiUrl, `billsApiBaseUrl: ${JSON.stringify(apiUrl)}`)
  );
}

try {
  buildStaticSite();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
