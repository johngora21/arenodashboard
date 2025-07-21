import { collection, getDocs, doc, updateDoc, query, orderBy, where, Timestamp, addDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { db, app } from './firebase-config'

// Add offline mode support and better error handling
const handleFirebaseError = (error: any, operation: string) => {
  console.error(`Firebase ${operation} error:`, error)
  
  // Check if it's a network connectivity issue
  if (error.code === 'unavailable' || error.message?.includes('Could not reach Cloud Firestore backend')) {
    console.warn('Firebase is offline. Operation will be retried when connection is restored.')
    throw new Error(`Network connectivity issue. Please check your internet connection and try again.`)
  }
  
  throw error
}

// Wrapper function for Firebase operations with retry logic
const withRetry = async <T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error: any) {
      if (i === maxRetries - 1) {
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
  throw new Error('Max retries exceeded')
}

export interface QuoteData {
  id: string
  serviceType: 'freight' | 'moving' | 'courier'
  contactInfo: {
    businessName?: string
    contactPerson: string
    phone: string
    whatsapp?: string
    email: string
  }
  shipmentDetails: {
    pickupLocation: {
      lat: number
      lng: number
      address?: string
    }
    destinationLocation: {
      lat: number
      lng: number
      address?: string
    }
    pickupDate?: string
    deliveryDate?: string
  }
  cargoDetails: {
    description: string
    quantity?: string
    weight?: string
    volume?: string
    specialHandling?: string[]
    files: string[]
  }
  additionalServices: string[]
  otherRequests?: string
  createdAt: Timestamp
  status: 'pending' | 'approved' | 'rejected'
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: Timestamp
  status: 'unread' | 'read' | 'replied'
  adminReply?: string
  repliedAt?: Timestamp
}

export interface AgentApplication {
  id: string
  businessInfo: {
    businessName: string
    tinNumber: string
    serviceOffered: string
    yearsInBusiness: string
  }
  locationInfo: {
    businessAddress: string
    region: string
    district: string
  }
  contactInfo: {
    contactPerson: string
    position: string
    nidaNumber: string
    phone: string
    email: string
  }
  additionalInfo: {
    whyAgent: string
    experience?: string
  }
  documents: string[] // File URLs
  createdAt: Timestamp
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
  reviewedAt?: Timestamp
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  role: string
  status: 'active' | 'inactive' | 'on-leave' | 'terminated'
  joinDate: string
  salary: number
  lastActive: string
  performance: number
  attendance: number
  manager?: string
  location: string
  emergencyContact?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface EmployeeStats {
  total: number
  active: number
  inactive: number
  onLeave: number
  terminated: number
  averagePerformance: number
  averageAttendance: number
  totalSalary: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  location: string
  status: 'active' | 'inactive' | 'prospect' | 'vip'
  totalShipments: number
  totalRevenue: number
  lastInteraction: string
  lastShipment: string
  notes?: string
  tags: string[]
  assignedAgent?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Interaction {
  id: string
  customerId: string
  type: 'call' | 'email' | 'meeting' | 'quote' | 'shipment' | 'message'
  subject: string
  description: string
  date: string
  agent: string
  outcome: 'positive' | 'neutral' | 'negative'
  createdAt: Timestamp
}

export interface CRMStats {
  totalCustomers: number
  activeCustomers: number
  inactiveCustomers: number
  prospects: number
  vipCustomers: number
  totalRevenue: number
  averageRevenue: number
  totalInteractions: number
  averageInteractions: number
}

export interface Shipment {
  id: string
  trackingNumber: string
  serviceType: 'freight' | 'moving' | 'courier'
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled'
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupLocation: string
  destination: string
  cargoDescription: string
  weight?: string
  dimensions?: string
  createdAt: Timestamp
  estimatedDelivery: string
  actualDelivery?: string
  notes?: string
  assignedDriver?: string
  vehicleNumber?: string
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  subcategory: string
  amount: number
  description: string
  date: string
  paymentMethod: string
  status: 'completed' | 'pending' | 'cancelled'
  reference?: string
  attachments?: string[]
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  monthlyIncome: number
  monthlyExpenses: number
  outstandingReceivables: number
  outstandingPayables: number
  cashFlow: number
  bankBalance: number
  lastUpdated: Timestamp
}

export interface Department {
  id: string
  name: string
  code: string
  description: string
  manager: string
  location: string
  budget: number
  employeeCount: number
  status: 'active' | 'inactive' | 'restructuring'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Role {
  id: string
  name: string
  code: string
  description: string
  level: number // 1 = lowest, 10 = highest
  permissions: string[]
  status: 'active' | 'inactive'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface DepartmentStats {
  total: number
  active: number
  inactive: number
  restructuring: number
  totalEmployees: number
  totalBudget: number
  averageEmployees: number
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  description: string
  supplier: string
  unit: string
  quantity: number
  minQuantity: number
  maxQuantity: number
  unitPrice: number
  totalValue: number
  location: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued'
  lastUpdated: Timestamp
  createdAt: Timestamp
}

export interface InventoryCategory {
  id: string
  name: string
  description: string
  itemCount: number
  totalValue: number
  createdAt: Timestamp
}

export interface InventorySupplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  itemsSupplied: number
  totalSpent: number
  status: 'active' | 'inactive'
  createdAt: Timestamp
}

export interface InventoryStats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  totalCategories: number
  totalSuppliers: number
  averageItemValue: number
}

export interface Agent {
  id: string
  name: string
  phone: string
  email: string
  location: string
  address: string
  region: string
  district: string
  status: 'active' | 'inactive' | 'suspended'
  commission: number
  totalDeliveries: number
  totalEarnings: number
  rating: number
  joinedDate: Timestamp
  lastActive: Timestamp
  documents: {
    idCard?: string
    businessLicense?: string
    bankDetails?: string
  }
  notes: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  vehicleType: 'motorcycle' | 'bicycle' | 'car'
  vehicleNumber: string
  licenseNumber: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  region: string
  district: string
  status: 'available' | 'busy' | 'offline' | 'suspended'
  rating: number
  totalDeliveries: number
  totalEarnings: number
  joinedDate: Timestamp
  lastActive: Timestamp
  documents: {
    license?: string
    insurance?: string
    vehicleRegistration?: string
  }
  notes: string
}

export const getAllQuotes = async (): Promise<QuoteData[]> => {
  try {
    const quotesRef = collection(db, 'quotes')
    const q = query(quotesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const quotes: QuoteData[] = []
    querySnapshot.forEach((doc) => {
      quotes.push({
        id: doc.id,
        ...doc.data()
      } as QuoteData)
    })
    
    return quotes
  } catch (error) {
    handleFirebaseError(error, 'fetching quotes')
    throw error
  }
}

export const getQuotesByStatus = async (status: 'pending' | 'approved' | 'rejected'): Promise<QuoteData[]> => {
  try {
    const quotesRef = collection(db, 'quotes')
    const q = query(quotesRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const quotes: QuoteData[] = []
    querySnapshot.forEach((doc) => {
      quotes.push({
        id: doc.id,
        ...doc.data()
      } as QuoteData)
    })
    
    return quotes
  } catch (error) {
    handleFirebaseError(error, 'fetching quotes by status')
    throw error
  }
}

export const getQuotesByServiceType = async (serviceType: 'freight' | 'moving' | 'courier'): Promise<QuoteData[]> => {
  try {
    const quotesRef = collection(db, 'quotes')
    const q = query(quotesRef, where('serviceType', '==', serviceType), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const quotes: QuoteData[] = []
    querySnapshot.forEach((doc) => {
      quotes.push({
        id: doc.id,
        ...doc.data()
      } as QuoteData)
    })
    
    return quotes
  } catch (error) {
    handleFirebaseError(error, 'fetching quotes by service type')
    throw error
  }
}

export const updateQuoteStatus = async (quoteId: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
  try {
    const quoteRef = doc(db, 'quotes', quoteId)
    await updateDoc(quoteRef, {
      status: status
    })
  } catch (error) {
    handleFirebaseError(error, 'updating quote status')
    throw error
  }
}

export const getQuoteStats = async () => {
  try {
    const allQuotes = await getAllQuotes()
    
    const stats = {
      total: allQuotes.length,
      pending: allQuotes.filter(q => q.status === 'pending').length,
      approved: allQuotes.filter(q => q.status === 'approved').length,
      rejected: allQuotes.filter(q => q.status === 'rejected').length,
      freight: allQuotes.filter(q => q.serviceType === 'freight').length,
      moving: allQuotes.filter(q => q.serviceType === 'moving').length,
      courier: allQuotes.filter(q => q.serviceType === 'courier').length,
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting quote stats')
    throw error
  }
}

export const saveContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  try {
    const messagesRef = collection(db, 'contactMessages')
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      createdAt: Timestamp.now(),
      status: 'unread'
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'saving contact message')
    throw error
  }
}

export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const messagesRef = collection(db, 'contactMessages')
    const q = query(messagesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const messages: ContactMessage[] = []
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ContactMessage)
    })
    
    return messages
  } catch (error) {
    handleFirebaseError(error, 'fetching contact messages')
    throw error
  }
}

export const updateContactMessageStatus = async (messageId: string, status: 'unread' | 'read' | 'replied', adminReply?: string): Promise<void> => {
  try {
    const messageRef = doc(db, 'contactMessages', messageId)
    const updateData: any = { status }
    
    if (status === 'replied' && adminReply) {
      updateData.adminReply = adminReply
      updateData.repliedAt = Timestamp.now()
    }
    
    await updateDoc(messageRef, updateData)
  } catch (error) {
    handleFirebaseError(error, 'updating contact message status')
    throw error
  }
}

export const saveAgentApplication = async (applicationData: Omit<AgentApplication, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  try {
    const applicationsRef = collection(db, 'agentApplications')
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      createdAt: Timestamp.now(),
      status: 'pending'
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'saving agent application')
    throw error
  }
}

export const getAllAgentApplications = async (): Promise<AgentApplication[]> => {
  try {
    const applicationsRef = collection(db, 'agentApplications')
    const q = query(applicationsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const applications: AgentApplication[] = []
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data()
      } as AgentApplication)
    })
    
    return applications
  } catch (error) {
    handleFirebaseError(error, 'fetching agent applications')
    throw error
  }
}

export const updateAgentApplicationStatus = async (applicationId: string, status: 'pending' | 'approved' | 'rejected', adminNotes?: string): Promise<void> => {
  try {
    const applicationRef = doc(db, 'agentApplications', applicationId)
    const updateData: any = { status }
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes
    }
    
    if (status !== 'pending') {
      updateData.reviewedAt = Timestamp.now()
    }
    
    await updateDoc(applicationRef, updateData)
  } catch (error) {
    handleFirebaseError(error, 'updating agent application status')
    throw error
  }
}

export const getContactMessageStats = async () => {
  try {
    const allMessages = await getAllContactMessages()
    
    return {
      total: allMessages.length,
      unread: allMessages.filter(m => m.status === 'unread').length,
      read: allMessages.filter(m => m.status === 'read').length,
      replied: allMessages.filter(m => m.status === 'replied').length,
    }
  } catch (error) {
    handleFirebaseError(error, 'getting contact message stats')
    throw error
  }
}

export const getAgentApplicationStats = async () => {
  try {
    const allApplications = await getAllAgentApplications()
    
    return {
      total: allApplications.length,
      pending: allApplications.filter(a => a.status === 'pending').length,
      approved: allApplications.filter(a => a.status === 'approved').length,
      rejected: allApplications.filter(a => a.status === 'rejected').length,
    }
  } catch (error) {
    handleFirebaseError(error, 'getting agent application stats')
    throw error
  }
}

export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const employeesRef = collection(db, 'employees')
    const q = query(employeesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const employees: Employee[] = []
    querySnapshot.forEach((doc) => {
      employees.push({
        id: doc.id,
        ...doc.data()
      } as Employee)
    })
    
    return employees
  } catch (error) {
    handleFirebaseError(error, 'fetching employees')
    throw error
  }
}

export const getEmployeesByStatus = async (status: 'active' | 'inactive' | 'on-leave' | 'terminated'): Promise<Employee[]> => {
  try {
    const employeesRef = collection(db, 'employees')
    const q = query(employeesRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const employees: Employee[] = []
    querySnapshot.forEach((doc) => {
      employees.push({
        id: doc.id,
        ...doc.data()
      } as Employee)
    })
    
    return employees
  } catch (error) {
    handleFirebaseError(error, 'fetching employees by status')
    throw error
  }
}

export const getEmployeesByDepartment = async (departmentId: string): Promise<Employee[]> => {
  try {
    const allEmployees = await getAllEmployees()
    return allEmployees.filter(employee => employee.department === departmentId)
  } catch (error) {
    handleFirebaseError(error, 'getting employees by department')
    throw error
  }
}

export const getEmployeeById = async (employeeId: string): Promise<Employee | null> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId)
    const employeeDoc = await getDoc(employeeRef)
    
    if (employeeDoc.exists()) {
      return {
        id: employeeDoc.id,
        ...employeeDoc.data()
      } as Employee
    }
    
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching employee by ID')
    throw error
  }
}

export const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // Clean out undefined values before saving to Firestore
    const cleanedData = Object.fromEntries(
      Object.entries(employeeData).filter(([_, value]) => value !== undefined)
    )
    
    const employeesRef = collection(db, 'employees')
    const docRef = await addDoc(employeesRef, {
      ...cleanedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding employee')
    throw error
  }
}

export const updateEmployee = async (employeeId: string, employeeData: Partial<Omit<Employee, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    // Clean out undefined values before saving to Firestore
    const cleanedData = Object.fromEntries(
      Object.entries(employeeData).filter(([_, value]) => value !== undefined)
    )
    
    const employeeRef = doc(db, 'employees', employeeId)
    await updateDoc(employeeRef, {
      ...cleanedData,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating employee')
    throw error
  }
}

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId)
    await deleteDoc(employeeRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting employee')
    throw error
  }
}

export const updateEmployeeStatus = async (employeeId: string, status: 'active' | 'inactive' | 'on-leave' | 'terminated'): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId)
    await updateDoc(employeeRef, {
      status: status,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating employee status')
    throw error
  }
}

export const updateEmployeePerformance = async (employeeId: string, performance: number): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId)
    await updateDoc(employeeRef, {
      performance: performance,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating employee performance')
    throw error
  }
}

export const updateEmployeeAttendance = async (employeeId: string, attendance: number): Promise<void> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId)
    await updateDoc(employeeRef, {
      attendance: attendance,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating employee attendance')
    throw error
  }
}

export const getEmployeeStats = async (): Promise<EmployeeStats> => {
  try {
    const allEmployees = await getAllEmployees()
    
    const stats: EmployeeStats = {
      total: allEmployees.length,
      active: allEmployees.filter(emp => emp.status === 'active').length,
      inactive: allEmployees.filter(emp => emp.status === 'inactive').length,
      onLeave: allEmployees.filter(emp => emp.status === 'on-leave').length,
      terminated: allEmployees.filter(emp => emp.status === 'terminated').length,
      averagePerformance: allEmployees.length > 0 ? Math.round(allEmployees.reduce((sum, emp) => sum + emp.performance, 0) / allEmployees.length) : 0,
      averageAttendance: allEmployees.length > 0 ? Math.round(allEmployees.reduce((sum, emp) => sum + emp.attendance, 0) / allEmployees.length) : 0,
      totalSalary: allEmployees.reduce((sum, emp) => sum + emp.salary, 0)
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting employee stats')
    throw error
  }
}

export const searchEmployees = async (searchTerm: string): Promise<Employee[]> => {
  try {
    const allEmployees = await getAllEmployees()
    
    return allEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    handleFirebaseError(error, 'searching employees')
    throw error
  }
}

// CRM Functions
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const customersRef = collection(db, 'customers')
    const q = query(customersRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const customers: Customer[] = []
    querySnapshot.forEach((doc) => {
      customers.push({
        id: doc.id,
        ...doc.data()
      } as Customer)
    })
    
    return customers
  } catch (error) {
    handleFirebaseError(error, 'fetching customers')
    throw error
  }
}

