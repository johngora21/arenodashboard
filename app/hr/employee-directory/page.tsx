"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Map, 
  Phone, 
  Mail, 
  MapPin,
  Building,
  Calendar,
  Star,
  ArrowLeft,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  UserPlus,
  Settings,
  BarChart3,
  TrendingUp,
  UserCheck,
  Clock,
  Award,
  AlertCircle
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface Employee {
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
  avatar?: string
  skills: string[]
  performance: number
  lastActive: string
}

export default function EmployeeDirectoryPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "org">("grid")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Mock data
  const mockEmployees: Employee[] = [
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
      skills: ["Leadership", "Project Management"],
      performance: 4.5,
      lastActive: "2024-01-15"
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
      skills: ["HR Management", "Recruitment"],
      performance: 4.2,
      lastActive: "2024-01-14"
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
      skills: ["Driving", "Vehicle Maintenance"],
      performance: 4.0,
      lastActive: "2024-01-13"
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
      status: "active",
      skills: ["Accounting", "Financial Analysis"],
      performance: 4.3,
      lastActive: "2024-01-15"
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
      skills: ["Logistics", "Supply Chain"],
      performance: 4.1,
      lastActive: "2024-01-12"
    },
    {
      id: "6",
      name: "Lisa Chen",
      email: "lisa.chen@company.com",
      phone: "+255 333 222 111",
      position: "Finance Manager",
      department: "Finance",
      manager: "Sarah Johnson",
      location: "Dar es Salaam",
      hireDate: "2021-05-15",
      status: "active",
      skills: ["Financial Management", "Budgeting"],
      performance: 4.4,
      lastActive: "2024-01-15"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setEmployees(mockEmployees)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    const matchesLocation = selectedLocation === "all" || employee.location === selectedLocation
    
    return matchesSearch && matchesDepartment && matchesLocation
  })

  const departments = Array.from(new Set(employees.map(emp => emp.department)))
  const locations = Array.from(new Set(employees.map(emp => emp.location)))

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

  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'active').length,
    onLeave: employees.filter(emp => emp.status === 'on_leave').length,
    departments: departments.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading employee directory...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Employee Directory</h1>
                    <p className="text-slate-600">Browse and search all employees</p>
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
                    Add Employee
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Employees</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
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
                      <p className="text-sm font-medium text-slate-600">Active</p>
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
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
                      <p className="text-sm font-medium text-slate-600">Departments</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and View Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search employees..."
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
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "org" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("org")}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Employee List */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-3">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                        <p className="text-sm text-slate-600">{employee.position}</p>
                        <Badge className={`mt-2 ${getStatusColor(employee.status)}`}>
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600 truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{employee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{employee.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{employee.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getPerformanceColor(employee.performance)}`} />
                          <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                            {employee.performance}/5.0
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">Employee List</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {filteredEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                            <p className="text-sm text-slate-600">{employee.position} • {employee.department}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                              <span>{employee.email}</span>
                              <span>{employee.phone}</span>
                              <span>{employee.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className={`h-4 w-4 ${getPerformanceColor(employee.performance)}`} />
                              <span className={`font-medium ${getPerformanceColor(employee.performance)}`}>
                                {employee.performance}/5.0
                              </span>
                            </div>
                            <Badge className={`mt-1 ${getStatusColor(employee.status)}`}>
                              {employee.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
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
            )}

            {viewMode === "org" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Organizational Chart</h2>
                <div className="text-center py-12">
                  <Map className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Organizational Chart</h3>
                  <p className="text-slate-500">Interactive organizational chart view coming soon</p>
                </div>
              </div>
            )}

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No employees found</h3>
                <p className="text-slate-500">
                  {searchTerm || selectedDepartment !== 'all' || selectedLocation !== 'all'
                    ? 'No employees match your current filters.'
                    : 'No employees have been added yet.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
