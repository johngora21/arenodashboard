"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from './AuthProvider'

export default function InactivityWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const { resetInactivityTimer } = useAuth()
  const WARNING_TIME = 4 * 60 * 1000 // Show warning 1 minute before logout (at 4 minutes)

  useEffect(() => {
    let warningTimeout: NodeJS.Timeout

    const startWarningTimer = () => {
      warningTimeout = setTimeout(() => {
        setShowWarning(true)
      }, WARNING_TIME)
    }

    const resetWarningTimer = () => {
      if (warningTimeout) {
        clearTimeout(warningTimeout)
      }
      setShowWarning(false)
      startWarningTimer()
    }

    // Start the warning timer
    startWarningTimer()

    // Add event listeners to reset the warning timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, resetWarningTimer, true)
    })

    return () => {
      if (warningTimeout) {
        clearTimeout(warningTimeout)
      }
      events.forEach(event => {
        document.removeEventListener(event, resetWarningTimer, true)
      })
    }
  }, [resetInactivityTimer])

  const handleStayLoggedIn = () => {
    resetInactivityTimer()
    setShowWarning(false)
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-lg text-center">Session Timeout Warning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-600">
            You will be automatically logged out in 1 minute due to inactivity.
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={handleStayLoggedIn}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Stay Logged In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowWarning(false)}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 