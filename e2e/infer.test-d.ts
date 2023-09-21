import { describe, test } from 'vitest'
import { type InferYrel, y } from '../'

test('any()', () => {
  const schema = y.any()
  type Schema = InferYrel<typeof schema>
  undefined satisfies Schema
  null satisfies Schema
  true satisfies Schema
  false satisfies Schema
  10 satisfies Schema
  'a' satisfies Schema
  ;({}) satisfies Schema
  ;[] satisfies Schema
  ;(() => {}) satisfies Schema
})

describe('boolean', () => {
  test('boolean()', () => {
    const schema = y.boolean()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    true satisfies Schema
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('boolean().optional()', () => {
    const schema = y.boolean().optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    true satisfies Schema
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('boolean().nullable()', () => {
    const schema = y.boolean().nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    true satisfies Schema
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('boolean().optional().nullable()', () => {
    const schema = y.boolean().optional().nullable()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    null satisfies Schema
    true satisfies Schema
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('number', () => {
  test('number()', () => {
    const schema = y.number()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('number().optional()', () => {
    const schema = y.number().optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('number().nullable()', () => {
    const schema = y.number().nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('string', () => {
  test('string()', () => {
    const schema = y.string()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('string().optional()', () => {
    const schema = y.string().optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('string().nullable()', () => {
    const schema = y.string().nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('literal', () => {
  test('literal()', () => {
    const schema = y.literal('hello')
    type Schema = InferYrel<typeof schema>
    'hello' satisfies Schema
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('literal().optional()', () => {
    const schema = y.literal('world').optional()
    type Schema = InferYrel<typeof schema>
    'world' satisfies Schema
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('literal().nullable()', () => {
    const schema = y.literal('xxx').nullable()
    type Schema = InferYrel<typeof schema>
    'xxx' satisfies Schema
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('array', () => {
  test('array(schema)', () => {
    const schema = y.array(y.number())
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    ;[] satisfies Schema
    ;[1, 2] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('array(schema).optional()', () => {
    const schema = y.array(y.string()).optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    ;[] satisfies Schema
    ;['a', 'b'] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('array(schema).nullable()', () => {
    const schema = y.array(y.string()).nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    ;[] satisfies Schema
    ;['a', 'b'] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('array(schema) recursive', () => {
    const schema = y.array(y.array(y.array(y.string())))
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    ;[] satisfies Schema
    ;[[]] satisfies Schema
    ;[[[]]] satisfies Schema
    ;[[['a', 'b']]] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('union()', () => {
  test('union(schemas)', () => {
    const schema = y.union([y.number(), y.literal('cat'), y.literal('dog')])
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    'cat' satisfies Schema
    'dog' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('union(schema).optional()', () => {
    const schema = y.union([y.string(), y.number()]).optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    10 satisfies Schema
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('union(schema).nullable()', () => {
    const schema = y.union([y.string(), y.number()]).nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    10 satisfies Schema
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('tuple()', () => {
  test('tuple(schemas)', () => {
    const schema = y.tuple([y.string(), y.number()])
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;['a'] satisfies Schema
    // @ts-expect-error test
    ;[10] satisfies Schema
    ;['a', 10] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 20] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 'b'] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('tuple(schemas, ...rest)', () => {
    const schema = y.tuple([y.string(), y.number()], y.boolean())
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;['a'] satisfies Schema
    // @ts-expect-error test
    ;[10] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 20] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 'b'] satisfies Schema
    ;['a', 10] satisfies Schema
    ;['a', 10, true] satisfies Schema
    ;['a', 10, true, false, true] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 'b'] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('tuple(schemas).optional()', () => {
    const schema = y.tuple([y.string(), y.number()]).optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;['a'] satisfies Schema
    // @ts-expect-error test
    ;[10] satisfies Schema
    ;['a', 10] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 20] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 'b'] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('tuple(schemas).nullable()', () => {
    const schema = y.tuple([y.string(), y.number()]).nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;['a'] satisfies Schema
    // @ts-expect-error test
    ;[10] satisfies Schema
    ;['a', 10] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 20] satisfies Schema
    // @ts-expect-error test
    ;['a', 10, 'b'] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('object()', () => {
  test('object(schema)', () => {
    const schema = y.object({ x: y.string() })
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('object(schema) with only optional parameters', () => {
    const schema = y.object({
      x: y.string().optional(),
      y: y.number().optional()
    })
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('object(schema).optional()', () => {
    const schema = y.object({ x: y.string() }).optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('object(schema).nullable()', () => {
    const schema = y.object({ x: y.string() }).nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})
describe('record()', () => {
  test('record(schema)', () => {
    const schema = y.record(y.string(), y.array(y.number()))
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    ;({}) satisfies Schema
    ;({ a: [], b: [1, 2, 3] }) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('record(schema).optional()', () => {
    const schema = y.record(y.string(), y.array(y.number())).optional()
    type Schema = InferYrel<typeof schema>
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    ;({}) satisfies Schema
    ;({ a: [], b: [1, 2, 3] }) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('record(schema).nullable()', () => {
    const schema = y.record(y.string(), y.array(y.number())).nullable()
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    ;({}) satisfies Schema
    ;({ a: [], b: [1, 2, 3] }) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})

describe('recursive', () => {
  test('array / object / array', () => {
    const schema = y.array(
      y.object({
        name: y.string(),
        age: y.number(),
        married: y.boolean().optional(),
        pets: y.array(y.string()).optional()
      })
    )
    type Schema = InferYrel<typeof schema>
    ;[
      { name: 'a', age: 1 },
      { name: 'b', age: 2, married: true },
      { name: 'c', age: 3, pets: ['x', 'y'] }
    ] satisfies Schema
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    ;[{ name: 0, age: 1 }] satisfies Schema
    // @ts-expect-error test
    ;[{ name: 'a', age: '1' }] satisfies Schema
    // @ts-expect-error test
    ;[{ name: 'a', age: 1, pets: null }] satisfies Schema
    // @ts-expect-error test
    ;[{ name: 'a', age: 1, pets: [2] }] satisfies Schema
    // @ts-expect-error test
    ;[{ name: 'a', age: 1, pets: [{}] }] satisfies Schema
  })

  test('object / array / object / array', () => {
    const schema = y.object({
      id: y.string(),
      users: y.array(
        y.object({
          name: y.string(),
          age: y.number(),
          married: y.boolean().optional(),
          pets: y.array(y.string()).optional()
        })
      )
    })
    type Schema = InferYrel<typeof schema>
    ;({
      id: 'a',
      users: [
        { name: 'a', age: 1 },
        { name: 'b', age: 2, married: true },
        { name: 'c', age: 3, married: false, pets: [] },
        { name: 'd', age: 4, pets: ['x', 'y'] }
      ]
    }) satisfies Schema
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    ;({ users: [{ name: 'a', age: 1 }] }) satisfies Schema
    // @ts-expect-error test
    ;({ id: 'a', users: [{ name: 'a', age: '1' }] }) satisfies Schema
    // @ts-expect-error test
    ;({ id: 'a', users: [{ name: 'a', age: 1, pets: null }] }) satisfies Schema
    // @ts-expect-error test
    ;({ id: 'a', users: [{ name: 'a', age: 1, pets: [2] }] }) satisfies Schema
    // @ts-expect-error test
    ;({ id: 'a', users: [{ name: 'a', age: 1, pets: [{}] }] }) satisfies Schema
  })

  test('array / union / literals', () => {
    const schema = y.array(y.union([y.literal('cat'), y.literal('dog')]))
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    ;[] satisfies Schema
    ;['cat', 'dog'] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })

  test('object / union / literals', () => {
    const schema = y.object({
      fullName: y.string(),
      pets: y.union([y.literal('cat'), y.literal('dog')])
    })
    type Schema = InferYrel<typeof schema>
    // @ts-expect-error test
    undefined satisfies Schema
    // @ts-expect-error test
    null satisfies Schema
    // @ts-expect-error test
    true satisfies Schema
    // @ts-expect-error test
    false satisfies Schema
    // @ts-expect-error test
    10 satisfies Schema
    // @ts-expect-error test
    'a' satisfies Schema
    // @ts-expect-error test
    ;({}) satisfies Schema
    // @ts-expect-error test
    ;({ fullName: 'yrel', pets: undefined }) satisfies Schema
    // @ts-expect-error test
    ;({ fullName: 'yrel', pets: null }) satisfies Schema
    ;({ fullName: 'yrel', pets: 'cat' }) satisfies Schema
    // @ts-expect-error test
    ;[] satisfies Schema
    // @ts-expect-error test
    ;(() => {}) satisfies Schema
  })
})
