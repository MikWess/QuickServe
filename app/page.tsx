'use client'

import { motion } from 'framer-motion'
import { Clock, TrendingUp, Calendar, Award, Play, Square } from 'lucide-react'
import { useServiceHours } from '@/lib/ServiceHoursContext'
import { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'

export default function Dashboard() {
  const { stats, clockState, serviceHours, clockIn, clockOut } = useServiceHours()
  const [showClockInModal, setShowClockInModal] = useState(false)
  const [clockInForm, setClockInForm] = useState({
    title: '',
    organization: '',
    category: 'Community Service'
  })

  const recentSessions = serviceHours.slice(0, 3)

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
    <AuthGuard>
      <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-canvas-50 to-canvas-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              QuickServe Dashboard
            </h1>
            <p className="text-lg font-normal text-gray-600">
              Quickly track your community service hours and impact
            </p>
            <div className="mt-3 w-20 h-0.5 bg-gradient-to-r from-gray-300 to-gray-500 mx-auto rounded-full"></div>
          </div>

          {/* Clock In/Out Section */}
          <div className="bg-neutral-50 border border-canvas-100 p-6 rounded-xl mb-8 shadow-sm hover:shadow-md transition-all">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                {clockState.isClocked ? 'Currently Serving' : 'Ready to Serve'}
              </h2>
              {clockState.isClocked ? (
                <div className="mb-6">
                  <p className="font-semibold text-black">{clockState.currentSession?.title}</p>
                  <p className="font-medium text-gray-600">{clockState.currentSession?.organization}</p>
                  <p className="text-sm font-normal text-gray-500 mt-2">
                    Started at {clockState.clockInTime?.toLocaleTimeString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mb-6">Start tracking your service hours</p>
              )}
              
              {clockState.isClocked ? (
                <button
                  onClick={handleClockOut}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  Clock Out
                </button>
              ) : (
                <button
                  onClick={() => setShowClockInModal(true)}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  Clock In
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-neutral-50 border border-canvas-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-neutral-900 mb-1">{stats.totalHours}</div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
            </div>
            <div className="bg-neutral-50 border border-canvas-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-neutral-900 mb-1">{stats.completedSessions}</div>
              <p className="text-sm font-medium text-gray-600">Sessions</p>
            </div>
            <div className="bg-neutral-50 border border-canvas-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-neutral-900 mb-1">{stats.thisWeekHours}</div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
            </div>
            <div className="bg-neutral-50 border border-canvas-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-neutral-900 mb-1">{stats.thisMonthHours}</div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-neutral-50 border border-canvas-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Recent Sessions</h2>
              <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8 font-normal">No service hours logged yet. Start by clocking in!</p>
              ) : (
                recentSessions.map((session, index) => (
                  <div
                    key={index}
                    className="border border-canvas-100 bg-white rounded-lg p-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-neutral-900">{session.title}</h3>
                      <span className="text-sm font-bold text-neutral-900">
                        {formatDuration(session.duration)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{session.organization}</p>
                    <p className="text-xs font-normal text-gray-500">
                      {session.startTime.toLocaleDateString()} • {session.category}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Clock In Modal */}
        {showClockInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-50 rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Clock In to Service
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={clockInForm.title}
                    onChange={(e) => setClockInForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-canvas-100 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all font-normal"
                    placeholder="e.g., Food Bank Volunteer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={clockInForm.organization}
                    onChange={(e) => setClockInForm(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-3 py-2 border border-canvas-100 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all font-normal"
                    placeholder="e.g., Local Food Bank"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Category
                  </label>
                  <select
                    value={clockInForm.category}
                    onChange={(e) => setClockInForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-canvas-100 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all font-normal"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowClockInModal(false)}
                  className="flex-1 border border-canvas-100 bg-white hover:bg-canvas-100 text-neutral-900 px-4 py-2 rounded-lg transition-all text-sm font-medium"
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
    </AuthGuard>
  )
} 