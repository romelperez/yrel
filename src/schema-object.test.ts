import { test, expect } from 'vitest'

import { v, processSchema } from './index'

test('initial', () => {
  const schema = v.object({
    name: v.string().min(2),
    age: v.number().gte(18)
  })
  expect(processSchema(schema, { name: 'romel', age: 21 })).toMatchObject({ isValid: true })
  expect(processSchema(schema, [1, 2, 3])).toMatchObject({
    key: '',
    isValid: false,
    errors: [['err_object']],
    children: []
  })
  expect(processSchema(schema, { name: 'romel', age: null })).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: 'name', isValid: true, errors: [], children: [] },
      { key: 'age', isValid: false, errors: [['err_number']], children: [] }
    ]
  })
  expect(processSchema(schema, { name: 'r', age: 21 })).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: 'name', isValid: false, errors: [['err_string_min', { min: 2 }]], children: [] },
      { key: 'age', isValid: true, errors: [], children: [] }
    ]
  })
  expect(processSchema(schema, { name: 'romel', age: 15 })).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: 'name', isValid: true, errors: [], children: [] },
      { key: 'age', isValid: false, errors: [['err_number_gte', { gte: 18 }]], children: [] }
    ]
  })
  ;[undefined, null, true, false, 10, NaN, Infinity, 'a', [], () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      key: '',
      isValid: false,
      errors: [['err_object']],
      children: []
    })
  })
})

test('default filter unexpected props', () => {
  const schema = v.object({ x: v.string(), y: v.number().optional() })
  expect(processSchema(schema, { x: 'x' })).toMatchObject({ isValid: true })
  expect(processSchema(schema, { x: 'x', y: 10 })).toMatchObject({ isValid: true })
  expect(processSchema(schema, { x: 'x', w: 10 })).toMatchObject({
    isValid: false,
    errors: [['err_object_unexpected_props', { props: ['w'] }]]
  })
  expect(processSchema(schema, { x: 'x', w: 10, z: 20 })).toMatchObject({
    isValid: false,
    errors: [['err_object_unexpected_props', { props: ['w', 'z'] }]]
  })
})

test('passthrough()', () => {
  const schema = v.object({ x: v.string(), y: v.number().optional() }).passthrough()
  expect(processSchema(schema, { x: 'x' })).toMatchObject({ isValid: true })
  expect(processSchema(schema, { x: 'x', y: 10 })).toMatchObject({ isValid: true })
  expect(processSchema(schema, { x: 'x', w: 10 })).toMatchObject({ isValid: true })
  expect(processSchema(schema, { x: 'x', w: 10, z: 20 })).toMatchObject({ isValid: true })
})

test('optional()', () => {
  const schema = v.object({ x: v.string() }).optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, { x: 'x' })).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.object({ x: v.string() }).nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, { x: 'x' })).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v
    .object({
      password: v.string(),
      confirmation: v.string()
    })
    .validate(
      (data) => data.password === data.confirmation || [['err_custom', 'passwords_do_not_match']]
    )
  expect(processSchema(schema, { password: 'abc', confirmation: 'abc' })).toMatchObject({
    isValid: true
  })
  expect(processSchema(schema, { password: 'abc', confirmation: 'xyz' })).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'passwords_do_not_match']]
  })
})
