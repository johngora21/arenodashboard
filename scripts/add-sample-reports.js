const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCYyyjMzj2bANzmrExO73IXq9daSAUjpjw",
  authDomain: "arenologistics.firebaseapp.com",
  projectId: "arenologistics",
  storageBucket: "arenologistics.firebasestorage.app",
  messagingSenderId: "980259886387",
  appId: "1:980259886387:web:06027aa1b3e021ac301a46",
  measurementId: "G-KC6ZV5ZQLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleReports = [
  {
    title: "Monthly HR Performance Report",
    description: "Comprehensive report on employee performance, attendance, and productivity metrics for the month of December 2024.",
    department: "HR",
    submittedBy: "hr.manager@arenologistics.com",
    submittedAt: Timestamp.now(),
    status: "pending",
    reportType: "Performance Analysis",
    data: {
      totalEmployees: 45,
      averageAttendance: 94.5,
      performanceScore: 8.2,
      newHires: 3,
      terminations: 1,
      trainingHours: 120
    },
    comments: "This report highlights significant improvements in team productivity and suggests areas for further development."
  },
  {
    title: "Inventory Stock Level Report",
    description: "Current inventory levels, stock movements, and reorder recommendations for all warehouse locations.",
    department: "Inventory",
    submittedBy: "inventory.supervisor@arenologistics.com",
    submittedAt: Timestamp.now(),
    status: "pending",
    reportType: "Stock Analysis",
    data: {
      totalItems: 1250,
      lowStockItems: 23,
      overstockItems: 8,
      totalValue: 450000,
      turnoverRate: 2.4
    },
    comments: "Several items require immediate reordering to prevent stockouts during peak season."
  },
  {
    title: "Logistics Operations Report",
    description: "Delivery performance, route optimization, and fleet utilization analysis for Q4 2024.",
    department: "Logistics",
    submittedBy: "logistics.coordinator@arenologistics.com",
    submittedAt: Timestamp.now(),
    status: "pending",
    reportType: "Operations Review",
    data: {
      totalDeliveries: 1250,
      onTimeDelivery: 96.8,
      averageDeliveryTime: 2.3,
      fuelConsumption: 4500,
      maintenanceCosts: 12500
    },
    comments: "Excellent delivery performance with room for improvement in fuel efficiency."
  },
  {
    title: "Financial Budget Review",
    description: "Department budget utilization and variance analysis for the current fiscal year.",
    department: "Operations",
    submittedBy: "operations.manager@arenologistics.com",
    submittedAt: Timestamp.now(),
    status: "pending",
    reportType: "Budget Analysis",
    data: {
      totalBudget: 500000,
      spentAmount: 425000,
      remainingBudget: 75000,
      variancePercentage: 15,
      majorExpenses: ["Equipment", "Training", "Technology"]
    },
    comments: "Budget utilization is within acceptable limits with strategic investments in key areas."
  }
];

async function addSampleReports() {
  try {
    console.log('Adding sample reports to Firestore...');
    
    for (const report of sampleReports) {
      const docRef = await addDoc(collection(db, 'reports'), report);
      console.log(`Added report "${report.title}" with ID: ${docRef.id}`);
    }
    
    console.log('✅ All sample reports added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample reports:', error);
  }
}

// Run the script
addSampleReports(); 