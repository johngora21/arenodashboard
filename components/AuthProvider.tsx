"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '@/lib/api-service'

interface Permission {
  id: string
  name: string
  description: string
  category: string
  isActive: boolean
}

interface SidebarFeature {
  id: string
  name: string
  href: string
  icon: string
  isVisible: boolean
  permissions: string[]
}

interface UserRole {
  id: string
  name: string
  description: string
  level: 'entry' | 'intermediate' | 'senior' | 'management' | 'executive'
  permissions: string[]
  sidebarFeatures: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface User {
  id: string
  email: string
  name: string
  role: string
  roleId: string
  roleDetails: UserRole
  permissions: string[]
  sidebarFeatures: string[]
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
  // RBAC methods
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  canAccessFeature: (featureId: string) => boolean
  isSuperAdmin: () => boolean
  isHR: () => boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token) {
          const userData = await authAPI.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('auth-token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { user: userData } = await authAPI.login(email, password)
      setUser(userData)
      
      // Redirect to dashboard after successful login
      window.location.href = '/'
    } catch (error) {
      setError('Authentication failed. Please check your credentials.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      setUser(null)
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await authAPI.requestPasswordReset(email)
    } catch (error) {
      setError('Password reset failed. Please try again.')
      throw error
    }
  }

  const resetInactivityTimer = () => {
    // TODO: Implement inactivity timer
  }

  const refreshUserData = async () => {
    try {
      if (user) {
        const userData = await authAPI.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      // If refresh fails, logout user
      await logout()
    }
  }

  // RBAC Methods
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission) || user.permissions.includes('all_access')
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.some(permission => hasPermission(permission))
  }

  const canAccessFeature = (featureId: string): boolean => {
    if (!user) return false
    return user.sidebarFeatures.includes(featureId) || user.permissions.includes('all_access')
  }

  const isSuperAdmin = (): boolean => {
    if (!user) return false
    return user.role === 'Super Admin' || user.permissions.includes('all_access')
  }

  const isHR = (): boolean => {
    if (!user) return false
    return user.role === 'HR Manager' || user.role === 'HR Specialist' || user.permissions.includes('hr_access')
  }

  const isAdmin = (): boolean => {
    if (!user) return false
    return isSuperAdmin() || user.role === 'Admin' || user.permissions.includes('admin_access')
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
    refreshUserData,
    // RBAC methods
    hasPermission,
    hasAnyPermission,
    canAccessFeature,
    isSuperAdmin,
    isHR,
    isAdmin
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