export const getCustomersByStatus = async (status: 'active' | 'inactive' | 'prospect' | 'vip'): Promise<Customer[]> => {
  try {
    const customersRef = collection(db, 'customers')
    const q = query(customersRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const customers: Customer[] = []
    querySnapshot.forEach((doc) => {
      customers.push({
        id: doc.id,
        ...doc.data()
      } as Customer)
    })
    
    return customers
  } catch (error) {
    handleFirebaseError(error, 'fetching customers by status')
    throw error
  }
}

export const getCustomerById = async (customerId: string): Promise<Customer | null> => {
  try {
    const customerRef = doc(db, 'customers', customerId)
    const customerDoc = await getDoc(customerRef)
    
    if (customerDoc.exists()) {
      return {
        id: customerDoc.id,
        ...customerDoc.data()
      } as Customer
    }
    
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching customer by ID')
    throw error
  }
}

export const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const customersRef = collection(db, 'customers')
    const docRef = await addDoc(customersRef, {
      ...customerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding customer')
    throw error
  }
}

export const updateCustomer = async (customerId: string, customerData: Partial<Omit<Customer, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId)
    await updateDoc(customerRef, {
      ...customerData,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating customer')
    throw error
  }
}

export const deleteCustomer = async (customerId: string): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId)
    await deleteDoc(customerRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting customer')
    throw error
  }
}

export const updateCustomerStatus = async (customerId: string, status: 'active' | 'inactive' | 'prospect' | 'vip'): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId)
    await updateDoc(customerRef, {
      status: status,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating customer status')
    throw error
  }
}

export const getAllInteractions = async (): Promise<Interaction[]> => {
  try {
    const interactionsRef = collection(db, 'interactions')
    const q = query(interactionsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const interactions: Interaction[] = []
    querySnapshot.forEach((doc) => {
      interactions.push({
        id: doc.id,
        ...doc.data()
      } as Interaction)
    })
    
    return interactions
  } catch (error) {
    handleFirebaseError(error, 'fetching interactions')
    throw error
  }
}

export const getInteractionsByCustomer = async (customerId: string): Promise<Interaction[]> => {
  try {
    const interactionsRef = collection(db, 'interactions')
    const q = query(interactionsRef, where('customerId', '==', customerId), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const interactions: Interaction[] = []
    querySnapshot.forEach((doc) => {
      interactions.push({
        id: doc.id,
        ...doc.data()
      } as Interaction)
    })
    
    return interactions
  } catch (error) {
    handleFirebaseError(error, 'fetching interactions by customer')
    throw error
  }
}

export const addInteraction = async (interactionData: Omit<Interaction, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const interactionsRef = collection(db, 'interactions')
    const docRef = await addDoc(interactionsRef, {
      ...interactionData,
      createdAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding interaction')
    throw error
  }
}

export const updateInteraction = async (interactionId: string, interactionData: Partial<Omit<Interaction, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const interactionRef = doc(db, 'interactions', interactionId)
    await updateDoc(interactionRef, interactionData)
  } catch (error) {
    handleFirebaseError(error, 'updating interaction')
    throw error
  }
}

export const deleteInteraction = async (interactionId: string): Promise<void> => {
  try {
    const interactionRef = doc(db, 'interactions', interactionId)
    await deleteDoc(interactionRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting interaction')
    throw error
  }
}

export const getCRMStats = async (): Promise<CRMStats> => {
  try {
    const allCustomers = await getAllCustomers()
    const allInteractions = await getAllInteractions()
    
    const stats: CRMStats = {
      totalCustomers: allCustomers.length,
      activeCustomers: allCustomers.filter(c => c.status === 'active').length,
      inactiveCustomers: allCustomers.filter(c => c.status === 'inactive').length,
      prospects: allCustomers.filter(c => c.status === 'prospect').length,
      vipCustomers: allCustomers.filter(c => c.status === 'vip').length,
      totalRevenue: allCustomers.reduce((sum, c) => sum + c.totalRevenue, 0),
      averageRevenue: allCustomers.length > 0 ? Math.round(allCustomers.reduce((sum, c) => sum + c.totalRevenue, 0) / allCustomers.length) : 0,
      totalInteractions: allInteractions.length,
      averageInteractions: allCustomers.length > 0 ? Math.round(allInteractions.length / allCustomers.length) : 0
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting CRM stats')
    throw error
  }
}

export const searchCustomers = async (searchTerm: string): Promise<Customer[]> => {
  try {
    const allCustomers = await getAllCustomers()
    
    return allCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    handleFirebaseError(error, 'searching customers')
    throw error
  }
}

// Seed sample CRM data for testing
export const seedCRMSampleData = async () => {
  try {
    const sampleCustomers: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+255 717 123 456",
        company: "Tanzania Ports Authority",
        location: "Dar es Salaam",
        status: "vip",
        totalShipments: 45,
        totalRevenue: 675000,
        lastInteraction: "2024-06-27",
        lastShipment: "2024-06-25",
        notes: "Key client - handles large freight shipments",
        tags: ["VIP", "Freight", "Regular"],
        assignedAgent: "Mike Johnson"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+255 718 234 567",
        company: "Kilimanjaro Coffee Ltd",
        location: "Arusha",
        status: "active",
        totalShipments: 32,
        totalRevenue: 480000,
        lastInteraction: "2024-06-26",
        lastShipment: "2024-06-24",
        notes: "Coffee export specialist",
        tags: ["Export", "Coffee", "Regular"],
        assignedAgent: "Peter Mwamba"
      },
      {
        name: "Robert Wilson",
        email: "robert.wilson@email.com",
        phone: "+255 719 345 678",
        company: "Mwanza Textiles",
        location: "Mwanza",
        status: "active",
        totalShipments: 28,
        totalRevenue: 420000,
        lastInteraction: "2024-06-25",
        lastShipment: "2024-06-23",
        notes: "Textile manufacturer",
        tags: ["Manufacturing", "Textiles"],
        assignedAgent: "Sarah Kimani"
      },
      {
        name: "Sarah Brown",
        email: "sarah.brown@email.com",
        phone: "+255 720 456 789",
        company: "Arusha Cement",
        location: "Arusha",
        status: "active",
        totalShipments: 25,
        totalRevenue: 375000,
        lastInteraction: "2024-06-24",
        lastShipment: "2024-06-22",
        notes: "Construction materials",
        tags: ["Construction", "Cement"],
        assignedAgent: "David Ochieng"
      },
      {
        name: "David Lee",
        email: "david.lee@email.com",
        phone: "+255 721 567 890",
        company: "Dodoma University",
        location: "Dodoma",
        status: "active",
        totalShipments: 22,
        totalRevenue: 330000,
        lastInteraction: "2024-06-23",
        lastShipment: "2024-06-21",
        notes: "Educational institution",
        tags: ["Education", "University"],
        assignedAgent: "Grace Wanjiku"
      },
      {
        name: "Maria Garcia",
        email: "maria.garcia@email.com",
        phone: "+255 722 678 901",
        company: "Tanga Fisheries",
        location: "Tanga",
        status: "prospect",
        totalShipments: 8,
        totalRevenue: 120000,
        lastInteraction: "2024-06-20",
        lastShipment: "2024-06-18",
        notes: "New client - potential for growth",
        tags: ["Fisheries", "Prospect"],
        assignedAgent: "Mike Johnson"
      },
      {
        name: "Ahmed Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+255 723 789 012",
        company: "Mbeya Mining Co",
        location: "Mbeya",
        status: "inactive",
        totalShipments: 15,
        totalRevenue: 225000,
        lastInteraction: "2024-05-15",
        lastShipment: "2024-05-10",
        notes: "Inactive due to mining regulations",
        tags: ["Mining", "Inactive"],
        assignedAgent: "Peter Mwamba"
      }
    ]

    // Add sample customers
    for (const customer of sampleCustomers) {
      await addCustomer(customer)
    }

    // Add sample interactions
    const sampleInteractions: Omit<Interaction, 'id' | 'createdAt'>[] = [
      {
        customerId: "1", // This will be replaced with actual customer ID
        type: "call",
        subject: "Follow up on large shipment",
        description: "Discussed upcoming 20-ton freight shipment to Arusha",
        date: "2024-06-27",
        agent: "Mike Johnson",
        outcome: "positive"
      },
      {
        customerId: "1",
        type: "email",
        subject: "Quote for coffee export",
        description: "Sent detailed quote for coffee export to Europe",
        date: "2024-06-26",
        agent: "Mike Johnson",
        outcome: "positive"
      },
      {
        customerId: "2",
        type: "meeting",
        subject: "Contract renewal discussion",
        description: "Met to discuss contract renewal and new services",
        date: "2024-06-26",
        agent: "Peter Mwamba",
        outcome: "positive"
      },
      {
        customerId: "3",
        type: "shipment",
        subject: "Textile shipment tracking",
        description: "Updated customer on textile shipment status",
        date: "2024-06-25",
        agent: "Sarah Kimani",
        outcome: "neutral"
      }
    ]

    // Get all customers to get their IDs for interactions
    const allCustomers = await getAllCustomers()
    
    // Add sample interactions with correct customer IDs
    for (let i = 0; i < Math.min(sampleInteractions.length, allCustomers.length); i++) {
      const interaction = sampleInteractions[i]
      interaction.customerId = allCustomers[i].id
      await addInteraction(interaction)
    }

    console.log('Sample CRM data seeded successfully')
  } catch (error) {
    handleFirebaseError(error, 'seeding sample CRM data')
    throw error
  }
}

export const getAllShipments = async (): Promise<Shipment[]> => {
  try {
    const shipmentsRef = collection(db, 'shipments')
    const q = query(shipmentsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const shipments: Shipment[] = []
    querySnapshot.forEach((doc) => {
      shipments.push({
        id: doc.id,
        ...doc.data()
      } as Shipment)
    })
    return shipments
  } catch (error) {
    handleFirebaseError(error, 'fetching shipments')
    throw error
  }
}

export const getShipmentsByStatus = async (status: 'pending' | 'in-transit' | 'delivered' | 'cancelled'): Promise<Shipment[]> => {
  try {
    const shipmentsRef = collection(db, 'shipments')
    const q = query(shipmentsRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const shipments: Shipment[] = []
    querySnapshot.forEach((doc) => {
      shipments.push({
        id: doc.id,
        ...doc.data()
      } as Shipment)
    })
    return shipments
  } catch (error) {
    handleFirebaseError(error, 'fetching shipments by status')
    throw error
  }
}

export const getShipmentById = async (shipmentId: string): Promise<Shipment | null> => {
  try {
    const shipmentRef = doc(db, 'shipments', shipmentId)
    const shipmentDoc = await getDoc(shipmentRef)
    if (shipmentDoc.exists()) {
      return {
        id: shipmentDoc.id,
        ...shipmentDoc.data()
      } as Shipment
    }
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching shipment by ID')
    throw error
  }
}

export const addShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const shipmentsRef = collection(db, 'shipments')
    const docRef = await addDoc(shipmentsRef, {
      ...shipmentData,
      createdAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding shipment')
    throw error
  }
}

export const updateShipment = async (shipmentId: string, shipmentData: Partial<Omit<Shipment, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const shipmentRef = doc(db, 'shipments', shipmentId)
    await updateDoc(shipmentRef, shipmentData)
  } catch (error) {
    handleFirebaseError(error, 'updating shipment')
    throw error
  }
}

export const deleteShipment = async (shipmentId: string): Promise<void> => {
  try {
    const shipmentRef = doc(db, 'shipments', shipmentId)
    await deleteDoc(shipmentRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting shipment')
    throw error
  }
}

// Finance Functions
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, 'transactions')
    const q = query(transactionsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      } as Transaction)
    })
    
    return transactions
  } catch (error) {
    handleFirebaseError(error, 'fetching transactions')
    throw error
  }
}

export const getTransactionsByType = async (type: 'income' | 'expense'): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, 'transactions')
    const q = query(transactionsRef, where('type', '==', type), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      } as Transaction)
    })
    
    return transactions
  } catch (error) {
    handleFirebaseError(error, 'fetching transactions by type')
    throw error
  }
}

export const getTransactionsByCategory = async (category: string): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, 'transactions')
    const q = query(transactionsRef, where('category', '==', category), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      } as Transaction)
    })
    
    return transactions
  } catch (error) {
    handleFirebaseError(error, 'fetching transactions by category')
    throw error
  }
}

export const getTransactionsByStatus = async (status: 'completed' | 'pending' | 'cancelled'): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, 'transactions')
    const q = query(transactionsRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      } as Transaction)
    })
    
    return transactions
  } catch (error) {
    handleFirebaseError(error, 'fetching transactions by status')
    throw error
  }
}

export const getTransactionById = async (transactionId: string): Promise<Transaction | null> => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId)
    const transactionDoc = await getDoc(transactionRef)
    
    if (transactionDoc.exists()) {
      return {
        id: transactionDoc.id,
        ...transactionDoc.data()
      } as Transaction
    }
    
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching transaction by ID')
    throw error
  }
}

export const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const transactionsRef = collection(db, 'transactions')
    const docRef = await addDoc(transactionsRef, {
      ...transactionData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding transaction')
    throw error
  }
}

export const updateTransaction = async (transactionId: string, transactionData: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId)
    await updateDoc(transactionRef, {
      ...transactionData,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating transaction')
    throw error
  }
}

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId)
    await deleteDoc(transactionRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting transaction')
    throw error
  }
}

export const updateTransactionStatus = async (transactionId: string, status: 'completed' | 'pending' | 'cancelled'): Promise<void> => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId)
    await updateDoc(transactionRef, {
      status: status,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating transaction status')
    throw error
  }
}

export const getFinancialSummary = async (): Promise<FinancialSummary> => {
  try {
    const allTransactions = await getAllTransactions()
    
    // Calculate totals
    const totalIncome = allTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = allTransactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0
    
    // Calculate monthly totals (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const monthlyTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= thirtyDaysAgo && t.status === 'completed'
    })
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    // Calculate outstanding amounts
    const outstandingReceivables = allTransactions
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const outstandingPayables = allTransactions
      .filter(t => t.type === 'expense' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const cashFlow = monthlyIncome - monthlyExpenses
    
    // Mock bank balance (in real app, this would come from bank integration)
    const bankBalance = 1250000
    
    const summary: FinancialSummary = {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      monthlyIncome,
      monthlyExpenses,
      outstandingReceivables,
      outstandingPayables,
      cashFlow,
      bankBalance,
      lastUpdated: Timestamp.now()
    }
    
    return summary
  } catch (error) {
    handleFirebaseError(error, 'getting financial summary')
    throw error
  }
}

