"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  getAllCustomers, 
  getAllInteractions, 
  getCRMStats,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  updateCustomerStatus,
  addInteraction,
  updateInteraction,
  deleteInteraction,
  searchCustomers,
  seedCRMSampleData,
  Customer,
  Interaction,
  CRMStats
} from "@/lib/firebase-service"
import { 
  Users, 
  Search, 
  RefreshCw, 
  Edit, 
  Eye,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Download,
  Copy,
  ExternalLink,
  UserPlus,
  MessageSquare,
  Star,
  TrendingUp,
  Package,
  DollarSign
} from "lucide-react"
import { emailService } from '@/lib/email-service'
import { smsService } from '@/lib/sms-service'

export default function CRMPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [stats, setStats] = useState<CRMStats | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showAddCustomer, setShowAddCustomer] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadCRMData()
    }
  }, [user])

  const loadCRMData = async () => {
    try {
      setDataLoading(true)
      
      // Fetch data from Firebase
      const [customersData, interactionsData, statsData] = await Promise.all([
        getAllCustomers(),
        getAllInteractions(),
        getCRMStats()
      ])

      setCustomers(customersData)
      setInteractions(interactionsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading CRM data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  // Customer Management Functions
  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding customer to Firebase:', customerData)
      const customerId = await addCustomer(customerData)
      console.log('Customer added successfully with ID:', customerId)
      
      // Show success message
      alert('Customer added successfully!')
      
      // Refresh data and close modal
      await loadCRMData()
      setShowAddCustomer(false)
    } catch (error) {
      console.error('Error adding customer:', error)
      alert(`Error adding customer: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleUpdateCustomer = async (customerId: string, customerData: Partial<Omit<Customer, 'id' | 'createdAt'>>) => {
    try {
      await updateCustomer(customerId, customerData)
      await loadCRMData()
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer(customerId)
      await loadCRMData()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handleUpdateCustomerStatus = async (customerId: string, status: 'active' | 'inactive' | 'prospect' | 'vip') => {
    try {
      await updateCustomerStatus(customerId, status)
      await loadCRMData()
    } catch (error) {
      console.error('Error updating customer status:', error)
    }
  }

  // Interaction Management Functions
  const handleAddInteraction = async (interactionData: Omit<Interaction, 'id' | 'createdAt'>) => {
    try {
      await addInteraction(interactionData)
      await loadCRMData()
    } catch (error) {
      console.error('Error adding interaction:', error)
    }
  }

  const handleUpdateInteraction = async (interactionId: string, interactionData: Partial<Omit<Interaction, 'id' | 'createdAt'>>) => {
    try {
      await updateInteraction(interactionId, interactionData)
      await loadCRMData()
    } catch (error) {
      console.error('Error updating interaction:', error)
    }
  }

  const handleDeleteInteraction = async (interactionId: string) => {
    try {
      await deleteInteraction(interactionId)
      await loadCRMData()
    } catch (error) {
      console.error('Error deleting interaction:', error)
    }
  }

  // Search and Filter Functions
  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim()) {
      try {
        const searchResults = await searchCustomers(term)
        setCustomers(searchResults)
      } catch (error) {
        console.error('Error searching customers:', error)
      }
    } else {
      await loadCRMData()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'active': return 'bg-green-50 text-green-700 border-green-200'
      case 'prospect': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'inactive': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vip': return <Star className="h-4 w-4" />
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'prospect': return <TrendingUp className="h-4 w-4" />
      case 'inactive': return <XCircle className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Helper function to format Firebase Timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Email functionality
  const handleSendEmail = async (customer: Customer, message: string) => {
    try {
      const senderName = user?.displayName || user?.email || 'Areno Logistics Admin'
      const senderEmail = user?.email || 'admin@arenologistics.com'
      
      const result = await emailService.sendCustomerMessageEmail(
        senderName,
        senderEmail,
        customer.email,
        customer.name,
        message,
        'CRM'
      )
      
      if (result.success) {
        alert('Email sent successfully!')
        // Add interaction record
        await handleAddInteraction({
          customerId: customer.id,
          type: 'email',
          subject: 'Email from Areno Logistics',
          description: message,
          date: new Date().toISOString(),
          agent: senderName,
          outcome: 'positive'
        })
      } else {
        alert('Failed to send email: ' + result.error)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email. Please try again.')
    }
  }

  // Combined SMS and Email functionality
  const handleSendMessage = async (customer: Customer, message: string) => {
    try {
      const results = []
      let hasPhone = false
      let hasEmail = false

      // Send SMS if phone number is available
      if (customer.phone) {
        hasPhone = true
        const smsResult = await smsService.sendSingleSMS(
          customer.phone,
          message
        )
        results.push({ type: 'SMS', success: smsResult.success, error: smsResult.error })
      }

      // Send Email if email is available
      if (customer.email) {
        hasEmail = true
        const senderName = user?.displayName || user?.email || 'Areno Logistics Admin'
        const senderEmail = user?.email || 'admin@arenologistics.com'
        
        const emailResult = await emailService.sendCustomerMessageEmail(
          senderName,
          senderEmail,
          customer.email,
          customer.name,
          message,
          'CRM'
        )
        results.push({ type: 'Email', success: emailResult.success, error: emailResult.error })
      }

      // Check results and show appropriate message
      const successfulResults = results.filter(r => r.success)
      const failedResults = results.filter(r => !r.success)

      if (successfulResults.length > 0 && failedResults.length === 0) {
        const sentMethods = successfulResults.map(r => r.type).join(' and ')
        alert(`Message sent successfully via ${sentMethods}!`)
        // Add interaction record
        await handleAddInteraction({
          customerId: customer.id,
          type: 'message',
          subject: 'Message from Areno Logistics',
          description: message,
          date: new Date().toISOString(),
          agent: user?.displayName || user?.email || 'Admin',
          outcome: 'positive'
        })
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

  const handleChatButtonClick = (customer: Customer) => {
    const message = prompt(`Send message to ${customer.name} (${customer.email}):`)
    if (message && message.trim()) {
      handleSendMessage(customer, message.trim())
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <Header />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Relationship Management</h1>
              <p className="text-slate-600">Manage customer relationships, interactions, and business opportunities</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Customers</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.totalCustomers || customers.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Customers</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.activeCustomers || customers.filter(c => c.status === 'active' || c.status === 'vip').length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">VIP Customers</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats?.vipCustomers || customers.filter(c => c.status === 'vip').length}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(stats?.totalRevenue || customers.reduce((sum, c) => sum + c.totalRevenue, 0))}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search by name, email, company, or location..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="vip">VIP</option>
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAddCustomer(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Customer
                  </Button>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading customers...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Shipments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Last Interaction
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{customer.name}</div>
                                <div className="text-sm text-slate-500">{customer.email}</div>
                                <div className="text-sm text-slate-500">{customer.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{customer.company || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                              <span className="text-sm text-slate-900">{customer.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
                              {getStatusIcon(customer.status)}
                              <span className="ml-1 capitalize">{customer.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-1 text-slate-400" />
                              {formatNumber(customer.totalShipments)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                            {formatCurrency(customer.totalRevenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatTimestamp(customer.lastInteraction)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => setSelectedCustomer(customer)}
                                className="text-slate-400 hover:text-slate-600"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleChatButtonClick(customer)}
                                className="text-blue-400 hover:text-blue-600"
                                title="Send Email"
                              >
                                <Mail className="h-4 w-4" />
                              </button>
                              <button className="text-green-400 hover:text-green-600">
                                <Phone className="h-4 w-4" />
                              </button>
                              <button className="text-orange-400 hover:text-orange-600">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredCustomers.length === 0 && !dataLoading && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
                  <p className="text-slate-500">No customers match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Customer Details</h2>
                  <p className="text-slate-600 mt-1">{selectedCustomer.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Name:</span> {selectedCustomer.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedCustomer.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedCustomer.phone}</div>
                    {selectedCustomer.company && <div><span className="font-medium">Company:</span> {selectedCustomer.company}</div>}
                    <div><span className="font-medium">Location:</span> {selectedCustomer.location}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedCustomer.status)}`}>
                        {getStatusIcon(selectedCustomer.status)}
                        <span className="ml-1 capitalize">{selectedCustomer.status}</span>
                      </span>
                    </div>
                    <div><span className="font-medium">Total Shipments:</span> {formatNumber(selectedCustomer.totalShipments)}</div>
                    <div><span className="font-medium">Total Revenue:</span> {formatCurrency(selectedCustomer.totalRevenue)}</div>
                    <div><span className="font-medium">Created:</span> {formatTimestamp(selectedCustomer.createdAt)}</div>
                    {selectedCustomer.assignedAgent && <div><span className="font-medium">Assigned Agent:</span> {selectedCustomer.assignedAgent}</div>}
                  </div>
                </div>
              </div>

              {selectedCustomer.tags.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCustomer.notes && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Notes</h3>
                  <p className="text-slate-700">{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Recent Interactions */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Interactions</h3>
                <div className="space-y-3">
                  {interactions
                    .filter(interaction => interaction.customerId === selectedCustomer.id)
                    .slice(0, 3)
                    .map((interaction) => (
                      <div key={interaction.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-900">{interaction.subject}</p>
                            <span className="text-xs text-slate-500">{formatTimestamp(interaction.date)}</span>
                          </div>
                          <p className="text-sm text-slate-600">{interaction.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-slate-500">By {interaction.agent}</span>
                            <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              interaction.outcome === 'positive' ? 'bg-green-100 text-green-800' :
                              interaction.outcome === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {interaction.outcome}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Close
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add New Customer</h2>
                  <p className="text-slate-600 mt-1">Enter customer information</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddCustomer(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              
              try {
                // Get form values with proper validation
                const name = formData.get('name') as string
                const email = formData.get('email') as string
                const phone = formData.get('phone') as string
                const location = formData.get('location') as string
                const status = formData.get('status') as 'active' | 'inactive' | 'prospect' | 'vip'
                
                // Validate required fields
                if (!name || !email || !phone || !location || !status) {
                  alert('Please fill in all required fields')
                  return
                }

                // Process tags properly
                const tagsInput = formData.get('tags') as string
                const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : []

                const customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> = {
                  name,
                  email,
                  phone,
                  company: formData.get('company') as string || undefined,
                  location,
                  status,
                  totalShipments: parseInt(formData.get('totalShipments') as string) || 0,
                  totalRevenue: parseInt(formData.get('totalRevenue') as string) || 0,
                  lastInteraction: formData.get('lastInteraction') as string || new Date().toISOString().split('T')[0],
                  lastShipment: formData.get('lastShipment') as string || new Date().toISOString().split('T')[0],
                  notes: formData.get('notes') as string || undefined,
                  tags,
                  assignedAgent: formData.get('assignedAgent') as string || undefined
                }

                console.log('Submitting customer data:', customerData)
                await handleAddCustomer(customerData)
              } catch (error) {
                console.error('Error in form submission:', error)
                alert('Error adding customer. Please try again.')
              }
            }}>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="prospect">Prospect</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Shipments
                    </label>
                    <input
                      type="number"
                      name="totalShipments"
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Revenue (TZS)
                    </label>
                    <input
                      type="number"
                      name="totalRevenue"
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Interaction
                    </label>
                    <input
                      type="date"
                      name="lastInteraction"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Shipment
                    </label>
                    <input
                      type="date"
                      name="lastShipment"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Assigned Agent
                    </label>
                    <input
                      type="text"
                      name="assignedAgent"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter assigned agent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="VIP, Freight, Regular"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter any additional notes about the customer"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCustomer(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 