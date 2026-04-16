import EventEmitter from 'eventemitter3'
import { getLogger } from '../utils/logger'

// Get logger instance
const logger = getLogger()

// Editor mode types
export type EditorMode = 'view' | 'editor' | 'preview_editor' | 'preview'

// Layout mode types
export type LayoutMode = 'free' | 'fixed'

// Render mode types
export type RenderMode = 'browser' | 'node'

// ============================================
// Editor Controller (original: Wh - main.e2a65968.js)
// Manages start/run/end/finish handlers for editing operations
// ============================================

export type StartHandler = (element: EditorElement) => void
export type RunHandler = () => void
export type EndHandler = (element: EditorElement) => void
export type FinishHandler = () => void

export interface EditorControllerInterface {
  currentEditorElement: EditorElement | null
  addStartHandler: (handler: StartHandler) => void
  addRunHandler: (handler: RunHandler) => void
  addEndHandler: (handler: EndHandler) => void
  addFinishHandler: (handler: FinishHandler) => void
  // Internal methods for triggering handlers
  _triggerStart: (element: EditorElement) => void
  _triggerRun: () => void
  _triggerEnd: (element: EditorElement) => void
  _triggerFinish: () => void
}

/**
 * Editor Controller class (original: Wh)
 * Manages editor lifecycle handlers for element editing operations
 */
export class EditorController implements EditorControllerInterface {
  currentEditorElement: EditorElement | null = null
  
  private _startHandlers: StartHandler[] = []
  private _runHandlers: RunHandler[] = []
  private _endHandlers: EndHandler[] = []
  private _finishHandlers: FinishHandler[] = []

  addStartHandler(handler: StartHandler): void {
    this._startHandlers.push(handler)
    logger.debug('EditorController: startHandler added, total:', this._startHandlers.length)
  }

  addRunHandler(handler: RunHandler): void {
    this._runHandlers.push(handler)
    logger.debug('EditorController: runHandler added, total:', this._runHandlers.length)
  }

  addEndHandler(handler: EndHandler): void {
    this._endHandlers.push(handler)
    logger.debug('EditorController: endHandler added, total:', this._endHandlers.length)
  }

  addFinishHandler(handler: FinishHandler): void {
    this._finishHandlers.push(handler)
    logger.debug('EditorController: finishHandler added, total:', this._finishHandlers.length)
  }

  // Internal: Trigger start handlers
  _triggerStart(element: EditorElement): void {
    logger.debug('EditorController: triggering start handlers for element:', element.id)
    this._startHandlers.forEach(handler => {
      try {
        handler(element)
      } catch (err) {
        logger.error('Start handler error:', err)
      }
    })
  }

  // Internal: Trigger run handlers
  _triggerRun(): void {
    logger.debug('EditorController: triggering run handlers')
    this._runHandlers.forEach(handler => {
      try {
        handler()
      } catch (err) {
        logger.error('Run handler error:', err)
      }
    })
  }

  // Internal: Trigger end handlers
  _triggerEnd(element: EditorElement): void {
    logger.debug('EditorController: triggering end handlers for element:', element?.id)
    this._endHandlers.forEach(handler => {
      try {
        handler(element)
      } catch (err) {
        logger.error('End handler error:', err)
      }
    })
  }

  // Internal: Trigger finish handlers
  _triggerFinish(): void {
    logger.debug('EditorController: triggering finish handlers')
    this._finishHandlers.forEach(handler => {
      try {
        handler()
      } catch (err) {
        logger.error('Finish handler error:', err)
      }
    })
  }
}

// Editor state interface
export interface EditorState {
  actionMode: string
  activeTool: string
}

// Editor options interface
export interface EditorOptions {
  id: string
  dom?: string | HTMLElement
  mode?: EditorMode
  layoutMode?: LayoutMode
  renderMode?: RenderMode
  nodeParams?: unknown
  canvas?: unknown
  theme?: string
  customTheme?: Record<string, unknown>
  language?: string
  data: EditorDataInterface
  defaultLayoutPadding?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }
}

