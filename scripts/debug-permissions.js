const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, query, where, getDocs, doc, getDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqX",
  authDomain: "arenologistics-1.firebaseapp.com",
  projectId: "arenologistics-1",
  storageBucket: "arenologistics-1.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function debugUserPermissions() {
  try {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No user is currently authenticated');
      return;
    }

    console.log('✅ User authenticated:', currentUser.email);
    console.log('User UID:', currentUser.uid);

    // Try to get user document by UID
    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ User document found by UID');
      console.log('User data:', userData);
      console.log('Permissions:', userData.permissions || []);
      console.log('Has user_management permission:', (userData.permissions || []).includes('user_management'));
    } else {
      console.log('❌ User document not found by UID');
      
      // Try to find user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', currentUser.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        console.log('✅ User document found by email');
        console.log('User data:', userData);
        console.log('Permissions:', userData.permissions || []);
        console.log('Has user_management permission:', (userData.permissions || []).includes('user_management'));
      } else {
        console.log('❌ User document not found by email either');
      }
    }

    // Check all users in the system
    console.log('\n--- All Users in System ---');
    const allUsersRef = collection(db, 'users');
    const allUsersSnapshot = await getDocs(allUsersRef);
    
    allUsersSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`${userData.email}: ${userData.permissions || []}`);
    });

  } catch (error) {
    console.error('Error debugging permissions:', error);
  }
}

// Run the debug function
debugUserPermissions(); 