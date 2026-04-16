// Performance action types (original: z_ - main.e2a65968.js 43113)
export const PerfActionType = {
  editElement: 'edit_element',
  viewEditor: 'view_editor',
  commentElement: 'comment_element',
  createEditor: 'create_editor',
  perf: 'perf_report',
  error: 'error_report',
} as const

export type PerfActionType = typeof PerfActionType[keyof typeof PerfActionType]

// Performance mark names (original: H_ - main.e2a65968.js 43114)
export const PerfMarkName = {
  REACT_RENDER: 'react_render',
  EDITOR_RENDER: 'editor_render',
  RELAYOUT_CENTER: 'relayout_center',
  UNDO: 'undo',
  REDO: 'redo',
  ZOOM: 'zoom',
  IMPORT: 'import',
  UPDATE_ATTRIBUTE: 'update_attribute',
  UPDATE_DATA: 'update_data',
  LOAD_DATA: 'load_data',
  WRITE_EDITOR_DATA: 'write_editor_data',
  READ_EDITOR_DATA: 'read_editor_data',
  PASTE: 'paste',
  ADD_ELEMENT: 'add_element',
} as const

export type PerfMarkName = typeof PerfMarkName[keyof typeof PerfMarkName]

// Performance mark options interface
interface PerformanceMarkOptions {
  id?: number
  detail?: {
    perf_type?: string
    action_name?: string
    status?: string
    editor_mode?: string
    timing_start?: number
    timing_end?: number
    timing_duration?: number
    [key: string]: unknown
  }
  reportInterval?: number
}

// Performance mark result interface
interface PerformanceMarkResult {
  startTime: number
  detail?: {
    id: number
  }
}

// Report function type (original: j_)
type ReportFunction = (type: PerfActionType, data: Record<string, unknown>) => void

// Default report function (can be overridden)
let reportFunction: ReportFunction = (type, data) => {
  console.log(`[Perf Report] ${type}:`, data)
}

// Set custom report function
export const setReportFunction = (fn: ReportFunction): void => {
  reportFunction = fn
}

// Helper function to report performance data (original: j_)
const reportPerf = (type: PerfActionType, data: Record<string, unknown>): void => {
  reportFunction(type, data)
}

// Performance Monitor singleton class (original: G_ - main.e2a65968.js 43115-43188)
class PerformanceMonitor {
  private hasReportFirstScreen: boolean = false
  private marksSet: Set<number> = new Set()
  private longtaskMap: Map<number, ReturnType<typeof setInterval>> = new Map()

  constructor() {
    this.initListener()
  }

  // Initialize performance observer (original: initListener())
  private initListener(): void {
    if (typeof PerformanceObserver === 'undefined') {
      return
    }

    try {
      const observer = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.reportFirstScreenPerf()
          }
        })
      })
      observer.observe({ entryTypes: ['paint'] })
    } catch (e) {
      // PerformanceObserver not supported
      console.warn('PerformanceObserver not supported:', e)
    }
  }

  // Get base properties for reports (original: getBaseProperties())
  private getBaseProperties(): Record<string, unknown> {
    return {
      page_url: typeof location !== 'undefined' ? location?.pathname : undefined,
    }
  }

  // Report first screen performance (original: reportFirstScreenPerf())
  private reportFirstScreenPerf(): void {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')?.[0]
    const timingFcp = fcpEntry?.startTime

    if (!this.hasReportFirstScreen && timingFcp) {
      this.hasReportFirstScreen = true
      
      const data = {
        ...this.getBaseProperties(),
        perf_type: 'first_screen',
        timing_fcp: timingFcp,
      }

      reportPerf(PerfActionType.perf, data)
    }
  }

  // Start performance mark (original: performanceMarkStart(e, t))
  performanceMarkStart(markName: string, options?: PerformanceMarkOptions): number {
    const { reportInterval } = options || {}
    const id = Math.random()
    
    // Create performance mark
    const mark = performance.mark(`${markName}_START`, {
      detail: { id },
    }) as PerformanceMarkResult

    // Set up interval reporting if specified
    if (reportInterval) {
      const intervalId = setInterval(() => {
        if (this.longtaskMap.has(id)) {
          const now = performance.now()
          const duration = now - mark.startTime
          const isTimeout = duration > 18e5 // 30 minutes

          const data = {
            ...this.getBaseProperties(),
            timing_start: mark?.startTime,
            timing_end: now,
            timing_duration: duration,
            action_name: markName,
            status: isTimeout ? 'running_timeout' : 'running',
            perf_type: 'key_path_perf',
          }

          reportPerf(PerfActionType.perf, data)

          if (isTimeout) {
            clearInterval(intervalId)
            this.longtaskMap.delete(id)
          }
        }
      }, reportInterval)

      this.longtaskMap.set(id, intervalId)
    }

    this.marksSet.add(id)
    return id
  }

  // End performance mark (original: performanceMarkEnd(e, t))
  performanceMarkEnd(markName: string, options?: PerformanceMarkOptions): void {
    const id = options?.id
    const startMarks = performance.getEntriesByName(`${markName}_START`) || []
    
    // Find the matching start mark
    let startMark: PerformanceMarkResult | undefined
    if (id === undefined) {
      // If no id provided, use the last mark
      startMark = startMarks[startMarks.length - 1] as PerformanceMarkResult | undefined
    } else {
      // Find mark with matching id
      startMark = startMarks.find((mark) => (mark as PerformanceMarkResult).detail?.id === id) as PerformanceMarkResult | undefined
    }

    const markId = startMark?.detail?.id
    const hasMark = this.marksSet.has(markId)
    this.marksSet.delete(markId)

    // Check if we should skip reporting
    if (!hasMark && options?.detail?.perf_type === 'key_path_perf') {
      return
    }

    // Create end mark
    const endMark = performance.mark(`${markName}_END`, options) as PerformanceMarkResult | undefined

    // Clear interval if exists
    const intervalId = this.longtaskMap.get(markId)
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      this.longtaskMap.delete(markId)
    }

    // Report if key_path_perf type
    if (options?.detail?.perf_type === 'key_path_perf') {
      const detail = options.detail || {}
      detail.timing_start = startMark?.startTime
      detail.timing_end = endMark?.startTime
      detail.timing_duration = endMark !== undefined && startMark !== undefined 
        ? endMark.startTime - (startMark.startTime || 0) 
        : undefined
      detail.action_name = detail.action_name || markName

      const data = {
        ...detail,
        ...this.getBaseProperties(),
      }

      reportPerf(PerfActionType.perf, data)
    } else {
      this.reportFirstScreenPerf()
    }
  }
}

// Export singleton instance (original: G_)
export const performanceMonitor = new PerformanceMonitor()
