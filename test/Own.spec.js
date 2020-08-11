'use strict'
process.env.NODE_ENV = 'test'

const { expect } = require('chai')
const _ = require('lodash')
const Own = require('../Own')

let on = [], off = [], a

const em1 = {
  '$on': (ev, fn) => on.push({ ev, fn }),
  '$off': (ev, fn) => off.push({ ev, fn })
}

class A extends Own {
  constructor (name = undefined) {
    super(name)
    this.count = 0
  }

  handler () {
    ++this.count
  }
}

describe('Own', () => {
  it('should construct', () => {
    expect(new A('Aa').ownName).to.equal('Aa#1')
    expect((a = new A()).ownName).to.equal('A#2')
    expect(a.debugOn).to.equal(undefined)
    expect(a.debug('a')).to.equal(undefined)
    a.own.child = new A()
    a.own.num = 22
  })

  it('should register', () => {
    const fn = () => 0
    a.ownOn('ev1', 'handler', em1).ownOn('ev1', fn, em1).ownOn('ev2', fn, em1)
    expect(on[0].ev).to.eql('ev1')
    expect(on[0].fn).to.not.eql(fn)
    expect(on[1].ev).to.eql('ev1')
    expect(on[1].fn).to.eql(fn)
    expect(on[2].ev).to.eql('ev2')
    expect(on[2].fn).to.eql(fn)
    on[0].fn()
    expect(a.count).to.eql(1)
  })

  it('should ignore unfit un-register', () => {
    a.ownOff('evz').ownOff('ev1', a)
    expect(off.length).to.eql(0)
  })

  it('should un-register selectively', () => {
    a.ownOff('ev2', em1)
    expect(off.length).to.eql(1)
    off = []
  })

  it('should re-generate debug method', () => {
    let f = a.debug
    a.debugOn = false
    expect(a.debug).to.not.equal(f)
    f = a.debug
    a.ownName = 'other'
    expect(a.ownName).to.equal('other')
    expect(a.debug).to.not.equal(f)
  })

  it('should dispose', () => {
    a.dispose()
    expect(Object.keys(a.own).length).to.equal(0)
    expect(off.length).to.equal(2)
  })
})
