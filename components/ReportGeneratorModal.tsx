"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText,
  Users,
  Building,
  DollarSign,
  Truck,
  Calendar,
  Filter,
  Download,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  Award,
  Clock,
  MapPin,
  Package,
  Globe,
  CreditCard,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
  FileLineChart
} from "lucide-react"
import { ReportService, ReportFilters } from "@/lib/report-service"
import { getAllEmployees, getAllDepartments, getAllAgents, getAllDrivers, getAllCustomers } from "@/lib/firebase-service"
import { reportTemplates, ReportTemplate, getAvailableFilters, getDataSources } from "@/lib/report-templates"

interface ReportGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onReportGenerated: (report: any) => void
}



export default function ReportGeneratorModal({ isOpen, onClose, onReportGenerated }: ReportGeneratorModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [filters, setFilters] = useState<ReportFilters>({})
  const [reportTitle, setReportTitle] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      const [employeesData, departmentsData, agentsData, driversData, customersData] = await Promise.all([
        getAllEmployees(),
        getAllDepartments(),
        getAllAgents(),
        getAllDrivers(),
        getAllCustomers()
      ])
      setEmployees(employeesData)
      setDepartments(departmentsData)
      setAgents(agentsData)
      setDrivers(driversData)
      setCustomers(customersData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    setFilters(template.defaultFilters)
    setReportTitle(template.name)
    setReportDescription(template.description)
  }

  const getAvailableFiltersForTemplate = (templateId: string) => {
    return getAvailableFilters(templateId)
  }

  const getDataSourcesForTemplate = (templateId: string) => {
    return getDataSources(templateId)
  }

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return

    try {
      setIsGenerating(true)
      let report

      switch (selectedTemplate.category) {
        case 'performance':
          if (selectedTemplate.id === '1') {
            report = await ReportService.generateEmployeePerformanceReport(filters)
          } else {
            report = await ReportService.generateEmployeePerformanceReport(filters)
          }
          break
        case 'department':
          report = await ReportService.generateDepartmentPerformanceReport(filters)
          break
        case 'financial':
          report = await ReportService.generateFinancialPerformanceReport(filters)
          break
        case 'operational':
          report = await ReportService.generateOperationalEfficiencyReport(filters)
          break
        default:
          report = await ReportService.generateEmployeePerformanceReport(filters)
      }

      report.title = reportTitle
      report.description = reportDescription
      report.template = selectedTemplate
      report.filters = filters

      setGeneratedReport(report)
      onReportGenerated(report)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!generatedReport) return

    // Mock download functionality
    const dataStr = JSON.stringify(generatedReport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportTitle.replace(/\s+/g, '_')}_${format}.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getTemplateIcon = (template: ReportTemplate) => {
    const IconComponent = template.icon
    return <IconComponent className="h-6 w-6" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Generate Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
                      {/* Step 1: Template Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">1. Select Report Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedTemplate?.id === template.id ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        {getTemplateIcon(template)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {template.availableFilters.slice(0, 3).map((filter) => (
                            <span key={filter} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {filter.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {template.availableFilters.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{template.availableFilters.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {selectedTemplate && (
            <>
              {/* Step 2: Report Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Report Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reportTitle">Report Title</Label>
                    <Input
                      id="reportTitle"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="Enter report title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportDescription">Description</Label>
                    <Textarea
                      id="reportDescription"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Enter report description"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Filters */}
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Configure Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                    />
                  </div>
                  
                  {departments.length > 0 && (
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={filters.department || 'all'}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {employees.length > 0 && (
                    <div>
                      <Label htmlFor="employee">Employee</Label>
                      <Select
                        value={filters.employee || 'all'}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, employee: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Employees</SelectItem>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {agents.length > 0 && (
                    <div>
                      <Label htmlFor="agent">Agent</Label>
                      <Select
                        value={filters.agent || 'all'}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, agent: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Agents</SelectItem>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {drivers.length > 0 && (
                    <div>
                      <Label htmlFor="driver">Driver</Label>
                      <Select
                        value={filters.driver || 'all'}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, driver: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Drivers</SelectItem>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select
                      value={filters.serviceType || 'all'}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, serviceType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="freight">Freight</SelectItem>
                        <SelectItem value="moving">Moving</SelectItem>
                        <SelectItem value="courier">Courier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select
                      value={filters.region || 'all'}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="dar-es-salaam">Dar es Salaam</SelectItem>
                        <SelectItem value="arusha">Arusha</SelectItem>
                        <SelectItem value="mwanza">Mwanza</SelectItem>
                        <SelectItem value="dodoma">Dodoma</SelectItem>
                        <SelectItem value="mbeya">Mbeya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="period">Period</Label>
                    <Select
                      value={filters.period || 'last_month'}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}
                    >
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

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={filters.status || 'all'}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Step 4: Generate Report */}
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Generate Report</h3>
                <div className="flex space-x-4">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating || !reportTitle}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  
                  {generatedReport && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadReport('pdf')}
                        size="sm"
                      >
                        <FileBarChart className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadReport('excel')}
                        size="sm"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadReport('csv')}
                        size="sm"
                      >
                        <FilePieChart className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Generated Report Preview */}
              {generatedReport && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Report Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {generatedReport.title}</div>
                    <div><strong>Type:</strong> {generatedReport.type}</div>
                    <div><strong>Generated:</strong> {generatedReport.generatedAt.toLocaleString()}</div>
                    {generatedReport.summary && (
                      <div>
                        <strong>Summary:</strong>
                        <ul className="ml-4 mt-1">
                          {Object.entries(generatedReport.summary).map(([key, value]) => (
                            <li key={key}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 