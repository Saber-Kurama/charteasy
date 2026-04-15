import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { VChart } from '@visactor/react-vchart'
import { useVisualizationsStore } from '../store/visualizations'
import { t, type Language } from '../i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartSpec = any

const chartTypes = ['bar', 'line', 'pie', 'scatter', 'area', 'radar']

const sampleData: Record<string, Array<Record<string, string | number>>> = {
  bar: [
    { month: 'Jan', sales: 120 },
    { month: 'Feb', sales: 200 },
    { month: 'Mar', sales: 150 },
    { month: 'Apr', sales: 80 },
    { month: 'May', sales: 70 },
    { month: 'Jun', sales: 110 },
    { month: 'Jul', sales: 130 },
  ],
  line: [
    { month: 'Jan', sales: 120 },
    { month: 'Feb', sales: 200 },
    { month: 'Mar', sales: 150 },
    { month: 'Apr', sales: 80 },
    { month: 'May', sales: 70 },
    { month: 'Jun', sales: 110 },
    { month: 'Jul', sales: 130 },
  ],
  pie: [
    { month: 'Product A', sales: 30 },
    { month: 'Product B', sales: 25 },
    { month: 'Product C', sales: 20 },
    { month: 'Product D', sales: 15 },
    { month: 'Product E', sales: 10 },
  ],
  scatter: [
    { month: 'A', sales: 120, value: 80 },
    { month: 'B', sales: 200, value: 120 },
    { month: 'C', sales: 150, value: 90 },
    { month: 'D', sales: 80, value: 60 },
    { month: 'E', sales: 70, value: 50 },
  ],
  area: [
    { month: 'Jan', sales: 120 },
    { month: 'Feb', sales: 200 },
    { month: 'Mar', sales: 150 },
    { month: 'Apr', sales: 80 },
    { month: 'May', sales: 70 },
    { month: 'Jun', sales: 110 },
    { month: 'Jul', sales: 130 },
  ],
  radar: [
    { month: 'Speed', sales: 80 },
    { month: 'Power', sales: 90 },
    { month: 'Range', sales: 70 },
    { month: 'Safety', sales: 85 },
    { month: 'Comfort', sales: 75 },
    { month: 'Price', sales: 60 },
  ],
}

const generateDefaultSpec = (type: string, chartTitle: string): ChartSpec => {
  const baseSpec: ChartSpec = {
    type,
    data: [
      {
        id: 'chartData',
        values: sampleData[type] || sampleData.bar,
      },
    ],
    title: {
      visible: true,
      text: chartTitle,
    },
    legends: {
      visible: true,
    },
  }

  if (type === 'pie') {
    baseSpec.categoryField = 'month'
    baseSpec.valueField = 'sales'
  } else if (type === 'scatter') {
    baseSpec.xField = 'sales'
    baseSpec.yField = 'value'
    baseSpec.seriesField = 'month'
  } else if (type === 'radar') {
    baseSpec.categoryField = 'month'
    baseSpec.valueField = 'sales'
  } else {
    baseSpec.xField = 'month'
    baseSpec.yField = 'sales'
  }

  return baseSpec
}

