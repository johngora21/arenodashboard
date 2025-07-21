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
  { id: 'quotes', name: 'Quotes', href: '/quotes', icon: FileText },
  { id: 'shipments', name: 'Shipments', href: '/shipments', icon: Ship },
  { id: 'customers', name: 'CRM', href: '/crm', icon: UserPlus },
  { id: 'finance', name: 'Finance', href: '/finance', icon: DollarSign },
  { id: 'employees', name: 'HR', href: '/hr', icon: Briefcase },
  { id: 'analytics', name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { id: 'departments', name: 'Departments', href: '/departments', icon: Building2 },
  { id: 'drivers', name: 'Drivers', href: '/drivers', icon: Car },
  { id: 'agents', name: 'Agents', href: '/agents', icon: UserCheck },
  { id: 'inventory', name: 'Inventory', href: '/inventory', icon: Database },
  { id: 'reports', name: 'Reports', href: '/reports', icon: BarChart3 },
  { id: 'settings', name: 'Settings', href: '/settings', icon: Settings },
  { id: 'user-management', name: 'User Management', href: '/user-management', icon: Shield },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userFeatures, setUserFeatures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    const loadUserFeatures = async () => {
      if (user?.email) {
        try {
          const features = await getUserFeatures(user.email)
          setUserFeatures(features)
        } catch (error) {
          console.error('Error loading user features:', error)
          // If error, show all features (fallback)
          setUserFeatures(Object.keys(SIDEBAR_FEATURES))
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadUserFeatures()
  }, [user?.email])

  // Filter navigation based on user permissions
  const filteredNavigation = navigation.filter(item => {
    // Always show dashboard
    if (item.id === 'dashboard') return true
    
    // If no features loaded yet, show all (fallback)
    if (loading || userFeatures.length === 0) return true
    
    // Check if user has access to this feature
    return userFeatures.includes(item.id)
  })

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded-lg shadow-lg flex items-center justify-center">
                <Image src="/images/ArenoLogisticsLogo.png" alt="Areno Logistics Logo" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Areno Logistics</h1>
                <p className="text-xs text-slate-400">Logistics Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {loading ? (
              // Loading skeleton
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                    <div className="h-5 w-5 bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse flex-1"></div>
                  </div>
                ))}
              </div>
            ) : (
              filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-orange-500 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })
            )}
          </nav>

          {/* Logout section */}
          <div className="p-4 border-t border-slate-800 mt-auto">
            <button 
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg transition-colors border border-slate-800"
              onClick={logout}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-slate-900 p-2 rounded-lg text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </>
  )
} 