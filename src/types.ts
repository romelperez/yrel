/* eslint-disable no-use-before-define */

import type {
  YREL,
  YREL_OPTIONAL,
  YREL_NULLABLE,
  YREL_ANY,
  YREL_BOOLEAN,
  YREL_NUMBER,
  YREL_STRING,
  YREL_LITERAL,
  YREL_ARRAY,
  YREL_UNION,
  YREL_TUPLE,
  YREL_OBJECT,
  YREL_RECORD
} from './constants'

// Validation and Error Handling

export type YrelErrorTranslations = {
  err_unknown: undefined
  err_boolean: undefined
  err_boolean_truthy: undefined
  err_number: undefined
  err_number_gt: [{ gt: number }]
  err_number_gte: [{ gte: number }]
  err_number_lt: [{ lt: number }]
  err_number_lte: [{ lte: number }]
  err_number_integer: undefined
  err_number_currency: undefined
  err_string: undefined
  err_string_nonempty: undefined
  err_string_trim: undefined
  err_string_length: [{ length: number }]
  err_string_min: [{ min: number }]
  err_string_max: [{ max: number }]
  err_string_date_time: undefined
  err_string_date: undefined
  err_string_time: undefined
  err_string_lowercase: undefined
  err_string_uppercase: undefined
  err_string_capitalcase: [{ lower: boolean }]
  err_string_email: undefined
  err_string_credit_card: undefined
  err_string_url: undefined
  err_string_uuid: undefined
  err_literal: [{ literal: boolean | number | string }]
  err_array: undefined
  err_array_nonempty: undefined
  err_array_length: [{ length: number }]
  err_array_min: [{ min: number }]
  err_array_max: [{ max: number }]
  err_union: undefined
  err_tuple: undefined
  err_object: undefined
  err_object_unexpected_props: [{ props: string[] }]
  err_record: undefined
  err_record_keys: [{ keys: string[] }]
}

export type YrelError =
  | ['err_custom', string, unknown?]
  | {
    [P in keyof YrelErrorTranslations]: undefined extends YrelErrorTranslations[P]
      ? [P]
      : YrelErrorTranslations[P] extends unknown[]
        ? [P, YrelErrorTranslations[P][0]]
        : never
  }[keyof YrelErrorTranslations]

export type YrelChecker<Data = unknown, Cache = YrelCache> = (data: Data, cache: Cache) => boolean

export type YrelValidation = true | YrelError[]

export type YrelValidator<Data = unknown, Cache = YrelCache> = (
  data: Data,
  cache: Cache
) => YrelValidation

export type YrelResolution<Data = unknown> = {
  key: string
  isValid: boolean
  data: Data
  errors: YrelError[]
  children: YrelResolution[]
}

export type YrelResolverContext = {
  key: string
}

export type YrelResolver<Data = unknown> = (
  data: Data,
  cache: YrelCache,
  context: YrelResolverContext
) => YrelResolution

// Schemas

export type YrelCache = {
  isOptional?: boolean
  isNullable?: boolean
  coerce?: boolean
  passthroughObjectProps?: boolean
}

export interface YrelSchema<Data = any> {
  __type: typeof YREL
  __name:
  | typeof YREL
  | typeof YREL_OPTIONAL
  | typeof YREL_NULLABLE
  | typeof YREL_ANY
  | typeof YREL_BOOLEAN
  | typeof YREL_NUMBER
  | typeof YREL_STRING
  | typeof YREL_LITERAL
  | typeof YREL_ARRAY
  | typeof YREL_UNION
  | typeof YREL_TUPLE
  | typeof YREL_OBJECT
  | typeof YREL_RECORD
  /**
   * The data cache is an object which stores persistent configuration state of
   * the schema, such as if the schema data can be optional or not.
   */
  __cache: YrelCache
  /**
   * A check will see if the schema may run its validations or not. For example,
   * if the data is optional and it is `undefined`, then skip validations and
   * mark it as valid.
   */
  __checkers: Array<YrelChecker<Data>>
  /**
   * The resolvers verifies that the base data structure of the schema data is correct
   * before going to the validators. For example, if it is going to resolve an array
   * schema, it checks that every item of the array matches the specified schema.
   */
  __resolvers: Array<YrelResolver<Data>>
  /**
   * The validator functions the data has to match to the schema definition.
   * All of them have to be valid to mark the data as valid.
   */
  __validators: Array<YrelValidator<Data>>
  validate: (validate: YrelValidator<Data>) => YrelSchema<Data>
}

export interface YrelSchemaOptional<Schema extends YrelSchema> extends YrelSchema {
  __name: typeof YREL_OPTIONAL
  nullable: () => YrelSchemaOptional<YrelSchemaNullable<Schema>>
}

