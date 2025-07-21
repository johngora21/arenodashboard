const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function debugUserIds() {
  try {
    console.log('🔍 Debugging user IDs...');
    
    // Check users collection
    console.log('\n📋 Users Collection:');
    const usersSnapshot = await db.collection('users').get();
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id} | Email: ${data.email} | Name: ${data.name}`);
    });
    
    // Check employees collection
    console.log('\n👥 Employees Collection:');
    const employeesSnapshot = await db.collection('employees').get();
    employeesSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id} | Email: ${data.email} | Name: ${data.name}`);
    });
    
    // Check if the problematic ID exists in either collection
    const problematicId = 'UmBXNNRDi2cZg6Pnzsto';
    console.log(`\n🔍 Checking for ID: ${problematicId}`);
    
    // Check in users collection
    const userDoc = await db.collection('users').doc(problematicId).get();
    if (userDoc.exists) {
      console.log(`✅ Found in users collection: ${userDoc.data().email}`);
    } else {
      console.log('❌ Not found in users collection');
    }
    
    // Check in employees collection
    const employeeDoc = await db.collection('employees').doc(problematicId).get();
    if (employeeDoc.exists) {
      console.log(`✅ Found in employees collection: ${employeeDoc.data().email}`);
    } else {
      console.log('❌ Not found in employees collection');
    }
    
  } catch (error) {
    console.error('❌ Error debugging user IDs:', error);
  }
}

if (require.main === module) {
  debugUserIds().then(() => process.exit(0));
} 