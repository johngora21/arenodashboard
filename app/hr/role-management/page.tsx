"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Users, 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  ArrowLeft,
  Download,
  Upload,
  Lock,
  Unlock,
  Key,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Building,
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
  Info
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface Role {
  id: string
  name: string
  description: string
  department: string
  level: 'entry' | 'intermediate' | 'senior' | 'management' | 'executive'
  permissions: string[]
  usersCount: number
  isActive: boolean
  createdAt: string
  lastUpdated: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
  isActive: boolean
}

export default function RoleManagementPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [activeTab, setActiveTab] = useState("roles")

  // Mock data
  const mockRoles: Role[] = [
    {
      id: "1",
      name: "System Administrator",
      description: "Full system access and administration",
      department: "IT",
      level: "executive",
      permissions: ["all"],
      usersCount: 1,
      isActive: true,
      createdAt: "2023-01-01",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      name: "HR Manager",
      description: "Manage HR operations and employee data",
      department: "Human Resources",
      level: "management",
      permissions: ["hr_read", "hr_write", "payroll_read", "employee_management"],
      usersCount: 2,
      isActive: true,
      createdAt: "2023-03-15",
      lastUpdated: "2024-01-10"
    },
    {
      id: "3",
      name: "Finance Specialist",
      description: "Handle financial operations and reporting",
      department: "Finance",
      level: "intermediate",
      permissions: ["finance_read", "finance_write", "payroll_read"],
      usersCount: 3,
      isActive: true,
      createdAt: "2023-06-20",
      lastUpdated: "2024-01-12"
    },
    {
      id: "4",
      name: "Driver",
      description: "Logistics and delivery operations",
      department: "Logistics",
      level: "entry",
      permissions: ["logistics_read", "shipment_update", "route_view"],
      usersCount: 15,
      isActive: true,
      createdAt: "2023-08-10",
      lastUpdated: "2024-01-08"
    },
    {
      id: "5",
      name: "Operations Manager",
      description: "Oversee daily operations and team coordination",
      department: "Operations",
      level: "management",
      permissions: ["operations_read", "operations_write", "team_management", "reports_view"],
      usersCount: 4,
      isActive: true,
      createdAt: "2023-09-05",
      lastUpdated: "2024-01-14"
    },
    {
      id: "6",
      name: "Viewer",
      description: "Read-only access to basic information",
      department: "General",
      level: "entry",
      permissions: ["read_only"],
      usersCount: 8,
      isActive: true,
      createdAt: "2023-10-01",
      lastUpdated: "2024-01-05"
    }
  ]

  const mockPermissions: Permission[] = [
    { id: "1", name: "all", description: "Full system access", category: "System", isActive: true },
    { id: "2", name: "hr_read", description: "Read HR data", category: "HR", isActive: true },
    { id: "3", name: "hr_write", description: "Write HR data", category: "HR", isActive: true },
    { id: "4", name: "payroll_read", description: "Read payroll data", category: "Finance", isActive: true },
    { id: "5", name: "payroll_write", description: "Write payroll data", category: "Finance", isActive: true },
    { id: "6", name: "finance_read", description: "Read finance data", category: "Finance", isActive: true },
    { id: "7", name: "finance_write", description: "Write finance data", category: "Finance", isActive: true },
    { id: "8", name: "logistics_read", description: "Read logistics data", category: "Operations", isActive: true },
    { id: "9", name: "shipment_update", description: "Update shipment status", category: "Operations", isActive: true },
    { id: "10", name: "route_view", description: "View delivery routes", category: "Operations", isActive: true },
    { id: "11", name: "operations_read", description: "Read operations data", category: "Operations", isActive: true },
    { id: "12", name: "operations_write", description: "Write operations data", category: "Operations", isActive: true },
    { id: "13", name: "team_management", description: "Manage team members", category: "Management", isActive: true },
    { id: "14", name: "reports_view", description: "View reports", category: "General", isActive: true },
    { id: "15", name: "read_only", description: "Read-only access", category: "General", isActive: true }
  ]

  useEffect(() => {
    setTimeout(() => {
      setRoles(mockRoles)
      setPermissions(mockPermissions)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "all" || role.department === selectedDepartment
    const matchesLevel = selectedLevel === "all" || role.level === selectedLevel
    
    return matchesSearch && matchesDepartment && matchesLevel
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "entry":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "senior":
        return "bg-purple-100 text-purple-800"
      case "management":
        return "bg-orange-100 text-orange-800"
      case "executive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "IT":
        return "bg-blue-100 text-blue-800"
      case "Human Resources":
        return "bg-green-100 text-green-800"
      case "Finance":
        return "bg-purple-100 text-purple-800"
      case "Logistics":
        return "bg-orange-100 text-orange-800"
      case "Operations":
        return "bg-red-100 text-red-800"
      case "General":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalRoles: roles.length,
    activeRoles: roles.filter(r => r.isActive).length,
    totalUsers: roles.reduce((sum, r) => sum + r.usersCount, 0),
    averageUsersPerRole: roles.length > 0 ? roles.reduce((sum, r) => sum + r.usersCount, 0) / roles.length : 0
  }

  const departments = Array.from(new Set(roles.map(r => r.department)))
  const levels = ["entry", "intermediate", "senior", "management", "executive"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading role management data...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Role Management</h1>
                    <p className="text-slate-600">Define and manage organizational roles</p>
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
                    New Role
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="roles" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search roles..."
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
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Levels</option>
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Roles List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredRoles.map((role) => (
                    <Card key={role.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{role.name}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                          </div>
                          <Badge className={role.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {role.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getDepartmentColor(role.department)}>
                            {role.department}
                          </Badge>
                          <Badge className={getLevelColor(role.level)}>
                            {role.level}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Users</p>
                            <p className="font-medium">{role.usersCount}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Permissions</p>
                            <p className="font-medium">{role.permissions.length}</p>
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

              <TabsContent value="permissions" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">System Permissions</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {permissions.map((permission) => (
                        <Card key={permission.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-slate-900">{permission.name}</h3>
                                <p className="text-sm text-slate-600">{permission.description}</p>
                              </div>
                              <Badge className={permission.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {permission.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {permission.category}
                              </Badge>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Roles</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalRoles}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Roles</p>
                          <p className="text-2xl font-bold text-green-600">{stats.activeRoles}</p>
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
                          <p className="text-sm font-medium text-slate-600">Total Users</p>
                          <p className="text-2xl font-bold text-purple-600">{stats.totalUsers}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Avg Users/Role</p>
                          <p className="text-2xl font-bold text-orange-600">{stats.averageUsersPerRole.toFixed(1)}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Role Distribution and Recent Updates */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Role Level Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {levels.map(level => {
                          const count = roles.filter(r => r.level === level).length
                          return (
                            <div key={level} className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 capitalize">{level}</span>
                              <Badge className={getLevelColor(level)}>
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
                      <CardTitle>Recent Role Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {roles.slice(0, 5).map((role) => (
                          <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{role.name}</p>
                              <p className="text-sm text-slate-600">Updated: {role.lastUpdated}</p>
                            </div>
                            <Badge className={role.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {role.isActive ? "Active" : "Inactive"}
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
