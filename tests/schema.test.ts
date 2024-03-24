import { test, expect } from 'vitest'
import { y, processYrel } from '../'

test('validate() with false return', () => {
  const schema = y.string().validate(() => false as any)
  expect(processYrel(schema, 'abc')).toMatchObject({
    key: '',
    isValid: false,
    data: 'abc',
    errors: [['err_unknown']],
    children: []
  })
})
