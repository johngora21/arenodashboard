"use client"

import { useEffect, useState } from "react"
import { getAllQuotes, QuoteData } from "@/lib/firebase-service"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  ArrowLeft, 
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
  FileText,
  User,
  Building,
  FileDown,
  Plus,
  Search
} from "lucide-react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Template configurations
const TEMPLATES = {
  freight: {
    name: 'Freight Logistics',
    description: 'Heavy cargo transportation and logistics',
    icon: Truck,
    color: 'bg-blue-500',
    baseRate: 1200,
    multiplier: 1.2
  },
  moving: {
    name: 'Moving Services',
    description: 'House and office relocation services',
    icon: Package,
    color: 'bg-purple-500',
    multiplier: 1.5,
    baseRate: 1500
  },
  courier: {
    name: 'Courier Services',
    description: 'Express delivery and small package handling',
    icon: FileText,
    color: 'bg-orange-500',
    multiplier: 1.0,
    baseRate: 800
  }
}

export default function CreateQuotationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceType = searchParams.get('type') as 'freight' | 'moving' | 'courier'
  
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteData[]>([])
  const [selectedClient, setSelectedClient] = useState<QuoteData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Quotation calculation states
  const [distance, setDistance] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [volume, setVolume] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [specialHandling, setSpecialHandling] = useState<string>('none')
  const [insurance, setInsurance] = useState<string>('none')
  const [urgency, setUrgency] = useState<string>('normal')
  const [calculatedCost, setCalculatedCost] = useState<number>(0)
  const [additionalFees, setAdditionalFees] = useState<number>(0)
  const [totalCost, setTotalCost] = useState<number>(0)
  const [quotationNotes, setQuotationNotes] = useState("")
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>('')
  
  // VAT/Tax states
  const [includeVAT, setIncludeVAT] = useState<boolean>(false)
  const [vatPercentage, setVatPercentage] = useState<string>('18')
  const [vatAmount, setVatAmount] = useState<number>(0)
  const [finalTotal, setFinalTotal] = useState<number>(0)
  
  // Manual pricing states
  const [manualBasePrice, setManualBasePrice] = useState<string>('')
  const [manualAdditionalCharges, setManualAdditionalCharges] = useState<string>('')
  const [useManualPricing, setUseManualPricing] = useState<boolean>(false)

  // Moving service itemized cost states
  const [movingItems, setMovingItems] = useState([
    { id: 1, name: 'Heavy-Duty Boxes', quantity: '', unitPrice: '', total: 0 },
    { id: 2, name: 'Heavy-Duty Plastic Containers', quantity: '', unitPrice: '', total: 0 },
    { id: 3, name: 'Branded Heavy-Duty Bags', quantity: '', unitPrice: '', total: 0 },
    { id: 4, name: 'Heavy-Duty Stretch Wrap', quantity: '', unitPrice: '', total: 0 },
    { id: 5, name: 'Heavy-Duty Bubble Wrap', quantity: '', unitPrice: '', total: 0 },
    { id: 6, name: 'Moving Blankets', quantity: '', unitPrice: '', total: 0 },
    { id: 7, name: 'Shock-absorbers', quantity: '', unitPrice: '', total: 0 },
    { id: 8, name: 'Trash Bags', quantity: '', unitPrice: '', total: 0 },
    { id: 9, name: 'Miscellaneous', quantity: '', unitPrice: '', total: 0 },
    { id: 10, name: 'Labor', quantity: '', unitPrice: '', total: 0 },
    { id: 11, name: 'Transport', quantity: '', unitPrice: '', total: 0 },
    { id: 12, name: 'Cleaning Service', quantity: '', unitPrice: '', total: 0 },
    { id: 13, name: 'Consultation', quantity: '', unitPrice: '', total: 0 }
  ])
  const [movingTotalCost, setMovingTotalCost] = useState<number>(0)

  // Terms and conditions - empty by default
  const [termsAndConditions, setTermsAndConditions] = useState("")
  
  // Default terms and conditions for reset (only if needed)
  const defaultTermsAndConditions = `WORKFLOW & SERVICE SCOPE FOR OFFICE RELOCATION

Stage	Planned Activities
1. Consultation	Brief site visit and client discussion to assess items, timeline, and layout needs
2. Packing Materials	Provision of boxes, bubble wrap, and stretch wrap as required
3. Labour Deployment	A skilled team will handle all packing, equipment handling, disassembly, lifting & loading, assembly and setup
4. Equipment Packing	Secure packing of office electronics: computers, monitors, printers, accessories
5. Furniture Handling	Disassembly of office desks, chairs, shelves, and cabinets for safe movement
6. Document Packing	Organized boxing and labeling of files and paperwork
7. Loading Process	Systematic loading into moving vehicles
8. Transportation	Safe haul using company vehicles, with care to prevent any in-transit damage
9. Unloading & Setup	Offloading, item placement as per layout, reassembly of furniture and workstations
10. Miscellaneous Support	Handling of tools, cable management, on-site needs, and waste material collection
11. Completion & Handover	Final walkthrough with client for item verification and confirmation of setup

DETAILED ACTIVITIES

Task	Description
Packing of Equipment	Secure wrapping and boxing of all computers, printers, and tech accessories
File & Document Handling	Organizing and labeling important paperwork and files in designated boxes
Furniture Disassembly	Careful breakdown of desks, chairs, shelves, and cabinets
Lifting & Loading	Safe movement of heavy items into vehicles using proper handling techniques
Vehicle Assistance	Supporting optimal arrangement of items to avoid damage during transit
Unloading at New Site	Offloading and careful item transfer to office rooms as per client layout
Furniture Reassembly	Rebuilding desks, chairs, cabinets, and workstations at the new location
Equipment Setup	Positioning of computers, printers, and accessories according to new office plan
Disposal of Waste	Collection and removal of used wraps and empty boxes
Site Coordination	Team organized under supervisor to ensure safe and efficient workflow
Client Walkthrough	Final check and handover of completed work with client approval`

  const defaultNotesTemplate = `Thank you for choosing Areno Movers. This quotation is valid for 14 days. Please contact us for any clarifications or adjustments.`
  const shortTermsTemplate = `Payment due in 14 days. All goods are handled with care. Areno Movers is not liable for delays caused by unforeseen circumstances. Full T&Cs available on request.`

  const resetTermsAndConditions = () => {
    setTermsAndConditions(shortTermsTemplate)
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && serviceType) {
      loadQuotes()
    }
  }, [user, serviceType])

  useEffect(() => {
    filterQuotes()
  }, [quotes, searchTerm])

  useEffect(() => {
    calculateTotalCost()
  }, [calculatedCost, additionalFees, includeVAT, vatPercentage, useManualPricing, manualBasePrice, manualAdditionalCharges, movingTotalCost, serviceType])

  useEffect(() => {
    if (useManualPricing) {
      calculateTotalCost()
    }
  }, [manualBasePrice, manualAdditionalCharges, useManualPricing])

  useEffect(() => {
    calculateMovingTotal()
  }, [movingItems])

  // Add new useEffect to recalculate cost when form values change
  useEffect(() => {
    if (serviceType && !useManualPricing) {
      calculateCost()
    }
  }, [distance, weight, volume, quantity, serviceType, useManualPricing])

  const loadQuotes = async () => {
    try {
      setDataLoading(true)
      const quotesData = await getAllQuotes()
      // Filter for pending quotes of the selected service type
      const filtered = quotesData.filter(quote => 
        quote.serviceType === serviceType && quote.status === 'pending'
      )
      setQuotes(filtered)
      setFilteredQuotes(filtered)
    } catch (err) {
      console.error('Error loading quotes:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const filterQuotes = () => {
    let filtered = quotes

    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.contactInfo.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.contactInfo.phone.includes(searchTerm) ||
        quote.cargoDetails.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredQuotes(filtered)
  }

  const selectClient = (client: QuoteData) => {
    setSelectedClient(client)
    
    // Auto-fill form with client data
    if (client.cargoDetails) {
      setWeight(String(Number(client.cargoDetails.weight)) || '')
      setVolume(String(Number(client.cargoDetails.volume)) || '')
      setQuantity(String(Number(client.cargoDetails.quantity)) || '')
    }
    
    // Calculate initial cost
    calculateCost()
  }

  const calculateCost = () => {
    if (!serviceType) return

    const template = TEMPLATES[serviceType]
    let baseCost = 0
    
    // Distance calculation (if available from client data)
    const distanceNum = Number(distance) || 0
    if (distanceNum > 0) {
      baseCost += distanceNum * template.baseRate
    }
    
    // Weight calculation
    const weightNum = Number(weight) || 0
    if (weightNum > 0) {
      baseCost += weightNum * 200 // 200 TZS per kg
    }
    
    // Volume calculation
    const volumeNum = Number(volume) || 0
    if (volumeNum > 0) {
      baseCost += volumeNum * 150 // 150 TZS per cubic meter
    }
    
    // Quantity calculation
    const quantityNum = Number(quantity) || 0
    if (quantityNum > 0) {
      baseCost += quantityNum * 1000 // 1000 TZS per item
    }
    
    // Apply service multiplier
    baseCost = baseCost * template.multiplier
    
    setCalculatedCost(Math.round(baseCost))
  }

  const handleSpecialHandlingChange = (value: string) => {
    setSpecialHandling(value)
    let handlingCost = 0
    switch (value) {
      case 'fragile': handlingCost = 50000; break
      case 'refrigerated': handlingCost = 75000; break
      case 'express': handlingCost = 100000; break
      case 'oversized': handlingCost = 125000; break
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

  const handleUrgencyChange = (value: string) => {
    setUrgency(value)
    let urgencyCost = 0
    switch (value) {
      case 'urgent': urgencyCost = 75000; break
      case 'same_day': urgencyCost = 150000; break
    }
    setAdditionalFees(prev => prev + urgencyCost)
  }

  const calculateTotalCost = () => {
    let baseTotal = 0
    
    if (serviceType === 'moving') {
      // For moving services, use the moving total cost
      baseTotal = movingTotalCost
    } else if (useManualPricing) {
      const basePrice = Number(manualBasePrice) || 0
      const additionalCharges = Number(manualAdditionalCharges) || 0
      baseTotal = basePrice + additionalCharges
    } else {
      baseTotal = calculatedCost + additionalFees
    }
    
    setTotalCost(baseTotal)
    
    // Calculate VAT if enabled
    if (includeVAT) {
      const vatPercent = Number(vatPercentage) || 0
      const vatCalc = (baseTotal * vatPercent) / 100
      setVatAmount(vatCalc)
      setFinalTotal(baseTotal + vatCalc)
    } else {
      setVatAmount(0)
      setFinalTotal(baseTotal)
    }
  }

  // Moving service itemized cost functions
  const updateMovingItem = (id: number, field: 'quantity' | 'unitPrice', value: string) => {
    setMovingItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          // Calculate total only if both quantity and unitPrice have values
          const qty = Number(updatedItem.quantity) || 0
          const price = Number(updatedItem.unitPrice) || 0
          updatedItem.total = qty * price
          return updatedItem
        }
        return item
      })
    )
  }

  const calculateMovingTotal = () => {
    const total = movingItems.reduce((sum, item) => sum + item.total, 0)
    setMovingTotalCost(total)
    setTotalCost(total) // Update the main total cost for moving services
    
    // Calculate VAT if enabled
    if (includeVAT) {
      const vatPercent = Number(vatPercentage) || 0
      const vatCalc = (total * vatPercent) / 100
      setVatAmount(vatCalc)
      setFinalTotal(total + vatCalc)
    } else {
      setVatAmount(0)
      setFinalTotal(total)
    }
  }

  const generatePDFBlob = async (): Promise<Blob> => {
    if (!selectedClient) throw new Error('No client selected')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 50
    const darkBlue: [number, number, number] = [0, 32, 96]
    const orange: [number, number, number] = [255, 140, 0]
    const gray: [number, number, number] = [80, 80, 80]
    doc.setFont('helvetica')

    // Company Info
    doc.setFontSize(12)
    doc.setTextColor(...gray)
    doc.text('ARENO MOVERS', 40, y)
    doc.setFontSize(9)
    doc.text('P.O.BOX: 1244, Dar Es Salaam,', 40, y + 18)
    doc.text('Avenue Street - Mikocheni, Dar es salaam, Tanzania', 40, y + 34)
    doc.text('info@logistics.areno.co.tz', 40, y + 50)

    // Logo - improved positioning and sizing
    try {
      const logoUrl = '/images/ArenoLogisticsLogo.png'
      const img = new Image()
      img.src = logoUrl
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      // Better logo positioning - more natural placement
      doc.addImage(img, 'PNG', pageWidth - 140, y - 5, 80, 60)
    } catch {}

    // Invoice Title - more space after company info
    y += 100 // Increased from 80 to 100 for better spacing
    doc.setFontSize(22)
    doc.setTextColor(...darkBlue)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', 40, y)
    doc.setFont('helvetica', 'normal')

    // Bill To & Invoice Info - more space after title
    y += 50 // Increased from 40 to 50 for better spacing
    doc.setFontSize(10)
    doc.setTextColor(...gray)
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To', 40, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(selectedClient.contactInfo.contactPerson, 40, y + 18)
    doc.setFontSize(10)
    let billToDetailsY = y + 32
    if (selectedClient.contactInfo.businessName) {
      doc.text(selectedClient.contactInfo.businessName, 40, billToDetailsY)
      billToDetailsY += 14
    }
    doc.text(selectedClient.contactInfo.email, 40, billToDetailsY)
    doc.text(selectedClient.contactInfo.phone, 40, billToDetailsY + 14)

    // Invoice Info (right)
    let infoX = pageWidth - 220
    let infoY = y
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...darkBlue)
    doc.text('Invoice #', infoX, infoY)
    doc.text('Invoice date', infoX, infoY + 16)
    doc.text('Due date', infoX, infoY + 32)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...gray)
    doc.text('0000001', infoX + 90, infoY)
    doc.text(formatDate(new Date()), infoX + 90, infoY + 16)
    doc.text(formatDate(new Date()), infoX + 90, infoY + 32)

    // Service Details block - more space before and after
    let serviceInfoY = billToDetailsY + 50 // Increased from 30 to 50 for better spacing
    const cargo = selectedClient.cargoDetails || {}
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...darkBlue)
    doc.text('Service Details', 40, serviceInfoY)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...gray)
    
    // Use category as subtype if available, otherwise use main type
    const serviceTypeDisplay = cargo.category ? cargo.category : TEMPLATES[serviceType]?.name || ''
    
    let serviceLines = [
      `Type: ${serviceTypeDisplay}`,
      cargo.origin ? `Origin: ${cargo.origin}` : '',
      cargo.destination ? `Destination: ${cargo.destination}` : ''
    ].filter(Boolean)
    serviceLines.forEach((line, idx) => {
      doc.text(line, 40, serviceInfoY + 16 + idx * 14)
    })

    // Table - more space after service details and reorganized columns
    let tableY = serviceInfoY + 16 + serviceLines.length * 14 + 40 // Increased from 20 to 40
    autoTable(doc, {
      startY: tableY,
      head: [[
        { content: 'Item', styles: { halign: 'left', fontStyle: 'bold' } },
        { content: 'Description', styles: { halign: 'left', fontStyle: 'bold' } },
        { content: 'QTY', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'Unit Price', styles: { halign: 'right', fontStyle: 'bold' } },
        { content: 'Amount', styles: { halign: 'right', fontStyle: 'bold' } }
      ]],
      body: (() => {
        if (serviceType === 'moving') {
          return movingItems.filter(i => i.quantity && i.unitPrice && i.total > 0).map((i, index) => [
            (index + 1).toString(),
            i.name,
            Number(i.quantity).toFixed(2),
            Number(i.unitPrice).toLocaleString(),
            i.total.toLocaleString()
          ])
        } else if (useManualPricing) {
          const rows = []
          if (manualBasePrice) rows.push(['1', 'Base Service', '1.00', Number(manualBasePrice).toLocaleString(), Number(manualBasePrice).toLocaleString()])
          if (manualAdditionalCharges) rows.push(['2', 'Additional Charges', '1.00', Number(manualAdditionalCharges).toLocaleString(), Number(manualAdditionalCharges).toLocaleString()])
          return rows
        } else {
          const rows = []
          if (calculatedCost) rows.push(['1', 'Base Cost', '1.00', calculatedCost.toLocaleString(), calculatedCost.toLocaleString()])
          if (additionalFees) rows.push(['2', 'Additional Fees', '1.00', additionalFees.toLocaleString(), additionalFees.toLocaleString()])
          return rows
        }
      })(),
      theme: 'plain',
      headStyles: {
        fillColor: darkBlue,
        textColor: [255, 255, 255],
        fontSize: 10,
        lineWidth: 0
      },
      bodyStyles: {
        fontSize: 10,
        textColor: gray,
        lineWidth: 0.2,
        lineColor: [220, 220, 220],
        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 }
      },
      styles: {
        font: 'helvetica',
        overflow: 'linebreak',
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' }, // Item number
        1: { cellWidth: 180 }, // Description
        2: { cellWidth: 40, halign: 'center' }, // QTY
        3: { cellWidth: 80, halign: 'right' }, // Unit Price
        4: { cellWidth: 80, halign: 'right' } // Amount
      },
      margin: { left: 40, right: 40 }
    })

    // Totals - more space after table
    let totalsY = (doc as any).lastAutoTable.finalY + 50 // Increased from 30 to 50
    doc.setDrawColor(...orange)
    doc.setLineWidth(1)
    doc.line(pageWidth - 200, totalsY, pageWidth - 40, totalsY)
    doc.setFontSize(10)
    doc.setTextColor(...gray)
    doc.text('Subtotal', pageWidth - 200, totalsY + 18)
    doc.text('VAT (' + vatPercentage + '%)', pageWidth - 200, totalsY + 36)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...darkBlue)
    doc.text('Total', pageWidth - 200, totalsY + 54)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...gray)
    doc.text((serviceType === 'moving' ? movingTotalCost : totalCost).toLocaleString(), pageWidth - 60, totalsY + 18, { align: 'right' })
    doc.text(vatAmount.toLocaleString(), pageWidth - 60, totalsY + 36, { align: 'right' })
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...orange)
    doc.text(finalTotal.toLocaleString(), pageWidth - 60, totalsY + 54, { align: 'right' })
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...gray)

    // Notes / Memo section - more space after totals
    let notesY = totalsY + 100 // Increased from 80 to 100
    if (quotationNotes && quotationNotes.trim().length > 0) {
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(...darkBlue)
      doc.text('Notes / Memo', 40, notesY)
      doc.setFont(undefined, 'normal')
      doc.setTextColor(...gray)
      doc.setFontSize(9)
      doc.text(quotationNotes, 40, notesY + 16, { maxWidth: pageWidth - 80 })
      notesY += 40 + Math.ceil(quotationNotes.length / 90) * 12
    }

    // Terms and Conditions - more space after notes
    let termsY = notesY + 40 // Increased from 20 to 40
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...darkBlue)
    doc.text('Terms and Conditions', 40, termsY)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...gray)
    let termsText = termsAndConditions || 'Payment is due in 14 days.'
    doc.setFontSize(9)
    doc.text(termsText, 40, termsY + 16, { maxWidth: pageWidth - 80 })

    // Footer - more space from bottom
    doc.setFontSize(8)
    doc.setTextColor(...gray)
    doc.text('ARENO MOVERS - Professional Transportation & Logistics Services | Dar es Salaam, Tanzania', pageWidth / 2, 800, { align: 'center' })

    return doc.output('blob')
  }

  const generatePDF = async () => {
    if (!selectedClient) return
    
    setGeneratingPDF(true)
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create PDF content
    const pdfContent = {
      client: selectedClient,
      template: TEMPLATES[serviceType],
      calculation: {
        distance,
        weight,
        volume,
        quantity,
        specialHandling,
        insurance,
        urgency,
        calculatedCost,
        additionalFees,
        totalCost
      },
      notes: quotationNotes,
      date: new Date().toLocaleDateString()
    }
    
    console.log('PDF Content:', pdfContent)
    
    // Simulate download
    const blob = await generatePDFBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `quotation-${selectedClient.contactInfo.contactPerson}-${Date.now()}.pdf`
    link.click()
    
    setGeneratingPDF(false)
    alert('Quotation PDF generated and downloaded!')
  }

  const sendQuotation = async () => {
    if (!selectedClient) return
    
    try {
      // Simulate sending quotation
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Quotation sent successfully to client!')
      router.push('/quotes')
    } catch (error) {
      alert('Failed to send quotation')
    }
  }

  const previewPDF = async () => {
    if (!selectedClient) return
    
    setGeneratingPDF(true)
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create PDF content
    const pdfContent = {
      client: selectedClient,
      template: TEMPLATES[serviceType],
      calculation: {
        distance,
        weight,
        volume,
        quantity,
        specialHandling,
        insurance,
        urgency,
        calculatedCost,
        additionalFees,
        totalCost
      },
      notes: quotationNotes,
      date: new Date().toLocaleDateString()
    }
    
    console.log('PDF Content:', pdfContent)
    
    // Simulate download
    const blob = await generatePDFBlob()
    const url = URL.createObjectURL(blob)
    setPdfUrl(url)
    setShowPreview(true)
    
    setGeneratingPDF(false)
  }

  const loadNotesTemplate = () => setQuotationNotes(defaultNotesTemplate)

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

  if (!serviceType || !TEMPLATES[serviceType]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <p className="text-slate-600 font-medium">Invalid service type</p>
            <Button onClick={() => router.push('/quotes')} className="mt-4">
              Back to Quotes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const template = TEMPLATES[serviceType]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        
        <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/quotes')}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Create {template.name} Quotation
                  </h1>
                  <p className="text-slate-600 mt-1 text-base">
                    Select a pending client and generate quotation
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Client Selection */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-2 py-1 border-b border-slate-200">
                <h2 className="text-xs font-semibold text-slate-900">
                  Clients ({filteredQuotes.length})
                </h2>
              </div>

              {/* Search */}
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {dataLoading ? (
                <div className="p-2 text-center">
                  <Loader2 className="animate-spin h-3 w-3 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Loading...</p>
                </div>
              ) : (
                <div className="p-2">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-900 mb-1">
                        Select
                      </label>
                      <select
                        value={selectedClient?.id || ""}
                        onChange={(e) => {
                          const client = filteredQuotes.find(q => q.id === e.target.value)
                          if (client) {
                            selectClient(client)
                          }
                        }}
                        className="w-full px-2 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose client...</option>
                        {filteredQuotes.map((quote) => (
                          <option key={quote.id} value={quote.id}>
                            {quote.contactInfo.contactPerson}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {selectedClient && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded p-2 border border-blue-200">
                        <div className="flex items-center mb-1">
                          <Package className="h-3 w-3 text-blue-600 mr-1" />
                          <span className="text-xs font-semibold text-blue-900">Selected Cargo</span>
                        </div>
                        <div className="space-y-0.5">
                          {selectedClient.cargoDetails && (
                            <>
                              <div className="text-xs font-medium text-slate-900">
                                {selectedClient.cargoDetails.description}
                              </div>
                              {selectedClient.cargoDetails.weight && (
                                <div className="flex items-center text-xs text-slate-600">
                                  <span className="mr-1">Weight:</span>
                                  {selectedClient.cargoDetails.weight} kg
                                </div>
                              )}
                              {selectedClient.cargoDetails.volume && (
                                <div className="flex items-center text-xs text-slate-600">
                                  <span className="mr-1">Volume:</span>
                                  {selectedClient.cargoDetails.volume} m³
                                </div>
                              )}
                              {selectedClient.cargoDetails.quantity && (
                                <div className="flex items-center text-xs text-slate-600">
                                  <span className="mr-1">Quantity:</span>
                                  {selectedClient.cargoDetails.quantity}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!dataLoading && filteredQuotes.length === 0 && (
                <div className="text-center py-2">
                  <Users className="h-3 w-3 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">No pending requests</p>
                </div>
              )}
            </div>

            {/* Quotation Form */}
            <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Quotation Details</h2>
              </div>

              <div className="p-6 space-y-6">
                {selectedClient ? (
                  <>
                    {/* Client Information */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h3 className="text-md font-semibold text-slate-900 mb-3">Selected Client</h3>
                      <div className="space-y-2">
                        <div className="font-medium text-slate-900">
                          {selectedClient.contactInfo.contactPerson}
                        </div>
                        <div className="text-sm text-slate-600">
                          {selectedClient.contactInfo.email}
                        </div>
                        <div className="text-sm text-slate-600">
                          {selectedClient.contactInfo.phone}
                        </div>
                        {selectedClient.contactInfo.businessName && (
                          <div className="text-sm text-slate-600">
                            {selectedClient.contactInfo.businessName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cost Calculation */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-blue-900">Cost Calculation</h3>
                        {serviceType !== 'moving' && (
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-blue-900">Manual Pricing</label>
                            <input
                              type="checkbox"
                              checked={useManualPricing}
                              onChange={(e) => setUseManualPricing(e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                      
                      {serviceType === 'moving' ? (
                        /* Moving Service Itemized Cost Template */
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <h4 className="text-md font-semibold text-blue-900 mb-4">Itemized Cost Breakdown</h4>
                            <div className="space-y-3">
                              {movingItems.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 gap-2 items-center border-b border-slate-100 pb-2">
                                  <div className="col-span-6">
                                    <span className="text-sm font-medium text-slate-900">{item.id}. {item.name}</span>
                                  </div>
                                  <div className="col-span-2">
                                    <input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => updateMovingItem(item.id, 'quantity', e.target.value)}
                                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                                      placeholder="Qty"
                                      min="0"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <input
                                      type="number"
                                      value={item.unitPrice}
                                      onChange={(e) => updateMovingItem(item.id, 'unitPrice', e.target.value)}
                                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                                      placeholder="Unit Price"
                                      min="0"
                                    />
                                  </div>
                                  <div className="col-span-2 text-right">
                                    <span className="text-sm font-medium text-blue-900">
                                      TZS {item.total.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Total */}
                            <div className="mt-4 pt-3 border-t border-slate-200">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-blue-900">Total Cost:</span>
                                <span className="text-lg font-bold text-blue-900">TZS {movingTotalCost.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : useManualPricing ? (
                        /* Manual Pricing Fields */
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-2">Base Price (TZS)</label>
                              <input
                                type="number"
                                value={manualBasePrice}
                                onChange={(e) => setManualBasePrice(e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter base price"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-2">Additional Charges (TZS)</label>
                              <input
                                type="number"
                                value={manualAdditionalCharges}
                                onChange={(e) => setManualAdditionalCharges(e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter additional charges"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Automatic Pricing Fields */
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-2">Distance (km)</label>
                              <input
                                type="number"
                                value={distance}
                                onChange={(e) => {
                                  setDistance(e.target.value)
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
                                  setWeight(e.target.value)
                                  setTimeout(calculateCost, 100)
                                }}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter weight"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-2">Volume (m³)</label>
                              <input
                                type="number"
                                value={volume}
                                onChange={(e) => {
                                  setVolume(e.target.value)
                                  setTimeout(calculateCost, 100)
                                }}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter volume"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-2">Quantity</label>
                              <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                  setQuantity(e.target.value)
                                  setTimeout(calculateCost, 100)
                                }}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter quantity"
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
                                <option value="oversized">Oversized (+125,000 TZS)</option>
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

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-blue-900 mb-2">Urgency</label>
                            <select
                              value={urgency}
                              onChange={(e) => handleUrgencyChange(e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="normal">Normal</option>
                              <option value="urgent">Urgent (+75,000 TZS)</option>
                              <option value="same_day">Same Day (+150,000 TZS)</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* Cost Breakdown - Only for non-moving services */}
                      {serviceType !== 'moving' && (
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h4 className="text-md font-semibold text-blue-900 mb-3">Cost Breakdown</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">
                                {useManualPricing ? 'Base Price:' : 'Base Cost:'}
                              </span>
                              <span className="text-sm font-medium">
                                TZS {useManualPricing ? (Number(manualBasePrice) || 0).toLocaleString() : calculatedCost.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">
                                {useManualPricing ? 'Additional Charges:' : 'Additional Fees:'}
                              </span>
                              <span className="text-sm font-medium">
                                TZS {useManualPricing ? (Number(manualAdditionalCharges) || 0).toLocaleString() : additionalFees.toLocaleString()}
                              </span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                              <span className="text-sm font-semibold text-blue-900">Total Cost:</span>
                              <span className="text-sm font-bold text-blue-900">TZS {totalCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VAT/Tax Section */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-semibold text-blue-900">VAT/Tax Settings</h3>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-blue-900">Include VAT</label>
                          <input
                            type="checkbox"
                            checked={includeVAT}
                            onChange={(e) => setIncludeVAT(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      {includeVAT && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-2">VAT Percentage (%)</label>
                              <input
                                type="number"
                                value={vatPercentage}
                                onChange={(e) => setVatPercentage(e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter VAT percentage"
                                min="0"
                                max="100"
                                step="0.01"
                              />
                            </div>
                            <div className="flex items-end">
                              <div className="w-full">
                                <label className="block text-sm font-medium text-blue-900 mb-2">VAT Amount</label>
                                <div className="px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-900">
                                  TZS {vatAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Final Total Display with Breakdown */}
                      <div className="mt-4 pt-3 border-t border-blue-200">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Subtotal:</span>
                            <span className="text-sm font-medium">TZS {totalCost.toLocaleString()}</span>
                          </div>
                          {includeVAT && (
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">VAT ({vatPercentage}%):</span>
                              <span className="text-sm font-medium">TZS {vatAmount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between items-center">
                            <span className="text-lg font-semibold text-blue-900">Final Total:</span>
                            <span className="text-lg font-bold text-blue-900">TZS {finalTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-900">Quotation Notes & Memo</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={loadNotesTemplate}
                          className="text-xs"
                        >
                          Load Template
                        </Button>
                      </div>
                      <textarea
                        value={quotationNotes}
                        onChange={(e) => setQuotationNotes(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Include delivery terms, payment conditions, validity period, and any special instructions..."
                      />
                    </div>

                    {/* Terms and Conditions */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-900">Terms and Conditions</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={resetTermsAndConditions}
                          className="text-xs"
                        >
                          Load Template
                        </Button>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">
                        Add your terms and conditions below. Use the "Load Template" button to load a pre-written template if needed.
                      </div>
                      <textarea
                        value={termsAndConditions}
                        onChange={(e) => setTermsAndConditions(e.target.value)}
                        rows={12}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none font-mono text-xs"
                        placeholder="Enter your terms and conditions here..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        onClick={previewPDF}
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
                            Preview PDF
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={generatePDF}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Generate PDF
                      </Button>
                      <Button
                        onClick={sendQuotation}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Quotation
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Client</h3>
                    <p className="text-slate-500">Choose a pending client from the list to create a quotation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-slate-900">PDF Preview</h3>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = pdfUrl
                    link.download = `quotation-${selectedClient?.contactInfo.contactPerson.replace(/\s+/g, '-')}-${Date.now()}.pdf`
                    link.click()
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false)
                    setPdfUrl('')
                  }}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={pdfUrl}
                className="w-full h-full border rounded"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 