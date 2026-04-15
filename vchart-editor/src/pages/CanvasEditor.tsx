import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Canvas } from '../components/Canvas/Canvas'
import { LeftToolbar } from '../components/Toolbar/LeftToolbar'
import { TopToolbar } from '../components/Toolbar/TopToolbar'
import { ViewToolbar } from '../components/Toolbar/ViewToolbar'
import { useCanvasStore } from '../store/canvasStore'
import { useHistoryStore } from '../store/historyStore'
import './CanvasEditor.css'

export function CanvasEditor() {
  const { id } = useParams<{ id: string }>()
  // Use id for canvas identification
  // eslint-disable-next-line no-console
  console.log('Canvas ID:', id)
  const { elements, viewport, deselectAll } = useCanvasStore()
  const { saveState } = useHistoryStore()
  
  // Save state when elements change (for undo/redo)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState(elements, viewport)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [elements, viewport, saveState])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          // Ctrl+Shift+Z = Redo
          // handleRedo would go here
        } else {
          // Ctrl+Z = Undo
          // handleUndo would go here
        }
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected elements
        // handleDelete would go here
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  return (
    <div className="canvas-editor">
      <TopToolbar />
      <LeftToolbar />
      <ViewToolbar />
      <div className="canvas-workspace" onClick={deselectAll}>
        <Canvas />
      </div>
    </div>
  )
}
