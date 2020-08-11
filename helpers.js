//  src/helpers.js -  helper functions for class and mix-in.
'use strict'
const assert = require('./assert')
const Debug = require('./debug')

let seed = 0

const defProp = (self, name) => {
  const key = '$_Own_' + name
  Object.defineProperty(self, name, {
    enumerable: true,
    get: () => self[key],
    set: (v) => {
      self[key] = v
      Debug.checkProperties(self)
    }
  })
}

/**
 * Initialize the machinery.
 * @param {string=} className for cases when
 */
function ownInitialize (className = undefined) {
  /** @type {function(...)}   - will be mutated via debugOn and ownName. */
  this.debug = () => undefined
  /** @type {boolean} debugOn - controls if debug output is enabled. */
  defProp(this, 'debugOn')
  /** @type {string} ownName - mutating this property affects debug output. */
  defProp(this, 'ownName')
  /** @type {Object} own - a keyed collection of subordinate object instances */
  this.own = Object.create(null)
  /** @type {string} ownClass - class instance or Vue.js component name. */
  this.ownClass = className || (this.constructor ? this.constructor.name : 'object')
  /** @type {number} ownNumber is an unique numeric instance id. */
  this.ownNumber = ++seed
  /** @private */
  this.$_Own_handlers = []
  /** @private */
  this.$_Own_ownName = this.ownClass + '#' + this.ownNumber
  /** @private */
  this.$_Own_debugOn = undefined

  Debug.checkProperties(this)
}

/**
 * Unregister event handler.
 * @param {string} event
 * @param {Object=} emitter
 * @returns {this}
 */
function ownOff (event, emitter = undefined) {
  const array = this.$_Own_handlers

  for (let i = array.length; --i >= 0;) {
    const [ev, em, fn, off] = array[i]
    if ((event && ev !== event) || (emitter && em !== emitter)) continue
    em[off](ev, fn)
    array.splice(i, 1)
  }
  return this
}

const guessEmitterAPI = (emitter) => {
  for (const [a, b] of [['addEventListener', 'removeEventListener'], ['$on', '$off']]) {
    if (typeof emitter[a] === 'function' && typeof emitter[b] === 'function') {
      return [a, b]
    }
  }
}

/**
 * Register event handler.
 * @param {string} event
 * @param {string|function} handler or instance method name.
 * @param {Object} emitter
 * @param {[string, string] | undefined} emitter API method names.
 * @returns {this}
 */
function ownOn (event, handler, emitter, methods = undefined) {
  const api = methods || guessEmitterAPI(emitter)
  let fn = handler, hn

  if (typeof fn !== 'function') {
    assert(typeof (hn = this[fn]) === 'function', `ownOn('%s', '%s') - not a function`)
    fn = (...args) => hn.apply(this, args)
  }
  assert(api, `onOwn('${event}'): unknown API`)
  emitter[api[0]](event, fn)
  this.$_Own_handlers.push([event, emitter, fn, api[1]])
  return this
}

/**
 * Method to be called before the instance is destroyed.
 */
function dispose () {
  for (const key of Object.keys(this.own)) {
    const value = this.own[key]
    if (value && typeof value === 'object' &&
      typeof value.dispose === 'function') {
      value.dispose()
    }
    delete this.own[key]
  }

  this.ownOff(undefined, undefined)
}

module.exports = { dispose, ownInitialize, ownOff, ownOn }
