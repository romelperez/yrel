import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.tuple([y.string(), y.number()])
  expect(processYrel(schema, ['a', 10])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['b', 20])).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, 'a', 10, [], ['a'], [10], {}, () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: false, errors: [['err_tuple']] })
  })
  // Same-length, non-valid values.
  expect(processYrel(schema, ['a', 'a'])).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: '0', isValid: true, errors: [], children: [] },
      { key: '1', isValid: false, errors: [['err_number']], children: [] }
    ]
  })
  expect(processYrel(schema, [10, 'a'])).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: '0', isValid: false, errors: [['err_string']], children: [] },
      { key: '1', isValid: false, errors: [['err_number']], children: [] }
    ]
  })
  // Rest values.
  expect(processYrel(schema, ['a', 10, 10])).toMatchObject({
    isValid: false,
    errors: [['err_tuple']],
    children: []
  })
  expect(processYrel(schema, ['a', 10, 'a'])).toMatchObject({
    isValid: false,
    errors: [['err_tuple']],
    children: []
  })
})

test('empty schemas', () => {
  ;[undefined, null, []].forEach((params) => {
    expect(() => {
      y.tuple(params as any)
    }).toThrowError('Data validator .tuple([...schemas]) requires at least one schema definition.')
  })
})

test('with rest', () => {
  const schema = y.tuple([y.literal('a'), y.literal('b')], y.number())
  expect(processYrel(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b', 10])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b', 10, 20, 30])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b', 'c'])).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: '0', isValid: true, errors: [] },
      { key: '1', isValid: true, errors: [] },
      { key: '2', isValid: false, errors: [['err_number']] }
    ]
  })
  expect(processYrel(schema, ['a', 'b', {}, () => {}])).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: '0', isValid: true, errors: [] },
      { key: '1', isValid: true, errors: [] },
      { key: '2', isValid: false, errors: [['err_number']] },
      { key: '3', isValid: false, errors: [['err_number']] }
    ]
  })
})

test('optional()', () => {
  const schema = y.tuple([y.string(), y.number()]).optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 10])).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.tuple([y.string(), y.number()]).nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 10])).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y
    .tuple([y.string(), y.number()])
    .validate((data) => data[0] === 'a' || [['err_custom', 'XYZ']])
  expect(processYrel(schema, ['a', 10])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['b', 20])).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'XYZ']]
  })
})

test('transform()', () => {
  const schema = y
    .tuple([y.number(), y.number()])
    .transform(([x, y]) => [x * 2, y * 2])
  expect(processYrel(schema, [1, 2])).toMatchObject({ isValid: true, data: [2, 4] })
  expect(processYrel(schema, [10, 20])).toMatchObject({ isValid: true, data: [20, 40] })
})
