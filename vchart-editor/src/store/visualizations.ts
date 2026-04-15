import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Visualization {
  id: string
  name: string
  spec: Record<string, unknown>
  createdAt: number
  updatedAt: number
}

interface VisualizationsState {
  visualizations: Visualization[]
  addVisualization: (viz: Omit<Visualization, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateVisualization: (id: string, updates: Partial<Omit<Visualization, 'id'>>) => void
  deleteVisualization: (id: string) => void
  getVisualization: (id: string) => Visualization | undefined
}

export const useVisualizationsStore = create<VisualizationsState>()(
  persist(
    (set, get) => ({
      visualizations: [],
      addVisualization: (viz) => {
        const now = Date.now()
        const newViz: Visualization = {
          ...viz,
          id: `viz_${now}`,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          visualizations: [...state.visualizations, newViz],
        }))
      },
      updateVisualization: (id, updates) => {
        set((state) => ({
          visualizations: state.visualizations.map((v) =>
            v.id === id
              ? { ...v, ...updates, updatedAt: Date.now() }
              : v
          ),
        }))
      },
      deleteVisualization: (id) => {
        set((state) => ({
          visualizations: state.visualizations.filter((v) => v.id !== id),
        }))
      },
      getVisualization: (id) => {
        return get().visualizations.find((v) => v.id === id)
      },
    }),
    {
      name: 'vchart-editor-visualizations',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
