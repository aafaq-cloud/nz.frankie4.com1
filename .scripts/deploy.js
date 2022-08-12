const themeKit = require("@shopify/themekit");
const copyTheme = require("./copy.js");
const compile = require("./compile.js");
const cleanIcons = require("./clean-icons.js");

async function deploy() {
  console.time("Full deployment complete\nTotal time");
  console.log(":: ↪️  Copying theme files to dist folder");
  await copyTheme();
  console.log(":: ↪️  Theme files copied to dist folder");

  // Run Webpack function + icon transform in parallel
  await Promise.all([compile(), cleanIcons()]);

  console.log(":: 💩 Deploying theme with ThemeKit");
  await themeKit.command("deploy");
  console.log(":: 💩 ThemeKit deployment complete");
  console.log();
  console.timeEnd("Full deployment complete\nTotal time");
  console.log();
}

deploy();
