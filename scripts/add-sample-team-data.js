const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBvXqJqJqJqJqJqJqJqJqJqJqJqJqJqJq",
  authDomain: "arenologistics-1.firebaseapp.com",
  projectId: "arenologistics-1",
  storageBucket: "arenologistics-1.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleTeamAssignments = [
  {
    shipmentId: "SH001",
    shipmentNumber: "SH001",
    assignedDriver: "emp001",
    assignedSupervisor: "emp002",
    assignedWorkers: ["emp003", "emp004"],
    assignmentDate: serverTimestamp(),
    status: "in-progress",
    notes: "Sample assignment for testing"
  },
  {
    shipmentId: "SH002",
    shipmentNumber: "SH002",
    assignedDriver: "emp005",
    assignedSupervisor: "emp006",
    assignedWorkers: ["emp007", "emp008", "emp009"],
    assignmentDate: serverTimestamp(),
    status: "pending",
    notes: "Another sample assignment"
  },
  {
    shipmentId: "SH003",
    shipmentNumber: "SH003",
    assignedDriver: "emp010",
    assignedSupervisor: "emp011",
    assignedWorkers: ["emp012"],
    assignmentDate: serverTimestamp(),
    status: "completed",
    completionDate: serverTimestamp(),
    notes: "Completed assignment"
  }
];

async function addSampleTeamData() {
  try {
    console.log('Adding sample team assignments...');
    
    for (const assignment of sampleTeamAssignments) {
      await addDoc(collection(db, 'teamAssignments'), {
        ...assignment,
        createdAt: serverTimestamp()
      });
    }
    
    console.log('Sample team data added successfully!');
  } catch (error) {
    console.error('Error adding sample team data:', error);
  }
}

addSampleTeamData(); 