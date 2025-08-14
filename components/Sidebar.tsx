"use client"

import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  TrendingUp,
  Database,
  UserPlus,
  DollarSign,
  Briefcase,
  BarChart3,
  Building2,
  CheckSquare,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from 'next/image'
import { useAuth } from './AuthProvider'

// Define all possible navigation items with their required permissions
const allNavigationItems = [
  { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard, permissions: ['dashboard_access'] },
  { id: 'branches', name: 'Branches', href: '/branches', icon: Building2, permissions: ['branches_access'] },
  { id: 'departments', name: 'Departments', href: '/departments', icon: Users, permissions: ['departments_access'] },
  { id: 'sales', name: 'Sales', href: '/sales', icon: TrendingUp, permissions: ['sales_access'] },
  { id: 'finance', name: 'Finance', href: '/finance', icon: DollarSign, permissions: ['finance_access'] },
  { id: 'inventory', name: 'Inventory', href: '/inventory', icon: Database, permissions: ['inventory_access'] },
  { id: 'hr', name: 'HR', href: '/hr', icon: Briefcase, permissions: ['hr_access'] },
  { id: 'crm', name: 'CRM', href: '/crm', icon: UserPlus, permissions: ['crm_access'] },
  { id: 'projects', name: 'Projects', href: '/projects', icon: FileText, permissions: ['projects_access'] },
  { id: 'tasks', name: 'Tasks', href: '/tasks', icon: CheckSquare, permissions: ['tasks_access'] },
  { id: 'reports', name: 'Reports', href: '/reports', icon: BarChart3, permissions: ['reports_access'] },
  { id: 'events', name: 'Events', href: '/events', icon: Calendar, permissions: ['events_access'] },
  { id: 'settings', name: 'Settings', href: '/settings', icon: Settings, permissions: ['settings_access'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout, canAccessFeature, isSuperAdmin, isHR } = useAuth()

  // Filter navigation items based on user permissions and HR settings
  const getVisibleNavigationItems = () => {
    if (!user) return []
    
    // Super Admin sees everything
    if (isSuperAdmin()) {
      return allNavigationItems
    }
    
    // Filter based on user's allowed sidebar features and permissions
    return allNavigationItems.filter(item => {
      // Check if HR has allowed this feature for the user
      const hasFeatureAccess = canAccessFeature(item.id)
      
      // Check if user has the required permissions
      const hasRequiredPermissions = item.permissions.some(permission => 
        user.permissions.includes(permission) || user.permissions.includes('all_access')
      )
      
      return hasFeatureAccess && hasRequiredPermissions
    })
  }

  const visibleNavigationItems = getVisibleNavigationItems()

  const handleLogout = async () => {
    try {
      await logout()
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
          {visibleNavigationItems.length > 0 ? (
            <ul className="space-y-2">
              {visibleNavigationItems.map((item) => {
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
          ) : (
            <div className="text-center py-8">
              <div className="text-slate-400 text-sm">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No features available</p>
                <p className="text-xs mt-1">Contact HR for access</p>
              </div>
            </div>
          )}
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