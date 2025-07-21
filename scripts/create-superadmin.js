const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore')

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvOkRjH2fFepF8j2ph3WqhyCfgQh3mnyQ",
  authDomain: "arenologistics-1.firebaseapp.com",
  projectId: "arenologistics-1",
  storageBucket: "arenologistics-1.appspot.com",
  messagingSenderId: "1097169478366",
  appId: "1:1097169478366:web:8c8c8c8c8c8c8c8c8c8c8c"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function createSuperAdmin() {
  const email = 'johnjohngora@gmail.com'
  
  console.log(`Creating superadmin user: ${email}`)
  
  try {
    const userData = {
      email: email,
      name: 'John Gora',
      role: 'superadmin',
      roleId: '',
      permissions: ['all_access'],
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const usersRef = collection(db, 'users')
    const docRef = await addDoc(usersRef, userData)
    
    console.log('✅ Superadmin user created successfully!')
    console.log('Document ID:', docRef.id)
    console.log('User data:', userData)
    
  } catch (error) {
    console.error('❌ Error creating superadmin:', error)
  }
}

createSuperAdmin()
  .then(() => {
    console.log('✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }) 