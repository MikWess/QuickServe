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
      // Very short delay for smooth transition
      const timer = setTimeout(() => {
        hideLoading()
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [authLoading, hideLoading])

  // Force hide loading after 2 seconds maximum to prevent infinite loading
  useEffect(() => {
    const maxTimer = setTimeout(() => {
      console.log('Force hiding loading screen after timeout')
      hideLoading()
    }, 2000)

    return () => clearTimeout(maxTimer)
  }, [hideLoading])

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