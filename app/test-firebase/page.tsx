'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestFirebasePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<{
    employees: { count: number; error?: string }
    shipments: { count: number; error?: string }
    customers: { count: number; error?: string }
    departments: { count: number; error?: string }
    drivers: { count: number; error?: string }
    agents: { count: number; error?: string }
    inventoryItems: { count: number; error?: string }
    transactions: { count: number; error?: string }
  } | null>(null)

  useEffect(() => {
    testFirebaseConnection()
  }, [])

  const testFirebaseConnection = async () => {
    setIsLoading(true)
    const testResults: any = {}

    const collections = [
      'employees',
      'shipments', 
      'customers',
      'departments',
      'drivers',
      'agents',
      'inventoryItems',
      'transactions'
    ]

    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName))
        testResults[collectionName] = {
          count: querySnapshot.size,
          error: undefined
        }
        console.log(`${collectionName}: ${querySnapshot.size} documents`)
      } catch (error) {
        console.error(`Error accessing ${collectionName}:`, error)
        testResults[collectionName] = {
          count: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    setResults(testResults)
    setIsLoading(false)
  }

  const getTotalDocuments = () => {
    if (!results) return 0
    return Object.values(results).reduce((sum: number, result: any) => sum + result.count, 0)
  }

  const getErrorCount = () => {
    if (!results) return 0
    return Object.values(results).filter((result: any) => result.error).length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Firebase Connection Test</h1>
          <p className="text-muted-foreground">Test Firebase permissions and data access</p>
        </div>
        <Badge variant="outline">Firebase Test</Badge>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Testing Firebase connection...</span>
            </div>
          </CardContent>
        </Card>
      ) : results ? (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Summary</CardTitle>
              <CardDescription>Firebase connection test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{getTotalDocuments()}</div>
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Object.keys(results).length}</div>
                  <div className="text-sm text-muted-foreground">Collections Tested</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{getErrorCount()}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results).map(([collectionName, result]) => (
              <Card key={collectionName}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg capitalize">{collectionName}</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.error ? (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        Error: {result.error}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{result.count}</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Retry Button */}
          <Card>
            <CardContent className="pt-6">
              <button
                onClick={testFirebaseConnection}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry Test
              </button>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
} 