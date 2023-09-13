import { test, expect } from 'vitest'
import { v, processSchema } from '../'

test('initial', () => {
  const schema = v.boolean()
  ;[true, false].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[undefined, null, -10, 0, 10, NaN, Infinity, '', 'abc', {}, [], () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_boolean']]
    })
  })
})

test('optional()', () => {
  const schema = v.boolean().optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, true)).toMatchObject({ isValid: true })
  expect(processSchema(schema, false)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.boolean().nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, true)).toMatchObject({ isValid: true })
  expect(processSchema(schema, false)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v
    .boolean()
    .validate((data) => data || [['err_custom', 'Field is required.']])
  expect(processSchema(schema, true)).toMatchObject({ isValid: true })
  expect(processSchema(schema, false)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'Field is required.']]
  })
})

test('truthy()', () => {
  const schema = v.boolean().truthy()
  expect(processSchema(schema, true)).toMatchObject({ isValid: true })
  expect(processSchema(schema, false)).toMatchObject({
    isValid: false,
    errors: [['err_boolean_truthy']]
  })
})

test('validator with custom configuration', () => {
  const schema = v.boolean().truthy({ errors: [['err_custom', 'xyz', 10]] })
  expect(processSchema(schema, true)).toMatchObject({ isValid: true })
  expect(processSchema(schema, false)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xyz', 10]]
  })
})
