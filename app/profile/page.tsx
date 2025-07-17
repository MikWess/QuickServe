'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useProfile } from '@/lib/ProfileContext'
import AuthGuard from '@/components/AuthGuard'
import { User, MapPin, Save, Camera, Edit3 } from 'lucide-react'

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfileContent />
    </AuthGuard>
  )
}

function ProfileContent() {
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
    return <LoadingComponent />
  }

  return <ProfileContentComponent 
    user={user}
    profile={profile}
    isEditing={isEditing}
    saving={saving}
    formData={formData}
    setFormData={setFormData}
    setIsEditing={setIsEditing}
    handleSave={handleSave}
    handleCancel={handleCancel}
  />
}

function LoadingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas-50 to-canvas-100 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    </div>
  )
}

interface ProfileContentComponentProps {
  user: any
  profile: any
  isEditing: boolean
  saving: boolean
  formData: any
  setFormData: (data: any) => void
  setIsEditing: (editing: boolean) => void
  handleSave: () => void
  handleCancel: () => void
}

function ProfileContentComponent({
  user,
  profile,
  isEditing,
  saving,
  formData,
  setFormData,
  setIsEditing,
  handleSave,
  handleCancel
}: ProfileContentComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas-50 to-canvas-100 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profile</h1>
          <p className="text-gray-600">Your service journey</p>
        </div>

        {/* Profile Card */}
        <div className="bg-neutral-50 rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <ProfileHeader 
            profile={profile}
            user={user}
            isEditing={isEditing}
            saving={saving}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />

          {/* Profile Content */}
          <ProfileForm
            profile={profile}
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
    </div>
  )
}

function ProfileHeader({ profile, user, isEditing, saving, setIsEditing, handleSave, handleCancel }: any) {
  return (
    <div className="text-center pt-8 pb-6 px-8">
      {/* Profile Picture */}
      <div className="relative inline-block mb-4">
        <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto">
          {profile?.profileImageUrl ? (
            <img 
              src={profile.profileImageUrl} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-gray-600" />
          )}
        </div>
        <button 
          className="absolute bottom-2 right-2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-800 transition-colors shadow-lg"
          title="Change profile picture"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold text-black mb-1">
        {profile?.displayName || user?.displayName || 'Volunteer'}
      </h2>
      <p className="text-gray-600 mb-4">{user?.email}</p>

      {/* Edit Buttons */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      ) : (
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

function ProfileForm({ profile, isEditing, formData, setFormData }: any) {
  return (
    <div className="px-8 pb-8 space-y-6">
      {/* Display Name */}
      {isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, displayName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Your name"
          />
        </div>
      )}

      {/* Mission Statement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mission Statement
        </label>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, bio: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            placeholder="What drives your service to the community?"
          />
        ) : (
          profile?.bio && (
            <p className="text-gray-900 py-2 bg-gray-50 px-4 rounded-lg italic">
              "{profile.bio}"
            </p>
          )
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Location
        </label>
        {isEditing ? (
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="City, State"
          />
        ) : (
          profile?.location && (
            <p className="text-gray-900 py-2">
              {profile.location}
            </p>
          )
        )}
      </div>

      {/* Account Info */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Account Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Member since</span>
            <span className="text-gray-900">
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
            <div className="flex justify-between">
              <span className="text-gray-500">Last updated</span>
              <span className="text-gray-900">
                {new Date(profile.updatedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 