export const getTransactionStats = async () => {
  try {
    const allTransactions = await getAllTransactions()
    
    const stats = {
      total: allTransactions.length,
      income: allTransactions.filter(t => t.type === 'income').length,
      expense: allTransactions.filter(t => t.type === 'expense').length,
      completed: allTransactions.filter(t => t.status === 'completed').length,
      pending: allTransactions.filter(t => t.status === 'pending').length,
      cancelled: allTransactions.filter(t => t.status === 'cancelled').length,
      totalIncome: allTransactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: allTransactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting transaction stats')
    throw error
  }
}

export const searchTransactions = async (searchTerm: string): Promise<Transaction[]> => {
  try {
    const allTransactions = await getAllTransactions()
    
    return allTransactions.filter(transaction => 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    handleFirebaseError(error, 'searching transactions')
    throw error
  }
}

export const seedFinanceSampleData = async () => {
  try {
    const sampleTransactions: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: "income",
        category: "Freight Services",
        subcategory: "International Freight",
        amount: 125000,
        description: "Freight shipment to Europe - Coffee export",
        date: "2024-06-27",
        paymentMethod: "Bank Transfer",
        status: "completed",
        reference: "INV-2024-001",
        notes: "Client: Kilimanjaro Coffee Ltd"
      },
      {
        type: "expense",
        category: "Operations",
        subcategory: "Fuel",
        amount: 45000,
        description: "Diesel fuel for fleet vehicles",
        date: "2024-06-27",
        paymentMethod: "Credit Card",
        status: "completed",
        reference: "EXP-2024-156",
        notes: "Shell station - Dar es Salaam"
      },
      {
        type: "income",
        category: "Moving Services",
        subcategory: "Residential Moving",
        amount: 85000,
        description: "House moving service - Arusha to Dar es Salaam",
        date: "2024-06-26",
        paymentMethod: "Cash",
        status: "completed",
        reference: "INV-2024-002",
        notes: "Client: John Doe"
      },
      {
        type: "expense",
        category: "Administrative",
        subcategory: "Office Rent",
        amount: 120000,
        description: "Monthly office rent payment",
        date: "2024-06-25",
        paymentMethod: "Bank Transfer",
        status: "completed",
        reference: "EXP-2024-155",
        notes: "Office building - City Centre"
      },
      {
        type: "expense",
        category: "Payroll",
        subcategory: "Salaries",
        amount: 350000,
        description: "Monthly staff salaries",
        date: "2024-06-25",
        paymentMethod: "Bank Transfer",
        status: "completed",
        reference: "EXP-2024-154",
        notes: "24 employees"
      },
      {
        type: "income",
        category: "Courier Services",
        subcategory: "Express Delivery",
        amount: 25000,
        description: "Express package delivery service",
        date: "2024-06-24",
        paymentMethod: "Mobile Money",
        status: "completed",
        reference: "INV-2024-003",
        notes: "Client: Sarah Brown"
      },
      {
        type: "expense",
        category: "Utilities",
        subcategory: "Electricity",
        amount: 15000,
        description: "Monthly electricity bill",
        date: "2024-06-24",
        paymentMethod: "Bank Transfer",
        status: "completed",
        reference: "EXP-2024-153",
        notes: "TANESCO bill"
      },
      {
        type: "expense",
        category: "Insurance",
        subcategory: "Vehicle Insurance",
        amount: 25000,
        description: "Fleet vehicle insurance premium",
        date: "2024-06-23",
        paymentMethod: "Bank Transfer",
        status: "completed",
        reference: "EXP-2024-152",
        notes: "AAR Insurance"
      },
      {
        type: "income",
        category: "Freight Services",
        subcategory: "Local Freight",
        amount: 95000,
        description: "Local freight transportation",
        date: "2024-06-23",
        paymentMethod: "Bank Transfer",
        status: "pending",
        reference: "INV-2024-004",
        notes: "Client: Mwanza Textiles"
      },
      {
        type: "expense",
        category: "Marketing",
        subcategory: "Advertising",
        amount: 30000,
        description: "Online advertising campaign",
        date: "2024-06-22",
        paymentMethod: "Credit Card",
        status: "completed",
        reference: "EXP-2024-151",
        notes: "Google Ads campaign"
      }
    ]
    
    for (const transaction of sampleTransactions) {
      await addTransaction(transaction)
    }
    
    console.log('Finance sample data seeded successfully')
  } catch (error) {
    handleFirebaseError(error, 'seeding finance sample data')
    throw error
  }
}

// Department Functions
export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const departmentsRef = collection(db, 'departments')
    const q = query(departmentsRef, orderBy('name', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const departments: Department[] = []
    querySnapshot.forEach((doc) => {
      departments.push({
        id: doc.id,
        ...doc.data()
      } as Department)
    })
    
    return departments
  } catch (error) {
    handleFirebaseError(error, 'fetching departments')
    throw error
  }
}

export const addDepartment = async (departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const departmentsRef = collection(db, 'departments')
    const docRef = await addDoc(departmentsRef, {
      ...departmentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding department')
    throw error
  }
}

export const updateDepartment = async (departmentId: string, departmentData: Partial<Omit<Department, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const departmentRef = doc(db, 'departments', departmentId)
    await updateDoc(departmentRef, {
      ...departmentData,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating department')
    throw error
  }
}

export const deleteDepartment = async (departmentId: string): Promise<void> => {
  try {
    const departmentRef = doc(db, 'departments', departmentId)
    await deleteDoc(departmentRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting department')
    throw error
  }
}

export const getDepartmentById = async (departmentId: string): Promise<Department | null> => {
  try {
    const departmentRef = doc(db, 'departments', departmentId)
    const departmentDoc = await getDoc(departmentRef)
    
    if (departmentDoc.exists()) {
      return {
        id: departmentDoc.id,
        ...departmentDoc.data()
      } as Department
    }
    
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching department by ID')
    throw error
  }
}

export const updateDepartmentStatus = async (departmentId: string, status: 'active' | 'inactive' | 'restructuring'): Promise<void> => {
  try {
    const departmentRef = doc(db, 'departments', departmentId)
    await updateDoc(departmentRef, {
      status: status,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating department status')
    throw error
  }
}

export const updateDepartmentBudget = async (departmentId: string, budget: number): Promise<void> => {
  try {
    const departmentRef = doc(db, 'departments', departmentId)
    await updateDoc(departmentRef, {
      budget: budget,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating department budget')
    throw error
  }
}

export const updateDepartmentEmployeeCount = async (departmentId: string, employeeCount: number): Promise<void> => {
  try {
    const departmentRef = doc(db, 'departments', departmentId)
    await updateDoc(departmentRef, {
      employeeCount: employeeCount,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating department employee count')
    throw error
  }
}

export const getDepartmentStats = async (): Promise<DepartmentStats> => {
  try {
    const allDepartments = await getAllDepartments()
    
    const stats: DepartmentStats = {
      total: allDepartments.length,
      active: allDepartments.filter(dept => dept.status === 'active').length,
      inactive: allDepartments.filter(dept => dept.status === 'inactive').length,
      restructuring: allDepartments.filter(dept => dept.status === 'restructuring').length,
      totalEmployees: allDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0),
      totalBudget: allDepartments.reduce((sum, dept) => sum + dept.budget, 0),
      averageEmployees: allDepartments.length > 0 ? Math.round(allDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0) / allDepartments.length) : 0
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting department stats')
    throw error
  }
}

export const searchDepartments = async (searchTerm: string): Promise<Department[]> => {
  try {
    const allDepartments = await getAllDepartments()
    
    return allDepartments.filter(department =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    handleFirebaseError(error, 'searching departments')
    throw error
  }
}

export const seedDepartmentSampleData = async () => {
  try {
    const sampleDepartments: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: "Operations",
        code: "OPS",
        description: "Handles all logistics operations including freight, moving, and courier services",
        manager: "John Mwamba",
        location: "Dar es Salaam",
        budget: 2500000,
        employeeCount: 45,
        status: "active"
      },
      {
        name: "Sales & Marketing",
        code: "SALES",
        description: "Responsible for customer acquisition, sales strategies, and marketing campaigns",
        manager: "Sarah Kimani",
        location: "Dar es Salaam",
        budget: 1800000,
        employeeCount: 28,
        status: "active"
      },
      {
        name: "Finance & Accounting",
        code: "FIN",
        description: "Manages financial operations, accounting, budgeting, and financial reporting",
        manager: "David Ochieng",
        location: "Dar es Salaam",
        budget: 1200000,
        employeeCount: 15,
        status: "active"
      },
      {
        name: "Human Resources",
        code: "HR",
        description: "Handles recruitment, employee relations, training, and HR policies",
        manager: "Grace Wanjiku",
        location: "Dar es Salaam",
        budget: 800000,
        employeeCount: 12,
        status: "active"
      },
      {
        name: "IT & Technology",
        code: "IT",
        description: "Manages IT infrastructure, software development, and technology solutions",
        manager: "Mike Johnson",
        location: "Dar es Salaam",
        budget: 1500000,
        employeeCount: 18,
        status: "active"
      },
      {
        name: "Customer Service",
        code: "CS",
        description: "Provides customer support, handles inquiries, and maintains customer relationships",
        manager: "Peter Mwamba",
        location: "Dar es Salaam",
        budget: 900000,
        employeeCount: 22,
        status: "active"
      },
      {
        name: "Fleet Management",
        code: "FLEET",
        description: "Manages vehicle fleet, maintenance, and driver coordination",
        manager: "Ahmed Hassan",
        location: "Dar es Salaam",
        budget: 2000000,
        employeeCount: 35,
        status: "active"
      },
      {
        name: "Quality Assurance",
        code: "QA",
        description: "Ensures service quality, compliance, and process improvement",
        manager: "Maria Garcia",
        location: "Dar es Salaam",
        budget: 600000,
        employeeCount: 8,
        status: "active"
      }
    ]
    
    for (const department of sampleDepartments) {
      await addDepartment(department)
    }
    
    console.log('Department sample data seeded successfully')
  } catch (error) {
    handleFirebaseError(error, 'seeding department sample data')
    throw error
  }
}

// Inventory Functions
export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const itemsRef = collection(db, 'inventoryItems')
    const q = query(itemsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const items: InventoryItem[] = []
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem)
    })
    
    return items
  } catch (error) {
    handleFirebaseError(error, 'fetching inventory items')
    throw error
  }
}

export const getInventoryItemsByStatus = async (status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued'): Promise<InventoryItem[]> => {
  try {
    const itemsRef = collection(db, 'inventoryItems')
    const q = query(itemsRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const items: InventoryItem[] = []
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem)
    })
    
    return items
  } catch (error) {
    handleFirebaseError(error, 'fetching inventory items by status')
    throw error
  }
}

export const getInventoryItemsByCategory = async (category: string): Promise<InventoryItem[]> => {
  try {
    const itemsRef = collection(db, 'inventoryItems')
    const q = query(itemsRef, where('category', '==', category), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const items: InventoryItem[] = []
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem)
    })
    
    return items
  } catch (error) {
    handleFirebaseError(error, 'fetching inventory items by category')
    throw error
  }
}

export const getInventoryItemById = async (itemId: string): Promise<InventoryItem | null> => {
  try {
    const itemRef = doc(db, 'inventoryItems', itemId)
    const itemDoc = await getDoc(itemRef)
    
    if (itemDoc.exists()) {
      return {
        id: itemDoc.id,
        ...itemDoc.data()
      } as InventoryItem
    }
    
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching inventory item by ID')
    throw error
  }
}

export const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated'>): Promise<string> => {
  try {
    const itemsRef = collection(db, 'inventoryItems')
    const docRef = await addDoc(itemsRef, {
      ...itemData,
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding inventory item')
    throw error
  }
}

export const updateInventoryItem = async (itemId: string, itemData: Partial<Omit<InventoryItem, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const itemRef = doc(db, 'inventoryItems', itemId)
    await updateDoc(itemRef, {
      ...itemData,
      lastUpdated: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating inventory item')
    throw error
  }
}

export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, 'inventoryItems', itemId)
    await deleteDoc(itemRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting inventory item')
    throw error
  }
}

export const updateInventoryQuantity = async (itemId: string, quantity: number): Promise<void> => {
  try {
    const itemRef = doc(db, 'inventoryItems', itemId)
    const itemDoc = await getDoc(itemRef)
    
    if (itemDoc.exists()) {
      const itemData = itemDoc.data() as InventoryItem
      const totalValue = quantity * itemData.unitPrice
      
      // Determine status based on quantity
      let status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued' = 'in-stock'
      if (quantity === 0) {
        status = 'out-of-stock'
      } else if (quantity <= itemData.minQuantity) {
        status = 'low-stock'
      }
      
      await updateDoc(itemRef, {
        quantity: quantity,
        totalValue: totalValue,
        status: status,
        lastUpdated: Timestamp.now()
      })
    }
  } catch (error) {
    handleFirebaseError(error, 'updating inventory quantity')
    throw error
  }
}

export const getAllInventoryCategories = async (): Promise<InventoryCategory[]> => {
  try {
    const categoriesRef = collection(db, 'inventoryCategories')
    const q = query(categoriesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const categories: InventoryCategory[] = []
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      } as InventoryCategory)
    })
    
    return categories
  } catch (error) {
    handleFirebaseError(error, 'fetching inventory categories')
    throw error
  }
}

