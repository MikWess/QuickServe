'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import AuthModal from './AuthModal'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean // Optional prop to control auth requirement
}

export default function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Always render children first - non-blocking approach
  return (
    <>
      {children}
      {/* Only show auth modal if auth is required and user is not authenticated */}
      {requireAuth && !loading && !user && (
        <AuthModal 
          isOpen={true} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  )
} 