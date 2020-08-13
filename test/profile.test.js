'use strict'
process.env.NODE_ENV = 'test'

const { profBegin, profDepth, profEnd, profOn, profReset, profResults, profSetup, profTexts } = require(
  '../profile')

const delay = (t) => new Promise(resolve => {
  setTimeout(resolve, t)
})

const tests = () => {
  it('should handle main case', async () => {
    expect(Object.keys(profSetup())).toEqual(['getTime', 'timeScale'])
    expect(profOn()).toBe(true)
    profEnd(true)     //  Should not throw.
    expect(profOn(true)).toBe(true)
    expect(profBegin('a') && profBegin('b')).toBe(2)
    expect(profEnd('b') && profBegin('b')).toBe(2)
    await delay(10)
    profEnd('b')
    await delay(5)
    profEnd('a')
    expect(profDepth()).toBe(0)
    expect(profTexts().length).toBe(2)
    // console.log(profTexts())
  })

  it('should reset', () => {
    profReset(/^a/)
    expect(profResults('count').length).toBe(1)
    profReset()
    expect(profResults().length).toBe(0)
  })

  it('should switch off', () => {
    expect(profOn(false)).toBe(true)
    expect(profBegin('a') && profBegin('a') && profBegin('b')).toBe(true)
    expect(profEnd('a')).toBe(true)
    expect(profResults().length).toBe(0)
    expect(profOn(true)).toBe(false)
  })

  it('should throw on errors', () => {
    expect(() => profBegin([])).toThrow('invalid tag')
    expect(() => profBegin()).toThrow('invalid tag')
    profBegin('a')
    expect(() => profOn(false)).toThrow('pending')
  })

  it('should handle leaks', () => {
    profReset()
    profBegin('a') && profBegin('b') && profBegin('c')
    profEnd('a')
    expect(profResults()[0].leaks().count).toBe(2)
    expect(profTexts().length).toBe(1)
    // profTexts().forEach(r => console.log(r))
    profReset()   //  Here to clear measures.
  })

  it('should handle total leak', () => {
    profReset()
    profBegin('a') && profBegin('b') && profBegin('c')
    profEnd(true)
    expect(profResults()[0].leaks().count).toBe(3)
    expect(profTexts().length).toBe(1)
    // profTexts().forEach(r => console.log(r))
    profReset()   //  Here to clear measures.
  })
}

describe('back-end mode', tests)

describe('front-end mode', () => {
  beforeAll(() => profSetup({ getTime: Date.now }))

  tests()
})
