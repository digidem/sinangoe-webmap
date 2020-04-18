const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    cms: path.join(process.cwd(), 'src', 'admin', 'cms.js')
  },

  output: {
    path: path.join(process.cwd(), 'static', 'admin')
  },

  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=/[hash].[ext]'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

  plugins: [
  ]
}
