import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'linguasense_settings'
const HISTORY_KEY = 'linguasense_recent'
const FAVORITES_KEY = 'linguasense_favorites'

const defaultSettings = {
  defaultSourceLang: 'en',
  defaultTargetLang: 'es',
  defaultTone: 'Professional',
  defaultContext: 'General',
  darkMode: true,
  autoDetect: true,
  saveHistory: true,
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail for private browsing / quota issues
  }
}

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => loadFromStorage(STORAGE_KEY, defaultSettings))
  const [recentTranslations, setRecentTranslations] = useState(() =>
    loadFromStorage(HISTORY_KEY, [])
  )
  const [favorites, setFavorites] = useState(() => loadFromStorage(FAVORITES_KEY, []))

  // Persist settings whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, settings)
  }, [settings])

  useEffect(() => {
    saveToStorage(HISTORY_KEY, recentTranslations)
  }, [recentTranslations])

  useEffect(() => {
    saveToStorage(FAVORITES_KEY, favorites)
  }, [favorites])

  // ── Setting updaters ─────────────────────────────────
  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  // ── Recent translations ──────────────────────────────
  const addRecentTranslation = useCallback((entry) => {
    setRecentTranslations((prev) => {
      const next = [{ ...entry, id: Date.now(), timestamp: new Date().toISOString() }, ...prev]
      return next.slice(0, 50) // keep last 50
    })
  }, [])

  const clearRecentTranslations = useCallback(() => {
    setRecentTranslations([])
  }, [])

  // ── Favorites ────────────────────────────────────────
  const addFavorite = useCallback((item) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id)) return prev
      return [{ ...item, favoritedAt: new Date().toISOString() }, ...prev]
    })
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  )

  const value = {
    settings,
    updateSettings,
    resetSettings,
    recentTranslations,
    addRecentTranslation,
    clearRecentTranslations,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within <AppProvider>')
  return ctx
}

export default AppContext
