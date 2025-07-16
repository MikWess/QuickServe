'use client'

import { useAuth } from '@/lib/AuthContext'
import { useServiceHours } from '@/lib/ServiceHoursContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'

export default function Debug() {
  const { user } = useAuth()
  const { serviceHours } = useServiceHours()
  const [manualQueryResult, setManualQueryResult] = useState<any[]>([])
  const [allDocsResult, setAllDocsResult] = useState<any[]>([])

  const runManualQuery = async () => {
    if (!user) return
    
    try {
      const q = query(
        collection(db, 'serviceHours'),
        where('userId', '==', user.uid)
      )
      
      const querySnapshot = await getDocs(q)
      const docs: any[] = []
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() })
      })
      
      setManualQueryResult(docs)
      console.log('Manual query result:', docs)
    } catch (error) {
      console.error('Manual query error:', error)
    }
  }

  const getAllDocs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'serviceHours'))
      const docs: any[] = []
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() })
      })
      
      setAllDocsResult(docs)
      console.log('All docs result:', docs)
    } catch (error) {
      console.error('Get all docs error:', error)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Debug Service Hours</h1>
          
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <p><strong>User ID:</strong> {user?.uid}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Display Name:</strong> {user?.displayName}</p>
            </div>

            {/* Context Data */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Context Service Hours</h2>
              <p><strong>Count:</strong> {serviceHours.length}</p>
              <div className="mt-4 max-h-60 overflow-y-auto">
                <pre className="text-xs bg-gray-100 p-4 rounded">
                  {JSON.stringify(serviceHours, null, 2)}
                </pre>
              </div>
            </div>

            {/* Manual Query */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Manual Query Test</h2>
              <button 
                onClick={runManualQuery}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
              >
                Run Manual Query (Your Data Only)
              </button>
              <p><strong>Count:</strong> {manualQueryResult.length}</p>
              <div className="mt-4 max-h-60 overflow-y-auto">
                <pre className="text-xs bg-gray-100 p-4 rounded">
                  {JSON.stringify(manualQueryResult, null, 2)}
                </pre>
              </div>
            </div>

            {/* All Docs Query */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">All Documents Test</h2>
              <button 
                onClick={getAllDocs}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4"
              >
                Get All Docs (All Users)
              </button>
              <p><strong>Count:</strong> {allDocsResult.length}</p>
              <div className="mt-4 max-h-60 overflow-y-auto">
                <pre className="text-xs bg-gray-100 p-4 rounded">
                  {JSON.stringify(allDocsResult, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 