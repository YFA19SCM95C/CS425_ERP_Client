const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports =  merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        /*
         * Needed in json-server mock data
         *
        pathRewrite: {'^/api' : ''},
        */
        secure: false
      }
    }
  },
});