export interface YrelSchemaNullable<Schema extends YrelSchema> extends YrelSchema {
  __name: typeof YREL_NULLABLE
  optional: () => YrelSchemaNullable<YrelSchemaOptional<Schema>>
}

export type YrelValidationInSchemaConfig = { errors: YrelError[] }

type YrelValidatorInSchemaWrapper<V extends (...args: any[]) => YrelSchema> = (
  ...params: [...Parameters<V>, YrelValidationInSchemaConfig?]
) => ReturnType<V>

export interface YrelSchemaBoolean extends YrelSchema<boolean> {
  __name: typeof YREL_BOOLEAN
  coerce: () => YrelSchemaBoolean
  optional: () => YrelSchemaOptional<YrelSchemaBoolean>
  nullable: () => YrelSchemaNullable<YrelSchemaBoolean>
  validate: (validate: YrelValidator<boolean>) => YrelSchemaBoolean
  truthy: YrelValidatorInSchemaWrapper<() => YrelSchemaBoolean>
}

export interface YrelSchemaNumber extends YrelSchema<number> {
  __name: typeof YREL_NUMBER
  coerce: () => YrelSchemaNumber
  optional: () => YrelSchemaOptional<YrelSchemaNumber>
  nullable: () => YrelSchemaNullable<YrelSchemaNumber>
  validate: (validate: YrelValidator<number>) => YrelSchemaNumber
  gt: YrelValidatorInSchemaWrapper<(gt: number) => YrelSchemaNumber>
  gte: YrelValidatorInSchemaWrapper<(gte: number) => YrelSchemaNumber>
  lt: YrelValidatorInSchemaWrapper<(lt: number) => YrelSchemaNumber>
  lte: YrelValidatorInSchemaWrapper<(lte: number) => YrelSchemaNumber>
  integer: YrelValidatorInSchemaWrapper<() => YrelSchemaNumber>
}

export interface YrelSchemaString extends YrelSchema<string> {
  __name: typeof YREL_STRING
  coerce: () => YrelSchemaString
  optional: () => YrelSchemaOptional<YrelSchemaString>
  nullable: () => YrelSchemaNullable<YrelSchemaString>
  validate: (validate: YrelValidator<string>) => YrelSchemaString
  nonempty: YrelValidatorInSchemaWrapper<() => YrelSchemaString>
  trim: YrelValidatorInSchemaWrapper<() => YrelSchemaString>
  length: YrelValidatorInSchemaWrapper<(value: number) => YrelSchemaString>
  min: YrelValidatorInSchemaWrapper<(min: number) => YrelSchemaString>
  max: YrelValidatorInSchemaWrapper<(max: number) => YrelSchemaString>
  datetime: YrelValidatorInSchemaWrapper<() => YrelSchemaString>
  date: YrelValidatorInSchemaWrapper<() => YrelSchemaString>
  time: YrelValidatorInSchemaWrapper<() => YrelSchemaString>
  lowercase: YrelValidatorInSchemaWrapper<() => YrelSchemaString>
  uppercase: YrelValidatorInSchemaWrapper<() => YrelSchemaString>
  capitalcase: YrelValidatorInSchemaWrapper<(conf?: { lower?: boolean }) => YrelSchemaString>
}

// Literals have no default generic values.
export interface YrelSchemaLiteral<Data extends boolean | number | string> extends YrelSchema<Data> {
  __name: typeof YREL_LITERAL
  optional: () => YrelSchemaOptional<YrelSchemaLiteral<Data>>
  nullable: () => YrelSchemaNullable<YrelSchemaLiteral<Data>>
  validate: (validate: YrelValidator<Data>) => YrelSchemaLiteral<Data>
}

export interface YrelSchemaArray<Structure extends YrelSchema = YrelSchema> extends YrelSchema<Array<InferYrel<Structure>>> {
  __name: typeof YREL_ARRAY
  optional: () => YrelSchemaOptional<YrelSchemaArray<Structure>>
  nullable: () => YrelSchemaNullable<YrelSchemaArray<Structure>>
  validate: (validate: YrelValidator<Array<InferYrel<Structure>>>) => YrelSchemaArray<Structure>
  nonempty: YrelValidatorInSchemaWrapper<() => YrelSchemaArray<Structure>>
  length: YrelValidatorInSchemaWrapper<(min: number) => YrelSchemaArray<Structure>>
  min: YrelValidatorInSchemaWrapper<(min: number) => YrelSchemaArray<Structure>>
  max: YrelValidatorInSchemaWrapper<(max: number) => YrelSchemaArray<Structure>>
}

export interface YrelSchemaUnion<
  Structures extends [YrelSchema, YrelSchema, ...YrelSchema[]] = [YrelSchema, YrelSchema]
