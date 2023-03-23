const fs = require("fs-extra");
const concat = require("concat");
const path = require("path")


const build = async () => {
  const files = [
    "./dist/collection-ediotr-library-wc/runtime.js",
    "./dist/collection-ediotr-library-wc/polyfills.js",
    "./dist/collection-ediotr-library-wc/scripts.js",
    "./dist/collection-ediotr-library-wc/main.js"
  ];

  const filesToExclude = [
    "dist/collection-ediotr-library-wc/index.html",
    "dist/collection-ediotr-library-wc/runtime.js",
    "dist/collection-ediotr-library-wc/polyfills.js",
    "dist/collection-ediotr-library-wc/scripts.js",
    "dist/collection-ediotr-library-wc/main.js"
  ]
  const filter = file => {
     return !filesToExclude.includes(file);
  }

  await fs.ensureDir("dist/collection-ediotr-library-wc");
  await concat(files, "web-component/sunbird-collection-editor.js");
  await fs.copy("./dist/collection-ediotr-library-wc/", "web-component/", {filter});
  await concat(files, "web-component-demo/sunbird-collection-editor.js");
  await fs.copy("./dist/collection-ediotr-library-wc/", "web-component-demo/", {filter});
  console.log("Files concatenated successfully!!!");
};
build();