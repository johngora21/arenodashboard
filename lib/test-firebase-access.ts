import { getAllEmployees, getAllShipments, getAllCustomers } from './firebase-service'

export async function testFirebaseAccess() {
  try {
    console.log('Testing Firebase access without authentication...')
    
    // Test data access directly
    const employees = await getAllEmployees()
    console.log('✅ Employees data accessed:', employees.length, 'records')
    
    const shipments = await getAllShipments()
    console.log('✅ Shipments data accessed:', shipments.length, 'records')
    
    const customers = await getAllCustomers()
    console.log('✅ Customers data accessed:', customers.length, 'records')
    
    console.log('🎉 All Firebase access tests passed!')
    return true
  } catch (error) {
    console.error('❌ Firebase access test failed:', error)
    return false
  }
}

// Export for use in other files
export default testFirebaseAccess 