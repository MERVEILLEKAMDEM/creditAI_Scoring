"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

// Note: Theme is now managed separately by next-themes
export interface Settings {
  currency: string
  exportFormat: string
  theme: string
  language?: string
}

type SettingsContextType = {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  setLanguage: (lang: string) => void
}

const defaultSettings: Settings = {
  currency: "XOF",
  exportFormat: "csv",
  theme: "system",
  language: "en",
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  setLanguage: () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("settings")
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) }
    }
    return defaultSettings
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("app-settings")
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error("Error loading app settings:", error)
    }
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem("settings", JSON.stringify(updated))
      return updated
    })
  }

  const setLanguage = (lang: string) => {
    setSettings((prev) => {
      const updated = { ...prev, language: lang }
      localStorage.setItem("settings", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, setLanguage }}>
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