"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { departmentsAPI } from "@/lib/api-service"
import { 
  Building, 
  Users, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  DollarSign,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Shield,
  Truck,
  FileText,
  Settings,
  Phone,
  Mail
} from "lucide-react"
// Mock data types - replace with MySQL types later






interface NewDepartmentForm {
  name: string
  code: string
  description: string
  budget: number
  status: 'active' | 'inactive' | 'restructuring'
  location?: string
  manager_id?: string
  established_date?: string
}

export default function DepartmentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Mock data
  const mockDepartments: Department[] = [
    {
      id: '1',
      name: 'Engineering',
      branchId: '1',
      branchName: 'Dar es Salaam Main Branch',
      code: 'ENG',
      location: 'Floor 3, Building A',
      description: 'Software development and technical operations',
      manager: 'John Doe',
      budget: 500000,
      employeeCount: 25,
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Sales',
      branchId: '1',
      branchName: 'Dar es Salaam Main Branch',
      code: 'SALES',
      location: 'Floor 2, Building A',
      description: 'Sales and customer relations',
      manager: 'Jane Smith',
      budget: 300000,
      employeeCount: 15,
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'HR',
      branchId: '1',
      branchName: 'Dar es Salaam Main Branch',
      code: 'HR',
      location: 'Floor 1, Building A',
      description: 'Human resources and employee management',
      manager: 'Mike Johnson',
      budget: 200000,
      employeeCount: 8,
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]

  // Mock functions
  const getAllDepartments = async (): Promise<Department[]> => {
    try {
      const response = await departmentsAPI.getAll(searchTerm, selectedStatus)
      return response.data || response
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      return []
    }
  }

  const getDepartmentStats = async (): Promise<DepartmentStats> => {
    try {
      const response = await departmentsAPI.getStats()
      return response.data || response
    } catch (error) {
      console.error('Failed to fetch department stats:', error)
      return {
        totalDepartments: 0,
        activeDepartments: 0,
        totalEmployees: 0,
        averageBudget: 0,
        departmentsByStatus: {
          active: 0,
          inactive: 0,
          restructuring: 0
        }
      }
    }
  }

  const addDepartment = async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const response = await departmentsAPI.create(department)
      return response.data?.id || response.id || 'success'
    } catch (error) {
      console.error('Failed to create department:', error)
      throw error
    }
  }

  const updateDepartment = async (id: string, updates: Partial<Department>): Promise<void> => {
    try {
      await departmentsAPI.update(id, updates)
    } catch (error) {
      console.error('Failed to update department:', error)
      throw error
    }
  }

  const deleteDepartment = async (id: string): Promise<void> => {
    try {
      await departmentsAPI.delete(id)
    } catch (error) {
      console.error('Failed to delete department:', error)
      throw error
    }
  }







  const [departments, setDepartments] = useState<Department[]>([])
  const [stats, setStats] = useState<DepartmentStats | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)

  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<NewDepartmentForm>({
    name: '',
    code: '',
    description: '',
    budget: 0,
    status: 'active',
    location: '',
    manager_id: '',
    established_date: ''
  })





  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      loadDepartmentsData()
    }
  }, [user])

  const loadDepartmentsData = async () => {
    try {
      setDataLoading(true)
      
      // Load departments and stats from mock data
      const [departmentsData, statsData] = await Promise.all([
        getAllDepartments(),
        getDepartmentStats()
      ])
      
      setDepartments(departmentsData)
      setStats(statsData)
    } catch (err) {
      console.error('Error loading departments data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const handleInputChange = (field: keyof NewDepartmentForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.code || !formData.description || 
        !formData.budget) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setFormLoading(true)
      
      // Create the department data object
      const departmentData: any = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        budget: formData.budget,
        status: formData.status,
        location: formData.location || undefined,
        manager_id: formData.manager_id || undefined,
        established_date: formData.established_date || undefined
      }

      console.log('Creating department with data:', departmentData)
      
      const departmentId = await addDepartment(departmentData)
      console.log('Department created successfully with ID:', departmentId)
      
      // Reset form and close modal
      setFormData({
        name: '',
        code: '',
        description: '',
        budget: 0,
        status: 'active',
        location: '',
        manager_id: '',
        established_date: ''
      })
      setShowAddDepartment(false)
      
      // Reload departments data
      await loadDepartmentsData()
      
      alert('Department created successfully!')
    } catch (error) {
      console.error('Error creating department:', error)
      
      // Show more specific error message
      if (error instanceof Error) {
        alert(`Error creating department: ${error.message}`)
      } else {
        alert('Error creating department. Please check the console for details.')
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return
    }

    try {
      await deleteDepartment(departmentId)
      await loadDepartmentsData()
      alert('Department deleted successfully!')
    } catch (error) {
      console.error('Error deleting department:', error)
      alert('Error deleting department. Please try again.')
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

  // Helper to format timestamps
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '-'
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString()
    }
    return timestamp
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200'
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'restructuring': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <AlertCircle className="h-4 w-4" />
      case 'restructuring': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getDepartmentIcon = (code: string) => {
    switch (code.toLowerCase()) {
      case 'ops': return <Truck className="h-4 w-4" />
      case 'sales': return <Target className="h-4 w-4" />
      case 'fin': return <DollarSign className="h-4 w-4" />
      case 'hr': return <Users className="h-4 w-4" />
      case 'it': return <Settings className="h-4 w-4" />
      case 'cs': return <Phone className="h-4 w-4" />
      case 'fleet': return <Truck className="h-4 w-4" />
      case 'qa': return <Shield className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
    }
  }

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.location && department.location.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || department.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 mt-16">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Department Management</h1>
              <p className="text-slate-600">Manage organizational departments, budgets, and employee assignments</p>
            </div>

            {/* Department Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Departments</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalDepartments}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{stats.activeDepartments} active</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Employees</p>
                      <p className="text-2xl font-bold text-green-600">{formatNumber(stats.totalEmployees)}</p>
                      <div className="flex items-center mt-2">
                        <Activity className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">Avg: {Math.round(stats.totalEmployees / stats.totalDepartments)}/dept</span>
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Budget</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.averageBudget * stats.totalDepartments)}</p>
                      <div className="flex items-center mt-2">
                        <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-sm text-blue-600">Annual allocation</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Restructuring</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.departmentsByStatus.restructuring || 0}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-yellow-600">In transition</span>
                      </div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search departments, codes, or managers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="restructuring">Restructuring</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAddDepartment(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    New Department
                  </Button>
                </div>
              </div>
            </div>

            {/* Departments Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading departments...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredDepartments.map((department) => (
                        <tr key={department.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  {getDepartmentIcon(department.code)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{department.name}</div>
                                <div className="text-sm text-slate-500">{department.code}</div>
                                <div className="text-xs text-slate-400">{department.location}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-900">{formatCurrency(department.budget)}</div>
                            <div className="text-sm text-slate-500">annual budget</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(department.status)}`}>
                              {getStatusIcon(department.status)}
                              <span className="ml-1 capitalize">{department.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => {
                                  setSelectedDepartment(department)
                                }}
                                className="text-slate-400 hover:text-slate-600"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-blue-400 hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDepartment(department.id)}
                                className="text-red-400 hover:text-red-600"
                                title="Delete department"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredDepartments.length === 0 && !dataLoading && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No departments found</h3>
                  <p className="text-slate-500">No departments match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Department Details Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedDepartment.name}</h2>
                  <p className="text-slate-600 mt-1">Department Code: {selectedDepartment.code}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDepartment(null)
                    setDepartmentEmployees([])
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Name:</span> {selectedDepartment.name}</div>
                    <div><span className="font-medium">Code:</span> {selectedDepartment.code}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedDepartment.status)}`}>
                        {getStatusIcon(selectedDepartment.status)}
                        <span className="ml-1 capitalize">{selectedDepartment.status}</span>
                      </span>
                    </div>
                    <div><span className="font-medium">Location:</span> {selectedDepartment.location}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Management & Budget</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Annual Budget:</span> {formatCurrency(selectedDepartment.budget)}</div>
                    <div><span className="font-medium">Created:</span> {formatTimestamp(selectedDepartment.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Description</h3>
                <p className="text-slate-700">{selectedDepartment.description}</p>
              </div>


            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDepartment(null)
                    setDepartmentEmployees([])
                  }}
                >
                  Close
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Department
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Department</h2>
                  <p className="text-slate-600 mt-1">Add a new department to the organization</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddDepartment(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="e.g., Operations"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="manager" className="block text-sm font-medium text-slate-700 mb-2">
                    Manager (Optional)
                  </label>
                  <input
                    type="text"
                    id="manager"
                    value={formData.manager_id}
                    onChange={(e) => handleInputChange('manager_id', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="Enter manager ID or leave empty"
                  />
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                    Department Code *
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="e.g., OPS"
                    maxLength={5}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="e.g., Dar es Salaam"
                  />
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
                    placeholder="Describe the department's responsibilities and functions"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDepartment(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 