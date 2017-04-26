var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//var env = require('yargs').argv.mode;
var libraryName = 'redux-saga-process'
var plugins = [], outputFile;
const BabiliPlugin = require('babili-webpack-plugin');
const NodeExternals = require('webpack-node-externals');

if (process.env.NODE_ENV === 'production') {
  // plugins.push(new webpack.optimize.UglifyJsPlugin({
  //   sourceMap: false,
  //   compress: {
  //     screw_ie8: true,
  //     warnings: false,
  //   },
  //   mangle: {
  //     screw_ie8: true,
  //   },
  //   output: {
  //     comments: false,
  //     screw_ie8: true,
  //   },
  // }));
  outputFile = libraryName + '.min.js';
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
  }))
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': process.env.NODE_ENV
  }))
} else {
  outputFile = libraryName + '.js';
}

module.exports = {

  entry: [
    path.resolve(__dirname, './src/statics.js'),
    path.resolve(__dirname, './src/main.js')
  ],

  target: 'async-node',

  devtool: process.env.NODE_ENV !== 'production' && 'source-map',

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'redux-saga-process.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  resolve: {
    modules: [
      'node_modules'
    ],
  },
  
  plugins: plugins,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: [
            path.resolve(__dirname, './src')
          ],
        use: [ {
          loader: 'babel-loader',
          
          options: {
            // plugins: ['transform-runtime', 'transform-class-properties'],
            presets: [
              ['env', {
                modules: false,
                targets: {
                  browsers: ['last 2 Chrome versions'],
                  node: 'current'
                }
              }],
            ],
            env: {
              production: {
                presets: [ 'babili' ]
              }
            }
          }
        } ]
        
        
      }
    ]
  },
  
  externals: [ NodeExternals() ]
  
}