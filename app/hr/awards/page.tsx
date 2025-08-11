"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Award, 
  Trophy, 
  Star, 
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
  Calendar,
  Users,
  Gift,
  Heart,
  Zap,
  Target,
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
  Crown,
  Medal,
  Ribbon,
  Settings
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface Award {
  id: string
  name: string
  description: string
  category: 'performance' | 'innovation' | 'leadership' | 'service' | 'safety' | 'teamwork'
  recipient: string
  department: string
  awardedDate: string
  status: 'pending' | 'approved' | 'awarded' | 'cancelled'
  value: number
  type: 'monetary' | 'recognition' | 'gift' | 'certificate'
  approvedBy: string
  notes: string
}

interface AwardCategory {
  id: string
  name: string
  description: string
  criteria: string[]
  value: number
  isActive: boolean
}

export default function AwardsPage() {
  const router = useRouter()
  const [awards, setAwards] = useState<Award[]>([])
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("awards")

  // Mock data
  const mockAwards: Award[] = [
    {
      id: "1",
      name: "Employee of the Month",
      description: "Outstanding performance and dedication",
      category: "performance",
      recipient: "John Doe",
      department: "Operations",
      awardedDate: "2024-01-15",
      status: "awarded",
      value: 500000,
      type: "monetary",
      approvedBy: "Sarah Johnson",
      notes: "Exceptional work ethic and team collaboration"
    },
    {
      id: "2",
      name: "Innovation Award",
      description: "Creative problem-solving and new ideas",
      category: "innovation",
      recipient: "Jane Smith",
      department: "IT",
      awardedDate: "2024-01-10",
      status: "approved",
      value: 300000,
      type: "monetary",
      approvedBy: "Mike Wilson",
      notes: "Developed new process improvement system"
    },
    {
      id: "3",
      name: "Leadership Excellence",
      description: "Outstanding leadership and team management",
      category: "leadership",
      recipient: "David Brown",
      department: "Logistics",
      awardedDate: "2024-01-08",
      status: "awarded",
      value: 0,
      type: "recognition",
      approvedBy: "Lisa Chen",
      notes: "Successfully led team through challenging project"
    },
    {
      id: "4",
      name: "Safety Champion",
      description: "Outstanding safety practices and awareness",
      category: "safety",
      recipient: "Mike Johnson",
      department: "Logistics",
      awardedDate: "2024-01-12",
      status: "pending",
      value: 200000,
      type: "gift",
      approvedBy: "",
      notes: "Maintained perfect safety record for 12 months"
    },
    {
      id: "5",
      name: "Team Player Award",
      description: "Exceptional teamwork and collaboration",
      category: "teamwork",
      recipient: "Sarah Wilson",
      department: "HR",
      awardedDate: "2024-01-05",
      status: "awarded",
      value: 150000,
      type: "certificate",
      approvedBy: "John Doe",
      notes: "Always supportive and helpful to team members"
    }
  ]

  const mockCategories: AwardCategory[] = [
    {
      id: "1",
      name: "Employee of the Month",
      description: "Monthly recognition for outstanding performance",
      criteria: ["High performance", "Team collaboration", "Innovation"],
      value: 500000,
      isActive: true
    },
    {
      id: "2",
      name: "Innovation Award",
      description: "Recognition for creative problem-solving",
      criteria: ["New ideas", "Process improvement", "Cost savings"],
      value: 300000,
      isActive: true
    },
    {
      id: "3",
      name: "Leadership Excellence",
      description: "Outstanding leadership and management",
      criteria: ["Team management", "Project success", "Mentoring"],
      value: 0,
      isActive: true
    },
    {
      id: "4",
      name: "Safety Champion",
      description: "Excellence in safety practices",
      criteria: ["Safety record", "Safety awareness", "Training others"],
      value: 200000,
      isActive: true
    },
    {
      id: "5",
      name: "Team Player Award",
      description: "Exceptional teamwork and collaboration",
      criteria: ["Team support", "Collaboration", "Positive attitude"],
      value: 150000,
      isActive: true
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setAwards(mockAwards)
      setCategories(mockCategories)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredAwards = awards.filter(award => {
    const matchesSearch = award.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || award.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || award.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "awarded":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-100 text-blue-800"
      case "innovation":
        return "bg-green-100 text-green-800"
      case "leadership":
        return "bg-purple-100 text-purple-800"
      case "service":
        return "bg-orange-100 text-orange-800"
      case "safety":
        return "bg-red-100 text-red-800"
      case "teamwork":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "monetary":
        return "bg-green-100 text-green-800"
      case "recognition":
        return "bg-blue-100 text-blue-800"
      case "gift":
        return "bg-purple-100 text-purple-800"
      case "certificate":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalAwards: awards.length,
    pendingAwards: awards.filter(a => a.status === 'pending').length,
    awardedAwards: awards.filter(a => a.status === 'awarded').length,
    totalValue: awards.reduce((sum, a) => sum + a.value, 0),
    averageValue: awards.length > 0 ? awards.reduce((sum, a) => sum + a.value, 0) / awards.length : 0
  }

  const awardCategories = Array.from(new Set(awards.map(a => a.category)))
  const awardStatuses = ["pending", "approved", "awarded", "cancelled"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading awards data...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Awards Management</h1>
                    <p className="text-slate-600">Recognize and reward employee achievements</p>
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
                    New Award
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="awards">Awards</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="awards" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search awards..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {awardCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        {awardStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Awards List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAwards.map((award) => (
                    <Card key={award.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{award.name}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{award.description}</p>
                          </div>
                          <Badge className={getStatusColor(award.status)}>
                            {award.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(award.category)}>
                            {award.category}
                          </Badge>
                          <Badge className={getTypeColor(award.type)}>
                            {award.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Recipient</p>
                            <p className="font-medium">{award.recipient}</p>
                            <p className="text-xs text-slate-500">{award.department}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Value</p>
                            <p className="font-medium">
                              {award.value > 0 ? `TZS ${award.value.toLocaleString()}` : 'Recognition Only'}
                            </p>
                            <p className="text-xs text-slate-500">Awarded: {award.awardedDate}</p>
                          </div>
                        </div>
                        
                        {award.approvedBy && (
                          <div className="text-sm">
                            <p className="text-slate-600">Approved by: <span className="font-medium">{award.approvedBy}</span></p>
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

              <TabsContent value="categories" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCategories.map((category) => (
                    <Card key={category.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-3">
                            <Trophy className="h-8 w-8" />
                          </div>
                          <h3 className="font-semibold text-slate-900">{category.name}</h3>
                          <p className="text-sm text-slate-600">{category.description}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Value:</span>
                            <span className="font-medium">
                              {category.value > 0 ? `TZS ${category.value.toLocaleString()}` : 'Recognition Only'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Status:</span>
                            <Badge className={category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm text-slate-600 mb-2">Criteria:</p>
                          <div className="space-y-1">
                            {category.criteria.map((criterion, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                <span className="text-xs text-slate-600">{criterion}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
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
                          <p className="text-sm font-medium text-slate-600">Total Awards</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalAwards}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Award className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Pending Awards</p>
                          <p className="text-2xl font-bold text-yellow-600">{stats.pendingAwards}</p>
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
                          <p className="text-sm font-medium text-slate-600">Awarded</p>
                          <p className="text-2xl font-bold text-green-600">{stats.awardedAwards}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Value</p>
                          <p className="text-2xl font-bold text-purple-600">
                            TZS {stats.totalValue.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Gift className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Award Distribution and Recent Awards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Award Categories Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {awardCategories.map(category => {
                          const count = awards.filter(a => a.category === category).length
                          return (
                            <div key={category} className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 capitalize">{category}</span>
                              <Badge className={getCategoryColor(category)}>
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
                      <CardTitle>Recent Awards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {awards.slice(0, 5).map((award) => (
                          <div key={award.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{award.name}</p>
                              <p className="text-sm text-slate-600">{award.recipient} • {award.awardedDate}</p>
                            </div>
                            <Badge className={getStatusColor(award.status)}>
                              {award.status}
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
