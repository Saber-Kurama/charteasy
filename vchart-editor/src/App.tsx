import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navigator } from './components/Navigator'
import { Home } from './pages/Home'
import { Editor } from './pages/Editor'
import { CanvasEditor } from './pages/CanvasEditor'
import './App.css'

function AppLayout({ children, lang }: { children: React.ReactNode; lang: string }) {
  return (
    <div className="vchart-editor">
      <Navigator language={lang as 'zh' | 'en'} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/zh/app/home" replace />} />
        <Route
          path="/:lang/app/home"
          element={
            <AppLayout lang="zh">
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/:lang/app/new"
          element={
            <AppLayout lang="zh">
              <Editor />
            </AppLayout>
          }
        />
        <Route
          path="/:lang/app/edit/:id"
          element={
            <AppLayout lang="zh">
              <Editor />
            </AppLayout>
          }
        />
        <Route
          path="/:lang/app/visualization/:id"
          element={<CanvasEditor />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
