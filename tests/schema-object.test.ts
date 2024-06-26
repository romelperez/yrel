import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.object({
    name: y.string().min(2),
    age: y.number().gte(18)
  })
  expect(processYrel(schema, { name: 'romel', age: 21 })).toMatchObject({ isValid: true })
  expect(processYrel(schema, [1, 2, 3])).toMatchObject({
    key: '',
    isValid: false,
    errors: [['err_object']],
    children: []
  })
  expect(processYrel(schema, { name: 'romel', age: null })).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: 'name', isValid: true, errors: [], children: [] },
      { key: 'age', isValid: false, errors: [['err_number']], children: [] }
    ]
  })
  expect(processYrel(schema, { name: 'r', age: 21 })).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: 'name', isValid: false, errors: [['err_string_min', { min: 2 }]], children: [] },
      { key: 'age', isValid: true, errors: [], children: [] }
    ]
  })
  expect(processYrel(schema, { name: 'romel', age: 15 })).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: 'name', isValid: true, errors: [], children: [] },
      { key: 'age', isValid: false, errors: [['err_number_gte', { gte: 18 }]], children: [] }
    ]
  })
  ;[undefined, null, true, false, 10, NaN, Infinity, 'a', [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      key: '',
      isValid: false,
      errors: [['err_object']],
      children: []
    })
  })
})

test('default filter unexpected props', () => {
  const schema = y.object({ x: y.string(), y: y.number().optional() })
  expect(processYrel(schema, { x: 'x' })).toMatchObject({ isValid: true })
  expect(processYrel(schema, { x: 'x', y: 10 })).toMatchObject({ isValid: true })
  expect(processYrel(schema, { x: 'x', w: 10 })).toMatchObject({
    isValid: false,
    errors: [['err_object_unexpected_props', { props: ['w'] }]]
  })
  expect(processYrel(schema, { x: 'x', w: 10, z: 20 })).toMatchObject({
    isValid: false,
    errors: [['err_object_unexpected_props', { props: ['w', 'z'] }]]
  })
})

test('passthrough()', () => {
  const schema = y.object({ x: y.string(), y: y.number().optional() }).passthrough()
  expect(processYrel(schema, { x: 'x' })).toMatchObject({ isValid: true })
  expect(processYrel(schema, { x: 'x', y: 10 })).toMatchObject({ isValid: true })
  expect(processYrel(schema, { x: 'x', w: 10 })).toMatchObject({ isValid: true })
  expect(processYrel(schema, { x: 'x', w: 10, z: 20 })).toMatchObject({ isValid: true })
})

test('optional()', () => {
  const schema = y.object({ x: y.string() }).optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, { x: 'x' })).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.object({ x: y.string() }).nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, { x: 'x' })).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y
    .object({
      password: y.string(),
      confirmation: y.string()
    })
    .validate(
      (data) => data.password === data.confirmation || [['err_custom', 'passwords_do_not_match']]
    )
  expect(processYrel(schema, { password: 'abc', confirmation: 'abc' })).toMatchObject({
    isValid: true
  })
  expect(processYrel(schema, { password: 'abc', confirmation: 'xyz' })).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'passwords_do_not_match']]
  })
})

test('shape', () => {
  const shape = { name: y.string(), age: y.number() }
  const schema = y.object(shape)
  expect(shape).toBe(schema.shape)
})

test('defaultsTo()', () => {
  const schema = y.object({ a: y.number(), b: y.string() }).defaultsTo({ a: 1, b: '2' })
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: { a: 1, b: '2' } })
  expect(processYrel(schema, { a: 2, b: '3' })).toMatchObject({
    isValid: true,
    data: { a: 2, b: '3' }
  })
})

test('transform()', () => {
  const schema = y
    .object({ w: y.string(), x: y.number() })
    .transform(({ w, x }) => ({ w: w.toLowerCase(), x }))
  expect(processYrel(schema, { w: 'Y', x: 2 })).toMatchObject({
    isValid: true,
    data: { w: 'y', x: 2 }
  })
})

test('nested data processing', () => {
  const schema = y.object({
    a: y.number().defaultsTo(0),
    b: y.string().transform((value) => value.toUpperCase()),
    c: y.string().coerce()
  })
  const data = { b: 'b', c: true }
  const result = processYrel(schema, data)
  expect(result).toMatchObject({
    isValid: true,
    data: { a: 0, b: 'B', c: 'true' }
  })
  expect(result.data).not.toBe(data)
  expect(data).toEqual({ b: 'b', c: true })
})
