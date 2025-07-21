"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  Package, 
  Search, 
  RefreshCw, 
  Edit, 
  Eye,
  Truck,
  Ship,
  FileText,
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
  Plus,
  User,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  FileText as FileTextIcon,
  Scale,
  Ruler,
  Settings,
  Shield
} from "lucide-react"
import { 
  getAllShipments, 
  addShipment, 
  updateShipment, 
  deleteShipment, 
  Shipment,
  getAllEmployees,
  getAllInventoryItems,
  seedEmployeeSampleData,
  createApprovalRequest
} from "@/lib/firebase-service"
import { collection, getDocs, addDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface ShipmentFormData {
  serviceType: 'freight' | 'moving' | 'courier'
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupLocation: string
  destination: string
  cargoDescription: string
  weight: string
  dimensions: string
  estimatedDelivery: string
  notes: string
  assignedDriver: string
  vehicleNumber: string
}

export default function ShipmentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [showShipmentModal, setShowShipmentModal] = useState(false)
  const [showManagementModal, setShowManagementModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [formLoading, setFormLoading] = useState(false)
  
  // Data fetching states
  const [employees, setEmployees] = useState<any[]>([])
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [managementDataLoading, setManagementDataLoading] = useState(false)
  
  // Management form states
  const [managementForm, setManagementForm] = useState({
    supervisor: '',
    driver: '',
    workers: [] as string[],
    materials: [] as Array<{
      id: string
      name: string
      quantity: number
      unit: string
      available: number
      fromInventory: boolean
    }>,
    expenses: [] as Array<{
      id: string
      name: string
      description: string
      amount: number
    }>,
    totalExpenses: 0,
    newMaterial: { name: '', quantity: 0, unit: '' },
    newExpense: { name: '', description: '', amount: 0 },
    approvalStatus: {
      hr: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' },
      inventory: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' },
      finance: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' }
    }
  })
  const [formData, setFormData] = useState<ShipmentFormData>({
    serviceType: 'freight',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupLocation: '',
    destination: '',
    cargoDescription: '',
    weight: '',
    dimensions: '',
    estimatedDelivery: '',
    notes: '',
    assignedDriver: '',
    vehicleNumber: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadShipments()
      loadEmployees() // Load employees when page loads
    }
  }, [user])

  const loadShipments = async () => {
    try {
      setDataLoading(true)
      const shipmentsData = await getAllShipments()
      setShipments(shipmentsData)
    } catch (err) {
      console.error('Error loading shipments:', err)
    } finally {
      setDataLoading(false)
    }
  }

  // Load employees from HR page
  const loadEmployees = async () => {
    try {
      console.log('Loading employees...')
      const employeesData = await getAllEmployees()
      console.log('Employees loaded:', employeesData.length, employeesData)
      
      // Debug: Log all employee positions
      console.log('All employee positions:', employeesData.map(emp => ({
        name: emp.name,
        position: emp.position,
        role: emp.role,
        status: emp.status
      })))
      
      // More flexible filtering - check both position and role fields
      const drivers = employeesData.filter(emp => 
        (emp.position && emp.position.toLowerCase().includes('driver')) || 
        (emp.role && emp.role.toLowerCase().includes('driver'))
      )
      const supervisors = employeesData.filter(emp => 
        (emp.position && emp.position.toLowerCase().includes('supervisor')) || 
        (emp.role && emp.role.toLowerCase().includes('supervisor'))
      )
      const workers = employeesData.filter(emp => 
        (emp.position && emp.position.toLowerCase().includes('worker')) || 
        (emp.role && emp.role.toLowerCase().includes('worker'))
      )
      
      console.log('Filtered employees:', {
        drivers: drivers.length,
        supervisors: supervisors.length,
        workers: workers.length
      })
      
      // Debug: Log filtered results
      console.log('Drivers found:', drivers.map(d => ({ name: d.name, position: d.position, role: d.role })))
      console.log('Supervisors found:', supervisors.map(s => ({ name: s.name, position: s.position, role: s.role })))
      console.log('Workers found:', workers.map(w => ({ name: w.name, position: w.position, role: w.role })))
      
      setEmployees(employeesData)
      
      // If no employees found, offer to seed sample data
      if (employeesData.length === 0) {
        console.log('No employees found. You may need to seed sample data.')
      }
    } catch (err) {
      console.error('Error loading employees:', err)
    }
  }

  // Load inventory items from inventory page
  const loadInventoryItems = async () => {
    try {
      const inventoryData = await getAllInventoryItems()
      setInventoryItems(inventoryData)
    } catch (err) {
      console.error('Error loading inventory items:', err)
    }
  }

  // Seed sample employee data
  const seedEmployeeData = async () => {
    try {
      console.log('Seeding employee data...')
      await seedEmployeeSampleData()
      console.log('Employee data seeded successfully')
      // Reload employees after seeding
      await loadEmployees()
    } catch (err) {
      console.error('Error seeding employee data:', err)
    }
  }



  // Helper to format Firebase Timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '-'
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString()
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString()
    }
    return timestamp
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'in-transit': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in-transit': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'freight': return <Truck className="h-4 w-4" />
      case 'moving': return <Package className="h-4 w-4" />
      case 'courier': return <FileText className="h-4 w-4" />
      default: return <Ship className="h-4 w-4" />
    }
  }

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'freight': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'moving': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'courier': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const copyTrackingNumber = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber)
    // You could add a toast notification here
    alert('Tracking number copied to clipboard!')
  }

  const generateTrackingNumber = () => {
    const prefix = 'ARENO'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  const handleInputChange = (field: keyof ShipmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      serviceType: 'freight',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      pickupLocation: '',
      destination: '',
      cargoDescription: '',
      weight: '',
      dimensions: '',
      estimatedDelivery: '',
      notes: '',
      assignedDriver: '',
      vehicleNumber: ''
    })
    setShowShipmentModal(true)
  }

  const openEditModal = (shipment: Shipment) => {
    setModalMode('edit')
    setSelectedShipment(null) // Close the details modal first
    setFormData({
      serviceType: shipment.serviceType,
      customerName: shipment.customerName,
      customerPhone: shipment.customerPhone,
      customerEmail: shipment.customerEmail,
      pickupLocation: shipment.pickupLocation,
      destination: shipment.destination,
      cargoDescription: shipment.cargoDescription,
      weight: shipment.weight || '',
      dimensions: shipment.dimensions || '',
      estimatedDelivery: shipment.estimatedDelivery,
      notes: shipment.notes || '',
      assignedDriver: shipment.assignedDriver || '',
      vehicleNumber: shipment.vehicleNumber || ''
    })
    setShowShipmentModal(true)
  }

  const openManagementModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowManagementModal(true)
    // Load data when modal opens
    loadEmployees()
    loadInventoryItems()
  }

  const closeModal = () => {
    setShowShipmentModal(false)
    setShowManagementModal(false)
    setSelectedShipment(null) // Ensure details modal is also closed
    setFormData({
      serviceType: 'freight',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      pickupLocation: '',
      destination: '',
      cargoDescription: '',
      weight: '',
      dimensions: '',
      estimatedDelivery: '',
      notes: '',
      assignedDriver: '',
      vehicleNumber: ''
    })
    // Reset management form
    setManagementForm({
      supervisor: '',
      driver: '',
      workers: [],
      materials: [],
      expenses: [],
      totalExpenses: 0,
      newMaterial: { name: '', quantity: 0, unit: '' },
      newExpense: { name: '', description: '', amount: 0 },
      approvalStatus: {
        hr: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' },
        inventory: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' },
        finance: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' }
      }
    })
  }



  const handleSaveResourceAllocation = async () => {
    try {
      console.log('Starting resource allocation save...')
      
      if (!selectedShipment) {
        alert('No shipment selected')
        return
      }
      
      // Check if any team members are assigned
      const hasTeamAssignment = managementForm.supervisor || managementForm.driver || managementForm.workers.length > 0
      
      if (!hasTeamAssignment) {
        alert('Please assign at least one team member')
        return
      }
      
      console.log('Selected shipment:', selectedShipment)
      console.log('Management form:', managementForm)
      console.log('User:', user)
      
      // Create HR approval request
      const hrApprovalData = {
        shipmentId: selectedShipment.id,
        shipmentNumber: selectedShipment.trackingNumber,
        requestType: 'team' as const,
        department: 'hr' as const,
        requestedBy: user?.displayName || user?.email || 'Unknown',
        requestedByEmail: user?.email || 'unknown@example.com',
        teamData: {
          assignedDriver: managementForm.driver,
          assignedSupervisor: managementForm.supervisor,
          assignedWorkers: managementForm.workers,
          // Store driver details with real name
          driverDetails: managementForm.driver ? {
            id: managementForm.driver,
            name: employees.find(emp => emp.id === managementForm.driver)?.name || 'Unknown',
            role: employees.find(emp => emp.id === managementForm.driver)?.position || 'Driver',
            department: employees.find(emp => emp.id === managementForm.driver)?.department || 'Operations'
          } : null,
          // Store supervisor details with real name
          supervisorDetails: managementForm.supervisor ? {
            id: managementForm.supervisor,
            name: employees.find(emp => emp.id === managementForm.supervisor)?.name || 'Unknown',
            role: employees.find(emp => emp.id === managementForm.supervisor)?.position || 'Supervisor',
            department: employees.find(emp => emp.id === managementForm.supervisor)?.department || 'Operations'
          } : null,
          workerDetails: managementForm.workers.map(workerId => {
            const worker = employees.find(emp => emp.id === workerId)
            return {
              id: workerId,
              name: worker?.name || 'Unknown',
              role: worker?.position || 'Worker',
              department: worker?.department || 'Operations'
            }
          })
        }
      }
      
      console.log('Creating HR approval with data:', hrApprovalData)
      
      // Check if createApprovalRequest is available
      if (typeof createApprovalRequest !== 'function') {
        console.error('createApprovalRequest is not available')
        alert('Error: Approval function not available')
        return
      }
      
      const approvalId = await createApprovalRequest(hrApprovalData)
      console.log('HR approval created with ID:', approvalId)
      
      if (!approvalId) {
        console.error('No approval ID returned')
        alert('Error: Failed to create approval request')
        return
      }
      
      // Reset form
      setManagementForm({
        supervisor: '',
        driver: '',
        workers: [],
        materials: [],
        expenses: [],
        totalExpenses: 0,
        newMaterial: { name: '', quantity: 0, unit: '' },
        newExpense: { name: '', description: '', amount: 0 },
        approvalStatus: {
          hr: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' },
          inventory: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' },
          finance: { status: 'pending', approvedBy: '', approvedAt: null, comments: '' }
        }
      })
    } catch (error) {
      console.error('Error saving resource allocation:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      })
      alert(`Failed to save resource allocation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail || 
        !formData.pickupLocation || !formData.destination || !formData.cargoDescription || 
        !formData.estimatedDelivery) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setFormLoading(true)
      
      if (modalMode === 'create') {
        // Create new shipment
        const shipmentData: any = {
          trackingNumber: generateTrackingNumber(),
          serviceType: formData.serviceType,
          status: 'pending',
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          pickupLocation: formData.pickupLocation,
          destination: formData.destination,
          cargoDescription: formData.cargoDescription,
          estimatedDelivery: formData.estimatedDelivery
        }

        // Only add optional fields if they have values
        if (formData.weight && formData.weight.trim()) {
          shipmentData.weight = formData.weight
        }
        if (formData.dimensions && formData.dimensions.trim()) {
          shipmentData.dimensions = formData.dimensions
        }
        if (formData.notes && formData.notes.trim()) {
          shipmentData.notes = formData.notes
        }
        if (formData.assignedDriver && formData.assignedDriver.trim()) {
          shipmentData.assignedDriver = formData.assignedDriver
        }
        if (formData.vehicleNumber && formData.vehicleNumber.trim()) {
          shipmentData.vehicleNumber = formData.vehicleNumber
        }

        console.log('Creating shipment with data:', shipmentData)
        const shipmentId = await addShipment(shipmentData)
        console.log('Shipment created successfully with ID:', shipmentId)
        alert('Shipment created successfully!')
      } else {
        // Update existing shipment
        if (selectedShipment) {
          const updateData: any = {
            serviceType: formData.serviceType,
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerEmail: formData.customerEmail,
            pickupLocation: formData.pickupLocation,
            destination: formData.destination,
            cargoDescription: formData.cargoDescription,
            estimatedDelivery: formData.estimatedDelivery
          }

          // Only add optional fields if they have values
          if (formData.weight && formData.weight.trim()) {
            updateData.weight = formData.weight
          }
          if (formData.dimensions && formData.dimensions.trim()) {
            updateData.dimensions = formData.dimensions
          }
          if (formData.notes && formData.notes.trim()) {
            updateData.notes = formData.notes
          }
          if (formData.assignedDriver && formData.assignedDriver.trim()) {
            updateData.assignedDriver = formData.assignedDriver
          }
          if (formData.vehicleNumber && formData.vehicleNumber.trim()) {
            updateData.vehicleNumber = formData.vehicleNumber
          }

          console.log('Updating shipment with data:', updateData)
          await updateShipment(selectedShipment.id, updateData)
          console.log('Shipment updated successfully')
          alert('Shipment updated successfully!')
        }
      }
      
      closeModal()
      await loadShipments()
    } catch (error) {
      console.error('Error saving shipment:', error)
      
      // Show more specific error message
      if (error instanceof Error) {
        alert(`Error saving shipment: ${error.message}`)
      } else {
        alert('Error saving shipment. Please check the console for details.')
      }
    } finally {
      setFormLoading(false)
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.cargoDescription.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter
    const matchesService = serviceFilter === "all" || shipment.serviceType === serviceFilter
    
    return matchesSearch && matchesStatus && matchesService
  })

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
              <div className="flex items-center justify-between">
                <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Shipment Management</h1>
              <p className="text-slate-600">Track and manage all shipments across all services</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => router.push('/shipments/teams')}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
                  >
                    <User className="h-4 w-4" />
                    Teams
                  </Button>
                  <Button
                    onClick={() => router.push('/shipments/reports')}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <FileText className="h-4 w-4" />
                    Reports
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Shipments</p>
                    <p className="text-2xl font-bold text-slate-900">{shipments.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Ship className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">In Transit</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {shipments.filter(s => s.status === 'in-transit').length}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
                  
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">
                      {shipments.filter(s => s.status === 'delivered').length}
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
                    <p className="text-sm font-medium text-slate-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {shipments.filter(s => s.status === 'pending').length}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
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
                      placeholder="Search by tracking number, customer, or cargo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Services</option>
                    <option value="freight">Freight</option>
                    <option value="moving">Moving</option>
                    <option value="courier">Courier</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={loadShipments}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  <Button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    New Shipment
                  </Button>
                  </div>
                </div>
            </div>

            {/* Shipments Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading shipments...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Tracking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                        </tr>
                      </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredShipments.map((shipment) => (
                        <tr key={shipment.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Package className="h-5 w-5 text-orange-600" />
                              </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{shipment.trackingNumber}</div>
                                <div className="text-sm text-slate-500">{shipment.cargoDescription}</div>
                              </div>
                              </div>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getServiceColor(shipment.serviceType)}`}>
                                {getServiceIcon(shipment.serviceType)}
                                <span className="ml-1 capitalize">{shipment.serviceType}</span>
                            </span>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{shipment.customerName}</div>
                            <div className="text-sm text-slate-500">{shipment.customerEmail}</div>
                            <div className="text-sm text-slate-500">{shipment.customerPhone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-green-600" />
                                  {shipment.pickupLocation}
                                </div>
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1 text-red-600" />
                                  {shipment.destination}
                                </div>
                              </div>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                                {getStatusIcon(shipment.status)}
                              <span className="ml-1 capitalize">{shipment.status.replace('-', ' ')}</span>
                            </span>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatTimestamp(shipment.createdAt)}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Est: {formatTimestamp(shipment.estimatedDelivery)}
                            </div>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => setSelectedShipment(shipment)}
                                className="text-slate-400 hover:text-slate-600"
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              <button 
                                onClick={() => openEditModal(shipment)}
                                className="text-blue-400 hover:text-blue-600"
                                title="Edit shipment"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                                <button 
                                onClick={() => openManagementModal(shipment)}
                                className="text-green-400 hover:text-green-600"
                                  title="Manage shipment"
                                >
                                  <Settings className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              )}
                    
                    {filteredShipments.length === 0 && !dataLoading && (
                <div className="text-center py-12">
                  <Ship className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No shipments found</h3>
                  <p className="text-slate-500">No shipments match your current filters.</p>
                      </div>
                    )}
                  </div>
          </div>
        </main>
      </div>

      {/* Shipment Details Modal */}
      {selectedShipment && !showManagementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Shipment Details</h2>
                  <p className="text-slate-600 mt-1">Tracking: {selectedShipment.trackingNumber}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedShipment(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Name:</span> {selectedShipment.customerName}</div>
                    <div><span className="font-medium">Email:</span> {selectedShipment.customerEmail}</div>
                    <div><span className="font-medium">Phone:</span> {selectedShipment.customerPhone}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Shipment Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Service Type:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getServiceColor(selectedShipment.serviceType)}`}>
                        {getServiceIcon(selectedShipment.serviceType)}
                        <span className="ml-1 capitalize">{selectedShipment.serviceType}</span>
                      </span>
                    </div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedShipment.status)}`}>
                        {getStatusIcon(selectedShipment.status)}
                        <span className="ml-1 capitalize">{selectedShipment.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    <div><span className="font-medium">Created:</span> {formatTimestamp(selectedShipment.createdAt)}</div>
                    <div><span className="font-medium">Estimated Delivery:</span> {formatTimestamp(selectedShipment.estimatedDelivery)}</div>
                    {selectedShipment.actualDelivery && (
                      <div><span className="font-medium">Actual Delivery:</span> {formatTimestamp(selectedShipment.actualDelivery)}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Route Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-green-700 mb-2">Pickup Location</div>
                    <div className="text-slate-700">{selectedShipment.pickupLocation}</div>
                  </div>
                  <div>
                    <div className="font-medium text-red-700 mb-2">Destination</div>
                    <div className="text-slate-700">{selectedShipment.destination}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Cargo Details</h3>
                <div className="space-y-2">
                  <div><span className="font-medium">Description:</span> {selectedShipment.cargoDescription}</div>
                  {selectedShipment.weight && <div><span className="font-medium">Weight:</span> {selectedShipment.weight}</div>}
                  {selectedShipment.dimensions && <div><span className="font-medium">Dimensions:</span> {selectedShipment.dimensions}</div>}
                  {selectedShipment.notes && <div><span className="font-medium">Notes:</span> {selectedShipment.notes}</div>}
                </div>
              </div>

              {selectedShipment.assignedDriver && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Driver Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Assigned Driver:</span> {selectedShipment.assignedDriver}</div>
                    {selectedShipment.vehicleNumber && <div><span className="font-medium">Vehicle Number:</span> {selectedShipment.vehicleNumber}</div>}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowManagementModal(false)
                    setSelectedShipment(null) // Clear the selected shipment to prevent details modal from showing
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Management Modal */}
      {showShipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {modalMode === 'create' ? 'Create New Shipment' : 'Edit Shipment'}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {modalMode === 'create' ? 'Add a new shipment to the system' : `Edit shipment: ${selectedShipment?.trackingNumber}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Service Type *</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                  required
                >
                  <option value="freight">Freight Logistics</option>
                  <option value="moving">Moving Services</option>
                  <option value="courier">Courier Services</option>
                </select>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="+255 717 123 456"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                  placeholder="customer@email.com"
                  required
                />
              </div>

              {/* Route Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Pickup Location *</label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="Enter pickup address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Destination *</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="Enter destination address"
                    required
                  />
                </div>
              </div>

              {/* Cargo Details */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Cargo Description *</label>
                <textarea
                  value={formData.cargoDescription}
                  onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                  rows={3}
                  placeholder="Describe the cargo being shipped"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="e.g., 500kg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Dimensions</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="e.g., 2m x 1m x 1m"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Estimated Delivery *</label>
                  <input
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={(e) => handleInputChange('estimatedDelivery', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Driver & Vehicle Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Assigned Driver</label>
                  <input
                    type="text"
                    value={formData.assignedDriver}
                    onChange={(e) => handleInputChange('assignedDriver', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="Driver name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    placeholder="Vehicle registration number"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                  rows={3}
                  placeholder="Any additional notes or special instructions"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={formLoading}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {modalMode === 'create' ? 'Create Shipment' : 'Update Shipment'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shipment Management Modal */}
      {showManagementModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Resource Allocation</h2>
                  <p className="text-slate-600 mt-1">Tracking: {selectedShipment.trackingNumber}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowManagementModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>
            {/* Render the management form here, passing NO onClose or modal close prop to the form */}
            {/* The modal will only close when the user clicks the close button above */}
            {/* The management form content remains unchanged */}
            <div className="p-6 space-y-6">
              {/* Team Assignment Section */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Team Assignment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Supervisor</label>
                    <select 
                      value={managementForm.supervisor}
                      onChange={(e) => setManagementForm(prev => ({ ...prev, supervisor: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    >
                      <option value="">Select Supervisor</option>
                      {employees
                        .filter(emp => emp.status === 'active' && 
                          ((emp.position && emp.position.toLowerCase().includes('supervisor')) || 
                           (emp.role && emp.role.toLowerCase().includes('supervisor'))))
                        .map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Driver</label>
                    <select 
                      value={managementForm.driver}
                      onChange={(e) => setManagementForm(prev => ({ ...prev, driver: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    >
                      <option value="">Select Driver</option>
                      {employees
                        .filter(emp => emp.status === 'active' && 
                          ((emp.position && emp.position.toLowerCase().includes('driver')) || 
                           (emp.role && emp.role.toLowerCase().includes('driver'))))
                        .map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Workers</label>
                    <select 
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const workerId = e.target.value
                          if (!managementForm.workers.includes(workerId)) {
                            setManagementForm(prev => ({ 
                              ...prev, 
                              workers: [...prev.workers, workerId] 
                            }))
                          }
                          e.target.value = "" // Reset selection
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    >
                      <option value="">Select Workers</option>
                      {employees
                        .filter(emp => emp.status === 'active' && 
                          ((emp.position && emp.position.toLowerCase().includes('worker')) || 
                           (emp.role && emp.role.toLowerCase().includes('worker'))))
                        .filter(emp => !managementForm.workers.includes(emp.id))
                        .map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                    </select>
                    
                    {/* Selected Workers Tags */}
                    {managementForm.workers.length > 0 && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex flex-wrap gap-2">
                          {managementForm.workers.map(workerId => {
                            const worker = employees.find(emp => emp.id === workerId)
                            return worker ? (
                              <div key={workerId} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                <span>{worker.name}</span>
                                <button
                                  type="button"
                                  onClick={() => setManagementForm(prev => ({
                                    ...prev,
                                    workers: prev.workers.filter(id => id !== workerId)
                                  }))}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </div>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show message if no employees found */}
                  {employees.length === 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">No employees found</p>
                          <p className="text-xs text-yellow-600 mt-1">You need to add employees to the HR system first</p>
                        </div>
                        <Button
                          onClick={seedEmployeeData}
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Seed Sample Data
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Materials Management Section */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Materials & Equipment
                </h3>
                <div className="space-y-4">
                  {/* Material Selection from Inventory */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Select Materials from Inventory</label>
                    <select
                      className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      onChange={(e) => {
                        const selectedId = e.target.value
                        if (selectedId) {
                          const selectedItem = inventoryItems.find(item => item.id === selectedId)
                          if (selectedItem && !managementForm.materials.find(m => m.id === selectedId)) {
                            setManagementForm(prev => ({
                              ...prev,
                              materials: [
                                ...prev.materials,
                                {
                                  id: selectedItem.id,
                                  name: selectedItem.name,
                                  quantity: 0,
                                  unit: selectedItem.unit,
                                  available: selectedItem.quantity,
                                  fromInventory: true
                                }
                              ]
                            }))
                          }
                          e.target.value = '' // Reset dropdown
                        }
                      }}
                    >
                      <option value="">Select a material...</option>
                      {inventoryItems
                        .filter(item => item.status === 'in-stock' || item.status === 'low-stock')
                        .filter(item => !managementForm.materials.find(m => m.id === item.id))
                        .map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Selected Materials with Quantity Input */}
                  {managementForm.materials.filter(m => m.fromInventory).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Selected Materials</label>
                      <div className="space-y-2">
                        {managementForm.materials
                          .filter(material => material.fromInventory)
                          .map(material => (
                            <div key={material.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{material.name}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  max={material.available}
                                  placeholder="Qty"
                                  className="w-20 px-2 py-1 text-sm border border-slate-300 rounded"
                                  value={material.quantity || ''}
                                  onChange={(e) => {
                                    const quantity = parseInt(e.target.value) || 0
                                    setManagementForm(prev => ({
                                      ...prev,
                                      materials: prev.materials.map(m => 
                                        m.id === material.id 
                                          ? { ...m, quantity: quantity }
                                          : m
                                      )
                                    }))
                                  }}
                                />
                                <span className="text-xs text-slate-500">{material.unit}</span>
                                <button
                                  onClick={() => setManagementForm(prev => ({
                                    ...prev,
                                    materials: prev.materials.filter(m => m.id !== material.id)
                                  }))}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Manual Material Entry */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-slate-900 mb-2">Add Custom Materials</label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Material name"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          value={managementForm.newMaterial.name || ''}
                          onChange={(e) => setManagementForm(prev => ({
                            ...prev,
                            newMaterial: { ...prev.newMaterial, name: e.target.value }
                          }))}
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          value={managementForm.newMaterial.quantity || ''}
                          onChange={(e) => setManagementForm(prev => ({
                            ...prev,
                            newMaterial: { ...prev.newMaterial, quantity: parseInt(e.target.value) || 0 }
                          }))}
                        />
                        <input
                          type="text"
                          placeholder="Unit (pcs, kg, etc.)"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          value={managementForm.newMaterial.unit || ''}
                          onChange={(e) => setManagementForm(prev => ({
                            ...prev,
                            newMaterial: { ...prev.newMaterial, unit: e.target.value }
                          }))}
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (managementForm.newMaterial.name && managementForm.newMaterial.quantity > 0 && managementForm.newMaterial.unit) {
                            setManagementForm(prev => ({
                              ...prev,
                              materials: [
                                ...prev.materials,
                                {
                                  id: `custom-${Date.now()}`,
                                  name: prev.newMaterial.name,
                                  quantity: prev.newMaterial.quantity,
                                  unit: prev.newMaterial.unit,
                                  available: 0,
                                  fromInventory: false
                                }
                              ],
                              newMaterial: { name: '', quantity: 0, unit: '' }
                            }))
                          }
                        }}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                      >
                        Add Material
                      </button>
                    </div>
                  </div>

                  {/* Custom Materials List */}
                  {managementForm.materials.filter(m => !m.fromInventory).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Custom Materials</label>
                      <div className="space-y-2">
                        {managementForm.materials
                          .filter(material => !material.fromInventory)
                          .map(material => (
                            <div key={material.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <span className="font-medium">{material.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">
                                  {material.quantity} {material.unit}
                                </span>
                                <button
                                  onClick={() => setManagementForm(prev => ({
                                    ...prev,
                                    materials: prev.materials.filter(m => m.id !== material.id)
                                  }))}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expenses Management Section */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Expenses
                </h3>
                <div className="space-y-4">
                  {/* Add New Expense */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-slate-900 mb-2">Add New Expense</label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Expense name"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          value={managementForm.newExpense.name || ''}
                          onChange={(e) => setManagementForm(prev => ({
                            ...prev,
                            newExpense: { ...prev.newExpense, name: e.target.value }
                          }))}
                        />
                        <input
                          type="text"
                          placeholder="Explanation"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          value={managementForm.newExpense.description || ''}
                          onChange={(e) => setManagementForm(prev => ({
                            ...prev,
                            newExpense: { ...prev.newExpense, description: e.target.value }
                          }))}
                        />
                        <input
                          type="number"
                          placeholder="Cost (TZS)"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                          value={managementForm.newExpense.amount || ''}
                          onChange={(e) => setManagementForm(prev => ({
                            ...prev,
                            newExpense: { ...prev.newExpense, amount: parseFloat(e.target.value) || 0 }
                          }))}
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (managementForm.newExpense.name && managementForm.newExpense.amount > 0) {
                            setManagementForm(prev => ({
                              ...prev,
                              expenses: [
                                ...prev.expenses,
                                {
                                  id: `expense-${Date.now()}`,
                                  name: prev.newExpense.name,
                                  description: prev.newExpense.description,
                                  amount: prev.newExpense.amount
                                }
                              ],
                              newExpense: { name: '', description: '', amount: 0 }
                            }))
                          }
                        }}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                      >
                        Add Expense
                      </button>
                    </div>
                  </div>

                  {/* Expenses List */}
                  {managementForm.expenses.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Expenses List</label>
                      <div className="space-y-2">
                        {managementForm.expenses.map(expense => (
                          <div key={expense.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{expense.name}</div>
                              {expense.description && (
                                <div className="text-xs text-slate-600 mt-1">{expense.description}</div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                TZS {expense.amount.toLocaleString()}
                              </span>
                              <button
                                onClick={() => setManagementForm(prev => ({
                                  ...prev,
                                  expenses: prev.expenses.filter(e => e.id !== expense.id)
                                }))}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total Expenses */}
                  {managementForm.expenses.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Total Expenses</label>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-lg font-bold text-green-900">
                          TZS {managementForm.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Approval Request Section */}
            <div className="bg-slate-50 rounded-xl p-6 mx-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Request Approvals
              </h3>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-4">
                  Send approval requests to HR, Inventory Manager, and Financial Manager for this resource allocation.
                </p>
                <Button
                  onClick={handleSaveResourceAllocation}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Request All Approvals
                </Button>
              </div>
              {/* Approval Status Section - Simple Row */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Approval Status
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* HR Approval */}
                  <div className="flex-1">
                    <span className="font-medium">HR Department: </span>
                    <Badge className={`text-xs ${managementForm.approvalStatus.hr.status === 'pending' ? 'bg-orange-100 text-orange-800 border-orange-200' : managementForm.approvalStatus.hr.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : managementForm.approvalStatus.hr.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}`}>
                      {managementForm.approvalStatus.hr.status === 'approved' ? 'Approved' : managementForm.approvalStatus.hr.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                    <span className="ml-2 text-sm text-slate-600">
                      {managementForm.approvalStatus.hr.status === 'pending' && <span className="text-orange-600 font-medium">Awaiting approval</span>}
                      {managementForm.approvalStatus.hr.status === 'approved' && `Approved by ${managementForm.approvalStatus.hr.approvedBy || 'HR Manager'}`}
                      {managementForm.approvalStatus.hr.status === 'rejected' && `Rejected by ${managementForm.approvalStatus.hr.approvedBy || 'HR Manager'}`}
                    </span>
                    {managementForm.approvalStatus.hr.comments && (
                      <span className="ml-2 text-xs text-slate-500 italic">"{managementForm.approvalStatus.hr.comments}"</span>
                    )}
                  </div>
                  {/* Inventory Approval */}
                  <div className="flex-1">
                    <span className="font-medium">Inventory Manager: </span>
                    <Badge className={`text-xs ${managementForm.approvalStatus.inventory.status === 'pending' ? 'bg-orange-100 text-orange-800 border-orange-200' : managementForm.approvalStatus.inventory.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : managementForm.approvalStatus.inventory.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}`}>
                      {managementForm.approvalStatus.inventory.status === 'approved' ? 'Approved' : managementForm.approvalStatus.inventory.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                    <span className="ml-2 text-sm text-slate-600">
                      {managementForm.approvalStatus.inventory.status === 'pending' && <span className="text-orange-600 font-medium">Awaiting approval</span>}
                      {managementForm.approvalStatus.inventory.status === 'approved' && `Approved by ${managementForm.approvalStatus.inventory.approvedBy || 'Inventory Manager'}`}
                      {managementForm.approvalStatus.inventory.status === 'rejected' && `Rejected by ${managementForm.approvalStatus.inventory.approvedBy || 'Inventory Manager'}`}
                    </span>
                    {managementForm.approvalStatus.inventory.comments && (
                      <span className="ml-2 text-xs text-slate-500 italic">"{managementForm.approvalStatus.inventory.comments}"</span>
                    )}
                  </div>
                  {/* Finance Approval */}
                  <div className="flex-1">
                    <span className="font-medium">Financial Manager: </span>
                    <Badge className={`text-xs ${managementForm.approvalStatus.finance.status === 'pending' ? 'bg-orange-100 text-orange-800 border-orange-200' : managementForm.approvalStatus.finance.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : managementForm.approvalStatus.finance.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}`}>
                      {managementForm.approvalStatus.finance.status === 'approved' ? 'Approved' : managementForm.approvalStatus.finance.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                    <span className="ml-2 text-sm text-slate-600">
                      {managementForm.approvalStatus.finance.status === 'pending' && <span className="text-orange-600 font-medium">Awaiting approval</span>}
                      {managementForm.approvalStatus.finance.status === 'approved' && `Approved by ${managementForm.approvalStatus.finance.approvedBy || 'Financial Manager'}`}
                      {managementForm.approvalStatus.finance.status === 'rejected' && `Rejected by ${managementForm.approvalStatus.finance.approvedBy || 'Financial Manager'}`}
                    </span>
                    {managementForm.approvalStatus.finance.comments && (
                      <span className="ml-2 text-xs text-slate-500 italic">"{managementForm.approvalStatus.finance.comments}"</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Action Buttons */}
            <div className="flex justify-end gap-3 p-6 border-t bg-slate-50">
              <Button
                variant="outline"
                onClick={() => {
                  setShowManagementModal(false)
                  setSelectedShipment(null) // Clear the selected shipment to prevent details modal from showing
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleSaveResourceAllocation}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}