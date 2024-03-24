import type { YrelError, YrelResolution, YrelSchema, InferYrel } from './types.js'
import { processYrel } from './processYrel.js'

interface ValidateYrelIssue {
  key: string
  errors: YrelError[]
}

type ValidateYrelValidation<Schema extends YrelSchema> =
  | { isValid: true; issues: never[]; data: InferYrel<Schema> }
  | { isValid: false; issues: ValidateYrelIssue[]; data: undefined }

const getIssuesMap = (
  resolution: YrelResolution,
  map: Record<string, YrelError[]>
): Record<string, YrelError[]> => {
  if (resolution.errors.length) {
    map[resolution.key] = map[resolution.key]
      ? [...map[resolution.key], ...resolution.errors]
      : resolution.errors
  }

  for (const child of resolution.children) {
    getIssuesMap(child, map)
  }

  return map
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

  const issuesMap = getIssuesMap(tree, {})
  const issues: ValidateYrelIssue[] = Object.keys(issuesMap).map((key) => ({
    key,
    errors: issuesMap[key]
  }))

  return { isValid, issues, data: undefined }
}

export { type ValidateYrelIssue, type ValidateYrelValidation, validateYrel }
