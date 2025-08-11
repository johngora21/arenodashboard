"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  ArrowLeft,
  Download,
  Upload,
  Users,
  TrendingUp,
  TrendingDown,
  FileText,
  UserPlus,
  Settings,
  BarChart3,
  Vacation,
  Sick,
  Home,
  Plane,
  Heart,
  Baby,
  GraduationCap,
  Clock3,
  CalendarDays,
  AlertTriangle,
  Info
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'study' | 'bereavement'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  submittedAt: string
  approvedBy?: string
  approvedAt?: string
  comments?: string
}

interface LeaveBalance {
  employeeId: string
  employeeName: string
  vacationDays: number
  sickDays: number
  personalDays: number
  maternityDays: number
  paternityDays: number
  studyDays: number
  bereavementDays: number
  totalUsed: number
  totalRemaining: number
}

export default function LeaveManagementPage() {
  const router = useRouter()
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)

  // Mock data
  const mockLeaveRequests: LeaveRequest[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Operations",
      position: "Senior Manager",
      leaveType: "vacation",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      days: 5,
      reason: "Family vacation",
      status: "approved",
      submittedAt: "2024-01-20",
      approvedBy: "Sarah Johnson",
      approvedAt: "2024-01-22"
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      department: "Human Resources",
      position: "HR Specialist",
      leaveType: "sick",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      days: 2,
      reason: "Not feeling well",
      status: "approved",
      submittedAt: "2024-01-24",
      approvedBy: "Mike Wilson",
      approvedAt: "2024-01-24"
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      department: "Logistics",
      position: "Driver",
      leaveType: "personal",
      startDate: "2024-02-10",
      endDate: "2024-02-10",
      days: 1,
      reason: "Personal appointment",
      status: "pending",
      submittedAt: "2024-01-28"
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "Sarah Wilson",
      department: "Finance",
      position: "Accountant",
      leaveType: "maternity",
      startDate: "2024-03-01",
      endDate: "2024-06-01",
      days: 90,
      reason: "Maternity leave",
      status: "approved",
      submittedAt: "2024-01-15",
      approvedBy: "Lisa Chen",
      approvedAt: "2024-01-18"
    },
    {
      id: "5",
      employeeId: "EMP005",
      employeeName: "David Brown",
      department: "Logistics",
      position: "Logistics Manager",
      leaveType: "study",
      startDate: "2024-02-05",
      endDate: "2024-02-07",
      days: 3,
      reason: "Professional development course",
      status: "pending",
      submittedAt: "2024-01-30"
    }
  ]

  const mockLeaveBalances: LeaveBalance[] = [
    {
      employeeId: "EMP001",
      employeeName: "John Doe",
      vacationDays: 20,
      sickDays: 10,
      personalDays: 5,
      maternityDays: 90,
      paternityDays: 14,
      studyDays: 10,
      bereavementDays: 5,
      totalUsed: 15,
      totalRemaining: 125
    },
    {
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      vacationDays: 18,
      sickDays: 8,
      personalDays: 3,
      maternityDays: 90,
      paternityDays: 14,
      studyDays: 10,
      bereavementDays: 5,
      totalUsed: 12,
      totalRemaining: 128
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setLeaveRequests(mockLeaveRequests)
      setLeaveBalances(mockLeaveBalances)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesType = selectedType === "all" || request.leaveType === selectedType
    const matchesDepartment = selectedDepartment === "all" || request.department === selectedDepartment
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case "vacation":
        return <Vacation className="h-4 w-4" />
      case "sick":
        return <Sick className="h-4 w-4" />
      case "personal":
        return <Home className="h-4 w-4" />
      case "maternity":
        return <Heart className="h-4 w-4" />
      case "paternity":
        return <Baby className="h-4 w-4" />
      case "study":
        return <GraduationCap className="h-4 w-4" />
      case "bereavement":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800"
      case "sick":
        return "bg-red-100 text-red-800"
      case "personal":
        return "bg-purple-100 text-purple-800"
      case "maternity":
        return "bg-pink-100 text-pink-800"
      case "paternity":
        return "bg-cyan-100 text-cyan-800"
      case "study":
        return "bg-green-100 text-green-800"
      case "bereavement":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalRequests: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
    totalDays: leaveRequests.reduce((sum, r) => sum + r.days, 0),
    averageDays: leaveRequests.length > 0 ? leaveRequests.reduce((sum, r) => sum + r.days, 0) / leaveRequests.length : 0
  }

  const leaveTypes = ["vacation", "sick", "personal", "maternity", "paternity", "study", "bereavement"]
  const statuses = ["pending", "approved", "rejected", "cancelled"]
  const departments = Array.from(new Set(leaveRequests.map(r => r.department)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading leave management data...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Leave Management</h1>
                    <p className="text-slate-600">Handle vacation, sick leave, and time off</p>
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
                    New Request
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requests">Leave Requests</TabsTrigger>
                <TabsTrigger value="balances">Leave Balances</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Requests</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalRequests}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Pending</p>
                          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
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
                          <p className="text-sm font-medium text-slate-600">Approved</p>
                          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
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
                          <p className="text-sm font-medium text-slate-600">Total Days</p>
                          <p className="text-2xl font-bold text-purple-600">{stats.totalDays}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <CalendarDays className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Leave Type Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Leave Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leaveTypes.map(type => {
                          const count = leaveRequests.filter(r => r.leaveType === type).length
                          return (
                            <div key={type} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {getLeaveTypeIcon(type)}
                                <span className="text-sm text-slate-600 capitalize">{type}</span>
                              </div>
                              <Badge className={getLeaveTypeColor(type)}>
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
                      <CardTitle>Recent Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leaveRequests.slice(0, 5).map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{request.employeeName}</p>
                              <p className="text-sm text-slate-600 capitalize">{request.leaveType}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{request.days} days</p>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="requests" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search leave requests..."
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
                      
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Types</option>
                        {leaveTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Leave Requests List */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Leave Requests</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {request.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{request.employeeName}</h3>
                              <p className="text-sm text-slate-600">{request.position} • {request.department}</p>
                              <p className="text-xs text-slate-500">{request.reason}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="flex items-center gap-2 mb-1">
                                {getLeaveTypeIcon(request.leaveType)}
                                <Badge className={getLeaveTypeColor(request.leaveType)}>
                                  {request.leaveType}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600">{request.days} days</p>
                              <p className="text-xs text-slate-500">{request.startDate} - {request.endDate}</p>
                            </div>
                            
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {request.status === 'pending' && (
                                <>
                                  <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="balances" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Leave Balances</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {leaveBalances.map((balance) => (
                        <div key={balance.employeeId} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-slate-900">{balance.employeeName}</h3>
                              <p className="text-sm text-slate-600">Employee ID: {balance.employeeId}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Total Remaining</p>
                              <p className="text-2xl font-bold text-green-600">{balance.totalRemaining} days</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-slate-600">Vacation</p>
                              <p className="text-lg font-semibold text-blue-600">{balance.vacationDays}</p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <p className="text-sm text-slate-600">Sick</p>
                              <p className="text-lg font-semibold text-red-600">{balance.sickDays}</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm text-slate-600">Personal</p>
                              <p className="text-lg font-semibold text-purple-600">{balance.personalDays}</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <p className="text-sm text-slate-600">Study</p>
                              <p className="text-lg font-semibold text-green-600">{balance.studyDays}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Leave Summary Report</h3>
                        <p className="text-sm text-slate-600 mb-4">Generate comprehensive leave summary</p>
                        <Button size="sm" className="w-full">Generate Report</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Leave Analytics</h3>
                        <p className="text-sm text-slate-600 mb-4">Analyze leave patterns and trends</p>
                        <Button size="sm" className="w-full">View Analytics</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <Download className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Export Data</h3>
                        <p className="text-sm text-slate-600 mb-4">Export leave data for external processing</p>
                        <Button size="sm" className="w-full">Export</Button>
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
