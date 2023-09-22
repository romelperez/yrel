import { test, expect } from 'vitest'
import { y, isYrel } from '../'

test('fake yrel schemas', () => {
  [undefined, null, true, false, 10, 'a', {}, [], () => {}].forEach(schema => {
    expect(isYrel(schema as any)).toBe(false)
  })
})

test('real yrel schemas', () => {
  const schema = y.string()
  expect(isYrel(schema)).toBe(true)
})
