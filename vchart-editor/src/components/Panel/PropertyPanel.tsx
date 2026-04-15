import { useCanvasStore } from '../../store/canvasStore'
import './Panel.css'

export function PropertyPanel() {
  const { elements, selectedIds, updateElement, setElementData } = useCanvasStore()
  
  const selectedElements = elements.filter(el => selectedIds.includes(el.id))
  
  if (selectedElements.length === 0) {
    return (
      <div className="property-panel empty">
        <div className="panel-header">
          <span>属性面板</span>
          <span className="panel-subtitle">Property Panel</span>
        </div>
        <div className="panel-content">
          <p className="empty-text">选择一个元素以编辑属性</p>
          <p className="empty-subtext">Select an element to edit properties</p>
        </div>
      </div>
    )
  }
  
  const element = selectedElements[0]
  
  const handlePositionChange = (field: 'x' | 'y', value: number) => {
    updateElement(element.id, { [field]: value })
  }
  
  const handleSizeChange = (field: 'width' | 'height', value: number) => {
    updateElement(element.id, { [field]: value })
  }
  
  const handleDataChange = (key: string, value: unknown) => {
    setElementData(element.id, { ...element.data, [key]: value })
  }
  
  return (
    <div className="property-panel">
      <div className="panel-header">
        <span>属性面板</span>
        <span className="panel-subtitle">Property Panel</span>
      </div>
      
      <div className="panel-content">
        {/* Element Type */}
        <div className="property-section">
          <div className="section-title">元素类型 / Element Type</div>
          <div className="property-row">
            <span className="property-label">Type</span>
            <span className="property-value type-badge">{element.type}</span>
          </div>
        </div>
        
        {/* Position */}
        <div className="property-section">
          <div className="section-title">位置 / Position</div>
          <div className="property-row">
            <label className="property-label">X</label>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => handlePositionChange('x', Number(e.target.value))}
              className="property-input"
            />
          </div>
          <div className="property-row">
            <label className="property-label">Y</label>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => handlePositionChange('y', Number(e.target.value))}
              className="property-input"
            />
          </div>
        </div>
        
        {/* Size */}
        <div className="property-section">
          <div className="section-title">尺寸 / Size</div>
          <div className="property-row">
            <label className="property-label">Width</label>
            <input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) => handleSizeChange('width', Number(e.target.value))}
              className="property-input"
            />
          </div>
          <div className="property-row">
            <label className="property-label">Height</label>
            <input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) => handleSizeChange('height', Number(e.target.value))}
              className="property-input"
            />
          </div>
        </div>
        
        {/* Rotation */}
        <div className="property-section">
          <div className="section-title">旋转 / Rotation</div>
          <div className="property-row">
            <label className="property-label">Angle</label>
            <input
              type="number"
              value={Math.round(element.rotation || 0)}
              onChange={(e) => updateElement(element.id, { rotation: Number(e.target.value) })}
              className="property-input"
            />
          </div>
        </div>
        
        {/* Chart-specific properties */}
        {element.type === 'chart' && element.data.spec && (
          <div className="property-section">
            <div className="section-title">图表配置 / Chart Config</div>
            <div className="property-row">
              <label className="property-label">Chart Type</label>
              <select
                value={element.data.spec.type || 'bar'}
                onChange={(e) => handleDataChange('spec', { ...element.data.spec, type: e.target.value })}
                className="property-select"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Chart</option>
                <option value="area">Area Chart</option>
              </select>
            </div>
            <div className="property-row">
              <label className="property-label">Title</label>
              <input
                type="text"
                value={element.data.spec.title?.text || ''}
                onChange={(e) => handleDataChange('spec', { 
                  ...element.data.spec, 
                  title: { ...element.data.spec.title, text: e.target.value }
                })}
                className="property-input"
              />
            </div>
          </div>
        )}
        
        {/* Text-specific properties */}
        {element.type === 'text' && (
          <div className="property-section">
            <div className="section-title">文本配置 / Text Config</div>
            <div className="property-row">
              <label className="property-label">Content</label>
              <textarea
                value={element.data.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                className="property-textarea"
                rows={3}
              />
            </div>
            <div className="property-row">
              <label className="property-label">Font Size</label>
              <input
                type="text"
                value={element.data.style?.fontSize || '16px'}
                onChange={(e) => handleDataChange('style', { ...element.data.style, fontSize: e.target.value })}
                className="property-input"
              />
            </div>
            <div className="property-row">
              <label className="property-label">Color</label>
              <input
                type="color"
                value={element.data.style?.color || '#333333'}
                onChange={(e) => handleDataChange('style', { ...element.data.style, color: e.target.value })}
                className="property-color"
              />
            </div>
          </div>
        )}
        
        {/* Shape-specific properties */}
        {(element.type === 'rect' || element.type === 'circle') && (
          <div className="property-section">
            <div className="section-title">样式 / Style</div>
            <div className="property-row">
              <label className="property-label">Fill</label>
              <input
                type="color"
                value={element.data.fill || '#e0e0e0'}
                onChange={(e) => handleDataChange('fill', e.target.value)}
                className="property-color"
              />
            </div>
            <div className="property-row">
              <label className="property-label">Stroke</label>
              <input
                type="color"
                value={element.data.stroke || '#999999'}
                onChange={(e) => handleDataChange('stroke', e.target.value)}
                className="property-color"
              />
            </div>
            <div className="property-row">
              <label className="property-label">Stroke Width</label>
              <input
                type="number"
                value={element.data.strokeWidth || 1}
                onChange={(e) => handleDataChange('strokeWidth', Number(e.target.value))}
                className="property-input"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
