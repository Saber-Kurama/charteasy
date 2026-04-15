import type { ReactNode } from 'react'
import { Navigator } from './Navigator'
import './PageBase.css'

interface PageBaseProps {
  language: string
  pageKey: string
  children: ReactNode
}

// PageBase component matching original: S = e => { ... }
// Original structure:
// <div className="page-base">
//   <Navigator language={t} pageKey={n} />  // Original: k component
//   <div className="page-base-content">{children}</div>
// </div>
export function PageBase({ language, pageKey, children }: PageBaseProps) {
  return (
    <div className="page-base">
      <Navigator language={language} pageKey={pageKey} />
      <div className="page-base-content">
        {children}
      </div>
    </div>
  )
}
