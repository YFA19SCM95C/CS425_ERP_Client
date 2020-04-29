const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const OptimizeCssAssetsWebpackPlugin = require( "optimize-css-assets-webpack-plugin" );
const extractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin()
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
});
