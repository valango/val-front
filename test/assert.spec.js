'use strict'
let data

const cb = (args) => (data = args)
const load = env => ((process.env.NODE_ENV = env) && require('../assert'))

describe('default mode', () => {
  let assert

  beforeAll(() => (assert = load('test')))

  it('should succeed', () => {
    expect(assert.callback()).toBe(assert)
    expect(assert(23, 'baa')).toBe(23)
  })

  it('should fire callback', () => {
    expect(() => assert.callback(3)).toThrow('illegal')
    expect(() => assert.callback(cb)(0, 'a')).toThrow('AssertionError')
    expect(data).toEqual([0, 'a'])
    data = undefined
    assert(1, 'B')
    expect(data).toBe(undefined)
    expect(() => assert.callback()(0, 55)).toThrow('AssertionError')
    expect(data).toBe(undefined)
  })
})

describe('production mode', () => {
  let assert

  beforeAll(() => (assert = load('production')))

  it('should succeed', () => {
    expect(assert.callback(cb)).toBe(assert)
    expect(assert(11, 'baa')).toBe(11)
  })

  it('should throw', () => {
    expect(assert.callback(cb)).toBe(assert)
    expect(() => assert()).toThrow('AssertionError')
  })
})
