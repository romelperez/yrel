import { test, expect } from 'vitest'

import { v, processSchema } from './index'

test('initial', () => {
  const schema = v.union([v.string(), v.number()])
  expect(processSchema(schema, 'a')).toMatchObject({ isValid: true })
  expect(processSchema(schema, 10)).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, [], {}, () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: false, errors: [['err_union']] })
  })
})

test('empty schemas', () => {
  ;[undefined, null, []].forEach((params) => {
    expect(() => {
      v.union(params as any)
    }).toThrowError('Data validator .union([...schemas]) requires at least one schema definition.')
  })
})

test('custom configuration', () => {
  const schema = v.union([v.number(), v.string()], { errors: [['err_custom', 'xyz', 10]] })
  expect(processSchema(schema, 10)).toMatchObject({ isValid: true })
  expect(processSchema(schema, true)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xyz', 10]]
  })
})

test('optional()', () => {
  const schema = v.union([v.string(), v.number()]).optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 'a')).toMatchObject({ isValid: true })
  expect(processSchema(schema, 10)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.union([v.string(), v.number()]).nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 'a')).toMatchObject({ isValid: true })
  expect(processSchema(schema, 10)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v
    .union([v.string(), v.number()])
    .validate((data) => data === 'a' || [['err_custom', 'XYZ']])
  expect(processSchema(schema, 'a')).toMatchObject({ isValid: true })
  expect(processSchema(schema, 10)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'XYZ']]
  })
})
