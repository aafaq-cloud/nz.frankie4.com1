const path = require("path");

const webpack = require("webpack");
const util = require("./utils");

module.exports = {
  mode: "development",
  devtool: "inline-cheap-module-source-map",
  context: path.resolve(process.cwd()),
  entry: util.entry,
  output: {
    filename: `${util.jsOutPath}/[name].js`,
    // chunkFilename: `${util.jsOutPath}/[name].bundle.js`,
    path: util.outPath,
    publicPath: "https://localhost:8080/"
  },
  module: {
    rules: [
      ...util.rules,
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          "cache-loader",
          {
            loader: "sass-loader",
            options: {
              prependData: "$assets: 'https://localhost:8080/';",
              sassOptions: {
                includePaths: util.sassPaths,
                sourceMap: true
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    ...util.plugins,
    ...util.devSnippets,
    new webpack.DefinePlugin({
      ...util.GLOBALS
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: util.resolve,
  devServer: {
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    hot: true,
    compress: true,
    // useLocalIp: true,
    port: "8080",
    https: true,
    writeToDisk: filePath => /\.liquid$/.test(filePath),
    stats: "minimal",
    contentBase: path.resolve("./src/theme/assets")
  }
};
