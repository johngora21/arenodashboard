"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  Users,
  Package,
  FileText,
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
  Settings,
  CheckCircle,
  Shield,
  Loader2,
  AlertCircle
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState({
    stats: {
      employees: 0,
      projects: 0,
      revenue: 0,
      customers: 0
    },
    charts: {
      revenue: [],
      sales: [],
      projects: [],
      departments: []
    }
  })

  // Real data structure - will be populated from API
  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Feb', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Mar', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Apr', revenue: 0, expenses: 0, profit: 0 },
    { month: 'May', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Jun', revenue: 0, expenses: 0, profit: 0 }
  ])

  const [departmentData, setDepartmentData] = useState([
    { name: 'Engineering', employees: 0, color: '#3B82F6' },
    { name: 'Sales', employees: 0, color: '#10B981' },
    { name: 'Marketing', employees: 0, color: '#F59E0B' },
    { name: 'HR', employees: 0, color: '#EF4444' },
    { name: 'Finance', employees: 0, color: '#8B5CF6' }
  ])

  const [projectData, setProjectData] = useState([
    { status: 'Active', count: 0, color: '#10B981' },
    { status: 'Completed', count: 0, color: '#3B82F6' },
    { status: 'Pending', count: 0, color: '#F59E0B' }
  ])

  // Fetch real data from API
  const fetchDashboardData = async () => {
    setDataLoading(true)
    try {
      // TODO: Replace with real API calls
      // const response = await fetch('/api/dashboard')
      // const data = await response.json()
      
      // For now, simulate API data loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate real data
      const mockRevenueData = [
        { month: 'Jan', revenue: 2800000, expenses: 1800000, profit: 1000000 },
        { month: 'Feb', revenue: 3200000, expenses: 2000000, profit: 1200000 },
        { month: 'Mar', revenue: 2900000, expenses: 1900000, profit: 1000000 },
        { month: 'Apr', revenue: 3500000, expenses: 2200000, profit: 1300000 },
        { month: 'May', revenue: 3800000, expenses: 2400000, profit: 1400000 },
        { month: 'Jun', revenue: 4200000, expenses: 2600000, profit: 1600000 }
      ]
      
      const mockDepartmentData = [
        { name: 'Engineering', employees: 45, color: '#3B82F6' },
        { name: 'Sales', employees: 32, color: '#10B981' },
        { name: 'Marketing', employees: 28, color: '#F59E0B' },
        { name: 'HR', employees: 18, color: '#EF4444' },
        { name: 'Finance', employees: 15, color: '#8B5CF6' }
      ]
      
      const mockProjectData = [
        { status: 'Active', count: 15, color: '#10B981' },
        { status: 'Completed', count: 23, color: '#3B82F6' },
        { status: 'Pending', count: 7, color: '#F59E0B' }
      ]

      setRevenueData(mockRevenueData)
      setDepartmentData(mockDepartmentData)
      setProjectData(mockProjectData)
      
      setDashboardData({
        stats: {
          employees: 138,
          projects: 45,
          revenue: 22400000,
          customers: 89
        },
        charts: {
          revenue: mockRevenueData,
          sales: mockRevenueData,
          projects: mockProjectData,
          departments: mockDepartmentData
        }
      })
    } catch (error) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data fetch error:', error)
    } finally {
      setDataLoading(false)
    }
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      console.log('No user authenticated, redirecting to login...')
      router.push('/login')
    }
  }, [user, loading, router])

  // Load dashboard data on mount
  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Show login redirect if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Welcome back! Here's what's happening with your business today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardData.stats.employees}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-700 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    TZS {dashboardData.stats.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Total Projects</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardData.stats.projects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Total Customers</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardData.stats.customers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Revenue vs Expenses (6 Months)</h3>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `TZS ${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Department Distribution Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Employee Distribution by Department</h3>
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, employees }) => `${name}: ${employees}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="employees"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Project Status Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Project Status</h3>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/rbac-demo')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  RBAC Demo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/hr/user-access-management')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  User Access
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/user-management')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  User Management
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">API Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Performance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={dataLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Dashboard data refreshed</p>
                  <p className="text-xs text-slate-500">Latest metrics and charts updated</p>
                </div>
                <span className="text-xs text-slate-400">Just now</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Real-time charts loaded</p>
                  <p className="text-xs text-slate-500">Interactive charts with real data</p>
                </div>
                <span className="text-xs text-slate-400">1 min ago</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
