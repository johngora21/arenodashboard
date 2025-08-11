'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  Plus,
  Globe,
  Users,
  Mail,
  Phone,
  Building2,
  Target,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'

interface SalesChannelForm {
  name: string
  type: string
  description: string
  targetAudience: string
  budget: number
  expectedLeads: number
  conversionRate: number
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'planned'
  manager: string
  contactEmail: string
  contactPhone: string
  website: string
  notes: string
}

export default function AddSalesChannelPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<SalesChannelForm>({
    name: '',
    type: '',
    description: '',
    targetAudience: '',
    budget: 0,
    expectedLeads: 0,
    conversionRate: 0,
    startDate: '',
    endDate: '',
    status: 'planned',
    manager: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    notes: ''
  })

  const channelTypes = [
    { value: 'website', label: 'Website', icon: <Globe className="h-4 w-4" /> },
    { value: 'social_media', label: 'Social Media', icon: <Users className="h-4 w-4" /> },
    { value: 'email_marketing', label: 'Email Marketing', icon: <Mail className="h-4 w-4" /> },
    { value: 'google_ads', label: 'Google Ads', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'trade_shows', label: 'Trade Shows', icon: <Building2 className="h-4 w-4" /> },
    { value: 'referral_program', label: 'Referral Program', icon: <Users className="h-4 w-4" /> },
    { value: 'cold_calling', label: 'Cold Calling', icon: <Phone className="h-4 w-4" /> },
    { value: 'content_marketing', label: 'Content Marketing', icon: <FileText className="h-4 w-4" /> },
    { value: 'partnerships', label: 'Partnerships', icon: <Building2 className="h-4 w-4" /> },
    { value: 'direct_mail', label: 'Direct Mail', icon: <Mail className="h-4 w-4" /> }
  ]

  const targetAudiences = [
    'Technology Companies',
    'Manufacturing Companies',
    'Healthcare Organizations',
    'Financial Institutions',
    'Retail Businesses',
    'Educational Institutions',
    'Government Agencies',
    'Startups',
    'Enterprise Companies',
    'Small & Medium Businesses'
  ]

  const managers = [
    'Sarah Johnson',
    'Mike Wilson',
    'Emma Davis',
    'David Brown',
    'Lisa Chen'
  ]

  const handleInputChange = (field: keyof SalesChannelForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sales Channel Data:', formData)
    // Here you would typically make an API call to save the channel
    router.push('/sales')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              {/* Back Button */}
              <div className="flex justify-start">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sales
                </Button>
              </div>
              
              {/* Page Title */}
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add Sales Channel</h1>
                <p className="text-slate-600 mt-1 text-base">Create a new marketing channel to track performance</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Basic Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-500" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Channel Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Google Ads Campaign"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Channel Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {channelTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.icon}
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the marketing channel and its objectives..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget & Performance */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Budget & Performance Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Monthly Budget (TZS)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                      placeholder="0"
                    />
                    {formData.budget > 0 && (
                      <p className="text-sm text-slate-500">{formatCurrency(formData.budget)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedLeads">Expected Leads/Month</Label>
                    <Input
                      id="expectedLeads"
                      type="number"
                      value={formData.expectedLeads}
                      onChange={(e) => handleInputChange('expectedLeads', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conversionRate">Expected Conversion Rate (%)</Label>
                    <Input
                      id="conversionRate"
                      type="number"
                      step="0.1"
                      value={formData.conversionRate}
                      onChange={(e) => handleInputChange('conversionRate', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>

                {formData.budget > 0 && formData.expectedLeads > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Performance Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600">Cost per Lead</p>
                        <p className="font-semibold text-blue-900">
                          {formData.expectedLeads > 0 ? formatCurrency(formData.budget / formData.expectedLeads) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600">Expected Conversions</p>
                        <p className="font-semibold text-blue-900">
                          {Math.round((formData.expectedLeads * formData.conversionRate) / 100)} leads
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600">ROI Potential</p>
                        <p className="font-semibold text-blue-900">
                          {formData.conversionRate > 0 ? 'High' : 'To be determined'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Campaign Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="manager">Channel Manager</Label>
                    <Select value={formData.manager} onValueChange={(value) => handleInputChange('manager', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager} value={manager}>
                            {manager}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="manager@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+255 712 345 678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website/URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes & Special Instructions</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional notes, special requirements, or instructions for this channel..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Sales Channel
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
