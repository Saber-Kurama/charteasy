import { useNavigate, useParams } from 'react-router-dom'
import { useVisualizationsStore } from '../store/visualizations'
import { t, type Language } from '../i18n'

export function Home() {
  const navigate = useNavigate()
  const { lang = 'zh' } = useParams<{ lang: string }>()
  const language = lang as Language
  
  const { visualizations, deleteVisualization } = useVisualizationsStore()
  
  // Generate a UUID for new visualization
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
  
  const handleCreateNew = () => {
    const newId = generateUUID()
    navigate(`/${language}/app/visualization/${newId}`)
  }
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')
  }
  
  const handleEdit = (id: string) => {
    navigate(`/${language}/app/edit/${id}`)
  }
  
  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete', language))) {
      deleteVisualization(id)
    }
  }
  
  return (
    <div className="home-page">
      <div className="page-header">
        <h1>{t('home', language)}</h1>
        <button className="btn btn-primary" onClick={handleCreateNew}>
          + {t('new', language)}
        </button>
      </div>
      
      {visualizations.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <p>{t('noVisualizations', language)}</p>
        </div>
      ) : (
        <div className="visualizations-grid">
          {visualizations.map((viz) => (
            <div key={viz.id} className="visualization-card">
              <div className="card-header">
                <h3>{viz.name}</h3>
                <span className="chart-type-badge">{viz.spec.type as string}</span>
              </div>
              <div className="card-meta">
                <div>
                  <span className="meta-label">{t('createTime', language)}:</span>
                  <span>{formatDate(viz.createdAt)}</span>
                </div>
                <div>
                  <span className="meta-label">{t('updateTime', language)}:</span>
                  <span>{formatDate(viz.updatedAt)}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-primary" onClick={() => handleEdit(viz.id)}>
                  {t('edit', language)}
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(viz.id)}>
                  {t('delete', language)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