export const addInventoryCategory = async (categoryData: Omit<InventoryCategory, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const categoriesRef = collection(db, 'inventoryCategories')
    const docRef = await addDoc(categoriesRef, {
      ...categoryData,
      createdAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding inventory category')
    throw error
  }
}

export const getAllInventorySuppliers = async (): Promise<InventorySupplier[]> => {
  try {
    const suppliersRef = collection(db, 'inventorySuppliers')
    const q = query(suppliersRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const suppliers: InventorySupplier[] = []
    querySnapshot.forEach((doc) => {
      suppliers.push({
        id: doc.id,
        ...doc.data()
      } as InventorySupplier)
    })
    
    return suppliers
  } catch (error) {
    handleFirebaseError(error, 'fetching inventory suppliers')
    throw error
  }
}

export const addInventorySupplier = async (supplierData: Omit<InventorySupplier, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const suppliersRef = collection(db, 'inventorySuppliers')
    const docRef = await addDoc(suppliersRef, {
      ...supplierData,
      createdAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding inventory supplier')
    throw error
  }
}

export const getInventoryStats = async (): Promise<InventoryStats> => {
  try {
    const allItems = await getAllInventoryItems()
    
    const stats: InventoryStats = {
      totalItems: allItems.length,
      totalValue: allItems.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockItems: allItems.filter(item => item.status === 'low-stock').length,
      outOfStockItems: allItems.filter(item => item.status === 'out-of-stock').length,
      totalCategories: 0, // Will be calculated separately
      totalSuppliers: 0, // Will be calculated separately
      averageItemValue: allItems.length > 0 ? Math.round(allItems.reduce((sum, item) => sum + item.totalValue, 0) / allItems.length) : 0
    }
    
    // Get categories and suppliers count
    try {
      const [categories, suppliers] = await Promise.all([
        getAllInventoryCategories(),
        getAllInventorySuppliers()
      ])
      stats.totalCategories = categories.length
      stats.totalSuppliers = suppliers.length
    } catch (error) {
      handleFirebaseError(error, 'getting categories/suppliers count')
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting inventory stats')
    throw error
  }
}

export const getShipmentStats = async () => {
  try {
    const allShipments = await getAllShipments()
    
    const stats = {
      total: allShipments.length,
      pending: allShipments.filter(shipment => shipment.status === 'pending').length,
      inTransit: allShipments.filter(shipment => shipment.status === 'in-transit').length,
      delivered: allShipments.filter(shipment => shipment.status === 'delivered').length,
      cancelled: allShipments.filter(shipment => shipment.status === 'cancelled').length,
      active: allShipments.filter(shipment => shipment.status === 'pending' || shipment.status === 'in-transit').length
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting shipment stats')
    throw error
  }
}

export const getAgentStats = async () => {
  try {
    const allAgents = await getAllAgents()
    
    const stats = {
      total: allAgents.length,
      active: allAgents.filter(agent => agent.status === 'active').length,
      inactive: allAgents.filter(agent => agent.status === 'inactive').length,
      suspended: allAgents.filter(agent => agent.status === 'suspended').length,
      pending: 0, // This would come from applications
      totalDeliveries: allAgents.reduce((sum, agent) => sum + agent.totalDeliveries, 0),
      totalEarnings: allAgents.reduce((sum, agent) => sum + agent.totalEarnings, 0),
      averageRating: allAgents.length > 0 ? Math.round(allAgents.reduce((sum, agent) => sum + agent.rating, 0) / allAgents.length * 10) / 10 : 0
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting agent stats')
    throw error
  }
}

export const getDriverStats = async () => {
  try {
    const allDrivers = await getAllDrivers()
    
    const stats = {
      total: allDrivers.length,
      available: allDrivers.filter(driver => driver.status === 'available').length,
      busy: allDrivers.filter(driver => driver.status === 'busy').length,
      offline: allDrivers.filter(driver => driver.status === 'offline').length,
      suspended: allDrivers.filter(driver => driver.status === 'suspended').length,
      onRoute: allDrivers.filter(driver => driver.status === 'busy').length,
      totalDeliveries: allDrivers.reduce((sum, driver) => sum + driver.totalDeliveries, 0),
      totalEarnings: allDrivers.reduce((sum, driver) => sum + driver.totalEarnings, 0),
      averageRating: allDrivers.length > 0 ? Math.round(allDrivers.reduce((sum, driver) => sum + driver.rating, 0) / allDrivers.length * 10) / 10 : 0
    }
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getting driver stats')
    throw error
  }
}

export const searchInventoryItems = async (searchTerm: string): Promise<InventoryItem[]> => {
  try {
    const allItems = await getAllInventoryItems()
    
    return allItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  } catch (error) {
    handleFirebaseError(error, 'searching inventory items')
    throw error
  }
}

export const seedInventorySampleData = async () => {
  try {
    const sampleItems: Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated'>[] = [
      {
        name: "Diesel Fuel",
        sku: "FUEL-DSL-001",
        category: "Fuel",
        description: "Diesel fuel for fleet vehicles",
        supplier: "Shell Tanzania",
        unit: "Liters",
        quantity: 5000,
        minQuantity: 1000,
        maxQuantity: 10000,
        unitPrice: 2500,
        totalValue: 12500000,
        location: "Main Warehouse",
        status: "in-stock"
      },
      {
        name: "Truck Tires",
        sku: "TIRE-TRK-001",
        category: "Vehicle Parts",
        description: "Heavy-duty truck tires",
        supplier: "Bridgestone Tanzania",
        unit: "Pieces",
        quantity: 24,
        minQuantity: 10,
        maxQuantity: 50,
        unitPrice: 150000,
        totalValue: 3600000,
        location: "Parts Warehouse",
        status: "in-stock"
      },
      {
        name: "Engine Oil",
        sku: "OIL-ENG-001",
        category: "Lubricants",
        description: "Engine oil for trucks and vehicles",
        supplier: "Castrol Tanzania",
        unit: "Liters",
        quantity: 200,
        minQuantity: 50,
        maxQuantity: 500,
        unitPrice: 8000,
        totalValue: 1600000,
        location: "Main Warehouse",
        status: "in-stock"
      },
      {
        name: "Brake Pads",
        sku: "BRAKE-PAD-001",
        category: "Vehicle Parts",
        description: "Brake pads for trucks",
        supplier: "Bridgestone Tanzania",
        unit: "Sets",
        quantity: 8,
        minQuantity: 15,
        maxQuantity: 30,
        unitPrice: 45000,
        totalValue: 360000,
        location: "Parts Warehouse",
        status: "low-stock"
      },
      {
        name: "Air Filters",
        sku: "FILTER-AIR-001",
        category: "Vehicle Parts",
        description: "Air filters for engines",
        supplier: "Bridgestone Tanzania",
        unit: "Pieces",
        quantity: 0,
        minQuantity: 20,
        maxQuantity: 100,
        unitPrice: 12000,
        totalValue: 0,
        location: "Parts Warehouse",
        status: "out-of-stock"
      },
      {
        name: "GPS Devices",
        sku: "GPS-DEV-001",
        category: "Electronics",
        description: "GPS tracking devices for fleet",
        supplier: "Tech Solutions Ltd",
        unit: "Pieces",
        quantity: 15,
        minQuantity: 5,
        maxQuantity: 25,
        unitPrice: 85000,
        totalValue: 1275000,
        location: "Electronics Storage",
        status: "in-stock"
      },
      {
        name: "Safety Vests",
        sku: "SAFETY-VEST-001",
        category: "Safety Equipment",
        description: "High-visibility safety vests",
        supplier: "Safety Gear Co",
        unit: "Pieces",
        quantity: 100,
        minQuantity: 30,
        maxQuantity: 150,
        unitPrice: 15000,
        totalValue: 1500000,
        location: "Safety Equipment",
        status: "in-stock"
      },
      {
        name: "First Aid Kits",
        sku: "FIRST-AID-001",
        category: "Safety Equipment",
        description: "Complete first aid kits for vehicles",
        supplier: "Safety Gear Co",
        unit: "Kits",
        quantity: 25,
        minQuantity: 10,
        maxQuantity: 40,
        unitPrice: 25000,
        totalValue: 625000,
        location: "Safety Equipment",
        status: "in-stock"
      }
    ]
    
    for (const item of sampleItems) {
      await addInventoryItem(item)
    }
    
    // Add sample categories
    const sampleCategories: Omit<InventoryCategory, 'id' | 'createdAt'>[] = [
      {
        name: "Fuel",
        description: "Fuel and petroleum products",
        itemCount: 1,
        totalValue: 12500000
      },
      {
        name: "Vehicle Parts",
        description: "Spare parts for vehicles and trucks",
        itemCount: 3,
        totalValue: 3960000
      },
      {
        name: "Lubricants",
        description: "Engine oils and lubricants",
        itemCount: 1,
        totalValue: 1600000
      },
      {
        name: "Electronics",
        description: "Electronic devices and equipment",
        itemCount: 1,
        totalValue: 1275000
      },
      {
        name: "Safety Equipment",
        description: "Safety gear and protective equipment",
        itemCount: 2,
        totalValue: 2125000
      }
    ]
    
    for (const category of sampleCategories) {
      await addInventoryCategory(category)
    }
    
    // Add sample suppliers
    const sampleSuppliers: Omit<InventorySupplier, 'id' | 'createdAt'>[] = [
      {
        name: "Shell Tanzania",
        contactPerson: "John Mwamba",
        email: "john.mwamba@shell.co.tz",
        phone: "+255 717 123 456",
        address: "Dar es Salaam, Tanzania",
        itemsSupplied: 1,
        totalSpent: 12500000,
        status: "active"
      },
      {
        name: "Bridgestone Tanzania",
        contactPerson: "Sarah Kimani",
        email: "sarah.kimani@bridgestone.co.tz",
        phone: "+255 718 234 567",
        address: "Dar es Salaam, Tanzania",
        itemsSupplied: 3,
        totalSpent: 3960000,
        status: "active"
      },
      {
        name: "Castrol Tanzania",
        contactPerson: "David Ochieng",
        email: "david.ochieng@castrol.co.tz",
        phone: "+255 719 345 678",
        address: "Dar es Salaam, Tanzania",
        itemsSupplied: 1,
        totalSpent: 1600000,
        status: "active"
      },
      {
        name: "Tech Solutions Ltd",
        contactPerson: "Grace Wanjiku",
        email: "grace.wanjiku@techsolutions.co.tz",
        phone: "+255 720 456 789",
        address: "Dar es Salaam, Tanzania",
        itemsSupplied: 1,
        totalSpent: 1275000,
        status: "active"
      },
      {
        name: "Safety Gear Co",
        contactPerson: "Mike Johnson",
        email: "mike.johnson@safetygear.co.tz",
        phone: "+255 721 567 890",
        address: "Dar es Salaam, Tanzania",
        itemsSupplied: 2,
        totalSpent: 2125000,
        status: "active"
      }
    ]
    
    for (const supplier of sampleSuppliers) {
      await addInventorySupplier(supplier)
    }
    
    console.log('Inventory sample data seeded successfully')
  } catch (error) {
    handleFirebaseError(error, 'seeding inventory sample data')
    throw error
  }
}

// Agent Functions
export const getAllAgents = async (): Promise<Agent[]> => {
  try {
    const agentsRef = collection(db, 'agents')
    const q = query(agentsRef, orderBy('joinedDate', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const agents: Agent[] = []
    querySnapshot.forEach((doc) => {
      agents.push({
        id: doc.id,
        ...doc.data()
      } as Agent)
    })
    
    return agents
  } catch (error) {
    handleFirebaseError(error, 'fetching agents')
    throw error
  }
}

export const addAgent = async (agentData: Omit<Agent, 'id' | 'joinedDate' | 'lastActive' | 'totalDeliveries' | 'totalEarnings' | 'rating'>) => {
  try {
    const agentsRef = collection(db, 'agents')
    const newAgent = {
      ...agentData,
      totalDeliveries: 0,
      totalEarnings: 0,
      rating: 0,
      joinedDate: Timestamp.now(),
      lastActive: Timestamp.now()
    }
    const docRef = await addDoc(agentsRef, newAgent)
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding agent')
    throw error
  }
}

export const updateAgent = async (agentId: string, updates: Partial<Agent>) => {
  try {
    const agentRef = doc(db, 'agents', agentId)
    await updateDoc(agentRef, {
      ...updates,
      lastActive: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating agent')
    throw error
  }
}

export const deleteAgent = async (agentId: string) => {
  try {
    const agentRef = doc(db, 'agents', agentId)
    await deleteDoc(agentRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting agent')
    throw error
  }
}

export const getAgentsByRegion = async (region: string): Promise<Agent[]> => {
  try {
    const agentsRef = collection(db, 'agents')
    const q = query(agentsRef, where('region', '==', region), where('status', '==', 'active'))
    const querySnapshot = await getDocs(q)
    
    const agents: Agent[] = []
    querySnapshot.forEach((doc) => {
      agents.push({
        id: doc.id,
        ...doc.data()
      } as Agent)
    })
    
    return agents
  } catch (error) {
    handleFirebaseError(error, 'fetching agents by region')
    throw error
  }
}

// Driver Functions
export const getAllDrivers = async (): Promise<Driver[]> => {
  try {
    const driversRef = collection(db, 'drivers')
    const q = query(driversRef, orderBy('joinedDate', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const drivers: Driver[] = []
    querySnapshot.forEach((doc) => {
      drivers.push({
        id: doc.id,
        ...doc.data()
      } as Driver)
    })
    
    return drivers
  } catch (error) {
    handleFirebaseError(error, 'fetching drivers')
    throw error
  }
}

export const addDriver = async (driverData: Omit<Driver, 'id' | 'joinedDate' | 'lastActive' | 'totalDeliveries' | 'totalEarnings' | 'rating'>) => {
  try {
    const driversRef = collection(db, 'drivers')
    const newDriver = {
      ...driverData,
      totalDeliveries: 0,
      totalEarnings: 0,
      rating: 0,
      joinedDate: Timestamp.now(),
      lastActive: Timestamp.now()
    }
    const docRef = await addDoc(driversRef, newDriver)
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding driver')
    throw error
  }
}

export const updateDriver = async (driverId: string, updates: Partial<Driver>) => {
  try {
    const driverRef = doc(db, 'drivers', driverId)
    await updateDoc(driverRef, {
      ...updates,
      lastActive: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating driver')
    throw error
  }
}

export const deleteDriver = async (driverId: string) => {
  try {
    const driverRef = doc(db, 'drivers', driverId)
    await deleteDoc(driverRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting driver')
    throw error
  }
}

export const getAvailableDrivers = async (): Promise<Driver[]> => {
  try {
    const driversRef = collection(db, 'drivers')
    const q = query(driversRef, where('status', '==', 'available'))
    const querySnapshot = await getDocs(q)
    
    const drivers: Driver[] = []
    querySnapshot.forEach((doc) => {
      drivers.push({
        id: doc.id,
        ...doc.data()
      } as Driver)
    })
    
    return drivers
  } catch (error) {
    handleFirebaseError(error, 'fetching available drivers')
    throw error
  }
}

export const findNearestDriver = async (latitude: number, longitude: number, maxDistance: number = 10): Promise<Driver | null> => {
  try {
    const availableDrivers = await getAvailableDrivers()
    
    if (availableDrivers.length === 0) {
      return null
    }
    
    // Calculate distance for each driver and find the nearest one
    let nearestDriver: Driver | null = null
    let shortestDistance = Infinity
    
    availableDrivers.forEach(driver => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        driver.location.latitude, 
        driver.location.longitude
      )
      
      if (distance <= maxDistance && distance < shortestDistance) {
        shortestDistance = distance
        nearestDriver = driver
      }
    })
    
    return nearestDriver
  } catch (error) {
    handleFirebaseError(error, 'finding nearest driver')
    throw error
  }
}

// Helper function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c // Distance in kilometers
  return distance
}

// Seed sample data for testing
export const seedSampleAgentsAndDrivers = async () => {
  try {
    // Sample agents data
    const sampleAgents = [
      {
        name: "John Mwangi",
        phone: "+255 717 123 456",
        email: "john.mwangi@arenologistics.com",
        location: "Dar es Salaam City Centre",
        address: "123 Uhuru Street, Dar es Salaam",
        region: "Dar es Salaam",
        district: "Kinondoni",
        status: 'active' as const,
        commission: 15,
        documents: {},
        notes: "Experienced agent with 3 years in logistics"
      },
      {
        name: "Sarah Kimani",
        phone: "+255 718 234 567",
        email: "sarah.kimani@arenologistics.com",
        location: "Arusha Town",
        address: "456 Market Street, Arusha",
        region: "Arusha",
        district: "Arusha City",
        status: 'active' as const,
        commission: 12,
        documents: {},
        notes: "New agent, excellent customer service skills"
      },
      {
        name: "Michael Ochieng",
        phone: "+255 719 345 678",
        email: "michael.ochieng@arenologistics.com",
        location: "Mwanza City",
        address: "789 Lake Road, Mwanza",
        region: "Mwanza",
        district: "Mwanza City",
        status: 'inactive' as const,
        commission: 10,
        documents: {},
        notes: "On temporary leave"
      }
    ]

    // Sample drivers data
    const sampleDrivers = [
      {
        name: "David Njoroge",
        phone: "+255 720 456 789",
        email: "david.njoroge@arenologistics.com",
        vehicleType: 'motorcycle' as const,
        vehicleNumber: "TZ 123 ABC",
        licenseNumber: "DL-2024-001",
        location: {
          latitude: -6.8235,
          longitude: 39.2695,
          address: "Dar es Salaam City Centre"
        },
        region: "Dar es Salaam",
        district: "Kinondoni",
        status: 'available' as const,
        documents: {},
        notes: "Reliable motorcycle driver"
      },
      {
        name: "Grace Wanjiku",
        phone: "+255 721 567 890",
        email: "grace.wanjiku@arenologistics.com",
        vehicleType: 'motorcycle' as const,
        vehicleNumber: "TZ 456 DEF",
        licenseNumber: "DL-2024-002",
        location: {
          latitude: -6.8500,
          longitude: 39.3000,
          address: "Oyster Bay, Dar es Salaam"
        },
        region: "Dar es Salaam",
        district: "Kinondoni",
        status: 'available' as const,
        documents: {},
        notes: "Experienced in city deliveries"
      },
      {
        name: "Peter Odhiambo",
        phone: "+255 722 678 901",
        email: "peter.odhiambo@arenologistics.com",
        vehicleType: 'car' as const,
        vehicleNumber: "TZ 789 GHI",
        licenseNumber: "DL-2024-003",
        location: {
          latitude: -6.8000,
          longitude: 39.2500,
          address: "Mikocheni, Dar es Salaam"
        },
        region: "Dar es Salaam",
        district: "Kinondoni",
        status: 'busy' as const,
        documents: {},
        notes: "Car driver for large packages"
      }
    ]

    // Add agents
    for (const agentData of sampleAgents) {
      await addAgent(agentData)
    }

    // Add drivers
    for (const driverData of sampleDrivers) {
      await addDriver(driverData)
    }

    console.log('Sample agents and drivers data seeded successfully')
  } catch (error) {
    handleFirebaseError(error, 'seeding sample agents and drivers data')
    throw error
  }
}

// Role Functions
export const getAllRoles = async (): Promise<Role[]> => {
  try {
    const rolesRef = collection(db, 'roles')
    const q = query(rolesRef, orderBy('level', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const roles: Role[] = []
    querySnapshot.forEach((doc) => {
      roles.push({
        id: doc.id,
        ...doc.data()
      } as Role)
    })
    
    return roles
  } catch (error) {
    handleFirebaseError(error, 'fetching roles')
    throw error
  }
}

export const addRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const rolesRef = collection(db, 'roles')
    const docRef = await addDoc(rolesRef, {
      ...roleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding role')
    throw error
  }
}

export const deleteRole = async (roleId: string): Promise<void> => {
  try {
    const roleRef = doc(db, 'roles', roleId)
    await deleteDoc(roleRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting role')
    throw error
  }
}

export const getRoleById = async (roleId: string): Promise<Role | null> => {
  try {
    const roleRef = doc(db, 'roles', roleId)
    const roleDoc = await getDoc(roleRef)
    
    if (roleDoc.exists()) {
      return {
        id: roleDoc.id,
        ...roleDoc.data()
      } as Role
    }
    
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching role by ID')
    throw error
  }
}

// Seed sample employee data for testing
export interface AnalyticsData {
  revenue: {
    total: number
    monthly: number
    growth: number
    byService: { service: string; amount: number; percentage: number }[]
  }
  services: {
    total: number
    byType: { type: string; count: number; percentage: number }[]
    byStatus: { status: string; count: number; percentage: number }[]
  }
  routes: {
    total: number
    popular: { route: string; count: number; revenue: number }[]
    byRegion: { region: string; count: number; percentage: number }[]
  }
  agents: {
    total: number
    active: number
    performance: { name: string; shipments: number; rating: number; revenue: number }[]
  }
  clients: {
    total: number
    newThisMonth: number
    byLocation: { location: string; count: number; percentage: number }[]
    topClients: { name: string; shipments: number; revenue: number }[]
  }
  timeData: {
    daily: { date: string; shipments: number; revenue: number }[]
    monthly: { month: string; shipments: number; revenue: number }[]
  }
}

export const getAnalyticsData = async (filters?: {
  timeFilter?: string
  serviceFilter?: string
  regionFilter?: string
}): Promise<AnalyticsData> => {
  try {
    // Get all required data
    const [shipments, transactions, customers, agents, drivers] = await Promise.all([
      getAllShipments(),
      getAllTransactions(),
      getAllCustomers(),
      getAllAgents(),
      getAllDrivers()
    ])

    // Apply filters
    let filteredShipments = shipments
    let filteredTransactions = transactions

    // Apply service filter
    if (filters?.serviceFilter && filters.serviceFilter !== 'all') {
      filteredShipments = shipments.filter(shipment => 
        shipment.serviceType.toLowerCase() === filters.serviceFilter?.toLowerCase()
      )
    }

    // Apply region filter
    if (filters?.regionFilter && filters.regionFilter !== 'all') {
      filteredShipments = filteredShipments.filter(shipment => {
        const locationParts = shipment.pickupLocation.split(',').map(part => part.trim())
        const region = locationParts.length > 1 ? locationParts[1] : 'Unknown'
        return region.toLowerCase() === filters.regionFilter?.toLowerCase()
      })
    }

    // Apply time filter
    if (filters?.timeFilter) {
      const currentDate = new Date()
      let startDate = new Date()

      switch (filters.timeFilter) {
        case '7d':
          startDate.setDate(currentDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(currentDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(currentDate.getDate() - 90)
          break
        case '1y':
          startDate.setFullYear(currentDate.getFullYear() - 1)
          break
        default:
          startDate = new Date(0) // All time
      }

      filteredShipments = filteredShipments.filter(shipment => {
        const shipmentDate = new Date(shipment.createdAt.toDate())
        return shipmentDate >= startDate && shipmentDate <= currentDate
      })

      filteredTransactions = filteredTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= startDate && transactionDate <= currentDate
      })
    }

    // Calculate revenue data
    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income')
    const totalRevenue = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
    const monthlyRevenue = incomeTransactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        const currentDate = new Date()
        return transactionDate.getMonth() === currentDate.getMonth() && 
               transactionDate.getFullYear() === currentDate.getFullYear()
      })
      .reduce((sum, t) => sum + t.amount, 0)

    // Calculate revenue by service type
    const revenueByService = filteredShipments.reduce((acc, shipment) => {
      const serviceType = shipment.serviceType
      const shipmentRevenue = incomeTransactions
        .filter(t => t.description.toLowerCase().includes(serviceType.toLowerCase()))
        .reduce((sum, t) => sum + t.amount, 0)
      
      if (!acc[serviceType]) {
        acc[serviceType] = 0
      }
      acc[serviceType] += shipmentRevenue
      return acc
    }, {} as Record<string, number>)

    const revenueByServiceArray = Object.entries(revenueByService).map(([service, amount]) => ({
      service: service.charAt(0).toUpperCase() + service.slice(1),
      amount,
      percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0
    }))

    // Calculate shipments by type
    const shipmentsByType = filteredShipments.reduce((acc, shipment) => {
      const type = shipment.serviceType
      if (!acc[type]) {
        acc[type] = 0
      }
      acc[type]++
      return acc
    }, {} as Record<string, number>)

    const shipmentsByTypeArray = Object.entries(shipmentsByType).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: filteredShipments.length > 0 ? Math.round((count / filteredShipments.length) * 100) : 0
    }))

    // Calculate shipments by status
    const shipmentsByStatus = filteredShipments.reduce((acc, shipment) => {
      const status = shipment.status
      if (!acc[status]) {
        acc[status] = 0
      }
      acc[status]++
      return acc
    }, {} as Record<string, number>)

    const shipmentsByStatusArray = Object.entries(shipmentsByStatus).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      count,
      percentage: filteredShipments.length > 0 ? Math.round((count / filteredShipments.length) * 100) : 0
    }))

    // Calculate routes data
    const routes = filteredShipments.reduce((acc, shipment) => {
      const route = `${shipment.pickupLocation} → ${shipment.destination}`
      if (!acc[route]) {
        acc[route] = { count: 0, revenue: 0 }
      }
      acc[route].count++
      acc[route].revenue += incomeTransactions
        .filter(t => t.description.toLowerCase().includes(shipment.trackingNumber.toLowerCase()))
        .reduce((sum, t) => sum + t.amount, 0)
      return acc
    }, {} as Record<string, { count: number; revenue: number }>)

    const popularRoutes = Object.entries(routes)
      .map(([route, data]) => ({ route, count: data.count, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Calculate regions data
    const regions = filteredShipments.reduce((acc, shipment) => {
      // Extract region from pickup location (assuming format: "Address, Region, District")
      const locationParts = shipment.pickupLocation.split(',').map(part => part.trim())
      const region = locationParts.length > 1 ? locationParts[1] : 'Unknown'
      
      if (!acc[region]) {
        acc[region] = 0
      }
      acc[region]++
      return acc
    }, {} as Record<string, number>)

    const regionsArray = Object.entries(regions).map(([region, count]) => ({
      region,
      count,
      percentage: filteredShipments.length > 0 ? Math.round((count / filteredShipments.length) * 100) : 0
    }))

    // Calculate agents data
    const activeAgents = agents.filter(a => a.status === 'active')
    const agentPerformance = activeAgents.map(agent => {
      const agentShipments = filteredShipments.filter(s => s.assignedDriver === agent.name)
      const agentRevenue = incomeTransactions
        .filter(t => agentShipments.some(s => t.description.toLowerCase().includes(s.trackingNumber.toLowerCase())))
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        name: agent.name,
        shipments: agentShipments.length,
        rating: agent.rating,
        revenue: agentRevenue
      }
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

    // Calculate clients data
    const activeCustomers = customers.filter(c => c.status === 'active')
    const newThisMonth = customers.filter(c => {
      const customerDate = new Date(c.createdAt.toDate())
      const currentDate = new Date()
      return customerDate.getMonth() === currentDate.getMonth() && 
             customerDate.getFullYear() === currentDate.getFullYear()
    }).length

    const clientsByLocation = activeCustomers.reduce((acc, customer) => {
      const location = customer.location
      if (!acc[location]) {
        acc[location] = 0
      }
      acc[location]++
      return acc
    }, {} as Record<string, number>)

    const clientsByLocationArray = Object.entries(clientsByLocation).map(([location, count]) => ({
      location,
      count,
      percentage: activeCustomers.length > 0 ? Math.round((count / activeCustomers.length) * 100) : 0
    }))

    const topClients = activeCustomers.map(customer => ({
      name: customer.name,
      shipments: customer.totalShipments,
      revenue: customer.totalRevenue
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

    // Calculate time series data
    const currentDate = new Date()
    const dailyData = []
    const monthlyData = []

    // Generate daily data for last 8 days
    for (let i = 7; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayShipments = filteredShipments.filter(s => {
        const shipmentDate = new Date(s.createdAt.toDate())
        return shipmentDate.toISOString().split('T')[0] === dateStr
      }).length

      const dayRevenue = incomeTransactions
        .filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.toISOString().split('T')[0] === dateStr
        })
        .reduce((sum, t) => sum + t.amount, 0)

      dailyData.push({
        date: dateStr,
        shipments: dayShipments,
        revenue: dayRevenue
      })
    }

    // Generate monthly data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setMonth(date.getMonth() - i)
      const monthStr = date.toLocaleDateString('en-US', { month: 'short' })
      
      const monthShipments = filteredShipments.filter(s => {
        const shipmentDate = new Date(s.createdAt.toDate())
        return shipmentDate.getMonth() === date.getMonth() && 
               shipmentDate.getFullYear() === date.getFullYear()
      }).length

      const monthRevenue = incomeTransactions
        .filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.getMonth() === date.getMonth() && 
                 transactionDate.getFullYear() === date.getFullYear()
        })
        .reduce((sum, t) => sum + t.amount, 0)

      monthlyData.push({
        month: monthStr,
        shipments: monthShipments,
        revenue: monthRevenue
      })
    }

    // Calculate growth percentage
    const previousMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0
    const growth = previousMonthRevenue > 0 
      ? Math.round(((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
      : 0

    return {
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        growth,
        byService: revenueByServiceArray
      },
      services: {
        total: filteredShipments.length,
        byType: shipmentsByTypeArray,
        byStatus: shipmentsByStatusArray
      },
      routes: {
        total: popularRoutes.length,
        popular: popularRoutes,
        byRegion: regionsArray
      },
      agents: {
        total: agents.length,
        active: activeAgents.length,
        performance: agentPerformance
      },
      clients: {
        total: customers.length,
        newThisMonth,
        byLocation: clientsByLocationArray,
        topClients
      },
      timeData: {
        daily: dailyData,
        monthly: monthlyData
      }
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    throw error
  }
}

export const seedEmployeeSampleData = async () => {
  try {
    // Sample employees data with movers service positions
    const sampleEmployees = [
      {
        name: "John Smith",
        email: "john.smith@arenologistics.com",
        phone: "+255 717 123 456",
        position: "Operations Manager",
        department: "Operations",
        role: "Manager",
        status: 'active' as const,
        joinDate: "2023-01-15",
        salary: 2500000,
        lastActive: "2024-07-06",
        performance: 85,
        attendance: 92,
        manager: "Sarah Johnson",
        location: "Dar es Salaam",
        emergencyContact: "+255 718 123 456"
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@arenologistics.com",
        phone: "+255 718 234 567",
        position: "HR Director",
        department: "Human Resources",
        role: "Director",
        status: 'active' as const,
        joinDate: "2022-06-01",
        salary: 3000000,
        lastActive: "2024-07-06",
        performance: 90,
        attendance: 95,
        manager: "",
        location: "Dar es Salaam",
        emergencyContact: "+255 719 234 567"
      },
      {
        name: "Michael Chen",
        email: "michael.chen@arenologistics.com",
        phone: "+255 719 345 678",
        position: "Finance Manager",
        department: "Finance",
        role: "Manager",
        status: 'active' as const,
        joinDate: "2023-03-10",
        salary: 2800000,
        lastActive: "2024-07-06",
        performance: 88,
        attendance: 89,
        manager: "Sarah Johnson",
        location: "Dar es Salaam",
        emergencyContact: "+255 720 345 678"
      },
      {
        name: "Emily Davis",
        email: "emily.davis@arenologistics.com",
        phone: "+255 720 456 789",
        position: "Customer Service Representative",
        department: "Customer Service",
        role: "Representative",
        status: 'active' as const,
        joinDate: "2023-08-20",
        salary: 1200000,
        lastActive: "2024-07-06",
        performance: 82,
        attendance: 87,
        manager: "John Smith",
        location: "Dar es Salaam",
        emergencyContact: "+255 721 456 789"
      },
      {
        name: "David Wilson",
        email: "david.wilson@arenologistics.com",
        phone: "+255 721 567 890",
        position: "IT Support Specialist",
        department: "IT",
        role: "Specialist",
        status: 'active' as const,
        joinDate: "2023-11-05",
        salary: 1800000,
        lastActive: "2024-07-06",
        performance: 86,
        attendance: 91,
        manager: "John Smith",
        location: "Dar es Salaam",
        emergencyContact: "+255 722 567 890"
      },
      // Movers service employees
      {
        name: "Ahmed Hassan",
        email: "ahmed.hassan@arenologistics.com",
        phone: "+255 722 678 901",
        position: "Driver",
        department: "Operations",
        role: "Driver",
        status: 'active' as const,
        joinDate: "2023-05-12",
        salary: 800000,
        lastActive: "2024-07-06",
        performance: 88,
        attendance: 94,
        manager: "John Smith",
        location: "Dar es Salaam",
        emergencyContact: "+255 723 678 901"
      },
      {
        name: "Fatima Ali",
        email: "fatima.ali@arenologistics.com",
        phone: "+255 723 789 012",
        position: "Driver",
        department: "Operations",
        role: "Driver",
        status: 'active' as const,
        joinDate: "2023-07-20",
        salary: 800000,
        lastActive: "2024-07-06",
        performance: 85,
        attendance: 91,
        manager: "John Smith",
        location: "Dar es Salaam",
        emergencyContact: "+255 724 789 012"
      },
      {
        name: "James Mwangi",
        email: "james.mwangi@arenologistics.com",
        phone: "+255 724 890 123",
        position: "Supervisor",
        department: "Operations",
        role: "Supervisor",
        status: 'active' as const,
        joinDate: "2023-02-15",
        salary: 1500000,
        lastActive: "2024-07-06",
        performance: 92,
        attendance: 96,
        manager: "John Smith",
        location: "Dar es Salaam",
        emergencyContact: "+255 725 890 123"
      },
      {
        name: "Grace Wanjiku",
        email: "grace.wanjiku@arenologistics.com",
        phone: "+255 725 901 234",
        position: "Supervisor",
        department: "Operations",
        role: "Supervisor",
        status: 'active' as const,
        joinDate: "2023-04-10",
        salary: 1500000,
        lastActive: "2024-07-06",
        performance: 89,
        attendance: 93,
        manager: "John Smith",
        location: "Dar es Salaam",
        emergencyContact: "+255 726 901 234"
      },
      {
        name: "Peter Odhiambo",
        email: "peter.odhiambo@arenologistics.com",
        phone: "+255 726 012 345",
        position: "Workers",
        department: "Operations",
        role: "Workers",
        status: 'active' as const,
        joinDate: "2023-06-05",
        salary: 600000,
        lastActive: "2024-07-06",
        performance: 82,
        attendance: 88,
        manager: "James Mwangi",
        location: "Dar es Salaam",
        emergencyContact: "+255 727 012 345"
      },
      {
        name: "Mary Njeri",
        email: "mary.njeri@arenologistics.com",
        phone: "+255 727 123 456",
        position: "Workers",
        department: "Operations",
        role: "Workers",
        status: 'active' as const,
        joinDate: "2023-08-15",
        salary: 600000,
        lastActive: "2024-07-06",
        performance: 84,
        attendance: 90,
        manager: "James Mwangi",
        location: "Dar es Salaam",
        emergencyContact: "+255 728 123 456"
      },
      {
        name: "Joseph Kamau",
        email: "joseph.kamau@arenologistics.com",
        phone: "+255 728 234 567",
        position: "Workers",
        department: "Operations",
        role: "Workers",
        status: 'active' as const,
        joinDate: "2023-09-20",
        salary: 600000,
        lastActive: "2024-07-06",
        performance: 80,
        attendance: 87,
        manager: "Grace Wanjiku",
        location: "Dar es Salaam",
        emergencyContact: "+255 729 234 567"
      },
      {
        name: "Alice Muthoni",
        email: "alice.muthoni@arenologistics.com",
        phone: "+255 729 345 678",
        position: "Workers",
        department: "Operations",
        role: "Workers",
        status: 'active' as const,
        joinDate: "2023-10-12",
        salary: 600000,
        lastActive: "2024-07-06",
        performance: 86,
        attendance: 92,
        manager: "Grace Wanjiku",
        location: "Dar es Salaam",
        emergencyContact: "+255 730 345 678"
      }
    ]

    // Add employees
    for (const employeeData of sampleEmployees) {
      await addEmployee(employeeData)
    }

    console.log('Sample employee data seeded successfully')
  } catch (error) {
    handleFirebaseError(error, 'seeding sample employee data')
    throw error
  }
}

// Superadmin setup function
export const setupSuperAdmin = async (email: string) => {
  try {
    // First, create the superadmin role if it doesn't exist
    const superadminRole: Omit<Role, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Super Administrator',
      code: 'superadmin',
      description: 'Full system access with all permissions',
      level: 10, // Highest level
      permissions: [
        'all_access',
        'user_management',
        'role_management',
        'system_settings',
        'data_export',
        'analytics_access',
        'financial_access',
        'hr_access',
        'inventory_access',
        'shipment_management',
        'customer_management',
        'agent_management',
        'driver_management'
      ],
      status: 'active'
    }

    // Add the superadmin role
    const roleId = await addRole(superadminRole)
    console.log('Superadmin role created with ID:', roleId)

    // Create a user document for the superadmin
    const userData = {
      email: email,
      role: 'superadmin',
      roleId: roleId,
      permissions: superadminRole.permissions,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to users collection
    const usersRef = collection(db, 'users')
    const userDoc = await addDoc(usersRef, userData)
    console.log('Superadmin user created with ID:', userDoc.id)

    return {
      roleId,
      userId: userDoc.id,
      message: 'Superadmin setup completed successfully'
    }
  } catch (error) {
    console.error('Error setting up superadmin:', error)
    throw error
  }
}

// Check if user is superadmin
export const isSuperAdmin = async (email: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data()
      // Check if user is superadmin by role OR has all_access permission
      return userData.role === 'superadmin' || 
             (userData.permissions && userData.permissions.includes('all_access'))
    }
    
    return false
  } catch (error) {
    console.error('Error checking superadmin status:', error)
    return false
  }
}

// Get user permissions
export const getUserPermissions = async (email: string): Promise<string[]> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data()
      return userData.permissions || []
    }
    
    return []
  } catch (error) {
    console.error('Error getting user permissions:', error)
    return []
  }
}

// User Management Interfaces
export interface User {
  id: string
  email: string
  name: string
  role: string
  roleId: string
  permissions: string[]
  status: 'active' | 'inactive' | 'suspended'
  department?: string
  position?: string
  phone?: string
  avatar?: string
  lastLogin?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  sourceCollection?: 'users' | 'employees' // Track which collection this user came from
}

export interface UserRole {
  id: string
  name: string
  code: string
  description: string
  level: number
  permissions: string[]
  features: string[] // Sidebar features this role can access
  status: 'active' | 'inactive'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Feature definitions for sidebar
export const SIDEBAR_FEATURES = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/',
    description: 'Main dashboard overview'
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    icon: 'BarChart3',
    path: '/analytics',
    description: 'Data analytics and reports'
  },
  shipments: {
    id: 'shipments',
    name: 'Shipments',
    icon: 'Package',
    path: '/shipments',
    description: 'Manage shipments and tracking'
  },
  quotes: {
    id: 'quotes',
    name: 'Quotes',
    icon: 'FileText',
    path: '/quotes',
    description: 'Manage customer quotes'
  },
  customers: {
    id: 'customers',
    name: 'Customers',
    icon: 'Users',
    path: '/crm',
    description: 'Customer relationship management'
  },
  agents: {
    id: 'agents',
    name: 'Agents',
    icon: 'UserCheck',
    path: '/agents',
    description: 'Manage delivery agents'
  },
  drivers: {
    id: 'drivers',
    name: 'Drivers',
    icon: 'Car',
    path: '/drivers',
    description: 'Manage drivers and vehicles'
  },
  employees: {
    id: 'employees',
    name: 'Employees',
    icon: 'Users',
    path: '/hr',
    description: 'Human resources management'
  },
  departments: {
    id: 'departments',
    name: 'Departments',
    icon: 'Building2',
    path: '/departments',
    description: 'Department management'
  },
  inventory: {
    id: 'inventory',
    name: 'Inventory',
    icon: 'Package',
    path: '/inventory',
    description: 'Inventory management'
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    icon: 'DollarSign',
    path: '/finance',
    description: 'Financial management'
  },
  reports: {
    id: 'reports',
    name: 'Reports',
    icon: 'FileBarChart',
    path: '/reports',
    description: 'Generate and view reports'
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    path: '/settings',
    description: 'System settings'
  },
  'user-management': {
    id: 'user-management',
    name: 'User Management',
    icon: 'Shield',
    path: '/user-management',
    description: 'User and role management'
  }
} as const

// User Management Functions
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const users: User[] = []
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      } as User)
    })
    
    return users
  } catch (error) {
    handleFirebaseError(error, 'fetching users')
    throw error
  }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User
    }
    
    return null
  } catch (error) {
    handleFirebaseError(error, 'fetching user by ID')
    throw error
  }
}

