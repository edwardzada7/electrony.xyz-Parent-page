const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "dist");
const publicDirectories = ["assets", "automobile", "bills", "energy", "hardware", "src", "styles"];
const sites = new Set(["parent", "automobile", "energy", "hardware"]);

function getSite() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== "--site" || !sites.has(args[1])) {
    throw new Error(`Usage: node scripts/build-vercel.js --site <${[...sites].join("|")}>.`);
  }

  return args[1];
}

function getPublicApiUrl() {
  const configuredUrl = String(process.env.BILLS_API_BASE_URL || "").trim();
  if (!configuredUrl) {
    throw new Error("Set BILLS_API_BASE_URL in the Vercel build environment to the deployed Railway API base URL before building the Bills frontend.");
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

function buildStaticSite(site) {
  const apiUrl = getPublicApiUrl();
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const directory of publicDirectories) {
    fs.cpSync(path.join(projectRoot, directory), path.join(outputDirectory, directory), { recursive: true });
  }
  const entrypoint = site === "parent" ? "index.html" : path.join(site, "index.html");
  fs.copyFileSync(path.join(projectRoot, entrypoint), path.join(outputDirectory, "index.html"));

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
  buildStaticSite(getSite());
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
