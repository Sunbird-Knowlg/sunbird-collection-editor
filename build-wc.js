const fs = require("fs-extra");
const concat = require("concat");
const path = require("path");
const glob = require("glob")

const DIST_DIR = path.resolve(__dirname, "dist/collection-editor-library-wc");
function findFirstMatchingFile(dir, patterns) {
  for (const pat of patterns) {
    const matches = glob.sync(pat, { cwd: dir });
    if (matches && matches.length > 0) {
      return path.join(dir, matches[0]);
    }
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

  const subDir = "assets/collection-editor";

  async function cleanDir(dir, preserve = []) {
    if (!fs.existsSync(dir)) return;
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!preserve.includes(file)) {
        await fs.remove(path.join(dir, file));
      }
    }
  }

  // Build outputs for web-component
  const wcDir = path.resolve(__dirname, "web-component");
  await cleanDir(wcDir, ["package.json"]);
  await fs.ensureDir(path.join(wcDir, subDir));
  await concat(files, path.join(wcDir, subDir, "sunbird-collection-editor.js"));
  await fs.copy(DIST_DIR + "/", path.join(wcDir, subDir), { filter });

  // Build outputs for web-component-demo
  const wcDemoDir = path.resolve(__dirname, "web-component-demo");
  await cleanDir(wcDemoDir, ["index.html"]);
  await fs.ensureDir(path.join(wcDemoDir, subDir));
  await concat(files, path.join(wcDemoDir, subDir, "sunbird-collection-editor.js"));
  await fs.copy(DIST_DIR + "/", path.join(wcDemoDir, subDir), { filter });

  console.log("Web component bundles prepared successfully.");
}

build().catch((err) => {
  console.error("Failed to build web component:", err);
  process.exit(1);
});