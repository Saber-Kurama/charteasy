import { create } from 'zustand'

// Editor element interface (matching VChart Editor API)
export interface EditorElement {
  id: string
  type: string
  part?: string
  partDetail?: unknown
  originSpec?: unknown
  updateElement?: (options?: { ignoreIdMatch?: boolean; updateId?: boolean }) => void
  vchartType?: string
  vchart?: {
    getSpec: () => { maskShape?: unknown }
  }
}

// Editor state interface (matching original jS store - main.e2a65968.js 47505-47570)
export interface EditorState {
  part: string | null
  element: EditorElement | null
}

// Editor interaction interface
export interface EditorInteraction {
  state: 'normal' | 'editing' | 'interacting'
}

// Interaction instance class (matching original OS class)
class InteractionInstance {
  private listeners: Map<string, Set<() => void>> = new Map()

  subscribe(event: string, callback: () => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  emit(event: string): void {
    this.listeners.get(event)?.forEach(callback => callback())
  }

  update(interaction: EditorInteraction): void {
    console.log('InteractionInstance.update:', interaction)
    this.emit('interaction-change')
  }
}

// Editor instance interface
export interface EditorInstance {
  id: string
  type: string
  editorController: {
    currentEditorElement: EditorElement | null
    addStartHandler: (handler: (element: EditorElement) => void) => void
    addRunHandler: (handler: () => void) => void
    addEndHandler: (handler: (element: EditorElement) => void) => void
    addFinishHandler: (handler: () => void) => void
  }
  emitter: {
    on: (event: string, handler: (...args: unknown[]) => void) => void
    off: (event: string, handler: (...args: unknown[]) => void) => void
  }
  editorData: {
    backwardEnable: () => boolean
    forwardEnable: () => boolean
  }
  zoomTo: (zoom: number) => void
  reLayoutToCenter: () => void
  getChartElements: () => EditorElement[]
  release: () => void
  loadLasted: (width: number, height: number) => Promise<void>
}

// Helper function to extract part from element (matching original nS function)
const getEditorElementPart = (element: EditorElement | null): string | null => {
  if (!element) return null
  return element.part ?? null
}

// Editor store interface
interface EditorStore {
  // Editor instance
  editor: EditorInstance | null
  setEditor: (editor: EditorInstance | null) => void

  // Editor state (current editing element)
  editorState: EditorState
  setEditorState: (state: EditorState) => void

  // Editor update flag (for triggering re-renders)
  editorUpdateFlag: number
  updateEditor: (shouldUpdate?: boolean) => void

  // Interaction instance
  interactionInstance: InteractionInstance

  // Editor interaction state
  editorInteraction: EditorInteraction
  setEditorInteraction: (interaction: EditorInteraction) => void

  // Edit series info
  editSeriesInfo: unknown
  setEditSeriesInfo: (info: unknown) => void

  // Edit table row info
  editTableRowInfo: unknown
  setEditTableRowInfo: (info: unknown) => void

  // Edit table column info
  editTableColumnInfo: unknown
  setEditTableColumnInfo: (info: unknown) => void
}

// Create the interaction instance singleton
const interactionInstance = new InteractionInstance()

// Create editor store (matching original jS - main.e2a65968.js 47505-47570)
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Editor instance (original: editor: null)
  editor: null,
  setEditor: (editor) => {
    set({ editor })
  },

  // Editor state (original: editorState: { part: null, element: null })
  editorState: {
    part: null,
    element: null,
  },
  setEditorState: (editorState) => {
    set({ editorState })
  },

  // Editor update flag (original: editorUpdateFlag: 0)
  editorUpdateFlag: 0,
  updateEditor: (shouldUpdate = true) => {
    set((state) => {
      const newState: Partial<EditorStore> = {
        editorUpdateFlag: state.editorUpdateFlag + 1,
      }

      if (shouldUpdate && state.editor) {
        // Get current editor element (original: e.editor.editorController.currentEditorElement)
        const currentElement = state.editor.editorController.currentEditorElement

        // Update element if available (original: t?.updateElement?.({ ignoreIdMatch: !0, updateId: !0 }))
        if (currentElement?.updateElement) {
          currentElement.updateElement({
            ignoreIdMatch: true,
            updateId: true,
          })
        }

        // Update editor state (original: i.editorState = t ? { part: nS(t), element: t } : { part: null, element: null })
        newState.editorState = currentElement
          ? {
              part: getEditorElementPart(currentElement),
              element: currentElement,
            }
          : {
              part: null,
              element: null,
            }
      }

      return newState
    })
  },

  // Interaction instance (original: interactionInstance: new OS)
  interactionInstance,

  // Editor interaction (original: editorInteraction: { state: "normal" })
  editorInteraction: {
    state: 'normal',
  },
  setEditorInteraction: (interaction) => {
    set((state) => {
      // Original: "normal" === e.editorInteraction.state && "normal" === t.state ? {} : (RS().update(t), { editorInteraction: t })
      if (state.editorInteraction.state === 'normal' && interaction.state === 'normal') {
        return {}
      }

      // Update interaction instance (original: RS().update(t))
      state.interactionInstance.update(interaction)

      return { editorInteraction: interaction }
    })
  },

  // Edit series info (original: editSeriesInfo: null)
  editSeriesInfo: null,
  setEditSeriesInfo: (editSeriesInfo) => {
    set({ editSeriesInfo })
  },

  // Edit table row info (original: editTableRowInfo: null)
  editTableRowInfo: null,
  setEditTableRowInfo: (editTableRowInfo) => {
    set({ editTableRowInfo })
  },

  // Edit table column info (original: editTableColumnInfo: null)
  editTableColumnInfo: null,
  setEditTableColumnInfo: (editTableColumnInfo) => {
    set({ editTableColumnInfo })
  },
}))
