import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.literal('hello')
  expect(processYrel(schema, 'hello')).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, -10, 0, 10, NaN, Infinity, {}, [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_literal', { literal: 'hello' }]]
    })
  })
})

test('optional()', () => {
  const schema = y.literal(10).optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.literal(true).nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, true)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y.literal('hi!').validate((data) => data.length === 0 || [['err_custom', 'xxx']])
  expect(processYrel(schema, 'hi!')).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xxx']]
  })
})
