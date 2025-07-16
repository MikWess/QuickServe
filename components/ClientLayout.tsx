'use client'

import { useEffect } from 'react'
import Navigation from '@/components/Navigation'
import LoadingScreen from '@/components/LoadingScreen'
import { useLoading } from '@/lib/LoadingContext'
import { useAuth } from '@/lib/AuthContext'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isLoading, hideLoading } = useLoading()
  const { loading: authLoading } = useAuth()

  useEffect(() => {
    // Hide loading screen once auth is resolved
    if (!authLoading) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        hideLoading()
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [authLoading, hideLoading])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Navigation />
      <main>
        {children}
      </main>
    </>
  )
} 