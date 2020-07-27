//  lib/debug/index.js
//  @version 1.2.0
//  NB: this file is meant to be used via require(), not import.
'use strict'

let api

if (process.env.NODE_ENV !== 'production') {
  api = require('./debug')
} else {
  //  eslint-disable-next-line
  const debug = (...p) => undefined
  //  eslint-disable-next-line
  api = (...p) => debug
}

api.factory = api

module.exports = api