// Editor data interface
export interface EditorDataInterface {
  load: () => Promise<unknown[]>
  setLayers: (getLayers: () => Layer[]) => void
  setDataKey: (key: string) => void
  version?: string
  clearHistory?: () => void
  saveData?: () => void
  // Internal data storage reference (used in view mode)
  _data?: unknown
}

// Layer interface
export interface Layer {
  id: string
  elements: EditorElement[]
  isElementReady: boolean
  getCanvas: () => HTMLCanvasElement
  getStage: () => unknown
  addElements: (element: EditorElement) => void
  removeElement: (id: string, saveHistory?: boolean) => void
  getAABBBounds: (includePreview?: boolean) => AABB
  resizeLayer: (width: number, height: number, offsetX?: number, offsetY?: number, scale?: number) => void
  reLayoutWithOffset: (offsetX: number, offsetY: number) => void
  zoomMove: { zoomTo: (zoom: number, options?: unknown) => void }
  setThemeName: (name: string) => void
  setCustomTheme: (theme: Record<string, unknown> | null) => void
  scale: number
  changeElementLayoutZIndex: (id: string, options: { action: string }, saveHistory: boolean) => void
}

// AABB bounds interface
export interface AABB {
  x1: number
  y1: number
  x2: number
  y2: number
  width: () => number
  height: () => number
  empty: () => boolean
  union: (bounds: AABB) => void
  expand: (padding: number) => void
}

// Editor element interface
export interface EditorElement {
  id: string
  type: string
  elementId?: string
  layerId?: string
  vchartType?: string
  vchart?: {
    getSpec: () => { maskShape?: unknown }
    on: (event: string, handler: () => void) => void
    off: (event: string, handler: () => void) => void
  }
  // For editor controller handlers
  part?: string
  partDetail?: unknown
  originSpec?: unknown
  updateElement?: (options?: { ignoreIdMatch?: boolean; updateId?: boolean }) => void
  updateAttributeFromHistory: (data: unknown, prevData: unknown | null) => void
  moveBy: (dx: number, dy: number, saveHistory: boolean) => void
  selectElement: (elementId: string, options?: unknown) => void
  clearCurrentEditorElement: () => void
  setMode: (mode: EditorMode) => void
  onResize?: () => void
  applyTheme: (theme: unknown) => void
  setKeepStyle: (keep: boolean) => void
  getKeepStyle: () => boolean
  specProcess?: { updateAttribute: (attr: unknown) => void }
  isBackup?: boolean
  rect?: { x: number; y: number; width: number; height: number }
}

// Element option interface
export interface ElementOption {
  id?: string
  type: string
  layer?: Layer
  renderCanvas?: HTMLCanvasElement
  attribute?: Record<string, unknown>
  rect?: { x: number; y: number; width: number; height: number }
  [key: string]: unknown
}

// Template interface
export interface TemplateOption {
  attribute?: {
    editData?: Array<{ elements: ElementOption[] }>
    previewChartAttributes?: Record<string, unknown>
    previewAttributes?: Record<string, unknown>
  }
  rect: { x: number; y: number }
}

// Theme interface
export interface EditorTheme {
  backgroundColor?: string
  chart?: unknown
  table?: unknown
  graphic?: Record<string, unknown>
  colorScheme?: unknown
}

// Editor event types (matching original Qe)
export const EditorEvent = {
  onStateChange: 'onStateChange',
  afterAllLayerReady: 'afterAllLayerReady',
  onLayerWheelStart: 'onLayerWheelStart',
  onLayerWheel: 'onLayerWheel',
  historyChange: 'historyChange',
  chartDataUpdated: 'chartDataUpdated',
  dataUpdateFail: 'dataUpdateFail',
  dataUpdateSuccess: 'dataUpdateSuccess',
} as const

// Element types (matching original Pe)
export const ElementType = {
  chart: 'chart',
  table: 'table',
  text: 'text',
  rect: 'rect',
  circle: 'circle',
  straightLine: 'straightLine',
  elbowLine: 'elbowLine',
  curveLine: 'curveLine',
  chartConnectorLine: 'chartConnectorLine',
} as const

