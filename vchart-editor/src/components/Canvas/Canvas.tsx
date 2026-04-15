import { useRef, useEffect, useState, useCallback } from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import { useHistoryStore } from '../../store/historyStore'
import { CanvasElement } from './CanvasElement'
import { SelectionBox } from './SelectionBox'
import './Canvas.css'

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  
  const {
    elements,
    selectedIds,
    viewport,
    showGrid,
    gridSize,
    canvasWidth,
    canvasHeight,
    selectElement,
    deselectAll,
    pan,
    setOffset,
  } = useCanvasStore()
  
  const { saveState } = useHistoryStore()
  
  // Save initial state for history
  useEffect(() => {
    saveState(elements, viewport)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(true)
        e.preventDefault()
      }
      if (e.key === 'Escape') {
        deselectAll()
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [deselectAll])
  
  // Mouse handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (isSpacePressed && e.button === 0)) {
      if (isSpacePressed || e.button === 1 || e.button === 2) {
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY })
        e.preventDefault()
      } else {
        deselectAll()
      }
    }
  }, [isSpacePressed, deselectAll])
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = (e.clientX - panStart.x) / viewport.zoom
      const dy = (e.clientY - panStart.y) / viewport.zoom
      pan(dx, dy)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }, [isPanning, panStart, viewport.zoom, pan])
  
  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newZoom = Math.max(0.1, Math.min(3, viewport.zoom + delta))
      
      // Zoom towards mouse position
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = (e.clientX - rect.left) / viewport.zoom - viewport.offsetX
        const mouseY = (e.clientY - rect.top) / viewport.zoom - viewport.offsetY
        
        const newOffsetX = (e.clientX - rect.left) / newZoom - mouseX
        const newOffsetY = (e.clientY - rect.top) / newZoom - mouseY
        
        setOffset(newOffsetX, newOffsetY)
      }
    } else {
      // Pan with wheel
      pan(-e.deltaX / viewport.zoom, -e.deltaY / viewport.zoom)
    }
  }, [viewport.zoom, viewport.offsetX, viewport.offsetY, pan, setOffset])
  
  // Prevent context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])
  
  // Sort elements by z-index
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex)
  
  return (
    <div
      ref={canvasRef}
      className={`canvas-container ${isPanning ? 'panning' : ''} ${isSpacePressed ? 'space-pressed' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
    >
      <div
        className="canvas-content"
        style={{
          transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Grid Background */}
        {showGrid && (
          <div
            className="canvas-grid"
            style={{
              backgroundSize: `${gridSize}px ${gridSize}px`,
              width: canvasWidth,
              height: canvasHeight,
            }}
          />
        )}
        
        {/* Canvas Area */}
        <div
          className="canvas-area"
          style={{
            width: canvasWidth,
            height: canvasHeight,
          }}
        >
          {/* Elements */}
          {sortedElements.map(element => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedIds.includes(element.id)}
              onSelect={(multi) => selectElement(element.id, multi)}
            />
          ))}
          
          {/* Selection Box */}
          {selectedIds.length > 0 && <SelectionBox />}
        </div>
      </div>
    </div>
  )
}
