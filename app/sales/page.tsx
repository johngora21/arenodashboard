'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Award,
  FileText,
  FilterIcon,
  Plus
} from 'lucide-react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function SalesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7_days')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Mock data
  const leads = [
    {
      id: '1',
      name: 'John Smith',
      company: 'TechCorp Solutions',
      email: 'john.smith@techcorp.com',
      phone: '+255 712 345 678',
      status: 'qualified',
      value: 2500000,
      source: 'Website',
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      company: 'Global Industries',
      email: 'maria.garcia@global.com',
      phone: '+255 713 456 789',
      status: 'new',
      value: 1800000,
      source: 'Referral',
      assignedTo: 'Mike Wilson',
      createdAt: '2024-01-18T09:15:00Z'
    }
  ]

  const deals = [
    {
      id: '1',
      title: 'Enterprise Software License',
      customer: 'TechCorp Solutions',
      value: 8500000,
      stage: 'negotiation',
      probability: 75,
      expectedClose: '2024-02-15',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: '2',
      title: 'Cloud Infrastructure Setup',
      customer: 'Global Industries',
      value: 3200000,
      stage: 'proposal',
      probability: 60,
      expectedClose: '2024-02-28',
      assignedTo: 'Mike Wilson'
    }
  ]

  const salesReps = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@iris.com',
      avatar: 'SJ',
      monthlyRevenue: 12500000,
      dealsClosed: 8,
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike.wilson@iris.com',
      avatar: 'MW',
      monthlyRevenue: 9800000,
      dealsClosed: 6,
      performance: 'good'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'qualified': return 'bg-yellow-100 text-yellow-700'
      case 'proposal': return 'bg-orange-100 text-orange-700'
      case 'closed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-gray-100 text-gray-700'
      case 'qualification': return 'bg-blue-100 text-blue-700'
      case 'proposal': return 'bg-yellow-100 text-yellow-700'
      case 'negotiation': return 'bg-orange-100 text-orange-700'
      case 'closed_won': return 'bg-green-100 text-green-700'
      case 'closed_lost': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-700'
      case 'good': return 'bg-blue-100 text-blue-700'
      case 'average': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const timeframeOptions = [
    { value: '7_days', label: 'Last 7 Days' },
    { value: '30_days', label: 'Last 30 Days' },
    { value: '3_months', label: 'Last 3 Months' },
    { value: '6_months', label: 'Last 6 Months' },
    { value: '1_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const getTimeframeLabel = () => {
    if (selectedTimeframe === 'custom') {
      if (customStartDate && customEndDate) {
        return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`
      }
      return 'Select Custom Range'
    }
    return timeframeOptions.find(option => option.value === selectedTimeframe)?.label || 'Last 7 Days'
  }

  const getTimeframeData = () => {
    // Simulate different data based on timeframe
    const data = {
      '7_days': {
        revenue: 8500000,
        deals: 12,
        avgDealSize: 708333,
        winRate: 75,
        newLeads: 28,
        convertedLeads: 9,
        conversionRate: 32.1,
        responseTime: 2.3,
        previousRevenue: 7400000,
        previousDeals: 9
      },
      '30_days': {
        revenue: 32000000,
        deals: 45,
        avgDealSize: 711111,
        winRate: 78,
        newLeads: 120,
        convertedLeads: 38,
        conversionRate: 31.7,
        responseTime: 2.1,
        previousRevenue: 28000000,
        previousDeals: 40
      },
      '3_months': {
        revenue: 95000000,
        deals: 135,
        avgDealSize: 703704,
        winRate: 82,
        newLeads: 380,
        convertedLeads: 124,
        conversionRate: 32.6,
        responseTime: 1.9,
        previousRevenue: 82000000,
        previousDeals: 118
      },
      '6_months': {
        revenue: 185000000,
        deals: 260,
        avgDealSize: 711538,
        winRate: 79,
        newLeads: 720,
        convertedLeads: 234,
        conversionRate: 32.5,
        responseTime: 2.0,
        previousRevenue: 160000000,
        previousDeals: 225
      },
      '1_year': {
        revenue: 380000000,
        deals: 520,
        avgDealSize: 730769,
        winRate: 81,
        newLeads: 1450,
        convertedLeads: 470,
        conversionRate: 32.4,
        responseTime: 1.8,
        previousRevenue: 320000000,
        previousDeals: 440
      }
    }
    return data[selectedTimeframe as keyof typeof data] || data['7_days']
  }

  const totalRevenue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const totalLeads = leads.length
  const activeDeals = deals.length
  const conversionRate = ((leads.filter(lead => lead.status === 'closed').length / totalLeads) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sales Management</h1>
                <p className="text-slate-600 mt-1 text-base">Track leads, manage deals, and analyze sales performance</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    console.log('Button clicked, navigating to /sales/multi-platform')
                    window.location.href = '/sales/multi-platform'
                  }}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4" />
                  Multi-Platform Posting
                </Button>
                <Button 
                  onClick={() => {
                    console.log('Button clicked, navigating to /sales/messages')
                    window.location.href = '/sales/messages'
                  }}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  <Mail className="h-4 w-4" />
                  Unified Messages
                </Button>
                <a
                  href="/sales/reports"
                  className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </a>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
                    <p className="text-xs text-green-600">+12% this month</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
                    <p className="text-xs text-blue-600">+5 new this week</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Deals</p>
                    <p className="text-2xl font-bold text-slate-900">{activeDeals}</p>
                    <p className="text-xs text-orange-600">In pipeline</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-slate-900">{conversionRate}%</p>
                    <p className="text-xs text-purple-600">Lead to customer</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FilterIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search leads, deals, or customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leads ({leads.length})
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Pipeline ({deals.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Top Performers */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-500" />
                    Top Sales Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {salesReps.map((rep, index) => (
                      <div key={rep.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {rep.avatar}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{rep.name}</h3>
                            <p className="text-sm text-slate-600">{rep.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{formatCurrency(rep.monthlyRevenue)}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={getPerformanceColor(rep.performance)}>
                              {rep.performance.charAt(0).toUpperCase() + rep.performance.slice(1)}
                            </Badge>
                            <span className="text-sm text-slate-600">{rep.dealsClosed} deals</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Recent Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-900">{lead.name}</h4>
                            <p className="text-sm text-slate-600">{lead.company}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </Badge>
                            <p className="text-sm text-slate-600 mt-1">{formatCurrency(lead.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      Active Deals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deals.map((deal) => (
                        <div key={deal.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-900">{deal.title}</h4>
                            <p className="text-sm text-slate-600">{deal.customer}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStageColor(deal.stage)}>
                              {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                            </Badge>
                            <p className="text-sm text-slate-600 mt-1">{formatCurrency(deal.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <Card key={lead.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getStatusColor(lead.status)}`}>
                              {lead.status === 'new' ? <Clock className="h-4 w-4" /> : 
                               lead.status === 'qualified' ? <AlertCircle className="h-4 w-4" /> :
                               <CheckCircle className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
                                <Badge className={getStatusColor(lead.status)}>
                                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{lead.company}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {lead.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {lead.phone}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {lead.assignedTo}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatCurrency(lead.value)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Created: {formatDate(lead.createdAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-4">
              <div className="grid gap-4">
                {deals.map((deal) => (
                  <Card key={deal.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getStageColor(deal.stage)}`}>
                              {deal.stage === 'proposal' ? <FileText className="h-4 w-4" /> :
                               deal.stage === 'negotiation' ? <Phone className="h-4 w-4" /> :
                               <Target className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">{deal.title}</h3>
                                <Badge className={getStageColor(deal.stage)}>
                                  {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{deal.customer}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatCurrency(deal.value)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-4 w-4" />
                                  {deal.probability}% probability
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {deal.assignedTo}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Expected: {formatDate(deal.expectedClose)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Revenue Trends Chart */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Revenue Trends (Last 6 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2 p-4">
                    {[
                      { month: 'Aug', revenue: 8500000, color: 'bg-blue-200' },
                      { month: 'Sep', revenue: 9200000, color: 'bg-blue-300' },
                      { month: 'Oct', revenue: 7800000, color: 'bg-blue-400' },
                      { month: 'Nov', revenue: 10500000, color: 'bg-blue-500' },
                      { month: 'Dec', revenue: 9800000, color: 'bg-blue-600' },
                      { month: 'Jan', revenue: 13500000, color: 'bg-blue-700' }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div 
                          className={`${item.color} rounded-t-lg transition-all duration-300 hover:scale-105`}
                          style={{ height: `${(item.revenue / 13500000) * 200}px`, minHeight: '20px', width: '40px' }}
                        ></div>
                        <span className="text-xs font-medium text-slate-600">{item.month}</span>
                        <span className="text-xs text-slate-500">{formatCurrency(item.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Sources Pie Chart */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      Lead Sources Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-48 mb-4">
                      <div className="relative w-32 h-32">
                        {/* Pie Chart SVG */}
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="20"
                            strokeDasharray={`${(leads.filter(l => l.source === 'Website').length / totalLeads) * 251.2} 251.2`}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray={`${(leads.filter(l => l.source === 'Referral').length / totalLeads) * 251.2} 251.2`}
                            strokeDashoffset={`-${(leads.filter(l => l.source === 'Website').length / totalLeads) * 251.2}`}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="20"
                            strokeDasharray={`${(leads.filter(l => l.source === 'LinkedIn').length / totalLeads) * 251.2} 251.2`}
                            strokeDashoffset={`-${((leads.filter(l => l.source === 'Website').length + leads.filter(l => l.source === 'Referral').length) / totalLeads) * 251.2}`}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="20"
                            strokeDasharray={`${(leads.filter(l => l.source === 'Trade Show').length / totalLeads) * 251.2} 251.2`}
                            strokeDashoffset={`-${((leads.filter(l => l.source === 'Website').length + leads.filter(l => l.source === 'Referral').length + leads.filter(l => l.source === 'LinkedIn').length) / totalLeads) * 251.2}`}
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { source: 'Website', color: 'bg-blue-500', count: leads.filter(l => l.source === 'Website').length },
                        { source: 'Referral', color: 'bg-green-500', count: leads.filter(l => l.source === 'Referral').length },
                        { source: 'LinkedIn', color: 'bg-orange-500', count: leads.filter(l => l.source === 'LinkedIn').length },
                        { source: 'Trade Show', color: 'bg-purple-500', count: leads.filter(l => l.source === 'Trade Show').length }
                      ].map((item) => (
                        <div key={item.source} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                            <span className="text-sm font-medium text-slate-700">{item.source}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">{item.count} leads</p>
                            <p className="text-xs text-slate-600">{((item.count / totalLeads) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Demographics */}
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Customer Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Industry Distribution */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Industry Distribution</h4>
                        <div className="space-y-3">
                          {[
                            { industry: 'Technology', percentage: 35, color: 'bg-blue-500' },
                            { industry: 'Manufacturing', percentage: 25, color: 'bg-green-500' },
                            { industry: 'Healthcare', percentage: 20, color: 'bg-purple-500' },
                            { industry: 'Finance', percentage: 15, color: 'bg-orange-500' },
                            { industry: 'Retail', percentage: 5, color: 'bg-red-500' }
                          ].map((item) => (
                            <div key={item.industry} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">{item.industry}</span>
                                <span className="font-medium text-slate-900">{item.percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Company Size */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Company Size</h4>
                        <div className="space-y-3">
                          {[
                            { size: 'Enterprise (500+ employees)', percentage: 40, color: 'bg-indigo-500' },
                            { size: 'Mid-size (50-499 employees)', percentage: 35, color: 'bg-blue-500' },
                            { size: 'Small (10-49 employees)', percentage: 20, color: 'bg-green-500' },
                            { size: 'Startup (<10 employees)', percentage: 5, color: 'bg-yellow-500' }
                          ].map((item) => (
                            <div key={item.size} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">{item.size}</span>
                                <span className="font-medium text-slate-900">{item.percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Geographic Distribution */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Geographic Distribution</h4>
                        <div className="space-y-3">
                          {[
                            { region: 'Dar es Salaam', percentage: 45, color: 'bg-blue-500' },
                            { region: 'Mwanza', percentage: 25, color: 'bg-green-500' },
                            { region: 'Arusha', percentage: 15, color: 'bg-purple-500' },
                            { region: 'Dodoma', percentage: 10, color: 'bg-orange-500' },
                            { region: 'Other Regions', percentage: 5, color: 'bg-gray-500' }
                          ].map((item) => (
                            <div key={item.region} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">{item.region}</span>
                                <span className="font-medium text-slate-900">{item.percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Marketing Campaign Insights */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-500" />
                    Marketing Campaign Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-900 mb-2">Best Performing Channel</h4>
                      <p className="text-2xl font-bold text-blue-700">Website</p>
                      <p className="text-sm text-blue-600 mt-1">35% of total leads</p>
                      <p className="text-xs text-blue-500 mt-2">High conversion rate: 28%</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-green-900 mb-2">Target Industry</h4>
                      <p className="text-2xl font-bold text-green-700">Technology</p>
                      <p className="text-sm text-green-600 mt-1">35% of customer base</p>
                      <p className="text-xs text-green-500 mt-2">Average deal size: TZS 8.5M</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-purple-900 mb-2">Optimal Company Size</h4>
                      <p className="text-2xl font-bold text-purple-700">Enterprise</p>
                      <p className="text-sm text-purple-600 mt-1">40% of customers</p>
                      <p className="text-xs text-purple-500 mt-2">Highest lifetime value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              {/* Timeframe Selection */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    Report Timeframe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quick Timeframe Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {timeframeOptions.slice(0, 5).map((option) => (
                        <Button
                          key={option.value}
                          variant={selectedTimeframe === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeframe(option.value)}
                          className={selectedTimeframe === option.value ? "bg-orange-500 hover:bg-orange-600" : ""}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Custom Range Section */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant={selectedTimeframe === 'custom' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeframe('custom')}
                        className={selectedTimeframe === 'custom' ? "bg-orange-500 hover:bg-orange-600" : ""}
                      >
                        Custom Range
                      </Button>
                      
                      {selectedTimeframe === 'custom' && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="startDate" className="text-sm font-medium">From:</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                              className="w-40"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="endDate" className="text-sm font-medium">To:</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              className="w-40"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Current Selection Display */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700">
                        Current Period: <span className="text-orange-600">{getTimeframeLabel()}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-green-500" />
                                  Sales Report ({getTimeframeLabel()})
                                </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                                                          <div className="grid grid-cols-2 gap-4">
                                      <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">Revenue Generated</p>
                                        <p className="text-xl font-bold text-slate-900">{formatCurrency(getTimeframeData().revenue)}</p>
                                        <p className="text-xs text-green-600">+15% vs previous period</p>
                                      </div>
                                      <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">Deals Closed</p>
                                        <p className="text-xl font-bold text-slate-900">{getTimeframeData().deals}</p>
                                        <p className="text-xs text-blue-600">+3 vs previous period</p>
                                      </div>
                                      <div className="p-4 bg-orange-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">Average Deal Size</p>
                                        <p className="text-xl font-bold text-slate-900">{formatCurrency(getTimeframeData().avgDealSize)}</p>
                                        <p className="text-xs text-orange-600">+8% vs previous period</p>
                                      </div>
                                      <div className="p-4 bg-purple-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">Win Rate</p>
                                        <p className="text-xl font-bold text-slate-900">{getTimeframeData().winRate}%</p>
                                        <p className="text-xs text-purple-600">+5% vs previous period</p>
                                      </div>
                                    </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                  <Activity className="h-5 w-5 text-blue-500" />
                                  Lead Report ({getTimeframeLabel()})
                                </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                                                          <div className="grid grid-cols-2 gap-4">
                                      <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">New Leads</p>
                                        <p className="text-xl font-bold text-slate-900">{getTimeframeData().newLeads}</p>
                                        <p className="text-xs text-blue-600">+12 vs previous period</p>
                                      </div>
                                      <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">Leads Converted</p>
                                        <p className="text-xl font-bold text-slate-900">{getTimeframeData().convertedLeads}</p>
                                        <p className="text-xs text-green-600">+2 vs previous period</p>
                                      </div>
                                      <div className="p-4 bg-yellow-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                                        <p className="text-xl font-bold text-slate-900">{getTimeframeData().conversionRate}%</p>
                                        <p className="text-xs text-yellow-600">+3.2% vs previous period</p>
                                      </div>
                                      <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                                        <p className="text-xl font-bold text-slate-900">{getTimeframeData().responseTime}h</p>
                                        <p className="text-xs text-gray-600">-0.5h vs previous period</p>
                                      </div>
                                    </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Comparison */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                         <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                       <h4 className="text-lg font-semibold text-blue-900 mb-2">This Period</h4>
                       <p className="text-2xl font-bold text-blue-700">{formatCurrency(getTimeframeData().revenue)}</p>
                       <p className="text-sm text-blue-600 mt-1">Revenue</p>
                       <p className="text-xs text-blue-500 mt-2">{getTimeframeData().deals} deals closed</p>
                     </div>
                     <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                       <h4 className="text-lg font-semibold text-green-900 mb-2">Previous Period</h4>
                       <p className="text-2xl font-bold text-green-700">{formatCurrency(getTimeframeData().previousRevenue)}</p>
                       <p className="text-sm text-green-600 mt-1">Revenue</p>
                       <p className="text-xs text-green-500 mt-2">{getTimeframeData().previousDeals} deals closed</p>
                     </div>
                     <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                       <h4 className="text-lg font-semibold text-orange-900 mb-2">Growth</h4>
                       <p className="text-2xl font-bold text-orange-700">+14.9%</p>
                       <p className="text-sm text-orange-600 mt-1">Revenue Growth</p>
                       <p className="text-xs text-orange-500 mt-2">+33% deal growth</p>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
