import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase-config'

export interface ReportFilters {
  startDate?: Date
  endDate?: Date
  department?: string
  employee?: string
  region?: string
  serviceType?: string
  status?: string
  category?: string
}

export interface PerformanceMetrics {
  totalTasks: number
  completedTasks: number
  completionRate: number
  averageResponseTime: number
  customerSatisfaction: number
  efficiencyScore: number
}

export interface DepartmentMetrics {
  totalEmployees: number
  totalProjects: number
  totalRevenue: number
  averagePerformance: number
  projectCompletionRate: number
}

export interface FinancialMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  outstandingReceivables: number
  outstandingPayables: number
}

export interface OperationalMetrics {
  totalShipments: number
  onTimeDeliveries: number
  deliverySuccessRate: number
  averageDeliveryTime: number
  customerComplaints: number
  costPerDelivery: number
}

export class ReportService {
  // Employee Performance Report
  static async generateEmployeePerformanceReport(filters: ReportFilters) {
    try {
      const employeesRef = collection(db, 'employees')
      let employeesQuery = query(employeesRef)
      
      if (filters.department && filters.department !== 'all') {
        employeesQuery = query(employeesRef, where('department', '==', filters.department))
      }
      
      const employeesSnapshot = await getDocs(employeesQuery)
      const employees = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Get shipments for performance calculation
      const shipmentsRef = collection(db, 'shipments')
      let shipmentsQuery = query(shipmentsRef)
      
      if (filters.startDate && filters.endDate) {
        shipmentsQuery = query(
          shipmentsRef,
          where('createdAt', '>=', Timestamp.fromDate(filters.startDate)),
          where('createdAt', '<=', Timestamp.fromDate(filters.endDate))
        )
      }
      
      const shipmentsSnapshot = await getDocs(shipmentsQuery)
      const shipments = shipmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Calculate performance metrics for each employee
      const performanceData = employees.map(employee => {
        const employeeShipments = shipments.filter(shipment => 
          shipment.assignedTo === employee.id || 
          shipment.createdBy === employee.id
        )

        const completedShipments = employeeShipments.filter(s => s.status === 'delivered')
        const onTimeDeliveries = completedShipments.filter(s => {
          if (!s.estimatedDeliveryDate || !s.actualDeliveryDate) return false
          return new Date(s.actualDeliveryDate.toDate()) <= new Date(s.estimatedDeliveryDate.toDate())
        })

        const performanceMetrics: PerformanceMetrics = {
          totalTasks: employeeShipments.length,
          completedTasks: completedShipments.length,
          completionRate: employeeShipments.length > 0 ? (completedShipments.length / employeeShipments.length) * 100 : 0,
          averageResponseTime: this.calculateAverageResponseTime(employeeShipments),
          customerSatisfaction: this.calculateCustomerSatisfaction(employeeShipments),
          efficiencyScore: this.calculateEfficiencyScore(employeeShipments, completedShipments, onTimeDeliveries)
        }

        return {
          employee,
          metrics: performanceMetrics
        }
      })

      return {
        type: 'employee_performance',
        filters,
        generatedAt: new Date(),
        data: performanceData,
        summary: {
          totalEmployees: performanceData.length,
          averageCompletionRate: performanceData.reduce((sum, item) => sum + item.metrics.completionRate, 0) / performanceData.length,
          averageEfficiencyScore: performanceData.reduce((sum, item) => sum + item.metrics.efficiencyScore, 0) / performanceData.length,
          topPerformers: performanceData
            .sort((a, b) => b.metrics.efficiencyScore - a.metrics.efficiencyScore)
            .slice(0, 5)
        }
      }
    } catch (error) {
      console.error('Error generating employee performance report:', error)
      throw error
    }
  }

