// TODO: Add string capitalcase with intermediate lowercase characters.
// TODO: Add support for `DataValidationInSchemaConfig` for all schema resolvers.
// TODO: Add `.record(key, value)` data schema.
// TODO: Add coercion functionalities.
// TODO: Add tuple optional elements as possibly missing type.

import {
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
import type {
  InferDataSchemaType,
  DataResolution,
  DataResolver,
  DataValidationInSchemaConfig,
  DataValidator,
  DataSchema,
  DataSchemaBoolean,
  DataSchemaNumber,
  DataSchemaString,
  DataSchemaLiteral,
  DataSchemaArray,
  DataSchemaUnion,
  DataSchemaTuple,
  DataSchemaObject,
  DataSchemaAny
} from './types'
import { processSchema } from './processSchema'

const createSchemaFactory = <
  SchemaBase extends DataSchema,
  SchemaExtension extends DataSchema,
  Properties = Omit<SchemaExtension, keyof DataSchema>,
  Validators extends Record<string, unknown> = {
    [P in keyof Properties]?: (
      ...params: Properties[P] extends (...params: any[]) => any
        ? Parameters<Properties[P]>
        : [undefined?]
    ) => DataValidator
  },
  Narrowers extends Record<string, unknown> = {
    [P in keyof Properties]?: (schema: SchemaExtension) => Properties[P]
  }
>(
    props: {
      schemaBase: SchemaBase | null | undefined
      name: DataSchema['__name']
      resolver: DataResolver
      validators?: Validators
      narrowers?: Narrowers
    }
  ): SchemaExtension => {
  const { name, resolver, validators, narrowers } = props
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const schemaBase = props.schemaBase ?? ({} as SchemaBase)
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __cache, __checkers, __resolvers, __validators } = schemaBase

  // Clean all the current properties and methods so the new ones can be added safely.
  // Only validators are preserved since they contain the schema validations so far.
  for (const key of Object.keys(schemaBase)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete schemaBase[key as keyof SchemaBase]
  }

  schemaBase.__type = SCHEMA
  schemaBase.__name = name
  schemaBase.__cache = __cache ?? {}

  schemaBase.__checkers = Array.isArray(__checkers)
    ? [...__checkers]
    : [
        // Common checkers.
        (data, cache) => !!cache.isOptional && data === undefined,
        (data, cache) => !!cache.isNullable && data === null
      ]

  schemaBase.__resolvers = __resolvers ?? []
  schemaBase.__resolvers.push(resolver)

  schemaBase.__validators = Array.isArray(__validators) ? [...__validators] : []

  // Common validators.
  schemaBase.validate = (validate) => {
    schemaBase.__validators.push((data: unknown) => validate(data, schemaBase.__cache))
    return schemaBase
  }

  if (validators) {
    for (const _key of Object.keys(validators)) {
      const key = _key as keyof Validators
      const validator = validators[key] as any // TODO: Fix type.

      Object.assign(schemaBase, {
        [key]: (...params: unknown[]): DataSchema => {
          // Get the last parameter and all the parameters before it.
          const [config, ...paramsExtra] = [...params].reverse()
          const validateParamsWithoutConfig = paramsExtra.reverse()

          // Check if the last parameter is a validator configuration object.
          const isConfigProvided =
            config !== null &&
            typeof config === 'object' &&
            'errors' in config &&
            Array.isArray(config.errors) &&
            config.errors.every((err) => Array.isArray(err))

          const validateParams = isConfigProvided ? validateParamsWithoutConfig : params

          const validate: DataValidator = (data, cache) => {
            const result = validator(...validateParams)(data, cache)
            if (result === true) {
              return true
            }
            return (isConfigProvided && config.errors) || result
          }

          schemaBase.__validators.push(validate)

          return schemaBase
        }
      })
    }
  }

  // Common narrowers.
  Object.assign(schemaBase, {
    optional: () => {
      schemaBase.__cache.isOptional = true
      return schemaBase
    },
    nullable: () => {
      schemaBase.__cache.isNullable = true
      return schemaBase
    }
  })

  if (narrowers) {
    for (const _key of Object.keys(narrowers)) {
      const key = _key as keyof Narrowers
      const narrower = narrowers[key] as any // TODO: Fix type.

      Object.assign(schemaBase, {
        [key]: (...params: unknown[]): DataSchema => narrower(schemaBase)(...params)
      })
    }
  }

  return schemaBase as unknown as SchemaExtension
}

