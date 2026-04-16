import { useEffect, useRef } from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import { useALStore } from '../../store/alStore'
import { useHwStore } from '../../store/hwStore'
import { useYCStore } from '../../store/ycStore'
import { useEditorStore } from '../../store/editorStore'
import type { EditorInstance, EditorElement } from '../../store/editorStore'
import { getLogger } from '../../utils/logger'
import { performanceMonitor, PerfMarkName } from '../../utils/performanceMonitor'
import { Sy } from '../../utils/sdkBridge'
import { EditorEvent } from '../../editor/constants'
import { createEditor, Editor, EditorData, type EditorController } from '../../editor/Editor'
import { initializeEditor } from '../../editor/initEditor'
import './ChartCanvas.css'

// Editor event types (matching original Qe enum) - imported from constants
// Editor action mode (matching original Dt.none)
const ActionMode = {
  none: 'none',
} as const

// Get logger instance (original: Cy.V.getInstance())
const logger = getLogger()

interface ChartCanvasProps {
  handlers?: {
    onReady?: (editor: EditorInstance, data: { perfId: string }) => void
    onInit?: () => void
  }
}

// Helper function to get element part (matching original nS function)
const getEditorElementPart = (element: EditorElement | null): string | null => {
  if (!element) return null
  return element.part ?? null
}

