import { test, expect } from 'vitest'
import { y, isYrel } from '../'

test('fake yrel schemas', () => {
  ;[undefined, null, true, false, 10, 'a', {}, [], () => {}].forEach((schema) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(isYrel(schema)).toBe(false)
  })
})

test('real yrel schemas', () => {
  const schema = y.string()
  expect(isYrel(schema)).toBe(true)
})
