'use strict'
process.env.NODE_ENV = 'test'

const load = require('./load')

let data

const cb = (args) => (data = args)

describe('assert', () => {
  describe('normal mode', () => {
    let assert

    beforeAll(() => (assert = load('assert')))

    it('should succeed', () => {
      expect(assert.callback()).toBe(assert, 'callback()')
      expect(assert(23, 'baa')).toBe(23)
    })

    it('should fire callback', () => {
      expect(() => assert.callback(3)).toThrow('illegal')
      expect(() => assert.callback(cb)(0, 'a')).toThrow('AssertionError')
      expect(data).toEqual([0, 'a'], 'fail')
      data = undefined
      assert(1, 'B')
      expect(data).toBe(undefined, 'success')
      expect(() => assert.callback()(0, 55)).toThrow('AssertionError')
      expect(data).toBe(undefined, 'nothing')
    })
  })

  describe('production mode', () => {
    let assert

    beforeAll(() => (assert = load('assert', 'production')))

    it('should succeed', () => {
      expect(assert.callback(cb)).toBe(assert, 'callback()')
      expect(assert(11, 'baa')).toBe(11)
    })

    it('should throw', () => {
      expect(assert.callback(cb)).toBe(assert, 'callback()')
      expect(() => assert()).toThrow('AssertionError')
    })
  })
})
