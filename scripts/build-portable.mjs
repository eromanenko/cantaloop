/**
 * build-portable.mjs
 *
 * Builds the Vite project, then inlines all JS, CSS, images, and Google Fonts
 * into a single self-contained HTML file: dist/cantaloop-portable.html
 *
 * Usage:  node scripts/build-portable.mjs
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const DIST = join(ROOT, "dist");

/* ── 1. Run the normal Vite build ──────────────────────────────── */
console.log("⚙️  Building project…");
execSync("npm run build", { cwd: ROOT, stdio: "inherit" });

/* ── 2. Read generated assets ──────────────────────────────────── */
const assetsDir = join(DIST, "assets");
const assets = readdirSync(assetsDir);
const cssFile = assets.find((f) => f.endsWith(".css"));
const jsFile = assets.find((f) => f.endsWith(".js"));

if (!cssFile || !jsFile) {
  console.error("❌ Could not find CSS or JS in dist/assets/");
  process.exit(1);
}

let css = readFileSync(join(assetsDir, cssFile), "utf-8");
let js = readFileSync(join(assetsDir, jsFile), "utf-8");

/* ── 3. Inline image assets referenced in JS ───────────────────── */
console.log("🖼️  Inlining image assets…");
const imageExts = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
const imageFiles = assets.filter((f) => imageExts.has(extname(f).toLowerCase()));

let inlinedImages = 0;
for (const imgFile of imageFiles) {
  const imgPath = join(assetsDir, imgFile);
  const imgBuf = readFileSync(imgPath);
  const ext = extname(imgFile).toLowerCase().slice(1);
  const mime =
    ext === "svg" ? "image/svg+xml"
    : ext === "jpg" ? "image/jpeg"
    : `image/${ext}`;
  const b64 = imgBuf.toString("base64");
  const dataUri = `data:${mime};base64,${b64}`;

  // Replace references like "/assets/alice-abc123.png" in the JS bundle
  const ref = `/assets/${imgFile}`;
  if (js.includes(ref)) {
    js = js.replaceAll(ref, dataUri);
    inlinedImages++;
  }
}
console.log(`   ✔ Inlined ${inlinedImages} image(s)`);

/* ── 4. Fetch Google Fonts and inline them as base64 ───────────── */
console.log("🔤 Fetching Google Fonts…");

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Inter:wght@400;700;900&display=swap";

let fontCss = "";
try {
  const res = await fetch(FONT_CSS_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    },
  });
  fontCss = await res.text();

  // Find all url(...) references and inline them as base64
  const urlRe = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
  const urls = [...fontCss.matchAll(urlRe)].map((m) => m[1]);
  const uniqueUrls = [...new Set(urls)];

  for (const fontUrl of uniqueUrls) {
    const fontRes = await fetch(fontUrl);
    const buf = Buffer.from(await fontRes.arrayBuffer());
    const b64 = buf.toString("base64");
    const mime = fontUrl.includes(".woff2") ? "font/woff2" : "font/woff";
    fontCss = fontCss.replaceAll(
      `url(${fontUrl})`,
      `url(data:${mime};base64,${b64})`
    );
  }
  console.log(`   ✔ Inlined ${uniqueUrls.length} font files`);
} catch (e) {
  console.warn(
    "⚠️  Could not fetch fonts, continuing without them:",
    e.message
  );
}

/* ── 5. Build the single HTML file ─────────────────────────────── */
const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#0f172a" />
  <title>Cantaloop Companion</title>
  <style>${fontCss}\n${css}</style>
</head>
<body>
  <div id="root"></div>
  <script type="module">${js}<` + `/script>
</body>
</html>`;

const outPath = join(DIST, "cantaloop-portable.html");
writeFileSync(outPath, html, "utf-8");

const sizeKB = (Buffer.byteLength(html, "utf-8") / 1024).toFixed(0);
console.log(`\n✅ Portable build complete: ${outPath}`);
console.log(`   Size: ${sizeKB} KB`);
