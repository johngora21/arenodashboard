"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
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
  Lock,
  Unlock,
  Key,
  Settings,
  AlertTriangle,
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
  Share2
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  lastLogin: string
  permissions: string[]
  accessLevel: 'admin' | 'manager' | 'user' | 'viewer'
  createdAt: string
  lastActivity: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
  isActive: boolean
}

export default function UserManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("users")

  // Mock data
  const mockUsers: User[] = [
    {
      id: "1",
      username: "admin",
      email: "admin@company.com",
      fullName: "System Administrator",
      role: "Administrator",
      department: "IT",
      status: "active",
      lastLogin: "2024-01-15 10:30",
      permissions: ["all"],
      accessLevel: "admin",
      createdAt: "2023-01-01",
      lastActivity: "2024-01-15 10:30"
    },
    {
      id: "2",
      username: "hr_manager",
      email: "hr.manager@company.com",
      fullName: "Sarah Johnson",
      role: "HR Manager",
      department: "Human Resources",
      status: "active",
      lastLogin: "2024-01-15 09:15",
      permissions: ["hr_read", "hr_write", "payroll_read"],
      accessLevel: "manager",
      createdAt: "2023-03-15",
      lastActivity: "2024-01-15 09:15"
    },
    {
      id: "3",
      username: "finance_user",
      email: "finance@company.com",
      fullName: "Mike Chen",
      role: "Finance Specialist",
      department: "Finance",
      status: "active",
      lastLogin: "2024-01-14 16:45",
      permissions: ["finance_read", "finance_write"],
      accessLevel: "user",
      createdAt: "2023-06-20",
      lastActivity: "2024-01-14 16:45"
    },
    {
      id: "4",
      username: "driver_001",
      email: "driver1@company.com",
      fullName: "John Doe",
      role: "Driver",
      department: "Logistics",
      status: "active",
      lastLogin: "2024-01-14 14:20",
      permissions: ["logistics_read", "shipment_update"],
      accessLevel: "user",
      createdAt: "2023-08-10",
      lastActivity: "2024-01-14 14:20"
    },
    {
      id: "5",
      username: "viewer_001",
      email: "viewer@company.com",
      fullName: "Lisa Wilson",
      role: "Viewer",
      department: "Operations",
      status: "inactive",
      lastLogin: "2024-01-10 11:30",
      permissions: ["read_only"],
      accessLevel: "viewer",
      createdAt: "2023-09-05",
      lastActivity: "2024-01-10 11:30"
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
    { id: "10", name: "read_only", description: "Read-only access", category: "General", isActive: true }
  ]

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers)
      setPermissions(mockPermissions)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    inactiveUsers: users.filter(u => u.status === 'inactive').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length
  }

  const roles = Array.from(new Set(users.map(u => u.role)))
  const departments = Array.from(new Set(users.map(u => u.department)))
  const statuses = ["active", "inactive", "suspended", "pending"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading user management data...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
                    <p className="text-slate-600">Manage system users and access rights</p>
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
                    Add User
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Roles</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      
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

                {/* Users List */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">System Users</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{user.fullName}</h3>
                              <p className="text-sm text-slate-600">{user.email}</p>
                              <p className="text-xs text-slate-500">@{user.username}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-sm text-slate-600">Role</p>
                              <p className="font-medium text-slate-900">{user.role}</p>
                              <Badge className={getAccessLevelColor(user.accessLevel)}>
                                {user.accessLevel}
                              </Badge>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm text-slate-600">Department</p>
                              <p className="font-medium text-slate-900">{user.department}</p>
                              <p className="text-xs text-slate-500">Last: {user.lastLogin}</p>
                            </div>
                            
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                          <p className="text-sm font-medium text-slate-600">Total Users</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
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
                          <p className="text-sm font-medium text-slate-600">Active Users</p>
                          <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
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
                          <p className="text-sm font-medium text-slate-600">Inactive Users</p>
                          <p className="text-2xl font-bold text-gray-600">{stats.inactiveUsers}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <Clock className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Suspended Users</p>
                          <p className="text-2xl font-bold text-red-600">{stats.suspendedUsers}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                          <Lock className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* User Activity and Access Levels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Recent User Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {users.slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{user.fullName}</p>
                              <p className="text-sm text-slate-600">{user.lastActivity}</p>
                            </div>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Access Level Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Administrators</span>
                          <Badge className="bg-red-100 text-red-800">
                            {users.filter(u => u.accessLevel === 'admin').length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Managers</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {users.filter(u => u.accessLevel === 'manager').length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Users</span>
                          <Badge className="bg-green-100 text-green-800">
                            {users.filter(u => u.accessLevel === 'user').length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Viewers</span>
                          <Badge className="bg-gray-100 text-gray-800">
                            {users.filter(u => u.accessLevel === 'viewer').length}
                          </Badge>
                        </div>
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
