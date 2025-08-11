"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  User, 
  Building, 
  Briefcase,
  FileText,
  Award,
  GraduationCap,
  Target,
  TrendingUp,
  Download,
  Edit,
  Clock,
  Heart,
  Plane,
  BookOpen,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  MessageSquare,
  Settings,
  Eye,
  Printer,
  Share2,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Banknote,
  Receipt,
  Shield,
  Zap,
  Lightbulb,
  Brain,
  Globe,
  Video,
  Headphones,
  Monitor,
  Book,
  Certificate,
  Trophy,
  Medal,
  Ribbon,
  Crown,
  Umbrella,
  Stethoscope,
  Baby,
  Users
} from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  branch: string
  status: 'active' | 'inactive' | 'on_leave'
  hireDate: string
  salary: number
  performance: number
  manager?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  address?: string
  dateOfBirth?: string
  nationalId?: string
  taxId?: string
  bankAccount?: {
    bank: string
    accountNumber: string
    accountName: string
  }
}

interface LeaveRecord {
  id: string
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'study' | 'bereavement'
  startDate: string
  endDate: string
  days: number
  status: 'approved' | 'pending' | 'rejected' | 'cancelled'
  reason: string
  approvedBy?: string
}

interface SalaryRecord {
  month: string
  year: string
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  status: 'paid' | 'pending' | 'cancelled'
}

interface TrainingRecord {
  id: string
  title: string
  type: 'mandatory' | 'optional' | 'certification'
  startDate: string
  endDate: string
  status: 'completed' | 'ongoing' | 'scheduled' | 'cancelled'
  score?: number
  certificate?: string
}

interface PerformanceReview {
  id: string
  period: string
  reviewer: string
  rating: number
  strengths: string[]
  areas: string[]
  goals: string[]
  status: 'completed' | 'pending' | 'overdue'
}

interface EmployeeProfileModalProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
}

