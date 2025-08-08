"use client"

import { useEffect, useState, useRef } from "react"
import { getAllQuotes, getAllContactMessages, getAllAgentApplications, QuoteData, ContactMessage, AgentApplication } from "@/lib/firebase-service"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  Calculator, 
  Send, 
  Download, 
  Users, 
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Loader2,
  Search,
  RefreshCw,
  Plus,
  User,
  Building,
  FileDown,
  MessageSquare
} from "lucide-react"
import { smsService } from '@/lib/sms-service'
import { emailService } from '@/lib/email-service'

// Template types
const QUOTATION_TEMPLATES = [
  {
    id: 'freight',
    name: 'Freight Logistics',
    description: 'Heavy cargo transportation and logistics',
    icon: Truck,
    color: 'bg-blue-500',
    baseRate: 1200,
    multiplier: 1.2
  },
  {
    id: 'moving',
    name: 'Moving Services',
    description: 'House and office relocation services',
    icon: Package,
    color: 'bg-purple-500',
    baseRate: 1500,
    multiplier: 1.5
  },
  {
    id: 'courier',
    name: 'Courier Services',
    description: 'Express delivery and small package handling',
    icon: FileText,
    color: 'bg-orange-500',
    baseRate: 800,
    multiplier: 1.0
  }
]

