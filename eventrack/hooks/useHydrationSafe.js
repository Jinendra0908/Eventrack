'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to safely access browser APIs and prevent hydration mismatches
 * @param {Function} clientOnlyFunction - Function that should only run on client
 * @param {any} fallbackValue - Value to return during SSR
 * @returns {any} - The result of clientOnlyFunction or fallbackValue
 */
export const useClientOnly = (clientOnlyFunction, fallbackValue = null) => {
  const [isClient, setIsClient] = useState(false)
  const [value, setValue] = useState(fallbackValue)

  useEffect(() => {
    setIsClient(true)
    if (clientOnlyFunction) {
      setValue(clientOnlyFunction())
    }
  }, [])

  return isClient ? value : fallbackValue
}

/**
 * Hook to safely access localStorage with hydration safety
 * @param {string} key - localStorage key
 * @param {any} defaultValue - default value if key doesn't exist
 * @returns {[any, Function]} - [value, setValue] tuple
 */
export const useLocalStorageSafe = (key, defaultValue) => {
  const [isClient, setIsClient] = useState(false)
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setIsClient(true)
    try {
      const item = localStorage.getItem(key)
      if (item) {
        setValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue)
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [value, setStoredValue]
}

/**
 * Hook to prevent hydration mismatches for components that depend on client state
 * @returns {boolean} - true only after client hydration is complete
 */
export const useHydrationSafe = () => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}