// Original: wL(e) { const { handlers: t } = e, { editor: i, setEditor: n, ... } = jS(...), ... }
// This matches main.e2a65968.js lines 56334-56512
export function ChartCanvas({ handlers }: ChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Get editor state from editorStore (original: jS store - main.e2a65968.js 56337-56347, 47505-47570)
  const {
    editor,
    setEditor,
    setEditorState,
    setEditorInteraction,
  } = useEditorStore()

  // Get zoom and undo/redo state from AL store (original: AL store - main.e2a65968.js 56347-56357, 56307-56332)
  const {
    zoom,
    setZoom,
    setEnableUndo,
    setEnableRedo,
  } = useALStore()

  

  // Get panel visibility state from Hw store (original: Hw store - main.e2a65968.js 56357-56365, 54443-54507)
  const {
    setEditorBarVisible,
    setDataPanelVisible,
    hideAll,
  } = useHwStore()

  // Get loading state from YC store (original: YC store - main.e2a65968.js 56365-56369, 49623-49630)
  const {
    setIsLoading,
  } = useYCStore()

  // Editor instance ref for cleanup
  const editorRef = useRef<EditorInstance | null>(null)

  // Handle editor element selection (original: m = e => { ... })
  const handleElementSelect = (data: { element: EditorElement | null; part: string | null }) => {
    if (data.element && data.part) {
      setEditorState({
        part: data.part,
        element: data.element,
      })
      setEditorBarVisible(true)
    } else {
      setEditorState({
        part: null,
        element: null,
      })
      hideAll()
    }
  }

  // Clear editor state (original: y = () => { ... })
  const clearEditorState = () => {
    setEditorState({
      part: null,
      element: null,
    })
    hideAll()
  }

  // Initialize editor (original: useEffect(() => { ... }, []) - main.e2a65968.js 56383-56496)
  useEffect(() => {
    // Get logger instance (original: e = Cy.V.getInstance())
    const log = getLogger()

    // Performance mark start (original: u = G_.performanceMarkStart(H_.EDITOR_RENDER))
    const perfId = performanceMonitor.performanceMarkStart(PerfMarkName.EDITOR_RENDER)
    console.time('Edit render time')

    // Editor instance variable (original: let g)
    let editorInstance: EditorInstance | null = null

    // Define event handlers (original: i, a, r, o, l, p)
    // Zoom handler (original: i = ({ globalZoom: e }) => { c(e) })
    const handleZoomChange = ({ globalZoom }: { globalZoom: number }) => {
      setZoom(globalZoom)
    }

    // History change handler (original: a = () => { g && (d(!!g.editorData.backwardEnable()), h(!!g.editorData.forwardEnable())) })
    const handleHistoryChange = () => {
      if (editorInstance) {
        setEnableUndo(!!editorInstance.editorData.backwardEnable())
        setEnableRedo(!!editorInstance.editorData.forwardEnable())
      }
    }

    // Data updated handler (original: r = () => {})
    const handleChartDataUpdated = () => {
      // Empty handler
    }

    // Data update fail handler (original: o = () => { f(!1) })
    const handleDataUpdateFail = () => {
      setIsLoading(false)
    }

    // Data update success handler (original: l = () => { f(!1) })
    const handleDataUpdateSuccess = () => {
      setIsLoading(false)
    }

    // State change handler (original: p = ({ state: e, stateInfo: t }) => { null !== e?.actionMode && e?.actionMode !== Dt.none || (y(), s({ state: "normal" })) })
    const handleStateChange = ({ state }: { state: { actionMode?: string | null } }) => {
      if (state?.actionMode === null || state?.actionMode === ActionMode.none) {
        clearEditorState()
        setEditorInteraction({ state: 'normal' })
      }
    }

    // Initialize editor (original: Promise.resolve(Sy.getLanguage()).then(async s => { ... }))
    const initEditor = async () => {
      try {
        // Get language (original: Sy.getLanguage())
        const language = await Sy.getLanguage()
        log.log('Language:', language)

        // Create editor instance using Gx factory (original: g = Gx("chart", "editor", s))
        // This creates a real Editor instance with EditorController
        const editor = createEditor(
          'chart',      // dom: container element ID
          'editor',     // mode: editor mode
          language,     // language: from SDK
          undefined,    // id: optional, defaults to 'editor-demo'
          undefined     // options: optional
        )
        // Cast to EditorInstance for compatibility with store
        editorInstance = editor as unknown as EditorInstance
        
        // Store editor reference for cleanup
        editorRef.current = editorInstance
        
        // ============================================
        // Register editor controller handlers (original: g.editorController.addStartHandler, etc.)
        // ============================================

        // Start handler (original: g.editorController.addStartHandler(t => { e.debug("startHandler", t); try { t.updateElement() } catch (e) { ... } const i = nS(t); m({ part: i ?? null, element: t ?? null }) }))
        editor.editorController.addStartHandler((element) => {
          log.debug('startHandler', element)
          try {
            element.updateElement?.()
          } catch (err) {
            // Original: Jv(Yv.UPDATE_ELEMENT, e, s, { element_id: t.id, element_type: t.type })
            console.error('UPDATE_ELEMENT error:', err, {
              element_id: element.id,
              element_type: element.type,
            })
          }
          // Update editor state (original: const i = nS(t); m({ part: i ?? null, element: t ?? null }))
          const part = getEditorElementPart(element as EditorElement)
          handleElementSelect({ part, element: element as EditorElement })
        })

        // Run handler (original: g.editorController.addRunHandler(() => { e.debug("runHandler"), y() }))
        editor.editorController.addRunHandler(() => {
          log.debug('runHandler')
          clearEditorState()
        })

        // End handler (original: g.editorController.addEndHandler(t => { if (e.debug("endHandler", t), t && t.id) { try { t.updateElement() } catch (e) { ... } const e = nS(t); m({ part: e ?? null, element: t ?? null }) } else y() }))
        editor.editorController.addEndHandler((element) => {
          log.debug('endHandler', element)
          if (element && element.id) {
            try {
              element.updateElement?.()
            } catch (err) {
              // Original: Jv(Yv.UPDATE_ELEMENT, e, s, { element_id: t?.id, element_type: t?.type, ... })
              console.error('UPDATE_ELEMENT error:', err, {
                element_id: element?.id,
                element_type: element?.type,
              })
            }
            // Update editor state
            const part = getEditorElementPart(element as EditorElement)
            handleElementSelect({ part, element: element as EditorElement })
          } else {
            clearEditorState()
          }
        })

        // Finish handler (original: g.editorController.addFinishHandler(() => { e.debug("finishHandler"), y() }))
        editor.editorController.addFinishHandler(() => {
          log.debug('finishHandler')
          clearEditorState()
        })

        // ============================================
        // Initialize editor with Ux function (original: !await Ux(g, "editor", s))
        // This loads data, sets up layers, and handles URL/commonOption loading
        // ============================================

        const initResult = await initializeEditor(editor, 'editor', language)

        if (!initResult) {
          // Initialization failed or editor was released
          log.error('Editor initialization failed or editor was released')

          // Write invalid state (original: Sy.writeData([{ type: "replace", data: { path: ["editorState"], value: "invalid" } }]))
          await Sy.writeData([{
            type: 'replace',
            data: {
              path: ['editorState'],
              value: 'invalid',
            },
          }])

          setEditor(null)

          // Performance mark end - fail
          performanceMonitor.performanceMarkEnd(PerfMarkName.EDITOR_RENDER, {
            id: perfId,
            detail: {
              perf_type: 'key_path_perf',
              action_name: PerfMarkName.EDITOR_RENDER,
              status: 'fail',
              editor_mode: 'editor',
            },
          })

          console.timeEnd('Edit render time')
          return
        }

        // Bind event listeners (original: g.emitter.on(Qe.onLayerWheelStart, i), etc.)
        editorInstance.emitter.on(EditorEvent.onLayerWheelStart, handleZoomChange)
        editorInstance.emitter.on(EditorEvent.onLayerWheel, handleZoomChange)
        editorInstance.emitter.on(EditorEvent.historyChange, handleHistoryChange)
        editorInstance.emitter.on(EditorEvent.chartDataUpdated, handleChartDataUpdated)
        editorInstance.emitter.on(EditorEvent.dataUpdateFail, handleDataUpdateFail)
        editorInstance.emitter.on(EditorEvent.dataUpdateSuccess, handleDataUpdateSuccess)
        editorInstance.emitter.on(EditorEvent.onStateChange, handleStateChange)

        // Set editor in store (original: n(g))
        setEditor(editorInstance)

        // Performance mark end - success (original: G_.performanceMarkEnd(H_.EDITOR_RENDER, { ... status: "success" ... }))
        performanceMonitor.performanceMarkEnd(PerfMarkName.EDITOR_RENDER, {
          id: perfId,
          detail: {
            perf_type: 'key_path_perf',
            action_name: PerfMarkName.EDITOR_RENDER,
            status: 'success',
            editor_mode: 'editor',
          },
        })

        // Read data and setup zoom (original: Promise.resolve(Sy.readData()).then(e => { ... }))
        const editorData = await Sy.readData()
        if ((editorData as { editorState?: string }).editorState) {
          // Handle zoom for initialized editor
          const handleAfterAllLayerReady = () => {
            const targetZoom = Math.min(1, 1) // Original: Wx(g, 1)
            editorInstance?.zoomTo(targetZoom)
            setZoom(targetZoom)
            editorInstance?.emitter.off(EditorEvent.afterAllLayerReady, handleAfterAllLayerReady)
          }

          // Check for wordCloud or chart without vchartType
          // Original: if (g.getChartElements().find(e => "wordCloud" === e.vchartType && ... ))
          const chartElements = editorInstance.getChartElements()
          const needsWaitForReady = chartElements.some(
            (el) => el.vchartType === 'wordCloud' || el.type === 'chart'
          )

          if (needsWaitForReady) {
            editorInstance.emitter.on(EditorEvent.afterAllLayerReady, handleAfterAllLayerReady)
          } else {
            const targetZoom = Math.min(1, 1)
            editorInstance.zoomTo(targetZoom)
            setZoom(targetZoom)
          }
        } else {
          // Write initialized state (original: Sy.writeData([{ type: "replace", data: { path: ["editorState"], value: "initialized" } }]))
          await Sy.writeData([{
            type: 'replace',
            data: {
              path: ['editorState'],
              value: 'initialized',
            },
          }])
        }

        // Call onReady handler (original: t?.onReady?.(g, d))
        handlers?.onReady?.(editorInstance, { perfId: String(perfId) })

        console.timeEnd('Edit render time')

      } catch (error) {
        console.error('Editor initialization failed:', error)
        console.timeEnd('Edit render time')

        // Write invalid state and set editor to false
        await Sy.writeData([{
          type: 'replace',
          data: {
            path: ['editorState'],
            value: 'invalid',
          },
        }])
        setEditor(null)

        // Performance mark end - fail
        performanceMonitor.performanceMarkEnd(PerfMarkName.EDITOR_RENDER, {
          id: perfId,
          detail: {
            perf_type: 'key_path_perf',
            action_name: PerfMarkName.EDITOR_RENDER,
            status: 'fail',
            editor_mode: 'editor',
          },
        })
      }
    }

    initEditor()

    // Cleanup (original: () => { g && (g.emitter.off(...), g.release()) })
    return () => {
      if (editorInstance) {
        editorInstance.emitter.off(EditorEvent.onLayerWheelStart, handleZoomChange)
        editorInstance.emitter.off(EditorEvent.onLayerWheel, handleZoomChange)
        editorInstance.emitter.off(EditorEvent.historyChange, handleHistoryChange)
        editorInstance.emitter.off(EditorEvent.chartDataUpdated, handleChartDataUpdated)
        editorInstance.emitter.off(EditorEvent.dataUpdateFail, handleDataUpdateFail)
        editorInstance.emitter.off(EditorEvent.dataUpdateSuccess, handleDataUpdateSuccess)
        editorInstance.emitter.off(EditorEvent.onStateChange, handleStateChange)
        editorInstance.release()
        editorRef.current = null
      }
    }
  }, [])

  // Handle data changes for meeting mode (original: useEffect(() => { Sy.onDataChange?.(...) }, [i, l]))
  useEffect(() => {
    const handleDataChange = async () => {
      // Mock app variables check (original: const e = await Sy.getAppVariables(), t = e?.isMeeting)
      const isMeeting = false

      if (editor && isMeeting) {
        // Reload data in meeting mode
        const width = containerRef.current?.clientWidth ?? 800
        const height = containerRef.current?.clientHeight ?? 600

        await editor.loadLasted(width, height)
        editor.zoomTo(zoom)
        editor.reLayoutToCenter()
      }
    }

    handleDataChange()
  }, [editor, zoom])

  return (
    <div
      id="chart"
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      {/* Canvas content will be rendered here by the editor */}
    </div>
  )
}
