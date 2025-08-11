"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LogOut, 
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

interface Resignation {
  id: string
  employeeName: string
  employeeId: string
  department: string
  position: string
  resignationDate: string
  lastWorkingDay: string
  status: 'pending' | 'approved' | 'completed' | 'cancelled'
  reason: string
  approvedBy: string
  exitInterview: boolean
  handoverCompleted: boolean
  notes: string
}

export default function ResignationsPage() {
  const router = useRouter()
  const [resignations, setResignations] = useState<Resignation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("resignations")

  // Mock data
  const mockResignations: Resignation[] = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      department: "Operations",
      position: "Senior Manager",
      resignationDate: "2024-01-15",
      lastWorkingDay: "2024-02-15",
      status: "approved",
      reason: "Career advancement opportunity",
      approvedBy: "Sarah Johnson",
      exitInterview: true,
      handoverCompleted: false,
      notes: "Employee moving to competitor for better position"
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      department: "HR",
      position: "HR Specialist",
      resignationDate: "2024-01-10",
      lastWorkingDay: "2024-02-10",
      status: "pending",
      reason: "Personal reasons",
      approvedBy: "",
      exitInterview: false,
      handoverCompleted: false,
      notes: "Employee cited family commitments"
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      department: "Logistics",
      position: "Driver",
      resignationDate: "2024-01-08",
      lastWorkingDay: "2024-01-20",
      status: "completed",
      reason: "Better salary offer",
      approvedBy: "David Brown",
      exitInterview: true,
      handoverCompleted: true,
      notes: "Successfully completed exit process"
    },
    {
      id: "4",
      employeeName: "Sarah Wilson",
      employeeId: "EMP004",
      department: "Finance",
      position: "Accountant",
      resignationDate: "2024-01-12",
      lastWorkingDay: "2024-02-12",
      status: "cancelled",
      reason: "Work environment issues",
      approvedBy: "Lisa Chen",
      exitInterview: false,
      handoverCompleted: false,
      notes: "Employee decided to stay after discussions"
    },
    {
      id: "5",
      employeeName: "David Brown",
      employeeId: "EMP005",
      department: "IT",
      position: "Developer",
      resignationDate: "2024-01-20",
      lastWorkingDay: "2024-02-20",
      status: "pending",
      reason: "Relocation",
      approvedBy: "",
      exitInterview: false,
      handoverCompleted: false,
      notes: "Employee moving to different city"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setResignations(mockResignations)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredResignations = resignations.filter(resignation => {
    const matchesSearch = resignation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resignation.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resignation.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || resignation.status === selectedStatus
    
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
    totalResignations: resignations.length,
    pendingResignations: resignations.filter(r => r.status === 'pending').length,
    completedResignations: resignations.filter(r => r.status === 'completed').length,
    cancelledResignations: resignations.filter(r => r.status === 'cancelled').length
  }

  const statuses = ["pending", "approved", "completed", "cancelled"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading resignations data...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Resignations Management</h1>
                    <p className="text-slate-600">Process employee resignations and exits</p>
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
                    New Resignation
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resignations">Resignations</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="resignations" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search resignations..."
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

                {/* Resignations List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredResignations.map((resignation) => (
                    <Card key={resignation.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{resignation.employeeName}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{resignation.position} • {resignation.department}</p>
                          </div>
                          <Badge className={getStatusColor(resignation.status)}>
                            {resignation.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Resignation Date</p>
                            <p className="font-medium">{resignation.resignationDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Last Working Day</p>
                            <p className="font-medium">{resignation.lastWorkingDay}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="text-slate-600">Reason</p>
                          <p className="font-medium">{resignation.reason}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            {resignation.exitInterview ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-slate-600">Exit Interview</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {resignation.handoverCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-slate-600">Handover</span>
                          </div>
                        </div>
                        
                        {resignation.approvedBy && (
                          <div className="text-sm">
                            <p className="text-slate-600">Approved by: <span className="font-medium">{resignation.approvedBy}</span></p>
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
                          <p className="text-sm font-medium text-slate-600">Total Resignations</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalResignations}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <LogOut className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Pending Resignations</p>
                          <p className="text-2xl font-bold text-yellow-600">{stats.pendingResignations}</p>
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
                          <p className="text-sm font-medium text-slate-600">Completed Exits</p>
                          <p className="text-2xl font-bold text-green-600">{stats.completedResignations}</p>
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
                          <p className="text-sm font-medium text-slate-600">Cancelled</p>
                          <p className="text-2xl font-bold text-red-600">{stats.cancelledResignations}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                          <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Resignation Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Resignation Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {statuses.map(status => {
                          const count = resignations.filter(r => r.status === status).length
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
                      <CardTitle>Recent Resignations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {resignations.slice(0, 5).map((resignation) => (
                          <div key={resignation.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{resignation.employeeName}</p>
                              <p className="text-sm text-slate-600">{resignation.department} • {resignation.resignationDate}</p>
                            </div>
                            <Badge className={getStatusColor(resignation.status)}>
                              {resignation.status}
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
