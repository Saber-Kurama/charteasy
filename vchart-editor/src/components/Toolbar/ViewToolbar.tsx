import { useCanvasStore } from '../../store/canvasStore'
import { useHistoryStore } from '../../store/historyStore'
import './Toolbar.css'

export function ViewToolbar() {
  const { zoomIn, zoomOut, viewport } = useCanvasStore()
  const { undo, redo, canUndo, canRedo } = useHistoryStore()
  
  const handleUndo = () => {
    const prevState = undo()
    if (prevState) {
      // Restore state logic would go here
      // For now, we just trigger the undo action
    }
  }
  
  const handleRedo = () => {
    const nextState = redo()
    if (nextState) {
      // Restore state logic would go here
    }
  }
  
  return (
    <div className="view-toolbar">
      <div className="view-toolbar-group">
        <button className="view-toolbar-btn" title="Language">
          <span className="lang-icon">中</span>
        </button>
      </div>
      
      <div className="view-toolbar-group">
        <button 
          className="view-toolbar-btn" 
          onClick={handleUndo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button 
          className="view-toolbar-btn" 
          onClick={handleRedo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>
      
      <div className="view-toolbar-group zoom-group">
        <button className="view-toolbar-btn zoom-btn" onClick={zoomOut} title="Zoom Out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
          </svg>
        </button>
        <span className="zoom-level">{Math.round(viewport.zoom * 100)}%</span>
        <button className="view-toolbar-btn zoom-btn" onClick={zoomIn} title="Zoom In">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </button>
      </div>
      
      <div className="view-toolbar-group">
        <button className="view-toolbar-btn help-btn" title="Help">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  )
}
