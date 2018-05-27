const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');

const config = {
  entry: {
    index: path.resolve(__dirname, 'react/index.jsx'),
    fonts: path.resolve(__dirname, 'react/fonts.js'),
  },
  output: {
    path: path.resolve(__dirname, 'app/static/js'),
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000',
      },
    ],
  },
  plugins: [
    new ManifestPlugin({
      fileName: path.resolve(__dirname, 'app/manifest.json'),
      publicPath: '/static/js/',
    }),
  ],
};

module.exports = config;
