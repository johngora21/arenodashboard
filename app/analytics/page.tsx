"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { getAnalyticsData, AnalyticsData } from "@/lib/firebase-service"
import { tanzaniaRegions } from "@/lib/tanzania-regions"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  MapPin, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  DollarSign,
  Truck,
  Ship,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Star
} from "lucide-react"



export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("30d")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [selectedChart, setSelectedChart] = useState("overview")

  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      loadAnalytics()
    }
  }, [user, timeFilter, serviceFilter, regionFilter])

  const loadAnalytics = async () => {
    try {
      setDataLoading(true)
      const analyticsData = await getAnalyticsData({
        timeFilter,
        serviceFilter,
        regionFilter
      })
      setData(analyticsData)
    } catch (err) {
      console.error('Error loading analytics:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const renderPieChart = (data: any[], title: string, colors: string[]) => {
    const total = data.reduce((sum, item) => sum + (item.count || item.amount), 0)
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{formatNumber(total)}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
        </div>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percentage = ((item.count || item.amount) / total) * 100
                const angle = (percentage / 100) * 360
                const startAngle = data.slice(0, index).reduce((sum, prevItem) => {
                  const prevPercentage = ((prevItem.count || prevItem.amount) / total) * 100
                  return sum + (prevPercentage / 100) * 360
                }, 0)
                
                const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180)
                const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180)
                const x2 = 50 + 35 * Math.cos(((startAngle + angle) * Math.PI) / 180)
                const y2 = 50 + 35 * Math.sin(((startAngle + angle) * Math.PI) / 180)
                
                const largeArcFlag = angle > 180 ? 1 : 0
                
                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                )
              })}
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{item.service || item.type || item.status || item.region || item.location}</div>
                  <div className="text-xs text-slate-500">{formatNumber(item.count || item.amount)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderBarChart = (data: any[], title: string, xKey: string, yKey: string, color: string) => {
    const maxValue = Math.max(...data.map(item => item[yKey]))
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = (item[yKey] / maxValue) * 100
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 truncate">{item[xKey]}</span>
                  <span className="font-semibold text-slate-900">{formatNumber(item[yKey])}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderLineChart = (data: any[], title: string, xKey: string, yKey: string, color: string) => {
    const maxValue = Math.max(...data.map(item => item[yKey]))
    const minValue = Math.min(...data.map(item => item[yKey]))
    const range = maxValue - minValue
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="relative h-48">
          <svg className="w-full h-full" viewBox={`0 0 ${data.length * 60} 120`}>
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data.map((item, index) => {
                const x = index * 60 + 30
                const y = 100 - ((item[yKey] - minValue) / range) * 80
                return `${x},${y}`
              }).join(' ')}
            />
            {data.map((item, index) => {
              const x = index * 60 + 30
              const y = 100 - ((item[yKey] - minValue) / range) * 80
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500">
            {data.map((item, index) => (
              <span key={index} className="text-center">
                {item[xKey]}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-0">
          <Header />
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading analytics data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <Header />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
              <p className="text-slate-600">Comprehensive insights into your logistics operations</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                  
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Services</option>
                    <option value="freight">Freight</option>
                    <option value="moving">Moving</option>
                    <option value="courier">Courier</option>
                  </select>
                  
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Regions</option>
                    {tanzaniaRegions.map((region) => (
                      <option key={region.name} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.revenue.total)}</p>
                    <div className="flex items-center mt-2">
                      {data.revenue.growth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${data.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.revenue.growth > 0 ? '+' : ''}{data.revenue.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Shipments</p>
                    <p className="text-2xl font-bold text-slate-900">{formatNumber(data.services.total)}</p>
                    <div className="flex items-center mt-2">
                      <Activity className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm text-blue-600">Active</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Agents</p>
                    <p className="text-2xl font-bold text-slate-900">{data.agents.active}/{data.agents.total}</p>
                    <div className="flex items-center mt-2">
                      <Users className="h-4 w-4 text-purple-500 mr-1" />
                      <span className="text-sm text-purple-600">On Duty</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Clients</p>
                    <p className="text-2xl font-bold text-slate-900">{formatNumber(data.clients.total)}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-sm text-orange-600">+{data.clients.newThisMonth} this month</span>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "overview", name: "Overview", icon: BarChart3 },
                  { id: "revenue", name: "Revenue", icon: DollarSign },
                  { id: "services", name: "Services", icon: Package },
                  { id: "routes", name: "Routes", icon: MapPin },
                  { id: "agents", name: "Agents", icon: Users },
                  { id: "clients", name: "Clients", icon: Globe }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedChart(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedChart === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Charts Section */}
            {selectedChart === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {renderPieChart(data.revenue.byService, "Revenue by Service", ["#3B82F6", "#8B5CF6", "#F59E0B"])}
                {renderPieChart(data.services.byType, "Shipments by Service Type", ["#3B82F6", "#8B5CF6", "#F59E0B"])}
                {renderLineChart(data.timeData.monthly, "Monthly Revenue Trend", "month", "revenue", "#10B981")}
                {renderBarChart(data.routes.popular.slice(0, 5), "Top Routes by Revenue", "route", "revenue", "#EF4444")}
              </div>
            )}

            {selectedChart === "revenue" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {renderPieChart(data.revenue.byService, "Revenue by Service", ["#3B82F6", "#8B5CF6", "#F59E0B"])}
                {renderLineChart(data.timeData.daily, "Daily Revenue Trend", "date", "revenue", "#10B981")}
                {renderLineChart(data.timeData.monthly, "Monthly Revenue Growth", "month", "revenue", "#3B82F6")}
                {renderBarChart(data.clients.topClients, "Top Clients by Revenue", "name", "revenue", "#8B5CF6")}
              </div>
            )}

            {selectedChart === "services" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {renderPieChart(data.services.byType, "Shipments by Service Type", ["#3B82F6", "#8B5CF6", "#F59E0B"])}
                {renderPieChart(data.services.byStatus, "Shipment Status Distribution", ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"])}
                {renderLineChart(data.timeData.monthly, "Monthly Shipment Volume", "month", "shipments", "#8B82F6")}
                {renderBarChart(data.timeData.daily, "Daily Shipment Volume", "date", "shipments", "#3B82F6")}
              </div>
            )}

            {selectedChart === "routes" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {renderPieChart(data.routes.byRegion, "Shipments by Region", ["#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"])}
                {renderBarChart(data.routes.popular, "Popular Routes by Shipments", "route", "count", "#10B981")}
                {renderBarChart(data.routes.popular, "Routes by Revenue", "route", "revenue", "#8B5CF6")}
                {renderLineChart(data.timeData.monthly, "Monthly Route Performance", "month", "shipments", "#3B82F6")}
              </div>
            )}

            {selectedChart === "agents" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {renderBarChart(data.agents.performance, "Agent Performance by Shipments", "name", "shipments", "#3B82F6")}
                {renderBarChart(data.agents.performance, "Agent Performance by Revenue", "name", "revenue", "#10B981")}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Ratings</h3>
                  <div className="space-y-3">
                    {data.agents.performance.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{agent.name}</span>
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-slate-900">{agent.rating}</span>
                          <div className="flex ml-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Utilization</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {Math.round((data.agents.active / data.agents.total) * 100)}%
                    </div>
                    <div className="text-sm text-slate-600">Agent Utilization</div>
                  </div>
                </div>
              </div>
            )}

            {selectedChart === "clients" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {renderPieChart(data.clients.byLocation, "Clients by Location", ["#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#6B7280"])}
                {renderBarChart(data.clients.topClients, "Top Clients by Shipments", "name", "shipments", "#3B82F6")}
                {renderBarChart(data.clients.topClients, "Top Clients by Revenue", "name", "revenue", "#10B981")}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Growth</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">+{data.clients.newThisMonth}</div>
                    <div className="text-sm text-slate-600">New clients this month</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 