import { test, expect } from 'vitest'
import { v, processSchema } from '../'

test('initial', () => {
  const schema = v.string()
  ;['', ' ', 'abc'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[undefined, null, true, false, -10, 0, 10, NaN, Infinity, {}, [], () => {}].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string']]
    })
  })
})

test('optional()', () => {
  const schema = v.string().optional()
  expect(processSchema(schema, undefined)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 'a')).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = v.string().nullable()
  expect(processSchema(schema, null)).toMatchObject({ isValid: true })
  expect(processSchema(schema, 'a')).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = v
    .string()
    .validate((data) => data === '777' || [['err_custom', 'A valid 777 is required.']])
  expect(processSchema(schema, '777')).toMatchObject({ isValid: true })
  expect(processSchema(schema, '7')).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'A valid 777 is required.']]
  })
})

test('nonempty()', () => {
  const schema = v.string().nonempty()
  ;['a', 'abc'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[''].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_nonempty']]
    })
  })
})

test('trim()', () => {
  const schema = v.string().trim()
  ;['', '123', '1 2  3'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;[' ', '   ', ' a', 'a ', ' a '].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_trim']]
    })
  })
})

test('length(length)', () => {
  const schema = v.string().length(4)
  ;['1234', 'abcd'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['', 'a', 'abc', 'abcde'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_length', { length: 4 }]]
    })
  })
})

test('min(min)', () => {
  const schema = v.string().min(2)
  ;['12', '123', '1234'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['', '1', 'a'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_min', { min: 2 }]]
    })
  })
})

test('max(max)', () => {
  const schema = v.string().max(2)
  ;['', '1', '12'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['123', '1234'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_max', { max: 2 }]]
    })
  })
})

test('datetime()', () => {
  const schema = v.string().datetime()
  ;['2000-01-01T00:00:00.000Z', '2050-10-25T14:45:30.370Z'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['2000-00-01T00:00:00.000Z', '2050-10-25T24:45:30.370Z'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_date_time']]
    })
  })
})

test('date()', () => {
  const schema = v.string().date()
  ;['2000-01-01', '2050-10-25'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['2000-00-01', '2050-13-25'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_date']]
    })
  })
})

test('time()', () => {
  const schema = v.string().time()
  ;['00:00:00.000', '14:45:30.370'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['00:61:00.000', '24:45:30.370'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_time']]
    })
  })
})

test('lowercase()', () => {
  const schema = v.string().lowercase()
  ;['a', 'abc', 'abc def'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['A', 'Abc', 'abC'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_lowercase']]
    })
  })
})

test('uppercase()', () => {
  const schema = v.string().uppercase()
  ;['A', 'ABC', 'ABC DEF'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['a', 'Abc', 'aBC'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_uppercase']]
    })
  })
})

test('capitalcase()', () => {
  const schema = v.string().capitalcase()
  ;['A', 'Abc', 'Abc Def', 'ABc DEF', 'ABC DEF'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({ isValid: true })
  })
  ;['a', 'abc', 'aBc', 'aBC'].forEach((data) => {
    expect(processSchema(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_capitalcase']]
    })
  })
})

test('validator with custom configuration', () => {
  const schema = v.string().date({ errors: [['err_custom', 'xyz', 10]] })
  expect(processSchema(schema, '2000-10-10')).toMatchObject({ isValid: true })
  expect(processSchema(schema, '2000-20-10')).toMatchObject({
    key: '',
    isValid: false,
    errors: [['err_custom', 'xyz', 10]],
    children: []
  })
})
