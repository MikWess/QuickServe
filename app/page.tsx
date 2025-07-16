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
      <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-3">
              QuickServe Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Quickly track your community service hours and impact
            </p>
            <div className="mt-3 w-20 h-0.5 bg-gradient-to-r from-gray-300 to-gray-500 mx-auto rounded-full"></div>
          </div>

          {/* Clock In/Out Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl mb-8 shadow-sm hover:shadow-md transition-all">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-black mb-4">
                {clockState.isClocked ? 'Currently Serving' : 'Ready to Serve'}
              </h2>
              {clockState.isClocked ? (
                <div className="mb-6">
                  <p className="font-medium text-black">{clockState.currentSession?.title}</p>
                  <p className="text-gray-600">{clockState.currentSession?.organization}</p>
                  <p className="text-sm text-gray-500 mt-2">
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
                  className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-8 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  Clock In
                </button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Total Hours",
                value: `${stats.totalHours}`,
                subtitle: "All time"
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "This Week", 
                value: `${stats.thisWeekHours}`,
                subtitle: "Hours logged"
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "This Month",
                value: `${stats.thisMonthHours}`,
                subtitle: "Hours completed"
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Sessions",
                value: `${stats.completedSessions}`,
                subtitle: "Completed"
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-3 rounded-xl text-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                <div className="text-gray-600 mb-2 flex justify-center bg-gray-50 w-10 h-10 rounded-lg mx-auto items-center">
                  {stat.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-1">
                  {stat.value}
                </h3>
                <p className="text-xs font-medium text-black mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Sessions */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">
                Recent Sessions
              </h2>
              <button className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent sessions yet</p>
                  <p className="text-sm text-gray-400">Start your first service session above!</p>
                </div>
              ) : (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-100 p-4 rounded-lg hover:bg-gray-50 hover:border-gray-200 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-black">{session.title}</h3>
                        <p className="text-sm text-gray-600">{session.organization}</p>
                        <p className="text-xs text-gray-500">
                          {session.startTime.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">
                          {formatDuration(session.duration)}
                        </p>
                        <p className="text-xs text-gray-500">{session.category}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Clock In Modal */}
        {showClockInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-black mb-4">
                Clock In to Service
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={clockInForm.title}
                    onChange={(e) => setClockInForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    placeholder="e.g., Food Bank Volunteer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={clockInForm.organization}
                    onChange={(e) => setClockInForm(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    placeholder="e.g., Community Food Bank"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category
                  </label>
                  <select
                    value={clockInForm.category}
                    onChange={(e) => setClockInForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
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
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClockIn}
                  disabled={!clockInForm.title || !clockInForm.organization}
                  className="flex-1 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium transform hover:scale-105 disabled:transform-none"
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