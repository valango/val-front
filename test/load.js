/**
 * test/load.js
 * @version 1.1.0
 *
 * Flush the require cache, then (re)load the test target.
 */
'use strict'

const { join } = require('path')

module.exports = (targetName = undefined, env = 'test') => {
  const names = 'assert debug/index debug/debug index helpers mixin performance Own'.split(' ')
  const src = process.cwd()

  if (targetName) names.push(targetName)

  names.forEach((name) => {
    delete require.cache[join(src, name + '.js')]
  })
  if (targetName) {
    process.env.NODE_ENV = env
    return require(join(src, targetName))
  }
}
