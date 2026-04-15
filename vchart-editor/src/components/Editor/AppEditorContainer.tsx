import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import { EditApp } from './EditApp'
import './AppEditorContainer.css'

interface AppEditorContainerProps {
  visualizationId: string
  language: string
  initialEditorData?: unknown
  dataVersion?: number
  onReady?: () => void
  onUpdate?: (data: unknown, dataVersion: number) => void
}

// Editor ref interface for imperative handle
// Original: useImperativeHandle(t, () => ({ getEditor, updateEditor, setEditorTheme }))
export interface AppEditorRef {
  getEditor: () => unknown | null
  updateEditor: () => void
  setEditorTheme: (theme: EditorTheme) => void
}

interface EditorTheme {
  mode: 'light' | 'dark'
  style?: string
  backgroundColor?: string | null
}

// Original: PW = forwardRef((e, t) => { ... })
export const AppEditorContainer = forwardRef<AppEditorRef, AppEditorContainerProps>(
  function AppEditorContainer(
    {
      visualizationId,
      language,
      initialEditorData,
      dataVersion,
      onReady,
      onUpdate,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<{
      editor: unknown
      updateEditor: () => void
    } | null>(null)

    const { elements, viewport, canvasWidth, canvasHeight, showGrid, gridSize } = useCanvasStore()

    // Expose imperative methods to parent
    // Original: useImperativeHandle(t, () => ({ getEditor, updateEditor, setEditorTheme }))
    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current?.editor ?? null,
      
      updateEditor: () => {
        editorRef.current?.updateEditor()
      },
      
      // Original: setEditorTheme: e => { ... }
      setEditorTheme: (theme: EditorTheme) => {
        const editor = editorRef.current?.editor
        if (!editor) return

        // Update theme mode
        const mode = theme.mode === 'dark' ? 'dark' : 'light'
        // @ts-expect-error - Editor API
        editor.updateTheme?.(mode, false)

        // Build custom theme config
        // Original: const a = { name: "_online_app_custom" }
        const customTheme: Record<string, unknown> = {
          name: '_online_app_custom',
        }

        // Set background color
        // Original: if (e.backgroundColor) a.backgroundColor = e.backgroundColor
        if (theme.backgroundColor) {
          customTheme.backgroundColor = theme.backgroundColor
        } else {
          // Original: const t = "dark" === e.mode ? "#2a2a2a" : "transparent"
          const bgColor = theme.mode === 'dark' ? '#2a2a2a' : 'transparent'
          customTheme.backgroundColor = bgColor
        }

        // Apply style if provided
        // Original: if (e.style) { const i = OV[e.style]?.themeName?.[e.mode] ?? null; ... }
        if (theme.style) {
          // TODO: Implement style theme mapping
          // For now, use default color palette
          customTheme.chart = {
            color: ['#0A345E', '#18ADED', '#A6A7AD', '#1A82EB', '#74CEF4', '#E1E2E4', '#138ABE', '#76B4F3', '#898A91', '#0E688E'],
          }
        }

        // Apply custom theme and save
        // Original: t.updateCustomTheme(a, !1, !0), t.editorData.saveData()
        // @ts-expect-error - Editor API
        editor.updateCustomTheme?.(customTheme, false, true)
        // @ts-expect-error - Editor API
        editor.editorData?.saveData?.()
      },
    }))

    // Environment configuration
    // Original: const p = { ...PV, getLanguage, writeData, readData, getContainerRect, getShareLinkKey }
    // @ts-expect-error - env is defined for API compatibility but not used directly
    const env = {
      getLanguage: () => language,
      
      // Original: writeData: async () => { ... }
      writeData: async () => {
        const editor = editorRef.current
        if (editor) {
          // @ts-expect-error - Editor API
          const recordData = await editor.getRecordData?.()
          // @ts-expect-error - Editor API
          const recordVersion = await editor.getRecordDataVersion?.()
          onUpdate?.(recordData, recordVersion)
        }
      },
      
      // Original: readData: async () => ((e, t) => ({ browserData, dataVersion, editorState }))(r, o)
      readData: async () => {
        const parseData = (data: unknown, version?: number) => ({
          browserData: typeof data === 'string' ? JSON.parse(data) : data,
          dataVersion: version ?? 0,
          editorState: 'initialized' as const,
        })
        return parseData(initialEditorData, dataVersion)
      },
      
      // Original: getContainerRect: async () => ({ width, height })
      getContainerRect: async () => ({
        width: containerRef.current?.clientWidth ?? 0,
        height: containerRef.current?.clientHeight ?? 0,
      }),
      
      // Original: getShareLinkKey: async () => `online_app_${i}`
      getShareLinkKey: async () => `online_app_${visualizationId}`,
    }

    // Handlers
    // Original: const h = { onReady: e => { console.log("onReady", e), s() } }
    const handlers = {
      onReady: (data: unknown) => {
        console.log('onReady', data)
        onReady?.()
      },
    }

    // Simulate editor ready on mount
    useEffect(() => {
      // Simulate the wV component initialization
      const timer = setTimeout(() => {
        handlers.onReady({ editorState: 'ready' })
      }, 100)
      
      return () => clearTimeout(timer)
    }, [])

    // Auto-save on data changes
    useEffect(() => {
      const data = {
        elements,
        viewport,
        canvasWidth,
        canvasHeight,
        showGrid,
        gridSize,
      }
      onUpdate?.(data, Date.now())
    }, [elements, viewport, canvasWidth, canvasHeight, showGrid, gridSize, onUpdate])

    // Don't render if no initial data
    // Original: return r ? (0, a.jsxs)("div", { ... }) : null
    if (!initialEditorData && !visualizationId) {
      return null
    }

    return (
      <div className="app-editor-container" ref={containerRef}>
        {/* 
          Original: (0, a.jsx)(wV, { ref: d, env: p, handlers: h, featureMap: BV })
          wV is the EditApp component
        */}
        <EditApp
          ref={editorRef as React.RefObject<{
            editor: unknown
            updateEditor: () => void
          }>}
          handlers={handlers}
          guideVisible={false}
        />
      </div>
    )
  }
)
