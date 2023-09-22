import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('value validation', () => {
  const schema = y.record(y.string(), y.number())
  ;[undefined, null, true, false, 10, NaN, Infinity, 'a', [], () => {}].forEach((data) => {
    expect(processYrel(schema, data)).toMatchObject({
      key: '',
      isValid: false,
      errors: [['err_record']],
      children: []
    })
  })
  expect(processYrel(schema, {})).toMatchObject({ isValid: true })
  expect(processYrel(schema, { a: 1, b: 2 })).toMatchObject({ isValid: true })
  expect(processYrel(schema, { a: 1, b: 'x', c: 3 })).toMatchObject({
    key: '',
    isValid: false,
    errors: [],
    children: [
      { key: 'a', isValid: true, errors: [], children: [] },
      { key: 'b', isValid: false, errors: [['err_number']], children: [] },
      { key: 'c', isValid: true, errors: [], children: [] }
    ]
  })
})

test('key validation', () => {
  const schema = y.record(y.string().date(), y.number())
  expect(processYrel(schema, {})).toMatchObject({ isValid: true })
  expect(processYrel(schema, { '2000-10-01': 1, '2000-10-02': 2 })).toMatchObject({ isValid: true })
  expect(processYrel(
    schema,
    { '2000-10-01': 1, '2000-10-xx': 2, '2000-10-03': true, '2000-10-yy': 4 }
  )).toMatchObject({
    key: '',
    isValid: false,
    errors: [['err_record_keys', { keys: ['2000-10-xx', '2000-10-yy'] }]],
    children: [
      { key: '2000-10-01', isValid: true, errors: [], children: [] },
      { key: '2000-10-xx', isValid: true, errors: [], children: [] },
      { key: '2000-10-03', isValid: false, errors: [['err_number']], children: [] },
      { key: '2000-10-yy', isValid: true, errors: [], children: [] }
    ]
  })
})

test('optional()', () => {
  const schema = y.record(y.string(), y.boolean()).optional()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true })
  expect(processYrel(schema, null)).toMatchObject({ isValid: false })
  expect(processYrel(schema, { a: true, b: false })).toMatchObject({ isValid: true })
})

test('nullable()', () => {
  const schema = y.record(y.string(), y.union([y.literal('cat'), y.literal('dog')])).nullable()
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: false })
  expect(processYrel(schema, null)).toMatchObject({ isValid: true })
  expect(processYrel(schema, { a: 'cat', b: 'dog' })).toMatchObject({ isValid: true })
})

test('validate()', () => {
  const schema = y
    .record(y.string(), y.string())
    .validate(
      (data) => data.password === data.confirmation || [['err_custom', 'passwords_do_not_match']]
    )
  expect(processYrel(schema, { password: 'abc', confirmation: 'abc' })).toMatchObject({
    isValid: true,
    errors: []
  })
  expect(processYrel(schema, { password: 'abc', confirmation: 'xyz' })).toMatchObject({
    isValid: false,
    errors: [['err_custom', 'passwords_do_not_match']]
  })
})

test('defaultsTo()', () => {
  const schema = y
    .record(y.string(), y.number())
    .defaultsTo({ a: 1, b: 2 })
  expect(processYrel(schema, undefined)).toMatchObject({ isValid: true, data: { a: 1, b: 2 } })
  expect(processYrel(schema, { a: 2, b: 3 })).toMatchObject({ isValid: true, data: { a: 2, b: 3 } })
})

test('transform()', () => {
  const schema = y
    .record(y.string(), y.number())
    .transform(data => ({ ...data, x: 100 }))
  expect(processYrel(schema, { a: 1, b: 2 }))
    .toMatchObject({ isValid: true, data: { a: 1, b: 2, x: 100 } })
})
