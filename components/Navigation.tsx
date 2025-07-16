'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Clock, Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useProfile } from '@/lib/ProfileContext'
import AuthModal from './AuthModal'

export default function Navigation() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const { profile } = useProfile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/logs', label: 'Service Logs', icon: Clock },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-semibold text-black">
          QuickServe
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {user && navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                isActive(item.href)
                  ? 'text-black font-medium'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">
                {profile?.displayName || user.displayName || user.email}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Get started
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4 pt-4">
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${
                  isActive(item.href)
                    ? 'text-black font-medium'
                    : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth buttons */}
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {profile?.displayName || user.displayName || user.email}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-sm text-gray-600 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="bg-black text-white px-4 py-2 rounded text-sm font-medium"
              >
                Get started
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  )
} 