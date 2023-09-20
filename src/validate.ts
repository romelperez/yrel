import type { DataError, DataResolution, DataSchema, InferDataSchemaType } from './types'
import { processSchema } from './processSchema'

interface DataValidateIssue {
  key: string
  errors: DataError[]
}

const getIssues = (item: DataResolution): DataValidateIssue[] => {
  return [
    ...((item.errors.length > 0) ? [{ key: item.key, errors: item.errors }] : []),
    ...item.children.reduce((total: DataValidateIssue[], item) => [...total, ...getIssues(item)], [])
  ]
}

const validate = <Schema extends DataSchema>(
  schema: Schema,
  data: unknown,
  options?: { rootKey?: string }
):
  | { isValid: true, issues: never[], data: InferDataSchemaType<Schema> }
  | { isValid: false, issues: DataValidateIssue[], data: undefined } => {
  const { rootKey = '' } = { ...options }
  const tree = processSchema(schema, data, { key: rootKey })
  const isValid = tree.isValid

  if (isValid) {
    return { isValid, issues: [], data: data as InferDataSchemaType<Schema> }
  }

  return { isValid, issues: getIssues(tree), data: undefined }
}

export type { DataValidateIssue }
export { validate }
