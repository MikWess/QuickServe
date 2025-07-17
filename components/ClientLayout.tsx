'use client'

import { useEffect, useState } from 'react'
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
  const [isClient, setIsClient] = useState(false)
  const [showContent, setShowContent] = useState(false)

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle loading states
  useEffect(() => {
    if (!isClient) return

    // Show content immediately if auth is not loading
    if (!authLoading) {
      setShowContent(true)
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        hideLoading()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [authLoading, isClient, hideLoading])

  // Failsafe to prevent infinite loading
  useEffect(() => {
    if (!isClient) return

    const maxTimer = setTimeout(() => {
      setShowContent(true)
      hideLoading()
    }, 3000)

    return () => clearTimeout(maxTimer)
  }, [isClient, hideLoading])

  // Show loading screen until client is ready and auth is resolved
  if (!isClient || (!showContent && isLoading)) {
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