const fs = require("fs");
const path = require("path");

const pkg = require("../package.json");

const srcFolder = path.resolve(`${process.cwd()}/${pkg.srcFolder}`);
const destFolder = path.resolve(`${process.cwd()}/${pkg.destFolder}`);

module.exports = function() {
  const ignoredFiles = [".DS_Store", ".gitkeep"];

  // Copy theme files from src -> dest
  fs.watch(
    srcFolder,
    {
      recursive: true
    },
    (e, filename) => {
      // this needs to check against the file without folder information
      if (ignoredFiles.indexOf(filename) >= 0) {
        return;
      }
      const srcFile = path.resolve(`${srcFolder}/${filename}`);
      const destFile = path.resolve(`${destFolder}/${filename}`);

      switch (e) {
        case "change":
          fs.copyFile(srcFile, destFile, () => {
            console.log(`${filename} changed`);
          });
          break;
        case "rename":
          if (fs.existsSync(srcFile)) {
            fs.copyFile(srcFile, destFile, () => {
              console.log(`${filename} changed`);
            });
          } else if (fs.existsSync(destFile)) {
            fs.unlink(destFile, () => {
              console.log(`${filename} removed`);
            });
          }
          break;
      }
    }
  );
};
