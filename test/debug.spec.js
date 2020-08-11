'use strict'
const load = require('./load')

let target

let debug, enabled, nope, out

const print = (...args) => out.push([enabled, ...args])
const init = env => {
  jest.resetModules()
  target = load('debug', env)
  out = []
  enabled = undefined
  target.debug = signature => print.bind(0, signature)
  target.debug.enable = v => (enabled = v)
  target.debug.disable = () => (enabled = undefined)
  debug = target('TEST', true)
  nope = target('TUST', false)
}


describe('debug', () => {
  describe('development', () => {
    beforeAll(() => init('development'))
    it('should output', () => {
      debug('x')
      expect(out[0]).toEqual([undefined, 'TEST', 'x'])
      expect(target.enabled).toBe(undefined)
    })

    it('should set enabled property', () => {
      out = []
      target.enabled = true
      expect(target.enabled).toBe('*')
      nope('nope')
      debug('x')
      expect(out[0]).toEqual(['*', 'TEST', 'x'])
      target.enabled = false
      expect(target.enabled).toBe(false)
      debug('x')
      expect(out[1]).toEqual([undefined, 'TEST', 'x'])
    })
  })

  describe('production', () => {
    beforeAll(() => init('production'))
    it('should do nothing', () => {
      // console.log(Object.keys(require.cache))
      const debug = target('TEST', true)
      expect(target.enabled).toBe(undefined)
      debug('uraa')
      expect(out).toEqual([])
      expect(target.enabled).toBe(undefined)
    })
  })
})
