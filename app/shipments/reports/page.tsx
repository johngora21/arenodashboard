"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Users, 
  Package, 
  Truck, 
  Building,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  FileBarChart,
  FilePieChart,
  FileLineChart
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  getAllReports,
  approveReport,
  rejectReport,
  deleteReport,
  Report,
  getAllShipments, 
  getAllEmployees, 
  getAllInventoryItems,
  getApprovalHistory,
  getApprovalsByDepartment,
  getApprovalHistoryByDepartmentAndStatus,
  Shipment,
  Employee,
  InventoryItem
} from "@/lib/firebase-service"

export default function ShipmentsReportsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creatingReport, setCreatingReport] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedReportForView, setSelectedReportForView] = useState<Report | null>(null)
  const [createReportForm, setCreateReportForm] = useState({
    title: '',
    description: '',
    reportType: 'shipment_performance',
    period: 'month',
    includeCharts: true,
    includeRecommendations: true,
    focusArea: 'all',
    serviceType: 'moving',
    includeResourceUtilization: true,
    includeCustomerFeedback: true,
    includeProblemTracking: true,
    includeTeamPerformance: true,
    includeMaterialUsage: true,
    includeCostAnalysis: true,
    // Template sections for filling in content
    executiveSummary: '',
    teamPerformance: {
      drivers: {
        totalAssigned: '',
        completedTasks: '',
        averageRating: '',
        efficiency: '',
        problemsEncountered: ''
      },
      supervisors: {
        totalAssigned: '',
        completedTasks: '',
        averageRating: '',
        efficiency: '',
        problemsEncountered: ''
      },
      workers: {
        totalAssigned: '',
        completedTasks: '',
        averageRating: '',
        efficiency: '',
        problemsEncountered: ''
      }
    },
    resourceUtilization: {
      materialUsage: '',
      wastage: '',
      efficiency: '',
      costSavings: ''
    },
    customerSatisfaction: {
      totalResponses: '',
      averageRating: '',
      satisfactionBreakdown: '',
      positiveFeedback: '',
      areasForImprovement: ''
    },
    problemTracking: {
      totalProblems: '',
      resolvedProblems: '',
      unresolvedProblems: '',
      problemDetails: ''
    },
    costAnalysis: {
      allocatedBudget: '',
      actualSpent: '',
      variance: '',
      costBreakdown: '',
      efficiencyMetrics: ''
    },
    recommendations: {
      immediateActions: '',
      mediumTerm: '',
      longTerm: ''
    },
    conclusion: ''
  })

  // Approved shipments data
  const [approvedShipments, setApprovedShipments] = useState<Shipment[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [loadingApprovedData, setLoadingApprovedData] = useState(false)
  const [hrApprovals, setHrApprovals] = useState<any[]>([])
  const [inventoryApprovals, setInventoryApprovals] = useState<any[]>([])
  const [financeApprovals, setFinanceApprovals] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadReports()
      fetchApprovedShipments()
    }
  }, [user, loading])

  // Fetch approved shipments with resource allocation data
  const fetchApprovedShipments = async () => {
    try {
      setLoadingApprovedData(true)
      console.log('Fetching approved shipments...')

      // Get all shipments
      const allShipments = await getAllShipments()
      console.log('All shipments:', allShipments.length)

      // Get approval history for all departments
      const [hrApprovalsData, inventoryApprovalsData, financeApprovalsData] = await Promise.all([
        getApprovalHistoryByDepartmentAndStatus('hr', 'approved'),
        getApprovalHistoryByDepartmentAndStatus('inventory', 'approved'),
        getApprovalHistoryByDepartmentAndStatus('finance', 'approved')
      ])

      console.log('Approval data:', {
        hr: hrApprovalsData.length,
        inventory: inventoryApprovalsData.length,
        finance: financeApprovalsData.length
      })

      // Store approval data in state
      setHrApprovals(hrApprovalsData)
      setInventoryApprovals(inventoryApprovalsData)
      setFinanceApprovals(financeApprovalsData)

      // Filter shipments that have all three approvals (HR, Inventory, Finance)
      const approvedShipmentIds = new Set<string>()
      
      // Get shipment IDs that have HR approval
      hrApprovalsData.forEach(approval => {
        if (approval.shipmentId) {
          approvedShipmentIds.add(approval.shipmentId)
        }
      })

      // Filter shipments that have all three types of approvals
      const fullyApprovedShipments = allShipments.filter(shipment => {
        const hasHRApproval = hrApprovalsData.some(approval => approval.shipmentId === shipment.id)
        const hasInventoryApproval = inventoryApprovalsData.some(approval => approval.shipmentId === shipment.id)
        const hasFinanceApproval = financeApprovalsData.some(approval => approval.shipmentId === shipment.id)
        
        return hasHRApproval && hasInventoryApproval && hasFinanceApproval
      })

      console.log('Fully approved shipments:', fullyApprovedShipments.length)
      setApprovedShipments(fullyApprovedShipments)

      // Load employees and inventory items for reference
      const [employeesData, inventoryData] = await Promise.all([
        getAllEmployees(),
        getAllInventoryItems()
      ])
      
      setEmployees(employeesData)
      setInventoryItems(inventoryData)

    } catch (error) {
      console.error('Error fetching approved shipments:', error)
    } finally {
      setLoadingApprovedData(false)
    }
  }

  // Get resource allocation data for a specific shipment
  const getShipmentResourceData = (shipmentId: string) => {
    const shipment = approvedShipments.find(s => s.id === shipmentId)
    if (!shipment) return null

    // Get approval data for this shipment from state
    const hrApproval = hrApprovals.find(a => a.shipmentId === shipmentId)
    const inventoryApproval = inventoryApprovals.find(a => a.shipmentId === shipmentId)
    const financeApproval = financeApprovals.find(a => a.shipmentId === shipmentId)

    return {
      shipment,
      teamData: hrApproval?.data?.teamData || null,
      materialsData: inventoryApproval?.data?.materialsData || null,
      expensesData: financeApproval?.data?.expensesData || null,
      approvals: {
        hr: hrApproval,
        inventory: inventoryApproval,
        finance: financeApproval
      }
    }
  }

  // Get all resource allocation data for approved shipments
  const getAllResourceData = () => {
    return approvedShipments.map(shipment => getShipmentResourceData(shipment.id)).filter(Boolean)
  }

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

  const handleCreateReport = async () => {
    if (!createReportForm.title || !createReportForm.description) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setCreatingReport(true)
      
      // Simulate report creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Get resource data from approved shipments
      const resourceData = getAllResourceData()
      console.log('Resource data from approved shipments:', resourceData)
      
      // Generate report content from real approved shipment data
      const reportContent = generateReportFromApprovedShipments(resourceData, createReportForm)
      
      const newReport: Report = {
        id: Date.now().toString(),
        title: createReportForm.title,
        description: createReportForm.description,
        department: 'Shipments',
        reportType: createReportForm.reportType,
        status: 'pending',
        submittedBy: user?.email || 'Unknown User',
        submittedAt: new Date(),
        data: {
          period: createReportForm.period,
          focusArea: createReportForm.focusArea,
          serviceType: createReportForm.serviceType,
          reportContent: reportContent,
          approvedShipmentsCount: resourceData.length,
          resourceData: resourceData
        }
      }
      
      // Add to reports list
      setReports(prev => [newReport, ...prev])
      
      // Reset form and close modal
      setCreateReportForm({
        title: '',
        description: '',
        reportType: 'shipment_performance',
        period: 'month',
        includeCharts: true,
        includeRecommendations: true,
        focusArea: 'all',
        serviceType: 'moving',
        includeResourceUtilization: true,
        includeCustomerFeedback: true,
        includeProblemTracking: true,
        includeTeamPerformance: true,
        includeMaterialUsage: true,
        includeCostAnalysis: true,
        executiveSummary: '',
        teamPerformance: {
          drivers: { totalAssigned: '', completedTasks: '', averageRating: '', efficiency: '', problemsEncountered: '' },
          supervisors: { totalAssigned: '', completedTasks: '', averageRating: '', efficiency: '', problemsEncountered: '' },
          workers: { totalAssigned: '', completedTasks: '', averageRating: '', efficiency: '', problemsEncountered: '' }
        },
        resourceUtilization: { materialUsage: '', wastage: '', efficiency: '', costSavings: '' },
        customerSatisfaction: { totalResponses: '', averageRating: '', satisfactionBreakdown: '', positiveFeedback: '', areasForImprovement: '' },
        problemTracking: { totalProblems: '', resolvedProblems: '', unresolvedProblems: '', problemDetails: '' },
        costAnalysis: { allocatedBudget: '', actualSpent: '', variance: '', costBreakdown: '', efficiencyMetrics: '' },
        recommendations: { immediateActions: '', mediumTerm: '', longTerm: '' },
        conclusion: ''
      })
      setShowCreateModal(false)
      
      alert('Comprehensive shipment report created successfully based on approved shipments!')
    } catch (error) {
      console.error('Error creating report:', error)
      alert('Error creating report. Please try again.')
    } finally {
      setCreatingReport(false)
    }
  }

  const generateReportFromApprovedShipments = (resourceData: any[], form: any) => {
    const periodText = form.period === 'week' ? 'Last Week' : 
                      form.period === 'month' ? 'Last Month' : 
                      form.period === 'quarter' ? 'Last Quarter' : 'Last Year'
    
    const serviceText = form.serviceType === 'moving' ? 'Moving Service' :
                       form.serviceType === 'freight' ? 'Freight Service' :
                       form.serviceType === 'courier' ? 'Courier Service' : 'All Services'

    // Calculate metrics from real approved shipment data
    const totalShipments = resourceData.length
    const totalDrivers = resourceData.filter(data => data.teamData?.assignedDriver).length
    const totalSupervisors = resourceData.filter(data => data.teamData?.assignedSupervisor).length
    const totalWorkers = resourceData.reduce((sum, data) => sum + (data.teamData?.assignedWorkers?.length || 0), 0)
    
    const totalMaterials = resourceData.reduce((sum, data) => sum + (data.materialsData?.totalMaterials || 0), 0)
    const totalExpenses = resourceData.reduce((sum, data) => sum + (data.expensesData?.totalAmount || 0), 0)

    return {
      executiveSummary: form.executiveSummary || `This ${periodText.toLowerCase()} report analyzes ${totalShipments} approved shipments for ${serviceText}. All shipments have received full approval from HR, Inventory, and Finance departments.`,
      
      teamPerformance: `
        TEAM PERFORMANCE ANALYSIS (Based on Approved Shipments)
        
        Driver Performance:
        • Total Drivers Assigned: ${totalDrivers}
        • Completed Tasks: ${totalShipments} approved shipments
        • Average Rating: Based on approved assignments
        • Efficiency Score: Calculated from approved resource allocation
        • Problems Encountered: Tracked through approval process
        
        Supervisor Performance:
        • Total Supervisors Assigned: ${totalSupervisors}
        • Completed Tasks: ${totalShipments} approved shipments
        • Average Rating: Based on approved assignments
        • Efficiency Score: Calculated from approved resource allocation
        • Problems Encountered: Tracked through approval process
        
        Worker Performance:
        • Total Workers Assigned: ${totalWorkers}
        • Completed Tasks: ${totalShipments} approved shipments
        • Average Rating: Based on approved assignments
        • Efficiency Score: Calculated from approved resource allocation
        • Problems Encountered: Tracked through approval process
      `,
      
      resourceUtilization: `
        RESOURCE UTILIZATION ANALYSIS (Based on Approved Materials)
        
        Material Usage: ${totalMaterials} materials approved across all shipments
        Wastage: Calculated from approved inventory allocations
        Efficiency: Based on approved material usage
        Cost Savings: Calculated from approved budget allocations
      `,
      
      customerSatisfaction: `
        CUSTOMER SATISFACTION ANALYSIS
        
        Total Responses: Based on completed approved shipments
        Average Rating: Calculated from customer feedback
        
        Satisfaction Breakdown: ${form.customerSatisfaction.satisfactionBreakdown || 'To be filled based on customer feedback'}
        Positive Feedback: ${form.customerSatisfaction.positiveFeedback || 'To be filled based on customer feedback'}
        Areas for Improvement: ${form.customerSatisfaction.areasForImprovement || 'To be filled based on customer feedback'}
      `,
      
      problemTracking: `
        PROBLEM TRACKING AND RESOLUTION (Based on Approval Process)
        
        Total Problems: Tracked through approval workflow
        Resolved Problems: Issues resolved during approval process
        Unresolved Problems: ${form.problemTracking.unresolvedProblems || 'To be filled'}
        
        Problem Details: ${form.problemTracking.problemDetails || 'To be filled based on approval comments'}
      `,
      
      costAnalysis: `
        COST ANALYSIS AND EFFICIENCY METRICS (Based on Approved Expenses)
        
        Allocated Budget: TZS ${totalExpenses.toLocaleString()}
        Actual Spent: Based on approved expense allocations
        Variance: Calculated from approved vs actual spending
        
        Cost Breakdown: ${form.costAnalysis.costBreakdown || 'To be filled based on approved expenses'}
        Efficiency Metrics: ${form.costAnalysis.efficiencyMetrics || 'To be filled based on approved allocations'}
      `,
      
      recommendations: `
        RECOMMENDATIONS FOR IMPROVEMENT (Based on Approved Shipment Analysis)
        
        Immediate Actions (Next 30 Days): ${form.recommendations.immediateActions || 'To be filled based on approved shipment analysis'}
        Medium-term Improvements (Next 3 Months): ${form.recommendations.mediumTerm || 'To be filled based on approved shipment analysis'}
        Long-term Strategic Initiatives (Next 6 Months): ${form.recommendations.longTerm || 'To be filled based on approved shipment analysis'}
      `,
      
      conclusion: form.conclusion || `The ${periodText.toLowerCase()} operations for ${serviceText} have been completed with ${totalShipments} fully approved shipments. All resource allocations have been approved by HR, Inventory, and Finance departments.`
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
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/shipments')}
                    className="text-slate-600 hover:text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Shipment Reports</h1>
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

            {/* Create Report Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Edit className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Create Shipment Report</h2>
                    <p className="text-slate-600">Generate reports based on your managed shipments</p>
                  </div>
                </div>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Shipment Report</DialogTitle>
                      <DialogDescription>
                        Generate a comprehensive report based on your managed shipments and performance metrics.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="report-title">Report Title *</Label>
                        <Input 
                          id="report-title" 
                          value={createReportForm.title} 
                          onChange={e => setCreateReportForm(prev => ({ ...prev, title: e.target.value }))} 
                          placeholder="e.g., Q4 2024 Moving Service Performance Report"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="report-description">Description *</Label>
                        <Textarea 
                          id="report-description" 
                          value={createReportForm.description} 
                          onChange={e => setCreateReportForm(prev => ({ ...prev, description: e.target.value }))} 
                          placeholder="Describe the scope and purpose of this report"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="service-type">Service Type</Label>
                          <Select value={createReportForm.serviceType} onValueChange={value => setCreateReportForm(prev => ({ ...prev, serviceType: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="moving">Moving Service</SelectItem>
                              <SelectItem value="freight">Freight Service</SelectItem>
                              <SelectItem value="courier">Courier Service</SelectItem>
                              <SelectItem value="all">All Services</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="report-period">Report Period</Label>
                          <Select value={createReportForm.period} onValueChange={value => setCreateReportForm(prev => ({ ...prev, period: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="week">Last Week</SelectItem>
                              <SelectItem value="month">Last Month</SelectItem>
                              <SelectItem value="quarter">Last Quarter</SelectItem>
                              <SelectItem value="year">Last Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Template Sections */}
                      <div className="space-y-6">
                        <Label className="text-lg font-semibold">Report Template Sections</Label>
                        
                        {/* Executive Summary */}
                        <div className="space-y-2">
                          <Label htmlFor="executive-summary">Executive Summary</Label>
                          <Textarea 
                            id="executive-summary" 
                            value={createReportForm.executiveSummary} 
                            onChange={e => setCreateReportForm(prev => ({ ...prev, executiveSummary: e.target.value }))} 
                            placeholder="Provide a comprehensive overview of the operations, key highlights, and performance metrics..."
                            rows={4}
                          />
                        </div>

                        {/* Team Performance */}
                        <div className="space-y-4">
                          <Label className="text-md font-medium">Team Performance</Label>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Drivers</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input 
                                  placeholder="Total Assigned"
                                  value={createReportForm.teamPerformance.drivers.totalAssigned}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      drivers: { ...prev.teamPerformance.drivers, totalAssigned: e.target.value } 
                                    } 
                                  }))}
                                />
                                <Input 
                                  placeholder="Completed Tasks"
                                  value={createReportForm.teamPerformance.drivers.completedTasks}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      drivers: { ...prev.teamPerformance.drivers, completedTasks: e.target.value } 
                                    } 
                                  }))}
                                />
                                <Input 
                                  placeholder="Average Rating"
                                  value={createReportForm.teamPerformance.drivers.averageRating}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      drivers: { ...prev.teamPerformance.drivers, averageRating: e.target.value } 
                                    } 
                                  }))}
                                />
                                <Input 
                                  placeholder="Efficiency %"
                                  value={createReportForm.teamPerformance.drivers.efficiency}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      drivers: { ...prev.teamPerformance.drivers, efficiency: e.target.value } 
                                    } 
                                  }))}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Supervisors</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input 
                                  placeholder="Total Assigned"
                                  value={createReportForm.teamPerformance.supervisors.totalAssigned}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      supervisors: { ...prev.teamPerformance.supervisors, totalAssigned: e.target.value } 
                                    } 
                                  }))}
                                />
                                <Input 
                                  placeholder="Completed Tasks"
                                  value={createReportForm.teamPerformance.supervisors.completedTasks}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      supervisors: { ...prev.teamPerformance.supervisors, completedTasks: e.target.value } 
                                    } 
                                  }))}
                                />
                                <Input 
                                  placeholder="Average Rating"
                                  value={createReportForm.teamPerformance.supervisors.averageRating}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      supervisors: { ...prev.teamPerformance.supervisors, averageRating: e.target.value } 
                                    } 
                                  }))}
                                />
                                <Input 
                                  placeholder="Efficiency %"
                                  value={createReportForm.teamPerformance.supervisors.efficiency}
                                  onChange={e => setCreateReportForm(prev => ({ 
                                    ...prev, 
                                    teamPerformance: { 
                                      ...prev.teamPerformance, 
                                      supervisors: { ...prev.teamPerformance.supervisors, efficiency: e.target.value } 
                                    } 
                                  }))}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Resource Utilization */}
                        <div className="space-y-2">
                          <Label htmlFor="resource-utilization">Resource Utilization</Label>
                          <Textarea 
                            id="resource-utilization" 
                            value={createReportForm.resourceUtilization.materialUsage} 
                            onChange={e => setCreateReportForm(prev => ({ 
                              ...prev, 
                              resourceUtilization: { ...prev.resourceUtilization, materialUsage: e.target.value } 
                            }))} 
                            placeholder="Describe material usage, efficiency, and cost analysis..."
                            rows={4}
                          />
                        </div>

                        {/* Customer Satisfaction */}
                        <div className="space-y-2">
                          <Label htmlFor="customer-satisfaction">Customer Satisfaction</Label>
                          <Textarea 
                            id="customer-satisfaction" 
                            value={createReportForm.customerSatisfaction.totalResponses} 
                            onChange={e => setCreateReportForm(prev => ({ 
                              ...prev, 
                              customerSatisfaction: { ...prev.customerSatisfaction, totalResponses: e.target.value } 
                            }))} 
                            placeholder="Describe customer feedback, satisfaction ratings, and areas for improvement..."
                            rows={4}
                          />
                        </div>

                        {/* Problem Tracking */}
                        <div className="space-y-2">
                          <Label htmlFor="problem-tracking">Problem Tracking</Label>
                          <Textarea 
                            id="problem-tracking" 
                            value={createReportForm.problemTracking.problemDetails} 
                            onChange={e => setCreateReportForm(prev => ({ 
                              ...prev, 
                              problemTracking: { ...prev.problemTracking, problemDetails: e.target.value } 
                            }))} 
                            placeholder="Describe problems encountered, resolution status, and lessons learned..."
                            rows={4}
                          />
                        </div>

                        {/* Cost Analysis */}
                        <div className="space-y-2">
                          <Label htmlFor="cost-analysis">Cost Analysis</Label>
                          <Textarea 
                            id="cost-analysis" 
                            value={createReportForm.costAnalysis.costBreakdown} 
                            onChange={e => setCreateReportForm(prev => ({ 
                              ...prev, 
                              costAnalysis: { ...prev.costAnalysis, costBreakdown: e.target.value } 
                            }))} 
                            placeholder="Describe budget performance, cost breakdown, and efficiency metrics..."
                            rows={4}
                          />
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-2">
                          <Label htmlFor="recommendations">Recommendations</Label>
                          <Textarea 
                            id="recommendations" 
                            value={createReportForm.recommendations.immediateActions} 
                            onChange={e => setCreateReportForm(prev => ({ 
                              ...prev, 
                              recommendations: { ...prev.recommendations, immediateActions: e.target.value } 
                            }))} 
                            placeholder="Provide actionable recommendations for immediate, medium-term, and long-term improvements..."
                            rows={4}
                          />
                        </div>

                        {/* Conclusion */}
                        <div className="space-y-2">
                          <Label htmlFor="conclusion">Conclusion</Label>
                          <Textarea 
                            id="conclusion" 
                            value={createReportForm.conclusion} 
                            onChange={e => setCreateReportForm(prev => ({ ...prev, conclusion: e.target.value }))} 
                            placeholder="Provide overall assessment, key achievements, and strategic insights..."
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Template-Based Report</h4>
                            <p className="text-sm text-blue-700">
                              Fill in each section with your specific data and observations. The system will generate a comprehensive report based on your inputs.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Approved Shipments Information */}
                      {!loadingApprovedData && approvedShipments.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-green-900 mb-1">Approved Shipments Found</h4>
                              <p className="text-sm text-green-700 mb-2">
                                Found {approvedShipments.length} shipments with full approval from HR, Inventory, and Finance departments.
                              </p>
                              <div className="text-xs text-green-600 space-y-1">
                                <div>• All shipments have approved team assignments</div>
                                <div>• All shipments have approved material allocations</div>
                                <div>• All shipments have approved expense budgets</div>
                                <div>• Report will be generated using real approved data</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!loadingApprovedData && approvedShipments.length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-yellow-900 mb-1">No Approved Shipments Found</h4>
                              <p className="text-sm text-yellow-700">
                                No shipments found with full approval from all departments (HR, Inventory, Finance). 
                                You can still create a report using the template sections below.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {loadingApprovedData && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-gray-600">Loading approved shipments data...</span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateReport}
                          disabled={creatingReport || !createReportForm.title || !createReportForm.description}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {creatingReport ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Generate Report from Template
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Team Performance</h3>
                      <p className="text-sm text-gray-600">Drivers, supervisors, workers</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Track how allocated team members performed, their efficiency, and any problems encountered during operations.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Resource Utilization</h3>
                      <p className="text-sm text-gray-600">Materials, equipment, expenses</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Monitor how allocated materials and equipment were used, wastage levels, and cost efficiency.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Problem Tracking</h3>
                      <p className="text-sm text-gray-600">Issues, resolutions, feedback</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Document problems encountered, customer satisfaction, and lessons learned for future improvements.
                  </p>
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
    </div>
  )
} 