var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = require('yargs').argv.mode;
var libraryName = 'redux-saga-process'
var plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {

  entry: path.resolve(__dirname, './src/main.js'),

  target: 'async-node',

  devtool: 'source-map',

  output: {
    path: './dist',
    filename: 'redux-saga-process.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  resolve: {
    modules: [
      'node_modules',
      'src/lib'
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, './src')
        ],
        exclude: /node_modules/,
        options: {
          presets: [["es2015", { "modules": false }]],
          plugins: ['transform-runtime', 'transform-class-properties']
        }
      }
    ]
  },
  
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: '_'
    },
    'redux-saga/effects': {
      commonjs: 'redux-saga/effects',
      commonjs2: 'redux-saga/effects',
      amd: 'redux-saga/effects',
      root: '_'
    },
    'redux-saga': {
      commonjs: 'redux-saga',
      commonjs2: 'redux-saga',
      amd: 'redux-saga',
      root: '_'
    },
    'reselect': {
      commonjs: 'reselect',
      commonjs2: 'reselect',
      amd: 'reselect',
      root: '_'
    },
    'redux': {
      commonjs: 'redux',
      commonjs2: 'redux',
      amd: 'redux',
      root: '_'
    }
  }
  
}