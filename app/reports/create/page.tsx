"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Upload,
  FileText,
  Users,
  Brain,
  Database,
  BarChart3,
  Activity,
  Eye,
  Plus,
  CheckCircle,
  AlertCircle,
  Building2,
  FolderOpen,
  CheckSquare
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

export default function CreateReportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("generate")
  const [reportName, setReportName] = useState("")
  const [reportType, setReportType] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [dataSource, setDataSource] = useState("")
  const [importedFiles, setImportedFiles] = useState<File[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const dataSources = [
    { id: "hr", name: "HR Data", icon: <Users className="h-4 w-4" />, description: "Employee data, attendance, performance" },
    { id: "finance", name: "Financial Data", icon: <BarChart3 className="h-4 w-4" />, description: "Revenue, expenses, budgets" },
    { id: "projects", name: "Project Data", icon: <FolderOpen className="h-4 w-4" />, description: "Project progress, tasks, timelines" },
    { id: "sales", name: "Sales Data", icon: <Activity className="h-4 w-4" />, description: "Sales performance, leads, conversions" },
    { id: "inventory", name: "Inventory Data", icon: <Building2 className="h-4 w-4" />, description: "Stock levels, movements, analytics" }
  ]



  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setImportedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setImportedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      router.push('/reports')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              {/* Back Button */}
              <div className="flex justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Reports
                </Button>
              </div>
              
              {/* Page Title */}
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Report</h1>
                <p className="text-slate-600 mt-1 text-base">Generate AI-powered reports from data or imported files</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">AI Report Generation</CardTitle>
                <p className="text-slate-600">Choose how to generate your report using AI</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl p-1 shadow-sm">
                    <TabsTrigger value="generate" className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Generate from Data</span>
                    </TabsTrigger>
                    <TabsTrigger value="import" className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Import & Analyze</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="generate" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="report-name" className="text-base font-medium">Report Name *</Label>
                        <Input
                          id="report-name"
                          placeholder="Enter report name"
                          value={reportName}
                          onChange={(e) => setReportName(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium">Report Type *</Label>
                        <Select value={reportType} onValueChange={setReportType}>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="performance">Performance Analysis</SelectItem>
                            <SelectItem value="trends">Trend Analysis</SelectItem>
                            <SelectItem value="comparison">Comparative Analysis</SelectItem>
                            <SelectItem value="forecast">Forecasting Report</SelectItem>
                            <SelectItem value="insights">Insights Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Data Source *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dataSources.map((source) => (
                          <Card
                            key={source.id}
                            className={`cursor-pointer transition-all ${
                              dataSource === source.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'hover:border-slate-300'
                            }`}
                            onClick={() => setDataSource(source.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                {source.icon}
                                <div>
                                  <h4 className="font-medium text-slate-900">{source.name}</h4>
                                  <p className="text-sm text-slate-600">{source.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="ai-prompt" className="text-base font-medium">AI Instructions *</Label>
                      <Textarea
                        id="ai-prompt"
                        placeholder="Describe what kind of analysis you want. For example: 'Analyze employee performance trends over the last 6 months and identify top performers and areas for improvement'"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="min-h-[120px] text-base"
                      />
                      <p className="text-sm text-slate-600">Be specific about what insights you want to extract from the data</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="import" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="report-name-import" className="text-base font-medium">Report Name *</Label>
                        <Input
                          id="report-name-import"
                          placeholder="Enter report name"
                          value={reportName}
                          onChange={(e) => setReportName(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium">Analysis Type *</Label>
                        <Select value={reportType} onValueChange={setReportType}>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select analysis type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summary">Executive Summary</SelectItem>
                            <SelectItem value="detailed">Detailed Analysis</SelectItem>
                            <SelectItem value="comparison">Comparative Analysis</SelectItem>
                            <SelectItem value="insights">Key Insights</SelectItem>
                            <SelectItem value="recommendations">Recommendations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Upload Files for Analysis *</Label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Reports for AI Analysis</h3>
                        <p className="text-slate-600 mb-4">Upload existing reports that you want AI to analyze and create new insights from</p>
                        <div className="space-y-4">
                          <input
                            type="file"
                            id="import-files"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <label htmlFor="import-files">
                            <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Choose Files
                            </Button>
                          </label>
                          <p className="text-sm text-slate-500">Supports: PDF, Word, Excel, CSV (Max 10MB each)</p>
                        </div>
                      </div>
                      
                      {importedFiles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-900">Uploaded Files:</h4>
                          <div className="space-y-2">
                            {importedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-slate-600" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFile(index)}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="ai-prompt-import" className="text-base font-medium">AI Analysis Instructions *</Label>
                      <Textarea
                        id="ai-prompt-import"
                        placeholder="Tell AI what to analyze from the uploaded files. For example: 'Extract key performance metrics, identify trends, and provide actionable recommendations'"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="min-h-[120px] text-base"
                      />
                      <p className="text-sm text-slate-600">Describe what insights you want AI to extract from the uploaded reports</p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Generate Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 px-8"
                    onClick={handleGenerateReport}
                    disabled={
                      !reportName || 
                      !reportType || 
                      !aiPrompt || 
                      isGenerating ||
                      (activeTab === "generate" && !dataSource) ||
                      (activeTab === "import" && importedFiles.length === 0)
                    }
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
