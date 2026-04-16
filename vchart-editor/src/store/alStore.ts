import { create } from 'zustand'

// AL store interface (matching original AL - main.e2a65968.js 56307-56332)
interface ALStore {
  // Zoom state
  zoom: number
  setZoom: (zoom: number) => void

  // Undo/Redo enable flags (for toolbar buttons)
  enableUndo: boolean
  setEnableUndo: (enable: boolean) => void
  enableRedo: boolean
  setEnableRedo: (enable: boolean) => void

  // Development mode
  developMode: boolean
  setDevelopMode: (mode: boolean) => void
}

// AL store (matching original AL - main.e2a65968.js 56307-56332)
// Original code:
// const AL = (0, l.v)(e => ({
//     zoom: 1,
//     setZoom: t => { e({ zoom: t }) },
//     enableRedo: !1,
//     setEnableUndo: t => { e({ enableUndo: t }) },
//     enableUndo: !1,
//     setEnableRedo: t => { e({ enableRedo: t }) },
//     developMode: !1,
//     setDevelopMode: t => { e({ developMode: t }) }
// }));
export const useALStore = create<ALStore>((set) => ({
  // Zoom state (original: zoom: 1)
  zoom: 1,

  // Set zoom (original: setZoom: t => { e({ zoom: t }) })
  setZoom: (zoom) => {
    set({ zoom })
  },

  // Enable undo flag (original: enableUndo: !1)
  enableUndo: false,

  // Set enable undo (original: setEnableUndo: t => { e({ enableUndo: t }) })
  setEnableUndo: (enable) => {
    set({ enableUndo: enable })
  },

  // Enable redo flag (original: enableRedo: !1)
  enableRedo: false,

  // Set enable redo (original: setEnableRedo: t => { e({ enableRedo: t }) })
  setEnableRedo: (enable) => {
    set({ enableRedo: enable })
  },

  // Development mode (original: developMode: !1)
  developMode: false,

  // Set development mode (original: setDevelopMode: t => { e({ developMode: t }) })
  setDevelopMode: (mode) => {
    set({ developMode: mode })
  },
}))
