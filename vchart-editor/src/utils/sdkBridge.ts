// Language constants (matching original ky - referenced in main.e2a65968.js)
export const Language = {
  chinese: 'zh',
  english: 'en',
} as const

export type LanguageCode = typeof Language[keyof typeof Language]

// User info interface
interface UserInfo {
  id: string
  [key: string]: unknown
}

// Container rect interface
interface ContainerRect {
  width: number
  height: number
}

// Track info interface
interface TrackInfo {
  id?: string
  editor_source?: string
  [key: string]: unknown
}

// App variables interface
interface AppVariables {
  isMeeting?: boolean
  [key: string]: unknown
}

// Event track info interface
interface EventTrackInfo {
  editor_source?: string
  [key: string]: unknown
}

// Comment SDK interface
interface CommentSdk {
  [key: string]: unknown
}

// Tea analytics interface
interface TeaAnalytics {
  [key: string]: unknown
}

// Slardar monitoring interface
interface SlardarMonitoring {
  [key: string]: unknown
}

// App config interface
interface AppConfig {
  [key: string]: unknown
}

// SDK Bridge interface (original: Sy - main.e2a65968.js 38593-38634)
interface SdkBridge {
  // App identification
  getAppId: () => Promise<string>
  
  // Language
  getLanguage: () => Promise<LanguageCode>
  
  // Editable change callbacks
  onEditableChange: () => Promise<void>
  offEditableChange: () => Promise<void>
  
  // Data threshold
  getRecordDataThreshold: () => Promise<number>
  
  // Server domain
  getServerDomain: () => Promise<string | null>
  
  // App variables
  getAppVariables: () => Promise<AppVariables>
  
  // Data storage
  writeData: (operations: Array<{ type: string; data: { path: string[]; value: unknown } }>) => Promise<void>
  readData: () => Promise<Record<string, unknown>>
  
  // Data change callbacks
  onDataChange: () => Promise<void>
  offDataChange: () => Promise<void>
  
  // Data storage key
  getDataStorageKey: () => Promise<string>
  
  // Share link key
  getShareLinkKey: () => Promise<string | null>
  
  // Container rect
  getContainerRect: () => Promise<ContainerRect>
  updateContainerRect: () => Promise<void>
  getMaxContainerRect: () => Promise<ContainerRect>
  
  // User info
  getUserInfo: () => Promise<UserInfo>
  getUserCode: () => Promise<string>
  getUserRedirectUrl: () => Promise<string>
  
  // Track info
  getInitTrackInfo: () => Promise<TrackInfo>
  getEventTrackInfo: () => Promise<EventTrackInfo>
  
  // Aeolus token
  getAeolusToken: () => Promise<string>
  
  // Comment SDK
  commentSdk: CommentSdk | null
  
  // Analytics and monitoring
  getTea: () => TeaAnalytics | undefined
  getSlardar: () => SlardarMonitoring | undefined
  
  // Topbar
  onShowTopbar: () => void
  
  // App config
  appConfig: AppConfig
}

// Extend Window interface for global variables
declare global {
  interface Window {
    larkChartEditorTea?: TeaAnalytics
    larkVChartEditorSlardar?: SlardarMonitoring
  }
}

// SDK Bridge implementation (original: Sy - main.e2a65968.js 38593-38634)
// Original code:
// const Sy = {
//     getAppId: async () => "",
//     getLanguage: async () => ky.english,
//     onEditableChange: async () => {},
//     offEditableChange: async () => {},
//     getRecordDataThreshold: async () => 460800,
//     getServerDomain: async () => null,
//     getAppVariables: async () => ({}),
//     writeData: async () => {},
//     readData: async () => ({}),
//     onDataChange: async () => {},
//     offDataChange: async () => {},
//     getDataStorageKey: async () => "",
//     getShareLinkKey: async () => null,
//     getContainerRect: async () => ({ width: 0, height: 0 }),
//     updateContainerRect: async () => {},
//     getMaxContainerRect: async () => ({ width: 1e4, height: 1e4 }),
//     getUserInfo: async () => ({ id: "USER" }),
//     getUserCode: async () => "",
//     getUserRedirectUrl: async () => "https://charteasy.visactor.com/sdk/oauth",
//     getInitTrackInfo: async () => ({ id: "USER", editor_source: "unknown" }),
//     getEventTrackInfo: async () => ({ editor_source: "unknown" }),
//     getAeolusToken: async () => "",
//     commentSdk: null,
//     getTea: () => window.larkChartEditorTea,
//     getSlardar: () => window.larkVChartEditorSlardar,
//     onShowTopbar: () => {},
//     appConfig: {}
// };
export const Sy: SdkBridge = {
  // App identification (original: getAppId: async () => "")
  getAppId: async () => '',

  // Language (original: getLanguage: async () => ky.english)
  getLanguage: async () => Language.english,

  // Editable change callbacks (original: onEditableChange/offEditableChange)
  onEditableChange: async () => {},
  offEditableChange: async () => {},

  // Data threshold (original: getRecordDataThreshold: async () => 460800)
  // 460800 = 450KB - max data size threshold for recording
  getRecordDataThreshold: async () => 460800,

  // Server domain (original: getServerDomain: async () => null)
  getServerDomain: async () => null,

  // App variables (original: getAppVariables: async () => ({}))
  getAppVariables: async () => ({}),

  // Data storage (original: writeData/readData)
  writeData: async (_operations: Array<{ type: string; data: { path: string[]; value: unknown } }>) => {},
  readData: async () => ({}),

  // Data change callbacks (original: onDataChange/offDataChange)
  onDataChange: async () => {},
  offDataChange: async () => {},

  // Data storage key (original: getDataStorageKey: async () => "")
  getDataStorageKey: async () => '',

  // Share link key (original: getShareLinkKey: async () => null)
  getShareLinkKey: async () => null,

  // Container rect (original: getContainerRect: async () => ({ width: 0, height: 0 }))
  getContainerRect: async () => ({
    width: 0,
    height: 0,
  }),

  // Update container rect (original: updateContainerRect: async () => {})
  updateContainerRect: async () => {},

  // Max container rect (original: getMaxContainerRect: async () => ({ width: 1e4, height: 1e4 }))
  // 1e4 = 10000 - max container dimensions
  getMaxContainerRect: async () => ({
    width: 10000,
    height: 10000,
  }),

  // User info (original: getUserInfo: async () => ({ id: "USER" }))
  getUserInfo: async () => ({
    id: 'USER',
  }),

  // User code (original: getUserCode: async () => "")
  getUserCode: async () => '',

  // User redirect URL (original: getUserRedirectUrl: async () => "https://charteasy.visactor.com/sdk/oauth")
  getUserRedirectUrl: async () => 'https://charteasy.visactor.com/sdk/oauth',

  // Init track info (original: getInitTrackInfo: async () => ({ id: "USER", editor_source: "unknown" }))
  getInitTrackInfo: async () => ({
    id: 'USER',
    editor_source: 'unknown',
  }),

  // Event track info (original: getEventTrackInfo: async () => ({ editor_source: "unknown" }))
  getEventTrackInfo: async () => ({
    editor_source: 'unknown',
  }),

  // Aeolus token (original: getAeolusToken: async () => "")
  getAeolusToken: async () => '',

  // Comment SDK (original: commentSdk: null)
  commentSdk: null,

  // Tea analytics (original: getTea: () => window.larkChartEditorTea)
  getTea: () => {
    if (typeof window !== 'undefined') {
      return window.larkChartEditorTea
    }
    return undefined
  },

  // Slardar monitoring (original: getSlardar: () => window.larkVChartEditorSlardar)
  getSlardar: () => {
    if (typeof window !== 'undefined') {
      return window.larkVChartEditorSlardar
    }
    return undefined
  },

  // Show topbar (original: onShowTopbar: () => {})
  onShowTopbar: () => {},

  // App config (original: appConfig: {})
  appConfig: {},
}

