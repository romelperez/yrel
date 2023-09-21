// TODO: Add .object().filter().
// TODO: Add transforms.
// TODO: Add defaults.
// TODO: Add support for `YrelValidationInSchemaConfig` for all schema resolvers.
// TODO: Add tuple optional elements as possibly missing type.
// TODO: https://github.com/arktypeio/arktype/tree/beta/ark/attest#readme

import {
  YREL,
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
import type {
  InferYrel,
  YrelError,
  YrelPreprocessor,
  YrelResolution,
  YrelResolver,
  YrelValidationInSchemaConfig,
  YrelValidator,
  YrelSchema,
  YrelSchemaBoolean,
  YrelSchemaNumber,
  YrelSchemaString,
  YrelSchemaLiteral,
  YrelSchemaArray,
  YrelSchemaUnion,
  YrelSchemaTuple,
  YrelSchemaObject,
  YrelSchemaRecord,
  YrelSchemaAny
} from './types'
import { processYrel } from './processYrel'

const isObject = (data: unknown): boolean =>
  data !== null &&
  typeof data === 'object' &&
  typeof data !== 'function' &&
  !Array.isArray(data)

const createSchemaFactory = <
  SchemaBase extends YrelSchema,
  SchemaExtension extends YrelSchema,
  Properties = Omit<SchemaExtension, keyof YrelSchema>,
  Validators extends Record<string, unknown> = {
    [P in keyof Properties]?: (
      ...params: Properties[P] extends (...params: any[]) => any
        ? Parameters<Properties[P]>
        : [undefined?]
    ) => YrelValidator
  },
  Narrowers extends Record<string, unknown> = {
    [P in keyof Properties]?: (schema: SchemaExtension) => Properties[P]
  }
>(
    props: {
      schemaBase: SchemaBase | null | undefined
      name: YrelSchema['__name']
      resolver: YrelResolver
      properties?: Partial<Properties>
      validators?: Validators
      narrowers?: Narrowers
    }
  ): SchemaExtension => {
  const { name, resolver, properties, validators, narrowers } = props
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

  schemaBase.__type = YREL
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

  if (properties) {
    Object.assign(schemaBase, properties)
  }

  // Preprocessing.
  (schemaBase as any).preprocess = (preprocess: YrelPreprocessor): YrelSchema => {
    schemaBase.__cache.preprocessors = schemaBase.__cache.preprocessors
      ? [...schemaBase.__cache.preprocessors, preprocess]
      : [preprocess]
    return schemaBase
  }

  // Common validators.
  (schemaBase as any).validate = (validate: YrelValidator): YrelSchema => {
    schemaBase.__validators.push((data: unknown) => validate(data, schemaBase.__cache))
    return schemaBase
  }

  if (validators) {
    for (const _key of Object.keys(validators)) {
      const key = _key as keyof Validators
      const validator = validators[key] as any // TODO: Fix type.

      Object.assign(schemaBase, {
        [key]: (...params: unknown[]): YrelSchema => {
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

          const validate: YrelValidator = (data, cache) => {
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
    coerce: () => {
      schemaBase.__cache.coerce = true
      return schemaBase
    },
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
        [key]: (...params: unknown[]): YrelSchema => narrower(schemaBase)(...params)
      })
    }
  }

  return schemaBase as unknown as SchemaExtension
}

const createYrelSchemaBoolean = (schemaBase?: YrelSchema): YrelSchemaBoolean => {
  return createSchemaFactory<YrelSchema, YrelSchemaBoolean>({
    schemaBase,
    name: YREL_BOOLEAN,
    resolver: (input, cache, context) => {
      const data = cache.coerce ? Boolean(input) : input
      if (typeof data === 'boolean') {
        return { key: context.key, isValid: true, data, errors: [], children: [] }
      }
      return { key: context.key, isValid: false, data, errors: [['err_boolean']], children: [] }
    },
    validators: {
      truthy: () => (data) => {
        return data === true || [['err_boolean_truthy']]
      }
    }
  })
}

const createYrelSchemaNumber = (schemaBase?: YrelSchema): YrelSchemaNumber => {
  return createSchemaFactory<YrelSchema, YrelSchemaNumber>({
    schemaBase,
    name: YREL_NUMBER,
    resolver: (input, cache, context) => {
      const data = cache.coerce ? Number(input) : input
      if (typeof data === 'number' && !isNaN(data) && Number.isFinite(data)) {
        return { key: context.key, isValid: true, data, errors: [], children: [] }
      }
      return { key: context.key, isValid: false, data, errors: [['err_number']], children: [] }
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

const createYrelSchemaString = (schemaBase?: YrelSchema): YrelSchemaString => {
  return createSchemaFactory<YrelSchema, YrelSchemaString>({
    schemaBase,
    name: YREL_STRING,
    resolver: (input, cache, context) => {
      const data = cache.coerce
        ? input instanceof Date ? input.toISOString() : String(input)
        : input
      if (typeof data === 'string') {
        return { key: context.key, isValid: true, data, errors: [], children: [] }
      }
      return { key: context.key, isValid: false, data, errors: [['err_string']], children: [] }
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
      capitalcase: (conf?: { lower?: boolean }) => (data) => {
        if (typeof data !== 'string') return []
        const baseString = conf?.lower ? data.toLowerCase() : data
        return (
          data === baseString.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase()) || [
            ['err_string_capitalcase', { lower: !!conf?.lower }]
          ]
        )
      }
    }
  })
}

const createYrelSchemaLiteral = <Data extends boolean | number | string>(
  literal: Data,
  schemaBase?: YrelSchema
): YrelSchemaLiteral<Data> => {
  return createSchemaFactory<YrelSchema, YrelSchemaLiteral<Data>>({
    schemaBase,
    name: YREL_LITERAL,
    resolver: (data, cache, context) => {
      if (Object.is(data, literal)) {
        return { key: context.key, isValid: true, data, errors: [], children: [] }
      }
      return {
        key: context.key,
        isValid: false,
        data,
        errors: [['err_literal', { literal: literal as string }]],
        children: []
      }
    }
  })
}

const createYrelSchemaArray = <
  Structure extends YrelSchema = YrelSchema
>(structure: Structure, schemaBase?: YrelSchema): YrelSchemaArray<Structure> => {
  return createSchemaFactory<YrelSchema, YrelSchemaArray<Structure>>({
    schemaBase,
    name: YREL_ARRAY,
    resolver: (data, cache, context) => {
      if (!Array.isArray(data)) {
        return { key: context.key, isValid: false, data, errors: [['err_array']], children: [] }
      }

      const children = data.map((dataItem, index) => {
        const key = context.key ? `${context.key}.${index}` : String(index)
        return processYrel(structure, dataItem, { key })
      })

      const isValid = children.every((child) => child.isValid)

      return { key: context.key, isValid, data, errors: [], children }
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

const createYrelSchemaUnion = <
  Structures extends [YrelSchema, YrelSchema, ...YrelSchema[]] = [YrelSchema, YrelSchema]
>(structures: Structures, config?: YrelValidationInSchemaConfig, schemaBase?: YrelSchema): YrelSchemaUnion<Structures> => {
  if (!structures || !structures.length) {
    throw new Error('Data validator .union([...schemas]) requires schema definitions.')
  }

  return createSchemaFactory<YrelSchema, YrelSchemaUnion<Structures>>({
    schemaBase,
    name: YREL_UNION,
    resolver: (data, cache, context) => {
      for (const structure of structures) {
        const resolution = processYrel(structure, data, context)
        if (resolution.isValid) {
          return { key: context.key, isValid: true, data, errors: [], children: [] }
        }
      }

      if (config?.errors) {
        return { key: context.key, isValid: false, data, errors: config.errors, children: [] }
      }

      return { key: context.key, isValid: false, data, errors: [['err_union']], children: [] }
    }
  })
}

const createYrelSchemaTuple = <
  Structures extends [YrelSchema, ...YrelSchema[]] = [YrelSchema],
  RestStructure extends YrelSchema | undefined = undefined
>(structures: Structures, restStructure?: RestStructure, schemaBase?: YrelSchema): YrelSchemaTuple<Structures, RestStructure> => {
  if (!structures || !structures.length) {
    throw new Error('Data validator .tuple([...schemas]) requires at least one schema definition.')
  }

  return createSchemaFactory<YrelSchema, YrelSchemaTuple<Structures, RestStructure>>({
    schemaBase,
    name: YREL_TUPLE,
    resolver: (data, cache, context) => {
      if (!Array.isArray(data) || (!restStructure && data.length !== structures.length)) {
        return { key: context.key, isValid: false, data, errors: [['err_tuple']], children: [] }
      }

      const mainItemsResolutions = structures.map((structure, index) => {
        const key = context.key ? `${context.key}.${index}` : String(index)
        return processYrel(structure, data[index], { key })
      })

      let restItemsResolutions: YrelResolution[] = []

      if (restStructure) {
        const restData = data.slice(structures.length)

        restItemsResolutions = restData.map((restItem, restItemIndex) => {
          const index = structures.length + restItemIndex
          const key = context.key ? `${context.key}.${index}` : String(index)
          return processYrel(restStructure, restItem, { key })
        })
      }

      const children = [...mainItemsResolutions, ...restItemsResolutions]
      const isValid = children.every((child) => child.isValid)

      return { key: context.key, isValid, data, errors: [], children }
    }
  })
}

const createYrelSchemaObject = <
  Shape extends Record<string, YrelSchema> = Record<string, YrelSchema>
>(structure: Shape, schemaBase?: YrelSchema): YrelSchemaObject<Shape> => {
  type Data = {
    [P in keyof Shape]: InferYrel<Shape[P]>
  }

  return createSchemaFactory<YrelSchema, YrelSchemaObject<Shape>>({
    schemaBase,
    name: YREL_OBJECT,
    resolver: (data, cache, context) => {
      if (!isObject(data)) {
        return { key: context.key, isValid: false, data, errors: [['err_object']], children: [] }
      }

      const structureKeys = Object.keys(structure) as Array<keyof Shape>
      const dataKeys = Object.keys(data as object) as Array<keyof Data>

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
            data,
            errors: [['err_object_unexpected_props', { props: unexpectedProps }]],
            children: []
          }
        }
      }

      const children = structureKeys.map((itemKey) => {
        const itemSchema = structure[itemKey]
        const itemData = (data as Record<keyof Shape, unknown>)[itemKey]
        const key = context.key ? `${context.key}.${String(itemKey)}` : String(itemKey)
        return processYrel(itemSchema, itemData, { key })
      })

      const isValid = children.every((child) => child.isValid)

      return { key: context.key, isValid, data, errors: [], children }
    },
    properties: {
      shape: structure
    },
    narrowers: {
      passthrough: (schema) => () => {
        schema.__cache.passthroughObjectProps = true
        return schema
      }
    }
  })
}

const createYrelSchemaRecord = <
  Key extends YrelSchemaString,
  Value extends YrelSchema
>(key: Key, value: Value, schemaBase?: YrelSchema): YrelSchemaRecord<Key, Value> => {
  return createSchemaFactory<YrelSchema, YrelSchemaRecord<Key, Value>>({
    schemaBase,
    name: YREL_RECORD,
    resolver: (data, cache, context) => {
      if (!isObject(data)) {
        return { key: context.key, isValid: false, data, errors: [['err_record']], children: [] }
      }

      const record = data as Record<string, unknown>
      const itemsKeys = Object.keys(record)

      const keysInvalid = itemsKeys.filter(itemKey => {
        const validation = processYrel(key, itemKey)
        return !validation.isValid
      })

      const children = itemsKeys.map(itemKey => {
        const item = record[itemKey]
        const contextKey = context.key ? `${context.key}.${String(itemKey)}` : String(itemKey)
        return processYrel(value, item, { key: contextKey })
      })

      const isValid = !keysInvalid.length && children.every((child) => child.isValid)

      const errors: YrelError[] = keysInvalid.length
        ? [['err_record_keys', { keys: keysInvalid }]]
        : []

      return { key: context.key, isValid, data, errors, children }
    }
  })
}

const createYrelSchemaAny = (): YrelSchemaAny => {
  return createSchemaFactory<YrelSchema, YrelSchemaAny>({
    schemaBase: null,
    name: YREL_ANY,
    resolver: (data, cache, context) => ({
      key: context.key,
      isValid: true,
      data,
      errors: [],
      children: []
    })
  })
}

const y = {
  any: createYrelSchemaAny,
  boolean: createYrelSchemaBoolean,
  number: createYrelSchemaNumber,
  string: createYrelSchemaString,
  literal: createYrelSchemaLiteral,
  array: createYrelSchemaArray,
  union: createYrelSchemaUnion,
  tuple: createYrelSchemaTuple,
  object: createYrelSchemaObject,
  record: createYrelSchemaRecord
}

export { y }
