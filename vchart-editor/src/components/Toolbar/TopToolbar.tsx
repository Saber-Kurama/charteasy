import { useState } from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import './Toolbar.css'

export function TopToolbar() {
  const [canvasTitle, setCanvasTitle] = useState('空白画布')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const { toggleGrid } = useCanvasStore()
  
  const handleTitleSubmit = () => {
    setIsEditingTitle(false)
  }
  
  return (
    <div className="top-toolbar">
      <div className="toolbar-left">
        <button className="toolbar-action-btn" onClick={toggleGrid}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <span>画布配置</span>
        </button>
        <button className="toolbar-action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <span>图表主题</span>
        </button>
      </div>
      
      <div className="toolbar-center">
        {isEditingTitle ? (
          <input
            type="text"
            value={canvasTitle}
            onChange={(e) => setCanvasTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
            className="title-input"
          />
        ) : (
          <div className="canvas-title" onClick={() => setIsEditingTitle(true)}>
            <span>{canvasTitle}</span>
            <svg className="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="toolbar-right">
        <button className="toolbar-action-btn preview-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>预览</span>
        </button>
        <button className="toolbar-action-btn export-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>导出 / 分享</span>
        </button>
      </div>
    </div>
  )
}
