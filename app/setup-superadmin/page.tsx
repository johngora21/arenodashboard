'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { setupSuperAdmin, isSuperAdmin } from '@/lib/firebase-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Shield, User } from 'lucide-react'

export default function SetupSuperAdminPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState('johnjohngora@gmail.com')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('')

  const handleSetupSuperAdmin = async () => {
    if (!user) {
      setMessage('You must be logged in to set up superadmin')
      setIsSuccess(false)
      return
    }

    setLoading(true)
    setMessage('')
    setIsSuccess(false)

    try {
      setCurrentStatus('Checking current superadmin status...')
      const isAlreadySuperAdmin = await isSuperAdmin(email)
      
      if (isAlreadySuperAdmin) {
        setMessage('This email is already set up as superadmin!')
        setIsSuccess(true)
        setCurrentStatus('')
        return
      }

      setCurrentStatus('Creating superadmin role...')
      const result = await setupSuperAdmin(email)
      
      setMessage(`Superadmin setup completed successfully! Role ID: ${result.roleId}, User ID: ${result.userId}`)
      setIsSuccess(true)
      setCurrentStatus('')
    } catch (error: any) {
      setMessage(`Error setting up superadmin: ${error.message}`)
      setIsSuccess(false)
      setCurrentStatus('')
    } finally {
      setLoading(false)
    }
  }

  const checkSuperAdminStatus = async () => {
    setLoading(true)
    setMessage('')
    setIsSuccess(false)

    try {
      setCurrentStatus('Checking superadmin status...')
      const isSuperAdminUser = await isSuperAdmin(email)
      
      if (isSuperAdminUser) {
        setMessage('✅ This email is already configured as superadmin!')
        setIsSuccess(true)
      } else {
        setMessage('❌ This email is not configured as superadmin yet.')
        setIsSuccess(false)
      }
      setCurrentStatus('')
    } catch (error: any) {
      setMessage(`Error checking status: ${error.message}`)
      setIsSuccess(false)
      setCurrentStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Superadmin Setup
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Configure superadmin access for the admin dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current User Info */}
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Current User</span>
              </div>
              <p className="text-sm text-blue-700">{user.email}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Superadmin Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for superadmin"
              className="w-full"
            />
          </div>

          {/* Status Display */}
          {currentStatus && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">{currentStatus}</p>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`border rounded-lg p-3 ${
              isSuccess 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={checkSuperAdminStatus}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Check Status
            </Button>
            <Button
              onClick={handleSetupSuperAdmin}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Setup Superadmin'}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Instructions:</h4>
            <ol className="text-sm text-slate-600 space-y-1">
              <li>1. Enter the email address for the superadmin</li>
              <li>2. Click "Check Status" to see if already configured</li>
              <li>3. Click "Setup Superadmin" to create the role</li>
              <li>4. The user will have full access to all features</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 