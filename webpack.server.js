const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    render: './render.js'
  },
  externals: [nodeExternals()],

  output: {
    path: path.resolve('web-build'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-expo'],
          },
        }
      }
    ]
  }
};
