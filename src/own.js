import assert from './assert'
import Debug from './debug'

let seed = 0

/**
 * Initialize the machinery.
 * @param {string=} className for cases when
 */
export function ownInitialize (className) {
  this.$own = Object.create(null)
  this.$_Own_handlers = Object.create(null)
  this.ownClass = className || (this.constructor ? this.constructor.name : 'Object-')
  this.ownId = ++seed
  this.ownName = this.ownClass + '#' + seed
  this.debugOn = true
  const debug = Debug(this.ownName, true)
  this.debug = (...args) => {
    if (!this.debugOn) return
    debug.apply(undefined, args)
  }
}

/**
 * Unregister event handler.
 * @param {string} event
 * @param {string=} method for turning events off.
 */
export function ownOff (event, method = '$off') {
  const [handler, instance] = this.$_Own_handlers[event]
  instance[method](event, handler)
  delete this.$_Own_handlers[event]
}

/**
 * Register event handler.
 * @param {string} event
 * @param {string|function} handler or instance method name.
 * @param {Object} emitter
 * @param {string=} method for turning events on.
 */
export function ownOn (event, handler, emitter, method = '$on') {
  assert(this.$_Own_handlers[event] === undefined, 'ownOn: DUP ' + event)
  const h = typeof handler === 'function' ? handler : this[handler]
  assert(h, `onOwn(${event}, ${handler}): no handler`)
  const f = (...args) => h.apply(this, args)
  emitter[method](event, f)
  this.$_Own_handlers[event] = [f, emitter]
}

/**
 * Method to be called before the instance is destroyed.
 */
export function dispose () {
  for (const key of Object.keys(this.$own)) {
    const value = this.$own[key]
    if (value && typeof value === 'object' &&
      typeof value.dispose === 'function') {
      value.dispose()
    }
    delete this.$own[key]
  }

  for (const event of Object.keys(this.$_Own_handlers)) {
    this.ownOff(event)
  }
}

/**
 * @param {string=} className
 * @constructor
 */
export function Own (className) {
  this.ownInitialize(className)
}

Own.prototype.debug = () => undefined
Own.prototype.dispose = dispose
Own.prototype.ownInitialize = ownInitialize
Own.prototype.ownOn = ownOn
Own.prototype.ownOff = ownOff
