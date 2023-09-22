import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('initial', () => {
  const schema = y.string()
  ;['', ' ', 'abc'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[undefined, null, true, false, -10, 0, 10, NaN, Infinity, {}, [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string']]
    })
  })
})

test('coerce()', () => {
  const schema = y.string().coerce()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: 'undefined' })
  expect(processYrel(schema, null)).toMatchObject({ isValid: true, data: 'null' })
  expect(processYrel(schema, true)).toMatchObject({ isValid: true, data: 'true' })
  expect(processYrel(schema, false)).toMatchObject({ isValid: true, data: 'false' })
  expect(processYrel(schema, 0)).toMatchObject({ isValid: true, data: '0' })
  expect(processYrel(schema, 100)).toMatchObject({ isValid: true, data: '100' })
  expect(processYrel(schema, -100)).toMatchObject({ isValid: true, data: '-100' })
  expect(processYrel(schema, '')).toMatchObject({ isValid: true, data: '' })
  expect(processYrel(schema, 'abc')).toMatchObject({ isValid: true, data: 'abc' })
  expect(processYrel(schema, { a: 1 })).toMatchObject({ isValid: true, data: '[object Object]' })
})

test('coerce() dates', () => {
  const schema = y.string().coerce()
  const date = new Date()
  expect(processYrel(schema, date)).toMatchObject({ isValid: true, data: date.toISOString() })
})

test('optional()', () => {
  const schema = y.string().optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 'a')).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.string().nullable()
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, 'a')).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y
    .string()
    .validate((data) => data === '777' || [['err_custom', 'A valid 777 is required.']])
  expect(processYrel(schema, '777')).toMatchObject({ isValid: true })
  expect(processYrel(schema, '7')).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'A valid 777 is required.']]
  })
})

test('nonempty()', () => {
  const schema = y.string().nonempty()
  ;['a', 'abc'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[''].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_nonempty']]
    })
  })
})

test('trim()', () => {
  const schema = y.string().trim()
  ;['', '123', '1 2  3'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;[' ', '   ', ' a', 'a ', ' a '].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_trim']]
    })
  })
})

test('length(length)', () => {
  const schema = y.string().length(4)
  ;['1234', 'abcd'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['', 'a', 'abc', 'abcde'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_length', { length: 4 }]]
    })
  })
})

test('min(min)', () => {
  const schema = y.string().min(2)
  ;['12', '123', '1234'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['', '1', 'a'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_min', { min: 2 }]]
    })
  })
})

test('max(max)', () => {
  const schema = y.string().max(2)
  ;['', '1', '12'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['123', '1234'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_max', { max: 2 }]]
    })
  })
})

test('datetime()', () => {
  const schema = y.string().datetime()
  ;['2000-01-01T00:00:00.000Z', '2050-10-25T14:45:30.370Z'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['2000-00-01T00:00:00.000Z', '2050-10-25T24:45:30.370Z'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_date_time']]
    })
  })
})

test('date()', () => {
  const schema = y.string().date()
  ;['2000-01-01', '2050-10-25'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['2000-00-01', '2050-13-25'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_date']]
    })
  })
})

test('time()', () => {
  const schema = y.string().time()
  ;['00:00:00.000', '14:45:30.370'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['00:61:00.000', '24:45:30.370'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_time']]
    })
  })
})

test('lowercase()', () => {
  const schema = y.string().lowercase()
  ;['a', 'abc', 'abc def'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['A', 'Abc', 'abC'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_lowercase']]
    })
  })
})

test('uppercase()', () => {
  const schema = y.string().uppercase()
  ;['A', 'ABC', 'ABC DEF'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['a', 'Abc', 'aBC'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_uppercase']]
    })
  })
})

test('capitalcase()', () => {
  const schema = y.string().capitalcase()
  ;['A', 'Abc', 'Abc Def', 'ABc DEF', 'ABC DEF'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['a', 'abc', 'aBc', 'aBC'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_capitalcase', { lower: false }]]
    })
  })
})

test('capitalcase({ lower: true })', () => {
  const schema = y.string().capitalcase({ lower: true })
  ;['A', 'Abc', 'Áei Óu', 'Abc Def'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({ isValid: true })
  })
  ;['a', 'abc', 'áei óu', 'aBc', 'aBC', 'ABc DEF', 'ABC DEF'].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      isValid: false,
      errors: [['err_string_capitalcase', { lower: true }]]
    })
  })
})

test('validator with custom configuration', () => {
  const schema = y.string().date({ errors: [['err_custom', 'xyz', 10]] })
  expect(processYrel(schema, '2000-10-10')).toMatchObject({ isValid: true })
  expect(processYrel(schema, '2000-20-10')).toMatchObject({
    key: '',
    isValid: false,
    errors: [['err_custom', 'xyz', 10]],
    children: []
  })
})

test('defaultsTo()', () => {
  const schema = y.string().defaultsTo('cat')
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: 'cat' })
  expect(processYrel(schema, 'dog')).toMatchObject({ isValid: true, data: 'dog' })
})

test('transform()', () => {
  const schema = y.string().transform(data => data.toLowerCase())
  expect(processYrel(schema, 'ABC')).toMatchObject({ isValid: true, data: 'abc' })
  expect(processYrel(schema, 'DEF')).toMatchObject({ isValid: true, data: 'def' })
})
