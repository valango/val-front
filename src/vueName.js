//  See: https://github.com/vuejs/Discussion/issues/7

/**
 * Retrieve Vue component's name:
 * vm.name, vm.$options.name [, vm.$options._componentTag, m.$options.__file]
 *
 * @param {Object} vm
 * @param {boolean=} any -- to default to component tag or file name.
 * @returns {string | undefined}
 */
export default (vm, any = false) => {
  if (vm.$root === vm) return '#root#'

  const o = vm._isVue && vm.$options, name = vm.name || (o && o.name)

  if (name || !(any && o)) return name

  return o._componentTag || (o.__file && '@' + o.__file) || undefined
}