export const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const usersRef = collection(db, 'users')
    const docRef = await addDoc(usersRef, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding user')
    throw error
  }
}

export const updateUser = async (userId: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    // Check if user exists in users collection
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
              // Update in users collection
        await updateDoc(userRef, {
          ...userData,
          updatedAt: Timestamp.now()
        })
    } else {
      // Check if user exists in employees collection
      const employeeRef = doc(db, 'employees', userId)
      const employeeDoc = await getDoc(employeeRef)
      
      if (employeeDoc.exists()) {
        // Update in employees collection
        await updateDoc(employeeRef, {
          ...userData,
          updatedAt: Timestamp.now()
        })
      } else {
        throw new Error(`User with ID ${userId} not found in either users or employees collection`)
      }
    }
  } catch (error) {
    handleFirebaseError(error, 'updating user')
    throw error
  }
}

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Check if user exists in users collection
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      // Delete from users collection
      await deleteDoc(userRef)
    } else {
      // Check if user exists in employees collection
      const employeeRef = doc(db, 'employees', userId)
      const employeeDoc = await getDoc(employeeRef)
      
      if (employeeDoc.exists()) {
        // Delete from employees collection
        await deleteDoc(employeeRef)
      } else {
        throw new Error(`User with ID ${userId} not found in either users or employees collection`)
      }
    }
  } catch (error) {
    handleFirebaseError(error, 'deleting user')
    throw error
  }
}

