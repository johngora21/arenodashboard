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
  { 
    id: 'departments', 
    name: 'Departments', 
    href: '/departments', 
    icon: Users,
    subItems: [
      { id: 'sales', name: 'Sales', href: '/sales', icon: TrendingUp },
      { id: 'finance', name: 'Finance', href: '/finance', icon: DollarSign },
      { id: 'inventory', name: 'Inventory', href: '/inventory', icon: Database },
    ]
  },
  { id: 'hr', name: 'HR', href: '/hr', icon: Briefcase },
  { id: 'crm', name: 'CRM', href: '/crm', icon: UserPlus },
  { id: 'projects', name: 'Projects', href: '/projects', icon: FileText },
  { id: 'tasks', name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { id: 'reports', name: 'Reports', href: '/reports', icon: BarChart3 },
  { id: 'events', name: 'Events', href: '/events', icon: Calendar },
  { id: 'settings', name: 'Settings', href: '/settings', icon: Settings },
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
              <Image src="/images/iRis-logo.png" alt="iRis Logo" width={60} height={60} className="object-contain" />
              <div>
                <h1 className="text-lg font-bold text-white">iRis</h1>
                <p className="text-xs text-slate-400">Technologies</p>
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
                const hasSubItems = item.subItems && item.subItems.length > 0
                
                return (
                  <div key={item.name}>
                    <Link
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
                    
                    {/* Render sub-items if they exist */}
                    {hasSubItems && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = pathname === subItem.href
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`
                                flex items-center space-x-3 px-3 py-1 rounded-lg text-sm font-medium transition-colors
                                ${isSubActive 
                                  ? 'bg-orange-500 text-white' 
                                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }
                              `}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
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