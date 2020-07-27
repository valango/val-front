'use strict'
process.env.NODE_ENV = 'test'

const { expect } = require('chai')
const _ = require('lodash')
const load = require('./load')

let data

const cb = (...args) => (data = args)

describe('assert', () => {
  describe('normal mode', () => {
    let assert

    before(() => (assert = load('assert').default))

    it('should succeed', () => {
      expect(assert.callback()).to.equal(assert, 'callback()')
      expect(assert(0, 'baa')).to.equal(undefined)
    })

    it('should fire callback', () => {
      expect(() => assert.callback(3)).to.throw('illegal')
      assert.callback(cb)(0, 'a')
      expect(data).to.eql([0, 'a'], 'fail')
      data = undefined
      assert(1, 'B')
      expect(data).to.equal(undefined, 'success')
      assert.callback()(0)
      expect(data).to.equal(undefined, 'nothing')
    })
  })

  describe('production mode', () => {
    let assert

    before(() => (assert = load('assert', 'production').default))

    it('should succeed', () => {
      expect(assert.callback(cb)).to.equal(assert, 'callback()')
      expect(assert(1, 'baa')).to.equal(undefined)
    })

    it('should throw', () => {
      expect(assert.callback(cb)).to.equal(assert, 'callback()')
      expect(() => assert(0, 'YES')).to.throw('YES')
      expect(() => assert()).to.throw('Assertion failed')
    })
  })
})
