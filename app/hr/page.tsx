"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Download,
  Copy,
  ExternalLink,
  UserPlus,
  MessageSquare,
  Star,
  TrendingUp,
  DollarSign,
  Briefcase,
  UserCheck,
  UserX,
  FileText,
  Award,
  Target,
  Activity,
  User,
  Save,
  X,
  Building,
  Shield,
  RefreshCw
} from "lucide-react"
import { 
  getAllEmployees, 
  addEmployee, 
  updateEmployee, 
  deleteEmployee, 
  updateEmployeeStatus,
  updateEmployeePerformance,
  updateEmployeeAttendance,
  getEmployeeStats,
  searchEmployees,
  getAllDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getAllRoles,
  addRole,
  updateRole,
  deleteRole,
  seedEmployeeSampleData,
  Employee,
  EmployeeStats,
  Department,
  Role,

} from "@/lib/firebase-service"
import { Badge } from "@/components/ui/badge"
import { emailService } from '@/lib/email-service'
import { smsService } from '@/lib/sms-service'

export default function HRPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dataLoading, setDataLoading] = useState(true)
  const [stats, setStats] = useState<EmployeeStats>({
    total: 0,
    active: 0,
    inactive: 0,
    onLeave: 0,
    terminated: 0,
    averagePerformance: 0,
    averageAttendance: 0,
    totalSalary: 0
  })

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDepartmentModal, setShowDepartmentModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    role: '',
    status: 'active' as 'active' | 'inactive' | 'on-leave' | 'terminated',
    joinDate: '',
    salary: '',
    performance: '',
    attendance: '',
    manager: '',
    location: '',
    emergencyContact: ''
  })

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    description: '',
    manager: '',
    location: '',
    budget: '',
    status: 'active' as 'active' | 'inactive' | 'restructuring'
  })

  const [roleForm, setRoleForm] = useState({
    name: '',
    code: '',
    description: '',
    level: '',
    permissions: [] as string[],
    status: 'active' as 'active' | 'inactive'
  })

  // Modal states
  const [showApprovals, setShowApprovals] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadEmployees()
      loadStats()
      loadDepartments()
      loadRoles()

    }
  }, [user])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm, selectedDepartment, selectedStatus])

  const loadEmployees = async () => {
    try {
      setDataLoading(true)
      const employeesData = await getAllEmployees()
      setEmployees(employeesData)
    } catch (err) {
      console.error('Error loading employees:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await getEmployeeStats()
      setStats(statsData)
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const loadDepartments = async () => {
    try {
      const departmentsData = await getAllDepartments()
      setDepartments(departmentsData)
    } catch (err) {
      console.error('Error loading departments:', err)
    }
  }

  const loadRoles = async () => {
    try {
      const rolesData = await getAllRoles()
      setRoles(rolesData)
    } catch (err) {
      console.error('Error loading roles:', err)
    }
  }



  const filterEmployees = () => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(employee => employee.department === selectedDepartment)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(employee => employee.status === selectedStatus)
    }

    setFilteredEmployees(filtered)
  }

  const handleAddEmployee = async () => {
    try {
      console.log('Form data:', formData)
      console.log('Available departments:', departments)
      console.log('Available roles:', roles)
      
      // Check if departments and roles are available
      if (departments.length === 0) {
        alert('No departments available. Please add a department first.')
        return
      }
      if (roles.length === 0) {
        alert('No positions available. Please add a position first.')
        return
      }
      
      // Validate required fields
      if (!formData.name.trim()) {
        alert('Employee name is required')
        return
      }
      if (!formData.email.trim()) {
        alert('Email is required')
        return
      }
      if (!formData.phone.trim()) {
        alert('Phone number is required')
        return
      }
      if (!formData.position.trim()) {
        alert('Position is required')
        return
      }
      if (!formData.department) {
        alert('Department is required')
        return
      }
      if (!formData.role) {
        alert('Job position is required')
        return
      }
      if (!formData.joinDate) {
        alert('Join date is required')
        return
      }
      if (!formData.salary || isNaN(Number(formData.salary))) {
        alert('Valid salary is required')
        return
      }
      if (!formData.performance || isNaN(Number(formData.performance))) {
        alert('Valid performance percentage is required')
        return
      }
      if (!formData.attendance || isNaN(Number(formData.attendance))) {
        alert('Valid attendance percentage is required')
        return
      }
      if (!formData.location.trim()) {
        alert('Location is required')
        return
      }

      const employeeData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        department: formData.department,
        role: formData.role,
        status: formData.status,
        joinDate: formData.joinDate,
        salary: Number(formData.salary),
        performance: Number(formData.performance),
        attendance: Number(formData.attendance),
        manager: formData.manager.trim() || undefined,
        location: formData.location.trim(),
        emergencyContact: formData.emergencyContact.trim() || undefined,
        lastActive: new Date().toISOString().split('T')[0]
      }

      console.log('Adding employee with data:', employeeData)
      await addEmployee(employeeData)
      setShowAddModal(false)
      resetForm()
      loadEmployees()
      loadStats()
    } catch (error) {
      console.error('Error adding employee:', error)
      alert(`Failed to add employee: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleAddDepartment = async () => {
    try {
      const departmentData = {
        name: departmentForm.name,
        code: departmentForm.code,
        description: departmentForm.description,
        manager: departmentForm.manager,
        location: departmentForm.location,
        budget: Number(departmentForm.budget),
        employeeCount: 0,
        status: departmentForm.status
      }

      await addDepartment(departmentData)
      setShowDepartmentModal(false)
      setDepartmentForm({
        name: '',
        code: '',
        description: '',
        manager: '',
        location: '',
        budget: '',
        status: 'active'
      })
      loadDepartments()
    } catch (error) {
      console.error('Error adding department:', error)
      alert('Failed to add department')
    }
  }

  const handleAddRole = async () => {
    try {
      // Validate required fields
      if (!roleForm.name.trim()) {
        alert('Position name is required')
        return
      }
      if (!roleForm.code.trim()) {
        alert('Position code is required')
        return
      }
      if (!roleForm.level || isNaN(Number(roleForm.level))) {
        alert('Valid position level is required')
        return
      }

      const roleData = {
        name: roleForm.name.trim(),
        code: roleForm.code.trim(),
        description: roleForm.description.trim(),
        level: Number(roleForm.level),
        permissions: roleForm.permissions,
        status: roleForm.status
      }

      console.log('Adding position with data:', roleData)
      await addRole(roleData)
      setShowRoleModal(false)
      setRoleForm({
        name: '',
        code: '',
        description: '',
        level: '',
        permissions: [],
        status: 'active'
      })
      loadRoles()
    } catch (error) {
      console.error('Error adding position:', error)
      alert(`Failed to add position: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteDepartment = async (departmentId: string, departmentName: string) => {
    if (confirm(`Are you sure you want to delete the department "${departmentName}"? This action cannot be undone.`)) {
      try {
        await deleteDepartment(departmentId)
        loadDepartments()
      } catch (error) {
        console.error('Error deleting department:', error)
        alert('Failed to delete department')
      }
    }
  }

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (confirm(`Are you sure you want to delete the position "${roleName}"? This action cannot be undone.`)) {
      try {
        await deleteRole(roleId)
        loadRoles()
      } catch (error) {
        console.error('Error deleting position:', error)
        alert('Failed to delete position')
      }
    }
  }

  const handleEditEmployee = async () => {
    if (!editingEmployee) return

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        status: formData.status,
        joinDate: formData.joinDate,
        salary: Number(formData.salary),
        performance: Number(formData.performance),
        attendance: Number(formData.attendance),
        manager: formData.manager || undefined,
        location: formData.location,
        emergencyContact: formData.emergencyContact || undefined
      }

      await updateEmployee(editingEmployee.id, updateData)
      setShowEditModal(false)
      setEditingEmployee(null)
      resetForm()
      loadEmployees()
      loadStats()
    } catch (error) {
      console.error('Error updating employee:', error)
      alert('Failed to update employee')
    }
  }

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return

    try {
      await deleteEmployee(selectedEmployee.id)
      setShowDeleteModal(false)
      setSelectedEmployee(null)
      loadEmployees()
      loadStats()
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Failed to delete employee')
    }
  }

  const handleStatusChange = async (employeeId: string, newStatus: 'active' | 'inactive' | 'on-leave' | 'terminated') => {
    try {
      await updateEmployeeStatus(employeeId, newStatus)
      loadEmployees()
      loadStats()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const handlePerformanceUpdate = async (employeeId: string, performance: number) => {
    try {
      await updateEmployeePerformance(employeeId, performance)
      loadEmployees()
      loadStats()
    } catch (error) {
      console.error('Error updating performance:', error)
      alert('Failed to update performance')
    }
  }

  const handleAttendanceUpdate = async (employeeId: string, attendance: number) => {
    try {
      await updateEmployeeAttendance(employeeId, attendance)
      loadEmployees()
      loadStats()
    } catch (error) {
      console.error('Error updating attendance:', error)
      alert('Failed to update attendance')
    }
  }

  const handleSeedSampleData = async () => {
    try {
      await seedEmployeeSampleData()
      await loadEmployees()
      await loadStats()
      alert('Sample employee data added successfully!')
    } catch (error) {
      console.error('Error seeding sample data:', error)
      alert('Error adding sample data. Please try again.')
    }
  }

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      role: employee.role,
      status: employee.status,
      joinDate: employee.joinDate,
      salary: employee.salary.toString(),
      performance: employee.performance.toString(),
      attendance: employee.attendance.toString(),
      manager: employee.manager || '',
      location: employee.location,
      emergencyContact: employee.emergencyContact || ''
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDeleteModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      role: '',
      status: 'active',
      joinDate: '',
      salary: '',
      performance: '',
      attendance: '',
      manager: '',
      location: '',
      emergencyContact: ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200'
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'on-leave': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'terminated': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600'
    if (attendance >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Email functionality
  const handleSendEmail = async (employee: Employee, message: string) => {
    try {
      const senderName = user?.displayName || user?.email || 'Areno Logistics Admin'
      const senderEmail = user?.email || 'admin@arenologistics.com'
      
      const result = await emailService.sendTeamMessageEmail(
        senderName,
        senderEmail,
        employee.email,
        employee.name,
        message,
        'HR Department'
      )
      
      if (result.success) {
        alert('Email sent successfully!')
      } else {
        alert('Failed to send email: ' + result.error)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email. Please try again.')
    }
  }

  // Combined SMS and Email functionality
  const handleSendMessage = async (employee: Employee, message: string) => {
    try {
      const results = []
      let hasPhone = false
      let hasEmail = false

      // Send SMS if phone number is available
      if (employee.phone) {
        hasPhone = true
        const smsResult = await smsService.sendSingleSMS(
          employee.phone,
          message
        )
        results.push({ type: 'SMS', success: smsResult.success, error: smsResult.error })
      }

      // Send Email if email is available
      if (employee.email) {
        hasEmail = true
        const senderName = user?.displayName || user?.email || 'Areno Logistics Admin'
        const senderEmail = user?.email || 'admin@arenologistics.com'
        
        const emailResult = await emailService.sendTeamMessageEmail(
          senderName,
          senderEmail,
          employee.email,
          employee.name,
          message,
          'HR Department'
        )
        results.push({ type: 'Email', success: emailResult.success, error: emailResult.error })
      }

      // Check results and show appropriate message
      const successfulResults = results.filter(r => r.success)
      const failedResults = results.filter(r => !r.success)

      if (successfulResults.length > 0 && failedResults.length === 0) {
        const sentMethods = successfulResults.map(r => r.type).join(' and ')
        alert(`Message sent successfully via ${sentMethods}!`)
      } else if (successfulResults.length > 0 && failedResults.length > 0) {
        const sentMethods = successfulResults.map(r => r.type).join(' and ')
        const failedMethods = failedResults.map(r => r.type).join(' and ')
        alert(`Message sent via ${sentMethods} but failed via ${failedMethods}. Please check the failed methods.`)
      } else {
        const failedMethods = failedResults.map(r => r.type).join(' and ')
        alert(`Failed to send message via ${failedMethods}. Please try again.`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    }
  }

  const handleMessageEmployee = (employee: Employee) => {
    const message = prompt(`Send message to ${employee.name} (${employee.email}):`)
    if (message && message.trim()) {
      handleSendMessage(employee, message.trim())
    }
  }

  // Show loading while checking authentication
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

  // Show loading while not authenticated (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  const employeeDepartments = Array.from(new Set(employees.map(emp => emp.department)))

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
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Human Resources</h1>
                  <p className="text-slate-600">Manage employees, departments, and roles</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push('/hr/reports')}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <FileText className="h-4 w-4" />
                    Reports
                  </Button>
                  <Button
                    onClick={() => router.push('/hr/approvals')}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approvals
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Employees</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Employees</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Departments</p>
                    <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Positions</p>
                    <p className="text-2xl font-bold text-orange-600">{roles.length}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>



            {/* Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Departments Management */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Departments</h2>
                  <Button
                    onClick={() => setShowDepartmentModal(true)}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Department
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900">{dept.name}</h3>
                        <p className="text-sm text-slate-500">{dept.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dept.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                        }`}>
                          {dept.status}
                        </span>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positions Management */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Positions</h2>
                  <Button
                    onClick={() => setShowRoleModal(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Position
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900">{role.name}</h3>
                        <p className="text-sm text-slate-500">Level {role.level}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          role.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                        }`}>
                          {role.status}
                        </span>
                        <button
                          onClick={() => handleDeleteRole(role.id, role.name)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Employee
                  </Button>
                  <Button 
                    onClick={handleSeedSampleData}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Add Sample Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Employees ({filteredEmployees.length})</h2>
              </div>
              
              {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading employees...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-slate-100 p-2 rounded-full mr-3">
                                <User className="h-4 w-4 text-slate-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                                <div className="text-sm text-slate-500">{employee.email}</div>
                                <div className="text-xs text-slate-400">{employee.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{employee.position}</div>
                            {employee.manager && (
                              <div className="text-xs text-slate-500">Reports to: {employee.manager}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{employee.department}</div>
                            <div className="text-xs text-slate-500">{employee.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={employee.status}
                              onChange={(e) => handleStatusChange(employee.id, e.target.value as any)}
                              className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(employee.status)}`}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="on-leave">On Leave</option>
                              <option value="terminated">Terminated</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={employee.performance}
                                onChange={(e) => handlePerformanceUpdate(employee.id, Number(e.target.value))}
                                className={`text-sm font-medium w-16 border-0 bg-transparent ${getPerformanceColor(employee.performance)}`}
                                min="0"
                                max="100"
                              />
                              <span className="text-sm">%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={employee.attendance}
                                onChange={(e) => handleAttendanceUpdate(employee.id, Number(e.target.value))}
                                className={`text-sm font-medium w-16 border-0 bg-transparent ${getAttendanceColor(employee.attendance)}`}
                                min="0"
                                max="100"
                              />
                              <span className="text-sm">%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              TZS {employee.salary.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              Joined: {new Date(employee.joinDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => openEditModal(employee)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => openDeleteModal(employee)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleMessageEmployee(employee)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!dataLoading && filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No employees found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter criteria, or add a new employee.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-slate-900">Add New Employee</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roles</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Position</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary (TZS)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Performance (%)</label>
                  <input
                    type="number"
                    value={formData.performance}
                    onChange={(e) => setFormData({...formData, performance: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Attendance (%)</label>
                  <input
                    type="number"
                    value={formData.attendance}
                    onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reports To</label>
                  <select
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Manager</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>
                <Save className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-slate-900">Edit Employee</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingEmployee(null)
                  resetForm()
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Position</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary (TZS)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Performance (%)</label>
                  <input
                    type="number"
                    value={formData.performance}
                    onChange={(e) => setFormData({...formData, performance: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Attendance (%)</label>
                  <input
                    type="number"
                    value={formData.attendance}
                    onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reports To</label>
                  <select
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Manager</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingEmployee(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditEmployee}>
                <Save className="h-4 w-4 mr-2" />
                Update Employee
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Employee</h3>
                  <p className="text-slate-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete <strong>{selectedEmployee.name}</strong>? 
                This will permanently remove their record from the system.
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedEmployee(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteEmployee}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Employee
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Department</h2>
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddDepartment(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={departmentForm.name}
                  onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter department name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  required
                  value={departmentForm.code}
                  onChange={(e) => setDepartmentForm({...departmentForm, code: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., HR, IT, OPS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={departmentForm.description}
                  onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter department description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Manager
                </label>
                <input
                  type="text"
                  value={departmentForm.manager}
                  onChange={(e) => setDepartmentForm({...departmentForm, manager: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter manager name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={departmentForm.location}
                  onChange={(e) => setDepartmentForm({...departmentForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Budget (TZS)
                </label>
                <input
                  type="number"
                  value={departmentForm.budget}
                  onChange={(e) => setDepartmentForm({...departmentForm, budget: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter budget amount"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDepartmentModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Add Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Position Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Position</h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddRole(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Position Name *
                </label>
                <input
                  type="text"
                  required
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Manager, Officer, Director"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Position Code *
                </label>
                <input
                  type="text"
                  required
                  value={roleForm.code}
                  onChange={(e) => setRoleForm({...roleForm, code: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., MGR, OFF, DIR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter position description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Level (1-10) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={roleForm.level}
                  onChange={(e) => setRoleForm({...roleForm, level: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="1 = lowest, 10 = highest"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Add Position
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 