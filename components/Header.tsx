"use client"

import { useState, useEffect } from "react"
import { Bell, Search, User, Wifi, WifiOff, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./AuthProvider"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

export default function Header() {
  const { user, logout } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  // Extract username from email
  const username = user?.email ? user.email.split('@')[0] : 'Admin'

  useEffect(() => {
    // Check network connectivity
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check Firebase connectivity
    const checkFirebaseConnection = async () => {
      try {
        setFirebaseStatus('checking')
        // Simple ping to Firebase
        await getDoc(doc(db, '_health', 'ping'))
        setFirebaseStatus('connected')
      } catch (error) {
        console.warn('Firebase connection check failed:', error)
        setFirebaseStatus('disconnected')
      }
    }
    
    checkFirebaseConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkFirebaseConnection, 30000)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-slate-900">Human Resource Management</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/notifications">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-900">{username}</p>
              <p className="text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
