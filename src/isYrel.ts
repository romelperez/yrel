import { YREL } from './constants.js'
import type { YrelSchema } from './types.js'

const isYrel = (schema: YrelSchema): boolean => {
  return schema !== null && typeof schema === 'object' && schema.__type === YREL
}

export { isYrel }
