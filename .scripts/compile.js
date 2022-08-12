const fs = require("fs");
const path = require("path");

const webpack = require("webpack");

const devConfig = require("../.webpack/webpack.config.js");
const prodConfig = require("../.webpack/webpack.prod.js");

module.exports = function compile(prod = true) {
  return new Promise((resolve, reject) => {
    console.log(":: ⚛️  Compiling assets with Webpack");
    const config = prod ? prodConfig : devConfig;
    webpack({ ...config, stats: "errors-only" }, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err);
        return;
      }
      // Delete theme.js since ThemeKit won't upload both the .js.liquid and .js files
      fs.unlinkSync(path.resolve(`${process.cwd()}/dist/assets/theme.js`));

      console.log(":: ⚛️  Webpack compile complete");
      resolve(stats);
    });
  });
};
