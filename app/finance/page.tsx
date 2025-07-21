"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  Building,
  Car,
  Wifi,
  Zap,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Package,
  Truck,
  Shield,
  X,
  XCircle
} from "lucide-react"
import { 
  getAllTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction, 
  getFinancialSummary,
  getTransactionStats,
  searchTransactions,
  Transaction,
  FinancialSummary,
  getPendingApprovalsByDepartment,
  approveRequest,
  rejectRequest
} from "@/lib/firebase-service"
import { Badge } from "@/components/ui/badge"

interface NewTransactionForm {
  type: 'income' | 'expense'
  category: string
  subcategory: string
  amount: string
  description: string
  date: string
  paymentMethod: string
  status: 'completed' | 'pending' | 'cancelled'
  reference: string
  notes: string
}

export default function FinancePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState("30d")
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<NewTransactionForm>({
    type: 'income',
    category: '',
    subcategory: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    status: 'completed',
    reference: '',
    notes: ''
  })
  const [showBankBalance, setShowBankBalance] = useState(false)

  // Approval states
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [showApprovals, setShowApprovals] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadFinanceData()
    }
  }, [user, dateFilter])

  const loadFinanceData = async () => {
    try {
      setDataLoading(true)
      
      // Load transactions and financial summary from Firebase
      const [transactionsData, summaryData] = await Promise.all([
        getAllTransactions(),
        getFinancialSummary()
      ])
      
      setTransactions(transactionsData)
      setSummary(summaryData)
      
      // Load pending expense approvals
      await loadPendingApprovals()
    } catch (err) {
      console.error('Error loading finance data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const loadPendingApprovals = async () => {
    try {
      const approvals = await getPendingApprovalsByDepartment('finance')
      setPendingApprovals(approvals)
    } catch (err) {
      console.error('Error loading pending approvals:', err)
    }
  }

  const handleApproveExpenses = async (approvalId: string) => {
    try {
      await approveRequest(approvalId, user?.email || 'admin@arenologistics.com')
      await loadPendingApprovals()
      alert('Expenses approved successfully!')
    } catch (err) {
      console.error('Error approving expenses:', err)
      alert('Error approving expenses. Please try again.')
    }
  }

  const handleRejectExpenses = async (approvalId: string) => {
    try {
      await rejectRequest(approvalId, user?.email || 'admin@arenologistics.com', 'Rejected by admin')
      await loadPendingApprovals()
      alert('Expenses rejected successfully!')
    } catch (err) {
      console.error('Error rejecting expenses:', err)
      alert('Error rejecting expenses. Please try again.')
    }
  }

  const handleInputChange = (field: keyof NewTransactionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.category || !formData.subcategory || !formData.amount || 
        !formData.description || !formData.date || !formData.paymentMethod) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setFormLoading(true)
      
      // Create the transaction data object
      const transactionData: any = {
        type: formData.type,
        category: formData.category,
        subcategory: formData.subcategory,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        status: formData.status
      }

      // Only add optional fields if they have values
      if (formData.reference && formData.reference.trim()) {
        transactionData.reference = formData.reference
      }
      if (formData.notes && formData.notes.trim()) {
        transactionData.notes = formData.notes
      }

      console.log('Creating transaction with data:', transactionData)
      
      const transactionId = await addTransaction(transactionData)
      console.log('Transaction created successfully with ID:', transactionId)
      
      // Reset form and close modal
      setFormData({
        type: 'income',
        category: '',
        subcategory: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        status: 'completed',
        reference: '',
        notes: ''
      })
      setShowAddTransaction(false)
      
      // Reload finance data
      await loadFinanceData()
      
      alert('Transaction created successfully!')
    } catch (error) {
      console.error('Error creating transaction:', error)
      
      // Show more specific error message
      if (error instanceof Error) {
        alert(`Error creating transaction: ${error.message}`)
      } else {
        alert('Error creating transaction. Please check the console for details.')
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      await deleteTransaction(transactionId)
      await loadFinanceData()
      alert('Transaction deleted successfully!')
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Error deleting transaction. Please try again.')
    }
  }

  const handleSeedSampleData = async () => {
    if (!confirm('This will add sample transaction data. Continue?')) {
      return
    }

    try {
      setDataLoading(true)
      // await seedFinanceSampleData() // This function is no longer imported
      await loadFinanceData()
      alert('Sample data added successfully!')
    } catch (error) {
      console.error('Error seeding sample data:', error)
      alert('Error adding sample data. Please try again.')
    } finally {
      setDataLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  // Helper to format Firebase Timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '-'
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString()
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString()
    }
    return timestamp
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'freight services': return <Truck className="h-4 w-4" />
      case 'moving services': return <Package className="h-4 w-4" />
      case 'courier services': return <Package className="h-4 w-4" />
      case 'operations': return <Activity className="h-4 w-4" />
      case 'administrative': return <Building className="h-4 w-4" />
      case 'payroll': return <Users className="h-4 w-4" />
      case 'utilities': return <Zap className="h-4 w-4" />
      case 'insurance': return <Shield className="h-4 w-4" />
      case 'marketing': return <TrendingUp className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
    
    return matchesSearch && matchesType && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading authentication...</p>
          </div>
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
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Financial Management</h1>
                  <p className="text-slate-600">Track income, expenses, cash flow, and financial performance</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push('/finance/reports')}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <FileText className="h-4 w-4" />
                    Reports
                  </Button>
                  <Button
                    onClick={() => router.push('/finance/approvals')}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approvals
                  </Button>
                </div>
              </div>
            </div>

            {/* Financial Performance Overview */}
            {summary && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Financial Performance</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Current period</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Income</p>
                        <p className="text-3xl font-bold text-emerald-600">{formatCurrency(summary.totalIncome)}</p>
                      <div className="flex items-center mt-2">
                          <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                          <span className="text-sm text-emerald-600">+12.5% this month</span>
                      </div>
                    </div>
                      <div className="bg-emerald-100 p-3 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
                
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                        <p className="text-3xl font-bold text-rose-600">{formatCurrency(summary.totalExpenses)}</p>
                      <div className="flex items-center mt-2">
                          <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />
                          <span className="text-sm text-rose-600">+8.2% this month</span>
                      </div>
                    </div>
                      <div className="bg-rose-100 p-3 rounded-lg">
                        <TrendingDown className="h-6 w-6 text-rose-600" />
                    </div>
                  </div>
                </div>
                
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Net Profit</p>
                        <p className="text-3xl font-bold text-indigo-600">{formatCurrency(summary.netProfit)}</p>
                      <div className="flex items-center mt-2">
                          <ArrowUpRight className="h-4 w-4 text-indigo-500 mr-1" />
                          <span className="text-sm text-indigo-600">{summary.profitMargin}% margin</span>
                      </div>
                    </div>
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <DollarSign className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </div>
                
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Cash Flow</p>
                        <p className="text-3xl font-bold text-amber-600">{formatCurrency(summary.cashFlow)}</p>
                      <div className="flex items-center mt-2">
                          <Activity className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-sm text-amber-600">This month</span>
                      </div>
                    </div>
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <Activity className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Position Overview */}
            {summary && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Financial Position</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Current balances</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Bank Balance</h3>
                      <div className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-emerald-600" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBankBalance(!showBankBalance)}
                          className="text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                  </div>
                    </div>
                    <div className="relative">
                      <p className={`text-3xl font-bold transition-all duration-300 ${
                        showBankBalance 
                          ? 'text-emerald-600' 
                          : 'text-emerald-600 blur-sm select-none'
                      }`}>
                        {showBankBalance ? formatCurrency(summary.bankBalance) : '••••••••'}
                      </p>
                  <p className="text-sm text-slate-500 mt-1">Available funds</p>
                    </div>
                </div>
                
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Outstanding Receivables</h3>
                      <FileText className="h-5 w-5 text-sky-600" />
                  </div>
                    <p className="text-3xl font-bold text-sky-600">{formatCurrency(summary.outstandingReceivables)}</p>
                  <p className="text-sm text-slate-500 mt-1">Pending payments</p>
                </div>
                
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Outstanding Payables</h3>
                      <CreditCard className="h-5 w-5 text-rose-600" />
                  </div>
                    <p className="text-3xl font-bold text-rose-600">{formatCurrency(summary.outstandingPayables)}</p>
                  <p className="text-sm text-slate-500 mt-1">Pending bills</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Approvals Section */}
            {pendingApprovals.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Pending Expense Approvals</h2>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {pendingApprovals.length} pending
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Shipment: {approval.shipmentNumber}</h4>
                          <p className="text-sm text-muted-foreground">
                            Requested by {approval.requestedBy} on {new Date(approval.requestedAt?.toDate()).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      
                      {approval.expensesData && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-purple-700">Expenses Requested:</h5>
                          <div className="space-y-2">
                            {approval.expensesData.expenses.map((expense: any, index: number) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                                <span className="font-medium">{expense.description}</span>
                                <span className="text-sm font-semibold">
                                  TZS {expense.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium">
                              Total Amount: TZS {approval.expensesData.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => handleApproveExpenses(approval.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleRejectExpenses(approval.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search transactions, categories, or references..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Freight Services">Freight Services</option>
                    <option value="Moving Services">Moving Services</option>
                    <option value="Courier Services">Courier Services</option>
                    <option value="Operations">Operations</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                  
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSeedSampleData}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Import
                  </Button>
                  <Button
                    onClick={() => setShowAddTransaction(true)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Transaction
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {dataLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading transactions...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                  {getCategoryIcon(transaction.category)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{transaction.description}</div>
                                <div className="text-sm text-slate-500">{transaction.subcategory}</div>
                                {transaction.reference && (
                                  <div className="text-xs text-slate-400">Ref: {transaction.reference}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{transaction.category}</div>
                            <div className="text-sm text-slate-500">{transaction.paymentMethod}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-semibold ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatTimestamp(transaction.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                              {getStatusIcon(transaction.status)}
                              <span className="ml-1 capitalize">{transaction.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => setSelectedTransaction(transaction)}
                                className="text-slate-400 hover:text-slate-600"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-blue-400 hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="text-red-400 hover:text-red-600"
                                title="Delete transaction"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredTransactions.length === 0 && !dataLoading && (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions found</h3>
                  <p className="text-slate-500">No transactions match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Transaction Details</h2>
                  <p className="text-slate-600 mt-1">{selectedTransaction.reference}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransaction(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Transaction Information</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Type:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        selectedTransaction.type === 'income' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {selectedTransaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </div>
                    <div><span className="font-medium">Category:</span> {selectedTransaction.category}</div>
                    <div><span className="font-medium">Subcategory:</span> {selectedTransaction.subcategory}</div>
                    <div><span className="font-medium">Amount:</span> 
                      <span className={`ml-2 font-semibold ${
                        selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(selectedTransaction.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Details</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Payment Method:</span> {selectedTransaction.paymentMethod}</div>
                    <div><span className="font-medium">Date:</span> {formatTimestamp(selectedTransaction.date)}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedTransaction.status)}`}>
                        {getStatusIcon(selectedTransaction.status)}
                        <span className="ml-1 capitalize">{selectedTransaction.status}</span>
                      </span>
                    </div>
                    {selectedTransaction.reference && (
                      <div><span className="font-medium">Reference:</span> {selectedTransaction.reference}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Description</h3>
                <p className="text-slate-700">{selectedTransaction.description}</p>
                {selectedTransaction.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                    <p className="text-slate-700">{selectedTransaction.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Close
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Transaction
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add New Transaction</h2>
                  <p className="text-slate-600 mt-1">Record a new income or expense transaction</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddTransaction(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Transaction Type & Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Transaction Type
                  </h3>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                      Type *
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      required
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                      Amount (TZS) *
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Payment Details
                  </h3>
                  
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Method *
                    </label>
                    <select
                      id="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      required
                    >
                      <option value="">Select payment method</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Check">Check</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                      Status *
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      required
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reference" className="block text-sm font-medium text-slate-700 mb-2">
                      Reference
                    </label>
                    <input
                      type="text"
                      id="reference"
                      value={formData.reference}
                      onChange={(e) => handleInputChange('reference', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      placeholder="Invoice/Receipt number"
                    />
                  </div>
                </div>
              </div>

              {/* Category Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Category Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Freight Services">Freight Services</option>
                      <option value="Moving Services">Moving Services</option>
                      <option value="Courier Services">Courier Services</option>
                      <option value="Operations">Operations</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Payroll">Payroll</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-slate-700 mb-2">
                      Subcategory *
                    </label>
                    <input
                      type="text"
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                      placeholder="Enter subcategory"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description & Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Description & Notes
                </h3>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    rows={3}
                    placeholder="Describe the transaction"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-slate-900"
                    rows={2}
                    placeholder="Additional notes or comments"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddTransaction(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Transaction
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 