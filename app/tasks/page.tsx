"use client"; 
import { useState } from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { CheckSquare, Clock, AlertTriangle, Users, Calendar, TrendingUp, Plus, Search, MoreVertical, Eye, Edit, Trash2, Download, List, Activity, BarChart3 } from "lucide-react";
import { FilterIcon } from "@/components/ui/filter-icon"; 
import Sidebar from "@/components/Sidebar"; 
import Header from "@/components/Header"; 
import { useRouter } from "next/navigation";

export default function TasksPage() { 
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  const mockTasks = [
    {
      id: "1",
      title: "E-commerce Platform Development",
      description: "Building a comprehensive e-commerce platform with payment integration",
      status: "active",
      priority: "high",
      progress: 65,
      assignee: "Sarah Johnson",
      department: "IT",
      dueDate: "2024-06-30",
      estimatedHours: 120,
      actualHours: 78
    },
    {
      id: "2",
      title: "Logistics System Upgrade",
      description: "Modernizing the logistics management system",
      status: "active",
      priority: "medium",
      progress: 45,
      assignee: "David Brown",
      department: "Logistics",
      dueDate: "2024-08-31",
      estimatedHours: 80,
      actualHours: 36
    },
    {
      id: "3",
      title: "Mobile App Development",
      description: "Creating mobile applications for iOS and Android",
      status: "planning",
      priority: "high",
      progress: 15,
      assignee: "Lisa Chen",
      department: "IT",
      dueDate: "2024-10-31",
      estimatedHours: 160,
      actualHours: 24
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

  const taskStats = {
    total: mockTasks.length,
    active: mockTasks.filter(t => t.status === 'active').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    averageProgress: mockTasks.reduce((sum, t) => sum + t.progress, 0) / mockTasks.length
  }

  return ( 
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex"> 
      <Sidebar /> 
      <div className="flex-1 flex flex-col lg:ml-0"> 
        <Header /> 
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100"> 
          <div className="mb-8"> 
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> 
              <div> 
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Management</h1> 
                <p className="text-slate-600 mt-1 text-base">Manage tasks, assignments, and track progress</p> 
              </div> 
              <div className="flex space-x-3"> 
                <Button variant="outline" className="bg-white hover:bg-slate-50">
                  <Download className="h-4 w-4 mr-2" /> Export 
                </Button> 
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/tasks/create")}> 
                  <Plus className="h-4 w-4 mr-2" /> New Task 
                </Button> 
              </div> 
            </div> 
          </div> 
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6"> 
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-1 shadow-sm"> 
              <TabsTrigger value="overview">Overview</TabsTrigger> 
              <TabsTrigger value="tasks">Tasks</TabsTrigger> 
              <TabsTrigger value="reports">Reports</TabsTrigger> 
            </TabsList> 
            <TabsContent value="overview" className="space-y-6"> 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow"> 
                  <CardContent className="p-6"> 
                    <div className="flex items-center justify-between"> 
                      <div> 
                        <p className="text-sm font-medium text-slate-600">Total Tasks</p> 
                        <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p> 
                        <p className="text-xs text-green-600">+15% from last week</p> 
                      </div> 
                      <div className="p-3 bg-blue-100 rounded-lg"> 
                        <List className="h-6 w-6 text-blue-600" /> 
                      </div> 
                    </div> 
                  </CardContent> 
                </Card> 
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow"> 
                  <CardContent className="p-6"> 
                    <div className="flex items-center justify-between"> 
                      <div> 
                        <p className="text-sm font-medium text-slate-600">Active Tasks</p> 
                        <p className="text-2xl font-bold text-slate-900">{taskStats.active}</p> 
                        <p className="text-xs text-green-600">Currently in progress</p> 
                      </div> 
                      <div className="p-3 bg-green-100 rounded-lg"> 
                        <CheckSquare className="h-6 w-6 text-green-600" /> 
                      </div> 
                    </div> 
                  </CardContent> 
                </Card> 
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow"> 
                  <CardContent className="p-6"> 
                    <div className="flex items-center justify-between"> 
                      <div> 
                        <p className="text-sm font-medium text-slate-600">Completed</p> 
                        <p className="text-2xl font-bold text-slate-900">{taskStats.completed}</p> 
                        <p className="text-xs text-green-600">{(taskStats.completed / taskStats.total * 100).toFixed(0)}% completion rate</p> 
                      </div> 
                      <div className="p-3 bg-orange-100 rounded-lg"> 
                        <Clock className="h-6 w-6 text-orange-600" /> 
                      </div> 
                    </div> 
                  </CardContent> 
                </Card> 
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow"> 
                  <CardContent className="p-6"> 
                    <div className="flex items-center justify-between"> 
                      <div> 
                        <p className="text-sm font-medium text-slate-600">Avg Progress</p> 
                        <p className="text-2xl font-bold text-slate-900">{taskStats.averageProgress.toFixed(0)}%</p> 
                        <p className="text-xs text-purple-600">On track</p> 
                      </div> 
                      <div className="p-3 bg-purple-100 rounded-lg"> 
                        <TrendingUp className="h-6 w-6 text-purple-600" /> 
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
                      Recent Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                              T{task.id}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{task.title}</p>
                              <p className="text-sm text-slate-600">{task.department}</p>
                              <p className="text-xs text-slate-500">Due: {task.dueDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                            <p className="text-sm font-medium text-slate-900">{task.progress}% Complete</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent> 

            <TabsContent value="tasks" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>All Tasks</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search tasks..."
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
                    {mockTasks.map((task) => (
                      <Card key={task.id} className="bg-white shadow-sm hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                T{task.id}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{task.title}</CardTitle>
                                <p className="text-sm text-slate-600">{task.department}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Progress:</span>
                              <span className={`font-medium ${getProgressColor(task.progress)}`}>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${task.progress >= 80 ? 'bg-green-500' : task.progress >= 60 ? 'bg-blue-500' : task.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{width: `${task.progress}%`}}
                              ></div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Assignee:</span>
                              <span className="font-medium">{task.assignee}</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Hours:</span>
                              <span className="font-medium">{task.actualHours}/{task.estimatedHours}h</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Due:</span>
                              <span className="font-medium">{task.dueDate}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <div className="flex gap-1">
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
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
