const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/Game/main.js'
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(sass|scss|css)$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader",
            options: {
              sourceMap: true,
              minimize: true,
              url: false
            }
          },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(
      {filename: 'style.bundle.css'}
    ),
    new HtmlWebPackPlugin({
      template: "./src/Game/index.html",
      filename: "./index.html"
    }),
    new CopyWebpackPlugin([
      { from: './src/Game/img', to: 'img' }
    ]),
    new CopyWebpackPlugin([
      { from: './src/Game/sounds', to: 'sounds' }
    ]),
    new CopyWebpackPlugin([
      { from: './src/Game/fonts', to: 'fonts' }
    ]),
  ]
};