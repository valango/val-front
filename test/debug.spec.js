'use strict'
process.env.NODE_ENV = 'development'
// import P from '../src'
import { debug as target } from '../src'

const { expect } = require('chai')
const _ = require('lodash')
// const target = p.debug
// const target = require('../src').debug

describe('index', () => {
  it('should ?', () => {
    const debug = target('TEST', true)
    debug('uraa')
  })
})
