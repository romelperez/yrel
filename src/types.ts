/* eslint-disable no-use-before-define */

import type {
  SCHEMA,
  SCHEMA_OPTIONAL,
  SCHEMA_NULLABLE,
  SCHEMA_ANY,
  SCHEMA_BOOLEAN,
  SCHEMA_NUMBER,
  SCHEMA_STRING,
  SCHEMA_LITERAL,
  SCHEMA_ARRAY,
  SCHEMA_UNION,
  SCHEMA_TUPLE,
  SCHEMA_OBJECT
} from './constants'

// Validation and Error Handling

export type DataErrorTranslations = {
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
  err_string_capitalcase: undefined
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
}

export type DataError =
  | ['err_custom', string, unknown?]
  | {
    [P in keyof DataErrorTranslations]: undefined extends DataErrorTranslations[P]
      ? [P]
      : DataErrorTranslations[P] extends unknown[]
        ? [P, DataErrorTranslations[P][0]]
        : never
  }[keyof DataErrorTranslations]

export type DataChecker<Data = unknown, Cache = DataCache> = (data: Data, cache: Cache) => boolean

export type DataValidation = true | DataError[]

export type DataValidator<Data = unknown, Cache = DataCache> = (
  data: Data,
  cache: Cache
) => DataValidation

export type DataResolution = {
  key: string
  isValid: boolean
  errors: DataError[]
  children: DataResolution[]
}

export type DataResolverContext = {
  key: string
}

export type DataResolver<Data = unknown> = (
  data: Data,
  cache: DataCache,
  context: DataResolverContext
) => DataResolution

// Schemas

export type DataCache = {
  isOptional?: boolean
  isNullable?: boolean
  passthroughObjectProps?: boolean
}

export interface DataSchema<Data = any> {
  __type: typeof SCHEMA
  __name:
  | typeof SCHEMA
  | typeof SCHEMA_OPTIONAL
  | typeof SCHEMA_NULLABLE
  | typeof SCHEMA_ANY
  | typeof SCHEMA_BOOLEAN
  | typeof SCHEMA_NUMBER
  | typeof SCHEMA_STRING
  | typeof SCHEMA_LITERAL
  | typeof SCHEMA_ARRAY
  | typeof SCHEMA_UNION
  | typeof SCHEMA_TUPLE
  | typeof SCHEMA_OBJECT
  /**
   * The data cache is an object which stores persistent configuration state of
   * the schema, such as if the schema data can be optional or not.
   */
  __cache: DataCache
  /**
   * A check will see if the schema may run its validations or not. For example,
   * if the data is optional and it is `undefined`, then skip validations and
   * mark it as valid.
   */
  __checkers: Array<DataChecker<Data>>
  /**
   * The resolvers verifies that the base data structure of the schema data is correct
   * before going to the validators. For example, if it is going to resolve an array
   * schema, it checks that every item of the array matches the specified schema.
   */
  __resolvers: Array<DataResolver<Data>>
  /**
   * The validator functions the data has to match to the schema definition.
   * All of them have to be valid to mark the data as valid.
   */
  __validators: Array<DataValidator<Data>>
  validate: (validate: DataValidator<Data>) => DataSchema<Data>
}

export interface DataSchemaOptional<Schema extends DataSchema> extends DataSchema {
  __name: typeof SCHEMA_OPTIONAL
  nullable: () => DataSchemaOptional<DataSchemaNullable<Schema>>
}

export interface DataSchemaNullable<Schema extends DataSchema> extends DataSchema {
  __name: typeof SCHEMA_NULLABLE
  optional: () => DataSchemaNullable<DataSchemaOptional<Schema>>
}

export type DataValidationInSchemaConfig = { errors: DataError[] }

type DataValidatorInSchemaWrapper<V extends (...args: any[]) => DataSchema> = (
  ...params: [...Parameters<V>, DataValidationInSchemaConfig?]
) => ReturnType<V>

export interface DataSchemaBoolean extends DataSchema<boolean> {
  __name: typeof SCHEMA_BOOLEAN
  optional: () => DataSchemaOptional<DataSchemaBoolean>
  nullable: () => DataSchemaNullable<DataSchemaBoolean>
  validate: (validate: DataValidator<boolean>) => DataSchemaBoolean
  truthy: DataValidatorInSchemaWrapper<() => DataSchemaBoolean>
}

