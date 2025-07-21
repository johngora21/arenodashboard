const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const defaultRoles = [
  {
    name: 'Super Admin',
    code: 'super_admin',
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
    features: [
      'dashboard',
      'analytics',
      'shipments',
      'quotes',
      'customers',
      'agents',
      'drivers',
      'employees',
      'inventory',
      'finance',
      'reports',
      'settings',
      'user-management'
    ],
    status: 'active'
  },
  {
    name: 'Admin',
    code: 'admin',
    description: 'Administrative access with most permissions',
    level: 8,
    permissions: [
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
    features: [
      'dashboard',
      'analytics',
      'shipments',
      'quotes',
      'customers',
      'agents',
      'drivers',
      'employees',
      'inventory',
      'finance',
      'reports',
      'settings',
      'user-management'
    ],
    status: 'active'
  }
  // Add more roles as needed
];

const defaultUsers = [
  {
    email: 'johnjohngora@gmail.com',
    name: 'John Gora',
    role: 'Super Admin',
    roleId: '', // Will be set after roles are created
    permissions: ['all_access', 'user_management'],
    status: 'active',
    department: 'IT',
    position: 'System Administrator',
    phone: '+255123456789'
  }
  // Add more users as needed
];

async function initializeRBAC() {
  try {
    console.log('🚀 Initializing RBAC...');

    // Create roles
    const createdRoles = [];
    for (const role of defaultRoles) {
      const roleData = {
        ...role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const docRef = await db.collection('userRoles').add(roleData);
      createdRoles.push({ id: docRef.id, ...role });
      console.log(`✅ Created role: ${role.name}`);
    }

    // Create users
    for (const user of defaultUsers) {
      const role = createdRoles.find(r => r.name === user.role);
      if (!role) {
        console.warn(`⚠️  Role not found for user ${user.email}: ${user.role}`);
        continue;
      }
      const userData = {
        ...user,
        roleId: role.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      // Check if user already exists
      const userSnap = await db.collection('users').where('email', '==', user.email).get();
      if (userSnap.empty) {
        await db.collection('users').add(userData);
        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.log(`⚠️  User already exists: ${user.email}`);
      }
    }

    console.log('🎉 RBAC initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing RBAC:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeRBAC();
} 