import { getLogger } from '../utils/logger'
import { Sy } from '../utils/sdkBridge'
import { performanceMonitor, PerfMarkName } from '../utils/performanceMonitor'
import type { Editor, EditorMode, Layer } from './Editor'

// Get logger instance
const logger = getLogger()

// ============================================
// Types and Interfaces
// ============================================

export interface ContainerRect {
  width: number
  height: number
}

export interface EventTrackInfo {
  showSource?: boolean
  sourceName?: string
  [key: string]: unknown
}

export interface EditorSavedData {
  url?: string
  option?: {
    loadContribute?: 'edit' | 'view'
  }
  commonOption?: {
    component?: {
      size?: { width: number; height: number }
    }
    size?: { width: number; height: number }
    [key: string]: unknown
  }
  editorState?: string
  [key: string]: unknown
}

export interface InitOptions {
  getRect?: () => Promise<ContainerRect>
}

export interface LoadContext {
  isCreate: boolean
  [key: string]: unknown
}

// Editor action types (original: Ox)
export const EditorAction = {
  CREATE_EDITOR: 'CREATE_EDITOR',
} as const

// ============================================
// Helper Functions (original: zx, R_, Vx)
// ============================================

/**
 * Create load context (original: zx)
 */
function createLoadContext(isCreate: boolean): LoadContext {
  return {
    isCreate,
  }
}

/**
 * Report editor action (original: R_)
 */
function reportEditorAction(action: string, info: EventTrackInfo): void {
  logger.debug(`Report action: ${action}`, info)
  // In original: R_(Ox.CREATE_EDITOR, { ...l })
  // This would send analytics/telemetry
}

/**
 * Load editor from URL (original: Vx)
 */
async function loadEditorFromUrl(
  editor: Editor,
  url: string,
  context: LoadContext,
  rect: ContainerRect,
  callback?: (element?: unknown) => void,
  language?: string
): Promise<void> {
  logger.debug('Loading editor from URL:', url)
  
  // In original implementation, this would:
  // 1. Fetch the URL content
  // 2. Parse the spec/data
  // 3. Create elements in the editor
  // 4. Call the callback with the created element
  
  // Placeholder implementation
  try {
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Call callback if provided (original: t?.selectElement(), e.editorData.clearHistory(), etc.)
    if (callback) {
      callback(undefined)
    }
  } catch (error) {
    logger.error('Failed to load from URL:', error)
    throw error
  }
}

// ============================================
// Main Initialization Function (original: Ux)
// ============================================

/**
 * Initialize editor with saved data (original: Ux - main.e2a65968.js 42521-42581)
 * 
 * This is the main async initialization function that:
 * 1. Gets container rect and reads saved data
 * 2. Loads editor data based on mode (editor/view/preview)
 * 3. Handles URL loading or common options
 * 4. Sets up window resize handler
 * 
 * Original code:
 * async function Ux(e, t, i, a) {
 *     const n = await (a?.getRect?.() ?? Sy.getContainerRect()),
 *         r = await Sy.readData();
 *     if (await e.loadLasted(n.width, n.height), e.isReleased) return !1;
 *     const o = 0 === e.layers.length,
 *         s = zx(!0),
 *         l = await Sy.getEventTrackInfo();
 *     Ke.sourceInfo = l;
 *     const c = "view" === (r.option?.loadContribute ?? "edit") ? "view" : "edit";
 *     if (o) { ... }
 *     ...
 *     return r
 * }
 * 
 * @param editor - Editor instance
 * @param mode - Editor mode ('editor' | 'view' | 'preview')
 * @param language - Language code
 * @param options - Optional initialization options
 * @returns Saved data object or false if failed/released
 */
