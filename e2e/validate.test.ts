import { describe, test, expect } from 'vitest'
import { v, validate } from '../'

describe('plain schema', () => {
  test('valid', () => {
    const schema = v.string()
    const received = validate(schema, 'abc')
    const expected = { isValid: true, issues: [], data: 'abc' }
    expect(received).toEqual(expected)
  })

  test('invalid', () => {
    const schema = v.string()
    const received = validate(schema, 10)
    const expected = {
      isValid: false,
      issues: [{ key: '', errors: [['err_string']] }],
      data: undefined
    }
    expect(received).toEqual(expected)
  })
})

describe('array schema', () => {
  test('valid', () => {
    const schema = v.array(v.number())
    const received = validate(schema, [1, 2, 3])
    const expected = { isValid: true, issues: [], data: [1, 2, 3] }
    expect(received).toEqual(expected)
  })

  test('invalid root', () => {
    const schema = v.array(v.number())
    const received = validate(schema, 10)
    const expected = {
      isValid: false,
      issues: [{ key: '', errors: [['err_array']] }],
      data: undefined
    }
    expect(received).toEqual(expected)
  })

  test('invalid children', () => {
    const schema = v.array(v.number())
    const received = validate(schema, [1, '2', 3])
    const expected = {
      isValid: false,
      issues: [{ key: '1', errors: [['err_number']] }],
      data: undefined
    }
    expect(received).toEqual(expected)
  })
})

describe('object schema', () => {
  test('valid ', () => {
    const schema = v.object({ name: v.string(), age: v.number(), married: v.boolean().optional() })
    const received = validate(schema, { name: 'r', age: 1, married: true })
    const expected = { isValid: true, issues: [], data: { name: 'r', age: 1, married: true } }
    expect(received).toEqual(expected)
  })

  test('invalid root', () => {
    const schema = v.object({ name: v.string(), age: v.number(), married: v.boolean().optional() })
    const received = validate(schema, 'abc')
    const expected = {
      isValid: false,
      issues: [{ key: '', errors: [['err_object']] }],
      data: undefined
    }
    expect(received).toEqual(expected)
  })

  test('invalid children', () => {
    const schema = v.object({ name: v.string(), age: v.number(), married: v.boolean().optional() })
    const received = validate(schema, { name: 'r', age: 'a', married: 10 })
    const expected = {
      isValid: false,
      issues: [
        { key: 'age', errors: [['err_number']] },
        { key: 'married', errors: [['err_boolean']] }
      ],
      data: undefined
    }
    expect(received).toEqual(expected)
  })
})

describe('nested schema', () => {
  test('object / array', () => {
    const schema = v.object({
      name: v.string(),
      age: v.number().gte(10),
      pets: v.array(v.union([v.literal('cat'), v.literal('dog'), v.literal('parrot')]))
    })
    expect(validate(schema, { name: 'r', age: 10, pets: ['cat', 'parrot'] })).toEqual({
      isValid: true,
      issues: [],
      data: { name: 'r', age: 10, pets: ['cat', 'parrot'] }
    })
    expect(validate(schema, { name: 'r', age: 7, pets: ['cat', 'fish', 'dog'] })).toEqual({
      isValid: false,
      issues: [
        { key: 'age', errors: [['err_number_gte', { gte: 10 }]] },
        { key: 'pets.1', errors: [['err_union']] }
      ],
      data: undefined
    })
  })

  test('array / object / array', () => {
    const schema = v
      .array(
        v.object({
          name: v.string(),
          age: v.number().gte(10),
          pets: v.array(v.union([v.literal('cat'), v.literal('dog'), v.literal('parrot')]))
        })
      )
      .min(3)
    expect(
      validate(schema, [
        { name: 'r', age: 10, pets: ['cat'] },
        { name: 'n', age: 20, pets: ['dog', 'parrot'] },
        { name: 'k', age: 30, pets: [] }
      ])
    ).toEqual({
      isValid: true,
      issues: [],
      data: [
        { name: 'r', age: 10, pets: ['cat'] },
        { name: 'n', age: 20, pets: ['dog', 'parrot'] },
        { name: 'k', age: 30, pets: [] }
      ]
    })
    expect(
      validate(schema, [
        { name: 'r', age: 7, pets: ['cat'] },
        { name: 'n', age: 15, pets: ['dog', 'fish', 'parrot'] }
      ])
    ).toEqual({
      isValid: false,
      issues: [
        { key: '', errors: [['err_array_min', { min: 3 }]] },
        { key: '0.age', errors: [['err_number_gte', { gte: 10 }]] },
        { key: '1.pets.1', errors: [['err_union']] }
      ],
      data: undefined
    })
  })
})

test.todo('Should allow to define a "rootKey" to report issues on root schema')
