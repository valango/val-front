//  A simple wrapper for Windows User Timing API.
'use strict'

const p = window.performance || {}

if (process.env.NODE_ENV !== 'production' && p.mark !== undefined && p.measure !== undefined) {
  module.exports = require('./performance')
} else {
  const noop = () => []
  module.exports = { perfB: noop, perfE: noop, perfDump: noop, perfGet: noop, perfReset: noop }
}
