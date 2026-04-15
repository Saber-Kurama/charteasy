import { useState, useRef, useEffect } from 'react'
import { Button, Dropdown } from '@douyinfe/semi-ui'
import { IconEdit, IconEyeOpened, IconExport } from '@douyinfe/semi-icons'
import { useCanvasStore } from '../../store/canvasStore'
import { useVisualizationStore } from '../../store/visualizationStore'
import { AppEditorContainer, type AppEditorRef } from './AppEditorContainer'
import './VisualizationEditorPanel.css'

interface VisualizationEditorPanelProps {
    language: string
    visualizationId: string
    onReady?: () => void
    onUpdate?: (data: unknown, dataVersion: number) => void
}

// Theme configuration matching original editor
interface ThemeConfig {
    mode: 'light' | 'dark'
    style: string
}

interface CanvasConfig {
    backgroundColor: string | null
}

// Original: sZ = e => { const { language: t, visualization: i, onReady: n, onUpdate: r } = e, ... }
export function VisualizationEditorPanel({
    language: _language,
    visualizationId,
    onReady,
    onUpdate,
}: VisualizationEditorPanelProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const appEditorRef = useRef<AppEditorRef>(null)

    // Get visualization data from store
    const { getVisualizationById } = useVisualizationStore()
    const visualization = getVisualizationById(visualizationId)

    // Canvas store for editor data
    const { elements, canvasWidth, canvasHeight, showGrid, gridSize } = useCanvasStore()

    // Theme state (original: [s, l] = useState(o.theme))
    const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
        mode: 'light',
        style: 'default',
    })

    // Canvas config state (original: [c, d] = useState(o.canvas))
    const [canvasConfig, setCanvasConfig] = useState<CanvasConfig>({
        backgroundColor: null,
    })

    // Title editing state
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [title, setTitle] = useState(visualization?.name || '未命名画布')

    // Call onReady when component mounts
    useEffect(() => {
        onReady?.()
    }, [onReady])

    // Call onUpdate when data changes
    useEffect(() => {
        const data = {
            elements,
            canvasWidth,
            canvasHeight,
            showGrid,
            gridSize,
        }
        onUpdate?.(data, Date.now())
    }, [elements, canvasWidth, canvasHeight, showGrid, gridSize, onUpdate])

    // Handle canvas config change (original: $W component)
    // @ts-expect-error - Unused function for future implementation
    const handleCanvasConfigChange = (config: Partial<CanvasConfig>) => {
        const newConfig = { ...canvasConfig, ...config }
        setCanvasConfig(newConfig)
        contentRef.current?.style.setProperty('--editor-bg', newConfig.backgroundColor || '')
    }

    // Handle theme change (original: GW component)
    const handleThemeChange = (theme: Partial<ThemeConfig>) => {
        const newTheme = { ...themeConfig, ...theme }

        if (theme.mode && theme.mode !== themeConfig.mode) {
            const bgColor = theme.mode === 'dark' ? '#2a2a2a' : null
            setThemeConfig(newTheme)
            setCanvasConfig({ ...canvasConfig, backgroundColor: bgColor })
            contentRef.current?.style.setProperty('--editor-bg', bgColor || '')
        } else {
            setThemeConfig(newTheme)
        }
    }

    // Handle title update (original: RW component)
    const handleTitleUpdate = (newTitle: string) => {
        setTitle(newTitle)
        // Update visualization name in store
        const { updateVisualization } = useVisualizationStore.getState()
        updateVisualization(visualizationId, { name: newTitle })
    }

    // Export menu items (original: aZ component)
    const exportMenuItems = [
        { node: 'item' as const, name: 'PNG', onClick: () => console.log('Export PNG') },
        { node: 'item' as const, name: 'PDF', onClick: () => console.log('Export PDF') },
        { node: 'item' as const, name: 'HTML', onClick: () => console.log('Export HTML') },
    ]

    return (
        <div className="visualization-editor-panel">
            {/* Header - original: visualization-editor-panel-header */}
            <div className="visualization-editor-panel-header">
                {/* Left tools - original: visualization-editor-panel-header-tools */}
                <div className="visualization-editor-panel-header-tools">
                    {/* Canvas Config Button - original: $W */}
                    <Button
                        type="tertiary"
                        icon={<IconEdit />}
                        onClick={() => console.log('Canvas config')}
                    >
                        画布配置
                    </Button>

                    {/* Theme Button - original: GW */}
                    <Button
                        type="tertiary"
                        icon={<IconEdit />}
                        onClick={() => handleThemeChange({ mode: themeConfig.mode === 'light' ? 'dark' : 'light' })}
                    >
                        {themeConfig.mode === 'light' ? '浅色主题' : '深色主题'}
                    </Button>
                </div>

                {/* Title - original: RW */}
                <div className="visualization-editor-panel-title">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => {
                                setIsEditingTitle(false)
                                handleTitleUpdate(title)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setIsEditingTitle(false)
                                    handleTitleUpdate(title)
                                }
                            }}
                            autoFocus
                            className="title-input"
                        />
                    ) : (
                        <span
                            className="title-text"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {title}
                            <IconEdit className="title-edit-icon" />
                        </span>
                    )}
                </div>

                {/* Right tools */}
                <div className="visualization-editor-panel-header-tools">
                    {/* Export Button - original: aZ */}
                    <Dropdown
                        menu={exportMenuItems}
                        position="bottomRight"
                    >
                        <Button type="primary" icon={<IconExport />}>
                            导出 / 分享
                        </Button>
                    </Dropdown>

                    {/* Preview Button - original: oZ */}
                    <Button
                        type="tertiary"
                        icon={<IconEyeOpened />}
                        onClick={() => console.log('Preview')}
                    >
                        预览
                    </Button>
                </div>
            </div>

            {/* Content - original: visualization-editor-panel-content */}
            <div
                className="visualization-editor-panel-content"
                ref={contentRef}
                style={{
                    backgroundColor: canvasConfig.backgroundColor || undefined,
                }}
            >

                <AppEditorContainer
                    ref={appEditorRef}
                    visualizationId={visualizationId}
                    language={_language}
                    initialEditorData={visualization}
                    dataVersion={Date.now()}
                    onReady={onReady}
                    onUpdate={onUpdate}
                />


            </div>
        </div>
    )
}
