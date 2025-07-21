'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { SIDEBAR_FEATURES } from '@/lib/firebase-service'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredFeature?: string
  requiredPermission?: string
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredFeature, 
  requiredPermission,
  fallback 
}: ProtectedRouteProps) {
  const { user, firestoreUser, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [checking, setChecking] = useState(true)

  // Debug logs
  console.log('DEBUG: Auth user:', user);
  console.log('DEBUG: Firestore user:', firestoreUser);

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading) return
      if (!user) {
        router.push('/login')
        return
      }
      try {
        let access = true
        if (!firestoreUser) {
          setHasAccess(false)
          setChecking(false)
          return
        }
        if (firestoreUser.status !== 'active') {
          setHasAccess(false)
          setChecking(false)
          return
        }
        // Permission check
        if (requiredPermission) {
          const perms = Array.isArray(firestoreUser.permissions) ? firestoreUser.permissions : [];
          const hasPerm = perms.includes(requiredPermission) || perms.includes('all_access');
          if (!hasPerm) access = false;
        }
        setHasAccess(access)
      } catch (error) {
        setHasAccess(false)
      } finally {
        setChecking(false)
      }
    }
    checkAccess()
  }, [user, firestoreUser, authLoading, requiredFeature, requiredPermission, router])

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-sm">
              {requiredPermission && (
                <>
                  You don't have the required permission: <strong>{requiredPermission}</strong>
                </>
              )}
            </p>
            {firestoreUser && (
              <p className="text-xs mt-2">
                Your permissions: {Array.isArray(firestoreUser.permissions) ? firestoreUser.permissions.join(', ') : 'None'}
              </p>
            )}
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors mb-2"
          >
            Go to Dashboard
          </button>
          <button
            onClick={logout}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

// Higher-order component for feature protection
export function withFeatureProtection<P extends object>(
  Component: React.ComponentType<P>,
  featureId: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredFeature={featureId}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Higher-order component for permission protection
export function withPermissionProtection<P extends object>(
  Component: React.ComponentType<P>,
  permission: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredPermission={permission}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
} 