  // Department Performance Report
  static async generateDepartmentPerformanceReport(filters: ReportFilters) {
    try {
      const departmentsRef = collection(db, 'departments')
      const departmentsSnapshot = await getDocs(departmentsRef)
      const departments = departmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const employeesRef = collection(db, 'employees')
      const employeesSnapshot = await getDocs(employeesRef)
      const employees = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const shipmentsRef = collection(db, 'shipments')
      let shipmentsQuery = query(shipmentsRef)
      
      if (filters.startDate && filters.endDate) {
        shipmentsQuery = query(
          shipmentsRef,
          where('createdAt', '>=', Timestamp.fromDate(filters.startDate)),
          where('createdAt', '<=', Timestamp.fromDate(filters.endDate))
        )
      }
      
      const shipmentsSnapshot = await getDocs(shipmentsQuery)
      const shipments = shipmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const departmentData = departments.map(department => {
        const departmentEmployees = employees.filter(emp => emp.department === department.name)
        const departmentShipments = shipments.filter(shipment => 
          departmentEmployees.some(emp => emp.id === shipment.assignedTo || emp.id === shipment.createdBy)
        )

        const completedShipments = departmentShipments.filter(s => s.status === 'delivered')
        const totalRevenue = completedShipments.reduce((sum, shipment) => sum + (shipment.totalAmount || 0), 0)

        const metrics: DepartmentMetrics = {
          totalEmployees: departmentEmployees.length,
          totalProjects: departmentShipments.length,
          totalRevenue,
          averagePerformance: departmentEmployees.length > 0 ? 
            departmentEmployees.reduce((sum, emp) => sum + (emp.performanceScore || 0), 0) / departmentEmployees.length : 0,
          projectCompletionRate: departmentShipments.length > 0 ? (completedShipments.length / departmentShipments.length) * 100 : 0
        }

        return {
          department,
          metrics
        }
      })

      return {
        type: 'department_performance',
        filters,
        generatedAt: new Date(),
        data: departmentData,
        summary: {
          totalDepartments: departmentData.length,
          totalEmployees: departmentData.reduce((sum, item) => sum + item.metrics.totalEmployees, 0),
          totalRevenue: departmentData.reduce((sum, item) => sum + item.metrics.totalRevenue, 0),
          averageCompletionRate: departmentData.reduce((sum, item) => sum + item.metrics.projectCompletionRate, 0) / departmentData.length,
          topDepartment: departmentData.sort((a, b) => b.metrics.projectCompletionRate - a.metrics.projectCompletionRate)[0]
        }
      }
    } catch (error) {
      console.error('Error generating department performance report:', error)
      throw error
    }
  }

  // Financial Performance Report
  static async generateFinancialPerformanceReport(filters: ReportFilters) {
    try {
      const transactionsRef = collection(db, 'transactions')
      let transactionsQuery = query(transactionsRef)
      
      if (filters.startDate && filters.endDate) {
        transactionsQuery = query(
          transactionsRef,
          where('date', '>=', Timestamp.fromDate(filters.startDate)),
          where('date', '<=', Timestamp.fromDate(filters.endDate))
        )
      }
      
      const transactionsSnapshot = await getDocs(transactionsQuery)
      const transactions = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const shipmentsRef = collection(db, 'shipments')
      let shipmentsQuery = query(shipmentsRef)
      
      if (filters.startDate && filters.endDate) {
        shipmentsQuery = query(
          shipmentsRef,
          where('createdAt', '>=', Timestamp.fromDate(filters.startDate)),
          where('createdAt', '<=', Timestamp.fromDate(filters.endDate))
        )
      }
      
      const shipmentsSnapshot = await getDocs(shipmentsQuery)
      const shipments = shipmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const revenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0)
      const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0)
      const shipmentRevenue = shipments.filter(s => s.status === 'delivered').reduce((sum, s) => sum + (s.totalAmount || 0), 0)
      
      const outstandingReceivables = shipments
        .filter(s => s.status === 'delivered' && !s.paymentStatus)
        .reduce((sum, s) => sum + (s.totalAmount || 0), 0)

      const outstandingPayables = transactions
        .filter(t => t.type === 'expense' && t.status === 'pending')
        .reduce((sum, t) => sum + (t.amount || 0), 0)

      const totalRevenue = revenue + shipmentRevenue
      const netProfit = totalRevenue - expenses
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

      const metrics: FinancialMetrics = {
        totalRevenue,
        totalExpenses: expenses,
        netProfit,
        profitMargin,
        outstandingReceivables,
        outstandingPayables
      }

