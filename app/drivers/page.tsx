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
  Truck,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Navigation,
  Car,
  Bike
} from "lucide-react"
import { 
  getAllDrivers, 
  addDriver, 
  updateDriver, 
  deleteDriver,
  getAvailableDrivers,
  findNearestDriver,
  Driver
} from "@/lib/firebase-service"
import { tanzaniaRegions } from "@/lib/tanzania-regions"

interface NewDriverForm {
  name: string
  phone: string
  email: string
  vehicleType: 'motorcycle' | 'bicycle' | 'car'
  vehicleNumber: string
  licenseNumber: string
  latitude: string
  longitude: string
  address: string
  region: string
  district: string
  notes: string
}

export default function DriversPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [vehicleFilter, setVehicleFilter] = useState<string>("all")
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<NewDriverForm>({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'motorcycle',
    vehicleNumber: '',
    licenseNumber: '',
    latitude: '',
    longitude: '',
    address: '',
    region: '',
    district: '',
    notes: ''
  })

  // Get selected region data for district dropdown
  const selectedRegionData = tanzaniaRegions.find(region => region.name === formData.region)

  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      loadDrivers()
    }
  }, [user])

  const loadDrivers = async () => {
    try {
      setDataLoading(true)
      const driversData = await getAllDrivers()
      setDrivers(driversData)
    } catch (err) {
      console.error('Error loading drivers:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const handleRegionChange = (region: string) => {
    setFormData({...formData, region, district: ''}) // Reset district when region changes
  }

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setFormLoading(true)
      
      const driverData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        location: {
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
          address: formData.address
        },
        region: formData.region,
        district: formData.district,
        status: 'available' as const,
        documents: {},
        notes: formData.notes
      }

      await addDriver(driverData)
      setShowAddDriver(false)
      setFormData({
        name: '',
        phone: '',
        email: '',
        vehicleType: 'motorcycle',
        vehicleNumber: '',
        licenseNumber: '',
        latitude: '',
        longitude: '',
        address: '',
        region: '',
        district: '',
        notes: ''
      })
      await loadDrivers()
    } catch (error) {
      console.error('Error adding driver:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteDriver = async (driverId: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(driverId)
        await loadDrivers()
      } catch (error) {
        console.error('Error deleting driver:', error)
      }
    }
  }

  const handleFindNearestDriver = async () => {
    // For demo purposes, using Dar es Salaam coordinates
    const latitude = -6.8235
    const longitude = 39.2695
    
    try {
      const nearestDriver = await findNearestDriver(latitude, longitude, 10)
      if (nearestDriver) {
        alert(`Nearest driver found: ${nearestDriver.name} (${nearestDriver.phone})`)
      } else {
        alert('No available drivers found within 10km radius')
      }
    } catch (error) {
      console.error('Error finding nearest driver:', error)
      alert('Error finding nearest driver')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-50 text-green-700 border-green-200'
      case 'busy': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'offline': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'suspended': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />
      case 'busy': return <Clock className="h-4 w-4" />
      case 'offline': return <XCircle className="h-4 w-4" />
      case 'suspended': return <AlertTriangle className="h-4 w-4" />
      default: return <XCircle className="h-4 w-4" />
    }
  }

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle': return <Bike className="h-4 w-4" />
      case 'car': return <Car className="h-4 w-4" />
      case 'bicycle': return <Bike className="h-4 w-4" />
      default: return <Truck className="h-4 w-4" />
    }
  }

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    const matchesVehicle = vehicleFilter === 'all' || driver.vehicleType === vehicleFilter
    
    return matchesSearch && matchesStatus && matchesVehicle
  })

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

  const stats = {
    totalDrivers: drivers.length,
    availableDrivers: drivers.filter(d => d.status === 'available').length,
    totalDeliveries: drivers.reduce((sum, driver) => sum + driver.totalDeliveries, 0),
    totalEarnings: drivers.reduce((sum, driver) => sum + driver.totalEarnings, 0)
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
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Driver Management</h1>
              <p className="text-slate-600">Manage your delivery drivers and assign nearest drivers to pickups</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Drivers</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalDrivers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Available Drivers</p>
                    <p className="text-2xl font-bold text-green-600">{stats.availableDrivers}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Deliveries</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalDeliveries}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(stats.totalEarnings)}
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
                      placeholder="Search drivers..."
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
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  
                  <select
                    value={vehicleFilter}
                    onChange={(e) => setVehicleFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Vehicles</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="car">Car</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleFindNearestDriver}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    Find Nearest
                  </Button>
                  <Button
                    onClick={() => setShowAddDriver(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Driver
                  </Button>
                </div>
              </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading drivers...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Driver
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredDrivers.map((driver) => (
                        <tr key={driver.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Truck className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{driver.name}</div>
                                <div className="text-sm text-slate-500">License: {driver.licenseNumber}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {driver.phone}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3" />
                                {driver.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              <div className="flex items-center gap-2">
                                {getVehicleIcon(driver.vehicleType)}
                                <span className="capitalize">{driver.vehicleType}</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {driver.vehicleNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {driver.location.address}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {driver.location.latitude.toFixed(4)}, {driver.location.longitude.toFixed(4)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              <div className="flex items-center gap-2">
                                <span>{driver.totalDeliveries} deliveries</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span>{driver.rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {formatCurrency(driver.totalEarnings)} earned
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(driver.status)}`}>
                              {getStatusIcon(driver.status)}
                              <span className="ml-1 capitalize">{driver.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatTimestamp(driver.joinedDate)}
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
                                onClick={() => handleDeleteDriver(driver.id)}
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

      {/* Add Driver Modal */}
      {showAddDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add New Driver</h2>
              <button
                onClick={() => setShowAddDriver(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    required
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value as 'motorcycle' | 'bicycle' | 'car'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="car">Car</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter vehicle number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter license number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter latitude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter longitude"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Region *
                </label>
                <select
                  required
                  value={formData.region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select region</option>
                  {tanzaniaRegions.map((region) => (
                    <option key={region.name} value={region.name}>{region.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  District *
                </label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select district</option>
                  {selectedRegionData?.districts.map((district) => (
                    <option key={district.name} value={district.name}>{district.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Additional notes about the driver"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDriver(false)}
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
                    'Add Driver'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 