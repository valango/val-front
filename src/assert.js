/**
 * src/lib/assert.js
 * @version 1.0.2
 */

let cb

const assert = process.env.NODE_ENV !== 'production'
  ? (...args) => {
    if (!args[0]) {
      // eslint-disable-next-line
      if (process.env.NODE_ENV !== 'test') console.assert(...args)
      // eslint-disable-next-line
      if (cb) cb(...args)
    }
  }
  : (cond, text) => {
    if (!cond) throw new Error(text || 'Assertion failed')
  }

assert.callback = (fn) => {
  if (fn && typeof fn !== 'function') throw new Error('assert: illegal callback')
  cb = fn
  return assert
}

export default assert
