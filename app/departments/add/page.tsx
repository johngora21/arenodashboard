"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Building2, 
  ArrowLeft,
  Save,
  X,
  UserPlus,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  CheckCircle
} from "lucide-react"

interface DepartmentFormData {
  name: string
  branchId: string
  branchName: string
  manager: string
  description: string
  capacity: string
  phone: string
  email: string
  status: 'active' | 'inactive' | 'under_review'
  type: 'operational' | 'support' | 'management' | 'technical'
}

interface Branch {
  id: string
  name: string
  city: string
  region: string
}

export default function AddDepartmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    branchId: '',
    branchName: '',
    manager: '',
    description: '',
    capacity: '',
    phone: '',
    email: '',
    status: 'active',
    type: 'operational'
  })

  // Mock branches data - in real app this would come from API
  const branches: Branch[] = [
    { id: '1', name: 'Dar es Salaam Main Branch', city: 'Dar es Salaam', region: 'Dar es Salaam' },
    { id: '2', name: 'Arusha Branch', city: 'Arusha', region: 'Arusha' },
    { id: '3', name: 'Mwanza Branch', city: 'Mwanza', region: 'Mwanza' },
    { id: '4', name: 'Dodoma Branch', city: 'Dodoma', region: 'Dodoma' },
    { id: '5', name: 'Tanga Branch', city: 'Tanga', region: 'Tanga' },
    { id: '6', name: 'Mbeya Branch', city: 'Mbeya', region: 'Mbeya' }
  ]

  const departmentTypes = [
    { value: 'operational', label: 'Operational', description: 'Core business operations' },
    { value: 'support', label: 'Support', description: 'Support and administrative functions' },
    { value: 'management', label: 'Management', description: 'Leadership and strategic functions' },
    { value: 'technical', label: 'Technical', description: 'Technical and specialized functions' }
  ]

  const handleInputChange = (field: keyof DepartmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBranchChange = (branchId: string) => {
    const selectedBranch = branches.find(branch => branch.id === branchId)
    setFormData(prev => ({
      ...prev,
      branchId,
      branchName: selectedBranch?.name || ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Department data to save:', formData)
      
      // Here you would typically save to your database
      // await saveDepartment(formData)
      
      // Redirect back to departments/branches page
      router.push('/branches')
    } catch (error) {
      console.error('Error saving department:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/branches')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/branches')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Branches
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add New Department</h1>
                <p className="text-slate-600 mt-1 text-base">Create a new department within an existing branch</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Department Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Department Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter department name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Department Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department type" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex flex-col">
                                <span>{type.label}</span>
                                <span className="text-xs text-slate-500">{type.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Branch Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="branch">Select Branch *</Label>
                    <Select value={formData.branchId} onValueChange={handleBranchChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a branch for this department" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{branch.name}</span>
                              <span className="text-xs text-slate-500">{branch.city}, {branch.region}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.branchName && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Selected Branch: {formData.branchName}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Management Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="manager">Department Manager</Label>
                      <Input
                        id="manager"
                        value={formData.manager}
                        onChange={(e) => handleInputChange('manager', e.target.value)}
                        placeholder="Enter manager name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Employee Capacity</Label>
                      <Input
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        placeholder="e.g., 25 employees"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+255 XXX XXX XXX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="dept@company.com"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter department description, responsibilities, and additional details..."
                      rows={4}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !formData.branchId}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Department
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
