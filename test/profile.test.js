'use strict'
process.env.NODE_ENV = 'test'

const { timBegin, timDepth, timEnd, timOn, timReset, timResults, timSetup, timTexts } = require(
  '../profile')

const delay = (t) => new Promise(resolve => {
  setTimeout(resolve, t)
})

const tests = () => {
  it('should handle main case', async () => {
    expect(Object.keys(timSetup())).toEqual(['getTime', 'timeScale'])
    expect(timOn()).toBe(true)
    expect(timOn(true)).toBe(true)
    expect(timBegin('a') && timBegin('b')).toBe(2)
    expect(timEnd('b') && timBegin('b')).toBe(2)
    await delay(10)
    timEnd('b')
    await delay(5)
    timEnd('a')
    expect(timDepth()).toBe(0)
    expect(timTexts().length).toBe(2)
    // console.log(timTexts())
  })

  it('should reset', () => {
    timReset(/^a/)
    expect(timResults('count').length).toBe(1)
    timReset()
    expect(timResults().length).toBe(0)
  })

  it('should switch off', () => {
    expect(timOn(false)).toBe(true)
    expect(timBegin('a') && timBegin('a') && timBegin('b')).toBe(true)
    expect(timEnd('a')).toBe(true)
    expect(timResults().length).toBe(0)
    expect(timOn(true)).toBe(false)
  })

  it('should throw on errors', () => {
    expect(() => timBegin([])).toThrow('invalid tag')
    expect(() => timBegin()).toThrow('invalid tag')
    timBegin('a')
    expect(() => timOn(false)).toThrow('pending')
  })

  it('should be clever', () => {
    timReset()
    timBegin('a') && timBegin('b') && timBegin('c')
    timEnd('a')
    expect(timResults()[0].leaks().count).toBe(2)
    expect(timTexts().length).toBe(1)
    // timTexts().forEach(r => console.log(r))
    timReset()
  })
}

describe('back-end mode', tests)

describe('front-end mode', () => {
  beforeAll(() => timSetup({ getTime: Date.now }))

  tests()
})
