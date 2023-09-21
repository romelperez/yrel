import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.union([y.string(), y.number()])
  expect(processYrel(schema, 'a')).toMatchObject({ isValid: true })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, [], {}, () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: false, errors: [['err_union']] })
  })
})

test('empty schemas', () => {
  ;[undefined, null, []].forEach((params) => {
    expect(() => {
      y.union(params as any)
    }).toThrowError('Data validator .union([...schemas]) requires schema definitions.')
  })
})

test('custom configuration', () => {
  const schema = y.union([y.number(), y.string()], { errors: [['err_custom', 'xyz', 10]] })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
  expect(processYrel(schema, true)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xyz', 10]]
  })
})

test('optional()', () => {
  const schema = y.union([y.string(), y.number()]).optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 'a')).toMatchObject({ isValid: true })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.union([y.string(), y.number()]).nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 'a')).toMatchObject({ isValid: true })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y
    .union([y.string(), y.number()])
    .validate((data) => data === 'a' || [['err_custom', 'XYZ']])
  expect(processYrel(schema, 'a')).toMatchObject({ isValid: true })
  expect(processYrel(schema, 10)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'XYZ']]
  })
})

test('union nonempty validation with optional empty string', () => {
  const schema = y.union([y.string().date(), y.literal('')])
  expect(processYrel(schema, '2000-10-10')).toMatchObject({ isValid: true })
  expect(processYrel(schema, '')).toMatchObject({ isValid: true })
  expect(processYrel(schema, 'xxx')).toMatchObject({ isValid: false })
})
