'use client'

import { Clock, Calendar, MapPin, User, Search, Eye, Plus, Edit, Trash2, Star } from 'lucide-react'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const AuthGuard = dynamic(() => import('@/components/AuthGuard'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

function ServiceLogsContent() {
  try {
    const { useServiceHours } = require('@/lib/ServiceHoursContext')
    const { serviceHours = [], addServiceHour, updateServiceHour, deleteServiceHour } = useServiceHours()
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [sortBy, setSortBy] = useState('date')
    const [showManualEntryModal, setShowManualEntryModal] = useState(false)
    
    const [manualEntryForm, setManualEntryForm] = useState({
      title: '',
      organization: '',
      description: '',
      date: '',
      startTime: '09:00',
      duration: 60,
      category: 'Community Service',
      notes: '',
      supervisor: '',
      location: ''
    })

    const categories = ['All', 'Community Service', 'Education', 'Environment', 'Senior Care', 'Healthcare', 'Animal Care', 'Other']

    const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      if (hours === 0) return `${mins}m`
      if (mins === 0) return `${hours}h`
      return `${hours}h ${mins}m`
    }

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    const filteredAndSortedHours = serviceHours
      .filter((hour: any) => {
        const matchesSearch = hour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hour.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hour.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || hour.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a: any, b: any) => {
        switch (sortBy) {
          case 'date':
            return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          case 'duration':
            return b.duration - a.duration
          case 'title':
            return a.title?.localeCompare(b.title) || 0
          case 'organization':
            return a.organization?.localeCompare(b.organization) || 0
          default:
            return 0
        }
      })

    const totalFilteredHours = filteredAndSortedHours.reduce((sum: number, hour: any) => sum + (hour.duration || 0), 0)

    const handleManualEntrySubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      try {
        const startDateTime = new Date(`${manualEntryForm.date}T${manualEntryForm.startTime}`)
        const endDateTime = new Date(startDateTime.getTime() + manualEntryForm.duration * 60 * 1000)
        
        const newServiceHour = {
          title: manualEntryForm.title,
          organization: manualEntryForm.organization,
          description: manualEntryForm.description,
          startTime: startDateTime,
          endTime: endDateTime,
          duration: manualEntryForm.duration,
          category: manualEntryForm.category,
          isCompleted: true,
          notes: manualEntryForm.notes || undefined,
          supervisor: manualEntryForm.supervisor || undefined,
          location: manualEntryForm.location || undefined
        }
        
        await addServiceHour(newServiceHour)
        setShowManualEntryModal(false)
        setManualEntryForm({
          title: '',
          organization: '',
          description: '',
          date: '',
          startTime: '09:00',
          duration: 60,
          category: 'Community Service',
          notes: '',
          supervisor: '',
          location: ''
        })
      } catch (error) {
        console.error('Error adding manual service hour:', error)
        alert('Error adding service hour. Please try again.')
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Service Hours Log
            </h1>
            <p className="text-xl text-gray-600">Track and manage all your community service activities</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <Clock className="h-10 w-10 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(totalFilteredHours / 60)}h {totalFilteredHours % 60}m</p>
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <Calendar className="h-10 w-10 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredAndSortedHours.length}</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <Star className="h-10 w-10 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{new Set(serviceHours.map((h: any) => h.category)).size}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title, organization, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="title">Sort by Title</option>
                  <option value="organization">Sort by Organization</option>
                </select>
                
                <button
                  onClick={() => setShowManualEntryModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Entry
                </button>
              </div>
            </div>
          </div>

          {/* Service Hours List */}
          <div className="space-y-4">
            {filteredAndSortedHours.length === 0 ? (
              <div className="backdrop-blur-md bg-white/70 rounded-2xl p-12 border border-white/20 shadow-xl text-center">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Service Hours Found</h3>
                <p className="text-gray-600 mb-6">Start by adding your first service hour entry</p>
                <button
                  onClick={() => setShowManualEntryModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add Your First Entry
                </button>
              </div>
            ) : (
              filteredAndSortedHours.map((hour: any, index: number) => (
                <div key={hour.id || index} className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{hour.title}</h3>
                        <div className="flex gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {hour.category}
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {formatDuration(hour.duration || 0)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="font-medium">{hour.organization}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(new Date(hour.startTime))}</span>
                      </div>
                      
                      {hour.description && (
                        <p className="text-gray-700 mt-3">{hour.description}</p>
                      )}
                      
                      {hour.notes && (
                        <p className="text-gray-600 text-sm mt-2 italic">Notes: {hour.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Manual Entry Modal */}
          {showManualEntryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="backdrop-blur-md bg-white/90 rounded-2xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Service Hours Entry</h2>
                
                <form onSubmit={handleManualEntrySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={manualEntryForm.title}
                        onChange={(e) => setManualEntryForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Food Bank Volunteer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
                      <input
                        type="text"
                        required
                        value={manualEntryForm.organization}
                        onChange={(e) => setManualEntryForm(prev => ({ ...prev, organization: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Local Food Bank"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={manualEntryForm.description}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe what you did..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        required
                        value={manualEntryForm.date}
                        onChange={(e) => setManualEntryForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                      <input
                        type="time"
                        required
                        value={manualEntryForm.startTime}
                        onChange={(e) => setManualEntryForm(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={manualEntryForm.duration}
                        onChange={(e) => setManualEntryForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={manualEntryForm.category}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowManualEntryModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Add Entry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in ServiceLogsContent:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl text-center max-w-md">
          <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Hours</h1>
          <p className="text-gray-600">Please wait while we load your service hours...</p>
        </div>
      </div>
    )
  }
}

export default function ServiceLogs() {
  return (
    <AuthGuard>
      <ServiceLogsContent />
    </AuthGuard>
  )
} 