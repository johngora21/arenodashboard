"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Upload,
  FileText,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"

export default function SubmitReportPage() {
  const router = useRouter()
  const [reportName, setReportName] = useState("")
  const [reportFile, setReportFile] = useState<File | null>(null)
  const [reportType, setReportType] = useState("")
  const [approvalChain, setApprovalChain] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableRoles = [
    { id: "admin", name: "Admin", icon: <Users className="h-4 w-4" /> },
    { id: "department_head", name: "Department Head", icon: <Users className="h-4 w-4" /> },
    { id: "manager", name: "Manager", icon: <Users className="h-4 w-4" /> },
    { id: "supervisor", name: "Supervisor", icon: <Users className="h-4 w-4" /> },
    { id: "team_lead", name: "Team Lead", icon: <Users className="h-4 w-4" /> },
    { id: "employee", name: "Employee", icon: <Users className="h-4 w-4" /> }
  ]

  const addToChain = (roleId: string) => {
    if (!approvalChain.includes(roleId)) {
      setApprovalChain([...approvalChain, roleId])
    }
  }

  const removeFromChain = (index: number) => {
    setApprovalChain(approvalChain.filter((_, i) => i !== index))
  }

  const moveInChain = (index: number, direction: 'up' | 'down') => {
    const newChain = [...approvalChain]
    if (direction === 'up' && index > 0) {
      [newChain[index], newChain[index - 1]] = [newChain[index - 1], newChain[index]]
    } else if (direction === 'down' && index < newChain.length - 1) {
      [newChain[index], newChain[index + 1]] = [newChain[index + 1], newChain[index]]
    }
    setApprovalChain(newChain)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setReportFile(file)
      setReportName(file.name.replace(/\.[^/.]+$/, "")) // Remove file extension
    }
  }

  const handleSubmitReport = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/reports')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
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
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Submit Report</h1>
                <p className="text-slate-600 mt-1 text-base">Import and submit existing reports for approval</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Submit Report for Approval</CardTitle>
                <p className="text-slate-600">Upload an existing report and set up the approval chain</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* File Upload Section */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Upload Report File *</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Report File</h3>
                    <p className="text-slate-600 mb-4">Drag and drop your report file here, or click to browse</p>
                    <div className="space-y-4">
                      <input
                        type="file"
                        id="report-file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="report-file">
                        <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </label>
                      <p className="text-sm text-slate-500">Supports: PDF, Word, Excel, CSV (Max 10MB)</p>
                    </div>
                  </div>
                  
                  {reportFile && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">File uploaded successfully</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">{reportFile.name}</p>
                    </div>
                  )}
                </div>

                {/* Report Details */}
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
                        <SelectItem value="performance">Performance Report</SelectItem>
                        <SelectItem value="financial">Financial Report</SelectItem>
                        <SelectItem value="progress">Progress Report</SelectItem>
                        <SelectItem value="analytics">Analytics Report</SelectItem>
                        <SelectItem value="summary">Summary Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Approval Chain */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Approval Chain *</Label>
                  
                  {/* Current Chain Display */}
                  {approvalChain.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-lg border">
                      <h4 className="font-medium text-slate-900 mb-3">Current Chain:</h4>
                      <div className="space-y-2">
                        {approvalChain.map((roleId, index) => {
                          const role = availableRoles.find(r => r.id === roleId)
                          return (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-slate-600">Step {index + 1}:</span>
                                {role?.icon}
                                <span>{role?.name}</span>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moveInChain(index, 'up')}
                                  disabled={index === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moveInChain(index, 'down')}
                                  disabled={index === approvalChain.length - 1}
                                >
                                  ↓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromChain(index)}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Available Roles */}
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <h4 className="font-medium text-blue-900 mb-3">Add to Chain:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableRoles.map((role) => (
                        <Button
                          key={role.id}
                          size="sm"
                          variant="outline"
                          onClick={() => addToChain(role.id)}
                          disabled={approvalChain.includes(role.id)}
                          className="justify-start"
                        >
                          {role.icon}
                          <span className="ml-2">{role.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
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
                    onClick={handleSubmitReport}
                    disabled={!reportFile || !reportName || !reportType || approvalChain.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Report
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
