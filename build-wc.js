const fs = require("fs-extra");
const concat = require("concat");

const build = async () => {
  const files = [
    "./dist/collection-ediotr-library-wc/runtime.js",
    "./dist/collection-ediotr-library-wc/polyfills.js",
    "./dist/collection-ediotr-library-wc/scripts.js",
    "./dist/collection-ediotr-library-wc/main.js"
  ];

  await fs.ensureDir("dist/collection-ediotr-library-wc");
  await concat(files, "web-component/sunbird-collection-editor.js");
  await fs.copy("./dist/collection-ediotr-library-wc/assets", "web-component/assets");
  await fs.copy("./dist/collection-ediotr-library-wc/styles.css", "web-component/styles.css")
  await concat(files, "web-component-demo/sunbird-collection-editor.js");
  await fs.copy("./dist/collection-ediotr-library-wc/assets", "web-component-demo/assets");
  await fs.copy("./dist/collection-ediotr-library-wc/styles.css", "web-component-demo/styles.css")
  console.log("Files concatenated successfully!!!");
};
build();