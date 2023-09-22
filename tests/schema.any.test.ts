import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.any()
  ;[undefined, null, false, true, -10, 0, 10, NaN, Infinity, '', 'abc', {}, [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
})

test('validate()', () => {
  const schema = y
    .any()
    .validate((data) => data === 10 || [['err_custom', 'Field is required.']])
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 'abc')).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'Field is required.']]
  })
})

test('defaultsTo()', () => {
  const schema = y.any().defaultsTo('cat')
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: 'cat' })
  expect(processYrel(schema, 'dog')).toMatchObject({ isValid: true, data: 'dog' })
})

test('transform()', () => {
  const schema = y.any().transform(data => data === 10 ? 'yes' : 'no')
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true, data: 'yes' })
  expect(processYrel(schema, 20)).toMatchObject({ isValid: true, data: 'no' })
})
