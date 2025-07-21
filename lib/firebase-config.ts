import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCYyyjMzj2bANzmrExO73IXq9daSAUjpjw",
  authDomain: "arenologistics.firebaseapp.com",
  projectId: "arenologistics",
  storageBucket: "arenologistics.firebasestorage.app",
  messagingSenderId: "980259886387",
  appId: "1:980259886387:web:06027aa1b3e021ac301a46",
  measurementId: "G-KC6ZV5ZQLJ"
}

// Initialize Firebase app with error handling
let app: import("firebase/app").FirebaseApp
try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
} catch (error) {
  console.error('Firebase initialization error:', error)
  // Fallback initialization
  app = initializeApp(firebaseConfig)
}

// Initialize services with error handling
let db: import("firebase/firestore").Firestore, storage, auth

try {
  db = getFirestore(app)
} catch (error) {
  console.error('Firestore initialization error:', error)
  throw error
}

try {
  storage = getStorage(app)
} catch (error) {
  console.error('Storage initialization error:', error)
  throw error
}

try {
  auth = getAuth(app)
} catch (error) {
  console.error('Auth initialization error:', error)
  throw error
}

export { app, db, storage, auth }

// Initialize authentication for admin dashboard (simplified approach)
export const initializeAuth = async () => {
  try {
    // Check if user is already signed in
    const currentUser = auth.currentUser
    if (currentUser) {
      console.log('User already authenticated:', currentUser.uid)
      return currentUser
    }
    
    // For now, we'll work without authentication since anonymous auth is disabled
    // The Firebase rules will handle the security
    console.log('Firebase initialized without authentication - using rules-based security')
    return null
  } catch (error) {
    console.error('Authentication initialization failed:', error)
    // Don't throw error, continue without authentication
    console.log('Continuing without authentication...')
    return null
  }
} 