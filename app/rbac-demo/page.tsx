"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Users, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"

export default function RBACDemoPage() {
  const { user, hasPermission, canAccessFeature, isSuperAdmin, isHR, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600">Please log in to view this page.</p>
        </div>
      </div>
    )
  }

  const demoUsers = [
    {
      id: '1',
      name: 'Super Admin',
      role: 'Super Admin',
      permissions: ['all_access'],
      sidebarFeatures: ['dashboard', 'branches', 'departments', 'sales', 'finance', 'inventory', 'hr', 'crm', 'projects', 'tasks', 'reports', 'events', 'settings'],
      description: 'Full system access and control'
    },
    {
      id: '2',
      name: 'Department Manager',
      role: 'Department Manager',
      permissions: ['dashboard_access', 'reports_access', 'department_access'],
      sidebarFeatures: ['dashboard', 'reports', 'settings'],
      description: 'Department management and reporting'
    },
    {
      id: '3',
      name: 'Finance Manager',
      role: 'Finance Manager',
      permissions: ['finance_access', 'finance_create', 'finance_edit', 'dashboard_access', 'reports_access'],
      sidebarFeatures: ['dashboard', 'finance', 'reports'],
      description: 'Financial operations and reporting'
    },
    {
      id: '4',
      name: 'Sales Representative',
      role: 'Sales Representative',
      permissions: ['sales_access', 'sales_create', 'sales_edit', 'dashboard_access'],
      sidebarFeatures: ['dashboard', 'sales', 'crm'],
      description: 'Sales operations and customer management'
    },
    {
      id: '5',
      name: 'Viewer',
      role: 'Viewer',
      permissions: ['dashboard_access'],
      sidebarFeatures: ['dashboard'],
      description: 'Read-only access to basic information'
    }
  ]

  const currentUserDemo = demoUsers.find(u => u.role === user.role) || demoUsers[0]

  const checkPermission = (permission: string) => {
    return hasPermission(permission)
  }

  const checkFeatureAccess = (feature: string) => {
    return canAccessFeature(feature)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Role-Based Access Control Demo</h1>
              <p className="text-slate-600">See how the RBAC system controls sidebar visibility and permissions</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="current-user">Current User</TabsTrigger>
                <TabsTrigger value="role-comparison">Role Comparison</TabsTrigger>
                <TabsTrigger value="testing">Test Access</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        How RBAC Works
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Super Admin assigns roles to users</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">HR controls sidebar component visibility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">HR manages user permissions (read, write, create)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Sidebar only shows allowed features</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Role Hierarchy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="font-medium">Super Admin</span>
                          <Badge className="bg-red-100 text-red-800">Full Access</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="font-medium">HR Manager</span>
                          <Badge className="bg-blue-100 text-blue-800">User Access Control</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="font-medium">Department Managers</span>
                          <Badge className="bg-green-100 text-green-800">Department Access</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">Regular Users</span>
                          <Badge className="bg-gray-100 text-gray-800">Limited Access</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="current-user" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      Your Current Access Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">User Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Name:</span>
                            <span className="font-medium">{user.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Role:</span>
                            <span className="font-medium">{user.role}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Department:</span>
                            <span className="font-medium">{user.department || 'Not assigned'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">Role Capabilities</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {isSuperAdmin() ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                            <span className="text-sm">Super Admin Access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isHR() ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                            <span className="text-sm">HR Management</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isAdmin() ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                            <span className="text-sm">Admin Access</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Your Sidebar Features</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {['dashboard', 'branches', 'departments', 'sales', 'finance', 'inventory', 'hr', 'crm', 'projects', 'tasks', 'reports', 'events', 'settings'].map(feature => (
                          <div key={feature} className="flex items-center gap-2 p-2 border rounded">
                            {canAccessFeature(feature) ? (
                              <Eye className="h-4 w-4 text-green-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm capitalize">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="role-comparison" className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {demoUsers.map((demoUser) => (
                    <Card key={demoUser.id} className="bg-white shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{demoUser.name}</CardTitle>
                            <p className="text-sm text-slate-600">{demoUser.description}</p>
                          </div>
                          <Badge variant="outline">{demoUser.role}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Permissions ({demoUser.permissions.length})</h4>
                            <div className="space-y-1">
                              {demoUser.permissions.slice(0, 5).map(permission => (
                                <div key={permission} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                  {permission}
                                </div>
                              ))}
                              {demoUser.permissions.length > 5 && (
                                <div className="text-xs text-slate-500">+{demoUser.permissions.length - 5} more</div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-slate-900 mb-2">Sidebar Features ({demoUser.sidebarFeatures.length})</h4>
                            <div className="space-y-1">
                              {demoUser.sidebarFeatures.slice(0, 5).map(feature => (
                                <div key={feature} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                  {feature}
                                </div>
                              ))}
                              {demoUser.sidebarFeatures.length > 5 && (
                                <div className="text-xs text-slate-500">+{demoUser.sidebarFeatures.length - 5} more</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="testing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-orange-600" />
                      Test Your Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Permission Tests</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {['dashboard_access', 'sales_access', 'finance_access', 'hr_access', 'projects_access', 'settings_access'].map(permission => (
                          <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm font-medium">{permission}</span>
                            <div className="flex items-center gap-2">
                              {checkPermission(permission) ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <Badge variant={checkPermission(permission) ? "default" : "secondary"}>
                                {checkPermission(permission) ? "Allowed" : "Denied"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Feature Access Tests</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {['dashboard', 'sales', 'finance', 'hr', 'projects', 'settings'].map(feature => (
                          <div key={feature} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm font-medium capitalize">{feature}</span>
                            <div className="flex items-center gap-2">
                              {checkFeatureAccess(feature) ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-red-600" />
                              )}
                              <Badge variant={checkFeatureAccess(feature) ? "default" : "secondary"}>
                                {checkFeatureAccess(feature) ? "Visible" : "Hidden"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900">How to Test</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Try navigating to different sections using the sidebar. You'll only see the features that HR has allowed for your role. 
                        If you need access to additional features, contact your HR manager.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
