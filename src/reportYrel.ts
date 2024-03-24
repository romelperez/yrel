import type { YrelReport } from './types.js'
import { YREL_REPORT } from './constants.js'

const reportYrel = (report: Omit<YrelReport, '__type'>): YrelReport => ({
  ...report,
  __type: YREL_REPORT
})

export { reportYrel }
