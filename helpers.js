//  src/helpers.js -  helper functions for class and mix-in.
import assert from './assert'
import Debug from './debug'

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
export function ownInitialize (className = undefined) {
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
  this.$_Own_handlers = Object.create(null)
  /** @private */
  this.$_Own_ownName = this.ownClass + '#' + this.ownNumber
  /** @private */
  this.$_Own_debugOn = undefined

  Debug.checkProperties(this)
}

/**
 * Unregister event handler.
 * @param {string} event
 * @returns {this}
 */
export function ownOff (event) {
  const [handler, instance, method] = this.$_Own_handlers[event]
  instance[method](event, handler)
  delete this.$_Own_handlers[event]
  return this
}

export const guessEmitterAPI = (emitter) => {
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
export function ownOn (event, handler, emitter, methods = undefined) {
  assert(this.$_Own_handlers[event] === undefined, 'ownOn: DUP ' + event)
  const h = typeof handler === 'function' ? handler : this[handler]
  assert(h, `onOwn(${event}, ${handler}): no handler`)
  const f = (...args) => h.apply(this, args)
  const api = methods || guessEmitterAPI(emitter)
  assert(api, `onOwn('${event}'): unknown API`)
  emitter[api[0]](event, f)
  this.$_Own_handlers[event] = [f, emitter, api[1]]
  return this
}

/**
 * Method to be called before the instance is destroyed.
 */
export function dispose () {
  for (const key of Object.keys(this.own)) {
    const value = this.own[key]
    if (value && typeof value === 'object' &&
      typeof value.dispose === 'function') {
      value.dispose()
    }
    delete this.own[key]
  }

  for (const event of Object.keys(this.$_Own_handlers)) {
    this.ownOff(event)
  }
}
