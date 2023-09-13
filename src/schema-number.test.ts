import { test, expect } from 'vitest'

import { v, processSchema } from './index'

test('initial', () => {
  const schema = v.number()
  ;[-10, 0, 10].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[undefined, null, true, false, NaN, Infinity, '', 'abc', {}, [], () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number']]
    })
  })
})

test('optional()', () => {
  const schema = v.number().optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 10)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.number().nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 10)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v
    .number()
    .validate((data) => data === 7 || [['err_custom', 'A isValid 7 is required.']])
  expect(processSchema(schema, 7)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 4)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'A isValid 7 is required.']]
  })
})

test('gt(gt)', () => {
  const schema = v.number().gt(10)
  ;[10.1, 11, 15, 20].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10, 0, 9, 10].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_gt', { gt: 10 }]]
    })
  })
})

test('gte(gte)', () => {
  const schema = v.number().gte(10)
  ;[10, 15, 20].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10, 0, 9].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_gte', { gte: 10 }]]
    })
  })
})

test('lt(lt)', () => {
  const schema = v.number().lt(10)
  ;[-10, 0, 9, 9.9].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[10, 15, 20].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_lt', { lt: 10 }]]
    })
  })
})

test('lte(lte)', () => {
  const schema = v.number().lte(10)
  ;[-10, 0, 10].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[11, 15, 20].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_lte', { lte: 10 }]]
    })
  })
})

test('integer()', () => {
  const schema = v.number().integer()
  ;[-10, 0, 10].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10.1, -1.3, 0.1, 15.42, 20.4422].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_integer']]
    })
  })
})

test('validator with custom configuration', () => {
  const schema = v.number().gt(10, { errors: [['err_custom', 'xyz', 10]] })
  ;[10.1, 11, 15, 20].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10, 0, 9, 10].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_custom', 'xyz', 10]]
    })
  })
})