export default function EmployeeProfileModal({ employee, isOpen, onClose }: EmployeeProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!isOpen || !employee) return null

  // Mock data for enhanced functionality
  const leaveHistory: LeaveRecord[] = [
    {
      id: "1",
      type: "vacation",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      days: 5,
      status: "approved",
      reason: "Family vacation",
      approvedBy: "Sarah Johnson"
    },
    {
      id: "2",
      type: "sick",
      startDate: "2023-12-10",
      endDate: "2023-12-12",
      days: 2,
      status: "approved",
      reason: "Medical appointment",
      approvedBy: "Mike Wilson"
    }
  ]

  const salaryHistory: SalaryRecord[] = [
    {
      month: "January",
      year: "2024",
      basicSalary: 2500000,
      allowances: 500000,
      deductions: 200000,
      netSalary: 2800000,
      status: "paid"
    },
    {
      month: "December",
      year: "2023",
      basicSalary: 2500000,
      allowances: 450000,
      deductions: 180000,
      netSalary: 2770000,
      status: "paid"
    }
  ]

  const trainingHistory: TrainingRecord[] = [
    {
      id: "1",
      title: "Leadership Development Program",
      type: "mandatory",
      startDate: "2023-11-01",
      endDate: "2023-12-15",
      status: "completed",
      score: 95,
      certificate: "Leadership_Cert_2023.pdf"
    },
    {
      id: "2",
      title: "Advanced Excel Skills",
      type: "optional",
      startDate: "2024-01-10",
      endDate: "2024-01-25",
      status: "completed",
      score: 88
    }
  ]

  const performanceReviews: PerformanceReview[] = [
    {
      id: "1",
      period: "Q4 2023",
      reviewer: "Sarah Johnson",
      rating: 4.5,
      strengths: ["Excellent leadership skills", "Strong problem-solving abilities", "Great team collaboration"],
      areas: ["Time management could improve", "More strategic thinking needed"],
      goals: ["Lead 3 major projects", "Mentor 2 junior team members", "Improve efficiency by 15%"],
      status: "completed"
    },
    {
      id: "2",
      period: "Q3 2023",
      reviewer: "Mike Wilson",
      rating: 4.2,
      strengths: ["Good communication", "Reliable and consistent"],
      areas: ["Take more initiative", "Develop leadership skills"],
      goals: ["Complete leadership training", "Take on more responsibilities"],
      status: "completed"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "on_leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case "vacation":
        return <Umbrella className="h-4 w-4 text-blue-500" />
      case "sick":
        return <Stethoscope className="h-4 w-4 text-red-500" />
      case "personal":
        return <User className="h-4 w-4 text-purple-500" />
      case "maternity":
        return <Heart className="h-4 w-4 text-pink-500" />
      case "paternity":
        return <Baby className="h-4 w-4 text-cyan-500" />
      case "study":
        return <BookOpen className="h-4 w-4 text-green-500" />
      case "bereavement":
        return <Heart className="h-4 w-4 text-gray-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800"
      case "sick":
        return "bg-red-100 text-red-800"
      case "personal":
        return "bg-purple-100 text-purple-800"
      case "maternity":
        return "bg-pink-100 text-pink-800"
      case "paternity":
        return "bg-cyan-100 text-cyan-800"
      case "study":
        return "bg-green-100 text-green-800"
      case "bereavement":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case "mandatory":
        return "bg-red-100 text-red-800"
      case "optional":
        return "bg-blue-100 text-blue-800"
      case "certification":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2>
              <p className="text-slate-600">{employee.position} • {employee.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(employee.status)}>
              {employee.status.replace('_', ' ')}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="leave">Leave</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-20">Name:</span>
                        <span className="text-slate-900">{employee.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{employee.branch}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Hire Date: {employee.hireDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Information */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Work Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-20">Position:</span>
                        <span className="text-slate-900">{employee.position}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-20">Department:</span>
                        <span className="text-slate-900">{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 w-20">Manager:</span>
                        <span className="text-slate-900">{employee.manager || "Not assigned"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Salary: TZS {(employee.salary / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Performance: {employee.performance}/5.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">5</div>
                        <div className="text-sm text-blue-600">Years Service</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-green-600">Leave Days Used</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-purple-600">Training Completed</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">3</div>
                        <div className="text-sm text-orange-600">Awards Won</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Employee of the Month</p>
                          <p className="text-xs text-slate-600">January 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Leadership Training Completed</p>
                          <p className="text-xs text-slate-600">December 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Vacation Approved</p>
                          <p className="text-xs text-slate-600">January 15-20, 2024</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Overview */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Overall Rating</span>
                      <div className="flex items-center gap-2">
                        <Star className={`h-5 w-5 ${getPerformanceColor(employee.performance)}`} />
                        <span className={`font-semibold text-lg ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance}/5.0
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Leadership</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Communication</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Problem Solving</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Reviews */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Performance Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {performanceReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-slate-900">{review.period}</h4>
                            <div className="flex items-center gap-2">
                              <Star className={`h-4 w-4 ${getPerformanceColor(review.rating)}`} />
                              <span className={`text-sm font-medium ${getPerformanceColor(review.rating)}`}>
                                {review.rating}/5.0
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-slate-600">Reviewer: {review.reviewer}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-600">Status: 
                                <Badge className={`ml-1 ${review.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {review.status}
                                </Badge>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leave" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leave Balance */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Leave Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Vacation</span>
                        <span className="font-semibold">18 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Sick Leave</span>
                        <span className="font-semibold">10 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Personal</span>
                        <span className="font-semibold">5 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Study</span>
                        <span className="font-semibold">3 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Leave History */}
                <Card className="bg-white shadow-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Leave History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaveHistory.map((leave) => (
                        <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getLeaveTypeIcon(leave.type)}
                            <div>
                              <p className="font-medium text-slate-900">{leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave</p>
                              <p className="text-sm text-slate-600">{leave.startDate} - {leave.endDate} ({leave.days} days)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getLeaveTypeColor(leave.type)}>
                              {leave.type}
                            </Badge>
                            <Badge className={leave.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {leave.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="salary" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Salary Overview */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Current Salary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Basic Salary</span>
                        <span className="font-semibold">TZS 2,500,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Housing Allowance</span>
                        <span className="font-semibold">TZS 300,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Transport Allowance</span>
                        <span className="font-semibold">TZS 150,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Meal Allowance</span>
                        <span className="font-semibold">TZS 50,000</span>
                      </div>
                      <hr />
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total</span>
                        <span>TZS 3,000,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Salary History */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Salary History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {salaryHistory.map((salary, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">{salary.month} {salary.year}</p>
                            <p className="text-sm text-slate-600">Net: TZS {salary.netSalary.toLocaleString()}</p>
                          </div>
                          <Badge className={salary.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {salary.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Training Overview */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Training Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">8</div>
                          <div className="text-sm text-blue-600">Completed</div>
                      </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">2</div>
                          <div className="text-sm text-green-600">In Progress</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">3</div>
                          <div className="text-sm text-purple-600">Certifications</div>
                      </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">92%</div>
                          <div className="text-sm text-orange-600">Avg Score</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Training History */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Training History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trainingHistory.map((training) => (
                        <div key={training.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{training.title}</h4>
                            <Badge className={getTrainingTypeColor(training.type)}>
                              {training.type}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-600">{training.startDate} - {training.endDate}</p>
                            <div className="flex items-center justify-between">
                              <Badge className={training.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                {training.status}
                              </Badge>
                              {training.score && (
                                <span className="text-sm font-medium">Score: {training.score}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Employee Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">Employment Contract</p>
                          <p className="text-sm text-slate-600">Signed on {employee.hireDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">Performance Review</p>
                          <p className="text-sm text-slate-600">Last updated: December 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-slate-900">Training Certificates</p>
                          <p className="text-sm text-slate-600">3 certificates available</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium text-slate-900">Awards & Recognition</p>
                          <p className="text-sm text-slate-600">2 awards received</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Permissions Overview */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Current Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Dashboard</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Full Access</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Human Resources</span>
                    </div>
                        <Badge className="bg-blue-100 text-blue-800">Read Only</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Projects</span>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Limited</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-600">Finance</span>
                        </div>
                        <Badge className="bg-gray-100 text-gray-600">No Access</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-600">Sales</span>
                        </div>
                        <Badge className="bg-gray-100 text-gray-600">No Access</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Permission Management */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Manage Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 mb-4">
                        Manage system access permissions for {employee.name}
                      </p>
                      
                                             {/* Module Permissions */}
                       <div className="space-y-4">
                         <h4 className="font-medium text-slate-900">Module & Feature Access</h4>
                         
                         {/* Dashboard Module */}
                         <div className="border rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-3">
                             <BarChart3 className="h-4 w-4 text-blue-500" />
                             <span className="font-medium">Dashboard</span>
                           </div>
                           <div className="space-y-2 ml-6">
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">View Analytics</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="read">Read</option>
                                 <option value="none">No Access</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Export Reports</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                                 <option value="none">No Access</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Customize Dashboard</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                                 <option value="none">No Access</option>
                               </select>
                             </div>
                           </div>
                         </div>

                         {/* HR Module */}
                         <div className="border rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-3">
                             <Users className="h-4 w-4 text-green-500" />
                             <span className="font-medium">Human Resources</span>
                           </div>
                           <div className="space-y-2 ml-6">
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">View Employees</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="read">Read</option>
                                 <option value="none">No Access</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Add/Edit Employees</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Manage Permissions</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">View Salary Info</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Manage Leave Requests</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                           </div>
                         </div>

                         {/* Projects Module */}
                         <div className="border rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-3">
                             <Briefcase className="h-4 w-4 text-purple-500" />
                             <span className="font-medium">Projects</span>
                           </div>
                           <div className="space-y-2 ml-6">
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">View Projects</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="read">Read</option>
                                 <option value="none">No Access</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Create Projects</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Assign Team Members</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Update Progress</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                                 <option value="none">No Access</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">View Reports</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="read">Read</option>
                                 <option value="none">No Access</option>
                               </select>
                             </div>
                           </div>
                         </div>

                         {/* Finance Module */}
                         <div className="border rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-3">
                             <DollarSign className="h-4 w-4 text-green-500" />
                             <span className="font-medium">Finance</span>
                           </div>
                           <div className="space-y-2 ml-6">
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">View Financial Reports</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Record Transactions</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Manage Accounts</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Generate Statements</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Budget Management</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                           </div>
                         </div>

                         {/* Sales Module */}
                         <div className="border rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-3">
                             <TrendingUp className="h-4 w-4 text-orange-500" />
                             <span className="font-medium">Sales</span>
                           </div>
                           <div className="space-y-2 ml-6">
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">View Sales Data</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Create Quotes</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Manage Customers</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Track Leads</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-sm text-slate-600">Generate Reports</span>
                               <select className="px-2 py-1 border rounded text-xs">
                                 <option value="none">No Access</option>
                                 <option value="write">Write</option>
                                 <option value="read">Read</option>
                               </select>
                             </div>
                           </div>
                         </div>
                       </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1">
                          <Shield className="h-4 w-4 mr-2" />
                          Update Permissions
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

                {/* Permission History */}
                <Card className="bg-white shadow-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Permission History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Shield className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">HR Module Access Granted</p>
                            <p className="text-sm text-slate-600">Read-only access to Human Resources module</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">Admin User</p>
                          <p className="text-xs text-slate-600">January 15, 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Dashboard Full Access</p>
                            <p className="text-sm text-slate-600">Full access to Dashboard module</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">System Admin</p>
                          <p className="text-xs text-slate-600">January 10, 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Finance Access Removed</p>
                            <p className="text-sm text-slate-600">Access to Finance module revoked</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">HR Manager</p>
                          <p className="text-xs text-slate-600">December 20, 2023</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
