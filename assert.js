'use strict'

const env = process.env.NODE_ENV

let cb

exports = module.exports = (...args) => {
  if (args[0]) return
  if (cb) cb(args)
  if (env === 'production') throw new Error('AssertionError')
  // eslint-disable-next-line
  console.assert(...args)
}

exports.callback = (fn) => {
  if (fn && typeof fn !== 'function') throw new Error('assert: illegal callback')
  cb = fn
  return exports
}
