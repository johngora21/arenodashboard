'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllEmployees, getAllShipments, getAllCustomers } from '@/lib/firebase-service'

export default function TestRealDataPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testRealDataAccess = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      console.log('Testing real data access...')
      
      // Test basic data access
      const employees = await getAllEmployees()
      const shipments = await getAllShipments()
      const customers = await getAllCustomers()
      
      const dataSummary = {
        employees: {
          count: employees.length,
          sample: employees.slice(0, 3).map((emp: any) => ({ id: emp.id, name: emp.name, department: emp.department }))
        },
        shipments: {
          count: shipments.length,
          sample: shipments.slice(0, 3).map((ship: any) => ({ id: ship.id, status: ship.status, origin: ship.origin, destination: ship.destination }))
        },
        customers: {
          count: customers.length,
          sample: customers.slice(0, 3).map((cust: any) => ({ id: cust.id, name: cust.name, email: cust.email }))
        }
      }
      
      setResults(dataSummary)
      console.log('Real data access test completed successfully:', dataSummary)
    } catch (error) {
      console.error('Error testing real data access:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Real Data Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={testRealDataAccess} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Real Data Access'}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800">Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800">✅ Real Data Access Successful!</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{results.employees.count}</p>
                      <p className="text-sm text-gray-600">Total employees found</p>
                      {results.employees.sample.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold">Sample:</p>
                          {results.employees.sample.map((emp: any, index: number) => (
                            <p key={index} className="text-xs text-gray-500">
                              {emp.name} ({emp.department})
                            </p>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Shipments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{results.shipments.count}</p>
                      <p className="text-sm text-gray-600">Total shipments found</p>
                      {results.shipments.sample.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold">Sample:</p>
                          {results.shipments.sample.map((ship: any, index: number) => (
                            <p key={index} className="text-xs text-gray-500">
                              {ship.status} - {ship.origin} → {ship.destination}
                            </p>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{results.customers.count}</p>
                      <p className="text-sm text-gray-600">Total customers found</p>
                      {results.customers.sample.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold">Sample:</p>
                          {results.customers.sample.map((cust: any, index: number) => (
                            <p key={index} className="text-xs text-gray-500">
                              {cust.name} ({cust.email})
                            </p>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">Next Steps:</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Your real data is accessible and ready for AI reports</li>
                    <li>• Go to the Reports page to generate AI-powered reports</li>
                    <li>• The system will use this real data for all report generation</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 