import { test, expect } from 'vitest'
import { v, processSchema } from '../'

test('initial', () => {
  const schema = v.literal('hello')
  expect(processSchema(schema, 'hello')).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, -10, 0, 10, NaN, Infinity, {}, [], () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_literal', { literal: 'hello' }]]
    })
  })
})

test('optional()', () => {
  const schema = v.literal(10).optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 10)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.literal(true).nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, true)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v.literal('hi!').validate((data) => data.length === 0 || [['err_custom', 'xxx']])
  expect(processSchema(schema, 'hi!')).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xxx']]
  })
})
