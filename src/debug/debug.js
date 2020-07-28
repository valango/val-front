import debug from 'debug'

//  Todo: re-think the masking.
const _mask = process.env.DEBUG
let _enabled = _mask

const factory = (signature, yes) => {
  const func = yes === false ? () => undefined : debug(signature)
  if (yes === true) func.enabled = true
  return func
}

factory.debug = debug

Object.defineProperty(factory, 'enabled', {
  enumerable: true,
  get () {
    return _enabled
  },
  set (v) {
    _enabled = v
    if (!v) return debug.disable()
    _enabled = v === true ? _mask || '*' : v
    debug.enable(_enabled)
  }
})

export default factory
