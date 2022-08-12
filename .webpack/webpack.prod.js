const path = require("path");

const webpack = require("webpack");

const DropletPlugin = require("droplet-plugin");

const ExtractCSS = require("mini-css-extract-plugin");
const OptimizeCSS = require("optimize-css-assets-webpack-plugin");

const Uglify = require("uglifyjs-webpack-plugin");

const pkg = require("../package.json");

const util = require("./utils");

module.exports = {
  mode: "production",
  context: path.resolve(process.cwd()),
  entry: util.entry,
  output: {
    filename: `[name].js`,
    chunkFilename: "chunk.[name].js?[contenthash:5]",
    path: `${util.outPath}/${util.jsOutPath}`
  },
  module: {
    rules: [
      ...util.rules,
      {
        test: /\.scss$/,
        use: [
          ExtractCSS.loader,
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          "postcss-loader",
          "cache-loader",
          {
            loader: "sass-loader",
            options: {
              prependData: "$assets: '';",
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
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 15000,
      maxSize: 0,
      minChunks: 1,
      automaticNameDelimiter: "@",
      name: true,
      cacheGroups: {
        default: false,
        style: {
          name: "style",
          test: /\.s?[ca]ss$/,
          chunks: "all",
          priority: 10,
          enforce: true
        }
      }
    },
    minimizer: [
      new Uglify({
        // extractComments: true,
        parallel: true,
        cache: true
      }),
      new OptimizeCSS({})
    ]
  },
  plugins: [
    ...util.plugins,
    ...util.prodSnippets,
    new DropletPlugin(),
    new webpack.DefinePlugin({
      ...util.GLOBALS
    }),
    new ExtractCSS({
      filename: `style.[contenthash:6].min.css`,
      chunkFilename: `style.[contenthash:6].min.css`
    }),
    new webpack.HashedModuleIdsPlugin()
  ],
  resolve: util.resolve
};
