const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCYyyjMzj2bANzmrExO73IXq9daSAUjpjw",
  authDomain: "arenologistics.firebaseapp.com",
  projectId: "arenologistics",
  storageBucket: "arenologistics.firebasestorage.app",
  messagingSenderId: "980259886387",
  appId: "1:980259886387:web:06027aa1b3e021ac301a46",
  measurementId: "G-KC6ZV5ZQLJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupSuperAdmin() {
  const email = 'johnjohngora@gmail.com';
  
  try {
    console.log('Setting up superadmin for:', email);
    
    // Check if user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('User already exists as superadmin');
      return;
    }
    
    // Create superadmin role
    const superadminRole = {
      name: 'Super Administrator',
      code: 'superadmin',
      description: 'Full system access with all permissions',
      level: 10,
      permissions: [
        'all_access',
        'user_management',
        'role_management',
        'system_settings',
        'data_export',
        'analytics_access',
        'financial_access',
        'hr_access',
        'inventory_access',
        'shipment_management',
        'customer_management',
        'agent_management',
        'driver_management'
      ],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add the superadmin role
    const rolesRef = collection(db, 'roles');
    const roleDoc = await addDoc(rolesRef, superadminRole);
    console.log('Superadmin role created with ID:', roleDoc.id);
    
    // Create user document
    const userData = {
      email: email,
      role: 'superadmin',
      roleId: roleDoc.id,
      permissions: superadminRole.permissions,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userDoc = await addDoc(usersRef, userData);
    console.log('Superadmin user created with ID:', userDoc.id);
    
    console.log('✅ Superadmin setup completed successfully!');
    console.log('Email:', email);
    console.log('Role ID:', roleDoc.id);
    console.log('User ID:', userDoc.id);
    
  } catch (error) {
    console.error('❌ Error setting up superadmin:', error);
  }
}

setupSuperAdmin(); 