// Language constants (matching original kr)
export const Language = {
  chinese: 'zh',
  english: 'en',
} as const

/**
 * Editor class (original: fp - main.e2a65968.js 20178-20847)
 * This is the main VChart Editor class that manages layers, elements, and editor state.
 */
export class Editor {
  // Private properties
  protected _layers: Layer[] = []
  protected _mode: EditorMode = 'view'
  protected _layoutMode: LayoutMode = 'free'
  protected _renderMode: RenderMode = 'browser'
  protected _needResize = false
  protected _needLayoutToCenter = false
  protected _isReleased = false
  protected _isLoaded = false
  protected _isLoading = false
  protected _state: EditorState = {
    actionMode: 'none',
    activeTool: 'none',
  }
  protected _editorMap: Record<string, unknown> = {}
  protected _option: EditorOptions
  protected _container: HTMLElement | null = null
  protected _width: number = 0
  protected _height: number = 0
  protected _nodeParams?: unknown
  protected _canvas?: unknown
  protected _themeName: string = 'light'
  protected _customTheme: Record<string, unknown> | null = null
  protected _theme: EditorTheme = {}
  protected _previewElement: EditorElement | null = null
  protected _previewTemplate: EditorElement[] | null = null

  // Public properties
  public emitter = new EventEmitter()
  public editorData: unknown
  public highlightBox: unknown
  public stateManager: unknown
  public selectorManager: unknown
  public chartEditorState: unknown
  public editorController: EditorController
  public event: unknown
  public commonHistoryUse: (element: { layerId?: string; id?: string }, from: unknown, to: unknown) => void

  constructor(options: EditorOptions) {
    this._option = options

    const { dom, mode, layoutMode, renderMode, nodeParams, canvas } = this._option

    this._mode = mode ?? 'view'
    this._layoutMode = layoutMode ?? 'free'
    if (renderMode) {
      this._renderMode = renderMode
    }
    this._nodeParams = nodeParams
    this._canvas = canvas

    // Initialize editor data (original: this._editorData = new tp(this, this._option.data))
    this.editorData = {}

    // Initialize highlight box (original: this._highlightBox = new Uh)
    this.highlightBox = {}

    // Initialize state manager and selector manager for editor mode
    if (this._mode === 'editor' || this._mode === 'preview_editor') {
      // this._stateManager = new op(this)
      // this._selectorManager = new wa()
      this.stateManager = {}
      this.selectorManager = {}
    }

    // Initialize chart editor state
    this.chartEditorState = {}

    // Initialize common history use function
    this.commonHistoryUse = (element, from, to) => {
      const layer = this._layers.find(l => l.id === element.layerId)
      if (!layer) return

      const el = layer.elements.find(e => e.id === element.id)
      if (!el) {
        if ((from as { theme?: string })?.theme || (to as { theme?: string })?.theme) {
          if ((to as { theme?: string })?.theme) {
            this.updateTheme((to as { theme: string }).theme, true)
          }
          return
        }
        if (to) {
          console.warn('The element to be edited was not found!', { ...element })
          return
        }
        if (from) {
          // this.addElements(element.type, from, false)
        }
        return
      }

      if (el) {
        if (!to) {
          // this.deleteElement(el.id, false)
        }
        if (to) {
          el.updateAttributeFromHistory(to, from)
        }
      }
    }

    // Setup data layer callbacks
    this._option.data.setLayers(() => this._layers)
    this._option.data.setDataKey(`_vchart_editor_${this._option.id}`)

    // Setup container
    if (dom && this._renderMode === 'browser') {
      this._container = typeof dom === 'string' 
        ? document?.getElementById(dom) ?? null 
        : dom
    }

    // Initialize editor controller (original: this._editorController = new Wh())
    this.editorController = new EditorController()

    // Initialize event
    this._initEvent()

    // Initialize theme
    this._initTheme()

    // Set container style
    if (this._container) {
      this._container.style.position = 'relative'
    }
  }

