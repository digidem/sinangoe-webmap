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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'module',
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-syntax-object-rest-spread',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
  ]
}
