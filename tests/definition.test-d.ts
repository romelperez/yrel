import { test } from 'vitest'
import { type InferYrel, type YrelSchema, y } from '../'

test('Should be able to define schema with boolean type', () => {
  const schema1 = y.boolean()
  type Schema2 = YrelSchema<boolean>
  type Data1 = InferYrel<typeof schema1>
  type Data2 = InferYrel<Schema2>
  type Result = Data1 extends Data2 ? (Data2 extends Data1 ? true : false) : false
  true satisfies Result
})

test('Should be able to define schema with number type', () => {
  const schema1 = y.number()
  type Schema2 = YrelSchema<number>
  type Data1 = InferYrel<typeof schema1>
  type Data2 = InferYrel<Schema2>
  type Result = Data1 extends Data2 ? (Data2 extends Data1 ? true : false) : false
  true satisfies Result
})

test('Should be able to define schema with string type', () => {
  const schema1 = y.string()
  type Schema2 = YrelSchema<string>
  type Data1 = InferYrel<typeof schema1>
  type Data2 = InferYrel<Schema2>
  type Result = Data1 extends Data2 ? (Data2 extends Data1 ? true : false) : false
  true satisfies Result
})

test('Should be able to define schema with array type', () => {
  const schema1 = y.array(y.string())
  type Schema2 = YrelSchema<string[]>
  type Data1 = InferYrel<typeof schema1>
  type Data2 = InferYrel<Schema2>
  type Result = Data1 extends Data2 ? (Data2 extends Data1 ? true : false) : false
  true satisfies Result
})

test('Should be able to define schema with object type', () => {
  const schema1 = y.object({ a: y.number(), b: y.string() })
  type Schema2 = YrelSchema<{ a: number; b: string }>
  type Data1 = InferYrel<typeof schema1>
  type Data2 = InferYrel<Schema2>
  type Result = Data1 extends Data2 ? (Data2 extends Data1 ? true : false) : false
  true satisfies Result
})
