import { create } from 'zustand'

// YC store interface (matching original YC - main.e2a65968.js 49623-49630)
interface YCStore {
  // Loading state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// YC store (matching original YC - main.e2a65968.js 49623-49630)
// Original code:
// const YC = (0, l.v)(e => ({
//     isLoading: !1,
//     setIsLoading: t => {
//         e({
//             isLoading: t
//         })
//     }
// }));
export const useYCStore = create<YCStore>((set) => ({
  // Loading state (original: isLoading: !1)
  isLoading: false,

  // Set loading state (original: setIsLoading: t => { e({ isLoading: t }) })
  setIsLoading: (loading) => {
    set({ isLoading: loading })
  },
}))
