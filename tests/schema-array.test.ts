import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.array(y.string())
  expect(processYrel(schema, [])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['', 'a', 'abc'])).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, 10, NaN, Infinity, 'a', {}, () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: false, errors: [['err_array']] })
  })
  // The array item validation.
  ;[[null], [true], [0], [{}]].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      key: '',
      isValid: false,
      children: [
        {
          key: '0',
          isValid: false,
          errors: [['err_string']]
        }
      ]
    })
  })
})

test('optional()', () => {
  const schema = y.array(y.string()).optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, [])).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.array(y.string()).nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, [])).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y
    .array(y.string())
    .validate((data) => data.includes('c') || [['err_custom', 'Must include a "c".']])
  expect(processYrel(schema, ['a', 'b', 'c'])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b'])).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'Must include a "c".']]
  })
})

test('nonempty()', () => {
  const schema = y.array(y.string()).nonempty()
  expect(processYrel(schema, [])).toMatchObject({
    isValid: false,
    errors: [['err_array_nonempty']]
  })
  expect(processYrel(schema, ['a'])).toMatchObject({ isValid: true, errors: [] })
  expect(processYrel(schema, ['a', 'b', 'c'])).toMatchObject({ isValid: true, errors: [] })
})

test('length()', () => {
  const schema = y.array(y.string()).length(2)
  expect(processYrel(schema, [])).toMatchObject({
    isValid: false,
    errors: [['err_array_length', { length: 2 }]]
  })
  expect(processYrel(schema, ['a'])).toMatchObject({
    isValid: false,
    errors: [['err_array_length', { length: 2 }]]
  })
  expect(processYrel(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b', 'c'])).toMatchObject({
    isValid: false,
    errors: [['err_array_length', { length: 2 }]]
  })
})

test('min()', () => {
  const schema = y.array(y.string()).min(2)
  expect(processYrel(schema, [])).toMatchObject({
    isValid: false,
    errors: [['err_array_min', { min: 2 }]]
  })
  expect(processYrel(schema, ['a'])).toMatchObject({
    isValid: false,
    errors: [['err_array_min', { min: 2 }]]
  })
  expect(processYrel(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b', 'c'])).toMatchObject({ isValid: true })
})

test('max()', () => {
  const schema = y.array(y.string()).max(2)
  expect(processYrel(schema, [])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a'])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b', 'c'])).toMatchObject({
    isValid: false,
    errors: [['err_array_max', { max: 2 }]]
  })
})

test('validator with custom configuration', () => {
  const schema = y.array(y.string()).max(2, { errors: [['err_custom', 'xyz', 10]] })
  expect(processYrel(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processYrel(schema, ['a', 'b', 'c'])).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xyz', 10]]
  })
})

test('defaultsTo()', () => {
  const schema = y.array(y.string()).defaultsTo(['a', 'b'])
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: ['a', 'b'] })
  expect(processYrel(schema, ['w', 'x'])).toMatchObject({ isValid: true, data: ['w', 'x'] })
})

test('transform()', () => {
  const schema = y.array(y.string()).transform((data) => data.map((item) => item.toLowerCase()))
  expect(processYrel(schema, ['A', 'B'])).toMatchObject({ isValid: true, data: ['a', 'b'] })
  expect(processYrel(schema, ['X', 'Y'])).toMatchObject({ isValid: true, data: ['x', 'y'] })
})

test('nested data processing', () => {
  const schema = y.array(
    y
      .string()
      .defaultsTo('a')
      .transform((value) => value.toUpperCase())
  )
  expect(processYrel(schema, ['x', undefined, 'y'])).toMatchObject({
    isValid: true,
    data: ['X', 'A', 'Y']
  })
})
