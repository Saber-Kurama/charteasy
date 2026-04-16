// ============================================
// Editor Constants (original: main.e2a65968.js 453-471)
// ============================================

// Minimum zoom/size value (original: Ye = .1)
export const MIN_SIZE = 0.1

// Editor global config (original: Ke)
export const EditorConfig = {
  // Tea event handler (original: TeaEvent)
  TeaEvent: (event: string, data: unknown): void => {
    console.warn('not register success')
  },

  // Default font family (original: fontFamily)
  fontFamily: 'LarkHackSafariFont,LarkEmojiFont,LarkChineseQuote,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Tahoma,"PingFang SC","Microsoft Yahei",Arial,"Hiragino Sans GB",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',

  // Color scheme (original: colorScheme)
  colorScheme: {} as Record<string, unknown>,
}

// Max z-index value (original: Xe = 999999)
export const MAX_Z_INDEX = 999999

// Default bounds (original: qe)
export const DefaultBounds = {
  x: Number.MIN_SAFE_INTEGER / 2,
  y: Number.MIN_SAFE_INTEGER / 2,
  width: Number.MAX_SAFE_INTEGER,
  height: Number.MAX_SAFE_INTEGER,
}

// Editor event types (original: Qe - main.e2a65968.js 468)
export const EditorEvent = {
  // History events
  historyChange: 'historyChange',

  // State events
  onStateChange: 'onStateChange',

  // Load events
  startLoad: 'startLoad',
  endLoad: 'endLoad',

  // Data update events
  dataUpdateStart: 'dataUpdateStart',
  dataUpdating: 'dataUpdating',
  dataUpdateSuccess: 'dataUpdateSuccess',
  dataUpdateFail: 'dataUpdateFail',
  chartDataUpdated: 'chartDataUpdated',

  // Element events
  currentElementChange: 'currentElementChange',
  currentElementClear: 'currentElementClear',
  currentElementEditing: 'currentElementEditing',
  currentElementUpdated: 'currentElementUpdated',

  // Layer wheel events
  onLayerWheelStart: 'onLayerWheelStart',
  onLayerWheel: 'onLayerWheel',

  // Layer drag events
  perLayerDrag: 'perLayerDrag',
  perLayerWheel: 'perLayerWheel',
  onLayerDragStart: 'onLayerDragStart',
  onLayerDrag: 'onLayerDrag',
  onLayerDragOver: 'onLayerDragOver',
  onLayerWheelOver: 'onLayerWheelOver',

  // Layer ready event
  afterAllLayerReady: 'afterAllLayerReady',

  // Table events
  onTableScroll: 'onTableScroll',

  // Layer pointer events
  onLayerPointerDown: 'onLayerPointerDown',
  onLayerClick: 'onLayerClick',
  onLayerDblClick: 'onLayerDblClick',
  onLayerPointerMove: 'onLayerPointerMove',
  onLayerPointerOut: 'onLayerPointerOut',
} as const

export type EditorEventType = typeof EditorEvent[keyof typeof EditorEvent]

// Data error types (original: Je - main.e2a65968.js 469)
export const DataErrorType = {
  dataUnmeetChartRequire: 'dataUnmeetChartRequire',
} as const

export type DataErrorTypeValue = typeof DataErrorType[keyof typeof DataErrorType]

// Editor data group key (original: et = "EDITOR_ALL_DATA_GROUP")
export const EDITOR_ALL_DATA_GROUP = 'EDITOR_ALL_DATA_GROUP'

// Scroll event key (original: tt = "scroll")
export const SCROLL_EVENT = 'scroll'

// Type alias for backward compatibility with minified names
export type Qe = typeof EditorEvent
export type Je = typeof DataErrorType