const createDataSchemaBoolean = (schemaBase?: DataSchema): DataSchemaBoolean => {
  return createSchemaFactory<DataSchema, DataSchemaBoolean>({
    schemaBase,
    name: SCHEMA_BOOLEAN,
    resolver: (data, cache, context) => {
      if (typeof data === 'boolean') {
        return { key: context.key, isValid: true, errors: [], children: [] }
      }
      return { key: context.key, isValid: false, errors: [['err_boolean']], children: [] }
    },
    validators: {
      truthy: () => (data) => {
        return data === true || [['err_boolean_truthy']]
      }
    }
  })
}

const createDataSchemaNumber = (schemaBase?: DataSchema): DataSchemaNumber => {
  return createSchemaFactory<DataSchema, DataSchemaNumber>({
    schemaBase,
    name: SCHEMA_NUMBER,
    resolver: (data, cache, context) => {
      if (typeof data === 'number' && !isNaN(data) && Number.isFinite(data)) {
        return { key: context.key, isValid: true, errors: [], children: [] }
      }
      return { key: context.key, isValid: false, errors: [['err_number']], children: [] }
    },
    validators: {
      gt: (gt) => (data) => {
        if (typeof data !== 'number') return []
        return data > gt || [['err_number_gt', { gt }]]
      },
      gte: (gte) => (data) => {
        if (typeof data !== 'number') return []
        return data >= gte || [['err_number_gte', { gte }]]
      },
      lt: (lt) => (data) => {
        if (typeof data !== 'number') return []
        return data < lt || [['err_number_lt', { lt }]]
      },
      lte: (lte) => (data) => {
        if (typeof data !== 'number') return []
        return data <= lte || [['err_number_lte', { lte }]]
      },
      integer: () => (data) => {
        if (typeof data !== 'number') return []
        return (Number.isInteger(data) && Number.isSafeInteger(data)) || [['err_number_integer']]
      }
    }
  })
}

const createDataSchemaString = (schemaBase?: DataSchema): DataSchemaString => {
  return createSchemaFactory<DataSchema, DataSchemaString>({
    schemaBase,
    name: SCHEMA_STRING,
    resolver: (data, cache, context) => {
      if (typeof data === 'string') {
        return { key: context.key, isValid: true, errors: [], children: [] }
      }
      return { key: context.key, isValid: false, errors: [['err_string']], children: [] }
    },
    validators: {
      nonempty: () => (data) => {
        if (typeof data !== 'string') return []
        return data.length > 0 || [['err_string_nonempty']]
      },
      trim: () => (data) => {
        if (typeof data !== 'string') return []
        return data === data.trim() || [['err_string_trim']]
      },
      length: (length) => (data) => {
        if (typeof data !== 'string') return []
        return data.length === length || [['err_string_length', { length }]]
      },
      min: (min) => (data) => {
        if (typeof data !== 'string') return []
        return data.length >= min || [['err_string_min', { min }]]
      },
      max: (max) => (data) => {
        if (typeof data !== 'string') return []
        return data.length <= max || [['err_string_max', { max }]]
      },
      datetime: () => (data) => {
        if (typeof data !== 'string') return []
        const timestamp = Date.parse(data)
        const datetime = isNaN(timestamp) ? null : new Date(timestamp).toISOString()
        return datetime === data || [['err_string_date_time']]
      },
      date: () => (data) => {
        if (typeof data !== 'string') return []
        const timestamp = Date.parse(data)
        const datetime = isNaN(timestamp) ? null : new Date(timestamp).toISOString().slice(0, 10)
        return datetime === data || [['err_string_date']]
      },
      time: () => (data) => {
        if (typeof data !== 'string') return []
        const timestamp = Date.parse(`2000-01-01T${data}Z`)
        const datetime = isNaN(timestamp) ? null : new Date(timestamp).toISOString().slice(11, 23)
        return datetime === data || [['err_string_time']]
      },
      lowercase: () => (data) => {
        if (typeof data !== 'string') return []
        return data === data.toLowerCase() || [['err_string_lowercase']]
      },
      uppercase: () => (data) => {
        if (typeof data !== 'string') return []
        return data === data.toUpperCase() || [['err_string_uppercase']]
      },
      capitalcase: () => (data) => {
        if (typeof data !== 'string') return []
        return (
          data === data.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase()) || [
            ['err_string_capitalcase']
          ]
        )
      }
    }
  })
}