export const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      status: status,
      updatedAt: new Date()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating user status')
    throw error
  }
}

export const updateUserRole = async (userId: string, roleId: string, permissions: string[]): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      roleId: roleId,
      permissions: permissions,
      updatedAt: new Date()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating user role')
    throw error
  }
}

// Role Management Functions
export const getAllUserRoles = async (): Promise<UserRole[]> => {
  try {
    const rolesRef = collection(db, 'userRoles')
    const q = query(rolesRef, orderBy('level', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const roles: UserRole[] = []
    querySnapshot.forEach((doc) => {
      roles.push({
        id: doc.id,
        ...doc.data()
      } as UserRole)
    })
    
    return roles
  } catch (error) {
    handleFirebaseError(error, 'fetching user roles')
    throw error
  }
}

export const addUserRole = async (roleData: Omit<UserRole, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const rolesRef = collection(db, 'userRoles')
    const docRef = await addDoc(rolesRef, {
      ...roleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'adding user role')
    throw error
  }
}

export const deleteUserRole = async (roleId: string): Promise<void> => {
  try {
    const roleRef = doc(db, 'userRoles', roleId)
    await deleteDoc(roleRef)
  } catch (error) {
    handleFirebaseError(error, 'deleting user role')
    throw error
  }
}

// Access Control Functions
export const getUserFeatures = async (email: string): Promise<string[]> => {
  try {
    // First check if user is superadmin - superadmins have access to ALL features
    const isSuperAdminUser = await isSuperAdmin(email)
    if (isSuperAdminUser) {
      // Return all available sidebar features for superadmin
      return Object.keys(SIDEBAR_FEATURES)
    }
    
    // First check users collection
    const usersRef = collection(db, 'users')
    const usersQuery = query(usersRef, where('email', '==', email))
    const usersSnapshot = await getDocs(usersQuery)
    
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0]
      const userData = userDoc.data()
      
      // Get the role to find allowed features
      if (userData.roleId) {
        const roleRef = doc(db, 'userRoles', userData.roleId)
        const roleDoc = await getDoc(roleRef)
        
        if (roleDoc.exists()) {
          const roleData = roleDoc.data()
          return roleData.features || []
        }
      }
    }
    
    // If not found in users collection, check employees collection
    const employeesRef = collection(db, 'employees')
    const employeesQuery = query(employeesRef, where('email', '==', email))
    const employeesSnapshot = await getDocs(employeesQuery)
    
    if (!employeesSnapshot.empty) {
      const employeeDoc = employeesSnapshot.docs[0]
      const employeeData = employeeDoc.data()
      
      // For employees, we need to check if they have a roleId or use default features
      if (employeeData.roleId) {
        const roleRef = doc(db, 'userRoles', employeeData.roleId)
        const roleDoc = await getDoc(roleRef)
        
        if (roleDoc.exists()) {
          const roleData = roleDoc.data()
          return roleData.features || []
        }
      }
      
      // If no roleId, return default features based on employee role/position
      // You can customize this based on your business logic
      const defaultFeatures = ['dashboard'] // Always allow dashboard
      
      // Add features based on employee role/position
      if (employeeData.role?.toLowerCase().includes('manager') || 
          employeeData.position?.toLowerCase().includes('manager')) {
        defaultFeatures.push('analytics', 'reports', 'employees')
      }
      
      if (employeeData.department?.toLowerCase().includes('finance')) {
        defaultFeatures.push('finance')
      }
      
      if (employeeData.department?.toLowerCase().includes('hr')) {
        defaultFeatures.push('employees', 'departments')
      }
      
      if (employeeData.department?.toLowerCase().includes('operations')) {
        defaultFeatures.push('shipments', 'drivers', 'agents')
      }
      
      return defaultFeatures
    }
    
    return []
  } catch (error) {
    console.error('Error getting user features:', error)
    return []
  }
}

export const canAccessFeature = async (email: string, featureId: string): Promise<boolean> => {
  try {
    // Superadmins can access any feature
    const isSuperAdminUser = await isSuperAdmin(email)
    if (isSuperAdminUser) {
      return true
    }
    
    const userFeatures = await getUserFeatures(email)
    return userFeatures.includes(featureId)
  } catch (error) {
    console.error('Error checking feature access:', error)
    return false
  }
}

