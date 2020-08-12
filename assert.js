'use strict'
let cb, inDev = process.env.NODE_ENV

inDev = inDev !== 'production' && inDev !== 'test'

exports = module.exports = (...args) => {
  if (args[0]) return args[0]
  if (cb) cb(args)
  // eslint-disable-next-line
  if (inDev) console.assert(...args)
  throw new Error('AssertionError')
}

exports.callback = (fn) => {
  if (fn && typeof fn !== 'function') throw new Error('assert: illegal callback')
  cb = fn
  return exports
}
