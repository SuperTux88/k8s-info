const webpack = require('webpack');

const config = {
  entry: {
    index: __dirname + '/react/index.jsx',
    fonts: __dirname + '/react/fonts.jsx'
  },
  output: {
    path: __dirname + '/app/static/js',
    filename: '[name].bundle.js',
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
  }
};

module.exports = config;
