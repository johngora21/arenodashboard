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

async function checkPhoneNumbers() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('🔍 Checking phone numbers in quotes...\n');
    
    // Get all quotes
    const quotesSnapshot = await getDocs(collection(db, 'quotes'));
    
    let totalQuotes = 0;
    let validPhones = 0;
    let invalidPhones = 0;
    let emptyPhones = 0;
    
    const issues = [];
    
    quotesSnapshot.forEach((doc) => {
      const quote = doc.data();
      totalQuotes++;
      
      const phone = quote.contactInfo?.phone || '';
      const contactPerson = quote.contactInfo?.contactPerson || 'Unknown';
      const quoteId = doc.id;
      
      if (!phone || phone.trim() === '') {
        emptyPhones++;
        issues.push({
          type: 'EMPTY',
          quoteId,
          contactPerson,
          phone: phone || '(empty)'
        });
      } else {
        const formatted = formatPhoneNumber(phone);
        const apiFormat = formatted?.replace('+', '') || '';
        
        if (!formatted || apiFormat.length < 10) {
          invalidPhones++;
          issues.push({
            type: 'INVALID',
            quoteId,
            contactPerson,
            phone,
            formatted: formatted || '(invalid)',
            apiFormat
          });
        } else {
          validPhones++;
        }
      }
    });
    
    console.log(`📊 Phone Number Analysis:`);
    console.log(`   Total Quotes: ${totalQuotes}`);
    console.log(`   Valid Phones: ${validPhones} ✅`);
    console.log(`   Invalid Phones: ${invalidPhones} ❌`);
    console.log(`   Empty Phones: ${emptyPhones} ❌`);
    console.log(`   Success Rate: ${((validPhones / totalQuotes) * 100).toFixed(1)}%\n`);
    
    if (issues.length > 0) {
      console.log('🚨 Issues Found:');
      issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.type} PHONE NUMBER`);
        console.log(`   Quote ID: ${issue.quoteId}`);
        console.log(`   Contact: ${issue.contactPerson}`);
        console.log(`   Original: "${issue.phone}"`);
        if (issue.formatted) {
          console.log(`   Formatted: "${issue.formatted}"`);
          console.log(`   API Format: "${issue.apiFormat}"`);
        }
      });
      
      console.log('\n💡 Recommendations:');
      console.log('   - Update invalid phone numbers in your quotes');
      console.log('   - Add phone numbers for quotes with empty phone fields');
      console.log('   - Ensure all phone numbers follow Tanzania format (+255XXXXXXXXX)');
    } else {
      console.log('✅ All phone numbers are valid!');
    }
    
  } catch (error) {
    console.error('❌ Error checking phone numbers:', error);
  }
}

// Run the check
checkPhoneNumbers(); 