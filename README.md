![](https://github.com/romelperez/yrel/raw/main/yrel.jpg)

# Yrel

[![version](https://img.shields.io/npm/y/yrel.svg)](https://npmjs.org/package/yrel)
[![tests](https://github.com/romelperez/yrel/workflows/tests/badge.svg)](https://github.com/romelperez/yrel/actions)
[![codefactor](https://www.codefactor.io/repository/github/romelperez/yrel/badge)](https://www.codefactor.io/repository/github/romelperez/yrel)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/yrel.svg)](https://bundlephobia.com/package/yrel)
[![downloads](https://img.shields.io/npm/dm/yrel.svg)](https://npmjs.org/package/yrel)
[![github stars](https://img.shields.io/github/stars/romelperez/yrel.svg?style=social&label=stars)](https://github.com/romelperez/yrel)
[![license](https://img.shields.io/github/license/romelperez/yrel.svg)](https://github.com/romelperez/yrel/blob/main/LICENSE)

~2.3kB JavaScript JSON schema validation with TypeScript type inference.

## Install

For any ESM and CommonJS JavaScript environment. If TypeScript is used, version 4.5+ is required.

```bash
npm install yrel
```

For UMD version:

```ts
import { y } from 'yrel/build/umd/yrel.umd.cjs'
```

```html
<script src="https://cdn.jsdelivr.net/npm/yrel/build/umd/yrel.umd.cjs" />
```

```html
<script src="https://unpkg.com/yrel/build/umd/yrel.umd.cjs" />
```

## Basic Usage

```ts
import { y, validateYrel } from 'yrel'

const schema = y.object({
  name: y.string().min(2),
  age: y.number().gte(18)
})

const data = {
  name: 'yrel',
  age: 21
}

const validation = validateYrel(schema, data)

console.log(validation.isValid) // true
console.log(validation.data) // { name: 'yrel', age: 21 }
console.log(validation.issues) // []
```

`validation.data` is just passed from the received data with the type of the schema
if it is valid. Otherwise, it would be `undefined`.

## Type Inference

```ts
import { y, type InferYrel } from 'yrel'

const schema = y.object({
  name: y.string().min(2).max(100),
  age: y.number().gte(18).lte(150).optional(),
  pets: y.array(y.string()).min(2).max(10)
})

type Schema = InferYrel<typeof schema>
/*
{
  name: string;
  age?: number | undefined;
  pets: string[]
}
*/

const data = {
  name: 'yrel',
  age: 21,
  pets: ['dog', 'cat']
} satisfies Schema
```

## Optional and Nullable

All schemas can be optional and/or nullable.

```ts
const schema = y.string().optional()
type Schema = InferYrel<typeof schema> // string | undefined
```

```ts
const schema = y.number().nullable()
type Schema = InferYrel<typeof schema> // number | null
```

```ts
const schema = y.object({
  name: y.string().optional(),
  age: y.number().nullable(),
  is_married: y.boolean().optional().nullable()
})
type Schema = InferYrel<typeof schema>
/*
{
  name?: string | undefined
  age: number | null
  is_married?: boolean | undefined | null
}
*/
```

The methods should be called at the end of schema definition.

## Error Handling

Yrel provides a set of validators with predefined error codes for the error report.

```ts
import { y, validateYrel } from 'yrel'

const schema = y.object({
  name: y.string().min(2),
  age: y.number().gte(18)
})

const validation = validateYrel(schema, {
  name: true,
  age: 12
})

console.log(validation.isValid) // false
console.log(validation.data) // undefined
console.log(validation.issues)
/*
[
  {
    "key": "name",
    "errors": [
      ["err_string"]
    ]
  },
  {
    "key": "age",
    "errors": [
      ["err_number_gte", { "gte": 18 }]
    ]
  }
]
*/
```

The report error `key` is a string with the path to the schema which reported
the error joined by dots. For arrays and tuples, the item index is used.

```ts
import { y, validateYrel } from 'yrel'

const schema = y.object({
  users: y.array(
    y.object({
      name: y.string(),
      pets: y.array(y.string())
    })
  )
})
const validation = validateYrel(schema, {
  users: [
    { name: 'a', pets: [] },
    { name: 'b', pets: ['cat', 100, 'dog', true] }
  ]
})

console.log(validation.issues)
/*
[
  {
    "key": "users.1.pets.1",
    "errors": [
      ["err_string"]
    ]
  },
  {
    "key": "users.1.pets.3",
    "errors": [
      ["err_string"]
    ]
  }
]
*/
```

If the error is in the root schema, the key is an empty string.

```ts
import { y, validateYrel } from 'yrel'

const schema = y.string()
const validation = validateYrel(schema, 100)

console.log(validation.issues)
/*
[
  {
    "key": "",
    "errors": [
      ["err_string"]
    ]
  }
]
*/
```

A custom root key can be configured too with `validateYrel(schema, data, { rootKey: 'root' })`.

## Custom Validators

All schemas support the `.validateYrel(value => YrelValidation)` method to add custom
validators. They must return either `true` or a list of errors. Every error is tuple
with the predefined error code and the according parameters if applicable.

Validators libraries such as [validator](https://npmjs.com/package/validator) can
be used for more custom validations.

```ts
import { y, validateYrel, type YrelValidation } from 'yrel'
import isEmail from 'validator/lib/isEmail'

const validateEmail = (value: string): YrelValidation =>
  isEmail(String(value)) || [['err_string_email']]

const schema = y.object({
  name: y.string().min(2),
  age: y.number().gte(18),
  email: y.string().validateYrel(validateEmail)
})

const validation = validateYrel(schema, {
  name: 'yrel',
  age: 18,
  email: 'yrel@example'
})

console.log(validation.isValid) // false
console.log(validation.issues)
/*
[
  {
    "key": "email",
    "errors": [
      ["err_string_email"]
    ]
  }
]
*/
```

Yrel comes with a predefined list of error codes with possible extra parameters for
the error report. The following is a list of them. If the type to the right is `undefined`
it says that it does not require parameters.

- `err_unknown: undefined`
- `err_boolean: undefined`
- `err_boolean_truthy: undefined`
- `err_number: undefined`
- `err_number_gt: [{ gt: number }]`
- `err_number_gte: [{ gte: number }]`
- `err_number_lt: [{ lt: number }]`
- `err_number_lte: [{ lte: number }]`
- `err_number_integer: undefined`
- `err_number_currency: undefined`
- `err_string: undefined`
- `err_string_nonempty: undefined`
- `err_string_trim: undefined`
- `err_string_length: [{ length: number }]`
- `err_string_min: [{ min: number }]`
- `err_string_max: [{ max: number }]`
- `err_string_date_time: undefined`
- `err_string_date: undefined`
- `err_string_time: undefined`
- `err_string_lowercase: undefined`
- `err_string_uppercase: undefined`
- `err_string_capitalcase: undefined`
- `err_string_email: undefined`
- `err_string_credit_card: undefined`
- `err_string_url: undefined`
- `err_string_uuid: undefined`
- `err_literal: [{ literal: boolean | number | string }]`
- `err_array: undefined`
- `err_array_nonempty: undefined`
- `err_array_length: [{ length: number }]`
- `err_array_min: [{ min: number }]`
- `err_array_max: [{ max: number }]`
- `err_union: undefined`
- `err_tuple: undefined`
- `err_object: undefined`
- `err_object_unexpected_props: [{ props: string[] }]`

One error with parameters can be the `err_number_gte` which requires the parameter
`gte: number`, so the report may be `['err_number_gte', { gte: 18 }]`.

## Custom Error Reports

Validators can return custom error reports. They need to be expressed as a tuple
`['err_custom', string, object?]`.

```ts
import { y, validateYrel, type YrelValidation } from 'yrel'

// Check that the string has the format "xxx-xxx".
const validateUserId = (value: string): YrelValidation =>
  (/^\w{3,3}-\w{3,3}$/).test(value) || [['err_custom', 'my_custom_error_invalid_user_id']]

const schema = y.object({
  id: y.string().validateYrel(validateUserId),
  name: y.string().min(2),
  age: y.number().gte(18),
  pets: y.array(
    y.union(
      [y.literal('dog'), y.literal('cat'), y.literal('parrot')],
      { errors: [['err_custom', 'my_custom_error_invalid_pet']] }
    )
  )
})

const validation = validateYrel(schema, {
  id: 'abc-d',
  name: 'yrel',
  age: 18,
  pets: ['cat', 'monkey', 'dog', 'fish']
})

console.log(validation.isValid) // false
console.log(validation.issues)
/*
[
  {
    "key": "id",
    "errors": [
      ["err_custom", "my_custom_error_invalid_user_id"]
    ]
  },
  {
    "key": "pets.1",
    "errors": [
      ["err_custom", "my_custom_error_invalid_pet"]
    ]
  },
  {
    "key": "pets.3",
    "errors": [
      ["err_custom", "my_custom_error_invalid_pet"]
    ]
  }
]
*/
```

## Schema Detection

```ts
import { y, isSchema } from 'yrel'

const fakeSchema = {}
const validSchema = y.string()

console.log(isSchema(fakeSchema)) // false
console.log(isSchema(validSchema)) // true
```

## API

### `y.any(): DataSchemaAny`

Any kind of value.

```ts
const schema = y.any() // any
```

### `y.boolean(): DataSchemaBoolean`

Boolean values.

```ts
const schema = y.boolean() // boolean
```

#### `.truthy()`

Only `true` values.

### `y.number(): DataSchemaNumber`

Numeric and finite numbers.

```ts
const schema = y.number() // number
```

#### `.gt(value: number)`

A number greater than the defined value.

#### `.gte(value: number)`

A number greater than or equal to the defined value.

#### `.lt(value: number)`

A number less than the defined value.

#### `.lte(value: number)`

A number less than or equal to the defined value.

#### `.integer()`

A safe integer number.

### `y.string(): DataSchemaString`

A string value.

```ts
const schema = y.string() // string
```

To validateYrel an optional nonempty string validation, it can be done like this:

```ts
const schema = y.union([y.string().date(), y.literal('')])
validateYrel(schema, '2000-10-10') // is valid
validateYrel(schema, '') // is valid
```

#### `.nonempty()`

Non empty string.

#### `.trim()`

A string without spaces at the beginning or end.

#### `.length(value: number)`

A string with specified length.

#### `.min(value: number)`

A string with at least the specified length.

#### `.max(value: number)`

A string with at most the specified length.

#### `.datetime(value: number)`

A valid datetime string in ISO 8601 format. e.g. `2050-10-25T14:45:30.370Z`.

#### `.date(value: number)`

A valid date string fragment of the ISO 8601 format. e.g. `2050-10-25`.

#### `.time(value: number)`

A valid time string fragment of the ISO 8601 format. e.g. `14:45:30.370`.

#### `.lowercase()`

A string in lowercase.

#### `.uppercase()`

A string in uppercase.

#### `.capitalcase(conf?: { lower?: boolean })`

A string in capital case. By default, it allows any uppercase characters such as `Abc Def`
or `ABc DEF`. If `.capitalcase({ lower: true })` is defined, it will only accept lowercase
chactaters for non-first letters such as `Abc Def`.

### `y.literal(value: boolean | number | string): YrelSchemaLiteral`

A literal primitive value.

```ts
const schema = y.literal('cat') // 'cat'
```

### `y.array(schema: DataSchema)`

An array of the specified schema.

```ts
const schema = y.array(y.string()) // string[]
```

#### `.nonempty()`

Non empty arrays.

#### `.length(value: number)`

An array of the specified length.

#### `.min(value: number)`

An array of at least the specified length.

#### `.max(value: number)`

An array of at most the specified length.

### `y.union(schemas: [DataSchema, DataSchema, ...DataSchema[]]): DataSchemaUnion`

A value that matches one of the specified schemas.

```ts
const schema = y.union([
  y.number(),
  y.literal('cat'),
  y.literal('dog'),
  y.literal('parrot')
])
// number | 'cat' | 'dog' | 'parrot'
```

For dynamically created union of literals, the dynamic types can be set like:

```ts
import { type YrelSchemaLiteral } from 'yrel'

type Languages = 'en' | 'es' | 'fr' | 'hi' | 'zh'
const languages: Languages[] = ['en', 'es', 'fr', 'hi', 'zh']

const schema = y.union<[YrelSchemaLiteral<Languages>, YrelSchemaLiteral<Languages>]>(
  languages.map(lang => y.literal(lang)) as [
    YrelSchemaLiteral<Languages>,
    YrelSchemaLiteral<Languages>
  ]
)
type Schema = InferYrel<typeof schema> // 'en' | 'es' | 'fr' | 'hi' | 'zh'
```

### `y.tuple(schemas: [DataSchema, ...DataSchema[]]): DataSchemaTuple`

An array with fixed number of elements and each of them with a specific data schema.

```ts
const schema = y.tuple([
  y.number(),
  y.string(),
  y.boolean().optional()
])
// [number, string, boolean | undefined]
```

### `y.object(shape: Record<string, DataSchema>): DataSchemaObject`

A plain object and each property with the specified data schema.

```ts
const schema = y.object({
  name: y.string(),
  age: y.number()
})
// { name: string; age: number; }
```

#### `.shape`

The object shape structure.

#### `.passthrough()`

By default the object data schema will report an error if the validated object contains
unexpected properties which are not defined in the schema shape. This will disable the error.

## Logo

The Yrel logo is an [illustration](https://kuridelblack.tumblr.com/post/189438276843/yrel-light-of-hope)
of the character [Yrel](https://wowpedia.fandom.com/wiki/Yrel) in the game
[World of Warcraft](https://worldofwarcraft.blizzard.com) from the awesome illustrator
**[@KuridelBlack](https://twitter.com/KuridelBlack)**. Check out her work at
[linktr.ee/kuridelblack](https://linktr.ee/kuridelblack).
