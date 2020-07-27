//  lib/format

/**
 * Super-simple print function.
 *
 * @param fmt
 * @param args
 * @returns {*}
 */
export default (fmt, ...args) => {
  const n = args.length - 1
  let i = -1

  let res = fmt.replace(/%[difso]/g, (m) => i < n ? args[++i] : m)

  while (i < n) res += ' ' + args[++i]

  return res
}
