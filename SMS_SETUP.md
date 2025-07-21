# SMS Setup Guide for Admin Dashboard

## Beem Africa SMS Integration

The admin dashboard now includes SMS functionality using Beem Africa's API. Here's how to set it up:

### 1. Environment Variables

Create a `.env.local` file in the admin-dashboard directory with the following content:

```env
# Beem Africa SMS API
BEEM_API_KEY=127b99114c09d449
BEEM_SECRET_KEY=YTJkZGZhODk0MjIwYjQ5NTdmYjQzNTMzMTZlZDI1MmE3OTY0ZDIzMzY2OTUyYjBkOGFiZDNjMjU5ZjEwNWNlNA==

# Firebase Config (already set in firebase-config.ts)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCYyyjMzj2bANzmrExO73IXq9daSAUjpjw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=arenologistics.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=arenologistics
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=arenologistics.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=980259886387
NEXT_PUBLIC_FIREBASE_APP_ID=1:980259886387:web:06027aa1b3e021ac301a46
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-KC6ZV5ZQLJ
```

### 2. Configuration Complete

✅ **API Key**: `127b99114c09d449`  
✅ **Secret Key**: `YTJkZGZhODk0MjIwYjQ5NTdmYjQzNTMzMTZlZDI1MmE3OTY0ZDIzMzY2OTUyYjBkOGFiZDNjMjU5ZjEwNWNlNA==`  
✅ **Sender Name**: `ARENO` (registered with Beem Africa)

### 3. Features

The SMS integration includes:

- **Automatic SMS**: When clients submit quote requests, they automatically receive a confirmation SMS
- **Admin SMS**: From the admin dashboard, you can send:
  - Quick template messages (Quote Ready, Service Update)
  - Custom messages to any client
- **Phone Number Formatting**: Automatically formats phone numbers for Tanzania (+255)

### 4. Message Templates

#### Automatic Confirmation (sent when quote is submitted):
```
Dear [Name], thank you for your [service type] quote request with Areno Logistics. We have received your request and will contact you within 24 hours with a detailed quote. For urgent inquiries, call us at +255 XXX XXX XXX.
```

#### Quote Ready Template:
```
Dear [Name], your [service type] quote is ready! Please check your email or contact us at +255 XXX XXX XXX to discuss the details. Thank you for choosing Areno Logistics.
```

#### Service Update Template:
```
Dear [Name], your [service type] service has been updated. We will keep you updated on any changes. For questions, call +255 XXX XXX XXX.
```

### 5. Usage

1. **View Quotes**: Go to the admin dashboard and view all quote requests
2. **Send SMS**: Click the "SMS" button next to any quote
3. **Choose Template**: Use quick templates or write a custom message
4. **Send**: Click "Send SMS" to deliver the message

### 6. Testing

To test the SMS functionality:

1. Submit a test quote from the main website
2. Check that the automatic confirmation SMS is sent
3. Log into the admin dashboard
4. Try sending a test SMS using the templates

### 7. Troubleshooting

If SMS sending fails:

1. ✅ Check that your Beem secret key is correct (already configured)
2. Verify your Beem account has sufficient credits
3. Check the browser console for error messages
4. Ensure phone numbers are in the correct format

### 8. Cost

- Beem Africa charges per SMS sent
- Check your Beem dashboard for current rates and credit balance
- SMS costs are typically very low (a few cents per message)

### 9. Security

- The API key is stored in environment variables
- Never commit the `.env.local` file to version control
- The secret key is only used server-side for API calls 