# SMS Integration with Beem Africa

## Overview
This system integrates with Beem Africa's SMS API to send notifications and updates to customers and employees.

## Configuration

### API Credentials
- **API Key**: `d00a6ff6e1ffa4ea`
- **Secret Key**: `M2Q4MTcxYjRjYjc1ZjIzNzFkYjFlOTRiNGJmNWRmYzE1MzhjNmEwOGJiODg2NGM2ZjQ1MTgyMWI2OGFhOWZmZA==`
- **Source Address**: `ARENO`

### Files Updated
1. `lib/sms-service.ts` - Main SMS service
2. `app/api/sms/route.ts` - SMS API endpoint
3. `app/test-sms/page.tsx` - Test page for SMS functionality

## Features

### SMS Service Methods
- `sendSingleSMS(to: string, message: string)` - Send single SMS
- `getQuoteReadyMessage()` - Quote ready notification
- `getServiceUpdateMessage()` - Service status updates
- `getCustomMessage()` - Custom messages

### Integration Points
- **HR Page**: Employee notifications
- **CRM Page**: Customer communications
- **Quotes Page**: Quote status updates
- **Shipments Teams**: Team coordination
- **Test SMS Page**: Testing and verification

## Usage

### Testing SMS
1. Navigate to `/test-sms`
2. Enter phone number (with country code)
3. Enter message (max 160 characters)
4. Click "Send SMS"

### Programmatic Usage
```typescript
import { smsService } from '@/lib/sms-service'

// Send SMS
const result = await smsService.sendSingleSMS(
  '+255712345678',
  'Your shipment has been delivered!'
)

if (result.success) {
  console.log('SMS sent:', result.message_id)
} else {
  console.error('SMS failed:', result.error)
}
```

## Phone Number Formatting
- Automatically formats Tanzanian numbers (+255)
- Supports international formats
- Removes non-digit characters
- Adds country code if missing

## Message Templates
- Quote ready notifications
- Service status updates
- Delivery confirmations
- Custom business messages

## Error Handling
- Network error detection
- API response validation
- Message length validation (160 char limit)
- Phone number validation

## Security
- API credentials stored securely
- Base64 encoded authentication
- HTTPS API calls
- Input validation and sanitization 