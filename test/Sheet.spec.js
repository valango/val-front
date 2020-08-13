'use strict'
process.env.NODE_ENV = 'test'
/* eslint quotes: 0 */
const Sheet = require('../Sheet')

const opts = { block: 2, maxCWidth: 5, minWidth: 1 }
let sheet, lines

const dump = () => {
  for (const l of sheet) {
    lines.push(l)
  }
  return lines
}

const test0 = () => {
  expect(sheet.length).toBe(0)
  expect(sheet.columnWidths).toEqual([])
  expect(sheet.header).toBe(null)
  expect(dump()).toEqual([])
}

beforeEach(() => {
  lines = []
  sheet = new Sheet(opts)
})

it('initial', test0)

it('empty with header', () => {
  sheet = new Sheet()
  test0()
  sheet.header = ['a']
  expect(dump()).toEqual([], 'dump')
  expect(sheet.columnWidths).toEqual([])
})

it('should append', () => {
  expect(sheet.append([1, 2])).toBe(sheet)
  expect(dump()).toEqual(['1  2'])
  expect(sheet.columnWidths).toEqual([1, 1])
  sheet.header = ['A', 'BBBB']
  expect(sheet.columnWidths).toEqual([1, 4])
})

it('should truncate', () => {
  sheet.append(['1', '22', '666666']).append('special').append(['666666', undefined, '1'])
  expect(sheet.columnWidths).toEqual([5, 2, 5])
  expect(dump()[0]).toBe('1      22  6...6')
  expect(lines[1]).toBe('special')
  expect(lines[2]).toBe( '6...6          1')
  sheet.header = ['A', 'BBBB', 'C']
  expect(sheet.columnWidths).toEqual([5, 4, 5])
  lines = []
  expect(dump()[0]).toBe(
    '\nA      BBBB      C\n------+-----+-----\n1        22  6...6')
})