  // Static methods
  static registerParser(type: string, parser: unknown): void {
    // td.registerParser(type, parser)
    console.log('registerParser:', type, parser)
  }

  static registerTemp(type: string, temp: unknown): void {
    // td.registerTemp(type, temp)
    console.log('registerTemp:', type, temp)
  }

  static registerTheme(name: string, theme: EditorTheme): void {
    // td.registerTheme(name, theme)
    console.log('registerTheme:', name, theme)
  }

  static setDefaultTheme(name: string): void {
    // td.setDefaultTheme(name)
    console.log('setDefaultTheme:', name)
  }

  static getDefaultTheme(): string {
    // return td.getDefaultTheme()
    return 'light'
  }

  // Getters
  get option(): EditorOptions {
    return this._option
  }

  get container(): HTMLElement | null {
    return this._container
  }

  get layers(): Layer[] {
    return this._layers
  }

  get hightLightBox(): unknown {
    return this.highlightBox
  }

  get events(): unknown {
    return this.event
  }

  get mode(): EditorMode {
    return this._mode
  }

  get layoutMode(): LayoutMode {
    return this._layoutMode
  }

  get width(): number {
    return this._width - 24
  }

  get height(): number {
    return this._height - 24
  }

  get isReleased(): boolean {
    return this._isReleased
  }

  get currentPreviewElement(): EditorElement | null {
    return this._previewElement
  }

  get currentPreviewTemplate(): EditorElement[] | null {
    return this._previewTemplate
  }

  get state(): EditorState {
    return this._state
  }

  get renderMode(): RenderMode {
    return this._renderMode
  }

  get nodeParams(): unknown {
    return this._nodeParams
  }

  get theme(): EditorTheme {
    return this._theme
  }

  // Set state
  setState(state: Partial<EditorState>, stateInfo?: unknown): void {
    this._state = { ...this._state, ...state }
    this.emitter.emit(EditorEvent.onStateChange, {
      state: this._state,
      stateInfo,
    })
  }

  // Initialize event
  protected _initEvent(): void {
    // this._event = new gp(this)
    // this._event.initEvent()
    this.event = {}
    // this._stateManager?.initEvent()
  }

  // Initialize theme
  protected _initTheme(): void {
    this._themeName = this.option.theme ?? Editor.getDefaultTheme()
    this._customTheme = this.option.customTheme ?? null
    // const theme = td.getTheme(this._themeName)
    // this._theme = { ...theme ?? {}, ...this._customTheme ?? {} }
    this._theme = { ...this._customTheme }
  }

  // Check if all layers are ready
  checkLayerReady = (): boolean => {
    if (!this._isLoaded || this._isLoading) {
      return false
    }
    const allReady = this._layers.every(layer => layer.isElementReady)
    if (allReady) {
      if (!this._isLoaded) {
        this._isLoaded = true
      }
      this._isLoading = false
      this._afterAllLayerReady()
      return true
    }
    return false
  }

  // Get layers
  getLayers = (): Layer[] => this._layers

  // Add elements
  addElements(type: string, option: ElementOption, saveHistory = true): EditorElement | null {
    // if (!Ph[type]) return null
    
    let layer = this.layers[0]
    if (!layer) {
      layer = this.createLayer(option.id)
    }

    option.renderCanvas = layer.getCanvas()
    option.type = type
    option.layer = layer
    option.language = this._option.language ?? Language.chinese

    // layer.fillElementOption(option)
    
    // const element = new Ph[type](option)
    const element: EditorElement = {
      id: option.id ?? `el_${Date.now()}`,
      type,
      updateAttributeFromHistory: () => {},
      moveBy: () => {},
      selectElement: () => {},
      clearCurrentEditorElement: () => {},
      setMode: () => {},
      applyTheme: () => {},
      setKeepStyle: () => {},
      getKeepStyle: () => false,
    }

    if (element) {
      // this.editorController.removeOverGraphic()
      // element.initWithOption()
      layer.addElements(element)
      // layer.changeElementLayoutZIndex(element.id, { action: 'toTop' }, false)
      // element.afterAdd(option, saveHistory)
      return element
    }

    return null
  }

