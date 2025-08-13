"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Users,
  FileText,
  TrendingUp,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Box,
  Wrench,
  Shirt,
  Megaphone,
  Receipt,
  DollarSign,
  BarChart3,
  X,
  XCircle
} from "lucide-react"
// Mock data types - replace with MySQL types later
interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  description: string
  supplier: string
  unit: string
  quantity: number
  minQuantity: number
  maxQuantity: number
  unitPrice: number
  location: string
  status: string
  lastUpdated: Date
}

interface InventoryStats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  categories: number
}

interface InventoryCategory {
  id: string
  name: string
  description: string
  itemCount: number
}
import { Badge } from "@/components/ui/badge"

interface NewInventoryForm {
  name: string
  sku: string
  category: string
  description: string
  supplier: string
  unit: string
  quantity: string
  minQuantity: string
  maxQuantity: string
  unitPrice: string
  location: string
}

export default function InventoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Mock data
  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Laptop Dell XPS 13',
      sku: 'LAP-001',
      category: 'Electronics',
      description: 'High-performance laptop for development',
      supplier: 'Dell Technologies',
      unit: 'piece',
      quantity: 15,
      minQuantity: 5,
      maxQuantity: 50,
      unitPrice: 1200,
      location: 'Warehouse A, Shelf 1',
      status: 'active',
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Office Chair',
      sku: 'FUR-001',
      category: 'Furniture',
      description: 'Ergonomic office chair',
      supplier: 'Office Supplies Co',
      unit: 'piece',
      quantity: 8,
      minQuantity: 3,
      maxQuantity: 20,
      unitPrice: 250,
      location: 'Warehouse B, Shelf 2',
      status: 'active',
      lastUpdated: new Date()
    }
  ]

  const mockCategories: InventoryCategory[] = [
    { id: '1', name: 'Electronics', description: 'Computers and electronic devices', itemCount: 15 },
    { id: '2', name: 'Furniture', description: 'Office furniture and equipment', itemCount: 8 },
    { id: '3', name: 'Office Supplies', description: 'General office supplies', itemCount: 25 }
  ]

  // Mock functions
  const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockInventoryItems), 500))
  }

  const getInventoryStats = async (): Promise<InventoryStats> => {
    return new Promise(resolve => setTimeout(() => resolve({
      totalItems: mockInventoryItems.length,
      totalValue: mockInventoryItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      lowStockItems: mockInventoryItems.filter(item => item.quantity <= item.minQuantity).length,
      outOfStockItems: mockInventoryItems.filter(item => item.quantity === 0).length,
      categories: mockCategories.length
    }), 500))
  }

  const getAllInventoryCategories = async (): Promise<InventoryCategory[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockCategories), 300))
  }

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newItem: InventoryItem = { ...item, id: Date.now().toString(), lastUpdated: new Date() }
        mockInventoryItems.push(newItem)
        resolve()
      }, 500)
    })
  }

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockInventoryItems.findIndex(item => item.id === id)
        if (index !== -1) {
          mockInventoryItems[index] = { ...mockInventoryItems[index], ...updates, lastUpdated: new Date() }
        }
        resolve()
      }, 500)
    })
  }

  const deleteInventoryItem = async (id: string): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockInventoryItems.findIndex(item => item.id === id)
        if (index !== -1) {
          mockInventoryItems.splice(index, 1)
        }
        resolve()
      }, 500)
    })
  }

  const searchInventoryItems = async (query: string): Promise<InventoryItem[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = mockInventoryItems.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.sku.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        )
        resolve(filtered)
      }, 300)
    })
  }

  const addInventoryCategory = async (category: Omit<InventoryCategory, 'id' | 'itemCount'>): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newCategory: InventoryCategory = { ...category, id: Date.now().toString(), itemCount: 0 }
        mockCategories.push(newCategory)
        resolve()
      }, 500)
    })
  }

  const getPendingApprovalsByDepartment = async (department: string): Promise<any[]> => {
    return new Promise(resolve => setTimeout(() => resolve([]), 300))
  }

  const approveRequest = async (approvalId: string, approver: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 300))
  }

  const rejectRequest = async (approvalId: string, approver: string): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [categories, setCategories] = useState<InventoryCategory[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showAddItem, setShowAddItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showOutgoings, setShowOutgoings] = useState(false)
  const [outgoingsForm, setOutgoingsForm] = useState({
    itemId: '',
    quantity: '',
    reason: '',
    destination: '',
    notes: ''
  })
  const [outgoingsLoading, setOutgoingsLoading] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [formData, setFormData] = useState<NewInventoryForm>({
    name: '',
    sku: '',
    category: '',
    description: '',
    supplier: '',
    unit: '',
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
    unitPrice: '',
    location: ''
  })

  // Approval states
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [showApprovals, setShowApprovals] = useState(false)

  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      loadInventoryItems()
    }
  }, [user])

  const loadInventoryItems = async () => {
    try {
      setDataLoading(true)
      const [items, inventoryStats, categories] = await Promise.all([
        getAllInventoryItems(),
        getInventoryStats(),
        getAllInventoryCategories()
      ])
      setInventoryItems(items)
      setStats(inventoryStats)
      setCategories(categories)
      
      // Load pending material approvals
      await loadPendingApprovals()
    } catch (err) {
      console.error('Error loading inventory items:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const loadPendingApprovals = async () => {
    try {
      const approvals = await getPendingApprovalsByDepartment('inventory')
      setPendingApprovals(approvals)
    } catch (err) {
      console.error('Error loading pending approvals:', err)
    }
  }

  const handleApproveMaterials = async (approvalId: string) => {
    try {
      await approveRequest(approvalId, user?.email || 'system')
      await loadPendingApprovals()
    } catch (err) {
      console.error('Error approving materials:', err)
    }
  }

  const handleRejectMaterials = async (approvalId: string) => {
    try {
      await rejectRequest(approvalId, user?.email || 'system', 'Rejected by admin')
      await loadPendingApprovals()
    } catch (err) {
      console.error('Error rejecting materials:', err)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setFormLoading(true)
      
      // Filter out undefined values and convert strings to numbers
      const itemData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        description: formData.description,
        supplier: formData.supplier,
        unit: formData.unit,
        quantity: parseInt(formData.quantity) || 0,
        minQuantity: parseInt(formData.minQuantity) || 0,
        maxQuantity: parseInt(formData.maxQuantity) || 0,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        totalValue: (parseInt(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0),
        location: formData.location,
        status: 'in-stock' as const
      }

      await addInventoryItem(itemData)
      setShowAddItem(false)
      setFormData({
        name: '',
        sku: '',
        category: '',
        description: '',
        supplier: '',
        unit: '',
        quantity: '',
        minQuantity: '',
        maxQuantity: '',
        unitPrice: '',
        location: ''
      })
      await loadInventoryItems()
    } catch (error) {
      console.error('Error adding inventory item:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(itemId)
        await loadInventoryItems()
      } catch (error) {
        console.error('Error deleting inventory item:', error)
      }
    }
  }

  const handleUpdateOutgoings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setOutgoingsLoading(true)
      
      const selectedInventoryItem = inventoryItems.find(item => item.id === outgoingsForm.itemId)
      if (!selectedInventoryItem) {
        alert('Selected item not found')
        return
      }

      const quantityUsed = parseInt(outgoingsForm.quantity)
      if (quantityUsed > selectedInventoryItem.quantity) {
        alert('Cannot use more quantity than available in stock')
        return
      }

      // Calculate new quantity and status
      const newQuantity = selectedInventoryItem.quantity - quantityUsed
      let newStatus = selectedInventoryItem.status
      
      if (newQuantity === 0) {
        newStatus = 'out-of-stock'
      } else if (newQuantity <= selectedInventoryItem.minQuantity) {
        newStatus = 'low-stock'
      } else {
        newStatus = 'in-stock'
      }

      // Update the inventory item
      await updateInventoryItem(selectedInventoryItem.id, {
        quantity: newQuantity,
        status: newStatus,
        totalValue: newQuantity * selectedInventoryItem.unitPrice
      })

      // Record the outgoing transaction
      const outgoingData = {
        itemId: selectedInventoryItem.id,
        itemName: selectedInventoryItem.name,
        sku: selectedInventoryItem.sku,
        quantityUsed: quantityUsed,
        unit: selectedInventoryItem.unit,
        unitPrice: selectedInventoryItem.unitPrice,
        totalValue: quantityUsed * selectedInventoryItem.unitPrice,
        reason: outgoingsForm.reason,
        destination: outgoingsForm.destination,
        notes: outgoingsForm.notes,
        date: new Date(),
        previousQuantity: selectedInventoryItem.quantity,
        newQuantity: newQuantity
      }

      // Add to outgoings collection
      const outgoingsRef = collection(db, 'inventoryOutgoings')
      await addDoc(outgoingsRef, outgoingData)

      // Reset form and close modal
      setShowOutgoings(false)
      setOutgoingsForm({
        itemId: '',
        quantity: '',
        reason: '',
        destination: '',
        notes: ''
      })
      
      await loadInventoryItems()
      alert('Outgoing recorded successfully!')
    } catch (error) {
      console.error('Error updating outgoings:', error)
      alert('Error recording outgoing. Please try again.')
    } finally {
      setOutgoingsLoading(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setCategoryLoading(true)
      
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description,
        itemCount: 0,
        totalValue: 0
      }

      await addInventoryCategory(categoryData)

      // Reset form and close modal
      setShowCategories(false)
      setCategoryForm({
        name: '',
        description: ''
      })
      
      // Reload categories
      await loadInventoryItems()
      alert('Category added successfully!')
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Error adding category. Please try again.')
    } finally {
      setCategoryLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (confirm(`Are you sure you want to delete the category "${categoryName}"? This will also remove it from all inventory items.`)) {
      try {
        // Check if any items are using this category
        const itemsUsingCategory = inventoryItems.filter(item => item.category === categoryName)
        if (itemsUsingCategory.length > 0) {
          alert(`Cannot delete category "${categoryName}" because ${itemsUsingCategory.length} item(s) are using it. Please reassign those items to a different category first.`)
          return
        }

        // Delete the category
        const categoryRef = doc(db, 'inventoryCategories', categoryId)
        await deleteDoc(categoryRef)
        
        await loadInventoryItems()
        alert('Category deleted successfully!')
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Error deleting category. Please try again.')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-50 text-green-700 border-green-200'
      case 'low-stock': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'out-of-stock': return 'bg-red-50 text-red-700 border-red-200'
      case 'discontinued': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <CheckCircle className="h-4 w-4" />
      case 'low-stock': return <AlertTriangle className="h-4 w-4" />
      case 'out-of-stock': return <Clock className="h-4 w-4" />
      case 'discontinued': return <Database className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fuel': return <Truck className="h-4 w-4" />
      case 'vehicle parts': return <Wrench className="h-4 w-4" />
      case 'lubricants': return <Package className="h-4 w-4" />
      case 'electronics': return <BarChart3 className="h-4 w-4" />
      case 'safety equipment': return <Shirt className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const filteredInventoryItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockPercentage = (quantity: number, maxQuantity: number) => {
    if (maxQuantity === 0) return 0
    return Math.round((quantity / maxQuantity) * 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 mt-16">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Inventory Management</h1>
              <p className="text-slate-600">Manage inventory and resources for all services</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => router.push('/inventory/reports')}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <FileText className="h-4 w-4" />
                    Reports
                  </Button>
                  <Button
                    onClick={() => router.push('/inventory/approvals')}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 relative"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approvals
                    {pendingApprovals.length > 0 && (
                      <span className="absolute -top-2 -right-2">
                        <Badge className="bg-red-600 text-white px-2 py-0.5 text-xs rounded-full">
                          {pendingApprovals.length}
                        </Badge>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Items</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.totalItems || inventoryItems.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Value</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.totalValue ? formatCurrency(stats.totalValue) : formatCurrency(inventoryItems.reduce((sum, item) => sum + item.totalValue, 0))}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats?.lowStockItems || inventoryItems.filter(i => i.status === 'low-stock').length}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats?.outOfStockItems || inventoryItems.filter(i => i.status === 'out-of-stock').length}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Approvals Section */}
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search inventory items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAddItem(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                  <Button
                    onClick={() => setShowCategories(true)}
                    variant="outline"
                    className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <Box className="h-4 w-4" />
                    Manage Categories
                  </Button>
                  <Button
                    onClick={() => setShowOutgoings(true)}
                    variant="outline"
                    className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Package className="h-4 w-4" />
                    Update Outgoings
                  </Button>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading inventory items...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Total Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredInventoryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  {getCategoryIcon(item.category)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                <div className="text-sm text-slate-500">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {item.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getCategoryIcon(item.category)}
                              <span className="ml-2 text-sm text-slate-900">{item.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              {item.quantity} {item.unit}
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    getStockPercentage(item.quantity, item.maxQuantity) > 50 
                                      ? 'bg-green-500' 
                                      : getStockPercentage(item.quantity, item.maxQuantity) > 20 
                                        ? 'bg-yellow-500' 
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${getStockPercentage(item.quantity, item.maxQuantity)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-500">
                                {getStockPercentage(item.quantity, item.maxQuantity)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {formatCurrency(item.totalValue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {item.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="text-slate-400 hover:text-slate-600">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-blue-400 hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
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

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add New Inventory Item</h2>
              <button
                onClick={() => setShowAddItem(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter supplier name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., pieces, liters, kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({...formData, minQuantity: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter minimum quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maximum Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.maxQuantity}
                    onChange={(e) => setFormData({...formData, maxQuantity: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter maximum quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit Price (TZS) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter unit price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter storage location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter item description"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddItem(false)}
                  disabled={formLoading}
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
                      Adding...
                    </>
                  ) : (
                    'Add Item'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Outgoings Modal */}
      {showOutgoings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Update Inventory Outgoings</h2>
              <button
                onClick={() => setShowOutgoings(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateOutgoings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Item *
                  </label>
                  <select
                    required
                    value={outgoingsForm.itemId}
                    onChange={(e) => setOutgoingsForm({...outgoingsForm, itemId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select an item</option>
                    {inventoryItems
                      .filter(item => item.quantity > 0)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {item.quantity} {item.unit} available
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity Used *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={outgoingsForm.quantity}
                    onChange={(e) => setOutgoingsForm({...outgoingsForm, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter quantity used"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason *
                  </label>
                  <input
                    type="text"
                    required
                    value={outgoingsForm.reason}
                    onChange={(e) => setOutgoingsForm({...outgoingsForm, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter reason"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={outgoingsForm.destination}
                    onChange={(e) => setOutgoingsForm({...outgoingsForm, destination: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Where is it going?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={outgoingsForm.notes}
                  onChange={(e) => setOutgoingsForm({...outgoingsForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Additional notes about this outgoing"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOutgoings(false)}
                  disabled={outgoingsLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={outgoingsLoading}
                >
                  {outgoingsLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Recording...
                    </>
                  ) : (
                    'Record Outgoing'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {showCategories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Manage Inventory Categories</h2>
              <button
                onClick={() => setShowCategories(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter category description"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCategories(false)}
                    disabled={categoryLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600"
                    disabled={categoryLoading}
                  >
                    {categoryLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      'Add Category'
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Existing Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="bg-slate-50 rounded-lg p-4 relative">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{category.name}</h4>
                          <p className="text-sm text-slate-600">{category.description}</p>
                          <div className="mt-2 text-xs text-slate-500">
                            {category.itemCount} items • {formatCurrency(category.totalValue)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                          title={`Delete ${category.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-slate-500">No categories found. Add your first category above.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 