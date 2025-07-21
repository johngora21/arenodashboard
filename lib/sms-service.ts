const BEEM_API_KEY = "80d522935d6272ed"
const BEEM_SECRET_KEY = process.env.BEEM_SECRET_KEY || "M2Q4MTcxYjRjYjc1ZjIzNzFkYjFlOTRiNGJmNWRmYzE1MzhjNmEwOGJiODg2NGM2ZjQ1MTgyMWI2OGFhOWZmZA=="
const BEEM_SOURCE_ADDR = "ARENO"

interface SMSResponse {
  success: boolean
  message_id?: string
  error?: string
}

export class SMSService {
  public async sendSingleSMS(to: string, message: string): Promise<SMSResponse> {
    try {
      // Debug phone number formatting
      const formattedPhone = this.formatPhoneNumber(to)
      console.log(`SMS Debug - Original: "${to}" -> Formatted: "${formattedPhone}"`)
      
      // Validate phone number
      if (!to || to.trim() === '') {
        console.error('SMS Error: Empty phone number')
        return {
          success: false,
          error: 'Phone number is required'
        }
      }
      
      if (!formattedPhone || formattedPhone.length < 10) {
        console.error('SMS Error: Invalid phone number format')
        return {
          success: false,
          error: `Invalid phone number format: "${to}" -> "${formattedPhone}"`
        }
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
            dest_addr: formattedPhone.replace('+', '') // Remove + for API
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
        return {
          success: false,
          error: `SMS API Error: ${response.status} - ${responseText}`
        }
      }

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse SMS response:', responseText)
        return {
          success: false,
          error: `Invalid response format: ${responseText}`
        }
      }

      // Handle different response formats from Beem Africa
      if (responseData.successful) {
        return {
          success: true,
          message_id: responseData.request_id || 'unknown'
        }
      } else if (responseData.success) {
        return {
          success: true,
          message_id: responseData.message_id || responseData.request_id || 'unknown'
        }
      } else {
        return {
          success: false,
          error: responseData.message || responseData.error || 'Unknown error'
        }
      }
    } catch (error) {
      console.error('SMS Service Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private formatPhoneNumber(phone: string): string {
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

  // Message templates
  public getQuoteReadyMessage(contactPerson: string, serviceType: string): string {
    return `Dear ${contactPerson}, your ${serviceType} quote is ready! Please check your email or contact us at +255 XXX XXX XXX to discuss the details. Thank you for choosing Areno Logistics.`
  }

  public getServiceUpdateMessage(contactPerson: string, serviceType: string, status: string): string {
    return `Dear ${contactPerson}, your ${serviceType} service has been ${status}. We will keep you updated on any changes. For questions, call +255 XXX XXX XXX.`
  }

  public getCustomMessage(contactPerson: string, message: string): string {
    return `Dear ${contactPerson}, ${message} - Areno Logistics`
  }
}

export const smsService = new SMSService() 