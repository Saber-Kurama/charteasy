import { forwardRef, useEffect } from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import { HeaderTools } from '../Toolbar/HeaderTools'
import { ChartCanvas } from '../Canvas/ChartCanvas'
import './EditApp.css'

interface EditAppProps {
  handlers?: {
    onInit?: () => void
    onReady?: (data: unknown) => void
  }
  guideVisible?: boolean
}

interface EditorState {
  editor: unknown
  updateEditor: () => void
}

// Original: wV = forwardRef((e, t) => { ... })
export const EditApp = forwardRef<EditorState, EditAppProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function EditApp({ handlers, guideVisible = false }, _ref) {
    // Get editor state from canvas store
    // Original: const { editor: l, updateEditor: c } = jS(...)
    const { elements, selectedIds, mode } = useCanvasStore()
    
    // Simulate editor ready state
    const isReady = true
    
    // Expose imperative methods
    // Original: bC(t, l, c) - binds ref to editor state
    // We use a simple object for now
    // @ts-expect-error - editorState defined for future ref implementation
    const editorState: EditorState = {
      editor: { elements, selectedIds, mode },
      updateEditor: () => {
        console.log('Update editor')
      },
    }
    
    // Notify parent when initialized
    // Original: useEffect(() => { r && (i?.onInit?.(), ... ) }, [r])
    useEffect(() => {
      if (isReady) {
        handlers?.onInit?.()
        // Performance mark (original: G_.performanceMarkEnd)
        console.log('EditApp initialized')
        window.focus()
      }
    }, [isReady, handlers])
    
    // Select first chart element on mount
    // Original: useEffect(() => { if (l && u_(s_.AI_ASSISTANT_INITIAL_DISPLAY)) { ... } }, [l])
    useEffect(() => {
      const chartElements = elements.filter(el => el.type === 'chart')
      if (chartElements.length > 0 && selectedIds.length === 0) {
        // Auto-select first chart element
        const { selectElement } = useCanvasStore.getState()
        selectElement(chartElements[0].id)
      }
    }, [elements, selectedIds.length])
    
    // Don't render if not ready
    // Original: return r ? (...) : null
    if (!isReady) {
      return null
    }
    
    return (
      <div className="edit-app">
        {/* Original: (0, a.jsx)(QL, { handlers: i }) */}
        {/* QL - Top toolbar / Header */}
        <HeaderTools handlers={handlers} />
        
        {/* Original: (0, a.jsx)(AV, {}) */}
        {/* AV - AI Assistant or additional toolbar */}
        
        {/* Original: (0, a.jsx)(wL, { handlers: i }) */}
        {/* wL - ChartCanvas*/}
        <ChartCanvas handlers={handlers} />
        
        {/* Editor content area */}
        {elements ? (
          <>
            {/* Original: (0, a.jsx)(EL, { guideVisible: n }) */}
            {/* EL - Guide/Help overlay */}
            {guideVisible && (
              <div className="edit-app-guide">
                <span>Guide overlay</span>
              </div>
            )}
            
            {/* Original: (0, a.jsx)(mV, {}) */}
            {/* mV - area (wL component) */}
            
            
            {/* Original: (0, a.jsx)(oG, {}) */}
            {/* oG - Overlay components */}
            
            {/* Original: u_(s_.DATA_EDIT) && (0, a.jsx)(aL, {}) */}
            {/* aL - Data edit panel (conditional) */}
            
            {/* Original: (0, a.jsx)(sG, { handlers: i }) */}
            {/* sG - Selection/Property panel */}
            {/* <PropertyPanel /> */}
            
            {/* Original: (0, a.jsx)(_G, {}) */}
            {/* _G - Additional overlays */}
            
            {/* View toolbar */}
            {/* <ViewToolbar /> */}
          </>
        ) : null}
        
        {/* Original: (0, a.jsx)(lG, {}) */}
        {/* lG - Bottom/Layer panel */}
      </div>
    )
  }
)
