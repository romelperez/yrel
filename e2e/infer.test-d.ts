import { describe, test } from 'vitest'
import { type InferDataSchemaType, v } from '../'

test('any()', () => {
  const schema = v.any()
  type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.boolean()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.boolean().optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.boolean().nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.boolean().optional().nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.number()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.number().optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.number().nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.string()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.string().optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.string().nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.literal('hello')
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.literal('world').optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.literal('xxx').nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.array(v.number())
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.array(v.string()).optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.array(v.string()).nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.array(v.array(v.array(v.string())))
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.union([v.number(), v.literal('cat'), v.literal('dog')])
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.union([v.string(), v.number()]).optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.union([v.string(), v.number()]).nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.tuple([v.string(), v.number()])
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.tuple([v.string(), v.number()], v.boolean())
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.tuple([v.string(), v.number()]).optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.tuple([v.string(), v.number()]).nullable()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.object({ x: v.string() })
    type Schema = InferDataSchemaType<typeof schema>
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

  test('object(schema).optional()', () => {
    const schema = v.object({ x: v.string() }).optional()
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.object({ x: v.string() }).nullable()
    type Schema = InferDataSchemaType<typeof schema>
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

describe('recursive', () => {
  test('array / object / array', () => {
    const schema = v.array(
      v.object({
        name: v.string(),
        age: v.number(),
        married: v.boolean().optional(),
        pets: v.array(v.string()).optional()
      })
    )
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.object({
      id: v.string(),
      users: v.array(
        v.object({
          name: v.string(),
          age: v.number(),
          married: v.boolean().optional(),
          pets: v.array(v.string()).optional()
        })
      )
    })
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.array(v.union([v.literal('cat'), v.literal('dog')]))
    type Schema = InferDataSchemaType<typeof schema>
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
    const schema = v.object({
      fullName: v.string(),
      pets: v.union([v.literal('cat'), v.literal('dog')])
    })
    type Schema = InferDataSchemaType<typeof schema>
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
