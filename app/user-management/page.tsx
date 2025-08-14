'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

// Mock data types - replace with MySQL types later
interface User {
  id: string
  name: string
  email: string
  role: string
  roleId: string
  department: string
  position: string
  phone: string
  permissions: string[]
  status: string
  createdAt: Date
  updatedAt: Date
}

interface UserRole {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

const SIDEBAR_FEATURES = ['dashboard', 'branches', 'departments', 'sales', 'finance', 'inventory', 'hr', 'crm', 'projects', 'tasks', 'reports', 'events', 'settings']

const PERMISSIONS = [
  'all_access',
  'dashboard_access',
  'branches_access',
  'departments_access',
  'sales_access',
  'sales_create',
  'sales_edit',
  'sales_delete',
  'finance_access',
  'finance_create',
  'finance_edit',
  'finance_delete',
  'inventory_access',
  'inventory_create',
  'inventory_edit',
  'inventory_delete',
  'hr_access',
  'hr_create',
  'hr_edit',
  'hr_delete',
  'crm_access',
  'crm_create',
  'crm_edit',
  'crm_delete',
  'projects_access',
  'projects_create',
  'projects_edit',
  'projects_delete',
  'tasks_access',
  'tasks_create',
  'tasks_edit',
  'tasks_delete',
  'reports_access',
  'reports_create',
  'reports_edit',
  'reports_delete',
  'events_access',
  'events_create',
  'events_edit',
  'events_delete',
  'settings_access',
  'settings_edit',
  'user_management',
  'role_management',
  'system_settings',
  'data_export'
]

const SIDEBAR_FEATURES_LIST = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'branches', name: 'Branches' },
  { id: 'departments', name: 'Departments' },
  { id: 'sales', name: 'Sales' },
  { id: 'finance', name: 'Finance' },
  { id: 'inventory', name: 'Inventory' },
  { id: 'hr', name: 'HR' },
  { id: 'crm', name: 'CRM' },
  { id: 'projects', name: 'Projects' },
  { id: 'tasks', name: 'Tasks' },
  { id: 'reports', name: 'Reports' },
  { id: 'events', name: 'Events' },
  { id: 'settings', name: 'Settings' }
]