  // Create layer
  createLayer(id?: string): Layer {
    const layer: Layer = {
      id: id ?? `layer_${Date.now()}`,
      elements: [],
      isElementReady: true,
      getCanvas: () => document.createElement('canvas'),
      getStage: () => null,
      addElements: () => {},
      removeElement: () => {},
      getAABBBounds: () => ({
        x1: 0, y1: 0, x2: 0, y2: 0,
        width: () => 0,
        height: () => 0,
        empty: () => true,
        union: () => {},
        expand: () => {},
      }),
      resizeLayer: () => {},
      reLayoutWithOffset: () => {},
      zoomMove: { zoomTo: () => {} },
      setThemeName: () => {},
      setCustomTheme: () => {},
      scale: 1,
      changeElementLayoutZIndex: () => {},
    }

    const themeName = this.option.theme ?? Editor.getDefaultTheme()
    layer.setThemeName(themeName)

    this.addLayer(layer)
    return layer
  }

  // Add layer
  addLayer(layer: Layer): void {
    if (this._renderMode === 'browser') {
      layer.getCanvas().style.zIndex = String(200 + this._layers.length)
    }
    // layer.onElementReady(this.checkLayerReady)
    this._layers.push(layer)

    if (this._layers.length === 1) {
      // this._event.changeTriggerLayer(layer, null)
      // this._highlightBox.setLayer(layer)
    }
  }

  // After all layer ready
  protected _afterAllLayerReady(): void {
    if (this._needResize && this._width && this._height) {
      this._needResize = false
      this.resize(this._width, this._height)
    }
    if (this._needLayoutToCenter) {
      this.reLayoutToCenter()
    }
    this.emitter.emit(EditorEvent.afterAllLayerReady)
  }

  // Delete element
  deleteElement(id?: string, saveHistory = true): void {
    // this.event.boxSelection?.clearLayoutComponent()
    if (id) {
      this._layers.forEach(layer => layer.removeElement(id, saveHistory))
    } else {
      // this._editorController.deleteCurrentElement(saveHistory)
    }
  }

  // Check if empty
  isEmpty(): boolean {
    return this.layers.every(layer => layer.elements.length === 0)
  }

  // Reset layout z-index
  resetLayoutZIndex(): void {
    if (this._renderMode === 'node') return
    this._layers.forEach((layer, index) => {
      layer.getCanvas().style.zIndex = String(200 + index)
    })
  }

  // Get all elements
  protected _getAllElements(): EditorElement[] {
    return this._layers.flatMap(layer => layer.elements)
  }

  // Get elements by type
  getElementsByType(type: string): EditorElement[] {
    return this._getAllElements().filter(el => el.type === type)
  }

  // Get chart elements
  getChartElements(): EditorElement[] {
    return this._getAllElements().filter(el => el.type === 'chart' || el.type === 'table')
  }

  // Get element by id
  getElementById(id: string): EditorElement | null {
    return this._getAllElements().find(el => el.id === id) ?? null
  }

  // Zoom to
  zoomTo(zoom: number, options?: unknown): void {
    this._layers.forEach(layer => {
      layer.zoomMove.zoomTo(zoom, options)
    })
  }

  // Resize
  resize(width: number, height: number): void {
    if (typeof width === 'number' && typeof height === 'number') {
      this._width = width
      this._height = height
      if (this._mode === 'view') {
        this._resizeToCenter()
      } else {
        this._resizeCanvas()
      }
    }
  }

  // Resize to center
  protected _resizeToCenter(): void {
    const width = this._width
    const height = this._height

    if (this._layers.length === 0) return
    if (!this.checkLayerReady()) return

    this._layers.forEach(layer => {
      layer.elements.forEach(el => el.onResize?.())
    })
    this._needResize = false

    // Calculate bounds and center
    // ... (simplified for now)
    this._layers.forEach(layer => {
      layer.resizeLayer(width, height, 0, 0, 1)
    })
  }

