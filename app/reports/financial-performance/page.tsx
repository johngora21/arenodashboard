"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  DollarSign,
  ArrowLeft,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Loader2,
  CreditCard,
  Building,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { ReportService, ReportFilters } from "@/lib/report-service"

export default function FinancialPerformanceReportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [filters, setFilters] = useState<ReportFilters>({
    period: 'last_quarter',
    category: 'all'
  })
  const [reportTitle, setReportTitle] = useState("Financial Performance Report")
  const [reportDescription, setReportDescription] = useState("Revenue, expenses, and profitability analysis")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      const report = await ReportService.generateFinancialPerformanceReport(filters)
      
      report.title = reportTitle
      report.description = reportDescription
      report.filters = filters

      setGeneratedReport(report)
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
    link.download = `${reportTitle.replace(/\s+/g, '_')}_${format}.${format}`
    link.click()
    URL.revokeObjectURL(url)
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
          <div className="max-w-4xl mx-auto">
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
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Financial Performance Report</h1>
                  <p className="text-slate-600 mt-1">Revenue, expenses, and profitability analysis</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Report Configuration</h2>
                  
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

                    <div>
                      <Label htmlFor="period">Period</Label>
                      <Select
                        value={filters.period || 'last_quarter'}
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
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={filters.category || 'all'}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="expenses">Expenses</SelectItem>
                          <SelectItem value="profit">Profit</SelectItem>
                          <SelectItem value="receivables">Receivables</SelectItem>
                          <SelectItem value="payables">Payables</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="w-full bg-green-500 hover:bg-green-600"
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
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Report Preview</h2>
                    {generatedReport && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport('pdf')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport('excel')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Excel
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport('csv')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          CSV
                        </Button>
                      </div>
                    )}
                  </div>

                  {!generatedReport ? (
                    <div className="text-center py-12">
                      <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No report generated yet</h3>
                      <p className="text-slate-500">Configure the filters and click "Generate Report" to create your financial performance report.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Report Header */}
                      <div className="border-b border-slate-200 pb-4">
                        <h3 className="text-lg font-semibold text-slate-900">{generatedReport.title}</h3>
                        <p className="text-slate-600 mt-1">{generatedReport.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>Generated: {generatedReport.generatedAt.toLocaleString()}</span>
                          <span>•</span>
                          <span>{generatedReport.data.transactions?.length || 0} transactions analyzed</span>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      {generatedReport.data.metrics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-900">Total Revenue</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900 mt-1">
                              ${generatedReport.data.metrics.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-5 w-5 text-red-600" />
                              <span className="font-semibold text-red-900">Total Expenses</span>
                            </div>
                            <p className="text-2xl font-bold text-red-900 mt-1">
                              ${generatedReport.data.metrics.totalExpenses.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-blue-900">Net Profit</span>
                            </div>
                            <p className={`text-2xl font-bold mt-1 ${
                              generatedReport.data.metrics.netProfit >= 0 ? 'text-blue-900' : 'text-red-900'
                            }`}>
                              ${generatedReport.data.metrics.netProfit.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Target className="h-5 w-5 text-orange-600" />
                              <span className="font-semibold text-orange-900">Profit Margin</span>
                            </div>
                            <p className="text-2xl font-bold text-orange-900 mt-1">
                              {generatedReport.data.metrics.profitMargin.toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-purple-600" />
                              <span className="font-semibold text-purple-900">Outstanding Receivables</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-900 mt-1">
                              ${generatedReport.data.metrics.outstandingReceivables.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-indigo-50 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Building className="h-5 w-5 text-indigo-600" />
                              <span className="font-semibold text-indigo-900">Outstanding Payables</span>
                            </div>
                            <p className="text-2xl font-bold text-indigo-900 mt-1">
                              ${generatedReport.data.metrics.outstandingPayables.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Revenue Breakdown */}
                      {generatedReport.data.revenueBreakdown && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Revenue Breakdown</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm text-slate-600">Shipment Revenue</p>
                              <p className="text-xl font-bold text-slate-900">
                                ${generatedReport.data.revenueBreakdown.shipmentRevenue.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm text-slate-600">Other Revenue</p>
                              <p className="text-xl font-bold text-slate-900">
                                ${generatedReport.data.revenueBreakdown.otherRevenue.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm text-slate-600">Total Revenue</p>
                              <p className="text-xl font-bold text-slate-900">
                                ${generatedReport.data.revenueBreakdown.totalRevenue.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Summary Stats */}
                      {generatedReport.summary && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Summary</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm text-slate-600">Total Transactions</p>
                              <p className="text-xl font-bold text-slate-900">{generatedReport.summary.totalTransactions}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm text-slate-600">Total Shipments</p>
                              <p className="text-xl font-bold text-slate-900">{generatedReport.summary.totalShipments}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm text-slate-600">Revenue Growth</p>
                              <p className={`text-xl font-bold ${
                                generatedReport.summary.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {generatedReport.summary.revenueGrowth >= 0 ? '+' : ''}{generatedReport.summary.revenueGrowth.toFixed(1)}%
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm text-slate-600">Profit Trend</p>
                              <div className="flex items-center gap-2">
                                {generatedReport.summary.profitTrend === 'positive' ? (
                                  <TrendingUp className="h-5 w-5 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-5 w-5 text-red-600" />
                                )}
                                <span className={`font-semibold ${
                                  generatedReport.summary.profitTrend === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {generatedReport.summary.profitTrend === 'positive' ? 'Positive' : 'Negative'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 