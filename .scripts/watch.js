const themeKit = require("@shopify/themekit");
const webpack = require("webpack");
const wds = require("webpack-dev-server");

const copyTheme = require("./copy.js");
const watchTheme = require("./watch-theme.js");
const cleanIcons = require("./clean-icons.js");

const webpackConfig = require("../.webpack/webpack.config.js");

async function watch() {
  console.log(":: ↪️  Copying theme files to dist folder");
  await copyTheme();
  console.log(":: ↪️  Theme files copied to dist folder");

  await cleanIcons();

  console.log(":: 💩 Watching for changes to theme files...");

  const tk = themeKit.command("watch");
  watchTheme();

  console.log(":: ⚛️  Booting Webpack Dev Server");
  const server = new wds(webpack(webpackConfig), webpackConfig.devServer);
  server.listen("8080", "localhost", () => {});
  themeKit.command("open");

  return tk;
}

watch();
