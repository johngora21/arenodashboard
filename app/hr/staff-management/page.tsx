"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building, 
  Users, 
  UserPlus, 
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
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Activity,
  BarChart3,
  MoreHorizontal,
  Trash2,
  Copy,
  Share2,
  UserCheck,
  UserX,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Shield,
  Settings
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface Staff {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  manager: string
  location: string
  hireDate: string
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  performance: number
  workload: number
  skills: string[]
  lastActivity: string
}

interface Team {
  id: string
  name: string
  department: string
  manager: string
  members: number
  performance: number
  status: 'active' | 'inactive' | 'understaffed'
  location: string
}

export default function StaffManagementPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<Staff[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const mockStaff: Staff[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+255 123 456 789",
      position: "Senior Manager",
      department: "Operations",
      manager: "Sarah Johnson",
      location: "Dar es Salaam",
      hireDate: "2022-03-15",
      status: "active",
      performance: 4.5,
      workload: 85,
      skills: ["Leadership", "Project Management", "Team Building"],
      lastActivity: "2024-01-15 10:30"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      phone: "+255 987 654 321",
      position: "HR Specialist",
      department: "Human Resources",
      manager: "Mike Wilson",
      location: "Dar es Salaam",
      hireDate: "2023-06-20",
      status: "active",
      performance: 4.2,
      workload: 70,
      skills: ["HR Management", "Recruitment", "Employee Relations"],
      lastActivity: "2024-01-15 09:15"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      phone: "+255 555 123 456",
      position: "Driver",
      department: "Logistics",
      manager: "David Brown",
      location: "Mwanza",
      hireDate: "2021-08-10",
      status: "active",
      performance: 4.0,
      workload: 90,
      skills: ["Driving", "Vehicle Maintenance", "Route Planning"],
      lastActivity: "2024-01-14 14:20"
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      phone: "+255 777 888 999",
      position: "Accountant",
      department: "Finance",
      manager: "Lisa Chen",
      location: "Dar es Salaam",
      hireDate: "2022-09-05",
      status: "on_leave",
      performance: 4.3,
      workload: 60,
      skills: ["Accounting", "Financial Analysis", "Reporting"],
      lastActivity: "2024-01-10 16:45"
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@company.com",
      phone: "+255 444 555 666",
      position: "Logistics Manager",
      department: "Logistics",
      manager: "John Doe",
      location: "Mwanza",
      hireDate: "2020-12-01",
      status: "active",
      performance: 4.1,
      workload: 95,
      skills: ["Logistics", "Supply Chain", "Team Management"],
      lastActivity: "2024-01-15 08:30"
    }
  ]

  const mockTeams: Team[] = [
    {
      id: "1",
      name: "Operations Team A",
      department: "Operations",
      manager: "John Doe",
      members: 8,
      performance: 4.3,
      status: "active",
      location: "Dar es Salaam"
    },
    {
      id: "2",
      name: "HR Team",
      department: "Human Resources",
      manager: "Mike Wilson",
      members: 4,
      performance: 4.1,
      status: "active",
      location: "Dar es Salaam"
    },
    {
      id: "3",
      name: "Logistics Team North",
      department: "Logistics",
      manager: "David Brown",
      members: 12,
      performance: 4.0,
      status: "active",
      location: "Mwanza"
    },
    {
      id: "4",
      name: "Finance Team",
      department: "Finance",
      manager: "Lisa Chen",
      members: 3,
      performance: 4.2,
      status: "understaffed",
      location: "Dar es Salaam"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setStaff(mockStaff)
      setTeams(mockTeams)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredStaff = staff.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "on_leave":
        return "bg-yellow-100 text-yellow-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600"
    if (workload >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const stats = {
    totalStaff: staff.length,
    activeStaff: staff.filter(s => s.status === 'active').length,
    onLeave: staff.filter(s => s.status === 'on_leave').length,
    totalTeams: teams.length,
    averagePerformance: staff.length > 0 ? staff.reduce((sum, s) => sum + s.performance, 0) / staff.length : 0,
    averageWorkload: staff.length > 0 ? staff.reduce((sum, s) => sum + s.workload, 0) / staff.length : 0
  }

  const departments = Array.from(new Set(staff.map(s => s.department)))
  const statuses = ["active", "inactive", "on_leave", "terminated"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading staff management data...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Staff Management</h1>
                    <p className="text-slate-600">Comprehensive staff oversight and coordination</p>
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
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Staff</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalStaff}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Staff</p>
                          <p className="text-2xl font-bold text-green-600">{stats.activeStaff}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">On Leave</p>
                          <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
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
                          <p className="text-sm font-medium text-slate-600">Total Teams</p>
                          <p className="text-2xl font-bold text-purple-600">{stats.totalTeams}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Building className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Staff Performance and Teams */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Staff Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Average Performance</span>
                          <div className="flex items-center gap-1">
                            <Star className={`h-4 w-4 ${getPerformanceColor(stats.averagePerformance)}`} />
                            <span className={`font-semibold ${getPerformanceColor(stats.averagePerformance)}`}>
                              {stats.averagePerformance.toFixed(1)}/5.0
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Average Workload</span>
                          <span className={`font-semibold ${getWorkloadColor(stats.averageWorkload)}`}>
                            {stats.averageWorkload.toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">High Performers</span>
                          <Badge className="bg-green-100 text-green-800">
                            {staff.filter(s => s.performance >= 4.5).length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Overloaded Staff</span>
                          <Badge className="bg-red-100 text-red-800">
                            {staff.filter(s => s.workload >= 90).length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Team Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teams.map((team) => (
                          <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{team.name}</p>
                              <p className="text-sm text-slate-600">{team.department} • {team.members} members</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className={`h-4 w-4 ${getPerformanceColor(team.performance)}`} />
                                <span className={`font-medium ${getPerformanceColor(team.performance)}`}>
                                  {team.performance}/5.0
                                </span>
                              </div>
                              <Badge className={team.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {team.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="staff" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search staff..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
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
                      
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        {statuses.map(status => (
                          <option key={status} value={status}>{status.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Staff List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredStaff.map((employee) => (
                    <Card key={employee.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{employee.name}</CardTitle>
                            <p className="text-sm text-slate-600">{employee.position} • {employee.department}</p>
                          </div>
                          <Badge className={getStatusColor(employee.status)}>
                            {employee.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{employee.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{employee.location}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Performance</p>
                            <div className="flex items-center gap-1">
                              <Star className={`h-4 w-4 ${getPerformanceColor(employee.performance)}`} />
                              <span className={`font-medium ${getPerformanceColor(employee.performance)}`}>
                                {employee.performance}/5.0
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-600">Workload</p>
                            <span className={`font-medium ${getWorkloadColor(employee.workload)}`}>
                              {employee.workload}%
                            </span>
                          </div>
                        </div>
                        
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

              <TabsContent value="teams" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <Card key={team.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-3">
                            {team.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <h3 className="font-semibold text-slate-900">{team.name}</h3>
                          <p className="text-sm text-slate-600">{team.department}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Manager:</span>
                            <span className="font-medium">{team.manager}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Members:</span>
                            <span className="font-medium">{team.members}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Location:</span>
                            <span className="font-medium">{team.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Star className={`h-4 w-4 ${getPerformanceColor(team.performance)}`} />
                            <span className={`font-medium ${getPerformanceColor(team.performance)}`}>
                              {team.performance}/5.0
                            </span>
                          </div>
                          <Badge className={team.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {team.status}
                          </Badge>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Performance Analytics</h3>
                        <p className="text-sm text-slate-600 mb-4">Analyze staff performance trends</p>
                        <Button size="sm" className="w-full">View Analytics</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Workload Analysis</h3>
                        <p className="text-sm text-slate-600 mb-4">Monitor staff workload distribution</p>
                        <Button size="sm" className="w-full">View Analysis</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <Download className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Staff Reports</h3>
                        <p className="text-sm text-slate-600 mb-4">Generate comprehensive staff reports</p>
                        <Button size="sm" className="w-full">Generate Report</Button>
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