const createDataSchemaLiteral = <Data extends boolean | number | string | undefined | null>(
  literal: Data,
  schemaBase?: DataSchema
): DataSchemaLiteral<Data> => {
  return createSchemaFactory<DataSchema, DataSchemaLiteral<Data>>({
    schemaBase,
    name: SCHEMA_LITERAL,
    resolver: (data, cache, context) => {
      if (Object.is(data, literal)) {
        return { key: context.key, isValid: true, errors: [], children: [] }
      }
      return {
        key: context.key,
        isValid: false,
        errors: [['err_literal', { literal: literal as string }]],
        children: []
      }
    }
  })
}

const createDataSchemaArray = <
  Structure extends DataSchema = DataSchema,
  Data extends unknown[] | undefined | null = Array<InferDataSchemaType<Structure>>
>(structure: Structure, schemaBase?: DataSchema): DataSchemaArray<Structure, Data> => {
  return createSchemaFactory<DataSchema, DataSchemaArray<Structure, Data>>({
    schemaBase,
    name: SCHEMA_ARRAY,
    resolver: (data, cache, context) => {
      if (!Array.isArray(data)) {
        return { key: context.key, isValid: false, errors: [['err_array']], children: [] }
      }

      const children = data.map((dataItem, index) => {
        const key = context.key ? `${context.key}.${index}` : String(index)
        return processSchema(structure, dataItem, { key })
      })

      const isValid = children.every((child) => child.isValid)

      return { key: context.key, isValid, errors: [], children }
    },
    validators: {
      nonempty: () => (data) => {
        if (!Array.isArray(data)) return []
        return data.length > 0 || [['err_array_nonempty']]
      },
      length: (length) => (data) => {
        if (!Array.isArray(data)) return []
        return data.length === length || [['err_array_length', { length }]]
      },
      min: (min) => (data) => {
        if (!Array.isArray(data)) return []
        return data.length >= min || [['err_array_min', { min }]]
      },
      max: (max) => (data) => {
        if (!Array.isArray(data)) return []
        return data.length <= max || [['err_array_max', { max }]]
      }
    }
  })
}

const createDataSchemaUnion = <
  Structures extends [DataSchema, DataSchema, ...DataSchema[]] = [DataSchema, DataSchema],
  Data extends unknown | undefined | null = InferDataSchemaType<Structures[number]>
>(structures: Structures, config?: DataValidationInSchemaConfig, schemaBase?: DataSchema): DataSchemaUnion<Structures, Data> => {
  if (!structures || !structures.length) {
    throw new Error('Data validator .union([...schemas]) requires schema definitions.')
  }

  return createSchemaFactory<DataSchema, DataSchemaUnion<Structures, Data>>({
    schemaBase,
    name: SCHEMA_UNION,
    resolver: (data, cache, context) => {
      for (const structure of structures) {
        const resolution = processSchema(structure, data, context)
        if (resolution.isValid) {
          return { key: context.key, isValid: true, errors: [], children: [] }
        }
      }

      if (config?.errors) {
        return { key: context.key, isValid: false, errors: config.errors, children: [] }
      }

      return { key: context.key, isValid: false, errors: [['err_union']], children: [] }
    }
  })
}

const createDataSchemaTuple = <
  Structures extends [DataSchema, ...DataSchema[]] = [DataSchema],
  RestStructure extends DataSchema | undefined = undefined,
  Data extends unknown | undefined | null = InferDataSchemaType<Structures>
