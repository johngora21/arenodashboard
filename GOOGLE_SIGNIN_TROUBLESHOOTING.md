# Google Sign-In Troubleshooting Guide

## Common Issues and Solutions

### 1. "Sign-in failed. Please try again."

This generic error can have several causes. Check the browser console for specific error codes.

### 2. Error Codes and Solutions

#### `auth/operation-not-allowed`
**Problem**: Google sign-in is not enabled in Firebase
**Solution**: 
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add your authorized domain

#### `auth/unauthorized-domain`
**Problem**: The domain is not authorized in Firebase
**Solution**:
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add `localhost` for development
3. Add your production domain when deployed

#### `auth/popup-blocked`
**Problem**: Browser blocked the popup
**Solution**:
1. Allow popups for localhost:3002
2. Disable ad blockers temporarily
3. Try a different browser

#### `auth/network-request-failed`
**Problem**: Network connectivity issues
**Solution**:
1. Check internet connection
2. Try refreshing the page
3. Check if Firebase services are accessible

#### `auth/invalid-api-key`
**Problem**: Firebase API key is incorrect
**Solution**:
1. Verify the API key in `firebase-config.ts`
2. Check if the key is from the correct Firebase project

### 3. Firebase Console Setup

#### Step 1: Enable Google Authentication
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`arenologistics`)
3. Go to Authentication → Sign-in method
4. Click on Google
5. Enable it and save

#### Step 2: Add Authorized Domains
1. Go to Authentication → Settings
2. Scroll to "Authorized domains"
3. Add these domains:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - Your production domain (when deployed)

#### Step 3: Verify Project Settings
1. Go to Project Settings
2. Check that the API key matches: `AIzaSyCYyyjMzj2bANzmrExO73IXq9daSAUjpjw`
3. Verify the project ID is: `arenologistics`

### 4. Browser Console Debugging

Open browser console (F12) and look for:

```javascript
// These should appear when the page loads:
"Firebase Auth initialized: [object]"
"Firebase app config: [object]"
"Firebase Status: Firebase loaded successfully"

// When clicking sign-in:
"Auth instance: [object]"
"Google provider created: [object]"
"Attempting Google sign-in..."

// If successful:
"Sign-in successful: [email]"

// If failed:
"Sign-in error details: [error object]"
"Error code: [error code]"
"Error message: [error message]"
```

### 5. Testing Steps

1. **Clear browser cache and cookies**
2. **Try incognito/private mode**
3. **Test with different browsers** (Chrome, Firefox, Safari)
4. **Check network tab** for failed requests
5. **Verify Firebase project** is active and billing is set up

### 6. Environment Variables

Make sure your `.env.local` file exists in the admin-dashboard directory:

```env
# Beem Africa SMS API
BEEM_SECRET_KEY=your_beem_secret_key_here

# Firebase Config (already set in firebase-config.ts)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCYyyjMzj2bANzmrExO73IXq9daSAUjpjw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=arenologistics.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=arenologistics
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=arenologistics.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=980259886387
NEXT_PUBLIC_FIREBASE_APP_ID=1:980259886387:web:06027aa1b3e021ac301a46
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-KC6ZV5ZQLJ
```

### 7. Common Development Issues

#### Port Conflicts
If you see port conflicts, try:
```bash
# Kill processes using ports
lsof -ti:3002,3003,3004 | xargs kill -9

# Start admin dashboard on different port
cd admin-dashboard && npm run dev -- -p 3005
```

#### Firebase Config Issues
If Firebase isn't loading:
1. Check `firebase-config.ts` has correct values
2. Verify imports are working
3. Check for TypeScript errors

### 8. Production Deployment

When deploying to production:

1. **Add your domain** to Firebase authorized domains
2. **Update environment variables** for production
3. **Test on production domain** before going live
4. **Monitor Firebase console** for any errors

### 9. Alternative Sign-in Methods

If Google sign-in continues to fail, consider:

1. **Email/Password authentication**
2. **Phone number authentication**
3. **Custom authentication**

### 10. Getting Help

If issues persist:

1. **Check Firebase status page**: https://status.firebase.google.com
2. **Review Firebase documentation**: https://firebase.google.com/docs/auth
3. **Check browser console** for detailed error messages
4. **Test with Firebase Auth Emulator** for local development

### 11. Quick Fix Checklist

- [ ] Google sign-in enabled in Firebase Console
- [ ] `localhost` added to authorized domains
- [ ] Browser popups allowed
- [ ] No ad blockers interfering
- [ ] Firebase config values are correct
- [ ] Network connection is stable
- [ ] Browser console shows no errors
- [ ] Firebase project is active and not suspended 