"use client"

import { useEffect, useState } from "react"
import { 
  getAllQuotes, 
  getQuoteStats, 
  getAllContactMessages, 
  getAllAgentApplications, 
  getContactMessageStats, 
  getAgentApplicationStats,
  getEmployeeStats,
  getCRMStats,
  getShipmentStats,
  getFinancialSummary,
  getDepartmentStats,
  getInventoryStats,
  getAgentStats,
  getDriverStats
} from "@/lib/firebase-service"
import { formatDate } from "@/lib/utils"
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
  RefreshCw
} from "lucide-react"

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // All useState hooks must be called before any conditional returns
  const [stats, setStats] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const loadData = async () => {
    try {
      setDataLoading(true)
      const [
        quotesData, 
        statsData, 
        messagesData, 
        applicationsData, 
        messageStats, 
        applicationStats,
        employeeStats,
        crmStats,
        shipmentStats,
        financialSummary,
        departmentStats,
        inventoryStats,
        agentStats,
        driverStats
      ] = await Promise.all([
        getAllQuotes(),
        getQuoteStats(),
        getAllContactMessages(),
        getAllAgentApplications(),
        getContactMessageStats(),
        getAgentApplicationStats(),
        getEmployeeStats(),
        getCRMStats(),
        getShipmentStats(),
        getFinancialSummary(),
        getDepartmentStats(),
        getInventoryStats(),
        getAgentStats(),
        getDriverStats()
      ])
      
      setStats({
        ...statsData,
        messages: messageStats,
        applications: applicationStats,
        employees: employeeStats,
        crm: crmStats,
        shipments: shipmentStats,
        finance: financialSummary,
        departments: departmentStats,
        inventory: inventoryStats,
        agents: agentStats,
        drivers: driverStats
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setDataLoading(false)
    }
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user authenticated, redirecting to login...')
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'approved': return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'freight': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'moving': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'courier': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

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
            <p className="text-slate-600 font-medium">Loading admin dashboard...</p>
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
          <Button onClick={loadData} className="w-full bg-orange-500 hover:bg-orange-600">
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
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-slate-600 mt-1 text-base">Welcome back, {(user && (user.displayName || user.email)) || 'Admin'}</p>
            </div>

          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">Quotes</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.total || 0}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Pending</span>
                    <span className="text-xs font-semibold text-yellow-600">{stats.pending || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Approved</span>
                    <span className="text-xs font-semibold text-green-600">{stats.approved || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Rejected</span>
                    <span className="text-xs font-semibold text-red-600">{stats.rejected || 0}</span>
              </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">This Month</span>
                    <span className="text-xs font-semibold text-blue-600">{stats.total || 0}</span>
            </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg">
                    <UserPlus className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">Agents</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.applications?.approved || 0}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Active</span>
                    <span className="text-xs font-semibold text-green-600">{stats.applications?.approved || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Pending</span>
                    <span className="text-xs font-semibold text-yellow-600">{stats.applications?.pending || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Rejected</span>
                    <span className="text-xs font-semibold text-red-600">{stats.applications?.rejected || 0}</span>
              </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Total</span>
                    <span className="text-xs font-semibold text-green-600">{(stats.applications?.approved || 0) + (stats.applications?.pending || 0) + (stats.applications?.rejected || 0)}</span>
            </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg">
                    <MessageSquare className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">Messages</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.messages?.total || 0}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Unread</span>
                    <span className="text-xs font-semibold text-red-600">{stats.messages?.unread || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Replied</span>
                    <span className="text-xs font-semibold text-green-600">{stats.messages?.replied || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">New Today</span>
                    <span className="text-xs font-semibold text-blue-600">{stats.messages?.today || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">This Week</span>
                    <span className="text-xs font-semibold text-purple-600">{stats.messages?.thisWeek || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-lg">
                    <DollarSign className="h-7 w-7 text-white" />
            </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">Revenue</p>
                    <p className="text-lg font-extrabold text-slate-900">
                      TZS {((stats.total || 0) * 50000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">This Month</span>
                    <span className="text-xs font-semibold text-orange-600">TZS {((stats.total || 0) * 50000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Avg per Quote</span>
                    <span className="text-xs font-semibold text-green-600">TZS 50,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Pending Value</span>
                    <span className="text-xs font-semibold text-yellow-600">TZS {((stats.pending || 0) * 50000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Approved Value</span>
                    <span className="text-xs font-semibold text-green-600">TZS {((stats.approved || 0) * 50000).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/quotes')}>
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-medium text-slate-500">Quotes</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Total</span>
                  <span className="text-xs font-semibold text-blue-600">{stats?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Pending</span>
                  <span className="text-xs font-semibold text-yellow-600">{stats?.pending || 0}</span>
            </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Approved</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.approved || 0}</span>
                        </div>
                        </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/shipments')}>
              <div className="flex items-center justify-between mb-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-xs font-medium text-slate-500">Shipments</span>
            </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Active</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.shipments?.active || 0}</span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">In Transit</span>
                  <span className="text-xs font-semibold text-blue-600">{stats?.shipments?.inTransit || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Delivered</span>
                  <span className="text-xs font-semibold text-purple-600">{stats?.shipments?.delivered || 0}</span>
                          </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/crm')}>
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span className="text-xs font-medium text-slate-500">CRM</span>
                  </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Customers</span>
                  <span className="text-xs font-semibold text-purple-600">{stats?.crm?.totalCustomers || 0}</span>
                        </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Active</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.crm?.activeCustomers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Revenue</span>
                  <span className="text-xs font-semibold text-blue-600">TZS {(stats?.crm?.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                  </div>
                      </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/finance')}>
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="text-xs font-medium text-slate-500">Finance</span>
                  </div>
                  <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Income</span>
                  <span className="text-xs font-semibold text-orange-600">TZS {(stats?.finance?.totalIncome || 0).toLocaleString()}</span>
                      </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Expenses</span>
                  <span className="text-xs font-semibold text-red-600">TZS {(stats?.finance?.totalExpenses || 0).toLocaleString()}</span>
                    </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Profit</span>
                  <span className="text-xs font-semibold text-green-600">TZS {(stats?.finance?.netProfit || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/hr')}>
              <div className="flex items-center justify-between mb-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-medium text-slate-500">HR</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Employees</span>
                  <span className="text-xs font-semibold text-indigo-600">{stats?.employees?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Active</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.employees?.active || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Performance</span>
                  <span className="text-xs font-semibold text-blue-600">{stats?.employees?.averagePerformance || 0}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/analytics')}>
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-red-600" />
                <span className="text-xs font-medium text-slate-500">Analytics</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Quotes</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.total || 0}</span>
            </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Shipments</span>
                  <span className="text-xs font-semibold text-blue-600">{stats?.shipments?.total || 0}</span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Revenue</span>
                  <span className="text-xs font-semibold text-purple-600">TZS {(stats?.finance?.totalIncome || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/departments')}>
              <div className="flex items-center justify-between mb-2">
                <Package className="h-5 w-5 text-teal-600" />
                <span className="text-xs font-medium text-slate-500">Departments</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Total</span>
                  <span className="text-xs font-semibold text-teal-600">{stats?.departments?.total || 0}</span>
              </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Active</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.departments?.active || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Employees</span>
                  <span className="text-xs font-semibold text-blue-600">{stats?.departments?.totalEmployees || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/drivers')}>
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-pink-600" />
                <span className="text-xs font-medium text-slate-500">Drivers</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Total</span>
                  <span className="text-xs font-semibold text-pink-600">{stats?.drivers?.total || 0}</span>
            </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Available</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.drivers?.available || 0}</span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">On Route</span>
                  <span className="text-xs font-semibold text-blue-600">{stats?.drivers?.onRoute || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/agents')}>
              <div className="flex items-center justify-between mb-2">
                <UserPlus className="h-5 w-5 text-cyan-600" />
                <span className="text-xs font-medium text-slate-500">Agents</span>
                  </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Active</span>
                  <span className="text-xs font-semibold text-cyan-600">{stats?.agents?.active || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Total</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.agents?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Deliveries</span>
                  <span className="text-xs font-semibold text-blue-600">{stats?.agents?.totalDeliveries || 0}</span>
              </div>
                </div>
              </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/inventory')}>
              <div className="flex items-center justify-between mb-2">
                <Package className="h-5 w-5 text-amber-600" />
                <span className="text-xs font-medium text-slate-500">Inventory</span>
                  </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Items</span>
                  <span className="text-xs font-semibold text-amber-600">{stats?.inventory?.totalItems || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">In Stock</span>
                  <span className="text-xs font-semibold text-green-600">{stats?.inventory?.totalItems - (stats?.inventory?.lowStockItems || 0) - (stats?.inventory?.outOfStockItems || 0) || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Low Stock</span>
                  <span className="text-xs font-semibold text-red-600">{stats?.inventory?.lowStockItems || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        </div>
    </div>
  )
} 