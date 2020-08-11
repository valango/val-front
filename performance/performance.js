'use strict'
const perf = window.performance || {}
const round = Math.round

//  Set begin mark.
const perfB = (name) => {
  perf.mark(name + '-beg')
}

//  Set end mark. Will fail, if perfB was not called with that key.
const perfE = (name) => {
  const n = name + '-end'
  try {
    perf.mark(n)
    perf.measure(name, name + '-beg', n)
  } catch (e) {
    /*  eslint-disable-next-line */
    console.error(e.message + `@perfE(${name})`)
    throw e
  }
}

//  Get sorted array of measurement results {avg, count, duration, max, name}.
const perfGet = (sortBy = 'total') => {
  const dict = {}, measures = perf.getEntriesByType('measure')

  measures.forEach(({ duration, name }) => {
    let d = dict[name] || (dict[name] = { total: 0, max: 0, count: 0 })
    d.total += duration
    if (duration > d.max) d.max = duration
    d.count += 1
  })

  const list = Object.keys(dict).map(name=>{
    const d = dict[name]
    return { avg: d.total / d.count, name, ...d }
  })

  return list.sort((a, b) => (b[sortBy] - a[sortBy]))
}

//  Get sorted array of measurement texts.
const perfDump = (sortBy = 'total') => {
  return perfGet(sortBy).map(({ name, max, count, avg, total }) =>
    `${name}: T=${total}, N=${count}, Max=${max}, Avg=` + round(avg))
}

//  Reset performance measurements data.
const perfReset = () => {
  perf.clearMarks()
  perf.clearMeasures()
}

module.exports = { perfB, perfE, perfDump, perfGet, perfReset }