export async function initializeEditor(
  editor: Editor,
  mode: EditorMode,
  language: string,
  options?: InitOptions
): Promise<EditorSavedData | false> {
  // Get container rect (original: n = await (a?.getRect?.() ?? Sy.getContainerRect()))
  const rect = await (options?.getRect?.() ?? Sy.getContainerRect())
  
  // Read saved data (original: r = await Sy.readData())
  const savedData = await Sy.readData() as EditorSavedData
  
  // Load last data (original: await e.loadLasted(n.width, n.height))
  await editor.loadLasted(rect.width, rect.height)
  
  // Check if editor was released during async operations
  if (editor.isReleased) {
    return false
  }
  
  // Check if layers are empty (original: o = 0 === e.layers.length)
  const isEmptyLayers = editor.layers.length === 0
  
  // Create load context (original: s = zx(!0))
  const loadContext = createLoadContext(true)
  
  // Get event track info (original: l = await Sy.getEventTrackInfo())
  const trackInfo = await Sy.getEventTrackInfo() as EventTrackInfo
  
  // Set source info (original: Ke.sourceInfo = l)
  // In original, this sets a global variable
  logger.debug('Source info:', trackInfo)
  
  // Determine load mode (original: c = "view" === (r.option?.loadContribute ?? "edit") ? "view" : "edit")
  const loadMode = savedData.option?.loadContribute === 'view' ? 'view' : 'edit'
  
  // ============================================
  // Handle empty layers case
  // ============================================
  if (isEmptyLayers) {
    if (mode === 'editor') {
      // Editor mode initialization
      if (savedData.url && loadMode === 'edit') {
        // Load from URL with callback (original: Vx(e, r.url, s, n, t, i))
        const callback = (element?: unknown) => {
          reportEditorAction(EditorAction.CREATE_EDITOR, trackInfo)
          editor.initInteractions?.()
          editor.reLayoutToCenter({
            left: 92,
            right: 0,
            top: 0,
            bottom: 350,
          })
          // element?.selectElement() - select the created element
          editor.editorData?.clearHistory?.()
          editor.editorData?.saveData?.()
          // Emit events based on element existence
          if (element) {
            editor.emitter.emit('editorReady')
          } else {
            editor.emitter.emit('editorEmpty')
          }
        }
        
        await loadEditorFromUrl(editor, savedData.url, loadContext, rect, callback, language)
      } else if (savedData.commonOption && loadMode === 'edit') {
        // Load from common options (original: e.loadCommonOption(n.width, n.height, r.commonOption, s))
        // editor.loadCommonOption(rect.width, rect.height, savedData.commonOption, loadContext)
        reportEditorAction(EditorAction.CREATE_EDITOR, trackInfo)
      } else {
        // Create new layer (original: e.getLayers()?.length || e.createLayer())
        if (!editor.getLayers()?.length) {
          editor.createLayer()
        }
        reportEditorAction(EditorAction.CREATE_EDITOR, trackInfo)
      }
      
      // Save data (original: e.option.data.save())
      // editor.option.data.save?.()
      
    } else if (mode === 'view') {
      // View mode initialization
      if (savedData.url && loadMode === 'view') {
        // Load from URL for view mode
        const callback = () => {
          reportEditorAction(EditorAction.CREATE_EDITOR, trackInfo)
          // Original: e.editorData._data?.save?.()
          // The _data is the internal data storage that may have a save method
          const editorDataInternal = editor.editorData as { _data?: { save?: () => void } }
          editorDataInternal._data?.save?.()
        }
        
        await loadEditorFromUrl(editor, savedData.url, loadContext, rect, callback, language)
      } else if (savedData.commonOption) {
        // Load from common options for view mode
        reportEditorAction(EditorAction.CREATE_EDITOR, trackInfo)
        
        // Wait for layers to be ready
        editor.emitter.once('afterAllLayerReady', () => {
          try {
            // Write initialized state
            Sy.writeData([{
              type: 'replace',
              data: {
                path: ['editorState'],
                value: 'initialized',
              },
            }])
          } catch (err) {
            console.error(err)
          }
        })
        
        // Load common options (original: e.loadCommonOption(n.width, n.height, r.commonOption, s, !1))
        // editor.loadCommonOption(rect.width, rect.height, savedData.commonOption, loadContext, false)
        editor.editorData?.clearHistory?.()
        
        // Update container rect if size specified
        if (savedData.commonOption.component?.size) {
          // Original: Sy.updateContainerRect(r.commonOption.component.size)
          // Note: Current Sy.updateContainerRect takes no arguments
          // In production, this would update the container size
          logger.debug('Update container rect:', savedData.commonOption.component.size)
          Sy.updateContainerRect()
        }
        
        // Save data for view mode
        if (loadMode === 'view') {
          const editorDataInternal = editor.editorData as { _data?: { save?: () => void } }
          editorDataInternal._data?.save?.()
        }
      }
    } else if (mode === 'preview_editor' || mode === 'preview') {
      // Preview mode (original: e.loadCommonOption(n.width, n.height, r.commonOption, s))
      // editor.loadCommonOption(rect.width, rect.height, savedData.commonOption, loadContext)
      if (savedData.commonOption) {
        logger.debug('Preview mode with common option')
      }
    }
  } else {
    // Non-empty layers - only init interactions for editor mode
    if (mode === 'editor') {
      editor.initInteractions?.()
    }
  }
  
  // ============================================
  // Setup window resize handler
  // ============================================
  const handleResize = async () => {
    const showSourceHeader = trackInfo?.showSource && trackInfo?.sourceName
    const newRect = await (options?.getRect?.() ?? Sy.getContainerRect())
    
    editor.resize(
      newRect.width ?? 0,
      newRect.height ? (showSourceHeader ? newRect.height - 20 : newRect.height) : 0
    )
  }
  
  // Set window resize handler (original: window.onresize = d)
  window.onresize = handleResize
  
  // ============================================
  // Final layout setup
  // ============================================
  if (mode === 'view') {
    await handleResize()
  } else {
    editor.reLayoutToCenter({
      left: 92,
      right: 0,
      top: 0,
      bottom: 0,
    })
  }
  
  // Set size (original: e.setSize(n.width, n.height))
  editor.setSize(rect.width, rect.height)
  
  return savedData
}

// Export alias for original function name
export const Ux = initializeEditor