export function Editor() {
  const navigate = useNavigate()
  const { lang = 'zh', id } = useParams<{ lang: string; id?: string }>()
  const language = lang as Language
  
  const { addVisualization, updateVisualization, getVisualization } = useVisualizationsStore()
  
  const isEditMode = !!id
  const existingViz = id ? getVisualization(id) : undefined
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSpecValue = (obj: any, path: string, defaultValue: unknown) => {
    return path.split('.').reduce((o, p) => o?.[p], obj) ?? defaultValue
  }
  
  const [chartName, setChartName] = useState(existingViz?.name || '')
  const [chartType, setChartType] = useState(getSpecValue(existingViz?.spec, 'type', 'bar') as string)
  const [chartTitle, setChartTitle] = useState(getSpecValue(existingViz?.spec, 'title.text', 'Chart Title') as string)
  const [showLegend, setShowLegend] = useState(getSpecValue(existingViz?.spec, 'legends.visible', true) as boolean)
  const [spec, setSpec] = useState<ChartSpec>(existingViz?.spec || generateDefaultSpec('bar', 'Chart Title'))
  
  useEffect(() => {
    if (existingViz) {
      setChartName(existingViz.name)
      setChartType(getSpecValue(existingViz.spec, 'type', 'bar') as string)
      setChartTitle(getSpecValue(existingViz.spec, 'title.text', '') as string)
      setShowLegend(getSpecValue(existingViz.spec, 'legends.visible', true) as boolean)
      setSpec(existingViz.spec)
    }
  }, [existingViz])
  
  const handleTypeChange = (type: string) => {
    setChartType(type)
    const newSpec = generateDefaultSpec(type, chartTitle)
    newSpec.legends.visible = showLegend
    setSpec(newSpec)
  }
  
  const handleTitleChange = (title: string) => {
    setChartTitle(title)
    setSpec((prev: ChartSpec) => ({
      ...prev,
      title: { ...prev.title, text: title },
    }))
  }
  
  const handleLegendToggle = () => {
    const newValue = !showLegend
    setShowLegend(newValue)
    setSpec((prev: ChartSpec) => ({
      ...prev,
      legends: { ...prev.legends, visible: newValue },
    }))
  }
  
  const handleSpecChange = (jsonStr: string) => {
    try {
      const newSpec = JSON.parse(jsonStr)
      setSpec(newSpec)
      if (newSpec.type) setChartType(newSpec.type)
      if (newSpec.title?.text) setChartTitle(newSpec.title.text)
      if (newSpec.legends?.visible !== undefined) setShowLegend(newSpec.legends.visible)
    } catch {
      // Invalid JSON, ignore
    }
  }
  
  const handleSave = () => {
    if (!chartName.trim()) {
      alert(language === 'zh' ? '请输入图表名称' : 'Please enter chart name')
      return
    }
    
    if (isEditMode && id) {
      updateVisualization(id, { name: chartName, spec })
    } else {
      addVisualization({ name: chartName, spec })
    }
    navigate(`/${language}/app/home`)
  }
  
  const handleExport = () => {
    const dataStr = JSON.stringify(spec, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${chartName || 'chart'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="editor-page">
      <div className="page-header">
        <h1>{isEditMode ? t('editor', language) : t('new', language)}</h1>
      </div>
      
      <div className="editor-layout">
        <aside className="config-panel">
          <div className="config-section">
            <label>{t('chartName', language)}</label>
            <input
              type="text"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              placeholder={language === 'zh' ? '输入图表名称' : 'Enter chart name'}
            />
          </div>
          
          <div className="config-section">
            <label>{t('chartType', language)}</label>
            <div className="chart-type-grid">
              {chartTypes.map((type) => (
                <button
                  key={type}
                  className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
                  onClick={() => handleTypeChange(type)}
                >
                  {t(type, language)}
                </button>
              ))}
            </div>
          </div>

          <div className="config-section">
            <label>{t('chartTitle', language)}</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="config-section">
            <label className="checkbox-label">
              <input type="checkbox" checked={showLegend} onChange={handleLegendToggle} />
              {t('showLegend', language)}
            </label>
          </div>

          <div className="config-section">
            <label>{t('specJson', language)}</label>
            <textarea
              className="spec-editor"
              value={JSON.stringify(spec, null, 2)}
              onChange={(e) => handleSpecChange(e.target.value)}
              rows={15}
            />
          </div>
        </aside>

        <main className="preview-panel">
          <div className="preview-header">
            <h3>{t('preview', language)}</h3>
            <div className="preview-actions">
              <button className="action-btn" onClick={handleExport}>
                {t('export', language)}
              </button>
              <button className="action-btn primary" onClick={handleSave}>
                {t('save', language)}
              </button>
            </div>
          </div>
          <div className="chart-container">
            <VChart spec={spec} style={{ width: '100%', height: '100%' }} />
          </div>
        </main>
      </div>
    </div>
  )
}
