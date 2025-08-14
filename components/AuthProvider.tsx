"use client"

import { createContext, useContext, useState, useEffect } from 'react'

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

// Mock user data - you can modify these as needed
const MOCK_USERS = {
  'johnjohngora@gmail.com': {
    id: '1',
    email: 'johnjohngora@gmail.com',
    name: 'John Gora',
    role: 'Super Admin',
    roleId: '1',
    roleDetails: {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access and control',
      level: 'executive',
      permissions: ['all_access'],
      sidebarFeatures: ['dashboard', 'branches', 'departments', 'sales', 'finance', 'inventory', 'hr', 'crm', 'projects', 'tasks', 'reports', 'events', 'settings'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    permissions: ['all_access'],
    sidebarFeatures: ['dashboard', 'branches', 'departments', 'sales', 'finance', 'inventory', 'hr', 'crm', 'projects', 'tasks', 'reports', 'events', 'settings'],
    status: 'active',
    department: 'IT',
    position: 'System Administrator',
    phone: '+255123456789',
    avatar: undefined,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mock-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('mock-user')
      }
    }
    setLoading(false)
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock authentication - you can modify this logic
      if (email === 'johnjohngora@gmail.com' && password === '99009900') {
        const userData = MOCK_USERS[email]
        setUser(userData)
        localStorage.setItem('mock-user', JSON.stringify(userData))
        
        // Redirect to dashboard after successful login
        window.location.href = '/'
      } else {
        throw new Error('Invalid credentials. Use: johnjohngora@gmail.com / 99009900')
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed. Please check your credentials.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem('mock-user')
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if there's an error
      setUser(null)
      localStorage.removeItem('mock-user')
      window.location.href = '/login'
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      // Mock password reset - in real app, this would send an email
      setError('Password reset functionality not implemented in demo mode')
      throw new Error('Password reset functionality not implemented in demo mode')
    } catch (error: any) {
      setError(error.message || 'Password reset failed. Please try again.')
      throw error
    }
  }

  const resetInactivityTimer = () => {
    // TODO: Implement inactivity timer
  }

  const refreshUserData = async () => {
    try {
      if (user) {
        // In mock mode, just refresh from localStorage
        const savedUser = localStorage.getItem('mock-user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
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
    // You can assign anyone to be HR - check if they have HR permissions
    return user.permissions.includes('hr_access') || user.permissions.includes('all_access')
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