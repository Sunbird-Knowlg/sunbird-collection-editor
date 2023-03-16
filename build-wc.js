// const fs = require("fs-extra");
// const concat = require("concat");

// const build = async () => {
//   const files = [
//     "./dist/pdf-player-wc/runtime.js",
//     "./dist/pdf-player-wc/polyfills.js",
//     "./dist/pdf-player-wc/vendor.js",
//     "./dist/pdf-player-wc/main.js"
//   ];

//   await fs.ensureDir("dist/pdf-player-wc");
//   await concat(files, "web-component/sunbird-pdf-player.js");
//   await fs.copy("./dist/pdf-player-wc/assets", "web-component/assets");
//   await fs.copy("./dist/pdf-player-wc/styles.css", "web-component/styles.css")
//   await concat(files, "web-component-demo/sunbird-pdf-player.js");
//   await fs.copy("./dist/pdf-player-wc/assets", "web-component-demo/assets");
//   await fs.copy("./dist/pdf-player-wc/styles.css", "web-component-demo/styles.css")
//   console.log("Files concatenated successfully!!!");
// };
// build();