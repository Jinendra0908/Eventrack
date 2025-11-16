'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@chakra-ui/react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()
  const toast = useToast()

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true)
    setIsHydrated(true)
  }, [])

  // Check for existing authentication on app load (only on client)
  useEffect(() => {
    if (isClient && isHydrated) {
      checkAuth()
    }
  }, [isClient, isHydrated])

  const checkAuth = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const storedToken = localStorage.getItem('auth-token')
      
      if (!storedToken) {
        setLoading(false)
        return
      }
      
      setToken(storedToken)
      
      // Verify token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('auth-token')
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('auth-token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store token
        localStorage.setItem('auth-token', data.data.token)
        setToken(data.data.token)
        setUser(data.data.user)
        
        toast({
          title: 'Welcome back!',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        router.push('/')
        return { success: true }
      } else {
        toast({
          title: 'Login Failed',
          description: data.message || data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return { success: false, error: data.message || data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Login Failed',
        description: 'Network error. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store token
        localStorage.setItem('auth-token', data.data.token)
        setToken(data.data.token)
        setUser(data.data.user)
        
        toast({
          title: 'Account Created!',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        router.push('/')
        return { success: true }
      } else {
        toast({
          title: 'Registration Failed',
          description: data.message || data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return { success: false, error: data.message || data.error }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Registration Failed',
        description: 'Network error. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem('auth-token')
      setToken(null)
      setUser(null)
      router.push('/login')
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    checkAuth,
    isClient,
    isHydrated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider