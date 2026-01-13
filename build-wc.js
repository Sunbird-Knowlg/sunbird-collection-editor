const fs = require("fs-extra");
const concat = require("concat");
const path = require("path");

const DIST_DIR = path.resolve(__dirname, "dist/collection-editor-library-wc");

function findFirstMatchingFile(dir, patterns) {
  const entries = fs.readdirSync(dir);
  for (const pat of patterns) {
    const regex = new RegExp("^" + pat.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$");
    const match = entries.find((f) => regex.test(f));
    if (match) return path.join(dir, match);
  }
  return null;
}

async function build() {
  await fs.ensureDir(DIST_DIR);
  const main = findFirstMatchingFile(DIST_DIR, ["main.*.js", "main.js"]);
  if (!main) {
    throw new Error(
      `Could not find main bundle in ${DIST_DIR}. Expected one of: main.*.js or main.js.`
    );
  }
  const runtime = findFirstMatchingFile(DIST_DIR, ["runtime.*.js", "runtime.js"]);
  const polyfills = findFirstMatchingFile(DIST_DIR, ["polyfills.*.js", "polyfills.js"]);
  const scripts = findFirstMatchingFile(DIST_DIR, ["scripts.*.js", "scripts.js"]);

  // Concatenation order: runtime -> polyfills -> scripts -> main
  const files = [runtime, polyfills, scripts, main].filter(Boolean);

  const filesToExclude = new Set(
    [
      path.join(DIST_DIR, "index.html"),
      runtime,
      polyfills,
      scripts,
      main,
    ].filter(Boolean)
  );

  const filter = (file) => !filesToExclude.has(file);

  // Build outputs for web-component
  await fs.ensureDir(path.resolve(__dirname, "web-component"));
  await concat(files, path.resolve(__dirname, "web-component/sunbird-collection-editor.js"));
  await fs.copy(DIST_DIR + "/", path.resolve(__dirname, "web-component/"), { filter });

  // Build outputs for web-component-demo
  await fs.ensureDir(path.resolve(__dirname, "web-component-demo"));
  await concat(files, path.resolve(__dirname, "web-component-demo/sunbird-collection-editor.js"));
  await fs.copy(DIST_DIR + "/", path.resolve(__dirname, "web-component-demo/"), { filter });

  console.log("Web component bundles prepared successfully.");
}

build().catch((err) => {
  console.error("Failed to build web component:", err);
  process.exit(1);
});