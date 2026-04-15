import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from '@douyinfe/semi-ui'
import '@douyinfe/semi-ui/lib/es/_base/base.css'
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zh_CN}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
