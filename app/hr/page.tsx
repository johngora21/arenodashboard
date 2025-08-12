"use client";

import { useState } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { Users, UserPlus, Award, TrendingUp, Calendar, DollarSign, FileText, Plus, Filter, Eye, Edit, Trash2, Shield, BarChart3, Download, Search, MoreHorizontal, GraduationCap, Clock, MessageSquare, Mail, Building, Briefcase, Phone, Upload, CheckCircle, TrendingDown, UserCheck, UserX, MapPin, Target, Activity, Zap, Star, AlertTriangle, CheckCircle2, Clock3, PieChart, LineChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function HRPage() {
  const router = useRouter();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [isEmployeeProfileModalOpen, setIsEmployeeProfileModalOpen] = useState(false);
  const [isEmployeeViewModalOpen, setIsEmployeeViewModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isEmployeeRelationsModalOpen, setIsEmployeeRelationsModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
  const [isEmployeeSelectionModalOpen, setIsEmployeeSelectionModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedEmployeesForModule, setSelectedEmployeesForModule] = useState<string[]>([]);

  // Sample employee data
  const employees = [
    { id: 1, name: "John Doe", email: "john.doe@company.com", department: "Engineering", position: "Senior Developer", status: "Active", joinDate: "2023-01-15", branch: "Main Branch" },
    { id: 2, name: "Jane Smith", email: "jane.smith@company.com", department: "Marketing", position: "Marketing Manager", status: "Active", joinDate: "2022-08-20", branch: "Dar es Salaam" },
    { id: 3, name: "Mike Johnson", email: "mike.johnson@company.com", department: "Sales", position: "Sales Representative", status: "On Leave", joinDate: "2023-03-10", branch: "Arusha" },
    { id: 4, name: "Sarah Wilson", email: "sarah.wilson@company.com", department: "HR", position: "HR Specialist", status: "Active", joinDate: "2022-11-05", branch: "Main Branch" },
    { id: 5, name: "David Brown", email: "david.brown@company.com", department: "Engineering", position: "Frontend Developer", status: "Active", joinDate: "2023-06-01", branch: "Mwanza" },
  ];

  const departments = ["All", "Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];
  const statuses = ["All", "Active", "On Leave", "Terminated", "Suspended"];

  // Analytics data
  const hrMetrics = {
    totalEmployees: 156,
    activeEmployees: 142,
    onLeave: 8,
    terminated: 3,
    newHires: 12,
    turnoverRate: 2.1,
    avgTenure: 3.2,
    totalPayroll: 450000000,
    avgSalary: 2884615,
    trainingCompletion: 87,
    performanceRating: 4.2,
    attendanceRate: 94.5,
    leaveUtilization: 78.3
  };

  const departmentStats = [
    { name: "Engineering", count: 45, growth: 12.5, avgSalary: 3200000, performance: 4.3 },
    { name: "Sales", count: 38, growth: 8.2, avgSalary: 2800000, performance: 4.1 },
    { name: "Marketing", count: 25, growth: 15.8, avgSalary: 2600000, performance: 4.2 },
    { name: "Finance", count: 22, growth: 5.4, avgSalary: 3000000, performance: 4.4 },
    { name: "HR", count: 18, growth: 11.1, avgSalary: 2500000, performance: 4.0 },
    { name: "Operations", count: 8, growth: 25.0, avgSalary: 2400000, performance: 3.9 }
  ];

  const monthlyTrends = [
    { month: "Jan", hires: 8, terminations: 2, payroll: 420000000, attendance: 92.1 },
    { month: "Feb", hires: 6, terminations: 1, payroll: 425000000, attendance: 93.2 },
    { month: "Mar", hires: 12, terminations: 3, payroll: 430000000, attendance: 91.8 },
    { month: "Apr", hires: 9, terminations: 2, payroll: 435000000, attendance: 94.1 },
    { month: "May", hires: 7, terminations: 1, payroll: 440000000, attendance: 93.9 },
    { month: "Jun", hires: 11, terminations: 2, payroll: 445000000, attendance: 94.5 },
    { month: "Jul", hires: 8, terminations: 2, payroll: 448000000, attendance: 94.2 },
    { month: "Aug", hires: 10, terminations: 1, payroll: 450000000, attendance: 94.5 }
  ];

  const hrModules = [
    {
      id: "training",
      title: "Training & Development",
      description: "Manage training programs and skill development",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "bg-orange-500",
      onClick: () => {
        setSelectedModule("training");
        setIsEmployeeSelectionModalOpen(true);
      }
    },
    {
      id: "attendance",
      title: "Attendance & Leave",
      description: "Track attendance and manage leave requests",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-red-500",
      onClick: () => {
        setSelectedModule("attendance");
        setIsEmployeeSelectionModalOpen(true);
      }
    },
    {
      id: "employee-relations",
      title: "Employee Relations",
      description: "Handle grievances, conflicts, and workplace policies",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-blue-500",
      onClick: () => {
        setSelectedModule("employee-relations");
        setIsEmployeeSelectionModalOpen(true);
      }
    },
    {
      id: "payroll",
      title: "Payroll Management",
      description: "Handle salary processing and benefits",
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-emerald-500",
      onClick: () => {
        setSelectedModule("payroll");
        setIsEmployeeSelectionModalOpen(true);
      }
    }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === "All" || employee.branch === selectedBranch;
    const matchesDepartment = selectedDepartment === "All" || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All" || employee.status === selectedStatus;
    return matchesSearch && matchesBranch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Human Resources</h1>
                <p className="text-slate-600 mt-1 text-base">Manage employees, payroll, and HR operations</p>
              </div>
              <div className="flex space-x-3">
                <a 
                  href="/hr/reports"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </a>
                <a 
                  href="/hr/reports"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </a>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="dashboard" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="modules">HR Modules</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                        <p className="text-sm font-medium text-slate-700">Total Employees</p>
                        <p className="text-3xl font-bold text-slate-900">{hrMetrics.totalEmployees}</p>
                        <div className="flex items-center mt-1">
                          <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-xs text-green-600 font-medium">+{hrMetrics.newHires} this month</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Users className="h-8 w-8 text-slate-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                
                <Card className="bg-white border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Active Employees</p>
                        <p className="text-3xl font-bold text-slate-900">{hrMetrics.activeEmployees}</p>
                        <div className="flex items-center mt-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-xs text-green-600 font-medium">{((hrMetrics.activeEmployees/hrMetrics.totalEmployees)*100).toFixed(1)}% active rate</span>
              </div>
                      </div>
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <UserCheck className="h-8 w-8 text-slate-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">On Leave</p>
                        <p className="text-3xl font-bold text-slate-900">{hrMetrics.onLeave}</p>
                        <div className="flex items-center mt-1">
                          <Clock3 className="h-4 w-4 text-orange-600 mr-1" />
                          <span className="text-xs text-orange-600 font-medium">{hrMetrics.leaveUtilization}% utilization</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Calendar className="h-8 w-8 text-slate-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Total Payroll</p>
                        <p className="text-3xl font-bold text-slate-900">TZS {(hrMetrics.totalPayroll/1000000).toFixed(0)}M</p>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-xs text-green-600 font-medium">+8% from last month</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <DollarSign className="h-8 w-8 text-slate-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>



              {/* Department Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Department Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentStats.map((dept, index) => (
                        <div key={dept.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-blue-500' : 
                              index === 1 ? 'bg-green-500' : 
                              index === 2 ? 'bg-orange-500' : 
                              index === 3 ? 'bg-purple-500' : 
                              index === 4 ? 'bg-red-500' : 'bg-slate-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-slate-900">{dept.name}</p>
                              <p className="text-sm text-slate-600">{dept.count} employees</p>
                      </div>
                      </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-900">
                                TZS {(dept.avgSalary/1000000).toFixed(1)}M
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {dept.growth > 0 ? '+' : ''}{dept.growth}%
                              </Badge>
                      </div>
                            <p className="text-xs text-slate-500">Avg: {dept.performance}/5</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-green-600" />
                      Monthly Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {monthlyTrends.slice(-6).map((month, index) => (
                        <div key={month.month} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-700">{month.month}</span>
                      </div>
                            <div>
                              <p className="font-medium text-slate-900">{month.hires} hires</p>
                              <p className="text-sm text-slate-600">{month.terminations} terminations</p>
                      </div>
                      </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-900">
                              TZS {(month.payroll/1000000).toFixed(0)}M
                    </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-slate-500">{month.attendance}%</span>
              </div>
                      </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Pending Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                        <span className="text-sm text-orange-800">Leave requests pending</span>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">5</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-800">Performance reviews due</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">12</Badge>
                    </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <span className="text-sm text-red-800">Contract renewals</span>
                        <Badge variant="outline" className="bg-red-100 text-red-800">3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">Training program completed</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">Employee of the month</span>
                    </div>
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                        <Star className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-800">Performance milestone</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-slate-600" />
                      Location Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Main Branch</span>
                        <span className="text-sm font-medium text-slate-900">89</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Dar es Salaam</span>
                        <span className="text-sm font-medium text-slate-900">34</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Arusha</span>
                        <span className="text-sm font-medium text-slate-900">18</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Mwanza</span>
                        <span className="text-sm font-medium text-slate-900">15</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees" className="space-y-6 mt-8">
              <div className="flex justify-end mb-4">
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowAddEmployee(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
              
              <div className="flex items-center justify-start gap-4">
                    <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                      />
                    </div>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Branches</SelectItem>
                    <SelectItem value="Main Branch">Main Branch</SelectItem>
                    <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                    <SelectItem value="Arusha">Arusha</SelectItem>
                    <SelectItem value="Mwanza">Mwanza</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
                  
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      {/* Header with Avatar and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{employee.name}</h3>
                            <p className="text-sm text-gray-600 font-medium">{employee.position}</p>
                </div>
              </div>
                        <Badge
                          variant={employee.status === "Active" ? "default" : "secondary"}
                          className={`${
                            employee.status === "Active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-orange-100 text-orange-800 border-orange-200"
                          } font-medium px-3 py-1 text-xs`}
                        >
                          {employee.status}
                        </Badge>
                      </div>

                      {/* Employee Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Main Branch</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{employee.department}</span>
                          </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">+255 123 456 789</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                          size="sm" 
                            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsEmployeeViewModalOpen(true)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 transition-colors"
                            onClick={() => setIsEmployeeProfileModalOpen(true)}
                          >
                            <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                        <div className="text-xs text-gray-400 font-medium">
                          ID: {employee.id}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900">HR Management Modules</h3>
                <Button 
                  onClick={() => setIsAddPositionModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {hrModules.map((module) => (
                  <Card 
                    key={module.id} 
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={module.onClick}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${module.color} text-white`}>
                          {module.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{module.title}</h3>
                          <p className="text-sm text-slate-600">{module.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>

                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Employee Reports</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Employee Directory
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Turnover Analysis
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Leave Management
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Payroll Summary
                        </Button>
                          </div>
                        </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Analytics</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Performance Metrics
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Department Overview
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Award className="h-4 w-4 mr-2" />
                          Training Progress
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                        </div>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Add Employee Modal */}
          <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Employee
                </DialogTitle>
                <DialogDescription>
                  Enter the employee information below. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="Enter first name" />
      </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(d => d !== "All").map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input id="position" placeholder="Enter job position" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date *</Label>
                  <Input id="joinDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input id="salary" placeholder="Enter salary amount" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter full address" rows={3} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddEmployee(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddEmployee(false)}>
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reports Modal */}
          <Dialog open={showReports} onOpenChange={setShowReports}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  HR Reports & Analytics
                </DialogTitle>
                <DialogDescription>
                  Generate comprehensive reports and view analytics for your HR operations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Employee Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Employee Directory
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Turnover Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Leave Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Payroll Summary
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Performance Metrics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Department Overview
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-2" />
                      Training Progress
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReports(false)}>
                  Close
                </Button>
                <Button onClick={() => setShowReports(false)}>
                  Generate Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Permissions Modal */}
          <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Module Permissions Management
                </DialogTitle>
                <DialogDescription>
                  Configure access permissions for different HR modules and features.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Dashboard</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dashboard-view" />
                        <Label htmlFor="dashboard-view">View Dashboard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dashboard-edit" />
                        <Label htmlFor="dashboard-edit">Edit Dashboard</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">HR</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="hr-view" />
                        <Label htmlFor="hr-view">View HR</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="hr-edit" />
                        <Label htmlFor="hr-edit">Edit HR</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="hr-delete" />
                        <Label htmlFor="hr-delete">Delete HR</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Projects</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="projects-view" />
                        <Label htmlFor="projects-view">View Projects</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="projects-edit" />
                        <Label htmlFor="projects-edit">Edit Projects</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="projects-delete" />
                        <Label htmlFor="projects-delete">Delete Projects</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Finance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="finance-view" />
                        <Label htmlFor="finance-view">View Finance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="finance-edit" />
                        <Label htmlFor="finance-edit">Edit Finance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="finance-delete" />
                        <Label htmlFor="finance-delete">Delete Finance</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Sales</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sales-view" />
                        <Label htmlFor="sales-view">View Sales</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sales-edit" />
                        <Label htmlFor="sales-edit">Edit Sales</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sales-delete" />
                        <Label htmlFor="sales-delete">Delete Sales</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPermissions(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowPermissions(false)}>
                  Save Permissions
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

      {/* Employee Profile Modal */}
          <Dialog open={isEmployeeProfileModalOpen} onOpenChange={setIsEmployeeProfileModalOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Employee Profile - John Doe
                </DialogTitle>
                <DialogDescription>
                  Edit detailed employee information and profile.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="salary">Salary</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="access">Access</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profileFirstName">First Name</Label>
                      <Input id="profileFirstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileLastName">Last Name</Label>
                      <Input id="profileLastName" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileMiddleName">Middle Name</Label>
                      <Input id="profileMiddleName" defaultValue="Michael" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileDOB">Date of Birth</Label>
                      <Input id="profileDOB" type="date" defaultValue="1990-05-15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileGender">Gender</Label>
                      <Select defaultValue="male">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileNationalID">National ID</Label>
                      <Input id="profileNationalID" defaultValue="1234567890123456" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileMaritalStatus">Marital Status</Label>
                      <Select defaultValue="single">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileBloodGroup">Blood Group</Label>
                      <Select defaultValue="o-positive">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="o-positive">O+</SelectItem>
                          <SelectItem value="o-negative">O-</SelectItem>
                          <SelectItem value="a-positive">A+</SelectItem>
                          <SelectItem value="a-negative">A-</SelectItem>
                          <SelectItem value="b-positive">B+</SelectItem>
                          <SelectItem value="b-negative">B-</SelectItem>
                          <SelectItem value="ab-positive">AB+</SelectItem>
                          <SelectItem value="ab-negative">AB-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Emergency Contact</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName">Contact Name</Label>
                        <Input id="emergencyName" defaultValue="Jane Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyRelationship">Relationship</Label>
                        <Input id="emergencyRelationship" defaultValue="Spouse" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Phone</Label>
                        <Input id="emergencyPhone" defaultValue="+255 987 654 321" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Contact & Address Tab */}
                <TabsContent value="contact" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profileEmail">Email Address</Label>
                      <Input id="profileEmail" type="email" defaultValue="john.doe@company.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profilePhone">Phone Number</Label>
                      <Input id="profilePhone" defaultValue="+255 123 456 789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileAltPhone">Alternative Phone</Label>
                      <Input id="profileAltPhone" defaultValue="+255 123 456 788" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileCity">City</Label>
                      <Input id="profileCity" defaultValue="Dar es Salaam" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Current Address</h4>
                    <div className="space-y-2">
                      <Label htmlFor="profileAddress">Full Address</Label>
                      <Textarea id="profileAddress" defaultValue="123 Main Street, Oyster Bay, Dar es Salaam, Tanzania" rows={3} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profileState">State/Region</Label>
                        <Input id="profileState" defaultValue="Dar es Salaam" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profileCountry">Country</Label>
                        <Input id="profileCountry" defaultValue="Tanzania" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profilePostalCode">Postal Code</Label>
                        <Input id="profilePostalCode" defaultValue="14110" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Employment Details Tab */}
                <TabsContent value="employment" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profileEmployeeID">Employee ID</Label>
                      <Input id="profileEmployeeID" defaultValue="EMP001" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileEmployeeNumber">Employee Number</Label>
                      <Input id="profileEmployeeNumber" defaultValue="2023001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileDepartment">Department</Label>
                      <Select defaultValue="engineering">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profilePosition">Position/Job Title</Label>
                      <Input id="profilePosition" defaultValue="Senior Developer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileEmploymentType">Employment Type</Label>
                      <Select defaultValue="full-time">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileEmploymentStatus">Employment Status</Label>
                      <Select defaultValue="active">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on-leave">On Leave</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileHireDate">Hire Date</Label>
                      <Input id="profileHireDate" type="date" defaultValue="2023-01-15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileProbationEnd">Probation End Date</Label>
                      <Input id="profileProbationEnd" type="date" defaultValue="2023-04-15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileContractEnd">Contract End Date</Label>
                      <Input id="profileContractEnd" type="date" defaultValue="2026-01-15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileManager">Reporting Manager</Label>
                      <Input id="profileManager" defaultValue="Sarah Wilson" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileLocation">Work Location/Branch</Label>
                      <Input id="profileLocation" defaultValue="Main Branch" />
                    </div>
                  </div>
                </TabsContent>

                {/* Salary & Benefits Tab */}
                <TabsContent value="salary" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profileBasicSalary">Basic Salary (TZS)</Label>
                      <Input id="profileBasicSalary" defaultValue="2500000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileAllowances">Allowances (TZS)</Label>
                      <Input id="profileAllowances" defaultValue="500000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileTotalPackage">Total Package (TZS)</Label>
                      <Input id="profileTotalPackage" defaultValue="3000000" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileBankName">Bank Name</Label>
                      <Input id="profileBankName" defaultValue="CRDB Bank" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileBankAccount">Bank Account Number</Label>
                      <Input id="profileBankAccount" defaultValue="1234567890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileTaxID">Tax ID</Label>
                      <Input id="profileTaxID" defaultValue="TAX123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileLastReview">Last Salary Review</Label>
                      <Input id="profileLastReview" type="date" defaultValue="2023-12-01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileNextReview">Next Review Date</Label>
                      <Input id="profileNextReview" type="date" defaultValue="2024-12-01" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Benefits</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="healthInsurance" defaultChecked />
                        <Label htmlFor="healthInsurance">Health Insurance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pension" defaultChecked />
                        <Label htmlFor="pension">Pension Plan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="lifeInsurance" defaultChecked />
                        <Label htmlFor="lifeInsurance">Life Insurance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="transportAllowance" defaultChecked />
                        <Label htmlFor="transportAllowance">Transport Allowance</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Performance & Skills Tab */}
                <TabsContent value="performance" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profilePerformanceRating">Performance Rating</Label>
                      <Select defaultValue="excellent">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent (5)</SelectItem>
                          <SelectItem value="very-good">Very Good (4)</SelectItem>
                          <SelectItem value="good">Good (3)</SelectItem>
                          <SelectItem value="satisfactory">Satisfactory (2)</SelectItem>
                          <SelectItem value="needs-improvement">Needs Improvement (1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileLastReviewDate">Last Performance Review</Label>
                      <Input id="profileLastReviewDate" type="date" defaultValue="2023-12-15" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Skills & Competencies</h4>
                    <div className="space-y-2">
                      <Label htmlFor="profileSkills">Technical Skills</Label>
                      <Textarea id="profileSkills" defaultValue="JavaScript, React, Node.js, Python, SQL, Git, Docker" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileLanguages">Languages Spoken</Label>
                      <Textarea id="profileLanguages" defaultValue="English (Fluent), Swahili (Native), French (Basic)" rows={2} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Certifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">AWS Certified Developer</p>
                          <p className="text-sm text-gray-600">Issued: 2023-06-15 | Expires: 2026-06-15</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">React Developer Certification</p>
                          <p className="text-sm text-gray-600">Issued: 2023-03-20 | Expires: 2025-03-20</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Attendance & Leave Tab */}
                <TabsContent value="attendance" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="profileWorkSchedule">Work Schedule</Label>
                      <Select defaultValue="full-time">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time (8 hours/day)</SelectItem>
                          <SelectItem value="part-time">Part-time (4 hours/day)</SelectItem>
                          <SelectItem value="flexible">Flexible Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileHolidayEntitlement">Holiday Entitlement (Days)</Label>
                      <Input id="profileHolidayEntitlement" defaultValue="25" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Leave Balance</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">15</p>
                        <p className="text-sm text-gray-600">Annual Leave</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">10</p>
                        <p className="text-sm text-gray-600">Sick Leave</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">5</p>
                        <p className="text-sm text-gray-600">Personal Leave</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">3</p>
                        <p className="text-sm text-gray-600">Maternity</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Recent Attendance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Today (2024-01-15)</span>
                        <Badge variant="default">Present</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Yesterday (2024-01-14)</span>
                        <Badge variant="default">Present</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>2024-01-13</span>
                        <Badge variant="secondary">Weekend</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Uploaded Documents</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profilePhoto">Profile Photo</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Button>
                          <span className="text-sm text-gray-600">profile-photo.jpg</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profileID">ID Document</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload ID
                          </Button>
                          <span className="text-sm text-gray-600">national-id.pdf</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Document Library</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Employment Contract</p>
                            <p className="text-sm text-gray-600">Signed: 2023-01-15</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Performance Review 2023</p>
                            <p className="text-sm text-gray-600">Completed: 2023-12-15</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Training Certificates</p>
                            <p className="text-sm text-gray-600">3 certificates</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* System Accessibility Tab */}
                <TabsContent value="access" className="space-y-6 py-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-4">HR Module Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Employee Directory</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Add New Employees</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Edit Employee Profiles</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Delete Employees</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Salary Information</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Generate Reports</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Manage Permissions</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Export Data</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Training & Development Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Training Programs</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Create Training Programs</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Assign Training</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Track Progress</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Attendance & Leave Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Attendance Records</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Approve Leave Requests</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Manage Leave Policies</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Generate Reports</span>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Payroll Management Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Payroll Information</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Process Salaries</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Manage Benefits</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Generate Reports</span>
                            <Select defaultValue="no">
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsEmployeeProfileModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsEmployeeProfileModalOpen(false)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Training & Development Modal */}
          <Dialog open={isTrainingModalOpen} onOpenChange={setIsTrainingModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Training & Development
                </DialogTitle>
                <DialogDescription>
                  Manage employee training programs, skill development, and learning initiatives.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainingProgram">Training Program</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leadership">Leadership Development</SelectItem>
                        <SelectItem value="technical">Technical Skills</SelectItem>
                        <SelectItem value="soft-skills">Soft Skills</SelectItem>
                        <SelectItem value="compliance">Compliance Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingDuration">Duration (weeks)</Label>
                    <Input id="trainingDuration" type="number" placeholder="4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingDescription">Description</Label>
                  <Textarea id="trainingDescription" placeholder="Describe the training program objectives and content..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainingStartDate">Start Date</Label>
                    <Input id="trainingStartDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingBudget">Budget (TZS)</Label>
                    <Input id="trainingBudget" placeholder="500000" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTrainingModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsTrainingModalOpen(false)}>
                  Create Program
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Attendance & Leave Modal */}
          <Dialog open={isAttendanceModalOpen} onOpenChange={setIsAttendanceModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Attendance & Leave Management
                </DialogTitle>
                <DialogDescription>
                  Track employee attendance, manage leave requests, and monitor time-off patterns.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="maternity">Maternity Leave</SelectItem>
                        <SelectItem value="paternity">Paternity Leave</SelectItem>
                        <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaveDuration">Duration (days)</Label>
                    <Input id="leaveDuration" type="number" placeholder="5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveStartDate">Start Date</Label>
                    <Input id="leaveStartDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaveEndDate">End Date</Label>
                    <Input id="leaveEndDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaveReason">Reason for Leave</Label>
                  <Textarea id="leaveReason" placeholder="Please provide a detailed reason for your leave request..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAttendanceModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAttendanceModalOpen(false)}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Employee Relations Modal */}
          <Dialog open={isEmployeeRelationsModalOpen} onOpenChange={setIsEmployeeRelationsModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Employee Relations
                </DialogTitle>
                <DialogDescription>
                  Handle workplace conflicts, grievances, and policy-related matters.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueType">Issue Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conflict">Workplace Conflict</SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="discrimination">Discrimination</SelectItem>
                        <SelectItem value="policy">Policy Violation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuePriority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDescription">Issue Description</Label>
                  <Textarea id="issueDescription" placeholder="Please provide a detailed description of the issue..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resolutionSteps">Proposed Resolution Steps</Label>
                  <Textarea id="resolutionSteps" placeholder="Outline the steps to resolve this issue..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmployeeRelationsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsEmployeeRelationsModalOpen(false)}>
                  Submit Case
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Payroll Management Modal */}
          <Dialog open={isPayrollModalOpen} onOpenChange={setIsPayrollModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payroll Management
                </DialogTitle>
                <DialogDescription>
                  Process employee salaries, manage benefits, and handle payroll-related operations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payrollPeriod">Payroll Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payrollMonth">Month</Label>
                    <Input id="payrollMonth" type="month" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicSalary">Basic Salary (TZS)</Label>
                    <Input id="basicSalary" placeholder="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowances">Allowances (TZS)</Label>
                    <Input id="allowances" placeholder="100000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions (TZS)</Label>
                    <Input id="deductions" placeholder="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="netSalary">Net Salary (TZS)</Label>
                    <Input id="netSalary" placeholder="550000" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payrollNotes">Notes</Label>
                  <Textarea id="payrollNotes" placeholder="Additional notes or comments..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayrollModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsPayrollModalOpen(false)}>
                  Process Payroll
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Employee View Modal - Read Only */}
          <Dialog open={isEmployeeViewModalOpen} onOpenChange={setIsEmployeeViewModalOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Employee Profile - John Doe
                </DialogTitle>
                <DialogDescription>
                  View comprehensive employee information and profile.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="salary">Salary</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="access">Access</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">First Name</Label>
                      <p className="text-sm font-medium">John</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                      <p className="text-sm font-medium">Doe</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Middle Name</Label>
                      <p className="text-sm font-medium">Michael</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                      <p className="text-sm font-medium">1990-05-15</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Gender</Label>
                      <p className="text-sm font-medium">Male</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">National ID</Label>
                      <p className="text-sm font-medium">1234567890123456</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Marital Status</Label>
                      <p className="text-sm font-medium">Single</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Blood Group</Label>
                      <p className="text-sm font-medium">O+</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Emergency Contact</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Contact Name</Label>
                        <p className="text-sm font-medium">Jane Doe</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Relationship</Label>
                        <p className="text-sm font-medium">Spouse</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Phone</Label>
                        <p className="text-sm font-medium">+255 987 654 321</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Contact & Address Tab */}
                <TabsContent value="contact" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                      <p className="text-sm font-medium">john.doe@company.com</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <p className="text-sm font-medium">+255 123 456 789</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Alternative Phone</Label>
                      <p className="text-sm font-medium">+255 123 456 788</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">City</Label>
                      <p className="text-sm font-medium">Dar es Salaam</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Current Address</h4>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Full Address</Label>
                      <p className="text-sm font-medium">123 Main Street, Oyster Bay, Dar es Salaam, Tanzania</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">State/Region</Label>
                        <p className="text-sm font-medium">Dar es Salaam</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Country</Label>
                        <p className="text-sm font-medium">Tanzania</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Postal Code</Label>
                        <p className="text-sm font-medium">14110</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Employment Details Tab */}
                <TabsContent value="employment" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Employee ID</Label>
                      <p className="text-sm font-medium">EMP001</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Employee Number</Label>
                      <p className="text-sm font-medium">2023001</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Department</Label>
                      <p className="text-sm font-medium">Engineering</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Position/Job Title</Label>
                      <p className="text-sm font-medium">Senior Developer</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Employment Type</Label>
                      <p className="text-sm font-medium">Full-time</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Employment Status</Label>
                      <p className="text-sm font-medium">Active</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Hire Date</Label>
                      <p className="text-sm font-medium">2023-01-15</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Probation End Date</Label>
                      <p className="text-sm font-medium">2023-04-15</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Contract End Date</Label>
                      <p className="text-sm font-medium">2026-01-15</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Reporting Manager</Label>
                      <p className="text-sm font-medium">Sarah Wilson</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Work Location/Branch</Label>
                      <p className="text-sm font-medium">Main Branch</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Salary & Benefits Tab */}
                <TabsContent value="salary" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Basic Salary (TZS)</Label>
                      <p className="text-sm font-medium">2,500,000</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Allowances (TZS)</Label>
                      <p className="text-sm font-medium">500,000</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Total Package (TZS)</Label>
                      <p className="text-sm font-medium">3,000,000</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Bank Name</Label>
                      <p className="text-sm font-medium">CRDB Bank</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Bank Account Number</Label>
                      <p className="text-sm font-medium">1234567890</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Tax ID</Label>
                      <p className="text-sm font-medium">TAX123456789</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Last Salary Review</Label>
                      <p className="text-sm font-medium">2023-12-01</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Next Review Date</Label>
                      <p className="text-sm font-medium">2024-12-01</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Benefits</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Health Insurance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Pension Plan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Life Insurance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Transport Allowance</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Performance & Skills Tab */}
                <TabsContent value="performance" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Performance Rating</Label>
                      <p className="text-sm font-medium">Excellent (5)</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Last Performance Review</Label>
                      <p className="text-sm font-medium">2023-12-15</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Skills & Competencies</h4>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Technical Skills</Label>
                      <p className="text-sm font-medium">JavaScript, React, Node.js, Python, SQL, Git, Docker</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Languages Spoken</Label>
                      <p className="text-sm font-medium">English (Fluent), Swahili (Native), French (Basic)</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Certifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">AWS Certified Developer</p>
                          <p className="text-sm text-gray-600">Issued: 2023-06-15 | Expires: 2026-06-15</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">React Developer Certification</p>
                          <p className="text-sm text-gray-600">Issued: 2023-03-20 | Expires: 2025-03-20</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Attendance & Leave Tab */}
                <TabsContent value="attendance" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Work Schedule</Label>
                      <p className="text-sm font-medium">Full-time (8 hours/day)</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Holiday Entitlement (Days)</Label>
                      <p className="text-sm font-medium">25</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Leave Balance</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">15</p>
                        <p className="text-sm text-gray-600">Annual Leave</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">10</p>
                        <p className="text-sm text-gray-600">Sick Leave</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">5</p>
                        <p className="text-sm text-gray-600">Personal Leave</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">3</p>
                        <p className="text-sm text-gray-600">Maternity</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Recent Attendance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Today (2024-01-15)</span>
                        <Badge variant="default">Present</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Yesterday (2024-01-14)</span>
                        <Badge variant="default">Present</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>2024-01-13</span>
                        <Badge variant="secondary">Weekend</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Uploaded Documents</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">Profile Photo</Label>
                        <p className="text-sm font-medium">profile-photo.jpg</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">ID Document</Label>
                        <p className="text-sm font-medium">national-id.pdf</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Document Library</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Employment Contract</p>
                            <p className="text-sm text-gray-600">Signed: 2023-01-15</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Performance Review 2023</p>
                            <p className="text-sm text-gray-600">Completed: 2023-12-15</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Training Certificates</p>
                            <p className="text-sm text-gray-600">3 certificates</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* System Accessibility Tab */}
                <TabsContent value="access" className="space-y-6 py-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-4">HR Module Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Employee Directory</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Add New Employees</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Edit Employee Profiles</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Delete Employees</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Salary Information</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Generate Reports</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Manage Permissions</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Export Data</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Training & Development Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Training Programs</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Create Training Programs</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Assign Training</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Track Progress</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Attendance & Leave Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Attendance Records</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Approve Leave Requests</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Manage Leave Policies</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Generate Reports</span>
                            <Badge variant="default">Yes</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Payroll Management Access</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Payroll Information</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Process Salaries</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Manage Benefits</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Generate Reports</span>
                            <Badge variant="secondary">No</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsEmployeeViewModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Position Modal */}
          <Dialog open={isAddPositionModalOpen} onOpenChange={setIsAddPositionModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Position
                </DialogTitle>
                <DialogDescription>
                  Define a new job position with roles, responsibilities, and requirements.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="positionTitle">Position Title *</Label>
                    <Input id="positionTitle" placeholder="e.g., Senior Software Engineer" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="level">Level *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Team Lead</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-branch">Main Branch</SelectItem>
                        <SelectItem value="dar-es-salaam">Dar es Salaam</SelectItem>
                        <SelectItem value="arusha">Arusha</SelectItem>
                        <SelectItem value="mwanza">Mwanza</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minSalary">Minimum Salary (TZS) *</Label>
                    <Input id="minSalary" type="number" placeholder="e.g., 800000" />
                  </div>
                  <div>
                    <Label htmlFor="maxSalary">Maximum Salary (TZS) *</Label>
                    <Input id="maxSalary" type="number" placeholder="e.g., 1500000" />
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea 
                    id="jobDescription" 
                    placeholder="Provide a comprehensive overview of the position..."
                    className="min-h-[120px]"
      />
    </div>

                {/* Key Responsibilities */}
                <div>
                  <Label htmlFor="responsibilities">Key Responsibilities *</Label>
                  <Textarea 
                    id="responsibilities" 
                    placeholder="List the main duties and responsibilities for this position..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="qualifications">Qualifications & Education</Label>
                    <Textarea 
                      id="qualifications" 
                      placeholder="Required education, certifications, etc..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience Requirements</Label>
                    <Textarea 
                      id="experience" 
                      placeholder="Required work experience, skills, etc..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="vacancies">Number of Vacancies</Label>
                    <Input id="vacancies" type="number" placeholder="e.g., 2" />
                  </div>
                </div>

                {/* Benefits & Perks */}
                <div>
                  <Label htmlFor="benefits">Benefits & Perks</Label>
                  <Textarea 
                    id="benefits" 
                    placeholder="List the benefits, perks, and advantages of this position..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsAddPositionModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Position
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Employee Selection Modal */}
          <Dialog open={isEmployeeSelectionModalOpen} onOpenChange={setIsEmployeeSelectionModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Employee(s) for {selectedModule === "training" ? "Training & Development" : 
                                       selectedModule === "attendance" ? "Attendance & Leave" : 
                                       selectedModule === "employee-relations" ? "Employee Relations" : 
                                       selectedModule === "payroll" ? "Payroll Management" : "HR Module"}
                </DialogTitle>
                <DialogDescription>
                  Choose the employee(s) you want to work with for this module.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Search and Filters */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="Search employees..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Departments</SelectItem>
                      {departments.filter(d => d !== "All").map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      {statuses.filter(s => s !== "All").map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Employee List */}
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  <div className="p-4 bg-slate-50 border-b">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        {filteredEmployees.length} employee(s) found
                      </span>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="select-all"
                          checked={selectedEmployeesForModule.length === filteredEmployees.length && filteredEmployees.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEmployeesForModule(filteredEmployees.map(emp => emp.id.toString()));
                            } else {
                              setSelectedEmployeesForModule([]);
                            }
                          }}
                        />
                        <Label htmlFor="select-all" className="text-sm">Select All</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {filteredEmployees.map((employee) => (
                      <div key={employee.id} className="p-4 hover:bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox 
                              id={`employee-${employee.id}`}
                              checked={selectedEmployeesForModule.includes(employee.id.toString())}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedEmployeesForModule(prev => [...prev, employee.id.toString()]);
                                } else {
                                  setSelectedEmployeesForModule(prev => prev.filter(id => id !== employee.id.toString()));
                                }
                              }}
                            />
                            <div>
                              <p className="font-medium text-slate-900">{employee.name}</p>
                              <p className="text-sm text-slate-600">{employee.position} • {employee.department}</p>
                              <p className="text-xs text-slate-500">{employee.email}</p>
                            </div>
                          </div>
                          <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                            {employee.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => {
                  setIsEmployeeSelectionModalOpen(false);
                  setSelectedEmployeesForModule([]);
                }}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={selectedEmployeesForModule.length === 0}
                  onClick={() => {
                    // Handle the selected employees based on the module
                    if (selectedModule === "training") {
                      setIsTrainingModalOpen(true);
                    } else if (selectedModule === "attendance") {
                      setIsAttendanceModalOpen(true);
                    } else if (selectedModule === "employee-relations") {
                      setIsEmployeeRelationsModalOpen(true);
                    } else if (selectedModule === "payroll") {
                      setIsPayrollModalOpen(true);
                    }
                    setIsEmployeeSelectionModalOpen(false);
                  }}
                >
                  Continue with {selectedEmployeesForModule.length} selected employee{selectedEmployeesForModule.length !== 1 ? 's' : ''}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}