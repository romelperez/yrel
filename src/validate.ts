import type { DataError, DataResolution, DataSchema, InferDataSchemaType } from './types'
import { processSchema } from './processSchema'

interface Issue {
  key: string
  errors: DataError[]
}

const getIssues = (item: DataResolution): Issue[] => {
  return [
    ...((item.errors.length > 0) ? [{ key: item.key, errors: item.errors }] : []),
    ...item.children.reduce((total: Issue[], item) => [...total, ...getIssues(item)], [])
  ]
}

const validate = (
  schema: DataSchema,
  data: unknown,
  options?: { rootKey?: string }
): { isValid: boolean, issues: Issue[], data: InferDataSchemaType<typeof schema> } => {
  const { rootKey = '' } = { ...options }
  const tree = processSchema(schema, data, { key: rootKey })
  const isValid = tree.isValid
  const result = isValid ? data : undefined
  return { isValid, issues: getIssues(tree), data: result }
}

export { validate }
