import { useState } from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import type { ElementType } from '../../store/canvasStore'
import './Toolbar.css'

interface Tool {
  type: ElementType | 'select'
  icon: string
  label: string
  labelEn: string
}

const tools: Tool[] = [
  { type: 'select', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', label: '选择', labelEn: 'Select' },
  { type: 'chart', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: '图表', labelEn: 'Chart' },
  { type: 'text', icon: 'M4 6h16M4 12h16m-7 6h7', label: '文本', labelEn: 'Text' },
  { type: 'rect', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z', label: '矩形', labelEn: 'Rectangle' },
  { type: 'circle', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: '圆形', labelEn: 'Circle' },
  { type: 'arrow', icon: 'M14 5l7 7m0 0l-7 7m7-7H3', label: '箭头', labelEn: 'Arrow' },
  { type: 'image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: '图片', labelEn: 'Image' },
]

export function LeftToolbar() {
  const [activeTool, setActiveTool] = useState<string>('select')
  const { addElement } = useCanvasStore()
  
  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool.type)
    
    if (tool.type !== 'select') {
      // Add a new element at the center of the canvas
      const defaultSpec = {
        type: 'bar',
        data: [
          {
            id: 'data',
            values: [
              { x: 'A', y: 30 },
              { x: 'B', y: 50 },
              { x: 'C', y: 40 },
            ],
          },
        ],
        xField: 'x',
        yField: 'y',
        title: { visible: true, text: 'Chart' },
      }
      
      const elementData: Record<string, unknown> = {
        chart: { spec: defaultSpec },
        text: { text: '双击编辑文本', style: { fontSize: '16px', color: '#333' } },
        rect: { fill: '#e0e0e0', stroke: '#999', strokeWidth: 1 },
        circle: { fill: '#e0e0e0', stroke: '#999', strokeWidth: 1 },
        arrow: { stroke: '#333', strokeWidth: 2 },
        image: { src: 'https://via.placeholder.com/200x150', alt: 'Image' },
      }
      
      const defaultSizes: Record<string, { width: number; height: number }> = {
        chart: { width: 400, height: 300 },
        text: { width: 150, height: 40 },
        rect: { width: 150, height: 100 },
        circle: { width: 100, height: 100 },
        arrow: { width: 150, height: 4 },
        image: { width: 200, height: 150 },
      }
      
      const size = defaultSizes[tool.type] || { width: 100, height: 100 }
      
      addElement({
        type: tool.type as ElementType,
        x: 400,
        y: 300,
        width: size.width,
        height: size.height,
        data: elementData[tool.type] || {},
      })
      
      // Reset to select tool after adding
      setActiveTool('select')
    }
  }
  
  return (
    <div className="left-toolbar">
      {tools.map((tool) => (
        <button
          key={tool.type}
          className={`toolbar-btn ${activeTool === tool.type ? 'active' : ''}`}
          onClick={() => handleToolClick(tool)}
          title={`${tool.label} / ${tool.labelEn}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
          </svg>
        </button>
      ))}
    </div>
  )
}
