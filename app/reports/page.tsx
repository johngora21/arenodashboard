"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Upload,
  Building2,
  FolderOpen,
  Activity,
  Target,
  CheckSquare,
  Bell,
  TrendingUp as TrendingUpIcon,
  X
} from "lucide-react"
import { FilterIcon } from "@/components/ui/filter-icon"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ReportsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [pressedButtons, setPressedButtons] = useState<{[key: string]: boolean}>({})
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAuthor, setFilterAuthor] = useState("all")
  
  const categories = [
    { id: "all", name: "All Reports", icon: <FileText className="h-4 w-4" /> },
    { id: "financial", name: "Financial", icon: <DollarSign className="h-4 w-4" /> },
    { id: "hr", name: "HR & People", icon: <Users className="h-4 w-4" /> },
    { id: "projects", name: "Projects", icon: <FolderOpen className="h-4 w-4" /> },
    { id: "operations", name: "Operations", icon: <Activity className="h-4 w-4" /> },
    { id: "sales", name: "Sales", icon: <TrendingUpIcon className="h-4 w-4" /> },
    { id: "tasks", name: "Tasks", icon: <CheckSquare className="h-4 w-4" /> },
    { id: "inventory", name: "Inventory", icon: <Building2 className="h-4 w-4" /> }
  ]

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "it", name: "IT Department" },
    { id: "hr", name: "Human Resources" },
    { id: "finance", name: "Finance" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
    { id: "operations", name: "Operations" },
    { id: "logistics", name: "Logistics" }
  ]

  const employees = [
    { id: "all", name: "All Employees" },
    { id: "john_doe", name: "John Doe", department: "IT" },
    { id: "jane_smith", name: "Jane Smith", department: "HR" },
    { id: "mike_johnson", name: "Mike Johnson", department: "Finance" },
    { id: "sarah_wilson", name: "Sarah Wilson", department: "Marketing" },
    { id: "david_brown", name: "David Brown", department: "Sales" },
    { id: "lisa_davis", name: "Lisa Davis", department: "Operations" },
    { id: "tom_white", name: "Tom White", department: "IT" },
    { id: "emma_garcia", name: "Emma Garcia", department: "HR" },
    { id: "alex_rodriguez", name: "Alex Rodriguez", department: "Finance" },
    { id: "maria_lopez", name: "Maria Lopez", department: "Marketing" }
  ]

  const statuses = [
    { id: "all", name: "All Statuses" },
    { id: "completed", name: "Completed" },
    { id: "in_progress", name: "In Progress" },
    { id: "pending", name: "Pending" }
  ]

  const authors = [
    { id: "all", name: "All Authors" },
    { id: "mike_johnson", name: "Mike Johnson" },
    { id: "jane_smith", name: "Jane Smith" },
    { id: "john_doe", name: "John Doe" },
    { id: "david_brown", name: "David Brown" },
    { id: "lisa_davis", name: "Lisa Davis" },
    { id: "tom_white", name: "Tom White" },
    { id: "sarah_wilson", name: "Sarah Wilson" }
  ]

  const reports = [
    {
      id: "financial_performance_q1",
      name: "Q1 Financial Performance",
      category: "financial",
      department: "finance",
      author: "Mike Johnson",
      role: "Financial Analyst",
      type: "Performance Analysis",
      status: "completed",
      date: "2024-03-15",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: "hr_attendance_march",
      name: "March Attendance Report",
      category: "hr",
      department: "hr",
      author: "Jane Smith",
      role: "HR Manager",
      type: "Attendance Analysis",
      status: "completed",
      date: "2024-03-31",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "project_status_update",
      name: "Project Status Update",
      category: "projects",
      department: "it",
      author: "John Doe",
      role: "Project Manager",
      type: "Progress Report",
      status: "in_progress",
      date: "2024-03-28",
      icon: <FolderOpen className="h-5 w-5" />
    },
    {
      id: "sales_performance_march",
      name: "March Sales Performance",
      category: "sales",
      department: "sales",
      author: "David Brown",
      role: "Sales Director",
      type: "Sales Analysis",
      status: "completed",
      date: "2024-03-30",
      icon: <TrendingUpIcon className="h-5 w-5" />
    },
    {
      id: "inventory_status",
      name: "Inventory Status Report",
      category: "inventory",
      department: "operations",
      author: "Lisa Davis",
      role: "Operations Manager",
      type: "Inventory Analysis",
      status: "pending",
      date: "2024-03-25",
      icon: <Building2 className="h-5 w-5" />
    },
    {
      id: "task_completion_report",
      name: "Task Completion Report",
      category: "tasks",
      department: "it",
      author: "Tom White",
      role: "Team Lead",
      type: "Task Analysis",
      status: "completed",
      date: "2024-03-29",
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      id: "operational_metrics",
      name: "Operational Metrics Q1",
      category: "operations",
      department: "operations",
      author: "Lisa Davis",
      role: "Operations Manager",
      type: "Metrics Analysis",
      status: "completed",
      date: "2024-03-20",
      icon: <Activity className="h-5 w-5" />
    },
    {
      id: "marketing_campaign_results",
      name: "Marketing Campaign Results",
      category: "sales",
      department: "marketing",
      author: "Sarah Wilson",
      role: "Marketing Manager",
      type: "Campaign Analysis",
      status: "in_progress",
      date: "2024-03-27",
      icon: <TrendingUpIcon className="h-5 w-5" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in_progress":
        return "In Progress"
      case "pending":
        return "Pending"
      default:
        return "Unknown"
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || report.category === selectedCategory
    const matchesDepartment = selectedDepartment === "all" || report.department === selectedDepartment
    
    return matchesSearch && matchesCategory && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
                <p className="text-slate-600 mt-1 text-base">Comprehensive reporting and analytics dashboard</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => router.push('/reports/create')}
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Report
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => router.push('/reports/submit')}
                >
                  <Upload className="h-4 w-4 mr-2" /> Submit Report
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white hover:bg-slate-50"
                  onClick={() => setShowFilterDialog(true)}
                >
                  <FilterIcon className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48 h-12">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReports.map((report) => (
              <Card key={report.id} className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
                        {report.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                          {report.name}
                        </CardTitle>
                        <p className="text-sm text-slate-600">{report.type}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(report.status)} px-3 py-1 rounded-full text-xs font-medium`}>
                      {getStatusText(report.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                                        <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Department</span>
                        <span className="text-sm font-medium text-slate-900">{departments.find(d => d.id === report.department)?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Author</span>
                        <span className="text-sm font-medium text-slate-900">{report.author}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Role</span>
                        <span className="text-sm font-medium text-slate-900">{report.role}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Date</span>
                        <span className="text-sm font-medium text-slate-900">{report.date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`flex-1 ${
                          pressedButtons[`${report.id}_view`] 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setPressedButtons(prev => ({
                          ...prev,
                          [`${report.id}_view`]: !prev[`${report.id}_view`]
                        }))}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`${
                          pressedButtons[`${report.id}_download`] 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' 
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setPressedButtons(prev => ({
                          ...prev,
                          [`${report.id}_download`]: !prev[`${report.id}_download`]
                        }))}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Filter Dialog */}
          <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FilterIcon className="h-5 w-5" />
                  <span>Filter Reports</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Author Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Author</label>
                  <Select value={filterAuthor} onValueChange={setFilterAuthor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700">Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">From</label>
                      <Input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">To</label>
                      <Input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setFilterStatus("all")
                      setFilterAuthor("all")
                      setFilterDateFrom("")
                      setFilterDateTo("")
                    }}
                  >
                    Clear All
                  </Button>
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowFilterDialog(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
