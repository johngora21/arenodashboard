"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Search, Plus, Filter, MoreHorizontal, Phone, Mail, MapPin, Building, User, Star, Clock, DollarSign, TrendingUp, Users, Package, MessageSquare, Eye, Phone as PhoneIcon, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  location: string
  status: 'active' | 'inactive' | 'prospect' | 'vip'
  totalShipments: number
  totalRevenue: number
  lastInteraction: string
  lastShipment: string
  createdAt: string
  updatedAt: string
  notes?: string
  tags?: string[]
  assignedAgent?: string
}

interface Interaction {
  id: string
  customerId: string
  type: 'email' | 'phone' | 'meeting' | 'note'
  subject: string
  description: string
  date: string
  agent: string
  outcome: 'positive' | 'negative' | 'neutral'
}

interface Stats {
  totalCustomers: number
  activeCustomers: number
  vipCustomers: number
  totalRevenue: number
}

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+255 123 456 789',
      company: 'TechCorp Ltd',
      location: 'Dar es Salaam',
      status: 'vip',
      totalShipments: 45,
      totalRevenue: 2500000,
      lastInteraction: '2024-01-15T10:30:00Z',
      lastShipment: '2024-01-10T08:00:00Z',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      notes: 'Premium customer, prefers express shipping',
      tags: ['VIP', 'Express', 'Tech'],
      assignedAgent: 'Sarah Johnson'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@business.com',
      phone: '+255 987 654 321',
      company: 'Global Imports',
      location: 'Mombasa',
      status: 'active',
      totalShipments: 23,
      totalRevenue: 1200000,
      lastInteraction: '2024-01-14T14:20:00Z',
      lastShipment: '2024-01-08T12:00:00Z',
      createdAt: '2023-03-20T00:00:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      notes: 'Regular shipments to coastal regions',
      tags: ['Regular', 'Coastal', 'Import'],
      assignedAgent: 'Mike Chen'
    },
    {
      id: '3',
      name: 'David Kim',
      email: 'david.kim@startup.co',
      phone: '+255 555 123 456',
      company: 'InnovateTech',
      location: 'Nairobi',
      status: 'prospect',
      totalShipments: 5,
      totalRevenue: 300000,
      lastInteraction: '2024-01-12T09:15:00Z',
      lastShipment: '2024-01-05T10:00:00Z',
      createdAt: '2023-11-10T00:00:00Z',
      updatedAt: '2024-01-12T09:15:00Z',
      notes: 'New startup, potential for growth',
      tags: ['Startup', 'Tech', 'Growth'],
      assignedAgent: 'Sarah Johnson'
    },
    {
      id: '4',
      name: 'Lisa Wang',
      email: 'lisa.wang@retail.com',
      phone: '+255 777 888 999',
      company: 'Retail Plus',
      location: 'Kampala',
      status: 'active',
      totalShipments: 18,
      totalRevenue: 800000,
      lastInteraction: '2024-01-13T16:45:00Z',
      lastShipment: '2024-01-07T14:00:00Z',
      createdAt: '2023-05-12T00:00:00Z',
      updatedAt: '2024-01-13T16:45:00Z',
      notes: 'Retail distribution, seasonal patterns',
      tags: ['Retail', 'Seasonal', 'Distribution'],
      assignedAgent: 'Mike Chen'
    },
    {
      id: '5',
      name: 'Robert Johnson',
      email: 'robert.johnson@manufacturing.com',
      phone: '+255 444 333 222',
      company: 'Manufacturing Co',
      location: 'Arusha',
      status: 'inactive',
      totalShipments: 12,
      totalRevenue: 600000,
      lastInteraction: '2023-12-20T11:00:00Z',
      lastShipment: '2023-12-15T09:00:00Z',
      createdAt: '2023-02-28T00:00:00Z',
      updatedAt: '2023-12-20T11:00:00Z',
      notes: 'Reduced activity, needs re-engagement',
      tags: ['Manufacturing', 'Inactive', 'Re-engage'],
      assignedAgent: 'Sarah Johnson'
    }
  ])

  const [interactions] = useState<Interaction[]>([
    {
      id: '1',
      customerId: '1',
      type: 'phone',
      subject: 'Shipping Inquiry',
      description: 'Customer called to inquire about express shipping options for urgent delivery',
      date: '2024-01-15T10:30:00Z',
      agent: 'Sarah Johnson',
      outcome: 'positive'
    },
    {
      id: '2',
      customerId: '2',
      type: 'email',
      subject: 'Quote Request',
      description: 'Requested quote for bulk shipment to Mombasa port',
      date: '2024-01-14T14:20:00Z',
      agent: 'Mike Chen',
      outcome: 'positive'
    },
    {
      id: '3',
      customerId: '3',
      type: 'meeting',
      subject: 'Business Development',
      description: 'Met with startup team to discuss logistics partnership opportunities',
      date: '2024-01-12T09:15:00Z',
      agent: 'Sarah Johnson',
      outcome: 'positive'
    }
  ])

  const [stats] = useState<Stats>({
    totalCustomers: 5,
    activeCustomers: 3,
    vipCustomers: 1,
    totalRevenue: 5400000
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showContactSelector, setShowContactSelector] = useState(false)
  const [contactType, setContactType] = useState<'email' | 'phone'>('email')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  
  // Filter states for bulk messaging
  const [bulkMessageStatusFilter, setBulkMessageStatusFilter] = useState('all')
  const [bulkMessageLocationFilter, setBulkMessageLocationFilter] = useState('all')
  const [bulkMessageSearchTerm, setBulkMessageSearchTerm] = useState('')

  // Filter customers based on search and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Filter customers for bulk messaging
  const bulkMessageFilteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase()) ||
                         (customer.company && customer.company.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase())) ||
                         customer.location.toLowerCase().includes(bulkMessageSearchTerm.toLowerCase())
    
    const matchesStatus = bulkMessageStatusFilter === 'all' || customer.status === bulkMessageStatusFilter
    const matchesLocation = bulkMessageLocationFilter === 'all' || customer.location === bulkMessageLocationFilter
    
    return matchesSearch && matchesStatus && matchesLocation
  })

  // Utility functions
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

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vip': return <Star className="h-3 w-3" />
      case 'active': return <CheckCircle className="h-3 w-3" />
      case 'prospect': return <TrendingUp className="h-3 w-3" />
      case 'inactive': return <Clock className="h-3 w-3" />
      default: return <User className="h-3 w-3" />
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setCustomers([...customers, newCustomer])
    setShowAddCustomer(false)
  }

  const handleRouteToEmail = (customer: Customer) => {
    setContactType('email')
    setSelectedContacts([customer.email])
    setShowContactSelector(true)
  }

  const handleSendSMS = (customer: Customer) => {
    setContactType('phone')
    setSelectedContacts([customer.phone])
    setShowContactSelector(true)
  }

  const sendBulkSMS = async (contacts: string[], message: string) => {
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Sending SMS to:', contacts, 'Message:', message)
  }

  const sendBulkEmail = async (contacts: string[], message: string) => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Sending email to:', contacts, 'Message:', message)
  }

  // Contact Selector Modal Component
  const ContactSelectorModal = () => {
    if (!showContactSelector) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Send Bulk Message</h2>
                <p className="text-slate-600 mt-1">Select contacts and compose your message</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContactSelector(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact Type Selection */}
            <div className="flex gap-6 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={contactType === 'email'}
                  onChange={() => setContactType('email')}
                  className="mr-2"
                />
                <span className="font-medium">Email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={contactType === 'phone'}
                  onChange={() => setContactType('phone')}
                  className="mr-2"
                />
                <span className="font-medium">SMS</span>
              </label>
            </div>

            {/* Filters */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-slate-900">Filter Contacts</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, company..."
                    value={bulkMessageSearchTerm}
                    onChange={(e) => setBulkMessageSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={bulkMessageStatusFilter}
                    onChange={(e) => setBulkMessageStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="vip">VIP</option>
                    <option value="active">Active</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <select
                    value={bulkMessageLocationFilter}
                    onChange={(e) => setBulkMessageLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Locations</option>
                    {Array.from(new Set(customers.map(c => c.location))).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Select Contacts</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    {bulkMessageFilteredCustomers.length} customers found
                  </span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === bulkMessageFilteredCustomers.length && bulkMessageFilteredCustomers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allContacts = bulkMessageFilteredCustomers
                            .map(c => contactType === 'phone' ? c.phone : c.email)
                            .filter(Boolean)
                          setSelectedContacts(allContacts)
                        } else {
                          setSelectedContacts([])
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="font-medium">Select All</span>
                  </label>
                </div>
              </div>
              <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
                {bulkMessageFilteredCustomers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">No customers match your filters</p>
                  </div>
                ) : (
                  bulkMessageFilteredCustomers.map((customer) => {
                    const contactValue = contactType === 'phone' ? customer.phone : customer.email
                    if (!contactValue) return null

                    return (
                      <div key={customer.id} className="p-3 hover:bg-slate-50">
                        <label className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedContacts.includes(contactValue)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedContacts([...selectedContacts, contactValue])
                                } else {
                                  setSelectedContacts(selectedContacts.filter(c => c !== contactValue))
                                }
                              }}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium text-slate-900">{customer.name}</div>
                              <div className="text-sm text-slate-500">{contactValue}</div>
                              <div className="text-xs text-slate-400">{customer.location}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400">
                              {customer.company || 'No company'}
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(customer.status)}`}>
                              {getStatusIcon(customer.status)}
                              <span className="ml-1 capitalize">{customer.status}</span>
                            </span>
                          </div>
                        </label>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="px-6 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Type your ${contactType === 'phone' ? 'SMS' : 'email'} message here...`}
            />
          </div>

          {/* Status Messages */}
          <div className="px-6 mb-4">
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            {success && <div className="text-green-600 mb-2 text-sm">{success}</div>}
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {selectedContacts.length > 0 && (
                  <span>Selected: {selectedContacts.length} contacts</span>
                )}
              </div>
              <div className="flex gap-3">
            <Button
              onClick={async () => {
                if (selectedContacts.length === 0) {
                  setError("Please select at least one contact.")
                  return
                }
                if (!message.trim()) {
                  setError("Please enter a message.")
                  return
                }

                setMessageLoading(true)
                setSuccess("")
                setError("")

                try {
                  if (contactType === 'phone') {
                    await sendBulkSMS(selectedContacts, message)
                    setSuccess(`SMS sent successfully to ${selectedContacts.length} recipients!`)
                  } else {
                    await sendBulkEmail(selectedContacts, message)
                    setSuccess(`Email sent successfully to ${selectedContacts.length} recipients!`)
                  }
                  setSelectedContacts([])
                  setMessage("")
                } catch (err: any) {
                  setError(err.message || "Failed to send message.")
                } finally {
                  setMessageLoading(false)
                }
              }}
              disabled={messageLoading || selectedContacts.length === 0}
              className={`${contactType === 'phone' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                          >
              {messageLoading ? "Sending..." : `Send ${contactType === 'phone' ? 'SMS' : 'Email'} (${selectedContacts.length})`}
            </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main component return
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
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
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Customer
                  </Button>
                  <Button
                    onClick={() => setShowContactSelector(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Message
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
                                onClick={() => handleRouteToEmail(customer)}
                                className="text-blue-400 hover:text-blue-600"
                                title="Send Message"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleSendSMS(customer)}
                                className="text-orange-400 hover:text-orange-600"
                                title="Send SMS"
                              >
                                <Phone className="h-4 w-4" />
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

              {selectedCustomer && ((selectedCustomer.tags ?? []).length > 0) && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCustomer.tags ?? []).map((tag, index) => (
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
                    Add Customer
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Message Modal */}
      <ContactSelectorModal />
    </div>
  )
}
