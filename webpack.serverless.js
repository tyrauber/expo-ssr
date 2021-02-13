const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const path = require('path');
const appDirectory = path.resolve(__dirname, '../');

module.exports = {
    entry: slsw.lib.entries,
    target: "node",
    devtool: 'source-map',
    externals: [nodeExternals({
      allowlist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/,

        // Allow transpilation of react-native for SSR
        /@?react-(navigation|native)/,
        /hammerjs/ // ... because mapping it to @egjs/hammerjs
      ]
    })],
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    optimization: {
      minimize: false
    },
    performance: {
      hints: false
    },
    module: {
      rules: [    
        // Process react-native modules because node needs commonjs
        {
          test: /(@?react-(navigation|native)).*\.(ts|js)x?$/,
          exclude: [
            /react-native-web/,
            /\.(native|ios|android)\.(ts|js)x?$/
          ],
          loader: 'babel-loader',
        },

        // Process all our files
        {
          test: /\.(ts|js)x?$/,
          exclude: [
            /node_modules/,
            /\.(native|ios|android)\.(ts|js)x?$/
          ],
          loader: 'babel-loader',
        },
        {
          test: /\.(gif|jpe?g|png|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        'hammerjs': '@egjs/hammerjs'
      },
      extensions: ['.web.js', '.js']
    }
};