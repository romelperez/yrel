import type { DataSchema, DataResolution, DataResolverContext, DataError } from './types'

const processSchema = (
  schema: DataSchema,
  data: unknown,
  context?: DataResolverContext
): DataResolution => {
  const key = context?.key ?? ''
  const errors: DataError[] = []

  let isValid = true
  let children: DataResolution[] = []

  try {
    for (const checker of schema.__checkers) {
      const result = checker(data, schema.__cache)
      if (result) {
        return { key, isValid, errors, children }
      }
    }

    for (const resolver of schema.__resolvers) {
      const result = resolver(data, schema.__cache, { key })

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
  } catch (err) {
    console.error(err)
    errors.push(['err_unknown'])
  }

  isValid = (errors.length === 0) && children.every((child) => child.isValid)

  return { key, isValid, errors, children }
}

export { processSchema }
