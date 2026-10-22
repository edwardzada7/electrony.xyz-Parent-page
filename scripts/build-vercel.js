const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "dist");
const publicDirectories = ["assets", "automobile", "bills", "energy", "hardware", "src", "styles"];
const billsFrontendFiles = [
  "assets/brand/electrony-e-logo.png",
  "assets/brand/electrony-xyz-logo .png",
  "src/bills-app.js",
  "src/config.js",
  "src/return-to-top.js",
  "src/site-shell.js",
  "styles/bills-app.css",
  "styles/site-shell.css",
  "styles/site.css",
  "styles/tokens.css"
];
const sites = new Set(["parent", "automobile", "energy", "hardware", "bills"]);

function getSite() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== "--site" || !sites.has(args[1])) {
    throw new Error(`Usage: node scripts/build-vercel.js --site <${[...sites].join("|")}>.`);
  }

  return args[1];
}

function getPublicApiUrl(site) {
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
  if ((apiUrl.protocol !== "https:" && !(site !== "bills" && isLocal && apiUrl.protocol === "http:"))
    || apiUrl.pathname !== "/"
    || apiUrl.href !== `${apiUrl.origin}/`
    || apiUrl.username
    || apiUrl.password
    || apiUrl.search
    || apiUrl.hash) {
    throw new Error("BILLS_API_BASE_URL must be an HTTPS origin with no path, credentials, query, or fragment.");
  }

  return apiUrl.href.replace(/\/+$/, "");
}

function replaceRequired(content, original, replacement, description) {
  if (!content.includes(original)) {
    throw new Error(`Unable to locate ${description} in the Bills deployment inputs.`);
  }

  return content.split(original).join(replacement);
}

function prepareBillsEntrypoint() {
  let html = fs.readFileSync(path.join(projectRoot, "bills", "app", "index.html"), "utf8");
  for (const directory of ["assets", "src", "styles"]) {
    html = replaceRequired(html, `../../${directory}/`, `/${directory}/`, `${directory} paths`);
  }

  const parentSiteOrigin = "https://electrony.xyz";
  const parentLinks = [
    ['href="../../"', `href="${parentSiteOrigin}/"`],
    ['href="../"', `href="${parentSiteOrigin}/bills/"`],
    ['href="/"', `href="${parentSiteOrigin}/"`],
    ['href="/#', `href="${parentSiteOrigin}/#`],
    ['href="/hardware/"', `href="${parentSiteOrigin}/hardware/"`],
    ['href="/energy/"', `href="${parentSiteOrigin}/energy/"`]
  ];
  for (const [original, replacement] of parentLinks) {
    html = replaceRequired(html, original, replacement, original);
  }

  return html;
}

function copyBillsFrontend() {
  for (const file of billsFrontendFiles) {
    const source = path.join(projectRoot, file);
    const destination = path.join(outputDirectory, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }

  fs.writeFileSync(path.join(outputDirectory, "index.html"), prepareBillsEntrypoint());
}

function buildStaticSite(site) {
  const apiUrl = getPublicApiUrl(site);
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  fs.mkdirSync(outputDirectory, { recursive: true });

  if (site === "bills") {
    copyBillsFrontend();
  } else {
    for (const directory of publicDirectories) {
      fs.cpSync(path.join(projectRoot, directory), path.join(outputDirectory, directory), { recursive: true });
    }
    const entrypoint = site === "parent" ? "index.html" : path.join(site, "index.html");
    fs.copyFileSync(path.join(projectRoot, entrypoint), path.join(outputDirectory, "index.html"));
  }

  const configPath = path.join(outputDirectory, "src", "config.js");
  let config = fs.readFileSync(configPath, "utf8");
  const localApiSetting = 'billsApiBaseUrl: "http://localhost:4174"';
  if (!config.includes(localApiSetting)) {
    throw new Error("Unable to locate the local Bills API setting in src/config.js.");
  }
  config = config.replace(localApiSetting, `billsApiBaseUrl: ${JSON.stringify(apiUrl)}`);
  fs.writeFileSync(configPath, config);
}

try {
  buildStaticSite(getSite());
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
