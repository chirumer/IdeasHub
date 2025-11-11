import React, { createContext, useContext, useState, useEffect } from 'react'
import { Theme } from '@/types'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme
    if (storedTheme) {
      setThemeState(storedTheme)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'theme-ocean', 'theme-sunset', 'theme-forest', 'theme-purple')
    
    if (theme === 'light') {
      // Light is the default, no class needed
    } else if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.add(`theme-${theme}`)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
