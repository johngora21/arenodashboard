"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  ArrowLeft,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
  Trash2,
  Copy,
  Share2,
  UserCheck,
  UserX,
  AlertTriangle,
  Info,
  Settings,
  FileText,
  CheckSquare,
  Square,
  DollarSign,
  Users
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface Trip {
  id: string
  employeeName: string
  employeeId: string
  destination: string
  purpose: string
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'ongoing' | 'completed' | 'cancelled'
  budget: number
  approvedBy: string
  notes: string
}

export default function TripsPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("trips")

  // Mock data
  const mockTrips: Trip[] = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      destination: "Mwanza",
      purpose: "Client meeting and site inspection",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      status: "approved",
      budget: 500000,
      approvedBy: "Sarah Johnson",
      notes: "Meeting with key client for project discussion"
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      destination: "Arusha",
      purpose: "Training workshop",
      startDate: "2024-01-25",
      endDate: "2024-01-27",
      status: "pending",
      budget: 300000,
      approvedBy: "",
      notes: "Attending logistics training workshop"
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      destination: "Dodoma",
      purpose: "Delivery and installation",
      startDate: "2024-01-15",
      endDate: "2024-01-16",
      status: "completed",
      budget: 200000,
      approvedBy: "David Brown",
      notes: "Successfully completed equipment delivery"
    },
    {
      id: "4",
      employeeName: "Sarah Wilson",
      employeeId: "EMP004",
      destination: "Zanzibar",
      purpose: "Conference attendance",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      status: "cancelled",
      budget: 800000,
      approvedBy: "Lisa Chen",
      notes: "Conference cancelled due to scheduling conflict"
    },
    {
      id: "5",
      employeeName: "David Brown",
      employeeId: "EMP005",
      destination: "Mbeya",
      purpose: "Branch opening ceremony",
      startDate: "2024-01-30",
      endDate: "2024-02-01",
      status: "ongoing",
      budget: 400000,
      approvedBy: "John Doe",
      notes: "Attending new branch opening event"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setTrips(mockTrips)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || trip.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalTrips: trips.length,
    pendingTrips: trips.filter(t => t.status === 'pending').length,
    ongoingTrips: trips.filter(t => t.status === 'ongoing').length,
    completedTrips: trips.filter(t => t.status === 'completed').length,
    totalBudget: trips.reduce((sum, t) => sum + t.budget, 0)
  }

  const statuses = ["pending", "approved", "ongoing", "completed", "cancelled"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading trips data...</p>
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
                    onClick={() => router.push('/hr')}
                    className="text-slate-600 hover:text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Trips Management</h1>
                    <p className="text-slate-600">Manage business trips and travel requests</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Trip
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trips">Trips</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="trips" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search trips..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Trips List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredTrips.map((trip) => (
                    <Card key={trip.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{trip.employeeName}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{trip.destination}</p>
                          </div>
                          <Badge className={getStatusColor(trip.status)}>
                            {trip.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-sm">
                          <p className="text-slate-600">Purpose</p>
                          <p className="font-medium">{trip.purpose}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Start Date</p>
                            <p className="font-medium">{trip.startDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">End Date</p>
                            <p className="font-medium">{trip.endDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Budget</p>
                            <p className="font-medium">TZS {trip.budget.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {trip.approvedBy && (
                          <div className="text-sm">
                            <p className="text-slate-600">Approved by: <span className="font-medium">{trip.approvedBy}</span></p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Trips</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalTrips}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Pending Trips</p>
                          <p className="text-2xl font-bold text-yellow-600">{stats.pendingTrips}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Ongoing Trips</p>
                          <p className="text-2xl font-bold text-green-600">{stats.ongoingTrips}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Budget</p>
                          <p className="text-2xl font-bold text-purple-600">
                            TZS {stats.totalBudget.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trip Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Trip Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {statuses.map(status => {
                          const count = trips.filter(t => t.status === status).length
                          return (
                            <div key={status} className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 capitalize">{status}</span>
                              <Badge className={getStatusColor(status)}>
                                {count}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Recent Trips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trips.slice(0, 5).map((trip) => (
                          <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{trip.employeeName}</p>
                              <p className="text-sm text-slate-600">{trip.destination} • {trip.startDate}</p>
                            </div>
                            <Badge className={getStatusColor(trip.status)}>
                              {trip.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
