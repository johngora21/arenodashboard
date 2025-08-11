"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  Calculator, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  BarChart3,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Building,
  MapPin
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  month: string
  year: string
  status: 'pending' | 'processed' | 'paid' | 'cancelled'
  paymentMethod: 'bank' | 'cash' | 'mobile_money'
  paymentDate?: string
  remarks?: string
}

interface PayrollSummary {
  totalEmployees: number
  totalBasicSalary: number
  totalAllowances: number
  totalDeductions: number
  totalNetSalary: number
  averageSalary: number
  highestSalary: number
  lowestSalary: number
}

export default function PayrollManagementPage() {
  const router = useRouter()
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)

  // Mock data
  const mockPayrollRecords: PayrollRecord[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Operations",
      position: "Senior Manager",
      basicSalary: 2500000,
      allowances: 500000,
      deductions: 200000,
      netSalary: 2800000,
      month: "January",
      year: "2024",
      status: "paid",
      paymentMethod: "bank",
      paymentDate: "2024-01-31"
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      department: "Human Resources",
      position: "HR Specialist",
      basicSalary: 1800000,
      allowances: 300000,
      deductions: 150000,
      netSalary: 1950000,
      month: "January",
      year: "2024",
      status: "paid",
      paymentMethod: "bank",
      paymentDate: "2024-01-31"
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      department: "Logistics",
      position: "Driver",
      basicSalary: 1200000,
      allowances: 200000,
      deductions: 100000,
      netSalary: 1300000,
      month: "January",
      year: "2024",
      status: "paid",
      paymentMethod: "mobile_money",
      paymentDate: "2024-01-31"
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "Sarah Wilson",
      department: "Finance",
      position: "Accountant",
      basicSalary: 2000000,
      allowances: 400000,
      deductions: 180000,
      netSalary: 2220000,
      month: "January",
      year: "2024",
      status: "processed",
      paymentMethod: "bank"
    },
    {
      id: "5",
      employeeId: "EMP005",
      employeeName: "David Brown",
      department: "Logistics",
      position: "Logistics Manager",
      basicSalary: 2200000,
      allowances: 450000,
      deductions: 200000,
      netSalary: 2450000,
      month: "January",
      year: "2024",
      status: "pending",
      paymentMethod: "bank"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setPayrollRecords(mockPayrollRecords)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMonth = selectedMonth === "all" || record.month === selectedMonth
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus
    const matchesDepartment = selectedDepartment === "all" || record.department === selectedDepartment
    
    return matchesSearch && matchesMonth && matchesStatus && matchesDepartment
  })

  const summary: PayrollSummary = {
    totalEmployees: payrollRecords.length,
    totalBasicSalary: payrollRecords.reduce((sum, record) => sum + record.basicSalary, 0),
    totalAllowances: payrollRecords.reduce((sum, record) => sum + record.allowances, 0),
    totalDeductions: payrollRecords.reduce((sum, record) => sum + record.deductions, 0),
    totalNetSalary: payrollRecords.reduce((sum, record) => sum + record.netSalary, 0),
    averageSalary: payrollRecords.length > 0 ? payrollRecords.reduce((sum, record) => sum + record.netSalary, 0) / payrollRecords.length : 0,
    highestSalary: Math.max(...payrollRecords.map(record => record.netSalary)),
    lowestSalary: Math.min(...payrollRecords.map(record => record.netSalary))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "processed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "bank":
        return <Banknote className="h-4 w-4" />
      case "cash":
        return <CreditCard className="h-4 w-4" />
      case "mobile_money":
        return <Receipt className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return `TZS ${(amount / 1000000).toFixed(1)}M`
  }

  const months = Array.from(new Set(payrollRecords.map(record => record.month)))
  const departments = Array.from(new Set(payrollRecords.map(record => record.department)))
  const statuses = ["pending", "processed", "paid", "cancelled"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading payroll data...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Payroll Management</h1>
                    <p className="text-slate-600">Handle salary, benefits, and compensation</p>
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
                    <Calculator className="h-4 w-4 mr-2" />
                    Process Payroll
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payroll">Payroll Records</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Employees</p>
                          <p className="text-2xl font-bold text-slate-900">{summary.totalEmployees}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Net Salary</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalNetSalary)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Average Salary</p>
                          <p className="text-2xl font-bold text-purple-600">{formatCurrency(summary.averageSalary)}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Deductions</p>
                          <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalDeductions)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                          <TrendingDown className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Salary Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Basic Salary</span>
                          <span className="font-semibold">{formatCurrency(summary.totalBasicSalary)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Allowances</span>
                          <span className="font-semibold text-green-600">{formatCurrency(summary.totalAllowances)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Deductions</span>
                          <span className="font-semibold text-red-600">{formatCurrency(summary.totalDeductions)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-medium text-slate-900">Net Salary</span>
                          <span className="font-bold text-slate-900">{formatCurrency(summary.totalNetSalary)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Payment Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Paid</span>
                          <Badge className="bg-green-100 text-green-800">
                            {payrollRecords.filter(r => r.status === 'paid').length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Processed</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {payrollRecords.filter(r => r.status === 'processed').length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Pending</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {payrollRecords.filter(r => r.status === 'pending').length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Cancelled</span>
                          <Badge className="bg-red-100 text-red-800">
                            {payrollRecords.filter(r => r.status === 'cancelled').length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payroll" className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search payroll records..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Months</option>
                        {months.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      
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
                      
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payroll Records Table */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Payroll Records</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {record.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{record.employeeName}</h3>
                              <p className="text-sm text-slate-600">{record.position} • {record.department}</p>
                              <p className="text-xs text-slate-500">ID: {record.employeeId}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Net Salary</p>
                              <p className="font-semibold text-slate-900">{formatCurrency(record.netSalary)}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(record.paymentMethod)}
                              <span className="text-sm text-slate-600">{record.paymentMethod.replace('_', ' ')}</span>
                            </div>
                            
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Monthly Payroll Report</h3>
                        <p className="text-sm text-slate-600 mb-4">Generate comprehensive monthly payroll summary</p>
                        <Button size="sm" className="w-full">Generate Report</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Salary Analysis</h3>
                        <p className="text-sm text-slate-600 mb-4">Analyze salary trends and distributions</p>
                        <Button size="sm" className="w-full">View Analysis</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <Download className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Export Data</h3>
                        <p className="text-sm text-slate-600 mb-4">Export payroll data for external processing</p>
                        <Button size="sm" className="w-full">Export</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Payroll Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Tax Settings</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Tax Rate (%)</span>
                            <span className="font-medium">15%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Tax-Free Allowance</span>
                            <span className="font-medium">TZS 500,000</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Deduction Settings</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Social Security (%)</span>
                            <span className="font-medium">5%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Health Insurance (%)</span>
                            <span className="font-medium">3%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Payment Settings</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Payment Day</span>
                            <span className="font-medium">Last day of month</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Default Payment Method</span>
                            <span className="font-medium">Bank Transfer</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
