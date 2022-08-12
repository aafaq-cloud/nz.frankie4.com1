const fs = require("fs");
const Path = require("path");
const ncp = require("ncp");

const pkg = require("../package.json");

const srcFolder = Path.resolve(`${process.cwd()}/${pkg.srcFolder}`);
const destFolder = Path.resolve(`${process.cwd()}/${pkg.destFolder}`);

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function() {
  deleteFolderRecursive(destFolder);

  return new Promise((resolve, reject) => {
    ncp(srcFolder, destFolder, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
