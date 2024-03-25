import { YREL } from './constants.js'

const isYrel = (schema: unknown): boolean =>
  schema !== null && typeof schema === 'object' && '__type' in schema && schema.__type === YREL

export { isYrel }
