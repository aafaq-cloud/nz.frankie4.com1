const themeKit = require("@shopify/themekit");
const compile = require("./compile.js");

async function goLive() {
  console.time("Asset deployment complete\nTotal time");

  const stats = await compile();

  console.log(":: 💩 Deploying assets with ThemeKit");
  const compiledAssets = Object.keys(stats.compilation.assets)
    .map(asset => {
      // Original theme.js gets removed in favour of theme.js.liquid
      if (asset.search(/theme\.js$/) > -1) {
        return null;
      }
      if (asset.indexOf("snippets/") > -1) {
        const [stripped] = asset.match(/[^\/]*$/);
        return `snippets/${stripped}`;
      } else {
        const [stripped] = asset.match(/^[^?]*/);
        return `assets/${stripped}`;
      }
    }) // Remove theme.js that got nulled out
    .filter(asset => !!asset);

  await themeKit.command("deploy", {
    files: compiledAssets
  });

  console.log(":: 💩 ThemeKit deployment complete");

  console.log();
  console.timeEnd("Asset deployment complete\nTotal time");
  console.log();
}

goLive();
