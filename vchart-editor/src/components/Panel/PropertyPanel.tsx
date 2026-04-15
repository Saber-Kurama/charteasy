import { Card, Typography, InputNumber, Input, Select, Form } from '@douyinfe/semi-ui'
import { useCanvasStore } from '../../store/canvasStore'
import './Panel.css'

const { Title, Text } = Typography

export function PropertyPanel() {
  const { elements, selectedIds, updateElement, setElementData } = useCanvasStore()
  
  const selectedElements = elements.filter(el => selectedIds.includes(el.id))
  
  if (selectedElements.length === 0) {
    return (
      <Card className="property-panel-empty" bodyStyle={{ padding: 24 }}>
        <Title heading={6}>属性面板</Title>
        <Text type="tertiary" style={{ display: 'block', marginTop: 8 }}>
          选择一个元素以编辑属性
        </Text>
        <Text type="tertiary" size="small">
          Select an element to edit properties
        </Text>
      </Card>
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
  
  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Chart' },
    { value: 'area', label: 'Area Chart' },
  ]

  return (
    <Card className="property-panel" bodyStyle={{ padding: 0 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--semi-color-border)' }}>
        <Title heading={6} style={{ margin: 0 }}>属性面板</Title>
        <Text type="tertiary" size="small">Property Panel</Text>
      </div>
      
      <div style={{ padding: 16 }}>
        <Form layout="vertical">
          {/* Element Type */}
          <Form.Section text="元素类型 / Element Type">
            <Form.Label style={{ marginBottom: 8 }}>Type</Form.Label>
            <Text type="primary" strong style={{ 
              display: 'inline-block', 
              padding: '4px 12px', 
              background: 'var(--semi-color-primary-light-default)',
              borderRadius: 4,
              color: 'var(--semi-color-primary)',
              textTransform: 'uppercase',
              fontSize: 12
            }}>
              {element.type}
            </Text>
          </Form.Section>
          
          {/* Position */}
          <Form.Section text="位置 / Position">
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Label>X</Form.Label>
              <InputNumber
                value={Math.round(element.x)}
                onChange={(value) => handlePositionChange('x', Number(value))}
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Form.Label>Y</Form.Label>
              <InputNumber
                value={Math.round(element.y)}
                onChange={(value) => handlePositionChange('y', Number(value))}
                style={{ flex: 1 }}
              />
            </div>
          </Form.Section>
          
          {/* Size */}
          <Form.Section text="尺寸 / Size">
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Label>Width</Form.Label>
              <InputNumber
                value={Math.round(element.width)}
                onChange={(value) => handleSizeChange('width', Number(value))}
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Form.Label>Height</Form.Label>
              <InputNumber
                value={Math.round(element.height)}
                onChange={(value) => handleSizeChange('height', Number(value))}
                style={{ flex: 1 }}
              />
            </div>
          </Form.Section>
          
          {/* Rotation */}
          <Form.Section text="旋转 / Rotation">
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Label>Angle</Form.Label>
              <InputNumber
                value={Math.round(element.rotation || 0)}
                onChange={(value) => updateElement(element.id, { rotation: Number(value) })}
                style={{ flex: 1 }}
              />
            </div>
          </Form.Section>
          
          {/* Chart-specific properties */}
          {element.type === 'chart' && element.data.spec && (
            <Form.Section text="图表配置 / Chart Config">
              <Form.Label>Chart Type</Form.Label>
              <Select
                value={element.data.spec.type || 'bar'}
                onChange={(value) => handleDataChange('spec', { ...element.data.spec, type: value })}
                optionList={chartTypeOptions}
                style={{ width: '100%', marginBottom: 12 }}
              />
              <Form.Label>Title</Form.Label>
              <Input
                value={element.data.spec.title?.text || ''}
                onChange={(value) => handleDataChange('spec', { 
                  ...element.data.spec, 
                  title: { ...element.data.spec.title, text: value }
                })}
              />
            </Form.Section>
          )}
          
          {/* Text-specific properties */}
          {element.type === 'text' && (
            <Form.Section text="文本配置 / Text Config">
              <Form.Label>Content</Form.Label>
              <Input
                value={element.data.text || ''}
                onChange={(value) => handleDataChange('text', value)}
                style={{ marginBottom: 12 }}
              />
              <Form.Label>Font Size</Form.Label>
              <Input
                value={element.data.style?.fontSize || '16px'}
                onChange={(value) => handleDataChange('style', { ...element.data.style, fontSize: value })}
                style={{ marginBottom: 12 }}
              />
              <Form.Label>Color</Form.Label>
              <Input
                value={element.data.style?.color || '#333333'}
                onChange={(value) => handleDataChange('style', { ...element.data.style, color: value })}
                style={{ marginBottom: 12 }}
              />
            </Form.Section>
          )}
          
          {/* Shape-specific properties */}
          {(element.type === 'rect' || element.type === 'circle') && (
            <Form.Section text="样式 / Style">
              <Form.Label>Fill</Form.Label>
              <Input
                value={element.data.fill || '#e0e0e0'}
                onChange={(value) => handleDataChange('fill', value)}
                style={{ marginBottom: 12 }}
              />
              <Form.Label>Stroke</Form.Label>
              <Input
                value={element.data.stroke || '#999999'}
                onChange={(value) => handleDataChange('stroke', value)}
                style={{ marginBottom: 12 }}
              />
              <Form.Label>Stroke Width</Form.Label>
              <InputNumber
                value={element.data.strokeWidth || 1}
                onChange={(value) => handleDataChange('strokeWidth', Number(value))}
              />
            </Form.Section>
          )}
        </Form>
      </div>
    </Card>
  )
}
