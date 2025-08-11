"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowRightLeft, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  ArrowLeft,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Building,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
  Trash2,
  Copy,
  Share2,
  UserCheck,
  UserX,
  AlertTriangle,
  Info,
  Settings,
  FileText,
  CheckSquare,
  Square
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface Transfer {
  id: string
  employeeName: string
  employeeId: string
  currentDepartment: string
  currentLocation: string
  newDepartment: string
  newLocation: string
  transferDate: string
  status: 'pending' | 'approved' | 'completed' | 'cancelled'
  reason: string
  approvedBy: string
  effectiveDate: string
  notes: string
}

export default function TransfersPage() {
  const router = useRouter()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("transfers")

  // Mock data
  const mockTransfers: Transfer[] = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      currentDepartment: "Operations",
      currentLocation: "Dar es Salaam",
      newDepartment: "Logistics",
      newLocation: "Mwanza",
      transferDate: "2024-01-15",
      status: "approved",
      reason: "Career development and skill expansion",
      approvedBy: "Sarah Johnson",
      effectiveDate: "2024-02-01",
      notes: "Employee requested transfer for growth opportunities"
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      currentDepartment: "HR",
      currentLocation: "Dar es Salaam",
      newDepartment: "Finance",
      newLocation: "Dar es Salaam",
      transferDate: "2024-01-10",
      status: "pending",
      reason: "Internal restructuring",
      approvedBy: "",
      effectiveDate: "2024-02-15",
      notes: "Transfer due to organizational changes"
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      currentDepartment: "Logistics",
      currentLocation: "Mwanza",
      newDepartment: "Operations",
      newLocation: "Dar es Salaam",
      transferDate: "2024-01-08",
      status: "completed",
      reason: "Promotion to senior position",
      approvedBy: "David Brown",
      effectiveDate: "2024-01-20",
      notes: "Successfully completed transfer"
    },
    {
      id: "4",
      employeeName: "Sarah Wilson",
      employeeId: "EMP004",
      currentDepartment: "Finance",
      currentLocation: "Dar es Salaam",
      newDepartment: "IT",
      newLocation: "Dar es Salaam",
      transferDate: "2024-01-12",
      status: "cancelled",
      reason: "Position requirements changed",
      approvedBy: "Lisa Chen",
      effectiveDate: "2024-02-01",
      notes: "Transfer cancelled due to business needs"
    },
    {
      id: "5",
      employeeName: "David Brown",
      employeeId: "EMP005",
      currentDepartment: "Operations",
      currentLocation: "Dar es Salaam",
      newDepartment: "Logistics",
      newLocation: "Arusha",
      transferDate: "2024-01-20",
      status: "pending",
      reason: "New branch opening",
      approvedBy: "",
      effectiveDate: "2024-03-01",
      notes: "Transfer to support new branch operations"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setTransfers(mockTransfers)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.currentDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.newDepartment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || transfer.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalTransfers: transfers.length,
    pendingTransfers: transfers.filter(t => t.status === 'pending').length,
    completedTransfers: transfers.filter(t => t.status === 'completed').length,
    cancelledTransfers: transfers.filter(t => t.status === 'cancelled').length
  }

  const statuses = ["pending", "approved", "completed", "cancelled"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading transfers data...</p>
          </div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/hr')}
                    className="text-slate-600 hover:text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Transfers Management</h1>
                    <p className="text-slate-600">Manage employee transfers and relocations</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Transfer
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="transfers" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search transfers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Transfers List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredTransfers.map((transfer) => (
                    <Card key={transfer.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{transfer.employeeName}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">ID: {transfer.employeeId}</p>
                          </div>
                          <Badge className={getStatusColor(transfer.status)}>
                            {transfer.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium">{transfer.currentDepartment}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-sm font-medium">{transfer.newDepartment}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Current Location</p>
                            <p className="font-medium">{transfer.currentLocation}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">New Location</p>
                            <p className="font-medium">{transfer.newLocation}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Transfer Date</p>
                            <p className="font-medium">{transfer.transferDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Effective Date</p>
                            <p className="font-medium">{transfer.effectiveDate}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="text-slate-600">Reason</p>
                          <p className="font-medium">{transfer.reason}</p>
                        </div>
                        
                        {transfer.approvedBy && (
                          <div className="text-sm">
                            <p className="text-slate-600">Approved by: <span className="font-medium">{transfer.approvedBy}</span></p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Transfers</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalTransfers}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <ArrowRightLeft className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Pending Transfers</p>
                          <p className="text-2xl font-bold text-yellow-600">{stats.pendingTransfers}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Completed Transfers</p>
                          <p className="text-2xl font-bold text-green-600">{stats.completedTransfers}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Cancelled Transfers</p>
                          <p className="text-2xl font-bold text-red-600">{stats.cancelledTransfers}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                          <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Transfer Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Transfer Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {statuses.map(status => {
                          const count = transfers.filter(t => t.status === status).length
                          return (
                            <div key={status} className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 capitalize">{status}</span>
                              <Badge className={getStatusColor(status)}>
                                {count}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Recent Transfers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transfers.slice(0, 5).map((transfer) => (
                          <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{transfer.employeeName}</p>
                              <p className="text-sm text-slate-600">{transfer.currentDepartment} → {transfer.newDepartment}</p>
                            </div>
                            <Badge className={getStatusColor(transfer.status)}>
                              {transfer.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
