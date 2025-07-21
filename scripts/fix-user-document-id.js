const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fixUserDocumentId() {
  try {
    const userEmail = 'johnjohngora@gmail.com';
    const authUid = 'IEUc2VBvqTXqqC4Vv2eBaukgTm53'; // Replace with actual UID
    
    console.log(`🔍 Fixing user document ID for: ${userEmail}`);
    console.log(`Auth UID: ${authUid}`);
    
    // Find the existing user document by email
    const userQuery = await db.collection('users')
      .where('email', '==', userEmail)
      .get();
    
    if (userQuery.empty) {
      console.log('❌ No user document found');
      return;
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    console.log(`✅ Found user document with ID: ${userDoc.id}`);
    console.log('User data:', userData);
    
    // Create new document with correct UID as ID
    await db.collection('users').doc(authUid).set({
      ...userData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`✅ Created new document with correct UID: ${authUid}`);
    
    // Delete the old document
    await db.collection('users').doc(userDoc.id).delete();
    console.log(`✅ Deleted old document: ${userDoc.id}`);
    
    console.log('✅ User document ID fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing user document ID:', error);
  }
}

if (require.main === module) {
  fixUserDocumentId().then(() => process.exit(0));
} 