export const hasPermission = async (email: string, permission: string): Promise<boolean> => {
  try {
    // Superadmins have all permissions
    const isSuperAdminUser = await isSuperAdmin(email)
    if (isSuperAdminUser) {
      return true
    }
    
    const permissions = await getUserPermissions(email)
    return permissions.includes(permission) || permissions.includes('all_access')
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

// Update a role document
export const updateRole = async (roleId: string, roleData: Partial<Omit<UserRole, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const roleRef = doc(db, 'userRoles', roleId)
    await updateDoc(roleRef, {
      ...roleData,
      updatedAt: new Date()
    })
  } catch (error) {
    handleFirebaseError(error, 'updating user role')
    throw error
  }
}

/**
 * Get all system users (from both users and employees collections, deduplicated by email)
 */
export const getAllSystemUsers = async (): Promise<User[]> => {
  try {
    const users = await getAllUsers()
    const employees = await getAllEmployees()
    
    // Merge users from both collections, deduplicating by email
    const allUsers: User[] = []
    const emailMap = new Map<string, User>()
    
    // Add users from users collection
    users.forEach(user => {
      emailMap.set(user.email, { ...user, sourceCollection: 'users' })
    })
    
    // Add employees, but don't overwrite if already exists
    employees.forEach(employee => {
      if (!emailMap.has(employee.email)) {
        emailMap.set(employee.email, {
          id: employee.id,
          email: employee.email,
          name: employee.name,
          role: employee.role,
          roleId: '', // Employees don't have roleId
          permissions: [],
          status: employee.status === 'active' ? 'active' : 'inactive',
          department: employee.department,
          position: employee.position,
          phone: employee.phone,
          avatar: undefined,
          lastLogin: undefined,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
          sourceCollection: 'employees'
        })
      }
    })
    
    return Array.from(emailMap.values())
  } catch (error) {
    handleFirebaseError(error, 'fetching system users')
    throw error
  }
}

// New function to create user with Firebase Auth and send welcome email
export const createUserWithAuth = async (userData: {
  email: string
  name: string
  role: string
  roleId: string
  permissions: string[]
  department?: string
  position?: string
  phone?: string
}): Promise<{ userId: string; authUid: string }> => {
  try {
    // Create user in Firestore
    const userRef = collection(db, 'users')
    const docRef = await addDoc(userRef, {
      ...userData,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })

    return { userId: docRef.id, authUid: docRef.id }
  } catch (error) {
    handleFirebaseError(error, 'createUserWithAuth')
  }
}

// Function to send welcome email with credentials
const sendWelcomeEmail = async (email: string, name: string, password: string) => {
  try {
    // For now, we'll use Firebase's built-in email service
    // In a production environment, you might want to use a custom email service
    const auth = getAuth(app)
    
    // Send a password reset email as a welcome email
    // This will allow the user to set their own password
    await sendPasswordResetEmail(auth, email)
    
    console.log(`Welcome email sent to ${email} for user ${name}`)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw error here as user creation should still succeed
  }
}

// Approval System Interfaces
export interface ApprovalRequest {
  id: string
  shipmentId: string
  shipmentNumber: string
  requestType: 'team' | 'materials' | 'expenses'
  department: 'hr' | 'inventory' | 'finance'
  requestedBy: string
  requestedByEmail: string
  requestedAt: Timestamp
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: Timestamp
  rejectedBy?: string
  rejectedAt?: Timestamp
  rejectionReason?: string
  notes?: string
  
  // Request-specific data
  teamData?: {
    assignedDriver?: string
    assignedSupervisor?: string
    assignedWorkers: string[]
    workerDetails: Array<{
      id: string
      name: string
      role: string
      department: string
    }>
  }
  
  materialsData?: {
    materials: Array<{
      id: string
      name: string
      quantity: number
      unit: string
      available: number
    }>
    totalMaterials: number
  }
  
  expensesData?: {
    expenses: Array<{
      description: string
      amount: number
      category: string
    }>
    totalAmount: number
  }
}

export interface ApprovalHistory {
  id: string
  shipmentId: string
  shipmentNumber: string
  requestType: 'team' | 'materials' | 'expenses'
  department: 'hr' | 'inventory' | 'finance'
  status: 'pending' | 'approved' | 'rejected'
  requestedBy: string
  requestedAt: Timestamp
  approvedBy?: string
  approvedAt?: Timestamp
  rejectedBy?: string
  rejectedAt?: Timestamp
  rejectionReason?: string
  notes?: string
  data: any // The actual approval data
}

// Approval System Functions
export const createApprovalRequest = async (approvalData: Omit<ApprovalRequest, 'id' | 'requestedAt' | 'status'>): Promise<string> => {
  try {
    console.log('Creating approval request with data:', approvalData)
    const approvalRef = collection(db, 'approvalRequests')
    
    const docData = {
      ...approvalData,
      status: 'pending',
      requestedAt: Timestamp.now()
    }
    
    console.log('Document data to save:', docData)
    const docRef = await addDoc(approvalRef, docData)
    console.log('Approval request created successfully with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error creating approval request:', error)
    handleFirebaseError(error, 'createApprovalRequest')
    throw error
  }
}

export const getPendingApprovalsByDepartment = async (department: 'hr' | 'inventory' | 'finance'): Promise<ApprovalRequest[]> => {
  try {
    console.log(`Fetching pending approvals for department: ${department}`)
    const approvalRef = collection(db, 'approvalRequests')
    const q = query(
      approvalRef,
      where('department', '==', department),
      where('status', '==', 'pending'),
      orderBy('requestedAt', 'desc')
    )
    
    console.log('Query parameters:', {
      department: department,
      status: 'pending',
      orderBy: 'requestedAt'
    })
    
    const snapshot = await getDocs(q)
    console.log(`Found ${snapshot.docs.length} pending approvals for ${department}`)
    
    // Log all documents to see what's in the collection
    console.log('All documents in approvalRequests collection:')
    const allDocs = await getDocs(collection(db, 'approvalRequests'))
    allDocs.docs.forEach((doc, index) => {
      const data = doc.data()
      console.log(`Document ${index + 1} (${doc.id}):`, {
        department: data.department,
        status: data.status,
        requestType: data.requestType,
        shipmentNumber: data.shipmentNumber
      })
    })
    
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApprovalRequest[]
    
    console.log('Query results:', results)
    return results
  } catch (error) {
    console.error(`Error fetching pending approvals for ${department}:`, error)
    handleFirebaseError(error, 'getPendingApprovalsByDepartment')
    throw error // Re-throw the error so the calling function can handle it
  }
}

export const approveRequest = async (approvalId: string, approvedBy: string, notes?: string): Promise<void> => {
  try {
    const approvalRef = doc(db, 'approvalRequests', approvalId)
    await updateDoc(approvalRef, {
      status: 'approved',
      approvedBy,
      approvedAt: Timestamp.now(),
      notes: notes || ''
    })
    
    // Move to approval history
    await addToApprovalHistory(approvalId, 'approved', approvedBy, notes)
  } catch (error) {
    handleFirebaseError(error, 'approveRequest')
  }
}

export const rejectRequest = async (approvalId: string, rejectedBy: string, rejectionReason: string, notes?: string): Promise<void> => {
  try {
    const approvalRef = doc(db, 'approvalRequests', approvalId)
    await updateDoc(approvalRef, {
      status: 'rejected',
      rejectedBy,
      rejectedAt: Timestamp.now(),
      rejectionReason,
      notes: notes || ''
    })
    
    // Move to approval history
    await addToApprovalHistory(approvalId, 'rejected', rejectedBy, notes, rejectionReason)
  } catch (error) {
    handleFirebaseError(error, 'rejectRequest')
  }
}

export const getApprovalHistory = async (shipmentId?: string): Promise<ApprovalHistory[]> => {
  try {
    const historyRef = collection(db, 'approvalHistory')
    let q = query(historyRef, orderBy('requestedAt', 'desc'))
    
    if (shipmentId) {
      q = query(historyRef, where('shipmentId', '==', shipmentId), orderBy('requestedAt', 'desc'))
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApprovalHistory[]
  } catch (error) {
    handleFirebaseError(error, 'getApprovalHistory')
  }
}

const addToApprovalHistory = async (approvalId: string, status: 'approved' | 'rejected', actionBy: string, notes?: string, rejectionReason?: string): Promise<void> => {
  try {
    // Get the approval request
    const approvalRef = doc(db, 'approvalRequests', approvalId)
    const approvalDoc = await getDoc(approvalRef)
    
    if (!approvalDoc.exists()) {
      throw new Error('Approval request not found')
    }
    
    const approvalData = approvalDoc.data() as ApprovalRequest
    
    // Prepare history data with only defined values
    const historyData: any = {
      shipmentId: approvalData.shipmentId,
      shipmentNumber: approvalData.shipmentNumber,
      requestType: approvalData.requestType,
      department: approvalData.department,
      status,
      requestedBy: approvalData.requestedBy,
      requestedAt: approvalData.requestedAt,
      notes: notes || ''
    }
    
    // Add approval-specific fields only if status is 'approved'
    if (status === 'approved') {
      historyData.approvedBy = actionBy
      historyData.approvedAt = Timestamp.now()
    }
    
    // Add rejection-specific fields only if status is 'rejected'
    if (status === 'rejected') {
      historyData.rejectedBy = actionBy
      historyData.rejectedAt = Timestamp.now()
      if (rejectionReason) {
        historyData.rejectionReason = rejectionReason
      }
    }
    
    // Add request data - filter out undefined values
    const requestData: any = {}
    
    if (approvalData.teamData) {
      requestData.teamData = approvalData.teamData
    }
    
    if (approvalData.materialsData) {
      requestData.materialsData = approvalData.materialsData
    }
    
    if (approvalData.expensesData) {
      requestData.expensesData = approvalData.expensesData
      }
    
    // Only add data if it has content
    if (Object.keys(requestData).length > 0) {
      historyData.data = requestData
    }
    
    // Add to history
    const historyRef = collection(db, 'approvalHistory')
    await addDoc(historyRef, historyData)
    
    // Delete from pending requests
    await deleteDoc(approvalRef)
  } catch (error) {
    handleFirebaseError(error, 'addToApprovalHistory')
  }
}

// Enhanced team member analysis functions for HR approvals
export const getTeamMemberDetails = async (memberId: string) => {
  try {
    const memberDoc = await getDoc(doc(db, 'employees', memberId))
    if (!memberDoc.exists()) {
      return null
    }
    return { id: memberDoc.id, ...memberDoc.data() }
  } catch (error) {
    console.error('Error fetching team member details:', error)
    return null
  }
}

export const getTeamMemberWorkload = async (memberId: string, month: string) => {
  try {
    // Get all shipments assigned to this member in the current month
    const shipmentsRef = collection(db, 'shipments')
    const startOfMonth = new Date(month + '-01')
    const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1) - 1)
    
    const q = query(
      shipmentsRef,
      where('managementData.assignedDriver', '==', memberId),
      where('createdAt', '>=', startOfMonth),
      where('createdAt', '<=', endOfMonth)
    )
    
    const snapshot = await getDocs(q)
    const driverShipments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Also check if they're assigned as supervisor or worker
    const supervisorQuery = query(
      shipmentsRef,
      where('managementData.assignedSupervisor', '==', memberId),
      where('createdAt', '>=', startOfMonth),
      where('createdAt', '<=', endOfMonth)
    )
    const supervisorSnapshot = await getDocs(supervisorQuery)
    const supervisorShipments = supervisorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Check worker assignments
    const workerQuery = query(
      shipmentsRef,
      where('managementData.workers', 'array-contains', memberId),
      where('createdAt', '>=', startOfMonth),
      where('createdAt', '<=', endOfMonth)
    )
    const workerSnapshot = await getDocs(workerQuery)
    const workerShipments = workerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return {
      driverAssignments: driverShipments.length,
      supervisorAssignments: supervisorShipments.length,
      workerAssignments: workerShipments.length,
      totalAssignments: driverShipments.length + supervisorShipments.length + workerShipments.length,
      driverShipments,
      supervisorShipments,
      workerShipments
    }
  } catch (error) {
    console.error('Error fetching team member workload:', error)
    return {
      driverAssignments: 0,
      supervisorAssignments: 0,
      workerAssignments: 0,
      totalAssignments: 0,
      driverShipments: [],
      supervisorShipments: [],
      workerShipments: []
    }
  }
}

export const getTeamMemberPerformance = async (memberId: string) => {
  try {
    // Get performance data from the last 3 months
    const performanceRef = collection(db, 'performance')
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    
    const q = query(
      performanceRef,
      where('employeeId', '==', memberId),
      where('date', '>=', threeMonthsAgo),
      orderBy('date', 'desc')
    )
    
    const snapshot = await getDocs(q)
    const performanceData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    if (performanceData.length === 0) {
      return {
        averageRating: 0,
        totalTasks: 0,
        completedTasks: 0,
        onTimeDelivery: 0,
        customerSatisfaction: 0,
        recentPerformance: []
      }
    }
    
    const averageRating = performanceData.reduce((sum, p) => sum + (p.rating || 0), 0) / performanceData.length
    const totalTasks = performanceData.reduce((sum, p) => sum + (p.totalTasks || 0), 0)
    const completedTasks = performanceData.reduce((sum, p) => sum + (p.completedTasks || 0), 0)
    const onTimeDelivery = performanceData.reduce((sum, p) => sum + (p.onTimeDelivery || 0), 0) / performanceData.length
    const customerSatisfaction = performanceData.reduce((sum, p) => sum + (p.customerSatisfaction || 0), 0) / performanceData.length
    
    return {
      averageRating,
      totalTasks,
      completedTasks,
      onTimeDelivery,
      customerSatisfaction,
      recentPerformance: performanceData.slice(0, 5) // Last 5 entries
    }
  } catch (error) {
    console.error('Error fetching team member performance:', error)
    return {
      averageRating: 0,
      totalTasks: 0,
      completedTasks: 0,
      onTimeDelivery: 0,
      customerSatisfaction: 0,
      recentPerformance: []
    }
  }
}

export const getTeamMemberAvailability = async (memberId: string) => {
  try {
    // Check current assignments
    const currentDate = new Date()
    const shipmentsRef = collection(db, 'shipments')
    
    // Check if member is currently assigned to any active shipments
    const activeQuery = query(
      shipmentsRef,
      where('status', 'in', ['in_progress', 'assigned']),
      where('managementData.assignedDriver', '==', memberId)
    )
    const activeDriverSnapshot = await getDocs(activeQuery)
    
    const activeSupervisorQuery = query(
      shipmentsRef,
      where('status', 'in', ['in_progress', 'assigned']),
      where('managementData.assignedSupervisor', '==', memberId)
    )
    const activeSupervisorSnapshot = await getDocs(activeSupervisorQuery)
    
    const activeWorkerQuery = query(
      shipmentsRef,
      where('status', 'in', ['in_progress', 'assigned']),
      where('managementData.workers', 'array-contains', memberId)
    )
    const activeWorkerSnapshot = await getDocs(activeWorkerQuery)
    
    const currentAssignments = [
      ...activeDriverSnapshot.docs,
      ...activeSupervisorSnapshot.docs,
      ...activeWorkerSnapshot.docs
    ]
    
    // Check leave requests
    const leaveRef = collection(db, 'leaveRequests')
    const leaveQuery = query(
      leaveRef,
      where('employeeId', '==', memberId),
      where('status', '==', 'approved'),
      where('startDate', '<=', currentDate),
      where('endDate', '>=', currentDate)
    )
    const leaveSnapshot = await getDocs(leaveQuery)
    
    const isOnLeave = leaveSnapshot.docs.length > 0
    const currentLeave = isOnLeave ? leaveSnapshot.docs[0].data() : null
    
    return {
      isAvailable: currentAssignments.length === 0 && !isOnLeave,
      currentAssignments: currentAssignments.length,
      isOnLeave,
      leaveDetails: currentLeave,
      availabilityStatus: isOnLeave ? 'On Leave' : 
                         currentAssignments.length > 0 ? 'Currently Assigned' : 'Available'
    }
  } catch (error) {
    console.error('Error fetching team member availability:', error)
    return {
      isAvailable: true,
      currentAssignments: 0,
      isOnLeave: false,
      leaveDetails: null,
      availabilityStatus: 'Unknown'
    }
  }
}

