"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Filter,
  User,
  Truck,
  UserCheck,
  UserX,
  Clock,
  Star,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Target,
  BarChart3,
  RefreshCw,
  Eye,
  Plus,
  Edit,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  MessageSquare,
  FileText,
  Shield,
  Building,
  Briefcase,
  Car,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc
} from "lucide-react"
import { 
  getAllTeamMembers,
  getTeamMembersByRole,
  getAvailableTeamMembers,
  getOccupiedTeamMembers,
  getTeamMemberStats,
  seedEmployeeSampleData,
  TeamMember,
  TeamMemberStats
} from "@/lib/firebase-service"
import { emailService } from '@/lib/email-service'
import { smsService } from '@/lib/sms-service'

export default function ShipmentsTeamsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<TeamMemberStats>({
    totalMembers: 0,
    availableMembers: 0,
    occupiedMembers: 0,
    activeMembers: 0,
    averageEfficiency: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    byRole: {
      drivers: { total: 0, available: 0, occupied: 0 },
      supervisors: { total: 0, available: 0, occupied: 0 },
      workers: { total: 0, available: 0, occupied: 0 }
    }
  })
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadTeamData()
    }
  }, [user])

  useEffect(() => {
    filterAndSortMembers()
  }, [teamMembers, searchTerm, selectedStatus, selectedAvailability, sortBy, sortOrder, activeTab])

  const loadTeamData = async () => {
    try {
      setDataLoading(true)
      const [members, statsData] = await Promise.all([
        getAllTeamMembers(),
        getTeamMemberStats()
      ])
      setTeamMembers(members)
      setStats(statsData)
    } catch (err) {
      console.error('Error loading team data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const filterAndSortMembers = () => {
    let filtered = [...teamMembers]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      )
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(member => member.status === selectedStatus)
    }

    // Tab filter
    if (activeTab !== "all") {
      if (activeTab === "driver") {
        filtered = filtered.filter(member => member.role === 'driver')
      } else if (activeTab === "supervisor") {
        filtered = filtered.filter(member => member.role === 'supervisor')
      } else if (activeTab === "worker") {
        filtered = filtered.filter(member => member.role === 'worker')
      }
    }

    // Availability filter (for dropdown)
    if (selectedAvailability !== "all") {
      if (selectedAvailability === "available") {
        filtered = filtered.filter(member => !member.isOccupied && member.status === 'active')
      } else if (selectedAvailability === "occupied") {
        filtered = filtered.filter(member => member.isOccupied)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof TeamMember]
      let bValue: any = b[sortBy as keyof TeamMember]

      if (sortBy === "name") {
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
      } else if (sortBy === "efficiency") {
        aValue = a.efficiency
        bValue = b.efficiency
      } else if (sortBy === "assignmentsCount") {
        aValue = a.assignmentsCount
        bValue = b.assignmentsCount
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredMembers(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'on-leave': return 'bg-yellow-100 text-yellow-800'
      case 'terminated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600'
    if (efficiency >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEfficiencyGrade = (efficiency: number) => {
    if (efficiency >= 90) return 'A+'
    if (efficiency >= 80) return 'A'
    if (efficiency >= 70) return 'B'
    if (efficiency >= 60) return 'C'
    if (efficiency >= 50) return 'D'
    return 'F'
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'driver': return <Truck className="h-4 w-4" />
      case 'supervisor': return <UserCheck className="h-4 w-4" />
      case 'worker': return <Users className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const refreshData = () => {
    loadTeamData()
  }

  const handleViewMember = (member: TeamMember) => {
    // TODO: Implement view member details modal
    console.log('View member:', member)
    alert(`Viewing details for ${member.name}`)
  }

  const handleEditMember = (member: TeamMember) => {
    // TODO: Implement edit member modal
    console.log('Edit member:', member)
    alert(`Editing ${member.name}`)
  }

  // Email functionality
  const handleSendEmail = async (member: TeamMember, message: string) => {
    try {
      const senderName = user?.displayName || user?.email || 'Areno Logistics Admin'
      const senderEmail = user?.email || 'admin@arenologistics.com'
      
      const result = await emailService.sendTeamMessageEmail(
        senderName,
        senderEmail,
        member.email,
        member.name,
        message,
        'Shipment Team'
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
  const handleSendMessage = async (member: TeamMember, message: string) => {
    try {
      const results = []
      let hasPhone = false
      let hasEmail = false

      // Send SMS if phone number is available
      if (member.phone) {
        hasPhone = true
        const smsResult = await smsService.sendSingleSMS(
          member.phone,
          message
        )
        results.push({ type: 'SMS', success: smsResult.success, error: smsResult.error })
      }

      // Send Email if email is available
      if (member.email) {
        hasEmail = true
        const senderName = user?.displayName || user?.email || 'Areno Logistics Admin'
        const senderEmail = user?.email || 'admin@arenologistics.com'
        
        const emailResult = await emailService.sendTeamMessageEmail(
          senderName,
          senderEmail,
          member.email,
          member.name,
          message,
          'Shipment Team'
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

  const handleMessageMember = (member: TeamMember) => {
    const message = prompt(`Send message to ${member.name} (${member.email}):`)
    if (message && message.trim()) {
      handleSendMessage(member, message.trim())
    }
  }

  const handleSeedData = async () => {
    try {
      await seedEmployeeSampleData()
      alert('Sample employee data added successfully!')
      loadTeamData() // Reload the data
    } catch (error) {
      console.error('Error seeding data:', error)
      alert('Error adding sample data. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-0">
          <Header />
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            </div>
          </main>
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
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push('/shipments')} className="text-slate-600 hover:text-slate-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-7 w-7 text-purple-500" />
                  Shipment Teams
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button 
                  onClick={handleSeedData} 
                  variant="outline" 
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Sample Data
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    Active: {stats.activeMembers}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.availableMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    Ready for assignment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                  <UserX className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.occupiedMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently assigned
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.averageEfficiency}%</div>
                  <p className="text-xs text-muted-foreground">
                    Team performance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setActiveTab("all")}
                  variant={activeTab === "all" ? "default" : "outline"}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  onClick={() => setActiveTab("driver")}
                  variant={activeTab === "driver" ? "default" : "outline"}
                  size="sm"
                  className={activeTab === "driver" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  Drivers
                </Button>
                <Button
                  onClick={() => setActiveTab("supervisor")}
                  variant={activeTab === "supervisor" ? "default" : "outline"}
                  size="sm"
                  className={activeTab === "supervisor" ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  Supervisors
                </Button>
                <Button
                  onClick={() => setActiveTab("worker")}
                  variant={activeTab === "worker" ? "default" : "outline"}
                  size="sm"
                  className={activeTab === "worker" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Workers
                </Button>
              </div>
            </div>

            {/* Team Members Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Team Members ({filteredMembers.length})</h2>
              </div>
              
              {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading team members...</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No team members found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-purple-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                                <div className="text-sm text-gray-500">{member.phone}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Joined: {new Date(member.createdAt.toDate()).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.department}</div>
                            <div className="text-xs text-gray-500">{member.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(member.status)}>
                              {member.status.replace('-', ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{member.performance}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{member.attendance}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewMember(member)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditMember(member)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Edit Member"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleMessageMember(member)}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                title="Send Message"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 