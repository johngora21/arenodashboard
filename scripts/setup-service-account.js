const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

console.log('🔍 Checking for Firebase service account key...');
console.log(`📁 Looking for file: ${serviceAccountPath}`);

if (fs.existsSync(serviceAccountPath)) {
  console.log('✅ Service account key file found!');
  console.log('🚀 You can now run: node scripts/initialize-rbac.js');
} else {
  console.log('❌ Service account key file not found!');
  console.log('');
  console.log('📋 To fix this:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Download the JSON file');
  console.log('4. Rename it to "serviceAccountKey.json"');
  console.log('5. Place it in the admin-dashboard directory');
  console.log('');
  console.log('📁 Expected location:', serviceAccountPath);
  console.log('');
  console.log('⚠️  Make sure to add serviceAccountKey.json to .gitignore to keep it secure!');
} 