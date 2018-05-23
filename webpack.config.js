const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin')

const config = {
  entry: {
    index: __dirname + '/react/index.jsx',
    fonts: __dirname + '/react/fonts.jsx'
  },
  output: {
    path: __dirname + '/app/static/js',
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new ManifestPlugin({
      fileName: __dirname + '/app/manifest.json',
      publicPath: "/static/js/"
    })
  ]
};

module.exports = config;
