import { SCHEMA } from './constants'
import type { DataSchema } from './types'

const isSchema = (schema: DataSchema): boolean => {
  return schema !== null && typeof schema === 'object' && schema.__type === SCHEMA
}

export { isSchema }
