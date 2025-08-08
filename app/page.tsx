"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  Loader2, 
  Users,
  Package,
  FileText,
  ArrowUpRight,
  DollarSign,
  Truck,
  Activity,
  MessageSquare,
  UserPlus,
  RefreshCw,
  Building2,
  Briefcase,
  UserCheck,
  Calendar,
  CheckSquare,
  Database,
  BarChart3,
  TrendingUp,
  Settings
} from "lucide-react"

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Mock data for demonstration
  const stats = {
    employees: { total: 156, active: 142, averagePerformance: 87, newThisMonth: 8 },
    finance: { totalIncome: 25000000, monthlyIncome: 3200000, totalExpenses: 18000000, netProfit: 7000000, growthRate: 12 },
    crm: { totalCustomers: 89, activeCustomers: 67, newCustomers: 12, totalRevenue: 15000000, averageValue: 168000 },
    inventory: { totalItems: 1247, inStock: 892, lowStockItems: 45, outOfStockItems: 23, totalValue: 45000000 },
    departments: { total: 8, active: 8, totalEmployees: 156 },
    projects: { active: 15, completed: 23, pending: 7 },
    tasks: { total: 89, completed: 67, pending: 22 },
    sales: { monthlyRevenue: 8500000, totalOrders: 234, growthRate: 8 },
    reports: { generated: 45, monthlyReports: 12, templates: 8 },
    events: { upcoming: 6, thisWeek: 3, thisMonth: 12 },
    jobs: { open: 5, applications: 23, hired: 3 },
    branches: { total: 4, active: 4, totalEmployees: 156 },
    settings: { integrations: 6 }
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      console.log('No user authenticated, redirecting to login...')
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <Loader2 className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading iRis Dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => setError(null)} className="w-full bg-orange-500 hover:bg-orange-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">iRis Dashboard</h1>
                <p className="text-slate-600 mt-1 text-base">Welcome back, {(user && (user.displayName || user.email)) || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">Employees</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.employees.total}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active</span>
                <span className="text-xs font-semibold text-green-600">{stats.employees.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Departments</span>
                <span className="text-xs font-semibold text-blue-600">{stats.departments.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Performance</span>
                <span className="text-xs font-semibold text-orange-600">{stats.employees.averagePerformance}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">This Month</span>
                <span className="text-xs font-semibold text-purple-600">{stats.employees.newThisMonth}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">Revenue</p>
                <p className="text-lg font-extrabold text-slate-900">
                  TZS {stats.finance.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">This Month</span>
                <span className="text-xs font-semibold text-green-600">TZS {stats.finance.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Expenses</span>
                <span className="text-xs font-semibold text-red-600">TZS {stats.finance.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Profit</span>
                <span className="text-xs font-semibold text-green-600">TZS {stats.finance.netProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Growth</span>
                <span className="text-xs font-semibold text-blue-600">+{stats.finance.growthRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">CRM</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.crm.totalCustomers}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active</span>
                <span className="text-xs font-semibold text-green-600">{stats.crm.activeCustomers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">New This Month</span>
                <span className="text-xs font-semibold text-blue-600">{stats.crm.newCustomers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Revenue</span>
                <span className="text-xs font-semibold text-purple-600">TZS {stats.crm.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Avg Value</span>
                <span className="text-xs font-semibold text-orange-600">TZS {stats.crm.averageValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-lg">
                <Database className="h-7 w-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">Inventory</p>
                <p className="text-2xl font-extrabold text-slate-900">{stats.inventory.totalItems}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">In Stock</span>
                <span className="text-xs font-semibold text-green-600">{stats.inventory.inStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Low Stock</span>
                <span className="text-xs font-semibold text-yellow-600">{stats.inventory.lowStockItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Out of Stock</span>
                <span className="text-xs font-semibold text-red-600">{stats.inventory.outOfStockItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Value</span>
                <span className="text-xs font-semibold text-blue-600">TZS {stats.inventory.totalValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/hr')}>
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium text-slate-500">HR</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Employees</span>
                <span className="text-xs font-semibold text-blue-600">{stats.employees.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active</span>
                <span className="text-xs font-semibold text-green-600">{stats.employees.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Departments</span>
                <span className="text-xs font-semibold text-purple-600">{stats.departments.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/crm')}>
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <span className="text-xs font-medium text-slate-500">CRM</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Customers</span>
                <span className="text-xs font-semibold text-green-600">{stats.crm.totalCustomers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active</span>
                <span className="text-xs font-semibold text-blue-600">{stats.crm.activeCustomers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Revenue</span>
                <span className="text-xs font-semibold text-purple-600">TZS {stats.crm.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/projects')}>
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-medium text-slate-500">Projects</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active</span>
                <span className="text-xs font-semibold text-purple-600">{stats.projects.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Completed</span>
                <span className="text-xs font-semibold text-green-600">{stats.projects.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Pending</span>
                <span className="text-xs font-semibold text-yellow-600">{stats.projects.pending}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="flex items-center justify-between mb-2">
              <CheckSquare className="h-5 w-5 text-orange-600" />
              <span className="text-xs font-medium text-slate-500">Tasks</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Total</span>
                <span className="text-xs font-semibold text-orange-600">{stats.tasks.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Completed</span>
                <span className="text-xs font-semibold text-green-600">{stats.tasks.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Pending</span>
                <span className="text-xs font-semibold text-yellow-600">{stats.tasks.pending}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/finance')}>
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-xs font-medium text-slate-500">Finance</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Income</span>
                <span className="text-xs font-semibold text-green-600">TZS {stats.finance.totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Expenses</span>
                <span className="text-xs font-semibold text-red-600">TZS {stats.finance.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Profit</span>
                <span className="text-xs font-semibold text-blue-600">TZS {stats.finance.netProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/sales')}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-xs font-medium text-slate-500">Sales</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">This Month</span>
                <span className="text-xs font-semibold text-indigo-600">TZS {stats.sales.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Orders</span>
                <span className="text-xs font-semibold text-green-600">{stats.sales.totalOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Growth</span>
                <span className="text-xs font-semibold text-blue-600">+{stats.sales.growthRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/inventory')}>
            <div className="flex items-center justify-between mb-2">
              <Database className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-medium text-slate-500">Inventory</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Items</span>
                <span className="text-xs font-semibold text-amber-600">{stats.inventory.totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">In Stock</span>
                <span className="text-xs font-semibold text-green-600">{stats.inventory.inStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Low Stock</span>
                <span className="text-xs font-semibold text-red-600">{stats.inventory.lowStockItems}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/reports')}>
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <span className="text-xs font-medium text-slate-500">Reports</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Generated</span>
                <span className="text-xs font-semibold text-red-600">{stats.reports.generated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">This Month</span>
                <span className="text-xs font-semibold text-blue-600">{stats.reports.monthlyReports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Templates</span>
                <span className="text-xs font-semibold text-green-600">{stats.reports.templates}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/events')}>
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              <span className="text-xs font-medium text-slate-500">Events</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Upcoming</span>
                <span className="text-xs font-semibold text-teal-600">{stats.events.upcoming}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">This Week</span>
                <span className="text-xs font-semibold text-blue-600">{stats.events.thisWeek}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">This Month</span>
                <span className="text-xs font-semibold text-green-600">{stats.events.thisMonth}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/jobs')}>
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="h-5 w-5 text-pink-600" />
              <span className="text-xs font-medium text-slate-500">Jobs</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Open</span>
                <span className="text-xs font-semibold text-pink-600">{stats.jobs.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Applications</span>
                <span className="text-xs font-semibold text-green-600">{stats.jobs.applications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Hired</span>
                <span className="text-xs font-semibold text-blue-600">{stats.jobs.hired}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/branches')}>
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-5 w-5 text-cyan-600" />
              <span className="text-xs font-medium text-slate-500">Branches</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Total</span>
                <span className="text-xs font-semibold text-cyan-600">{stats.branches.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active</span>
                <span className="text-xs font-semibold text-green-600">{stats.branches.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Employees</span>
                <span className="text-xs font-semibold text-blue-600">{stats.branches.totalEmployees}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/settings')}>
            <div className="flex items-center justify-between mb-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-slate-500">Settings</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">System</span>
                <span className="text-xs font-semibold text-gray-600">Configured</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Business</span>
                <span className="text-xs font-semibold text-green-600">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Integrations</span>
                <span className="text-xs font-semibold text-blue-600">{stats.settings.integrations}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">New employee registered</p>
                <p className="text-xs text-slate-500">John Doe joined the HR department</p>
              </div>
              <span className="text-xs text-slate-400">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Project completed</p>
                <p className="text-xs text-slate-500">Website redesign project finished</p>
              </div>
              <span className="text-xs text-slate-400">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">New sale recorded</p>
                <p className="text-xs text-slate-500">TZS 500,000 sale in Sales department</p>
              </div>
              <span className="text-xs text-slate-400">3 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Inventory updated</p>
                <p className="text-xs text-slate-500">50 new items added to inventory</p>
              </div>
              <span className="text-xs text-slate-400">5 hours ago</span>
            </div>
          </div>
        </div>
        </main>
        </div>
    </div>
  )
}