export interface DataSchemaNumber extends DataSchema<number> {
  __name: typeof SCHEMA_NUMBER
  optional: () => DataSchemaOptional<DataSchemaNumber>
  nullable: () => DataSchemaNullable<DataSchemaNumber>
  validate: (validate: DataValidator<number>) => DataSchemaNumber
  gt: DataValidatorInSchemaWrapper<(gt: number) => DataSchemaNumber>
  gte: DataValidatorInSchemaWrapper<(gte: number) => DataSchemaNumber>
  lt: DataValidatorInSchemaWrapper<(lt: number) => DataSchemaNumber>
  lte: DataValidatorInSchemaWrapper<(lte: number) => DataSchemaNumber>
  integer: DataValidatorInSchemaWrapper<() => DataSchemaNumber>
}

export interface DataSchemaString extends DataSchema<string> {
  __name: typeof SCHEMA_STRING
  optional: () => DataSchemaOptional<DataSchemaString>
  nullable: () => DataSchemaNullable<DataSchemaString>
  validate: (validate: DataValidator<string>) => DataSchemaString
  nonempty: DataValidatorInSchemaWrapper<() => DataSchemaString>
  trim: DataValidatorInSchemaWrapper<() => DataSchemaString>
  length: DataValidatorInSchemaWrapper<(value: number) => DataSchemaString>
  min: DataValidatorInSchemaWrapper<(min: number) => DataSchemaString>
  max: DataValidatorInSchemaWrapper<(max: number) => DataSchemaString>
  datetime: DataValidatorInSchemaWrapper<() => DataSchemaString>
  date: DataValidatorInSchemaWrapper<() => DataSchemaString>
  time: DataValidatorInSchemaWrapper<() => DataSchemaString>
  lowercase: DataValidatorInSchemaWrapper<() => DataSchemaString>
  uppercase: DataValidatorInSchemaWrapper<() => DataSchemaString>
  capitalcase: DataValidatorInSchemaWrapper<() => DataSchemaString>
}

// Literals have no default generic values.
export interface DataSchemaLiteral<Data extends boolean | number | string> extends DataSchema<Data> {
  __name: typeof SCHEMA_LITERAL
  optional: () => DataSchemaOptional<DataSchemaLiteral<Data>>
  nullable: () => DataSchemaNullable<DataSchemaLiteral<Data>>
  validate: (validate: DataValidator<Data>) => DataSchemaLiteral<Data>
}

export interface DataSchemaArray<Structure extends DataSchema = DataSchema> extends DataSchema<Array<InferDataSchemaType<Structure>>> {
  __name: typeof SCHEMA_ARRAY
  optional: () => DataSchemaOptional<DataSchemaArray<Structure>>
  nullable: () => DataSchemaNullable<DataSchemaArray<Structure>>
  validate: (validate: DataValidator<Array<InferDataSchemaType<Structure>>>) => DataSchemaArray<Structure>
  nonempty: DataValidatorInSchemaWrapper<() => DataSchemaArray<Structure>>
  length: DataValidatorInSchemaWrapper<(min: number) => DataSchemaArray<Structure>>
  min: DataValidatorInSchemaWrapper<(min: number) => DataSchemaArray<Structure>>
  max: DataValidatorInSchemaWrapper<(max: number) => DataSchemaArray<Structure>>
}

export interface DataSchemaUnion<
  Structures extends [DataSchema, DataSchema, ...DataSchema[]] = [DataSchema, DataSchema]
> extends DataSchema<InferDataSchemaType<Structures[number]>> {
  __name: typeof SCHEMA_UNION
  optional: () => DataSchemaOptional<DataSchemaUnion<Structures>>
  nullable: () => DataSchemaNullable<DataSchemaUnion<Structures>>
  validate: (validate: DataValidator<InferDataSchemaType<Structures[number]>>) => DataSchemaUnion<Structures>
}