  // Resize canvas
  protected _resizeCanvas(): void {
    this._layers.forEach(layer => {
      layer.resizeLayer(this._width, this._height)
    })
  }

  // Set size
  setSize(width: number, height: number): void {
    this._width = width
    this._height = height
  }

  // Re-layout to center
  reLayoutToCenter(padding?: { left?: number; right?: number; top?: number; bottom?: number }): void {
    if (typeof this._width !== 'number' || typeof this._height !== 'number') return
    if (this._layers.length === 0) return

    if (!this._layers.every(layer => layer.isElementReady)) {
      this._needLayoutToCenter = true
      return
    }

    this._needResize = false
    this._needLayoutToCenter = false

    // ... layout logic
  }

  // Initialize interactions (original: e.initInteractions())
  initInteractions(): void {
    // Initialize interaction handlers for editor mode
    // In original: e.initInteractions() - sets up interaction state manager
    logger.debug('Editor.initInteractions')
  }

  // Load latest data
  async loadLasted(width: number, height: number, data?: unknown[]): Promise<void> {
    if (!this._option.data) return

    let loadData = data ?? await (this._option.data as EditorDataInterface).load()
    if (this._isReleased) return

    this._isLoading = true
    this._removeLast()

    if (width && height) {
      this._width = width
      this._height = height
      if (this._mode === 'view') {
        this._needResize = true
      }
    }

    if (Array.isArray(loadData)) {
      loadData.forEach((layerData: { theme?: string; customTheme?: Record<string, unknown> }) => {
        if (layerData.theme || layerData.customTheme) {
          this._themeName = layerData.theme ?? Editor.getDefaultTheme()
          this._customTheme = layerData.customTheme ?? null
        }

        const layer = this.createLayer()
        layer.setThemeName(this._themeName)
        layer.setCustomTheme(this._customTheme)
      })
    }
  }

  // Release
  release(): void {
    this._isReleased = true
    // this._stateManager?.release()
    this._releaseEditors()
    // this._editorController.release()
    this._layers.forEach(layer => {
      // layer.release()
    })
    this._layers = []
    // this._event.release()
    this.emitter.removeAllListeners()
  }

  // Release editors
  protected _releaseEditors(): void {
    Object.values(this._editorMap).forEach((editor: unknown) => {
      // (editor as { release: () => void }).release?.()
    })
  }

  // Remove last
  protected _removeLast(): void {
    // this._event.clearTriggerLayer()
    this._layers.forEach(layer => {
      // layer.release()
    })
    this._layers = []
  }

  // Update theme
  updateTheme(themeName: string, saveHistory = true): void {
    this._themeName = themeName
    // const theme = td.getTheme(themeName)
    // this._theme = { ...theme ?? {}, ...this._customTheme ?? {} }

    this._layers.forEach(layer => {
      layer.setThemeName(themeName)
    })

    this._applyTheme(this._theme)

    if (saveHistory) {
      // this.editorData.pushHistoryNextTick({ ... })
    }

    // this.clearAllEditorElements()
  }

  // Apply theme
  protected _applyTheme(theme: EditorTheme, applyColor = false, applyToAll = true): void {
    this._layers.forEach(layer => {
      // layer.getStage().background = theme.backgroundColor ?? 'transparent'
    })

    const elements = this._getAllElements()
    elements.forEach(el => {
      if (!applyToAll && el.type !== 'chart' && el.type !== 'table') return
      // el.applyTheme(...)
    })
  }

  // Clear current editor element
  clearCurrentEditorElement(options: { element?: boolean; boxSelection?: boolean; sendFinishMsg?: boolean } = {}): void {
    if (options.element !== false) {
      this._layers.forEach(layer => {
        layer.elements.forEach(el => {
          el.clearCurrentEditorElement()
        })
      })
    }
    // this.editorController.setEditorElements(null, null, { sendFinishMsg: options.sendFinishMsg })
  }

