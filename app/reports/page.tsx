"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText,
  Users,
  Building,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  DollarSign,
  Package,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  UserCheck,
  UserX,
  Building2,
  Truck,
  Ship,
  Globe,
  CreditCard,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
  FileLineChart,
  Bot,
  Sparkles,
  Brain,
  Zap,
  FileActivity,
  FileTarget,
  FileAward,
  FileZap,
  Database,
  User,
  Briefcase,
  Car,
  Settings,
  Upload,
  FileUp,
  FileDown,
  FileSearch,
  FileEdit,
  FileCheck,
  FileX,
  UserCircle,
  Package2,
  Route,
  Warehouse,
  DollarSignIcon,
  TrendingUpIcon,
  UsersIcon,
  TruckIcon,
  PackageIcon,
  RouteIcon,
  DatabaseIcon,
  UserCheckIcon
} from "lucide-react"
import { 
  getAllEmployees,
  getAllDepartments,
  getAllShipments,
  getAllTransactions,
  getAllCustomers,
  getAllAgents,
  getAllDrivers,
  getEmployeeStats,
  getDepartmentStats,
  getShipmentStats,
  getFinancialSummary,
  getCRMStats,
  getAgentStats,
  getDriverStats,
  getAllInventoryItems,
  getInventoryStats,
  getAllQuotes,
  getQuoteStats
} from "@/lib/firebase-service"
import { reportTemplates, ReportTemplate } from "@/lib/report-templates"
import { aiReportGenerator, AIReportRequest, AIReportResult } from "@/lib/ai-report-service"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ReportData {
  id: string
  title: string
  type: 'performance' | 'department' | 'project' | 'financial' | 'operational' | 'custom' | 'ai-generated' | 'employee' | 'shipment' | 'driver' | 'agent' | 'customer' | 'inventory' | 'route'
  status: 'draft' | 'published' | 'archived' | 'pending'
  createdBy: string
  createdAt: Date
  lastModified: Date
  data: any
  filters: any
  description?: string
  isAIGenerated?: boolean
  template?: string
  department?: string
  entityId?: string // For individual entity reports
  entityType?: string // Type of entity (employee, shipment, etc.)
}

