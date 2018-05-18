const webpack = require('webpack');

const config = {
  entry:  __dirname + '/react/index.jsx',
  output: {
    path: __dirname + '/app/static/js',
    filename: 'bundle.js',
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
    }
  ]
}
};

module.exports = config;
