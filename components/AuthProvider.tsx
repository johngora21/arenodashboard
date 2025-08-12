"use client"

import { createContext, useContext, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  roleId: string
  permissions: string[]
  status: 'active' | 'inactive' | 'suspended'
  department?: string
  position?: string
  phone?: string
  avatar?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resetInactivityTimer: () => void
  error: string | null
  clearError: () => void
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const clearError = () => setError(null)

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Implement authentication
      console.log('Sign in:', email, password)
    } catch (error) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      // TODO: Implement password reset
      console.log('Password reset requested for:', email)
    } catch (error) {
      setError('Password reset failed')
    }
  }

  const resetInactivityTimer = () => {
    // TODO: Implement inactivity timer
  }

  const refreshUserData = async () => {
    // TODO: Implement user data refresh
    console.log('Refreshing user data...')
  }



  const value: AuthContextType = {
    user,
    loading,
    signInWithEmail,
    logout,
    resetPassword,
    resetInactivityTimer,
    error,
    clearError,
    refreshUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 