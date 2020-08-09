import debug from 'debug'

//  Todo: re-think the masking.
const _mask = process.env.DEBUG
let _enabled = _mask

const factory = (signature, yes) => {
  const func = yes === false ? () => undefined : factory.debug(signature)
  if (yes === true) func.enabled = true
  return func
}

//  You may change this property, e.g. for testing.
factory.debug = debug

Object.defineProperty(factory, 'enabled', {
  enumerable: true,
  get () {
    return _enabled
  },
  set (v) {
    _enabled = v
    if (!v) return factory.debug.disable()
    _enabled = v === true ? _mask || '*' : v
    factory.debug.enable(_enabled)
  }
})

//  Used by src/helpers#ownInitialize()
factory.checkProperties = (self) => {
  const debug = factory(self.$_Own_ownName, self.$_Own_debugOn)
  self.debug = (...args) => {
    debug.apply(undefined, args)
  }
}

export default factory
