import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Visualization {
  id: string
  name: string
  elements: unknown[]
  viewport: {
    zoom: number
    offsetX: number
    offsetY: number
  }
  canvasWidth: number
  canvasHeight: number
  showGrid: boolean
  gridSize: number
  createdAt: number
  updatedAt: number
}

interface VisualizationState {
  visualizations: Visualization[]
  
  // Actions
  setVisualizations: (visualizations: Visualization[]) => void
  addVisualization: (visualization: Visualization) => void
  updateVisualization: (id: string, updates: Partial<Visualization>) => void
  deleteVisualization: (id: string) => void
  clearVisualizations: () => void
  
  // Getters
  getVisualizationById: (id: string) => Visualization | undefined
}

export const useVisualizationStore = create<VisualizationState>()(
  persist(
    (set, get) => ({
      visualizations: [],
      
      setVisualizations: (visualizations) => {
        set({ visualizations })
      },
      
      addVisualization: (visualization) => {
        const { visualizations } = get()
        const exists = visualizations.find(v => v.id === visualization.id)
        const newVisualizations = exists
          ? visualizations.map(v => v.id === visualization.id ? visualization : v)
          : [...visualizations, visualization]
        set({ visualizations: newVisualizations })
      },
      
      updateVisualization: (id, updates) => {
        const { visualizations } = get()
        const newVisualizations = visualizations.map(v =>
          v.id === id ? { ...v, ...updates, updatedAt: Date.now() } : v
        )
        set({ visualizations: newVisualizations })
      },
      
      deleteVisualization: (id) => {
        const { visualizations } = get()
        set({ visualizations: visualizations.filter(v => v.id !== id) })
      },
      
      clearVisualizations: () => {
        set({ visualizations: [] })
      },
      
      getVisualizationById: (id) => {
        return get().visualizations.find(v => v.id === id)
      },
    }),
    {
      name: 'vchart-visualizations-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
