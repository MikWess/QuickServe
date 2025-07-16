'use client'

import { useState, useEffect } from 'react'
import { User, MapPin, Save, Camera, Edit3 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const AuthGuard = dynamic(() => import('@/components/AuthGuard'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

function ProfileContent() {
  try {
    const { useAuth } = require('@/lib/AuthContext')
    const { useProfile } = require('@/lib/ProfileContext')
    const { user } = useAuth()
    const { profile, loading, updateProfile } = useProfile()
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
      displayName: '',
      bio: '',
      location: '',
    })

    useEffect(() => {
      if (profile) {
        setFormData({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          location: profile.location || '',
        })
      }
    }, [profile])

    const handleSave = async () => {
      try {
        setSaving(true)
        await updateProfile(formData)
        setIsEditing(false)
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile. Please try again.')
      } finally {
        setSaving(false)
      }
    }

    const handleCancel = () => {
      if (profile) {
        setFormData({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          location: profile.location || '',
        })
      }
      setIsEditing(false)
    }

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Your Profile
            </h1>
            <p className="text-xl text-gray-600">Manage your service journey</p>
          </div>

          {/* Single Profile Card - Full Width */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl overflow-hidden border border-white/20">
            {/* Profile Header with Picture */}
            <div className="text-center pt-8 pb-6 px-8">
              {/* Profile Picture */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full flex items-center justify-center mx-auto">
                  {profile?.profileImageUrl ? (
                    <img 
                      src={profile.profileImageUrl} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-blue-600" />
                  )}
                </div>
                <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Display Name */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Anonymous User'}
              </h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>

              {/* Edit Toggle Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Form */}
            <div className="px-8 pb-8">
              {/* Display Name Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your display name"
                  />
                ) : (
                  profile?.displayName && (
                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                      {profile.displayName}
                    </p>
                  )
                )}
              </div>

              {/* Bio Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself and your service interests..."
                  />
                ) : (
                  profile?.bio && (
                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                      {profile.bio}
                    </p>
                  )
                )}
              </div>

              {/* Location Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State"
                  />
                ) : (
                  profile?.location && (
                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                      {profile.location}
                    </p>
                  )
                )}
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Account Info */}
              <div className="pt-6 border-t border-gray-200 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Member since</span>
                    <span className="text-gray-900 font-medium">
                      {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      }) : new Date().toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  {profile?.updatedAt && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Last updated</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in ProfileContent:', error)
    return <ProfileFallback />
  }
}

function ProfileFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Profile
          </h1>
          <p className="text-xl text-gray-600">Manage your service journey</p>
        </div>
        <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl text-center">
          <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Loading</h2>
          <p className="text-gray-600">Please wait while we load your profile information.</p>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
} 