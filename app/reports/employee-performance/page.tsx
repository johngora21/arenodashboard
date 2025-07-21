"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  Users,
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  Building,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  UserCheck,
  UserX,
  Loader2,
  Home,
  Package,
  Truck,
  Car,
  Warehouse,
  Store,
  Factory,
  Briefcase,
  Settings,
  Plus,
  Search,
  Info,
  Package2,
  User,
  AlertTriangle,
  CheckSquare,
  Minus,
  Plus as PlusIcon
} from "lucide-react"
import { ReportService, ReportFilters } from "@/lib/report-service"
import { getAllEmployees, getAllDepartments } from "@/lib/firebase-service"
import { reportTemplates, getTemplatesByRole, getTemplatesByCategory, ReportTemplate } from "@/lib/report-templates"

// Mock data for team members and materials
const mockTeamMembers = [
  { id: '1', name: 'John Smith', role: 'Driver', department: 'Logistics', status: 'active', assignedTasks: 5, completedTasks: 4 },
  { id: '2', name: 'Sarah Johnson', role: 'Warehouse Manager', department: 'Inventory', status: 'active', assignedTasks: 3, completedTasks: 3 },
  { id: '3', name: 'Mike Wilson', role: 'Supervisor', department: 'Operations', status: 'active', assignedTasks: 8, completedTasks: 7 },
  { id: '4', name: 'Lisa Brown', role: 'Driver', department: 'Logistics', status: 'active', assignedTasks: 6, completedTasks: 5 },
  { id: '5', name: 'David Lee', role: 'Customer Service', department: 'Support', status: 'active', assignedTasks: 4, completedTasks: 4 },
  { id: '6', name: 'Emma Davis', role: 'Manager', department: 'Operations', status: 'active', assignedTasks: 10, completedTasks: 9 },
  { id: '7', name: 'James Miller', role: 'Driver', department: 'Logistics', status: 'active', assignedTasks: 7, completedTasks: 6 },
  { id: '8', name: 'Anna Garcia', role: 'Supervisor', department: 'Operations', status: 'active', assignedTasks: 6, completedTasks: 5 }
]

const mockMaterials = [
  { id: '1', name: 'Packing Boxes (Large)', category: 'Packing', totalQuantity: 100, availableQuantity: 75, unit: 'boxes', cost: 2.50 },
  { id: '2', name: 'Bubble Wrap Rolls', category: 'Packing', totalQuantity: 50, availableQuantity: 30, unit: 'rolls', cost: 15.00 },
  { id: '3', name: 'Moving Blankets', category: 'Protection', totalQuantity: 200, availableQuantity: 150, unit: 'blankets', cost: 8.00 },
  { id: '4', name: 'Furniture Dollies', category: 'Equipment', totalQuantity: 20, availableQuantity: 12, unit: 'dollies', cost: 45.00 },
  { id: '5', name: 'Hand Trucks', category: 'Equipment', totalQuantity: 15, availableQuantity: 8, unit: 'trucks', cost: 35.00 },
  { id: '6', name: 'Strapping Tape', category: 'Packing', totalQuantity: 300, availableQuantity: 200, unit: 'rolls', cost: 3.50 },
  { id: '7', name: 'Corner Protectors', category: 'Protection', totalQuantity: 500, availableQuantity: 350, unit: 'protectors', cost: 1.25 },
  { id: '8', name: 'Furniture Pads', category: 'Protection', totalQuantity: 150, availableQuantity: 100, unit: 'pads', cost: 12.00 }
]

