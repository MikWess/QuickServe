'use client'

import { Clock, Calendar, MapPin, User, Search, Eye, Plus, Edit, Trash2, Star } from 'lucide-react'
import { useServiceHours } from '@/lib/ServiceHoursContext'
import { useState } from 'react'
import { ServiceHour } from '@/lib/types'
import AuthGuard from '@/components/AuthGuard'

export default function ServiceLogs() {
  const { serviceHours, addServiceHour, updateServiceHour, deleteServiceHour } = useServiceHours()
  const [selectedEntry, setSelectedEntry] = useState<ServiceHour | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('date')
  const [showManualEntryModal, setShowManualEntryModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ServiceHour | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<ServiceHour | null>(null)
  
  const [manualEntryForm, setManualEntryForm] = useState({
    title: '',
    organization: '',
    description: '',
    date: '',
    startTime: '09:00',
    duration: 60, // duration in minutes
    category: 'Community Service',
    notes: '',
    supervisor: '',
    location: ''
  })
  
  const [editForm, setEditForm] = useState({
    title: '',
    organization: '',
    description: '',
    date: '',
    startTime: '09:00',
    duration: 60, // duration in minutes
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
    .filter(hour => {
      const matchesSearch = hour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hour.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hour.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || hour.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        case 'duration':
          return b.duration - a.duration
        case 'title':
          return a.title.localeCompare(b.title)
        case 'organization':
          return a.organization.localeCompare(b.organization)
        default:
          return 0
      }
    })

  const totalFilteredHours = filteredAndSortedHours.reduce((sum, hour) => sum + hour.duration, 0)

  const getCategoryColor = (category: string) => {
    return 'bg-gray-100 text-gray-800 border border-gray-200'
  }

  const resetManualEntryForm = () => {
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
  }

  const resetEditForm = () => {
    setEditForm({
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
  }

  const handleManualEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Combine date and time for start time
      const startDateTime = new Date(`${manualEntryForm.date}T${manualEntryForm.startTime}`)
      // Calculate end time by adding duration in minutes
      const endDateTime = new Date(startDateTime.getTime() + manualEntryForm.duration * 60 * 1000)
      
      const newServiceHour: Omit<ServiceHour, 'id'> = {
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
      resetManualEntryForm()
    } catch (error) {
      console.error('Error adding manual service hour:', error)
      alert('Error adding service hour. Please try again.')
    }
  }

  const handleEditClick = (entry: ServiceHour) => {
    setEditingEntry(entry)
    // Populate form with existing data
    const startDate = entry.startTime ? new Date(entry.startTime) : new Date()
    
    setEditForm({
      title: entry.title,
      organization: entry.organization,
      description: entry.description,
      date: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      duration: entry.duration,
      category: entry.category,
      notes: entry.notes || '',
      supervisor: entry.supervisor || '',
      location: entry.location || ''
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingEntry) return
    
    try {
      // Combine date and time for start time
      const startDateTime = new Date(`${editForm.date}T${editForm.startTime}`)
      // Calculate end time by adding duration in minutes
      const endDateTime = new Date(startDateTime.getTime() + editForm.duration * 60 * 1000)
      
      const updates: Partial<ServiceHour> = {
        title: editForm.title,
        organization: editForm.organization,
        description: editForm.description,
        startTime: startDateTime,
        endTime: endDateTime,
        duration: editForm.duration,
        category: editForm.category,
        notes: editForm.notes || undefined,
        supervisor: editForm.supervisor || undefined,
        location: editForm.location || undefined
      }
      
      await updateServiceHour(editingEntry.id, updates)
      setShowEditModal(false)
      setEditingEntry(null)
      resetEditForm()
    } catch (error) {
      console.error('Error updating service hour:', error)
      alert('Error updating service hour. Please try again.')
    }
  }

  const handleDeleteClick = (entry: ServiceHour) => {
    setDeletingEntry(entry)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingEntry) return
    
    try {
      await deleteServiceHour(deletingEntry.id)
      setShowDeleteModal(false)
      setDeletingEntry(null)
    } catch (error) {
      console.error('Error deleting service hour:', error)
      alert('Error deleting service hour. Please try again.')
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-canvas-50 to-canvas-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Service Logs
            </h1>
            <p className="text-lg font-normal text-gray-600">
              Track your community impact with <span className="font-semibold">QuickServe</span>
            </p>
            <div className="mt-3 w-20 h-0.5 bg-gradient-to-r from-gray-300 to-gray-500 mx-auto rounded-full"></div>
          </div>

          {/* Summary Stats with enhanced design */}
          <div className="bg-neutral-50 border border-canvas-100 p-6 rounded-xl mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-gray-600 mr-2" />
                  <p className="text-2xl font-bold text-neutral-900">
                    {filteredAndSortedHours.length}
                  </p>
                </div>
                <p className="text-gray-600 font-semibold text-sm">Total Sessions</p>
              </div>
              <div className="text-center p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-gray-600 mr-2" />
                  <p className="text-2xl font-bold text-neutral-900">
                    {Math.round(totalFilteredHours / 60 * 10) / 10}h
                  </p>
                </div>
                <p className="text-gray-600 font-semibold text-sm">Total Hours</p>
              </div>
              <div className="text-center p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-gray-600 mr-2" />
                  <p className="text-2xl font-bold text-neutral-900">
                    {Math.round(totalFilteredHours / filteredAndSortedHours.length || 0)}m
                  </p>
                </div>
                <p className="text-gray-600 font-semibold text-sm">Avg Session</p>
              </div>
            </div>
          </div>

          {/* Search & Controls - Split into two cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Search & Filter Card */}
            <div className="bg-white border border-canvas-100 rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-black">Search & Filter</h2>
                    <p className="text-sm font-normal text-gray-600">Find your service entries</p>
                  </div>
                  <div className="hidden md:flex items-center text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Search Controls */}
              <div className="p-6">
                {/* Primary Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by title, organization, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm font-normal"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all appearance-none bg-white text-sm font-normal"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sort By
                    </label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all appearance-none bg-white text-sm font-normal"
                      >
                        <option value="date">Most Recent</option>
                        <option value="duration">Duration</option>
                        <option value="title">Title</option>
                        <option value="organization">Organization</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Clear Button */}
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('All')
                      setSortBy('date')
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear All Filters
                  </button>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || selectedCategory !== 'All' || sortBy !== 'date') && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-gray-600">Active:</span>
                      {searchTerm && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          Search: "{searchTerm}"
                          <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      )}
                      {selectedCategory !== 'All' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                          Category: {selectedCategory}
                          <button onClick={() => setSelectedCategory('All')} className="hover:text-green-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      )}
                      {sortBy !== 'date' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                          Sort: {sortBy === 'duration' ? 'Duration' : sortBy === 'title' ? 'Title' : 'Organization'}
                          <button onClick={() => setSortBy('date')} className="hover:text-purple-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add New Entry Card */}
            <div className="bg-neutral-50 border border-canvas-100 rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-canvas-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Log Your Hours</h2>
                    <p className="text-sm font-normal text-gray-600">Add a new service entry</p>
                  </div>
                  <div className="hidden md:flex items-center text-gray-400">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-6">Log Your Hours</h3>
                  <button
                    onClick={() => setShowManualEntryModal(true)}
                    className="bg-gray-700 text-white px-6 py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add Service Entry
                  </button>
                  <p className="text-xs font-normal text-gray-500 mt-3">
                    Manually add service hours you've completed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Hours List with enhanced cards */}
          <div className="space-y-4">
            {filteredAndSortedHours.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 rounded-xl text-center shadow-sm">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">
                  No service hours found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria, or add your first entry!
                </p>
              </div>
            ) : (
              filteredAndSortedHours.map((hour) => (
                <div
                  key={hour.id}
                  className="bg-white border border-gray-200 p-6 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-black mb-1">
                          {hour.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(hour.category)}`}>
                          {hour.category}
                        </span>
                      </div>
                      
                      <p className="text-base text-gray-700 mb-2">{hour.organization}</p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {hour.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(hour.startTime)}
                        </div>
                        {hour.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {hour.location}
                          </div>
                        )}
                        {hour.supervisor && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {hour.supervisor}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center">
                      <div className="text-right mb-3 lg:mb-4">
                        <p className="text-2xl font-bold text-black">
                          {formatDuration(hour.duration)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">Duration</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(hour)
                          }}
                          title="Edit entry"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(hour)
                          }}
                          title="Delete entry"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-black p-3 rounded-xl hover:bg-gray-100 transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEntry(hour)
                          }}
                          title="View details"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Service Hour Detail Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-black mb-3">
                    {selectedEntry.title}
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(selectedEntry.category)}`}>
                    {selectedEntry.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                {/* Organization & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-black mb-2">Organization</h3>
                    <p className="text-gray-700">{selectedEntry.organization}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-black mb-2">Duration</h3>
                    <p className="text-2xl font-bold text-black">{formatDuration(selectedEntry.duration)}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-black mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEntry.description}</p>
                </div>

                {/* Time Details */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-black mb-3">Time Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Start Time</p>
                      <p className="text-gray-700">{formatDate(selectedEntry.startTime)}</p>
                    </div>
                    {selectedEntry.endTime && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">End Time</p>
                        <p className="text-gray-700">{formatDate(selectedEntry.endTime)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {(selectedEntry.location || selectedEntry.supervisor || selectedEntry.notes) && (
                  <div className="space-y-4">
                    {selectedEntry.location && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-black mb-2">Location</h3>
                        <p className="text-gray-700">{selectedEntry.location}</p>
                      </div>
                    )}
                    {selectedEntry.supervisor && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-black mb-2">Supervisor</h3>
                        <p className="text-gray-700">{selectedEntry.supervisor}</p>
                      </div>
                    )}
                    {selectedEntry.notes && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-black mb-3">Notes</h3>
                        <p className="text-gray-700 leading-relaxed">{selectedEntry.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry Modal */}
        {showManualEntryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-black mb-8">
                Quick Add Service Entry
              </h3>
              
              <form onSubmit={handleManualEntrySubmit} className="space-y-6">
                {/* Title and Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualEntryForm.title}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="What service did you perform?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualEntryForm.organization}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="Which organization?"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={manualEntryForm.description}
                    onChange={(e) => setManualEntryForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Describe what you did..."
                  />
                </div>

                {/* Date, Time, and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={manualEntryForm.date}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={manualEntryForm.startTime}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={manualEntryForm.duration}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="60"
                    />
                  </div>
                </div>

                {/* Category and Supervisor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={manualEntryForm.category}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Supervisor (Optional)
                    </label>
                    <input
                      type="text"
                      value={manualEntryForm.supervisor}
                      onChange={(e) => setManualEntryForm(prev => ({ ...prev, supervisor: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="Supervisor name"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={manualEntryForm.location}
                    onChange={(e) => setManualEntryForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    placeholder="Service location"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={manualEntryForm.notes}
                    onChange={(e) => setManualEntryForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Additional notes about your service..."
                  />
                </div>
                
                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowManualEntryModal(false)
                      resetManualEntryForm()
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors text-sm font-medium"
                  >
                    Add Service Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-black mb-8">
                Edit Service Entry
              </h3>
              
              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Title and Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="What service did you perform?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.organization}
                      onChange={(e) => setEditForm(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="Which organization?"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Describe what you did..."
                  />
                </div>

                {/* Date, Time, and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={editForm.date}
                      onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={editForm.startTime}
                      onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editForm.duration}
                      onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="60"
                    />
                  </div>
                </div>

                {/* Category and Supervisor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Supervisor (Optional)
                    </label>
                    <input
                      type="text"
                      value={editForm.supervisor}
                      onChange={(e) => setEditForm(prev => ({ ...prev, supervisor: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="Supervisor name"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    placeholder="Service location"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Additional notes about your service..."
                  />
                </div>
                
                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingEntry(null)
                      resetEditForm()
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors text-sm font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-black mb-6">
                Delete Service Entry
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Are you sure you want to delete "<strong>{deletingEntry.title}</strong>"? This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingEntry(null)
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all text-sm font-medium shadow-lg"
                >
                  Delete Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
} 