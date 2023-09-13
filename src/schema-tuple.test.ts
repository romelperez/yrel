import { test, expect } from 'vitest'

import { v, processSchema } from './index'

test('initial', () => {
  const schema = v.tuple([v.string(), v.number()])
  expect(processSchema(schema, ['a', 10])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['b', 20])).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, 'a', 10, [], ['a'], [10], {}, () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: false, errors: [['err_tuple']] })
  })
  // Same-length, non-valid values.
  expect(processSchema(schema, ['a', 'a'])).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: '0', isValid: true, errors: [], children: [] },
      { key: '1', isValid: false, errors: [['err_number']], children: [] }
    ]
  })
  expect(processSchema(schema, [10, 'a'])).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: '0', isValid: false, errors: [['err_string']], children: [] },
      { key: '1', isValid: false, errors: [['err_number']], children: [] }
    ]
  })
  // Rest values.
  expect(processSchema(schema, ['a', 10, 10])).toMatchObject({
    isValid: false,
    errors: [['err_tuple']],
    children: []
  })
  expect(processSchema(schema, ['a', 10, 'a'])).toMatchObject({
    isValid: false,
    errors: [['err_tuple']],
    children: []
  })
})

test('empty schemas', () => {
  ;[undefined, null, []].forEach((params) => {
    expect(() => {
      v.tuple(params as any)
    }).toThrowError('Data validator .tuple([...schemas]) requires at least one schema definition.')
  })
})

test('with rest', () => {
  const schema = v.tuple([v.literal('a'), v.literal('b')], v.number())
  expect(processSchema(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b', 10])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b', 10, 20, 30])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b', 'c'])).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: '0', isValid: true, errors: [] },
      { key: '1', isValid: true, errors: [] },
      { key: '2', isValid: false, errors: [['err_number']] }
    ]
  })
  expect(processSchema(schema, ['a', 'b', {}, () => {}])).toMatchObject({
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
  const schema = v.tuple([v.string(), v.number()]).optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 10])).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.tuple([v.string(), v.number()]).nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 10])).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v
    .tuple([v.string(), v.number()])
    .validate((data) => data[0] === 'a' || [['err_custom', 'XYZ']])
  expect(processSchema(schema, ['a', 10])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['b', 20])).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'XYZ']]
  })
})
