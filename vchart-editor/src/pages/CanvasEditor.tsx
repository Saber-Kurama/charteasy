import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageBase } from '../components/Layout/PageBase'
import { PageLoader } from '../components/Loader/PageLoader'
import { VisualizationEditorPanel } from '../components/Editor/VisualizationEditorPanel'
import { useCanvasStore } from '../store/canvasStore'
import { useHistoryStore } from '../store/historyStore'
import { useVisualizationStore } from '../store/visualizationStore'
import './CanvasEditor.css'

export function CanvasEditor() {
  const { id = '' } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  
  // Original editor: const { visualizations, updateVisualization } = useVisualizationStore()
  const { visualizations, updateVisualization, addVisualization } = useVisualizationStore()
  const { elements, viewport, deselectAll: _deselectAll, canvasWidth, canvasHeight, showGrid, gridSize } = useCanvasStore()
  const { saveState } = useHistoryStore()
  
  // Find current visualization (matching original: s = i.find(t => t.id === e))
  const visualization = visualizations.find(v => v.id === id)
  
  // Load visualization data
  useEffect(() => {
    // Simulate API loading (matching original editor behavior)
    const timer = setTimeout(() => {
      // If visualization doesn't exist, create a new one
      if (!visualization && id) {
        addVisualization({
          id,
          name: '未命名画布',
          elements: [],
          viewport: { zoom: 1, offsetX: 0, offsetY: 0 },
          canvasWidth: 1920,
          canvasHeight: 1080,
          showGrid: true,
          gridSize: 20,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      }
      
      setIsLoading(false)
      // Trigger resize after content loads (matching original: window.dispatchEvent(new Event("resize")))
      window.dispatchEvent(new Event('resize'))
      setIsReady(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [id, visualization, addVisualization])
  
  // Sync canvas state to visualization store (matching original onUpdate behavior)
  useEffect(() => {
    if (!isReady || !id) return
    
    const timeoutId = setTimeout(() => {
      // Save to history
      saveState(elements, viewport)
      
      // Update visualization (matching original: updateVisualization(e, t))
      updateVisualization(id, {
        elements,
        viewport,
        canvasWidth,
        canvasHeight,
        showGrid,
        gridSize,
        updatedAt: Date.now(),
      })
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [elements, viewport, canvasWidth, canvasHeight, showGrid, gridSize, id, isReady, saveState, updateVisualization])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          // Ctrl+Shift+Z = Redo
        } else {
          // Ctrl+Z = Undo
        }
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected elements
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Original editor structure uses PageBase with language and pageKey
  // Matching: S = e => { const { language: t, children: i, pageKey: n } = e; ... }
  return (
    <PageBase language="zh" pageKey="visualization">
      <div className="visualization-page-container">
        {isLoading && (
          <div className="visualization-page-loader">
            <PageLoader />
            <span>加载中...</span>
          </div>
        )}
        
        {!isLoading && (
          <VisualizationEditorPanel
            language="zh"
            visualizationId={id}
            onReady={() => setIsReady(true)}
            onUpdate={(data, dataVersion) => {
              console.log('Visualization updated:', data, dataVersion)
            }}
          />
        )}
      </div>
    </PageBase>
  )
}
