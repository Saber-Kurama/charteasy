import { useRef, useState, useCallback, useEffect } from 'react'
import type { CanvasElement as CanvasElementType } from '../../store/canvasStore'
import { useCanvasStore } from '../../store/canvasStore'
import { VChart } from '@visactor/react-vchart'
import { ChartFloatingToolbar } from '../Chart/ChartFloatingToolbar'
import './CanvasElement.css'

interface CanvasElementProps {
  element: CanvasElementType
  isSelected: boolean
  onSelect: (multi: boolean) => void
}

export function CanvasElement({ element, isSelected, onSelect }: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 })
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  
  const { updateElement, viewport, selectChartDataItem } = useCanvasStore()
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(e.shiftKey || e.metaKey || e.ctrlKey)
    
    // Show toolbar for chart elements when selected
    if (element.type === 'chart') {
      setShowToolbar(true)
      setToolbarPosition({ x: element.width / 2, y: 0 })
    }
    
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setElementStart({ x: element.x, y: element.y })
    }
  }, [element.x, element.y, element.width, element.type, onSelect])
  
  // Handle chart data item click
  const handleChartClick = useCallback((params: unknown) => {
    if (element.type !== 'chart') return
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clickParams = params as any
    if (clickParams && clickParams.datum) {
      selectChartDataItem(element.id, {
        seriesId: clickParams.seriesId || 'default',
        dataIndex: clickParams.dataIndex || 0,
        dataItem: clickParams.datum,
      })
    }
  }, [element.id, element.type, selectChartDataItem])
  
  useEffect(() => {
    if (!isDragging) return
    
    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragStart.x) / viewport.zoom
      const dy = (e.clientY - dragStart.y) / viewport.zoom
      
      updateElement(element.id, {
        x: elementStart.x + dx,
        y: elementStart.y + dy,
      })
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, elementStart, element.id, viewport.zoom, updateElement])
  
  const renderContent = () => {
    switch (element.type) {
      case 'chart':
        return (
          <div className="element-chart" ref={chartRef}>
            <VChart 
              spec={{
                ...element.data.spec,
                // Enable data item selection
                interactions: [
                  {
                    type: 'element-select',
                    trigger: 'click',
                    style: {
                      fill: '#1890ff',
                      fillOpacity: 0.3,
                      stroke: '#1890ff',
                      strokeWidth: 2,
                    },
                  },
                ],
              }} 
              style={{ width: '100%', height: '100%' }}
              onClick={handleChartClick}
            />
          </div>
        )
      case 'text':
        return (
          <div className="element-text" style={element.data.style}>
            {element.data.text}
          </div>
        )
      case 'rect':
        return (
          <div
            className="element-shape element-rect"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.data.fill || '#e0e0e0',
              border: element.data.stroke ? `${element.data.strokeWidth || 1}px solid ${element.data.stroke}` : 'none',
              borderRadius: element.data.borderRadius || 0,
            }}
          />
        )
      case 'circle':
        return (
          <div
            className="element-shape element-circle"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.data.fill || '#e0e0e0',
              border: element.data.stroke ? `${element.data.strokeWidth || 1}px solid ${element.data.stroke}` : 'none',
              borderRadius: '50%',
            }}
          />
        )
      case 'image':
        return (
          <img
            className="element-image"
            src={element.data.src}
            alt={element.data.alt || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )
      default:
        return null
    }
  }
  
  return (
    <div
      ref={elementRef}
      className={`canvas-element ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        zIndex: element.zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {renderContent()}
      
      {/* Floating toolbar for chart elements */}
      {element.type === 'chart' && isSelected && showToolbar && (
        <ChartFloatingToolbar 
          elementId={element.id} 
          position={toolbarPosition}
        />
      )}
    </div>
  )
}