      return {
        type: 'financial_performance',
        filters,
        generatedAt: new Date(),
        data: {
          metrics,
          transactions: transactions.slice(0, 50), // Limit to recent transactions
          revenueBreakdown: {
            shipmentRevenue,
            otherRevenue: revenue,
            totalRevenue
          },
          expenseBreakdown: {
            operationalExpenses: expenses * 0.6,
            administrativeExpenses: expenses * 0.3,
            otherExpenses: expenses * 0.1
          }
        },
        summary: {
          totalTransactions: transactions.length,
          totalShipments: shipments.length,
          revenueGrowth: this.calculateGrowthRate(transactions, 'income'),
          expenseGrowth: this.calculateGrowthRate(transactions, 'expense'),
          profitTrend: netProfit > 0 ? 'positive' : 'negative'
        }
      }
    } catch (error) {
      console.error('Error generating financial performance report:', error)
      throw error
    }
  }

  // Operational Efficiency Report
  static async generateOperationalEfficiencyReport(filters: ReportFilters) {
    try {
      const shipmentsRef = collection(db, 'shipments')
      let shipmentsQuery = query(shipmentsRef)
      
      if (filters.startDate && filters.endDate) {
        shipmentsQuery = query(
          shipmentsRef,
          where('createdAt', '>=', Timestamp.fromDate(filters.startDate)),
          where('createdAt', '<=', Timestamp.fromDate(filters.endDate))
        )
      }
      
      if (filters.serviceType && filters.serviceType !== 'all') {
        shipmentsQuery = query(shipmentsQuery, where('serviceType', '==', filters.serviceType))
      }
      
      const shipmentsSnapshot = await getDocs(shipmentsQuery)
      const shipments = shipmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const completedShipments = shipments.filter(s => s.status === 'delivered')
      const onTimeDeliveries = completedShipments.filter(s => {
        if (!s.estimatedDeliveryDate || !s.actualDeliveryDate) return false
        return new Date(s.actualDeliveryDate.toDate()) <= new Date(s.estimatedDeliveryDate.toDate())
      })

      const averageDeliveryTime = this.calculateAverageDeliveryTime(completedShipments)
      const totalCost = shipments.reduce((sum, s) => sum + (s.operationalCost || 0), 0)
      const costPerDelivery = completedShipments.length > 0 ? totalCost / completedShipments.length : 0

      const metrics: OperationalMetrics = {
        totalShipments: shipments.length,
        onTimeDeliveries: onTimeDeliveries.length,
        deliverySuccessRate: shipments.length > 0 ? (completedShipments.length / shipments.length) * 100 : 0,
        averageDeliveryTime,
        customerComplaints: shipments.filter(s => s.hasComplaints).length,
        costPerDelivery
      }

      // Regional breakdown
      const regionalData = this.groupByRegion(shipments)
      const serviceTypeData = this.groupByServiceType(shipments)

      return {
        type: 'operational_efficiency',
        filters,
        generatedAt: new Date(),
        data: {
          metrics,
          regionalBreakdown: regionalData,
          serviceTypeBreakdown: serviceTypeData,
          recentShipments: shipments.slice(0, 20)
        },
        summary: {
          totalShipments: shipments.length,
          onTimeDeliveryRate: shipments.length > 0 ? (onTimeDeliveries.length / shipments.length) * 100 : 0,
          averageCostPerDelivery: costPerDelivery,
          topPerformingRegion: Object.entries(regionalData)
            .sort(([,a], [,b]) => b.successRate - a.successRate)[0],
          serviceTypePerformance: Object.entries(serviceTypeData)
            .sort(([,a], [,b]) => b.successRate - a.successRate)
        }
      }
    } catch (error) {
      console.error('Error generating operational efficiency report:', error)
      throw error
    }
  }

  // Helper methods
  private static calculateAverageResponseTime(shipments: any[]): number {
    const responseTimes = shipments
      .filter(s => s.createdAt && s.firstResponseAt)
      .map(s => {
        const created = new Date(s.createdAt.toDate())
        const response = new Date(s.firstResponseAt.toDate())
        return (response.getTime() - created.getTime()) / (1000 * 60 * 60) // hours
      })
    
    return responseTimes.length > 0 ? 
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0
  }

  private static calculateCustomerSatisfaction(shipments: any[]): number {
    const ratedShipments = shipments.filter(s => s.customerRating)
    return ratedShipments.length > 0 ? 
      ratedShipments.reduce((sum, s) => sum + s.customerRating, 0) / ratedShipments.length : 0
  }

  private static calculateEfficiencyScore(shipments: any[], completed: any[], onTime: any[]): number {
    const completionRate = shipments.length > 0 ? completed.length / shipments.length : 0
    const onTimeRate = completed.length > 0 ? onTime.length / completed.length : 0
    const satisfactionRate = this.calculateCustomerSatisfaction(shipments) / 5 // Normalize to 0-1
    
    return (completionRate * 0.4 + onTimeRate * 0.4 + satisfactionRate * 0.2) * 100
  }

  private static calculateAverageDeliveryTime(shipments: any[]): number {
    const deliveryTimes = shipments
      .filter(s => s.createdAt && s.actualDeliveryDate)
      .map(s => {
        const created = new Date(s.createdAt.toDate())
        const delivered = new Date(s.actualDeliveryDate.toDate())
        return (delivered.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) // days
      })
    
    return deliveryTimes.length > 0 ? 
      deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length : 0
  }

  private static calculateGrowthRate(transactions: any[], type: string): number {
    // Simplified growth rate calculation
    const typeTransactions = transactions.filter(t => t.type === type)
    if (typeTransactions.length < 2) return 0
    
    const sorted = typeTransactions.sort((a, b) => a.date.toDate() - b.date.toDate())
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2))
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2))
    
    const firstHalfTotal = firstHalf.reduce((sum, t) => sum + (t.amount || 0), 0)
    const secondHalfTotal = secondHalf.reduce((sum, t) => sum + (t.amount || 0), 0)
    
    return firstHalfTotal > 0 ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100 : 0
  }

  private static groupByRegion(shipments: any[]) {
    const regions: { [key: string]: any } = {}
    
    shipments.forEach(shipment => {
      const region = shipment.pickupLocation?.region || 'Unknown'
      if (!regions[region]) {
        regions[region] = {
          total: 0,
          completed: 0,
          onTime: 0,
          successRate: 0
        }
      }
      
      regions[region].total++
      if (shipment.status === 'delivered') {
        regions[region].completed++
        if (shipment.actualDeliveryDate && shipment.estimatedDeliveryDate) {
          const actual = new Date(shipment.actualDeliveryDate.toDate())
          const estimated = new Date(shipment.estimatedDeliveryDate.toDate())
          if (actual <= estimated) {
            regions[region].onTime++
          }
        }
      }
    })

    // Calculate success rates
    Object.keys(regions).forEach(region => {
      regions[region].successRate = regions[region].total > 0 ? 
        (regions[region].completed / regions[region].total) * 100 : 0
    })

    return regions
  }

  private static groupByServiceType(shipments: any[]) {
    const serviceTypes: { [key: string]: any } = {}
    
    shipments.forEach(shipment => {
      const serviceType = shipment.serviceType || 'Unknown'
      if (!serviceTypes[serviceType]) {
        serviceTypes[serviceType] = {
          total: 0,
          completed: 0,
          onTime: 0,
          successRate: 0
        }
      }
      
      serviceTypes[serviceType].total++
      if (shipment.status === 'delivered') {
        serviceTypes[serviceType].completed++
        if (shipment.actualDeliveryDate && shipment.estimatedDeliveryDate) {
          const actual = new Date(shipment.actualDeliveryDate.toDate())
          const estimated = new Date(shipment.estimatedDeliveryDate.toDate())
          if (actual <= estimated) {
            serviceTypes[serviceType].onTime++
          }
        }
      }
    })

    // Calculate success rates
    Object.keys(serviceTypes).forEach(serviceType => {
      serviceTypes[serviceType].successRate = serviceTypes[serviceType].total > 0 ? 
        (serviceTypes[serviceType].completed / serviceTypes[serviceType].total) * 100 : 0
    })

    return serviceTypes
  }
} 