export default function QuotesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [agentApplications, setAgentApplications] = useState<AgentApplication[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  
  // Template selection states
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  
  // SMS states
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [selectedQuoteForSMS, setSelectedQuoteForSMS] = useState<QuoteData | null>(null)
  const [smsMessage, setSmsMessage] = useState("")
  const [smsTemplate, setSmsTemplate] = useState("custom")
  const [sendingSMS, setSendingSMS] = useState(false)
  const [smsStatus, setSmsStatus] = useState<"idle" | "success" | "error">("idle")
  
  // Quotation calculation states
  const [distance, setDistance] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const [specialHandling, setSpecialHandling] = useState<string>('none')
  const [insurance, setInsurance] = useState<string>('none')
  const [calculatedCost, setCalculatedCost] = useState<number>(0)
  const [additionalFees, setAdditionalFees] = useState<number>(0)
  const [totalCost, setTotalCost] = useState<number>(0)
  const [quotationNotes, setQuotationNotes] = useState("")
  const [generatingPDF, setGeneratingPDF] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (false) { // Temporarily disabled authentication
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      loadData()
    }
  }, [user])

  useEffect(() => {
    calculateTotalCost()
  }, [calculatedCost, additionalFees])

  const loadData = async () => {
    try {
      setDataLoading(true)
      const [quotesData, messagesData, applicationsData] = await Promise.all([
        getAllQuotes(),
        getAllContactMessages(),
        getAllAgentApplications()
      ])
      setQuotes(quotesData)
      setContactMessages(messagesData)
      setAgentApplications(applicationsData)
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const calculateTotalCost = () => {
    setTotalCost(calculatedCost + additionalFees)
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setShowClientModal(true)
  }

  const handleClientSelect = (client: any) => {
    setSelectedClient(client)
    setShowClientModal(false)
    setShowQuotationModal(true)
    
    // Auto-populate with client data
    if (client.cargoDetails?.weight) {
      setWeight(Number(client.cargoDetails.weight))
    }
    // Calculate initial cost
    calculateCost()
  }

  const calculateCost = () => {
    if (!selectedTemplate) return

    let baseCost = 0
    
    // Distance calculation
    if (distance > 0) {
      baseCost += distance * selectedTemplate.baseRate
    }
    
    // Weight calculation
    if (weight > 0) {
      baseCost += weight * 200 // 200 TZS per kg
    }
    
    // Apply service multiplier
    baseCost = baseCost * selectedTemplate.multiplier
    
    setCalculatedCost(Math.round(baseCost))
  }

  const handleSpecialHandlingChange = (value: string) => {
    setSpecialHandling(value)
    let handlingCost = 0
    switch (value) {
      case 'fragile': handlingCost = 50000; break
      case 'refrigerated': handlingCost = 75000; break
      case 'express': handlingCost = 100000; break
    }
    setAdditionalFees(handlingCost)
  }

  const handleInsuranceChange = (value: string) => {
    setInsurance(value)
    let insuranceCost = 0
    switch (value) {
      case 'basic': insuranceCost = 25000; break
      case 'premium': insuranceCost = 50000; break
      case 'full': insuranceCost = 100000; break
    }
    setAdditionalFees(prev => prev + insuranceCost)
  }

  const generatePDF = async () => {
    setGeneratingPDF(true)
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create PDF content (in real implementation, use a PDF library)
    const pdfContent = {
      client: selectedClient,
      template: selectedTemplate,
      calculation: {
        distance,
        weight,
        specialHandling,
        insurance,
        calculatedCost,
        additionalFees,
        totalCost
      },
      notes: quotationNotes,
      date: new Date().toLocaleDateString()
    }
    
    console.log('PDF Content:', pdfContent)
    
    // Simulate download
    const blob = new Blob(['PDF content would be here'], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `quotation-${selectedClient.contactInfo.contactPerson}-${Date.now()}.pdf`
    link.click()
    
    setGeneratingPDF(false)
    alert('Quotation PDF generated and downloaded!')
  }

  const sendQuotation = async () => {
    try {
      // Simulate sending quotation
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Quotation sent successfully to client!')
      setShowQuotationModal(false)
      resetForm()
    } catch (error) {
      alert('Failed to send quotation')
    }
  }

  const resetForm = () => {
    setSelectedTemplate(null)
    setSelectedClient(null)
    setDistance(0)
    setWeight(0)
    setSpecialHandling('none')
    setInsurance('none')
    setCalculatedCost(0)
    setAdditionalFees(0)
    setQuotationNotes("")
  }

  // SMS Functions
  const handleSMSButtonClick = (quote: QuoteData) => {
    setSelectedQuoteForSMS(quote)
    setSmsMessage("")
    setSmsTemplate("custom")
    setSmsStatus("idle")
    setShowSMSModal(true)
  }

  const handleSMSTemplateChange = (template: string) => {
    setSmsTemplate(template)
    if (!selectedQuoteForSMS) return

    const contactPerson = selectedQuoteForSMS.contactInfo.contactPerson
    const serviceType = selectedQuoteForSMS.serviceType

    switch (template) {
      case "quote_ready":
        setSmsMessage(`Dear ${contactPerson}, your ${serviceType} quote is ready! Please check your email or contact us at +255 XXX XXX XXX to discuss the details. Thank you for choosing iRis.`)
        break
      case "service_update":
        setSmsMessage(`Dear ${contactPerson}, your ${serviceType} service has been updated. We will keep you updated on any changes. For questions, call +255 XXX XXX XXX.`)
        break
      case "custom":
        setSmsMessage("")
        break
    }
  }

  const sendSMS = async () => {
    if (!selectedQuoteForSMS || !smsMessage.trim()) {
      alert('Please enter a message')
      return
    }

    setSendingSMS(true)
    setSmsStatus("idle")

    try {
      const results = []
      let hasPhone = false
      let hasEmail = false

      // Send SMS if phone number is available
      if (selectedQuoteForSMS.contactInfo.phone) {
        hasPhone = true
        console.log(`Attempting to send SMS to: ${selectedQuoteForSMS.contactInfo.phone}`)
        const smsResult = await smsService.sendSingleSMS(
          selectedQuoteForSMS.contactInfo.phone,
          smsMessage
        )
        console.log('SMS Result:', smsResult)
        results.push({ type: 'SMS', success: smsResult.success, error: smsResult.error })
      } else {
        console.log('No phone number available for SMS')
      }

      // Send Email if email is available
      if (selectedQuoteForSMS.contactInfo.email) {
        hasEmail = true
        const senderName = user?.displayName || user?.email || 'iRis Admin'
        const senderEmail = user?.email || 'admin@arenologistics.com'
        
        const emailResult = await emailService.sendQuoteMessageEmail(
          senderName,
          senderEmail,
          selectedQuoteForSMS.contactInfo.email,
          selectedQuoteForSMS.contactInfo.contactPerson,
          smsMessage,
          selectedQuoteForSMS.id
        )
        results.push({ type: 'Email', success: emailResult.success, error: emailResult.error })
      }

      // Check results and show appropriate message
      const successfulResults = results.filter(r => r.success)
      const failedResults = results.filter(r => !r.success)

      if (successfulResults.length > 0 && failedResults.length === 0) {
        setSmsStatus("success")
        const sentMethods = successfulResults.map(r => r.type).join(' and ')
        alert(`Message sent successfully via ${sentMethods}!`)
        setShowSMSModal(false)
        setSmsMessage("")
        setSelectedQuoteForSMS(null)
      } else if (successfulResults.length > 0 && failedResults.length > 0) {
        setSmsStatus("error")
        const sentMethods = successfulResults.map(r => r.type).join(' and ')
        const failedMethods = failedResults.map(r => r.type).join(' and ')
        const failedDetails = failedResults.map(r => `${r.type}: ${r.error}`).join(', ')
        console.error('Partial failure:', { sentMethods, failedMethods, failedDetails })
        alert(`Message sent via ${sentMethods} but failed via ${failedMethods}. Please check the failed methods.\n\nError details: ${failedDetails}`)
      } else {
        setSmsStatus("error")
        const failedMethods = failedResults.map(r => r.type).join(' and ')
        const failedDetails = failedResults.map(r => `${r.type}: ${r.error}`).join(', ')
        console.error('Complete failure:', { failedMethods, failedDetails })
        alert(`Failed to send message via ${failedMethods}. Please try again.\n\nError details: ${failedDetails}`)
      }
    } catch (error) {
      setSmsStatus("error")
      console.error('Message sending error:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setSendingSMS(false)
    }
  }

  // Email functionality
  const handleSendEmail = async (quote: QuoteData, message: string) => {
    try {
      const senderName = user?.displayName || user?.email || 'iRis Admin'
      const senderEmail = user?.email || 'admin@arenologistics.com'
      
      const result = await emailService.sendQuoteMessageEmail(
        senderName,
        senderEmail,
        quote.contactInfo.email,
        quote.contactInfo.contactPerson,
        message,
        quote.id
      )
      
      if (result.success) {
        alert('Email sent successfully!')
      } else {
        alert('Failed to send email: ' + result.error)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email. Please try again.')
    }
  }

  const handleEmailButtonClick = (quote: QuoteData) => {
    const message = prompt(`Send email to ${quote.contactInfo.contactPerson} (${quote.contactInfo.email}):`)
    if (message && message.trim()) {
      handleSendEmail(quote, message.trim())
    }
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show loading while not authenticated (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quotation Templates</h1>
                <p className="text-slate-600 mt-1 text-base">Select a template, choose a client, and generate quotations</p>
              </div>
              <Button onClick={loadData} variant="outline" className="w-full sm:w-auto rounded-full shadow-md hover:shadow-lg transition-all">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Freight Logistics</h3>
                  <p className="text-sm text-slate-600">Heavy cargo transportation and logistics</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Rate:</span>
                  <span className="font-medium">TZS 1,200/km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Multiplier:</span>
                  <span className="font-medium">1.2x</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/quotes/create?type=freight')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-500">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Moving Services</h3>
                  <p className="text-sm text-slate-600">House and office relocation services</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Rate:</span>
                  <span className="font-medium">TZS 1,500/km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Multiplier:</span>
                  <span className="font-medium">1.5x</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => router.push('/quotes/create?type=moving')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-orange-500">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Courier Services</h3>
                  <p className="text-sm text-slate-600">Express delivery and small package handling</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Rate:</span>
                  <span className="font-medium">TZS 800/km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Multiplier:</span>
                  <span className="font-medium">1.0x</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                onClick={() => router.push('/quotes/create?type=courier')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </div>
          </div>

          {/* Recent Quotations */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Quotations ({quotes.length})</h2>
            </div>

            {dataLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
                <p className="text-slate-600">Loading quotations...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {quotes.slice(0, 5).map((quote) => (
                      <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-slate-900">{quote.contactInfo.contactPerson}</div>
                            <div className="text-slate-500">{quote.contactInfo.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                            quote.serviceType === 'freight' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            quote.serviceType === 'moving' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {quote.serviceType.charAt(0).toUpperCase() + quote.serviceType.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {formatDate(quote.createdAt?.toDate ? quote.createdAt.toDate() : quote.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                            quote.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            quote.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSMSButtonClick(quote)}
                            className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Client Selection Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Client</h2>
                  <p className="text-slate-600 mt-1">Choose a client for {selectedTemplate?.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClientModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From Quotes */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Quote Requests</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {quotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleClientSelect(quote)}
                      >
                        <div className="font-medium text-slate-900">{quote.contactInfo.contactPerson}</div>
                        <div className="text-sm text-slate-600">{quote.contactInfo.email}</div>
                        <div className="text-xs text-slate-500">{quote.serviceType} • {formatDate(quote.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* From Contact Messages */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Inquiries</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {contactMessages.map((message) => (
                      <div
                        key={message.id}
                        className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleClientSelect({
                          contactInfo: {
                            contactPerson: message.name,
                            email: message.email,
                            phone: message.phone
                          },
                          cargoDetails: { description: message.message }
                        })}
                      >
                        <div className="font-medium text-slate-900">{message.name}</div>
                        <div className="text-sm text-slate-600">{message.email}</div>
                        <div className="text-xs text-slate-500">Contact • {formatDate(message.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Generation Modal */}
      {showQuotationModal && selectedClient && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Generate Quotation</h2>
                  <p className="text-slate-600 mt-1">
                    {selectedTemplate.name} for {selectedClient.contactInfo.contactPerson}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuotationModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Information */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-slate-900">{selectedClient.contactInfo.contactPerson}</div>
                    <div className="text-sm text-slate-600">{selectedClient.contactInfo.email}</div>
                    <div className="text-sm text-slate-600">{selectedClient.contactInfo.phone}</div>
                  </div>
                  {selectedClient.cargoDetails && (
                    <div>
                      <div className="font-medium text-slate-900">Cargo Details</div>
                      <div className="text-sm text-slate-600">{selectedClient.cargoDetails.description}</div>
                      {selectedClient.cargoDetails.weight && (
                        <div className="text-sm text-slate-600">Weight: {selectedClient.cargoDetails.weight}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Cost Calculation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Distance (km)</label>
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => {
                        setDistance(Number(e.target.value))
                        setTimeout(calculateCost, 100)
                      }}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter distance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => {
                        setWeight(Number(e.target.value))
                        setTimeout(calculateCost, 100)
                      }}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter weight"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Special Handling</label>
                    <select
                      value={specialHandling}
                      onChange={(e) => handleSpecialHandlingChange(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="fragile">Fragile (+50,000 TZS)</option>
                      <option value="refrigerated">Refrigerated (+75,000 TZS)</option>
                      <option value="express">Express (+100,000 TZS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Insurance</label>
                    <select
                      value={insurance}
                      onChange={(e) => handleInsuranceChange(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">No Insurance</option>
                      <option value="basic">Basic (+25,000 TZS)</option>
                      <option value="premium">Premium (+50,000 TZS)</option>
                      <option value="full">Full Coverage (+100,000 TZS)</option>
                    </select>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="text-md font-semibold text-blue-900 mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Base Cost:</span>
                      <span className="text-sm font-medium">TZS {calculatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Additional Fees:</span>
                      <span className="text-sm font-medium">TZS {additionalFees.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-sm font-semibold text-blue-900">Total Cost:</span>
                      <span className="text-sm font-bold text-blue-900">TZS {totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Quotation Notes & Terms</label>
                <textarea
                  value={quotationNotes}
                  onChange={(e) => setQuotationNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Include delivery terms, payment conditions, validity period, and any special instructions..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowQuotationModal(false)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={generatePDF}
                  disabled={generatingPDF}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Generate PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={sendQuotation}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Quotation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSMSModal && selectedQuoteForSMS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Send Message</h2>
                  <p className="text-slate-600 mt-1">
                    To: {selectedQuoteForSMS.contactInfo.contactPerson}
                    {selectedQuoteForSMS.contactInfo.phone && (
                      <span> • Phone: {selectedQuoteForSMS.contactInfo.phone}</span>
                    )}
                    {selectedQuoteForSMS.contactInfo.email && (
                      <span> • Email: {selectedQuoteForSMS.contactInfo.email}</span>
                    )}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Message will be sent via all available contact methods
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSMSModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">Message Template</label>
                <div className="grid grid-cols-1 gap-3">
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="smsTemplate"
                      value="quote_ready"
                      checked={smsTemplate === "quote_ready"}
                      onChange={(e) => handleSMSTemplateChange(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Quote Ready</div>
                      <div className="text-sm text-slate-600">Notify client that their quote is ready</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="smsTemplate"
                      value="service_update"
                      checked={smsTemplate === "service_update"}
                      onChange={(e) => handleSMSTemplateChange(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Service Update</div>
                      <div className="text-sm text-slate-600">Update client on service status</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="smsTemplate"
                      value="custom"
                      checked={smsTemplate === "custom"}
                      onChange={(e) => handleSMSTemplateChange(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Custom Message</div>
                      <div className="text-sm text-slate-600">Write your own message</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Message Content</label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Type your message here..."
                  maxLength={160}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {smsMessage.length}/160 characters
                </div>
              </div>

              {/* Status Messages */}
              {smsStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-green-800 font-medium">✓ SMS sent successfully!</div>
                </div>
              )}
              
              {smsStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-red-800 font-medium">✗ Failed to send SMS. Please try again.</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSMSModal(false)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendSMS}
                  disabled={sendingSMS || !smsMessage.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {sendingSMS ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 