// Role definitions with their responsibilities
const roleDefinitions = {
  admin: {
    name: "Super Administrator",
    description: "Full system access - can create any type of report",
    icon: Settings,
    color: "bg-purple-500"
  },
  moving_manager: {
    name: "Moving Service Manager",
    description: "Manages moving services, teams, and client relationships",
    icon: Home,
    color: "bg-blue-500"
  },
  moving_supervisor: {
    name: "Moving Service Supervisor",
    description: "Supervises moving teams and ensures service quality",
    icon: Users,
    color: "bg-blue-400"
  },
  freight_supervisor: {
    name: "Freight Service Supervisor",
    description: "Manages freight operations, routes, and cargo handling",
    icon: Package,
    color: "bg-green-500"
  },
  freight_manager: {
    name: "Freight Service Manager",
    description: "Oversees freight operations and strategic planning",
    icon: Truck,
    color: "bg-green-600"
  },
  courier_supervisor: {
    name: "Courier Service Supervisor",
    description: "Manages courier deliveries and package tracking",
    icon: Car,
    color: "bg-orange-500"
  },
  warehouse_manager: {
    name: "Warehouse Manager",
    description: "Manages warehouse operations and inventory",
    icon: Warehouse,
    color: "bg-gray-500"
  },
  driver: {
    name: "Driver",
    description: "Handles deliveries and route execution",
    icon: Truck,
    color: "bg-yellow-500"
  },
  customer_service: {
    name: "Customer Service Representative",
    description: "Handles customer inquiries and support",
    icon: UserCheck,
    color: "bg-pink-500"
  }
}

