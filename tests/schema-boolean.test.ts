import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.boolean()
  ;[true, false].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[undefined, null, -10, 0, 10, NaN, Infinity, '', 'abc', {}, [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_boolean']]
    })
  })
})

test('coerce()', () => {
  const schema = y.boolean().coerce()
  ;[false, undefined, null, 0, NaN, ''].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true, data: false })
  })
  ;[true, 1, 'a', {}, [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true, data: true })
  })
})

test('optional()', () => {
  const schema = y.boolean().optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, true)).toMatchObject({ isValid: true })
  expect(processYrel(schema, false)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.boolean().nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, true)).toMatchObject({ isValid: true })
  expect(processYrel(schema, false)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y.boolean().validate((data) => data || [['err_custom', 'Field is required.']])
  expect(processYrel(schema, true)).toMatchObject({ isValid: true })
  expect(processYrel(schema, false)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'Field is required.']]
  })
})

test('truthy()', () => {
  const schema = y.boolean().truthy()
  expect(processYrel(schema, true)).toMatchObject({ isValid: true })
  expect(processYrel(schema, false)).toMatchObject({
    isValid: false,
    errors: [['err_boolean_truthy']]
  })
})

test('validator with custom configuration', () => {
  const schema = y.boolean().truthy({ errors: [['err_custom', 'xyz', 10]] })
  expect(processYrel(schema, true)).toMatchObject({ isValid: true })
  expect(processYrel(schema, false)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xyz', 10]]
  })
})

test('defaultsTo()', () => {
  const schema = y.boolean().defaultsTo(false)
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: false })
  expect(processYrel(schema, false)).toMatchObject({ isValid: true, data: false })
  expect(processYrel(schema, true)).toMatchObject({ isValid: true, data: true })
})

test('transform()', () => {
  const schema = y.boolean().transform((data) => !data)
  expect(processYrel(schema, true)).toMatchObject({ isValid: true, data: false })
  expect(processYrel(schema, false)).toMatchObject({ isValid: true, data: true })
})