// ============================================
// API Fetch Utility (original: S_ - main.e2a65968.js 42840-42861)
// ============================================

// Fetch options interface
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

// API response interface
interface ApiResponse {
  code?: number
  message?: string
  data?: unknown
  [key: string]: unknown
}

// Check if ISV app (original: pb - referenced in main.e2a65968.js)
const isISVApp = async (): Promise<boolean> => {
  // In the original code, this checks if the app is an ISV (Independent Software Vendor) app
  // For now, return false as default
  return false
}

// Get user login token (original: m_ - referenced in main.e2a65968.js)
const getUserLoginToken = (): { token?: string } | null => {
  // In the original code, this gets the token from some auth module
  // For now, try to get from localStorage
  if (typeof window !== 'undefined') {
    return { token: window.localStorage.getItem('user_login_token') ?? undefined }
  }
  return null
}

/**
 * API Fetch utility (original: S_ - main.e2a65968.js 42840-42861)
 * Makes an authenticated fetch request to the API server.
 * 
 * Original code:
 * S_ = async (e, t) => {
 *     try {
 *         const i = await Sy.getServerDomain() ?? "https://charteasy.visactor.com",
 *             a = m_()?.token ?? window.localStorage.getItem("user_login_token"),
 *             n = {
 *                 Authorization: a ? `Bearer ${a}` : "",
 *                 "x-lark-app-type": await pb() ? "ISV" : "SelfBuild",
 *                 ...t?.headers || {}
 *             };
 *         return (await fetch(`${i}${e}`, {
 *             method: "GET",
 *             mode: "cors",
 *             ...t ?? {},
 *             headers: n
 *         })).json()
 *     } catch (e) {
 *         return console.error(e), {
 *             code: 1001,
 *             message: e.message
 *         }
 *     }
 * }
 * 
 * @param path - API endpoint path
 * @param options - Fetch options
 * @returns API response as JSON
 */
export const apiFetch = async (
  path: string,
  options?: FetchOptions
): Promise<ApiResponse> => {
  try {
    // Get server domain (original: i = await Sy.getServerDomain() ?? "https://charteasy.visactor.com")
    const serverDomain = await Sy.getServerDomain() ?? 'https://charteasy.visactor.com'

    // Get auth token (original: a = m_()?.token ?? window.localStorage.getItem("user_login_token"))
    const userToken = getUserLoginToken()?.token ?? 
      (typeof window !== 'undefined' ? window.localStorage.getItem('user_login_token') : null)

    // Build headers (original: n = { Authorization: ..., "x-lark-app-type": ..., ...t?.headers || {} })
    const headers: Record<string, string> = {
      Authorization: userToken ? `Bearer ${userToken}` : '',
      'x-lark-app-type': (await isISVApp()) ? 'ISV' : 'SelfBuild',
      ...options?.headers,
    }

    // Make fetch request
    const response = await fetch(`${serverDomain}${path}`, {
      method: 'GET',
      mode: 'cors',
      ...options,
      headers,
    })

    // Return JSON response
    return response.json()
  } catch (error) {
    // Error handling (original: return console.error(e), { code: 1001, message: e.message })
    console.error(error)
    return {
      code: 1001,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Export alias for original name (S_)
export const S_ = apiFetch

export default Sy
