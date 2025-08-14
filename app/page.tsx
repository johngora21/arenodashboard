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
  Settings,
  CheckCircle,
  PieChart,
  LineChart,
  BarChart,
  Shield
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

  // Chart data
  const chartData = {
    monthlyRevenue: [
      { month: 'Jan', revenue: 2800000 },
      { month: 'Feb', revenue: 3200000 },
      { month: 'Mar', revenue: 2900000 },
      { month: 'Apr', revenue: 3500000 },
      { month: 'May', revenue: 3800000 },
      { month: 'Jun', revenue: 4200000 },
      { month: 'Jul', revenue: 4000000 },
      { month: 'Aug', revenue: 4500000 },
      { month: 'Sep', revenue: 4300000 },
      { month: 'Oct', revenue: 4800000 },
      { month: 'Nov', revenue: 5200000 },
      { month: 'Dec', revenue: 5800000 }
    ],
    departmentDistribution: [
      { name: 'Engineering', value: 35, color: '#3B82F6' },
      { name: 'Sales', value: 25, color: '#10B981' },
      { name: 'Marketing', value: 20, color: '#F59E0B' },
      { name: 'HR', value: 15, color: '#EF4444' },
      { name: 'Finance', value: 5, color: '#8B5CF6' }
    ],
    projectStatus: [
      { status: 'Active', count: 15, color: '#10B981' },
      { status: 'Completed', count: 23, color: '#3B82F6' },
      { status: 'Pending', count: 7, color: '#F59E0B' }
    ]
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">iRis Dashboard</h1>
                <p className="text-slate-600 mt-1 text-base">Welcome back, {(user && (user.displayName || user.email)) || 'Admin'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => router.push('/approvals')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approvals
                </Button>
              </div>
            </div>
          </div>

          {/* 4 Main Statistics Cards */}
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

          {/* Charts and Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
                <LineChart className="h-5 w-5 text-blue-600" />
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {chartData.monthlyRevenue.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm"
                      style={{ height: `${(data.revenue / 6000000) * 200}px` }}
                    ></div>
                    <span className="text-xs text-slate-600 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-600">Monthly revenue progression</p>
            </div>
          </div>

            {/* Department Distribution Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Department Distribution</h3>
                <PieChart className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="relative w-32 h-32">
                  {chartData.departmentDistribution.map((dept, index) => {
                    const total = chartData.departmentDistribution.reduce((sum, d) => sum + d.value, 0);
                    const percentage = (dept.value / total) * 100;
                    const rotation = chartData.departmentDistribution
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.value / total) * 360, 0);
                    
                    return (
                      <div
                        key={dept.name}
                        className="absolute inset-0 rounded-full border-8 border-transparent"
                        style={{
                          borderTopColor: dept.color,
                          transform: `rotate(${rotation}deg)`,
                          clipPath: `polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)`
                        }}
                      />
                    );
                  })}
              </div>
              </div>
              <div className="mt-4 space-y-2">
                {chartData.departmentDistribution.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      ></div>
                      <span className="text-slate-700">{dept.name}</span>
            </div>
                    <span className="font-medium text-slate-900">{dept.value}%</span>
          </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Project Status Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Project Status</h3>
                <BarChart className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-3">
                {chartData.projectStatus.map((status) => (
                  <div key={status.status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700">{status.status}</span>
                      <span className="font-medium text-slate-900">{status.count}</span>
              </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${(status.count / 45) * 100}%`,
                          backgroundColor: status.color 
                        }}
                      ></div>
              </div>
            </div>
                ))}
            </div>
          </div>
          
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{stats.projects.active}</p>
                  <p className="text-sm text-blue-700">Active Projects</p>
            </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats.tasks.completed}</p>
                  <p className="text-sm text-green-700">Completed Tasks</p>
              </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{stats.sales.totalOrders}</p>
                  <p className="text-sm text-orange-700">Total Orders</p>
              </div>
            </div>
          </div>
          
            {/* System Health */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
            </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">API Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Storage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-600">75%</span>
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

        {/* Quick Actions Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50"
              onClick={() => router.push('/rbac-demo')}
            >
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">RBAC Demo</span>
              <span className="text-xs text-slate-500">Test Access Control</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50"
              onClick={() => router.push('/hr/user-access-management')}
            >
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">User Access</span>
              <span className="text-xs text-slate-500">Manage Permissions</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50"
              onClick={() => router.push('/user-management')}
            >
              <Settings className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">User Management</span>
              <span className="text-xs text-slate-500">Manage Users</span>
            </Button>
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
