/**
 * Config file for webpack
 */

var webpack = require('webpack');
var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');


var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var ExtractCss = new ExtractTextPlugin('styles.css');


// Do not rebuild assets on error.
// This is not activated because it can be dificult to catch errors during
// development
var noErrors = new webpack.NoErrorsPlugin();
var CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
  entry: {
    graphiql: './src/client/graphiql.js'
    //work: './src/client/work.view.js'
  },
  devtool: false, //"source-map",
  output: {
    path: __dirname + '/public',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      /*{
       test: /\.scss$/,
       //loader: "style!css!sass"
       loader: ExtractTextPlugin.extract(
       // activate source maps via loader query
       'css?sourceMap!' +
       'sass?sourceMap'
       )
       }*/
      {
        test: /\.(scss|css)$/,
        //loader: "style!css!sass"
        loader: ExtractTextPlugin.extract(
          "css?sourceMap!" +
          "sass?sourceMap&includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib") +
          "&includePaths[]=" + path.resolve(__dirname, "./vendor/foundation/scss")
        )
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=1' }
    ]
  },
  plugins: [
    definePlugin,
    //commonsPlugin,
    ExtractCss,
    /*new webpack.ProvidePlugin({
     $: "jquery",
     jQuery: "jquery",
     "window.jQuery": "jquery"
     })*/
    /*new CompressionPlugin({
     asset: "{file}.gz",
     algorithm: "gzip",
     regExp: /\.js$|\.html$/,
     threshold: 10240,
     minRatio: 0.8
     })*/
    //noErrors
  ]
};