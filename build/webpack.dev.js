const merge = require('webpack-merge')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',

  output: {
    filename: '[name].js',
    chunkFilename: '[id].css'
  },

  devServer: {
    port: process.env.PORT || 8080,
    contentBase: path.join(process.cwd(), './static/admin'),
    watchContentBase: true,
    quiet: false,
    lazy: true,
    open: true,
    historyApiFallback: {
      rewrites: [{from: /./, to: '404.html'}]
    }
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        'static/admin/cms.js',
        'webpack-assets.json'
      ]}),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
})
