"use client"

import { useState, useEffect } from "react"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  TrendingUp,
  Package,
  Truck,
  Bell,
  User,
  UserCheck,
  CheckSquare,
  Ticket,
  Calendar,
  Database,
  Ship,
  UserPlus,
  DollarSign,
  Briefcase,
  BarChart3,
  Building2,
  Car,
  MessageSquare,
  Shield
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from 'next/image'
import { useAuth } from './AuthProvider'
import { getUserFeatures, SIDEBAR_FEATURES } from '@/lib/firebase-service'

const navigation = [
  { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { id: 'branches', name: 'Branches', href: '/branches', icon: Building2 },
  { id: 'departments', name: 'Departments', href: '/departments', icon: Users },
  { id: 'sales', name: 'Sales', href: '/sales', icon: TrendingUp },
  { id: 'finance', name: 'Finance', href: '/finance', icon: DollarSign },
  { id: 'inventory', name: 'Inventory', href: '/inventory', icon: Database },
  { id: 'hr', name: 'HR', href: '/hr', icon: Briefcase },
  { id: 'crm', name: 'CRM', href: '/crm', icon: UserPlus },
  { id: 'projects', name: 'Projects', href: '/projects', icon: FileText },
  { id: 'tasks', name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { id: 'reports', name: 'Reports', href: '/reports', icon: BarChart3 },
  { id: 'events', name: 'Events', href: '/events', icon: Calendar },
  { id: 'settings', name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      // The AuthProvider will handle the redirect to login
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 fixed left-0 top-0 h-screen overflow-hidden z-30">
      <div className="flex flex-col h-full">
        {/* Logo Section - Fixed height */}
        <div className="h-20 p-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/iRis-logo.png"
              alt="iRis Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-white">iRis</h1>
              <p className="text-xs text-slate-400">Technologies</p>
            </div>
          </div>
        </div>

        {/* Navigation - Takes remaining space */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-orange-500 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Section - Fixed at bottom */}
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
} 