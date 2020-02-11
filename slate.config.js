/* eslint-disable no-undef */

const path = require('path');

const alias = {
  jquery: path.resolve('./node_modules/jquery'),
  'lodash-es': path.resolve('./node_modules/lodash-es'),
  vue: path.resolve('./node_modules/vue/dist/vue.js')
};

module.exports = {
  slateCssVarLoader: {
    cssVarLoaderLiquidPath: ['src/snippets/css-variables.liquid'],
  },
  slateTools: {
    extends: {
      dev: {
        resolve: {alias},
        module: {
          rules: [
              { // scss loader for webpack
                  test: /\.scss$/,
                  use: [
                      {
                          loader: 'sass-loader',
                          options: {
                              includePaths: [
                                path.resolve("./node_modules/foundation-sites/scss"),
                                path.resolve("./node_modules/@glidejs/glide/src/assets/sass")
                              ]
                          }
                      }
                  ]
              },
              { // css loader for webpack
                  test: /\.css$/,
                  use: [
                      {
                          loader: 'css-loader',
                          options: {
                          }
                      }
                  ]
              },
          ]
        }
      },
      prod: {resolve: {alias},
          module: {
              rules: [
                  { // scss loader for webpack
                      test: /\.scss$/,
                      use: [
                          {
                              loader: 'sass-loader',
                              options: {
                                  includePaths: [
                                    path.resolve("./node_modules/foundation-sites/scss"),
                                    path.resolve("./node_modules/@glidejs/glide/src/assets/sass")
                                  ],
                              }
                          }
                      ]
                  },
                  { // css loader for webpack
                      test: /\.css$/,
                      use: [
                          {
                              loader: 'css-loader',
                              options: {

                              }
                          }
                      ]
                  }
              ]
          }},
    },
  },
};
