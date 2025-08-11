'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Search, 
  Plus,
  Calendar,
  User,
  Building2,
  DollarSign,
  Truck,
  FileText,
  ArrowRight,
  History,
  Settings
} from 'lucide-react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function HRReportsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const pendingApprovals = [
    {
      id: '1',
      type: 'purchase',
      title: 'Office Supplies Purchase Request',
      description: 'Request for office supplies including paper, pens, and printer cartridges',
      requester: 'John Doe',
      requesterRole: 'Office Manager',
      department: 'Administration',
      branch: 'Dar es Salaam Main',
      totalValue: 1400000,
      priority: 'medium',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'transfer',
      title: 'Equipment Transfer to Mwanza Branch',
      description: 'Transfer of 5 laptops and 3 printers to support new branch operations',
      requester: 'Sarah Johnson',
      requesterRole: 'IT Manager',
      department: 'Information Technology',
      branch: 'Mwanza Branch',
      totalValue: 7350000,
      priority: 'high',
      status: 'pending',
      submittedAt: '2024-01-14T14:20:00Z'
    }
  ]

  const approvedApprovals = [
    {
      id: '3',
      type: 'purchase',
      title: 'Safety Equipment Purchase',
      description: 'Purchase of safety helmets, vests, and gloves for construction team',
      requester: 'David Brown',
      requesterRole: 'Safety Officer',
      department: 'Safety',
      branch: 'Dar es Salaam Main',
      totalValue: 1500000,
      priority: 'high',
      status: 'approved',
      submittedAt: '2024-01-10T11:00:00Z',
      approvedAt: '2024-01-12T15:30:00Z',
      approvedBy: 'Jane Smith',
      comments: 'Approved - Safety equipment is essential for compliance'
    }
  ]

  const rejectedApprovals = [
    {
      id: '4',
      type: 'disposal',
      title: 'Old Furniture Disposal',
      description: 'Disposal of old office furniture to make space for new equipment',
      requester: 'Lisa Chen',
      requesterRole: 'Facilities Manager',
      department: 'Facilities',
      branch: 'Dar es Salaam Main',
      totalValue: 0,
      priority: 'low',
      status: 'rejected',
      submittedAt: '2024-01-08T16:45:00Z',
      approvedAt: '2024-01-09T10:20:00Z',
      approvedBy: 'Robert Johnson',
      comments: 'Rejected - Items can be refurbished and reused instead of disposal'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Package className="h-4 w-4" />
      case 'transfer': return <Truck className="h-4 w-4" />
      case 'adjustment': return <Settings className="h-4 w-4" />
      case 'disposal': return <XCircle className="h-4 w-4" />
      case 'return': return <ArrowRight className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-blue-100 text-blue-700'
      case 'transfer': return 'bg-green-100 text-green-700'
      case 'adjustment': return 'bg-orange-100 text-orange-700'
      case 'disposal': return 'bg-red-100 text-red-700'
      case 'return': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'approved': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCurrentApprovals = () => {
    switch (activeTab) {
      case 'pending': return pendingApprovals
      case 'approved': return approvedApprovals
      case 'rejected': return rejectedApprovals
      default: return []
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">HR Approvals</h1>
                <p className="text-slate-600 mt-1 text-base">Review and manage HR-related approval requests</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4" />
                  New Request
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
                    <p className="text-2xl font-bold text-slate-900">{pendingApprovals.length}</p>
                    <p className="text-xs text-yellow-600">Requires attention</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved Today</p>
                    <p className="text-2xl font-bold text-slate-900">{approvedApprovals.length}</p>
                    <p className="text-xs text-green-600">This week</p>
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
                    <p className="text-sm font-medium text-slate-600">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(pendingApprovals.reduce((sum, a) => sum + a.totalValue, 0))}</p>
                    <p className="text-xs text-blue-600">Pending requests</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg. Response Time</p>
                    <p className="text-2xl font-bold text-slate-900">2.3h</p>
                    <p className="text-xs text-purple-600">Last 30 days</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
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
                    placeholder="Search approvals, requesters, or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingApprovals.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved ({approvedApprovals.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected ({rejectedApprovals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-4">
                {getCurrentApprovals().map((approval) => (
                  <Card key={approval.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(approval.type)}`}>
                              {getTypeIcon(approval.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">{approval.title}</h3>
                                <Badge className={getPriorityColor(approval.priority)}>
                                  {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)}
                                </Badge>
                                <Badge className={getStatusColor(approval.status)}>
                                  Pending
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{approval.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {approval.requester} ({approval.requesterRole})
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {approval.department} - {approval.branch}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(approval.submittedAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatCurrency(approval.totalValue)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="grid gap-4">
                {getCurrentApprovals().map((approval) => (
                  <Card key={approval.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(approval.type)}`}>
                              {getTypeIcon(approval.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">{approval.title}</h3>
                                <Badge className={getPriorityColor(approval.priority)}>
                                  {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)}
                                </Badge>
                                <Badge className={getStatusColor(approval.status)}>
                                  Approved
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{approval.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {approval.requester} ({approval.requesterRole})
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {approval.department} - {approval.branch}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Approved: {approval.approvedAt ? formatDate(approval.approvedAt) : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  By: {approval.approvedBy || 'N/A'}
                                </div>
                              </div>
                              {approval.comments && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                  <p className="text-sm text-green-800"><strong>Comment:</strong> {approval.comments}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <div className="grid gap-4">
                {getCurrentApprovals().map((approval) => (
                  <Card key={approval.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(approval.type)}`}>
                              {getTypeIcon(approval.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">{approval.title}</h3>
                                <Badge className={getPriorityColor(approval.priority)}>
                                  {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)}
                                </Badge>
                                <Badge className={getStatusColor(approval.status)}>
                                  Rejected
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{approval.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {approval.requester} ({approval.requesterRole})
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {approval.department} - {approval.branch}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Rejected: {approval.approvedAt ? formatDate(approval.approvedAt) : 'N/A'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  By: {approval.approvedBy || 'N/A'}
                                </div>
                              </div>
                              {approval.comments && (
                                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                  <p className="text-sm text-red-800"><strong>Reason:</strong> {approval.comments}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
} 