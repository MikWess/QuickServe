'use client'

import { motion } from 'framer-motion'
import { Clock, TrendingUp, Calendar, Award, Play, Square } from 'lucide-react'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const AuthGuard = dynamic(() => import('@/components/AuthGuard'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

function DashboardContent() {
  try {
    const { useServiceHours } = require('@/lib/ServiceHoursContext')
    const { stats, clockState, serviceHours, clockIn, clockOut } = useServiceHours()
    const [showClockInModal, setShowClockInModal] = useState(false)
    const [clockInForm, setClockInForm] = useState({
      title: '',
      organization: '',
      category: 'Community Service'
    })

    const recentSessions = serviceHours?.slice(0, 3) || []

    const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      if (hours === 0) return `${mins}m`
      if (mins === 0) return `${hours}h`
      return `${hours}h ${mins}m`
    }

    const handleClockIn = () => {
      clockIn(clockInForm.title, clockInForm.organization, clockInForm.category)
      setShowClockInModal(false)
      setClockInForm({ title: '', organization: '', category: 'Community Service' })
    }

    const handleClockOut = async () => {
      try {
        await clockOut('Session completed successfully')
      } catch (error) {
        console.error('Error clocking out:', error)
      }
    }

    const categories = [
      'Community Service',
      'Education',
      'Environment',
      'Senior Care',
      'Healthcare',
      'Animal Care',
      'Other'
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{ 
              rotate: -360,
              scale: [1.1, 1, 1.1],
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Welcome to QuickServe
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your community service hours with ease and make a difference in your community.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <Clock className="h-12 w-12 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalHours || 0}</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <TrendingUp className="h-12 w-12 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.thisMonth || 0}</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <Calendar className="h-12 w-12 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalSessions || 0}</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <Award className="h-12 w-12 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Organizations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.uniqueOrganizations || 0}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Clock In/Out Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Clock Status Card */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Clock Status</h2>
              
              {clockState?.isClocked ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <Square className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Currently Clocked In</h3>
                  <p className="text-gray-600 mb-4">{clockState.currentSession?.title}</p>
                  <p className="text-sm text-gray-500 mb-6">{clockState.currentSession?.organization}</p>
                  <button
                    onClick={handleClockOut}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                  >
                    Clock Out
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Play className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Serve</h3>
                  <p className="text-gray-600 mb-6">Click below to start tracking your service hours</p>
                  <button
                    onClick={() => setShowClockInModal(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                  >
                    Clock In
                  </button>
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session: any, index: number) => (
                    <div key={session.id || index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.organization}</p>
                      <p className="text-sm text-blue-600">{formatDuration(session.duration)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sessions yet. Start tracking your service hours!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Clock In Modal */}
        {showClockInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="backdrop-blur-md bg-white/90 rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Clock In</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                  <input
                    type="text"
                    value={clockInForm.title}
                    onChange={(e) => setClockInForm({...clockInForm, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Food Bank Volunteer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                  <input
                    type="text"
                    value={clockInForm.organization}
                    onChange={(e) => setClockInForm({...clockInForm, organization: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Local Food Bank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={clockInForm.category}
                    onChange={(e) => setClockInForm({...clockInForm, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowClockInModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClockIn}
                  disabled={!clockInForm.title || !clockInForm.organization}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold transform hover:scale-105 disabled:transform-none"
                >
                  Clock In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error in DashboardContent:', error)
    return <SimpleFallback />
  }
}

function SimpleFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Welcome to QuickServe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your community service hours with ease and make a difference in your community.
          </p>
        </div>
        <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <p className="text-gray-600">Please sign in to start tracking your service hours.</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
} 