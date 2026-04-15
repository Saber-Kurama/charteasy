import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ElementType = 'chart' | 'table' | 'text' | 'rect' | 'circle' | 'oval' | 'diamond' | 'callout' | 'straightLine' | 'elbowLine' | 'curveLine' | 'arrow' | 'image' | 'svg' | 'chartConnectorLine'

export type EditorMode = 
  | 'normal'           // 正常模式
  | 'addTool'          // 添加工具模式
  | 'editData'         // 编辑数据模式
  | 'changeChart'      // 更改图表类型
  | 'addMarkPoint'     // 添加标记点
  | 'addAxisBreak'     // 添加坐标轴断点
  | 'addChartConnector' // 添加图表连接线
  | 'boxSelectionSelecting' // 框选模式
  | 'multipleSelecting' // 多选模式
  | 'none'             // 无模式

export interface SelectedDataItem {
  seriesId: string
  dataIndex: number
  dataItem: Record<string, unknown>
}

export interface CanvasElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  zIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export interface ChartSelection {
  elementId: string
  dataItem?: SelectedDataItem
  seriesId?: string
}

export interface ViewportState {
  zoom: number
  offsetX: number
  offsetY: number
}

interface CanvasState {
  // Elements
  elements: CanvasElement[]
  selectedIds: string[]
  
  // Chart Selection (for selecting data items within a chart)
  chartSelection: ChartSelection | null
  
  // Editor Mode
  mode: EditorMode
  
  // Viewport
  viewport: ViewportState
  
  // Canvas settings
  canvasWidth: number
  canvasHeight: number
  showGrid: boolean
  gridSize: number
  
  // Actions
  addElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => string
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  removeElement: (id: string) => void
  setElementData: (id: string, data: unknown) => void
  
  // Selection
  selectElement: (id: string, multi?: boolean) => void
  selectElements: (ids: string[]) => void
  deselectAll: () => void
  
  // Viewport
  setZoom: (zoom: number) => void
  setOffset: (x: number, y: number) => void
  pan: (dx: number, dy: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetViewport: () => void
  
  // Canvas settings
  setCanvasSize: (width: number, height: number) => void
  toggleGrid: () => void
  setGridSize: (size: number) => void
  
  // Z-index
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  
  // Mode
  setMode: (mode: EditorMode) => void
  
  // Chart Selection
  setChartSelection: (selection: ChartSelection | null) => void
  selectChartDataItem: (elementId: string, dataItem: SelectedDataItem) => void
  clearChartSelection: () => void
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      elements: [],
      selectedIds: [],
      viewport: {
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
      },
      canvasWidth: 1920,
      canvasHeight: 1080,
      showGrid: true,
      gridSize: 20,
      
      addElement: (element) => {
        const id = `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const maxZ = Math.max(0, ...get().elements.map(e => e.zIndex))
        const newElement: CanvasElement = {
          ...element,
          id,
          zIndex: maxZ + 1,
        }
        set(state => ({
          elements: [...state.elements, newElement],
          selectedIds: [id],
        }))
        return id
      },
      
      updateElement: (id, updates) => {
        set(state => ({
          elements: state.elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
          ),
        }))
      },
      
      removeElement: (id) => {
        set(state => ({
          elements: state.elements.filter(el => el.id !== id),
          selectedIds: state.selectedIds.filter(sid => sid !== id),
        }))
      },
      
      setElementData: (id, data) => {
        set(state => ({
          elements: state.elements.map(el =>
            el.id === id ? { ...el, data } : el
          ),
        }))
      },
      
      selectElement: (id, multi = false) => {
        set(state => ({
          selectedIds: multi
            ? state.selectedIds.includes(id)
              ? state.selectedIds.filter(sid => sid !== id)
              : [...state.selectedIds, id]
            : [id],
        }))
      },
      
      selectElements: (ids) => {
        set({ selectedIds: ids })
      },
      
      deselectAll: () => {
        set({ selectedIds: [] })
      },
      
      setZoom: (zoom) => {
        set(state => ({
          viewport: { ...state.viewport, zoom: Math.max(0.1, Math.min(3, zoom)) },
        }))
      },
      
      setOffset: (x, y) => {
        set(state => ({
          viewport: { ...state.viewport, offsetX: x, offsetY: y },
        }))
      },
      
      pan: (dx, dy) => {
        set(state => ({
          viewport: {
            ...state.viewport,
            offsetX: state.viewport.offsetX + dx,
            offsetY: state.viewport.offsetY + dy,
          },
        }))
      },
      
      zoomIn: () => {
        set(state => ({
          viewport: {
            ...state.viewport,
            zoom: Math.min(3, state.viewport.zoom + 0.1),
          },
        }))
      },
      
      zoomOut: () => {
        set(state => ({
          viewport: {
            ...state.viewport,
            zoom: Math.max(0.1, state.viewport.zoom - 0.1),
          },
        }))
      },
      
      resetViewport: () => {
        set({
          viewport: { zoom: 1, offsetX: 0, offsetY: 0 },
        })
      },
      
      setCanvasSize: (width, height) => {
        set({ canvasWidth: width, canvasHeight: height })
      },
      
      toggleGrid: () => {
        set(state => ({ showGrid: !state.showGrid }))
      },
      
      setGridSize: (size) => {
        set({ gridSize: size })
      },
      
      bringToFront: (id) => {
        set(state => {
          const maxZ = Math.max(0, ...state.elements.map(e => e.zIndex))
          return {
            elements: state.elements.map(el =>
              el.id === id ? { ...el, zIndex: maxZ + 1 } : el
            ),
          }
        })
      },
      
      sendToBack: (id) => {
        set(state => {
          const minZ = Math.min(0, ...state.elements.map(e => e.zIndex))
          return {
            elements: state.elements.map(el =>
              el.id === id ? { ...el, zIndex: minZ - 1 } : el
            ),
          }
        })
      },
      
      mode: 'normal' as EditorMode,
      setMode: (mode) => set({ mode }),
      
      chartSelection: null,
      setChartSelection: (selection) => set({ chartSelection: selection }),
      selectChartDataItem: (elementId, dataItem) => set({
        chartSelection: { elementId, dataItem },
        selectedIds: [elementId],
      }),
      clearChartSelection: () => set({ chartSelection: null }),
    }),
    {
      name: 'vchart-canvas-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        elements: state.elements,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight,
        showGrid: state.showGrid,
        gridSize: state.gridSize,
      }),
    }
  )
)
