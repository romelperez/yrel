import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('array / object / array', () => {
  const schema = y.array(
    y.object({
      name: y.string(),
      age: y.number(),
      married: y.boolean().optional(),
      pets: y.array(y.string()).optional()
    })
  )
  expect(
    processYrel(schema, [
      { name: 'a', age: 1 },
      { name: 'b', age: 2, married: true },
      { name: 'c', age: 3, married: false, pets: [] },
      { name: 'd', age: 4, pets: ['x', 'y'] }
    ])
  ).toMatchObject({ isValid: true })
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
  expect(
    processYrel(schema, {
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