> extends YrelSchema<InferYrel<Structures[number]>> {
  __name: typeof YREL_UNION
  optional: () => YrelSchemaOptional<YrelSchemaUnion<Structures>>
  nullable: () => YrelSchemaNullable<YrelSchemaUnion<Structures>>
  validate: (validate: YrelValidator<InferYrel<Structures[number]>>) => YrelSchemaUnion<Structures>
}

export interface YrelSchemaTuple<
  Structures extends [YrelSchema, ...YrelSchema[]] = [YrelSchema],
  RestStructure extends YrelSchema | undefined = undefined
> extends YrelSchema<
  RestStructure extends YrelSchema
    ? [...InferYrel<Structures>, ...Array<InferYrel<RestStructure>>]
    : InferYrel<Structures>
  > {
  __name: typeof YREL_TUPLE
  optional: () => YrelSchemaOptional<YrelSchemaTuple<Structures, RestStructure>>
  nullable: () => YrelSchemaNullable<YrelSchemaTuple<Structures, RestStructure>>
  validate: (
    validate: YrelValidator<RestStructure extends YrelSchema
      ? [...InferYrel<Structures>, ...Array<InferYrel<RestStructure>>]
      : InferYrel<Structures>>
  ) => YrelSchemaTuple<Structures, RestStructure>
}

export interface YrelSchemaObject<
  Shape extends Record<string, YrelSchema> = Record<string, YrelSchema>
> extends YrelSchema<{ [P in keyof Shape]: InferYrel<Shape[P]> }> {
  __name: typeof YREL_OBJECT
  shape: Shape
  optional: () => YrelSchemaOptional<YrelSchemaObject<Shape>>
  nullable: () => YrelSchemaNullable<YrelSchemaObject<Shape>>
  passthrough: () => YrelSchemaObject<Shape>
  validate: (validate: YrelValidator<{ [P in keyof Shape]: InferYrel<Shape[P]> }>) => YrelSchemaObject<Shape>
}

export interface YrelSchemaRecord<
  Key extends YrelSchemaString,
  Value extends YrelSchema
> extends YrelSchema<Record<InferYrel<Key>, InferYrel<Value>>> {
  __name: typeof YREL_RECORD
  optional: () => YrelSchemaOptional<YrelSchemaRecord<Key, Value>>
  nullable: () => YrelSchemaNullable<YrelSchemaRecord<Key, Value>>
  validate: (validate: YrelValidator<Record<InferYrel<Key>, InferYrel<Value>>>) => YrelSchemaRecord<Key, Value>
}

export interface YrelSchemaAny<Data = any> extends YrelSchema<Data> {
  __name: typeof YREL_ANY
  validate: (validate: YrelValidator<Data>) => YrelSchemaAny<Data>
}

// Utilities

type InferObjectOptionalPropsType<Schema extends YrelSchemaObject> =
  Schema extends YrelSchemaObject<infer Shape>
    ? {
        [X in keyof Shape]: undefined extends InferYrel<Shape[X]> ? true : never
      }[keyof Shape]
    : never

type InferObjectNonOptionalPropsType<Schema extends YrelSchemaObject> =
  Schema extends YrelSchemaObject<infer Shape>
    ? {
        [X in keyof Shape]: undefined extends InferYrel<Shape[X]> ? never : true
      }[keyof Shape]
    : never

type InferObjectType<Schema extends YrelSchemaObject> =
  Schema extends YrelSchemaObject<infer Shape>
    ? true extends InferObjectOptionalPropsType<Schema>
      ? true extends InferObjectNonOptionalPropsType<Schema>
        ? ({
            // Required properties.
            [X in keyof Shape as undefined extends InferYrel<Shape[X]> ? never : X]: InferYrel<Shape[X]>
          } & {
            // Optional properties.
            [X in keyof Shape as undefined extends InferYrel<Shape[X]> ? X : never]?: InferYrel<Shape[X]>
          })
        : { [X in keyof Shape]?: InferYrel<Shape[X]> }
      : { [X in keyof Shape]: InferYrel<Shape[X]> }
    : never

export type InferYrel<Schema extends YrelSchema | YrelSchema[]> =
  Schema extends YrelSchemaOptional<infer Inner>
    ? InferYrel<Inner> | undefined
    : Schema extends YrelSchemaNullable<infer Inner>
      ? InferYrel<Inner> | null
      : Schema extends YrelSchemaObject<any>
        ? InferObjectType<Schema>
        : Schema extends YrelSchema[]
          ? {
              [Index in keyof Schema]: Schema[Index] extends YrelSchema
                ? InferYrel<Schema[Index]>
                : never
            }
          : Schema extends YrelSchema<infer Data>
            ? Data
            : never
