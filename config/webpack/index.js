import path from 'path';
import webpack from 'webpack';
import rootDir from 'app-root-dir';
import nodeExternals from 'webpack-node-externals';
import { log } from '../utils';

import webpackPlugins from './plugins';

import params from '../../app';

const root_dir = rootDir.get();

export default (config = {}) => {
  log({
    title: 'Building Webpack Configuration',
    message: JSON.stringify(params, null, 2),
  });

  return {
    // target: 'node',

    devtool: process.env.NODE_ENV !== 'production' && 'source-map',

    entry: [path.resolve(root_dir, './src/index.js')],

    output: {
      path: path.resolve(root_dir, './dist'),
      filename: `${params.name}.js`,
      library: params.name,
      libraryTarget: params.webpack.libraryTarget,
      umdNamedDefine: true,
    },

    resolve: {
      modules: ['node_modules'],
    },

    plugins: webpackPlugins,

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: [path.resolve(root_dir, './src')],
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                plugins: params.babel.plugins,
                presets: params.babel.presets,
                env: params.babel.env,
              },
            },
          ],
        },
      ],
    },

    externals: [nodeExternals()],
  };
};
