import { useCallback } from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import './SelectionBox.css'

export function SelectionBox() {
  const { elements, selectedIds, updateElement } = useCanvasStore()
  
  const selectedElements = elements.filter(el => selectedIds.includes(el.id))
  
  if (selectedElements.length === 0) return null
  
  // Calculate bounding box for all selected elements
  const minX = Math.min(...selectedElements.map(el => el.x))
  const minY = Math.min(...selectedElements.map(el => el.y))
  const maxX = Math.max(...selectedElements.map(el => el.x + el.width))
  const maxY = Math.max(...selectedElements.map(el => el.y + el.height))
  
  const width = maxX - minX
  const height = maxY - minY
  
  const handleResize = useCallback((corner: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidths = selectedElements.map(el => el.width)
    const startHeights = selectedElements.map(el => el.height)
    const startXs = selectedElements.map(el => el.x)
    const startYs = selectedElements.map(el => el.y)
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      
      selectedElements.forEach((el, index) => {
        let newWidth = startWidths[index]
        let newHeight = startHeights[index]
        let newX = startXs[index]
        let newY = startYs[index]
        
        if (corner.includes('e')) {
          newWidth = Math.max(20, startWidths[index] + dx)
        }
        if (corner.includes('w')) {
          newWidth = Math.max(20, startWidths[index] - dx)
          newX = startXs[index] + dx
        }
        if (corner.includes('s')) {
          newHeight = Math.max(20, startHeights[index] + dy)
        }
        if (corner.includes('n')) {
          newHeight = Math.max(20, startHeights[index] - dy)
          newY = startYs[index] + dy
        }
        
        updateElement(el.id, { width: newWidth, height: newHeight, x: newX, y: newY })
      })
    }
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [selectedElements, updateElement])
  
  const corners = ['nw', 'ne', 'sw', 'se']
  const edges = ['n', 's', 'e', 'w']
  
  return (
    <div
      className="selection-box"
      style={{
        position: 'absolute',
        left: minX - 2,
        top: minY - 2,
        width: width + 4,
        height: height + 4,
        pointerEvents: 'none',
      }}
    >
      {/* Selection border */}
      <div className="selection-border" />
      
      {/* Corner handles */}
      {corners.map(corner => (
        <div
          key={corner}
          className={`resize-handle corner ${corner}`}
          onMouseDown={(e) => handleResize(corner, e)}
          style={{ pointerEvents: 'auto' }}
        />
      ))}
      
      {/* Edge handles */}
      {edges.map(edge => (
        <div
          key={edge}
          className={`resize-handle edge ${edge}`}
          onMouseDown={(e) => handleResize(edge, e)}
          style={{ pointerEvents: 'auto' }}
        />
      ))}
    </div>
  )
}
