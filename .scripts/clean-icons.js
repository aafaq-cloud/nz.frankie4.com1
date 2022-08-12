const { exec } = require("child_process");

const iconTransformer = require("icon-transformer-lamb");
const iconConfig = require("../icon-config.json");

module.exports = function icons() {
  return new Promise((resolve, reject) => {
    console.log(":: ✨ Cleaning and transporting icons with Icon Transformer");
    iconTransformer(iconConfig)
      .then(r => {
        console.log(":: ✨ Icon processing complete");
        resolve(r);
      })
      .catch(e => {
        reject(e);
      });
  });
};
