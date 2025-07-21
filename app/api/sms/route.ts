import { NextRequest, NextResponse } from 'next/server'

const BEEM_API_KEY = "80d522935d6272ed"
const BEEM_SECRET_KEY = process.env.BEEM_SECRET_KEY || "M2Q4MTcxYjRjYjc1ZjIzNzFkYjFlOTRiNGJmNWRmYzE1MzhjNmEwOGJiODg2NGM2ZjQ1MTgyMWI2OGFhOWZmZA=="
const BEEM_SOURCE_ADDR = "ARENO"

// Phone number formatting function
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

interface SMSRequest {
  source_addr: string
  schedule_time: string
  encoding: number
  message: string
  recipients: {
    recipient_id: number
    dest_addr: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      )
    }

    if (!BEEM_SECRET_KEY) {
      console.error('BEEM_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'SMS service not configured' },
        { status: 500 }
      )
    }

    // The secret key should be used as-is (not decoded)
    const authHeader = Buffer.from(`${BEEM_API_KEY}:${BEEM_SECRET_KEY}`).toString('base64')
    
    const smsData = {
      source_addr: BEEM_SOURCE_ADDR,
      schedule_time: "",
      encoding: 0,
      message: message,
              recipients: [
          {
            recipient_id: 1,
            dest_addr: formatPhoneNumber(to).replace('+', '') // Remove + for API
          }
        ]
    }

    console.log('Sending SMS with data:', JSON.stringify(smsData, null, 2))
    console.log('Authorization header:', authHeader)

    const response = await fetch('https://apisms.beem.africa/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(smsData)
    })

    const responseText = await response.text()
    console.log('SMS API Response:', response.status, responseText)

    if (!response.ok) {
      console.error('SMS API Error:', response.status, responseText)
      return NextResponse.json(
        { error: `SMS API Error: ${response.status} - ${responseText}` },
        { status: response.status }
      )
    }

    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse SMS response:', responseText)
      return NextResponse.json(
        { error: `Invalid response format: ${responseText}` },
        { status: 500 }
      )
    }

    // Handle different response formats from Beem Africa
    if (responseData.successful) {
      return NextResponse.json({
        success: true,
        message_id: responseData.request_id || 'unknown'
      })
    } else if (responseData.success) {
      return NextResponse.json({
        success: true,
        message_id: responseData.message_id || responseData.request_id || 'unknown'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: responseData.message || responseData.error || 'Unknown error'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('SMS API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 