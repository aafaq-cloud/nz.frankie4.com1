const themeKit = require("@shopify/themekit");

async function download() {
  console.time("Downloading");
  console.log(":: ↪️  Downloading theme files to src folder");


  await themeKit.command('download', {
    files: ['templates/page.*.liquid'],
    dir: 'src/theme'
  });

}

download();
