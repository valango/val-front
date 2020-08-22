'use strict'
const { mount } = require('@vue/test-utils')
const mixin = require('../mixin')

let disposed, wrapper

const Comp = {
  mixins: [mixin],
  template: '<div></div>',
  methods: { dispose: () => (disposed = true) }
}

test('should name', () => {
  wrapper = mount(Comp)
  expect(wrapper.vm.ownName).toBe('VueComponent#1')
})

test('should dispose', () => {
  expect(disposed).toBe(undefined)
  wrapper.destroy()
  expect(disposed).toBe(true)
})
