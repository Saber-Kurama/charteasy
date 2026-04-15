import { useCanvasStore } from '../../store/canvasStore'
import './ChartToolbar.css'

interface ChartFloatingToolbarProps {
  elementId: string
  position: { x: number; y: number }
}

export function ChartFloatingToolbar({ elementId, position }: ChartFloatingToolbarProps) {
  const { chartSelection, setMode, elements } = useCanvasStore()
  
  const element = elements.find(el => el.id === elementId)
  if (!element || element.type !== 'chart') return null
  
  const hasDataItemSelected = chartSelection?.elementId === elementId && chartSelection?.dataItem
  
  const handleSmartEdit = () => {
    setMode('editData')
  }
  
  const handleChangeChart = () => {
    setMode('changeChart')
  }
  
  const handleSelectAll = () => {
    // Select all data items in the chart
    console.log('Select all series')
  }
  
  const handleAddMarkPoint = () => {
    setMode('addMarkPoint')
  }
  
  return (
    <div 
      className="chart-floating-toolbar"
      style={{
        left: position.x,
        top: position.y - 50,
      }}
    >
      <div className="chart-toolbar-content">
        {/* Smart Edit Button */}
        <button className="chart-toolbar-btn primary" onClick={handleSmartEdit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>智能编辑</span>
        </button>
        
        <div className="toolbar-divider" />
        
        {/* Series Selector */}
        <button className="chart-toolbar-btn dropdown" onClick={handleSelectAll}>
          <span>全部</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Chart Type Selector */}
        <button className="chart-toolbar-btn dropdown" onClick={handleChangeChart}>
          <span>柱系列</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="toolbar-divider" />
        
        {/* Data Label Toggle */}
        <button className="chart-toolbar-btn icon-only" title="数据标签">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </button>
        
        {/* Legend Toggle */}
        <button className="chart-toolbar-btn icon-only" title="图例">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Mark Point */}
        <button className="chart-toolbar-btn icon-only" onClick={handleAddMarkPoint} title="标记点">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <div className="toolbar-divider" />
        
        {/* More Options */}
        <button className="chart-toolbar-btn icon-only" title="更多">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      
      {/* Data Item Selection Indicator */}
      {hasDataItemSelected && (
        <div className="data-item-indicator">
          <span>已选择数据项</span>
          <button 
            className="clear-selection-btn"
            onClick={() => useCanvasStore.getState().clearChartSelection()}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
