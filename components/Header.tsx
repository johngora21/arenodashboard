"use client"

import { Bell, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./AuthProvider"
import Link from "next/link"

export default function Header() {
  const { user } = useAuth()

  // Extract username from email
  const username = user?.email ? user.email.split('@')[0] : 'Admin'

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 h-16 flex-shrink-0 fixed top-0 left-64 right-0 z-20">
      <div className="flex items-center justify-between h-full">
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
