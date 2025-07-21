'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Loader2, Send, CheckCircle, XCircle, Bug } from 'lucide-react'

// Phone number formatting function (same as in SMS service)
function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // If it starts with 0, replace with +255
  if (cleaned.startsWith('0')) {
    cleaned = '+255' + cleaned.substring(1)
  }
  
  // If it doesn't start with +255, add it
  if (!cleaned.startsWith('+255')) {
    cleaned = '+255' + cleaned
  }
  
  return cleaned
}

export default function TestSMSPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleSendSMS = async () => {
    if (!phoneNumber || !message) {
      setResult({ success: false, error: 'Phone number and message are required' })
      return
    }

    setIsLoading(true)
    setResult(null)

    // Debug phone number formatting
    const formattedNumber = formatPhoneNumber(phoneNumber)
    setDebugInfo({
      original: phoneNumber,
      formatted: formattedNumber,
      length: formattedNumber.length
    })

    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phoneNumber, message })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Network error' })
    } finally {
      setIsLoading(false)
    }
  }

  const testSampleQuotes = () => {
    const sampleQuotes = [
      { phone: '0712345678', name: 'Sample 1' },
      { phone: '+255712345678', name: 'Sample 2' },
      { phone: '255712345678', name: 'Sample 3' },
      { phone: '0712 345 678', name: 'Sample 4' },
      { phone: '', name: 'Empty Phone' },
      { phone: 'invalid', name: 'Invalid Phone' }
    ]

    console.log('=== PHONE NUMBER FORMATTING DEBUG ===')
    sampleQuotes.forEach(quote => {
      const formatted = formatPhoneNumber(quote.phone)
      console.log(`${quote.name}: "${quote.phone}" -> "${formatted}" (${formatted.length} chars)`)
    })
    console.log('=====================================')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            SMS Testing & Debug
          </CardTitle>
          <CardDescription>
            Test SMS functionality and debug phone number formatting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="text"
                placeholder="0712345678 or +255712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSendSMS} disabled={isLoading || !phoneNumber || !message}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send SMS
                </>
              )}
            </Button>
            <Button variant="outline" onClick={testSampleQuotes}>
              <Bug className="h-4 w-4 mr-2" />
              Debug Phone Numbers
            </Button>
          </div>

          {debugInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div><strong>Original:</strong> "{debugInfo.original}"</div>
                  <div><strong>Formatted:</strong> "{debugInfo.formatted}"</div>
                  <div><strong>Length:</strong> {debugInfo.length} characters</div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  SMS Sent Successfully
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  SMS Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  SMS sent successfully! Message ID: {result.message_id}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>Error: {result.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <strong>Common Issues:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Empty phone numbers in quote data</li>
              <li>Invalid phone number formats</li>
              <li>Phone numbers without country code</li>
              <li>Special characters in phone numbers</li>
            </ul>
          </div>
                      <div className="text-sm">
              <strong>Valid Formats:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>0712345678 → +255712345678</li>
                <li>+255712345678 → +255712345678</li>
                <li>255712345678 → +255712345678</li>
                <li>0712 345 678 → +255712345678</li>
              </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  )
} 