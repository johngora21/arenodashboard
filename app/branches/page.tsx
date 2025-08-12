"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  BarChart3
} from "lucide-react"
import { FilterIcon } from "@/components/ui/filter-icon"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface Branch {
  id: string
  name: string
  code: string
  city: string
  address: string
  phone: string
  email: string
  manager: string
  employeeCount: number
  status: 'active' | 'inactive' | 'maintenance'
  departments: number
  createdAt: string
}

interface NewBranchForm {
  name: string
  code: string
  city: string
  address: string
  phone: string
  email: string
  description: string
}

export default function BranchesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddBranch, setShowAddBranch] = useState(false)
  const [formData, setFormData] = useState<NewBranchForm>({
    name: '',
    code: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    description: ''
  })

  // Mock data
  const branches: Branch[] = [
    {
      id: "1",
      name: "Dar es Salaam Main",
      code: "DSM",
      city: "Dar es Salaam",
      address: "City Center, Plot 123",
      phone: "+255 22 123 4567",
      email: "dsm@company.com",
      manager: "John Doe",
      employeeCount: 45,
      status: "active",
      departments: 8,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Arusha Branch",
      code: "ARU",
      city: "Arusha",
      address: "Industrial Area, Block A",
      phone: "+255 27 234 5678",
      email: "arusha@company.com",
      manager: "Jane Smith",
      employeeCount: 32,
      status: "active",
      departments: 6,
      createdAt: "2024-02-20"
    },
    {
      id: "3",
      name: "Mwanza Office",
      code: "MWZ",
      city: "Mwanza",
      address: "Business District, Floor 3",
      phone: "+255 28 345 6789",
      email: "mwanza@company.com",
      manager: "Mike Johnson",
      employeeCount: 28,
      status: "maintenance",
      departments: 5,
      createdAt: "2024-03-10"
    },
    {
      id: "4",
      name: "Dodoma Branch",
      code: "DOD",
      city: "Dodoma",
      address: "Capital Area, Building 5",
      phone: "+255 26 456 7890",
      email: "dodoma@company.com",
      manager: "Sarah Wilson",
      employeeCount: 22,
      status: "active",
      departments: 4,
      createdAt: "2024-04-05"
    },
    {
      id: "5",
      name: "Tanga Office",
      code: "TAN",
      city: "Tanga",
      address: "Port Area, Warehouse 2",
      phone: "+255 27 567 8901",
      email: "tanga@company.com",
      manager: "David Brown",
      employeeCount: 18,
      status: "inactive",
      departments: 3,
      createdAt: "2024-05-12"
    }
  ]

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || branch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (field: keyof NewBranchForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("New branch data:", formData)
    setShowAddBranch(false)
    setFormData({
      name: '',
      code: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      description: ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'maintenance':
        return 'Maintenance'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Branches Management</h1>
                <p className="text-slate-600 mt-1 text-base">Manage company branches and locations</p>
              </div>

            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Branches</p>
                    <p className="text-2xl font-bold text-slate-900">{branches.length}</p>
                    <p className="text-xs text-green-600">+2 this year</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Branches</p>
                    <p className="text-2xl font-bold text-slate-900">{branches.filter(b => b.status === 'active').length}</p>
                    <p className="text-xs text-green-600">Operational</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Employees</p>
                    <p className="text-2xl font-bold text-slate-900">{branches.reduce((sum, b) => sum + b.employeeCount, 0)}</p>
                    <p className="text-xs text-green-600">+12 this month</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Departments</p>
                    <p className="text-2xl font-bold text-slate-900">{branches.reduce((sum, b) => sum + b.departments, 0)}</p>
                    <p className="text-xs text-green-600">Across all branches</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

           {/* Controls */}
           <div className="mb-6">
             <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
               <div className="flex flex-col sm:flex-row gap-4 flex-1">
                 <div className="relative flex-1 max-w-md">
                   <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                   <input
                     type="text"
                     placeholder="Search branches, codes, or managers..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                   />
                 </div>
                 <select
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                   className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                 >
                   <option value="all">All Status</option>
                   <option value="active">Active</option>
                   <option value="inactive">Inactive</option>
                   <option value="maintenance">Maintenance</option>
                 </select>
               </div>
               <div className="flex gap-2">
                <Button 
                   onClick={() => setShowAddBranch(true)}
                   className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                >
                   <Plus className="h-4 w-4" />
                   New Branch
                </Button>
               </div>
             </div>
           </div>

           {/* Branches List */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>All Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBranches.map((branch) => (
                  <div key={branch.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {branch.code}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{branch.name}</h3>
                        <p className="text-sm text-slate-600">{branch.city}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {branch.address}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {branch.phone}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {branch.employeeCount} employees
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(branch.status)}>
                        {getStatusText(branch.status)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                      </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                      </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-3 w-3" />
                      </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Branch Modal */}
          {showAddBranch && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-semibold text-slate-900">Create New Branch</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddBranch(false)}
                  >
                    ×
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Branch Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                        placeholder="e.g., Dar es Salaam Main"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                          Branch Code *
                        </label>
                        <input
                          type="text"
                          id="code"
                          value={formData.code}
                          onChange={(e) => handleInputChange('code', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          placeholder="e.g., DSM"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          placeholder="e.g., Dar es Salaam"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                        placeholder="e.g., City Center, Plot 123"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          placeholder="+255 22 123 4567"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          placeholder="branch@company.com"
                          required
                        />
                      </div>
                    </div>

                    

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                        rows={4}
                        placeholder="Describe the branch's purpose and operations"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowAddBranch(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Branch
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
