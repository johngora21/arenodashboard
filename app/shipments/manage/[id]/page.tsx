'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Truck, 
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Users,
  Clock,
  Box,
  DollarSign,
  Settings,
  User,
  Wrench,
  Shield,
  MapPin,
  FileText,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  Car,
  Building,
  Tool,
  ShoppingCart,
  ChevronDown,
  Send,
  History
} from 'lucide-react'
import { 
  getAllShipments, 
  getShipmentById, 
  updateShipment,
  getAllEmployees,
  getAllInventoryItems,
  getAllTransactions,
  createApprovalRequest,
  getApprovalHistory
} from "@/lib/firebase-service"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface CourierForm {
  assignedDriver: string
  assignedAgent: string
  pickupTime: string
  deliveryTime: string
  vehicleNumber: string
  notes: string
}

interface MovingForm {
  assignedDriver: string
  assignedSupervisor: string
  assignedWorkers: string[]
  materials: string[]
  additionalMaterials: string
  laborCost: string
  materialCost: string
  fuelCost: string
  otherExpenses: string
  startDate: string
  endDate: string
  notes: string
  materialQuantities: { [key: string]: number }
}

interface Worker {
  id: string
  name: string
  role: string
  department: string
  status: string
}

interface Material {
  id: string
  name: string
  category: string
  available: number
  unit: string
}

