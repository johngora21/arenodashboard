const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYyyjMzj2bANzmrExO73IXq9daSAUjpjw",
  authDomain: "arenologistics.firebaseapp.com",
  projectId: "arenologistics",
  storageBucket: "arenologistics.firebasestorage.app",
  messagingSenderId: "980259886387",
  appId: "1:980259886387:web:06027aa1b3e021ac301a46",
  measurementId: "G-KC6ZV5ZQLJ"
};

// Phone number formatting function
function formatPhoneNumber(phone) {
  if (!phone || phone.trim() === '') {
    return null;
  }
  
  // Remove any non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // If it starts with 0, replace with +255
  if (cleaned.startsWith('0')) {
    cleaned = '+255' + cleaned.substring(1)
  }
  
  // If it doesn't start with +255, add it
  if (!cleaned.startsWith('+255')) {
    cleaned = '+255' + cleaned
  }
  
  return cleaned;
}

async function checkAllPhoneNumbers() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('🔍 Checking phone numbers across all collections...\n');
    
    const collections = ['quotes', 'customers', 'employees', 'teamMembers'];
    const results = {};
    
    for (const collectionName of collections) {
      console.log(`📋 Checking ${collectionName}...`);
      
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        
        let total = 0;
        let validPhones = 0;
        let invalidPhones = 0;
        let emptyPhones = 0;
        const issues = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          total++;
          
          let phone = '';
          let name = 'Unknown';
          
          // Extract phone and name based on collection
          switch (collectionName) {
            case 'quotes':
              phone = data.contactInfo?.phone || '';
              name = data.contactInfo?.contactPerson || 'Unknown';
              break;
            case 'customers':
              phone = data.phone || '';
              name = data.name || 'Unknown';
              break;
            case 'employees':
              phone = data.phone || '';
              name = data.name || 'Unknown';
              break;
            case 'teamMembers':
              phone = data.phone || '';
              name = data.name || 'Unknown';
              break;
          }
          
          if (!phone || phone.trim() === '') {
            emptyPhones++;
            issues.push({
              type: 'EMPTY',
              id: doc.id,
              name,
              phone: phone || '(empty)'
            });
          } else {
            const formatted = formatPhoneNumber(phone);
            const apiFormat = formatted?.replace('+', '') || '';
            
            if (!formatted || apiFormat.length < 10) {
              invalidPhones++;
              issues.push({
                type: 'INVALID',
                id: doc.id,
                name,
                phone,
                formatted: formatted || '(invalid)',
                apiFormat
              });
            } else {
              validPhones++;
            }
          }
        });
        
        results[collectionName] = {
          total,
          validPhones,
          invalidPhones,
          emptyPhones,
          issues
        };
        
        console.log(`   Total: ${total}`);
        console.log(`   Valid: ${validPhones} ✅`);
        console.log(`   Invalid: ${invalidPhones} ❌`);
        console.log(`   Empty: ${emptyPhones} ❌`);
        console.log(`   Success Rate: ${total > 0 ? ((validPhones / total) * 100).toFixed(1) : 0}%\n`);
        
      } catch (error) {
        console.log(`   ❌ Error accessing ${collectionName}: ${error.message}\n`);
      }
    }
    
    // Summary
    console.log('📊 SUMMARY:');
    let totalIssues = 0;
    Object.entries(results).forEach(([collection, data]) => {
      const issues = data.invalidPhones + data.emptyPhones;
      totalIssues += issues;
      console.log(`   ${collection}: ${issues} issues`);
    });
    
    if (totalIssues > 0) {
      console.log('\n🚨 DETAILED ISSUES:');
      Object.entries(results).forEach(([collection, data]) => {
        if (data.issues.length > 0) {
          console.log(`\n📋 ${collection.toUpperCase()}:`);
          data.issues.forEach((issue, index) => {
            console.log(`   ${index + 1}. ${issue.type}: ${issue.name} (${issue.id})`);
            console.log(`      Phone: "${issue.phone}"`);
            if (issue.formatted) {
              console.log(`      Formatted: "${issue.formatted}"`);
            }
          });
        }
      });
    } else {
      console.log('\n✅ All phone numbers are valid across all collections!');
    }
    
  } catch (error) {
    console.error('❌ Error checking phone numbers:', error);
  }
}

// Run the check
checkAllPhoneNumbers(); 