export const getEnhancedApprovalData = async (approvalId: string) => {
  try {
    const approvalDoc = await getDoc(doc(db, 'approvalRequests', approvalId))
    if (!approvalDoc.exists()) {
      return null
    }
    
    const approvalData = { id: approvalDoc.id, ...approvalDoc.data() }
    
    // If this is a team assignment approval, get detailed member information
    if (approvalData.requestType === 'team' && approvalData.teamData) {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      const memberDetails = {}
      
      // Get driver details
      if (approvalData.teamData.assignedDriver) {
        const driverDetails = await getTeamMemberDetails(approvalData.teamData.assignedDriver)
        const driverWorkload = await getTeamMemberWorkload(approvalData.teamData.assignedDriver, currentMonth)
        const driverPerformance = await getTeamMemberPerformance(approvalData.teamData.assignedDriver)
        const driverAvailability = await getTeamMemberAvailability(approvalData.teamData.assignedDriver)
        
        memberDetails.driver = {
          ...driverDetails,
          workload: driverWorkload,
          performance: driverPerformance,
          availability: driverAvailability
        }
      }
      
      // Get supervisor details
      if (approvalData.teamData.assignedSupervisor) {
        const supervisorDetails = await getTeamMemberDetails(approvalData.teamData.assignedSupervisor)
        const supervisorWorkload = await getTeamMemberWorkload(approvalData.teamData.assignedSupervisor, currentMonth)
        const supervisorPerformance = await getTeamMemberPerformance(approvalData.teamData.assignedSupervisor)
        const supervisorAvailability = await getTeamMemberAvailability(approvalData.teamData.assignedSupervisor)
        
        memberDetails.supervisor = {
          ...supervisorDetails,
          workload: supervisorWorkload,
          performance: supervisorPerformance,
          availability: supervisorAvailability
        }
      }
      
      // Get worker details
      if (approvalData.teamData.workerDetails && approvalData.teamData.workerDetails.length > 0) {
        memberDetails.workers = []
        
        for (const worker of approvalData.teamData.workerDetails) {
          const workerDetails = await getTeamMemberDetails(worker.id)
          const workerWorkload = await getTeamMemberWorkload(worker.id, currentMonth)
          const workerPerformance = await getTeamMemberPerformance(worker.id)
          const workerAvailability = await getTeamMemberAvailability(worker.id)
          
          memberDetails.workers.push({
            ...workerDetails,
            workload: workerWorkload,
            performance: workerPerformance,
            availability: workerAvailability
          })
        }
      }
      
      // Get shipment details
      let shipmentDetails = null
      if (approvalData.shipmentId) {
        const shipmentDoc = await getDoc(doc(db, 'shipments', approvalData.shipmentId))
        if (shipmentDoc.exists()) {
          shipmentDetails = { id: shipmentDoc.id, ...shipmentDoc.data() }
        }
      }
      
      return {
        ...approvalData,
        enhancedData: {
          memberDetails,
          shipmentDetails,
          currentMonth
        }
      }
    }
    
    return approvalData
  } catch (error) {
    console.error('Error fetching enhanced approval data:', error)
    return null
  }
}

export const getApprovalsByDepartment = async (department: 'hr' | 'inventory' | 'finance'): Promise<ApprovalRequest[]> => {
  try {
    const approvalRef = collection(db, 'approvalRequests')
    const q = query(
      approvalRef,
      where('department', '==', department),
      orderBy('requestedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApprovalRequest[]
  } catch (error) {
    handleFirebaseError(error, 'getApprovalsByDepartment')
    throw error
  }
}

export const getApprovalHistoryByDepartmentAndStatus = async (department: 'hr' | 'inventory' | 'finance', status: 'approved' | 'rejected'): Promise<ApprovalHistory[]> => {
  try {
    const historyRef = collection(db, 'approvalHistory')
    const q = query(
      historyRef,
      where('department', '==', department),
      where('status', '==', status),
      orderBy('requestedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApprovalHistory[]
  } catch (error) {
    handleFirebaseError(error, 'getApprovalHistoryByDepartmentAndStatus')
    throw error
  }
}

// Reports functionality
export interface Report {
  id: string
  title: string
  description: string
  department: string
  submittedBy: string
  submittedAt: Timestamp
  status: 'pending' | 'approved' | 'rejected'
  reportType: string
  data: any
  comments?: string
  approvedBy?: string
  approvedAt?: Timestamp
  rejectedBy?: string
  rejectedAt?: Timestamp
}

export const getAllReports = async (): Promise<Report[]> => {
  try {
    const reportsRef = collection(db, 'reports')
    const q = query(reportsRef, orderBy('submittedAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const reports: Report[] = []
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() } as Report)
    })
    
    return reports
  } catch (error) {
    handleFirebaseError(error, 'getAllReports')
    return []
  }
}

export const getReportsByStatus = async (status: 'pending' | 'approved' | 'rejected'): Promise<Report[]> => {
  try {
    const reportsRef = collection(db, 'reports')
    const q = query(
      reportsRef,
      where('status', '==', status),
      orderBy('submittedAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const reports: Report[] = []
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() } as Report)
    })
    
    return reports
  } catch (error) {
    handleFirebaseError(error, 'getReportsByStatus')
    return []
  }
}

export const getReportsByDepartment = async (department: string): Promise<Report[]> => {
  try {
    const reportsRef = collection(db, 'reports')
    const q = query(
      reportsRef,
      where('department', '==', department),
      orderBy('submittedAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const reports: Report[] = []
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() } as Report)
    })
    
    return reports
  } catch (error) {
    handleFirebaseError(error, 'getReportsByDepartment')
    return []
  }
}

export const addReport = async (reportData: Omit<Report, 'id' | 'submittedAt' | 'status'>): Promise<string> => {
  try {
    const reportsRef = collection(db, 'reports')
    const newReport = {
      ...reportData,
      submittedAt: Timestamp.now(),
      status: 'pending' as const
    }
    
    const docRef = await addDoc(reportsRef, newReport)
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'addReport')
    throw error
  }
}

export const approveReport = async (reportId: string, approvedBy: string): Promise<void> => {
  try {
    const reportRef = doc(db, 'reports', reportId)
    await updateDoc(reportRef, {
      status: 'approved',
      approvedBy,
      approvedAt: Timestamp.now()
    })
  } catch (error) {
    handleFirebaseError(error, 'approveReport')
    throw error
  }
}

export const rejectReport = async (reportId: string, rejectedBy: string, rejectionReason?: string): Promise<void> => {
  try {
    const reportRef = doc(db, 'reports', reportId)
    await updateDoc(reportRef, {
      status: 'rejected',
      rejectedBy,
      rejectedAt: Timestamp.now(),
      ...(rejectionReason && { rejectionReason })
    })
  } catch (error) {
    handleFirebaseError(error, 'rejectReport')
    throw error
  }
}

export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    const reportRef = doc(db, 'reports', reportId)
    await deleteDoc(reportRef)
  } catch (error) {
    handleFirebaseError(error, 'deleteReport')
    throw error
  }
}

export const getReportStats = async () => {
  try {
    const reports = await getAllReports()
    
    const stats = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      approved: reports.filter(r => r.status === 'approved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
      byDepartment: {} as Record<string, number>,
      byType: {} as Record<string, number>
    }
    
    reports.forEach(report => {
      stats.byDepartment[report.department] = (stats.byDepartment[report.department] || 0) + 1
      stats.byType[report.reportType] = (stats.byType[report.reportType] || 0) + 1
    })
    
    return stats
  } catch (error) {
    handleFirebaseError(error, 'getReportStats')
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      byDepartment: {},
      byType: {}
    }
  }
}

export interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  role: 'driver' | 'supervisor' | 'worker'
  status: 'active' | 'inactive' | 'on-leave' | 'terminated'
  isOccupied: boolean
  currentShipmentId?: string
  currentShipmentNumber?: string
  assignmentsCount: number // Number of assignments in last 30 days
  efficiency: number // Performance score 0-100
  lastActive: string
  performance: number
  attendance: number
  totalShipments: number
  completedShipments: number
  averageRating: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TeamAssignment {
  id: string
  shipmentId: string
  shipmentNumber: string
  assignedDriver?: string
  assignedSupervisor?: string
  assignedWorkers: string[]
  assignmentDate: Timestamp
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  completionDate?: Timestamp
  notes?: string
  createdAt: Timestamp
}

export interface TeamMemberStats {
  totalMembers: number
  availableMembers: number
  occupiedMembers: number
  activeMembers: number
  averageEfficiency: number
  totalAssignments: number
  completedAssignments: number
  byRole: {
    drivers: { total: number; available: number; occupied: number }
    supervisors: { total: number; available: number; occupied: number }
    workers: { total: number; available: number; occupied: number }
  }
}

// Team Management Functions
export const getAllTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const employees = await getAllEmployees()
    const teamMembers: TeamMember[] = []
    
    for (const employee of employees) {
      // Debug log for position and department
      console.log('[TEAM DETECTION]', employee.name, '| Position:', employee.position, '| Department:', employee.department)
      const position = employee.position.trim().toLowerCase()
      let role: 'driver' | 'supervisor' | 'worker' | null = null

      if (position.includes('driver')) {
        role = 'driver'
      } else if (position.includes('supervisor')) {
        role = 'supervisor'
      } else if (position.includes('worker') || position.includes('workers')) {
        role = 'worker'
      }

      if (!role) {
        continue // Skip employees that don't match our team roles
      }
      
      // Get assignment data
      const assignments = await getTeamAssignmentsByMember(employee.id)
        const currentAssignment = assignments.find(a => 
          ['pending', 'in-progress'].includes(a.status)
        )
        
        // Calculate assignments count for last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const recentAssignments = assignments.filter(a => 
          a.assignmentDate.toDate() >= thirtyDaysAgo
        )
        
        // Calculate efficiency based on performance and attendance
        const efficiency = Math.round((employee.performance + employee.attendance) / 2)
        
        const teamMember: TeamMember = {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          role: role,
          status: employee.status,
          isOccupied: !!currentAssignment,
          currentShipmentId: currentAssignment?.shipmentId,
          currentShipmentNumber: currentAssignment?.shipmentNumber,
          assignmentsCount: recentAssignments.length,
          efficiency,
          lastActive: employee.lastActive,
          performance: employee.performance,
          attendance: employee.attendance,
          totalShipments: assignments.length,
          completedShipments: assignments.filter(a => a.status === 'completed').length,
          averageRating: efficiency, // Using efficiency as rating for now
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt
        }
        
        teamMembers.push(teamMember)
      }
      
      return teamMembers
  } catch (error) {
    handleFirebaseError(error, 'getAllTeamMembers')
    return []
  }
}

export const getTeamMembersByRole = async (role: 'driver' | 'supervisor' | 'worker'): Promise<TeamMember[]> => {
  try {
    const allMembers = await getAllTeamMembers()
    return allMembers.filter(member => member.role === role)
  } catch (error) {
    handleFirebaseError(error, 'getTeamMembersByRole')
    return []
  }
}

export const getAvailableTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const allMembers = await getAllTeamMembers()
    return allMembers.filter(member => !member.isOccupied && member.status === 'active')
  } catch (error) {
    handleFirebaseError(error, 'getAvailableTeamMembers')
    return []
  }
}

export const getOccupiedTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const allMembers = await getAllTeamMembers()
    return allMembers.filter(member => member.isOccupied)
  } catch (error) {
    handleFirebaseError(error, 'getOccupiedTeamMembers')
    return []
  }
}

export const createTeamAssignment = async (assignmentData: Omit<TeamAssignment, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'teamAssignments'), {
      ...assignmentData,
      createdAt: serverTimestamp()
    })
    
    // Update team member status to occupied
    if (assignmentData.assignedDriver) {
      await updateEmployee(assignmentData.assignedDriver, { 
        lastActive: new Date().toISOString() 
      })
    }
    if (assignmentData.assignedSupervisor) {
      await updateEmployee(assignmentData.assignedSupervisor, { 
        lastActive: new Date().toISOString() 
      })
    }
    for (const workerId of assignmentData.assignedWorkers) {
      await updateEmployee(workerId, { 
        lastActive: new Date().toISOString() 
      })
    }
    
    return docRef.id
  } catch (error) {
    handleFirebaseError(error, 'createTeamAssignment')
    throw error
  }
}

export const getTeamAssignmentsByShipment = async (shipmentId: string): Promise<TeamAssignment[]> => {
  try {
    const q = query(
      collection(db, 'teamAssignments'),
      where('shipmentId', '==', shipmentId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TeamAssignment[]
  } catch (error) {
    handleFirebaseError(error, 'getTeamAssignmentsByShipment')
    return []
  }
}

export const getTeamAssignmentsByMember = async (memberId: string): Promise<TeamAssignment[]> => {
  try {
    const q = query(
      collection(db, 'teamAssignments'),
      where('assignedDriver', '==', memberId)
    )
    const snapshot1 = await getDocs(q)
    
    const q2 = query(
      collection(db, 'teamAssignments'),
      where('assignedSupervisor', '==', memberId)
    )
    const snapshot2 = await getDocs(q2)
    
    const q3 = query(
      collection(db, 'teamAssignments'),
      where('assignedWorkers', 'array-contains', memberId)
    )
    const snapshot3 = await getDocs(q3)
    
    const allAssignments = [
      ...snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...snapshot3.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ]
    
    return allAssignments as TeamAssignment[]
  } catch (error) {
    handleFirebaseError(error, 'getTeamAssignmentsByMember')
    return []
  }
}

export const updateTeamAssignmentStatus = async (assignmentId: string, status: 'pending' | 'in-progress' | 'completed' | 'cancelled'): Promise<void> => {
  try {
    const assignmentRef = doc(db, 'teamAssignments', assignmentId)
    const updateData: any = { status }
    
    if (status === 'completed') {
      updateData.completionDate = serverTimestamp()
    }
    
    await updateDoc(assignmentRef, updateData)
  } catch (error) {
    handleFirebaseError(error, 'updateTeamAssignmentStatus')
    throw error
  }
}

export const getTeamMemberStats = async (): Promise<TeamMemberStats> => {
  try {
    const allMembers = await getAllTeamMembers()
    const availableMembers = allMembers.filter(m => !m.isOccupied && m.status === 'active')
    const occupiedMembers = allMembers.filter(m => m.isOccupied)
    const activeMembers = allMembers.filter(m => m.status === 'active')
    
    const totalEfficiency = allMembers.reduce((sum, m) => sum + m.efficiency, 0)
    const averageEfficiency = allMembers.length > 0 ? totalEfficiency / allMembers.length : 0
    
    const drivers = allMembers.filter(m => m.role === 'driver')
    const supervisors = allMembers.filter(m => m.role === 'supervisor')
    const workers = allMembers.filter(m => m.role === 'worker')
    
    const totalAssignments = allMembers.reduce((sum, m) => sum + m.assignmentsCount, 0)
    const completedAssignments = allMembers.reduce((sum, m) => sum + m.completedShipments, 0)
    
    return {
      totalMembers: allMembers.length,
      availableMembers: availableMembers.length,
      occupiedMembers: occupiedMembers.length,
      activeMembers: activeMembers.length,
      averageEfficiency: Math.round(averageEfficiency),
      totalAssignments,
      completedAssignments,
      byRole: {
        drivers: {
          total: drivers.length,
          available: drivers.filter(d => !d.isOccupied && d.status === 'active').length,
          occupied: drivers.filter(d => d.isOccupied).length
        },
        supervisors: {
          total: supervisors.length,
          available: supervisors.filter(s => !s.isOccupied && s.status === 'active').length,
          occupied: supervisors.filter(s => s.isOccupied).length
        },
        workers: {
          total: workers.length,
          available: workers.filter(w => !w.isOccupied && w.status === 'active').length,
          occupied: workers.filter(w => w.isOccupied).length
        }
      }
    }
  } catch (error) {
    handleFirebaseError(error, 'getTeamMemberStats')
    return {
      totalMembers: 0,
      availableMembers: 0,
      occupiedMembers: 0,
      activeMembers: 0,
      averageEfficiency: 0,
      totalAssignments: 0,
      completedAssignments: 0,
      byRole: {
        drivers: { total: 0, available: 0, occupied: 0 },
        supervisors: { total: 0, available: 0, occupied: 0 },
        workers: { total: 0, available: 0, occupied: 0 }
      }
    }
  }
}