export default function CreateReportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [availableTemplates, setAvailableTemplates] = useState<ReportTemplate[]>([])
  const [reportData, setReportData] = useState<any>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('role-selection')
  
  // Enhanced state for materials and team members tracking
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([])
  const [materialUsage, setMaterialUsage] = useState<{[key: string]: number}>({})
  const [teamMemberReports, setTeamMemberReports] = useState<{[key: string]: any}>({})

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // When role is selected, load available templates
  useEffect(() => {
    if (selectedRole) {
      const templates = getTemplatesByRole(selectedRole)
      setAvailableTemplates(templates)
      setSelectedTemplate(null)
      setReportData({})
      setSelectedTeamMembers([])
      setSelectedMaterials([])
      setMaterialUsage({})
      setTeamMemberReports({})
    }
  }, [selectedRole])

  // When template is selected, initialize report data
  useEffect(() => {
    if (selectedTemplate) {
      const initialData: any = {}
      selectedTemplate.requiredFields.forEach(field => {
        initialData[field] = ''
      })
      selectedTemplate.optionalFields.forEach(field => {
        initialData[field] = ''
      })
      setReportData(initialData)
    }
  }, [selectedTemplate])

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    setActiveTab('template-selection')
  }

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    setActiveTab('report-configuration')
  }

  const handleFieldChange = (field: string, value: string) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Enhanced handlers for team members and materials
  const handleTeamMemberToggle = (memberId: string) => {
    setSelectedTeamMembers(prev => {
      if (prev.includes(memberId)) {
        const newSelected = prev.filter(id => id !== memberId)
        const newReports = { ...teamMemberReports }
        delete newReports[memberId]
        setTeamMemberReports(newReports)
        return newSelected
      } else {
        const member = mockTeamMembers.find(m => m.id === memberId)
        if (member) {
          setTeamMemberReports(prev => ({
            ...prev,
            [memberId]: {
              member,
              tasksCompleted: 0,
              issues: '',
              performance: 'good',
              notes: ''
            }
          }))
        }
        return [...prev, memberId]
      }
    })
  }

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterials(prev => {
      if (prev.find(m => m.id === materialId)) {
        const newSelected = prev.filter(m => m.id !== materialId)
        const newUsage = { ...materialUsage }
        delete newUsage[materialId]
        setMaterialUsage(newUsage)
        return newSelected
      } else {
        const material = mockMaterials.find(m => m.id === materialId)
        if (material) {
          setMaterialUsage(prev => ({
            ...prev,
            [materialId]: 0
          }))
          return [...prev, material]
        }
        return prev
      }
    })
  }

  const handleMaterialUsageChange = (materialId: string, usage: number) => {
    setMaterialUsage(prev => ({
      ...prev,
      [materialId]: Math.max(0, usage)
    }))
  }

  const handleTeamMemberReportChange = (memberId: string, field: string, value: any) => {
    setTeamMemberReports(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value
      }
    }))
  }

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return

    try {
      setIsGenerating(true)
      
      // Validate required fields
      const missingFields = selectedTemplate.requiredFields.filter(field => !reportData[field])
      if (missingFields.length > 0) {
        alert(`Please fill in required fields: ${missingFields.join(', ')}`)
        return
      }

      // Generate report based on template
      const report = {
        id: Date.now().toString(),
        title: reportData.title || `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
        description: reportData.description || selectedTemplate.description,
        type: selectedTemplate.category,
        status: 'draft',
        createdBy: user?.displayName || 'Admin',
        createdAt: new Date(),
        lastModified: new Date(),
        data: {
          ...reportData,
          teamMembers: selectedTeamMembers.map(id => {
            const member = mockTeamMembers.find(m => m.id === id)
            const report = teamMemberReports[id]
            return {
              ...member,
              report: report || {}
            }
          }),
          materials: selectedMaterials.map(material => ({
            ...material,
            usedQuantity: materialUsage[material.id] || 0,
            remainingQuantity: material.availableQuantity - (materialUsage[material.id] || 0),
            cost: (materialUsage[material.id] || 0) * material.cost
          }))
        },
        filters: {
          role: selectedRole,
          template: selectedTemplate.id,
          ...reportData
        },
        template: selectedTemplate,
        isAIGenerated: false
      }

      setGeneratedReport(report)
      setActiveTab('report-preview')
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!generatedReport) return

    const dataStr = JSON.stringify(generatedReport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${generatedReport.title.replace(/\s+/g, '_')}_${format}.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const renderField = (field: string) => {
    const value = reportData[field] || ''
    const isRequired = selectedTemplate?.requiredFields.includes(field)

    switch (field) {
      case 'title':
        return (
          <div key={field}>
            <Label htmlFor={field}>
              Report Title {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder="Enter report title"
            />
          </div>
        )
      case 'description':
        return (
          <div key={field}>
            <Label htmlFor={field}>
              Description {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder="Enter report description"
              rows={3}
            />
          </div>
        )
      case 'period':
        return (
          <div key={field}>
            <Label htmlFor={field}>
              Period {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleFieldChange(field, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="last_quarter">Last Quarter</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case 'start_time':
      case 'end_time':
        return (
          <div key={field}>
            <Label htmlFor={field}>
              {field === 'start_time' ? 'Start Time' : 'End Time'} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field}
              type="datetime-local"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            />
          </div>
        )
      case 'team_members':
        return (
          <div key={field}>
            <Label htmlFor={field}>
              Team Members {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-3">
              <div className="text-sm text-slate-600 mb-2">
                Select team members and track their performance
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {mockTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedTeamMembers.includes(member.id)}
                      onCheckedChange={() => handleTeamMemberToggle(member.id)}
                    />
                    <Label htmlFor={`member-${member.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-slate-500">{member.role} • {member.department}</div>
                        </div>
                        <div className="text-xs text-right">
                          <div className="text-green-600">{member.completedTasks}/{member.assignedTasks} tasks</div>
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              
              {/* Team Member Reports */}
              {selectedTeamMembers.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-slate-900">Team Member Reports</h4>
                  {selectedTeamMembers.map((memberId) => {
                    const member = mockTeamMembers.find(m => m.id === memberId)
                    const report = teamMemberReports[memberId]
                    if (!member) return null
                    
                    return (
                      <Card key={memberId} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{member.name}</div>
                          <Select 
                            value={report?.performance || 'good'} 
                            onValueChange={(value) => handleTeamMemberReportChange(memberId, 'performance', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <Label className="text-xs">Tasks Completed</Label>
                            <Input
                              type="number"
                              value={report?.tasksCompleted || 0}
                              onChange={(e) => handleTeamMemberReportChange(memberId, 'tasksCompleted', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Issues</Label>
                            <Input
                              value={report?.issues || ''}
                              onChange={(e) => handleTeamMemberReportChange(memberId, 'issues', e.target.value)}
                              placeholder="Any issues?"
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Notes</Label>
                          <Textarea
                            value={report?.notes || ''}
                            onChange={(e) => handleTeamMemberReportChange(memberId, 'notes', e.target.value)}
                            placeholder="Additional notes..."
                            rows={2}
                            className="text-xs"
                          />
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      case 'materials_used':
        return (
          <div key={field}>
            <Label htmlFor={field}>Materials Used</Label>
            <div className="space-y-3">
              <div className="text-sm text-slate-600 mb-2">
                Select materials and track usage quantities
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {mockMaterials.map((material) => (
                  <div key={material.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`material-${material.id}`}
                      checked={selectedMaterials.find(m => m.id === material.id) !== undefined}
                      onCheckedChange={() => handleMaterialToggle(material.id)}
                    />
                    <Label htmlFor={`material-${material.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-xs text-slate-500">{material.category} • ${material.cost}/{material.unit}</div>
                        </div>
                        <div className="text-xs text-right">
                          <div className="text-blue-600">{material.availableQuantity}/{material.totalQuantity} {material.unit}</div>
                          <Badge variant="outline" className="text-xs">
                            Available
                          </Badge>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              
              {/* Material Usage Tracking */}
              {selectedMaterials.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-slate-900">Material Usage Tracking</h4>
                  {selectedMaterials.map((material) => (
                    <Card key={material.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{material.name}</div>
                        <div className="text-sm text-slate-600">
                          Available: {material.availableQuantity} {material.unit}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Used Quantity</Label>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMaterialUsageChange(material.id, (materialUsage[material.id] || 0) - 1)}
                              disabled={(materialUsage[material.id] || 0) <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={materialUsage[material.id] || 0}
                              onChange={(e) => handleMaterialUsageChange(material.id, parseInt(e.target.value) || 0)}
                              className="h-8 text-center"
                              min="0"
                              max={material.availableQuantity}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMaterialUsageChange(material.id, (materialUsage[material.id] || 0) + 1)}
                              disabled={(materialUsage[material.id] || 0) >= material.availableQuantity}
                            >
                              <PlusIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Remaining</Label>
                          <div className="text-sm font-medium text-green-600">
                            {material.availableQuantity - (materialUsage[material.id] || 0)} {material.unit}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Cost</Label>
                          <div className="text-sm font-medium text-blue-600">
                            ${((materialUsage[material.id] || 0) * material.cost).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      case 'expenses':
        return (
          <div key={field}>
            <Label htmlFor={field}>Expenses</Label>
            <Textarea
              id={field}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder="List expenses with amounts"
              rows={3}
            />
          </div>
        )
      case 'challenges':
        return (
          <div key={field}>
            <Label htmlFor={field}>Challenges Faced</Label>
            <Textarea
              id={field}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder="Describe any challenges encountered"
              rows={3}
            />
          </div>
        )
      case 'client_complaints':
      case 'client_feedback':
        return (
          <div key={field}>
            <Label htmlFor={field}>
              {field === 'client_complaints' ? 'Client Complaints' : 'Client Feedback'}
            </Label>
            <Textarea
              id={field}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder="Enter client feedback"
              rows={3}
            />
          </div>
        )
      default:
        return (
          <div key={field}>
            <Label htmlFor={field}>
              {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder={`Enter ${field.replace(/_/g, ' ')}`}
            />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading authentication...</p>
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
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/reports')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Reports
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Create Report</h1>
                  <p className="text-slate-600 mt-1">Generate role-based reports with specific templates</p>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="role-selection">1. Select Role</TabsTrigger>
                <TabsTrigger value="template-selection" disabled={!selectedRole}>2. Choose Template</TabsTrigger>
                <TabsTrigger value="report-configuration" disabled={!selectedTemplate}>3. Configure Report</TabsTrigger>
                <TabsTrigger value="report-preview" disabled={!generatedReport}>4. Preview & Download</TabsTrigger>
              </TabsList>

              {/* Role Selection */}
              <TabsContent value="role-selection" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(roleDefinitions).map(([roleKey, role]) => {
                    const IconComponent = role.icon
                    return (
                      <Card 
                        key={roleKey} 
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleRoleSelect(roleKey)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${role.color}`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{role.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {role.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" className="text-xs">
                            {getTemplatesByRole(roleKey).length} templates available
                          </Badge>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Template Selection */}
              <TabsContent value="template-selection" className="mt-6">
                {selectedRole && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Templates for {roleDefinitions[selectedRole as keyof typeof roleDefinitions]?.name}
                      </h2>
                      <p className="text-slate-600">
                        Choose a template that matches your reporting needs
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {availableTemplates.map((template) => {
                        const IconComponent = template.icon
                        return (
                          <Card 
                            key={template.id} 
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-8 w-8 text-blue-600" />
                                <div>
                                  <CardTitle className="text-lg">{template.name}</CardTitle>
                                  <CardDescription className="text-sm">
                                    {template.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {template.category}
                                  </Badge>
                                  {template.taskSpecific && (
                                    <Badge variant="secondary" className="text-xs">
                                      Task Specific
                                    </Badge>
                                  )}
                                  {template.clientSpecific && (
                                    <Badge variant="secondary" className="text-xs">
                                      Client Specific
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500">
                                  <strong>Required:</strong> {template.requiredFields.length} fields | 
                                  <strong> Optional:</strong> {template.optionalFields.length} fields
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Report Configuration */}
              <TabsContent value="report-configuration" className="mt-6">
                {selectedTemplate && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Configuration Form */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Report Configuration
                          </CardTitle>
                          <CardDescription>
                            Fill in the required and optional fields for your report
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Required Fields */}
                          {selectedTemplate.requiredFields.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                Required Fields
                              </h3>
                              <div className="space-y-4">
                                {selectedTemplate.requiredFields.map(field => renderField(field))}
                              </div>
                            </div>
                          )}

                          {/* Optional Fields */}
                          {selectedTemplate.optionalFields.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Optional Fields
                              </h3>
                              <div className="space-y-4">
                                {selectedTemplate.optionalFields.map(field => renderField(field))}
                              </div>
                            </div>
                          )}

                          <Button 
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="w-full"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating Report...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Generate Report
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Template Info */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Template Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Template Details</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Category:</strong> {selectedTemplate.category}</div>
                              <div><strong>Data Sources:</strong> {selectedTemplate.dataSources.join(', ')}</div>
                              <div><strong>Available Filters:</strong> {selectedTemplate.availableFilters.join(', ')}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">Field Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Required Fields ({selectedTemplate.requiredFields.length}):</strong></div>
                              <div className="pl-4 text-slate-600">
                                {selectedTemplate.requiredFields.join(', ')}
                              </div>
                              <div><strong>Optional Fields ({selectedTemplate.optionalFields.length}):</strong></div>
                              <div className="pl-4 text-slate-600">
                                {selectedTemplate.optionalFields.join(', ')}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Report Preview */}
              <TabsContent value="report-preview" className="mt-6">
                {generatedReport && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Report Preview
                        </CardTitle>
                        <CardDescription>
                          Review your generated report before downloading
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-2">Report Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div><strong>Title:</strong> {generatedReport.title}</div>
                              <div><strong>Type:</strong> {generatedReport.type}</div>
                              <div><strong>Created By:</strong> {generatedReport.createdBy}</div>
                              <div><strong>Created:</strong> {generatedReport.createdAt.toLocaleDateString()}</div>
                            </div>
                          </div>

                          {/* Team Members Summary */}
                          {generatedReport.data.teamMembers && generatedReport.data.teamMembers.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-2">Team Members Summary</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {generatedReport.data.teamMembers.map((member: any, index: number) => (
                                  <Card key={index} className="p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="font-medium">{member.name}</div>
                                      <Badge variant={
                                        member.report.performance === 'excellent' ? 'default' :
                                        member.report.performance === 'good' ? 'secondary' :
                                        member.report.performance === 'average' ? 'outline' : 'destructive'
                                      }>
                                        {member.report.performance}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                      <div>Tasks Completed: {member.report.tasksCompleted}</div>
                                      {member.report.issues && <div>Issues: {member.report.issues}</div>}
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Materials Summary */}
                          {generatedReport.data.materials && generatedReport.data.materials.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-2">Materials Summary</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {generatedReport.data.materials.map((material: any, index: number) => (
                                  <Card key={index} className="p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="font-medium">{material.name}</div>
                                      <Badge variant="outline">${material.cost.toFixed(2)}</Badge>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                      <div>Used: {material.usedQuantity} {material.unit}</div>
                                      <div>Remaining: {material.remainingQuantity} {material.unit}</div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h3 className="font-semibold text-slate-900 mb-2">Report Data</h3>
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <pre className="text-sm overflow-auto">
                                {JSON.stringify(generatedReport.data, null, 2)}
                              </pre>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={() => handleDownloadReport('pdf')}>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button variant="outline" onClick={() => handleDownloadReport('excel')}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Excel
                            </Button>
                            <Button variant="outline" onClick={() => handleDownloadReport('csv')}>
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
} 