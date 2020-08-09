'use strict'

let api

if (process.env.NODE_ENV !== 'production') {
  api = require('./debug')
} else {
  //  eslint-disable-next-line
  const noop = (...p) => undefined
  //  eslint-disable-next-line
  api = (...p) => noop
  api.checkProperties = noop
}

module.exports = api
