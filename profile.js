/**
 * @module Dir/profile
 * @version 1.0.0
 */
'use strict'
/* global BigInt: false */

const assert = (cond, msg) => {
  if (!cond) throw new Error('prof' + msg)
}

let getTime, timeScale, T0

let isEnabled = process.env.NODE_ENV !== 'production', measures = [], pending = []

function Measure (tag) {
  this.entries = []
  this.tag = tag
}

Measure.prototype.add = function (time, path) {
  this.entries.push(path ? [time, path.join('>')] : [time])
  return this
}

/** @returns {number} */
Measure.prototype.count = function () {
  return this.entries.length
}

/** @returns {Object} */
Measure.prototype.leaks = function () {
  const dict = {}
  let count = 0

  this.entries.forEach(([, leaked]) => {
    if (leaked) (dict[leaked] = (dict[leaked] || 0) + 1) && ++count
  })
  return { ...dict, count }
}

/** @returns {BigInt|number} */
Measure.prototype.total = function () {
  return this.entries.reduce((a, r) => a + r[0], T0) / timeScale
}

/** @returns {Measure} */
const newMeasure = (tag) => {
  const r = new Measure(tag)
  measures.push(r)
  return r
}

let foundIndex

const findByTag = (tag, array) => array.find((r, i) => r.tag === tag && ((foundIndex = i) || true))

const getPathTo = (j) => {
  return pending.slice(0, j + 1).map(({ tag }) => tag)
}

const profBegin = (tag) => {
  if (!isEnabled) return true
  assert(tag && typeof tag === 'string' && tag.indexOf('>') < 0, 'Begin(): invalid tag')
  const r = findByTag(tag, pending)
  assert(!r, 'Begin(' + tag + '): tag is still open')
  return pending.push({ tag, t0: getTime() })
}

const profEnd = (tag) => {
  if (isEnabled) {
    const i = pending.length - 1, t1 = getTime()
    let j = 0, r = pending[0]
    assert(i >= 0, 'End(' + tag + '): nothing to end')

    if (tag !== true) r = findByTag(tag, pending), j = foundIndex
    assert(r, 'End(' + tag + '): no such entry')
    //  If we weren't at the last entry, then terminate those, too.
    for (let i = pending.length; --i >= j;) {
      const path = (tag === true || i > j) && getPathTo(i)
      const { t0 } = pending.pop()
      const measure = findByTag(tag, measures) || newMeasure(tag)
      measure.add(t1 - t0, path)
    }
  }
  return true
}

const profReset = (rx = undefined) => {
  if (isEnabled) {
    if (rx) {
      for (let i = measures.length; --i >= 0;) {
        if (rx.test(measures[i].tag)) measures.splice(i, 1)
      }
    } else {
      measures = []
    }
    pending = []
  }
  return true
}

const profDepth = () => pending.length

const profResults = (sortBy = 'total') => {
  if (!isEnabled) return []
  return measures.slice().sort((a, b) => {
    const v = b[sortBy]() - a[sortBy]()
    if (v === 0n || v === 0) return 0
    return v > 0n ? 1 : -1
  })
}

const profSetup = (options = undefined) => {
  const old = { getTime, timeScale }

  if (options) {
    assert(pending.length === 0 && measures.length === 0, 'Setup() while operating')
    if (options.getTime) getTime = options.getTime
    const big = typeof getTime() !== 'number'
    timeScale = options.timeScale || (big ? BigInt(1e3) : 1)
    T0 = big ? 0n : 0
  }
  return old
}

const profTexts = (sortBy = 'total') => {
  return profResults(sortBy).map((r) => {
    let l = r.leaks(), str = r.tag + ': T=' + r.total() + ' N=' + r.count()

    if (l.count) {
      delete l.count
      str += Object.keys(l).map(k => '\n  LEAK: ' + k + ': ' + l[k]).join('')
    }
    return str
  })
}

const profOn = (yes = undefined) => {
  const old = isEnabled
  if (yes !== undefined) {
    assert(yes || !pending.length, 'On(false) with pending measures')
    isEnabled = yes
  }
  return old
}

profSetup({
  getTime: (process && process.hrtime && process.hrtime.bigint) || Date.now
})

let fnSeed = 0

const profWrap = (fn, name) => {
  if (!isEnabled) return fn

  const n = name || fn.name || ('fn#' + (++fnSeed))

  return (...args) => {
    let res
    profBeg(n)
    try {
      res = fn.apply(this, args)
    } catch (e) {
      profEnd(n)
      throw e
    }
    profEnd(n)
    return res
  }
}

exports = module.exports = {
  profBegin,
  profDepth,
  profEnd,
  profOn,
  profReset,
  profResults,
  profSetup,
  profTexts,
  profWrap
}
