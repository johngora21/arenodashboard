"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FolderOpen, Users, Calendar, TrendingUp, CheckCircle, Clock, 
  AlertTriangle, Plus, Search, MoreVertical, Eye, Edit, 
  Download, DollarSign, Target, BarChart3, Activity
} from "lucide-react"
import { FilterIcon } from "@/components/ui/filter-icon"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  const mockProjects = [
    {
      id: "1",
      name: "E-commerce Platform Development",
      description: "Building a comprehensive e-commerce platform with payment integration",
      status: "active",
      priority: "high",
      progress: 65,
      budget: 50000000,
      spent: 32500000,
      manager: "Sarah Johnson",
      team: ["John Doe", "Mike Wilson", "Lisa Chen"],
      department: "IT",
      endDate: "2024-06-30"
    },
    {
      id: "2",
      name: "Logistics System Upgrade",
      description: "Modernizing the logistics management system",
      status: "active",
      priority: "medium",
      progress: 45,
      budget: 30000000,
      spent: 13500000,
      manager: "David Brown",
      team: ["Robert Wilson", "Emily Davis", "Alex Kim"],
      department: "Logistics",
      endDate: "2024-08-31"
    },
    {
      id: "3",
      name: "Mobile App Development",
      description: "Creating mobile applications for iOS and Android",
      status: "planning",
      priority: "high",
      progress: 15,
      budget: 40000000,
      spent: 6000000,
      manager: "Lisa Chen",
      team: ["Mike Johnson", "Sarah Wilson"],
      department: "IT",
      endDate: "2024-10-31"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "planning": return "bg-blue-100 text-blue-800"
      case "on_hold": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-purple-100 text-purple-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 60) return "text-blue-600"
    if (progress >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const projectStats = {
    total: mockProjects.length,
    active: mockProjects.filter(p => p.status === 'active').length,
    totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: mockProjects.reduce((sum, p) => sum + p.spent, 0),
    averageProgress: mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Management</h1>
                <p className="text-slate-600 mt-1 text-base">Manage projects, track progress, and optimize resource allocation</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-white hover:bg-slate-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/projects/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Projects</p>
                        <p className="text-2xl font-bold text-slate-900">{projectStats.active}</p>
                        <p className="text-xs text-green-600">+{projectStats.active - 2} from last month</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FolderOpen className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Budget</p>
                        <p className="text-2xl font-bold text-slate-900">TZS {(projectStats.totalBudget / 1000000).toFixed(1)}M</p>
                        <p className="text-xs text-blue-600">{(projectStats.totalSpent / projectStats.totalBudget * 100).toFixed(1)}% spent</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Avg Progress</p>
                        <p className="text-2xl font-bold text-slate-900">{projectStats.averageProgress.toFixed(0)}%</p>
                        <p className="text-xs text-green-600">On track</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Team Members</p>
                        <p className="text-2xl font-bold text-slate-900">12</p>
                        <p className="text-xs text-green-600">+3 this month</p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockProjects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                              P{project.id}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{project.name}</p>
                              <p className="text-sm text-slate-600">{project.department}</p>
                              <p className="text-xs text-slate-500">Due: {project.endDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                            <p className="text-sm font-medium text-slate-900">{project.progress}% Complete</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>


              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>All Projects</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search projects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <FilterIcon className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockProjects.map((project) => (
                      <Card key={project.id} className="bg-white shadow-sm hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                P{project.id}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{project.name}</CardTitle>
                                <p className="text-sm text-slate-600">{project.department}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Progress:</span>
                              <span className={`font-medium ${getProgressColor(project.progress)}`}>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${project.progress >= 80 ? 'bg-green-500' : project.progress >= 60 ? 'bg-blue-500' : project.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{width: `${project.progress}%`}}
                              ></div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Team:</span>
                              <span className="font-medium">{project.team.length} members</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Budget:</span>
                              <span className="font-medium">TZS {(project.budget / 1000000).toFixed(1)}M</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Due:</span>
                              <span className="font-medium">{project.endDate}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <div className="flex gap-1">
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(project.priority)}>
                                  {project.priority}
                                </Badge>
                              </div>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>





            <TabsContent value="reports" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FilterIcon className="h-5 w-5" />
                    Report Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search reports..."
                          className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="sm:w-48">
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Departments</option>
                        <option value="it">IT</option>
                        <option value="logistics">Logistics</option>
                        <option value="finance">Finance</option>
                        <option value="hr">HR</option>
                        <option value="sales">Sales</option>
                        <option value="marketing">Marketing</option>
                        <option value="operations">Operations</option>
                      </select>
                    </div>
                    <div className="sm:w-48">
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="planning">Planning</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
