"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Shield, 
  Eye, 
  Settings, 
  Search, 
  Edit, 
  Save,
  X,
  CheckCircle,
  XCircle,
  ArrowLeft,
  BarChart3
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive'
  permissions: string[]
  sidebarFeatures: string[]
}

const SIDEBAR_FEATURES = [
  { id: 'dashboard', name: 'Dashboard', category: 'Core' },
  { id: 'branches', name: 'Branches', category: 'Organization' },
  { id: 'departments', name: 'Departments', category: 'Organization' },
  { id: 'sales', name: 'Sales', category: 'Business' },
  { id: 'finance', name: 'Finance', category: 'Business' },
  { id: 'hr', name: 'HR', category: 'Administration' },
  { id: 'projects', name: 'Projects', category: 'Business' },
  { id: 'tasks', name: 'Tasks', category: 'Business' },
  { id: 'reports', name: 'Reports', category: 'Business' },
]

const PERMISSIONS = [
  { id: 'dashboard_access', name: 'Dashboard Access', category: 'Core' },
  { id: 'sales_access', name: 'Sales Access', category: 'Business' },
  { id: 'sales_create', name: 'Sales Create', category: 'Business' },
  { id: 'sales_edit', name: 'Sales Edit', category: 'Business' },
  { id: 'finance_access', name: 'Finance Access', category: 'Business' },
  { id: 'hr_access', name: 'HR Access', category: 'Administration' },
  { id: 'projects_access', name: 'Projects Access', category: 'Business' },
]

export default function UserAccessManagementPage() {
  const router = useRouter()
  const { isHR, isSuperAdmin } = useAuth()
  
  if (!isHR() && !isSuperAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@iris.com',
      role: 'Manager',
      department: 'Engineering',
      status: 'active',
      permissions: ['dashboard_access', 'projects_access'],
      sidebarFeatures: ['dashboard', 'projects', 'tasks']
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@iris.com',
      role: 'HR Specialist',
      department: 'HR',
      status: 'active',
      permissions: ['dashboard_access', 'hr_access'],
      sidebarFeatures: ['dashboard', 'hr', 'reports']
    }
  ]

  useEffect(() => {
    setUsers(mockUsers)
  }, [])

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      ...user,
      permissions: [...user.permissions],
      sidebarFeatures: [...user.sidebarFeatures]
    })
  }

  const togglePermission = (permission: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p: string) => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const toggleSidebarFeature = (featureId: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      sidebarFeatures: prev.sidebarFeatures.includes(featureId)
        ? prev.sidebarFeatures.filter((f: string) => f !== featureId)
        : [...prev.sidebarFeatures, featureId]
    }))
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    
    try {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...editForm }
            : u
        )
      )
      
      setMessage('User access updated successfully!')
      setIsSuccess(true)
      setEditingUser(null)
      setEditForm(null)
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage(`Error updating user: ${error.message}`)
      setIsSuccess(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/hr')}
                  className="text-slate-600 hover:text-slate-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to HR
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">User Access Management</h1>
                  <p className="text-slate-600">Control sidebar visibility and user permissions</p>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                isSuccess 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {isSuccess ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <p>{message}</p>
                </div>
              </div>
            )}

            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="features">Sidebar Features</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {users.map((user) => (
                    <Card key={user.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{user.email}</p>
                          </div>
                          <Badge className={user.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {user.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge variant="outline">{user.department}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Permissions</p>
                            <p className="font-medium">{user.permissions.length}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Sidebar Features</p>
                            <p className="font-medium">{user.sidebarFeatures.length}</p>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Manage Access
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Sidebar Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SIDEBAR_FEATURES.map((feature) => (
                      <div key={feature.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{feature.name}</h3>
                        <Badge variant="outline" className="mt-2">{feature.category}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">System Permissions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PERMISSIONS.map((permission) => (
                      <div key={permission.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{permission.name}</h3>
                        <Badge variant="outline" className="mt-2">{permission.category}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Edit User Access Modal */}
      {editingUser && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Manage Access - {editingUser.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditingUser(null); setEditForm(null) }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Name</Label>
                  <p className="text-slate-900">{editingUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Email</Label>
                  <p className="text-slate-900">{editingUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Role</Label>
                  <p className="text-slate-900">{editingUser.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Department</Label>
                  <p className="text-slate-900">{editingUser.department}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Sidebar Features Access</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SIDEBAR_FEATURES.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-feature-${feature.id}`}
                        checked={editForm.sidebarFeatures.includes(feature.id)}
                        onCheckedChange={() => toggleSidebarFeature(feature.id)}
                      />
                      <Label htmlFor={`edit-feature-${feature.id}`} className="text-sm">
                        {feature.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Permissions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PERMISSIONS.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-permission-${permission.id}`}
                        checked={editForm.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <Label htmlFor={`edit-permission-${permission.id}`} className="text-sm">
                        {permission.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setEditingUser(null); setEditForm(null) }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
