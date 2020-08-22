'use strict'
process.env.NODE_ENV = 'test'

const { mount } = require('@vue/test-utils')
const mixin = require('../mixin')

const Comp = {
  mixins: [mixin]
}

test('should load', () => {
  const w = mount(Comp)
  console.log(w.vm)
  // expect(w.vm.ownName).toBe('joru')
})
