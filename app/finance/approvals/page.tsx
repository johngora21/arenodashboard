"use client"

import { useState, useEffect } from "react"
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
  DollarSign,
  FileText,
  Calendar,
  ArrowLeft,
  Filter,
  Search,
  RefreshCw,
  Eye,
  TrendingUp,
  CreditCard,
  Receipt,
  Building,
  BarChart3
} from "lucide-react"
import { 
  getPendingApprovalsByDepartment,
  approveRequest,
  rejectRequest,
  getApprovalsByDepartment,
  getApprovalHistoryByDepartmentAndStatus
} from "@/lib/firebase-service"
import { Badge } from "@/components/ui/badge"

interface ApprovalRequest {
  id: string
  type: 'expense_approval' | 'budget_approval' | 'payment_approval'
  status: 'pending' | 'approved' | 'rejected'
  requestedBy: string
  requestedAt: any
  department: string
  priority: 'low' | 'medium' | 'high'
  description: string
  data: any
  approvedBy?: string
  approvedAt?: any
  comments?: string
}

export default function FinanceApprovalsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [approvedApprovals, setApprovedApprovals] = useState<any[]>([])
  const [rejectedApprovals, setRejectedApprovals] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      loadAllApprovals()
    }
  }, [user])

  const loadAllApprovals = async () => {
    try {
      setDataLoading(true)
      const [pending, approved, rejected] = await Promise.all([
        getApprovalsByDepartment('finance'),
        getApprovalHistoryByDepartmentAndStatus('finance', 'approved'),
        getApprovalHistoryByDepartmentAndStatus('finance', 'rejected'),
      ])
      
      // Normalize all approvals to have the same structure
      const normalize = (arr: any[], status: string) => arr.map(approval => ({
        id: approval.id,
        status: approval.status || status,
        description: approval.description ||
          (approval.requestType === 'expenses' ? `Expense approval for shipment ${approval.shipmentNumber}` :
          approval.requestType === 'budget' ? `Budget approval for ${approval.shipmentNumber}` :
          `Payment approval for shipment ${approval.shipmentNumber}`),
        requestedBy: approval.requestedBy,
        requestedAt: approval.requestedAt,
        approvedBy: approval.approvedBy,
        rejectedBy: approval.rejectedBy,
        data: {
          ...(approval.expensesData ? { expensesData: approval.expensesData } : {}),
          ...(approval.budgetData ? { budgetData: approval.budgetData } : {}),
          ...(approval.paymentData ? { paymentData: approval.paymentData } : {}),
          ...(approval.data ? approval.data : {})
        },
      }))
      
      setPendingApprovals(normalize(pending, 'pending'))
      setApprovedApprovals(normalize(approved, 'approved'))
      setRejectedApprovals(normalize(rejected, 'rejected'))
    } catch (err) {
      console.error('Error loading approvals:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const handleApprove = async (approvalId: string) => {
    try {
      console.log('Approving request:', approvalId)
      await approveRequest(approvalId, user?.email || 'Unknown')
      console.log('Request approved successfully')
      alert('Request approved successfully!')
    } catch (error) {
      console.error('Error approving request:', error)
      alert(`Failed to approve request: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      await loadAllApprovals()
    }
  }

  const handleReject = async (approvalId: string) => {
    try {
      console.log('Rejecting request:', approvalId)
      await rejectRequest(approvalId, user?.email || 'Unknown', 'Rejected by Finance')
      console.log('Request rejected successfully')
      alert('Request rejected successfully!')
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert(`Failed to reject request: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      await loadAllApprovals()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date instanceof Date ? date : date.toDate()
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  }

  // Combine all approvals into one array
  const allApprovals = [
    ...pendingApprovals,
    ...approvedApprovals,
    ...rejectedApprovals
  ]

  // Filtering
  let filteredApprovals: any[] = []
  if (selectedStatus === 'pending') filteredApprovals = allApprovals.filter(a => a.status === 'pending')
  else if (selectedStatus === 'approved') filteredApprovals = allApprovals.filter(a => a.status === 'approved')
  else if (selectedStatus === 'rejected') filteredApprovals = allApprovals.filter(a => a.status === 'rejected')
  else filteredApprovals = allApprovals

  // Analytics
  const total = pendingApprovals.length + approvedApprovals.length + rejectedApprovals.length
  const pending = pendingApprovals.length
  const approved = approvedApprovals.length
  const rejected = rejectedApprovals.length

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <Header />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/finance')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Finance
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Finance Approvals</h1>
                <p className="text-slate-600">Track and manage all finance approval requests</p>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Requests</p>
                    <p className="text-2xl font-bold">{total}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-slate-400" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 mb-6">
              <Button variant={selectedStatus === 'pending' ? 'default' : 'outline'} onClick={() => setSelectedStatus('pending')}>Pending</Button>
              <Button variant={selectedStatus === 'approved' ? 'default' : 'outline'} onClick={() => setSelectedStatus('approved')}>Approved</Button>
              <Button variant={selectedStatus === 'rejected' ? 'default' : 'outline'} onClick={() => setSelectedStatus('rejected')}>Rejected</Button>
              <Button variant={selectedStatus === 'all' ? 'default' : 'outline'} onClick={() => setSelectedStatus('all')}>All</Button>
            </div>

            {/* Approval List Rendering */}
            {dataLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading approvals...</p>
              </div>
            ) : filteredApprovals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">No approvals found for this status.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApprovals.map((approval) => {
                  // Only show action buttons if this approval is in pendingApprovals (i.e., from approvalRequests)
                  const isTrulyPending = approval.status === 'pending' && pendingApprovals.some((a: any) => a.id === approval.id)
                  return (
                    <div key={approval.id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{approval.description || 'Finance Approval Request'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Requested by {approval.requestedBy || 'Unknown'} on {approval.requestedAt?.toDate ? new Date(approval.requestedAt.toDate()).toLocaleDateString() : ''}
                          </p>
                        </div>
                        <Badge variant="secondary" className={
                          approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Expenses Data */}
                      {approval.data?.expensesData && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-purple-700">Expenses Requested:</h5>
                          <div className="space-y-2">
                            {approval.data.expensesData.expenses?.map((expense: any, index: number) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                                <span className="font-medium">{expense.description}</span>
                                <span className="text-sm font-semibold">
                                  TZS {expense.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium">
                              Total Amount: TZS {approval.data.expensesData.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Budget Data */}
                      {approval.data?.budgetData && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-blue-700">Budget Request:</h5>
                          <div className="text-sm">
                            <div>Budget Type: {approval.data.budgetData.type}</div>
                            <div>Amount: TZS {approval.data.budgetData.amount.toLocaleString()}</div>
                            <div>Purpose: {approval.data.budgetData.purpose}</div>
                          </div>
                        </div>
                      )}

                      {/* Payment Data */}
                      {approval.data?.paymentData && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700">Payment Request:</h5>
                          <div className="text-sm">
                            <div>Payment Type: {approval.data.paymentData.type}</div>
                            <div>Amount: TZS {approval.data.paymentData.amount.toLocaleString()}</div>
                            <div>Recipient: {approval.data.paymentData.recipient}</div>
                          </div>
                        </div>
                      )}

                      {/* Action buttons for pending approvals that are truly pending */}
                      {isTrulyPending && (
                        <div className="flex gap-3 mt-6 pt-6 border-t">
                          <Button onClick={() => handleApprove(approval.id)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button onClick={() => handleReject(approval.id)} variant="destructive" className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {/* Processed by info for non-pending */}
                      {approval.status !== 'pending' && (
                        <div className="mt-4 pt-4 border-t text-sm text-slate-500">
                          {approval.status === 'approved' ? (
                            <div>
                              Approved by {approval.approvedBy} on {approval.approvedAt?.toDate ? new Date(approval.approvedAt.toDate()).toLocaleDateString() : 'N/A'}
                            </div>
                          ) : (
                            <div>
                              Rejected by {approval.rejectedBy} on {approval.rejectedAt?.toDate ? new Date(approval.rejectedAt.toDate()).toLocaleDateString() : 'N/A'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 