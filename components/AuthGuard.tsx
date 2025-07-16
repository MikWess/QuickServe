'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Shield, Smartphone, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import AuthModal from './AuthModal'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Track Your
              <span className="block">Service Hours</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Easily log, manage, and track your community service hours with Wess-Serves. 
              Perfect for students, volunteers, and organizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-black text-white px-6 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Get started
              </button>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="border border-gray-300 bg-white hover:bg-gray-50 text-black px-6 py-3 rounded text-sm transition-colors"
              >
                See features
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-black mb-4">
                Why Choose Wess-Serves?
              </h2>
              <p className="text-lg text-gray-600">
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
                  className="bg-white p-6 rounded-lg border border-gray-200 text-center"
                >
                  <div className="text-gray-400 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
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
            <div className="bg-white border border-gray-200 p-12 rounded-lg">
              <h2 className="text-3xl font-bold text-black mb-4">
                Ready to Start Tracking?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of volunteers already using Wess-Serves
              </p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-black text-white px-6 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xl font-semibold text-black mb-4">
              Wess-Serves
            </div>
            <p className="text-gray-600">
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

  return <>{children}</>
} 