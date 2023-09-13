import { test, expect } from 'vitest'
import { v, processSchema } from '../'

test('initial', () => {
  const schema = v.array(v.string())
  expect(processSchema(schema, [])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['', 'a', 'abc'])).toMatchObject({ isValid: true })
  ;[undefined, null, true, false, 10, NaN, Infinity, 'a', {}, () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: false, errors: [['err_array']] })
  })
  // The array item validation.
  ;[[null], [true], [0], [{}]].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
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
  const schema = v.array(v.string()).optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, [])).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.array(v.string()).nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, [])).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v
    .array(v.string())
    .validate((data) => data.includes('c') || [['err_custom', 'Must include a "c".']])
  expect(processSchema(schema, ['a', 'b', 'c'])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b'])).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'Must include a "c".']]
  })
})

test('nonempty()', () => {
  const schema = v.array(v.string()).nonempty()
  expect(processSchema(schema, [])).toMatchObject({
    isValid: false,
    errors: [['err_array_nonempty']]
  })
  expect(processSchema(schema, ['a'])).toMatchObject({ isValid: true, errors: [] })
  expect(processSchema(schema, ['a', 'b', 'c'])).toMatchObject({ isValid: true, errors: [] })
})

test('length()', () => {
  const schema = v.array(v.string()).length(2)
  expect(processSchema(schema, [])).toMatchObject({
    isValid: false,
    errors: [['err_array_length', { length: 2 }]]
  })
  expect(processSchema(schema, ['a'])).toMatchObject({
    isValid: false,
    errors: [['err_array_length', { length: 2 }]]
  })
  expect(processSchema(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b', 'c'])).toMatchObject({
    isValid: false,
    errors: [['err_array_length', { length: 2 }]]
  })
})

test('min()', () => {
  const schema = v.array(v.string()).min(2)
  expect(processSchema(schema, [])).toMatchObject({
    isValid: false,
    errors: [['err_array_min', { min: 2 }]]
  })
  expect(processSchema(schema, ['a'])).toMatchObject({
    isValid: false,
    errors: [['err_array_min', { min: 2 }]]
  })
  expect(processSchema(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b', 'c'])).toMatchObject({ isValid: true })
})

test('max()', () => {
  const schema = v.array(v.string()).max(2)
  expect(processSchema(schema, [])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a'])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b', 'c'])).toMatchObject({
    isValid: false,
    errors: [['err_array_max', { max: 2 }]]
  })
})

test('validator with custom configuration', () => {
  const schema = v.array(v.string()).max(2, { errors: [['err_custom', 'xyz', 10]] })
  expect(processSchema(schema, ['a', 'b'])).toMatchObject({ isValid: true })
  expect(processSchema(schema, ['a', 'b', 'c'])).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'xyz', 10]]
  })
})
