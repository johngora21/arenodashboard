"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  FileText,
  ArrowLeft,
  MoreHorizontal,
  Trash2,
  Copy,
  Share2,
  Printer,
  Camera,
  User,
  Building,
  Clock,
  DollarSign,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle
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
  hireDate: string
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  salary: number
  manager: string
  location: string
  skills: string[]
  performance: {
    rating: number
    lastReview: string
    nextReview: string
  }
  documents: {
    id: string
    name: string
    type: string
    uploadDate: string
  }[]
}

export default function EmployeeProfilesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for demonstration
  const mockEmployees: Employee[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+255 123 456 789",
      position: "Senior Manager",
      department: "Operations",
      hireDate: "2022-03-15",
      status: "active",
      salary: 2500000,
      manager: "Sarah Johnson",
      location: "Dar es Salaam",
      skills: ["Leadership", "Project Management", "Team Building"],
      performance: {
        rating: 4.5,
        lastReview: "2024-01-15",
        nextReview: "2024-07-15"
      },
      documents: [
        { id: "1", name: "Employment Contract", type: "Contract", uploadDate: "2022-03-15" },
        { id: "2", name: "Performance Review", type: "Review", uploadDate: "2024-01-15" }
      ]
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      phone: "+255 987 654 321",
      position: "HR Specialist",
      department: "Human Resources",
      hireDate: "2023-06-20",
      status: "active",
      salary: 1800000,
      manager: "Mike Wilson",
      location: "Dar es Salaam",
      skills: ["HR Management", "Recruitment", "Employee Relations"],
      performance: {
        rating: 4.2,
        lastReview: "2024-01-10",
        nextReview: "2024-07-10"
      },
      documents: [
        { id: "3", name: "Employment Contract", type: "Contract", uploadDate: "2023-06-20" },
        { id: "4", name: "Training Certificate", type: "Certificate", uploadDate: "2023-12-15" }
      ]
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      phone: "+255 555 123 456",
      position: "Driver",
      department: "Logistics",
      hireDate: "2021-08-10",
      status: "active",
      salary: 1200000,
      manager: "David Brown",
      location: "Mwanza",
      skills: ["Driving", "Vehicle Maintenance", "Route Planning"],
      performance: {
        rating: 4.0,
        lastReview: "2024-01-05",
        nextReview: "2024-07-05"
      },
      documents: [
        { id: "5", name: "Employment Contract", type: "Contract", uploadDate: "2021-08-10" },
        { id: "6", name: "Driver License", type: "License", uploadDate: "2021-08-10" }
      ]
    }
  ]

  useEffect(() => {
    // Simulate loading
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

  const departments = Array.from(new Set(employees.map(emp => emp.department)))
  const statuses = ["active", "inactive", "on_leave", "terminated"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading employee profiles...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Employee Profiles</h1>
                    <p className="text-slate-600">Manage detailed employee information and records</p>
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
                  <Button onClick={() => setShowAddModal(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
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

            {/* Employee List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                          <p className="text-sm text-slate-600">{employee.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{employee.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-sm text-slate-600">Performance</p>
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getPerformanceColor(employee.performance.rating)}`} />
                          <span className={`font-semibold ${getPerformanceColor(employee.performance.rating)}`}>
                            {employee.performance.rating}/5.0
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Salary</p>
                        <p className="font-semibold text-slate-900">
                          TZS {(employee.salary / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedEmployee(employee)}
                      >
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

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No employees found</h3>
                <p className="text-slate-500">
                  {searchTerm || selectedDepartment !== 'all' || selectedStatus !== 'all'
                    ? 'No employees match your current filters.'
                    : 'No employees have been added yet.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Employee Profile</h2>
              <Button variant="ghost" onClick={() => setSelectedEmployee(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Name:</span>
                        <span className="font-medium">{selectedEmployee.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Email:</span>
                        <span className="font-medium">{selectedEmployee.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Phone:</span>
                        <span className="font-medium">{selectedEmployee.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Location:</span>
                        <span className="font-medium">{selectedEmployee.location}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Work Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Position:</span>
                        <span className="font-medium">{selectedEmployee.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Department:</span>
                        <span className="font-medium">{selectedEmployee.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Manager:</span>
                        <span className="font-medium">{selectedEmployee.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Hire Date:</span>
                        <span className="font-medium">{selectedEmployee.hireDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Salary:</span>
                        <span className="font-medium">TZS {(selectedEmployee.salary / 1000000).toFixed(1)}M</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {selectedEmployee.performance.rating}/5.0
                        </div>
                        <p className="text-sm text-slate-600">Overall Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900 mb-2">
                          {selectedEmployee.performance.lastReview}
                        </div>
                        <p className="text-sm text-slate-600">Last Review</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900 mb-2">
                          {selectedEmployee.performance.nextReview}
                        </div>
                        <p className="text-sm text-slate-600">Next Review</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedEmployee.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-slate-900">{doc.name}</p>
                              <p className="text-sm text-slate-600">{doc.type} • {doc.uploadDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Competencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
