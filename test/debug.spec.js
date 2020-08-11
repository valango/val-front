'use strict'
const load = require('./load')

const { expect } = require('chai')

let target

let debug, enabled, nope, out

const print = (...args) => out.push([enabled, ...args])
const init = env => {
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
    before(() => init('development'))
    it('should output', () => {
      debug('x')
      expect(out[0]).to.eql([undefined, 'TEST', 'x'])
      expect(target.enabled).to.equal(undefined)
    })

    it('should set enabled property', () => {
      out = []
      target.enabled = true
      expect(target.enabled).to.equal('*')
      nope('nope')
      debug('x')
      expect(out[0]).to.eql(['*', 'TEST', 'x'])
      target.enabled = false
      expect(target.enabled).to.equal(false)
      debug('x')
      expect(out[1]).to.eql([undefined, 'TEST', 'x'])
    })
  })

  describe('production', () => {
    before(() => init('production'))
    it('should do nothing', () => {
      const debug = target('TEST', true)
      expect(target.enabled).to.eql(undefined)
      debug('uraa')
      expect(out).to.eql([])
      expect(target.enabled).to.equal(undefined)
    })
  })
})