export default function ShipmentManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const shipmentId = params.id as string

  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  const [courierForm, setCourierForm] = useState<CourierForm>({
    assignedDriver: '',
    assignedAgent: '',
    pickupTime: '',
    deliveryTime: '',
    vehicleNumber: '',
    notes: ''
  })

  const [movingForm, setMovingForm] = useState<MovingForm>({
    assignedDriver: '',
    assignedSupervisor: '',
    assignedWorkers: [],
    materials: [],
    additionalMaterials: '',
    laborCost: '',
    materialCost: '',
    fuelCost: '',
    otherExpenses: '',
    startDate: '',
    endDate: '',
    notes: '',
    materialQuantities: {}
  })

  const [workers, setWorkers] = useState<Worker[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<{[key: string]: number}>({})
  const [expenses, setExpenses] = useState<{[key: string]: number}>({})
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' })
  const [materialSearch, setMaterialSearch] = useState('')
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('')
  
  // Approval states
  const [pendingApprovals, setPendingApprovals] = useState({
    team: false,
    materials: false,
    expenses: false
  })
  const [approvalStatus, setApprovalStatus] = useState({
    team: 'pending', // pending, approved, rejected
    materials: 'pending',
    expenses: 'pending'
  })

  const [approvalHistory, setApprovalHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load approval history
  const loadApprovalHistory = async () => {
    try {
      const history = await getApprovalHistory(shipmentId)
      setApprovalHistory(history)
    } catch (error) {
      console.error('Error loading approval history:', error)
    }
  }

  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      router.push('/login')
      return
    }

    if (true) { // Temporarily disabled authentication
      loadData()
    }
  }, [user, loading])

  const loadData = async () => {
    try {
      setDataLoading(true)
      console.log('Loading shipment with ID:', shipmentId)
      
      // Use the existing getShipmentById function
      const shipmentData = await getShipmentById(shipmentId)
      console.log('Shipment data:', shipmentData)
      
      if (shipmentData) {
        setShipment(shipmentData)
        
        // Load existing management data if available
        if (shipmentData.managementData) {
          setSelectedWorkers(shipmentData.managementData.assignedWorkers || [])
          setSelectedMaterials(shipmentData.managementData.materials || {})
          setExpenses(shipmentData.managementData.expenses || {})
        }
      } else {
        console.log('Shipment not found in database')
      }

      // Load employees for assignment
      const employeesData = await getAllEmployees()
      setEmployees(employeesData)

      // Load inventory items for materials
      const inventoryData = await getAllInventoryItems()
      setInventoryItems(inventoryData)

      setDataLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setDataLoading(false)
    }
  }

  const handleCourierFormChange = (field: keyof CourierForm, value: any) => {
    setCourierForm(prev => ({
      ...prev,
      [field]: value === 'none' ? '' : value
    }))
  }

  const handleMovingFormChange = (field: keyof MovingForm, value: any) => {
    setMovingForm(prev => ({
      ...prev,
      [field]: value === 'none' ? '' : value
    }))
  }

  const handleWorkerSelection = (workerId: string, checked: boolean) => {
    setMovingForm(prev => ({
      ...prev,
      assignedWorkers: checked 
        ? [...prev.assignedWorkers, workerId]
        : prev.assignedWorkers.filter(id => id !== workerId)
    }))
  }

  const handleWorkerToggle = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    )
  }

  const handleMaterialQuantityChange = (materialId: string, quantity: number) => {
    setMovingForm(prev => ({
      ...prev,
      materialQuantities: {
        ...prev.materialQuantities,
        [materialId]: quantity
      }
    }))
  }

  const addMaterialToSelection = () => {
    if (selectedMaterialId && !movingForm.materials.includes(selectedMaterialId)) {
      const material = getMovingMaterials().find(m => m.id === selectedMaterialId)
      if (material) {
        setMovingForm(prev => ({
          ...prev,
          materials: [...prev.materials, selectedMaterialId],
          materialQuantities: {
            ...prev.materialQuantities,
            [selectedMaterialId]: 1
          }
        }))
        setSelectedMaterialId('')
      }
    }
  }

  const removeMaterialFromSelection = (materialId: string) => {
    setMovingForm(prev => ({
      ...prev,
      materials: prev.materials.filter(id => id !== materialId),
      materialQuantities: {
        ...prev.materialQuantities,
        [materialId]: undefined
      }
    }))
  }

  const requestTeamApproval = async () => {
    if (selectedWorkers.length > 0 || movingForm.assignedDriver || movingForm.assignedSupervisor) {
      setPendingApprovals(prev => ({ ...prev, team: true }))
      setApprovalStatus(prev => ({ ...prev, team: 'pending' }))

      try {
        // Get worker details
        const workers = getWorkers()
        const selectedWorkerDetails = workers.filter(w => selectedWorkers.includes(w.id))
        
        await createApprovalRequest({
          shipmentId,
          shipmentNumber: shipment?.trackingNumber || 'Unknown',
          requestType: 'team',
          department: 'hr',
          requestedBy: user?.email || 'Unknown',
          requestedByEmail: user?.email || 'Unknown',
          teamData: {
            assignedDriver: movingForm.assignedDriver,
            assignedSupervisor: movingForm.assignedSupervisor,
            assignedWorkers: selectedWorkers,
            workerDetails: selectedWorkerDetails.map(w => ({
              id: w.id,
              name: w.name,
              role: w.role,
              department: w.department
            }))
          }
        })
        alert('Team assignment approval request sent!')
        await loadApprovalHistory() // Refresh history
      } catch (error) {
        console.error('Error sending team approval request:', error)
        alert('Error sending team approval request')
      }
    }
  }

  const requestMaterialsApproval = async () => {
    if (movingForm.materials.length > 0) {
      setPendingApprovals(prev => ({ ...prev, materials: true }))
      setApprovalStatus(prev => ({ ...prev, materials: 'pending' }))

      try {
        // Get material details
        const materials = getMovingMaterials()
        const selectedMaterialDetails = materials.filter(m => movingForm.materials.includes(m.id))
        
        await createApprovalRequest({
          shipmentId,
          shipmentNumber: shipment?.trackingNumber || 'Unknown',
          requestType: 'materials',
          department: 'inventory',
          requestedBy: user?.email || 'Unknown',
          requestedByEmail: user?.email || 'Unknown',
          materialsData: {
            materials: selectedMaterialDetails.map(m => ({
              id: m.id,
              name: m.name,
              quantity: movingForm.materialQuantities[m.id] || 0,
              unit: m.unit,
              available: m.available
            })),
            totalMaterials: movingForm.materials.length
          }
        })
        alert('Materials approval request sent!')
        await loadApprovalHistory() // Refresh history
      } catch (error) {
        console.error('Error sending materials approval request:', error)
        alert('Error sending materials approval request')
      }
    }
  }

  const requestExpensesApproval = async () => {
    if (Object.keys(expenses).length > 0) {
      setPendingApprovals(prev => ({ ...prev, expenses: true }))
      setApprovalStatus(prev => ({ ...prev, expenses: 'pending' }))

      try {
        const expenseEntries = Object.entries(expenses).map(([description, amount]) => ({
          description,
          amount: parseFloat(amount.toString()),
          category: 'shipment_expenses'
        }))
        
        await createApprovalRequest({
          shipmentId,
          shipmentNumber: shipment?.trackingNumber || 'Unknown',
          requestType: 'expenses',
          department: 'finance',
          requestedBy: user?.email || 'Unknown',
          requestedByEmail: user?.email || 'Unknown',
          expensesData: {
            expenses: expenseEntries,
            totalAmount: expenseEntries.reduce((sum, exp) => sum + exp.amount, 0)
          }
        })
        alert('Expenses approval request sent!')
        await loadApprovalHistory() // Refresh history
      } catch (error) {
        console.error('Error sending expenses approval request:', error)
        alert('Error sending expenses approval request')
      }
    }
  }

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses(prev => ({
        ...prev,
        [newExpense.description]: parseFloat(newExpense.amount)
      }))
      setNewExpense({ description: '', amount: '' })
    }
  }

  const removeExpense = (description: string) => {
    setExpenses(prev => {
      const newExpenses = { ...prev }
      delete newExpenses[description]
      return newExpenses
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      if (!shipment) return

      // Use the existing updateShipment function
      await updateShipment(shipment.id, {
        managementData: {
          assignedWorkers: selectedWorkers,
          materials: selectedMaterials,
          expenses: expenses
        }
      })
      
      await loadData()
      alert('Management data saved successfully!')
    } catch (error) {
      console.error('Error saving management data:', error)
      alert('Error saving management data')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDrivers = () => {
    return employees.filter(emp => 
      emp.position.toLowerCase().includes('driver') || 
      emp.role.toLowerCase().includes('driver')
    )
  }

  const getAgents = () => {
    return employees.filter(emp => 
      emp.position.toLowerCase().includes('agent') || 
      emp.role.toLowerCase().includes('agent')
    )
  }

  const getSupervisors = () => {
    return employees.filter(emp => 
      emp.position.toLowerCase().includes('supervisor') || 
      emp.role.toLowerCase().includes('supervisor') ||
      emp.role.toLowerCase().includes('manager')
    )
  }

  const getWorkers = () => {
    return employees.filter(emp => 
      emp.position.toLowerCase().includes('worker') || 
      emp.role.toLowerCase().includes('worker') ||
      emp.role.toLowerCase().includes('loader')
    )
  }

  const getMovingMaterials = () => {
    return inventoryItems.filter(item => 
      item.category.toLowerCase().includes('packaging') ||
      item.category.toLowerCase().includes('safety') ||
      item.category.toLowerCase().includes('tools') ||
      item.name.toLowerCase().includes('box') ||
      item.name.toLowerCase().includes('bubble') ||
      item.name.toLowerCase().includes('tape') ||
      item.name.toLowerCase().includes('rope') ||
      item.name.toLowerCase().includes('blanket')
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading shipment data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-0">
          <Header />
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-2 text-lg text-slate-600">Loading shipment...</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-0">
          <Header />
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Shipment Not Found</h1>
                <p className="text-slate-600 mb-4">The shipment you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => router.push('/shipments')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shipments
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0)

  const canRequestApprovals = () => {
    return (
      (selectedWorkers.length > 0 || movingForm.assignedDriver || movingForm.assignedSupervisor) &&
      movingForm.materials.length > 0 &&
      Object.keys(expenses).length > 0
    );
  };

  const requestAllApprovals = async () => {
    await requestTeamApproval();
    await requestMaterialsApproval();
    await requestExpensesApproval();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <Header />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Button 
                    variant="ghost" 
                    onClick={() => router.push('/shipments')}
                    className="mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shipments
                  </Button>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Shipment Management</h1>
                  <p className="text-slate-600">Manage shipment: {shipment.trackingNumber}</p>
                </div>
                <div className="flex gap-2">
                  {/* Refresh button removed */}
                </div>
              </div>
            </div>

            {/* Shipment Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Shipment Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tracking Number:</p>
                  <p className="text-lg font-semibold text-slate-900">{shipment.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Service Type:</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{shipment.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Customer:</p>
                  <p className="text-lg font-semibold text-slate-900">{shipment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Status:</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    shipment.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Pickup:</p>
                  <p className="text-lg font-semibold text-slate-900">{shipment.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Destination:</p>
                  <p className="text-lg font-semibold text-slate-900">{shipment.destination}</p>
                </div>
              </div>
            </div>

            {/* Management Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {shipment.serviceType === 'courier' ? 'Courier Assignment' : 'Moving Assignment'}
              </h2>
              
              {shipment.serviceType === 'courier' ? (
                // Courier Management Form
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                  {/* Courier Assignment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Courier Assignment
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Assigned Driver
                        </label>
                        <Select 
                          value={courierForm.assignedDriver} 
                          onValueChange={(value) => handleCourierFormChange('assignedDriver', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select nearest driver" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No driver assigned</SelectItem>
                            {getDrivers().map(driver => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name} - {driver.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Assigned Agent
                        </label>
                        <Select 
                          value={courierForm.assignedAgent} 
                          onValueChange={(value) => handleCourierFormChange('assignedAgent', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select nearest agent" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No agent assigned</SelectItem>
                            {getAgents().map(agent => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name} - {agent.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Vehicle Number
                        </label>
                        <Input
                          type="text"
                          value={courierForm.vehicleNumber}
                          onChange={(e) => handleCourierFormChange('vehicleNumber', e.target.value)}
                          placeholder="Enter vehicle registration number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-500" />
                      Schedule
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Pickup Time
                        </label>
                        <Input
                          type="datetime-local"
                          value={courierForm.pickupTime}
                          onChange={(e) => handleCourierFormChange('pickupTime', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Delivery Time
                        </label>
                        <Input
                          type="datetime-local"
                          value={courierForm.deliveryTime}
                          onChange={(e) => handleCourierFormChange('deliveryTime', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      Additional Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes
                      </label>
                      <Textarea
                        value={courierForm.notes}
                        onChange={(e) => handleCourierFormChange('notes', e.target.value)}
                        placeholder="Any additional notes or special instructions..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/shipments')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Assignment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                // Moving Management Form
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                  {/* Team Assignment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Team Assignment
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Assigned Driver
                        </label>
                        <Select 
                          value={movingForm.assignedDriver} 
                          onValueChange={(value) => handleMovingFormChange('assignedDriver', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select driver" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No driver assigned</SelectItem>
                            {getDrivers().map(driver => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Assigned Supervisor
                        </label>
                        <Select 
                          value={movingForm.assignedSupervisor} 
                          onValueChange={(value) => handleMovingFormChange('assignedSupervisor', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select supervisor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No supervisor assigned</SelectItem>
                            {getSupervisors().map(supervisor => (
                              <SelectItem key={supervisor.id} value={supervisor.id}>
                                {supervisor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Assigned Workers
                      </label>
                      <Select
                        multiple
                        value={selectedWorkers}
                        onValueChange={(value) => setSelectedWorkers(value)}
                      >
                        <SelectTrigger className="w-64 min-w-40 max-w-xs">
                          <SelectValue>
                            {selectedWorkers.length === 0
                              ? 'Select workers'
                              : getWorkers()
                                  .filter(w => selectedWorkers.includes(w.id))
                                  .map(w => w.name)
                                  .join(', ')
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-48 overflow-y-auto">
                          {getWorkers().map(worker => (
                            <SelectItem key={worker.id} value={worker.id}>
                              {worker.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Vertical list of selected workers */}
                      <div className="mt-2 bg-slate-50 border border-slate-200 rounded p-2 min-h-[40px]">
                        {selectedWorkers.length === 0 ? (
                          <span className="text-xs text-slate-400">No workers assigned</span>
                        ) : (
                          <ul className="space-y-1">
                            {getWorkers()
                              .filter(w => selectedWorkers.includes(w.id))
                              .map(w => (
                                <li key={w.id} className="text-sm text-slate-700">
                                  {w.name}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                      
                      {/* Team Approval Button */}
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={requestTeamApproval}
                          disabled={selectedWorkers.length === 0 && !movingForm.assignedDriver && !movingForm.assignedSupervisor}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Request HR Approval
                        </Button>
                        {pendingApprovals.team && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Pending HR Approval
                          </Badge>
                        )}
                        {approvalStatus.team === 'approved' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Approved by HR
                          </Badge>
                        )}
                        {approvalStatus.team === 'rejected' && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Rejected by HR
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Box className="h-5 w-5 text-purple-500" />
                      Materials from Inventory
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Materials and Quantities
                      </label>
                      
                      {/* Material Selection Dropdown */}
                      <div className="flex gap-2 mb-3">
                        <Select
                          value={selectedMaterialId}
                          onValueChange={setSelectedMaterialId}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select a material to add" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <Input
                                placeholder="Search materials..."
                                value={materialSearch}
                                onChange={(e) => setMaterialSearch(e.target.value)}
                                className="w-full mb-2"
                              />
                            </div>
                            {getMovingMaterials()
                              .filter(material => 
                                !movingForm.materials.includes(material.id) &&
                                material.name.toLowerCase().includes(materialSearch.toLowerCase())
                              )
                              .map(material => (
                                <SelectItem key={material.id} value={material.id}>
                                  {material.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={addMaterialToSelection}
                          disabled={!selectedMaterialId}
                          size="sm"
                          className="px-4"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Selected Materials Container */}
                      <div className="border border-slate-200 rounded-lg p-3 min-h-[100px] bg-slate-50">
                        {movingForm.materials.length === 0 ? (
                          <div className="text-center text-slate-500 text-sm py-4">
                            No materials selected. Use the dropdown above to add materials.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {movingForm.materials.map(materialId => {
                              const material = getMovingMaterials().find(m => m.id === materialId)
                              if (!material) return null
                              
                              return (
                                <div key={materialId} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-slate-800">{material.name}</div>
                                    <div className="text-xs text-slate-500">
                                      Available: {material.quantity} {material.unit}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs text-slate-600">Quantity:</label>
                                    <Input
                                      type="number"
                                      min="1"
                                      max={material.quantity}
                                      value={movingForm.materialQuantities?.[materialId] || 1}
                                      onChange={(e) => handleMaterialQuantityChange(materialId, parseInt(e.target.value) || 1)}
                                      className="w-20 h-8 text-xs"
                                    />
                                    <span className="text-xs text-slate-500">{material.unit}</span>
                                    <Button
                                      type="button"
                                      onClick={() => removeMaterialFromSelection(materialId)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    >
                                      ×
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      
                      {/* Materials Approval Button */}
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={requestMaterialsApproval}
                          disabled={movingForm.materials.length === 0}
                          size="sm"
                          variant="outline"
                          className="text-purple-600 border-purple-600 hover:bg-purple-50"
                        >
                          <Box className="h-4 w-4 mr-2" />
                          Request Inventory Approval
                        </Button>
                        {pendingApprovals.materials && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Pending Inventory Approval
                          </Badge>
                        )}
                        {approvalStatus.materials === 'approved' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Approved by Inventory
                          </Badge>
                        )}
                        {approvalStatus.materials === 'rejected' && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Rejected by Inventory
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Additional Materials (Manual Input)
                      </label>
                      <Textarea
                        value={movingForm.additionalMaterials}
                        onChange={(e) => handleMovingFormChange('additionalMaterials', e.target.value)}
                        placeholder="Enter any additional materials not in inventory..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Expenses
                    </h3>
                    
                    <div className="space-y-2">
                      {/* Add New Expense */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Expense description"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Amount (TZS)"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                          className="w-32"
                        />
                        <Button onClick={addExpense} size="sm" className="bg-orange-500 hover:bg-orange-600">
                          Add
                        </Button>
                      </div>

                      {/* Expense List */}
                      {Object.entries(expenses).length > 0 && (
                        <div className="space-y-2">
                          {Object.entries(expenses).map(([description, amount]) => (
                            <div key={description} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                              <span className="text-sm font-medium text-slate-800">{description}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold text-green-600">
                                  {amount.toLocaleString()} TZS
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExpense(description)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="border-t border-slate-200 my-3"></div>
                          <div className="flex justify-between items-center font-semibold text-slate-800">
                            <span>Total Expenses:</span>
                            <span className="text-green-600">{totalExpenses.toLocaleString()} TZS</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Expenses Approval Button */}
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={requestExpensesApproval}
                          disabled={Object.keys(expenses).length === 0}
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Request Finance Approval
                        </Button>
                        {pendingApprovals.expenses && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Pending Finance Approval
                          </Badge>
                        )}
                        {approvalStatus.expenses === 'approved' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Approved by Finance
                          </Badge>
                        )}
                        {approvalStatus.expenses === 'rejected' && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Rejected by Finance
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      Schedule
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={movingForm.startDate}
                          onChange={(e) => handleMovingFormChange('startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={movingForm.endDate}
                          onChange={(e) => handleMovingFormChange('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      Additional Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes
                      </label>
                      <Textarea
                        value={movingForm.notes}
                        onChange={(e) => handleMovingFormChange('notes', e.target.value)}
                        placeholder="Any additional notes or special instructions..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/shipments')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Assignment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Request All Approvals Button */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Request Approvals</h2>
                  <p className="text-sm text-slate-600">Send approval requests to HR, Inventory, and Finance departments</p>
                </div>
                <Button
                  onClick={() => {
                    requestTeamApproval()
                    requestMaterialsApproval()
                    requestExpensesApproval()
                  }}
                  disabled={
                    (selectedWorkers.length === 0 && !movingForm.assignedDriver && !movingForm.assignedSupervisor) &&
                    movingForm.materials.length === 0 &&
                    Object.keys(expenses).length === 0
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Request All Approvals
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">HR Approval</span>
                  </div>
                  <p className="text-blue-700">
                    {selectedWorkers.length > 0 || movingForm.assignedDriver || movingForm.assignedSupervisor 
                      ? 'Team assignment ready for approval' 
                      : 'No team assigned'}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Box className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Inventory Approval</span>
                  </div>
                  <p className="text-purple-700">
                    {movingForm.materials.length > 0 
                      ? `${movingForm.materials.length} materials ready for approval` 
                      : 'No materials selected'}
                  </p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Finance Approval</span>
                  </div>
                  <p className="text-green-700">
                    {Object.keys(expenses).length > 0 
                      ? `${Object.keys(expenses).length} expenses ready for approval` 
                      : 'No expenses added'}
                  </p>
                </div>
              </div>
            </div>

            {/* Approval Status Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Approval Status</h2>
              
              <div className="space-y-4">
                {/* HR Approval */}
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-slate-900">Team Assignment</h3>
                      <p className="text-sm text-slate-600">HR Manager approval required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {approvalStatus.team === 'pending' && !pendingApprovals.team && (
                      <Button size="sm" variant="outline" disabled>
                        Not Requested
                      </Button>
                    )}
                    {pendingApprovals.team && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Pending HR Approval
                      </Badge>
                    )}
                    {approvalStatus.team === 'approved' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Approved by HR
                      </Badge>
                    )}
                    {approvalStatus.team === 'rejected' && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Rejected by HR
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Inventory Approval */}
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="font-medium text-slate-900">Materials</h3>
                      <p className="text-sm text-slate-600">Inventory Manager approval required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {approvalStatus.materials === 'pending' && !pendingApprovals.materials && (
                      <Button size="sm" variant="outline" disabled>
                        Not Requested
                      </Button>
                    )}
                    {pendingApprovals.materials && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Pending Inventory Approval
                      </Badge>
                    )}
                    {approvalStatus.materials === 'approved' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Approved by Inventory
                      </Badge>
                    )}
                    {approvalStatus.materials === 'rejected' && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Rejected by Inventory
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Finance Approval */}
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-medium text-slate-900">Expenses</h3>
                      <p className="text-sm text-slate-600">Finance Manager approval required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {approvalStatus.expenses === 'pending' && !pendingApprovals.expenses && (
                      <Button size="sm" variant="outline" disabled>
                        Not Requested
                      </Button>
                    )}
                    {pendingApprovals.expenses && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Pending Finance Approval
                      </Badge>
                    )}
                    {approvalStatus.expenses === 'approved' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Approved by Finance
                      </Badge>
                    )}
                    {approvalStatus.expenses === 'rejected' && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Rejected by Finance
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Approval History */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Approval History
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="ml-auto"
                  >
                    {showHistory ? 'Hide' : 'Show'} History
                  </Button>
                </CardTitle>
              </CardHeader>
              {showHistory && (
                <CardContent>
                  {approvalHistory.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No approval history found</p>
                  ) : (
                    <div className="space-y-4">
                      {approvalHistory.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{item.requestType} - {item.department}</p>
                              <p className="text-sm text-muted-foreground">
                                Requested by {item.requestedBy} on {new Date(item.requestedAt?.toDate()).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={item.status === 'approved' ? 'default' : item.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          {item.status === 'approved' && (
                            <p className="text-sm text-green-600">
                              Approved by {item.approvedBy} on {new Date(item.approvedAt?.toDate()).toLocaleDateString()}
                            </p>
                          )}
                          
                          {item.status === 'rejected' && (
                            <div>
                              <p className="text-sm text-red-600">
                                Rejected by {item.rejectedBy} on {new Date(item.rejectedAt?.toDate()).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-red-600">Reason: {item.rejectionReason}</p>
                            </div>
                          )}
                          
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-2">Notes: {item.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
} 