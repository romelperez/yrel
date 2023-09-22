import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.number()
  ;[-10, 0, 10].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[undefined, null, true, false, NaN, Infinity, '', 'abc', {}, [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number']]
    })
  })
})

test('coerce()', () => {
  const schema = y.number().coerce()
  expect(processYrel(schema, NaN)).toMatchObject({ isValid: false })
  expect(processYrel(schema, Infinity)).toMatchObject({ isValid: false })
  expect(processYrel(schema, 'abc')).toMatchObject({ isValid: false })
  expect(processYrel(schema, false)).toMatchObject({ isValid: true, data: 0 })
  expect(processYrel(schema, true)).toMatchObject({ isValid: true, data: 1 })
  expect(processYrel(schema, '')).toMatchObject({ isValid: true, data: 0 })
  expect(processYrel(schema, '10')).toMatchObject({ isValid: true, data: 10 })
  expect(processYrel(schema, '-20')).toMatchObject({ isValid: true, data: -20 })
  expect(processYrel(schema, '-30e2')).toMatchObject({ isValid: true, data: -3000 })
})

test('coerce() dates', () => {
  const schema = y.number().coerce()
  const date = new Date()
  expect(processYrel(schema, date)).toMatchObject({ isValid: true, data: date.getTime() })
})

test('optional()', () => {
  const schema = y.number().optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.number().nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y
    .number()
    .validate((data) => data === 7 || [['err_custom', 'A isValid 7 is required.']])
  expect(processYrel(schema, 7)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 4)).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'A isValid 7 is required.']]
  })
})

test('gt(gt)', () => {
  const schema = y.number().gt(10)
  ;[10.1, 11, 15, 20].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10, 0, 9, 10].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_gt', { gt: 10 }]]
    })
  })
})

test('gte(gte)', () => {
  const schema = y.number().gte(10)
  ;[10, 15, 20].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10, 0, 9].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_gte', { gte: 10 }]]
    })
  })
})

test('lt(lt)', () => {
  const schema = y.number().lt(10)
  ;[-10, 0, 9, 9.9].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[10, 15, 20].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_lt', { lt: 10 }]]
    })
  })
})

test('lte(lte)', () => {
  const schema = y.number().lte(10)
  ;[-10, 0, 10].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[11, 15, 20].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_lte', { lte: 10 }]]
    })
  })
})

test('integer()', () => {
  const schema = y.number().integer()
  ;[-10, 0, 10].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10.1, -1.3, 0.1, 15.42, 20.4422].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_number_integer']]
    })
  })
})

test('validator with custom configuration', () => {
  const schema = y.number().gt(10, { errors: [['err_custom', 'xyz', 10]] })
  ;[10.1, 11, 15, 20].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[-10, 0, 9, 10].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_custom', 'xyz', 10]]
    })
  })
})

test('defaultsTo()', () => {
  const schema = y.number().defaultsTo(0)
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: 0 })
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true, data: 10 })
})

test('transform()', () => {
  const schema = y.number().transform(data => data * 2)
  expect(processYrel(schema, 10)).toMatchObject({ isValid: true, data: 20 })
  expect(processYrel(schema, 20)).toMatchObject({ isValid: true, data: 40 })
})
