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
  Users,
  Truck,
  FileText,
  Calendar,
  User,
  ArrowLeft,
  Filter,
  Search,
  RefreshCw,
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  Shield,
  Building,
  Briefcase,
  BarChart3
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock functions to replace Firebase calls
const getPendingApprovalsByDepartment = async (department: string): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([]), 300))
}

const approveRequest = async (approvalId: string, approver: string): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 300))
}

const rejectRequest = async (approvalId: string, approver: string): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 300))
}

const getAllEmployees = async (): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: '1', name: 'John Doe', position: 'Manager', department: 'HR', email: 'john@example.com', phone: '+1234567890' },
    { id: '2', name: 'Jane Smith', position: 'Staff', department: 'HR', email: 'jane@example.com', phone: '+1234567891' }
  ]), 500))
}

const getTeamMemberDetails = async (): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([]), 300))
}

const getTeamMemberWorkload = async (): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([]), 300))
}

const getTeamMemberPerformance = async (): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([]), 300))
}

const getTeamMemberAvailability = async (): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([]), 300))
}

const getApprovalsByDepartment = async (): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([]), 300))
}

const getApprovalHistoryByDepartmentAndStatus = async (): Promise<any[]> => {
  return new Promise(resolve => setTimeout(() => resolve([]), 300))
}

