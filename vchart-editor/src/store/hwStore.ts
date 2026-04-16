import { create } from 'zustand'

// AI Assistant type
export type AIAssistantType = 'close' | 'open' | 'minimized'

// Hw store interface (matching original Hw - main.e2a65968.js 54443-54507)
interface HwStore {
  // Editor bar visibility
  editorBarVisible: boolean
  setEditorBarVisible: (visible: boolean) => void

  // Style panel visibility
  stylePanelVisible: boolean
  setStylePanelVisible: (visible: boolean) => void

  // Data panel visibility
  dataPanelVisible: boolean
  setDataPanelVisible: (visible: boolean) => void

  // Data panel height
  dataPanelHeight: number
  setDataPanelHeight: (height: number) => void

  // Upload panel visibility
  uploadPanelVisible: boolean
  setUploadPanelVisible: (visible: boolean) => void

  // Table data type modal visibility
  tableDataTypeModalVisible: boolean
  setTableDataTypeModalVisible: (visible: boolean) => void

  // Auto annotation visibility
  autoAnnotationVisible: boolean
  setAutoAnnotationVisible: (visible: boolean) => void

  // AI Assistant type
  aiAssistantType: AIAssistantType
  setAIAssistantType: (type: AIAssistantType) => void

  // Color configure visibility
  colorConfigureVisible: boolean
  setColorConfigureVisible: (visible: boolean) => void

  // Hide all panels
  hideAll: () => void
}

// Hw store (matching original Hw - main.e2a65968.js 54443-54507)
// Original code:
// const Hw = (0, l.v)(e => ({
//     editorBarVisible: !1,
//     setEditorBarVisible: t => { e({ editorBarVisible: t }) },
//     stylePanelVisible: !1,
//     setStylePanelVisible: t => { e({ stylePanelVisible: t }) },
//     dataPanelVisible: !1,
//     setDataPanelVisible: t => { e({ dataPanelVisible: t }) },
//     dataPanelHeight: 330,
//     setDataPanelHeight: t => { e({ dataPanelHeight: t }) },
//     uploadPanelVisible: !1,
//     setUploadPanelVisible: t => { e({ uploadPanelVisible: t }) },
//     tableDataTypeModalVisible: !1,
//     setTableDataTypeModalVisible: t => { e({ tableDataTypeModalVisible: t }) },
//     autoAnnotationVisible: !1,
//     setAutoAnnotationVisible: t => { e({ autoAnnotationVisible: t }) },
//     aiAssistantType: "close",
//     setAIAssistantType: t => { e({ aiAssistantType: t }) },
//     colorConfigureVisible: !1,
//     setColorConfigureVisible: t => { e({ colorConfigureVisible: t }) },
//     hideAll: () => {
//         e({
//             editorBarVisible: !1,
//             stylePanelVisible: !1,
//             dataPanelVisible: !1,
//             autoAnnotationVisible: !1,
//             colorConfigureVisible: !1
//         })
//     }
// }));
export const useHwStore = create<HwStore>((set) => ({
  // Editor bar visibility (original: editorBarVisible: !1)
  editorBarVisible: false,
  setEditorBarVisible: (visible) => {
    set({ editorBarVisible: visible })
  },

  // Style panel visibility (original: stylePanelVisible: !1)
  stylePanelVisible: false,
  setStylePanelVisible: (visible) => {
    set({ stylePanelVisible: visible })
  },

  // Data panel visibility (original: dataPanelVisible: !1)
  dataPanelVisible: false,
  setDataPanelVisible: (visible) => {
    set({ dataPanelVisible: visible })
  },

  // Data panel height (original: dataPanelHeight: 330)
  dataPanelHeight: 330,
  setDataPanelHeight: (height) => {
    set({ dataPanelHeight: height })
  },

  // Upload panel visibility (original: uploadPanelVisible: !1)
  uploadPanelVisible: false,
  setUploadPanelVisible: (visible) => {
    set({ uploadPanelVisible: visible })
  },

  // Table data type modal visibility (original: tableDataTypeModalVisible: !1)
  tableDataTypeModalVisible: false,
  setTableDataTypeModalVisible: (visible) => {
    set({ tableDataTypeModalVisible: visible })
  },

  // Auto annotation visibility (original: autoAnnotationVisible: !1)
  autoAnnotationVisible: false,
  setAutoAnnotationVisible: (visible) => {
    set({ autoAnnotationVisible: visible })
  },

  // AI Assistant type (original: aiAssistantType: "close")
  aiAssistantType: 'close',
  setAIAssistantType: (type) => {
    set({ aiAssistantType: type })
  },

  // Color configure visibility (original: colorConfigureVisible: !1)
  colorConfigureVisible: false,
  setColorConfigureVisible: (visible) => {
    set({ colorConfigureVisible: visible })
  },

  // Hide all panels (original: hideAll: () => { e({ ... }) })
  hideAll: () => {
    set({
      editorBarVisible: false,
      stylePanelVisible: false,
      dataPanelVisible: false,
      autoAnnotationVisible: false,
      colorConfigureVisible: false,
    })
  },
}))
