import type { YrelSchema, YrelResolution, YrelResolverContext, YrelError } from './types.js'

const processYrel = (
  schema: YrelSchema,
  input: unknown,
  context?: YrelResolverContext
): YrelResolution => {
  const key = context?.key ?? ''
  const errors: YrelError[] = []

  let data = input
  let isValid = true
  let children: YrelResolution[] = []

  try {
    for (const checker of schema.__checkers) {
      const result = checker(data, schema.__cache)
      if (result) {
        return { key, isValid, data, errors, children }
      }
    }

    for (const preprocessor of schema.__cache.preprocessors ?? []) {
      data = preprocessor(data, schema.__cache)
    }

    if (schema.__cache.defaultData !== undefined && data === undefined) {
      data = schema.__cache.defaultData
    }

    for (const resolver of schema.__resolvers) {
      const result = resolver(data, schema.__cache, { key })

      data = result.data

      if (result.errors) {
        errors.push(...result.errors)
      }

      if (result.children) {
        children = result.children
      }
    }

    for (const validate of schema.__validators) {
      const result = validate(data, schema.__cache)
      if (result !== true) {
        errors.push(...result)
      }
    }

    if (!errors.length) {
      for (const transformer of schema.__cache.transformers ?? []) {
        data = transformer(data, schema.__cache)
      }
    }
  } catch (err) {
    console.error(err)
    errors.push(['err_unknown'])
  }

  isValid = (errors.length === 0) && children.every((child) => child.isValid)

  return { key, isValid, data, errors, children }
}

export { processYrel }
