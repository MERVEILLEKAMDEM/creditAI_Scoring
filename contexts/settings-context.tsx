"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useTheme } from "next-themes"

type Settings = {
  theme: 'light' | 'dark' | 'system'
  currency: string
  exportFormat: string
}

type SettingsContextType = {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  theme: "dark",
  currency: "XOF",
  exportFormat: "csv",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme()
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Load settings and set initial theme
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("settings")
      let currentSettings = defaultSettings
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        currentSettings = { ...defaultSettings, ...parsedSettings, currency: 'XOF' }
      } else {
        currentSettings = { ...defaultSettings, currency: 'XOF' }
      }
      
      setTheme(currentSettings.theme)
      setSettings(currentSettings)
      localStorage.setItem("settings", JSON.stringify(currentSettings))

    } catch (error) {
      console.error("Error loading settings:", error)
      setTheme('dark')
      setSettings(defaultSettings)
    }
  }, [setTheme])

  // Watch for theme changes from next-themes
  useEffect(() => {
    if (theme && settings.theme !== theme) {
      const updatedSettings: Settings = { ...settings, theme: theme as Settings['theme'] }
      setSettings(updatedSettings)
      localStorage.setItem("settings", JSON.stringify(updatedSettings))
    }
  }, [theme, settings.theme])

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    
    // Update theme immediately
    setTheme(updatedSettings.theme)
    
    // Save to localStorage
    localStorage.setItem("settings", JSON.stringify(updatedSettings))
    
    // Update state
    setSettings(updatedSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
} 