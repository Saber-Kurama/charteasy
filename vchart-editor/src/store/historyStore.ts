import { create } from 'zustand'
import type { CanvasElement, ViewportState } from './canvasStore'



interface HistoryEntry {
  elements: CanvasElement[]
  viewport: ViewportState
  timestamp: number
}

interface HistoryStore {
  past: HistoryEntry[]
  future: HistoryEntry[]
  
  // Actions
  saveState: (elements: CanvasElement[], viewport: ViewportState) => void
  undo: () => HistoryEntry | null
  redo: () => HistoryEntry | null
  canUndo: () => boolean
  canRedo: () => boolean
  clear: () => void
}

const MAX_HISTORY = 50

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  past: [],
  future: [],
  
  saveState: (elements, viewport) => {
    set(state => {
      const newEntry: HistoryEntry = {
        elements: JSON.parse(JSON.stringify(elements)),
        viewport: { ...viewport },
        timestamp: Date.now(),
      }
      const newPast = [...state.past, newEntry].slice(-MAX_HISTORY)
      return {
        past: newPast,
        future: [],
      }
    })
  },
  
  undo: () => {
    const state = get()
    if (state.past.length === 0) return null
    
    const previous = state.past[state.past.length - 1]
    const newPast = state.past.slice(0, -1)
    
    set(state => ({
      past: newPast,
      future: [previous, ...state.future].slice(0, MAX_HISTORY),
    }))
    
    return previous
  },
  
  redo: () => {
    const state = get()
    if (state.future.length === 0) return null
    
    const next = state.future[0]
    const newFuture = state.future.slice(1)
    
    set(state => ({
      past: [...state.past, next].slice(-MAX_HISTORY),
      future: newFuture,
    }))
    
    return next
  },
  
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  
  clear: () => {
    set({ past: [], future: [] })
  },
}))

// Hook to use history with canvas store
export function useHistory() {
  const history = useHistoryStore()
  return history
}