export interface DataSchemaTuple<
  Structures extends [DataSchema, ...DataSchema[]] = [DataSchema],
  RestStructure extends DataSchema | undefined = undefined
> extends DataSchema<
  RestStructure extends DataSchema
    ? [...InferDataSchemaType<Structures>, ...Array<InferDataSchemaType<RestStructure>>]
    : InferDataSchemaType<Structures>
  > {
  __name: typeof SCHEMA_TUPLE
  optional: () => DataSchemaOptional<DataSchemaTuple<Structures, RestStructure>>
  nullable: () => DataSchemaNullable<DataSchemaTuple<Structures, RestStructure>>
  validate: (
    validate: DataValidator<RestStructure extends DataSchema
      ? [...InferDataSchemaType<Structures>, ...Array<InferDataSchemaType<RestStructure>>]
      : InferDataSchemaType<Structures>>
  ) => DataSchemaTuple<Structures, RestStructure>
}

export interface DataSchemaObject<
  Shape extends Record<string, DataSchema> = Record<string, DataSchema>
> extends DataSchema<{ [P in keyof Shape]: InferDataSchemaType<Shape[P]> }> {
  __name: typeof SCHEMA_OBJECT
  shape: Shape
  optional: () => DataSchemaOptional<DataSchemaObject<Shape>>
  nullable: () => DataSchemaNullable<DataSchemaObject<Shape>>
  passthrough: () => DataSchemaObject<Shape>
  validate: (validate: DataValidator<{ [P in keyof Shape]: InferDataSchemaType<Shape[P]> }>) => DataSchemaObject<Shape>
}

export interface DataSchemaAny<Data = unknown> extends DataSchema<Data> {
  __name: typeof SCHEMA_ANY
  validate: (validate: DataValidator<Data>) => DataSchemaAny<Data>
}

// Utilities

type InferArrayType<Schema extends DataSchemaArray> =
  Schema extends DataSchemaArray<infer Structure>
    ? Array<InferDataSchemaType<Structure>>
    : never

type InferUnionType<Schema extends DataSchemaUnion> =
  Schema extends DataSchemaUnion<infer Structures>
    ? InferDataSchemaType<Structures[number]>
    : never

type InferTupleListType<Structures extends [DataSchema, ...DataSchema[]]> = {
  [Index in keyof Structures]: Structures[Index] extends DataSchema
    ? InferDataSchemaType<Structures[Index]>
    : never
}

type InferTupleType<Schema extends DataSchemaTuple> =
  Schema extends DataSchemaTuple<infer Structures, infer RestStructure>
    ?
      | (RestStructure extends DataSchema
        ? [...InferTupleListType<Structures>, ...Array<InferDataSchemaType<RestStructure>>]
        : InferTupleListType<Structures>)
    : never

type InferObjectType<Schema extends DataSchemaObject> =
  Schema extends DataSchemaObject<infer Shape>
    ?
      | ({
        // Required properties.
        [X in keyof Shape as undefined extends InferDataSchemaType<Shape[X]>
          ? never
          : X]: InferDataSchemaType<Shape[X]>
      } & {
        // Optional properties.
        [X in keyof Shape as undefined extends InferDataSchemaType<Shape[X]>
          ? X
          : never]?: InferDataSchemaType<Shape[X]>
      })
    : never

export type InferDataSchemaType<Schema extends DataSchema | DataSchema[]> =
  Schema extends DataSchemaOptional<infer Inner>
    ? InferDataSchemaType<Inner> | undefined
    : Schema extends DataSchemaNullable<infer Inner>
      ? InferDataSchemaType<Inner> | null
      : Schema extends DataSchemaArray<any>
        ? InferArrayType<Schema>
        : Schema extends DataSchemaUnion<any>
          ? InferUnionType<Schema>
          : Schema extends DataSchemaTuple<any, any>
            ? InferTupleType<Schema>
            : Schema extends DataSchemaObject<any>
              ? InferObjectType<Schema>
              : Schema extends DataSchema[]
                ? {
                    [Index in keyof Schema]: Schema[Index] extends DataSchema
                      ? InferDataSchemaType<Schema[Index]>
                      : never
                  }
                : Schema extends DataSchema<infer Data>
                  ? Data
                  : never