  // Clear all editor elements
  clearAllEditorElements(options: { sendFinishMsg?: boolean } = { sendFinishMsg: true }): void {
    this.clearCurrentEditorElement(options)
    // this._event.clearCurrentEditorBox()
    // this._editorController.setOverGraphic(null, null, null)
  }

  // Render sync
  renderSync(): void {
    // this._layers[0].getStage().render()
  }

  // To base64
  toBase64(): string | null {
    const layer = this._layers[0]
    if (!layer) return null
    const stage = layer.getStage()
    if (!stage) return null
    // stage.render()
    return layer.getCanvas().toDataURL()
  }
}

export default Editor

// ============================================
// Editor Data Class (original: Cb - main.e2a65968.js)
// ============================================

/**
 * Editor Data class for managing editor data persistence
 * Original: Cb class in main.e2a65968.js
 */
export class EditorData implements EditorDataInterface {
  private _dataArray: unknown[] = []
  private _version?: string
  private _getLayers?: () => Layer[]
  private _dataKey: string = ''

  // Public _data for compatibility with original code
  public _data?: unknown

  constructor() {
    // Initialize with empty data
  }

  // Load data
  async load(): Promise<unknown[]> {
    return this._dataArray
  }

  // Set layers getter
  setLayers(getLayers: () => Layer[]): void {
    this._getLayers = getLayers
  }

  // Set data key for storage
  setDataKey(key: string): void {
    this._dataKey = key
  }

  // Get version
  get version(): string | undefined {
    return this._version
  }

  // Set version
  setVersion(version: string): void {
    this._version = version
  }

  // Save data
  async save(data: unknown[]): Promise<void> {
    this._dataArray = data
  }

  // Clear history (placeholder)
  clearHistory(): void {
    // Original: e.editorData.clearHistory()
    logger.debug('EditorData.clearHistory')
  }

  // Save data (placeholder)
  saveData(): void {
    // Original: e.editorData.saveData()
    logger.debug('EditorData.saveData')
  }

  // Get data
  get data(): unknown[] {
    return this._dataArray
  }
}

// ============================================
// Editor Factory Function (original: Gx - main.e2a65968.js 42367-42383)
// ============================================

/**
 * Factory options for creating editor
 */
export interface EditorFactoryOptions {
  id?: string
  defaultLayoutPadding?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }
  theme?: string
  customTheme?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Create Editor instance (original: Gx function - main.e2a65968.js 42367-42383)
 * 
 * Original code:
 * function Gx(e, t, i, a, n) {
 *     const r = new fp({
 *         dom: e,
 *         data: new Cb,
 *         id: a ?? "editor-demo",
 *         mode: t,
 *         language: i,
 *         defaultLayoutPadding: "editor" === t ? {
 *             left: 92,
 *             right: 0,
 *             top: 0,
 *             bottom: 0
 *         } : void 0,
 *         ...n ?? {}
 *     });
 *     return Cy.V.getInstance().debug(r), r
 * }
 * 
 * @param dom - DOM container element or ID
 * @param mode - Editor mode ('view' | 'editor' | 'preview_editor')
 * @param language - Language code
 * @param id - Editor instance ID
 * @param options - Additional options
 * @returns Editor instance
 */
export function createEditor(
  dom: string | HTMLElement,
  mode: EditorMode,
  language: string,
  id?: string,
  options?: EditorFactoryOptions
): Editor {
  // Create editor data instance (original: data: new Cb)
  const editorData = new EditorData()

  // Build editor options
  const editorOptions: EditorOptions = {
    dom,
    data: editorData,
    id: id ?? 'editor-demo',
    mode,
    language,
    defaultLayoutPadding: mode === 'editor'
      ? {
          left: 92,
          right: 0,
          top: 0,
          bottom: 0,
        }
      : undefined,
    ...options,
  }

  // Create editor instance (original: const r = new fp({ ... }))
  const editor = new Editor(editorOptions)

  // Log for debugging (original: Cy.V.getInstance().debug(r))
  logger.debug('Editor created:', editor)

  return editor
}

// Export alias for original function name
export const Gx = createEditor