function UserManagementPage() {
  const { user } = useAuth()

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@iris.com',
      role: 'Super Admin',
      roleId: '1',
      department: 'IT',
      position: 'System Administrator',
      phone: '+255123456789',
      permissions: ['all_access'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@iris.com',
      role: 'Manager',
      roleId: '2',
      department: 'HR',
      position: 'HR Manager',
      phone: '+255123456790',
      permissions: ['hr_access', 'user_management'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const mockRoles: UserRole[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access',
      permissions: ['all_access'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Department management access',
      permissions: ['hr_access', 'user_management'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  // Mock functions
  const getAllSystemUsers = async (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUsers), 500))
  }

  const getAllUserRoles = async (): Promise<UserRole[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockRoles), 500))
  }

  const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id)
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date() }
        }
        resolve()
      }, 500)
    })
  }

  const deleteUser = async (id: string): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id)
        if (index !== -1) {
          mockUsers.splice(index, 1)
        }
        resolve()
      }, 500)
    })
  }

  const createUserWithAuth = async (userData: any): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        mockUsers.push(newUser)
        resolve()
      }, 500)
    })
  }

  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddRole, setShowAddRole] = useState(false)
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    role: '',
    roleId: '',
    department: '',
    position: '',
    phone: '',
    permissions: [] as string[]
  })

  // Compute unique departments from users
  const departmentOptions = useMemo(() => {
    const depts = users.map(u => u.department).filter(Boolean)
    return Array.from(new Set(depts))
  }, [users])

  // Filter users by search and department
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesName = user.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = selectedDepartment === 'all' || user.department === selectedDepartment
      return matchesName && matchesDept
    })
  }, [users, searchTerm, selectedDepartment])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, rolesData] = await Promise.all([
        getAllSystemUsers(),
        getAllUserRoles()
      ])
      setUsers(usersData)
      setRoles(rolesData)
    } catch (error) {
      setMessage('Error loading data')
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      ...user,
      permissions: user.permissions || [],
      status: user.status || 'active'
    })
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      setLoading(true)
      await deleteUser(userId)
      setMessage('User deleted successfully!')
      setIsSuccess(true)
      loadData()
    } catch (error: any) {
      setMessage(`Error deleting user: ${error.message}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    try {
      setLoading(true)
      await updateUser(editingUser.id, {
        permissions: editForm.permissions,
        status: editForm.status
      })
      setMessage('User updated successfully!')
      setIsSuccess(true)
      setEditingUser(null)
      setEditForm(null)
      loadData()
    } catch (error: any) {
      setMessage(`Error updating user: ${error.message}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (permission: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p: string) => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const toggleFeature = (featureId: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      features: prev.features && prev.features.includes(featureId)
        ? prev.features.filter((f: string) => f !== featureId)
        : [...(prev.features || []), featureId]
    }))
  }

  const handleAddUser = async () => {
    try {
      setLoading(true)
      
      // Validate form
      if (!addUserForm.name || !addUserForm.email || !addUserForm.role) {
        setMessage('Name, email, and role are required')
        setIsSuccess(false)
        return
      }

      // Find the selected role
      const selectedRole = roles.find(r => r.name === addUserForm.role)
      if (!selectedRole) {
        setMessage('Selected role not found')
        setIsSuccess(false)
        return
      }

      // Create user with mock auth and send welcome email
      const result = await createUserWithAuth({
        email: addUserForm.email,
        name: addUserForm.name,
        role: addUserForm.role,
        roleId: selectedRole.id,
        permissions: selectedRole.permissions,
        department: addUserForm.department || undefined,
        position: addUserForm.position || undefined,
        phone: addUserForm.phone || undefined
      })

      setMessage(`User created successfully! Welcome email sent to ${addUserForm.email} with default password: 99009900`)
      setIsSuccess(true)
      setShowAddUser(false)
      setAddUserForm({
        name: '',
        email: '',
        role: '',
        roleId: '',
        department: '',
        position: '',
        phone: '',
        permissions: []
      })
      loadData()
    } catch (error: any) {
      setMessage(`Error creating user: ${error.message}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const toggleAddUserPermission = (permission: string) => {
    setAddUserForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const editRole = (role: UserRole) => {
    // TODO: Implement role editing
    console.log('Edit role:', role)
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return
    try {
      setLoading(true)
      // TODO: Implement role deletion
      console.log('Delete role:', roleId)
      setMessage('Role deleted successfully!')
      setIsSuccess(true)
      loadData()
    } catch (error: any) {
      setMessage(`Error deleting role: ${error.message}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSendFirstPassword = async () => {
    if (!editForm?.email || !editForm?.name) return
    try {
      setLoading(true)
      // Mock implementation - replace with MySQL integration later
      const defaultPassword = '99009900'
      console.log('Creating user with email:', editForm.email, 'and password:', defaultPassword)
      setMessage(`First password sent to ${editForm.email}. Default password is 99009900. User must reset password from email link.`)
      setIsSuccess(true)
    } catch (error: any) {
      setMessage(`Error sending first password: ${error.message}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
              <p className="text-slate-600">Manage users, roles, and access permissions</p>
            </div>
            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                isSuccess 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {isSuccess ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <p>{message}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Users ({filteredUsers.length})
                    </CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-48"
                      />
                      <select
                        value={selectedDepartment}
                        onChange={e => setSelectedDepartment(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="all">All Departments</option>
                        {departmentOptions.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{user.name}</h3>
                            <p className="text-sm text-slate-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                              <Badge variant="outline">{user.role}</Badge>
                              {user.department && (
                                <Badge variant="outline">{user.department}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-center text-slate-500 py-8">No users found.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Roles Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Roles ({roles.length})
                    </CardTitle>
                    <Button onClick={() => setShowAddRole(true)} className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <div key={role.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{role.name}</h3>
                            <p className="text-sm text-slate-600">{role.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={role.status === 'active' ? 'default' : 'secondary'}>
                                {role.status}
                              </Badge>
                              <Badge variant="outline">Level {role.level}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Edit User Modal */}
            {editingUser && editForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-lg">
                  <CardHeader>
                    <CardTitle>Edit User</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input value={editForm.email} disabled />
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input value={editForm.name} disabled />
                    </div>
                    <div>
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {PERMISSIONS.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={editForm.permissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <Label htmlFor={permission} className="text-sm">
                              {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Sidebar Features</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {SIDEBAR_FEATURES_LIST.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={feature.id}
                              checked={editForm.features && editForm.features.includes(feature.id)}
                              onCheckedChange={() => toggleFeature(feature.id)}
                            />
                            <Label htmlFor={feature.id} className="text-sm">
                              {feature.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={editForm.status} onValueChange={(value: any) => setEditForm((prev: any) => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSendFirstPassword} variant="secondary" className="w-full mb-2" disabled={loading}>
                      {loading ? 'Sending...' : 'Send First Password to User'}
                    </Button>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} className="flex-1" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline" onClick={() => { setEditingUser(null); setEditForm(null) }}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserManagementPage 