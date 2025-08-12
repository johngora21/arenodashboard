"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Calculator,
  Search,
  Plus,
  Receipt,
  BookOpen,
  Scale,
  FileText,
  Download,
  Clock,
  Target,
  LineChart,
  PieChart,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export default function FinancePage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedStatement, setSelectedStatement] = useState("");
  const [selectedAccountingPeriod, setSelectedAccountingPeriod] = useState("current_month");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    account: '',
    category: '',
    description: '',
    amount: '',
    reference: '',
    tags: []
  });

  // Account mappings based on transaction type
  const getAccountsByType = (type: string) => {
    switch (type) {
      case 'income':
        return [
          { value: 'sales_revenue', label: 'Sales Revenue' },
          { value: 'consulting_revenue', label: 'Consulting Revenue' },
          { value: 'training_revenue', label: 'Training Revenue' },
          { value: 'support_revenue', label: 'Support Revenue' },
          { value: 'other_income', label: 'Other Income' }
        ]
      case 'expense':
        return [
          { value: 'rent_expense', label: 'Rent Expense' },
          { value: 'salary_expense', label: 'Salary Expense' },
          { value: 'software_expense', label: 'Software Expense' },
          { value: 'marketing_expense', label: 'Marketing Expense' },
          { value: 'utilities_expense', label: 'Utilities Expense' },
          { value: 'office_supplies', label: 'Office Supplies' },
          { value: 'travel_expense', label: 'Travel Expense' },
          { value: 'other_expense', label: 'Other Expense' }
        ]
      case 'transfer':
        return [
          { value: 'cash', label: 'Cash' },
          { value: 'bank_account', label: 'Bank Account' },
          { value: 'accounts_receivable', label: 'Accounts Receivable' },
          { value: 'accounts_payable', label: 'Accounts Payable' }
        ]
      default:
        return []
    }
  }

  // Category mappings based on account
  const getCategoriesByAccount = (account: string) => {
    const categoryMap: { [key: string]: string[] } = {
      // Income categories
      'sales_revenue': ['Product Sales', 'Service Sales', 'License Sales', 'Subscription Revenue'],
      'consulting_revenue': ['Strategy Consulting', 'Technical Consulting', 'Business Consulting'],
      'training_revenue': ['Online Training', 'In-Person Training', 'Certification Programs'],
      'support_revenue': ['Technical Support', 'Maintenance Support', 'Premium Support'],
      
      // Expense categories
      'rent_expense': ['Office Rent', 'Warehouse Rent', 'Equipment Rent'],
      'salary_expense': ['Employee Salaries', 'Contractor Fees', 'Bonuses', 'Benefits'],
      'software_expense': ['Software Licenses', 'Cloud Services', 'Development Tools'],
      'marketing_expense': ['Digital Marketing', 'Print Marketing', 'Events', 'Advertising'],
      'utilities_expense': ['Electricity', 'Water', 'Internet', 'Phone'],
      'office_supplies': ['Stationery', 'Equipment', 'Furniture'],
      'travel_expense': ['Air Travel', 'Hotel', 'Transportation', 'Meals'],
      
      // Transfer categories
      'cash': ['Cash Withdrawal', 'Cash Deposit', 'Petty Cash'],
      'bank_account': ['Bank Transfer', 'Wire Transfer', 'Check Deposit']
    };
    
    return categoryMap[account] || []
  }

  const financialData = {
    revenue: 12500000,
    expenses: 8200000,
    profit: 4300000,
    cashFlow: 2800000,
    growth: 15.2,
    expensesGrowth: -8.5,
    accountsReceivable: 3500000,
    accountsPayable: 1800000
  };

  // Chart data for Cash Flow and Revenue tabs
  const cashFlowData = [
    { month: 'Jan', operating: 4500000, investing: -2000000, financing: 1500000 },
    { month: 'Feb', operating: 4200000, investing: -1800000, financing: 1200000 },
    { month: 'Mar', operating: 4800000, investing: -2200000, financing: 1800000 },
    { month: 'Apr', operating: 4400000, investing: -1600000, financing: 1400000 },
    { month: 'May', operating: 4600000, investing: -1900000, financing: 1600000 },
    { month: 'Jun', operating: 4750000, investing: -2000000, financing: 1500000 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 9800000, growth: 12.5 },
    { month: 'Feb', revenue: 10200000, growth: 15.2 },
    { month: 'Mar', revenue: 11800000, growth: 18.7 },
    { month: 'Apr', revenue: 11200000, growth: 14.3 },
    { month: 'May', revenue: 12500000, growth: 16.8 },
    { month: 'Jun', revenue: 13100000, growth: 20.1 }
  ];

  const revenueSources = [
    { source: 'Product Sales', amount: 7500000, percentage: 60 },
    { source: 'Services', amount: 3500000, percentage: 28 },
    { source: 'Consulting', amount: 1200000, percentage: 9.6 },
    { source: 'Other Income', amount: 300000, percentage: 2.4 }
  ];

  const currentData = financialData;

  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString()}`;
  };

  const getGrowthIcon = (isPositive: boolean) => {
    return isPositive ? (
      <ArrowUpRight className="h-3 w-3 text-green-600" />
    ) : (
      <ArrowDownRight className="h-3 w-3 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 mt-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Finance</h1>
              <p className="text-slate-600">Manage your financial operations and reporting</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push('/finance/reports')} className="bg-orange-500 hover:bg-orange-600">
                Reports
              </Button>
              <Button onClick={() => router.push('/finance/approvals')} className="bg-blue-500 hover:bg-blue-600">
                Approvals
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
              <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Financial Overview Cards */}
              <div className="grid gap-6 md:grid-cols-4">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(12500000)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+8.2%</span>
                        <span className="text-xs text-slate-500">vs last month</span>
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(8200000)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">+2.1%</span>
                        <span className="text-xs text-slate-500">vs last month</span>
                      </div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Receipt className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Net Profit</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(4300000)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+15.3%</span>
                        <span className="text-xs text-slate-500">vs last month</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Cash Balance</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(18500000)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-600">+12.5%</span>
                        <span className="text-xs text-slate-500">vs last month</span>
                      </div>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Banknote className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue vs Expenses Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <LineChart className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-slate-800">Revenue vs Expenses (6 Months)</h3>
                  </div>
                  <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                    <div className="text-center">
                      <div className="w-64 h-48 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-48 h-32 bg-gradient-to-r from-green-100 to-red-100 rounded-lg flex items-center justify-center">
                            <div className="w-40 h-24 bg-gradient-to-r from-green-200 to-red-200 rounded flex items-center justify-center">
                              <div className="w-32 h-16 bg-gradient-to-r from-green-300 to-red-300 rounded flex items-center justify-center">
                                <div className="w-24 h-8 bg-gradient-to-r from-green-400 to-red-400 rounded"></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 font-medium">Revenue vs Expenses</p>
                          <p className="text-xs text-slate-500">Monthly comparison</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profit Distribution Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-slate-800">Profit Distribution</h3>
                  </div>
                  <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                    <div className="text-center">
                      <div className="w-48 h-48 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center relative">
                        <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                        <div className="absolute inset-4 bg-white rounded-full"></div>
                        <div className="absolute inset-6 bg-gradient-to-br from-green-300 to-blue-400 rounded-full"></div>
                        <div className="absolute inset-8 bg-white rounded-full"></div>
                        <div className="absolute inset-10 bg-gradient-to-br from-green-200 to-blue-300 rounded-full"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800">34%</div>
                          <div className="text-xs text-slate-600">Net Profit</div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-slate-700">Revenue: 100%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-slate-700">Expenses: 66%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-slate-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Recent Financial Activity</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Consulting Revenue</p>
                        <p className="text-sm text-slate-600">Client project completion</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+{formatCurrency(250000)}</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Software License</p>
                        <p className="text-sm text-slate-600">Annual subscription renewal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-{formatCurrency(120000)}</p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Banknote className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Cash Transfer</p>
                        <p className="text-sm text-slate-600">Bank account to cash</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-600">{formatCurrency(500000)}</p>
                      <p className="text-xs text-slate-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              {/* Transaction Filters */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-slate-700">Transaction Type</Label>
                      <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                        <SelectTrigger className="w-48 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-slate-700">Account</Label>
                      <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger className="w-48 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Accounts</SelectItem>
                          {selectedTransactionType && getAccountsByType(selectedTransactionType).map((account) => (
                            <SelectItem key={account.value} value={account.value}>
                              {account.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-slate-700">Period</Label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-48 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current_month">Current Month</SelectItem>
                          <SelectItem value="last_month">Last Month</SelectItem>
                          <SelectItem value="current_quarter">Current Quarter</SelectItem>
                          <SelectItem value="last_quarter">Last Quarter</SelectItem>
                          <SelectItem value="current_year">Current Year</SelectItem>
                          <SelectItem value="last_year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
                  <Button onClick={() => setShowTransactionModal(true)} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Account</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Category</th>
                        <th className="text-right py-3 px-4 font-medium text-slate-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-600">2024-01-15</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Income
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">Consulting Services</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Sales Revenue</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Professional Services</td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-green-600">+{formatCurrency(250000)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-600">2024-01-14</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Expense
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">Software License Renewal</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Software Expense</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Technology</td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-red-600">-{formatCurrency(120000)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-600">2024-01-13</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Transfer
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">Bank to Cash Transfer</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Cash</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Internal Transfer</td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-slate-600">{formatCurrency(500000)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-600">
                        <td className="py-3 px-4 text-sm text-slate-600">2024-01-12</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Income
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">Training Workshop</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Training Revenue</td>
                        <td className="py-3 px-4 text-sm text-slate-600">Education Services</td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-green-600">+{formatCurrency(180000)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Accounting Tab */}
            <TabsContent value="accounting" className="space-y-6">
              {/* Period Selector */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-indigo-500" />
                    Financial Statements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6 items-center">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-slate-700">Accounting Period</Label>
                      <Select value={selectedAccountingPeriod} onValueChange={setSelectedAccountingPeriod}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current_month">Current Month</SelectItem>
                          <SelectItem value="last_month">Last Month</SelectItem>
                          <SelectItem value="current_quarter">Current Quarter</SelectItem>
                          <SelectItem value="last_quarter">Last Quarter</SelectItem>
                          <SelectItem value="current_year">Current Year</SelectItem>
                          <SelectItem value="last_year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-slate-700">Custom Period</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="date" 
                          className="w-32"
                          placeholder="Start Date"
                        />
                        <Input 
                          type="date" 
                          className="w-32"
                          placeholder="End Date"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-slate-700">Financial Statement Type</Label>
                      <Select value={selectedStatement} onValueChange={setSelectedStatement}>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Select statement type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income_statement">Income Statement</SelectItem>
                          <SelectItem value="balance_sheet">Balance Sheet</SelectItem>
                          <SelectItem value="cash_flow_statement">Cash Flow Statement</SelectItem>
                          <SelectItem value="retained_earnings">Statement of Retained Earnings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Statements - Conditionally Rendered */}
              {selectedStatement === "income_statement" && (
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Income Statement - {selectedAccountingPeriod.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Revenue</span>
                          <span className="font-medium">{formatCurrency(currentData.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Cost of Goods Sold</span>
                          <span className="font-medium text-red-600">-{formatCurrency(5200000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Gross Profit</span>
                          <span className="font-medium text-green-600">{formatCurrency(7300000)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                          <span className="text-slate-600">Operating Expenses</span>
                          <span className="font-medium text-red-600">-{formatCurrency(3000000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Operating Income</span>
                          <span className="font-medium text-green-600">{formatCurrency(4300000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Interest Expense</span>
                          <span className="font-medium text-red-600">-{formatCurrency(150000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Income Tax</span>
                          <span className="font-medium text-red-600">-{formatCurrency(860000)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Net Income</span>
                          <span className="text-green-600">{formatCurrency(currentData.profit)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedStatement === "balance_sheet" && (
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-blue-500" />
                      Balance Sheet - {selectedAccountingPeriod.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Assets */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Assets</h4>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Cash & Cash Equivalents</span>
                              <span className="font-medium">{formatCurrency(18500000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Accounts Receivable</span>
                              <span className="font-medium">{formatCurrency(currentData.accountsReceivable)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Inventory</span>
                              <span className="font-medium">{formatCurrency(2800000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Prepaid Expenses</span>
                              <span className="font-medium">{formatCurrency(450000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Total Current Assets</span>
                              <span className="text-green-600">{formatCurrency(25250000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Property, Plant & Equipment</span>
                              <span className="font-medium">{formatCurrency(8500000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Accumulated Depreciation</span>
                              <span className="font-medium text-red-600">-{formatCurrency(3200000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Total Assets</span>
                              <span className="text-green-600">{formatCurrency(30550000)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Liabilities & Equity */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Liabilities & Equity</h4>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Accounts Payable</span>
                              <span className="font-medium text-red-600">-{formatCurrency(currentData.accountsPayable)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Accrued Expenses</span>
                              <span className="font-medium text-red-600">-{formatCurrency(650000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Short-term Debt</span>
                              <span className="font-medium text-red-600">-{formatCurrency(2000000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Total Current Liabilities</span>
                              <span className="text-red-600">-{formatCurrency(4450000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Long-term Debt</span>
                              <span className="font-medium text-red-600">-{formatCurrency(5000000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Total Liabilities</span>
                              <span className="text-red-600">-{formatCurrency(9450000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Common Stock</span>
                              <span className="font-medium">{formatCurrency(1000000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Retained Earnings</span>
                              <span className="font-medium">{formatCurrency(16700000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Additional Paid-in Capital</span>
                              <span className="font-medium">{formatCurrency(3400000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Total Equity</span>
                              <span className="text-green-600">{formatCurrency(21100000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold text-lg">
                              <span>Total Liabilities & Equity</span>
                              <span className="text-slate-900">{formatCurrency(30550000)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedStatement === "cash_flow_statement" && (
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-500" />
                      Cash Flow Statement - {selectedAccountingPeriod.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <div className="space-y-4">
                        {/* Operating Activities */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Operating Activities</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Net Income</span>
                              <span className="font-medium">{formatCurrency(currentData.profit)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Depreciation & Amortization</span>
                              <span className="font-medium">{formatCurrency(450000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Changes in Accounts Receivable</span>
                              <span className="font-medium text-red-600">-{formatCurrency(300000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Changes in Accounts Payable</span>
                              <span className="font-medium">{formatCurrency(200000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Net Cash from Operating Activities</span>
                              <span className="text-green-600">{formatCurrency(4750000)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Investing Activities */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Investing Activities</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Purchase of Equipment</span>
                              <span className="font-medium text-red-600">-{formatCurrency(1200000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Investment in Securities</span>
                              <span className="font-medium text-red-600">-{formatCurrency(800000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Net Cash from Investing Activities</span>
                              <span className="text-red-600">-{formatCurrency(2000000)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Financing Activities */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Financing Activities</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Proceeds from Bank Loan</span>
                              <span className="font-medium">{formatCurrency(3000000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Repayment of Bank Loan</span>
                              <span className="font-medium text-red-600">-{formatCurrency(1000000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Dividends Paid</span>
                              <span className="font-medium text-red-600">-{formatCurrency(500000)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                              <span>Net Cash from Financing Activities</span>
                              <span className="text-green-600">{formatCurrency(1500000)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Net Change in Cash */}
                        <div className="border-t pt-4">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Net Change in Cash</span>
                            <span className="text-green-600">{formatCurrency(4250000)}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-slate-600">Cash at Beginning of Period</span>
                            <span className="font-medium">{formatCurrency(14250000)}</span>
                            </div>
                          <hr />
                          <div className="flex justify-between font-semibold">
                            <span>Cash at End of Period</span>
                            <span className="text-green-600">{formatCurrency(18500000)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedStatement === "retained_earnings" && (
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-500" />
                      Statement of Retained Earnings - {selectedAccountingPeriod.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Retained Earnings, Beginning of Period</span>
                          <span className="font-medium">{formatCurrency(12400000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Net Income for the Period</span>
                          <span className="font-medium text-green-600">{formatCurrency(currentData.profit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Dividends Declared</span>
                          <span className="font-medium text-red-600">-{formatCurrency(500000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Other Comprehensive Income</span>
                          <span className="font-medium">{formatCurrency(0)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Retained Earnings, End of Period</span>
                          <span className="text-green-600">{formatCurrency(16700000)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}


            </TabsContent>

            {/* Cash Flow Tab */}
            <TabsContent value="cashflow" className="space-y-6">
              <div className="grid gap-6">
                {/* Cash Flow Overview */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Net Cash Flow</p>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(4250000)}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <ArrowUpRight className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">+12.5%</span>
                          <span className="text-xs text-slate-500">vs last period</span>
                        </div>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Cash Inflow</p>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(8250000)}</p>
                        <p className="text-xs text-slate-500 mt-1">Operating activities</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <ArrowUpRight className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Cash Outflow</p>
                        <p className="text-2xl font-bold text-slate-900">-{formatCurrency(4000000)}</p>
                        <p className="text-xs text-slate-500 mt-1">Investing & financing</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-lg">
                        <ArrowDownRight className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Cash Balance</p>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(18500000)}</p>
                        <p className="text-xs text-slate-500 mt-1">End of period</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Banknote className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash Flow Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-slate-700">Period</Label>
                        <Select value={selectedAccountingPeriod} onValueChange={setSelectedAccountingPeriod}>
                          <SelectTrigger className="w-48 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current_month">Current Month</SelectItem>
                            <SelectItem value="last_month">Last Month</SelectItem>
                            <SelectItem value="current_quarter">Current Quarter</SelectItem>
                            <SelectItem value="last_quarter">Last Quarter</SelectItem>
                            <SelectItem value="current_year">Current Year</SelectItem>
                            <SelectItem value="last_year">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-slate-700">Cash Flow Type</Label>
                        <Select>
                          <SelectTrigger className="w-48 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="operating">Operating</SelectItem>
                            <SelectItem value="investing">Investing</SelectItem>
                            <SelectItem value="financing">Financing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-slate-700">View Mode</Label>
                        <Select>
                          <SelectTrigger className="w-48 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <SelectValue placeholder="Summary" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                            <SelectItem value="trends">Trends</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash Flow Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Line Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-slate-800">Cash Flow Trend (6 Months)</h3>
                    </div>
                    <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                      <div className="text-center">
                        <div className="w-64 h-48 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-48 h-32 bg-gradient-to-r from-orange-100 to-blue-100 rounded-lg flex items-center justify-center">
                              <div className="w-40 h-24 bg-gradient-to-r from-orange-200 to-blue-200 rounded flex items-center justify-center">
                                <div className="w-32 h-16 bg-gradient-to-r from-orange-300 to-blue-300 rounded flex items-center justify-center">
                                  <div className="w-24 h-8 bg-gradient-to-r from-orange-400 to-blue-400 rounded"></div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-2 font-medium">Cash Flow Trend</p>
                            <p className="text-xs text-slate-500">Monthly progression</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <PieChart className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-slate-800">Cash Flow Distribution</h3>
                    </div>
                    <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center relative">
                          <div className="absolute inset-2 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full"></div>
                          <div className="absolute inset-4 bg-white rounded-full"></div>
                          <div className="absolute inset-6 bg-gradient-to-br from-orange-300 to-blue-400 rounded-full"></div>
                          <div className="absolute inset-8 bg-white rounded-full"></div>
                          <div className="absolute inset-10 bg-gradient-to-br from-orange-200 to-blue-300 rounded-full"></div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-800">67%</div>
                            <div className="text-xs text-slate-600">Operating</div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                            <span className="text-slate-700">Operating: 67%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-slate-700">Investing: 20%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                            <span className="text-slate-700">Financing: 13%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accounts Receivable & Payable */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Accounts Receivable */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-slate-800">Accounts Receivable</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <div className="text-sm text-slate-600">Total Outstanding</div>
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(4000000)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Collection Rate</div>
                          <div className="text-xl font-bold text-green-600">97%</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-3 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">
                          <div>Current</div>
                          <div>30-60 days</div>
                          <div>60-90 days</div>
                          <div>Over 90 days</div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-xl font-bold text-green-600">{formatCurrency(2800000)}</div>
                            <div className="text-xs text-green-600 font-medium">70%</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="text-xl font-bold text-yellow-600">{formatCurrency(800000)}</div>
                            <div className="text-xs text-yellow-600 font-medium">20%</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-xl font-bold text-orange-600">{formatCurrency(300000)}</div>
                            <div className="text-xs text-orange-600 font-medium">7%</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-xl font-bold text-red-600">{formatCurrency(100000)}</div>
                            <div className="text-xs text-red-600 font-medium">3%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accounts Payable */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-slate-800">Accounts Payable</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <div className="text-sm text-slate-600">Total Outstanding</div>
                          <div className="text-2xl font-bold text-blue-600">{formatCurrency(3000000)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Payment Rate</div>
                          <div className="text-xl font-bold text-blue-600">95%</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-3 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">
                          <div>Current</div>
                          <div>30-60 days</div>
                          <div>60-90 days</div>
                          <div>Over 90 days</div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-xl font-bold text-green-600">{formatCurrency(1800000)}</div>
                            <div className="text-xs text-green-600 font-medium">60%</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="text-xl font-bold text-yellow-600">{formatCurrency(900000)}</div>
                            <div className="text-xs text-yellow-600 font-medium">30%</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-xl font-bold text-orange-600">{formatCurrency(200000)}</div>
                            <div className="text-xs text-orange-600 font-medium">7%</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-xl font-bold text-red-600">{formatCurrency(100000)}</div>
                            <div className="text-xs text-red-600 font-medium">3%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid gap-6">
                {/* Revenue Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(12500000)}</div>
                      <p className="text-xs text-slate-500 mt-1">+8.2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Average Deal Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(125000)}</div>
                      <p className="text-xs text-slate-500 mt-1">+5.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">+12.5%</div>
                      <p className="text-xs text-slate-500 mt-1">Year over year</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend (6 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                        <LineChart className="h-12 w-12 text-slate-400" />
                        <span className="ml-2 text-slate-500">Revenue trend chart will be rendered here</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                        <PieChart className="h-12 w-12 text-slate-400" />
                        <span className="ml-2 text-slate-500">Revenue source chart will be rendered here</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Forecast */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Next Month</h4>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(13500000)}</div>
                        <p className="text-xs text-slate-500">+8% projected</p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Next Quarter</h4>
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(38000000)}</div>
                        <p className="text-xs text-slate-500">+10% projected</p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Next Year</h4>
                        <div className="text-2xl font-bold text-purple-600">{formatCurrency(150000000)}</div>
                        <p className="text-xs text-slate-500">+15% projected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid gap-6">
                {/* Approval Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Review and approve reports from all departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900">0</div>
                        <p className="text-sm text-slate-600">Total Reports</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">0</div>
                        <p className="text-sm text-slate-600">Pending</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <p className="text-sm text-slate-600">Approved</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">0</div>
                        <p className="text-sm text-slate-600">Rejected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search reports...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">All</Button>
                      <Button variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Button>
                      <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Button>
                      <Button variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Department Reports */}
                <Card>
                  <CardHeader>
                    <CardTitle>Department Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-slate-500">
                      <p className="text-lg">No reports found</p>
                      <p className="text-sm">No reports have been submitted yet.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <div className="grid gap-6">
                {/* Approval Types */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Approval Types
                    </CardTitle>
                    <CardDescription>Manage and review financial approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Expense Approvals</h4>
                            <p className="text-sm text-slate-500">Review expense requests</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Eye className="h-4 w-4 mr-2" />
                          View Requests
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Invoice Approvals</h4>
                            <p className="text-sm text-slate-500">Approve vendor invoices</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Eye className="h-4 w-4 mr-2" />
                          View Requests
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Building className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Budget Approvals</h4>
                            <p className="text-sm text-slate-500">Review budget changes</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Eye className="h-4 w-4 mr-2" />
                          View Requests
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Target className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Purchase Approvals</h4>
                            <p className="text-sm text-slate-500">Review purchase orders</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Eye className="h-4 w-4 mr-2" />
                          View Requests
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Approval Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Approval Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Pending</h4>
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <p className="text-xs text-slate-500">Awaiting review</p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Approved</h4>
                        <div className="text-2xl font-bold text-green-600">45</div>
                        <p className="text-xs text-slate-500">This month</p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Rejected</h4>
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <p className="text-xs text-slate-500">This month</p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-slate-900 mb-2">Avg. Response</h4>
                        <div className="text-2xl font-bold text-blue-600">2.4h</div>
                        <p className="text-xs text-slate-500">Response time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Approvals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Approvals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Office Supplies - $450</p>
                            <p className="text-sm text-slate-500">Requested by John Doe</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">Approved</div>
                          <div className="text-xs text-slate-500">2 hours ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Software License - $2,500</p>
                            <p className="text-sm text-slate-500">Requested by Jane Smith</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-orange-600">Pending</div>
                          <div className="text-xs text-slate-500">1 day ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Travel Expenses - $1,200</p>
                            <p className="text-sm text-slate-500">Requested by Mike Johnson</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-red-600">Rejected</div>
                          <div className="text-xs text-slate-500">2 days ago</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Transaction Modal */}
      <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record New Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select 
                  value={transactionForm.type} 
                  onValueChange={(value) => {
                    setTransactionForm({...transactionForm, type: value, account: '', category: ''});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="transaction-date">Date</Label>
                <Input
                  id="transaction-date"
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transaction-account">Account</Label>
                <Select 
                  value={transactionForm.account} 
                  onValueChange={(value) => {
                    setTransactionForm({...transactionForm, account: value, category: ''});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAccountsByType(transactionForm.type).map((account) => (
                      <SelectItem key={account.value} value={account.value}>
                        {account.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="transaction-category">Category</Label>
                <Select 
                  value={transactionForm.category} 
                  onValueChange={(value) => setTransactionForm({...transactionForm, category: value})}
                  disabled={!transactionForm.account}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategoriesByAccount(transactionForm.account).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="transaction-description">Description</Label>
              <Textarea
                id="transaction-description"
                placeholder="Enter transaction description"
                value={transactionForm.description}
                onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transaction-amount">Amount</Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  placeholder="0.00"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="transaction-reference">Reference</Label>
                <Input
                  id="transaction-reference"
                  placeholder="Transaction reference"
                  value={transactionForm.reference}
                  onChange={(e) => setTransactionForm({...transactionForm, reference: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowTransactionModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle transaction submission
                console.log('Transaction submitted:', transactionForm);
                setShowTransactionModal(false);
                // Reset form
                setTransactionForm({
                  type: 'expense',
                  date: new Date().toISOString().split('T')[0],
                  account: '',
                  category: '',
                  description: '',
                  amount: '',
                  reference: '',
                  tags: []
                });
              }}>
                Record Transaction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
