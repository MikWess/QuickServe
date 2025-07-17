'use client'

import { useAuth } from '@/lib/AuthContext'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Test Firebase connection
    try {
      const { auth } = require('@/lib/firebase')
      if (!auth) {
        setError('Firebase auth not initialized')
      }
    } catch (err) {
      setError(`Firebase error: ${err}`)
    }
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen p-8 bg-canvas-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">App Status Test</h1>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold mb-2">App State</h2>
            <p><strong>Mounted:</strong> {mounted ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Auth Loading:</strong> {loading ? '⏳ Loading' : '✅ Ready'}</p>
            <p><strong>User:</strong> {user ? `✅ ${user.email}` : '❌ Not authenticated'}</p>
            <p><strong>Error:</strong> {error || '✅ None'}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold mb-2">Environment</h2>
            <p><strong>Node Env:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Window:</strong> {typeof window !== 'undefined' ? '✅ Available' : '❌ Not available'}</p>
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold mb-2">Page Test</h2>
            <div className="space-y-2">
              <a href="/" className="block text-blue-600 hover:underline">→ Home Page</a>
              <a href="/profile" className="block text-blue-600 hover:underline">→ Profile Page</a>
              <a href="/logs" className="block text-blue-600 hover:underline">→ Logs Page</a>
              <a href="/debug" className="block text-blue-600 hover:underline">→ Debug Page</a>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold mb-2">Timestamp</h2>
            <p>{new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 