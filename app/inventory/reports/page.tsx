"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  Search,
  Filter,
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Users,
  Package,
  Truck,
  Building,
  Calendar,
  DollarSign,
  Activity
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  getAllReports,
  approveReport,
  rejectReport,
  deleteReport,
  Report
} from "@/lib/firebase-service"

export default function InventoryReportsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      loadReports()
    }
  }, [user])

  const loadReports = async () => {
    try {
      setLoading(true)
      const reportsData = await getAllReports()
      setReports(reportsData)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReport = async (reportId: string) => {
    try {
      setApproving(reportId)
      await approveReport(reportId, user?.email || '')
      await loadReports()
    } catch (error) {
      console.error('Error approving report:', error)
    } finally {
      setApproving(null)
    }
  }

  const handleRejectReport = async (reportId: string) => {
    try {
      setRejecting(reportId)
      await rejectReport(reportId, user?.email || '')
      await loadReports()
    } catch (error) {
      console.error('Error rejecting report:', error)
    } finally {
      setRejecting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'hr':
        return <Users className="h-5 w-5" />
      case 'inventory':
        return <Package className="h-5 w-5" />
      case 'logistics':
        return <Truck className="h-5 w-5" />
      case 'operations':
        return <Building className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const pendingCount = reports.filter(r => r.status === 'pending').length
  const approvedCount = reports.filter(r => r.status === 'approved').length
  const rejectedCount = reports.filter(r => r.status === 'rejected').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading reports...</p>
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
                    onClick={() => router.push('/inventory')}
                    className="text-slate-600 hover:text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Inventory Reports</h1>
                    <p className="text-slate-600">Review and approve reports from all departments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Reports</p>
                    <p className="text-3xl font-bold text-slate-900">{reports.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
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
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('all')}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('pending')}
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === 'approved' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('approved')}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approved
                  </Button>
                  <Button
                    variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('rejected')}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejected
                  </Button>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Department Reports</h2>
              </div>
              
              <div className="p-6">
                {filteredReports.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-slate-100 p-3 rounded-lg">
                              {getDepartmentIcon(report.department)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
                                <Badge className={`${getStatusColor(report.status)}`}>
                                  {getStatusIcon(report.status)}
                                  <span className="ml-1 capitalize">{report.status}</span>
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-2">{report.description}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span>Department: {report.department}</span>
                                <span>Type: {report.reportType}</span>
                                <span>Submitted by: {report.submittedBy}</span>
                                <span>Date: {formatDate(report.submittedAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            {report.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => handleApproveReport(report.id)}
                                  disabled={approving === report.id}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {approving === report.id ? 'Approving...' : 'Approve'}
                                </Button>
                                <Button
                                  onClick={() => handleRejectReport(report.id)}
                                  disabled={rejecting === report.id}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  {rejecting === report.id ? 'Rejecting...' : 'Reject'}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No reports found</h3>
                    <p className="text-slate-500">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No reports match your current filters.' 
                        : 'No reports have been submitted yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedReport.title}</h2>
                  <p className="text-slate-600 mt-1">Report from {selectedReport.department} department</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Department:</span> {selectedReport.department}</div>
                    <div><span className="font-medium">Type:</span> {selectedReport.reportType}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedReport.status)}`}>
                        {getStatusIcon(selectedReport.status)}
                        <span className="ml-1 capitalize">{selectedReport.status}</span>
                      </Badge>
                    </div>
                    <div><span className="font-medium">Submitted by:</span> {selectedReport.submittedBy}</div>
                    <div><span className="font-medium">Submitted at:</span> {formatDate(selectedReport.submittedAt)}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Data</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Description:</span></div>
                    <p className="text-slate-700">{selectedReport.description}</p>
                    {selectedReport.data && (
                      <div className="mt-4">
                        <div><span className="font-medium">Data:</span></div>
                        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                          {JSON.stringify(selectedReport.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedReport.comments && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Comments</h3>
                  <p className="text-slate-700">{selectedReport.comments}</p>
                </div>
              )}

              {selectedReport.status !== 'pending' && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Decision Details</h3>
                  <div className="space-y-2">
                    {selectedReport.status === 'approved' && selectedReport.approvedBy && (
                      <>
                        <div><span className="font-medium">Approved by:</span> {selectedReport.approvedBy}</div>
                        <div><span className="font-medium">Approved at:</span> {selectedReport.approvedAt ? formatDate(selectedReport.approvedAt) : 'N/A'}</div>
                      </>
                    )}
                    {selectedReport.status === 'rejected' && selectedReport.rejectedBy && (
                      <>
                        <div><span className="font-medium">Rejected by:</span> {selectedReport.rejectedBy}</div>
                        <div><span className="font-medium">Rejected at:</span> {selectedReport.rejectedAt ? formatDate(selectedReport.rejectedAt) : 'N/A'}</div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </Button>
                {selectedReport.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApproveReport(selectedReport.id)}
                      disabled={approving === selectedReport.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {approving === selectedReport.id ? 'Approving...' : 'Approve Report'}
                    </Button>
                    <Button
                      onClick={() => handleRejectReport(selectedReport.id)}
                      disabled={rejecting === selectedReport.id}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {rejecting === selectedReport.id ? 'Rejecting...' : 'Reject Report'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 