>(structures: Structures, restStructure?: RestStructure, schemaBase?: DataSchema): DataSchemaTuple<Structures, RestStructure, Data> => {
  if (!structures || !structures.length) {
    throw new Error('Data validator .tuple([...schemas]) requires at least one schema definition.')
  }

  return createSchemaFactory<DataSchema, DataSchemaTuple<Structures, RestStructure, Data>>({
    schemaBase,
    name: SCHEMA_TUPLE,
    resolver: (data, cache, context) => {
      if (!Array.isArray(data) || (!restStructure && data.length !== structures.length)) {
        return { key: context.key, isValid: false, errors: [['err_tuple']], children: [] }
      }

      const mainItemsResolutions = structures.map((structure, index) => {
        const key = context.key ? `${context.key}.${index}` : String(index)
        return processSchema(structure, data[index], { key })
      })

      let restItemsResolutions: DataResolution[] = []

      if (restStructure) {
        const restData = data.slice(structures.length)

        restItemsResolutions = restData.map((restItem, restItemIndex) => {
          const index = structures.length + restItemIndex
          const key = context.key ? `${context.key}.${index}` : String(index)
          return processSchema(restStructure, restItem, { key })
        })
      }

      const children = [...mainItemsResolutions, ...restItemsResolutions]
      const isValid = children.every((child) => child.isValid)

      return { key: context.key, isValid, errors: [], children }
    }
  })
}

const createDataSchemaObject = <
  Structure extends Record<string, DataSchema> = Record<string, DataSchema>,
  Data extends Record<string, unknown> | undefined | null = {
    [P in keyof Structure]: InferDataSchemaType<Structure[P]>
  }
>(structure: Structure, schemaBase?: DataSchema): DataSchemaObject<Structure, Data> => {
  return createSchemaFactory<DataSchema, DataSchemaObject<Structure, Data>>({
    schemaBase,
    name: SCHEMA_OBJECT,
    resolver: (data, cache, context) => {
      const isObject =
        data !== null &&
        typeof data === 'object' &&
        typeof data !== 'function' &&
        !Array.isArray(data)

      if (!isObject) {
        return { key: context.key, isValid: false, errors: [['err_object']], children: [] }
      }

      const structureKeys = Object.keys(structure) as Array<keyof Structure>
      const dataKeys = Object.keys(data) as Array<keyof Data>

      // Check for unexpected object props.
      // If a property is defined in data but not in structure, it is unexpected.
      if (!cache.passthroughObjectProps) {
        const unexpectedProps = dataKeys.filter(
          (dataKey) => !Object.prototype.hasOwnProperty.call(structure, dataKey)
        ) as string[]

        if (unexpectedProps.length > 0) {
          return {
            key: context.key,
            isValid: false,
            errors: [['err_object_unexpected_props', { props: unexpectedProps }]],
            children: []
          }
        }
      }

      const children = structureKeys.map((itemKey) => {
        const itemSchema = structure[itemKey]
        const itemData = (data as Record<keyof Structure, unknown>)[itemKey]
        const key = context.key ? `${context.key}.${String(itemKey)}` : String(itemKey)
        return processSchema(itemSchema, itemData, { key })
      })

      const isValid = children.every((child) => child.isValid)

      return { key: context.key, isValid, errors: [], children }
    },
    narrowers: {
      passthrough: (schema) => () => {
        schema.__cache.passthroughObjectProps = true
        return schema
      }
    }
  })
}

const createDataSchemaAny = (): DataSchemaAny => {
  return createSchemaFactory<DataSchema, DataSchemaAny>({
    schemaBase: null,
    name: SCHEMA_ANY,
    resolver: (data, cache, context) => ({
      key: context.key,
      isValid: true,
      errors: [],
      children: []
    })
  })
}

const v = {
  any: createDataSchemaAny,
  boolean: createDataSchemaBoolean,
  number: createDataSchemaNumber,
  string: createDataSchemaString,
  literal: createDataSchemaLiteral,
  array: createDataSchemaArray,
  union: createDataSchemaUnion,
  tuple: createDataSchemaTuple,
  object: createDataSchemaObject
}

export { v }
