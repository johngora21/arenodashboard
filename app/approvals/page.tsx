"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Users,
  Building2,
  DollarSign,
  Package,
  Calendar,
  Eye,
  Check,
  X,
  Filter,
  Search
} from "lucide-react"

interface ApprovalItem {
  id: string
  type: 'report' | 'request' | 'expense' | 'leave' | 'purchase'
  title: string
  description: string
  department: string
  employee: string
  amount?: number
  status: 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  dueDate?: string
}

export default function ApprovalsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for approvals
  const approvals: ApprovalItem[] = [
    {
      id: '1',
      type: 'expense',
      title: 'Office Supplies Purchase',
      description: 'Request for office supplies including printer paper, pens, and notebooks',
      department: 'HR',
      employee: 'Sarah Johnson',
      amount: 250000,
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-15',
      dueDate: '2024-01-20'
    },
    {
      id: '2',
      type: 'report',
      title: 'Monthly Sales Report',
      description: 'Sales performance report for December 2024',
      department: 'Sales',
      employee: 'Michael Chen',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-14',
      dueDate: '2024-01-18'
    },
    {
      id: '3',
      type: 'leave',
      title: 'Annual Leave Request',
      description: 'Request for 2 weeks annual leave from March 1-15',
      department: 'IT',
      employee: 'David Wilson',
      status: 'pending',
      priority: 'low',
      createdAt: '2024-01-13',
      dueDate: '2024-01-25'
    },
    {
      id: '4',
      type: 'purchase',
      title: 'New Laptop Purchase',
      description: 'Request for new development laptop for new team member',
      department: 'IT',
      employee: 'Lisa Rodriguez',
      amount: 2500000,
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-12',
      dueDate: '2024-01-22'
    },
    {
      id: '5',
      type: 'request',
      title: 'Software License Renewal',
      description: 'Annual renewal for Adobe Creative Suite licenses',
      department: 'Marketing',
      employee: 'James Brown',
      amount: 1800000,
      status: 'approved',
      priority: 'medium',
      createdAt: '2024-01-10',
      dueDate: '2024-01-15'
    },
    {
      id: '6',
      type: 'report',
      title: 'Inventory Audit Report',
      description: 'Quarterly inventory audit findings and recommendations',
      department: 'Inventory',
      employee: 'Emma Davis',
      status: 'rejected',
      priority: 'high',
      createdAt: '2024-01-09',
      dueDate: '2024-01-16'
    }
  ]

  const departments = ['HR', 'Sales', 'IT', 'Marketing', 'Inventory', 'Finance']
  const statuses = ['all', 'pending', 'approved', 'rejected']

  const filteredApprovals = approvals.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || item.department === filterDepartment
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesDepartment && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return <FileText className="h-4 w-4" />
      case 'request': return <AlertCircle className="h-4 w-4" />
      case 'expense': return <DollarSign className="h-4 w-4" />
      case 'leave': return <Calendar className="h-4 w-4" />
      case 'purchase': return <Package className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleApprove = (id: string) => {
    // Handle approval logic
    console.log('Approved:', id)
  }

  const handleReject = (id: string) => {
    // Handle rejection logic
    console.log('Rejected:', id)
  }

  const pendingCount = approvals.filter(item => item.status === 'pending').length
  const approvedCount = approvals.filter(item => item.status === 'approved').length
  const rejectedCount = approvals.filter(item => item.status === 'rejected').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Approvals</h1>
                <p className="text-slate-600 mt-1 text-base">Review and approve reports and requests across departments</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Pending</p>
                  <p className="text-2xl font-extrabold text-slate-900">{pendingCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Approved</p>
                  <p className="text-2xl font-extrabold text-slate-900">{approvedCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-lg">
                  <XCircle className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Rejected</p>
                  <p className="text-2xl font-extrabold text-slate-900">{rejectedCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search approvals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Approvals List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Approval Requests</h3>
            
            {filteredApprovals.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No approvals found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApprovals.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getTypeIcon(item.type)}
                          <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        
                        <p className="text-slate-600 mb-4">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{item.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{item.employee}</span>
                          </div>
                          {item.amount && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>TZS {item.amount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          {item.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleApprove(item.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
