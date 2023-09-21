import type { YrelSchema, YrelResolution, YrelResolverContext, YrelError } from './types'

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

    for (const preprocess of schema.__cache.preprocessors ?? []) {
      data = preprocess(data, schema.__cache)
    }

    for (const resolver of schema.__resolvers) {
      const result = resolver(data, schema.__cache, { key })

      // Passed around or coerce the data.
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
  } catch (err) {
    console.error(err)
    errors.push(['err_unknown'])
  }

  isValid = (errors.length === 0) && children.every((child) => child.isValid)

  return { key, isValid, data, errors, children }
}

export { processYrel }
