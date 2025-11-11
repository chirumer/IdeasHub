import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { DashboardPage } from '@/pages/DashboardPage'
import { IdeaViewerPage } from '@/pages/IdeaViewerPage'
import { Navbar } from '@/components/Navbar'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen bg-background">
            <Navbar />
            <DashboardPage />
          </div>
        }
      />
      <Route
        path="/idea/:ideaId"
        element={
          <div className="min-h-screen bg-background">
            <Navbar />
            <IdeaViewerPage />
          </div>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
