import type { YrelError, YrelResolution, YrelSchema, InferYrel } from './types.js'
import { processYrel } from './processYrel.js'

interface ValidateYrelIssue {
  key: string
  errors: YrelError[]
}

type ValidateYrelValidation<Schema extends YrelSchema> =
  | { isValid: true; issues: never[]; data: InferYrel<Schema> }
  | { isValid: false; issues: ValidateYrelIssue[]; data: undefined }

const getIssues = (item: YrelResolution): ValidateYrelIssue[] => {
  return [
    ...(item.errors.length > 0 ? [{ key: item.key, errors: item.errors }] : []),
    ...item.children.reduce(
      (total: ValidateYrelIssue[], item) => [...total, ...getIssues(item)],
      []
    )
  ]
}

const validateYrel = <Schema extends YrelSchema>(
  schema: Schema,
  data: unknown,
  options?: { rootKey?: string }
): ValidateYrelValidation<Schema> => {
  const { rootKey = '' } = { ...options }
  const tree = processYrel(schema, data, { key: rootKey })
  const isValid = tree.isValid

  if (isValid) {
    return { isValid, issues: [], data: tree.data as InferYrel<Schema> }
  }

  return { isValid, issues: getIssues(tree), data: undefined }
}

export { type ValidateYrelIssue, type ValidateYrelValidation, validateYrel }
