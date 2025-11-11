import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import { authAPI } from '@/lib/api'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (session exists)
    const checkAuth = async () => {
      try {
        const { user: currentUser } = await authAPI.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        // Not authenticated, that's okay
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { user: newUser } = await authAPI.login(username, password)
      setUser(newUser)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout on client side anyway
      setUser(null)
    }
  }

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
