import { test, expect } from 'vitest'

import { v, processSchema } from './index'

test('array / object / array', () => {
  const schema = v.array(
    v.object({
      name: v.string(),
      age: v.number(),
      married: v.boolean().optional(),
      pets: v.array(v.string()).optional()
    })
  )
  expect(
    processSchema(schema, [
      { name: 'a', age: 1 },
      { name: 'b', age: 2, married: true },
      { name: 'c', age: 3, married: false, pets: [] },
      { name: 'd', age: 4, pets: ['x', 'y'] }
    ])
  ).toMatchObject({ isValid: true })
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
  expect(
    processSchema(schema, {
      id: 'a',
      users: [
        { name: 'a', age: 1 },
        { name: 'b', age: 2, married: true },
        { name: 'c', age: 3, married: false, pets: [] },
        { name: 'd', age: 4, pets: ['x', 'y'] }
      ]
    })
  ).toMatchObject({ isValid: true })
})