interface ApprovalRequest {
  id: string
  type: 'team_assignment' | 'leave_request' | 'expense_approval' | 'performance_review'
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

interface TeamMemberInfo {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
}

export default function ApprovalsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [loadingApprovals, setLoadingApprovals] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [pendingCount, setPendingCount] = useState(0)
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [showTeamAnalysis, setShowTeamAnalysis] = useState(false)
  const [teamAnalysis, setTeamAnalysis] = useState<any>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [teamMemberNames, setTeamMemberNames] = useState<{[key: string]: TeamMemberInfo}>({})
  const [loadingNames, setLoadingNames] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
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
      loadEmployees()
    }
  }, [user])

  useEffect(() => {
    // filterApprovals() // This function is removed, so this useEffect is no longer needed.
  }, [approvals, selectedTab, searchTerm, selectedDepartment, selectedPriority])

  // Reload team member names when employees are loaded
  useEffect(() => {
    if (employees.length > 0 && approvals.length > 0) {
      console.log('Employees loaded, reloading team member names...')
      loadTeamMemberNames(approvals)
    }
  }, [employees, approvals])

  const loadEmployees = async () => {
    try {
      console.log('Loading employees...')
      const employeesData = await getAllEmployees()
      console.log('Employees loaded:', employeesData.length)
      setEmployees(employeesData)
    } catch (error) {
      console.error('Error loading employees:', error)
    }
  }

  const getPendingApprovalCount = async () => {
    try {
      console.log('Getting pending approval count...')
      // Mock implementation - replace with MySQL integration later
      const mockPendingCount = 5
      console.log('Pending HR approvals count:', mockPendingCount)
      setPendingCount(mockPendingCount)
    } catch (error) {
      console.error('Error getting pending approval count:', error)
    }
  }

  const loadTeamMemberNames = async (approvals: any[]) => {
    try {
      setLoadingNames(true)
      const names: {[key: string]: TeamMemberInfo} = {}
      
      console.log('Loading team member names for', approvals.length, 'approvals')
      console.log('Available employees:', employees.length)
      
      // Process each approval to extract team member information
      approvals.forEach((approval, index) => {
        console.log(`Processing approval ${index + 1}:`, approval.id)
        
        if (approval.data?.teamData) {
          // Handle driver
          if (approval.data.teamData.assignedDriver) {
            const driverId = approval.data.teamData.assignedDriver
            console.log('Looking up driver ID:', driverId)
            
            // First try to use stored driver details (for new approvals)
            if (approval.data.teamData.driverDetails) {
              const driverDetails = approval.data.teamData.driverDetails
              console.log('Found stored driver details:', driverDetails)
              names[driverId] = {
                id: driverDetails.id,
                name: driverDetails.name,
                position: driverDetails.role,
                department: driverDetails.department,
                email: '',
                phone: ''
              }
            } else {
              // For old approvals, look up in employees collection
              const driverDetails = employees.find(emp => emp.id === driverId)
              console.log('Driver lookup result:', driverDetails)
              if (driverDetails) {
                names[driverId] = {
                  id: driverDetails.id,
                  name: driverDetails.name,
                  position: driverDetails.position,
                  department: driverDetails.department,
                  email: driverDetails.email,
                  phone: driverDetails.phone
                }
              } else {
                console.log('Driver not found in employees collection')
                names[driverId] = {
                  id: driverId,
                  name: driverId,
                  position: 'Driver',
                  department: 'Operations',
                  email: '',
                  phone: ''
                }
              }
            }
          }
          
          // Handle supervisor
          if (approval.data.teamData.assignedSupervisor) {
            const supervisorId = approval.data.teamData.assignedSupervisor
            console.log('Looking up supervisor ID:', supervisorId)
            
            // First try to use stored supervisor details (for new approvals)
            if (approval.data.teamData.supervisorDetails) {
              const supervisorDetails = approval.data.teamData.supervisorDetails
              console.log('Found stored supervisor details:', supervisorDetails)
              names[supervisorId] = {
                id: supervisorDetails.id,
                name: supervisorDetails.name,
                position: supervisorDetails.role,
                department: supervisorDetails.department,
                email: '',
                phone: ''
              }
            } else {
              // For old approvals, look up in employees collection
              const supervisorDetails = employees.find(emp => emp.id === supervisorId)
              console.log('Supervisor lookup result:', supervisorDetails)
              if (supervisorDetails) {
                names[supervisorId] = {
                  id: supervisorDetails.id,
                  name: supervisorDetails.name,
                  position: supervisorDetails.position,
                  department: supervisorDetails.department,
                  email: supervisorDetails.email,
                  phone: supervisorDetails.phone
                }
              } else {
                console.log('Supervisor not found in employees collection')
                names[supervisorId] = {
                  id: supervisorId,
                  name: supervisorId,
                  position: 'Supervisor',
                  department: 'Operations',
                  email: '',
                  phone: ''
                }
              }
            }
          }
          
          // Handle workers
          if (approval.data.teamData.workerDetails) {
            approval.data.teamData.workerDetails.forEach((worker: any, workerIndex: number) => {
              console.log(`Looking up worker ${workerIndex + 1} ID:`, worker.id)
              
              // For new approvals, use stored details
              if (worker.name && worker.name !== 'Unknown') {
                console.log('Using stored worker details:', worker)
                names[worker.id] = {
                  id: worker.id,
                  name: worker.name,
                  position: worker.role || 'Worker',
                  department: worker.department || 'Operations',
                  email: '',
                  phone: ''
                }
              } else {
                // For old approvals, look up in employees collection
                const workerDetails = employees.find(emp => emp.id === worker.id)
                console.log('Worker lookup result:', workerDetails)
                if (workerDetails) {
                  names[worker.id] = {
                    id: workerDetails.id,
                    name: workerDetails.name,
                    position: workerDetails.position,
                    department: workerDetails.department,
                    email: workerDetails.email,
                    phone: workerDetails.phone
                  }
                } else {
                  console.log('Worker not found in employees collection')
                  names[worker.id] = {
                    id: worker.id,
                    name: worker.name || worker.id,
                    position: worker.role || 'Worker',
                    department: worker.department || 'Operations',
                    email: '',
                    phone: ''
                  }
                }
              }
            })
          }
        }
      })
      
      console.log('Final team member names:', names)
      setTeamMemberNames(names)
    } catch (error) {
      console.error('Error loading team member names:', error)
    } finally {
      setLoadingNames(false)
    }
  }

  const getMemberName = (memberId: string) => {
    // First check if we have the name cached
    if (teamMemberNames[memberId]?.name && teamMemberNames[memberId].name !== memberId) {
      return teamMemberNames[memberId].name
    }
    
    // Mock employee data - replace with MySQL integration later
    if (memberId) {
      const mockEmployee = {
        id: memberId,
        name: `Employee ${memberId}`,
        position: 'Staff Member',
        department: 'HR',
        email: `emp${memberId}@example.com`,
        phone: '+1234567890'
      }
      
      setTeamMemberNames(prev => ({
        ...prev,
        [memberId]: mockEmployee
      }))
      
      return mockEmployee.name
    }
    
    return 'Fetching...'
  }

  const getMemberPosition = (memberId: string) => {
    return teamMemberNames[memberId]?.position || 'Unknown'
  }

  const loadApprovals = async () => {
    try {
      setLoadingApprovals(true)
      console.log('Loading HR approvals...')
      
      // Get pending count first
      await getPendingApprovalCount()
      
      // Load approval requests from mock data
      const hrApprovals = await getPendingApprovalsByDepartment('hr')
      console.log('Raw HR approvals from mock data:', hrApprovals)
      console.log('Number of HR approvals found:', hrApprovals.length)
      
      // Wait for employees to be loaded before processing team member names
      if (employees.length === 0) {
        console.log('Employees not loaded yet, loading employees first...')
        await loadEmployees()
      }
      
      // Load team member names
      await loadTeamMemberNames(hrApprovals)
      
      // Log each approval request details
      hrApprovals.forEach((approval, index) => {
        console.log(`Approval ${index + 1}:`, {
          id: approval.id,
          requestType: approval.requestType,
          department: approval.department,
          status: approval.status,
          shipmentNumber: approval.shipmentNumber,
          requestedBy: approval.requestedBy,
          teamData: approval.teamData
        })
      })
      
      // Transform the data to match our interface
      const transformedApprovals: ApprovalRequest[] = hrApprovals.map(approval => ({
        id: approval.id,
        type: approval.requestType === 'team' ? 'team_assignment' : 
              approval.requestType === 'materials' ? 'expense_approval' : 
              approval.requestType === 'expenses' ? 'expense_approval' : 'leave_request',
        status: approval.status,
        requestedBy: approval.requestedBy,
        requestedAt: approval.requestedAt,
        department: approval.department === 'hr' ? 'HR' : 
                   approval.department === 'inventory' ? 'Inventory' : 
                   approval.department === 'finance' ? 'Finance' : approval.department,
        priority: 'medium', // Default priority
        description: approval.requestType === 'team' ? 
                    `Team assignment for shipment ${approval.shipmentNumber}` :
                    approval.requestType === 'materials' ? 
                    `Materials request for shipment ${approval.shipmentNumber}` :
                    approval.requestType === 'expenses' ? 
                    `Expense approval for shipment ${approval.shipmentNumber}` :
                    `Request for shipment ${approval.shipmentNumber}`,
        data: {
          shipmentNumber: approval.shipmentNumber,
          shipmentId: approval.shipmentId,
          requestType: approval.requestType,
          teamData: approval.teamData,
          materialsData: approval.materialsData,
          expensesData: approval.expensesData
        }
      }))
      
      console.log('Transformed approvals:', transformedApprovals)
      console.log('Number of transformed approvals:', transformedApprovals.length)
      setApprovals(transformedApprovals)
    } catch (error) {
      console.error('Error loading approvals:', error)
    } finally {
      setLoadingApprovals(false)
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
      await rejectRequest(approvalId, user?.email || 'Unknown')
      console.log('Request rejected successfully')
      alert('Request rejected successfully!')
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert(`Failed to reject request: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      await loadAllApprovals()
    }
  }

  const loadTeamAnalysis = async (approval: any) => {
    setLoadingAnalysis(true)
    setSelectedApproval(approval)
    setShowTeamAnalysis(true)
    
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const analysis = {
        shipment: approval,
        teamMembers: { driver: {}, supervisor: {}, workers: [] as any[] },
        currentMonth
      }

      // Analyze driver
      if (approval.data?.teamData?.assignedDriver) {
        const driverDetails = await getTeamMemberDetails()
        const driverWorkload = await getTeamMemberWorkload()
        const driverPerformance = await getTeamMemberPerformance()
        const driverAvailability = await getTeamMemberAvailability()
        
        analysis.teamMembers.driver = {
          ...driverDetails,
          workload: driverWorkload,
          performance: driverPerformance,
          availability: driverAvailability
        }
      }

      // Analyze supervisor
      if (approval.data?.teamData?.assignedSupervisor) {
        const supervisorDetails = await getTeamMemberDetails()
        const supervisorWorkload = await getTeamMemberWorkload()
        const supervisorPerformance = await getTeamMemberPerformance()
        const supervisorAvailability = await getTeamMemberAvailability()
        
        analysis.teamMembers.supervisor = {
          ...supervisorDetails,
          workload: supervisorWorkload,
          performance: supervisorPerformance,
          availability: supervisorAvailability
        }
      }

      // Analyze workers
      if (approval.data?.teamData?.workerDetails?.length > 0) {
        analysis.teamMembers.workers = []
        
        for (const worker of approval.data.teamData.workerDetails) {
          const workerDetails = await getTeamMemberDetails()
          const workerWorkload = await getTeamMemberWorkload()
          const workerPerformance = await getTeamMemberPerformance()
          const workerAvailability = await getTeamMemberAvailability()
          
          analysis.teamMembers.workers.push({
            ...workerDetails,
            workload: workerWorkload,
            performance: workerPerformance,
            availability: workerAvailability
          })
        }
      }

      setTeamAnalysis(analysis)
    } catch (error) {
      console.error('Error loading team analysis:', error)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const getApprovalIcon = (type: string) => {
    switch (type) {
      case 'team_assignment':
        return <Users className="h-5 w-5" />
      case 'leave_request':
        return <Calendar className="h-5 w-5" />
      case 'expense_approval':
        return <FileText className="h-5 w-5" />
      case 'performance_review':
        return <Star className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const loadAllApprovals = async () => {
    try {
      setDataLoading(true)
      const [pending, approved, rejected] = await Promise.all([
        getApprovalsByDepartment('hr'),
        getApprovalHistoryByDepartmentAndStatus('hr', 'approved'),
        getApprovalHistoryByDepartmentAndStatus('hr', 'rejected'),
      ])
      // Normalize all approvals to have the same structure
      const normalize = (arr: any[], status: string) => arr.map(approval => ({
        id: approval.id,
        status: approval.status || status,
        description: approval.description ||
          (approval.requestType === 'team' ? `Team assignment for shipment ${approval.shipmentNumber}` :
          approval.requestType === 'materials' ? `Materials request for shipment ${approval.shipmentNumber}` :
          approval.requestType === 'expenses' ? `Expense approval for shipment ${approval.shipmentNumber}` :
          `Request for shipment ${approval.shipmentNumber}`),
        requestedBy: approval.requestedBy,
        requestedAt: approval.requestedAt,
        approvedBy: approval.approvedBy,
        rejectedBy: approval.rejectedBy,
        data: {
          ...(approval.teamData ? { teamData: approval.teamData } : {}),
          ...(approval.materialsData ? { materialsData: approval.materialsData } : {}),
          ...(approval.expensesData ? { expensesData: approval.expensesData } : {}),
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

  const departments = Array.from(new Set(approvals.map(a => a.department)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/hr')} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to HR
                  </Button>
                  <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">HR Approvals</h1>
                <p className="text-slate-600">Track and manage all HR approval requests</p>
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
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{approved}</p>
                  </div>
                </div>
            </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{rejected}</p>
                  </div>
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
            {(() => { console.log('Filtered Approvals:', filteredApprovals); return null })()}
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
                    <div key={approval.id} className="border rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{approval.description || 'Approval Request'}</h4>
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
                      {/* Team/Details rendering if available */}
                      {approval.data?.teamData && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-blue-700">Team Assignment:</h5>
                          <div className="text-sm">Driver: {getMemberName(approval.data.teamData.assignedDriver)}</div>
                          <div className="text-sm">Supervisor: {getMemberName(approval.data.teamData.assignedSupervisor)}</div>
                          <div className="text-sm">Workers: {approval.data.teamData.workerDetails?.map((w: any) => getMemberName(w.id)).join(', ')}</div>
                        </div>
                      )}
                      {approval.data?.materialsData && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700">Materials Requested:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {approval.data.materialsData.materials?.map((material: any, index: number) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span className="font-medium">{material.name}</span>
                                <span className="text-sm">
                                  {material.quantity} {material.unit}
                                  <span className="text-muted-foreground ml-2">
                                    (Available: {material.available})
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="text-sm mt-2">Total Materials: {approval.data.materialsData.totalMaterials}</div>
                        </div>
                      )}
                      {approval.data?.expensesData && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-orange-700">Expenses:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {approval.data.expensesData.expenses?.map((expense: any, index: number) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                                <span className="font-medium">{expense.description}</span>
                                <span className="text-sm">TZS {expense.amount}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-sm mt-2">Total Amount: TZS {approval.data.expensesData.totalAmount}</div>
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
                        <div className="mt-6 pt-6 border-t text-sm text-slate-600">
                          <span className="font-medium">Processed by:</span> {approval.approvedBy || approval.rejectedBy || 'Unknown'}
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

      {/* Team Analysis Modal */}
      {showTeamAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Team Analysis</h2>
              <Button variant="ghost" onClick={() => setShowTeamAnalysis(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            {loadingAnalysis ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Analyzing team members...</span>
              </div>
            ) : teamAnalysis ? (
              <div className="space-y-4">
                {/* Shipment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shipment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tracking Number:</span> {selectedApproval?.data?.shipmentNumber}
                      </div>
                      <div>
                        <span className="font-medium">Team Size:</span> {
                          (teamAnalysis.teamMembers.driver ? 1 : 0) + 
                          (teamAnalysis.teamMembers.supervisor ? 1 : 0) + 
                          (teamAnalysis.teamMembers.workers?.length || 0)
                        } members
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Member Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Team Member Analysis</CardTitle>
                    </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Driver */}
                      {teamAnalysis.teamMembers.driver && (
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Driver: {teamAnalysis.teamMembers.driver.name}
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Workload:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {teamAnalysis.teamMembers.driver.workload?.totalAssignments || 0} assignments this month
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Performance:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {teamAnalysis.teamMembers.driver.performance?.averageRating?.toFixed(1) || 'N/A'}/5.0 rating
                              </div>
                            </div>
                        <div>
                              <span className="font-medium">Status:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {teamAnalysis.teamMembers.driver.availability?.availabilityStatus}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Supervisor */}
                      {teamAnalysis.teamMembers.supervisor && (
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Supervisor: {teamAnalysis.teamMembers.supervisor.name}
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                              <span className="font-medium">Workload:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {teamAnalysis.teamMembers.supervisor.workload?.totalAssignments || 0} assignments this month
                              </div>
                            </div>
                              <div>
                              <span className="font-medium">Performance:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {teamAnalysis.teamMembers.supervisor.performance?.averageRating?.toFixed(1) || 'N/A'}/5.0 rating
                              </div>
                                  </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {teamAnalysis.teamMembers.supervisor.availability?.availabilityStatus}
                              </div>
                            </div>
                          </div>
                              </div>
                            )}
                            
                      {/* Workers */}
                      {teamAnalysis.teamMembers.workers?.map((worker: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Worker {index + 1}: {worker.name}
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Workload:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {worker.workload?.totalAssignments || 0} assignments this month
                              </div>
                            </div>
                              <div>
                              <span className="font-medium">Performance:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {worker.performance?.averageRating?.toFixed(1) || 'N/A'}/5.0 rating
                              </div>
                            </div>
                              <div>
                              <span className="font-medium">Status:</span>
                              <div className="text-xs text-slate-600 mt-1">
                                {worker.availability?.availabilityStatus}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">HR Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(() => {
                        const recommendations = []
                        const members = [teamAnalysis.teamMembers.driver, teamAnalysis.teamMembers.supervisor, ...(teamAnalysis.teamMembers.workers || [])].filter(Boolean)
                        
                        // Check availability
                        const unavailableMembers = members.filter(member => !member?.availability?.isAvailable)
                        if (unavailableMembers.length > 0) {
                          recommendations.push(`⚠️ ${unavailableMembers.length} team member(s) are currently unavailable`)
                        }
                        
                        // Check workload
                        const overloadedMembers = members.filter(member => (member?.workload?.totalAssignments || 0) > 6)
                        if (overloadedMembers.length > 0) {
                          recommendations.push(`⚠️ ${overloadedMembers.length} team member(s) have high workload`)
                        }
                        
                        // Check performance
                        const lowPerformers = members.filter(member => (member?.performance?.averageRating || 0) < 3.5)
                        if (lowPerformers.length > 0) {
                          recommendations.push(`⚠️ ${lowPerformers.length} team member(s) have below-average performance`)
                        }
                        
                        if (recommendations.length === 0) {
                          recommendations.push('✅ Team composition looks good! All members are available and have reasonable workload.')
                        }
                        
                        return recommendations
                      })().map((rec, index) => (
                        <div key={index} className="text-sm p-2 bg-slate-50 rounded">
                          {rec}
                        </div>
                      ))}
                      </div>
                  </CardContent>
                </Card>
                      
                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                          <Button
                    onClick={() => handleApprove(selectedApproval.id)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                    onClick={() => handleReject(selectedApproval.id)}
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                          </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Failed to load team analysis
                        </div>
                      )}
          </div>
      </div>
      )}
    </div>
  )
} 