const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.join(projectRoot, "dist");
const publicDirectories = ["assets", "automobile", "bills", "energy", "hardware", "src", "styles"];
const publicOrigins = Object.freeze({
  parent: "https://electrony.xyz",
  automobile: "https://auto.electrony.xyz",
  energy: "https://energy.electrony.xyz",
  hardware: "https://hardware.electrony.xyz",
  bills: "https://bills.electrony.xyz",
  accounts: "https://accounts.electrony.xyz"
});
const billsFrontendFiles = [
  "assets/brand/electrony-e-logo.png",
  "assets/brand/electrony-xyz-logo .png",
  "assets/favicons/electrony/favicon.ico",
  "assets/favicons/electrony/favicon.svg",
  "assets/favicons/electrony/favicon-16x16.png",
  "assets/favicons/electrony/favicon-32x32.png",
  "assets/favicons/electrony/apple-touch-icon.png",
  "src/bills-app.js",
  "src/config.js",
  "src/return-to-top.js",
  "src/site-shell.js",
  "styles/bills-app.css",
  "styles/site-shell.css",
  "styles/site.css",
  "styles/tokens.css"
];
const sites = new Set(["parent", "automobile", "energy", "hardware", "bills", "accounts"]);

function copyPublicDirectory(directory) {
  const sourceDirectory = path.join(projectRoot, directory);
  const destinationDirectory = path.join(outputDirectory, directory);
  fs.cpSync(sourceDirectory, destinationDirectory, {
    recursive: true,
    filter: (sourcePath) => {
      const name = path.basename(sourcePath);
      return !name.startsWith(".")
        && !/\.(?:md|pdf)$/i.test(name)
        && !/\.test\.[cm]?js$/i.test(name);
    }
  });
}

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
    throw new Error("Set BILLS_API_BASE_URL to the deployed Railway API base URL for builds that include the Bills app.");
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

function prepareIdentityConfig(config) {
  const projectUrl = String(process.env.ELECTRONY_IDENTITY_SUPABASE_URL || "").trim();
  const publishableKey = String(process.env.ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY || "").trim();

  const nullUrl = "identityProjectUrl: null";
  const nullKey = "identityPublishableKey: null";
  if (!config.includes(nullUrl) || !config.includes(nullKey)) {
    throw new Error("Unable to locate identity placeholders in src/config.js.");
  }

  if (!projectUrl && !publishableKey) {
    return config.replace(nullUrl, "identityProjectUrl: null").replace(nullKey, "identityPublishableKey: null");
  }
  if (!projectUrl || !publishableKey) {
    throw new Error("Set both ELECTRONY_IDENTITY_SUPABASE_URL and ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY.");
  }

  let url;
  try {
    url = new URL(projectUrl);
  } catch (error) {
    throw new Error("ELECTRONY_IDENTITY_SUPABASE_URL must be an absolute HTTPS origin.");
  }
  if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("ELECTRONY_IDENTITY_SUPABASE_URL must be an HTTPS origin with no path, credentials, query, or fragment.");
  }
  if (publishableKey.includes("replace_with") || publishableKey.length < 20) {
    throw new Error("ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY is missing or looks like a placeholder.");
  }
  if (/service_role|secret_key/i.test(publishableKey)) {
    throw new Error("Refusing to place a service-role or secret key in the browser build.");
  }

  return config.replace(nullUrl, `identityProjectUrl: ${JSON.stringify(url.href.replace(/\/+$/, ""))}`)
    .replace(nullKey, `identityPublishableKey: ${JSON.stringify(publishableKey)}`);
}

function copyAccountsFrontend() {
  const files = [
    "assets/brand/electrony-e-logo.png",
    "assets/brand/electrony-xyz-logo .png",
    "assets/favicons/electrony/favicon.ico",
    "assets/favicons/electrony/favicon.svg",
    "assets/favicons/electrony/favicon-16x16.png",
    "assets/favicons/electrony/favicon-32x32.png",
    "assets/favicons/electrony/apple-touch-icon.png",
    "src/config.js",
    "src/accounts-app.js",
    "styles/tokens.css",
    "styles/accounts.css"
  ];
  for (const file of files) {
    const source = path.join(projectRoot, file);
    const destination = path.join(outputDirectory, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }

  const html = fs.readFileSync(path.join(projectRoot, "accounts", "index.html"), "utf8");
  fs.writeFileSync(path.join(outputDirectory, "index.html"), html.replaceAll("../../", "/"));

  const consentSource = path.join(projectRoot, "accounts", "oauth", "consent", "index.html");
  if (fs.existsSync(consentSource)) {
    fs.mkdirSync(path.join(outputDirectory, "oauth", "consent"), { recursive: true });
    fs.writeFileSync(
      path.join(outputDirectory, "oauth", "consent", "index.html"),
      fs.readFileSync(consentSource, "utf8").replaceAll("../../../../", "/").replaceAll("../../../", "/")
    );
  }
}

function writeCrawlFiles(site) {
  const origin = publicOrigins[site];
  if (!origin) throw new Error(`No public origin is configured for the ${site} site.`);

  const pages = site === "parent" ? ["/", "/bills/"] : ["/"];
  const entries = pages.map((page) => `  <url><loc>${origin}${page}</loc></url>`).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  fs.writeFileSync(path.join(outputDirectory, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  fs.writeFileSync(path.join(outputDirectory, "sitemap.xml"), sitemap);
}

function prepareAutomobileEntrypoint() {
  const htmlPath = path.join(projectRoot, "automobile", "index.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  for (const directory of ["assets", "src", "styles"]) {
    html = html.split(`../${directory}/`).join(`/${directory}/`);
  }
  return html;
}

function buildStaticSite(site) {
  const apiUrl = ["parent", "bills"].includes(site) ? getPublicApiUrl(site) : null;
  fs.rmSync(outputDirectory, { recursive: true, force: true });
  fs.mkdirSync(outputDirectory, { recursive: true });

  if (site === "bills") {
    copyBillsFrontend();
  } else if (site === "accounts") {
    copyAccountsFrontend();
  } else {
    for (const directory of publicDirectories) {
      copyPublicDirectory(directory);
    }
    if (site === "automobile") {
      fs.writeFileSync(path.join(outputDirectory, "index.html"), prepareAutomobileEntrypoint());
    } else {
      const entrypoint = site === "parent" ? "index.html" : path.join(site, "index.html");
      fs.copyFileSync(path.join(projectRoot, entrypoint), path.join(outputDirectory, "index.html"));
    }
  }

  if (site === "automobile") {
    for (const script of ["automobile.js", "automobile-catalogue.js"]) {
      const automobileScriptPath = path.join(outputDirectory, "src", script);
      let automobileScript = fs.readFileSync(automobileScriptPath, "utf8");
      automobileScript = automobileScript.split("../assets/").join("/assets/");
      fs.writeFileSync(automobileScriptPath, automobileScript);
    }
  }

  writeCrawlFiles(site);

  const configPath = path.join(outputDirectory, "src", "config.js");
  let config = fs.readFileSync(configPath, "utf8");
  const localApiSetting = 'billsApiBaseUrl: "http://localhost:4174"';
  if (!config.includes(localApiSetting)) {
    throw new Error("Unable to locate the local Bills API setting in src/config.js.");
  }
  config = config.replace(localApiSetting, `billsApiBaseUrl: ${apiUrl ? JSON.stringify(apiUrl) : "null"}`);
  if (site === "accounts") {
    config = prepareIdentityConfig(config);
  }
  fs.writeFileSync(configPath, config);
}

try {
  buildStaticSite(getSite());
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
