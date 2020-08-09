/**
 * test/load.js
 * @version 1.1.0
 *
 * Flush the require cache, then (re)load the test target.
 */
'use strict'

const { join } = require('path')

module.exports = (targetName = undefined, env = 'test') => {
  const names = 'dictionary index magic settings translator'.split(' ')
  const src = process.cwd()

  if (targetName) names.push(targetName)

  names.forEach((name) => {
    const path = join(src, name + '.js')
    delete require.cache[path]
  })
  if (targetName) {
    process.env.NODE_ENV = env
    return require(join(src, targetName + '.js'))
  }
}
