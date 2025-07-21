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
} from './firebase-service'
import { initializeAuth } from './firebase-config'

export interface AIReportRequest {
  type: 'performance' | 'financial' | 'operational' | 'customer' | 'comprehensive' | 'logistics' | 'shipment' | 'route' | 'inventory'
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  departments?: string[]
  includeCharts: boolean
  includeRecommendations: boolean
  customFilters?: {
    entityId?: string
    entityType?: string
    [key: string]: any
  }
  focus?: 'efficiency' | 'cost' | 'quality' | 'growth' | 'optimization'
}

export interface AIReportResult {
  id: string
  title: string
  summary: string
  keyMetrics: {
    label: string
    value: string | number
    change?: number
    trend: 'up' | 'down' | 'stable'
    unit?: string
  }[]
  charts: {
    type: 'bar' | 'line' | 'pie' | 'area'
    title: string
    data: any
    config: any
  }[]
  insights: string[]
  recommendations: string[]
  generatedAt: Date
  period: string
  dataSources: string[]
  operationalAnalysis?: {
    bottlenecks: string[]
    opportunities: string[]
    risks: string[]
  }
}

class AIReportService {
  private static instance: AIReportService
  private isInitialized = false

  private constructor() {}

  static getInstance(): AIReportService {
    if (!AIReportService.instance) {
      AIReportService.instance = new AIReportService()
    }
    return AIReportService.instance
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      try {
        await initializeAuth()
        this.isInitialized = true
        console.log('AI Report Service initialized with authentication')
      } catch (error) {
        console.error('Failed to initialize AI Report Service with authentication:', error)
        // Continue without authentication - Firebase rules will handle security
        this.isInitialized = true
        console.log('AI Report Service initialized without authentication - using rules-based security')
      }
    }
  }

  async generateReport(request: AIReportRequest): Promise<AIReportResult> {
    try {
      // Ensure service is initialized
      await this.ensureInitialized()
      
      console.log('Starting AI report generation for type:', request.type)
      
      // Check if this is an individual entity report
      if (request.customFilters?.entityId && request.customFilters?.entityType) {
        console.log('Generating individual entity report for:', request.customFilters.entityType, request.customFilters.entityId)
        
        // Gather data for individual entity report
        const data = await this.gatherData(request)
        
        // Generate individual entity report based on type
        switch (request.customFilters.entityType) {
          case 'employee':
            return await this.generateIndividualEmployeeReport(data, request)
          case 'shipment':
            return await this.generateIndividualShipmentReport(data, request)
          case 'driver':
            return await this.generateIndividualDriverReport(data, request)
          case 'agent':
            return await this.generateIndividualAgentReport(data, request)
          case 'customer':
            return await this.generateIndividualCustomerReport(data, request)
          default:
            throw new Error(`Unknown entity type: ${request.customFilters.entityType}`)
        }
      }
      
      // Gather all relevant data based on report type
      const data = await this.gatherData(request)
      console.log('Data gathered successfully:', Object.keys(data))
      
      // Generate report based on type
      switch (request.type) {
        case 'performance':
          return await this.generatePerformanceReport(data, request)
        case 'financial':
          return await this.generateFinancialReport(data, request)
        case 'operational':
          return await this.generateOperationalReport(data, request)
        case 'customer':
          return await this.generateCustomerReport(data, request)
        case 'logistics':
          return await this.generateLogisticsReport(data, request)
        case 'shipment':
          return await this.generateShipmentReport(data, request)
        case 'route':
          return await this.generateRouteReport(data, request)
        case 'inventory':
          return await this.generateInventoryReport(data, request)
        case 'comprehensive':
          return await this.generateComprehensiveReport(data, request)
        default:
          throw new Error(`Unknown report type: ${request.type}`)
      }
    } catch (error) {
      console.error('Error generating AI report:', error)
      throw error
    }
  }

  private async gatherData(request: AIReportRequest): Promise<any> {
    try {
      // Ensure service is initialized
      await this.ensureInitialized()
      
      console.log('Gathering data for AI report...')
      
      const data: any = {}
      
      // Always gather basic data
      try {
        data.employees = await getAllEmployees()
        console.log('Employees data gathered:', data.employees.length)
      } catch (error) {
        console.error('Error gathering employees data:', error)
        data.employees = []
      }
      
      try {
        data.departments = await getAllDepartments()
        console.log('Departments data gathered:', data.departments.length)
      } catch (error) {
        console.error('Error gathering departments data:', error)
        data.departments = []
      }
      
      try {
        data.shipments = await getAllShipments()
        console.log('Shipments data gathered:', data.shipments.length)
      } catch (error) {
        console.error('Error gathering shipments data:', error)
        data.shipments = []
      }
      
      try {
        data.transactions = await getAllTransactions()
        console.log('Transactions data gathered:', data.transactions.length)
      } catch (error) {
        console.error('Error gathering transactions data:', error)
        data.transactions = []
      }
      
      try {
        data.customers = await getAllCustomers()
        console.log('Customers data gathered:', data.customers.length)
      } catch (error) {
        console.error('Error gathering customers data:', error)
        data.customers = []
      }
      
      try {
        data.agents = await getAllAgents()
        console.log('Agents data gathered:', data.agents.length)
      } catch (error) {
        console.error('Error gathering agents data:', error)
        data.agents = []
      }
      
      try {
        data.drivers = await getAllDrivers()
        console.log('Drivers data gathered:', data.drivers.length)
      } catch (error) {
        console.error('Error gathering drivers data:', error)
        data.drivers = []
      }
      
      try {
        data.inventoryItems = await getAllInventoryItems()
        console.log('Inventory items data gathered:', data.inventoryItems.length)
      } catch (error) {
        console.error('Error gathering inventory data:', error)
        data.inventoryItems = []
      }
      
      // Gather statistics based on report type
      switch (request.type) {
        case 'performance':
          try {
            data.employeeStats = await getEmployeeStats()
            console.log('Employee stats gathered')
          } catch (error) {
            console.error('Error gathering employee stats:', error)
            data.employeeStats = {}
          }
          break
          
        case 'financial':
          try {
            data.financialSummary = await getFinancialSummary()
            console.log('Financial summary gathered')
          } catch (error) {
            console.error('Error gathering financial summary:', error)
            data.financialSummary = {}
          }
          break
          
        case 'logistics':
        case 'shipment':
          try {
            data.shipmentStats = await getShipmentStats()
            console.log('Shipment stats gathered')
          } catch (error) {
            console.error('Error gathering shipment stats:', error)
            data.shipmentStats = {}
          }
          break
          
        case 'route':
          try {
            data.driverStats = await getDriverStats()
            console.log('Driver stats gathered')
          } catch (error) {
            console.error('Error gathering driver stats:', error)
            data.driverStats = {}
          }
          break
          
        case 'inventory':
          try {
            data.inventoryStats = await getInventoryStats()
            console.log('Inventory stats gathered')
          } catch (error) {
            console.error('Error gathering inventory stats:', error)
            data.inventoryStats = {}
          }
          break
      }
      
      console.log('Data gathering completed successfully')
      return data
    } catch (error) {
      console.error('Error in gatherData:', error)
      throw error
    }
  }

  private async generatePerformanceReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const employees = data.employees || []
    const departments = data.departments || []
    const employeeStats = data.employeeStats

    // Calculate key metrics
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((emp: any) => emp.status === 'active').length
    const avgPerformance = employeeStats?.averagePerformance || 0
    const topPerformers = employees
      .filter((emp: any) => emp.performanceScore > 80)
      .slice(0, 5)

    // Generate charts data
    const departmentPerformance = departments.map((dept: any) => ({
      name: dept.name,
      performance: dept.averagePerformance || 0,
      employeeCount: dept.employeeCount || 0
    }))

    const performanceDistribution = [
      { range: '90-100', count: employees.filter((e: any) => e.performanceScore >= 90).length },
      { range: '80-89', count: employees.filter((e: any) => e.performanceScore >= 80 && e.performanceScore < 90).length },
      { range: '70-79', count: employees.filter((e: any) => e.performanceScore >= 70 && e.performanceScore < 80).length },
      { range: '60-69', count: employees.filter((e: any) => e.performanceScore >= 60 && e.performanceScore < 70).length },
      { range: 'Below 60', count: employees.filter((e: any) => e.performanceScore < 60).length }
    ]

    return {
      id: `perf_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Performance Report`,
      summary: `Comprehensive analysis of employee performance across ${departments.length} departments. Overall performance average is ${avgPerformance.toFixed(1)}% with ${activeEmployees} active employees.`,
      keyMetrics: [
        { label: 'Total Employees', value: totalEmployees, trend: 'stable' },
        { label: 'Active Employees', value: activeEmployees, trend: 'stable' },
        { label: 'Average Performance', value: `${avgPerformance.toFixed(1)}%`, trend: avgPerformance > 75 ? 'up' : 'down' },
        { label: 'Top Performers', value: topPerformers.length, trend: 'up' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Department Performance',
          data: departmentPerformance,
          config: { xAxis: 'name', yAxis: 'performance' }
        },
        {
          type: 'pie',
          title: 'Performance Distribution',
          data: performanceDistribution,
          config: { valueKey: 'count', labelKey: 'range' }
        }
      ] : [],
      insights: [
        `${topPerformers.length} employees are performing above 80%`,
        `Average performance across all departments is ${avgPerformance.toFixed(1)}%`,
        `${((activeEmployees / totalEmployees) * 100).toFixed(1)}% of employees are currently active`
      ],
      recommendations: [
        'Implement performance improvement programs for employees scoring below 70%',
        'Recognize and reward top performers to maintain motivation',
        'Provide additional training for departments with below-average performance'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Employee Database', 'Performance Metrics', 'Department Records']
    }
  }

  private async generateFinancialReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const transactions = data.transactions || []
    const financialSummary = data.financialSummary

    // Calculate financial metrics
    const totalRevenue = financialSummary?.totalRevenue || 0
    const totalExpenses = financialSummary?.totalExpenses || 0
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    // Generate monthly revenue data
    const monthlyRevenue = this.calculateMonthlyRevenue(transactions)

    return {
      id: `fin_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Financial Report`,
      summary: `Financial performance analysis showing ${totalRevenue.toLocaleString()} in revenue with ${profitMargin.toFixed(1)}% profit margin.`,
      keyMetrics: [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, trend: 'up' },
        { label: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}`, trend: 'stable' },
        { label: 'Net Profit', value: `$${netProfit.toLocaleString()}`, trend: netProfit > 0 ? 'up' : 'down' },
        { label: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, trend: profitMargin > 15 ? 'up' : 'down' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'line',
          title: 'Monthly Revenue Trend',
          data: monthlyRevenue,
          config: { xAxis: 'month', yAxis: 'revenue' }
        },
        {
          type: 'pie',
          title: 'Revenue vs Expenses',
          data: [
            { label: 'Revenue', value: totalRevenue },
            { label: 'Expenses', value: totalExpenses }
          ],
          config: { valueKey: 'value', labelKey: 'label' }
        }
      ] : [],
      insights: [
        `Revenue growth is ${netProfit > 0 ? 'positive' : 'negative'} this period`,
        `Profit margin is ${profitMargin > 15 ? 'healthy' : 'needs improvement'}`,
        `Expense management is ${totalExpenses < totalRevenue * 0.8 ? 'efficient' : 'needs attention'}`
      ],
      recommendations: [
        profitMargin < 15 ? 'Focus on cost reduction strategies' : 'Maintain current profit margins',
        'Implement revenue optimization strategies',
        'Review and optimize operational expenses'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Financial Transactions', 'Revenue Records', 'Expense Reports']
    }
  }

  private async generateOperationalReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const shipments = data.shipments || []
    const shipmentStats = data.shipmentStats

    // Calculate operational metrics
    const totalShipments = shipments.length
    const completedShipments = shipments.filter((s: any) => s.status === 'delivered').length
    const onTimeDelivery = shipments.filter((s: any) => s.onTimeDelivery).length
    const deliveryRate = totalShipments > 0 ? (completedShipments / totalShipments) * 100 : 0
    const onTimeRate = totalShipments > 0 ? (onTimeDelivery / totalShipments) * 100 : 0

    // Generate operational charts
    const shipmentStatus = [
      { status: 'Delivered', count: completedShipments },
      { status: 'In Transit', count: shipments.filter((s: any) => s.status === 'in_transit').length },
      { status: 'Pending', count: shipments.filter((s: any) => s.status === 'pending').length }
    ]

    return {
      id: `op_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Operational Report`,
      summary: `Operational efficiency analysis showing ${deliveryRate.toFixed(1)}% delivery rate with ${onTimeRate.toFixed(1)}% on-time delivery performance.`,
      keyMetrics: [
        { label: 'Total Shipments', value: totalShipments, trend: 'up' },
        { label: 'Completed', value: completedShipments, trend: 'up' },
        { label: 'Delivery Rate', value: `${deliveryRate.toFixed(1)}%`, trend: deliveryRate > 90 ? 'up' : 'down' },
        { label: 'On-Time Rate', value: `${onTimeRate.toFixed(1)}%`, trend: onTimeRate > 85 ? 'up' : 'down' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'pie',
          title: 'Shipment Status Distribution',
          data: shipmentStatus,
          config: { valueKey: 'count', labelKey: 'status' }
        }
      ] : [],
      insights: [
        `${deliveryRate.toFixed(1)}% of shipments are successfully delivered`,
        `${onTimeRate.toFixed(1)}% of deliveries are completed on time`,
        `Operational efficiency is ${deliveryRate > 90 ? 'excellent' : deliveryRate > 75 ? 'good' : 'needs improvement'}`
      ],
      recommendations: [
        deliveryRate < 90 ? 'Improve delivery tracking and logistics' : 'Maintain high delivery standards',
        onTimeRate < 85 ? 'Optimize route planning and delivery scheduling' : 'Continue excellent on-time performance',
        'Implement real-time tracking for better customer experience'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Shipment Records', 'Delivery Tracking', 'Operational Metrics']
    }
  }

  private async generateCustomerReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const customers = data.customers || []
    const crmStats = data.crmStats

    // Calculate customer metrics
    const totalCustomers = customers.length
    const activeCustomers = customers.filter((c: any) => c.status === 'active').length
    const newCustomers = customers.filter((c: any) => {
      const customerDate = new Date(c.createdAt)
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      return customerDate > threeMonthsAgo
    }).length

    const customerSatisfaction = crmStats?.averageSatisfaction || 0

    return {
      id: `cust_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Customer Analysis Report`,
      summary: `Customer analysis showing ${totalCustomers} total customers with ${customerSatisfaction.toFixed(1)}% average satisfaction score.`,
      keyMetrics: [
        { label: 'Total Customers', value: totalCustomers, trend: 'up' },
        { label: 'Active Customers', value: activeCustomers, trend: 'up' },
        { label: 'New Customers', value: newCustomers, trend: 'up' },
        { label: 'Satisfaction Score', value: `${customerSatisfaction.toFixed(1)}%`, trend: customerSatisfaction > 80 ? 'up' : 'down' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Customer Growth',
          data: [
            { period: 'Q1', customers: Math.floor(totalCustomers * 0.2) },
            { period: 'Q2', customers: Math.floor(totalCustomers * 0.4) },
            { period: 'Q3', customers: Math.floor(totalCustomers * 0.7) },
            { period: 'Q4', customers: totalCustomers }
          ],
          config: { xAxis: 'period', yAxis: 'customers' }
        }
      ] : [],
      insights: [
        `${newCustomers} new customers acquired this period`,
        `Customer satisfaction is ${customerSatisfaction > 80 ? 'high' : 'needs improvement'}`,
        `${((activeCustomers / totalCustomers) * 100).toFixed(1)}% of customers are currently active`
      ],
      recommendations: [
        customerSatisfaction < 80 ? 'Implement customer feedback improvement programs' : 'Maintain high customer satisfaction',
        'Develop customer retention strategies',
        'Enhance customer support and communication channels'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Customer Database', 'CRM System', 'Feedback Records']
    }
  }

  private async generateLogisticsReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const shipments = data.shipments || []
    const drivers = data.drivers || []
    const agents = data.agents || []
    const shipmentStats = data.shipmentStats || {}
    const driverStats = data.driverStats || {}
    const agentStats = data.agentStats || {}

    console.log('Generating logistics report with:', {
      shipments: shipments.length,
      drivers: drivers.length,
      agents: agents.length
    })

    // Calculate real logistics metrics
    const totalShipments = shipments.length
    const completedShipments = shipments.filter((s: any) => s.status === 'delivered').length
    const inTransitShipments = shipments.filter((s: any) => s.status === 'in-transit').length
    const pendingShipments = shipments.filter((s: any) => s.status === 'pending').length
    const cancelledShipments = shipments.filter((s: any) => s.status === 'cancelled').length
    
    const onTimeDeliveryRate = totalShipments > 0 ? (completedShipments / totalShipments) * 100 : 0
    const averageDeliveryTime = this.calculateAverageDeliveryTime(shipments)
    const totalRevenue = shipments.reduce((sum: number, s: any) => sum + (s.revenue || 0), 0)
    const averageShipmentValue = totalShipments > 0 ? totalRevenue / totalShipments : 0

    // Calculate driver metrics
    const activeDrivers = drivers.filter((d: any) => d.status === 'available').length
    const busyDrivers = drivers.filter((d: any) => d.status === 'busy').length
    const averageDriverRating = drivers.length > 0 ? 
      drivers.reduce((sum: number, d: any) => sum + (d.rating || 0), 0) / drivers.length : 0

    // Calculate agent metrics
    const activeAgents = agents.filter((a: any) => a.status === 'active').length
    const averageAgentRating = agents.length > 0 ? 
      agents.reduce((sum: number, a: any) => sum + (a.rating || 0), 0) / agents.length : 0

    // Analyze bottlenecks and opportunities
    const bottlenecks = this.identifyBottlenecks(shipments, drivers)
    const opportunities = this.identifyOpportunities(shipments, drivers, agents)
    const risks = this.identifyRisks(shipments, drivers)

    return {
      id: `logistics_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Logistics Operations Report`,
      summary: `Comprehensive analysis of logistics operations with ${totalShipments} total shipments. On-time delivery rate is ${onTimeDeliveryRate.toFixed(1)}% with average delivery time of ${averageDeliveryTime.toFixed(1)} hours.`,
      keyMetrics: [
        { label: 'Total Shipments', value: totalShipments, trend: 'stable', unit: 'shipments' },
        { label: 'On-Time Delivery Rate', value: `${onTimeDeliveryRate.toFixed(1)}%`, trend: onTimeDeliveryRate > 90 ? 'up' : 'down' },
        { label: 'Average Delivery Time', value: `${averageDeliveryTime.toFixed(1)}h`, trend: averageDeliveryTime < 24 ? 'up' : 'down', unit: 'hours' },
        { label: 'Average Shipment Value', value: `$${averageShipmentValue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Active Drivers', value: activeDrivers, trend: 'stable', unit: 'drivers' },
        { label: 'Active Agents', value: activeAgents, trend: 'stable', unit: 'agents' },
        { label: 'Pending Shipments', value: pendingShipments, trend: pendingShipments < 5 ? 'up' : 'down', unit: 'shipments' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'pie',
          title: 'Shipment Status Distribution',
          data: [
            { status: 'Delivered', count: completedShipments },
            { status: 'In Transit', count: inTransitShipments },
            { status: 'Pending', count: pendingShipments },
            { status: 'Cancelled', count: cancelledShipments }
          ],
          config: { valueKey: 'count', labelKey: 'status' }
        },
        {
          type: 'bar',
          title: 'Driver Performance',
          data: this.getDriverPerformanceData(drivers, shipments),
          config: { xAxis: 'driver', yAxis: 'deliveryRate' }
        }
      ] : [],
      insights: [
        `${onTimeDeliveryRate.toFixed(1)}% of shipments are delivered on time`,
        `Average delivery time is ${averageDeliveryTime.toFixed(1)} hours`,
        `${pendingShipments} shipments are currently pending`,
        `Total logistics revenue is $${totalRevenue.toFixed(2)}`,
        `Average driver rating is ${averageDriverRating.toFixed(1)}/5`,
        `Average agent rating is ${averageAgentRating.toFixed(1)}/5`
      ],
      recommendations: [
        'Implement real-time tracking for better delivery visibility',
        'Optimize routes to reduce average delivery time',
        'Provide additional training for drivers with low performance',
        'Consider expanding driver fleet during peak periods',
        'Improve agent performance through training programs'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Shipment Database', 'Driver Records', 'Agent Records', 'Performance Metrics'],
      operationalAnalysis: {
        bottlenecks,
        opportunities,
        risks
      }
    }
  }

  private async generateShipmentReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const shipments = data.shipments || []
    const shipmentStats = data.shipmentStats || {}

    console.log('Generating shipment report with:', shipments.length, 'shipments')

    // Calculate real shipment-specific metrics
    const totalShipments = shipments.length
    const completedShipments = shipments.filter((s: any) => s.status === 'delivered').length
    const pendingShipments = shipments.filter((s: any) => s.status === 'pending').length
    const inTransitShipments = shipments.filter((s: any) => s.status === 'in-transit').length
    const cancelledShipments = shipments.filter((s: any) => s.status === 'cancelled').length

    const averageShipmentValue = shipments.length > 0 ? 
      shipments.reduce((sum: number, s: any) => sum + (s.revenue || 0), 0) / shipments.length : 0

    const serviceTypeBreakdown = this.getServiceTypeBreakdown(shipments)
    const routeEfficiency = this.calculateRouteEfficiency(shipments)

    // Calculate revenue metrics
    const totalRevenue = shipments.reduce((sum: number, s: any) => sum + (s.revenue || 0), 0)
    const averageDeliveryTime = this.calculateAverageDeliveryTime(shipments)

    return {
      id: `shipment_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Shipment Analysis Report`,
      summary: `Detailed shipment analysis covering ${totalShipments} shipments with ${completedShipments} completed deliveries. Average shipment value is $${averageShipmentValue.toFixed(2)}.`,
      keyMetrics: [
        { label: 'Total Shipments', value: totalShipments, trend: 'stable', unit: 'shipments' },
        { label: 'Completion Rate', value: `${((completedShipments / totalShipments) * 100).toFixed(1)}%`, trend: 'up', unit: '%' },
        { label: 'Average Shipment Value', value: `$${averageShipmentValue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Pending Shipments', value: pendingShipments, trend: pendingShipments < 10 ? 'up' : 'down', unit: 'shipments' },
        { label: 'In Transit', value: inTransitShipments, trend: 'stable', unit: 'shipments' },
        { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Average Delivery Time', value: `${averageDeliveryTime.toFixed(1)}h`, trend: averageDeliveryTime < 24 ? 'up' : 'down', unit: 'hours' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'pie',
          title: 'Service Type Distribution',
          data: serviceTypeBreakdown,
          config: { valueKey: 'count', labelKey: 'serviceType' }
        },
        {
          type: 'bar',
          title: 'Shipment Status',
          data: [
            { status: 'Delivered', count: completedShipments },
            { status: 'In Transit', count: inTransitShipments },
            { status: 'Pending', count: pendingShipments },
            { status: 'Cancelled', count: cancelledShipments }
          ],
          config: { xAxis: 'status', yAxis: 'count' }
        }
      ] : [],
      insights: [
        `${((completedShipments / totalShipments) * 100).toFixed(1)}% of shipments are successfully completed`,
        `Average shipment value is $${averageShipmentValue.toFixed(2)}`,
        `${pendingShipments} shipments are currently pending processing`,
        `Total revenue from shipments is $${totalRevenue.toFixed(2)}`,
        `Average delivery time is ${averageDeliveryTime.toFixed(1)} hours`
      ],
      recommendations: [
        'Implement automated status updates for better tracking',
        'Optimize pricing strategy based on shipment value analysis',
        'Streamline processing for pending shipments',
        'Improve delivery time through route optimization',
        'Focus on high-value shipment categories'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Shipment Database', 'Service Records', 'Route Data']
    }
  }

  private async generateRouteReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const shipments = data.shipments || []
    const drivers = data.drivers || []

    console.log('Generating route report with:', {
      shipments: shipments.length,
      drivers: drivers.length
    })

    // Calculate real route-specific metrics
    const totalRoutes = this.getUniqueRoutes(shipments).length
    const averageRouteDistance = this.calculateAverageRouteDistance(shipments)
    const fuelEfficiency = this.calculateFuelEfficiency(shipments)
    const routeOptimizationScore = this.calculateRouteOptimizationScore(shipments)

    const driverEfficiency = this.getDriverEfficiencyData(drivers, shipments)
    const routePerformance = this.getRoutePerformanceData(shipments)

    // Calculate driver metrics
    const availableDrivers = drivers.filter((d: any) => d.status === 'available').length
    const busyDrivers = drivers.filter((d: any) => d.status === 'busy').length
    const averageDriverRating = drivers.length > 0 ? 
      drivers.reduce((sum: number, d: any) => sum + (d.rating || 0), 0) / drivers.length : 0

    return {
      id: `route_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Route Optimization Report`,
      summary: `Route analysis covering ${totalRoutes} unique routes with average distance of ${averageRouteDistance.toFixed(1)} km. Fuel efficiency is ${fuelEfficiency.toFixed(1)}% with route optimization score of ${routeOptimizationScore.toFixed(1)}%.`,
      keyMetrics: [
        { label: 'Total Routes', value: totalRoutes, trend: 'stable', unit: 'routes' },
        { label: 'Average Route Distance', value: `${averageRouteDistance.toFixed(1)}km`, trend: 'stable', unit: 'km' },
        { label: 'Fuel Efficiency', value: `${fuelEfficiency.toFixed(1)}%`, trend: fuelEfficiency > 85 ? 'up' : 'down', unit: '%' },
        { label: 'Route Optimization Score', value: `${routeOptimizationScore.toFixed(1)}%`, trend: routeOptimizationScore > 80 ? 'up' : 'down', unit: '%' },
        { label: 'Available Drivers', value: availableDrivers, trend: 'stable', unit: 'drivers' },
        { label: 'Average Driver Rating', value: `${averageDriverRating.toFixed(1)}/5`, trend: averageDriverRating > 4 ? 'up' : 'down', unit: 'rating' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Driver Efficiency by Route',
          data: driverEfficiency,
          config: { xAxis: 'driver', yAxis: 'efficiency' }
        },
        {
          type: 'line',
          title: 'Route Performance Trends',
          data: routePerformance,
          config: { xAxis: 'route', yAxis: 'performance' }
        }
      ] : [],
      insights: [
        `Average route distance is ${averageRouteDistance.toFixed(1)} km`,
        `Fuel efficiency across all routes is ${fuelEfficiency.toFixed(1)}%`,
        `Route optimization score is ${routeOptimizationScore.toFixed(1)}%`,
        `${totalRoutes} unique routes are being utilized`,
        `Average driver rating is ${averageDriverRating.toFixed(1)}/5`,
        `${availableDrivers} drivers are currently available`
      ],
      recommendations: [
        'Implement dynamic route optimization based on real-time traffic',
        'Provide fuel efficiency training for drivers',
        'Consider route consolidation for better efficiency',
        'Invest in GPS tracking for better route monitoring',
        'Optimize driver assignments based on performance ratings'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Route Database', 'Driver Records', 'GPS Tracking Data']
    }
  }

  private async generateInventoryReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const inventoryItems = data.inventoryItems || []
    const shipments = data.shipments || []
    const inventoryStats = data.inventoryStats || {}

    console.log('Generating inventory report with:', {
      inventoryItems: inventoryItems.length,
      shipments: shipments.length
    })

    // Calculate real inventory-related metrics
    const totalItems = inventoryItems.length
    const lowStockItems = inventoryItems.filter((item: any) => item.status === 'low-stock').length
    const outOfStockItems = inventoryItems.filter((item: any) => item.status === 'out-of-stock').length
    const inStockItems = inventoryItems.filter((item: any) => item.status === 'in-stock').length

    const totalValue = inventoryItems.reduce((sum: number, item: any) => sum + (item.totalValue || 0), 0)
    const averageItemValue = totalItems > 0 ? totalValue / totalItems : 0

    const inventoryTurnover = this.calculateInventoryTurnover(shipments)
    const stockLevels = this.getStockLevels(shipments)
    const demandForecast = this.generateDemandForecast(shipments)

    // Calculate category breakdown
    const categoryBreakdown = this.getCategoryBreakdown(inventoryItems)

    return {
      id: `inventory_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Inventory Management Report`,
      summary: `Inventory analysis covering ${totalItems} total items with total value of $${totalValue.toFixed(2)}. Current stock levels show ${lowStockItems} low-stock items and ${outOfStockItems} out-of-stock items.`,
      keyMetrics: [
        { label: 'Total Items', value: totalItems, trend: 'stable', unit: 'items' },
        { label: 'Total Value', value: `$${totalValue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Average Item Value', value: `$${averageItemValue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Low Stock Items', value: lowStockItems, trend: lowStockItems < 5 ? 'up' : 'down', unit: 'items' },
        { label: 'Out of Stock Items', value: outOfStockItems, trend: outOfStockItems === 0 ? 'up' : 'down', unit: 'items' },
        { label: 'In Stock Items', value: inStockItems, trend: 'stable', unit: 'items' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Stock Level by Category',
          data: categoryBreakdown,
          config: { xAxis: 'category', yAxis: 'value' }
        },
        {
          type: 'pie',
          title: 'Inventory Status Distribution',
          data: [
            { status: 'In Stock', count: inStockItems },
            { status: 'Low Stock', count: lowStockItems },
            { status: 'Out of Stock', count: outOfStockItems }
          ],
          config: { valueKey: 'count', labelKey: 'status' }
        }
      ] : [],
      insights: [
        `Total inventory value is $${totalValue.toFixed(2)}`,
        `${lowStockItems} items are running low on stock`,
        `${outOfStockItems} items are completely out of stock`,
        `Average item value is $${averageItemValue.toFixed(2)}`,
        `${inStockItems} items are currently in stock`,
        `Inventory turnover rate is ${inventoryTurnover.toFixed(2)}`
      ],
      recommendations: [
        'Implement just-in-time inventory management',
        'Reorder low-stock items immediately',
        'Optimize stock levels based on demand forecasting',
        'Improve inventory tracking with barcode systems',
        'Consider automated reordering for high-demand items',
        'Review pricing strategy for high-value items'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Inventory Database', 'Shipment Records', 'Demand Analytics']
    }
  }

  private async generateComprehensiveReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    // Combine all report types into one comprehensive report
    const performanceReport = await this.generatePerformanceReport(data, request)
    const financialReport = await this.generateFinancialReport(data, request)
    const operationalReport = await this.generateOperationalReport(data, request)
    const customerReport = await this.generateCustomerReport(data, request)
    const logisticsReport = await this.generateLogisticsReport(data, request)
    const shipmentReport = await this.generateShipmentReport(data, request)
    const routeReport = await this.generateRouteReport(data, request)
    const inventoryReport = await this.generateInventoryReport(data, request)

    // Combine key metrics
    const combinedMetrics = [
      ...performanceReport.keyMetrics.slice(0, 2),
      ...financialReport.keyMetrics.slice(0, 2),
      ...operationalReport.keyMetrics.slice(0, 2),
      ...customerReport.keyMetrics.slice(0, 2),
      ...logisticsReport.keyMetrics.slice(0, 2),
      ...shipmentReport.keyMetrics.slice(0, 2),
      ...routeReport.keyMetrics.slice(0, 2),
      ...inventoryReport.keyMetrics.slice(0, 2)
    ]

    // Combine insights and recommendations
    const combinedInsights = [
      ...performanceReport.insights.slice(0, 1),
      ...financialReport.insights.slice(0, 1),
      ...operationalReport.insights.slice(0, 1),
      ...customerReport.insights.slice(0, 1),
      ...logisticsReport.insights.slice(0, 1),
      ...shipmentReport.insights.slice(0, 1),
      ...routeReport.insights.slice(0, 1),
      ...inventoryReport.insights.slice(0, 1)
    ]

    const combinedRecommendations = [
      ...performanceReport.recommendations.slice(0, 1),
      ...financialReport.recommendations.slice(0, 1),
      ...operationalReport.recommendations.slice(0, 1),
      ...customerReport.recommendations.slice(0, 1),
      ...logisticsReport.recommendations.slice(0, 1),
      ...shipmentReport.recommendations.slice(0, 1),
      ...routeReport.recommendations.slice(0, 1),
      ...inventoryReport.recommendations.slice(0, 1)
    ]

    return {
      id: `comp_${Date.now()}`,
      title: `${request.period.charAt(0).toUpperCase() + request.period.slice(1)} Comprehensive Business Report`,
      summary: `Complete business analysis covering performance, financial, operational, and customer metrics. This comprehensive report provides a complete overview of business health and performance.`,
      keyMetrics: combinedMetrics,
      charts: request.includeCharts ? [
        ...performanceReport.charts.slice(0, 1),
        ...financialReport.charts.slice(0, 1),
        ...operationalReport.charts.slice(0, 1),
        ...customerReport.charts.slice(0, 1),
        ...logisticsReport.charts.slice(0, 1),
        ...shipmentReport.charts.slice(0, 1),
        ...routeReport.charts.slice(0, 1),
        ...inventoryReport.charts.slice(0, 1)
      ] : [],
      insights: combinedInsights,
      recommendations: combinedRecommendations,
      generatedAt: new Date(),
      period: request.period,
      dataSources: [
        'Employee Database',
        'Financial Records',
        'Shipment Tracking',
        'Customer CRM',
        'Performance Metrics',
        'Inventory Database',
        'Route Database',
        'Driver Records',
        'GPS Tracking Data'
      ]
    }
  }

  private async generateIndividualEmployeeReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const employees = data.employees || []
    const employeeStats = data.employeeStats || {}
    const entityId = request.customFilters?.entityId
    
    if (!entityId) {
      throw new Error('Employee ID is required for individual employee report')
    }
    
    const employee = employees.find((emp: any) => emp.id === entityId)
    if (!employee) {
      throw new Error(`Employee with ID ${entityId} not found`)
    }
    
    console.log('Generating individual employee report for:', employee.name)
    
    // Calculate employee-specific metrics
    const performance = employee.performance || 0
    const attendance = employee.attendance || 0
    const salary = employee.salary || 0
    const joinDate = new Date(employee.joinDate)
    const monthsEmployed = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    
    // Calculate trends (mock data for now)
    const performanceTrend = performance > 80 ? 'up' : performance > 60 ? 'stable' : 'down'
    const attendanceTrend = attendance > 90 ? 'up' : attendance > 75 ? 'stable' : 'down'
    
    return {
      id: `employee_${entityId}_${Date.now()}`,
      title: `${employee.name} - Performance Report`,
      summary: `Individual performance analysis for ${employee.name}. Current performance score is ${performance}% with ${attendance}% attendance rate.`,
      keyMetrics: [
        { label: 'Performance Score', value: `${performance}%`, trend: performanceTrend, unit: '%' },
        { label: 'Attendance Rate', value: `${attendance}%`, trend: attendanceTrend, unit: '%' },
        { label: 'Salary', value: `$${salary.toLocaleString()}`, trend: 'stable', unit: 'USD' },
        { label: 'Months Employed', value: monthsEmployed, trend: 'stable', unit: 'months' },
        { label: 'Department', value: employee.department, trend: 'stable' },
        { label: 'Position', value: employee.position, trend: 'stable' },
        { label: 'Status', value: employee.status, trend: 'stable' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Performance Metrics',
          data: [
            { metric: 'Performance', value: performance },
            { metric: 'Attendance', value: attendance }
          ],
          config: { xAxis: 'metric', yAxis: 'value' }
        }
      ] : [],
      insights: [
        `${employee.name} has a performance score of ${performance}%`,
        `Attendance rate is ${attendance}%`,
        `Employee has been with the company for ${monthsEmployed} months`,
        `Current position: ${employee.position} in ${employee.department}`,
        `Employee status: ${employee.status}`
      ],
      recommendations: [
        performance < 70 ? 'Consider additional training to improve performance' : 'Maintain current performance levels',
        attendance < 80 ? 'Address attendance issues with HR' : 'Good attendance record',
        'Review career development opportunities',
        'Consider performance-based incentives',
        'Regular feedback sessions recommended'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Employee Database', 'Performance Records', 'Attendance System']
    }
  }

  private async generateIndividualShipmentReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const shipments = data.shipments || []
    const entityId = request.customFilters?.entityId
    
    if (!entityId) {
      throw new Error('Shipment ID is required for individual shipment report')
    }
    
    const shipment = shipments.find((s: any) => s.id === entityId)
    if (!shipment) {
      throw new Error(`Shipment with ID ${entityId} not found`)
    }
    
    console.log('Generating individual shipment report for:', shipment.trackingNumber)
    
    // Calculate shipment-specific metrics
    const revenue = shipment.revenue || 0
    const status = shipment.status
    const serviceType = shipment.serviceType
    const createdAt = shipment.createdAt ? new Date(shipment.createdAt.seconds * 1000) : new Date()
    const estimatedDelivery = shipment.estimatedDelivery
    const actualDelivery = shipment.actualDelivery
    
    // Calculate delivery time if delivered
    let deliveryTime = 0
    if (actualDelivery && createdAt) {
      const actualDate = new Date(actualDelivery)
      deliveryTime = (actualDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60) // hours
    }
    
    return {
      id: `shipment_${entityId}_${Date.now()}`,
      title: `Shipment ${shipment.trackingNumber} - Analysis`,
      summary: `Detailed analysis of shipment ${shipment.trackingNumber}. Current status: ${status} with revenue of $${revenue.toFixed(2)}.`,
      keyMetrics: [
        { label: 'Tracking Number', value: shipment.trackingNumber, trend: 'stable' },
        { label: 'Status', value: status, trend: 'stable' },
        { label: 'Service Type', value: serviceType, trend: 'stable' },
        { label: 'Revenue', value: `$${revenue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Customer', value: shipment.customerName, trend: 'stable' },
        { label: 'Pickup Location', value: shipment.pickupLocation, trend: 'stable' },
        { label: 'Destination', value: shipment.destination, trend: 'stable' },
        { label: 'Delivery Time', value: `${deliveryTime.toFixed(1)}h`, trend: deliveryTime < 24 ? 'up' : 'down', unit: 'hours' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'pie',
          title: 'Shipment Status',
          data: [
            { status: 'Delivered', count: status === 'delivered' ? 1 : 0 },
            { status: 'In Transit', count: status === 'in-transit' ? 1 : 0 },
            { status: 'Pending', count: status === 'pending' ? 1 : 0 },
            { status: 'Cancelled', count: status === 'cancelled' ? 1 : 0 }
          ],
          config: { valueKey: 'count', labelKey: 'status' }
        }
      ] : [],
      insights: [
        `Shipment ${shipment.trackingNumber} is currently ${status}`,
        `Revenue generated: $${revenue.toFixed(2)}`,
        `Service type: ${serviceType}`,
        `Customer: ${shipment.customerName}`,
        `Route: ${shipment.pickupLocation} → ${shipment.destination}`,
        deliveryTime > 0 ? `Delivery completed in ${deliveryTime.toFixed(1)} hours` : 'Delivery time not available'
      ],
      recommendations: [
        status === 'pending' ? 'Process shipment for pickup' : 'Monitor shipment progress',
        'Ensure customer communication about delivery status',
        'Track delivery performance for future optimization',
        'Review pricing strategy for similar shipments',
        'Consider route optimization for future deliveries'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Shipment Database', 'Tracking System', 'Customer Records']
    }
  }

  private async generateIndividualDriverReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const drivers = data.drivers || []
    const shipments = data.shipments || []
    const entityId = request.customFilters?.entityId
    
    if (!entityId) {
      throw new Error('Driver ID is required for individual driver report')
    }
    
    const driver = drivers.find((d: any) => d.id === entityId)
    if (!driver) {
      throw new Error(`Driver with ID ${entityId} not found`)
    }
    
    console.log('Generating individual driver report for:', driver.name)
    
    // Calculate driver-specific metrics
    const driverShipments = shipments.filter((s: any) => s.assignedDriver === entityId)
    const completedShipments = driverShipments.filter((s: any) => s.status === 'delivered').length
    const totalShipments = driverShipments.length
    const deliveryRate = totalShipments > 0 ? (completedShipments / totalShipments) * 100 : 0
    const rating = driver.rating || 0
    const totalEarnings = driver.totalEarnings || 0
    const totalDeliveries = driver.totalDeliveries || 0
    
    return {
      id: `driver_${entityId}_${Date.now()}`,
      title: `${driver.name} - Driver Report`,
      summary: `Performance analysis for driver ${driver.name}. Delivery rate: ${deliveryRate.toFixed(1)}% with rating of ${rating}/5.`,
      keyMetrics: [
        { label: 'Delivery Rate', value: `${deliveryRate.toFixed(1)}%`, trend: deliveryRate > 90 ? 'up' : deliveryRate > 70 ? 'stable' : 'down', unit: '%' },
        { label: 'Rating', value: `${rating}/5`, trend: rating > 4 ? 'up' : rating > 3 ? 'stable' : 'down', unit: 'stars' },
        { label: 'Total Deliveries', value: totalDeliveries, trend: 'stable', unit: 'deliveries' },
        { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Status', value: driver.status, trend: 'stable' },
        { label: 'Vehicle Type', value: driver.vehicleType, trend: 'stable' },
        { label: 'Region', value: driver.region, trend: 'stable' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Performance Metrics',
          data: [
            { metric: 'Delivery Rate', value: deliveryRate },
            { metric: 'Rating', value: rating * 20 } // Convert to percentage
          ],
          config: { xAxis: 'metric', yAxis: 'value' }
        }
      ] : [],
      insights: [
        `${driver.name} has a delivery rate of ${deliveryRate.toFixed(1)}%`,
        `Driver rating is ${rating}/5 stars`,
        `Completed ${totalDeliveries} total deliveries`,
        `Total earnings: $${totalEarnings.toFixed(2)}`,
        `Current status: ${driver.status}`,
        `Operating in ${driver.region} with ${driver.vehicleType}`
      ],
      recommendations: [
        deliveryRate < 80 ? 'Provide additional training to improve delivery rate' : 'Maintain excellent delivery performance',
        rating < 4 ? 'Address customer feedback to improve rating' : 'Excellent customer satisfaction',
        'Consider performance-based incentives',
        'Review route optimization opportunities',
        'Regular performance reviews recommended'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Driver Records', 'Shipment Database', 'Customer Feedback']
    }
  }

  private async generateIndividualAgentReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const agents = data.agents || []
    const entityId = request.customFilters?.entityId
    
    if (!entityId) {
      throw new Error('Agent ID is required for individual agent report')
    }
    
    const agent = agents.find((a: any) => a.id === entityId)
    if (!agent) {
      throw new Error(`Agent with ID ${entityId} not found`)
    }
    
    console.log('Generating individual agent report for:', agent.name)
    
    // Calculate agent-specific metrics
    const rating = agent.rating || 0
    const totalDeliveries = agent.totalDeliveries || 0
    const totalEarnings = agent.totalEarnings || 0
    const commission = agent.commission || 0
    
    return {
      id: `agent_${entityId}_${Date.now()}`,
      title: `${agent.name} - Agent Report`,
      summary: `Performance analysis for agent ${agent.name}. Rating: ${rating}/5 with ${totalDeliveries} total deliveries.`,
      keyMetrics: [
        { label: 'Rating', value: `${rating}/5`, trend: rating > 4 ? 'up' : rating > 3 ? 'stable' : 'down', unit: 'stars' },
        { label: 'Total Deliveries', value: totalDeliveries, trend: 'stable', unit: 'deliveries' },
        { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Commission Rate', value: `${commission}%`, trend: 'stable', unit: '%' },
        { label: 'Status', value: agent.status, trend: 'stable' },
        { label: 'Region', value: agent.region, trend: 'stable' },
        { label: 'District', value: agent.district, trend: 'stable' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Performance Metrics',
          data: [
            { metric: 'Rating', value: rating * 20 }, // Convert to percentage
            { metric: 'Commission', value: commission }
          ],
          config: { xAxis: 'metric', yAxis: 'value' }
        }
      ] : [],
      insights: [
        `${agent.name} has a rating of ${rating}/5 stars`,
        `Completed ${totalDeliveries} total deliveries`,
        `Total earnings: $${totalEarnings.toFixed(2)}`,
        `Commission rate: ${commission}%`,
        `Operating in ${agent.district}, ${agent.region}`,
        `Current status: ${agent.status}`
      ],
      recommendations: [
        rating < 4 ? 'Work on improving customer satisfaction' : 'Excellent customer service performance',
        'Consider performance-based commission increases',
        'Expand service area for more opportunities',
        'Regular training on customer service skills',
        'Review commission structure for motivation'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Agent Records', 'Customer Feedback', 'Commission System']
    }
  }

  private async generateIndividualCustomerReport(data: any, request: AIReportRequest): Promise<AIReportResult> {
    const customers = data.customers || []
    const shipments = data.shipments || []
    const entityId = request.customFilters?.entityId
    
    if (!entityId) {
      throw new Error('Customer ID is required for individual customer report')
    }
    
    const customer = customers.find((c: any) => c.id === entityId)
    if (!customer) {
      throw new Error(`Customer with ID ${entityId} not found`)
    }
    
    console.log('Generating individual customer report for:', customer.name)
    
    // Calculate customer-specific metrics
    const customerShipments = shipments.filter((s: any) => s.customerEmail === customer.email)
    const totalShipments = customerShipments.length
    const totalRevenue = customerShipments.reduce((sum: number, s: any) => sum + (s.revenue || 0), 0)
    const averageShipmentValue = totalShipments > 0 ? totalRevenue / totalShipments : 0
    const status = customer.status
    const lastInteraction = customer.lastInteraction
    
    return {
      id: `customer_${entityId}_${Date.now()}`,
      title: `${customer.name} - Customer Report`,
      summary: `Customer analysis for ${customer.name}. Total shipments: ${totalShipments} with revenue of $${totalRevenue.toFixed(2)}.`,
      keyMetrics: [
        { label: 'Total Shipments', value: totalShipments, trend: 'stable', unit: 'shipments' },
        { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Average Shipment Value', value: `$${averageShipmentValue.toFixed(2)}`, trend: 'stable', unit: 'USD' },
        { label: 'Status', value: status, trend: 'stable' },
        { label: 'Location', value: customer.location, trend: 'stable' },
        { label: 'Company', value: customer.company || 'N/A', trend: 'stable' },
        { label: 'Last Interaction', value: lastInteraction, trend: 'stable' }
      ],
      charts: request.includeCharts ? [
        {
          type: 'bar',
          title: 'Customer Activity',
          data: [
            { metric: 'Total Shipments', value: totalShipments },
            { metric: 'Total Revenue', value: totalRevenue }
          ],
          config: { xAxis: 'metric', yAxis: 'value' }
        }
      ] : [],
      insights: [
        `${customer.name} has made ${totalShipments} shipments`,
        `Total revenue generated: $${totalRevenue.toFixed(2)}`,
        `Average shipment value: $${averageShipmentValue.toFixed(2)}`,
        `Customer status: ${status}`,
        `Located in ${customer.location}`,
        `Last interaction: ${lastInteraction}`
      ],
      recommendations: [
        totalShipments === 0 ? 'Reach out to customer for first shipment' : 'Maintain strong customer relationship',
        averageShipmentValue < 100 ? 'Offer premium services to increase value' : 'Excellent customer value',
        'Regular follow-up for repeat business',
        'Consider loyalty program benefits',
        'Personalized service recommendations'
      ],
      generatedAt: new Date(),
      period: request.period,
      dataSources: ['Customer Database', 'Shipment Records', 'CRM System']
    }
  }

  private getDriverPerformanceData(drivers: any[], shipments: any[]): any[] {
    const performanceData: { [key: string]: number } = {};
    
    drivers.forEach(driver => {
      const driverShipments = shipments.filter(s => s.assignedDriver === driver.id);
      const completedShipments = driverShipments.filter(s => s.status === 'delivered').length;
      const totalShipments = driverShipments.length;
      
      if (totalShipments > 0) {
        performanceData[driver.name] = (completedShipments / totalShipments) * 100;
      } else {
        performanceData[driver.name] = 0;
      }
    });
    
    return Object.entries(performanceData).map(([driver, deliveryRate]) => ({
      driver,
      deliveryRate
    }));
  }

  private calculateAverageDeliveryTime(shipments: any[]): number {
    const deliveredShipments = shipments.filter(s => s.status === 'delivered' && s.actualDelivery && s.createdAt);
    if (deliveredShipments.length === 0) return 0;
    
    const totalDeliveryTime = deliveredShipments.reduce((sum, s) => {
      const created = new Date(s.createdAt.seconds * 1000);
      const delivered = new Date(s.actualDelivery);
      const diffHours = (delivered.getTime() - created.getTime()) / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);
    
    return totalDeliveryTime / deliveredShipments.length;
  }

  private identifyBottlenecks(shipments: any[], drivers: any[]): string[] {
    const bottlenecks: string[] = [];
    
    // Check for drivers with low performance
    const driverPerformance = this.getDriverPerformanceData(drivers, shipments);
    const lowPerformers = driverPerformance.filter(d => d.deliveryRate < 70);
    if (lowPerformers.length > 0) {
      bottlenecks.push(`${lowPerformers.length} drivers have delivery rates below 70%`);
    }
    
    // Check for pending shipments
    const pendingShipments = shipments.filter(s => s.status === 'pending').length;
    if (pendingShipments > 10) {
      bottlenecks.push(`${pendingShipments} shipments are pending assignment`);
    }
    
    // Check for available drivers vs busy drivers
    const availableDrivers = drivers.filter(d => d.status === 'available').length;
    const busyDrivers = drivers.filter(d => d.status === 'busy').length;
    if (availableDrivers < busyDrivers * 0.2) {
      bottlenecks.push('Limited driver availability for new assignments');
    }
    
    return bottlenecks;
  }

  private identifyOpportunities(shipments: any[], drivers: any[], agents: any[]): string[] {
    const opportunities: string[] = [];
    
    // High-performing drivers
    const driverPerformance = this.getDriverPerformanceData(drivers, shipments);
    const topPerformers = driverPerformance.filter(d => d.deliveryRate > 90);
    if (topPerformers.length > 0) {
      opportunities.push(`${topPerformers.length} drivers have excellent performance (>90%)`);
    }
    
    // High-value shipments
    const highValueShipments = shipments.filter(s => s.revenue && s.revenue > 1000).length;
    if (highValueShipments > 0) {
      opportunities.push(`${highValueShipments} high-value shipments identified`);
    }
    
    // Active agents
    const activeAgents = agents.filter(a => a.status === 'active').length;
    if (activeAgents > 5) {
      opportunities.push(`${activeAgents} active agents available for expansion`);
    }
    
    return opportunities;
  }

  private identifyRisks(shipments: any[], drivers: any[]): string[] {
    const risks: string[] = [];
    
    // Overworked drivers
    const driverShipmentCounts = this.getShipmentCountsByDriver(shipments, drivers);
    const overworkedDrivers = Array.from(driverShipmentCounts.entries())
      .filter(([_, count]) => count > 20)
      .length;
    
    if (overworkedDrivers > 0) {
      risks.push(`${overworkedDrivers} drivers are handling excessive workload`);
    }
    
    // Delayed shipments
    const delayedShipments = shipments.filter(s => s.status === 'in-transit' && s.estimatedDelivery).length;
    if (delayedShipments > 5) {
      risks.push(`${delayedShipments} shipments may be delayed`);
    }
    
    // Low driver availability
    const availableDrivers = drivers.filter(d => d.status === 'available').length;
    if (availableDrivers < 3) {
      risks.push('Limited driver availability may impact service quality');
    }
    
    return risks;
  }

  private getShipmentCountsByDriver(shipments: any[], drivers: any[]): Map<string, number> {
    const shipmentCounts = new Map<string, number>();
    shipments.forEach(shipment => {
      if (shipment.assignedDriver) {
        shipmentCounts.set(shipment.assignedDriver, (shipmentCounts.get(shipment.assignedDriver) || 0) + 1);
      }
    });
    return shipmentCounts;
  }

  private getServiceTypeBreakdown(shipments: any[]): any[] {
    const breakdown: { [key: string]: number } = {};
    shipments.forEach(shipment => {
      const serviceType = shipment.serviceType || 'unknown';
      breakdown[serviceType] = (breakdown[serviceType] || 0) + 1;
    });
    return Object.entries(breakdown).map(([serviceType, count]) => ({
      serviceType,
      count
    }));
  }

  private calculateRouteEfficiency(shipments: any[]): number {
    const uniqueRoutes = this.getUniqueRoutes(shipments);
    if (uniqueRoutes.length === 0) return 0;
    
    let totalEfficiency = 0;
    uniqueRoutes.forEach(route => {
      const routeShipments = shipments.filter(s => s.route === route);
      const completedShipments = routeShipments.filter(s => s.status === 'delivered').length;
      const totalShipments = routeShipments.length;
      
      if (totalShipments > 0) {
        totalEfficiency += (completedShipments / totalShipments) * 100;
      }
    });
    
    return totalEfficiency / uniqueRoutes.length;
  }

  private getUniqueRoutes(shipments: any[]): string[] {
    const routes = new Set<string>();
    shipments.forEach(shipment => {
      if (shipment.route) {
        routes.add(shipment.route);
      }
    });
    return Array.from(routes);
  }

  private calculateAverageRouteDistance(shipments: any[]): number {
    const uniqueRoutes = this.getUniqueRoutes(shipments);
    if (uniqueRoutes.length === 0) return 0;
    
    let totalDistance = 0;
    let routeCount = 0;
    
    uniqueRoutes.forEach(route => {
      const routeShipments = shipments.filter(s => s.route === route);
      const routeDistance = routeShipments.reduce((sum, s) => sum + (s.distance || 0), 0);
      if (routeDistance > 0) {
        totalDistance += routeDistance;
        routeCount++;
      }
    });
    
    return routeCount > 0 ? totalDistance / routeCount : 0;
  }

  private calculateFuelEfficiency(shipments: any[]): number {
    const uniqueRoutes = this.getUniqueRoutes(shipments);
    if (uniqueRoutes.length === 0) return 0;
    
    let totalFuel = 0;
    let totalDistance = 0;
    
    uniqueRoutes.forEach(route => {
      const routeShipments = shipments.filter(s => s.route === route);
      totalFuel += routeShipments.reduce((sum, s) => sum + (s.fuelConsumed || 0), 0);
      totalDistance += routeShipments.reduce((sum, s) => sum + (s.distance || 0), 0);
    });
    
    return totalFuel > 0 ? (totalDistance / totalFuel) * 100 : 0;
  }

  private calculateRouteOptimizationScore(shipments: any[]): number {
    const uniqueRoutes = this.getUniqueRoutes(shipments);
    if (uniqueRoutes.length === 0) return 0;
    
    let totalScore = 0;
    let routeCount = 0;
    
    uniqueRoutes.forEach(route => {
      const routeShipments = shipments.filter(s => s.route === route);
      const completedShipments = routeShipments.filter(s => s.status === 'delivered').length;
      const totalShipments = routeShipments.length;
      
      if (totalShipments > 0) {
        const completionRate = (completedShipments / totalShipments) * 100;
        totalScore += completionRate;
        routeCount++;
      }
    });
    
    return routeCount > 0 ? totalScore / routeCount : 0;
  }

  private getDriverEfficiencyData(drivers: any[], shipments: any[]): any[] {
    const efficiencyData: { [key: string]: number } = {};
    
    drivers.forEach(driver => {
      const driverShipments = shipments.filter(s => s.assignedDriver === driver.id);
      const completedShipments = driverShipments.filter(s => s.status === 'delivered').length;
      const totalShipments = driverShipments.length;
      
      if (totalShipments > 0) {
        efficiencyData[driver.name] = (completedShipments / totalShipments) * 100;
      } else {
        efficiencyData[driver.name] = 0;
      }
    });
    
    return Object.entries(efficiencyData).map(([driver, efficiency]) => ({
      driver,
      efficiency
    }));
  }

  private getRoutePerformanceData(shipments: any[]): any[] {
    const performanceData: { [key: string]: number } = {};
    const uniqueRoutes = this.getUniqueRoutes(shipments);
    
    uniqueRoutes.forEach(route => {
      const routeShipments = shipments.filter(s => s.route === route);
      const completedShipments = routeShipments.filter(s => s.status === 'delivered').length;
      const totalShipments = routeShipments.length;
      
      if (totalShipments > 0) {
        performanceData[route] = (completedShipments / totalShipments) * 100;
      } else {
        performanceData[route] = 0;
      }
    });
    
    return Object.entries(performanceData).map(([route, performance]) => ({
      route,
      performance
    }));
  }

  private calculateInventoryTurnover(shipments: any[]): number {
    const totalShipments = shipments.length;
    if (totalShipments === 0) return 0;
    
    const totalValue = shipments.reduce((sum, s) => sum + (s.revenue || 0), 0);
    const averageShipmentValue = totalValue / totalShipments;
    
    return averageShipmentValue > 0 ? totalValue / averageShipmentValue : 0;
  }

  private getStockLevels(shipments: any[]): { current: number; byCategory: any[] } {
    // This is a simplified calculation based on shipment data
    const totalShipments = shipments.length;
    const completedShipments = shipments.filter(s => s.status === 'delivered').length;
    const currentStock = totalShipments - completedShipments;
    const totalCapacity = totalShipments * 1.5; // Assuming 50% buffer
    
    return {
      current: totalCapacity > 0 ? (currentStock / totalCapacity) * 100 : 0,
      byCategory: []
    };
  }

  private generateDemandForecast(shipments: any[]): { accuracy: number; trends: any[] } {
    const monthlyDemand: { [key: string]: number } = {};
    
    shipments.forEach(shipment => {
      if (shipment.createdAt) {
        const date = new Date(shipment.createdAt.seconds * 1000);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyDemand[monthKey] = (monthlyDemand[monthKey] || 0) + (shipment.revenue || 0);
      }
    });
    
    const monthlyData = Object.entries(monthlyDemand).map(([month, demand]) => ({
      month,
      demand
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    const trends: any[] = [];
    for (let i = 0; i < monthlyData.length - 1; i++) {
      const currentMonth = monthlyData[i];
      const nextMonth = monthlyData[i + 1];
      const change = nextMonth.demand - currentMonth.demand;
      const percentageChange = currentMonth.demand > 0 ? (change / currentMonth.demand) * 100 : 0;
      trends.push({
        period: currentMonth.month,
        demand: currentMonth.demand,
        change: change,
        percentageChange: percentageChange.toFixed(1) + '%'
      });
    }
    
    return {
      accuracy: 85, // Placeholder for actual accuracy
      trends: trends
    };
  }

  private calculateMonthlyRevenue(transactions: any[]): any[] {
    const monthlyRevenue: { [key: string]: number } = {};
    
    transactions.forEach(transaction => {
      if (transaction.date) {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (transaction.amount || 0);
      }
    });
    
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue
    })).sort((a, b) => a.month.localeCompare(b.month))
  }

  private getCategoryBreakdown(inventoryItems: any[]): any[] {
    const breakdown: { [key: string]: number } = {};
    inventoryItems.forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + (item.quantity || 0);
    });
    return Object.entries(breakdown).map(([category, quantity]) => ({
      category,
      quantity
    }));
  }
}

// Export the singleton instance
export const aiReportGenerator = AIReportService.getInstance() 