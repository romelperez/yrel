import { YREL } from './constants'
import type { YrelSchema } from './types'

const isYrel = (schema: YrelSchema): boolean => {
  return schema !== null && typeof schema === 'object' && schema.__type === YREL
}

export { isYrel }
