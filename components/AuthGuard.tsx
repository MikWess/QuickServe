'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Shield, Smartphone, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import AuthModal from './AuthModal'

interface AuthGuardProps {
  children: React.ReactNode
  fallbackToLanding?: boolean // New prop to control behavior
}

export default function AuthGuard({ children, fallbackToLanding = false }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Always render children during loading to prevent 404s
  if (loading) {
    return <>{children}</>
  }

  // If user is authenticated, show the protected content
  if (user) {
    return <>{children}</>
  }

  // If fallbackToLanding is false, show children with auth modal overlay
  if (!fallbackToLanding) {
    return (
      <>
        {children}
        <AuthModal 
          isOpen={true} 
          onClose={() => {}} 
        />
      </>
    )
  }

  // Only show landing page if explicitly requested
  return (
    <div className="min-h-screen bg-canvas-50">
      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 mb-6">
            Track Your
            <span className="block">Service Hours</span>
          </h1>
          
          <p className="text-xl font-normal text-gray-600 mb-8 max-w-2xl mx-auto">
            Easily log, manage, and track your community service hours with QuickServe. 
            Perfect for students, volunteers, and organizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-gray-700 text-white px-6 py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Create Free Account
            </button>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="border border-canvas-100 bg-neutral-50 hover:bg-canvas-100 text-neutral-900 px-6 py-3 rounded text-sm font-medium transition-colors"
            >
              See features
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-canvas-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose QuickServe?
            </h2>
            <p className="text-lg font-normal text-gray-600">
              Everything you need to track and manage your service hours
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Easy Time Tracking",
                description: "Simple clock in/out functionality with automatic duration calculation."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure & Private",
                description: "Your service hour data is protected with Firebase authentication."
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Mobile Friendly",
                description: "Access and log your hours from any device, anywhere."
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Progress Tracking",
                description: "View statistics and track your service hour goals over time."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-neutral-50 p-6 rounded-lg border border-canvas-100 text-center"
              >
                <div className="text-gray-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm font-normal">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-neutral-50 border border-canvas-100 p-12 rounded-lg">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Ready to Start Tracking?
            </h2>
            <p className="text-lg font-normal text-gray-600 mb-8">
              Join thousands of volunteers already using QuickServe
            </p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-gray-700 text-white px-6 py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-canvas-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xl font-bold text-neutral-900 mb-4">
            QuickServe
          </div>
          <p className="text-gray-600 font-normal">
            Built with ❤️ for the community service heroes
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
} 