// Dynamic report templates based on actual data
interface DynamicReportTemplate {
  id: string
  name: string
  description: string
  icon: any
  color: string
  charts: string[]
  category: 'overview' | 'individual' | 'operational' | 'financial'
  entityType?: string
}

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<ReportData[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [dynamicTemplates, setDynamicTemplates] = useState<DynamicReportTemplate[]>([])
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [generatedReports, setGeneratedReports] = useState<any[]>([])
  const [aiGenerating, setAiGenerating] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [aiReportRequest, setAiReportRequest] = useState<AIReportRequest>({
    type: 'performance',
    period: 'monthly',
    includeCharts: true,
    includeRecommendations: true
  })
  
  // Data for dynamic report generation
  const [employees, setEmployees] = useState<any[]>([])
  const [shipments, setShipments] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [services, setServices] = useState<string[]>([])
  const [projects, setProjects] = useState<string[]>([])
  const [routes, setRoutes] = useState<string[]>([])
  
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedRoute, setSelectedRoute] = useState('all')
  const [selectedReportType, setSelectedReportType] = useState('financial')
  const [reportPeriod, setReportPeriod] = useState('month')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [selectedReportForView, setSelectedReportForView] = useState<ReportData | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [importTitle, setImportTitle] = useState('')
  const [importDescription, setImportDescription] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importingReport, setImportingReport] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [approvalForm, setApprovalForm] = useState({
    name: '',
    position: '',
    comments: '',
    signature: ''
  })
  const [approvingReport, setApprovingReport] = useState(false)

  // Create Report Form State
  const [createReportForm, setCreateReportForm] = useState({
    title: '',
    description: '',
    template: '',
    department: '',
    period: 'month',
    includeCharts: true,
    includeRecommendations: true
  })

  useEffect(() => {
    // Temporarily disable authentication check for testing
    // if (!loading && !user) {
    //   router.push('/login')
    // }
  }, [user, loading, router])

  useEffect(() => {
    // Temporarily load data even without user for testing
    // if (user) {
      loadReports()
      loadTemplates()
      loadDropdownData()
    // }
  }, [user])

  const loadReports = async () => {
    try {
      setDataLoading(true)
      // Mock reports data - in real implementation, this would come from Firebase
      const mockReports: ReportData[] = [
        {
          id: '1',
          title: 'Q4 2024 Employee Performance Report',
          type: 'performance',
          status: 'published',
          createdBy: 'Admin User',
          createdAt: new Date('2024-12-15'),
          lastModified: new Date('2024-12-15'),
          data: {},
          filters: { period: 'Q4 2024', department: 'all' },
          template: 'performance',
          department: 'HR'
        },
        {
          id: '2',
          title: 'December 2024 Financial Summary',
          type: 'financial',
          status: 'published',
          createdBy: 'Finance Manager',
          createdAt: new Date('2024-12-20'),
          lastModified: new Date('2024-12-20'),
          data: {},
          filters: { period: 'December 2024', department: 'finance' },
          template: 'financial',
          department: 'Finance'
        },
        {
          id: '3',
          title: 'AI Generated: Operational Efficiency Analysis',
          type: 'operational',
          status: 'draft',
          createdBy: 'AI Assistant',
          createdAt: new Date('2024-12-18'),
          lastModified: new Date('2024-12-18'),
          data: {},
          filters: { period: 'Q4 2024', department: 'operations' },
          template: 'operational',
          department: 'Operations',
          isAIGenerated: true
        },
        {
          id: '4',
          title: 'Inventory Status Report - December 2024',
          type: 'custom',
          status: 'published',
          createdBy: 'Inventory Manager',
          createdAt: new Date('2024-12-10'),
          lastModified: new Date('2024-12-10'),
          data: {},
          filters: { period: 'December 2024', department: 'inventory' },
          template: 'inventory',
          department: 'Inventory'
        }
      ]
      setReports(mockReports)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const loadTemplates = () => {
    setTemplates(reportTemplates)
  }

  const loadDropdownData = async () => {
    try {
      // Load actual data for dynamic report generation
      const [depts, emps, ships, drivs, agts, custs, invItems] = await Promise.all([
        getAllDepartments(),
        getAllEmployees(),
        getAllShipments(),
        getAllDrivers(),
        getAllAgents(),
        getAllCustomers(),
        getAllInventoryItems()
      ])
      
      setDepartments(depts)
      setEmployees(emps)
      setShipments(ships)
      setDrivers(drivs)
      setAgents(agts)
      setCustomers(custs)
      setInventoryItems(invItems)
      
      // Extract unique services, projects, routes from data
      const uniqueServices = [...new Set(ships.map(s => s.serviceType).filter(Boolean))]
      const uniqueRoutes = [...new Set(ships.map(s => s.route).filter(Boolean))]
      
      setServices(uniqueServices)
      setRoutes(uniqueRoutes)
      setProjects(['Project Alpha', 'Project Beta', 'Project Gamma']) // Mock for now
      
      // Generate dynamic report templates based on actual data
      generateDynamicTemplates(emps, ships, drivs, agts, custs, invItems)
    } catch (error) {
      console.error('Error loading dropdown data:', error)
    }
  }

  const generateDynamicTemplates = (emps: any[], ships: any[], drivs: any[], agts: any[], custs: any[], invItems: any[]) => {
    const templates: DynamicReportTemplate[] = []

    // Overview Reports (based on actual data availability)
    if (ships.length > 0) {
      templates.push({
        id: 'logistics-overview',
        name: 'Logistics Operations Overview',
        description: `Comprehensive analysis of ${ships.length} shipments and delivery performance`,
        icon: TruckIcon,
        color: 'bg-blue-600',
        charts: ['delivery_performance', 'revenue_analysis', 'service_distribution'],
        category: 'overview'
      })
    }

    if (emps.length > 0) {
      templates.push({
        id: 'employee-overview',
        name: 'Employee Performance Overview',
        description: `Performance analysis of ${emps.length} employees across departments`,
        icon: UsersIcon,
        color: 'bg-purple-500',
        charts: ['productivity_metrics', 'department_performance', 'attendance_analysis'],
        category: 'overview'
      })
    }

    if (drivs.length > 0) {
      templates.push({
        id: 'driver-overview',
        name: 'Driver Performance Overview',
        description: `Performance analysis of ${drivs.length} drivers and delivery efficiency`,
        icon: Car,
        color: 'bg-indigo-500',
        charts: ['delivery_efficiency', 'route_performance', 'rating_analysis'],
        category: 'overview'
      })
    }

    if (agts.length > 0) {
      templates.push({
        id: 'agent-overview',
        name: 'Agent Performance Overview',
        description: `Performance analysis of ${agts.length} agents and customer service`,
        icon: UserCheckIcon,
        color: 'bg-green-500',
        charts: ['agent_efficiency', 'customer_satisfaction', 'commission_analysis'],
        category: 'overview'
      })
    }

    if (custs.length > 0) {
      templates.push({
        id: 'customer-overview',
        name: 'Customer Analytics Overview',
        description: `Customer analysis of ${custs.length} customers and satisfaction metrics`,
        icon: UserCheckIcon,
        color: 'bg-pink-500',
        charts: ['customer_satisfaction', 'growth_metrics', 'service_ratings'],
        category: 'overview'
      })
    }

    if (invItems.length > 0) {
      templates.push({
        id: 'inventory-overview',
        name: 'Inventory Management Overview',
        description: `Inventory analysis of ${invItems.length} items and stock levels`,
        icon: DatabaseIcon,
        color: 'bg-orange-500',
        charts: ['stock_levels', 'category_breakdown', 'value_analysis'],
        category: 'overview'
      })
    }

    // Individual Entity Reports
    emps.forEach(emp => {
      templates.push({
        id: `employee-${emp.id}`,
        name: `${emp.name} - Performance Report`,
        description: `Individual performance analysis for ${emp.name}`,
        icon: UserCircle,
        color: 'bg-purple-400',
        charts: ['performance_trends', 'attendance_analysis', 'task_completion'],
        category: 'individual',
        entityType: 'employee'
      })
    })

    ships.forEach(shipment => {
      templates.push({
        id: `shipment-${shipment.id}`,
        name: `Shipment ${shipment.trackingNumber} - Analysis`,
        description: `Detailed analysis of shipment ${shipment.trackingNumber}`,
        icon: PackageIcon,
        color: 'bg-blue-400',
        charts: ['delivery_timeline', 'route_analysis', 'cost_breakdown'],
        category: 'individual',
        entityType: 'shipment'
      })
    })

    drivs.forEach(driver => {
      templates.push({
        id: `driver-${driver.id}`,
        name: `${driver.name} - Driver Report`,
        description: `Performance analysis for driver ${driver.name}`,
        icon: Car,
        color: 'bg-indigo-400',
        charts: ['delivery_efficiency', 'route_performance', 'rating_trends'],
        category: 'individual',
        entityType: 'driver'
      })
    })

    agts.forEach(agent => {
      templates.push({
        id: `agent-${agent.id}`,
        name: `${agent.name} - Agent Report`,
        description: `Performance analysis for agent ${agent.name}`,
        icon: UserCheckIcon,
        color: 'bg-green-400',
        charts: ['customer_satisfaction', 'commission_analysis', 'service_quality'],
        category: 'individual',
        entityType: 'agent'
      })
    })

    custs.forEach(customer => {
      templates.push({
        id: `customer-${customer.id}`,
        name: `${customer.name} - Customer Report`,
        description: `Customer analysis for ${customer.name}`,
        icon: UserCheckIcon,
        color: 'bg-pink-400',
        charts: ['shipment_history', 'satisfaction_trends', 'value_analysis'],
        category: 'individual',
        entityType: 'customer'
      })
    })

    setDynamicTemplates(templates)
  }

  const generateAIReportHandler = async () => {
    try {
      setAiGenerating(true)
      console.log('Generating AI report with request:', aiReportRequest)
      
      const result = await aiReportGenerator.generateReport(aiReportRequest)
      console.log('AI report generated:', result)
      
      setGeneratedReports(prev => [result, ...prev])
      setGeneratedReport(result)
      setShowAIModal(false)
      
      // Add to reports list
      const newReport: ReportData = {
        id: result.id,
        title: result.title,
        type: 'ai-generated',
        status: 'draft',
        createdBy: 'AI Assistant',
        createdAt: new Date(),
        lastModified: new Date(),
        data: result,
        filters: { period: aiReportRequest.period, type: aiReportRequest.type },
        description: result.summary,
        isAIGenerated: true,
        template: aiReportRequest.type
      }
      
      setReports(prev => [newReport, ...prev])
    } catch (error) {
      console.error('Error generating AI report:', error)
    } finally {
      setAiGenerating(false)
    }
  }

  const generateEntityReport = async (template: DynamicReportTemplate) => {
    try {
      setGeneratingReport(true)
      console.log('Generating entity report for:', template)
      
      // Determine report type based on template
      let reportType: string = 'logistics'
      let entityId: string | undefined
      
      if (template.category === 'individual') {
        const entityIdMatch = template.id.match(/(employee|shipment|driver|agent|customer)-(.+)/)
        if (entityIdMatch) {
          const entityType = entityIdMatch[1]
          entityId = entityIdMatch[2]
          
          switch (entityType) {
            case 'employee':
              reportType = 'performance'
              break
            case 'shipment':
              reportType = 'shipment'
              break
            case 'driver':
              reportType = 'route'
              break
            case 'agent':
              reportType = 'logistics'
              break
            case 'customer':
              reportType = 'customer'
              break
          }
        }
      } else {
        // Overview reports
        if (template.id.includes('logistics')) reportType = 'logistics'
        else if (template.id.includes('employee')) reportType = 'performance'
        else if (template.id.includes('driver')) reportType = 'route'
        else if (template.id.includes('agent')) reportType = 'logistics'
        else if (template.id.includes('customer')) reportType = 'customer'
        else if (template.id.includes('inventory')) reportType = 'inventory'
      }
      
      const request: AIReportRequest = {
        type: reportType as any,
        period: 'monthly',
        includeCharts: true,
        includeRecommendations: true,
        customFilters: entityId ? { entityId, entityType: template.entityType } : undefined
      }
      
      const result = await aiReportGenerator.generateReport(request)
      console.log('Entity report generated:', result)
      
      // Add to reports list
      const newReport: ReportData = {
        id: result.id,
        title: result.title,
        type: template.category === 'individual' ? template.entityType as any : 'ai-generated',
        status: 'draft',
        createdBy: 'AI Assistant',
        createdAt: new Date(),
        lastModified: new Date(),
        data: result,
        filters: { 
          period: request.period, 
          type: request.type,
          entityId,
          entityType: template.entityType
        },
        description: result.summary,
        isAIGenerated: true,
        template: template.id,
        entityId,
        entityType: template.entityType
      }
      
      setReports(prev => [newReport, ...prev])
      setGeneratedReport(result)
      
    } catch (error) {
      console.error('Error generating entity report:', error)
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleCreateReport = async () => {
    try {
      setGeneratingReport(true)
      console.log('Creating report with template:', createReportForm)
      
      // Simulate report creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newReport = {
        id: Date.now().toString(),
        title: createReportForm.title,
        type: createReportForm.template as any,
        status: 'draft',
        createdBy: user?.email || 'Unknown User',
        createdAt: new Date(),
        lastModified: new Date(),
        data: {
          executiveSummary: {
            overview: "This comprehensive report provides detailed analysis of our business performance, operational metrics, and strategic recommendations for continued growth and improvement.",
            keyHighlights: [
              "Strong financial performance with positive growth trends",
              "Improved operational efficiency across all departments",
              "Enhanced customer satisfaction and retention rates",
              "Successful implementation of cost optimization initiatives"
            ],
            challenges: [
              "Market competition requires continuous innovation",
              "Technology infrastructure needs regular updates",
              "Staff training and development ongoing requirements"
            ]
          },
          financialPerformance: {
            revenue: {
              current: "$2,500,000",
              previous: "$2,200,000",
              growth: "+13.6%",
              trend: "upward"
            },
            expenses: {
              current: "$1,800,000",
              previous: "$1,950,000",
              reduction: "-7.7%",
              trend: "downward"
            },
            profit: {
              current: "$700,000",
              previous: "$250,000",
              growth: "+180%",
              margin: "28.0%"
            }
          },
          operationalMetrics: {
            shipments: {
              total: 1200,
              onTime: 1120,
              delayed: 80,
              onTimeRate: "93.3%"
            },
            customerSatisfaction: {
              overall: "92.5%",
              delivery: "94.8%",
              communication: "91.2%",
              pricing: "88.9%"
            },
            efficiency: {
              routeOptimization: "85.2%",
              fuelEfficiency: "89.7%",
              warehouseUtilization: "87.3%",
              staffProductivity: "91.8%"
            }
          },
          recommendations: [
            {
              category: "Growth Strategy",
              title: "Market Expansion",
              description: "Explore opportunities in neighboring regions and new service verticals",
              impact: "Potential 20-25% revenue growth",
              timeline: "Q2 2025",
              priority: "High"
            },
            {
              category: "Operational Excellence",
              title: "Process Automation",
              description: "Implement automated systems for order processing and inventory management",
              impact: "Reduce operational costs by 10-15%",
              timeline: "Q1 2025",
              priority: "Medium"
            }
          ]
        },
        filters: createReportForm,
        template: createReportForm.template,
        department: createReportForm.department
      }
      
      setReports(prev => [newReport, ...prev])
      setShowCreateModal(false)
      setCreateReportForm({
        title: '',
        description: '',
        template: '',
        department: '',
        period: 'month',
        includeCharts: true,
        includeRecommendations: true
      })
      alert('Report created successfully!')
    } catch (error) {
      console.error('Error creating report:', error)
      alert('Error creating report. Please try again.')
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleImportReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile || !importTitle) {
      alert('Please provide a title and select a file.')
      return
    }

    try {
      setImportingReport(true)
      console.log('Importing report:', { importTitle, importDescription, importFile })
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const importedReport = {
        id: Date.now().toString(),
        title: importTitle,
        type: 'custom',
        status: 'draft',
        createdBy: user?.email || 'Unknown User',
        createdAt: new Date(),
        lastModified: new Date(),
        data: {
          summary: 'Report imported from external source.',
          fileName: importFile.name,
          fileSize: `${(importFile.size / 1024).toFixed(2)} KB`
        },
        filters: {},
        description: importDescription,
        template: 'imported',
        department: 'Imported'
      }
      
      setReports(prev => [importedReport, ...prev])
      setShowImportModal(false)
      setImportTitle('')
      setImportDescription('')
      setImportFile(null)
      alert('Report imported successfully!')
    } catch (error) {
      console.error('Error importing report:', error)
      alert('Error importing report. Please try again.')
    } finally {
      setImportingReport(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial':
        return 'bg-green-100 text-green-800'
      case 'operational':
        return 'bg-blue-100 text-blue-800'
      case 'performance':
        return 'bg-purple-100 text-purple-800'
      case 'custom':
        return 'bg-orange-100 text-orange-800'
      case 'ai-generated':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const viewReport = (report: ReportData) => {
    setSelectedReportForView(report)
    setShowViewModal(true)
  }

  const downloadReport = async (report: ReportData) => {
    try {
      // Simulate PDF generation and download
      const doc = new jsPDF()
      doc.text(`${report.title}`, 20, 20)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
      doc.text(`Created by: ${report.createdBy}`, 20, 40)
      doc.text(`Type: ${report.type}`, 20, 50)
      doc.text(`Status: ${report.status}`, 20, 60)
      
      doc.save(`${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Error downloading report. Please try again.')
    }
  }

  const deleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        setReports(prev => prev.filter(r => r.id !== reportId))
        alert('Report deleted successfully!')
      } catch (error) {
        console.error('Error deleting report:', error)
        alert('Error deleting report. Please try again.')
      }
    }
  }

  const handleApproveReport = () => {
    setShowApprovalModal(true)
  }

  const submitApproval = async () => {
    if (!approvalForm.name || !approvalForm.position || !approvalForm.signature) {
      alert('Please fill in all required fields: Name, Position, and Signature')
      return
    }

    try {
      setApprovingReport(true)
      
      // Simulate approval process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the report with approval information
      if (selectedReportForView) {
        const updatedReport = {
          ...selectedReportForView,
          data: {
            ...selectedReportForView.data,
            approvals: [
              ...(selectedReportForView.data.approvals || []),
              {
                name: approvalForm.name,
                position: approvalForm.position,
                comments: approvalForm.comments,
                signature: approvalForm.signature,
                approvedAt: new Date().toISOString(),
                status: 'approved'
              }
            ]
          },
          status: 'published' as any
        }
        
        setReports(prev => prev.map(r => r.id === selectedReportForView.id ? updatedReport : r))
        setSelectedReportForView(updatedReport)
        
        setShowApprovalModal(false)
        setApprovalForm({
          name: '',
          position: '',
          comments: '',
          signature: ''
        })
        
        alert('Report approved successfully!')
      }
    } catch (error) {
      console.error('Error approving report:', error)
      alert('Error approving report. Please try again.')
    } finally {
      setApprovingReport(false)
    }
  }

  const handleRequestChanges = () => {
    if (!approvalForm.name || !approvalForm.position) {
      alert('Please provide your name and position')
      return
    }

    const changesRequested = prompt('Please specify what changes are needed:')
    if (changesRequested) {
      alert('Changes requested successfully. The report author will be notified.')
      setShowViewModal(false)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || report.type === filterType
    return matchesSearch && matchesType
  })

  // Temporarily disable loading check for testing
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
  //         <p className="text-slate-600 font-medium">Loading authentication...</p>
  //       </div>
  //     </div>
  //   )
  // }

  const testRealDataAccess = async () => {
    setTestLoading(true)
    setError(null)
    
    try {
      console.log('Testing real data access for AI reports...')
      
      // Test direct Firebase access
      const employees = await getAllEmployees()
      const shipments = await getAllShipments()
      const customers = await getAllCustomers()
      const departments = await getAllDepartments()
      const transactions = await getAllTransactions()
      
      console.log('Real data found:', {
        employees: employees.length,
        shipments: shipments.length,
        customers: customers.length,
        departments: departments.length,
        transactions: transactions.length
      })
      
      // Test AI report generation with real data
      const testRequest: AIReportRequest = {
        type: 'performance',
        period: 'monthly',
        includeCharts: true,
        includeRecommendations: true
      }
      
      const result = await aiReportGenerator.generateReport(testRequest)
      
      console.log('AI Report generated successfully:', result)
      
      setReports(prev => [result, ...prev])
      setSuccess('✅ Real data accessed and AI report generated successfully!')
      
    } catch (error) {
      console.error('Error testing real data access:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setTestLoading(false)
    }
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Reports Center</h1>
                  <p className="text-slate-600 mt-1">Create, generate, and manage all business reports</p>
                </div>
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Report
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Generation
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  All Reports
                </TabsTrigger>
              </TabsList>

              {/* Create Report Tab */}
              <TabsContent value="create" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileEdit className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Create Report from Template</h2>
                      <p className="text-slate-600">Use existing templates to create professional reports</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(reportTemplates).map(([key, template]) => (
                      <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer" 
                            onClick={() => {
                              setCreateReportForm(prev => ({ ...prev, template: key }))
                              setShowCreateModal(true)
                            }}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${template.color}`}>
                              <template.icon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <CardTitle className="text-sm">{template.name}</CardTitle>
                          <CardDescription className="text-xs">{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Template</span>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="h-3 w-3 mr-1" />
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={() => setShowImportModal(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Report
                      </Button>
                      <p className="text-sm text-slate-600">Import reports from external sources (PDF, DOCX, etc.)</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* AI Generation Tab */}
              <TabsContent value="ai" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">AI Report Generation</h2>
                      <p className="text-slate-600">Generate comprehensive reports with AI from your actual data</p>
                    </div>
                  </div>
                  
                  {/* Test Real Data Access Button */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Test Real Data Access</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Test if the system can access your real Firebase data and generate AI reports from it.
                    </p>
                    <Button 
                      onClick={testRealDataAccess} 
                      disabled={testLoading}
                      variant="outline"
                      className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                    >
                      {testLoading ? 'Testing...' : 'Test Real Data Access'}
                    </Button>
                    {error && (
                      <p className="text-red-600 text-sm mt-2">{error}</p>
                    )}
                    {success && (
                      <p className="text-green-600 text-sm mt-2">{success}</p>
                    )}
                  </div>
                  
                  {/* Overview Reports */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      📊 Overview Reports
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dynamicTemplates
                        .filter(t => t.category === 'overview')
                        .map((template) => (
                          <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                                onClick={() => generateEntityReport(template)}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg ${template.color}`}>
                                  <template.icon className="h-5 w-5 text-white" />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  Overview
                                </Badge>
                              </div>
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {template.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {template.charts.length} charts
                                </span>
                                <Button size="sm" variant="outline" className="text-xs">
                                  Generate
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Individual Entity Reports */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      👤 Individual Reports
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dynamicTemplates
                        .filter(t => t.category === 'individual')
                        .slice(0, 12) // Show first 12 to avoid overwhelming
                        .map((template) => (
                          <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                                onClick={() => generateEntityReport(template)}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg ${template.color}`}>
                                  <template.icon className="h-4 w-4 text-white" />
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {template.entityType}
                                </Badge>
                              </div>
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {template.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {template.charts.length} charts
                                </span>
                                <Button size="sm" variant="outline" className="text-xs">
                                  Generate
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                    
                    {dynamicTemplates.filter(t => t.category === 'individual').length > 12 && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                          Showing 12 of {dynamicTemplates.filter(t => t.category === 'individual').length} individual reports
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View All Individual Reports
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Legacy AI Generation */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">🤖 Standard AI Generation</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ai-report-type">Report Type</Label>
                        <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                          <SelectTrigger className="max-w-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(reportTemplates).map(([key, template]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <template.icon className="h-4 w-4" />
                                  {template.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="ai-report-period">Report Period</Label>
                        <Select value={reportPeriod} onValueChange={setReportPeriod}>
                          <SelectTrigger className="max-w-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="quarter">Last Quarter</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="ai-include-charts"
                            checked={includeCharts}
                            onChange={(e) => setIncludeCharts(e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="ai-include-charts">Include Charts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="ai-include-recommendations"
                            checked={includeRecommendations}
                            onChange={(e) => setIncludeRecommendations(e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="ai-include-recommendations">Include Recommendations</Label>
                        </div>
                      </div>

                      <div className="flex gap-4 mb-6">
                        <Button onClick={generateAIReportHandler} disabled={aiGenerating}>
                          {aiGenerating ? 'Generating...' : 'Generate AI Report'}
                        </Button>
                        <Button onClick={testRealDataAccess} disabled={loading} variant="outline">
                          {loading ? 'Testing...' : 'Test Real Data Access'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* All Reports Tab */}
              <TabsContent value="all" className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FileSearch className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">All Reports</h2>
                        <p className="text-slate-600">View and manage all created reports</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-xs"
                      />
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                          <SelectItem value="ai-generated">AI Generated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {dataLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading reports...</p>
                    </div>
                  ) : filteredReports.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500">No reports found.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredReports.map((report) => (
                        <Card key={report.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{report.title}</CardTitle>
                              <div className="flex items-center gap-1">
                                {report.isAIGenerated && (
                                  <Brain className="h-3 w-3 text-purple-600" />
                                )}
                                <Badge 
                                  variant="secondary"
                                  className={getStatusColor(report.status)}
                                >
                                  {report.status}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="text-xs">
                              {report.createdBy} • {report.department || 'General'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="outline" onClick={() => downloadReport(report)}>
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => viewReport(report)}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => deleteReport(report.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Create Report Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Report from Template</DialogTitle>
            <DialogDescription>
              Configure your report using the selected template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="report-title">Report Title</Label>
              <Input 
                id="report-title" 
                value={createReportForm.title} 
                onChange={e => setCreateReportForm(prev => ({ ...prev, title: e.target.value }))} 
                placeholder="Enter report title"
              />
            </div>
            
            <div>
              <Label htmlFor="report-description">Description</Label>
              <Textarea 
                id="report-description" 
                value={createReportForm.description} 
                onChange={e => setCreateReportForm(prev => ({ ...prev, description: e.target.value }))} 
                placeholder="Enter report description"
              />
            </div>

            <div>
              <Label htmlFor="report-department">Department</Label>
              <Select value={createReportForm.department} onValueChange={value => setCreateReportForm(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="report-period">Report Period</Label>
              <Select value={createReportForm.period} onValueChange={value => setCreateReportForm(prev => ({ ...prev, period: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="create-include-charts"
                  checked={createReportForm.includeCharts}
                  onChange={(e) => setCreateReportForm(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="create-include-charts">Include Charts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="create-include-recommendations"
                  checked={createReportForm.includeRecommendations}
                  onChange={(e) => setCreateReportForm(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="create-include-recommendations">Include Recommendations</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateReport}
                disabled={generatingReport || !createReportForm.title || !createReportForm.template}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {generatingReport ? 'Creating...' : 'Create Report'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Report Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Report Document</DialogTitle>
            <DialogDescription>
              Upload a report document (PDF, DOCX, etc.) to add it to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImportReport} className="space-y-4">
            <div>
              <Label htmlFor="import-title">Title</Label>
              <Input id="import-title" value={importTitle} onChange={e => setImportTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="import-description">Description</Label>
              <Textarea id="import-description" value={importDescription} onChange={e => setImportDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="import-file">Document File</Label>
              <Input id="import-file" type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={e => setImportFile(e.target.files?.[0] || null)} required />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setShowImportModal(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={importingReport}>
                {importingReport ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Report Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="w-[95%] max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              {selectedReportForView?.isAIGenerated && <Brain className="h-6 w-6 text-purple-600" />}
              {selectedReportForView?.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              Official Company Performance Report - {selectedReportForView?.createdAt.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReportForView && (
            <div className="space-y-8">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</p>
                    <Badge className={`mt-1 ${getStatusColor(selectedReportForView.status)}`}>
                      {selectedReportForView.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Report Type</p>
                    <Badge className={`mt-1 ${getTypeColor(selectedReportForView.type)}`}>
                      {selectedReportForView.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Prepared By</p>
                    <p className="text-sm font-medium mt-1">{selectedReportForView.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Date</p>
                    <p className="text-sm font-medium mt-1">{selectedReportForView.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              {selectedReportForView.data?.executiveSummary && (
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">Executive Summary</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Overview</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedReportForView.data.executiveSummary.overview}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Key Highlights
                        </h4>
                        <ul className="space-y-2">
                          {selectedReportForView.data.executiveSummary.keyHighlights.map((highlight: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          Challenges & Risks
                        </h4>
                        <ul className="space-y-2">
                          {selectedReportForView.data.executiveSummary.challenges.map((challenge: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Performance */}
              {selectedReportForView.data?.financialPerformance && (
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">Financial Performance</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Revenue</h4>
                        <p className="text-2xl font-bold text-green-900">{selectedReportForView.data.financialPerformance.revenue.current}</p>
                        <p className="text-sm text-green-700">vs {selectedReportForView.data.financialPerformance.revenue.previous}</p>
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          {selectedReportForView.data.financialPerformance.revenue.growth}
                        </Badge>
                      </div>
                      
                      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2">Expenses</h4>
                        <p className="text-2xl font-bold text-red-900">{selectedReportForView.data.financialPerformance.expenses.current}</p>
                        <p className="text-sm text-red-700">vs {selectedReportForView.data.financialPerformance.expenses.previous}</p>
                        <Badge className="mt-2 bg-red-100 text-red-800">
                          {selectedReportForView.data.financialPerformance.expenses.reduction}
                        </Badge>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Profit</h4>
                        <p className="text-2xl font-bold text-blue-900">{selectedReportForView.data.financialPerformance.profit.current}</p>
                        <p className="text-sm text-blue-700">Margin: {selectedReportForView.data.financialPerformance.profit.margin}</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">
                          {selectedReportForView.data.financialPerformance.profit.growth}
                        </Badge>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Cash Flow</h4>
                        <p className="text-2xl font-bold text-purple-900">{selectedReportForView.data.financialPerformance.cashFlow.net}</p>
                        <p className="text-sm text-purple-700">Net Position</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Operational Metrics */}
              {selectedReportForView.data?.operationalMetrics && (
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">Operational Metrics</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-indigo-800 mb-3">Shipment Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-indigo-700">Total Shipments:</span>
                            <span className="font-semibold">{selectedReportForView.data.operationalMetrics.shipments.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-indigo-700">On-Time Rate:</span>
                            <span className="font-semibold text-green-600">{selectedReportForView.data.operationalMetrics.shipments.onTimeRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-indigo-700">Delayed:</span>
                            <span className="font-semibold text-red-600">{selectedReportForView.data.operationalMetrics.shipments.delayed}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                        <h4 className="font-semibold text-emerald-800 mb-3">Customer Satisfaction</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-emerald-700">Overall:</span>
                            <span className="font-semibold">{selectedReportForView.data.operationalMetrics.customerSatisfaction.overall}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-emerald-700">Delivery:</span>
                            <span className="font-semibold">{selectedReportForView.data.operationalMetrics.customerSatisfaction.delivery}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-emerald-700">Communication:</span>
                            <span className="font-semibold">{selectedReportForView.data.operationalMetrics.customerSatisfaction.communication}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-3">Efficiency Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-amber-700">Route Optimization:</span>
                            <span className="font-semibold">{selectedReportForView.data.operationalMetrics.efficiency.routeOptimization}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-amber-700">Fuel Efficiency:</span>
                            <span className="font-semibold">{selectedReportForView.data.operationalMetrics.efficiency.fuelEfficiency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-amber-700">Staff Productivity:</span>
                            <span className="font-semibold">{selectedReportForView.data.operationalMetrics.efficiency.staffProductivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedReportForView.data?.recommendations && (
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">Strategic Recommendations</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {selectedReportForView.data.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                              <p className="text-sm text-blue-600 font-medium">{rec.category}</p>
                            </div>
                            <Badge className={`${
                              rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{rec.description}</p>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Impact:</span>
                              <p className="text-gray-900">{rec.impact}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Timeline:</span>
                              <p className="text-gray-900">{rec.timeline}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Status:</span>
                              <Badge variant="outline" className="ml-2">Pending Review</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Approval Section */}
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="text-xl font-bold text-gray-900">Approval & Authorization</h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">Department Head Review</h4>
                      <div className="space-y-3">
                        {selectedReportForView.data?.approvals?.filter((approval: any) => 
                          ['Department Head', 'Finance Manager'].includes(approval.position)
                        ).map((approval: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{approval.name}</p>
                              <p className="text-sm text-gray-600">{approval.position}</p>
                              <p className="text-xs text-gray-500">{new Date(approval.approvedAt).toLocaleDateString()}</p>
                              {approval.comments && (
                                <p className="text-xs text-gray-600 mt-1">"{approval.comments}"</p>
                              )}
                            </div>
                            <Badge className="bg-green-100 text-green-800">Approved</Badge>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Department Head</p>
                                <p className="text-sm text-gray-600">Pending Review</p>
                              </div>
                              <Badge variant="outline" className="ml-auto">Awaiting</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Finance Manager</p>
                                <p className="text-sm text-gray-600">Pending Review</p>
                              </div>
                              <Badge variant="outline" className="ml-auto">Awaiting</Badge>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">Executive Approval</h4>
                      <div className="space-y-3">
                        {selectedReportForView.data?.approvals?.filter((approval: any) => 
                          ['CEO', 'Managing Director', 'Executive Director'].includes(approval.position)
                        ).map((approval: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{approval.name}</p>
                              <p className="text-sm text-gray-600">{approval.position}</p>
                              <p className="text-xs text-gray-500">{new Date(approval.approvedAt).toLocaleDateString()}</p>
                              {approval.comments && (
                                <p className="text-xs text-gray-600 mt-1">"{approval.comments}"</p>
                              )}
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
                          </div>
                        )) || (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">CEO/Managing Director</p>
                              <p className="text-sm text-gray-600">Pending Final Approval</p>
                            </div>
                            <Badge variant="outline" className="ml-auto">Awaiting</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Signature Section */}
                  {selectedReportForView.data?.approvals && selectedReportForView.data.approvals.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Digital Signatures</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedReportForView.data.approvals.map((approval: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{approval.name}</p>
                                <p className="text-sm text-gray-600">{approval.position}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Approved</Badge>
                            </div>
                            <div className="border-t pt-2">
                              <p className="text-xs text-gray-500 mb-1">Digital Signature:</p>
                              <div className="bg-gray-50 p-2 rounded border">
                                <p className="text-sm font-mono text-gray-700">{approval.signature}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Approved on: {new Date(approval.approvedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleApproveReport}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={selectedReportForView?.status === 'published'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Report
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        onClick={handleRequestChanges}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Request Changes
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approve Report</DialogTitle>
            <DialogDescription>
              Please provide your approval details and digital signature to approve this report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="approval-name">Full Name *</Label>
                <Input 
                  id="approval-name" 
                  value={approvalForm.name} 
                  onChange={e => setApprovalForm(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="approval-position">Position *</Label>
                <Select value={approvalForm.position} onValueChange={value => setApprovalForm(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Department Head">Department Head</SelectItem>
                    <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                    <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                    <SelectItem value="HR Manager">HR Manager</SelectItem>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="Managing Director">Managing Director</SelectItem>
                    <SelectItem value="Executive Director">Executive Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="approval-comments">Comments (Optional)</Label>
              <Textarea 
                id="approval-comments" 
                value={approvalForm.comments} 
                onChange={e => setApprovalForm(prev => ({ ...prev, comments: e.target.value }))} 
                placeholder="Add any comments or notes about your approval"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="approval-signature">Digital Signature *</Label>
              <div className="space-y-2">
                <Input 
                  id="approval-signature" 
                  value={approvalForm.signature} 
                  onChange={e => setApprovalForm(prev => ({ ...prev, signature: e.target.value }))} 
                  placeholder="Type your name as digital signature"
                  required
                />
                <p className="text-xs text-gray-500">
                  By typing your name above, you acknowledge that this serves as your digital signature for approving this report.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Approval Confirmation</h4>
                  <p className="text-sm text-blue-700">
                    By approving this report, you confirm that you have reviewed all content and authorize its publication. 
                    Your approval will be recorded with your name, position, and digital signature.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitApproval}
                disabled={approvingReport || !approvalForm.name || !approvalForm.position || !approvalForm.signature}
                className="bg-green-600 hover:bg-green-700"
              >
                {approvingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 