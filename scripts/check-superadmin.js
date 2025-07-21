const { initializeApp } = require('firebase/app')
const { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc } = require('firebase/firestore')

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

async function checkAndFixSuperAdmin() {
  const email = 'johnjohngora@gmail.com'
  
  console.log(`Checking superadmin status for: ${email}`)
  
  try {
    // Check users collection
    const usersRef = collection(db, 'users')
    const usersQuery = query(usersRef, where('email', '==', email))
    const usersSnapshot = await getDocs(usersQuery)
    
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0]
      const userData = userDoc.data()
      console.log('Found in users collection:', userData)
      
      if (userData.role !== 'superadmin') {
        console.log('Updating user to superadmin...')
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: 'superadmin',
          permissions: ['all_access']
        })
        console.log('✅ User updated to superadmin')
      } else {
        console.log('✅ User is already superadmin')
      }
    } else {
      console.log('User not found in users collection')
    }
    
    // Check employees collection
    const employeesRef = collection(db, 'employees')
    const employeesQuery = query(employeesRef, where('email', '==', email))
    const employeesSnapshot = await getDocs(employeesQuery)
    
    if (!employeesSnapshot.empty) {
      const employeeDoc = employeesSnapshot.docs[0]
      const employeeData = employeeDoc.data()
      console.log('Found in employees collection:', employeeData)
      
      if (employeeData.role !== 'superadmin') {
        console.log('Updating employee to superadmin...')
        await updateDoc(doc(db, 'employees', employeeDoc.id), {
          role: 'superadmin',
          permissions: ['all_access']
        })
        console.log('✅ Employee updated to superadmin')
      } else {
        console.log('✅ Employee is already superadmin')
      }
    } else {
      console.log('Employee not found in employees collection')
    }
    
    // If not found in either collection, create in users collection
    if (usersSnapshot.empty && employeesSnapshot.empty) {
      console.log('Creating superadmin user...')
      const userData = {
        email: email,
        name: 'John Gora',
        role: 'superadmin',
        roleId: '',
        permissions: ['all_access'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(doc(collection(db, 'users')), userData)
      console.log('✅ Superadmin user created')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkAndFixSuperAdmin()
  .then(() => {
    console.log('✅ Superadmin check complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  }) 