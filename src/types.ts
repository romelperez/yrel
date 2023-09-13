/* eslint-disable no-use-before-define */

import type {
  SCHEMA,
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

export interface DataErrorTranslations {
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

export interface DataResolution {
  key: string
  isValid: boolean
  errors: DataError[]
  children: DataResolution[]
}

export interface DataResolverContext {
  key: string
}

export type DataResolver<Data = unknown> = (
  data: Data,
  cache: DataCache,
  context: DataResolverContext
) => DataResolution

// Schemas

export interface DataCache {
  isOptional?: boolean
  isNullable?: boolean
  passthroughObjectProps?: boolean
}

export interface DataSchema<Data = any> {
  __type: typeof SCHEMA
  __name:
  | typeof SCHEMA
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

export interface DataValidationInSchemaConfig { errors: DataError[] }

type DataValidatorInSchemaWrapper<V extends (...args: any[]) => DataSchema> = (
  ...params: [...Parameters<V>, DataValidationInSchemaConfig?]
) => ReturnType<V>

export interface DataSchemaBoolean<Data extends boolean | undefined | null = boolean>
  extends DataSchema<Data> {
  __name: typeof SCHEMA_BOOLEAN
  optional: () => DataSchemaBoolean<Data | undefined>
  nullable: () => DataSchemaBoolean<Data | null>
  validate: (validate: DataValidator<Data>) => DataSchemaBoolean<Data>
  truthy: DataValidatorInSchemaWrapper<() => DataSchemaBoolean<Data>>
}

export interface DataSchemaNumber<Data extends number | undefined | null = number>
  extends DataSchema<Data> {
  __name: typeof SCHEMA_NUMBER
  optional: () => DataSchemaNumber<Data | undefined>
  nullable: () => DataSchemaNumber<Data | null>
  validate: (validate: DataValidator<Data>) => DataSchemaNumber<Data>
  gt: DataValidatorInSchemaWrapper<(gt: number) => DataSchemaNumber<Data>>
  gte: DataValidatorInSchemaWrapper<(gte: number) => DataSchemaNumber<Data>>
  lt: DataValidatorInSchemaWrapper<(lt: number) => DataSchemaNumber<Data>>
  lte: DataValidatorInSchemaWrapper<(lte: number) => DataSchemaNumber<Data>>
  integer: DataValidatorInSchemaWrapper<() => DataSchemaNumber<Data>>
}

export interface DataSchemaString<Data extends string | undefined | null = string>
  extends DataSchema<Data> {
  __name: typeof SCHEMA_STRING
  optional: () => DataSchemaString<Data | undefined>
  nullable: () => DataSchemaString<Data | null>
  validate: (validate: DataValidator<Data>) => DataSchemaString<Data>
  nonempty: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
  trim: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
  length: DataValidatorInSchemaWrapper<(value: number) => DataSchemaString<Data>>
  min: DataValidatorInSchemaWrapper<(min: number) => DataSchemaString<Data>>
  max: DataValidatorInSchemaWrapper<(max: number) => DataSchemaString<Data>>
  datetime: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
  date: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
  time: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
  lowercase: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
  uppercase: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
  capitalcase: DataValidatorInSchemaWrapper<() => DataSchemaString<Data>>
}

// Literals have no default generic values.
export interface DataSchemaLiteral<Data extends boolean | number | string | undefined | null>
  extends DataSchema<Data> {
  __name: typeof SCHEMA_LITERAL
  optional: () => DataSchemaLiteral<Data | undefined>
  nullable: () => DataSchemaLiteral<Data | null>
  validate: (validate: DataValidator<Data>) => DataSchemaLiteral<Data>
}

export interface DataSchemaArray<
  Structure extends DataSchema = DataSchema,
  Data extends unknown[] | undefined | null = Array<InferDataSchemaType<Structure>>
> extends DataSchema<Data> {
  __name: typeof SCHEMA_ARRAY
  optional: () => DataSchemaArray<Structure, Data | undefined>
  nullable: () => DataSchemaArray<Structure, Data | null>
  validate: (validate: DataValidator<Data>) => DataSchemaArray<Structure, Data>
  nonempty: DataValidatorInSchemaWrapper<() => DataSchemaArray<Structure, Data>>
  length: DataValidatorInSchemaWrapper<(min: number) => DataSchemaArray<Structure, Data>>
  min: DataValidatorInSchemaWrapper<(min: number) => DataSchemaArray<Structure, Data>>
  max: DataValidatorInSchemaWrapper<(max: number) => DataSchemaArray<Structure, Data>>
}

export interface DataSchemaUnion<
  Structures extends [DataSchema, ...DataSchema[]] = [DataSchema],
  Data extends unknown | undefined | null = InferDataSchemaType<Structures[number]>
> extends DataSchema<Data> {
  __name: typeof SCHEMA_UNION
  optional: () => DataSchemaUnion<Structures, Data | undefined>
  nullable: () => DataSchemaUnion<Structures, Data | null>
  validate: (validate: DataValidator<Data>) => DataSchemaUnion<Structures, Data>
}

export interface DataSchemaTuple<
  Structures extends [DataSchema, ...DataSchema[]] = [DataSchema],
  RestStructure extends DataSchema | undefined = undefined,
  Data extends unknown | undefined | null = InferDataSchemaType<Structures>
> extends DataSchema<Data> {
  __name: typeof SCHEMA_TUPLE
  optional: () => DataSchemaTuple<Structures, RestStructure, Data | undefined>
  nullable: () => DataSchemaTuple<Structures, RestStructure, Data | null>
  validate: (validate: DataValidator<Data>) => DataSchemaTuple<Structures, RestStructure, Data>
}

export interface DataSchemaObject<
  Structure extends Record<string, DataSchema> = Record<string, DataSchema>,
  Data extends Record<string, unknown> | undefined | null = {
    [P in keyof Structure]: InferDataSchemaType<Structure[P]>
  }
> extends DataSchema<Data> {
  __name: typeof SCHEMA_OBJECT
  optional: () => DataSchemaObject<Structure, Data | undefined>
  nullable: () => DataSchemaObject<Structure, Data | null>
  passthrough: () => DataSchemaObject<Structure, Data>
  validate: (validate: DataValidator<Data>) => DataSchemaObject<Structure, Data>
}

export interface DataSchemaAny<Data = unknown> extends DataSchema<Data> {
  __name: typeof SCHEMA_ANY
  validate: (validate: DataValidator<Data>) => DataSchemaAny<Data>
}

// Utilities

type InferTupleType<Structures extends [DataSchema, ...DataSchema[]]> = {
  [Index in keyof Structures]: Structures[Index] extends DataSchema
    ? InferDataSchemaType<Structures[Index]>
    : never
}

export type InferDataSchemaType<Schema extends DataSchema | DataSchema[]> =
  Schema extends DataSchemaArray<infer Structure, infer Data>
    ?
      | Array<InferDataSchemaType<Structure>>
      | (undefined extends Data ? undefined : never) // .optional()
      | (null extends Data ? null : never) // .nullable()
    : Schema extends DataSchemaUnion<infer Structures, infer Data>
      ?
        | InferDataSchemaType<Structures[number]>
        | (undefined extends Data ? undefined : never) // .optional()
        | (null extends Data ? null : never) // .nullable()
      : Schema extends DataSchemaTuple<infer Structures, infer RestStructure, infer Data>
        ?
          | (RestStructure extends DataSchema
            ? [...InferTupleType<Structures>, ...Array<InferDataSchemaType<RestStructure>>]
            : InferTupleType<Structures>)
          | (undefined extends Data ? undefined : never) // .optional()
          | (null extends Data ? null : never) // .nullable()
        : Schema extends DataSchemaObject<infer Structure, infer Data>
          ?
            | ({
            // Required properties.
              [X in keyof Structure as undefined extends InferDataSchemaType<Structure[X]>
                ? never
                : X]: InferDataSchemaType<Structure[X]>
            } & {
            // Optional properties.
              [X in keyof Structure as undefined extends InferDataSchemaType<Structure[X]>
                ? X
                : never]?: InferDataSchemaType<Structure[X]>
            })
            | (undefined extends Data ? undefined : never) // .optional()
            | (null extends Data ? null : never) // .nullable()
          : Schema extends DataSchema[]
            ? {
                [Index in keyof Schema]: Schema[Index] extends DataSchema
                  ? InferDataSchemaType<Schema[Index]>
                  : never
              }
            : Schema extends DataSchema<infer Data>
              ? Data
              : never
