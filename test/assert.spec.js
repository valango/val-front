'use strict'
process.env.NODE_ENV = 'test'

const { expect } = require('chai')
const _ = require('lodash')
const load = require('./load')

let data

const cb = (args) => (data = args)

describe('assert', () => {
  describe('normal mode', () => {
    let assert

    before(() => (assert = load('assert')))

    it('should succeed', () => {
      expect(assert.callback()).to.equal(assert, 'callback()')
      expect(assert(23, 'baa')).to.equal(23)
    })

    it('should fire callback', () => {
      expect(() => assert.callback(3)).to.throw('illegal')
      expect(() => assert.callback(cb)(0, 'a')).to.throw('AssertionError')
      expect(data).to.eql([0, 'a'], 'fail')
      data = undefined
      assert(1, 'B')
      expect(data).to.equal(undefined, 'success')
      expect(() => assert.callback()(0, 55)).to.throw('AssertionError')
      expect(data).to.equal(undefined, 'nothing')
    })
  })

  describe('production mode', () => {
    let assert

    before(() => (assert = load('assert', 'production')))

    it('should succeed', () => {
      expect(assert.callback(cb)).to.equal(assert, 'callback()')
      expect(assert(11, 'baa')).to.equal(11)
    })

    it('should throw', () => {
      expect(assert.callback(cb)).to.equal(assert, 'callback()')
      expect(() => assert()).to.throw('AssertionError')
    })
  })
})
