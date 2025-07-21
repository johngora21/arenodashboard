const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addUserManagementPermission() {
  try {
    // Replace with the actual email of the user who needs the permission
    const userEmail = 'johnjohngora@gmail.com'; // Change this to your email
    
    console.log(`🔍 Adding user_management permission to: ${userEmail}`);
    
    // Find user by email
    const userQuery = await db.collection('users')
      .where('email', '==', userEmail)
      .get();
    
    if (userQuery.empty) {
      console.log('❌ User not found. Creating new user document...');
      
      // Create new user document
      const newUser = {
        email: userEmail,
        name: 'John Gora', // Update with actual name
        role: 'admin',
        roleId: 'admin',
        permissions: ['user_management', 'all_access'],
        status: 'active',
        department: 'IT',
        position: 'System Administrator',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('users').add(newUser);
      console.log(`✅ Created new user document with ID: ${docRef.id}`);
      console.log('✅ Added permissions:', newUser.permissions);
      
    } else {
      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();
      
      console.log(`✅ Found existing user: ${userDoc.id}`);
      console.log('Current permissions:', userData.permissions || []);
      
      // Add user_management permission if not already present
      const currentPermissions = userData.permissions || [];
      if (!currentPermissions.includes('user_management')) {
        const updatedPermissions = [...currentPermissions, 'user_management'];
        
        await db.collection('users').doc(userDoc.id).update({
          permissions: updatedPermissions,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Added user_management permission');
        console.log('Updated permissions:', updatedPermissions);
      } else {
        console.log('✅ User already has user_management permission');
      }
    }
    
    // Also add all_access permission for full access
    const finalUserQuery = await db.collection('users')
      .where('email', '==', userEmail)
      .get();
    
    if (!finalUserQuery.empty) {
      const userDoc = finalUserQuery.docs[0];
      const userData = userDoc.data();
      const currentPermissions = userData.permissions || [];
      
      if (!currentPermissions.includes('all_access')) {
        const updatedPermissions = [...currentPermissions, 'all_access'];
        
        await db.collection('users').doc(userDoc.id).update({
          permissions: updatedPermissions,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Added all_access permission');
        console.log('Final permissions:', updatedPermissions);
      }
    }
    
  } catch (error) {
    console.error('❌ Error adding permission:', error);
  }
}

if (require.main === module) {
  addUserManagementPermission().then(() => process.exit(0));
} 