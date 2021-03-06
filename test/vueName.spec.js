'use strict'
const vueName = require('../vueName')
const { mount } = require('@vue/test-utils')
const Vue = require('vue')

const Comp = {template: '<p></p>'}

test('explicit name', () => {
  const vm = new Vue({ ...Comp, name: 'name1' })
  expect(vueName(vm)).toBe('name1')
})

test('root', () => {
  const vm = new Vue(Comp)
  expect(vueName(vm)).toBe('#root#')
})

test('deep search', () => {
  const { vm } = mount(Comp)
  expect(vueName(vm, true)).toBe(undefined)
})
