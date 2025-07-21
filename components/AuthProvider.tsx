"use client"

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User 
} from 'firebase/auth'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { app, db } from '@/lib/firebase-config'
import { getUserPermissions } from '@/lib/firebase-service'

interface FirestoreUser {
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
  lastLogin?: any
  createdAt: any
  updatedAt: any
}

interface AuthContextType {
  user: User | null
  firestoreUser: FirestoreUser | null
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
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const auth = getAuth(app)
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutes in milliseconds

  const clearError = () => setError(null)

  const fetchFirestoreUser = async (authUser: User) => {
    try {
      const permissions = await getUserPermissions(authUser.email || '')
      if (permissions.length > 0) {
        const userRef = doc(db, 'users', authUser.uid)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          const userData = userDoc.data() as FirestoreUser
          setFirestoreUser({
            id: userDoc.id,
            ...userData
          })
        } else {
          const usersRef = collection(db, 'users')
          const q = query(usersRef, where('email', '==', authUser.email))
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]
            const userData = userDoc.data() as FirestoreUser
            setFirestoreUser({
              id: userDoc.id,
              ...userData
            })
          } else {
            setFirestoreUser(null)
          }
        }
      } else {
        setFirestoreUser(null)
      }
    } catch (error) {
      setFirestoreUser(null)
    }
  }

  const refreshUserData = async () => {
    if (user) {
      await fetchFirestoreUser(user)
    }
  }

  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }
    if (user) {
      inactivityTimeoutRef.current = setTimeout(() => {
        logout()
      }, INACTIVITY_TIMEOUT)
    }
  }

  const handleUserActivity = () => {
    resetInactivityTimer()
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null)
        setFirestoreUser(null)
        setLoading(false)
      } else {
        setUser(authUser)
        await fetchFirestoreUser(authUser)
        setLoading(false)
        resetInactivityTimer()
      }
    })
    return () => unsubscribe()
  }, [auth])

  useEffect(() => {
    if (user) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true)
      })
      resetInactivityTimer()
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true)
        })
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current)
        }
      }
    }
  }, [user])

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with email')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email')
      throw error
    }
  }

  const logout = async () => {
    try {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
      await signOut(auth)
    } catch (error) {}
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      firestoreUser,
      loading, 
      signInWithEmail, 
      logout, 
      resetPassword,
      resetInactivityTimer, 
      error, 
      clearError,
      refreshUserData
    }}>
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