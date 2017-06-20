import webpack from 'webpack'
import path from 'path'
import { exec, log } from '../utils'
import webpackConfigurationFactory from '../webpack'
import rootDir from 'app-root-dir'

/*
  Our Factory takes a config object and returns a webpack configuration
*/

const webpackConfig = webpackConfigurationFactory({})

const root_dir = rootDir.get()

const compiler = webpack(webpackConfig)

log({
  title: 'Starting Build',
  message: 'Starting Webpack Compiltation'
})

exec(`rimraf ${path.resolve(root_dir, 'dist')}`)

compiler.run((err, stats) => {
  if ( err ) {
    return log({
      title: 'Build Failed',
      message: err.message,
      level: 'error',
    })
  } else {
    log({
      title: 'Build Complete!',
      message: 'Webpack Build Completed!'
    })
    console.log(stats.toString({ colors: true }))
  }
})